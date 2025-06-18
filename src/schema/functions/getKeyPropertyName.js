export const getKeyPropertyName = (schemas) => {
	return Object.keys(schemas[0].properties).find((key) => schemas.every((schema) => schema.properties[key] != null));
};
