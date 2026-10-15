import "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { n as Outlet } from "./Match-B4OeR-Uo.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { t as Navigate } from "./useNavigate-OMjWysX7.js";
import { gt as useRouterState, i as Shell, o as useMe, rt as useCurrentUserState } from "./shell-v69-fRR6.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
//#endregion
//#region src/routes/_app/route.tsx?tsr-split=component
function AppLayout() {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const me = useMe();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted-foreground",
		children: "Opening JayTalk…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen place-items-center gap-3 px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading your profile…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "If this takes more than a few seconds, refresh the page."
		})]
	});
	if (me.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-screen place-items-center gap-3 px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: me.error instanceof Error ? me.error.message : "Couldn't load your profile."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
			onClick: () => void me.refetch(),
			children: "Try again"
		})]
	});
	if (!me.data && pathname !== "/profile") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/profile" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AppLayout as component };

//# sourceMappingURL=route-DvrvXH_3.js.map