import * as React from "react";
import { useMemo, useCallback, useContext } from "react";
import { range } from "catpow/util";
import { shape } from "catpow/graphic";
import { Bem, SVG } from "catpow/component";
import { Chart, ChartContext } from "./Chart";
import { DataSetContext } from "./DataSet";
import { clsx } from "clsx";

type point = {
	x: number;
	y: number;
};
type progressPoint = {
	px: number;
	py: number;
};
export type PolarChartProps = {
	className?: string;
	width?: number;
	height?: number;
	margin?: number[];
	children?: any;
};

const getAngleAsProgress = (px: number, py: number): number => 0.5 - Math.atan2(px - 0.5, py - 0.5) / Math.PI / 2;
const getPointOnProgress = (p1: point, p2: point, progress: number): point => ({ x: p1.x + (p2.x - p1.x) * progress, y: p1.y + (p2.y - p1.y) * progress });

export const PolarChart = (props: PolarChartProps) => {
	const { className = "cp-polarchart", children, ...otherProps } = props;
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
			const p = values[0].length * ((getAngleAsProgress(px, py) + 1 / values[0].length / 2) % 1);
			const c = Math.min(values[0].length - 1, Math.floor(p));
			if (focusedRow != null) {
				return { r: focusedRow, c };
			}
			return { r: Math.floor((p % 1) * values.length), c };
		},
		[steps, values]
	);

	return (
		<Chart getValueWithProgressPoint={getValueWithProgressPoint} getCellWithProgressPoint={getCellWithProgressPoint} {...otherProps}>
			<Bem>
				<div className={className} style={{ position: "relative" }}>
					<SVG className="_chart" width={width} height={height} style={{ width: "100%", height: "auto" }}>
						<Pies className="_pies" />
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
		x: cx + Math.sin((i + 0.5) * urad) * r,
		y: cy - Math.cos((i + 0.5) * urad) * r,
	}));

	return useMemo(
		() => (
			<Bem>
				<g className={className}>
					{[...range(steps.length - 2)].map((i) => (
						<circle cx={cx} cy={cy} r={(r / (steps.length - 1)) * (i + 1)} fill="transparent" stroke="gray" />
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

const Pies = (props) => {
	const { className } = props;
	const { steps, values, colors, classNames, activeRow, focusedRow, activeColumn } = useContext(DataSetContext);
	const { innerHeight, innerWidth, center } = useContext(ChartContext);
	const { x: cx, y: cy } = center;

	const radius = Math.min(innerHeight, innerWidth) / 2;
	const len = values.length * values[0].length;
	const srad = -Math.PI / values[0].length;
	const urad = (Math.PI * 2) / len;
	const corners = [...range(len)].map((i) => ({
		x: cx + Math.sin(srad + i * urad) * radius,
		y: cy - Math.cos(srad + i * urad) * radius,
	}));

	return (
		<Bem>
			<g className={clsx(className, { "has-focused": focusedRow != null })}>
				{values.map((row, r) => (
					<g className={clsx("_row", classNames?.rows?.[r], { "is-active": activeRow === r, "is-focused": focusedRow === r })} style={{ "--row-color": colors?.rows?.[r] } as React.CSSProperties}>
						{row.map((value, c) => {
							const progress = steps.getProgress(value);
							return (
								<path
									className={clsx("_pie", classNames?.rows?.[r], { "is-active": activeRow === r, "is-focused": focusedRow === r })}
									style={{ "--row-color": colors?.rows?.[r] } as React.CSSProperties}
									d={
										shape([
											{ x: cx, y: cy },
											{ ...getPointOnProgress(center, corners[c * values.length + r], progress), f: "L" },
											{ ...getPointOnProgress(center, corners[c * values.length + r + 1], progress), f: "A", r: radius * progress, sweep: 1 },
										]).d + " Z"
									}
									fill={colors?.rows?.[r] || "gray"}
									stroke="trnasparent"
								/>
							);
						})}
					</g>
				))}
			</g>
		</Bem>
	);
};
