import { E as useQueryClient } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { L as listStore, it as useQuery, lt as ShoppingBag, o as useMe, r as PageHeading, u as buyItem, w as equipItem } from "./shell-v69-fRR6.js";
import { a as formatBucks } from "./jaytalk-BUSANd3K.js";
import { n as toast } from "./dist-JcOCBs4u.js";
import { a as errText, n as Button } from "./ui-B3wDlNN7.js";
//#region src/routes/_app/store.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		kind: "avatar",
		title: "Avatars"
	},
	{
		kind: "wallpaper",
		title: "Wallpapers"
	},
	{
		kind: "theme",
		title: "Chat themes"
	},
	{
		kind: "powerup",
		title: "Power-ups"
	}
];
function StorePage() {
	const qc = useQueryClient();
	const me = useMe();
	const items = useQuery({
		queryKey: ["store"],
		queryFn: () => listStore()
	});
	async function buy(key) {
		try {
			await buyItem({ data: { key } });
			toast.success("Added to your collection");
			await qc.invalidateQueries({ queryKey: ["store"] });
			await qc.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function equip(key) {
		try {
			await equipItem({ data: { key } });
			toast.success("Now in use");
			await qc.invalidateQueries({ queryKey: ["store"] });
			await qc.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
			title: "Store",
			subtitle: "Looks, wallpapers, and power-ups. Premium wallpapers can be a photo from your phone."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8 rounded-3xl bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "Custom wallpaper · 400 Bucks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Upload a photo from your device. It becomes your chat background."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground",
					children: ["Upload photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "sr-only",
						type: "file",
						accept: "image/*",
						onChange: (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							const reader = new FileReader();
							reader.onload = () => {
								localStorage.setItem("jaytalk-wallpaper", String(reader.result));
								toast.success("Wallpaper saved on this device");
							};
							reader.readAsDataURL(file);
						}
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-6 text-sm font-semibold",
			children: ["You have ", formatBucks(me.data?.balance ?? 0)]
		}),
		sections.map((section) => {
			const list = items.data?.filter((item) => item.kind === section.kind) ?? [];
			if (!list.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-bold",
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-3",
					children: list.map((item) => {
						const owned = item.quantity != null;
						const gradient = item.preview.startsWith("linear-gradient");
						const free = Number(item.price_bucks) === 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "overflow-hidden rounded-2xl border border-border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid aspect-[4/3] place-items-center bg-muted text-4xl",
								style: gradient ? { backgroundImage: item.preview } : void 0,
								children: !gradient && item.kind !== "theme" && item.kind !== "powerup" ? item.preview : item.kind === "powerup" ? "🔥" : item.name.slice(0, 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: item.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-3 text-xs text-muted-foreground",
										children: [free ? "Free" : formatBucks(Number(item.price_bucks)), item.kind === "powerup" && owned ? ` · You have ${item.quantity}` : ""]
									}),
									item.kind !== "powerup" && (owned || free) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full",
										variant: item.equipped ? "secondary" : "primary",
										disabled: Boolean(item.equipped),
										onClick: () => void equip(item.key),
										children: item.equipped ? "In use" : "Use"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full",
										onClick: () => void buy(item.key),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }), " Buy"]
									})
								]
							})]
						}, item.key);
					})
				})]
			}, section.kind);
		})
	] });
}
//#endregion
export { StorePage as component };

//# sourceMappingURL=store-BDWodF-5.js.map