import React from "react";

const getMapRecursive = (map, keys) => {
	let current = map;
	for (const key of keys) {
		if (!current.has(key)) {
			current.set(key, new Map());
		}
		current = current.get(key);
	}
	return current;
};

export const useCache = (callback, args) => {
	const { useMemo, useRef } = React;
	const { current: cacheTree } = useRef(new Map());

	return useMemo(() => {
		const [primaryKey, ...keys] = args;
		const cache = getMapRecursive(cacheTree, args);
		if (!cache.has(primaryKey)) {
			cache.set(primaryKey, callback());
		}
		return cache.get(primaryKey);
	}, args);
};
