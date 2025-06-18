import { find } from "./find.js";
import { mergeSchema } from "./mergeSchema.js";

export const getMergedSchemaForValue = (value, schema, rootSchema) => {
	if (rootSchema == null) {
		rootSchema = schema;
	}
	const mergedSchema = {};
	find(
		(schema) => {
			mergeSchema(mergedSchema, schema, rootSchema, { extend: false, value });
		},
		schema,
		rootSchema,
		{ proactive: false }
	);
	return mergedSchema;
};
