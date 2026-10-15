import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { t as require_jsx_runtime } from "./jsx-runtime-jFalHeq5.js";
import { n as useNavigate } from "./useNavigate-OMjWysX7.js";
import { G as resolveUsernameForLogin, H as requestResetCode, T as finishSignup, U as requestSignupCode, W as resetPassword, a as ThemeButton, f as checkUsername, t as Brand } from "./shell-v69-fRR6.js";
import { t as authClient } from "./client-Cb0S1Eu3.js";
import { l as usernameOk } from "./jaytalk-BUSANd3K.js";
import { a as errText, i as Input, n as Button, r as Field } from "./ui-B3wDlNN7.js";
//#region src/components/auth-screen.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function AuthScreen() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [nameHint, setNameHint] = (0, import_react.useState)("");
	const [suggestions, setSuggestions] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		email: "",
		password: "",
		confirm: "",
		fullName: "",
		username: ""
	});
	(0, import_react.useEffect)(() => {
		if (mode !== "up") {
			setNameHint("");
			setSuggestions([]);
			return;
		}
		const username = form.username.trim();
		if (!username) {
			setNameHint("");
			setSuggestions([]);
			return;
		}
		if (!usernameOk(username)) {
			setNameHint("Use 3–20 letters, numbers, or underscores.");
			setSuggestions([]);
			return;
		}
		const timer = window.setTimeout(() => {
			checkUsername({ data: { username } }).then((result) => {
				setNameHint(result.reason ?? "");
				setSuggestions(result.suggestions ?? []);
			}).catch((err) => {
				setNameHint(errText(err));
				setSuggestions([]);
			});
		}, 280);
		return () => window.clearTimeout(timer);
	}, [form.username, mode]);
	function set(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
	}
	async function onSubmit(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		try {
			if (mode === "in") {
				const username = form.username.trim().replace(/^@/, "");
				if (!username) throw new Error("Enter your username.");
				if (!form.password) throw new Error("Enter your password.");
				const resolved = await resolveUsernameForLogin({ data: { username } });
				if (!resolved?.email) throw new Error("No account with that username.");
				const result = await authClient.signIn.email({
					email: resolved.email,
					password: form.password
				});
				if (result.error) throw new Error(result.error.message || "Username or password is wrong.");
				await navigate({ to: "/chat" });
			} else if (mode === "up") {
				if (form.password !== form.confirm) throw new Error("Passwords do not match.");
				if (!usernameOk(form.username.trim())) throw new Error("Choose a valid username.");
				await requestSignupCode({ data: {
					email: form.email.trim().toLowerCase(),
					username: form.username.trim(),
					fullName: form.fullName.trim()
				} });
				setCode("");
				setMode("code");
			} else if (mode === "code") {
				const email = form.email.trim().toLowerCase();
				if (!(await authClient.getSession()).data?.user) {
					const created = await authClient.signUp.email({
						email,
						password: form.password,
						name: form.fullName.trim()
					});
					if (created.error) {
						const message = created.error.message || "Couldn't create the account.";
						if (/exist/i.test(message)) {
							if ((await authClient.signIn.email({
								email,
								password: form.password
							})).error) throw new Error("An account with this email already exists. Sign in instead.");
						} else throw new Error(message);
					}
				}
				await finishSignup({ data: { code: code.trim() } });
				await navigate({ to: "/chat" });
			} else if (mode === "forgot") {
				const issued = await requestResetCode({ data: { email: form.email.trim().toLowerCase() } });
				if (!issued.found || !issued.sent) throw new Error("No JayTalk account uses that email.");
				setCode("");
				setForm((current) => ({
					...current,
					password: "",
					confirm: ""
				}));
				setMode("reset");
			} else {
				if (form.password !== form.confirm) throw new Error("Passwords do not match.");
				await resetPassword({ data: {
					email: form.email.trim().toLowerCase(),
					code: code.trim(),
					password: form.password
				} });
				setMode("in");
				setForm((current) => ({
					...current,
					password: "",
					confirm: ""
				}));
				setError("Password updated. Sign in with your username and new password.");
			}
		} catch (err) {
			setError(errText(err));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: mode === "in" ? "Welcome back" : mode === "up" ? "Join JayTalk" : mode === "code" ? "Confirm your email" : mode === "forgot" ? "Reset password" : "Choose a new password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					mode === "in" && "Sign in with your username and password.",
					mode === "up" && "Usernames are unique — we check as you type. Confirm email with a code.",
					mode === "code" && "Enter the confirmation code we sent to your email.",
					mode === "forgot" && "Enter the email on your account. We'll send a reset code.",
					mode === "reset" && "Enter the code from your email and a new password."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-3",
				onSubmit,
				children: [
					mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Username",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							autoComplete: "username",
							placeholder: "yourname",
							value: form.username,
							onChange: (e) => set("username", e.target.value),
							required: true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							autoComplete: "current-password",
							value: form.password,
							onChange: (e) => set("password", e.target.value),
							required: true
						})
					})] }),
					mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.fullName,
								onChange: (e) => set("fullName", e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Username",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									autoComplete: "username",
									placeholder: "coolname",
									value: form.username,
									onChange: (e) => set("username", e.target.value),
									required: true
								}),
								nameHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-1 text-xs ${nameHint.includes("available") ? "text-emerald-600" : "text-amber-600"}`,
									children: nameHint
								}),
								suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold hover:border-primary",
										onClick: () => set("username", s),
										children: ["@", s]
									}, s))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								autoComplete: "email",
								value: form.email,
								onChange: (e) => set("email", e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								autoComplete: "new-password",
								value: form.password,
								onChange: (e) => set("password", e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Confirm password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								autoComplete: "new-password",
								value: form.confirm,
								onChange: (e) => set("confirm", e.target.value),
								required: true
							})
						})
					] }),
					mode === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Confirmation code",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							autoComplete: "one-time-code",
							placeholder: "6-digit code",
							value: code,
							onChange: (e) => setCode(e.target.value),
							required: true
						})
					}),
					mode === "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: form.email,
							onChange: (e) => set("email", e.target.value),
							required: true
						})
					}),
					mode === "reset" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Reset code",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: code,
								onChange: (e) => setCode(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "New password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: form.password,
								onChange: (e) => set("password", e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Confirm password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								value: form.confirm,
								onChange: (e) => set("confirm", e.target.value),
								required: true
							})
						})
					] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: busy,
						children: busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Continue" : mode === "code" ? "Create account" : mode === "forgot" ? "Send code" : "Update password"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2 text-sm",
				children: [mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "px-0",
					onClick: () => {
						setMode("up");
						setError("");
					},
					children: "Create account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "px-0",
					onClick: () => {
						setMode("forgot");
						setError("");
					},
					children: "Forgot password?"
				})] }), mode !== "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "px-0",
					onClick: () => {
						setMode("in");
						setError("");
					},
					children: "Back to sign in"
				})]
			})
		]
	});
}
//#endregion
//#region src/routes/login.tsx?tsr-split=component
var SplitComponent = AuthScreen;
//#endregion
export { SplitComponent as component };

//# sourceMappingURL=login-CDyttrfJ.js.map