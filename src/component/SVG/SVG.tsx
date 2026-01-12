import * as React from "react";
import { useMemo, createContext } from "react";

type SVGColorContextValueModel = {
	h: number;
	s: number;
	l: number;
};
type SVGScreenContextValueModel = {
	width: number;
	height: number;
	flex: boolean;
};

export const SVGColorsContext = createContext<SVGColorContextValueModel | null>({ h: 20, s: 80, l: 80 });
export const SVGScreenContext = createContext<SVGScreenContextValueModel | null>({ width: 1200, height: 400, flex: false });

export const SVG = (props) => {
	const { className = "cp-svg", width = 1200, height = 400, colors = { h: 20, s: 80, l: 80 }, children, ...otherProps } = props;

	const ScreenValue = useMemo(() => ({ width, height, flex: false }), [width, height]);

	return (
		<SVGColorsContext.Provider value={colors}>
			<SVGScreenContext.Provider value={ScreenValue}>
				<svg className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" {...otherProps}>
					{children}
				</svg>
			</SVGScreenContext.Provider>
		</SVGColorsContext.Provider>
	);
};
