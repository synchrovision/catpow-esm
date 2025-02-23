import {describe, expect, test} from '@jest/globals';
import {
	bem,bemSelector,//bem
	dataSizeStringToInt,intToDataSizeString,pfloor,pround,pceil,//calc
	bsearch,range,//aray
	hexToRgb,rgbToHex,hexToHsl,hslToHex,hexToHsb,hsbToHex,colorToHsla,//color
} from 'catpow/util';

describe('test util',()=>{
	test('bem',()=>{
		const classes=bem('cp-test');
		expect(classes()).toBe('cp-test');
		expect(classes('is-active')).toBe('cp-test is-active');
		expect(classes({'is-active':true})).toBe('cp-test is-active');
		expect(classes({'is-active':false})).toBe('cp-test');
		expect(classes(['is-active','is-visible'])).toBe('cp-test is-active is-visible');
		expect(classes.hoge._fuga('--active')).toBe('cp-test-hoge__fuga cp-test-hoge__fuga--active');
	});
	test('bemSelector',()=>{
		const sels=bemSelector('cp-test');
		expect(sels('.-block')).toBe('.cp-test-block');
		expect(sels('._element')).toBe('.cp-test__element');
		expect(sels('.-block > ._element')).toBe('.cp-test-block > .cp-test-block__element');
	});
	test('calc',()=>{
		expect(dataSizeStringToInt('1KB')).toBe(1024);
		expect(dataSizeStringToInt('1MB')).toBe(1024*1024);
		expect(dataSizeStringToInt('1GB')).toBe(1024*1024*1024);
		expect(intToDataSizeString(1024)).toBe('1KB');
		expect(intToDataSizeString(1024*1024)).toBe('1MB');
		expect(intToDataSizeString(1024*1024*1024)).toBe('1GB');
		expect(pfloor(0.123,2)).toBe(0.12);
		expect(pround(0.123,2)).toBe(0.12);
		expect(pceil(0.123,2)).toBe(0.13);
		expect(pfloor(0.456,2)).toBe(0.45);
		expect(pround(0.456,2)).toBe(0.46);
		expect(pceil(0.456,2)).toBe(0.46);
	});
	test('array',()=>{
		expect(bsearch([0,1,2,3,4,5],3)).toBe(3);
		expect(bsearch([0,1,2,3,4,5],3.5)).toBe(3);
		expect(Array.from(range(2,5))).toEqual([2,3,4,5]);
		expect(Array.from(range(1,9,2))).toEqual([1,3,5,7,9]);
	});
	test('color',()=>{
		expect(hexToRgb('#ff0000')).toEqual({r:255,g:0,b:0});
		expect(rgbToHex({r:255,g:0,b:0})).toBe('#ff0000');
		expect(hexToHsl('#FF0000')).toEqual({h:0,s:100,l:50});
		expect(hexToHsl('#FFFFFF')).toEqual({h:0,s:0,l:100});
	});
});