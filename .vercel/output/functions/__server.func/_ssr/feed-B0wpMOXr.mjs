import { o as __toESM } from "../_runtime.mjs";
import { i as formatBucks, t as ECONOMY } from "./jaytalk-BUSANd3K.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as errText, i as Input, n as Button, t as Avatar } from "./ui-CBRITsGD.mjs";
import { E as Plus, L as Heart, P as MessageCircle, V as Eye, h as ThumbsDown, m as Trash2, n as X, u as Upload } from "../_libs/lucide-react.mjs";
import { A as listComments, E as getPostVideo, F as listPosts, S as deletePost, Z as toggleFollow, _ as countView, c as buyChannel, nt as useMe, r as PageHeading, s as addComment, y as createPost, z as reactPost } from "./shell-DX5LxS3D.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/feed-B0wpMOXr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SocialFeed({ kind }) {
	const me = useMe();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [body, setBody] = (0, import_react.useState)("");
	const [bg, setBg] = (0, import_react.useState)("primary");
	const [file, setFile] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const posts = useQuery({
		queryKey: ["posts", kind],
		queryFn: () => listPosts({ data: { kind } })
	});
	async function publish() {
		setBusy(true);
		try {
			let videoData;
			if (kind === "video") {
				if (!file) throw new Error("Choose a video first.");
				if (file.size > 25e5) throw new Error("Choose a video under 2.5 MB.");
				videoData = await readFile(file);
			} else if (file) {
				if (file.size > 25e5) throw new Error("Choose a file under 2.5 MB.");
				videoData = await readFile(file);
			}
			await createPost({ data: {
				kind,
				body,
				bg,
				videoData
			} });
			toast.success(kind === "mood" ? "Mood shared" : "Video posted");
			setOpen(false);
			setBody("");
			setFile(null);
			await qc.invalidateQueries({ queryKey: ["posts", kind] });
		} catch (error) {
			toast.error(errText(error));
		} finally {
			setBusy(false);
		}
	}
	async function purchaseChannel() {
		try {
			await buyChannel();
			toast.success("Channel unlocked. You can post on For You.");
			await qc.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeading, {
			title: kind === "mood" ? "Moods" : "For you",
			subtitle: kind === "mood" ? "Little moments, here for 24 hours." : `A channel costs ${formatBucks(ECONOMY.channel)}. Followers +${ECONOMY.follow}, comments +${ECONOMY.comment}, likes +${ECONOMY.like}. Dislikes −${ECONOMY.dislike}. Unfollows take the follow reward back.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-primary",
				children: kind === "mood" ? "Today's moods" : "Latest videos"
			}), kind === "video" && me.data && !me.data.hasChannel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => void purchaseChannel(),
				children: ["Buy channel · ", formatBucks(ECONOMY.channel)]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setOpen((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), kind === "mood" ? "Share mood" : "Post video"]
			})]
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-6 rounded-2xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: kind === "mood" ? "How are you feeling?" : "Share a video"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "size-11 px-0",
						"aria-label": "Close",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					"aria-label": "Caption",
					maxLength: 500,
					placeholder: kind === "mood" ? "What's on your mind?" : "Add a caption",
					value: body,
					onChange: (e) => setBody(e.target.value)
				}),
				kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
						" ",
						file?.name ?? "Choose a video under 2.5 MB",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "sr-only",
							type: "file",
							accept: "video/*",
							onChange: (e) => setFile(e.target.files?.[0] ?? null)
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2",
					children: [
						"primary",
						"mint",
						"night"
					].map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": `${color} background`,
						className: `size-11 rounded-xl ${color === "mint" ? "bg-mint" : color === "night" ? "bg-foreground" : "bg-primary"} ${bg === color ? "ring-2 ring-ring ring-offset-2" : ""}`,
						onClick: () => setBg(color)
					}, color))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
						" ",
						file?.name ?? "Add a photo or short video (optional, under 2.5 MB)",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "sr-only",
							type: "file",
							accept: "image/*,video/*",
							onChange: (e) => setFile(e.target.files?.[0] ?? null)
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					disabled: busy,
					onClick: () => void publish(),
					children: busy ? "Posting…" : "Share"
				})
			]
		}),
		posts.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-destructive",
			children: errText(posts.error)
		}),
		posts.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading moments…"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: posts.data?.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, {
				post,
				mine: post.author_id === me.data?.userId,
				kind
			}, post.id))
		}),
		posts.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: kind === "mood" ? "Share the first mood of the day." : "Be the first video on For You."
		})
	] });
}
function PostCard({ post, mine, kind }) {
	const qc = useQueryClient();
	const ref = (0, import_react.useRef)(null);
	const viewed = (0, import_react.useRef)(false);
	const [commentsOpen, setCommentsOpen] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const video = useQuery({
		queryKey: ["video", post.id],
		enabled: Boolean(post.has_video),
		queryFn: () => getPostVideo({ data: { postId: post.id } })
	});
	const comments = useQuery({
		queryKey: ["comments", post.id],
		enabled: commentsOpen,
		queryFn: () => listComments({ data: { postId: post.id } })
	});
	(0, import_react.useEffect)(() => {
		const node = ref.current;
		if (!node || mine || viewed.current) return;
		const observer = new IntersectionObserver((entries) => {
			if (!entries[0]?.isIntersecting || viewed.current) return;
			viewed.current = true;
			window.setTimeout(() => {
				countView({ data: { postId: post.id } }).then(() => qc.invalidateQueries({ queryKey: ["posts", kind] }));
			}, 5e3);
		}, { threshold: .6 });
		observer.observe(node);
		return () => observer.disconnect();
	}, [
		kind,
		mine,
		post.id,
		qc
	]);
	async function react(reaction) {
		try {
			await reactPost({ data: {
				postId: post.id,
				kind: reaction
			} });
			await qc.invalidateQueries({ queryKey: ["posts", kind] });
			await qc.invalidateQueries({ queryKey: ["me"] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function follow() {
		try {
			await toggleFollow({ data: { userId: post.author_id } });
			await qc.invalidateQueries({ queryKey: ["posts", kind] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	async function comment() {
		try {
			await addComment({ data: {
				postId: post.id,
				body: text
			} });
			setText("");
			await qc.invalidateQueries({ queryKey: ["comments", post.id] });
			await qc.invalidateQueries({ queryKey: ["posts", kind] });
		} catch (error) {
			toast.error(errText(error));
		}
	}
	const moodClass = post.bg === "mint" ? "bg-mint text-foreground" : post.bg === "night" ? "bg-foreground text-background" : "bg-primary text-primary-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		ref,
		className: "overflow-hidden rounded-2xl border border-border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						photo: post.photo,
						emoji: post.avatar_emoji,
						className: "size-10"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-bold",
							children: post.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["@", post.username]
						})]
					}),
					post.has_channel && !mine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "px-3",
						onClick: () => void follow(),
						children: post.following ? "Following" : "Follow"
					}),
					mine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "size-11 px-0",
						"aria-label": "Delete post",
						onClick: () => void deletePost({ data: { postId: post.id } }).then(() => qc.invalidateQueries({ queryKey: ["posts", kind] })),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}),
			kind === "mood" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `relative flex min-h-48 aspect-square flex-col items-center justify-center overflow-hidden p-6 text-center text-2xl font-bold ${moodClass}`,
				children: [
					post.has_video && video.data?.startsWith("data:image/") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: video.data,
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					post.has_video && video.data?.startsWith("data:video/") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						controls: true,
						playsInline: true,
						className: "absolute inset-0 h-full w-full object-cover",
						src: video.data
					}),
					post.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `relative z-[1] ${post.has_video ? "rounded-xl bg-black/45 px-3 py-2 text-white" : ""}`,
						children: post.body
					})
				]
			}) : video.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				controls: true,
				playsInline: true,
				preload: "metadata",
				className: "aspect-[3/4] w-full bg-muted object-contain",
				src: video.data
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid aspect-[3/4] place-items-center bg-muted text-sm",
				children: video.isError ? "Video unavailable" : "Loading video…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					kind === "video" && post.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: post.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "px-2",
								onClick: () => void react("like"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-4 ${post.my_reaction === "like" ? "fill-current text-primary" : ""}` }),
									" ",
									post.likes
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "px-2",
								onClick: () => void react("dislike"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: `size-4 ${post.my_reaction === "dislike" ? "text-destructive" : ""}` }),
									" ",
									post.dislikes
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "px-2",
								onClick: () => setCommentsOpen((v) => !v),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }),
									" ",
									post.comments
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto flex items-center gap-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }),
									" ",
									post.views
								]
							})
						]
					}),
					commentsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [comments.data?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: ["@", item.username]
								}),
								" ",
								item.body
							]
						}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								comment();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": "Comment",
								value: text,
								maxLength: 280,
								onChange: (e) => setText(e.target.value),
								placeholder: "Comment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !text.trim(),
								children: "Send"
							})]
						})]
					})
				]
			})
		]
	});
}
function readFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Couldn't read that video."));
		reader.readAsDataURL(file);
	});
}
//#endregion
export { SocialFeed as t };
