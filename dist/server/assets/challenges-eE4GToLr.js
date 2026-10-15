import { E as useQueryClient } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { d as challengeStatus, h as claimChallenge, it as useQuery, pt as MessageCircle, r as PageHeading, ut as Play } from "./shell-v69-fRR6.js";
import { a as formatBucks } from "./jaytalk-BUSANd3K.js";
import { t as Eye } from "./eye-YBd1lsSH.js";
import { n as toast } from "./dist-JcOCBs4u.js";
import { a as errText, n as Button } from "./ui-B3wDlNN7.js";
//#region src/routes/_app/challenges.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		key: "chat",
		title: "Send 3 messages",
		need: 3,
		reward: 150,
		icon: MessageCircle
	},
	{
		key: "post",
		title: "Post a video or mood",
		need: 1,
		reward: 200,
		icon: Play
	},
	{
		key: "view",
		title: "Watch 5 posts",
		need: 5,
		reward: 150,
		icon: Eye
	}
];
function ChallengesPage() {
	const qc = useQueryClient();
	const status = useQuery({
		queryKey: ["challenges"],
		queryFn: () => challengeStatus()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
		title: "Daily challenges",
		subtitle: "New goals every day at midnight, Lagos time."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid max-w-3xl gap-3",
		children: items.map((item) => {
			const have = Math.min(Number(status.data?.[item.key] ?? 0), item.need);
			const claimed = status.data?.claimed.includes(item.key);
			const done = have >= item.need;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "flex items-center gap-4 rounded-2xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 place-items-center rounded-xl bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									have,
									"/",
									item.need,
									" · ",
									formatBucks(item.reward)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary",
									style: { width: `${have / item.need * 100}%` }
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !done || claimed,
						onClick: () => void claimChallenge({ data: { key: item.key } }).then((r) => {
							toast.success(`+${formatBucks(r.reward)}`);
							return qc.invalidateQueries();
						}).catch((e) => toast.error(errText(e))),
						children: claimed ? "Claimed" : done ? "Claim" : "In progress"
					})
				]
			}, item.key);
		})
	})] });
}
//#endregion
export { ChallengesPage as component };

//# sourceMappingURL=challenges-eE4GToLr.js.map