import { PositionInput } from "catpow/component";

export const Position = (props) => {
	const { className = "cp-jsoneditor-input-toggle", agent, onUpdate } = props;
	const { width = 100, height = 100, margin = 10, grid = 10, snap = true } = agent.getMergedSchemaForInput();

	return (
		<div className={className}>
			<PositionInput value={agent.getValue()} width={width} height={height} margin={margin} grid={grid} snap={snap} onChange={onUpdate} />
		</div>
	);
};
