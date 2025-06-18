export const getPossibleTypes = (schemas) => {
	const flags = {};
	schemas.forEach((schema) => (flags[schema.type] = true));
	return flags;
};
