import React from "react";

const applyBem = (component, { ...ctx }) => {
	const {
		props: { className, children },
	} = component;
	if (className) {
		component.props.className = className
			.split(" ")
			.map((className) => {
				if (className.slice(0, 2) === "--") {
					return ctx.element + className;
				}
				if (className[0] === "-") {
					return (ctx.block = ctx.element = ctx.block + className);
				}
				if (className[0] === "_") {
					return (ctx.element = ctx.element + (ctx.element === ctx.block ? "__" : "-") + className.slice(1));
				}
				if (className.slice(-1) === "-") {
					return (ctx.block = ctx.element = ctx.prefix + "-" + className.slice(0, -1));
				}
				if (className.slice(-1) === "_") {
					return (ctx.element = ctx.block + "__" + className.slice(0, -1));
				}
				return className;
			})
			.join(" ");
		if (component.props.className === className) {
			const matches = className.match(/\b((\w+)\-\w+(\-\w+)*)(__\w+(\-\w+)*)?\b/);
			if (!matches) {
				return;
			}
			ctx.prefix = matches[2];
			ctx.block = matches[1];
			ctx.element = matches[0];
		}
	} else if (typeof component.type === "string") {
		component.props.className = ctx.element = ctx.element + (ctx.element === ctx.block ? "__" : "-") + component.type;
	} else {
		return;
	}
	if (children == null) {
		return;
	}
	if (Array.isArray(children)) {
		children.forEach((child) => {
			applyBem(child, ctx);
		});
	} else {
		applyBem(children, ctx);
	}
};

export const Bem = ({ prefix = "cp", block, element, children }) => {
	const ctx = { prefix, block, element };
	if (Array.isArray(children)) {
		children.forEach((child) => {
			applyBem(child, ctx);
		});
	} else {
		applyBem(children, ctx);
	}
	return <>{children}</>;
};
