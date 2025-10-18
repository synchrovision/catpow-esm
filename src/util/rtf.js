export const rtf = (text, pref = "rtf") => {
	if (typeof text !== "string") {
		if (text.toString == null) {
			return "";
		}
		text = text.toString();
	}
	text = replaceBlockFormat(text, pref);
	text = joinConsecutiveLists(text, pref);
	text = replaceInlineFormat(text, pref);
	text = replaceLineBreak(text);
	return text;
};

const replaceInlineFormat = (text, pref) => {
	const patterns = [
		[/\(\((.+?)\)\)/gu, `<small class="${pref}-small">$1</small>`],
		[/\*\*\*\*(.+?)\*\*\*\*/gu, `<strong class="${pref}-strongest">$1</strong>`],
		[/\*\*\*(.+?)\*\*\*/gu, `<strong class="${pref}-stronger">$1</strong>`],
		[/\*\*(.+?)\*\*/gu, `<strong class="${pref}-strong">$1</strong>`],
		[/##(.+?)##/gu, `<em class="${pref}-em">$1</em>`],
		[/~~(.+?)~~/gu, `<del class="${pref}-del">$1</del>`],
		[/``(.+?)``/gu, `<code class="${pref}-code">$1</code>`],
		[/!\[(.+?)\]\((.+?)\)/gu, `<img class="${pref}-image" src="$2" alt="$1"/>`],
		[/\[tel:(\d+)-(\d+)-(\d+)\]/gu, `<a class="${pref}-tel" href="tel:$1$2$3" target="_blank" rel="noopener">$1-$2-$3</a>`],
		[/\[mail:(.+?@.+?)\]/gu, `<a class="${pref}-mailto" href="mailto:$1" target="_blank" rel="noopener">$1</a>`],
		[/\[\[(.+?)\]\]\((.+?)\)/gu, `<a class="${pref}-button" href="$2" target="_blank" rel="noopener"><span class="${pref}-button__label">$1</span></a>`],
		[/\[\[(.+?):(\w+)\]\]/gu, `<span class="${pref}-tag is-tag-$2"><span class="${pref}-tag__label">$1</span></span>`],
		[/\[\[(.+?)\]\]/gu, `<span class="${pref}-tag"><span class="${pref}-tag__label">$1</span></span>`],
		[/\[(.+?)\]\((.+?\.pdf)\)/gu, `<a class="${pref}-link is-link-pdf" href="$2" target="_blank" rel="noopener">$1</a>`],
		[/\[(.+?)\]\((https?:\/\/.+?)\)/gu, `<a class="${pref}-link is-link-external" href="$2" target="_blank" rel="noopener">$1</a>`],
		[/\[(.+?)\]\((.+?)\)/gu, `<a class="${pref}-link" href="$2" rel="noopener">$1</a>`],
	];
	patterns.forEach(([regex, replacement]) => {
		text = text.replace(regex, replacement);
	});
	return text;
};

const replaceBlockFormat = (text, pref, level = 0) => {
	if (level > 3) return text;
	const prefix = level > 0 ? `([ 　\t]{${level}})` : "";
	const classLevel = level > 0 ? ` is-level-${level}` : "";

	const h = "^" + (level > 0 ? `([　\\t]{${level}})` : "()");
	const t = "(.+((\\n" + (level > 0 ? "\\1" : "") + "[　\\t]).+)*)$";
	const c = level > 0 ? ` is-level-${level}` : "";
	const l = level + 4;
	const p = "$2\n";
	const p2 = "$3\n";
	if (level > 0 && !text.match(new RegExp(h, "gum"))) {
		return text;
	}
	text = text.replace(
		new RegExp(h + "\\^([^\\s　].{0,20}?) [:：] " + t, "gum"),
		`<dl class="${pref}-notes${c}"><dt class="${pref}-notes__dt">$2</dt><dd class="${pref}-notes__dd">${p2}</dd></dl><!--/notes-->`,
		text
	);
	text = text.replace(new RegExp(h + "([^\\s　].{0,20}?) [:：] " + t, "gum"), `<dl class="${pref}-dl${c}"><dt class="${pref}-dl__dt">$2</dt><dd class="${pref}-dl__dd">${p2}</dd></dl>`, text);
	text = text.replace(new RegExp(h + "※" + t, "gum"), `<span class="${pref}-annotation${c}">${p}</span>`);
	text = text.replace(new RegExp(h + "■ " + t, "gum"), `<h${l} class="${pref}-title${c}">${p}</h${l}>`);
	text = text.replace(new RegExp(h + "・ " + t, "gum"), `<ul class="${pref}-ul${c}"><li class="${pref}-ul__li">${p}</li></ul>`);
	text = text.replace(new RegExp(h + "\\d{1,2}\\. " + t, "gum"), `<ol class="${pref}-ol${c}"><li class="${pref}-ol__li">${p}</li></ol>`);
	text = text.replace(
		new RegExp(h + "([①-⑳]|[^\\s　]\\.) " + t, "gum"),
		`<dl class="${pref}-listed${c}"><dt class="${pref}-listed__dt">$2</dt><dd class="${pref}-listed__dd">${p2}</dd></dl><!--/listed-->`
	);
	if (level < 3) {
		return replaceBlockFormat(text, pref, level + 1);
	}
	return text;
};

const joinConsecutiveLists = (text, pref) => {
	text = text.replace(new RegExp(`</(dl|ul|ol)>\\s*<\\1 class="${pref}-\\1.*?">`, "gum"), "");
	text = text.replace(new RegExp(`</(dl|ul|ol)><!--/(\\w+?)-->\\s*<\\1 class="${pref}-\\2.*?">`, "gum"), "");
	return text;
};

const replaceLineBreak = (text) => {
	text = text.replace(/\s*(<\/(h\d|dl|dt|dd|ul|ol|li)+?>)\s*/g, "$1");
	text = text.replace(/(\n[　\t]*|\n[　\t]+)/g, "<br/>");
	return text;
};
