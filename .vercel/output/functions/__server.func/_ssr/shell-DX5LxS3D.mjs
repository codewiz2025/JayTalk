import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { Jt as number, Qt as string, Ut as array, Vt as _enum, Wt as boolean, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { t as authClient } from "./client--w0hEszY.mjs";
import { t as authMiddleware } from "./middleware-eLs_ViiU.mjs";
import { n as Button, t as Avatar } from "./ui-CBRITsGD.mjs";
import { A as Moon, D as Play, G as CircleUser, L as Heart, N as MessagesSquare, P as MessageCircle, R as Gamepad2, S as Settings, U as Download, b as ShoppingBag, f as Trophy, g as Sun, r as Wallet, s as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DX5LxS3D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function parse(schema, data) {
	const result = schema.safeParse(data);
	if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Check that form and try again.");
	return result.data;
}
var Username = string().trim().regex(/^[a-zA-Z0-9_]{3,20}$/, "Use 3–20 letters, numbers, or underscores");
var Email = string().trim().toLowerCase().email("Enter a valid email");
var Password = string().min(8, "Use at least 8 characters").max(72, "Password is too long");
var Name = string().trim().min(2, "Enter your name").max(60);
var checkUsername = createServerFn({ method: "POST" }).validator((data) => parse(object({ username: string() }), data)).handler(createSsrRpc("88b26160fb7aed669383777e7cc66fb79d07018a34b2f4e49c84b9766053f943"));
var resolveUsernameForLogin = createServerFn({ method: "POST" }).validator((data) => parse(object({ username: string().min(1) }), data)).handler(createSsrRpc("b3dd898e5dd87fc9141a79a015ea57435dd4b5b0b4aa183b4e6b2ff625214e71"));
var requestSignupCode = createServerFn({ method: "POST" }).validator((data) => parse(object({
	email: Email,
	username: Username,
	fullName: Name
}), data)).handler(createSsrRpc("2a661829985f1c6fa68206eb32c2cf924a090f467bead9033a7b751732d8ea38"));
var requestResetCode = createServerFn({ method: "POST" }).validator((data) => parse(object({ email: Email }), data)).handler(createSsrRpc("b6e3cca71c2a56d4c39fcf78edd1c4b9a004c2f22121a22af0a65e4559e6def8"));
var resetPassword = createServerFn({ method: "POST" }).validator((data) => parse(object({
	email: Email,
	code: string().trim(),
	password: Password
}), data)).handler(createSsrRpc("2ec733aa171efa90fbf73a609a1e6af1636e879cb820321748bf3c514612400b"));
var finishSignup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ code: string().trim() }), data)).handler(createSsrRpc("669d5d965cc378603cdc87d08b2ebb0ba4004e7f0a75f33f5a96dc9121704f6e"));
var createProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	fullName: Name
}), data)).handler(createSsrRpc("256a6b4f5f982da15d23fdfcdc0ae4efc455681c1eca6829c9341f8a74efc9cb"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0bd664c0090bb2b231725798d28993e38f25c5da84df5b461c52e4f432a5d896"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	fullName: Name,
	bio: string().max(160)
}), data)).handler(createSsrRpc("554dd854cd57cbfb1cbddd25a54154e8eb1278a9129e930567e3d641f35f3164"));
var setPhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ dataUrl: string().max(22e4) }), data)).handler(createSsrRpc("0b477aa002df5408d58c0a541580a94ed43cef67753d92e32c670abb737d1e5a"));
var clearPhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("0d08b88d900a5117b51a6eca0de2cc7fec82312f3cdcfd3b1493bbf6ff3f8aab"));
var searchPeople = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ q: string().trim().min(2).max(40) }), data)).handler(createSsrRpc("61c067e283b2aa2a5473040c94a11faea7fcb545a779e6159b9e4df18548d223"));
var listFriends = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("05b7b83ac2f811bd55b9f32a20a027411e2f3ee1a0a8221f549df6571fa7eb09"));
var requestFriend = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("25129950fb76ca04e881e43ff43725dec82646b34937d35ff52d145b3f91e9b9"));
var acceptFriend = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ id: string().min(1) }), data)).handler(createSsrRpc("95937c4ea08eb3188b33cd18a6ba228eb2dd544f43fed17342bb196be8f046a7"));
var listConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("51b37081618d6ac6ae25a9a0de113ae44e8c5083c22c95fd5e5adf771006e0c5"));
var listMessages = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("a5962c6ad160d21125854e2b3016b3d39575bac561f8dc8c5a294715cad56516"));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	userId: string().min(1),
	body: string().min(1).max(5e5)
}), data)).handler(createSsrRpc("1ddfec6751a7cda86e7400812bc4e9dc5e9ae3beee68db8df0322a09500470a4"));
var markRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("0dc3c77144b7839c3cd6a67c5a1d850a84f30aa355e11ce3b4dc5394432f6f0d"));
var setTyping = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string().min(1).max(80) }), data)).handler(createSsrRpc("013fa2078fa2212d8a8e0fc7e4813244c4f1d8f3ef59f91e0f322e39fb033a72"));
var getTyping = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string().min(1).max(80) }), data)).handler(createSsrRpc("b274ba2d64d546f9c5a31e1180c36265813e4f567d0fd8c4b0a2622d9f5c7967"));
var listGroups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("06af56a9441c186b7170b2d8c7c07ffb2f2b1de011a30d8c21918edbd5cad474"));
var createGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	name: string().trim().min(2, "Name the group").max(40),
	memberIds: array(string()).max(20)
}), data)).handler(createSsrRpc("c508c3745897ac68b2bec8eaa42559eb0274571436f991a767a74120e73c8b5f"));
var getGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ groupId: string().min(1) }), data)).handler(createSsrRpc("33545da6c282cada00261cff70fd75e8d6023eacd0f872e15061072a75ff6b9f"));
var sendGroupMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	groupId: string(),
	body: string().min(1).max(5e5)
}), data)).handler(createSsrRpc("5fa1778a5bd6f520cee5bf54613b32958e85175f9d33a213a1feb8ed5104c70b"));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f1a1e92c95ac57247a67be98aa4bcc7f012069d61f7963427f2546a8c472b65c"));
var listTx = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e2d53859cec83af5afccc2ed24d571d72f4654e98b75b85e86c7adc7f170a272"));
var leaderboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("da1887c0749bb55255e9c0c8b4e432dd205a3e6ef6163da0eaddebd0ccda2062"));
var claimStreak = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("637ea8ea23f4cd582b4a267c746c5c471c77c3b5a4feb13563e2be9a85a8e59d"));
var useStreakRestore = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("76640f9eb4a1d8e533b756653722be4771d9082c93e25fa5cc0dd1fc8c4f498d"));
var startAd = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("9b67b5d3d76501cd54144a0fd0f96d0c1403ce4649d47de960fb78a37ebb2365"));
var claimAd = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ clicked: boolean() }), data)).handler(createSsrRpc("27409bbd065a7927830b2f800fdcdd1d0b4900dd815f8bf449e30a23ec8ec016"));
var transferBucks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	amount: number().int().positive().max(1e6)
}), data)).handler(createSsrRpc("844962fba341213086f9ae41f58863c4196a75ea0425f7e15a0998f444d57f01"));
var buyChannel = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("db564de3cc1609aa3e5171ff9082ae11b999509a5718c17140f86d159e349a22"));
var toggleFollow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ userId: string().min(1) }), data)).handler(createSsrRpc("e3e2b9802e5998a512075082d75de6572b62a60c3b9f320f75bfb7f8ca38cb18"));
var listPosts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ kind: _enum(["video", "mood"]) }), data)).handler(createSsrRpc("9b1bb44ace4680a878a3b4fdfd7c785c53768deb5443f842b070a9489a0ccb4a"));
var getPostVideo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("86e3ba8c3a52ee50e4a76bca3225e8452e4c560818ed82ee0fa91d5c0c7e646a"));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	kind: _enum(["video", "mood"]),
	body: string().max(500),
	bg: string().max(20).optional(),
	videoData: string().max(35e5).optional()
}), data)).handler(createSsrRpc("ee7e2aae29adb71b570f04064c44d0706efd5a4079033d7c92697f3b40be8471"));
var deletePost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("738378688f14f3ab9ece34a32cdcec68c27b2ff3074657669ad4f4720649822e"));
var reactPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	postId: string(),
	kind: _enum(["like", "dislike"])
}), data)).handler(createSsrRpc("76077a396f3d0588c106e6f54021d1b46b73ad5a521b957db1a8d562ce9b4e19"));
var listComments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("7a75d06c34b1567f3fc3a2ce1673d2e34d201e3a40163eec30ca348986f76294"));
var addComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	postId: string(),
	body: string().trim().min(1).max(280)
}), data)).handler(createSsrRpc("304178750f6d01ec35c2d260ec03fc587e10575f3fb98f84df3077fb3ca5e83b"));
var countView = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ postId: string() }), data)).handler(createSsrRpc("e7e950700ad82d6cda7ab6475a7a34c0e10804f3c679b1be762e9e5fc73aa96d"));
var listStore = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("79238d426dcfaf34002cf6efd19c2ac79e04a8e73d184eef6dd44300c0471781"));
var buyItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string().min(1) }), data)).handler(createSsrRpc("0077c6803862f5e2937a76d3c8dcf0617919c8a57b64858445302ed0dc4e9cf4"));
var equipItem = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: string() }), data)).handler(createSsrRpc("2768bfd7199089a3838b23d37a8f0e3a005949b332626168f0acb45469e1d869"));
var challengeStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("88dea4b163c125a388951d73eae1b81eb36cd8f86648baa4446f1473ccf3d57d"));
var claimChallenge = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({ key: _enum([
	"chat",
	"post",
	"view"
]) }), data)).handler(createSsrRpc("a6e8357d16021069796c0d7ba54451d157c59cc1c2c87cb0c5a771aa63793447"));
var claimAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("4a66e40d936648bc30d65d0541a6b97050269ef67bb374d007c334a906260180"));
var creditBucks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => parse(object({
	username: Username,
	amount: number().int().positive().max(1e6)
}), data)).handler(createSsrRpc("2387029eb4a3bfa3006dfb0ac63dbedf83f9fc4a5e8bb6f148aa2611f20d848a"));
var NAV = [
	{
		to: "/chat",
		label: "Chat",
		icon: MessageCircle
	},
	{
		to: "/friends",
		label: "Friends",
		icon: Users
	},
	{
		to: "/groups",
		label: "Groups",
		icon: MessagesSquare
	},
	{
		to: "/fyp",
		label: "For you",
		icon: Play
	},
	{
		to: "/moods",
		label: "Moods",
		icon: Heart
	},
	{
		to: "/games",
		label: "Games",
		icon: Gamepad2
	},
	{
		to: "/challenges",
		label: "Challenges",
		icon: Trophy
	},
	{
		to: "/store",
		label: "Store",
		icon: ShoppingBag
	},
	{
		to: "/avatar",
		label: "Avatar",
		icon: CircleUser
	},
	{
		to: "/wallet",
		label: "Bucks",
		icon: Wallet
	},
	{
		to: "/profile",
		label: "Profile",
		icon: CircleUser
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/chat",
		className: "flex min-w-0 items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/brand/jaytalk-logo.png",
			width: 40,
			height: 40,
			alt: "JayTalk",
			className: "size-10 rounded-xl object-cover shadow-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-lg font-extrabold leading-none",
				children: "JayTalk"
			}), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted-foreground",
				children: "JayTech Digitals"
			})]
		})]
	});
}
function ThemeButton() {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setDark(document.documentElement.classList.contains("dark")), []);
	function toggle() {
		const next = !document.documentElement.classList.contains("dark");
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("jaytalk-theme", next ? "dark" : "light");
		setDark(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		className: "size-11 px-0",
		"aria-label": dark ? "Switch to light theme" : "Switch to dark theme",
		onClick: toggle,
		children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
function InstallButton() {
	const [prompt, setPrompt] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const onPrompt = (event) => {
			event.preventDefault();
			setPrompt(event);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		className: "px-3",
		onClick: () => {
			if (prompt) {
				prompt.prompt();
				setPrompt(null);
				return;
			}
			window.alert("Use your browser menu to install JayTalk. On iPhone: Share → Add to Home Screen.");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden sm:inline",
				children: "Install"
			})
		]
	});
}
function useMe() {
	const { user } = useCurrentUserState();
	return useQuery({
		queryKey: ["me", user?.id],
		enabled: Boolean(user),
		queryFn: () => getMe()
	});
}
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const me = useMe();
	const isChat = pathname === "/chat" || pathname.startsWith("/chat");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "app-topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2",
					children: [
						me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							className: "flex min-h-11 items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								photo: me.data.photo,
								emoji: me.data.avatarEmoji,
								className: "size-9"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden max-w-28 truncate text-sm font-semibold sm:inline",
								children: ["@", me.data.username]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {}),
						me.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/wallet",
							className: "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-sm font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
							"aria-label": "Your Bucks",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] text-amber-950",
								children: "B"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: Number(me.data.balance ?? 0).toLocaleString("en-NG") })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: `app-main-full flex-1 ${isChat ? "app-main-chat" : "px-3 py-4 sm:px-6"}`,
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "app-bottom-nav",
				children: NAV.map((item) => {
					const active = pathname === item.to || pathname.startsWith(item.to + "/");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: `app-bottom-nav-item ${active ? "active" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
					}, item.to);
				})
			})
		]
	});
}
function PageHeading({ title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-primary uppercase",
				children: "JayTalk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl font-extrabold",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted-foreground",
				children: subtitle
			})
		]
	});
}
//#endregion
export { updateProfile as $, listComments as A, requestFriend as B, equipItem as C, getTyping as D, getPostVideo as E, listPosts as F, searchPeople as G, requestSignupCode as H, listStore as I, setPhoto as J, sendGroupMessage as K, listTx as L, listFriends as M, listGroups as N, getWallet as O, listMessages as P, transferBucks as Q, markRead as R, deletePost as S, getGroup as T, resetPassword as U, requestResetCode as V, resolveUsernameForLogin as W, startAd as X, setTyping as Y, toggleFollow as Z, countView as _, ThemeButton as a, createProfile as b, buyChannel as c, checkUsername as d, useCurrentUser as et, claimAd as f, clearPhoto as g, claimStreak as h, Shell as i, listConversations as j, leaderboard as k, buyItem as l, claimChallenge as m, InstallButton as n, useMe as nt, acceptFriend as o, claimAdmin as p, sendMessage as q, PageHeading as r, useStreakRestore as rt, addComment as s, Brand as t, useCurrentUserState as tt, challengeStatus as u, createGroup as v, finishSignup as w, creditBucks as x, createPost as y, reactPost as z };
