import { el, getCharCategory } from "catpow/util";

type divideTextParams = {};

export const divideText = function (target: HTMLElement, params: divideTextParams = {}): void {
	const primaryClass = target.className.split(" ")[0];
	const classPrefix = primaryClass + (primaryClass.includes("__") ? "-" : "__");
	const text = target.textContent;
	let totalLetterIndex = 0;

	const lines = text
		.trim()
		.split("\n")
		.map((line, lineIndex) =>
			el(
				"span",
				{ class: classPrefix + "line", style: "--line-index:" + lineIndex },
				line
					.trim()
					.split(" ")
					.map((word, wordIndex) =>
						el(
							"span",
							{ class: classPrefix + "word", style: "--word-index:" + wordIndex },
							word
								.trim()
								.split("")
								.map((letter, letterIndex) =>
									el("span", { class: classPrefix + "letter is-" + getCharCategory(letter), style: `--letter-index:${letterIndex};--total-letter-index:${totalLetterIndex++}` }, letter),
								),
						),
					),
			),
		);
	target.innerHTML = "";
	for (const line of lines) {
		target.appendChild(line);
	}
};
