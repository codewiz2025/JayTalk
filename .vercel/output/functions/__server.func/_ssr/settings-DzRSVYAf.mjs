import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signOut } from "./client--w0hEszY.mjs";
import { n as Button, t as Avatar } from "./ui-CBRITsGD.mjs";
import { A as Moon, F as LogOut, K as ChevronRight, Z as Bell, c as User, r as Wallet, x as Shield, y as Smartphone } from "../_libs/lucide-react.mjs";
import { a as ThemeButton, n as InstallButton, nt as useMe, r as PageHeading } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DzRSVYAf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadBlocked() {
	try {
		const raw = localStorage.getItem("jaytalk-blocked-meta");
		if (raw) return JSON.parse(raw);
	} catch {}
	try {
		return JSON.parse(localStorage.getItem("jaytalk-blocked") || "[]").map((id) => ({
			id,
			name: "Blocked user"
		}));
	} catch {
		return [];
	}
}
function saveBlocked(list) {
	localStorage.setItem("jaytalk-blocked-meta", JSON.stringify(list));
	localStorage.setItem("jaytalk-blocked", JSON.stringify(list.map((p) => p.id)));
}
function SettingsPage() {
	const me = useMe();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const [privacyOpen, setPrivacyOpen] = (0, import_react.useState)(false);
	const [blocked, setBlocked] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setBlocked(loadBlocked());
	}, []);
	function unblock(id) {
		const next = blocked.filter((p) => p.id !== id);
		setBlocked(next);
		saveBlocked(next);
		toast.success("User unblocked");
	}
	const rows = [
		{
			to: "/profile",
			label: "Profile",
			icon: User,
			hint: "Photo, name, bio"
		},
		{
			to: "/avatar",
			label: "Avatar",
			icon: User,
			hint: "3D look & outfits"
		},
		{
			to: "/wallet",
			label: "Bucks & wallet",
			icon: Wallet,
			hint: "Balance, ads, transfers"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
				title: "Settings",
				subtitle: "Account, privacy, install, and sign out."
			}),
			me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex items-center gap-3 rounded-2xl bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					photo: me.data.photo,
					emoji: me.data.avatarEmoji,
					className: "size-14"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-bold",
						children: me.data.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm text-muted-foreground",
						children: ["@", me.data.username]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "overflow-hidden rounded-2xl bg-card",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: row.to,
					className: "flex min-h-14 items-center gap-3 border-b border-border px-4 last:border-0 hover:bg-muted/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(row.icon, { className: "size-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: row.hint
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-muted-foreground" })
					]
				}, row.to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-2xl bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-14 items-center gap-3 border-b border-border px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm font-semibold",
								children: "Appearance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-14 items-center gap-3 border-b border-border px-4 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 font-semibold text-foreground",
								children: "Notifications"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: "Coming soon"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-h-14 w-full items-center gap-3 border-b border-border px-4 text-left hover:bg-muted/60",
						onClick: () => setPrivacyOpen((v) => !v),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-semibold text-foreground",
									children: "Privacy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: "Blocked users · more options later"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: `size-4 text-muted-foreground transition ${privacyOpen ? "rotate-90" : ""}` })
						]
					}),
					privacyOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-b border-border bg-muted/30 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Blocked users"
						}), blocked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No one blocked. Block people from a chat profile sheet."
						}) : blocked.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: p.name
								}), p.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: ["@", p.username]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "shrink-0 px-3",
								onClick: () => unblock(p.id),
								children: "Unblock"
							})]
						}, p.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-14 items-center gap-3 px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm font-semibold",
								children: "Install app"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "w-full border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }),
					" ",
					signingOut ? "Signing out…" : "Log out"
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
