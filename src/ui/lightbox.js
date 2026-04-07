export const lightbox = function (el, param = {}) {
	const app = {
		get isOpen() {
			return lightbox.current === this;
		},
		set isOpen(value) {
			if (value) {
				lightbox.current = this;
			} else if (lightbox.current === this) {
				lightbox.current = null;
			}
		},
	};
	app.param = Object.assign({ initialOpen: false }, param);
	app.init = () => {
		document.querySelectorAll(`[href="#${el.id}"]`).forEach((link) => {
			link.setAttribute("aria-controls", el.id);
		});
		document.addEventListener(
			"click",
			(e) => {
				console.log(e.target);
				if (e.target.closest(`[aria-controls="${el.id}"]`)) {
					app.toggle(e);
				}
			},
			true,
		);
		if (app.param.initialOpen) {
			this.open();
		}
		app.updateState();
	};
	app.toggle = (e) => {
		(app.isOpen ? app.close : app.open)(e);
	};
	app.updateState = () => {
		document.querySelectorAll(`[aria-controls="${el.id}"]`).forEach((control) => {
			control.setAttribute("aria-expanded", app.isOpen);
		});
		el.setAttribute("aria-hidden", !app.isOpen);
	};
	app.open = (e) => {
		if (app.isOpen) {
			return;
		}
		e?.preventDefault();
		if (lightbox.current) {
			if (lightbox.current === app) {
				return;
			}
			lightbox.current.close();
		}
		app.isOpen = true;
		app.updateState();
	};
	app.close = (e) => {
		if (!app.isOpen) {
			return;
		}
		e?.preventDefault();
		if (lightbox.current !== app) {
			return;
		}
		app.isOpen = false;
		app.updateState();
	};
	app.init();
	return app;
};
lightbox.current = null;
