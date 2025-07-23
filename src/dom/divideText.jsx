import { el, getCharCategory } from "catpow/util";

export const divideText = function (target, param = {}) {
	const primaryClass = target.className.split(" ")[0];
	const classPrefix = primaryClass + (primaryClass.includes("__") ? "-" : "__");
	const text = target.textContent;

	const lines = text.split("\n").map((line, lineIndex) =>
		el(
			"span",
			{ class: classPrefix + "line", style: "--line-index:" + lineIndex },
			line.split(" ").map((word, wordIndex) =>
				el(
					"span",
					{ class: classPrefix + "word", style: "--word-index:" + wordIndex },
					word.split("").map((letter, letterIndex) => el("span", { class: classPrefix + "letter is-" + getCharCategory(letter), style: "--letter-index:" + letterIndex }, letter))
				)
			)
		)
	);
	target.innerHTML = "";
	for (const line of lines) {
		target.appendChild(line);
	}
};

const getLettersNode = (text, start = 0) => {
	const letters = document.createDocumentFragment();
	text.split("").forEach((letter, index) => {
		const letterNode = el("span", { class: "letter is-" + getCharCategory(letter), style: "--letter-index:" + (start + index) }, letter);
		letters.appendChild(letterNode);
	});
	return letters;
};
