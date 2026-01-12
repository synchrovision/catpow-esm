import * as React from "react";
import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { ChartContext } from "../Chart/Chart";
import { useThrottle } from "catpow/hooks";
import { useScratch } from "react-use";

type point = {
	x: number;
	y: number;
};
type progressPoint = {
	px: number;
	py: number;
};
type ChartInputBoxProps = {
	className?: string;
};

export const ChartInputBox = (props: ChartInputBoxProps) => {
	const { className = "cp-chartinputbox" } = props;
	const [ref, state] = useScratch();
	const { width, height, margin, unselectCell, selectCellWithProgressPoint, setActiveCellValueWithProgressPoint } = useContext(ChartContext);

	const getProgressPoint = useCallback(
		({ x = 0, y = 0, dx = 0, dy = 0, elW = 100, elH = 100 }): progressPoint => ({
			px: Math.max(0, Math.min((((x + dx) / elW) * width) / (width - margin[1] - margin[3]) - margin[3] / width, 1)),
			py: Math.max(0, Math.min((((y + dy) / elH) * height) / (height - margin[0] - margin[2]) - margin[0] / height, 1)),
		}),
		[]
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

	return <div className={className} style={{ position: "absolute", inset: "0" }} ref={ref} />;
};
