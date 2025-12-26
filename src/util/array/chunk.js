export const chunk = function* (array, size) {
	if (size <= 0) return;
	for (let i = 0; i < array.length; i += size) {
		yield array.slice(i, i + size);
	}
};
