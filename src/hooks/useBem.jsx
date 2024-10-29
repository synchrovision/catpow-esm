import React from 'react';


const blockClassMap=new WeakMap();
const elementClassMap=new WeakMap();

const getClosestBlockClass=(el)=>{
	if(blockClassMap.has(el)){return blockClassMap.get(el);}
	return getClosestBlockClass(el.parentElement);
}
const getClosestElementClass=(el)=>{
	if(elementClassMap.has(el)){return elementClassMap.get(el);}
	return getClosestElementClass(el.parentElement);
}

const hasClassNameToModify=(className)=>className.match(/(\b[\-_]|[\-_]\b)/);
const modifyClassName=(el,prefix)=>{
	if(hasClassNameToModify(el.className)){
		for(const className of el.classList){
			const head=className.slice(0,1);
			const tail=className.slice(-1);
			if(tail==='-'){
				const newClassName=prefix+className.slice(0,-1);
				blockClassMap.set(el,newClassName);
				elementClassMap.set(el,newClassName);
				el.classList.replace(className,newClassName);
				return;
			}
			else if(head==='-'){
				const newClassName=getClosestBlockClass(el.parentElement)+className;
				blockClassMap.set(el,newClassName);
				elementClassMap.set(el,newClassName);
				el.classList.replace(className,newClassName);
				return;
			}
			else if(tail==='_'){
				const newClassName=getClosestBlockClass(el.parentElement)+'__'+className.slice(0,-1);
				elementClassMap.set(el,newClassName);
				el.classList.replace(className,newClassName);
				return;
			}
			else if(head==='_'){
				let newClassName=getClosestElementClass(el.parentElement);
				if(newClassName.includes('__')){
					newClassName+='-'+className.slice(1);
				}
				else{
					newClassName+='_'+className;
				}
				elementClassMap.set(el,newClassName);
				el.classList.replace(className,newClassName);
				return;
			}
		}
	}
}
const modifyClassNameRecursive=(el,prefix)=>{
	modifyClassName(el,prefix);
	for(const child of el.children){
		modifyClassNameRecursive(child,prefix);
	}
}

export const useBem=(prefix='')=>{
	const {useLayoutEffect,useRef}=React;
	const ref=useRef({});
	
	useLayoutEffect(()=>{
		if(!(ref.current instanceof Element)){return;}
		const primaryClass=ref.current.classList.item(0);
		blockClassMap.set(ref.current,primaryClass);
		elementClassMap.set(ref.current,primaryClass);
		const contentsMutationObserver=new MutationObserver((mutations)=>{
			for(const mutation of mutations){
				for(const addedNode of mutation.addedNodes){
					if(addedNode instanceof Element){
						modifyClassNameRecursive(addedNode,prefix);
					}
				}
			}
		});
		const classMutationobserver=new MutationObserver((mutations)=>{
			for(const mutation of mutations){
				modifyClassName(mutation.target,prefix);
			}
		});
		contentsMutationObserver.observe(ref.current,{subtree:true,childList:true});
		classMutationobserver.observe(ref.current,{subtree:true,attributes:true,attributeFilter:['class']});
		modifyClassNameRecursive(ref.current,prefix);
	},[ref.current]);
	
	return ref;
}