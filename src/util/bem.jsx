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

export const bemSelector=(className)=>{
	const cache=new Map();
	return (selector)=>{
		if(cache.has(selector)){return cache.get(selector);}
		let crr=className;
		let [block,element='']=className.split('__');
		let result=selector.replaceAll(/[\.\-_\w#]+/g,(sel)=>{
			sel=sel.replace(/\.((\-|_)[a-z][\w\-]*|[a-z][\w\-]*(\-|_))/,(...matches)=>{
				if(matches[2]==='-'){
					crr=block+matches[1];
					[block,element='']=crr.split('__');
				}
				else if(matches[3]==='-'){
					crr=className+'-'+matches[1].slice(0,-1);
					[block,element='']=crr.split('__');
				}
				else if(matches[2]==='_'){
					if(element){
						element+='-'+matches[1].slice(1);
					}
					else{
						element=matches[1].slice(1);
					}
					crr=block+'__'+element;
				}
				else if(matches[3]==='_'){
					element=matches[1].slice(0,-1);
					crr=block+'__'+element;
				}
				return '.'+crr;
			});
			sel=sel.replace(/\.(\-\-[\w\-]+)/,`.${crr}$1`);
			return sel;
		});
		cache.set(selector,result);
		return result;
	};
}