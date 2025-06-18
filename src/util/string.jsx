export const wordsToFlags = (words) =>
	words &&
	words.split(" ").reduce((p, c) => {
		p[c] = true;
		return p;
	}, {});
export const flagsToWords = (flags) =>
	flags &&
	Object.keys(flags)
		.filter((word) => flags[word])
		.join(" ");
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
export const flagsToClassNames = (flags) =>
	flags &&
	Object.keys(flags)
		.filter((f) => flags[f])
		.map(camelToKebab)
		.join(" ");
export const filterFlags = (flags, callback) => {
	Object.keys(flags).forEach((key) => {
		if (!callback(key)) {
			delete flags[key];
		}
	});
	return flags;
};

export const camelToKebab = (str) => str.replace(/(\w)([A-Z])/g, "$1-$2").toLowerCase();
export const camelToSnake = (str) => str.replace(/(\w)([A-Z])/g, "$1_$2").toLowerCase();
export const kebabToCamel = (str) => str.replace(/\-(\w)/g, (m) => m[1].toUpperCase());
export const snakeToCamel = (str) => str.replace(/_(\w)/g, (m) => m[1].toUpperCase());

export const ucFirst = (str) => str.replace(/^([a-z])/, (m) => m[1].toUpperCase());
export const ucWords = (str) => str.replace(/\b([a-z])/g, (m) => m[1].toUpperCase());

export const getCharCategory = (chr) => {
	const codePoint = chr.charCodeAt(0);
	if (codePoint >= 0x30 && codePoint <= 0x39) {
		return "number";
	}
	if (codePoint >= 0x41 && codePoint <= 0x5a) {
		return "upper-alphabet";
	}
	if (codePoint >= 0x61 && codePoint <= 0x7a) {
		return "lower-alphabet";
	}
	if (codePoint >= 0x3040 && codePoint <= 0x309f) {
		return "hiragana";
	}
	if (codePoint >= 0x30a0 && codePoint <= 0x30ff) {
		return "katakana";
	}
	if (codePoint >= 0x4e00 && codePoint <= 0x9fff) {
		return "kanji";
	}
	if ((codePoint >= 0x20 && codePoint <= 0x2f) || (codePoint >= 0x3a && codePoint <= 0x40) || (codePoint >= 0x5b && codePoint <= 0x60) || (codePoint >= 0x7b && codePoint <= 0x7e)) {
		return "mark";
	}
	return "etc";
};
