type point = { x: number; y: number };

export const getNearestPoint = ({ x: ox, y: oy }: point, points: point[]) => {
	const getD = ({ x, y }) => Math.pow(x - ox, 2) + Math.pow(y - oy, 2);
	let d: number;
	let minD = getD(points[0]);
	return points.slice(1).reduce((p, c) => {
		if (minD > (d = getD(c))) {
			minD = d;
			return c;
		}
		return p;
	}, points[0]);
};
