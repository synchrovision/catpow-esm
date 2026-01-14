import * as React from "react";
import { useMemo, createContext, useCallback, useContext } from "react";
import { DataSetContext } from "./DataSet";
import { range } from "catpow/util";

type progressPoint = {
	px: number;
	py: number;
};
type ChartProps = {
	width?: number;
	height?: number;
	margin?: number | number[];
	getValueWithProgressPoint: (r: number, c: number, progressPoint: progressPoint) => number;
	getCellWithProgressPoint: (progressPoint: progressPoint, focusedRow: number | null) => { r: number; c: number };
	children?: any;
};
export type ChartContextValue = {
	width: number;
	height: number;
	margin: number[];
	innerHeight: number;
	innerWidth: number;
	top: number;
	bottom: number;
	left: number;
	right: number;
	center: { x: number; y: number };
	setValueWithProgressPoint: (r: number, c: number, progressPoint: progressPoint) => void;
	setActiveCellValueWithProgressPoint: (progressPoint: progressPoint) => void;
	selectCellWithProgressPoint: (progressPoint: progressPoint) => void;
};

export const ChartContext = createContext<ChartContextValue | null>(null);

export const Chart = (props: ChartProps) => {
	const { width = 640, height = 480, margin: originalMargin = [4, 4, 4, 4], getValueWithProgressPoint, getCellWithProgressPoint, children, ...otherProps } = props;
	const { selectCell, focusedRow, setValue, activeRow, activeColumn } = useContext(DataSetContext);

	const margin = useMemo(() => {
		if (!Array.isArray(originalMargin)) {
			return [...range(4)].fill(originalMargin);
		}
		const margin = [...originalMargin];
		if (margin[3] == null) {
			if (margin[2] == null) {
				if (margin[1] == null) {
					margin[1] = margin[0];
				}
				margin[2] = margin[0];
			}
			margin[3] = margin[1];
		}
		return margin;
	}, [originalMargin]);
	const sizeValues = useMemo(() => {
		const top = margin[0];
		const bottom = height - margin[2];
		const left = margin[3];
		const right = margin[0];
		const innerHeight = height - margin[0] - margin[2];
		const innerWidth = width - margin[1] - margin[3];
		const center = { x: left + innerWidth / 2, y: top + innerHeight / 2 };
		return { top, bottom, left, right, center, innerHeight, innerWidth };
	}, [width, height, margin]);

	const selectCellWithProgressPoint = useCallback(
		(progressPoint: progressPoint) => {
			const { r, c } = getCellWithProgressPoint(progressPoint, focusedRow);
			selectCell(r, c);
		},
		[selectCell, getCellWithProgressPoint, focusedRow]
	);
	const setValueWithProgressPoint = useCallback(
		(r: number, c: number, progressPoint: progressPoint) => {
			setValue(r, c, getValueWithProgressPoint(r, c, progressPoint));
		},
		[setValue, getValueWithProgressPoint]
	);
	const setActiveCellValueWithProgressPoint = useCallback(
		(progressPoint: progressPoint) => {
			if (activeRow == null || activeColumn == null) {
				return;
			}
			setValueWithProgressPoint(activeRow, activeColumn, progressPoint);
		},
		[activeRow, activeColumn, setValueWithProgressPoint]
	);

	const chartContextValue = useMemo<ChartContextValue>(
		() => ({
			width,
			height,
			margin,
			...sizeValues,
			selectCellWithProgressPoint,
			setValueWithProgressPoint,
			setActiveCellValueWithProgressPoint,
		}),
		[width, height, margin, sizeValues, selectCellWithProgressPoint, setValueWithProgressPoint, setActiveCellValueWithProgressPoint]
	);

	return <ChartContext.Provider value={chartContextValue}>{children}</ChartContext.Provider>;
};
