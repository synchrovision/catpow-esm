export const generateCSV = (data: any[][]): string => {
	return data
		.map((row) =>
			row
				.map((val) => {
					if (val === true) {
						return "TRUE";
					}
					if (val === false) {
						return "FALSE";
					}
					val = val.toString().replace('"', '""');
					if (val.match(/["\n\r]/)) {
						val = `"${val}"`;
					}
					return val;
				})
				.join(","),
		)
		.join("\n");
};
