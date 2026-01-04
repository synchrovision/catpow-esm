import { InputDuration } from "catpow/component";

export const Duration = (props) => {
	const { className = "cp-jsoneditor-input-duration", agent, onChange, onUpdate } = props;

	return (
		<div className={className}>
			<InputDuration value={agent.getValue() || ""} onChange={onUpdate} />
		</div>
	);
};
