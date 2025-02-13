import React from 'react';

const applyBem=(component,{...ctx})=>{
	const {props:{className,children}}=component;
	if(className){
		component.props.className=className.split(' ').map((className)=>{
			if(className.slice(0,2)==='--'){return ctx.element+className;}
			if(className[0]==='-'){return ctx.block=ctx.element=ctx.block+className;}
			if(className[0]==='_'){return ctx.element=ctx.element+(ctx.element===ctx.block?'__':'-')+className.slice(1);}
			if(className.slice(-1)==='-'){return ctx.block=ctx.element=ctx.prefix+'-'+className.slice(0,-1);}
			if(className.slice(-1)==='_'){return ctx.element=ctx.block+'__'+className.slice(0,-1);}
			return className;
		}).join(' ');
		if(component.props.className===className || children==null){return;}
		if(Array.isArray(children)){
			children.forEach((child)=>{
				applyBem(child,ctx);
			});
		}
		else{
			applyBem(children,ctx);
		}
	}
}

export const Bem=({prefix='cp',block,element,children})=>{
	children.forEach((child)=>applyBem(child,{prefix,block,element}));
	return <>{children}</>
}