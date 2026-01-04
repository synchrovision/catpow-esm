import { useMemo, useCallback } from "react";
import { Bem } from "catpow/component";

import clsx from "clsx";

export const SelectTable = (props) => {
	const { className = "cp-selecttable", selections, value, onChange, spacer = 0, col = 5, multipe = false } = props;
	var i,
		items,
		values,
		fontSize,
		rows = [];
	const itemClassName = className + "__tbody-tr-td";

	const isActiveValue = useCallback(
		(val) => {
			if (Array.isArray(value)) {
				return value.includes(val);
			}
			return value === val;
		},
		[value]
	);

	if (Array.isArray(selections)) {
		items = selections.map((val) => (
			<td
				className={clsx(itemClassName, { "is-active": isActiveValue(val) })}
				onClick={() => {
					onChange(val);
				}}
				key={val}
			>
				{val}
			</td>
		));
	} else {
		items = Object.keys(selections).map((key) => (
			<td
				className={clsx(itemClassName, { "is-active": isActiveValue(selections[key]) })}
				onClick={() => {
					onChange(selections[key]);
				}}
				key={key}
			>
				{key}
			</td>
		));
	}

	const allLabels = useMemo(() => (Array.isArray(selections) ? selections : Object.keys(selections)), [selections]);
	const fontSizeClass = useMemo(() => {
		const fontSize = (360 / col - 5) / Math.max(...allLabels.map((label) => label.toString().length));
		if (fontSize > 20) {
			return "hasLargeFontSize";
		}
		if (fontSize > 10) {
			return "hasRegularFontSize";
		}
		return "hasSmallFontSize";
	}, [col, allLabels]);

	for (i = 0; i < spacer; i++) {
		items.unshift(<td className="spacer" key={`start-spacer-${i}`}></td>);
	}
	for (i = (col - (items.length % col)) % col; i > 0; i--) {
		items.push(<td className="spacer" key={`end-spacer-${i}`}></td>);
	}
	for (i = 0; i < items.length; i += col) {
		rows.push(items.slice(i, i + col));
	}
	return (
		<Bem>
			<table className={clsx(className, fontSizeClass)}>
				<tbody>
					{rows.map((row, index) => (
						<tr key={index}>{row}</tr>
					))}
				</tbody>
			</table>
		</Bem>
	);
};
