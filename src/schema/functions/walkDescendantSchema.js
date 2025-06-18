export const walkDescendantSchema = (agent, schema, cb) => {
	agent.walkChildren((child) => {
		for (let subSchema of child.matrix.schemas) {
			if (subSchema.parent === schema) {
				if (cb(child, subSchema) !== false) {
					walkDescendantSchema(child, subSchema, cb);
				}
			}
		}
	});
};
