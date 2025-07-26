export const watchScrollProgress = (el, cb) => {
	const callback = (e) => {
		const bnd = el.getBoundingClientRect();
		cb(1 - bnd.bottom / (window.innerHeight + bnd.height), window.innerHeight > bnd.height ? 1 - bnd.top / (window.innerHeight - bnd.height) : -bnd.top / (bnd.height - window.innerHeight));
	};
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					window.addEventListener("resize", callback);
					document.addEventListener("scroll", callback);
				} else {
					window.removeEventListener("resize", callback);
					document.removeEventListener("scroll", callback);
				}
			});
		},
		{ threshold: [0] }
	);
	observer.observe(el);
};
