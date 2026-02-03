import { AngleInput } from "catpow/component";

export const Angle = (props) => {
	const { className = "cp-jsoneditor-input-toggle", agent, onUpdate } = props;
	const { multipleOf: step = 15 } = agent.getMergedSchemaForInput();

	return (
		<div className={className}>
			<AngleInput value={agent.getValue()} step={step} onChange={onUpdate} />
		</div>
	);
};
