export const phasedRange = function* (steps) {
	let i = 0;
	for (let t in steps) {
		let step = parseFloat(steps[t]);
		let end = parseFloat(t);
		if (step > 0) {
			for (; i < end; i += step) {
				yield i;
			}
		}
		i = end;
	}
	yield i;
};
