import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { D as createLucideIcon, E as useQueryClient, O as Link } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { K as searchPeople, N as listFriends, V as requestFriend, it as useQuery, o as useMe, pt as MessageCircle, r as PageHeading, s as acceptFriend } from "./shell-v69-fRR6.js";
import { t as Check } from "./check-Dn8XQFFs.js";
import { n as toast } from "./dist-JcOCBs4u.js";
import { a as errText, i as Input, n as Button, t as Avatar } from "./ui-B3wDlNN7.js";
/**
* @license lucide-react v0.510.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var UserPlus = createLucideIcon("user-plus", [
	["path", {
		d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
		key: "1yyitq"
	}],
	["circle", {
		cx: "9",
		cy: "7",
		r: "4",
		key: "nufk8"
	}],
	["line", {
		x1: "19",
		x2: "19",
		y1: "8",
		y2: "14",
		key: "1bvyxn"
	}],
	["line", {
		x1: "22",
		x2: "16",
		y1: "11",
		y2: "11",
		key: "1shjgl"
	}]
]);
//#endregion
//#region src/routes/_app/friends.tsx?tsr-split=component
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FriendsPage() {
	const qc = useQueryClient();
	const myId = useMe().data?.userId;
	const [q, setQ] = (0, import_react.useState)("");
	const friends = useQuery({
		queryKey: ["friends"],
		queryFn: () => listFriends()
	});
	const found = useQuery({
		queryKey: ["people", q],
		enabled: q.trim().length >= 2,
		queryFn: () => searchPeople({ data: { q: q.trim() } })
	});
	async function add(userId) {
		try {
			await requestFriend({ data: { userId } });
			toast.success("Friend request sent");
			await qc.invalidateQueries({ queryKey: ["friends"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function accept(id) {
		try {
			await acceptFriend({ data: { id } });
			toast.success("You are now friends");
			await qc.invalidateQueries({ queryKey: ["friends"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
				title: "Friends",
				subtitle: "Find your people."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				"aria-label": "Search people",
				placeholder: "Search name or @username",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 space-y-2",
				children: found.data?.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl bg-muted p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							photo: person.photo,
							emoji: person.avatar_emoji,
							className: "size-10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: person.full_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["@", person.username]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "px-3",
							onClick: () => void add(person.id),
							children: "Add"
						})
					]
				}, person.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 mb-3 font-bold",
				children: "Your circle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [friends.data?.map((row) => {
					const isIncoming = row.status === "pending" && myId && row.addressee === myId;
					const isOutgoing = row.status === "pending" && myId && row.requester === myId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-border py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								photo: row.person?.photo,
								emoji: row.person?.avatar_emoji,
								className: "size-10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: row.person?.full_name ?? "Member"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: row.status === "accepted" ? "Friends" : isIncoming ? "Wants to be your friend" : isOutgoing ? "Request sent" : row.status
								})]
							}),
							isIncoming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "px-3",
								onClick: () => void accept(row.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " Accept"]
							}) : row.status === "accepted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/chat",
								className: "inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-3 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " Chat"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4 text-muted-foreground" })
						]
					}, row.id);
				}), friends.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Your circle is waiting to grow."
				})]
			})
		]
	});
}
//#endregion
export { FriendsPage as component };

//# sourceMappingURL=friends-DXIyJzhk.js.map