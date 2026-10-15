import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, n as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { C as useRouter, _ as lazyRouteComponent, b as Link, f as Scripts, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as union, Jt as number, Kt as literal, Qt as string, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { p as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as auth } from "./server-De_g9zfP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BadJUwvB.js
var router_BadJUwvB_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
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
var styles_default = "/assets/styles-DLiiSFXS.css";
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
var $$splitComponentImporter$19 = () => import("./routes-CxdWMkMw.mjs");
var Route$20 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$19, "component"),
	head: () => ({ meta: [{ title: "JayTalk — Connect. Share. Talk." }, {
		name: "description",
		content: "JayTalk is your social space for conversations, friends, calls and everyday moments."
	}] })
});
var $$splitComponentImporter$18 = () => import("./route-BSIQgqkS.mjs");
var Route$19 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./auth-DEN_1Kn0.mjs");
var Route$18 = createFileRoute("/auth")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./backend-BDtkVsXq.mjs");
var Route$17 = createFileRoute("/backend")({
	component: lazyRouteComponent($$splitComponentImporter$16, "component"),
	head: () => ({ meta: [{ title: "JayTalk Backend" }] })
});
var $$splitComponentImporter$15 = () => import("./bucks-AgUxaaLZ.mjs");
var Route$16 = createFileRoute("/bucks")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./calls-Ccb5Lrz_.mjs");
var Route$15 = createFileRoute("/calls")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./login-DWqp0vw_.mjs");
var Route$14 = createFileRoute("/login")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [{ title: "Sign in — JayTalk" }, {
		name: "description",
		content: "Sign in or create your JayTalk account."
	}] })
});
var $$splitComponentImporter$12 = () => import("./admin-BvAt_ry9.mjs");
var Route$13 = createFileRoute("/_app/admin")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({ meta: [{ title: "Admin — JayTalk" }] })
});
var $$splitComponentImporter$11 = () => import("./avatar-B7gi-iWM.mjs");
var Route$12 = createFileRoute("/_app/avatar")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	head: () => ({ meta: [{ title: "Avatar — JayTalk" }] })
});
var $$splitComponentImporter$10 = () => import("./challenges-BJQHET3f.mjs");
var Route$11 = createFileRoute("/_app/challenges")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: "Challenges — JayTalk" }] })
});
var $$splitComponentImporter$9 = () => import("./chat-CRoKVZms.mjs");
var Route$10 = createFileRoute("/_app/chat")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: () => ({ meta: [{ title: "Chat — JayTalk" }] })
});
var $$splitComponentImporter$8 = () => import("./friends-R8g7lI4S.mjs");
var Route$9 = createFileRoute("/_app/friends")({
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	head: () => ({ meta: [{ title: "Friends — JayTalk" }] })
});
var $$splitComponentImporter$7 = () => import("./fyp-BR_nriQe.mjs");
var Route$8 = createFileRoute("/_app/fyp")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "For you — JayTalk" }] })
});
var $$splitComponentImporter$6 = () => import("./games-C84hviis.mjs");
var Route$7 = createFileRoute("/_app/games")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "Games — JayTalk" }] })
});
var $$splitComponentImporter$5 = () => import("./groups-DzK-9I_W.mjs");
var Route$6 = createFileRoute("/_app/groups")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "Groups — JayTalk" }] })
});
var $$splitComponentImporter$4 = () => import("./moods-Ds8He3tH.mjs");
var Route$5 = createFileRoute("/_app/moods")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Moods — JayTalk" }] })
});
var $$splitComponentImporter$3 = () => import("./profile-GQtd6zOr.mjs");
var Route$4 = createFileRoute("/_app/profile")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Profile — JayTalk" }] })
});
var $$splitComponentImporter$2 = () => import("./settings-DzRSVYAf.mjs");
var Route$3 = createFileRoute("/_app/settings")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Settings — JayTalk" }] })
});
var $$splitComponentImporter$1 = () => import("./store-CyOj0Ehq.mjs");
var Route$2 = createFileRoute("/_app/store")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Store — JayTalk" }] })
});
var $$splitComponentImporter = () => import("./wallet-BIjiP21D.mjs");
var Route$1 = createFileRoute("/_app/wallet")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "JayTalk Bucks" }] })
});
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
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
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getRouter, router_BadJUwvB_exports as t };
