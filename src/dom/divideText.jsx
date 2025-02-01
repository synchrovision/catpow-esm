import {el,getCharCategory} from 'catpow/util';

export const divideText=function(target,param={}){
	const primaryClass=target.className.split(' ')[0];
	const text=target.textContent;

	const lines=text.split("\n").map((line,lineIndex)=>el(
		'span',{class:primaryClass+'__line',style:'--line-index:'+lineIndex},
		line.split(' ').map((word,wordIndex)=>el(
			'span',{class:primaryClass+'__word',style:'--word-index:'+wordIndex},
			word.split('').map((letter,letterIndex)=>el(
				'span',{class:primaryClass+'__letter is-'+getCharCategory(letter),style:'--letter-index:'+letterIndex},
				letter
			))
		))
	));
	target.innerHTML='';
	for(const line of lines){target.appendChild(line);}
}