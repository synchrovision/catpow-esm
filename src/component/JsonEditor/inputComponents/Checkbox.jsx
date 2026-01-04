import { CheckBoxes } from "catpow/component";

export const Checkbox = (props) => {
	const { className = "cp-jsoneditor-input-checkbox", agent, onUpdate } = props;

	const schema = agent.getMergedSchemaForInput();

	return (
		<div className={className}>
			<CheckBoxes value={agent.getValue()} options={schema.items.enum ?? schema.items.options} onChange={onUpdate} />
		</div>
	);
};
