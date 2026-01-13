import * as React from "react";

import { LineChart } from "../Chart/LineChart";
import { ChartInput } from "./ChartInput";

export const LineChartInput = (props) => {
	const { children, ...otherProps } = props;
	return (
		<LineChart {...otherProps}>
			<ChartInput />
			{children}
		</LineChart>
	);
};
