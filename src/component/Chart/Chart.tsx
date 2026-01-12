import * as React from "react";
import { useState, useMemo, useCallback, createContext } from "react";
import { rangeValueConverter, RangeValueConverterApp, range } from "catpow/util";

type point = {
	x: number;
	y: number;
};
type progressPoint = {
	px: number;
	py: number;
};

type ChartProps = {
	width?: number;
	height?: number;
	margin?: number[];
	steps?: { [key: number]: number } | RangeValueConverterApp;
	snap?: boolean;
	values?: number[][];
	labels?: string[][];
	getValueWithProgressPoint: (r: number, c: number, progressPoint: progressPoint) => number;
	getCellWithProgressPoint: (progressPoint: progressPoint) => { r: number; c: number };
	onChange?: (values: number[][]) => void;
	children?: any;
};
export type ChartContextValue = {
	width: number;
	height: number;
	margin: number[];
	steps: RangeValueConverterApp;
	labels: string[][];
	values: number[][];
	setValue: (r: number, c: number, value: number) => void;
	setActiveCellValue: (value: number) => void;
	setValueWithProgressPoint: (r: number, c: number, progressPoint: progressPoint) => void;
	setActiveCellValueWithProgressPoint: (progressPoint: progressPoint) => void;
	activeRow: number;
	setActiveRow: (r: number) => void;
	activeColumn: number;
	setActiveColumn: (c: number) => void;
	selectCell: (r: number, c: number) => void;
	unselectCell: () => void;
	selectCellWithProgressPoint: (progressPoint: progressPoint) => void;
};

export const ChartContext = createContext<ChartContextValue | null>(null);

export const Chart = (props: ChartProps) => {
	const {
		width = 640,
		height = 480,
		margin = [4, 4, 4, 4],
		steps = { 100: 1 },
		snap = true,
		labels,
		values,
		getValueWithProgressPoint,
		getCellWithProgressPoint,
		onChange,
		children,
		...otherProps
	} = props;

	const [activeRow, setActiveRow] = useState(null);
	const [activeColumn, setActiveColumn] = useState(null);
	const selectCell = useCallback(
		(r: number, c: number) => {
			setActiveRow(r);
			setActiveColumn(c);
		},
		[setActiveRow, setActiveColumn]
	);
	const unselectCell = useCallback(() => {
		setActiveRow(null);
		setActiveColumn(null);
	}, [setActiveRow, setActiveColumn]);
	const selectCellWithProgressPoint = useCallback(
		(progressPoint: progressPoint) => {
			const { r, c } = getCellWithProgressPoint(progressPoint);
			selectCell(r, c);
		},
		[selectCell, getCellWithProgressPoint]
	);

	const setValue = useCallback(
		(r: number, c: number, value: number) => {
			const newValues = [...values];
			newValues[r] = [...newValues[r]];
			newValues[r][c] = value;
			onChange(newValues);
		},
		[values, onChange]
	);
	const setActiveCellValue = useCallback(
		(value: number) => {
			setValue(activeRow, activeColumn, value);
		},
		[activeRow, activeColumn, setValue]
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

	const converter = useMemo(() => (steps.hasOwnProperty("getValue") ? steps : rangeValueConverter(steps, snap)), [steps, snap]);

	const chartContextValue = useMemo<ChartContextValue>(
		() => ({
			width,
			height,
			margin,
			steps: converter,
			values,
			labels,
			setValue,
			setActiveCellValue,
			setValueWithProgressPoint,
			setActiveCellValueWithProgressPoint,
			activeRow,
			setActiveRow,
			activeColumn,
			setActiveColumn,
			selectCell,
			unselectCell,
			selectCellWithProgressPoint,
		}),
		[
			width,
			height,
			margin,
			converter,
			values,
			labels,
			setValue,
			setActiveCellValue,
			setValueWithProgressPoint,
			setActiveCellValueWithProgressPoint,
			activeRow,
			setActiveRow,
			activeColumn,
			setActiveColumn,
			selectCell,
			unselectCell,
			selectCellWithProgressPoint,
		]
	);

	return <ChartContext.Provider value={chartContextValue}>{children}</ChartContext.Provider>;
};
