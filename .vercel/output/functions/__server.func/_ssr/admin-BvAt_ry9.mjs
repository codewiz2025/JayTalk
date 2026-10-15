import { o as __toESM } from "../_runtime.mjs";
import { s as transferAmount } from "./jaytalk-BUSANd3K.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { a as errText, i as Input, n as Button, r as Field } from "./ui-CBRITsGD.mjs";
import { nt as useMe, p as claimAdmin, r as PageHeading, x as creditBucks } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BvAt_ry9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const me = useMe();
	const qc = useQueryClient();
	const [username, setUsername] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	if (!me.data?.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
			title: "Admin",
			subtitle: "The first member to claim this becomes the JayTalk admin and can add Bucks after a WhatsApp payment."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void claimAdmin().then(() => qc.invalidateQueries({ queryKey: ["me"] })).catch((e) => toast.error(errText(e))),
			children: "Become admin"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
			title: "Admin",
			subtitle: "Add Bucks after you confirm a WhatsApp payment."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: (e) => {
				e.preventDefault();
				const n = transferAmount(amount);
				if (!n) {
					toast.error("Enter a whole number of Bucks");
					return;
				}
				creditBucks({ data: {
					username: username.trim(),
					amount: n
				} }).then((r) => {
					toast.success(`Added Bucks to @${r.username}`);
					setAmount("");
				}).catch((err) => toast.error(errText(err)));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Username",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: username,
						onChange: (e) => setUsername(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Bucks to add",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						inputMode: "numeric",
						value: amount,
						onChange: (e) => setAmount(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Credit Bucks"
				})
			]
		})]
	});
}
//#endregion
export { AdminPage as component };
