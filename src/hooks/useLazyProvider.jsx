import React from 'react';
import {useCache} from './useCache.jsx';

export const useLazyProvider=(Context,callback,args)=>{
	const {useMemo,useCallback,lazy}=React;
	
	return useCache(()=>lazy(async()=>{
		const value=await callback(...args);
		return {default:(props)=><Context.Provider value={value}>{props.children}</Context.Provider>};
	}),args);
}