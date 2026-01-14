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
export type RadarChartProps = {
	className?: string;
	width?: number;
	height?: number;
	margin?: number[];
	children?: any;
};

const getAngleAsProgress = (px: number, py: number): number => 0.5 - Math.atan2(px - 0.5, py - 0.5) / Math.PI / 2;

export const RadarChart = (props: RadarChartProps) => {
	const { className = "cp-radarchart", children, ...otherProps } = props;
	const { width, height } = otherProps;
	const { values, steps } = useContext(DataSetContext);

	const getValueWithProgressPoint = useCallback(
		(r: number, c: number, { px, py }: progressPoint): number => {
			return steps.getValue(Math.hypot(px - 0.5, py - 0.5) * 2);
		},
		[steps]
	);
	const getCellWithProgressPoint = useCallback(
		({ px, py }: progressPoint, focusedRow: number | null): { r: number; c: number } => {
			const c = Math.min(values[0].length - 1, Math.floor(values[0].length * ((getAngleAsProgress(px, py) + 1 / values[0].length / 2) % 1)));
			if (focusedRow != null) {
				return { r: focusedRow, c };
			}
			let r = 0;
			let o = Math.hypot(px - 0.5, py - 0.5) * 2;
			let minD = Math.abs(steps.getProgress(values[0][c]) - o);
			for (let i = 1; i < values.length; i++) {
				const d = Math.abs(steps.getProgress(values[i][c]) - o);
				if (d < minD) {
					minD = d;
					r = i;
				}
			}
			return { r, c };
		},
		[steps, values]
	);

	return (
		<Chart getValueWithProgressPoint={getValueWithProgressPoint} getCellWithProgressPoint={getCellWithProgressPoint} {...otherProps}>
			<Bem>
				<div className={className} style={{ position: "relative" }}>
					<SVG className="_chart" width={width} height={height} style={{ width: "100%", height: "auto" }}>
						<Lines className="_lines" />
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
	const {
		innerHeight,
		innerWidth,
		center: { x: cx, y: cy },
	} = useContext(ChartContext);

	const r = Math.min(innerHeight, innerWidth) / 2;
	const urad = (Math.PI * 2) / values[0].length;
	const corners = [...range(values[0].length - 1)].map((i) => ({
		x: cx + Math.sin(i * urad) * r,
		y: cy - Math.cos(i * urad) * r,
	}));

	return useMemo(
		() => (
			<Bem>
				<g className={className}>
					{[...range(steps.length - 1)].map((i) => (
						<path
							d={
								shape(
									corners.map((p) => ({
										x: cx + ((p.x - cx) / steps.length) * (i + 1),
										y: cy + ((p.y - cy) / steps.length) * (i + 1),
									}))
								).d + " Z"
							}
							fill="transparent"
							stroke="gray"
						/>
					))}
					{corners.map(({ x, y }) => (
						<line x1={cx} y1={cy} x2={x} y2={y} fill="transparent" stroke="gray" />
					))}
				</g>
			</Bem>
		),
		[]
	);
};

const Lines = (props) => {
	const { className } = props;
	const { steps, values, colors, classNames, activeRow, focusedRow, activeColumn } = useContext(DataSetContext);
	const {
		innerHeight,
		innerWidth,
		center: { x: cx, y: cy },
	} = useContext(ChartContext);

	const r = Math.min(innerHeight, innerWidth) / 2;
	const urad = (Math.PI * 2) / values[0].length;
	const corners = [...range(values[0].length - 1)].map((i) => ({
		x: cx + Math.sin(i * urad) * r,
		y: cy - Math.cos(i * urad) * r,
	}));

	return (
		<Bem>
			<g className={clsx(className, { "has-focused": focusedRow != null })}>
				{values.map((row, r) => (
					<path
						className={clsx("_line", classNames?.rows?.[r], { "is-active": activeRow === r, "is-focused": focusedRow === r })}
						style={{ "--row-color": colors?.rows?.[r] } as React.CSSProperties}
						d={
							shape(
								corners.map((p, c) => {
									const progress = steps.getProgress(row[c]);
									return {
										x: cx + (p.x - cx) * progress,
										y: cy + (p.y - cy) * progress,
									};
								})
							).d + " Z"
						}
						fill={colors?.rows?.[r] || "gray"}
						fillOpacity={0.2}
						stroke={colors?.rows?.[r] || "gray"}
					/>
				))}
			</g>
		</Bem>
	);
};
