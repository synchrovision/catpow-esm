export const hslToHex = (hsl) => {
	var l = Math.min(100, hsl.l) / 100;
	var a = (Math.min(100, hsl.s) * Math.min(l, 1 - l)) / 100;
	var f = function (n) {
		var k = (n + hsl.h / 30) % 12;
		var c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * c)
			.toString(16)
			.padStart(2, "0");
	};
	return "#" + f(0) + f(8) + f(4);
};
