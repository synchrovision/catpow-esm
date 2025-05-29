import { eventMixin } from "./eventMixin";

export const appBase = () => {
	const callbacks = {};
	return Object.assign(
		{
			data: null,
			state: {},
			loadData(loaderOrUrl) {
				let dataLoader;
				if (loaderOrUrl instanceof Promise) {
					dataLoader = loaderOrUrl;
				} else {
					dataLoader = fetch(loaderOrUrl).then((res) => res.json());
				}
				return dataLoader
					.then((data) => {
						this.data = data;
						this.trigger("load", data);
					})
					.catch((e) => {
						this.trigger("error", e);
					});
			},
			updateState(state) {
				this.state = { ...this.state, ...state };
				this.trigger("update", state);
			},
		},
		eventMixin()
	);
};
