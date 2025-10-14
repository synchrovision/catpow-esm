export const hexToHsl = (hex) => {
	var h = 0,
		s = 0;
	var rgb = hex
		.match(/#?(\w{2})(\w{2})(\w{2})/)
		.slice(1)
		.map(function (c) {
			return parseInt(c, 16) / 0xff;
		});
	var max = Math.max.apply(null, rgb);
	var min = Math.min.apply(null, rgb);
	var d = max - min;
	var l = (max + min) / 2;
	var [r, g, b] = rgb;

	if (d != 0) {
		if (r === max) {
			h = 60 * ((g - b) / d);
			h = h < 0 ? h + 360 : h;
		}
		if (g === max) {
			h = 60 * ((b - r) / d + 2);
		}
		if (b === max) {
			h = 60 * ((r - g) / d + 4);
		}
	}
	if (l > 0 && l < 1) {
		s = d / (1 - Math.abs(l * 2 - 1));
	}
	return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};
