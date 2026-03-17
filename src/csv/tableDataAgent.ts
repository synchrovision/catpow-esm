type rawTableRow = (string | boolean | number)[];
type rawTableData = rawTableRow[];
type tableRow = rawTableRow & { rootIndex: number; rootData: rawTableData };
type tableData = tableRow[] & { rootIndex: number; rootData: rawTableData };

const cache = new WeakMap();

export const tableDataAgent = (keys: string[], rootData: rawTableData) => {
	cache.set(
		rootData,
		keys.reduce((p, c) => {
			p.set(c, new Map());
			return p;
		}, new Map()),
	);
	const rows = rootData.map((row, rootIndex) => convertToTableRow(row, keys, { rootIndex, rootData }));
	return tableRowsAgent(keys, rows);
};

const convertToTableRow = (row: rawTableRow, keys: string[], meta: { rootIndex: number; rootData: rawTableData }): tableRow => {
	const tableRow = Object.assign(row, meta);
	keys.forEach((key, index) => {
		Object.defineProperty(tableRow, key, {
			get() {
				return tableRow[index];
			},
			set(val) {
				cache.get(meta.rootData).get(key).clear();
				tableRow[index] = val;
			},
		});
	});
	return tableRow;
};

const tableRowsAgent = (keys: string[], rows: tableRow[]): tableData => {
	const { rootIndex, rootData } = rows[0];
	const tableData = Object.assign(rows, { rootIndex, rootData });
	keys.forEach((key) => {
		Object.defineProperty(tableData, key, {
			get() {
				if (cache.get(rootData).get(key).has(tableData)) {
					return cache.get(rootData).get(key).get(tableData);
				}
				const groupAgent = tableRowsGroupAgent(keys, key, tableData);
				cache.get(rootData).get(key).set(tableData, groupAgent);
				return groupAgent;
			},
		});
	});
	return tableData;
};

const tableRowsGroupAgent = (keys: string[], primaryKey: string, rows: tableData): tableData[] => {
	const groups = rows.reduce((groups, row, i) => {
		if (row[primaryKey]) {
			groups.push(tableRowsAgent(keys, [row]));
			Object.defineProperty(groups, row[primaryKey], { value: groups[groups.length - 1] });
		} else {
			groups[groups.length - 1].push(row);
		}
		return groups;
	}, []);
	return groups;
};
