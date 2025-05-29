export const eventMixin = () => {
	const callbacks = {};
	return {
		on(event, callback) {
			if (callbacks[event] == null) {
				callbacks[event] = new Set();
			}
			callbacks[event].add(callback);
		},
		off(event, callback) {
			if (callbacks[event] == null) {
				return;
			}
			callbacks[event].delete(callback);
		},
		once(event, callback) {
			const cb = (app, args) => {
				callback(app, args);
				this.off(event, cb);
			};
			this.on(event, cb);
		},
		trigger(event, args) {
			if (callbacks[event] == null) {
				return;
			}
			callbacks[event].forEach((callback) => callback(this, args));
		},
	};
};
