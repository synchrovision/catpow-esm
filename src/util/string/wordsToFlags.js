export const wordsToFlags = (words) =>
	words &&
	words.split(" ").reduce((p, c) => {
		p[c] = true;
		return p;
	}, {});
