import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as Button } from "./ui-CBRITsGD.mjs";
import { A as Moon, L as Heart, R as Gamepad2, _ as Star, g as Sun, t as Zap, w as RotateCcw } from "../_libs/lucide-react.mjs";
import { r as PageHeading } from "./shell-DX5LxS3D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/games-C84hviis.js
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
