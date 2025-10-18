export const accordion = function (el, param = {}) {
	const app = {};
	app.param = Object.assign({ initialOpen: false }, param);
	app.init = () => {
		accordion.count++;
		app.isOpen = app.param.initialOpen;
		app.button = el;
		app.buttonId = el.getAttribute("id");
		if (app.buttonId == null) {
			app.buttonId = `accordion-button-${accordion.count}`;
			el.setAttribute("id", app.buttonId);
		}
		app.panelId = el.getAttribute("aria-controls");
		if (app.panelId == null) {
			app.panel = el.nextElementSibling;
			if (app.panel == null) {
				console.error("Accodion panel was not found");
				return;
			}
			app.panelId = app.panel.getAttribute("id");
			if (app.panelId == null) {
				app.panelId = `accordion-panel-${accordion.count}`;
				app.panel.setAttribute("id", app.panelId);
			}
			el.setAttribute("aria-controls", app.panelId);
		} else {
			app.panel = document.getElementById(app.panelId);
			if (app.panel == null) {
				app.panel = el.nextElementSibling;
				app.panel.setAttribute("id", app.panelId);
			}
		}
		app.panel.setAttribute("role", "region");
		app.panel.setAttribute("aria-labelledby", app.buttonId);
		if (el.tagName !== "BUTTON" && el.tagName !== "A") {
			el.setAttribute("role", "button");
			el.setAttribute("tabindex", el.disabled ? "-1" : "0");
		}
		el.addEventListener("click", app.toggle);
		el.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				app.toggle(e);
			}
		});
		app.updateState();
	};
	app.toggle = (e) => {
		(app.isOpen ? app.close : app.open)(e);
	};
	app.updateState = () => {
		el.setAttribute("aria-expanded", app.isOpen);
		app.panel.setAttribute("aria-hidden", !app.isOpen);
	};
	app.open = (e) => {
		if (app.isOpen) {
			return;
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
		app.isOpen = true;
		app.updateState();
		app.panel.style.setProperty("--panel-height", app.panel.scrollHeight);
	};
	app.close = (e) => {
		if (!app.isOpen) {
			return;
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
		app.isOpen = false;
		app.updateState();
		app.panel.style.setProperty("--panel-height", 0);
	};
	app.init();
	return app;
};
accordion.count = 0;
