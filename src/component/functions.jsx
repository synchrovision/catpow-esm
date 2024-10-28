import {render} from 'react-dom';
import {createElement} from 'react';

export const renderComponents=()=>{
	const list=document.querySelectorAll('[data-component]');
	Array.prototype.forEach.call(list,(el)=>{
		render(createElement(window[el.dataset.component]),{...el.dataset});
	});
};
export const nl2br=(text)=>{
	return text.split(/(\n)/).map((line,index)=>line==="\n"?<br/>:line);
};
