export const hsbToHex = (hsb) => {
	const { h, s, b } = hsb;
	const hs = h / 60;
	const d = (b * s) / 10000;
	const min = b / 100 - d;
	const f = function (n) {
		var c = min + d * Math.min(1, Math.max(0, Math.abs(((hs + n) % 6) - 3) - 1));
		return Math.round(255 * c)
			.toString(16)
			.padStart(2, "0");
	};
	return "#" + f(0) + f(4) + f(2);
};
