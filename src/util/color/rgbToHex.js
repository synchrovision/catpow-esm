export const rgbToHex = (rgb) => {
	const f = (n) => n.toString(16).padStart(2, "0");
	return "#" + f(rgb.r) + f(rgb.g) + f(rgb.b);
};
