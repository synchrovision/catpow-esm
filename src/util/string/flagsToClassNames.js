import { camelToKebab } from "./case.js";
export const flagsToClassNames = (flags) =>
	flags &&
	Object.keys(flags)
		.filter((f) => flags[f])
		.map(camelToKebab)
		.join(" ");
