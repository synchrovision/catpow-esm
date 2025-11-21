import { useState, useMemo, useEffect } from "react";
import { bem } from "catpow/util";
import { useTransition } from "catpow/hooks";

export const Transition = (props) => {
	const { className = "cp-transition", children, initialSize = [100, 100] } = props;
	const [contents, setContents] = useState(false);
	const [prevContents, setPrevContents] = useState(false);
	const [size, setSize] = useState(initialSize);
	const classes = useMemo(() => bem(className), [className]);

	const currentChildrenKey = getTransitionContentsKey(children);

	const transitionType = useMemo(() => {
		return getTransitionType(prevContents, children);
	}, [prevContents]);

	useEffect(() => {
		setContents(children);
		setPrevContents(contents);
	}, [currentChildrenKey]);

	const sizeVars = useMemo(() => ({ "--contents-width": size[0], "--contents-height": size[1] }), size);

	return (
		<div className={classes("is-type-" + transitionType)} style={sizeVars}>
			<Contents classes={classes.contents} active={false} key={getTransitionContentsKey(prevContents)}>
				{prevContents}
			</Contents>
			<Contents classes={classes.contents} active={true} setSize={setSize} key={getTransitionContentsKey(contents)}>
				{contents}
			</Contents>
		</div>
	);
};

const Contents = (props) => {
	const { classes, active, setSize, children } = props;
	const [ref, status, setIsActive] = useTransition();

	useEffect(() => {
		setIsActive(active);
		if (setSize) {
			const observer = new ResizeObserver(() => {
				if (!ref?.current?.children[0]) {
					return;
				}
				if (ref.current.children[0].offsetWidth > 0 && ref.current.children[0].offsetHeight > 0) {
					setSize([ref.current.children[0].offsetWidth + "px", ref.current.children[0].offsetHeight + "px"]);
				}
			});
			observer.observe(ref.current);
			return () => observer.disconnect();
		}
	}, [active, ref.current]);

	return (
		<div className={classes(status)} ref={ref}>
			<div className={classes._body()}>{children}</div>
		</div>
	);
};

const getTransitionContentsKey = (contents) => {
	if (!contents) {
		return 0;
	}
	if (contents.key) {
		return contents.key;
	}
	const { depth = 1, page = 1, view = "normal" } = contents.props;
	return `${depth}_${page}_${view}`;
};

const getTransitionType = (prev, next) => {
	if (prev == null) {
		return "init";
	}
	if (!prev.props || !next.props) {
		return "none";
	}
	const { depth = 1, page = 1, view = "normal" } = next.props;
	const { depth: prevDeps = 1, page: prevPage = 1, view: prevView = "normal" } = prev.props;
	if (depth !== prevDeps) {
		return depth > prevDeps ? "focus" : "blur";
	} else if (page !== prevPage) {
		return page > prevPage ? "next" : "prev";
	} else {
		return view !== prevView ? "mod" : "none";
	}
};
