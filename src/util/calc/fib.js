const fibs = [0, 1, 1];
export const fib = (n) => {
	if (undefined !== fibs[n]) {
		return fibs[n];
	}
	return fibs[n - 2] + fibs[n - 1];
};
