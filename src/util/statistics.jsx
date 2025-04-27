export const getExpectedCtr = (rank) => 0.3 / Math.pow(rank, 0.8);
export const getCtrScore = (rank, impressions, clicks) => {
	if (impressions === 0) {
		return 0;
	}
	const [lower, higher] = getWilsonScoreInterval(clicks, impressions);
	const expectedCtr = getExpectedCtr(rank);
	if (higher * 1.1 < expectedCtr) {
		if (higher * 1.5 < expectedCtr) {
			return -2;
		}
		return -1;
	}
	if (lower > expectedCtr * 1.1) {
		if (lower > expectedCtr * 1.5) {
			return 2;
		}
		return 1;
	}
	return 0;
};
export const getWilsonScoreInterval = (v, n, z = 1.96) => {
	if (n === 0) {
		return [0, 0];
	}
	const p = (v + (z * z) / 2) / (n + z * z);
	const d = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
	return [Math.max(0, p - d), Math.min(1, p + d)];
};
