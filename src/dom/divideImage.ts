import { el, range } from "catpow/util";

type divideImageParams = {
	ux?: number;
	uy?: number;
	w?: number;
	h?: number;
};

export const divideImage = function (target: HTMLElement, params: divideImageParams = {}) {
	const primaryClass = target.className.split(" ")[0];
	const classPrefix = primaryClass + (primaryClass.includes("__") ? "-" : "__");
	const { ux, uy } = params;
	let { w = 8, h = 8 } = params;
	let nw, nh;

	const dividedImage = el("div", { class: classPrefix + "divided", style: `display:grid` }, []);
	const image: HTMLElement = target.cloneNode(true);
	image.style.setProperty("visibility", "hidden");
	dividedImage.appendChild(image);
	target.replaceWith(dividedImage);

	const observer = new ResizeObserver((entries) => {
		if (ux) {
			nw = Math.ceil(image.clientWidth / ux);
		}
		if (uy) {
			nh = Math.ceil(image.clientHeight / uy);
		}
		console.log({ w, h, nw, nh });
		if (nw !== w || nh !== h) {
			(w = nw), (h = nh);
			dividedImage.style.setProperty("grid-template-columns", `repeat(${w},1fr)`);
			dividedImage.replaceChildren(image, ...getDividedImageParts({ target, classPrefix, w, h }));
		}
		dividedImage.style.setProperty("aspect-ratio", image.clientWidth / image.clientHeight);
	});
	observer.observe(dividedImage);
};

function getDividedImageParts({ target, classPrefix, w, h }) {
	return range(h - 1).reduce((p, y) => {
		range(w - 1).forEach((x) => {
			const image = target.cloneNode(true);
			image.setAttribute("style", `position:absolute;width:${w * 100}%;height:${h * 100}%;left:-${x * 100}%;top:-${y * 100}%`);
			p.push(el("div", { class: classPrefix + "divided-part", style: `--x:${x};--y:${y};position:relative;overflow:hidden;grid-column:${x + 1};grid-row:${y + 1}` }, [image]));
		});
		return p;
	}, []);
}
