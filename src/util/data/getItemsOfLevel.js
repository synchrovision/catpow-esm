export const getItemsOfLevel = (tree, level) => {
	if (level < 1) {
		return tree;
	}
	return tree.filter((item) => item.children).reduce((p, item) => p.concat(getItemsOfLevel(item.children, level - 1)), []);
};
