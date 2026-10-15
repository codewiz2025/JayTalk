import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { E as useQueryClient } from "./query-Dee9BVOI.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { S as creditBucks, m as claimAdmin, o as useMe, r as PageHeading } from "./shell-v69-fRR6.js";
import { c as transferAmount } from "./jaytalk-BUSANd3K.js";
import { n as toast } from "./dist-JcOCBs4u.js";
import { a as errText, i as Input, n as Button, r as Field } from "./ui-B3wDlNN7.js";
//#region src/routes/_app/admin.tsx?tsr-split=component
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

//# sourceMappingURL=admin-ABepcCPC.js.map