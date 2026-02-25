import { colorRoles } from "./settings";

export const translateColor = (color, tint, alpha) => {
	const availableToneKeys = {};
	for (const key of Object.keys(colorRoles)) {
		availableToneKeys[key] = true;
		if (colorRoles[key].invert) {
			availableToneKeys[key + "x"] = true;
		}
	}
	if (color === "wp") {
		return "var(--wp-admin-theme-color)";
	}
	const matches = color.match(/^([a-z]+)(_|\-\-)?(\-?\d+)?$/);
	if (matches) {
		const key = matches[1];
		const sep = matches[2] || null;
		const staticHue = sep === "--";
		const relativeHue = sep === "_";
		const num = matches[3] || null;
		if (availableToneKeys[key]) {
			const f = (p) => `var(--cp-tones-${key}-${p})`;
			const cf = (p) => `var(--cp-container-tones-${key}-${p})`;
			const rf = (p) => `var(--cp-root-tones-${key}-${p})`;
			const h = num ? (staticHue ? num : num === "0" || num === "6" ? f("h") : `calc(${relativeHue ? cf("h") : rf("h")} + var(--cp-tones-hr) * ${num - 6} + var(--cp-tones-hs))`) : f("h");
			const c = f("c");
			const l = tint ? `calc(1 - ${f("t")} * ${tint} / 100)` : `${f("l")}`;
			const a = alpha ? `calc(${f("a")} * ${alpha})` : f("a");
			return `oklch(${l} ${c} ${h} / ${a})`;
		}
	} else {
		const matches = color.match(/^([a-z]+)\-([a-z]+)$/);
		if (matches) {
			const [key1, key2] = matches.slice(1);
			if (availableToneKeys[key1] && availableToneKeys[key2]) {
				const t1 = (tint || 50) / 100;
				const t2 = 1 - t1;
				const f = (p) => `calc(var(--cp-tones-${key1}-${p}) * ${t1} + var(--cp-tones-${key2}-${p}) * ${t2})`;
				const a = alpha ? `calc(${f("a")} * ${alpha})` : f("a");
				return `oklch(${f("l")} ${f("c")} ${f("h")} / ${a})`;
			}
		}
	}
	return color;
};
