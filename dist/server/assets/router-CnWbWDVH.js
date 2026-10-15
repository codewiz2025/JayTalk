import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { a as rootRouteId, n as Outlet } from "./Match-B4OeR-Uo.js";
import { r as redirect } from "./redirect-jkG3vMHM.js";
import { E as isModuleNotFoundError, a as useHydrated, m as trimPathRight, o as invariant, p as trimPathLeft, s as cleanPath } from "./useSelector-ByZNSSTe.js";
import { c as createNonReactiveReadonlyStore, i as RouterCore, n as _getAssetMatches, s as createNonReactiveMutableStore } from "./load-server-DJ7zEkad.js";
import { t as reactUse } from "./utils-RRgVwoHU.js";
import { D as createLucideIcon, O as Link, S as skipToken, T as QueryClientProvider, _ as partialMatchKey, a as onlineManager, c as Subscribable, d as hashKey, f as hashQueryKeyByOptions, g as noop, h as matchQuery, i as createRetryer, k as useMatch, m as matchMutation, o as notifyManager, r as Removable, s as focusManager, t as Query, u as functionalUpdate, y as resolveQueryValue } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { t as useRouter } from "./useRouter-B3-b4d5V.js";
import { n as useNavigate } from "./useNavigate-OMjWysX7.js";
import { t as auth } from "./server-T6QMEj_q.js";
import { f as literal, h as object, m as number, v as string, y as union } from "./schemas-T1CMXe3W.js";
import { t as Toaster } from "./dist-JcOCBs4u.js";
//#region node_modules/@tanstack/router-core/dist/esm/ssr/bodyScripts.js
function getSsrBodyScriptParts(matches, manifest, nonce, routeScriptAttrs) {
	const assetMatches = _getAssetMatches(matches);
	const routeScripts = [];
	const manifestScripts = [];
	for (const match of assetMatches) for (const script of Array.isArray(match.scripts) ? match.scripts : []) {
		if (!script) continue;
		const { children, ...attrs } = script;
		routeScripts.push({
			tag: "script",
			attrs: {
				...attrs,
				...routeScriptAttrs,
				nonce
			},
			children
		});
	}
	if (manifest) for (const match of assetMatches) for (const asset of manifest.routes[match.routeId]?.scripts ?? []) manifestScripts.push({
		tag: "script",
		attrs: {
			...asset.attrs,
			nonce
		},
		children: asset.children
	});
	return [routeScripts, manifestScripts];
}
function composeSsrBodyScripts([routeScripts, manifestScripts], initialHydrationScripts) {
	if (!initialHydrationScripts) return [...routeScripts, ...manifestScripts];
	return [
		...initialHydrationScripts.before,
		...routeScripts,
		...manifestScripts,
		initialHydrationScripts.boundary
	];
}
//#endregion
//#region node_modules/@tanstack/router-core/dist/esm/route.js
var BaseRoute = class {
	get to() {
		return this._to;
	}
	get id() {
		return this._id;
	}
	get path() {
		return this._path;
	}
	get fullPath() {
		return this._fullPath;
	}
	constructor(options) {
		this.init = (originalIndex) => {
			this.originalIndex = originalIndex;
			this._branch = void 0;
			const options = this.options;
			const isRoot = !options?.path && !options?.id;
			this.parentRoute = this.options.getParentRoute?.();
			if (isRoot) this._path = rootRouteId;
			else if (!this.parentRoute) invariant();
			let path = isRoot ? rootRouteId : options?.path;
			if (path && path !== "/") path = trimPathLeft(path);
			const customId = options?.id || path;
			const id = isRoot ? rootRouteId : cleanPath((this.parentRoute.id === "__root__" ? "" : this.parentRoute.id) + "/" + (customId ?? ""));
			if (path === "__root__") path = "/";
			const fullPath = id === "__root__" ? "/" : path === void 0 ? this.parentRoute.fullPath : cleanPath(this.parentRoute.fullPath + "/" + path);
			this._path = path;
			this._id = id;
			this._fullPath = fullPath;
			this._to = trimPathRight(fullPath);
		};
		this.addChildren = (children) => {
			return this._addFileChildren(children);
		};
		this._addFileChildren = (children) => {
			if (Array.isArray(children)) this.children = children;
			if (typeof children === "object" && children !== null) this.children = Object.values(children);
			return this;
		};
		this._addFileTypes = () => {
			return this;
		};
		this.updateLoader = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.update = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.lazy = (lazyFn) => {
			this.lazyFn = lazyFn;
			return this;
		};
		this.redirect = (opts) => redirect({
			from: this.fullPath,
			...opts
		});
		this.options = options || {};
		this.isRoot = !options?.getParentRoute;
		if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
	}
};
var BaseRootRoute = class extends BaseRoute {
	constructor(options) {
		super(options);
	}
};
//#endregion
//#region node_modules/@tanstack/store/dist/alien.js
/* @__NO_SIDE_EFFECTS__ */
function createReactiveSystem({ update, notify, unwatched }) {
	return {
		link,
		unlink,
		propagate,
		checkDirty,
		shallowPropagate
	};
	function link(dep, sub, version) {
		const prevDep = sub.depsTail;
		if (prevDep !== void 0 && prevDep.dep === dep) return;
		const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
		if (nextDep !== void 0 && nextDep.dep === dep) {
			nextDep.version = version;
			sub.depsTail = nextDep;
			return;
		}
		const prevSub = dep.subsTail;
		if (prevSub !== void 0 && prevSub.version === version && prevSub.sub === sub) return;
		const newLink = sub.depsTail = dep.subsTail = {
			version,
			dep,
			sub,
			prevDep,
			nextDep,
			prevSub,
			nextSub: void 0
		};
		if (nextDep !== void 0) nextDep.prevDep = newLink;
		if (prevDep !== void 0) prevDep.nextDep = newLink;
		else sub.deps = newLink;
		if (prevSub !== void 0) prevSub.nextSub = newLink;
		else dep.subs = newLink;
	}
	function unlink(link, sub = link.sub) {
		const dep = link.dep;
		const prevDep = link.prevDep;
		const nextDep = link.nextDep;
		const nextSub = link.nextSub;
		const prevSub = link.prevSub;
		if (nextDep !== void 0) nextDep.prevDep = prevDep;
		else sub.depsTail = prevDep;
		if (prevDep !== void 0) prevDep.nextDep = nextDep;
		else sub.deps = nextDep;
		if (nextSub !== void 0) nextSub.prevSub = prevSub;
		else dep.subsTail = prevSub;
		if (prevSub !== void 0) prevSub.nextSub = nextSub;
		else if ((dep.subs = nextSub) === void 0) unwatched(dep);
		return nextDep;
	}
	function propagate(link) {
		let next = link.nextSub;
		let stack;
		top: do {
			const sub = link.sub;
			let flags = sub.flags;
			if (!(flags & 60)) sub.flags = flags | 32;
			else if (!(flags & 12)) flags = 0;
			else if (!(flags & 4)) sub.flags = flags & -9 | 32;
			else if (!(flags & 48) && isValidLink(link, sub)) {
				sub.flags = flags | 40;
				flags &= 1;
			} else flags = 0;
			if (flags & 2) notify(sub);
			if (flags & 1) {
				const subSubs = sub.subs;
				if (subSubs !== void 0) {
					const nextSub = (link = subSubs).nextSub;
					if (nextSub !== void 0) {
						stack = {
							value: next,
							prev: stack
						};
						next = nextSub;
					}
					continue;
				}
			}
			if ((link = next) !== void 0) {
				next = link.nextSub;
				continue;
			}
			while (stack !== void 0) {
				link = stack.value;
				stack = stack.prev;
				if (link !== void 0) {
					next = link.nextSub;
					continue top;
				}
			}
			break;
		} while (true);
	}
	function checkDirty(link, sub) {
		let stack;
		let checkDepth = 0;
		let dirty = false;
		top: do {
			const dep = link.dep;
			const flags = dep.flags;
			if (sub.flags & 16) dirty = true;
			else if ((flags & 17) === 17) {
				if (update(dep)) {
					const subs = dep.subs;
					if (subs.nextSub !== void 0) shallowPropagate(subs);
					dirty = true;
				}
			} else if ((flags & 33) === 33) {
				if (link.nextSub !== void 0 || link.prevSub !== void 0) stack = {
					value: link,
					prev: stack
				};
				link = dep.deps;
				sub = dep;
				++checkDepth;
				continue;
			}
			if (!dirty) {
				const nextDep = link.nextDep;
				if (nextDep !== void 0) {
					link = nextDep;
					continue;
				}
			}
			while (checkDepth--) {
				const firstSub = sub.subs;
				const hasMultipleSubs = firstSub.nextSub !== void 0;
				if (hasMultipleSubs) {
					link = stack.value;
					stack = stack.prev;
				} else link = firstSub;
				if (dirty) {
					if (update(sub)) {
						if (hasMultipleSubs) shallowPropagate(firstSub);
						sub = link.sub;
						continue;
					}
					dirty = false;
				} else sub.flags &= -33;
				sub = link.sub;
				const nextDep = link.nextDep;
				if (nextDep !== void 0) {
					link = nextDep;
					continue top;
				}
			}
			return dirty;
		} while (true);
	}
	function shallowPropagate(link) {
		do {
			const sub = link.sub;
			const flags = sub.flags;
			if ((flags & 48) === 32) {
				sub.flags = flags | 16;
				if ((flags & 6) === 2) notify(sub);
			}
		} while ((link = link.nextSub) !== void 0);
	}
	function isValidLink(checkLink, sub) {
		let link = sub.depsTail;
		while (link !== void 0) {
			if (link === checkLink) return true;
			link = link.prevDep;
		}
		return false;
	}
}
var queuedEffects = [];
var { link, unlink, propagate, checkDirty, shallowPropagate } = /* @__PURE__ */ createReactiveSystem({
	update(atom) {
		return atom._update();
	},
	notify(effect) {
		queuedEffects[queuedEffectsLength++] = effect;
		effect.flags &= -3;
	},
	unwatched(atom) {
		if (atom.depsTail !== void 0) {
			atom.depsTail = void 0;
			atom.flags = 17;
			purgeDeps(atom);
		}
	}
});
var queuedEffectsLength = 0;
function purgeDeps(sub) {
	const depsTail = sub.depsTail;
	let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
	while (dep !== void 0) dep = unlink(dep, sub);
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useLoaderData.js
/**
* Read and select the current route's loader data with type‑safety.
*
* Options:
* - `from`/`strict`: Choose which route's data to read and strictness
* - `select`: Map the loader data to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The loader data (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLoaderDataHook
*/
function useLoaderData(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.loaderData) : match.loaderData;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useLoaderDeps.js
/**
* Read and select the current route's loader dependencies object.
*
* Options:
* - `from`: Choose which route's loader deps to read
* - `select`: Map the deps to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The loader deps (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLoaderDepsHook
*/
function useLoaderDeps(opts) {
	const { select, ...rest } = opts;
	return useMatch({
		...rest,
		select: (match) => {
			return select ? select(match.loaderDeps) : match.loaderDeps;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useParams.js
/**
* Access the current route's path parameters with type-safety.
*
* Options:
* - `from`/`strict`: Specify the matched route and whether to enforce strict typing
* - `select`: Project the params object to a derived value for memoized renders
* - `structuralSharing`: Enable structural sharing for stable references
* - `shouldThrow`: Throw if the route is not found in strict contexts
*
* @returns The params object (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useParamsHook
*/
function useParams(opts) {
	return useMatch({
		from: opts.from,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		strict: opts.strict,
		select: (match) => {
			const params = opts.strict === false ? match.params : match._strictParams;
			return opts.select ? opts.select(params) : params;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useSearch.js
/**
* Read and select the current route's search parameters with type-safety.
*
* Options:
* - `from`/`strict`: Control which route's search is read and how strictly it's typed
* - `select`: Map the search object to a derived value for render optimization
* - `structuralSharing`: Enable structural sharing for stable references
* - `shouldThrow`: Throw when the route is not found (strict contexts)
*
* @returns The search object (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useSearchHook
*/
function useSearch(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.search) : match.search;
		}
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/useRouteContext.js
function useRouteContext(opts) {
	return useMatch({
		...opts,
		select: (match) => opts.select ? opts.select(match.context) : match.context
	});
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/route.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Route$22 = class extends BaseRoute {
	/**
	* @deprecated Use the `createRoute` function instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				...opts,
				from: this.id
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				...opts,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				...opts,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
	}
};
/**
* Creates a non-root Route instance for code-based routing.
*
* Use this to define a route that will be composed into a route tree
* (typically via a parent route's `addChildren`). If you're using file-based
* routing, prefer `createFileRoute`.
*
* @param options Route options (path, component, loader, context, etc.).
* @returns A Route instance to be attached to the route tree.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouteFunction
*/
function createRoute(options) {
	return new Route$22(options);
}
var RootRoute = class extends BaseRootRoute {
	/**
	* @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				...opts,
				from: this.id
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				...opts,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				...opts,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
	}
};
/**
* Creates a root Route instance used to build your route tree.
*
* Typically paired with `createRouter({ routeTree })`. If you need to require
* a typed router context, use `createRootRouteWithContext` instead.
*
* @param options Root route options (component, error, pending, etc.).
* @returns A root route instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRootRouteFunction
*/
function createRootRoute(options) {
	return new RootRoute(options);
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/fileRoute.js
/**
* Creates a file-based Route factory for a given path.
*
* Used by TanStack Router's file-based routing to associate a file with a
* route. The returned function accepts standard route options. In normal usage
* the `path` string is inserted and maintained by the `tsr` generator.
*
* @param path File path literal for the route (usually auto-generated).
* @returns A function that accepts Route options and returns a Route instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createFileRouteFunction
*/
function createFileRoute(path) {
	return (options) => {
		const route = createRoute(options);
		route.isRoot = false;
		return route;
	};
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/lazyRouteComponent.js
/**
* Wrap a dynamic import to create a route component that supports
* `.preload()` and friendly reload-on-module-missing behavior.
*
* @param importer Function returning a module promise
* @param exportName Named export to use (default: `default`)
* @returns A lazy route component compatible with TanStack Router
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/lazyRouteComponentFunction
*/
function lazyRouteComponent(importer, exportName) {
	let loadPromise;
	let comp;
	let error;
	const load = () => {
		if (!loadPromise) {
			error = void 0;
			loadPromise = importer().then((res) => {
				comp = res[exportName ?? "default"];
			}).catch((err) => {
				loadPromise = void 0;
				error = err;
			});
		}
		return loadPromise;
	};
	const lazyComp = function Lazy(props) {
		if (error) {
			if (isModuleNotFoundError(error) && false);
			throw error;
		}
		if (!comp) if (reactUse) reactUse(load());
		else throw load();
		return import_react.createElement(comp, props);
	};
	lazyComp.preload = load;
	return lazyComp;
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/routerStores.js
var getStoreFactory = (opts) => {
	return {
		createMutableStore: createNonReactiveMutableStore,
		createReadonlyStore: createNonReactiveReadonlyStore,
		batch: (fn) => fn()
	};
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/router.js
/**
* Creates a new Router instance for React.
*
* Pass the returned router to `RouterProvider` to enable routing.
* Notable options: `routeTree` (your route definitions) and `context`
* (required if the root route was created with `createRootRouteWithContext`).
*
* @param options Router options used to configure the router.
* @returns A Router instance to be provided to `RouterProvider`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouterFunction
*/
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options, getStoreFactory);
	}
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Asset.js
var noopScriptHandler = () => {};
function setScriptAttrs(script, attrs) {
	if (!attrs) return;
	for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
}
function Asset(asset) {
	const { attrs, children, nonce, preventScriptHoist } = asset;
	const innerHTML = import_react.useMemo(() => children === void 0 ? void 0 : { __html: children }, [children]);
	switch (asset.tag) {
		case "title": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", {
			...attrs,
			suppressHydrationWarning: true,
			children
		});
		case "meta": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			...attrs,
			suppressHydrationWarning: true
		});
		case "link": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			...attrs,
			precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
			nonce,
			suppressHydrationWarning: true
		});
		case "style":
			if (asset.inlineCss && false);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
				...attrs,
				dangerouslySetInnerHTML: innerHTML,
				nonce
			});
		case "script": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Script, {
			attrs,
			preventScriptHoist,
			children
		});
		default: return null;
	}
}
function Script({ attrs, children, preventScriptHoist }) {
	useRouter();
	useHydrated();
	const innerHTML = import_react.useMemo(() => children === void 0 ? void 0 : { __html: children }, [children]);
	const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
	import_react.useEffect(() => {
		if (dataScript) return;
		if (attrs?.src) {
			const link = document.createElement("a");
			link.href = attrs.src;
			const normSrc = link.href;
			for (const el of document.scripts) if (el.src === normSrc) return;
			const script = document.createElement("script");
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
		if (typeof children === "string") {
			const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
			const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
			for (const el of document.scripts) {
				if (el.hasAttribute("src")) continue;
				const sType = el.getAttribute("type") ?? "text/javascript";
				const sNonce = el.getAttribute("nonce") ?? void 0;
				if (el.textContent === children && sType === typeAttr && sNonce === nonceAttr) return;
			}
			const script = document.createElement("script");
			script.textContent = children;
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
	}, [
		attrs,
		children,
		dataScript
	]);
	if (attrs?.src) {
		if (!preventScriptHoist) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			suppressHydrationWarning: true
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			onLoad: noopScriptHandler,
			suppressHydrationWarning: true
		});
	}
	if (typeof children === "string") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		...attrs,
		dangerouslySetInnerHTML: innerHTML,
		suppressHydrationWarning: true
	});
	return null;
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Scripts.js
var routeScriptAttrs = { suppressHydrationWarning: true };
/**
* Render body script tags collected from route matches and SSR manifests.
* During streaming SSR, `<Scripts>` marks where late hydration scripts may
* begin to be inserted.
*/
var Scripts = () => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const getParts = (matches) => {
		const parts = getSsrBodyScriptParts(matches, router.ssr?.manifest, nonce, routeScriptAttrs);
		for (const script of parts[1]) if (typeof script.attrs?.src === "string") {
			const scriptWithHoist = script;
			scriptWithHoist.preventScriptHoist = true;
		}
		return parts;
	};
	return renderScripts(composeSsrBodyScripts(getParts(router.stores.matches.get()), router.serverSsr?.takeInitialHydrationScriptTags()));
};
function renderScripts(scripts) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: scripts.map((asset, i) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...asset,
		key: `tsr-scripts-${asset.tag}-${i}`
	})) });
}
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var TriangleAlert = createLucideIcon("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]);
//#endregion
//#region src/lib/error-component.tsx
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
//#endregion
//#region src/lib/preview-path-prefix.ts
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutation.js
/**
* Represents a single mutation attempt. A `Mutation` holds the mutation's
* options, state (data/error/status), and the `MutationObserver`s currently
* subscribed to it.
*
* Instances are created and managed internally by `MutationCache`; application
* code typically interacts with mutations indirectly through `QueryClient` or
* a framework hook like `useMutation`. Direct access to a `Mutation` instance
* is possible via `mutationCache.find()`/`getAll()` for inspecting cache state.
*
* @example
* ```ts
* const mutationCache = queryClient.getMutationCache()
*
* const mutation = mutationCache.find({ mutationKey: ['addPost'] })
* ```
*/
var Mutation = class extends Removable {
	#client;
	#observers;
	#mutationCache;
	#retryer;
	constructor(config) {
		super();
		this.#client = config.client;
		this.mutationId = config.mutationId;
		this.#mutationCache = config.mutationCache;
		this.#observers = [];
		this.state = config.state || getDefaultState();
		this.setOptions(config.options);
		this.scheduleGc();
	}
	/** @internal */
	setOptions(options) {
		this.options = options;
		this.updateGcTime(this.options.gcTime);
	}
	/**
	* The `meta` object passed in the mutation's options, if any.
	*/
	get meta() {
		return this.options.meta;
	}
	/** @internal */
	addObserver(observer) {
		if (!this.#observers.includes(observer)) {
			this.#observers.push(observer);
			this.clearGcTimeout();
			this.#mutationCache.notify({
				type: "observerAdded",
				mutation: this,
				observer
			});
		}
	}
	/** @internal */
	removeObserver(observer) {
		this.#observers = this.#observers.filter((x) => x !== observer);
		this.scheduleGc();
		this.#mutationCache.notify({
			type: "observerRemoved",
			mutation: this,
			observer
		});
	}
	optionalRemove() {
		if (!this.#observers.length) {
			if (this.state.status === "pending") this.scheduleGc();
			else this.#mutationCache.remove(this);
		}
	}
	/**
	* Resumes a mutation that is currently paused or was restored from a
	* dehydrated, still-`pending` state.
	*
	* - If this mutation has an active retryer (it paused mid-attempt, e.g. due
	*   to the network mode or scope-based queuing), its retryer is resumed.
	* - Otherwise, if the mutation's status is still `pending` (e.g. it was
	*   dehydrated while an attempt was in flight and never got a retryer in
	*   this instance), `execute` is called again with the last known variables.
	* - Otherwise the mutation has already settled and this resolves immediately
	*   without running anything again.
	*
	* @example
	* ```ts
	* // typically driven by reconnect handling, e.g. queryClient.resumePausedMutations()
	* const mutation = mutationCache.find({ mutationKey: ['addPost'] })
	* await mutation?.continue()
	* ```
	*
	* @see {@link Mutation#execute}
	*/
	continue() {
		return this.#retryer?.continue() ?? (this.state.status === "pending" ? this.execute(this.state.variables) : Promise.resolve());
	}
	/**
	* Runs the mutation function for the given variables through a retryer, and
	* drives the mutation's state and lifecycle callbacks through to settlement.
	*
	* If this mutation's state is already `pending` when `execute` is called
	* (i.e. it was restored, still in-flight, from a dehydrated state), the
	* `onMutate` step is skipped and a `continue` action is dispatched to
	* unpause it; otherwise a `pending` action is dispatched first, then the
	* mutation cache's `onMutate` and the mutation's own `onMutate` option are
	* awaited in that order, and the resulting context is stored.
	*
	* The mutation function is then run (subject to `retry`/`retryDelay`/
	* `networkMode`, and to the mutation cache's scope-based serialization).
	* On success, the cache's `onSuccess`/`onSettled` callbacks run before the
	* mutation's own `onSuccess`/`onSettled` options, a `success` action is
	* dispatched, and the resolved data is returned. On failure, the same
	* cache-then-option ordering is used for `onError`/`onSettled`, but each of
	* those four callbacks is individually caught so that a throwing callback
	* cannot mask the original error; an `error` action is then dispatched and
	* the original error is re-thrown.
	*
	* @example
	* ```ts
	* // Called internally by `MutationObserver.mutate` and `Mutation.continue` —
	* // applications normally trigger mutations through those, not this method.
	* const data = await mutation.execute(variables)
	* ```
	*
	* @see {@link Mutation#continue}
	*/
	async execute(variables) {
		const onContinue = () => {
			this.#dispatch({ type: "continue" });
		};
		const mutationFnContext = {
			client: this.#client,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		};
		const retryer = this.#retryer = createRetryer({
			fn: () => {
				if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
				return this.options.mutationFn(variables, mutationFnContext);
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#mutationCache.canRun(this)
		});
		const restored = this.state.status === "pending";
		const isPaused = !retryer.canStart();
		try {
			if (restored) onContinue();
			else {
				this.#dispatch({
					type: "pending",
					variables,
					isPaused
				});
				if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
				const context = await this.options.onMutate?.(variables, mutationFnContext);
				if (context !== this.state.context) this.#dispatch({
					type: "pending",
					context,
					variables,
					isPaused
				});
			}
			const data = await retryer.start();
			await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
			await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
			await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
			await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
			this.#dispatch({
				type: "success",
				data
			});
			return data;
		} catch (error) {
			try {
				await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			this.#dispatch({
				type: "error",
				error
			});
			throw error;
		} finally {
			if (this.#retryer === retryer) this.#retryer = void 0;
			this.#mutationCache.runNext(this);
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					failureCount: action.failureCount,
					failureReason: action.error
				};
				case "pause": return {
					...state,
					isPaused: true
				};
				case "continue": return {
					...state,
					isPaused: false
				};
				case "pending": return {
					...state,
					context: action.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: action.isPaused,
					status: "pending",
					variables: action.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...state,
					data: action.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: false
				};
				case "error": return {
					...state,
					data: void 0,
					error: action.error,
					failureCount: state.failureCount + 1,
					failureReason: action.error,
					isPaused: false,
					status: "error"
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.#observers.forEach((observer) => {
				observer.onMutationUpdate(action);
			});
			this.#mutationCache.notify({
				mutation: this,
				type: "updated",
				action
			});
		});
	}
};
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: false,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutationCache.js
/**
* The `MutationCache` is the storage for mutations.
*
* Normally, you will not interact with the `MutationCache` directly and instead use a
* `QueryClient`. You can subscribe to it (inherited from `Subscribable`) to be informed of
* safe/known updates to the cache, such as mutations being added, removed, or updated.
*
* @example
* ```ts
* const unsubscribe = mutationCache.subscribe((event) => {
*   console.log(event.type, event.mutation)
* })
* ```
*/
var MutationCache = class extends Subscribable {
	#mutations;
	#scopes;
	#mutationId;
	constructor(config = {}) {
		super();
		this.config = config;
		this.#mutations = /* @__PURE__ */ new Set();
		this.#scopes = /* @__PURE__ */ new Map();
		this.#mutationId = 0;
	}
	/** @internal */
	build(client, options, state) {
		const mutation = new Mutation({
			client,
			mutationCache: this,
			mutationId: ++this.#mutationId,
			options: client.defaultMutationOptions(options),
			state
		});
		this.add(mutation);
		return mutation;
	}
	/** @internal */
	add(mutation) {
		this.#mutations.add(mutation);
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const scopedMutations = this.#scopes.get(scope);
			if (scopedMutations) scopedMutations.push(mutation);
			else this.#scopes.set(scope, [mutation]);
		}
		this.notify({
			type: "added",
			mutation
		});
	}
	/** @internal */
	remove(mutation) {
		if (this.#mutations.delete(mutation)) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const scopedMutations = this.#scopes.get(scope);
				if (scopedMutations) {
					if (scopedMutations.length > 1) {
						const index = scopedMutations.indexOf(mutation);
						if (index !== -1) scopedMutations.splice(index, 1);
					} else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
				}
			}
		}
		this.notify({
			type: "removed",
			mutation
		});
	}
	/** @internal */
	canRun(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const firstPendingMutation = this.#scopes.get(scope)?.find((m) => m.state.status === "pending");
			return !firstPendingMutation || firstPendingMutation === mutation;
		} else return true;
	}
	/** @internal */
	runNext(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") return (this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused))?.continue() ?? Promise.resolve();
		else return Promise.resolve();
	}
	/**
	* Removes all mutations from the cache.
	*
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* mutationCache.clear()
	* ```
	*/
	clear() {
		notifyManager.batch(() => {
			this.#mutations.forEach((mutation) => {
				this.notify({
					type: "removed",
					mutation
				});
			});
			this.#mutations.clear();
			this.#scopes.clear();
		});
	}
	/**
	* Returns all mutations within the cache.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about a mutation in rare scenarios.
	*
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* const mutations = mutationCache.getAll()
	* ```
	*/
	getAll() {
		return Array.from(this.#mutations);
	}
	/**
	* A slightly more advanced method that can be used to get an existing mutation instance from
	* the cache. If the mutation does not exist, `undefined` is returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about a mutation in rare scenarios.
	*
	* @see {@link MutationCache#findAll}
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* const mutation = mutationCache.find({ mutationKey: ['addPost'] })
	* ```
	*/
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((mutation) => matchMutation(defaultedFilters, mutation));
	}
	/**
	* An even more advanced method that can be used to get existing mutation instances from the
	* cache that match the given filters. If no mutations match, an empty array is returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about mutations in rare scenarios.
	*
	* @see {@link MutationCache#find}
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* const mutations = mutationCache.findAll({ mutationKey: ['addPost'] })
	* ```
	*/
	findAll(filters = {}) {
		return this.getAll().filter((mutation) => matchMutation(filters, mutation));
	}
	/** @internal */
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	/** @internal */
	resumePausedMutations() {
		const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
		return notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(noop))));
	}
};
function scopeFor(mutation) {
	return mutation.options.scope?.id;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryCache.js
/**
* The `QueryCache` is the storage mechanism for TanStack Query. It stores all the data, meta
* information, and state of the queries it contains.
*
* Normally, you will not interact with the `QueryCache` directly and instead use a `QueryClient`
* for a specific cache. You can subscribe to it (inherited from `Subscribable`) to be informed of
* safe/known updates to the cache, such as queries being added, removed, or updated — updates made
* outside of the cache's own tracked mechanisms (e.g. mutating a query's state object directly) do
* not notify subscribers.
*
* @example
* ```ts
* const unsubscribe = queryCache.subscribe((event) => {
*   console.log(event.type, event.query)
* })
* ```
*/
var QueryCache = class extends Subscribable {
	#queries;
	constructor(config = {}) {
		super();
		this.config = config;
		this.#queries = /* @__PURE__ */ new Map();
	}
	/**
	* Returns the existing `Query` instance for the given options' `queryKey`/`queryHash`, or
	* builds and adds a new one to the cache if none exists yet. Used by framework adapters and
	* plugins (e.g. broadcast/persistence) that need to get-or-create a `Query` directly, bypassing
	* the reactive `QueryObserver` machinery.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const query = queryCache.build(queryClient, {
	*   queryKey: ['posts'],
	*   queryFn: fetchPosts,
	* })
	* ```
	*/
	build(client, options, state) {
		const queryKey = options.queryKey;
		const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
		let query = this.get(queryHash);
		if (!query) {
			query = new Query({
				client,
				queryKey,
				queryHash,
				options: client.defaultQueryOptions(options),
				state,
				defaultOptions: client.getQueryDefaults(queryKey)
			});
			this.add(query);
		}
		return query;
	}
	/** @internal */
	add(query) {
		if (!this.#queries.has(query.queryHash)) {
			this.#queries.set(query.queryHash, query);
			this.notify({
				type: "added",
				query
			});
		}
	}
	/**
	* Destroys the given `Query` and removes it from the cache, notifying subscribers with a
	* `'removed'` event. A no-op if the query is no longer the one currently stored under its hash
	* (e.g. it was already replaced). Used by plugins (e.g. the broadcast client) that mirror
	* removals across `QueryCache` instances.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	* const query = queryCache.find({ queryKey: ['posts'] })
	*
	* if (query) {
	*   queryCache.remove(query)
	* }
	* ```
	*/
	remove(query) {
		if (this.#queries.get(query.queryHash) === query) {
			query.destroy();
			this.#queries.delete(query.queryHash);
			this.notify({
				type: "removed",
				query
			});
		}
	}
	/**
	* Removes all queries from the cache.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* queryCache.clear()
	* ```
	*/
	clear() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				this.remove(query);
			});
		});
	}
	/**
	* Returns the `Query` instance stored under the given `queryHash`, or `undefined` if none
	* exists. Unlike {@link QueryCache#find}, this looks up by the already-computed hash rather
	* than by `QueryFilters`. Used by plugins (e.g. broadcast/hydration) that already have a hash
	* to look up directly.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	* const queryHash = hashKey(['posts'])
	*
	* const query = queryCache.get(queryHash)
	* ```
	*/
	get(queryHash) {
		return this.#queries.get(queryHash);
	}
	/**
	* Returns all queries within the cache.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const queries = queryCache.getAll()
	* ```
	*/
	getAll() {
		return [...this.#queries.values()];
	}
	/**
	* A slightly more advanced method that can be used to get an existing query instance from the
	* cache. This instance not only contains all the state for the query, but all of the instances,
	* and underlying guts of the query as well. If the query does not exist, `undefined` is
	* returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about a query in rare scenarios (e.g. looking at `query.state.dataUpdatedAt` to
	* decide whether a query is fresh enough to be used as an initial value).
	*
	* @see {@link QueryCache#findAll}
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const query = queryCache.find({ queryKey: ['posts'] })
	* ```
	*/
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((query) => matchQuery(defaultedFilters, query));
	}
	/**
	* An even more advanced method that can be used to get existing query instances from the cache
	* that partially match a query key. If no queries match, an empty array is returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about queries in rare scenarios.
	*
	* @see {@link QueryCache#find}
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const queries = queryCache.findAll({ queryKey: ['posts'] })
	* ```
	*/
	findAll(filters = {}) {
		const queries = this.getAll();
		return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
	}
	/** @internal */
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	/** @internal */
	onFocus() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onFocus();
			});
		});
	}
	/** @internal */
	onOnline() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onOnline();
			});
		});
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryClient.js
/**
* `QueryClient` is used to interact with a cache of queries and mutations. It owns a
* `QueryCache` and a `MutationCache` (creating default ones if none are passed in) and holds
* the default options that are applied to queries and mutations created through it.
*
* @example
* ```ts
* const queryClient = new QueryClient({
*   defaultOptions: {
*     queries: {
*       staleTime: Infinity,
*     },
*   },
* })
*
* await queryClient.query({ queryKey: ['posts'], queryFn: fetchPosts })
* ```
*/
var QueryClient = class {
	#queryCache;
	#mutationCache;
	#defaultOptions;
	#queryDefaults;
	#mutationDefaults;
	#mountCount;
	#unsubscribeFocus;
	#unsubscribeOnline;
	constructor(config = {}) {
		this.#queryCache = config.queryCache || new QueryCache();
		this.#mutationCache = config.mutationCache || new MutationCache();
		this.#defaultOptions = config.defaultOptions || {};
		this.#queryDefaults = /* @__PURE__ */ new Map();
		this.#mutationDefaults = /* @__PURE__ */ new Map();
		this.#mountCount = 0;
	}
	/**
	* Called by a framework adapter's `QueryClientProvider`-equivalent when it mounts, to start
	* listening for focus/online events and resume paused mutations. Ref-counted via an internal
	* mount count, so nested or multiple providers sharing the same `QueryClient` don't tear down
	* the shared listeners until the last one unmounts.
	*/
	mount() {
		this.#mountCount++;
		if (this.#mountCount !== 1) return;
		this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
			if (focused) {
				await this.resumePausedMutations();
				this.#queryCache.onFocus();
			}
		});
		this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
			if (online) {
				await this.resumePausedMutations();
				this.#queryCache.onOnline();
			}
		});
	}
	/**
	* The inverse of {@link QueryClient#mount} — called by a framework adapter's
	* `QueryClientProvider`-equivalent when it unmounts. Only tears down the focus/online
	* listeners once the mount count returns to `0`.
	*/
	unmount() {
		this.#mountCount--;
		if (this.#mountCount !== 0) return;
		this.#unsubscribeFocus?.();
		this.#unsubscribeFocus = void 0;
		this.#unsubscribeOnline?.();
		this.#unsubscribeOnline = void 0;
	}
	/**
	* Returns the number of queries in the cache that are currently fetching, optionally
	* matching a set of filters. This includes background-fetching, loading new pages, and
	* loading more infinite query results.
	*
	* @example
	* ```ts
	* if (queryClient.isFetching()) {
	*   console.log('At least one query is fetching!')
	* }
	* ```
	*/
	isFetching(filters) {
		return this.#queryCache.findAll({
			...filters,
			fetchStatus: "fetching"
		}).length;
	}
	/**
	* Returns the number of mutations in the cache that are currently pending, optionally
	* matching a set of filters.
	*
	* @example
	* ```ts
	* if (queryClient.isMutating()) {
	*   console.log('At least one mutation is pending!')
	* }
	* ```
	*/
	isMutating(filters) {
		return this.#mutationCache.findAll({
			...filters,
			status: "pending"
		}).length;
	}
	/**
	* Imperative (non-reactive) way to retrieve data for a QueryKey.
	* Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
	*
	* Hint: Do not use this function inside a component, because it won't receive updates.
	* Use `useQuery` to create a `QueryObserver` that subscribes to changes.
	*
	* @returns The cached data for the query, or `undefined` if no query with this key has been observed yet.
	* @see {@link QueryClient#getQueriesData}
	*/
	getQueryData(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state.data;
	}
	/**
	* @deprecated Use queryClient.query({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
	*/
	ensureQueryData(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		const query = this.#queryCache.build(this, defaultedOptions);
		const cachedData = query.state.data;
		if (cachedData === void 0) return this.fetchQuery(options);
		if (options.revalidateIfStale && query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
		return Promise.resolve(cachedData);
	}
	/**
	* Imperative (non-reactive) way to retrieve the cached data of multiple queries at once.
	* Only queries matching the given filters are returned; if none match, an empty array is
	* returned.
	*
	* Because the matched queries can hold data of different shapes (e.g. a broad filter can match
	* queries with unrelated data types), the `TQueryFnData` generic defaults to `unknown` rather
	* than being inferred. Passing a more specific type is a convenience for call sites that know
	* every matched query holds the same shape — it is not checked against the actual cache
	* contents.
	*
	* @returns An array of query key and data pairs. The data is `undefined` for a query with no cached data.
	* @see {@link QueryClient#getQueryData}
	* @example
	* ```ts
	* const data = queryClient.getQueriesData({ queryKey: ['posts'] })
	* ```
	*/
	getQueriesData(filters) {
		return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
			return [queryKey, state.data];
		});
	}
	/**
	* Synchronous way to immediately update a query's cached data. If the updater (or the value
	* passed) resolves to `undefined`, the cache is left untouched and no query is created;
	* otherwise, if the query does not exist yet, it will be created. To update multiple queries
	* at once by partially matching query keys, use {@link QueryClient#setQueriesData} instead.
	*
	* Updates must be performed immutably: do not mutate `oldData`, or data previously retrieved
	* via {@link QueryClient#getQueryData}, in place.
	*
	* @param queryKey - The query key to set data for.
	* @param updater - Either the new data, or a function that receives the current data (which
	* may be `undefined`) and returns the new data.
	* @param options - Set `updatedAt` to override the timestamp the written data is recorded with.
	* @returns The data that was written, or `undefined` if the updater returned `undefined` — in that case
	* the write is skipped and the cache is left unchanged.
	*
	* @example
	* ```ts
	* queryClient.setQueryData(['posts'], newPosts)
	*
	* // Or, using an updater function that receives the current data:
	* queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost])
	* ```
	*/
	setQueryData(queryKey, updater, options) {
		const defaultedOptions = this.defaultQueryOptions({ queryKey });
		const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
		const data = functionalUpdate(updater, prevData);
		if (data === void 0) return;
		return this.#queryCache.build(this, defaultedOptions).setData(data, {
			...options,
			manual: true
		});
	}
	/**
	* Synchronous way to immediately update the cached data of multiple queries at once, using
	* filters or partial query key matching. Only queries that already exist and match the given
	* filters are updated; no new cache entries are created. Internally this calls
	* {@link QueryClient#setQueryData} for each matching query.
	*
	* @returns One `[queryKey, data]` tuple per matched query, in the same shape and with the same
	* `undefined` case as {@link QueryClient#setQueryData}.
	* @example
	* ```ts
	* queryClient.setQueriesData({ queryKey: ['posts'] }, (oldPosts) =>
	*   oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : oldPosts,
	* )
	* ```
	*/
	setQueriesData(filters, updater, options) {
		return notifyManager.batch(() => this.#queryCache.findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
	}
	/**
	* Imperative (non-reactive) way to retrieve an existing query's state. If the query does not
	* exist, `undefined` is returned.
	*
	* @example
	* ```ts
	* const state = queryClient.getQueryState(['posts'])
	* console.log(state?.dataUpdatedAt)
	* ```
	*/
	getQueryState(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state;
	}
	/**
	* Removes queries from the cache that match the given filters. Unlike
	* {@link QueryClient#invalidateQueries} or {@link QueryClient#refetchQueries}, this removes
	* matching queries from the cache instead of refetching them. Without filters, every query in
	* the cache is removed.
	*
	* @example
	* ```ts
	* queryClient.removeQueries({ queryKey: ['posts'], exact: true })
	* ```
	*/
	removeQueries(filters) {
		const queryCache = this.#queryCache;
		notifyManager.batch(() => {
			queryCache.findAll(filters).forEach((query) => {
				queryCache.remove(query);
			});
		});
	}
	/**
	* Resets queries matching the given filters back to their initial state (e.g. any
	* `initialData`), notifying subscribers rather than removing them. Active queries among the
	* matched set are then refetched, and the returned promise resolves once that refetch settles.
	*
	* @example
	* ```ts
	* await queryClient.resetQueries({ queryKey: ['posts'], exact: true })
	* ```
	*/
	resetQueries(filters, options) {
		const queryCache = this.#queryCache;
		return notifyManager.batch(() => {
			const matched = queryCache.findAll(filters);
			const queriesToRefetch = new Set(matched);
			matched.forEach((query) => {
				query.reset();
			});
			return this.refetchQueries({
				type: "active",
				predicate: (query) => queriesToRefetch.has(query)
			}, options);
		});
	}
	/**
	* Cancels outgoing fetches for queries matching the given filters. Most useful when performing
	* optimistic updates, since any outgoing refetch that resolves afterwards would otherwise
	* overwrite the optimistic update. By default (`revert: true`), a cancelled query's data is
	* reverted to its state before the outgoing fetch started.
	*
	* The returned promise never rejects, even if individual cancellations fail.
	*
	* @example
	* ```ts
	* await queryClient.cancelQueries({ queryKey: ['posts'], exact: true })
	* ```
	*/
	cancelQueries(filters, cancelOptions = {}) {
		const defaultedCancelOptions = {
			revert: true,
			...cancelOptions
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
		return Promise.all(promises).then(noop).catch(noop);
	}
	/**
	* Marks queries matching the given filters as invalidated. Unlike
	* {@link QueryClient#removeQueries}, invalidated queries stay in the cache.
	*
	* Unless `filters.refetchType` is `'none'`, matching queries are then refetched via
	* {@link QueryClient#refetchQueries}, using `filters.refetchType` if set, otherwise
	* `filters.type`, otherwise `'active'`.
	*
	* @example
	* ```ts
	* await queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'active' })
	* ```
	*/
	invalidateQueries(filters, options = {}) {
		return notifyManager.batch(() => {
			this.#queryCache.findAll(filters).forEach((query) => {
				query.invalidate();
			});
			if (filters?.refetchType === "none") return Promise.resolve();
			return this.refetchQueries({
				...filters,
				type: filters?.refetchType ?? filters?.type ?? "active"
			}, options);
		});
	}
	/**
	* Refetches queries matching the given filters, regardless of whether they are stale. Without
	* filters, every query in the cache is refetched. Queries that are disabled, or static (only
	* have observers with a static `staleTime`), are never refetched.
	*
	* By default (`cancelRefetch: true`), a currently running fetch is cancelled before the new
	* one starts. The returned promise resolves once all matching queries have settled; it does
	* not reject on individual query failures unless `throwOnError` is set.
	*
	* @example
	* ```ts
	* // refetch all active queries partially matching a query key:
	* await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
	* ```
	*/
	refetchQueries(filters, options = {}) {
		const fetchOptions = {
			...options,
			cancelRefetch: options.cancelRefetch ?? true
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
			let promise = query.fetch(void 0, fetchOptions);
			if (!fetchOptions.throwOnError) promise = promise.catch(noop);
			return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
		}));
		return Promise.all(promises).then(noop);
	}
	/**
	* Asynchronous method to fetch and cache a query, resolving with the data or throwing with
	* the error.
	*
	* If the query already exists in the cache and its data is not stale (per the given
	* `staleTime`), the cached data is returned without fetching. Otherwise, the query is fetched
	* and the promise resolves once the fetch settles. If a `select` function is provided, it is
	* applied to the data in both cases (cached or freshly fetched) before it is returned.
	*
	* Unlike a reactive observer, retries are disabled by default here (`retry: false`) unless
	* explicitly configured, since there is no component to catch a thrown error and retry through
	* re-render.
	*
	* The accepted options are `QueryObserverOptions` minus the fields that only make sense for a
	* reactive observer — `enabled`, `refetchInterval`, `refetchIntervalInBackground`,
	* `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchOnMount`, `retryOnMount`,
	* `notifyOnChangeProps`, `throwOnError`, `suspense`, and `placeholderData` are not part of this
	* method's options.
	*
	* This method replaces the deprecated `fetchQuery`, and — combined with
	* `{ staleTime: 'static' }` — the deprecated `ensureQueryData`.
	*
	* @example
	* ```ts
	* try {
	*   const data = await queryClient.query({ queryKey, queryFn, staleTime: 10000 })
	* } catch (error) {
	*   console.log(error)
	* }
	* ```
	*/
	async query(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
		const query = this.#queryCache.build(this, defaultedOptions);
		const queryData = query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query)) ? await query.fetch(defaultedOptions) : query.state.data;
		const select = defaultedOptions.select;
		if (select) return select(queryData);
		return queryData;
	}
	/**
	* @deprecated Use queryClient.query(options) instead. This method will be removed in the next major version.
	*/
	fetchQuery(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
		const query = this.#queryCache.build(this, defaultedOptions);
		return query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
	}
	/**
	* @deprecated Use queryClient.query(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
	*/
	prefetchQuery(options) {
		return this.fetchQuery(options).then(noop).catch(noop);
	}
	/**
	* Asynchronous method to fetch and cache an infinite query, resolving with an
	* {@link InfiniteData} object or throwing with the error.
	*
	* Behaves like {@link QueryClient#query}, accepting the same options (minus
	* `initialPageParam`), plus the required `initialPageParam`, and an optional `pages` /
	* `getNextPageParam` pair used to refetch a fixed number of pages from the start.
	*
	* This method replaces the deprecated `fetchInfiniteQuery`, and — combined with
	* `{ staleTime: 'static' }` — the deprecated `ensureInfiniteQueryData`.
	*
	* @example
	* ```ts
	* try {
	*   const data = await queryClient.infiniteQuery({ queryKey, queryFn, initialPageParam: 0 })
	*   console.log(data.pages)
	* } catch (error) {
	*   console.log(error)
	* }
	* ```
	*/
	infiniteQuery(options) {
		options._type = "infinite";
		return this.query(options);
	}
	/**
	* @deprecated Use queryClient.infiniteQuery(options) instead. This method will be removed in the next major version.
	*/
	fetchInfiniteQuery(options) {
		options._type = "infinite";
		return this.fetchQuery(options);
	}
	/**
	* @deprecated Use queryClient.infiniteQuery(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
	*/
	prefetchInfiniteQuery(options) {
		return this.fetchInfiniteQuery(options).then(noop).catch(noop);
	}
	/**
	* @deprecated Use queryClient.infiniteQuery({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
	*/
	ensureInfiniteQueryData(options) {
		options._type = "infinite";
		return this.ensureQueryData(options);
	}
	/**
	* Resumes mutations that were paused because there was no network connection. Does nothing
	* (resolving immediately) if the client is currently offline.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* await queryClient.resumePausedMutations()
	* ```
	*/
	resumePausedMutations() {
		if (onlineManager.isOnline()) return this.#mutationCache.resumePausedMutations();
		return Promise.resolve();
	}
	/**
	* Returns the query cache this client is connected to.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* const queryCache = queryClient.getQueryCache()
	* const queries = queryCache.findAll({ queryKey: ['posts'] })
	* ```
	*/
	getQueryCache() {
		return this.#queryCache;
	}
	/**
	* Returns the mutation cache this client is connected to.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* const mutationCache = queryClient.getMutationCache()
	* const mutations = mutationCache.findAll({ status: 'pending' })
	* ```
	*/
	getMutationCache() {
		return this.#mutationCache;
	}
	/**
	* Returns the default options that were set when creating the client, or via
	* {@link QueryClient#setDefaultOptions}.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* const defaultOptions = queryClient.getDefaultOptions()
	* ```
	*/
	getDefaultOptions() {
		return this.#defaultOptions;
	}
	/**
	* Dynamically sets the default options for this client, overwriting any previously defined
	* default options.
	*
	* @see {@link QueryClient#getDefaultOptions}
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* queryClient.setDefaultOptions({
	*   queries: {
	*     staleTime: Infinity,
	*   },
	* })
	* ```
	*/
	setDefaultOptions(options) {
		this.#defaultOptions = options;
	}
	/**
	* Sets default options for queries whose query key partially matches the given `queryKey`.
	*
	* If several registered query defaults match a given query key, they are merged together in
	* registration order by {@link QueryClient#getQueryDefaults}, so register defaults from the
	* most generic key to the least generic one — more specific defaults should be registered
	* after more generic ones so they take precedence.
	*
	* @example
	* ```ts
	* queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })
	*
	* await queryClient.query({ queryKey: ['posts'] })
	* ```
	*/
	setQueryDefaults(queryKey, options) {
		this.#queryDefaults.set(hashKey(queryKey), {
			queryKey,
			defaultOptions: options
		});
	}
	/**
	* Returns the default options registered for queries whose query key partially matches the
	* given `queryKey`, via {@link QueryClient#setQueryDefaults}. If multiple registered defaults
	* match, they are merged together in registration order.
	*
	* @example
	* ```ts
	* const defaultOptions = queryClient.getQueryDefaults(['posts'])
	* ```
	*/
	getQueryDefaults(queryKey) {
		const defaults = [...this.#queryDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	/**
	* Sets default options for mutations whose mutation key partially matches the given
	* `mutationKey`. As with {@link QueryClient#setQueryDefaults}, the order of registration
	* matters when several registered defaults match the same mutation key.
	*
	* @see {@link QueryClient#getMutationDefaults}
	* @example
	* ```ts
	* queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
	* ```
	*/
	setMutationDefaults(mutationKey, options) {
		this.#mutationDefaults.set(hashKey(mutationKey), {
			mutationKey,
			defaultOptions: options
		});
	}
	/**
	* Returns the default options registered for mutations whose mutation key partially matches
	* the given `mutationKey`, via {@link QueryClient#setMutationDefaults}. If multiple registered
	* defaults match, they are merged together in registration order.
	*
	* @example
	* ```ts
	* const defaultOptions = queryClient.getMutationDefaults(['addPost'])
	* ```
	*/
	getMutationDefaults(mutationKey) {
		const defaults = [...this.#mutationDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	/**
	* Called by framework adapters (e.g. inside `useQuery`) to resolve the options passed by the
	* caller into their final, defaulted form: merging `queryClient.setQueryDefaults` for the
	* given `queryKey`, then the client's own `defaultOptions.queries`, then the caller's options
	* on top. A no-op if the options are already defaulted (`_defaulted: true`).
	*/
	defaultQueryOptions(options) {
		if (options._defaulted) return options;
		const defaultedOptions = {
			...this.#defaultOptions.queries,
			...this.getQueryDefaults(options.queryKey),
			...options,
			_defaulted: true
		};
		if (!defaultedOptions.queryHash) defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
		if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
		if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
		if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
		if (defaultedOptions.queryFn === skipToken) defaultedOptions.enabled = false;
		return defaultedOptions;
	}
	/**
	* The mutation counterpart of {@link QueryClient#defaultQueryOptions}. Called by framework
	* adapters (e.g. inside `useMutation`) to merge `queryClient.setMutationDefaults` for the
	* given `mutationKey`, then the client's `defaultOptions.mutations`, then the caller's options
	* on top. A no-op if the options are already defaulted (`_defaulted: true`).
	*/
	defaultMutationOptions(options) {
		if (options?._defaulted) return options;
		return {
			...this.#defaultOptions.mutations,
			...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
			...options,
			_defaulted: true
		};
	}
	/**
	* Clears both the query cache and the mutation cache this client is connected to.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* queryClient.clear()
	* ```
	*/
	clear() {
		this.#queryCache.clear();
		this.#mutationCache.clear();
	}
};
//#endregion
//#region src/lib/auth/provider.tsx
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
//#region src/lib/app-data/types.ts
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
//#endregion
//#region src/lib/preview-embedder-origin.ts
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
//#endregion
//#region src/lib/preview-host-bridge.ts
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
//#endregion
//#region src/components/preview-host-bridge.tsx
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-KNkhgihw.css";
//#endregion
//#region src/routes/__root.tsx
var Route$21 = createRootRoute({
	shellComponent: RootShell,
	component: RootComponent,
	errorComponent: AppErrorComponent,
	notFoundComponent: NotFound
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: "JayTalk" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
				name: "description",
				content: "JayTalk — connect, share and talk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
				name: "theme-color",
				content: "#2F6BFF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "stylesheet",
				href: styles_default
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "icon",
				type: "image/png",
				href: "/brand/favicon.png"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "apple-touch-icon",
				href: "/brand/jaytalk-icon-192.png"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&display=swap"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				richColors: true,
				position: "top-center"
			})
		] })
	});
}
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/brand/jaytalk-icon-192.png",
				alt: "",
				className: "size-14 rounded-2xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 text-4xl font-extrabold",
				children: "That page isn't on JayTalk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Try one of these instead."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					["/", "Home"],
					["/login", "Sign in"],
					["/chat", "Chat"],
					["/friends", "Friends"],
					["/groups", "Groups"],
					["/fyp", "For you"],
					["/moods", "Moods"],
					["/games", "Games"],
					["/challenges", "Challenges"],
					["/store", "Store"],
					["/wallet", "Bucks"],
					["/profile", "Profile"]
				].map(([to, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to,
					className: "rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground",
					children: label
				}, to))
			})
		]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$19 = () => import("./routes-Btk9BVYb.js");
var Route$20 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$19, "component"),
	head: () => ({ meta: [{ title: "JayTalk — Connect. Share. Talk." }, {
		name: "description",
		content: "JayTalk is your social space for conversations, friends, calls and everyday moments."
	}] })
});
//#endregion
//#region src/routes/_app/route.tsx
var $$splitComponentImporter$18 = () => import("./route-DvrvXH_3.js");
var Route$19 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$17 = () => import("./auth-i9fjw1Os.js");
var Route$18 = createFileRoute("/auth")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
//#endregion
//#region src/routes/backend.tsx
var $$splitComponentImporter$16 = () => import("./backend-C2ZsmNJR.js");
var Route$17 = createFileRoute("/backend")({
	component: lazyRouteComponent($$splitComponentImporter$16, "component"),
	head: () => ({ meta: [{ title: "JayTalk Backend" }] })
});
//#endregion
//#region src/routes/bucks.tsx
var $$splitComponentImporter$15 = () => import("./bucks-AOguIZTQ.js");
var Route$16 = createFileRoute("/bucks")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
//#endregion
//#region src/routes/calls.tsx
var $$splitComponentImporter$14 = () => import("./calls-Dx_FPRmi.js");
var Route$15 = createFileRoute("/calls")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$13 = () => import("./login-CDyttrfJ.js");
var Route$14 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [{ title: "Sign in — JayTalk" }, {
		name: "description",
		content: "Sign in or create your JayTalk account."
	}] })
});
//#endregion
//#region src/routes/_app/admin.tsx
var $$splitComponentImporter$12 = () => import("./admin-ABepcCPC.js");
var Route$13 = createFileRoute("/_app/admin")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({ meta: [{ title: "Admin — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/avatar.tsx
var $$splitComponentImporter$11 = () => import("./avatar-Dyd9nBIV.js");
var Route$12 = createFileRoute("/_app/avatar")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	head: () => ({ meta: [{ title: "Avatar — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/challenges.tsx
var $$splitComponentImporter$10 = () => import("./challenges-eE4GToLr.js");
var Route$11 = createFileRoute("/_app/challenges")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: "Challenges — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/chat.tsx
var $$splitComponentImporter$9 = () => import("./chat-B4heGjJA.js");
var Route$10 = createFileRoute("/_app/chat")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: () => ({ meta: [{ title: "Chat — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/friends.tsx
var $$splitComponentImporter$8 = () => import("./friends-DXIyJzhk.js");
var Route$9 = createFileRoute("/_app/friends")({
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({ meta: [{ title: "Friends — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/fyp.tsx
var $$splitComponentImporter$7 = () => import("./fyp-3an7s-RK.js");
var Route$8 = createFileRoute("/_app/fyp")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "For you — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/games.tsx
var $$splitComponentImporter$6 = () => import("./games-D5zi-YHY.js");
var Route$7 = createFileRoute("/_app/games")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "Games — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/groups.tsx
var $$splitComponentImporter$5 = () => import("./groups-D31giD_r.js");
var Route$6 = createFileRoute("/_app/groups")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "Groups — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/moods.tsx
var $$splitComponentImporter$4 = () => import("./moods-BH4uEy_p.js");
var Route$5 = createFileRoute("/_app/moods")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Moods — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/profile.tsx
var $$splitComponentImporter$3 = () => import("./profile-BMVuKP3_.js");
var Route$4 = createFileRoute("/_app/profile")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Profile — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/settings.tsx
var $$splitComponentImporter$2 = () => import("./settings-Dw-gYIe7.js");
var Route$3 = createFileRoute("/_app/settings")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Settings — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/store.tsx
var $$splitComponentImporter$1 = () => import("./store-BDWodF-5.js");
var Route$2 = createFileRoute("/_app/store")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Store — JayTalk" }] })
});
//#endregion
//#region src/routes/_app/wallet.tsx
var $$splitComponentImporter = () => import("./wallet-dwzqKaY7.js");
var Route$1 = createFileRoute("/_app/wallet")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "JayTalk Bucks" }] })
});
//#endregion
//#region src/routes/api/auth/$.ts
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$21
});
var AppRouteRoute = Route$19.update({
	id: "/_app",
	getParentRoute: () => Route$21
});
var AuthRoute = Route$18.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$21
});
var BackendRoute = Route$17.update({
	id: "/backend",
	path: "/backend",
	getParentRoute: () => Route$21
});
var BucksRoute = Route$16.update({
	id: "/bucks",
	path: "/bucks",
	getParentRoute: () => Route$21
});
var CallsRoute = Route$15.update({
	id: "/calls",
	path: "/calls",
	getParentRoute: () => Route$21
});
var LoginRoute = Route$14.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$21
});
var AppAdminRoute = Route$13.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AppRouteRoute
});
var AppAvatarRoute = Route$12.update({
	id: "/avatar",
	path: "/avatar",
	getParentRoute: () => AppRouteRoute
});
var AppChallengesRoute = Route$11.update({
	id: "/challenges",
	path: "/challenges",
	getParentRoute: () => AppRouteRoute
});
var AppChatRoute = Route$10.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AppRouteRoute
});
var AppFriendsRoute = Route$9.update({
	id: "/friends",
	path: "/friends",
	getParentRoute: () => AppRouteRoute
});
var AppFypRoute = Route$8.update({
	id: "/fyp",
	path: "/fyp",
	getParentRoute: () => AppRouteRoute
});
var AppGamesRoute = Route$7.update({
	id: "/games",
	path: "/games",
	getParentRoute: () => AppRouteRoute
});
var AppGroupsRoute = Route$6.update({
	id: "/groups",
	path: "/groups",
	getParentRoute: () => AppRouteRoute
});
var AppMoodsRoute = Route$5.update({
	id: "/moods",
	path: "/moods",
	getParentRoute: () => AppRouteRoute
});
var AppProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRouteRoute
});
var AppSettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRouteRoute
});
var AppStoreRoute = Route$2.update({
	id: "/store",
	path: "/store",
	getParentRoute: () => AppRouteRoute
});
var AppWalletRoute = Route$1.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => AppRouteRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$21
});
var AppRouteRouteChildren = {
	AppAdminRoute,
	AppAvatarRoute,
	AppChallengesRoute,
	AppChatRoute,
	AppFriendsRoute,
	AppFypRoute,
	AppGamesRoute,
	AppGroupsRoute,
	AppMoodsRoute,
	AppProfileRoute,
	AppSettingsRoute,
	AppStoreRoute,
	AppWalletRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRouteRoute: AppRouteRoute._addFileChildren(AppRouteRouteChildren),
	AuthRoute,
	BackendRoute,
	BucksRoute,
	CallsRoute,
	LoginRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$21._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter };

//# sourceMappingURL=router-CnWbWDVH.js.map