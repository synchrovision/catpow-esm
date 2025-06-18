export const walkAncestor = (agent, cb) => {
	if (cb(agent) === false) {
		return false;
	}
	if (agent.parent) {
		return walkAncestor(agent.parent, cb);
	}
	return true;
};
