import { createAgent, debugLog, getMatrix, resolveSchema } from "./functions";

export const main = (originalRootSchema, matrixParams = {}) => {
	const { debug = false } = matrixParams;
	const rootSchema = JSON.parse(JSON.stringify(originalRootSchema));
	const resolvedRootSchema = resolveSchema("#", rootSchema, rootSchema, {});

	if (debug) {
		debugLog("\u2728 resolve rootSchema", { originalRootSchema, resolvedRootSchema });
	}

	const rootMatrix = getMatrix([resolvedRootSchema]);
	rootMatrix.createAgent = (data, agentParams) => {
		agentParams = { ...matrixParams, ...agentParams };
		const rootAgent = createAgent(rootMatrix, { data }, "data", data, null, agentParams);
		rootAgent.initialize();
		if (debug) {
			debugLog("\u2728 rootAgent was created", { rootAgent });
		}
		return rootAgent;
	};
	if (debug) {
		debugLog("\u2728 rootMatrix was created", { rootMatrix });
	}
	return rootMatrix;
};
