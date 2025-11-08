export const dimensionBox = (box, params) => {
	const { level = 0.5 } = params;
	const body = box.children[0];
	const observer = new ResizeObserver((entries) => {
		box.style.setProperty("height", entries[0].contentRect.height + "px");
	});
	observer.observe(body);
	const tick = (t) => {
		const bnd = box.getBoundingClientRect(),
			wh = window.innerHeight;
		body.style.setProperty("perspective-origin", "center " + (wh * level - bnd.top) + "px");
		body.style.setProperty("transform", "translate3d(0," + bnd.top + "px,0)");
		window.requestAnimationFrame(tick);
	};
	window.requestAnimationFrame(tick);
	body.style.setProperty("position", "fixed");
	body.style.setProperty("overflow", "hidden");
	body.style.setProperty("top", 0);
	body.style.setProperty("left", 0);
	body.style.setProperty("right", 0);
	box.style.setProperty("height", body.getBoundingClientRect().height + "px");
};
