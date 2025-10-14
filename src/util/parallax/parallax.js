export const parallax = (el, vars = {}) => {
	var wh, ch;
	const updateCoef = () => {
		(wh = window.innerHeight), (ch = el.clientHeight);
	};
	window.addEventListener("resize", updateCoef);
	updateCoef();
	const keys = Object.keys(vars);
	const testCallback = (cb) => {
		const tbl = [];
		for (let n = 0; n <= 100; n += 5) {
			tbl.push({ n, rusult: cb(n / 100) });
		}
		console.table(tbl);
	};
	keys.forEach((key) => {
		if (Array.isArray(vars[key])) {
			const vs = [0, 0].concat(vars[key]);
			if (vs.length & 1) {
				vs.push(1);
			}
			if (vs[vs.length - 2] !== 1) {
				vs.push(1, 1);
			}
			const es = [],
				cs = [],
				ds = [];
			for (let i = 2; i < vs.length; i += 2) {
				const c = (vs[i + 1] - vs[i - 1]) / (vs[i] - vs[i - 2]);
				es.push(vs[i]);
				cs.push(c);
				ds.push(vs[i + 1] - c * vs[i]);
			}
			vars[key] = (p) => {
				for (let i = 0; i < es.length; i++) {
					if (p <= es[i]) {
						return p * cs[i] + ds[i];
					}
				}
				return 1;
			};
		}
	});
	const tick = (t) => {
		const bnd = el.getBoundingClientRect();
		const p = Math.min(1, Math.max(0, (wh - bnd.top) / (bnd.height + wh)));
		el.style.setProperty("--parallax-t", bnd.top);
		el.style.setProperty("--parallax-c", bnd.top + ch / 2 - wh / 2);
		el.style.setProperty("--parallax-b", wh - bnd.bottom);
		el.style.setProperty("--parallax-p", p);
		keys.map((key) => el.style.setProperty("--" + key, vars[key](p)));
		window.requestAnimationFrame(tick);
	};
	window.requestAnimationFrame(tick);
};
