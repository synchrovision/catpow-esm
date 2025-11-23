import { range } from "./range";
import { phasedRange } from "./phasedRange";
export const rangeValueConverter = function (values, snap = false) {
	if (!Array.isArray(values)) {
		values = [...(typeof values === "number" ? range : phasedRange)(values)];
	}
	const len = values.length;
	const lastIndex = len - 1;
	return {
		getValue(pos) {
			if (pos < 0) {
				return values[0];
			}
			if (pos >= 1) {
				return values[lastIndex];
			}
			if (snap) {
				return values[Math.round(pos * lastIndex)];
			}
			const p = pos * lastIndex;
			const l = Math.floor(p);
			return values[l] + (values[l + 1] - values[l]) * (p - l);
		},
		getProgress(value) {
			return this.getPosition(value) / lastIndex;
		},
		getPosition(value) {
			let l = 0,
				r = lastIndex,
				m;
			if (values[0] > value) {
				return 0;
			}
			if (values[r] < value) {
				return r;
			}
			while (l <= r) {
				m = l + ((r - l) >> 1);
				if (values[m] === value) {
					return m;
				}
				if (values[m] > value) {
					r = m - 1;
				} else {
					l = m + 1;
				}
			}
			const p = r + (value - values[r]) / (values[l] - values[r]);
			return snap ? Math.round(p) : p;
		},
	};
};
