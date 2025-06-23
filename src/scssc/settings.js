export const colorRoles = {
	b: {
		name: "background",
		default: { h: 0, s: 0, l: 100, a: 1 },
		extend: true,
		invert: "m",
	},
	s: {
		name: "sheet",
		default: { h: 0, s: 0, l: 95, a: 1 },
		extend: true,
		invert: "a",
	},
	t: {
		name: "text",
		default: { h: 0, s: 0, l: 40, a: 1.0 },
		extend: true,
		invert: "i",
	},
	h: {
		name: "highlight",
		default: { h: 6, s: 100, l: 33, a: 1.0 },
		extend: true,
		invert: "e",
	},
	m: {
		name: "main",
		default: { h: 30, s: 33, l: 20, a: 1.0 },
		extend: true,
		invert: "b",
	},
	a: {
		name: "accent",
		default: { h: 32, s: 100, l: 50, a: 1.0 },
		extend: true,
		invert: "s",
	},
	i: {
		name: "inside",
		default: { h: 0, s: 0, l: 100, a: 1.0 },
		extend: true,
		invert: "t",
	},
	e: {
		name: "emphasis",
		default: { h: 12, s: 100, l: 50, a: 1.0 },
		extend: true,
		invert: "h",
	},
	lt: {
		name: "light",
		default: { h: 0, s: 0, l: 100, a: 0.6 },
		extend: false,
		invert: null,
	},
	lst: {
		name: "lust",
		default: { h: 0, s: 0, l: 100, a: 0.9 },
		extend: false,
		invert: null,
	},
	sh: {
		name: "shade",
		default: { h: 0, s: 0, l: 0, a: 0.2 },
		extend: false,
		invert: null,
	},
	shd: {
		name: "shadow",
		default: { h: 0, s: 0, l: 0, a: 0.3 },
		extend: false,
		invert: null,
	},
};
