import { easeInOutQuad } from "./ease";

export const preserveAnimationValues = (cb, step = 1000, ease = null) => {
	if (ease === null) {
		ease = easeInOutQuad;
	}
	return [...Array(step).keys()].map((n) => cb(ease(n / (step - 1))));
};
