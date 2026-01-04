import { useMemo, forwardRef } from "react";

import { Bem } from "catpow/component";

export const TableInput = (props) => {
	const { className = "cp-tableinput", labels, items, onAddItem, onCopyItem, onMoveItem, onRemoveItem, onChange, children } = props;
	const classes = useMemo(() => bem(className), [className]);

	const Row = useMemo(() => {
		return forwardRef((props, ref) => {
			const { className, index, length, children } = props;

			return (
				<Bem>
					<tr className={className}>
						{children.map((child, index) => (
							<td className="_td is-input" key={index}>
								{child}
							</td>
						))}
						<td className="_td is-control" key={index}>
							<div className="_controls">
								{index > 0 ? <div className="_button is-up" onClick={() => onMoveItem(index, index - 1)}></div> : <div className="_spacer" />}
								{index < length - 1 ? <div className="_button is-down" onClick={() => onMoveItem(index, index + 1)}></div> : <div className="_spacer" />}
								{length > 1 ? <div className="_buttonz is-remove" onClick={() => onRemoveItem(index)}></div> : <div className="_spacer" />}
								<div className="_button is-add" onClick={() => onAddItem(index + 1)}></div>
							</div>
						</td>
					</tr>
				</Bem>
			);
		});
	}, [onAddItem, onCopyItem, onMoveItem, onRemoveItem, onChange]);

	return (
		<Bem>
			<div className={className}>
				<table>
					{labels && (
						<thead>
							<tr>
								{labels.map((label, index) => (
									<th key={index}>{label}</th>
								))}
								<td />
							</tr>
						</thead>
					)}
					<tbody>
						{children.map((child, index) => (
							<Row className="_tr" index={index} length={children.length} key={index}>
								{child}
							</Row>
						))}
					</tbody>
				</table>
			</div>
		</Bem>
	);
};
