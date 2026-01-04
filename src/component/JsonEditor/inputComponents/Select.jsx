import { SelectBox } from "catpow/component";

export const Select = (props) => {
	const { className = "cp-jsoneditor-input-select", agent, onUpdate } = props;

	const mergedSchemaForInput = agent.getMergedSchemaForInput();

	return (
		<div className={className}>
			<SelectBox value={agent.getValue()} options={mergedSchemaForInput.options || mergedSchemaForInput.enum} onChange={onUpdate} />
		</div>
	);
};
