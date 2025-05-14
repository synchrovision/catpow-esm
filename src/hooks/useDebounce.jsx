import React from "react";
const { useEffect } = React;

export const useDebounce = (callback, interval, deps) => {
	useEffect(() => {
		const timer = setTimeout(callback, interval);
		return () => clearTimeout(timer);
	}, deps);
};
