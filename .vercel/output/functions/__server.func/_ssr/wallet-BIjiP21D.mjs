import { o as __toESM } from "../_runtime.mjs";
import { i as formatBucks, l as waLink, n as PACKS, s as transferAmount } from "./jaytalk-BUSANd3K.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as errText, i as Input, n as Button, t as Avatar } from "./ui-CBRITsGD.mjs";
import { B as Flame, C as Send, P as MessageCircle, d as Tv, f as Trophy, n as X } from "../_libs/lucide-react.mjs";
import { G as searchPeople, L as listTx, O as getWallet, Q as transferBucks, X as startAd, f as claimAd, h as claimStreak, k as leaderboard, r as PageHeading, rt as useStreakRestore } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wallet-BIjiP21D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AD_GRADIENTS = {
	"AI & Technology": "linear-gradient(135deg, #0f172a 0%, #312e81 50%, #4f46e5 100%)",
	Education: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #99f6e4 100%)",
	"E-commerce": "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #fb7185 100%)",
	Creative: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fdba74 100%)",
	Business: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #93c5fd 100%)",
	Sports: "linear-gradient(135deg, #14532d 0%, #16a34a 50%, #86efac 100%)"
};
function WalletPage() {
	const qc = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("overview");
	const wallet = useQuery({
		queryKey: ["wallet"],
		queryFn: () => getWallet()
	});
	const tx = useQuery({
		queryKey: ["tx"],
		queryFn: () => listTx()
	});
	const board = useQuery({
		queryKey: ["board"],
		queryFn: () => leaderboard()
	});
	const refresh = () => {
		qc.invalidateQueries({ queryKey: ["wallet"] });
		qc.invalidateQueries({ queryKey: ["tx"] });
		qc.invalidateQueries({ queryKey: ["board"] });
		qc.invalidateQueries({ queryKey: ["me"] });
	};
	const w = wallet.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
				title: "JayTalk Bucks",
				subtitle: "Streaks, a daily portfolio advert, sending, and the richest members."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto rounded-2xl bg-card p-1",
				children: [
					"overview",
					"navigation",
					"activity"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(key),
					className: `min-h-11 flex-1 rounded-xl px-3 text-sm font-semibold capitalize ${tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
					children: key
				}, key))
			}),
			tab === "navigation" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "Navigation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						{
							to: "/chat",
							label: "Chat"
						},
						{
							to: "/friends",
							label: "Friends"
						},
						{
							to: "/groups",
							label: "Groups"
						},
						{
							to: "/fyp",
							label: "For you"
						},
						{
							to: "/moods",
							label: "Moods"
						},
						{
							to: "/games",
							label: "Games"
						},
						{
							to: "/challenges",
							label: "Challenges"
						},
						{
							to: "/store",
							label: "Store"
						},
						{
							to: "/avatar",
							label: "Avatar"
						},
						{
							to: "/wallet",
							label: "Bucks"
						},
						{
							to: "/profile",
							label: "Profile"
						},
						{
							to: "/settings",
							label: "Settings"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "flex min-h-11 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-primary",
						children: item.label
					}, item.to))
				})]
			}),
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-primary p-6 text-primary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold opacity-80",
							children: "Balance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-5xl font-extrabold",
							children: formatBucks(w?.balance ?? 0).replace(" Bucks", "")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm opacity-80",
							children: "Bucks"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex items-center gap-3 rounded-2xl bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-8 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [w?.streak ?? 0, "-day streak"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: w?.claimedToday ? "Come back tomorrow to keep it going." : "Claim today. Miss a day and it resets."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: w?.claimedToday,
							onClick: () => void claimStreak().then((r) => {
								toast.success(`Day ${r.streak}! +${formatBucks(r.reward + r.bonus)}`);
								refresh();
							}).catch((e) => toast.error(errText(e))),
							children: w?.claimedToday ? "Claimed" : "Claim"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => void useStreakRestore().then(() => {
						toast.success("Streak protected. Claim it today.");
						refresh();
					}).catch((e) => toast.error(errText(e))),
					children: "Use streak restore"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdCard, {
					done: Boolean(w?.adDone),
					onDone: refresh
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendBucks, { onDone: refresh }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3 rounded-2xl bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Buy Bucks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: PACKS.map((pack) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: waLink(pack.bucks, pack.naira),
								target: "_blank",
								rel: "noreferrer",
								className: "rounded-xl border border-border p-3 text-center hover:border-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: formatBucks(pack.bucks)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["₦", pack.naira.toLocaleString("en-NG")]
								})]
							}, pack.bucks))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Pay on WhatsApp ",
								"08164584620",
								". An admin will credit your wallet."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-3 flex items-center gap-2 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-primary" }), " Leaderboard"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: board.data?.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 text-sm font-bold text-muted-foreground",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									photo: row.photo,
									emoji: row.avatar_emoji,
									className: "size-8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex-1 truncate text-sm font-semibold",
									children: ["@", row.username]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-primary",
									children: Number(row.balance).toLocaleString("en-NG")
								})
							]
						}, row.username))
					})]
				})
			] }),
			tab === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-2xl bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 font-semibold",
						children: "History"
					}),
					tx.data?.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 border-b border-border py-2 text-sm last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate",
							children: row.note
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: row.amount >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-rose-600",
							children: [row.amount >= 0 ? "+" : "", row.amount.toLocaleString("en-NG")]
						})]
					}, row.id)),
					tx.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing yet."
					})
				]
			})
		]
	});
}
function AdCard({ done, onDone }) {
	const [site, setSite] = (0, import_react.useState)(null);
	const [secs, setSecs] = (0, import_react.useState)(15);
	const [askClose, setAskClose] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!site || secs <= 0) return;
		const timer = window.setTimeout(() => setSecs((s) => s - 1), 1e3);
		return () => window.clearTimeout(timer);
	}, [site, secs]);
	async function start() {
		try {
			const next = await startAd();
			setSite(next);
			setSecs(15);
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function claim(clicked) {
		try {
			const result = await claimAd({ data: { clicked } });
			toast.success(`+${formatBucks(result.reward)} from JayTech Digitals`);
			setSite(null);
			onDone();
		} catch (error) {
			toast.error(errText(error));
		}
	}
	if (site) {
		const gradient = AD_GRADIENTS[site.category] ?? AD_GRADIENTS["Business"];
		const initial = site.name.slice(0, 1).toUpperCase();
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "fixed inset-0 z-50 flex flex-col justify-end text-white",
			style: { background: gradient },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 flex items-center justify-center opacity-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[28vw] font-black leading-none select-none",
						children: initial
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close advert",
					className: "absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-black/40",
					onClick: () => setAskClose(true),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative m-4 rounded-3xl bg-black/60 p-5 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide uppercase opacity-80",
							children: site.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 text-2xl font-extrabold",
							children: site.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "my-2 text-sm opacity-80",
							children: site.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 h-2 overflow-hidden rounded-full bg-white/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-amber-400 transition-all duration-1000",
								style: { width: `${(15 - secs) / 15 * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground",
							href: site.url,
							target: "_blank",
							rel: "noreferrer",
							onClick: () => {
								if (secs <= 0) claim(true);
							},
							children: "Visit site"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: secs > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-white/70",
								children: [
									"Reward unlocks in ",
									secs,
									"s"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => void claim(false),
								children: "Claim reward"
							})
						}),
						askClose && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl bg-white/10 p-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Close now and you won't get today's advert Bucks." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => setAskClose(false),
									children: "Keep watching"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => {
										setSite(null);
										setAskClose(false);
									},
									children: "Close"
								})]
							})]
						})
					]
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex items-center gap-3 rounded-2xl bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tv, { className: "size-8 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Daily advert"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "A random JayTech portfolio site · 50–500 Bucks"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: done,
				onClick: () => void start(),
				children: done ? "Done today" : "Watch"
			})
		]
	});
}
function SendBucks({ onDone }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const results = useQuery({
		queryKey: ["pay-search", q],
		enabled: q.trim().length >= 2 && !username,
		queryFn: () => searchPeople({ data: { q } })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3 rounded-2xl bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4 text-primary" }), " Send Bucks"]
			}),
			username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["To @", username] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "font-semibold text-primary",
					onClick: () => setUsername(""),
					children: "Change"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search username",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}), results.data?.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "block w-full px-2 py-2 text-left text-sm hover:bg-muted",
				onClick: () => setUsername(user.username),
				children: [
					user.full_name,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: ["@", user.username]
					})
				]
			}, user.id))] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					placeholder: "Amount",
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const n = transferAmount(amount);
						if (!username || !n) {
							toast.error("Pick a person and a valid amount.");
							return;
						}
						transferBucks({ data: {
							username,
							amount: n
						} }).then(() => {
							toast.success("Sent");
							setAmount("");
							setUsername("");
							setQ("");
							onDone();
						}).catch((e) => toast.error(errText(e)));
					},
					children: "Send"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-1 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-3" }), " Transfers are instant and secure."]
			})
		]
	});
}
//#endregion
export { WalletPage as component };
