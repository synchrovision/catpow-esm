import * as React from "react";

import { ChartInput } from "./ChartInput";
import { BarChart } from "../Chart/BarChart";

export const BarChartInput = (props) => {
	const { children, ...otherProps } = props;
	return (
		<BarChart {...otherProps}>
			<ChartInput />
			{children}
		</BarChart>
	);
};
