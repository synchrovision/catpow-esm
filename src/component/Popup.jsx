import { useState, useEffect, useRef } from "react";
import { Portal } from "catpow/component";

export const Popup = (props) => {
	const { children, open, onClose, onClosed, closeButton = false, closeOnClickAway = true } = props;
	const [state, setPopupState] = useState("closed");

	useEffect(() => setPopupState(open ? "open" : "close"), [open]);
	const ref = useRef({});

	useEffect(() => {
		if (state === "close") {
			setTimeout(() => {
				Promise.all(ref.current.getAnimations({ subTree: true }).map((animation) => animation.finished)).then(() => {
					setPopupState("closed");
					onClosed && onClosed();
				});
			}, 100);
		}
	}, [state]);

	return (
		<Portal id="PopupContainer" className="cp-popup__container">
			<div className={"cp-popup is-" + state} ref={ref}>
				<div
					className="cp-popup__bg"
					onClick={() => {
						if (closeOnClickAway) {
							onClose();
						}
					}}
				></div>
				<div className="cp-popup__body">
					<div className="cp-popup-contents">{children}</div>
					{closeButton && (
						<div className="cp-popup-control">
							<div className="cp-popup-control__close" onClick={onClose}></div>
						</div>
					)}
				</div>
			</div>
		</Portal>
	);
};
