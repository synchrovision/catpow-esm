export const honeycomb = (param) => {
	const { r = 124, m = 1 } = param;
	const c = 0.875;
	const u1 = { x: r * c, y: r * 2 };
	const u2 = { x: (r - m) * c, y: (r - m) * 0.5 };
	const p = (x, y) => {
		const ox = u1.x * (x * 2 + (y & 1));
		const oy = u1.y * y;
		return [ox, oy - u2.y * 2, ox + u2.x, oy - u2.y, ox + u2.x, oy + u2.y, ox, oy + u2.y, ox - u2.x, oy + u2.y, ox - u2.x, oy - u2.y];
	};
	const ctx = {
		add(x, y) {},
		fillRect(x, y, w, h) {},
		get d() {},
	};
	return ctx;
};
