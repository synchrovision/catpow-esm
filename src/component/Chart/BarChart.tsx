import * as React from "react";
import { useMemo, useCallback, useContext } from "react";
import { range } from "catpow/util";
import { shape } from "catpow/graphic";
import { Bem, SVG } from "catpow/component";
import { Chart, ChartContext } from "./Chart";
import { DataSetContext } from "./DataSet";
import { clsx } from "clsx";

type progressPoint = {
	px: number;
	py: number;
};
export type BarChartProps = {
	className?: string;
	width?: number;
	height?: number;
	margin?: number[];
	children?: any;
};

export const BarChart = (props: BarChartProps) => {
	const { className = "cp-barchart", children, ...otherProps } = props;
	const { width, height } = otherProps;
	const { values, steps } = useContext(DataSetContext);

	const getValueWithProgressPoint = useCallback(
		(r: number, c: number, { py }: progressPoint): number => {
			return steps.getValue(1 - py);
		},
		[steps]
	);
	const getCellWithProgressPoint = useCallback(
		({ px }: progressPoint, focusedRow: number | null): { r: number; c: number } => {
			const c = Math.min(values[0].length - 1, Math.floor(values[0].length * px));
			if (focusedRow != null) {
				return { r: focusedRow, c };
			}
			const r = Math.min(values.length - 1, Math.floor(values.length * ((px * values[0].length) % 1)));
			return { r, c };
		},
		[steps, values]
	);

	return (
		<Chart getValueWithProgressPoint={getValueWithProgressPoint} getCellWithProgressPoint={getCellWithProgressPoint} {...otherProps}>
			<Bem>
				<div className={className} style={{ position: "relative" }}>
					<SVG className="_chart" width={width} height={height} style={{ width: "100%", height: "auto" }}>
						<Bars className="_bars" />
						<Grid className="_grid" />
					</SVG>
					{children}
				</div>
			</Bem>
		</Chart>
	);
};

const Grid = (props) => {
	const { className } = props;

	const { steps, values } = useContext(DataSetContext);
	const { width, height, margin } = useContext(ChartContext);

	const x1 = margin[3];
	const x2 = width - margin[3];
	const ux = (width - margin[1] - margin[3]) / values[0].length;
	const y1 = margin[0];
	const y2 = height - margin[0];
	const uy = (height - margin[0] - margin[2]) / (steps.length - 1);

	return (
		<Bem>
			<g className={className}>
				{[...range(steps.length - 1)].map((i) => (
					<line x1={x1} y1={margin[0] + uy * i} x2={x2} y2={margin[0] + uy * i} fill="transparent" stroke="lightgray" />
				))}
				{[...range(values[0].length)].map((i) => (
					<line x1={margin[3] + ux * i} y1={y1} x2={margin[3] + ux * i} y2={y2} fill="transparent" stroke="lightgray" />
				))}
			</g>
		</Bem>
	);
};

const Bars = (props) => {
	const { className, gap = 0.1, thickness = 0.8 } = props;
	const { steps, values, colors, classNames, activeRow, focusedRow, activeColumn } = useContext(DataSetContext);
	const { width, height, margin } = useContext(ChartContext);

	const x1 = margin[3];
	const w = width - margin[1] - margin[3];
	const ux = w / values[0].length;
	const ug = (ux * gap) / 2;
	const uux = (ux * (1 - gap)) / values.length;
	const uw = uux * thickness;
	const uug = (uux * (1 - thickness)) / 2;
	const y2 = height - margin[0];
	const h = height - margin[0] - margin[2];

	const points = useMemo(() => values.map((row, r) => row.map((v, c) => ({ x: x1 + ux * c + ug + uux * r + uug, y: y2 - steps.getProgress(v) * h }))), [values]);

	return (
		<Bem>
			<g className={clsx(className, { "has-focused": focusedRow != null })}>
				{points.map((row, r) => (
					<g className={clsx("_row", classNames?.rows?.[r], { "is-active": activeRow === r, "is-focused": focusedRow === r })} style={{ "--row-color": colors?.rows?.[r] } as React.CSSProperties}>
						{row.map((p, c) => (
							<rect
								className={clsx("_bar", classNames?.columns?.[c], classNames?.cells?.[r]?.[c], { "is-active": activeRow === r && activeColumn === c })}
								x={p.x}
								y={p.y}
								width={uw}
								height={height - margin[2] - p.y}
								fill={colors?.rows?.[r] || "gray"}
							/>
						))}
					</g>
				))}
			</g>
		</Bem>
	);
};
