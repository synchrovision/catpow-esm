type rawTableRow = (string | boolean | number)[] & { rootIndex?: number };
type rawTableData = rawTableRow[];
type tableRow = rawTableRow & { rootIndex: number; rootData: rawTableData };
type tableData = tableRow[] & { rootIndex: number; rootData: rawTableData; keys: string[] };
type rawTableRowObject = { [key: string]: string | boolean | number };

const cache = new WeakMap();

export const tableDataAgent = (keys: string[], rootData: rawTableData) => {
	const rows = rootData.map((row, rootIndex) => convertToTableRow(row, keys, { rootIndex, rootData }));
	const tableData = tableRows(keys, rows);
	resetCache(tableData);
	return tableData;
};

const convertToTableRow = (row: rawTableRow, keys: string[], meta: { rootIndex: number; rootData: rawTableData }): tableRow => {
	const tableRow = Object.assign(row, meta);
	keys.forEach((key, index) => {
		Object.defineProperty(tableRow, key, {
			get() {
				return tableRow[index];
			},
			set(val) {
				cache
					.get(meta.rootData)
					.get(key)
					.forEach((map) => map.clear());
				tableRow[index] = val;
			},
		});
	});
	return tableRow;
};
const tableRowFromObj = (obj: rawTableRowObject, keys: string[], meta: { rootIndex: number; rootData: rawTableData }): tableRow => {
	return convertToTableRow(
		keys.map((key) => obj[key] || ""),
		keys,
		meta,
	);
};

const tableRows = (keys: string[], rows: tableRow[]): tableData => {
	const tableData = Object.assign(rows, {
		get rootIndex(): number {
			return rows[0].rootIndex;
		},
		get rootData(): rawTableData {
			return rows[0].rootData;
		},
		keys,
	});
	Object.defineProperties(tableData, {
		collect: {
			get: () => (key: string) => tableDataCollections(key, tableData),
		},
		column: {
			get: () => (key: string) => tableData.map((row) => row[key]),
		},
		dict: {
			get: () => (key: string) => tableDataDictionary(key, tableData),
		},
		sect: {
			get: () => (key: string) => tableDataSections(keys, key, tableData),
		},
		preppend: {
			get: () => (dataToAdd: rawTableRowObject[]) => {
				tableData.rootData.splice(tableData.rootIndex, 0, ...dataToAdd.map((obj, index) => tableRowFromObj(obj, keys, { rootIndex: tableData.rootIndex + index, rootData: tableData.rootData })));
				resetIndex(tableData);
				resetCache(tableData);
			},
		},
		append: {
			get: () => (dataToAdd: rawTableRowObject[]) => {
				tableData.rootData.splice(
					tableData.rootIndex + tableData.length,
					0,
					...dataToAdd.map((obj, index) => tableRowFromObj(obj, keys, { rootIndex: tableData.rootIndex + tableData.length + index, rootData: tableData.rootData })),
				);
				resetIndex(tableData);
				resetCache(tableData);
			},
		},
	});
	return tableData;
};
const tableDataCollections = (key: string, rows: tableData): { [key: string]: tableData } => {
	const parentCache = cache.get(rows.rootData).get(key).get(tableDataCollections);
	if (parentCache.has(rows)) {
		return parentCache.get(rows);
	}
	const collections = rows.reduce((p, row) => {
		(p[row[key]] ||= []).push(row);
		return p;
	}, {});
	parentCache.set(rows, collections);
	return collections;
};
const tableDataDictionary = (key: string, rows: tableData): { [key: string]: tableRow } => {
	const parentCache = cache.get(rows.rootData).get(key).get(tableDataDictionary);
	if (parentCache.has(rows)) {
		return parentCache.get(rows);
	}
	const dict = rows.reduce((p, row) => ({ ...p, [row[key]]: row }), {});
	parentCache.set(rows, dict);
	return dict;
};
const tableDataSections = (keys: string[], primaryKey: string, rows: tableData): tableData[] => {
	const parentCache = cache.get(rows.rootData).get(primaryKey).get(tableDataSections);
	if (parentCache.has(rows)) {
		return parentCache.get(rows);
	}
	const secitons = rows.reduce((secitons, row, i) => {
		if (row[primaryKey]) {
			secitons.push(tableRows(keys, [row]));
			Object.defineProperty(secitons, row[primaryKey], { value: secitons[secitons.length - 1] });
		} else {
			secitons[secitons.length - 1].push(row);
		}
		return secitons;
	}, []);
	parentCache.set(rows, secitons);
	return secitons;
};

const resetIndex = (rows: tableData) => {
	for (let i = rows.rootIndex; i < rows.rootData.length; i++) {
		rows.rootData[i].rootIndex = i;
	}
};
const resetCache = (rows: tableData) => {
	const cacheKeyFunctions = [tableDataCollections, tableDataDictionary, tableDataSections];
	cache.set(
		rows.rootData,
		rows.keys.reduce((cacheByKey, key) => {
			cacheByKey.set(
				key,
				cacheKeyFunctions.reduce((cacheByFunc, func) => {
					cacheByFunc.set(func, new Map());
					return cacheByFunc;
				}, new Map()),
			);
			return cacheByKey;
		}, new Map()),
	);
};
