import * as React from "react";
import { useCallback, useEffect, useContext } from "react";
import { Bem } from "catpow/component";
import { ChartContext } from "../Chart/Chart";
import { useScratch } from "react-use";
import { DataSetContext } from "../Chart/DataSet";

type progressPoint = {
	px: number;
	py: number;
};

type ChartInputProps = {
	className?: string;
	children?: any;
};

export const ChartInput = (props: ChartInputProps) => {
	const { className = "cp-chartinput", children, ...otherProps } = props;

	const [ref, state] = useScratch();
	const { unselectCell } = useContext(DataSetContext);
	const { width, height, margin, selectCellWithProgressPoint, setActiveCellValueWithProgressPoint } = useContext(ChartContext);

	const getProgressPoint = useCallback(
		({ x = 0, y = 0, dx = 0, dy = 0, elW = 100, elH = 100 }): progressPoint => ({
			px: Math.max(0, Math.min((((x + dx) / elW) * width) / (width - margin[1] - margin[3]) - margin[3] / width, 1)),
			py: Math.max(0, Math.min((((y + dy) / elH) * height) / (height - margin[0] - margin[2]) - margin[0] / height, 1)),
		}),
		[width, height, margin]
	);

	useEffect(() => {
		if (state.isScratching) {
			selectCellWithProgressPoint(getProgressPoint(state));
		} else {
			unselectCell();
		}
	}, [state.isScratching]);

	useEffect(() => {
		if (state.isScratching) {
			setActiveCellValueWithProgressPoint(getProgressPoint(state));
		}
	}, [state]);

	return (
		<Bem>
			<div className={className} style={{ position: "absolute", inset: 0 }} ref={ref}>
				{children}
			</div>
		</Bem>
	);
};
