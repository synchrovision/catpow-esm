export const filterFlags = (flags, callback) => {
	Object.keys(flags).forEach((key) => {
		if (!callback(key)) {
			delete flags[key];
		}
	});
	return flags;
};
