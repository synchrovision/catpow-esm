﻿import React from "react";
import ReactDOM from "react-dom";

export const Portal = (props) => {
	const { children, trace } = props;
	const { render, useState, useMemo, useCallback, useEffect, useRef } = React;
	const { createPortal } = ReactDOM;

	const ref = useRef({ contents: false, setContents: () => {} });

	const el = useMemo(() => {
		if (props.id) {
			const exEl = document.getElementById(props.id);
			if (exEl) {
				return exEl;
			}
		}
		const el = document.createElement("div");
		if (props.id) {
			el.id = props.id;
		}
		if (props.className) {
			el.className = props.className;
		}
		document.body.appendChild(el);
		return el;
	}, []);

	useEffect(() => {
		const { trace } = props;
		if (!trace) {
			return;
		}
		el.style.position = "absolute";
		const timer = setInterval(() => {
			if (trace.getBoundingClientRect) {
				const bnd = trace.getBoundingClientRect();
				el.style.left = window.scrollX + bnd.left + "px";
				el.style.top = window.scrollY + bnd.top + "px";
				el.style.width = bnd.width + "px";
				el.style.height = bnd.height + "px";
			}
		}, 50);
		return () => clearInterval(timer);
	}, [props.trace]);

	return createPortal(children, el);
};
