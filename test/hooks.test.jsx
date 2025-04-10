/**
 * @jest-environment jsdom
 */
import React from "react";
import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { hooks } from "catpow";
const { useBem } = hooks;

test("useBem", () => {
	const Test = (props) => {
		const ref = useBem("p-test-");
		return (
			<div ref={ref}>
				<h2 className="heading-" role="heading">
					<div className="_body">test</div>
				</h2>
			</div>
		);
	};
	render(<Test />);
	expect(screen.getByRole("heading")).toHaveClass("p-test-heading");
	expect(screen.getByRole("heading").children[0]).toHaveClass("p-test-heading__body");
});
