import { bez, easeInOutQuad } from "catpow/util";

export const animate = (cb, dur = 500, ease = null) => {
	var s = parseInt(performance.now()),
		c = 1 / dur,
		p = 0;
	if (ease === null) {
		ease = easeInOutQuad;
	}
	if (Array.isArray(ease)) {
		const ns = ease;
		ns.unshift(0);
		ns.push(1);
		ease = (p) => bez(ns, p);
	}
	const tick = (t) => {
		p = (t - s) * c;
		if (p > 1) {
			return cb(1);
		}
		window.requestAnimationFrame(tick);
		return cb(ease(p));
	};
	window.requestAnimationFrame(tick);
};
