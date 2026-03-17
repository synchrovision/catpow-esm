import { parseCSV } from "./parseCSV";
import { tableDataAgent } from "./tableDataAgent";

export const csv = (csv: string) => {
	const rawData = parseCSV(csv);
	if (rawData[0][0].match(/^\[\w+\]$/)) {
		const valueRows = collectType(rawData.slice(2));
		const sections = rawData[0].reduce((p, c, start) => {
			if (c) {
				if (p.length > 0) {
					p[p.length - 1].end = start;
				}
				p.push({ key: c.slice(1, -1), start });
			}
			return p;
		}, []);
		const data = sections.reduce((data, { key, start, end }, r) => {
			data[key] = tableDataAgent(
				rawData[1].slice(start, end),
				valueRows.map((row) => row.slice(start, end)),
			);
			return data;
		}, {});
		return data;
	}
	return tableDataAgent(rawData[0], collectType(rawData.slice(1)));
};

const collectType = (rows: string[][]): (string | number | boolean)[][] =>
	rows.map((row) =>
		row.map((val) => {
			if (!isNaN(parseFloat(val))) {
				return parseFloat(val);
			}
			if (val === "TRUE") {
				return true;
			}
			if (val === "FALSE") {
				return false;
			}
			return val;
		}),
	);
