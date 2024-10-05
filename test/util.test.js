import {describe, expect, test} from '@jest/globals';
import {bem} from 'catpow/util';

describe('test util',()=>{
	test('bem',()=>{
		const classes=bem('cp-test');
		expect(classes()).toBe('cp-test');
		expect(classes('is-active')).toBe('cp-test is-active');
		expect(classes({'is-active':true})).toBe('cp-test is-active');
		expect(classes({'is-active':false})).toBe('cp-test');
		expect(classes(['is-active','is-visible'])).toBe('cp-test is-active is-visible');
	});
});