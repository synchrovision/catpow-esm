import { useMemo } from "react";
import { Bem } from "catpow/component";

export const SelectBox = (props) => {
	const { className = "cp-selectbox", label, value, onChange } = props;

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
			<div className={className}>
				<select className="_select" value={value} onChange={(e) => onChange(event.target.value)}>
					{label && <option value={false}>{label}</option>}
					{options.map((option) => (
						<option value={option.value} key={option.label}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</Bem>
	);
};
