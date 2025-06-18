import { test } from "./test.js";

export const getMatchedSchemas = (value, schemas, rootSchema, params) => {
	return schemas.filter((schema) => test(value, schema, rootSchema, params) === true);
};
