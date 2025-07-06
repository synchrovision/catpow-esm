import { getDefaultValue, sanitize, test, getErrorMessage, mergeSchemas } from "../methods";
import { getPossibleTypes } from "./getPossibleTypes.js";
import { walkDescendantSchema } from "./walkDescendantSchema.js";
import { createAgent } from "./createAgent.js";
import { debugLog } from "./debugLog.js";

export const updateHandles = new WeakMap();

export const createMatrix = (schemas) => {
	const possibleTypes = getPossibleTypes(schemas);
	const curries = {
		on: (agent) => {
			return (type, callback, arg = null) => {
				if (agent.eventListeners[type] == null) {
					agent.eventListeners[type] = new Map();
				}
				agent.eventListeners[type].set(callback, arg);
			};
		},
		off: (agent) => {
			return (type, callback) => {
				if (agent.eventListeners[type] == null) {
					return;
				}
				return agent.eventListeners[type].delete(callback);
			};
		},
		trigger: (agent) => {
			return (event) => {
				if (typeof event === "string") {
					event = { type: event, bubbles: true };
				}
				if (agent.debug) {
					debugLog(`\u{26A1} trigger event '${event.type}' on '${agent.key}'`, { event, agent });
				}
				event.target = agent;
				const cb = (agent) => {
					if (agent.eventListeners[event.type] == null) {
						return true;
					}
					let stopPropagation = false;
					agent.eventListeners[event.type].forEach((arg, callback) => {
						if (callback(event, arg) === false) {
							stopPropagation = true;
						}
					});
					return !stopPropagation;
				};
				if (cb(agent) !== false && event.bubbles && agent.parent != null) {
					agent.parent.trigger(event);
				}
			};
		},
		getAgent: (agent) => {
			return (path) => {
				if (!Array.isArray(path)) {
					path = path.split("/");
				}
				if (path.length === 0) {
					return agent;
				}
				const key = path.shift();
				if (isNaN(key)) {
					return agent.properties[key].getAgent(path);
				} else {
					const index = parseInt(key);
					if (agent.prefixItems != null) {
						if (index < agent.prefixItems.length) {
							return agent.prefixItems[index].getAgent(path);
						} else {
							return agent.prefixItems[index - agent.prefixItems.length].getAgent(path);
						}
					} else {
						return agent.items[index].getAgent(path);
					}
				}
			};
		},
		walkChildren: (agent) => {
			return (cb) => {
				if (agent.properties != null) {
					for (let name in agent.properties) {
						cb(agent.properties[name]);
					}
				}
				if (agent.prefixItems != null) {
					for (let child of agent.prefixItems) {
						cb(child);
					}
				}
				if (agent.items != null) {
					for (let child of agent.items) {
						cb(child);
					}
				}
			};
		},

		getConditionalSchemaStatus: (agent) => {
			return (schema) => {
				return agent.conditionalSchemaStatus.get(schema);
			};
		},
		setConditionalSchemaStatus: (agent) => {
			return (schema, status) => {
				if (agent.conditionalSchemaStatus.get(schema) === status) {
					return status;
				}
				agent.conditionalSchemaStatus.set(schema, status);
				if (agent.debug) {
					debugLog(`\u{1F511} conditionalSchemaStatus of '${agent.key}' was changed`, { schema, status });
				}
				agent.setSchemaStatus(schema, (agent.parent == null ? 3 : agent.parent.getSchemaStatus(schema.parent)) & status);
			};
		},
		getParentSchemaStatus: (agent) => {
			return (schema) => {
				return agent.conditionalSchemaStatus.get(schema);
			};
		},
		setConditionalRequiredFlag: (agent) => {
			return (schema, flag) => {
				if (agent.conditionalRequiredFlag.get(schema) === flag) {
					return flag;
				}
				agent.conditionalRequiredFlag.set(schema, flag);
				agent.isReqired = false;
				for (let [schema, flag] of agent.conditionalRequiredFlag.entries()) {
					if (flag && agent.getSchemaStatus(schema) & 1) {
						agent.isReqired = true;
						break;
					}
				}
			};
		},

		getSchemaStatus: (agent) => {
			return (schema) => {
				if (agent.schemaStatus == null || !agent.schemaStatus.has(schema)) {
					return 1;
				}
				return agent.schemaStatus.get(schema);
			};
		},
		setSchemaStatus: (agent) => {
			return (schema, status) => {
				if (agent.schemaStatus.get(schema) === status) {
					return status;
				}
				agent.schemaStatus.set(schema, status);
				if (agent.debug) {
					debugLog(`\u{1F511} schemaStatus of '${agent.key}' was changed`, { schema, status });
				}
				walkDescendantSchema(agent, schema, (agent, schema) => {
					const currentStatus = agent.schemaStatus.get(schema);
					let status = agent.parent.schemaStatus.get(schema.parent);
					if (agent.conditionalSchemaStatus.has(schema)) {
						status &= agent.conditionalSchemaStatus.get(schema);
						let container = schema.container;
						while (agent.conditionalSchemaStatus.has(container)) {
							status &= agent.conditionalSchemaStatus.get(container);
							container = container.container;
						}
					}
					if (status === currentStatus) {
						return false;
					}
					agent.schemaStatus.set(schema, status);
				});
			};
		},

		getSchemas: (agent) => {
			return (status) => {
				return schemas.filter((schema) => (agent.getSchemaStatus(schema) & status) != 0);
			};
		},
		getSchemasForInput: (agent) => {
			return () => agent.getSchemas(1);
		},
		getSchemasForValidation: (agent) => {
			return () => agent.getSchemas(2);
		},

		getMergedSchema: (agent) => {
			const cache = {};
			return (status = 1, extend = true) => {
				const key = agent.getMergedSchemaKey(status, extend);
				if (cache[key] != null) {
					return cache[key];
				}
				cache[key] = mergeSchemas(agent.getSchemas(status), agent.rootSchema, extend);
				return cache[key];
			};
		},
		getMergedSchemaKey: (agent) => {
			return (status = 1, extend = true) => {
				return Array.from(agent.schemaStatus.values()).join("") + "-" + status + (extend ? "-e" : "");
			};
		},
		getMergedSchemaForInput: (agent) => {
			return () => agent.getMergedSchema(1, true);
		},
		getMergedSchemaForValidation: (agent) => {
			return () => agent.getMergedSchema(2, false);
		},

		getValue: (agent) => {
			return (getDefaultValueIfEmpty = true) => {
				if (agent.value == null && getDefaultValueIfEmpty) {
					return getDefaultValue(agent.getMergedSchemaForInput(), agent.rootSchema);
				}
				return agent.value;
			};
		},
		setValue: (agent) => {
			return (value) => {
				agent.value = value;
				agent.trigger({ type: "change", bubbles: true });
				if (agent.debug) {
					debugLog(`\u{1F4DD} change value for '${agent.key}'`, { value });
				}
			};
		},
		deleteValue: (agent) => {
			return () => {
				agent.value = null;
				agent.trigger({ type: "change", bubbles: true });
			};
		},
		update: (agent) => {
			return () => {
				if (agent.debug) {
					debugLog(`\u2699\uFE0F update process for '${agent.key}' start`, { agent });
				}
				if (agent.value == null) {
					delete agent.ref[agent.key];
				} else {
					agent.ref[agent.key] = agent.value;
				}
				if (agent.parent != null) {
					agent.parent.update();
				}
				updateHandles.get(agent.matrix)(agent);
				agent.validate();
				if (!agent.isValid) {
					agent.trigger({ type: "error", bubbles: false });
				}
				agent.trigger({ type: "update", bubbles: false });
				if (agent.debug) {
					debugLog(`\u2699\uFE0F update process for '${agent.key}' end`, { agent });
				}
			};
		},
		validate: (agent) => {
			return () => {
				agent.isValid = agent.getSchemasForValidation().every((schema) => {
					return test(agent.value, schema, agent.rootSchema, {
						onSuccess: (params) => {
							agent.setMessage(null);
						},
						onError: (params) => {
							if (agent.debug) {
								debugLog("\u26A0\uFE0F invalid value was found", params);
							}
							agent.setMessage(getErrorMessage(params));
							agent.trigger({ type: "error", bubble: false });
							return false;
						},
					});
				});
				agent.trigger({ type: "validate", bubbles: false });
			};
		},
		initialize: (agent) => {
			return () => {
				if (agent.value == null) {
					agent.value = getDefaultValue(agent.getMergedSchemaForInput(), agent.rootSchema);
				}
				agent.walkChildren((agent) => agent.initialize());
				updateHandles.get(agent.matrix)(agent);
				agent.trigger({ type: "initialize", bubbles: false });
			};
		},
		sanitize: (agent) => {
			return () => {
				let value = agent.getValue();
				const schemas = agent.getSchemasForValidation();
				for (const schema of schemas) {
					value = sanitize(value, schema, agent.rootSchema);
				}
				if (value !== agent.getValue()) {
					agent.setValue(value);
				}
				agent.walkChildren((agent) => agent.sanitize());
				updateHandles.get(agent.matrix)(agent);
				agent.trigger({ type: "sanitize", bubbles: false });
			};
		},
		getMessage: (agent) => {
			return () => agent.message;
		},
		setMessage: (agent) => {
			return (message) => {
				agent.message = message;
			};
		},
		getProperties: (agent) => {
			return () => {
				return agent.properties;
			};
		},
		getPrefixItems: (agent) => {
			return () => {
				return agent.prefixItems;
			};
		},
		getItems: (agent) => {
			return () => {
				return agent.items;
			};
		},
		addItem: (agent) => {
			return (index, value) => {
				const item = createAgent(agent.matrix.items, agent.value, index, value, agent.parent);
				agent.value.splice(index, 0, value);
				agent.items.splice(index, 0, item);
				agent.items.forEach((item, index) => (item.key = index));
				item.initialize();
				agent.trigger({ type: "addItem", bubbles: false });
				agent.trigger({ type: "modifyItems", bubbles: false });
			};
		},
		copyItem: (agent) => {
			return (from, to) => {
				agent.addItem(to, JSON.parse(JSON.stringify(agent.items[from].getValue())));
			};
		},
		moveItem: (agent) => {
			return (from, to) => {
				agent.items.splice(to, 0, agent.items.splice(from, 1)[0]);
				agent.items.forEach((item, index) => (item.key = index));
				agent.trigger({ type: "moveItem", bubbles: false });
				agent.trigger({ type: "modifyItems", bubbles: false });
			};
		},
		removeItem: (agent) => {
			return (index) => {
				agent.value.splice(index, 1);
				agent.items.splice(index, 1);
				agent.items.forEach((item, index) => (item.key = index));
				agent.trigger({ type: "removeItem", bubbles: false });
				agent.trigger({ type: "modifyItems", bubbles: false });
			};
		},
	};
	return { possibleTypes, curries, schemas };
};
