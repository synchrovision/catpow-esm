import { useMemo, useEffect } from "react";
import { useScratch } from "react-use";
import { Bem } from "../Bem";
import { useThrottle } from "catpow/hooks";
import { phasedRange } from "catpow/util";

export const StepInput = (props) => {
	const { className = "cp-stepinput", width = 240, height = 20, margin = 5, steps = { 6: 1, 10: 2, 60: 10, 100: 20 }, value = 1, onChange, ...otherProps } = props;
	const [ref, state] = useScratch();

	const values = useMemo(() => phasedRange(steps), [steps]);
	useThrottle(() => onChange({ ...range }), 50, [range.min, range.max]);
	useEffect(() => {
		if (!state.isScratching) {
			return;
		}
	}, [state.dx, state.dy]);
	return (
		<Bem>
			<svg
				className={className}
				width={width + margin * 2}
				height={height + margin * 2}
				viewBox={`0 0 ${width + margin * 2} ${height + margin * 2}`}
				xmlns="http://www.w3.org/2000/svg"
				ref={ref}
				style={{ cursor: state.isScratching ? "grabbing" : "grab" }}
				{...otherProps}
			></svg>
		</Bem>
	);
};
