import { useState, useEffect } from "react";
import { useScratch } from "react-use";
import { Bem } from "../Bem";
import { useThrottle } from "../../hooks/useThrottle";

export const PositionInput = (props) => {
	const { className = "cp-positioninput", width = 100, height = 100, margin = 10, grid = 10, snap = false, x = 50, y = 50, r = 6, onChange, ...otherProps } = props;
	const [ref, state] = useScratch();

	const [pos, setPos] = useState({ x, y });

	useThrottle(() => onChange({ x: pos.x, y: pos.y }), 50, [pos.x, pos.y]);
	useEffect(() => {
		if (!state.isScratching) {
			return;
		}
		let x = parseInt(Math.max(0, Math.min(state.x + state.dx - margin, width)));
		let y = parseInt(Math.max(0, Math.min(state.y + state.dy - margin, height)));
		if (isNaN(x) || isNaN(y)) {
			return;
		}
		if (snap) {
			x = Math.round(x / grid) * grid;
			y = Math.round(y / grid) * grid;
		}
		setPos({ x, y });
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
			>
				<rect className="_bg" x={margin} y={margin} width={width} height={height} fill="none" stroke="currentColor" strokeOpacity={0.5} />
				<circle fill="none" stroke="currentColor" strokeOpacity={0.75} className="_circle" cx={pos.x + margin} cy={pos.y + margin} r={r} />
				<circle fill="currentColor" className="_dot" cx={pos.x + margin} cy={pos.y + margin} r={2} />
				{grid > 0 && (
					<>
						{Array.from({ length: Math.floor(width / grid) }, (_, i) => (
							<line key={i} stroke="currentColor" strokeOpacity={0.1} className="_grid" x1={i * grid + margin} y1={margin} x2={i * grid + margin} y2={height + margin} />
						))}
						{Array.from({ length: Math.floor(height / grid) }, (_, i) => (
							<line key={i} stroke="currentColor" strokeOpacity={0.1} className="_grid" x1={margin} y1={i * grid + margin} x2={width + margin} y2={i * grid + margin} />
						))}
						<line stroke="currentColor" strokeOpacity={0.2} className="_grid is-center" x1={width / 2 + margin} y1={margin} x2={width / 2 + margin} y2={height + margin} />
						<line stroke="currentColor" strokeOpacity={0.2} className="_grid is-center" x1={margin} y1={height / 2 + margin} x2={width + margin} y2={height / 2 + margin} />
					</>
				)}
			</svg>
		</Bem>
	);
};
