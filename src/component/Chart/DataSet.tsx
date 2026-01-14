import * as React from "react";
import { useState, useMemo, useCallback, createContext, ReactNode } from "react";
import { rangeValueConverter, RangeValueConverterApp } from "catpow/util";

type dataSetConfig = {
	rows?: string[];
	columns?: string[];
	cells?: string[][];
};

type DataSetProps = {
	labels?: dataSetConfig;
	colors?: dataSetConfig;
	classNames?: dataSetConfig;
	translateToDisplayValue?: (value: number, ctx: { r: number; c: number; className?: string; label?: string; color?: string }) => ReactNode;
	values?: number[][];
	steps?: { [key: number]: number } | RangeValueConverterApp;
	snap?: boolean;
	onChange?: (values: number[][]) => void;
	children?: any;
};
export type DataSetContextValue = {
	labels?: dataSetConfig;
	colors?: dataSetConfig;
	classNames?: dataSetConfig;
	values: number[][];
	steps: RangeValueConverterApp;
	setValue: (r: number, c: number, value: number) => void;
	getDisplayValue: (r: number, c: number) => ReactNode;
	setActiveCellValue: (value: number) => void;
	activeRow: number;
	setActiveRow: (r: number) => void;
	activeColumn: number;
	setActiveColumn: (c: number) => void;
	focusedRow: number | null;
	focusRow: (r: number | null) => void;
	selectCell: (r: number, c: number) => void;
	unselectCell: () => void;
};

export const DataSetContext = createContext<DataSetContextValue | null>(null);

export const DataSet = (props: DataSetProps) => {
	const { labels, colors, classNames, translateToDisplayValue, values, steps = { 100: 1 }, snap = true, onChange, children, ...otherProps } = props;

	const [activeRow, setActiveRow] = useState(null);
	const [activeColumn, setActiveColumn] = useState(null);
	const [focusedRow, focusRow] = useState(null);
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

	const setValue = useCallback(
		(r: number, c: number, value: number) => {
			const newValues = [...values];
			newValues[r] = [...newValues[r]];
			newValues[r][c] = value;
			onChange(newValues);
		},
		[values, onChange]
	);
	const getDisplayValue = useCallback(
		(r: number, c: number) => {
			if (translateToDisplayValue == null) {
				return values[r][c];
			}
			return translateToDisplayValue(values[r][c], {
				r,
				c,
				className: classNames?.cells?.[r]?.[c],
				label: labels?.cells?.[r]?.[c],
				color: colors?.cells?.[r]?.[c] || colors?.columns?.[c] || colors?.rows?.[r],
			});
		},
		[values, translateToDisplayValue]
	);

	const setActiveCellValue = useCallback(
		(value: number) => {
			setValue(activeRow, activeColumn, value);
		},
		[activeRow, activeColumn, setValue]
	);
	const converter = useMemo(() => (steps.hasOwnProperty("getValue") ? steps : rangeValueConverter(steps, snap)), [steps, snap]);

	const DataSetContextValue = useMemo<DataSetContextValue>(
		() => ({
			values,
			labels,
			colors,
			classNames,
			getDisplayValue,
			steps: converter,
			setValue,
			setActiveCellValue,
			activeRow,
			setActiveRow,
			activeColumn,
			setActiveColumn,
			focusedRow,
			focusRow,
			selectCell,
			unselectCell,
		}),
		[
			values,
			labels,
			colors,
			classNames,
			getDisplayValue,
			converter,
			setValue,
			setActiveCellValue,
			activeRow,
			setActiveRow,
			activeColumn,
			setActiveColumn,
			focusedRow,
			focusRow,
			selectCell,
			unselectCell,
		]
	);

	return <DataSetContext.Provider value={DataSetContextValue}>{children}</DataSetContext.Provider>;
};
