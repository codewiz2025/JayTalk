import { i as formatBucks } from "./jaytalk-BUSANd3K.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as errText, n as Button } from "./ui-CBRITsGD.mjs";
import { D as Play, P as MessageCircle, V as Eye } from "../_libs/lucide-react.mjs";
import { m as claimChallenge, r as PageHeading, u as challengeStatus } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/challenges-BJQHET3f.js
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
