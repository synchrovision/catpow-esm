import { useState, useMemo, useCallback, useEffect, createContext, useRef } from "react";
import { useSlider } from "react-use";
import { useThrottle } from "../../hooks/useThrottle";
import { rangeValueConverter } from "../../util";
import { Bem } from "../Bem";
import clsx from "clsx";

export const RangeInputContext = createContext({});

export const RangeInput = (props) => {
	const { className = "cp-rangeinput", steps = { 100: 1 }, snap = false, showInputs = false, values = { value: props.value }, order = [], onChange, children, ...otherProps } = props;
	const ref = useRef(null);
	const { isSliding, value } = useSlider(ref);
	const [isStart, setIsStart] = useState(false);
	const [targetName, setTargetName] = useState(false);

	const cnv = useMemo(() => rangeValueConverter(steps, snap), [steps]);

	const { gt, lt } = useMemo(() => {
		const orderMap = { gt: {}, lt: {} };
		for (let i = 1; i < order.length; i++) {
			orderMap.lt[order[i - 1]] = order[i];
			orderMap.gt[order[i]] = order[i - 1];
		}
		return orderMap;
	}, [order]);

	const onChageCallback = useCallback(
		(key, val) => {
			if (gt[key] != null) {
				val = Math.max(val, values[gt[key]]);
			}
			if (lt[key] != null) {
				val = Math.min(val, values[lt[key]]);
			}
			onChange({ ...values, [key]: val });
		},
		[values, gt, lt, onChange]
	);

	useEffect(() => {
		if (!isSliding) {
			setTargetName(false);
		}
		setIsStart(isSliding);
	}, [isSliding]);
	useThrottle(
		() => {
			if (isStart) {
				setTargetName(
					Object.keys(values).reduce((p, c) => {
						if (p === null || Math.abs(cnv.getProgress(values[c]) - value) < Math.abs(cnv.getProgress(values[p]) - value)) {
							return c;
						}
						return p;
					}, null)
				);
				setIsStart(false);
			}
			if (targetName && onChange) {
				onChageCallback(targetName, cnv.getValue(value));
			}
		},
		50,
		[value]
	);

	return (
		<RangeInputContext.Provider value={{ values }}>
			<Bem>
				<div className={className} style={Object.keys(values).reduce((p, c) => ({ ...p, ["--pos-" + c]: cnv.getProgress(values[c]) }), {})}>
					<div className="_bar">
						<div className="_body" ref={ref}>
							{Object.keys(values).map((name) => {
								return (
									<div className={clsx("_control", `is-control-${name}`)} style={{ "--pos": cnv.getProgress(values[name]) }}>
										<div className="_value">{values[name]}</div>
									</div>
								);
							})}
						</div>
					</div>
					{showInputs && (
						<div className="_inputs">
							{Object.keys(values).map((name) => {
								return (
									<div className={clsx("_item", `is-input-${name}`)}>
										<input type="number" value={values[name]} className="_input" onChange={(e) => onChageCallback(name, e.target.value)} />
									</div>
								);
							})}
						</div>
					)}
				</div>
			</Bem>
		</RangeInputContext.Provider>
	);
};
