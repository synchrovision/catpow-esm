import { useCallback } from "react";

export const Date = (props) => {
	const { className = "cp-jsoneditor-input-date", agent, onChange, onUpdate } = props;

	const onChangeHandle = useCallback(
		(e) => {
			onChange(e.currentTarget.value);
		},
		[onChange]
	);
	const onUpdateHandle = useCallback(
		(e) => {
			onUpdate(e.currentTarget.value);
		},
		[onUpdate]
	);

	return (
		<div className={className}>
			<input type="date" value={agent.getValue() || ""} onChange={onChangeHandle} onBlur={onUpdateHandle} />
		</div>
	);
};
