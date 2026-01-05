import { useState, useMemo } from "react";
import { Bem } from "catpow/component";

import clsx from "clsx";

export const RadioButtons = (props) => {
	const { className = "cp-radiobuttons", size = "medium", onChange } = props;

	const [value, setValue] = useState(props.value ?? null);

	const options = useMemo(() => {
		if (Array.isArray(props.options)) {
			return props.options.map((option) => {
				if (typeof option === "object") {
					return option;
				}
				return { label: option, value: option };
			});
		}
		return Object.keys(props.options).map((label) => {
			return { label, value: props.options[label] };
		});
	}, [props.options]);

	return (
		<Bem>
			<div className={clsx(className, `is-size-${size}`)}>
				{options.map((option) => {
					const selected = option.value === value;
					return (
						<div
							className={clsx("_button", { "is-selected": selected })}
							onClick={(e) => {
								setValue(option.value);
								onChange(option.value);
							}}
							role="checkbox"
							aria-checked={selected}
							key={option.label}
						>
							<span className="_icon"> </span>
							<span className="_label">{option.label}</span>
						</div>
					);
				})}
			</div>
		</Bem>
	);
};
