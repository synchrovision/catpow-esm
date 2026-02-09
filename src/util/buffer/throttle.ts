export const throttle = (callback: (e: Event) => void, interval: number) => {
	let timer: ReturnType<typeof setTimeout>,
		hold: boolean = false;
	return (e: Event) => {
		if (timer) {
			clearTimeout(timer);
		}
		if (hold) {
			timer = setTimeout(callback, interval, e);
		} else {
			hold = true;
			callback(e);
			setTimeout(() => (hold = false), interval);
		}
	};
};
