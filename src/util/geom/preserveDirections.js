import { preserveDistances } from "./preserveDistances";

export const preserveDirections = (w) => {
	return preserveDistances.map((r, y) => r.map((d, x) => ({ x: x / d, y: y / d })));
};
