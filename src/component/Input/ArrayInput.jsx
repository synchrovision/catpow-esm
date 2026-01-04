import { useMemo, forwardRef } from "react";
import { Bem } from "catpow/component";

import clsx from "clsx";

export const ArrayInput = (props) => {
	const { className = "cp-arrayinput", items, onAddItem, onCopyItem, onMoveItem, onRemoveItem, onChange, children } = props;

	const Item = useMemo(() => {
		return forwardRef((props, ref) => {
			const { className, index, length, children } = props;

			return (
				<Bem>
					<li className={className}>
						<div className="_body">
							<span>{props.id}</span>
							{children}
						</div>
						<div className="_controls">
							{index > 0 ? <div className={clsx("_button", "is-up")} onClick={() => onMoveItem(index, index - 1)}></div> : <div className="_spacer" />}
							{index < length - 1 ? <div className={clsx("_button", "is-down")} onClick={() => onMoveItem(index, index + 1)}></div> : <div className="_spacer" />}
							{length > 1 ? <div className={clsx("_button", "is-remove")} onClick={() => onRemoveItem(index)}></div> : <div className="_spacer" />}
							<div className={clsx("_button", "is-add")} onClick={() => onAddItem(index + 1)}></div>
						</div>
					</li>
				</Bem>
			);
		});
	}, [onAddItem, onCopyItem, onMoveItem, onRemoveItem, onChange]);

	return (
		<Bem>
			<div className={className}>
				<ul className="_items">
					{children.map((child, index) => (
						<Item className="_item" index={index} length={children.length} key={index}>
							{child}
						</Item>
					))}
				</ul>
			</div>
		</Bem>
	);
};
