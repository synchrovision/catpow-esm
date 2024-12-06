import React from 'react';
import {useCache} from './useCache.jsx';

export const useLazyComponent=(Component,asyncCallback,args)=>{
	const {useMemo,useCallback,lazy}=React;
	
	return useCache(()=>lazy(async()=>{
		const staticProps=await asyncCallback(...args);
		return {default:(props)=><Component {...staticProps} {...props}/>};
	}),args);
}