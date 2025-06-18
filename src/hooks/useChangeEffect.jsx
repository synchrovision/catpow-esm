import React from "react";

export const useChangeEffect = (callback, deps) => {
	const { useEffect, useRef } = React;
	const ref = useRef(true);
	useEffect(() => {
		if (ref.current) {
			ref.current = false;
		} else {
			return callback();
		}
	}, deps);
};
