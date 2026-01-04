import { useState, useEffect } from "react";
import { Bem } from "catpow/component";

import clsx from "clsx";

export const Toggle = (props) => {
	const { className = "cp-toggle", onChange, threashold = 40 } = props;

	const [value, setValue] = useState(props.value);
	const [handler, setHandler] = useState(false);

	useEffect(() => {
		if (!handler) {
			return;
		}
		const org = { x: 0 };
		const handleTouchStart = (e) => {
			org.x = e.targetTouches[0].clientX;
		};
		const handleTouchMove = (e) => {
			setValue(e.targetTouches[0].clientX - org.x > threashold);
		};
		return () => {
			handler.removeEventListener("touchstart", handleTouchStart);
			handler.removeEventListener("touchmove", handleTouchMove);
			handler.removeEventListener("mousedown", handleTouchStart);
			handler.removeEventListener("mousemove", handleTouchMove);
		};
	}, [handler, setValue, threashold]);
	useEffect(() => {
		if (props.value !== value) {
			onChange(value);
		}
	}, [props.value, value, onChange]);

	return (
		<Bem>
			<div
				className={clsx(className, { "is-selected": value })}
				onClick={() => {
					setValue(!value);
				}}
				ref={setHandler}
			>
				<span className="_handler"></span>
			</div>
		</Bem>
	);
};
