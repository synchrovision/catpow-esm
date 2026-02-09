export const debounce = (callback: (e: Event) => void, interval: number) => {
	let timer: ReturnType<typeof setTimeout>;
	return (e: Event) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(callback, interval, e);
	};
};
