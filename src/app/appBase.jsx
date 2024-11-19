export const appBase=()=>{
	const callbacks={};
	return {
		data:null,
		state:{},
		loadData(loaderOrUrl){
			let dataLoader;
			if(loaderOrUrl instanceof Promise){
				dataLoader=loaderOrUrl;
			}
			else{
				dataLoader=fetch(loaderOrUrl).then(res=>res.json());
			}
			return dataLoader.then(data=>{
				this.data=data;
				this.trigger('load',data);
			}).catch((e)=>{
				this.trigger('error',e);
			});
		},
		updateState(state){
			this.state={...this.state,...state};
			this.trigger('update',state);
		},
		on(event,callback){
			if(callbacks[event]==null){callbacks[event]=new Set;}
			callbacks[event].add(callback);
		},
		off(event,callback){
			if(callbacks[event]==null){return;}
			callbacks[event].delete(callback);
		},
		once(event,callback){
			const cb=(app,args)=>{
				callback(app,args);
				this.off(event,cb);
			}
			this.on(event,cb);
		},
		trigger(event,args){
			if(callbacks[event]==null){return;}
			callbacks[event].forEach((callback)=>callback(this,args));
		}
	};
}