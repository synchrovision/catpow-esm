export type point = {
	x: number;
	y: number;
	f?: "M" | "L" | "C" | "S" | "Q" | "T" | "A";
	p?: string;
	rx?: number;
	ry?: number;
	rotation?: number;
	large?: 0 | 1;
	sweep?: 0 | 1;
};
export const pathCommands = {
	M: ({ x, y }) => ` M ${x} ${y}`,
	L: ({ x, y }) => ` L ${x} ${y}`,
	C: ({ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }) => ` C ${x1},${y1} ${x2},${y2} ${x3},${y3}`,
	S: ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ` S ${x1},${y1} ${x2},${y2}`,
	Q: ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ` Q ${x1},${y1} ${x2},${y2}`,
	T: ({ x, y }) => ` T ${x},${y}`,
	A: ({ rx, ry, rotation = 0, large = 0, sweep = 1, x, y }) => ` A ${rx} ${ry} ${rotation} ${large} ${sweep} ${x},${y}`,
};

export const shape = (points: point[]) => ({
	points,
	get d() {
		let d = "";
		for (let i = 0; i < this.points.length; ) {
			const { x, y, f } = points[i];
			const fn = pathCommands[f];
			if (fn.length) {
				d += fn.apply(null, points.slice(i, i + fn.length));
				i += fn.length;
			} else {
				d += ` ${x},${y}`;
				i++;
			}
		}
		return d;
	},
});
