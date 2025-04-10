export const dataSizeStringToInt = (sizeString) => {
	const matches = sizeString.match(/(\d[\d,]*(?:\.\d+)?)([KMG])B/i);
	if (matches) {
		return parseInt(matches[1] * { K: 1 << 10, M: 1 << 20, G: 1 << 30 }[matches[2]]);
	}
	return parseInt(sizeString);
};
export const intToDataSizeString = (sizeInt) => {
	let grade = 0;
	while (sizeInt > 1000) {
		sizeInt /= 1024;
		grade++;
	}
	return Math.round(sizeInt * 10) / 10 + ["byte", "KB", "MB", "GB", "TB", "PB"][grade];
};
export const pfloor = (n, p) => parseFloat(Math.floor(parseFloat(n + "e" + p)) + "e-" + p);
export const pround = (n, p) => parseFloat(Math.round(parseFloat(n + "e" + p)) + "e-" + p);
export const pceil = (n, p) => parseFloat(Math.ceil(parseFloat(n + "e" + p)) + "e-" + p);

export const hfloor = (n, p) => parseFloat(n.toExponential(p).replace(/^(\-?\d\.\d+)/, (m) => pfloor(m, p - 1)));
export const hround = (n, p) => parseFloat(n.toExponential(p).replace(/^(\-?\d\.\d+)/, (m) => pround(m, p - 1)));
export const hceil = (n, p) => parseFloat(n.toExponential(p).replace(/^(\-?\d\.\d+)/, (m) => pceil(m, p - 1)));
export const hunit = (n, p) =>
	parseFloat(
		n
			.toExponential(p)
			.replace(/^(\-?\d\.\d+)/, "1.0")
			.replace(/\-?\d+$/, (m) => 1 + parseFloat(m) - p)
	);

export const srand = (w = 88675123) => {
	var x = 123456789,
		y = 362436069,
		z = 521288629;
	return function () {
		let t;
		t = x ^ (x << 11);
		[x, y, z] = [y, z, w];
		w = w ^ (w >>> 19) ^ (t ^ (t >>> 8));
		if (arguments.length === 0) {
			return w;
		}
		if (arguments.length === 1) {
			return w % (arguments[0] + 1);
		}
		const [min, max] = arguments;
		return min + (Math.abs(w) % (max + 1 - min));
	};
};

const fibs = [0, 1, 1];
export const fib = (n) => {
	if (undefined !== fibs[n]) {
		return fibs[n];
	}
	return fibs[n - 2] + fibs[n - 1];
};

export const bez = (ns, t) => {
	var p = 0,
		n = ns.length - 1,
		i;
	p += ns[0] * Math.pow(1 - t, n);
	for (i = 1; i < n; i++) {
		p += ns[i] * Math.pow(1 - t, n - i) * Math.pow(t, i) * n;
	}
	p += ns[n] * Math.pow(t, n);
	return p;
};
