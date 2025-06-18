export const walkAncestorSchema = (agent, schema, cb) => {
	if (cb(agent, schema) === false) {
		return false;
	}
	if (agent.parent && schema.parent) {
		return walkAncestorSchema(agent.parent, schema.parent, cb);
	}
	return true;
};
