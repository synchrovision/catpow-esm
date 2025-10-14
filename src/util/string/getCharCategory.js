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
