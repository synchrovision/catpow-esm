export const ReadOnly = (props) => {
	const { className = "cp-jsoneditor-input-readonly", agent, onChange, onUpdate } = props;

	return <div className={className}>{agent.getValue() || ""}</div>;
};
