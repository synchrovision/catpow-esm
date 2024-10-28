import React from 'react';

export const useTransition=(isInitialActive=false)=>{
	const {useState,useEffect,useRef}=React;
	const [isActive,setIsActive]=useState(isInitialActive);
	const [status,setStatus]=useState(isActive?'is-active':'is-inactive');
	const ref=useRef();
	useEffect(()=>{
		if(!ref.current){return;}
		if(isActive){
			if(status==='is-inactive'){
				setStatus('is-enter');
				requestAnimationFrame(()=>{
					setStatus('is-active');
				});
			}
			else{
				setStatus('is-active');
			}
		}
		else{
			if(status==='is-active'){
				setStatus('is-leave');
				setTimeout(()=>{
					Promise.all(ref.current.getAnimations({subTree:true}).map((animation)=>animation.finished)).then(()=>setStatus('is-inactive'));
				},100);
			}
			else{
				setStatus('is-inactive');
			}
		}
	},[ref.current,isActive]);
	useEffect(()=>{
		setIsActive(isInitialActive);
	},[isInitialActive]);
	return [ref,status,setIsActive];
}