import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as errText, i as Input, n as Button, t as Avatar } from "./ui-CBRITsGD.mjs";
import { H as EllipsisVertical, I as ImagePlus, J as ChevronDown, O as Phone, Q as Ban, T as Reply, W as Copy, X as CheckCheck, Y as Check, a as Video, et as Archive, m as Trash2, q as ChevronLeft, r as Wallet, v as Smile, z as Forward } from "../_libs/lucide-react.mjs";
import { D as getTyping, F as listPosts, G as searchPeople, P as listMessages, R as markRead, Y as setTyping, j as listConversations, nt as useMe, q as sendMessage } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as CallFrame } from "./jitsi-B2VjNLv4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-CRoKVZms.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function loadSet(key) {
	try {
		return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function saveSet(key, value) {
	localStorage.setItem(key, JSON.stringify([...value]));
}
function isOnline(id) {
	let h = 0;
	for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 100;
	return h % 3 !== 0;
}
function dayLabel(iso) {
	const d = new Date(iso);
	const now = /* @__PURE__ */ new Date();
	const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
	const diff = Math.round((start(now) - start(d)) / 864e5);
	if (diff === 0) return "Today";
	if (diff === 1) return "Yesterday";
	if (diff < 7) return d.toLocaleDateString([], { weekday: "long" });
	if (diff < 14) return "Last week";
	if (diff < 30) return "A few weeks ago";
	return d.toLocaleDateString([], {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function ChatPage() {
	const qc = useQueryClient();
	const [person, setPerson] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [room, setRoom] = (0, import_react.useState)(null);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const [menuMsg, setMenuMsg] = (0, import_react.useState)(null);
	const [replyTo, setReplyTo] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [hiddenMsgs, setHiddenMsgs] = (0, import_react.useState)(() => loadSet("jaytalk-hidden-msgs"));
	const [reactMsg, setReactMsg] = (0, import_react.useState)(null);
	const [reactions, setReactions] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("jaytalk-msg-reactions") || "{}");
		} catch {
			return {};
		}
	});
	const [showScrollDown, setShowScrollDown] = (0, import_react.useState)(false);
	const threadRef = (0, import_react.useRef)(null);
	const [selectMode, setSelectMode] = (0, import_react.useState)(false);
	const [blocked, setBlocked] = (0, import_react.useState)(() => loadSet("jaytalk-blocked"));
	const [archived, setArchived] = (0, import_react.useState)(() => loadSet("jaytalk-archived"));
	const [showArchived, setShowArchived] = (0, import_react.useState)(false);
	const me = useMe();
	const bottom = (0, import_react.useRef)(null);
	const conversations = useQuery({
		queryKey: ["conversations"],
		queryFn: () => listConversations(),
		refetchInterval: 4e3
	});
	const found = useQuery({
		queryKey: ["people", q],
		enabled: q.trim().length >= 2,
		queryFn: () => searchPeople({ data: { q: q.trim() } })
	});
	const messages = useQuery({
		queryKey: ["messages", person?.id],
		enabled: Boolean(person),
		queryFn: () => listMessages({ data: { userId: person.id } }),
		refetchInterval: 3e3
	});
	const moods = useQuery({
		queryKey: ["posts", "mood"],
		queryFn: () => listPosts({ data: { kind: "mood" } }),
		refetchInterval: 2e4
	});
	const typing = useQuery({
		queryKey: [
			"typing",
			person?.id,
			me.data?.userId
		],
		enabled: Boolean(person && me.data),
		queryFn: () => getTyping({ data: { key: dmKey(me.data.userId, person.id) } }),
		refetchInterval: 2e3
	});
	(0, import_react.useEffect)(() => {
		bottom.current?.scrollIntoView({ block: "nearest" });
	}, [messages.data?.length]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("jaytalk-msg-reactions", JSON.stringify(reactions));
	}, [reactions]);
	(0, import_react.useEffect)(() => {
		if (!person) return;
		markRead({ data: { userId: person.id } }).then(() => qc.invalidateQueries({ queryKey: ["conversations"] }));
	}, [
		person,
		messages.data?.length,
		qc
	]);
	function toggle(key, id) {
		const [set, setter] = key === "block" ? [blocked, setBlocked] : [archived, setArchived];
		const next = new Set(set);
		const was = next.has(id);
		was ? next.delete(id) : next.add(id);
		setter(next);
		saveSet(key === "block" ? "jaytalk-blocked" : "jaytalk-archived", next);
		if (key === "block") try {
			const meta = JSON.parse(localStorage.getItem("jaytalk-blocked-meta") || "[]");
			if (!was) {
				const name = person?.full_name || person?.username || "Blocked user";
				const username = person?.username;
				const filtered = meta.filter((m) => m.id !== id);
				filtered.push({
					id,
					name,
					username
				});
				localStorage.setItem("jaytalk-blocked-meta", JSON.stringify(filtered));
			} else localStorage.setItem("jaytalk-blocked-meta", JSON.stringify(meta.filter((m) => m.id !== id)));
		} catch {}
		toast.success(next.has(id) ? key === "block" ? "Blocked" : "Archived" : key === "block" ? "Unblocked" : "Unarchived");
		if (key === "block" || key === "archive") setPerson(null);
		setSheet(false);
	}
	async function send(body = text) {
		if (!person || !body.trim()) return;
		if (blocked.has(person.id)) {
			toast.error("Unblock this person to send a message.");
			return;
		}
		try {
			const payload = replyTo ? `↩ ${replyTo.body.slice(0, 40)}\n${body}` : body;
			await sendMessage({ data: {
				userId: person.id,
				body: payload
			} });
			setText("");
			setReplyTo(null);
			await qc.invalidateQueries({ queryKey: ["messages", person.id] });
			await qc.invalidateQueries({ queryKey: ["conversations"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function call() {
		if (!person) return;
		const id = `JayTalk${crypto.randomUUID().replace(/-/g, "")}`;
		await send(`Call invitation: https://meet.jit.si/${id}`);
		setRoom(id);
	}
	const list = (conversations.data ?? []).filter((row) => row.person && (showArchived ? archived.has(row.person.id) : !archived.has(row.person.id)) && !blocked.has(row.person.id));
	const moodStories = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of moods.data ?? []) if (!map.has(p.author_id)) map.set(p.author_id, {
			id: p.author_id,
			username: p.username,
			photo: p.photo,
			emoji: p.avatar_emoji,
			body: p.body
		});
		return [...map.values()].slice(0, 12);
	}, [moods.data]);
	const grouped = (0, import_react.useMemo)(() => {
		const rows = [];
		let last = "";
		for (const m of messages.data ?? []) {
			const label = dayLabel(m.created_at);
			if (label !== last) {
				rows.push({
					label,
					items: []
				});
				last = label;
			}
			rows[rows.length - 1].items.push(m);
		}
		return rows;
	}, [messages.data]);
	function onMsgAction(action, m) {
		setMenuMsg(null);
		if (action === "copy") {
			navigator.clipboard.writeText(m.body.startsWith("data:image/") ? "[photo]" : m.body);
			toast.success("Copied");
		} else if (action === "reply") setReplyTo(m);
		else if (action === "forward") {
			toast.message("Copied — open another chat and paste to forward.");
			navigator.clipboard.writeText(m.body);
		} else if (action === "delete") {
			setHiddenMsgs((prev) => {
				const next = new Set(prev);
				next.add(m.id);
				saveSet("jaytalk-hidden-msgs", next);
				return next;
			});
			toast.success("Message deleted");
		} else if (action === "select") {
			setSelectMode(true);
			setSelected(/* @__PURE__ */ new Set([m.id]));
		} else if (action === "react") setReactMsg(m);
	}
	function addReaction(msgId, emoji) {
		setReactions((prev) => {
			const cur = prev[msgId] ?? [];
			const nextList = cur.includes(emoji) ? cur.filter((e) => e !== emoji) : [...cur, emoji];
			return {
				...prev,
				[msgId]: nextList
			};
		});
		setReactMsg(null);
	}
	function scrollToLatest() {
		bottom.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
		setShowScrollDown(false);
	}
	function onThreadScroll(e) {
		const el = e.currentTarget;
		const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
		setShowScrollDown(dist > 120);
	}
	function chatMyself() {
		if (!me.data) return;
		setPerson({
			id: me.data.userId,
			username: me.data.username,
			full_name: me.data.fullName || "Me",
			avatar_emoji: me.data.avatarEmoji || "🙂",
			photo: me.data.photo
		});
	}
	async function enableNotifications() {
		if (!("Notification" in window)) {
			toast.error("Notifications not supported on this device");
			return;
		}
		if (await Notification.requestPermission() === "granted") {
			localStorage.setItem("jaytalk-notify", "1");
			new Notification("JayTalk", {
				body: "Notifications are on.",
				icon: "/brand/jaytalk-logo.png"
			});
			toast.success("Notifications enabled");
		} else toast.error("Permission denied");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "chat-app",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `chat-list ${person ? "chat-list-hidden" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-extrabold",
							children: "Chats"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-semibold text-primary",
									onClick: chatMyself,
									children: "Note to self"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-semibold text-muted-foreground",
									onClick: () => void enableNotifications(),
									children: "Notify"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-semibold text-primary",
									onClick: () => setShowArchived((v) => !v),
									children: showArchived ? "Active" : "Archived"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mood-stories mb-3 flex gap-3 overflow-x-auto px-1 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/moods",
							className: "flex w-16 shrink-0 flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "story-ring story-ring-me grid size-14 place-items-center rounded-full bg-muted text-xl font-bold",
								children: "+"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-full truncate text-center text-[10px] font-medium",
								children: "Your mood"
							})]
						}), moodStories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/moods",
							className: "flex w-16 shrink-0 flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "story-ring relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									photo: s.photo,
									emoji: s.emoji,
									className: "size-14"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-full truncate text-center text-[10px] font-medium",
								children: ["@", s.username]
							})]
						}, s.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						"aria-label": "Search people",
						placeholder: "Search or start a new chat",
						value: q,
						onChange: (e) => setQ(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-1",
						children: found.data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-center gap-2 rounded-2xl bg-muted p-2 text-left transition hover:scale-[1.01]",
							onClick: () => {
								setPerson(p);
								setQ("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									photo: p.photo,
									emoji: p.avatar_emoji,
									className: "size-10"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `presence-dot ${isOnline(p.id) ? "online" : "offline"}` })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold",
									children: p.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-xs text-muted-foreground",
									children: ["@", p.username]
								})]
							})]
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 space-y-0.5",
						children: [list.map((row) => row.person && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition ${person?.id === row.person.id ? "bg-sky-100 dark:bg-sky-900/40" : "hover:bg-muted"}`,
							onClick: () => setPerson(row.person),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									photo: row.person.photo,
									emoji: row.person.avatar_emoji,
									className: "size-12"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `presence-dot ${isOnline(row.person.id) ? "online" : "offline"}` })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm font-semibold",
										children: row.person.full_name || `@${row.person.username}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[10px] text-muted-foreground",
										children: row.at ? new Date(row.at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										}) : ""
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-xs text-muted-foreground",
										children: row.last
									}), row.unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground",
										children: row.unread
									})]
								})]
							})]
						}, row.person.id)), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 text-xs text-muted-foreground",
							children: showArchived ? "No archived chats." : "No conversations yet."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: `chat-thread ${person ? "chat-thread-open" : ""}`,
				children: person ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center gap-2 border-b border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-10 place-items-center rounded-full hover:bg-muted md:hidden",
								"aria-label": "Back",
								onClick: () => setPerson(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-w-0 flex-1 items-center gap-2 text-left",
								onClick: () => setSheet(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										photo: person.photo,
										emoji: person.avatar_emoji,
										className: "size-10"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `presence-dot ${isOnline(person.id) ? "online" : "offline"}` })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-bold",
										children: person.full_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: typing.data?.length ? "Typing…" : isOnline(person.id) ? "Online" : `@${person.username}`
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "size-11 px-0",
								"aria-label": "Voice call",
								onClick: () => void call(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "size-11 px-0",
								"aria-label": "Video call",
								onClick: () => void call(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat-messages flex-1 space-y-1 overflow-y-auto p-3",
						onScroll: onThreadScroll,
						ref: threadRef,
						children: [grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sticky top-1 z-[1] my-3 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-muted/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm backdrop-blur",
								children: g.label
							})
						}), g.items.map((m) => {
							const mine = m.sender_id === me.data?.userId;
							const invite = m.body.match(/https:\/\/meet\.jit\.si\/(\S+)/);
							const picked = selected.has(m.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `group relative mb-1 max-w-[82%] rounded-2xl px-3 py-2 text-sm ${mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"} ${picked ? "ring-2 ring-amber-400" : ""}`,
								onContextMenu: (e) => {
									e.preventDefault();
									setMenuMsg(m);
								},
								onClick: () => {
									if (selectMode) {
										const next = new Set(selected);
										next.has(m.id) ? next.delete(m.id) : next.add(m.id);
										setSelected(next);
									}
								},
								children: [
									m.body.startsWith("data:image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: m.body,
										alt: "",
										className: "max-h-60 rounded-xl"
									}) : invite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "call-invite",
										onClick: () => setRoom(invite[1] ?? null),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "call-pulse" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
											" Join call"
										]
									}) : m.body,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-primary-foreground/80" : "text-muted-foreground"}`,
										children: [new Date(m.created_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										}), mine && (m.read_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3 text-sky-200" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }))]
									}),
									(reactions[m.id]?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "msg-react-chip",
										children: reactions[m.id].join(" ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute top-1 right-1 hidden rounded-full bg-black/20 p-1 group-hover:block",
										"aria-label": "Message actions",
										onClick: (e) => {
											e.stopPropagation();
											setMenuMsg(m);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-3" })
									})
								]
							}, m.id);
						})] }, g.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottom })]
					}),
					selectMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "select-toolbar",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold",
								children: [selected.size, " selected"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "px-3",
								onClick: () => {
									setSelectMode(false);
									setSelected(/* @__PURE__ */ new Set());
								},
								children: "Deselect"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "px-3",
								onClick: () => {
									const bodies = (messages.data ?? []).filter((m) => selected.has(m.id)).map((m) => m.body).join("\n");
									navigator.clipboard.writeText(bodies);
									toast.success("Copied to forward");
								},
								children: "Forward"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-rose-600 px-3 hover:bg-rose-700",
								onClick: () => {
									setHiddenMsgs((prev) => {
										const next = new Set(prev);
										selected.forEach((id) => next.add(id));
										saveSet("jaytalk-hidden-msgs", next);
										return next;
									});
									setSelectMode(false);
									setSelected(/* @__PURE__ */ new Set());
									toast.success("Deleted");
								},
								children: "Delete"
							})
						]
					}),
					replyTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-t border-border bg-muted/50 px-3 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reply, { className: "size-3.5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1 truncate",
								children: ["Replying to: ", replyTo.body.slice(0, 60)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-primary",
								onClick: () => setReplyTo(null),
								children: "Cancel"
							})
						]
					}),
					showScrollDown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "chat-scroll-bottom",
						"aria-label": "Latest messages",
						onClick: scrollToLatest,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 border-t border-border px-3 pt-2",
						children: [[
							"😀",
							"😂",
							"❤️",
							"🔥",
							"👍",
							"🎉"
						].map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-lg",
							onClick: () => void send(e),
							children: e
						}, e)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto text-xs font-semibold text-primary",
							onClick: () => {
								const q = window.prompt("Search GIF (Tenor keyword)");
								if (!q) return;
								send(`GIF: https://tenor.com/search/${encodeURIComponent(q)}`);
							},
							children: "GIF"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "chat-composer flex gap-2 border-t border-border p-3",
						onSubmit: (e) => {
							e.preventDefault();
							send();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid size-11 cursor-pointer place-items-center rounded-xl border border-border",
								"aria-label": "Send a photo",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "sr-only",
									type: "file",
									accept: "image/*",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (!file) return;
										resizeImage(file).then((data) => send(data)).catch((error) => toast.error(errText(error)));
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": "Message",
								maxLength: 2e3,
								placeholder: "Write a message",
								value: text,
								onChange: (e) => {
									setText(e.target.value);
									if (person && me.data) setTyping({ data: { key: dmKey(me.data.userId, person.id) } });
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "px-3",
								"aria-label": "Send",
								disabled: !text.trim(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendIcon, {})
							})
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "chat-empty hidden flex-1 flex-col items-center justify-center gap-4 p-8 text-center md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-20 place-items-center rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 text-3xl shadow-inner dark:from-sky-900/40 dark:to-indigo-900/40",
							children: "💬"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-extrabold text-foreground",
							children: "JayTalk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-muted-foreground",
							children: "Select a chat on the left, or search for someone to start a conversation."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Messages are private between you and your friends."
						})
					]
				})
			}),
			sheet && person && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 md:items-center",
				onClick: () => setSheet(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-3xl bg-card p-5 shadow-xl",
					onClick: (e) => e.stopPropagation(),
					style: { animation: "pop .2s ease" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex flex-col items-center text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										photo: person.photo,
										emoji: person.avatar_emoji,
										className: "size-20 text-3xl"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `presence-dot presence-dot-lg ${isOnline(person.id) ? "online" : "offline"}` })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-lg font-bold",
									children: person.full_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: ["@", person.username]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs font-semibold text-primary",
									children: isOnline(person.id) ? "Online" : "Offline"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => void call(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), " Call"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => void call(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), " Video"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/wallet",
									className: "col-span-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }), " Send Bucks"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => toggle("archive", person.id),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }),
										" ",
										archived.has(person.id) ? "Unarchive" : "Archive"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "text-rose-600",
									onClick: () => toggle("block", person.id),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "size-4" }),
										" ",
										blocked.has(person.id) ? "Unblock" : "Block"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3 w-full",
							variant: "secondary",
							onClick: () => setSheet(false),
							children: "Close"
						})
					]
				})
			}),
			reactMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4",
				onClick: () => setReactMsg(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "msg-react-bar",
					onClick: (e) => e.stopPropagation(),
					children: [
						"👍",
						"❤️",
						"😂",
						"😮",
						"😢",
						"🙏"
					].map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-2xl leading-none px-1",
						onClick: () => addReaction(reactMsg.id, emoji),
						children: emoji
					}, emoji))
				})
			}),
			menuMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center",
				onClick: () => setMenuMsg(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-xs overflow-hidden rounded-2xl bg-card shadow-xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						{
							id: "react",
							label: "React",
							icon: Smile
						},
						{
							id: "reply",
							label: "Reply",
							icon: Reply
						},
						{
							id: "forward",
							label: "Forward",
							icon: Forward
						},
						{
							id: "copy",
							label: "Copy",
							icon: Copy
						},
						{
							id: "select",
							label: "Select",
							icon: Check
						},
						{
							id: "delete",
							label: "Delete",
							icon: Trash2
						}
					].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left text-sm font-semibold last:border-0 hover:bg-muted",
						onClick: () => onMsgAction(a.id, menuMsg),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "size-4 text-primary" }),
							" ",
							a.label
						]
					}, a.id))
				})
			}),
			room && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex flex-col bg-slate-950 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "call-stage flex flex-1 flex-col items-center justify-center gap-4 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "call-ring-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "call-ring" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "call-ring delay" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									photo: person?.photo,
									emoji: person?.avatar_emoji,
									className: "size-24 text-4xl"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-bold",
							children: person?.full_name ?? "Call"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/70",
							children: "Ringing…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallFrame, {
								room,
								onClose: () => setRoom(null)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => window.open(`https://meet.jit.si/${room}`, "_blank"),
								children: "Open full"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-rose-600 hover:bg-rose-700",
								onClick: () => setRoom(null),
								children: "End"
							})]
						})
					]
				})
			})
		]
	});
}
function SendIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4 fill-current",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" })
	});
}
function dmKey(a, b) {
	return [a, b].sort().join(":");
}
async function resizeImage(file) {
	if (file.size > 15e5) throw new Error("Choose a photo under 1.5 MB.");
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image."));
			el.src = url;
		});
		const canvas = document.createElement("canvas");
		const scale = Math.min(1, 960 / Math.max(img.width, img.height));
		canvas.width = Math.round(img.width * scale);
		canvas.height = Math.round(img.height * scale);
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas unavailable.");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/jpeg", .82);
	} finally {
		URL.revokeObjectURL(url);
	}
}
//#endregion
export { ChatPage as component };
