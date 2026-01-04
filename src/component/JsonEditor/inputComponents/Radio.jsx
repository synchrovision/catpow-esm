import { RadioButtons } from "catpow/component";

export const Radio = (props) => {
	const { className = "cp-jsoneditor-input-radio", agent, onUpdate } = props;

	const schema = agent.getMergedSchemaForInput();

	return (
		<div className={className}>
			<RadioButtons value={agent.getValue()} options={schema.enum ?? schema.options} onChange={onUpdate} />
		</div>
	);
};
