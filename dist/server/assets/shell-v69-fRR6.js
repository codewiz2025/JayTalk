import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import "./useSelector-ByZNSSTe.js";
import { C as timeUntilStale, D as createLucideIcon, E as useQueryClient, O as Link, b as shallowEqualObjects, c as Subscribable, g as noop, l as isServer, n as fetchState, o as notifyManager, p as isValidTimeout, s as focusManager, v as replaceData, w as timeoutManager, x as shouldThrowError, y as resolveQueryValue } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { t as useRouter } from "./useRouter-B3-b4d5V.js";
import { n as createServerFn, p as TSS_SERVER_FUNCTION } from "./createMiddleware-VlVxTP2A.js";
import { t as getServerFnById } from "./__23tanstack-start-server-fn-resolver-CT6-Rtbb.js";
import { t as authClient } from "./client-Cb0S1Eu3.js";
import { a as _enum, c as boolean, h as object, m as number, s as array, v as string } from "./schemas-T1CMXe3W.js";
import { t as authMiddleware } from "./middleware-CVrNKACa.js";
import { n as Button, t as Avatar } from "./ui-B3wDlNN7.js";
//#region node_modules/@tanstack/react-router/dist/esm/useRouterState.js
/**
* Subscribe to the router's state store with optional selection and
* structural sharing for render optimization.
*
* Options:
* - `select`: Project the full router state to a derived slice
* - `structuralSharing`: Replace-equal semantics for stable references
* - `router`: Read state from a specific router instance instead of context
*
* @returns The selected router state (or the full state by default).
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useRouterStateHook
*/
function useRouterState(opts) {
	const contextRouter = useRouter({ warn: opts?.router === void 0 });
	const router = opts?.router || contextRouter;
	{
		const state = router.stores.__store.get();
		return opts?.select ? opts.select(state) : state;
	}
}
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleUser = createLucideIcon("circle-user", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["circle", {
		cx: "12",
		cy: "10",
		r: "3",
		key: "ilqhr7"
	}],
	["path", {
		d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662",
		key: "154egf"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Download = createLucideIcon("download", [
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["polyline", {
		points: "7 10 12 15 17 10",
		key: "2ggqvy"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "15",
		y2: "3",
		key: "1vk2je"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Gamepad2 = createLucideIcon("gamepad-2", [
	["line", {
		x1: "6",
		x2: "10",
		y1: "11",
		y2: "11",
		key: "1gktln"
	}],
	["line", {
		x1: "8",
		x2: "8",
		y1: "9",
		y2: "13",
		key: "qnk9ow"
	}],
	["line", {
		x1: "15",
		x2: "15.01",
		y1: "12",
		y2: "12",
		key: "krot7o"
	}],
	["line", {
		x1: "18",
		x2: "18.01",
		y1: "10",
		y2: "10",
		key: "1lcuu1"
	}],
	["path", {
		d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
		key: "mfqc10"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Heart = createLucideIcon("heart", [["path", {
	d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
	key: "c3ymky"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessageCircle = createLucideIcon("message-circle", [["path", {
	d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
	key: "vv11sd"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MessagesSquare = createLucideIcon("messages-square", [["path", {
	d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z",
	key: "p1xzt8"
}], ["path", {
	d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1",
	key: "1cx29u"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Moon = createLucideIcon("moon", [["path", {
	d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
	key: "a7tn18"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Play = createLucideIcon("play", [["polygon", {
	points: "6 3 20 12 6 21 6 3",
	key: "1oa8hb"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Settings = createLucideIcon("settings", [["path", {
	d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
	key: "1qme2f"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ShoppingBag = createLucideIcon("shopping-bag", [
	["path", {
		d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
		key: "hou9p0"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M16 10a4 4 0 0 1-8 0",
		key: "1ltviw"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sun = createLucideIcon("sun", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Trophy = createLucideIcon("trophy", [
	["path", {
		d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6",
		key: "17hqa7"
	}],
	["path", {
		d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18",
		key: "lmptdp"
	}],
	["path", {
		d: "M4 22h16",
		key: "57wxv0"
	}],
	["path", {
		d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",
		key: "1nw9bq"
	}],
	["path", {
		d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",
		key: "1np0yb"
	}],
	["path", {
		d: "M18 2H6v7a6 6 0 0 0 12 0V2Z",
		key: "u46fv3"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Users = createLucideIcon("users", [
	["path", {
		d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
		key: "1yyitq"
	}],
	["path", {
		d: "M16 3.128a4 4 0 0 1 0 7.744",
		key: "16gr8j"
	}],
	["path", {
		d: "M22 21v-2a4 4 0 0 0-3-3.87",
		key: "kshegd"
	}],
	["circle", {
		cx: "9",
		cy: "7",
		r: "4",
		key: "nufk8"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Wallet = createLucideIcon("wallet", [["path", {
	d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
	key: "18etb6"
}], ["path", {
	d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
	key: "xoc0q4"
}]]);
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryObserver.js
/**
* A `QueryObserver` watches a single query in the `QueryCache` and computes a
* `QueryObserverResult` from its state, recomputing and notifying subscribers
* whenever the underlying query (or the observer's options) changes. It is
* the primitive that framework adapters (e.g. `useQuery`) build their hooks
* on top of, but it can also be used directly to observe and switch between
* queries outside of any framework.
*
* @example
* ```ts
* const observer = new QueryObserver(queryClient, {
*   queryKey: ['posts'],
*   queryFn: fetchPosts,
* })
*
* const unsubscribe = observer.subscribe((result) => {
*   console.log(result.data)
* })
* ```
*/
var QueryObserver = class extends Subscribable {
	#client;
	#currentQuery = void 0;
	#currentQueryInitialState = void 0;
	#currentResult = void 0;
	#currentResultState;
	#currentResultOptions;
	#selectError;
	#selectFn;
	#selectResult;
	#lastQueryWithDefinedData;
	#staleTimeoutId;
	#refetchIntervalId;
	#currentRefetchInterval;
	#trackedProps = /* @__PURE__ */ new Set();
	constructor(client, options) {
		super();
		this.options = options;
		this.#client = client;
		this.#selectError = null;
		this.bindMethods();
		this.setOptions(options);
	}
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			this.#currentQuery.addObserver(this);
			if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
			else this.updateResult();
			this.#updateTimers();
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	/**
	* Returns whether the observed query is currently stale and configured
	* (via the `refetchOnReconnect` option) to refetch when the network
	* reconnects.
	*/
	shouldFetchOnReconnect() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
	}
	/**
	* Returns whether the observed query is currently stale and configured
	* (via the `refetchOnWindowFocus` option) to refetch when the window
	* regains focus.
	*/
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
	}
	/**
	* Stops observing the current query: clears all listeners, cancels the
	* stale and refetch-interval timers, and removes this observer from the
	* query it was observing.
	*/
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#clearStaleTimeout();
		this.#clearRefetchInterval();
		this.#currentQuery.removeObserver(this);
	}
	/**
	* Updates the observer's options. This will re-resolve the query being
	* observed (switching to a different query if the `queryKey` changed),
	* trigger a fetch if the new options require one and the observer has
	* subscribers, recompute the current result, and reschedule the stale and
	* refetch-interval timers as needed.
	*
	* @example
	* ```ts
	* observer.setOptions({ queryKey: ['posts', 1], queryFn: () => fetchPost(1) })
	* // later: switch to a different query, reusing the same observer
	* observer.setOptions({ queryKey: ['posts', 2], queryFn: () => fetchPost(2) })
	* ```
	*/
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = this.#currentQuery;
		this.options = this.#client.defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryValue(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#updateQuery();
		this.#currentQuery.setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#currentQuery,
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
		this.updateResult();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryValue(this.options.enabled, this.#currentQuery) !== resolveQueryValue(prevOptions.enabled, this.#currentQuery) || resolveQueryValue(this.options.staleTime, this.#currentQuery) !== resolveQueryValue(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
		const nextRefetchInterval = this.#computeRefetchInterval();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryValue(this.options.enabled, this.#currentQuery) !== resolveQueryValue(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
	}
	/**
	* Computes the result the observer would produce for the given (already-defaulted) options
	* right now, building the underlying `Query` if it doesn't exist yet, without waiting for a
	* subscription callback. Called by framework adapters on every render (e.g. `useQuery`) so the
	* returned value is available synchronously, ahead of `setOptions` triggering an actual fetch.
	*/
	getOptimisticResult(options) {
		const query = this.#client.getQueryCache().build(this.#client, options);
		const result = this.createResult(query, options);
		if (!shallowEqualObjects(this.getCurrentResult(), result)) {
			this.#currentResult = result;
			this.#currentResultOptions = this.options;
			this.#currentResultState = this.#currentQuery.state;
		}
		return result;
	}
	/**
	* Returns the most recently computed `QueryObserverResult` for the
	* observed query. This is a point-in-time read; to be notified of updates
	* as they happen, subscribe to the observer instead (its inherited
	* `subscribe` method).
	*
	* @example
	* ```ts
	* const result = observer.getCurrentResult()
	* console.log(result.status, result.data)
	* ```
	*/
	getCurrentResult() {
		return this.#currentResult;
	}
	/**
	* Wraps a `QueryObserverResult` in a `Proxy` that records which properties are read, via
	* {@link QueryObserver#trackProp} (and an optional `onPropTracked` callback). Used by framework
	* adapters when `notifyOnChangeProps` is not set, to implement its default "only re-render on
	* properties you actually read" behavior.
	*/
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked?.(key);
			return Reflect.get(target, key);
		} });
	}
	/**
	* Records that the given `QueryObserverResult` property was read, so a subsequent update only
	* notifies this observer if a tracked property actually changed. Normally called indirectly via
	* {@link QueryObserver#trackResult}'s proxy; exposed directly for adapters that track property
	* access themselves (e.g. through their own reactivity system) instead of via the proxy.
	*/
	trackProp(key) {
		this.#trackedProps.add(key);
	}
	/**
	* Returns the `Query` instance this observer is currently observing.
	*/
	getCurrentQuery() {
		return this.#currentQuery;
	}
	/**
	* Refetches the observed query and returns a promise that resolves with
	* the resulting `QueryObserverResult`.
	*
	* @example
	* ```ts
	* const result = await observer.refetch({ cancelRefetch: false })
	* console.log(result.data)
	* ```
	*/
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
	/**
	* Fetches a query defined by the given options without affecting this
	* observer's own tracked query or result, and returns a promise that
	* resolves with the `QueryObserverResult` for that fetch. This is useful
	* for prefetching data that another observer (e.g. a query about to be
	* navigated to) will need, ahead of time.
	*
	* @example
	* ```ts
	* const result = await observer.fetchOptimistic({
	*   queryKey: ['posts', 2],
	*   queryFn: () => fetchPost(2),
	* })
	* console.log(result.data)
	* ```
	*/
	fetchOptimistic(options) {
		const defaultedOptions = this.#client.defaultQueryOptions(options);
		const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
		let unsubscribe = () => {};
		let resolveEarly;
		const cachePromise = new Promise((resolve) => {
			resolveEarly = resolve;
			unsubscribe = this.#client.getQueryCache().subscribe((event) => {
				if (event.type === "updated" && event.query.queryHash === query.queryHash && query.state.data !== void 0) {
					unsubscribe();
					resolve(this.createResult(query, defaultedOptions));
				}
			});
		});
		return Promise.race([query.fetch().then(() => {
			const result = this.createResult(query, defaultedOptions);
			resolveEarly?.(result);
			return result;
		}).finally(() => {
			unsubscribe();
		}), cachePromise]);
	}
	fetch(fetchOptions) {
		return this.#executeFetch({
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return this.#currentResult;
		});
	}
	#executeFetch(fetchOptions) {
		this.#updateQuery();
		let promise = this.#currentQuery.fetch(this.options, fetchOptions);
		if (!fetchOptions?.throwOnError) promise = promise.catch(noop);
		return promise;
	}
	#shouldScheduleTimer(timeout) {
		return !isServer() && resolveQueryValue(this.options.enabled, this.#currentQuery) !== false && isValidTimeout(timeout);
	}
	#updateStaleTimeout() {
		this.#clearStaleTimeout();
		const staleTime = resolveQueryValue(this.options.staleTime, this.#currentQuery);
		if (this.#currentResult.isStale || !this.#shouldScheduleTimer(staleTime)) return;
		const timeout = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
		this.#staleTimeoutId = timeoutManager.setTimeout(() => {
			if (!this.#currentResult.isStale) this.updateResult();
		}, timeout);
	}
	#computeRefetchInterval() {
		return resolveQueryValue(this.options.refetchInterval, this.#currentQuery) ?? false;
	}
	#updateRefetchInterval(nextInterval) {
		this.#clearRefetchInterval();
		this.#currentRefetchInterval = nextInterval;
		if (this.#currentRefetchInterval === 0 || !this.#shouldScheduleTimer(this.#currentRefetchInterval)) return;
		this.#refetchIntervalId = timeoutManager.setInterval(() => {
			if (this.options.refetchIntervalInBackground || focusManager.isFocused()) this.#executeFetch();
		}, this.#currentRefetchInterval);
	}
	#updateTimers() {
		this.#updateStaleTimeout();
		this.#updateRefetchInterval(this.#computeRefetchInterval());
	}
	#clearStaleTimeout() {
		if (this.#staleTimeoutId !== void 0) {
			timeoutManager.clearTimeout(this.#staleTimeoutId);
			this.#staleTimeoutId = void 0;
		}
	}
	#clearRefetchInterval() {
		if (this.#refetchIntervalId !== void 0) {
			timeoutManager.clearInterval(this.#refetchIntervalId);
			this.#refetchIntervalId = void 0;
		}
	}
	createResult(query, options) {
		const prevQuery = this.#currentQuery;
		const prevOptions = this.options;
		const prevResult = this.#currentResult;
		const prevResultState = this.#currentResultState;
		const prevResultOptions = this.#currentResultOptions;
		const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult?.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) {
			if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
			else try {
				this.#selectFn = options.select;
				data = options.select(data);
				data = replaceData(prevResult?.data, data, options);
				this.#selectResult = data;
				this.#selectError = null;
			} catch (selectError) {
				this.#selectError = selectError;
			}
		} else if (data === void 0) this.#selectError = null;
		if (this.#selectError) {
			error = this.#selectError;
			data = this.#selectResult;
			errorUpdatedAt = Date.now();
			status = "error";
			isPlaceholderData = false;
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		return {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			isEnabled: resolveQueryValue(options.enabled, query) !== false
		};
	}
	/**
	* Recomputes and stores the current result from the current query/options, notifying listeners
	* if it changed. Framework adapters call this right after subscribing to make sure no query
	* update was missed in the gap between creating the observer and subscribing to it.
	*/
	updateResult() {
		const prevResult = this.#currentResult;
		const nextResult = this.createResult(this.#currentQuery, this.options);
		this.#currentResultState = this.#currentQuery.state;
		this.#currentResultOptions = this.options;
		if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
		if (shallowEqualObjects(nextResult, prevResult)) return;
		this.#currentResult = nextResult;
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(this.#currentResult).some((key) => {
				const typedKey = key;
				return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		const notifyListeners = shouldNotifyListeners();
		notifyManager.batch(() => {
			if (notifyListeners) this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
			this.#client.getQueryCache().notify({
				query: this.#currentQuery,
				type: "observerResultsUpdated"
			});
		});
	}
	#updateQuery() {
		const query = this.#client.getQueryCache().build(this.#client, this.options);
		if (query === this.#currentQuery) return;
		const prevQuery = this.#currentQuery;
		this.#currentQuery = query;
		this.#currentQueryInitialState = query.state;
		if (this.hasListeners()) {
			prevQuery?.removeObserver(this);
			query.addObserver(this);
		}
	}
	/** @internal */
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) this.#updateTimers();
	}
};
function shouldLoadOnMount(query, options) {
	return resolveQueryValue(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryValue(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveQueryValue(options.enabled, query) !== false && resolveQueryValue(options.staleTime, query) !== "static") {
		const value = resolveQueryValue(field, query);
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveQueryValue(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveQueryValue(options.enabled, query) !== false && query.isStaleByTime(resolveQueryValue(options.staleTime, query));
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var IsRestoringContext = import_react.createContext(false);
/**
* If you are using `PersistQueryClientProvider`, you can also use the `useIsRestoring` hook alongside it to
* check if a restore is currently in progress. `useQuery` and friends also check this internally to avoid
* race conditions between the restore and mounting queries.
*
* @returns `true` while a persisted client is being restored, `false` otherwise.
*/
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Resets any query errors within the boundary, so queries know they can try again.
*/
function createValue() {
	let isReset = false;
	return {
		/**
		* Clears the reset state, so queries know not to try again until the boundary is reset again.
		*/
		clearReset: () => {
			isReset = false;
		},
		/**
		* Resets any query errors within the boundary, so queries know they can try again.
		*/
		reset: () => {
			isReset = true;
		},
		/**
		* Returns whether the boundary has been reset and not yet cleared.
		*/
		isReset: () => {
			return isReset;
		}
	};
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
/**
* This hook will reset any query errors within the closest `QueryErrorResetBoundary`. If there is no boundary
* defined it will reset them globally.
*
* @returns The boundary's {@link QueryErrorResetBoundaryValue}.
*
* @example
* ```tsx
* import { ErrorBoundary } from 'react-error-boundary'
* import { useQueryErrorResetBoundary } from '@tanstack/react-query'
*
* function App({ children }: { children: React.ReactNode }) {
*   const { reset } = useQueryErrorResetBoundary()
*
*   return (
*     <ErrorBoundary
*       onReset={reset}
*       fallbackRender={({ resetErrorBoundary }) => (
*         <div>
*           There was an error!
*           <button onClick={() => resetErrorBoundary()}>Try again</button>
*         </div>
*       )}
*     >
*       {children}
*     </ErrorBoundary>
*   )
* }
* ```
*/
var useQueryErrorResetBoundary = () => import_react.useContext(QueryErrorResetBoundaryContext);
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
	import_react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/suspense.js
var ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function useBaseQuery(options, Observer, queryClient) {
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const client = useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	const subscribed = options.subscribed !== false;
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
	ensureSuspenseTimers(defaultedOptions);
	ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	useClearResetErrorBoundary(errorResetBoundary);
	const [observer] = import_react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && subscribed;
	import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	import_react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (shouldSuspend(defaultedOptions, result)) throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
//#region node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/jaytalk-api.ts
function parse(schema, data) {
	const result = schema.safeParse(data);
	if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Check that form and try again.");
	return result.data;
}
var Username = string().trim().regex(/^[a-zA-Z0-9_]{3,20}$/, "Use 3–20 letters, numbers, or underscores");
var Email = string().trim().toLowerCase().email("Enter a valid email");
var Password = string().min(8, "Use at least 8 characters").max(72, "Password is too long");
var Name = string().trim().min(2, "Enter your name").max(60);
var checkUsername = createServerFn({ method: "POST" }).validator((data) => parse(object({ username: string() }), data)).handler(createSsrRpc("88b26160fb7aed669383777e7cc66fb79d07018a34b2f4e49c84b9766053f943"));
var resolveUsernameForLogin = createServerFn({ method: "POST" }).validator((data) => parse(object({ username: string().min(1) }), data)).handler(createSsrRpc("b3dd898e5dd87fc9141a79a015ea57435dd4b5b0b4aa183b4e6b2ff625214e71"));
var requestSignupCode = createServerFn({ method: "POST" }).validator((data) => parse(object({
	email: Email,
	username: Username,
	fullName: Name
}), data)).handler(createSsrRpc("2a661829985f1c6fa68206eb32c2cf924a090f467bead9033a7b751732d8ea38"));
var requestResetCode = createServerFn({ method: "POST" }).validator((data) => parse(object({ email: Email }), data)).handler(createSsrRpc("b6e3cca71c2a56d4c39fcf78edd1c4b9a004c2f22121a22af0a65e4559e6def8"));
var resetPassword = createServerFn({ method: "POST" }).validator((data) => parse(object({
	email: Email,
	code: string().trim(),
	password: Password
}), data)).handler(createSsrRpc("2ec733aa171efa90fbf73a609a1e6af1636e879cb820321748bf3c514612400b"));
var finishSignup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ code: string().trim() }), data)).handler(createSsrRpc("669d5d965cc378603cdc87d08b2ebb0ba4004e7f0a75f33f5a96dc9121704f6e"));
var createProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	fullName: Name
}), data)).handler(createSsrRpc("256a6b4f5f982da15d23fdfcdc0ae4efc455681c1eca6829c9341f8a74efc9cb"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0bd664c0090bb2b231725798d28993e38f25c5da84df5b461c52e4f432a5d896"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	fullName: Name,
	bio: string().max(160)
}), data)).handler(createSsrRpc("554dd854cd57cbfb1cbddd25a54154e8eb1278a9129e930567e3d641f35f3164"));
var setPhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ dataUrl: string().max(22e4) }), data)).handler(createSsrRpc("0b477aa002df5408d58c0a541580a94ed43cef67753d92e32c670abb737d1e5a"));
var clearPhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("0d08b88d900a5117b51a6eca0de2cc7fec82312f3cdcfd3b1493bbf6ff3f8aab"));
var searchPeople = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ q: string().trim().min(2).max(40) }), data)).handler(createSsrRpc("61c067e283b2aa2a5473040c94a11faea7fcb545a779e6159b9e4df18548d223"));
var listFriends = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("05b7b83ac2f811bd55b9f32a20a027411e2f3ee1a0a8221f549df6571fa7eb09"));
var requestFriend = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("25129950fb76ca04e881e43ff43725dec82646b34937d35ff52d145b3f91e9b9"));
var acceptFriend = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ id: string().min(1) }), data)).handler(createSsrRpc("95937c4ea08eb3188b33cd18a6ba228eb2dd544f43fed17342bb196be8f046a7"));
var listConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("51b37081618d6ac6ae25a9a0de113ae44e8c5083c22c95fd5e5adf771006e0c5"));
var listMessages = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("a5962c6ad160d21125854e2b3016b3d39575bac561f8dc8c5a294715cad56516"));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	userId: string().min(1),
	body: string().min(1).max(5e5)
}), data)).handler(createSsrRpc("1ddfec6751a7cda86e7400812bc4e9dc5e9ae3beee68db8df0322a09500470a4"));
var markRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("0dc3c77144b7839c3cd6a67c5a1d850a84f30aa355e11ce3b4dc5394432f6f0d"));
var setTyping = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string().min(1).max(80) }), data)).handler(createSsrRpc("013fa2078fa2212d8a8e0fc7e4813244c4f1d8f3ef59f91e0f322e39fb033a72"));
var getTyping = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string().min(1).max(80) }), data)).handler(createSsrRpc("b274ba2d64d546f9c5a31e1180c36265813e4f567d0fd8c4b0a2622d9f5c7967"));
var listGroups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("06af56a9441c186b7170b2d8c7c07ffb2f2b1de011a30d8c21918edbd5cad474"));
var createGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	name: string().trim().min(2, "Name the group").max(40),
	memberIds: array(string()).max(20)
}), data)).handler(createSsrRpc("c508c3745897ac68b2bec8eaa42559eb0274571436f991a767a74120e73c8b5f"));
var getGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ groupId: string().min(1) }), data)).handler(createSsrRpc("33545da6c282cada00261cff70fd75e8d6023eacd0f872e15061072a75ff6b9f"));
var sendGroupMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	groupId: string(),
	body: string().min(1).max(5e5)
}), data)).handler(createSsrRpc("5fa1778a5bd6f520cee5bf54613b32958e85175f9d33a213a1feb8ed5104c70b"));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f1a1e92c95ac57247a67be98aa4bcc7f012069d61f7963427f2546a8c472b65c"));
var listTx = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e2d53859cec83af5afccc2ed24d571d72f4654e98b75b85e86c7adc7f170a272"));
var leaderboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("da1887c0749bb55255e9c0c8b4e432dd205a3e6ef6163da0eaddebd0ccda2062"));
var claimStreak = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("637ea8ea23f4cd582b4a267c746c5c471c77c3b5a4feb13563e2be9a85a8e59d"));
var useStreakRestore = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("76640f9eb4a1d8e533b756653722be4771d9082c93e25fa5cc0dd1fc8c4f498d"));
var startAd = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9b67b5d3d76501cd54144a0fd0f96d0c1403ce4649d47de960fb78a37ebb2365"));
var claimAd = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ clicked: boolean() }), data)).handler(createSsrRpc("27409bbd065a7927830b2f800fdcdd1d0b4900dd815f8bf449e30a23ec8ec016"));
var transferBucks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	amount: number().int().positive().max(1e6)
}), data)).handler(createSsrRpc("844962fba341213086f9ae41f58863c4196a75ea0425f7e15a0998f444d57f01"));
var buyChannel = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("db564de3cc1609aa3e5171ff9082ae11b999509a5718c17140f86d159e349a22"));
var toggleFollow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("e3e2b9802e5998a512075082d75de6572b62a60c3b9f320f75bfb7f8ca38cb18"));
var listPosts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ kind: _enum(["video", "mood"]) }), data)).handler(createSsrRpc("9b1bb44ace4680a878a3b4fdfd7c785c53768deb5443f842b070a9489a0ccb4a"));
var getPostVideo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("86e3ba8c3a52ee50e4a76bca3225e8452e4c560818ed82ee0fa91d5c0c7e646a"));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	kind: _enum(["video", "mood"]),
	body: string().max(500),
	bg: string().max(20).optional(),
	videoData: string().max(35e5).optional()
}), data)).handler(createSsrRpc("ee7e2aae29adb71b570f04064c44d0706efd5a4079033d7c92697f3b40be8471"));
var deletePost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("738378688f14f3ab9ece34a32cdcec68c27b2ff3074657669ad4f4720649822e"));
var reactPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	postId: string(),
	kind: _enum(["like", "dislike"])
}), data)).handler(createSsrRpc("76077a396f3d0588c106e6f54021d1b46b73ad5a521b957db1a8d562ce9b4e19"));
var listComments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("7a75d06c34b1567f3fc3a2ce1673d2e34d201e3a40163eec30ca348986f76294"));
var addComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	postId: string(),
	body: string().trim().min(1).max(280)
}), data)).handler(createSsrRpc("304178750f6d01ec35c2d260ec03fc587e10575f3fb98f84df3077fb3ca5e83b"));
var countView = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("e7e950700ad82d6cda7ab6475a7a34c0e10804f3c679b1be762e9e5fc73aa96d"));
var listStore = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("79238d426dcfaf34002cf6efd19c2ac79e04a8e73d184eef6dd44300c0471781"));
var buyItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string().min(1) }), data)).handler(createSsrRpc("0077c6803862f5e2937a76d3c8dcf0617919c8a57b64858445302ed0dc4e9cf4"));
var equipItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string() }), data)).handler(createSsrRpc("2768bfd7199089a3838b23d37a8f0e3a005949b332626168f0acb45469e1d869"));
var challengeStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("88dea4b163c125a388951d73eae1b81eb36cd8f86648baa4446f1473ccf3d57d"));
var claimChallenge = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: _enum([
	"chat",
	"post",
	"view"
]) }), data)).handler(createSsrRpc("a6e8357d16021069796c0d7ba54451d157c59cc1c2c87cb0c5a771aa63793447"));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("4a66e40d936648bc30d65d0541a6b97050269ef67bb374d007c334a906260180"));
var creditBucks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	amount: number().int().positive().max(1e6)
}), data)).handler(createSsrRpc("2387029eb4a3bfa3006dfb0ac63dbedf83f9fc4a5e8bb6f148aa2611f20d848a"));
//#endregion
//#region src/components/shell.tsx
var NAV = [
	{
		to: "/chat",
		label: "Chat",
		icon: MessageCircle
	},
	{
		to: "/friends",
		label: "Friends",
		icon: Users
	},
	{
		to: "/groups",
		label: "Groups",
		icon: MessagesSquare
	},
	{
		to: "/fyp",
		label: "For you",
		icon: Play
	},
	{
		to: "/moods",
		label: "Moods",
		icon: Heart
	},
	{
		to: "/games",
		label: "Games",
		icon: Gamepad2
	},
	{
		to: "/challenges",
		label: "Challenges",
		icon: Trophy
	},
	{
		to: "/store",
		label: "Store",
		icon: ShoppingBag
	},
	{
		to: "/avatar",
		label: "Avatar",
		icon: CircleUser
	},
	{
		to: "/wallet",
		label: "Bucks",
		icon: Wallet
	},
	{
		to: "/profile",
		label: "Profile",
		icon: CircleUser
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/chat",
		className: "flex min-w-0 items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/brand/jaytalk-logo.png",
			width: 40,
			height: 40,
			alt: "JayTalk",
			className: "size-10 rounded-xl object-cover shadow-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-lg font-extrabold leading-none",
				children: "JayTalk"
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted-foreground",
				children: "JayTech Digitals"
			})]
		})]
	});
}
function ThemeButton() {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setDark(document.documentElement.classList.contains("dark")), []);
	function toggle() {
		const next = !document.documentElement.classList.contains("dark");
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("jaytalk-theme", next ? "dark" : "light");
		setDark(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		className: "size-11 px-0",
		"aria-label": dark ? "Switch to light theme" : "Switch to dark theme",
		onClick: toggle,
		children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
function InstallButton() {
	const [prompt, setPrompt] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const onPrompt = (event) => {
			event.preventDefault();
			setPrompt(event);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		className: "px-3",
		onClick: () => {
			if (prompt) {
				prompt.prompt();
				setPrompt(null);
				return;
			}
			window.alert("Use your browser menu to install JayTalk. On iPhone: Share → Add to Home Screen.");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Install"
			})
		]
	});
}
function useMe() {
	const { user } = useCurrentUserState();
	return useQuery({
		queryKey: ["me", user?.id],
		enabled: Boolean(user),
		queryFn: () => getMe(),
		retry: 2,
		retryDelay: 1500,
		staleTime: 3e4
	});
}
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const me = useMe();
	const isChat = pathname === "/chat" || pathname.startsWith("/chat");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "app-topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2",
					children: [
						me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							className: "flex min-h-11 items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								photo: me.data.photo,
								emoji: me.data.avatarEmoji,
								className: "size-9"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden max-w-28 truncate text-sm font-semibold sm:inline",
								children: ["@", me.data.username]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {}),
						me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/wallet",
							className: "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-sm font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
							"aria-label": "Your Bucks",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] text-amber-950",
								children: "B"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: Number(me.data.balance ?? 0).toLocaleString("en-NG") })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: `app-main-full flex-1 ${isChat ? "app-main-chat" : "px-3 py-4 sm:px-6"}`,
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "app-bottom-nav",
				"aria-label": "Main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "app-bottom-nav-inner",
					children: NAV.map((item) => {
						const active = pathname === item.to || pathname.startsWith(item.to + "/");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: `app-bottom-nav-item ${active ? "active" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}, item.to);
					})
				})
			})
		]
	});
}
function PageHeading({ title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-primary uppercase",
				children: "JayTalk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl font-extrabold",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted-foreground",
				children: subtitle
			})
		]
	});
}
//#endregion
export { transferBucks as $, leaderboard as A, reactPost as B, deletePost as C, getPostVideo as D, getGroup as E, listMessages as F, resolveUsernameForLogin as G, requestResetCode as H, listPosts as I, sendMessage as J, searchPeople as K, listStore as L, listConversations as M, listFriends as N, getTyping as O, listGroups as P, toggleFollow as Q, listTx as R, creditBucks as S, finishSignup as T, requestSignupCode as U, requestFriend as V, resetPassword as W, setTyping as X, setPhoto as Y, startAd as Z, clearPhoto as _, ThemeButton as a, Wallet as at, createPost as b, addComment as c, Sun as ct, challengeStatus as d, Moon as dt, updateProfile as et, checkUsername as f, MessagesSquare as ft, claimStreak as g, useRouterState as gt, claimChallenge as h, Gamepad2 as ht, Shell as i, useQuery as it, listComments as j, getWallet as k, buyChannel as l, ShoppingBag as lt, claimAdmin as m, Heart as mt, InstallButton as n, useCurrentUser as nt, useMe as o, Users as ot, claimAd as p, MessageCircle as pt, sendGroupMessage as q, PageHeading as r, useCurrentUserState as rt, acceptFriend as s, Trophy as st, Brand as t, useStreakRestore as tt, buyItem as u, Play as ut, countView as v, equipItem as w, createProfile as x, createGroup as y, markRead as z };

//# sourceMappingURL=shell-v69-fRR6.js.map