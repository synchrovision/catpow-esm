export const walkDescendant = (agent, cb) => {
	agent.walkChildren((child) => {
		if (cb(child) !== false) {
			walkDescendant(child, cb);
		}
	});
};
