import { kebabToCamel } from "./case.js";

export const classNamesToFlags = (classNames) =>
	(classNames &&
		classNames
			.split(" ")
			.map(kebabToCamel)
			.reduce((p, c) => {
				p[c] = true;
				return p;
			}, {})) ||
	{};
