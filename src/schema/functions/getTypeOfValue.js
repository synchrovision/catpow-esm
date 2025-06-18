export const getTypeOfValue = (value) => {
	if (value == null) {
		return "null";
	}
	if (Array.isArray(value)) {
		return "array";
	}
	return typeof value;
};
