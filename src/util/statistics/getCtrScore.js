import { getWilsonScoreInterval } from "./getWilsonScoreInterval";
import { getExpectedCtr } from "./getExpectedCtr";

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
