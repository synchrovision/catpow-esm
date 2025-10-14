export const bemSelector = (className) => {
	const cache = new Map();
	return (selector) => {
		if (cache.has(selector)) {
			return cache.get(selector);
		}
		let crr = className;
		let [block, element = ""] = className.split("__");
		let result = selector.replaceAll(/[\.\-_\w#]+/g, (sel) => {
			sel = sel.replace(/\.((\-|_)[a-z][\w\-]*|[a-z][\w\-]*(\-|_))/, (...matches) => {
				if (matches[2] === "-") {
					crr = block + matches[1];
					[block, element = ""] = crr.split("__");
				} else if (matches[3] === "-") {
					crr = className + "-" + matches[1].slice(0, -1);
					[block, element = ""] = crr.split("__");
				} else if (matches[2] === "_") {
					if (element) {
						element += "-" + matches[1].slice(1);
					} else {
						element = matches[1].slice(1);
					}
					crr = block + "__" + element;
				} else if (matches[3] === "_") {
					element = matches[1].slice(0, -1);
					crr = block + "__" + element;
				}
				return "." + crr;
			});
			sel = sel.replace(/\.(\-\-[\w\-]+)/, `.${crr}$1`);
			return sel;
		});
		cache.set(selector, result);
		return result;
	};
};
