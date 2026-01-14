import * as React from "react";
import { useMemo, useCallback, useContext } from "react";
import { Bem, SVG } from "catpow/component";
import { DataSetContext } from "./DataSet";
import { clsx } from "clsx";

type DataTableProps = {
	className?: string;
};

export const DataTable = (props: DataTableProps) => {
	const { className = "cp-datatabel", ...otherProps } = props;
	const { labels, classNames, colors, values, getDisplayValue } = useContext(DataSetContext);

	return (
		<Bem>
			<div className={className}>
				<table>
					{labels.columns && (
						<thead>
							<tr>
								{labels.rows && <td></td>}
								{labels.columns.map((label) => (
									<th>{label}</th>
								))}
							</tr>
						</thead>
					)}
					<tbody>
						{values.map((row, r) => (
							<tr>
								{labels.rows && <th>{labels.rows[r]}</th>}
								{row.map((v, c) => (
									<td>{getDisplayValue(r, c)}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Bem>
	);
};
