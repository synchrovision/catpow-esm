declare global {
	function setInterval(callback: Function, interval: number): number;
	function setTimeout(callback: Function, timeout: number): number;
	function clearTimeout(timer: number): void;
}

import React from "react";
import { useState, useCallback, useMemo, useEffect, createContext } from "react";

import { ObjectInput } from "./inputComponents/ObjectInput.jsx";
import { Input } from "./inputComponents/Input.jsx";
import { Bem } from "catpow/component";
import { schema } from "catpow/schema";
import clsx from "clsx";
export const DataContext = createContext({});

type JsonEditorProps = {
	className?: string;
	title?: string;
	debug?: boolean;
	schema: object | string;
	onChange: Function;
	autoSave?: boolean;
	json?: object | string;
	showHeader?: boolean;
	children?: Function;
};

export const JsonEditor = (props: JsonEditorProps) => {
	const { className = "cp-jsoneditor-editor", title = "JsonEditor", debug = false, onChange, autoSave = false, showHeader = true, children: getAdditionalInputComponent } = props;

	const [hasChange, setHasChange] = useState(false);
	const json = useMemo(() => {
		if (typeof props.json === "object") {
			return props.json;
		}
		if (props.json == null) {
			return {};
		}
		const json = JSON.parse(props.json);
		if (json == null) {
			return {};
		}
		return json;
	}, []);

	const rootAgent = useMemo(() => {
		const rootAgent = schema(props.schema, { debug }).createAgent(json);
		rootAgent.on("change", (e) => {
			setHasChange(true);
		});
		return rootAgent;
	}, [props.schema]);

	const save = useCallback(() => {
		onChange(typeof props.json === "object" ? rootAgent.value : JSON.stringify(rootAgent.value));
		setHasChange(false);
	}, [rootAgent, setHasChange, onChange]);

	const data = useMemo(() => {
		return { getAdditionalInputComponent };
	}, [getAdditionalInputComponent]);

	useEffect(() => {
		let timer,
			isHold = false;
		const cb = (e) => {
			if (autoSave) {
				if (!isHold) {
					save();
					isHold = true;
					setTimeout(
						() => {
							isHold = false;
						},
						autoSave === true ? 1000 : autoSave
					);
				} else {
					clearTimeout(timer);
					timer = setTimeout(save, autoSave === true ? 1000 : autoSave);
				}
			}
		};
		rootAgent.on("update", cb);
		return () => rootAgent.off("update", cb);
	}, [rootAgent, setHasChange, save]);

	return (
		<DataContext.Provider value={data}>
			<Bem>
				<div className={className}>
					<div className="_body">
						{showHeader && (
							<div className="_header">
								<div className="_title">{title}</div>
								<div className="_controls">
									<div className={clsx("_save", { "is-active": hasChange })} onClick={() => save()}>
										Save
									</div>
								</div>
							</div>
						)}
						<div className="_contents">
							<ObjectInput agent={rootAgent} />
						</div>
					</div>
				</div>
			</Bem>
		</DataContext.Provider>
	);
};

JsonEditor.Input = Input;
JsonEditor.DataContext = DataContext;
