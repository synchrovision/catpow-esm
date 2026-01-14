import * as React from "react";

import { PolarChart } from "../Chart/PolarChart";
import { ChartInput } from "./ChartInput";

export const PolarChartInput = (props) => {
	const { children, ...otherProps } = props;
	return (
		<PolarChart {...otherProps}>
			<ChartInput />
			{children}
		</PolarChart>
	);
};
