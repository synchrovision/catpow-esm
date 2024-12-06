import React from 'react';
import {useCache} from './useCache.jsx';

export const useLazyComponent=(Component,callback,args)=>{
	const {useMemo,useCallback,lazy}=React;
	
	return useCache(()=>lazy(async()=>{
		const staticProps=await callback(...args);
		return {default:(props)=><Component {...staticProps,...props}/>};
	}),args);
}