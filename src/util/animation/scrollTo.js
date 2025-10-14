import { animate } from "./animate";

export const scrollTo = (tgt, dur = 500, ease = null) => {
	const s = parseInt(window.scrollY);
	var d;
	if (isNaN(tgt)) {
		if (!(tgt instanceof HTMLElement)) {
			tgt = document.querySelector(tgt);
			if (!tgt) {
				return;
			}
		}
		d = tgt.getBoundingClientRect().top;
	} else {
		d = tgt - s;
	}
	animate(
		(p) => {
			window.scrollTo(0, s + d * p);
		},
		dur,
		ease
	);
};
