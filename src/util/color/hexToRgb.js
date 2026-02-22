export const hexToRgb = (hex) => {
	const [r, g, b, a = 255] = (hex.match(/^#?(\w)(\w)(\w)(\w)?$/) || hex.match(/^#?(\w{2})(\w{2})(\w{2})(\w{2})?$/)).slice(1).map((c) => {
		const val = parseInt(c, 16);
		return isNaN(val) ? 255 : val;
	});
	return { r, g, b, a };
};
