export const createAgent = (matrix, ref, key, value, parent, params) => {
	const agent = { matrix, ref, key, value, parent };
	for (let functionName in matrix.curries) {
		agent[functionName] = matrix.curries[functionName](agent);
	}
	if (params != null) {
		Object.assign(agent, params);
	}
	agent.message = false;
	agent.schemaStatus = new Map();
	agent.conditionalSchemaStatus = new WeakMap();
	agent.conditionalRequiredFlag = new Map();
	agent.eventListeners = {};
	agent.debug = parent ? parent.debug : params?.debug || false;
	agent.rootAgent = parent ? parent.rootAgent : agent;
	agent.rootMatrix = parent ? parent.rootMatrix : matrix;
	agent.rootSchema = agent.rootMatrix.schemas[0];

	for (let schema of matrix.schemas) {
		if (schema.isConditional) {
			agent.schemaStatus.set(schema, 0);
			agent.conditionalSchemaStatus.set(schema, 0);
		} else {
			agent.schemaStatus.set(schema, parent ? parent.getSchemaStatus(schema.parent) : 3);
		}
	}
	if (matrix.properties != null) {
		if (agent.value == null || Array.isArray(agent.value) || typeof agent.value !== "object") {
			agent.value = value = {};
		}
		agent.properties = {};
		for (let propertyName in matrix.properties) {
			agent.properties[propertyName] = createAgent(matrix.properties[propertyName], value, propertyName, value[propertyName], agent);
		}
	} else if (matrix.items != null) {
		if (agent.value == null || !Array.isArray(agent.value)) {
			agent.value = value = [];
		}
		if (value.length > 0) {
			agent.items = [];
			for (let index in value) {
				agent.items[index] = createAgent(matrix.items, value, index, value[index], agent);
			}
		} else {
			agent.items = [createAgent(matrix.items, value, 0, null, agent)];
		}
	}

	return agent;
};
