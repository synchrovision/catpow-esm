export const hexToRgb = (hex) => {
	const [r, g, b] = (hex.match(/^#?(\w)(\w)(\w)$/) || hex.match(/^#?(\w{2})(\w{2})(\w{2})$/)).slice(1).map((c) => parseInt(c, 16));
	return { r, g, b };
};
