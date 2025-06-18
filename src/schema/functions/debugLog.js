export const debugLog = (message, object) => {
	console.groupCollapsed(message);
	console.debug(object);
	console.trace();
	console.groupEnd();
};
