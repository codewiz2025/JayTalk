import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { n as toast } from "./dist-JcOCBs4u.js";
import { i as Input, n as Button } from "./ui-B3wDlNN7.js";
//#region src/routes/backend.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PASS = "JayTech2022!";
var HQ_LOGO = "https://jaytech.online/_next/image?url=%2Fbrand%2Flogo.png&w=1080&q=75";
function load(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		if (raw) return JSON.parse(raw);
	} catch {}
	return fallback;
}
function BackendPage() {
	const [authed, setAuthed] = (0, import_react.useState)(false);
	const [pw, setPw] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("users");
	const [users, setUsers] = (0, import_react.useState)(() => load("jaytalk-admin-users", []));
	const [ads, setAds] = (0, import_react.useState)(() => load("jaytalk-admin-ads", [{
		id: "1",
		title: "JayTech",
		media: "",
		kind: "image",
		seconds: 20
	}]));
	const [broadcasts, setBroadcasts] = (0, import_react.useState)(() => load("jaytalk-admin-broadcasts", []));
	const [creditUser, setCreditUser] = (0, import_react.useState)("");
	const [creditAmt, setCreditAmt] = (0, import_react.useState)("1000");
	const [adTitle, setAdTitle] = (0, import_react.useState)("");
	const [adSeconds, setAdSeconds] = (0, import_react.useState)("20");
	const [adMedia, setAdMedia] = (0, import_react.useState)("");
	const [bcBody, setBcBody] = (0, import_react.useState)("");
	const [bcMedia, setBcMedia] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem("jaytalk-backend-ok") === "1") setAuthed(true);
	}, []);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("jaytalk-admin-users", JSON.stringify(users));
	}, [users]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("jaytalk-admin-ads", JSON.stringify(ads));
	}, [ads]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("jaytalk-admin-broadcasts", JSON.stringify(broadcasts));
	}, [broadcasts]);
	function login(e) {
		e.preventDefault();
		if (pw === PASS) {
			sessionStorage.setItem("jaytalk-backend-ok", "1");
			setAuthed(true);
		} else toast.error("Wrong password");
	}
	function credit() {
		const amt = Number(creditAmt) || 0;
		if (!creditUser.trim() || amt <= 0) return;
		setUsers((list) => {
			const i = list.findIndex((u) => u.username === creditUser.trim() || u.id === creditUser.trim());
			if (i >= 0) {
				const next = [...list];
				next[i] = {
					...next[i],
					balance: next[i].balance + amt
				};
				return next;
			}
			return [...list, {
				id: crypto.randomUUID(),
				username: creditUser.trim(),
				balance: amt
			}];
		});
		const ledger = load("jaytalk-admin-credits", []);
		ledger.push({
			username: creditUser.trim(),
			amount: amt,
			at: (/* @__PURE__ */ new Date()).toISOString()
		});
		localStorage.setItem("jaytalk-admin-credits", JSON.stringify(ledger));
		toast.success(`Credited ${amt} Bucks`);
	}
	function addAd() {
		if (!adTitle.trim()) return;
		setAds((a) => [...a, {
			id: crypto.randomUUID(),
			title: adTitle.trim(),
			media: adMedia,
			kind: adMedia.includes("video") || adMedia.endsWith(".mp4") ? "video" : "image",
			seconds: Math.max(5, Number(adSeconds) || 20)
		}]);
		setAdTitle("");
		setAdMedia("");
		toast.success("Advert saved");
	}
	function sendBroadcast() {
		if (!bcBody.trim() && !bcMedia) return;
		const item = {
			id: crypto.randomUUID(),
			body: bcBody.trim(),
			media: bcMedia || void 0,
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		setBroadcasts((b) => [item, ...b]);
		localStorage.setItem("jaytalk-hq-pending", JSON.stringify(item));
		setBcBody("");
		setBcMedia("");
		toast.success("Broadcast queued for JayTalk HQ");
	}
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-slate-950 px-4 text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			className: "w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-slate-900 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: HQ_LOGO,
					alt: "JayTech",
					className: "mx-auto h-12 object-contain"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-center text-xl font-bold",
					children: "JayTalk Backend"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					placeholder: "Password",
					value: pw,
					onChange: (e) => setPw(e.target.value),
					className: "bg-slate-800 text-white"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					children: "Enter"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-slate-950 px-4 py-6 text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: HQ_LOGO,
							alt: "",
							className: "h-10 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-extrabold",
							children: "Backend"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							sessionStorage.removeItem("jaytalk-backend-ok");
							setAuthed(false);
						},
						children: "Lock"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"users",
						"ads",
						"broadcast"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `rounded-xl px-3 py-2 text-sm font-semibold ${tab === t ? "bg-indigo-600" : "bg-slate-800"}`,
						onClick: () => setTab(t),
						children: t
					}, t))
				}),
				tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 rounded-2xl bg-slate-900 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: "Credit Bucks / manage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "username",
									value: creditUser,
									onChange: (e) => setCreditUser(e.target.value),
									className: "bg-slate-800"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "amount",
									value: creditAmt,
									onChange: (e) => setCreditAmt(e.target.value),
									className: "w-28 bg-slate-800"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: credit,
									children: "Give Bucks"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Temporary store — wire to Supabase admin API later for live balances, block, and delete."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["@", u.username] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [u.balance, " B"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "px-2 text-xs",
											onClick: () => setUsers((list) => list.map((x) => x.id === u.id ? {
												...x,
												blockedUntil: new Date(Date.now() + 864e5).toISOString()
											} : x)),
											children: "Block 24h"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "px-2 text-xs text-rose-400",
											onClick: () => setUsers((list) => list.filter((x) => x.id !== u.id)),
											children: "Delete"
										})]
									})
								]
							}, u.id))
						})
					]
				}),
				tab === "ads" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 rounded-2xl bg-slate-900 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: "Adverts (default 20s)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Title",
							value: adTitle,
							onChange: (e) => setAdTitle(e.target.value),
							className: "bg-slate-800"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Image/video URL",
							value: adMedia,
							onChange: (e) => setAdMedia(e.target.value),
							className: "bg-slate-800"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Seconds",
							value: adSeconds,
							onChange: (e) => setAdSeconds(e.target.value),
							className: "bg-slate-800"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: addAd,
							children: "Add advert"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: ads.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl bg-slate-800 px-3 py-2 text-sm",
								children: [
									a.title,
									" · ",
									a.seconds,
									"s · ",
									a.kind,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "ml-2 px-2 text-xs",
										onClick: () => setAds((list) => list.filter((x) => x.id !== a.id)),
										children: "Remove"
									})
								]
							}, a.id))
						})
					]
				}),
				tab === "broadcast" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 rounded-2xl bg-slate-900 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-bold",
							children: "Broadcast → JayTalk HQ chat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "min-h-24 w-full rounded-xl bg-slate-800 p-3 text-sm",
							placeholder: "Message",
							value: bcBody,
							onChange: (e) => setBcBody(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Optional image URL",
							value: bcMedia,
							onChange: (e) => setBcMedia(e.target.value),
							className: "bg-slate-800"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: sendBroadcast,
							children: "Send broadcast"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: broadcasts.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl bg-slate-800 px-3 py-2",
								children: [b.body, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-slate-400",
									children: new Date(b.at).toLocaleString()
								})]
							}, b.id))
						})
					]
				})
			]
		})
	});
}
//#endregion
export { BackendPage as component };

//# sourceMappingURL=backend-C2ZsmNJR.js.map