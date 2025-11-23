import { useState, useMemo, useEffect, createContext } from "react";
import { useSlider } from "react-use";
import { useThrottle } from "../../hooks/useThrottle";
import { rangeValueConverter } from "../../util";
import { Bem } from "../Bem";
import clsx from "clsx";

export const RangeInputContext = createContext({});

export const RangeInput = (props) => {
	const { className = "cp-rangeinput", steps = { 100: 1 }, snap = false, showInputs = false, values, onChange, children, ...otherProps } = props;
	const ref = React.useRef(null);
	const { isSliding, value } = useSlider(ref);
	const [isStart, setIsStart] = useState(false);
	const [targetName, setTargetName] = useState(false);

	const cnv = useMemo(() => rangeValueConverter(steps, snap), [steps]);

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
				onChange({ ...values, [targetName]: cnv.getValue(value) });
			}
		},
		50,
		[value]
	);

	return (
		<RangeInputContext.Provider value={{ values }}>
			<Bem>
				<div className={className} style={Object.keys(values).reduce((p, c) => ({ ...p, ["--pos-" + c]: cnv.getProgress(values[c]) }), {})}>
					<div className="_bar" ref={ref}>
						{Object.keys(values).map((name) => {
							return (
								<div className={clsx("_control", `is-control-${name}`)} style={{ "--pos": cnv.getProgress(values[name]) }}>
									<div className="_value">{values[name]}</div>
								</div>
							);
						})}
					</div>
					{showInputs && (
						<div className="_inputs">
							{Object.keys(values).map((name) => {
								return (
									<div className={clsx("_item", `is-input-${name}`)}>
										<input type="number" value={values[name]} className="_input" onChange={(e) => onChange({ ...values, [name]: e.target.value })} />
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
