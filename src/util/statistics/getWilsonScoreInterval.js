export const getWilsonScoreInterval = (v, n, z = 1.96) => {
	if (n === 0) {
		return [0, 0];
	}
	const p = (v + (z * z) / 2) / (n + z * z);
	const d = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
	return [Math.max(0, p - d), Math.min(1, p + d)];
};
