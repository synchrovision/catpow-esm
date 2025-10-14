export const pfloor = (n, p) => parseFloat(Math.floor(parseFloat(n + "e" + p)) + "e-" + p);
export const pround = (n, p) => parseFloat(Math.round(parseFloat(n + "e" + p)) + "e-" + p);
export const pceil = (n, p) => parseFloat(Math.ceil(parseFloat(n + "e" + p)) + "e-" + p);

export const hfloor = (n, p) => parseFloat(n.toExponential(p).replace(/^(\-?\d\.\d+)/, (m) => pfloor(m, p - 1)));
export const hround = (n, p) => parseFloat(n.toExponential(p).replace(/^(\-?\d\.\d+)/, (m) => pround(m, p - 1)));
export const hceil = (n, p) => parseFloat(n.toExponential(p).replace(/^(\-?\d\.\d+)/, (m) => pceil(m, p - 1)));
