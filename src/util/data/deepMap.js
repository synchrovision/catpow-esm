export const deepMap = () => {
	const maps = {};
	const getMap = (keys, shift = 0) => {
		const depth = keys.length + shift;
		if (maps[depth] == null) {
			maps[depth] = new Map();
		}
		let currentMap = maps[depth];
		for (const key of keys) {
			if (!currentMap.has(key)) {
				currentMap.set(key, new Map());
			}
			currentMap = currentMap.get(key);
		}
		return currentMap;
	};
	return {
		getMap(keys, shift = 1) {
			return getMap(keys, shift);
		},
		has(keys) {
			return getMap(keys.slice(0, -1)).has(keys[keys.length - 1]);
		},
		get(keys) {
			return getMap(keys.slice(0, -1)).get(keys[keys.length - 1]);
		},
		set(keys, value) {
			return getMap(keys.slice(0, -1)).set(keys[keys.length - 1], value);
		},
		forEach(keys, callback) {
			return getMap(keys).forEach(callback);
		},
		map(keys, callback) {
			return [...getMap(keys)].map(callback);
		},
	};
};
