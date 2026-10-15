import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { D as createLucideIcon } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { ct as Sun, dt as Moon, ht as Gamepad2, mt as Heart, r as PageHeading } from "./shell-v69-fRR6.js";
import { n as Button } from "./ui-B3wDlNN7.js";
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RotateCcw = createLucideIcon("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Star = createLucideIcon("star", [["path", {
	d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
	key: "r04s7s"
}]]);
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Zap = createLucideIcon("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]);
//#endregion
//#region src/routes/_app/games.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var icons = [
	Sun,
	Moon,
	Heart,
	Star,
	Zap,
	Gamepad2
];
function shuffle() {
	return [...icons, ...icons].map((icon) => ({
		icon,
		r: Math.random()
	})).sort((a, b) => a.r - b.r).map((item) => item.icon);
}
function GamesPage() {
	const [cards, setCards] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)([]);
	const [found, setFound] = (0, import_react.useState)([]);
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [best, setBest] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setCards(shuffle());
		const saved = localStorage.getItem("jaytalk-memory-best");
		if (saved) setBest(Number(saved));
	}, []);
	(0, import_react.useEffect)(() => {
		if (open.length !== 2) return;
		const [a, b] = open;
		const timer = window.setTimeout(() => {
			if (cards[a] === cards[b]) setFound((current) => [
				...current,
				a,
				b
			]);
			setOpen([]);
		}, 650);
		return () => window.clearTimeout(timer);
	}, [open, cards]);
	const won = cards.length > 0 && found.length === cards.length;
	(0, import_react.useEffect)(() => {
		if (!won) return;
		if (best === null || moves < best) {
			setBest(moves);
			localStorage.setItem("jaytalk-memory-best", String(moves));
		}
	}, [
		won,
		best,
		moves
	]);
	function flip(index) {
		if (open.length === 2 || open.includes(index) || found.includes(index)) return;
		if (open.length === 1) setMoves((m) => m + 1);
		setOpen((current) => [...current, index]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
				title: "Games",
				subtitle: "Memory match. Find every pair in as few moves as you can."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Moves: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: moves }),
					best !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [" · Best ", best]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => {
						setCards(shuffle());
						setOpen([]);
						setFound([]);
						setMoves(0);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Restart"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-3",
				children: cards.map((Icon, index) => {
					const shown = open.includes(index) || found.includes(index);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": shown ? "Card" : "Hidden card",
						className: `grid aspect-square place-items-center rounded-2xl ${shown ? "bg-secondary text-primary" : "bg-primary text-primary-foreground"}`,
						onClick: () => flip(index),
						children: shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, {})
					}, index);
				})
			}),
			won && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 font-semibold text-primary",
				children: [
					"You found every pair in ",
					moves,
					" moves."
				]
			})
		]
	});
}
//#endregion
export { GamesPage as component };

//# sourceMappingURL=games-D5zi-YHY.js.map