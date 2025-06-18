import { getResolvedSchema, extractDependencies } from "../methods";
import { conditionalSchemaKeys } from "../consts.js";

export const resolveSchema = (uri, schema, rootSchema, param) => {
	const resolvedSchema = getResolvedSchema(schema, rootSchema);
	Object.assign(resolvedSchema, param);
	if (resolvedSchema.$ref != null) {
		delete resolvedSchema.$ref;
	}
	const { parent } = param;
	for (let conditionalSchemaKey in conditionalSchemaKeys) {
		if (resolvedSchema[conditionalSchemaKey] == null) {
			continue;
		}
		if (conditionalSchemaKeys[conditionalSchemaKey]) {
			for (let key in resolvedSchema[conditionalSchemaKey]) {
				resolvedSchema[conditionalSchemaKey][key] = resolveSchema(uri, resolvedSchema[conditionalSchemaKey][key], rootSchema, { parent, isConditional: true, container: resolvedSchema });
			}
		} else {
			resolvedSchema[conditionalSchemaKey] = resolveSchema(uri, resolvedSchema[conditionalSchemaKey], rootSchema, { parent, isConditional: true, container: resolvedSchema });
		}
	}
	const { dependentSchemas } = extractDependencies(resolvedSchema);
	if (dependentSchemas != null) {
		for (let propertyName in dependentSchemas) {
			dependentSchemas[propertyName] = resolveSchema(uri, dependentSchemas[propertyName], rootSchema, { parent, isConditional: true });
		}
	}
	if (resolvedSchema.properties != null) {
		for (let key in resolvedSchema.properties) {
			resolvedSchema.properties[key] = resolveSchema(uri + "/" + key, resolvedSchema.properties[key], rootSchema, { parent: resolvedSchema });
		}
		if (resolvedSchema.required) {
			for (let key of resolvedSchema.required) {
				if (resolvedSchema.properties[key]) {
					resolvedSchema.properties[key].isRequired = true;
				}
			}
		}
	}
	if (resolvedSchema.prefixItems != null) {
		for (let index in resolvedSchema.prefixItems) {
			resolvedSchema.prefixItems[index] = resolveSchema(uri + "/" + index, resolvedSchema.prefixItems[index], rootSchema, { parent: resolvedSchema });
		}
	}
	if (resolvedSchema.items != null) {
		resolvedSchema.items = resolveSchema(uri + "/$", resolvedSchema.items, rootSchema, { parent: resolvedSchema });
	}
	return resolvedSchema;
};
