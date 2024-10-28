import {useCallback,useMemo,useContext} from 'react';
import {Nav} from 'catpow/component';
import {bem} from 'catpow/util';

export const SubMenuContents=(props)=>{
	const {dispatch}=useContext(Nav.State);
	const {className='cp-nav-submenu-contents',parent}=props;
	const classes=useMemo(()=>bem(className),[className]);
	
	return (
		<div className={classes({'is-active':parent.active})}>
			{props.children}
		</div>
	);
}