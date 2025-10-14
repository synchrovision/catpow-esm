export const sequence = (...cbs) => {
	const l = cbs.length;
	const cb = (i) => {
		new Promise(cbs[i]).then(
			() => cb((i + 1) % l),
			() => {}
		);
	};
	cb(0);
};
