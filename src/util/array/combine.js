export const combine = (keys, values) => {
	if (keys.length !== values.length) {
		throw new Error("Keys and values must have the same length");
	}
	return keys.reduce((obj, key, index) => {
		obj[key] = values[index];
		return obj;
	}, {});
};
