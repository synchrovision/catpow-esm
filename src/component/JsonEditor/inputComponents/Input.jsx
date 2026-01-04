import { useState, useMemo, useCallback, useEffect, useContext } from "react";

import { Bem } from "catpow/component";

import { DataContext } from "../JsonEditor.tsx";
import { getInputComponentForSchema } from "../functions.js";

import clsx from "clsx";

export const Input = (props) => {
	const { className = "cp-jsoneditor-input", compact = false, level = 0, agent } = props;

	const schema = agent.getMergedSchemaForInput();
	const layout = schema.layout || props.layout || (compact ? "table" : "block");
	const size = schema.size || props.size || "medium";

	const { getAdditionalInputComponent } = useContext(DataContext);

	const { description } = schema;
	const InputComponent = useMemo(() => {
		return (getAdditionalInputComponent && getAdditionalInputComponent(schema, { layout, size, compact })) || getInputComponentForSchema(schema, { layout, size, compact });
	}, [schema, layout, size]);

	const [showMessage, setShowMessage] = useState(false);

	const onChange = useCallback(
		(value) => {
			agent.setValue(value);
			setShowMessage(false);
		},
		[agent, setShowMessage]
	);

	const onUpdate = useCallback(
		(value) => {
			agent.setValue(value);
			agent.update();
			window.requestAnimationFrame(() => {
				setShowMessage(true);
			});
		},
		[agent, setShowMessage]
	);

	const [lastChanged, setLastChanged] = useState(Date.now());

	useEffect(() => {
		const cb = (e) => {
			setLastChanged(Date.now());
		};
		agent.on("change", cb);
		return () => agent.off("change", cb);
	}, []);

	return (
		<Bem>
			<div className={clsx(className, { "is-invalid": !agent.isValid, "is-compact": compact }, `is-layout-${layout}`, `is-size-${size}`, `is-level-${level}`)} data-json-key={agent.key}>
				<div className="_body">
					{agent.getMessage() && <div className={clsx("_message", showMessage ? "is-show" : "is-hidden")}>{agent.getMessage()}</div>}
					<InputComponent agent={agent} size={size} compact={compact} level={level} onChange={onChange} onUpdate={onUpdate} lastChanged={lastChanged} />
					{description && <div className="_description">{description}</div>}
				</div>
			</div>
		</Bem>
	);
};
