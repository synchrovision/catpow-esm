import React from 'react';
import {appBase} from 'catpow/app';
import {useLazyProvider} from 'catpow/hooks';
import {deepMap} from 'catpow/util';

export const useAgent=(settings,deps)=>{
	const {useMemo,useState,useCallback,useRef,useEffect}=React;
	
	const agent=useMemo(()=>{
		const sharedPromises=deepMap();
		const chainedPromises=deepMap();
		const agent=Object.assign(appBase(),(typeof settings==='function')?settings(...deps):settings,{
			sharePromise(callback,keys){
				if(!sharedPromises.has(keys)){
					sharedPromises.set(keys,new Promise(callback));
				}
				return sharedPromises.get(keys);
			},
			chainPromise(callback,keys,clearStuck){
				if(!chainedPromises.has(keys)){
					chainedPromises.set(keys,{isPending:false,stuck:[]});
				}
				const data=chainedPromises.get(keys);
				if(clearStuck){data.stuck=[];}
				data.stuck.push(callback);
				if(!data.isPending){
					const step=async(prev)=>{
						if(data.stuck.length===0){return data.isPending=false;}
						data.isPending=true;
						await step(await data.stuck.shift()(prev));
					};
					step(null);
				}
			},
			useStates(states){
				const ref=useRef({});
				for(const name in states){
					ref.current[name]=useState(states[name]);
				}
				this.states=useMemo(()=>new Proxy(ref,{
					get(prop){
						if(ref.current[prop]==null){return null;}
						return ref.current[prop][0];
					},
					set(prop,value){
						if(ref.current[prop]==null){return null;}
						this.trigger(prop+':update',{prev:ref.current[prop][0],current:value});
						ref.current[prop][0]=value;
						ref.current[prop][1](value);
					}
				}),[ref]);
			},
			useProvider(Context,callback,deps){
				const ref=useRef({});
				ref.current=useMemo(()=>callback(this,...deps),deps);
				return useCallback((props)=>{
					return <Context.Provider value={ref.current}>{props.children}</Context.Provider>
				},[Context]);
			},
			useLazyProvider(Context,asynCallback,deps){
				return useLazyProvider(Context,asynCallback,[this,...deps]);
			},
			useLazyComponent(Component,asyncCallback,deps){
				return useLazyComponent(Component,asynCallback,[this,...deps]);
			},
			useEventListeners(handlers){
				useEffect(()=>{
					for(const handle of handlers){
						this.on(handle,handlers[handle]);
					}
					return ()=>{
						for(const handle of handlers){
							this.off(handle,handlers[handle]);
						}
					}
				},[]);
			},
			stateSettings:{}
		});
		if(agent.init){agent.init(agent);}
		if(agent.states){agent.stateSettings=agent.states;}
		return agent;
	},deps);
	
	agent.useStates(agent.stateSettings);
	
	return agent;
}