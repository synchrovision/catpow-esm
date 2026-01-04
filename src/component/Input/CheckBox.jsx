import { Bem } from "catpow/component";

import clsx from "clsx";

export const CheckBox = (props) => {
	const { className = "cp-checkbox", label, onChange } = props;

	const selected = props.selected || props.value;

	if (label) {
		return (
			<Bem>
				<div
					className={clsx(className, { "is-selected": selected })}
					onClick={(e) => {
						onChange(!selected);
					}}
					role="checkbox"
					aria-checked={selected}
				>
					<span className="_icon"> </span>
					<span className="_label">{label}</span>
				</div>
			</Bem>
		);
	}
	return (
		<Bem element={className}>
			<div
				className={clsx("_icon", { "is-selected": selected })}
				onClick={(e) => {
					onChange(!selected);
				}}
				role="checkbox"
				aria-checked={selected}
			>
				{" "}
			</div>
		</Bem>
	);
};
