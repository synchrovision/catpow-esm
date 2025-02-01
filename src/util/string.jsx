export const wordsToFlags=(words)=>words && words.split(' ').reduce((p,c)=>{p[c]=true;return p},{});
export const flagsToWords=(flags)=>flags && Object.keys(flags).filter((word)=>flags[word]).join(' ');
export const classNamesToFlags=(classNames)=>classNames && classNames.split(' ').map(kebabToCamel).reduce((p,c)=>{p[c]=true;return p},{});
export const flagsToClassNames=(flags)=>flags && Object.keys(flags).filter((f)=>flags[f]).map(camelToKebab).join(' ');

export const camelToKebab=(str)=>str.replace(/(\w)([A-Z])/g,'$1-$2').toLowerCase();
export const camelToSnake=(str)=>str.replace(/(\w)([A-Z])/g,'$1_$2').toLowerCase();
export const kebabToCamel=(str)=>str.replace(/\-(\w)/g,(m)=>m[1].toUpperCase());
export const snakeToCamel=(str)=>str.replace(/_(\w)/g,(m)=>m[1].toUpperCase());

export const ucFirst=(str)=>str.replace(/^([a-z])/,(m)=>m[1].toUpperCase());
export const ucWords=(str)=>str.replace(/\b([a-z])/g,(m)=>m[1].toUpperCase());

export const getCharCategory=(chr)=>{
	const codePoint=chr.charCodeAt(0);
	if(codePoint >= 0x30 && codePoint <= 0x39) {return "number"; }
	if(codePoint >= 0x41 && codePoint <= 0x5A){return "upper-alphabet"}
	if(codePoint >= 0x61 && codePoint <= 0x7A){return "lower-alphabet"}
	if(codePoint >= 0x3040 && codePoint <= 0x309F){return "hiragana";}
	if(codePoint >= 0x30A0 && codePoint <= 0x30FF){return "katakana";}
	if(codePoint >= 0x4E00 && codePoint <= 0x9FFF){return "kanji";}
	if (
		(codePoint >= 0x20 && codePoint <= 0x2F) || 
		(codePoint >= 0x3A && codePoint <= 0x40) ||
		(codePoint >= 0x5B && codePoint <= 0x60) ||
		(codePoint >= 0x7B && codePoint <= 0x7E)
	){
		return "mark";
	}
	return "etc";
}