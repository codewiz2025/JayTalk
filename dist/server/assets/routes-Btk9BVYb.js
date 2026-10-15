import { D as createLucideIcon, O as Link } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { t as Navigate } from "./useNavigate-OMjWysX7.js";
import { a as ThemeButton, mt as Heart, n as InstallButton, ot as Users, pt as MessageCircle, rt as useCurrentUserState, t as Brand } from "./shell-v69-fRR6.js";
import { t as Send } from "./send-CI7pTp_g.js";
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ArrowUpRight = createLucideIcon("arrow-up-right", [["path", {
	d: "M7 7h10v10",
	key: "1tivn9"
}], ["path", {
	d: "M7 17 17 7",
	key: "1vkiza"
}]]);
//#endregion
//#region src/assets/jaytalk-friends.jpg
var jaytalk_friends_default = "/assets/jaytalk-friends-D138evnI.jpg";
//#endregion
//#region src/assets/jaytalk-community.jpg
var jaytalk_community_default = "/assets/jaytalk-community-mP0ZfnUk.jpg";
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var features = [
	{
		icon: MessageCircle,
		title: "Chat",
		copy: "Private messages, groups, and Jitsi calls."
	},
	{
		icon: Send,
		title: "Share",
		copy: "Moods for a day. Videos once you own a channel."
	},
	{
		icon: Users,
		title: "Make friends",
		copy: "Find people, follow channels, and talk."
	},
	{
		icon: Heart,
		title: "Bucks",
		copy: "Earn from likes, comments, and follows. Spend in the store."
	}
];
function Home() {
	const { user, isPending } = useCurrentUserState();
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/chat" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "app-topbar",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {}),
					!isPending && (user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/chat",
						className: "inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground",
						children: "Open JayTalk"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold",
						children: "Log in"
					}))
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "landing-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: jaytalk_friends_default,
					width: 1536,
					height: 1024,
					alt: "Friends sharing a moment over a phone"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "landing-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-primary",
							children: "Welcome to JayTalk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-3 max-w-xl text-5xl font-extrabold leading-tight sm:text-6xl",
							children: [
								"Connect.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Share. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "Talk."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-sm text-sm leading-7",
							children: "Your people. Your moments. Your space. Chat, make friends, and earn JayTalk Bucks along the way."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/login",
								className: "inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground",
								children: ["Get started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/chat",
								className: "inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-semibold",
								children: "Open chat"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4",
				children: features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 place-items-center rounded-xl bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(feature.icon, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-sm font-bold",
						children: feature.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: feature.copy
					})
				] }, feature.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-6 px-6 pb-12 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: jaytalk_community_default,
					alt: "People together at a bright gathering",
					className: "h-72 w-full rounded-2xl object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-extrabold",
					children: "A little conversation. A lot of connection."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-7 text-muted-foreground",
					children: "Groups have a built-in Jitsi room. For You posts need a channel you buy with Bucks. Likes, comments, and new followers pay the creator. Dislikes and unfollows take Bucks back."
				})] })]
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "mx-auto flex max-w-6xl justify-between border-t border-border px-6 py-5 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JayTalk · Made for connection" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://jaytech.online",
				target: "_blank",
				rel: "noreferrer",
				children: "JayTech Digitals"
			})]
		})
	] });
}
//#endregion
export { Home as component };

//# sourceMappingURL=routes-Btk9BVYb.js.map