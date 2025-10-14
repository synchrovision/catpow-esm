export const dataSizeStringToInt = (sizeString) => {
	const matches = sizeString.match(/(\d[\d,]*(?:\.\d+)?)([KMG])B/i);
	if (matches) {
		return parseInt(matches[1] * { K: 1 << 10, M: 1 << 20, G: 1 << 30 }[matches[2]]);
	}
	return parseInt(sizeString);
};
