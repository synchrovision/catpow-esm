import React from "react";
import ReactDOM from "react-dom";

export const PortalWindow = (props) => {
	const { children, title = "PortalWindow", id = "PortalWindow", width, height } = props;
	const { useState, useMemo, useEffect } = React;
	const { createPortal } = ReactDOM;
	const [el, setEl] = useState(null);

	useEffect(() => {
		let win = window.open("", id, `width=${width},height=${height}`);
		const doc = win.document;
		let el = doc.getElementById(id);
		if (el === null) {
			el = doc.createElement("div");
			doc.body.appendChild(el);
			el.id = id;
		}
		el.innerHTML = "";
		doc.title = title;
		setEl(el);
	}, [id]);

	return useMemo(() => {
		if (el === null) {
			return null;
		}
		return createPortal(children, el);
	}, [el, children]);
};
