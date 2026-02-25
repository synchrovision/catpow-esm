declare var window: Window, document: Document;

import React from "react";
import { useState, useCallback, useEffect, ReactElement } from "react";
import { Bem } from "catpow/component";
import { clsx } from "clsx";

type TableInputProps = {
	className?: string;
	labels?: string[];
	showControls?: boolean;
	children: ReactElement[][];
	onAddItem: (to: number) => void;
	onCopyItem: (from: number, to: number) => void;
	onMoveItem: (from: number, to: number) => void;
	onRemoveItem: (from: number) => void;
};

const getUpperCell = (cell) => {
	const index = Array.from(cell.parentElement.children).indexOf(cell);
	const prevRow = cell.parentElement.previousElementSibling;
	if (prevRow) {
		return prevRow.children.item(index);
	}
	const parentCell = cell.parentElement.closest("td");
	if (parentCell) {
		const rows = getUpperCell(parentCell)?.querySelector("table")?.querySelector("table > tbody").children;
		return rows[rows.length - 1].children[index];
	}
	return null;
};
const getLowerCell = (cell) => {
	const index = Array.from(cell.parentElement.children).indexOf(cell);
	const nextRow = cell.parentElement.nextElementSibling;
	if (nextRow) {
		return nextRow.children.item(index);
	}
	const parentCell = cell.parentElement.closest("td");
	if (parentCell) {
		const rows = getLowerCell(parentCell)?.querySelector("table")?.querySelector("table > tbody").children;
		return rows[0].children[index];
	}
	return null;
};

export const TableInput = (props: TableInputProps) => {
	const { className = "cp-tableinput", labels, showControls = true, children, ...otherProps } = props;

	return (
		<Bem>
			<div className={className}>
				<table>
					{labels && (
						<thead>
							<tr>
								{labels.map((label, index) => (
									<th key={index}>{label}</th>
								))}
								{showControls && <td />}
							</tr>
						</thead>
					)}
					<tbody>
						{children.map &&
							children.map((child, index) => (
								<Row className="_tr" index={index} length={children.length} showControls={showControls} {...otherProps} key={index}>
									{child}
								</Row>
							))}
					</tbody>
				</table>
			</div>
		</Bem>
	);
};

const Row = (props) => {
	const { className, index, length, showControls, onAddItem, onCopyItem, onMoveItem, onRemoveItem, children } = props;
	const [editMode, setEditMode] = useState(false);
	const [trEl, setTrEl] = useState(null);

	const onKeyDownGen = useCallback(
		(r, c) => (e) => {
			const cell = trEl.children.item(c);
			if (editMode) {
				e.stopPropagation();
				if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
					e.preventDefault();
					setEditMode(false);
					window.queueMicrotask(() => {
						document.activeElement.blur();
						cell.focus({ focusVisible: true });
					});
				}
				return;
			}
			switch (e.key) {
				case "Enter": {
					e.stopPropagation();
					const inputEl = cell.querySelector("input,textarea,[contenteditable]");
					if (inputEl) {
						e.preventDefault();
						inputEl.focus();
						setEditMode(true);
					}
					break;
				}
				case "ArrowUp":
				case "ArrowDown": {
					e.stopPropagation();
					e.preventDefault();
					if (e.altKey) {
						if (e.shiftKey) {
							onMoveItem(r, r + (e.key === "ArrowUp" ? -1 : 1));
						} else {
							onCopyItem(r, r + (e.key === "ArrowUp" ? 0 : 1));
						}
						break;
					}
					if (e.key == "ArrowUp") {
						getUpperCell(cell)?.focus();
					} else {
						getLowerCell(cell)?.focus();
					}
					break;
				}
				case "ArrowLeft":
				case "ArrowRight": {
					e.stopPropagation();
					e.preventDefault();
					cell[e.key === "ArrowLeft" ? "previousElementSibling" : "nextElementSibling"]?.focus();
					break;
				}
			}
		},
		[editMode, setEditMode, index, onMoveItem, onCopyItem, trEl],
	);
	const onBlurGen = useCallback(
		(r, c) => (e) => {
			const cell = trEl.children.item(c);
			if (!cell.contains(e.relatedTarget)) {
				setEditMode(false);
			}
		},
		[trEl],
	);
	useEffect(() => {
		if (!trEl) {
			return;
		}
		const doc = trEl.ownerDocument;
		const cb = () => {
			const selection = doc.getSelection();
			setEditMode(selection.containsNode(trEl, true));
		};
		doc.addEventListener("selectionchange", cb);
		return () => doc.removeEventListener("selectionchange", cb);
	}, [trEl]);

	return (
		<Bem>
			<tr className={className} data-index={index} ref={setTrEl}>
				{children.map((child, columnIndex) => (
					<td
						className={clsx("_td is-input", child.props.columnClassName, { "is-edit-mode": editMode })}
						onKeyDown={onKeyDownGen(index, columnIndex)}
						onBlur={onBlurGen(index, columnIndex)}
						data-index={columnIndex}
						tabIndex={0}
						role="gridcell"
						key={columnIndex}
					>
						{child}
					</td>
				))}
				{showControls && (
					<td className="_td is-control" key={index}>
						<div className="_controls">
							{index > 0 ? <div className="_button is-up" onClick={() => onMoveItem(index, index - 1)}></div> : <div className="_spacer" />}
							{index < length - 1 ? <div className="_button is-down" onClick={() => onMoveItem(index, index + 1)}></div> : <div className="_spacer" />}
							{length > 1 ? <div className="_buttonz is-remove" onClick={() => onRemoveItem(index)}></div> : <div className="_spacer" />}
							<div className="_button is-add" onClick={() => onAddItem(index + 1)}></div>
						</div>
					</td>
				)}
			</tr>
		</Bem>
	);
};
