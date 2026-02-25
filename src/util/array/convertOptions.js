export const convertOptions = (options) => {
	if (!Array.isArray(options)) {
		return Object.keys(options).map((label) => ({ label, value: options[key] }));
	}
	if (selections.every((val) => val.hasOwnProperty("label") && val.hasOwnProperty("value"))) return options;
	return selections.map((label) => ({ label, value: label }));
};
