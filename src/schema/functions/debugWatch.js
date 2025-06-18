export const debugWatch = (object, property) => {
	Object.defineProperty(object, property, {
		set: (value) => {
			debugLog(`\u{1F4DD} ${property} was changed`, value);
			this[property] = value;
		},
	});
};
