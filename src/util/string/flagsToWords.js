export const flagsToWords = (flags) =>
	flags &&
	Object.keys(flags)
		.filter((word) => flags[word])
		.join(" ");
