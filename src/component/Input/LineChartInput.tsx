import * as React from "react";
import { Bem } from "catpow/component";
import { LineChart, LineChartProps } from "../Chart/LineChart";
import { ChartInputBox } from "./ChartInputBox";

export const LineChartInput = (props: LineChartProps) => {
	const { className = "cp-linechartinput", children, ...otherProps } = props;

	return (
		<Bem>
			<div className={className} style={{ position: "relative" }}>
				<LineChart className="-chart" {...otherProps}>
					<ChartInputBox />
				</LineChart>
			</div>
		</Bem>
	);
};
