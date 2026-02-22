import { hexToRgb } from "./hexToRgb.js";

const linear = (c) => {
	c /= 255;
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

export const hexToOklch = (hex) => {
	let { r, g, b, a = 255 } = hexToRgb(hex);

	r = linear(r);
	g = linear(g);
	b = linear(b);
	a /= 255;

	let l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
	let m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
	let s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

	l_ = Math.cbrt(l_);
	m_ = Math.cbrt(m_);
	s_ = Math.cbrt(s_);

	let l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	let a_ = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	let b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

	let c = Math.sqrt(a_ * a_ + b_ * b_);
	let h = Math.atan2(b_, a_) * (180 / Math.PI);
	if (h < 0) {
		h += 360;
	}

	return { l, c, h, a };
};
