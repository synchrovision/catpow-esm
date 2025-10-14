export const hexToHsb = (hex) => {
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
	var b = max;
	var d = max - min;
	if (d !== 0) {
		var dr, dg, db;
		s = d / b;
		dr = ((b - rgb[0]) / 6 + d / 2) / d;
		dg = ((b - rgb[1]) / 6 + d / 2) / d;
		db = ((b - rgb[2]) / 6 + d / 2) / d;

		if (rgb[0] == max) {
			h = db - dg;
		} else {
			if (rgb[1] == max) {
				h = 1 / 3 + dr - db;
			} else {
				if (rgb[2] == max) {
					h = 2 / 3 + dg - dr;
				}
			}
		}
		if (h < 0) {
			h++;
		}
		if (h > 1) {
			h--;
		}
	}
	return { h: Math.round(h * 360), s: Math.round(s * 100), b: Math.round(b * 100) };
};
