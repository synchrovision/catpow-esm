import * as React from "react";
import { useMemo, createContext, useCallback, useContext } from "react";
import { DataSetContext } from "./DataSet";

type progressPoint = {
	px: number;
	py: number;
};
type ChartProps = {
	width?: number;
	height?: number;
	margin?: number[];
	getValueWithProgressPoint: (r: number, c: number, progressPoint: progressPoint) => number;
	getCellWithProgressPoint: (progressPoint: progressPoint, focusedRow: number | null) => { r: number; c: number };
	children?: any;
};
export type ChartContextValue = {
	width: number;
	height: number;
	margin: number[];
	setValueWithProgressPoint: (r: number, c: number, progressPoint: progressPoint) => void;
	setActiveCellValueWithProgressPoint: (progressPoint: progressPoint) => void;
	selectCellWithProgressPoint: (progressPoint: progressPoint) => void;
};

export const ChartContext = createContext<ChartContextValue | null>(null);

export const Chart = (props: ChartProps) => {
	const { width = 640, height = 480, margin = [4, 4, 4, 4], getValueWithProgressPoint, getCellWithProgressPoint, children, ...otherProps } = props;
	const { selectCell, focusedRow, setValue, activeRow, activeColumn } = useContext(DataSetContext);

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
			selectCellWithProgressPoint,
			setValueWithProgressPoint,
			setActiveCellValueWithProgressPoint,
		}),
		[width, height, margin, selectCellWithProgressPoint, setValueWithProgressPoint, setActiveCellValueWithProgressPoint]
	);

	return <ChartContext.Provider value={chartContextValue}>{children}</ChartContext.Provider>;
};
