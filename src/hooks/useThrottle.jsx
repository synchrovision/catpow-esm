import React from "react";
const { useEffect, useRef } = React;

export const useThrottle = (callback, interval, deps) => {
	const ref = useRef(false);
	useEffect(() => {
		if (ref.current) {
			const timer = setTimeout(callback, interval);
			return () => clearTimeout(timer);
		}
		ref.current = true;
		callback();
		setTimeout(() => {
			ref.current = false;
		}, interval);
	}, deps);
};
