export const colorToHsla = (color) => {
	if (color.slice(0, 3) === "hsl") {
		const matches = color.match(/hsla?\(\s*(\d+),\s*([\d\.]+)%,\s*([\d\.]+)%(,\s*([\d\.]+))?/);
		return { h: Math.round(matches[1]), s: Math.round(matches[2]), l: Math.round(matches[3]), a: parseFloat(matches[5] == null ? 1 : matches[5]) };
	}
	if (color.slice(0, 3) === "rgb") {
		const matches = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(,\s*([\d\.]+))?/);
		const rgba = { r: Math.round(matches[1]), g: Math.round(matches[2]), b: Math.round(matches[3]), a: parseFloat(matches[5] == null ? 1 : matches[5]) };
		return Object.assign({ a: rgba.a }, hexToHsl(rgbToHex(rgba)));
	}
	if (color[0] === "#") {
		let a = 1;
		if (color.length === 4) {
			color = color.replace(/#(\w)(\w)(\w)/, "#$1$1$2$2$3$3");
		}
		if (color.length === 9) {
			a = parseInt(color.slice(7), 16) / 255;
			color = color.slice(0, 7);
		}
		return Object.assign({ a }, hexToHsl(color));
	}
};
