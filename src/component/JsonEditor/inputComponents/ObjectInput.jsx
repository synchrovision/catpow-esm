import { useMemo, useCallback, useState } from "react";
import { Input } from "./Input.jsx";
import { Bem, Popover } from "catpow/component";
import clsx from "clsx";

export const ObjectInput = (props) => {
	const { className = "cp-jsoneditor-input-objectinput", compact = false, popoverSize = "large", level = 0, agent, lastChanged } = props;

	const schema = agent.getMergedSchemaForInput();
	const layout = schema.layout || props.layout || "block";
	const size = schema.size || props.size || "medium";

	const InputComponent = useMemo(() => {
		const InputBodyComponent = (() => {
			const stateClassNames = `is-layout-${layout} is-size-${size} is-level-${level}`;
			switch (layout) {
				case "block": {
					return (props) => {
						const { agent } = props;
						const schema = agent.getMergedSchemaForInput();
						return (
							<Bem block={className}>
								<div className={"-block " + stateClassNames}>
									{Object.keys(schema.properties).map((name) => {
										if (agent.properties[name] == null || agent.properties[name].getMergedSchemaForInput().hidden) {
											return false;
										}
										const schema = agent.properties[name].getMergedSchemaForInput();
										return (
											<div className="_item" key={name}>
												<div className="_title">{schema.title || schema.key || name}</div>
												<div className="_body">
													<Input agent={agent.properties[name]} level={level + 1} layout={layout} size={size} />
												</div>
											</div>
										);
									})}
								</div>
							</Bem>
						);
					};
				}
				case "table": {
					return (props) => {
						const { agent } = props;
						const schema = agent.getMergedSchemaForInput();
						return (
							<Bem block={className}>
								<table className={"-table " + stateClassNames}>
									<tbody>
										{Object.keys(schema.properties).map((name) => {
											if (agent.properties[name] == null || agent.properties[name].getMergedSchemaForInput().hidden) {
												return false;
											}
											const schema = agent.properties[name].getMergedSchemaForInput();
											return (
												<tr className="_tr" key={name}>
													<th className="_th">{schema.title || schema.key}</th>
													<td className="_td">
														<Input agent={agent.properties[name]} level={level + 1} layout={layout} size={size} />
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</Bem>
						);
					};
				}
				case "inline": {
					return (props) => {
						const { agent } = props;
						const schema = agent.getMergedSchemaForInput();
						return (
							<Bem block={className}>
								<div className={"-row " + stateClassNames}>
									{Object.keys(schema.properties).map((name) => {
										if (agent.properties[name] == null || agent.properties[name].getMergedSchemaForInput().hidden) {
											return false;
										}
										const schema = agent.properties[name].getMergedSchemaForInput();
										return (
											<div className="_item" key={name}>
												<div className="_title">{schema.title || schema.key}</div>
												<div className="_body">
													<Input agent={agent.properties[name]} level={level + 1} layout={layout} size={size} />
												</div>
											</div>
										);
									})}
								</div>
							</Bem>
						);
					};
				}
			}
		})();
		if (compact) {
			return (props) => {
				const { agent } = props;
				const schema = agent.getMergedSchemaForInput();
				const [open, setOpen] = useState(false);
				const onClose = useCallback(() => setOpen(false), [setOpen]);

				const getLabel = useMemo(() => {
					if (!schema.label) {
						return () => schema.title || schema.key;
					}
					if (schema.label.includes("{")) {
						return (agent) =>
							schema.label.replaceAll(/{(.+?)}/g, (match, p1) => {
								const names = p1.split("|");
								for (let name of names) {
									if (/^("|').+\1$/.test(name)) {
										return name.slice(1, -1);
									}
									if (agent.properties[name]) {
										let value = agent.properties[name].getValue();
										if (value) {
											return value;
										}
									}
								}
								return "";
							});
					}
					return () => schema.label;
				}, [schema.label]);
				const label = getLabel(agent);

				return (
					<Bem>
						<div className={clsx(className, `is-layout-${layout}`, `is-size-${size}`, `is-level-${level}`, open ? "is-open" : "is-close")}>
							<div className="_label" onClick={() => setOpen(!open)}>
								{label}
							</div>
							<Popover open={open} size={popoverSize} onClose={onClose} closeButton={true} closeOnClickAway={false}>
								<div className="_body">
									<InputBodyComponent agent={agent} />
								</div>
							</Popover>
						</div>
					</Bem>
				);
			};
		}
		return InputBodyComponent;
	}, [layout, size, compact, popoverSize, level]);

	if (schema.properties == null) {
		return <div className={className + "__message"}></div>;
	}

	return <InputComponent agent={agent} />;
};
