import React from "react";
import { useState, useMemo } from "react";
import { Bem } from "catpow/component";
import { clsx } from "clsx";

export const TabPanel = (props) => {
	const { className = "cp-tabpanel", children } = props;
	const [current, setCurrent] = useState(props.initialOpen || 0);

	return (
		<Bem>
			<div className={className}>
				<div className="_tabs">
					{children.map((child, index) => (
						<div className={clsx("_tab", { "is-active": current === index })} onClick={() => setCurrent(index)} key={child.key}>
							{child.key}
						</div>
					))}
				</div>
				<div className="_contents">{children[current]}</div>
			</div>
		</Bem>
	);
};
