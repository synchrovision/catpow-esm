import { createMatrix } from "./createMatrix.js";
import { getUnlimietedSchema } from "./getUnlimietedSchema.js";
import { extractDependencies, test } from "../methods";
import { updateHandles } from "./createMatrix.js";

export const getMatrix = (originalSchemas) => {
	const updateHandlesList = [];
	const schemas = originalSchemas.slice();
	const registerSchema = (schema) => {
		if (schema.if != null) {
			schemas.push(getUnlimietedSchema(schema.if));
			updateHandlesList.push((agent) => {
				const isValid = test(agent.getValue(), schema.if, rootSchema);
				if (schema.then != null) {
					agent.setConditionalSchemaStatus(schema.then, isValid ? 3 : 0);
				}
				if (schema.else != null) {
					agent.setConditionalSchemaStatus(schema.else, isValid ? 0 : 3);
				}
			});
		}
		if (schema.allOf != null) {
			schemas.push.apply(schemas, schema.allOf);
		}
		if (schema.anyOf != null) {
			schemas.push.apply(schemas, schema.anyOf);
			const keyPropertyNames = Object.keys(schema.properties);
			updateHandlesList.push((agent) => {
				schema.anyOf.forEach((subSchema) => {
					if (subSchema.properties == null) {
						return;
					}
					const isValid = keyPropertyNames.every((keyPropertyName) => {
						return subSchema.properties[keyPropertyName] == null || test(agent.properties[keyPropertyName].getValue(), subSchema.properties[keyPropertyName], rootSchema);
					});
					agent.setConditionalSchemaStatus(subSchema, isValid ? 3 : 0);
					keyPropertyNames.forEach((keyPropertyName) => {
						if (subSchema.properties[keyPropertyName] == null) {
							return;
						}
						agent.properties[keyPropertyName].setConditionalSchemaStatus(subSchema.properties[keyPropertyName], 0);
					});
				});
			});
		}
		if (schema.oneOf != null) {
			schemas.push.apply(schemas, schema.oneOf);
			const keyPropertyNames = Object.keys(schema.properties);
			updateHandlesList.push((agent) => {
				schema.oneOf.forEach((subSchema) => {
					if (subSchema.properties == null) {
						return;
					}
					const isValid = keyPropertyNames.every((keyPropertyName) => {
						return subSchema.properties[keyPropertyName] == null || test(agent.properties[keyPropertyName].getValue(), subSchema.properties[keyPropertyName], rootSchema);
					});
					agent.setConditionalSchemaStatus(subSchema, isValid ? 3 : 0);
					keyPropertyNames.forEach((keyPropertyName) => {
						if (subSchema.properties[keyPropertyName] == null) {
							return;
						}
						agent.properties[keyPropertyName].setConditionalSchemaStatus(subSchema.properties[keyPropertyName], 0);
					});
				});
			});
		}
		const { dependentRequired, dependentSchemas } = extractDependencies(schema);
		if (dependentSchemas != null) {
			for (let name in dependentSchemas) {
				schemas.push(dependentSchemas[name]);
			}
			updateHandlesList.push((agent) => {
				const value = agent.getValue();
				for (let name in dependentSchemas) {
					agent.setConditionalSchemaStatus(dependentSchemas[name], value[name] != null ? 3 : 0);
				}
			});
		}
		if (dependentRequired != null) {
			updateHandlesList.push((agent) => {
				const value = agent.getValue();
				for (let name in dependentRequired) {
					const flag = value[name] != null;
					dependentRequired[name].forEach((name) => {
						agent.properties[name].setConditionalRequiredFlag(schema, flag);
					});
				}
			});
		}
	};
	for (let i = 0; i < schemas.length; i++) {
		registerSchema(schemas[i]);
	}
	const matrix = createMatrix(schemas);
	updateHandles.set(matrix, (agent) => {
		updateHandlesList.forEach((cb) => cb(agent));
	});

	schemas.forEach((schema) => {
		if (schema.properties != null) {
			if (matrix.properties == null) {
				matrix.properties = {};
			}
			for (let key in schema.properties) {
				if (matrix.properties[key] == null) {
					matrix.properties[key] = [];
				}
				matrix.properties[key].push(schema.properties[key]);
			}
		}
		if (schema.prefixItems != null) {
			if (matrix.prefixItems == null) {
				matrix.prefixItems = [];
			}
			for (let index in schema.prefixItems) {
				if (matrix.prefixItems[index] == null) {
					matrix.prefixItems[index] = [];
				}
				matrix.prefixItems[index].push(schema.prefixItems[index]);
			}
		}
		if (schema.items != null) {
			if (matrix.items == null) {
				matrix.items = [];
			}
			matrix.items.push(schema.items);
		}
	});
	if (matrix.properties != null) {
		for (let key in matrix.properties) {
			matrix.properties[key] = getMatrix(matrix.properties[key]);
		}
	}
	if (matrix.prefixItems != null) {
		for (let index in matrix.prefixItems) {
			matrix.prefixItems[index] = getMatrix(matrix.prefixItems[index]);
		}
	}
	if (matrix.items != null) {
		matrix.items = getMatrix(matrix.items);
	}

	return matrix;
};
