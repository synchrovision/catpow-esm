import React, { cloneElement, isValidElement, ReactNode } from "react";

type BemProps = {
	prefix?: string;
	block?: string;
	element?: string;
	children?: any;
};
type ElementProps = {
	children?: ReactNode;
	className?: string;
};

const applyBem = (component: ReactNode, { ...ctx }): ReactNode => {
	if (Array.isArray(component)) {
		return component.map((child) => applyBem(child, ctx));
	}
	if (!isValidElement<ElementProps>(component)) {
		return component;
	}
	if (component.type == React.Fragment || component.type == "template") {
		return cloneElement(component, component?.props || {}, applyBem(component.props.children, ctx));
	}
	let newClassName: string;
	const {
		props: { className, children },
	} = component;
	if (className) {
		newClassName = className
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
		if (newClassName === className) {
			const matches =
				(ctx.prefix && className.match(new RegExp(`\\b((${ctx.prefix.replaceAll("-", "\\-")})\\-[a-z]+(\\-[a-z]+)*)(__[a-z]+(\\-[a-z]+)*)?\\b`))) ||
				className.match(/\b(([a-z]+)\-[a-z]+(\-[a-z]+)*)(__[a-z]+(\-[a-z]+)*)?\b/);
			if (!matches) {
				return component;
			}
			if (!matches[1].startsWith(ctx.prefix)) {
				ctx.prefix = matches[2];
			}
			ctx.block = matches[1];
			ctx.element = matches[0];
		}
	} else if (typeof component.type === "string") {
		newClassName = ctx.element = ctx.element + (ctx.element === ctx.block ? "__" : "-") + component.type;
	} else {
		return component;
	}
	if (children == null) {
		return cloneElement(component, { ...component.props, className: newClassName });
	}
	return cloneElement(component, { ...component.props, className: newClassName }, applyBem(children, ctx));
};

export const Bem = ({ prefix = "cp", block, element, children }: BemProps) => {
	if (element == null && block != null) {
		element = block;
	}
	if (block == null && element != null) {
		block = element.split("__")[0];
	}
	const ctx = { prefix, block, element };
	return <>{applyBem(children, ctx)}</>;
};
