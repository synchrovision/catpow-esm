export const getUnlimietedSchema = (schema) => {
	const unlimitedSchema = Object.assign({}, schema);
	delete unlimitedSchema.enum;
	delete unlimitedSchema.const;
	for (let key in minMaxKeys) {
		if (unlimitedSchema[key] != null) {
			delete unlimitedSchema[key];
		}
	}
	return unlimitedSchema;
};
