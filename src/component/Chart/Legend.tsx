import * as React from "react";
import { useContext } from "react";
import { Bem } from "catpow/component";
import { clsx } from "clsx";
import { DataSetContext } from "./DataSet";

export type LegendProps = {
	className: string;
};

export const Legend = (props: LegendProps) => {
	const { className = "cp-legend" } = props;
	const { labels, colors, classNames, focusedRow, focusRow } = useContext(DataSetContext);

	return (
		<Bem>
			{labels.rows && (
				<ul className={clsx(className, { "has-focused": focusedRow != null })}>
					{labels.rows.map((label, r) => (
						<li
							className={clsx("_item", classNames?.rows?.[r], { "is-focused": r === focusedRow })}
							onClick={() => focusRow(r === focusedRow ? null : r)}
							style={{ "--row-color": colors?.rows?.[r] } as React.CSSProperties}
						>
							{label}
						</li>
					))}
				</ul>
			)}
		</Bem>
	);
};
