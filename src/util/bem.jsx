export const bem=(className)=>{
	const children={};
	const firstClass=className.split(' ')[0];
	return new Proxy(function(){
		if(arguments.length>0){
			const classes=[];let i;
			for(i=0;i<arguments.length;i++){
				if(!arguments[i]){continue;}
				if(typeof(arguments[i])==='string'){
					classes.push(arguments[i]);
					continue;
				}
				classes.push.apply(
					classes,
					Array.isArray(arguments[i])?arguments[i]:
					Object.keys(arguments[i]).filter((c)=>arguments[i][c])
				);
			}
			if(classes.length>0){return (className+' '+classes.join(' ')).replace(' --',' '+firstClass+'--');}
		}
		return className;
	},{
		get:(target,prop)=>{
			if(undefined===children[prop]){
				children[prop]=bem(firstClass+(prop[0]==='_'?'_':'-')+prop);
			}
			return children[prop];
		}
	});
};