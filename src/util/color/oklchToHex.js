const { rgbToHex } = "./rgbToHex";

const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

export const oklchToHex = ({ l, c, h, a = 1 }) => {
	hRad = (h * Math.PI) / 180;

	let a_ = c * Math.cos(hRad);
	let b_ = c * Math.sin(hRad);

	let l_ = (l + 0.3963377774 * a_ + 0.2158037573 * b_) ** 3;
	let m_ = (l - 0.1055613458 * a_ - 0.0638541728 * b_) ** 3;
	let s_ = (l - 0.0894841775 * a_ - 1.291485548 * b_) ** 3;

	let r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
	let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
	let b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

	r = toSrgb(r);
	g = toSrgb(g);
	b = toSrgb(b);

	r = Math.min(Math.max(r, 0), 1);
	g = Math.min(Math.max(g, 0), 1);
	b = Math.min(Math.max(b, 0), 1);

	return rgbToHex({ r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a: Math.round(a * 255) });
};
