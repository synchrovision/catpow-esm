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
				dateLoader=fetch(loaderOrUrl).then(res=>res.json());
			}
			dateLoader.then(data=>{
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
		trigger(event,args){
			if(callbacks[event]==null){return;}
			callbacks[event].forEach((callback)=>callback(this,args));
		}
	};
}