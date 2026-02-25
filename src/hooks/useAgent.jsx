import React from "react";
import { eventMixin } from "catpow/app";
import { useLazyProvider, useLazyComponent } from "catpow/hooks";
import { deepMap } from "catpow/util";

const { useMemo, useState, useCallback, useRef, useEffect, createContext, useContext, lazy } = React;

const AgentContext = createContext();

export const useAgent = (settings, deps) => {
	const agent = useMemo(() => {
		const sharedPromises = deepMap();
		const chainedPromises = deepMap();
		const agent = Object.assign(eventMixin(), typeof settings === "function" ? settings(...deps) : settings, {
			AgentProvider: ({ children }) => <AgentContext.Provider value={agent}>{children}</AgentContext.Provider>,
			sharePromise(asyncCallback, keys) {
				if (!sharedPromises.has(keys)) {
					sharedPromises.set(keys, asyncCallback(keys));
				}
				return sharedPromises.get(keys);
			},
			chainPromise(asyncCallback, keys, clearStuck) {
				if (!chainedPromises.has(keys)) {
					chainedPromises.set(keys, { isPending: false, stuck: [] });
				}
				const data = chainedPromises.get(keys);
				if (clearStuck) {
					data.stuck = [];
				}
				data.stuck.push(asyncCallback);
				if (!data.isPending) {
					const step = async (prev) => {
						if (data.stuck.length === 0) {
							return (data.isPending = false);
						}
						data.isPending = true;
						await step(await data.stuck.shift()(prev));
					};
					step(null);
				}
			},
			useStates(states) {
				const ref = useRef({});
				for (const name in states) {
					ref.current[name] = useState(states[name]);
				}
				this.states = useMemo(
					() =>
						new Proxy(ref, {
							get(ref, prop) {
								if (ref.current[prop] == null) {
									return null;
								}
								return ref.current[prop][0];
							},
							set(ref, prop, value) {
								if (ref.current[prop] == null) {
									return false;
								}
								agent.trigger(prop + ":update", { prev: ref.current[prop][0], current: value });
								ref.current[prop][0] = value;
								ref.current[prop][1](value);
								return true;
							},
						}),
					[ref],
				);
			},
			useProvider(Context, callback, deps) {
				const ref = useRef({});
				ref.current = useMemo(() => callback(this, ...deps), deps);
				return useCallback(
					(props) => {
						return <Context.Provider value={ref.current}>{props.children}</Context.Provider>;
					},
					[Context],
				);
			},
			useLazyProvider(Context, asyncCallback, deps) {
				return useLazyProvider(Context, asyncCallback, [this, ...deps]);
			},
			useLazyComponent(Component, asyncCallback, deps) {
				return useLazyComponent(Component, asyncCallback, [this, ...deps]);
			},
			useEventListeners(handlers) {
				useEffect(() => {
					for (const handle of handlers) {
						this.on(handle, handlers[handle]);
					}
					return () => {
						for (const handle of handlers) {
							this.off(handle, handlers[handle]);
						}
					};
				}, []);
			},
			stateSettings: {},
		});
		if (agent.states) {
			agent.stateSettings = agent.states;
		}
		agent.$ = new Proxy(agent, {
			get(agent, prop) {
				if (agent.hasOwnProperty(prop)) {
					return agent[prop];
				}
				return agent.states[prop];
			},
			set(agent, prop, value) {
				agent.states[prop] = value;
				return true;
			},
		});
		return agent;
	}, deps);
	agent.useStates(agent.stateSettings);

	agent.LazyAgentProvider = useMemo(
		() =>
			lazy(async () => {
				if (agent.init) {
					await agent.init(agent);
				}
				return { default: ({ children }) => <AgentContext.Provider value={agent}>{children}</AgentContext.Provider> };
			}),
		[agent],
	);

	return agent;
};

export const useAgentContext = () => useContext(AgentContext);
