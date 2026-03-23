import fs from "fs";
import { describe, expect, test } from "@jest/globals";
import { csv, generateCSV } from "../src/data";

describe("test data", () => {
	test("csv", () => {
		const data = csv(fs.readFileSync("./test/csv/data-test1.csv", { encoding: "utf-8" }));
		expect([...data[0]]).toEqual(["s1", 1, "あ", true]);
		expect(data[0][0]).toBe("s1");
		expect(data[0][1]).toBe(1);
		expect(data[0][2]).toBe("あ");
		expect(data[0][3]).toBe(true);
		expect(data[0].id).toBe("s1");
		expect(data[0].num).toBe(1);
		expect(data[0].str).toBe("あ");
		expect(data[0].bool).toBe(true);
		expect(data.sect("id")[0][0].num).toBe(1);
		expect(data.sect("id").s1[0].num).toBe(1);
		expect(data.sect("id").s1.length).toBe(5);
		data[5].id = "";
		expect(data.sect("id")[0].length).toBe(10);
		const sections = csv(fs.readFileSync("./test/csv/data-test2.csv", { encoding: "utf-8" }));
		expect([...sections.sec1[0]]).toEqual(["s1", 1, "あ", true]);
		expect(
			generateCSV([
				["あ\nい", 1, true],
				['う,え"お', 2, false],
			]),
		).toBe(`"あ\nい",1,TRUE\n"う,え""お",2,FALSE`);
	});
});
