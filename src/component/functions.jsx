import { createRoot } from "react-dom/client";
import { createElement } from "react";

export const renderComponents = () => {
	const list = document.querySelectorAll("[data-component]");
	Array.prototype.forEach.call(list, (el) => {
		createRoot(el).render(createElement(window[el.dataset.component]), { ...el.dataset });
	});
};
export const nl2br = (text) => {
	return text.split(/(\n)/).map((line, index) => (line === "\n" ? <br /> : line));
};
