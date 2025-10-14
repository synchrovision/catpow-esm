export const sinWave = (a, f) => {
	return (p) => Math.sin(p * Math.PI * f) * a;
};
