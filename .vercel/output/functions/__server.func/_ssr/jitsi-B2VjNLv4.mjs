import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as Button } from "./ui-CBRITsGD.mjs";
import { M as MicOff, a as Video, i as Volume2, j as Mic, k as PhoneOff, o as VideoOff } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jitsi-B2VjNLv4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CallFrame({ room, onClose, name = "JayTalk call" }) {
	const href = `https://meet.jit.si/${encodeURIComponent(room)}`;
	const [phase, setPhase] = (0, import_react.useState)("ring");
	const [mic, setMic] = (0, import_react.useState)(true);
	const [cam, setCam] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => setPhase("live"), 2200);
		return () => window.clearTimeout(timer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-slate-950 text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-white/60",
					children: "Calling"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "text-white",
					onClick: onClose,
					children: "Close"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1",
				children: phase === "ring" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mx-auto grid size-28 place-items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 animate-ping rounded-full bg-primary/40" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-3 animate-pulse rounded-full bg-primary/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "relative size-10" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-xl font-extrabold",
								children: "Ringing…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-white/70",
								children: "Connecting your call"
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "JayTalk call",
					className: "h-full w-full border-0",
					allow: "camera; microphone; fullscreen; display-capture; autoplay",
					src: `${href}#config.prejoinPageEnabled=false&config.startWithAudioMuted=${!mic}&config.startWithVideoMuted=${!cam}`
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-4 gap-2 border-t border-white/10 bg-slate-900/95 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs",
						onClick: () => setMic((v) => !v),
						children: [
							mic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-5" }),
							" ",
							mic ? "Mute" : "Unmute"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs",
						onClick: () => setCam((v) => !v),
						children: [
							cam ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-5" }),
							" ",
							cam ? "Camera" : "Cam off"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href,
						target: "_blank",
						rel: "noreferrer",
						className: "flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs",
						children: "Open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex flex-col items-center gap-1 rounded-2xl bg-red-600 py-3 text-xs font-semibold",
						onClick: onClose,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-5" }), " End"]
					})
				]
			})
		]
	});
}
//#endregion
export { CallFrame as t };
