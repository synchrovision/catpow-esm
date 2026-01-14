import * as React from "react";

import { RadarChart } from "../Chart/RadarChart";
import { ChartInput } from "./ChartInput";

export const RadarChartInput = (props) => {
	const { children, ...otherProps } = props;
	return (
		<RadarChart {...otherProps}>
			<ChartInput />
			{children}
		</RadarChart>
	);
};
