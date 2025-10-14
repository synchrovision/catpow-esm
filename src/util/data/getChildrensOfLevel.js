export const getChildrensOfLevel = (tree, level) => {
	if (level < 1) {
		return [tree];
	}
	return tree.filter((item) => item.children).reduce((p, item) => p.concat(getChildrensOfLevel(item.children, level - 1)), []);
};
