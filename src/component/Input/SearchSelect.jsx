import { useState, useReducer, useCallback, useMemo, useRef, useEffect } from "react";
import { Bem, Popup, SelectTable } from "catpow/component";

export const SearchSelect = (props) => {
	const { className = "cp-searchselect", defaultLabel = "─", onChange, col = 5, multiple = true, placeholder = "Search" } = props;

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const cache = useRef({});

	const { labelValueMap, valueLabelMap } = useMemo(() => {
		const labelValueMap = {};
		const valueLabelMap = {};
		const cb = (options) => {
			if (Array.isArray(options)) {
				options.forEach((val) => {
					if (typeof val === "object") {
						cb(val);
					} else {
						labelValueMap[val] = val;
						valueLabelMap[val] = val;
					}
				});
			} else {
				Object.keys(options).forEach((key) => {
					if (typeof options[key] === "object") {
						cb(options[key]);
					} else {
						labelValueMap[key] = options[key];
						valueLabelMap[options[key]] = key;
					}
				});
			}
		};
		cb(props.options);
		return { labelValueMap, valueLabelMap };
	}, [props.options]);

	const toggleLabelReducer = useCallback((selectedLabels, labelToToggle) => {
		if (!selectedLabels) {
			return [labelToToggle];
		}
		if (multiple) {
			if (selectedLabels.includes(labelToToggle)) {
				return selectedLabels.filter((val) => val !== labelToToggle);
			}
			return [...selectedLabels, labelToToggle];
		} else {
			if (selectedLabels.includes(labelToToggle)) {
				return [];
			}
			return [labelToToggle];
		}
	}, []);
	const [selectedLabels, toggleLabel] = useReducer(
		toggleLabelReducer,
		useMemo(() => (props.value ? props.value.map((value) => valueLabelMap[value]) : []), [])
	);
	useEffect(() => {
		if (multiple) {
			onChange(selectedLabels.map((label) => labelValueMap[label]));
		} else {
			onChange(selectedLabels.length ? labelValueMap[selectedLabels[0]] : null);
		}
	}, [selectedLabels]);
	const getLabelsForSearch = useCallback(
		(search) => {
			if (cache.current[search]) {
				return cache.current[search];
			}
			const labels = search.length > 2 ? getLabelsForSearch(search.slice(0, -1)) : Object.keys(labelValueMap);
			return (cache.current[search] = search ? labels.filter((label) => label.indexOf(search) >= 0) : labels);
		},
		[cache, labelValueMap]
	);
	const currentLabels = useMemo(() => getLabelsForSearch(search), [getLabelsForSearch, search]);

	return (
		<Bem>
			<div className={className}>
				<div className="_selected" onClick={() => setOpen(true)}>
					<ul className="_items">
						{selectedLabels && selectedLabels.length ? (
							selectedLabels.map((label) => (
								<li className="_item" key={label}>
									{label}
									<span className="_button" onClick={() => toggleLabel(label)}></span>
								</li>
							))
						) : (
							<li className="_item">{defaultLabel}</li>
						)}
					</ul>
				</div>
				<Popup open={open} onClose={() => open && setOpen(false)}>
					<Bem element={className}>
						<div className="_header">
							<div className="_selected">
								<ul className="_items">
									{selectedLabels &&
										selectedLabels.length > 0 &&
										selectedLabels.map((label) => (
											<li className="_item" key={label}>
												{label}
												<span className="_button" onClick={() => toggleLabel(label)}></span>
											</li>
										))}
								</ul>
							</div>
							<div className="_search">
								<input type="text" className="_input" value={search} placeholder={placeholder} onChange={(e) => setSearch(e.currentTarget.value)} />
							</div>
						</div>
						<div className="_body">
							<div className="_selections">
								<SelectTable selections={currentLabels} value={selectedLabels} multiple={multiple} col={col} onChange={toggleLabel} />
							</div>
						</div>
					</Bem>
				</Popup>
			</div>
		</Bem>
	);
};
