import { useMemo, useCallback } from "react";
import { Bem } from "catpow/component";

export const Textarea = (props) => {
	const { className = "cp-jsoneditor-input-textarea", agent, onChange, onUpdate } = props;

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
		[onChange]
	);

	const { cols, rows } = useMemo(() => {
		const schema = agent.getMergedSchemaForInput();
		const { cols, rows } = schema;
		return { cols, rows };
	}, [agent.getMergedSchemaForInput()]);

	return (
		<Bem>
			<div className={className}>
				<textarea className="_textarea" onChange={onChangeHandle} onBlur={onUpdateHandle} value={agent.getValue() || ""} cols={cols} rows={rows} />
			</div>
		</Bem>
	);
};
