import React from 'react';


const blockClassMap=new WeakMap();
const elementClassMap=new WeakMap();
const keyClassMap=new WeakMap();

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
		let className,newClassName;
		for(className of el.classList){
			const head=className.slice(0,1);
			const tail=className.slice(-1);
			if(tail==='-'){
				newClassName=prefix+className.slice(0,-1);
				blockClassMap.set(el,newClassName);
				break;
			}
			else if(head==='-'){
				newClassName=getClosestBlockClass(el.parentElement)+className;
				blockClassMap.set(el,newClassName);
				break;
			}
			else if(tail==='_'){
				newClassName=getClosestBlockClass(el.parentElement)+'__'+className.slice(0,-1);
				blockClassMap.delete(el);
				break;
			}
			else if(head==='_'){
				newClassName=getClosestElementClass(el.parentElement);
				blockClassMap.delete(el);
				if(newClassName.includes('__')){
					newClassName+='-'+className.slice(1);
				}
				else{
					newClassName+='_'+className;
				}
				break;
			}
		}
		if(newClassName){
			elementClassMap.set(el,newClassName);
			if(keyClassMap.has(el) && keyClassMap.get(el)!==className){
				if(blockClassMap.has(el)){
					revertBlockClassNameRecursive(el);
				}
				else{
					revertElementClassNameRecursive(el);
				}
			}
			keyClassMap.set(el,className);
			el.classList.replace(className,newClassName);
		}
	}
}
const revertBlockClassNameRecursive=(el)=>{
	for(const child of el.children){
		if(!elementClassMap.has(child) || blockClassMap.has(child) && keyClassMap.get(child).slice(-1)==='-'){continue;}
		child.classList.replace(elementClassMap.get(child),keyClassMap.get(child));
		revertBlockClassNameRecursive(child);
	}
}
const revertElementClassNameRecursive=(el)=>{
	for(const child of el.children){
		if(!elementClassMap.has(child) || blockClassMap.has(child) || keyClassMap.get(child).slice(-1)==='_'){continue;}
		child.classList.replace(elementClassMap.get(child),keyClassMap.get(child));
		revertElementClassNameRecursive(child);
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