export const preserveDistances = (w, c) => {
	const r = [...Array(w).keys()];
	return r.map((y) => r.map((x) => (c ? Math.round(Math.hypot(x, y) * c) : Math.hypot(x, y))));
};
