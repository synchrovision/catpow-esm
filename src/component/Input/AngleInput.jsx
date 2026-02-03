import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useScratch } from "react-use";
import { useThrottle } from "../../hooks/useThrottle";
import { Bem } from "../Bem";
import clsx from "clsx";

export const AngleInput = (props) => {
	const { className = "cp-angleinput", step = 15, snap = false, showInputs = false, value: originalValue, order = [], onChange, children, ...otherProps } = props;
	const [ref, state] = useScratch();
	const [value, setValue] = useState(originalValue);

	useEffect(() => {
		const { x, y, dx, dy, elW, elH } = state;
		if (isNaN(dx) || isNaN(dy)) {
			return;
		}
		setValue(Math.round(((Math.atan2(elW / 2 - (x + dx), y + dy - elH / 2) / Math.PI) * 180) / step) * step + 180);
	}, [state.dx, state.dy]);
	useThrottle(
		() => {
			console.log({ originalValue, value });
			onChange(value);
		},
		50,
		[value],
	);

	return (
		<Bem>
			<div className={className} style={{ "--angle": value }}>
				<div className="_circle" ref={ref}>
					<div className="_handler"></div>
				</div>
				{showInputs && (
					<div className="_inputs">
						<input type="number" value={value} className="_input" min={0} max={360} step={step} onChange={(e) => setValue(e.target.value)} />
					</div>
				)}
			</div>
		</Bem>
	);
};
