export const intToDataSizeString = (sizeInt) => {
	let grade = 0;
	while (sizeInt > 1000) {
		sizeInt /= 1024;
		grade++;
	}
	return Math.round(sizeInt * 10) / 10 + ["byte", "KB", "MB", "GB", "TB", "PB"][grade];
};
