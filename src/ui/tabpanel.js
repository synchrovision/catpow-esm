export const tabpanel = function (tabs, panels, param = {}) {
	const app = {};
	app.param = Object.assign({ initialOpen: 0 }, param);
	tabs = convertToArrayIfIsNotNodeList(tabs);
	panels = convertToArrayIfIsNotNodeList(panels);
	console.log({ tabs, panels });
	app.init = () => {
		tabs.forEach((tab, i) => {
			tabpanel.count++;
			if (!tab.hasAttribute("aria-controls")) {
				let panelId = panels[i].getAttribute("id");
				if (!panelId) {
					panelId = `tabpanel-panel-${tabpanel.count}`;
					panels[i].setAttribute("id", panelId);
				}
				tab.setAttribute("aria-controls", panelId);
			} else {
				const panelId = tab.getAttribute("aria-controls");
				const panel = document.getElementById(panelId);
				if (!panel) {
					panels[i].setAttribute("id", panelId);
				}
			}
			if (!tab.hasAttribute("id")) {
				const tabId = `tabpanel-tab-${tabpanel.count}`;
				tab.setAttribute("id", tabId);
			}
			tab.setAttribute("tabindex", "-1");
			tab.setAttribute("aria-selected", "false");
			tab.addEventListener("click", (e) => {
				e.preventDefault();
				app.open(i);
			});
			tab.addEventListener("keydown", (e) => {
				let newIndex = null;
				if (e.key === "ArrowRight") {
					newIndex = (i + 1) % tabs.length;
				} else if (e.key === "ArrowLeft") {
					newIndex = (i - 1 + tabs.length) % tabs.length;
				} else if (e.key === "Home") {
					newIndex = 0;
				} else if (e.key === "End") {
					newIndex = tabs.length - 1;
				}
				if (newIndex !== null) {
					e.preventDefault();
					tabs[newIndex].focus();
					app.open(newIndex);
				}
			});
		});
		app.open(param.initialOpen);
	};
	app.open = (index) => {
		tabs.forEach((tab, i) => {
			const selected = i === index;
			tab.setAttribute("aria-selected", selected);
			tab.setAttribute("tabindex", selected ? "0" : "-1");
			panels[i].hidden = !selected;
		});
		panels.forEach((panel, i) => {
			panel.setAttribute("aria-hidden", i !== index);
		});
	};
	app.init();
	return app;
};
const convertToArrayIfIsNotNodeList = (nodes) => {
	if (nodes == null) return [];
	if (nodes instanceof Array || nodes instanceof NodeList) {
		return nodes;
	}
	if (nodes instanceof HTMLElement) {
		return Array.from(nodes.children);
	}
	return Array.from(nodes);
};
tabpanel.count = 0;
