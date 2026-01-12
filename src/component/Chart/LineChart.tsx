import * as React from "react";
import { useState, useMemo, useCallback, useContext, forwardRef } from "react";
import { range, rangeValueConverter } from "catpow/util";
import { shape } from "catpow/graphic";
import { Bem, SVG } from "catpow/component";
import { Chart, ChartContext } from "./Chart";
import { clsx } from "clsx";

type progressPoint = {
	px: number;
	py: number;
};
export type LineChartProps = {
	className: string;
	width?: number;
	height?: number;
	margin?: number[];
	steps?: { [key: number]: number };
	snap?: boolean;
	values?: number[][];
	labels?: string[][];
	onChange: (values: number[][]) => void;
	children: any;
};

export const LineChart = (props: LineChartProps) => {
	const { className = "cp-linechart", width = 640, height = 480, margin = [4, 4, 4, 4], steps = { 100: 1 }, snap = true, values, onChange, children, ...otherProps } = props;

	const cnv = useMemo(() => rangeValueConverter(steps, snap), [steps, snap]);

	const getValueWithProgressPoint = useCallback(
		(r: number, c: Number, { py }: progressPoint): number => {
			return cnv.getValue(1 - py);
		},
		[cnv]
	);
	const getCellWithProgressPoint = useCallback(
		({ px, py }: progressPoint): { r: number; c: number } => {
			const c = Math.min(values[0].length - 1, Math.floor(values[0].length * px));
			let r = 0;
			let oy = 1 - py;
			let minD = Math.abs(cnv.getProgress(values[0][c]) - oy);
			for (let i = 1; i < values.length; i++) {
				const d = Math.abs(cnv.getProgress(values[i][c]) - oy);
				if (d < minD) {
					minD = d;
					r = i;
				}
			}
			return { r, c };
		},
		[values]
	);

	return (
		<Chart
			width={width}
			height={height}
			margin={margin}
			values={values}
			steps={cnv}
			getValueWithProgressPoint={getValueWithProgressPoint}
			getCellWithProgressPoint={getCellWithProgressPoint}
			onChange={onChange}
			{...otherProps}
		>
			<Bem>
				<SVG className={className} width={width} height={height} style={{ width: "100%", height: "auto" }}>
					<Lines className="_lines" />
					<Grid className="_grid" />
				</SVG>
			</Bem>
			{children}
		</Chart>
	);
};

const Grid = (props) => {
	const { className } = props;
	const { width, height, margin, steps, values } = useContext(ChartContext);

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
					<line x1={x1} y1={margin[0] + uy * i} x2={x2} y2={margin[0] + uy * i} fill="transparent" stroke="gray" />
				))}
				{[...range(values[0].length)].map((i) => (
					<line x1={margin[3] + ux * i} y1={y1} x2={margin[3] + ux * i} y2={y2} fill="transparent" stroke="gray" />
				))}
			</g>
		</Bem>
	);
};

const Lines = (props) => {
	const { className } = props;
	const { width, height, margin, steps, values, activeRow, activeColumn } = useContext(ChartContext);

	const x1 = margin[3];
	const w = width - margin[1] - margin[3];
	const ux = w / values[0].length;
	const y2 = height - margin[0];
	const h = height - margin[0] - margin[2];

	const points = useMemo(() => values.map((row) => row.map((v, c) => ({ x: x1 + ux * (c + 0.5), y: y2 - steps.getProgress(v) * h }))), [values]);

	return (
		<Bem>
			<g className={className}>
				{points.map((row, r) => (
					<g className={clsx("_line", { "is-active": activeRow === r })}>
						<path d={shape(row).d} fill="transparent" stroke="gray" />
						{row.map((p, c) => (
							<circle className={clsx("_circle", { "is-active": activeRow === r && activeColumn === c })} cx={p.x} cy={p.y} r={4} />
						))}
					</g>
				))}
			</g>
		</Bem>
	);
};
