import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CBRITsGD.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var variants = {
	primary: "bg-primary text-primary-foreground hover:opacity-90",
	secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
	outline: "border border-border bg-card hover:bg-muted",
	ghost: "hover:bg-muted",
	danger: "bg-destructive text-white hover:opacity-90"
};
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className),
		...props
	});
}
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn("min-h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none ring-ring focus:ring-2", props.className)
	});
}
function Field({ label, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1.5 text-sm font-medium",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs font-normal text-muted-foreground",
				children: hint
			})
		]
	});
}
function Avatar({ photo, emoji, className }) {
	if (photo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: photo,
		alt: "",
		className: cn("rounded-full object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid place-items-center rounded-full bg-secondary text-lg", className),
		children: emoji || "🙂"
	});
}
function errText(error) {
	return error instanceof Error ? error.message : "Something went wrong. Try again.";
}
//#endregion
export { errText as a, Input as i, Button as n, Field as r, Avatar as t };
