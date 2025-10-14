export const hunit = (n, p) =>
	parseFloat(
		n
			.toExponential(p)
			.replace(/^(\-?\d\.\d+)/, "1.0")
			.replace(/\-?\d+$/, (m) => 1 + parseFloat(m) - p)
	);
