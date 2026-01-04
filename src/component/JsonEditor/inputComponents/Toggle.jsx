import { Toggle as ToggleComponent } from "catpow/component";

export const Toggle = (props) => {
	const { className = "cp-jsoneditor-input-toggle", agent, onUpdate } = props;

	return (
		<div className={className}>
			<ToggleComponent value={agent.getValue()} onChange={onUpdate} />
		</div>
	);
};
