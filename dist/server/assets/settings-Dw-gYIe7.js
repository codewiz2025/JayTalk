import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { D as createLucideIcon, O as Link } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { a as ThemeButton, at as Wallet, dt as Moon, n as InstallButton, o as useMe, r as PageHeading } from "./shell-v69-fRR6.js";
import { r as signOut } from "./client-Cb0S1Eu3.js";
import { n as toast } from "./dist-JcOCBs4u.js";
import { n as Button, t as Avatar } from "./ui-B3wDlNN7.js";
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Bell = createLucideIcon("bell", [["path", {
	d: "M10.268 21a2 2 0 0 0 3.464 0",
	key: "vwvbt9"
}], ["path", {
	d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
	key: "11g9vi"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LogOut = createLucideIcon("log-out", [
	["path", {
		d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
		key: "1uf3rs"
	}],
	["polyline", {
		points: "16 17 21 12 16 7",
		key: "1gabdz"
	}],
	["line", {
		x1: "21",
		x2: "9",
		y1: "12",
		y2: "12",
		key: "1uyos4"
	}]
]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Shield = createLucideIcon("shield", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Smartphone = createLucideIcon("smartphone", [["rect", {
	width: "14",
	height: "20",
	x: "5",
	y: "2",
	rx: "2",
	ry: "2",
	key: "1yt0o3"
}], ["path", {
	d: "M12 18h.01",
	key: "mhygvu"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var User = createLucideIcon("user", [["path", {
	d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
	key: "975kel"
}], ["circle", {
	cx: "12",
	cy: "7",
	r: "4",
	key: "17ys0d"
}]]);
//#endregion
//#region src/routes/_app/settings.tsx?tsr-split=component
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

//# sourceMappingURL=settings-Dw-gYIe7.js.map