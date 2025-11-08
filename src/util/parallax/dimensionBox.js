export const dimensionBox = (box, params) => {
	let isPlaying = false;
	const { level = 0.5 } = params;
	const body = box.children[0];
	const resizeObserver = new ResizeObserver((entries) => {
		box.style.setProperty("height", entries[0].contentRect.height + "px");
	});
	resizeObserver.observe(body);
	const tick = (t) => {
		const bnd = box.getBoundingClientRect(),
			wh = window.innerHeight;
		body.style.setProperty("perspective-origin", "center " + (wh * level - bnd.top) + "px");
		body.style.setProperty("transform", "translate3d(0," + bnd.top + "px,0)");
		body.style.setProperty("--progress", 1 - bnd.bottom / (wh + bnd.height));
		if (isPlaying) {
			window.requestAnimationFrame(tick);
		}
	};
	box.style.setProperty("clip-path", "inset(0)");
	body.style.setProperty("position", "fixed");
	body.style.setProperty("overflow", "hidden");
	body.style.setProperty("top", 0);
	body.style.setProperty("left", 0);
	body.style.setProperty("right", 0);
	box.style.setProperty("height", body.getBoundingClientRect().height + "px");
	const intersecitonObserver = new IntersectionObserver(
		(entries) => {
			console.log(entries);
			if ((isPlaying = entries[0].isIntersecting)) {
				console.log("enter");
				isPlaying = true;
				tick();
			} else {
				console.log("leave");
			}
		},
		{ threshold: [0] }
	);
	intersecitonObserver.observe(box);
};
