import { o as __toESM } from "../_runtime.mjs";
import { c as usernameOk, i as formatBucks, t as ECONOMY } from "./jaytalk-BUSANd3K.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as errText, i as Input, n as Button, r as Field, t as Avatar } from "./ui-CBRITsGD.mjs";
import { $ as updateProfile, J as setPhoto, b as createProfile, c as buyChannel, d as checkUsername, et as useCurrentUser, g as clearPhoto, nt as useMe, r as PageHeading, w as finishSignup } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-GQtd6zOr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const me = useMe();
	const account = useCurrentUser();
	const qc = useQueryClient();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [hint, setHint] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!me.data) return;
		setFullName(me.data.fullName);
		setUsername(me.data.username);
		setBio(me.data.bio);
	}, [me.data]);
	(0, import_react.useEffect)(() => {
		if (!username || me.data && username === me.data.username) {
			setHint(me.data ? "This is your username." : "");
			return;
		}
		if (!usernameOk(username)) {
			setHint("Use 3–20 letters, numbers, or underscores.");
			return;
		}
		const timer = window.setTimeout(() => {
			checkUsername({ data: { username } }).then((r) => setHint(r.reason ?? "")).catch((e) => setHint(errText(e)));
		}, 300);
		return () => window.clearTimeout(timer);
	}, [username, me.data]);
	async function save(event) {
		event.preventDefault();
		try {
			if (!me.data) {
				if (code.trim()) await finishSignup({ data: { code: code.trim() } });
				else await createProfile({ data: {
					username: username.trim(),
					fullName: fullName.trim()
				} });
			} else await updateProfile({ data: {
				username: username.trim(),
				fullName: fullName.trim(),
				bio
			} });
			toast.success(me.data ? "Profile saved" : "Welcome to JayTalk");
			await qc.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function onPhoto(file) {
		try {
			const dataUrl = await resize(file);
			await setPhoto({ data: { dataUrl } });
			toast.success(`Photo updated · −${formatBucks(ECONOMY.photo)}`);
			await qc.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
				title: "Profile",
				subtitle: me.data ? `@${me.data.username}` : "Choose a unique username to finish signing up."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					photo: me.data?.photo,
					emoji: me.data?.avatarEmoji,
					className: "size-20 text-3xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: me.data?.fullName || account?.displayName || "New member"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: me.data ? `${formatBucks(me.data.balance)} · ${me.data.hasChannel ? "Channel owner" : "No channel yet"}` : account?.primaryEmail
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: save,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: fullName,
							onChange: (e) => setFullName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Username",
						hint,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: username,
							onChange: (e) => setUsername(e.target.value)
						})
					}),
					me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							maxLength: 160,
							value: bio,
							onChange: (e) => setBio(e.target.value)
						})
					}),
					!me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Confirmation code",
						hint: "Only needed if you already received a sign-up code.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							autoComplete: "one-time-code",
							maxLength: 6,
							value: code,
							onChange: (e) => setCode(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save profile"
					})
				]
			}),
			me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 space-y-3 rounded-2xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: "Photo and avatar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"A profile photo costs ",
							formatBucks(ECONOMY.photo),
							". Avatars are bought in the store and show when you don't have a photo."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground",
						children: [
							"Upload photo · ",
							formatBucks(ECONOMY.photo),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "sr-only",
								type: "file",
								accept: "image/*",
								onChange: (e) => {
									const file = e.target.files?.[0];
									if (file) onPhoto(file);
								}
							})
						]
					}),
					me.data.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => void clearPhoto().then(() => qc.invalidateQueries({ queryKey: ["me"] })),
						children: "Remove photo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: ["Avatar in use: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: me.data.avatarEmoji
						})]
					}),
					!me.data.hasChannel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void buyChannel().then(() => {
							toast.success("Channel unlocked");
							return qc.invalidateQueries({ queryKey: ["me"] });
						}).catch((e) => toast.error(errText(e))),
						children: ["Buy a channel · ", formatBucks(ECONOMY.channel)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "block text-sm font-semibold text-primary",
						children: "Admin: credit bought Bucks"
					})
				]
			})
		]
	});
}
function resize(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				const scale = Math.min(1, 256 / Math.max(img.width, img.height));
				const canvas = document.createElement("canvas");
				canvas.width = Math.max(1, Math.round(img.width * scale));
				canvas.height = Math.max(1, Math.round(img.height * scale));
				canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL("image/jpeg", .82));
			};
			img.onerror = () => reject(/* @__PURE__ */ new Error("Couldn't read that photo."));
			img.src = String(reader.result);
		};
		reader.readAsDataURL(file);
	});
}
//#endregion
export { ProfilePage as component };
