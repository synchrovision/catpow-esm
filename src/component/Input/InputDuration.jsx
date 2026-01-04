import { useMemo, useCallback, useEffect, useReducer } from "react";
import { Bem } from "catpow/component";

import clsx from "clsx";

export const InputDuration = (props) => {
	const { className = "cp-inputduration", value, onChange } = props;

	const cols = useMemo(() => {
		return {
			y: { unit: "年", min: 1, max: 100 },
			m: { unit: "月", min: 1, max: 11 },
			d: { unit: "日", min: 1, max: 31 },
			h: { unit: "時間", min: 1, max: 23 },
			i: { unit: "分", min: 1, max: 59 },
			s: { unit: "秒", min: 1, max: 59 },
		};
	}, []);

	const init = useCallback((state) => {
		state.value = props.value || "";
		return state;
	}, []);
	const reducer = useCallback((state, action) => {
		const newState = Object.assign({}, state, action);
		let value = "P";
		if (newState.y) {
			value += newState.y + "Y";
		}
		if (newState.m) {
			value += newState.m + "M";
		}
		if (newState.d) {
			value += newState.d + "D";
		}
		if (newState.h || newState.i || newState.s) {
			value += "T";
			if (newState.h) {
				value += newState.h + "H";
			}
			if (newState.i) {
				value += newState.i + "M";
			}
			if (newState.s) {
				value += newState.s + "S";
			}
		}
		newState.value = value === "P" ? "" : value;
		return newState;
	}, []);
	const [state, update] = useReducer(reducer, {}, init);

	useEffect(() => {
		if (state.value || props.value) {
			onChange(state.value);
		}
	}, [onChange, state.value]);

	return (
		<Bem>
			<div className={className}>
				{Object.keys(cols).map((key) => {
					return (
						<div className={clsx("_col", "is-col-" + key)} key={key}>
							<input type="number" className={clsx("_input", "is-input-" + key)} min={cols[key].min} max={cols[key].max} onChange={(e) => update({ [key]: e.currentTarget.value })} />
							<span className="_unit">{cols[key].unit}</span>
						</div>
					);
				})}
			</div>
		</Bem>
	);
};
