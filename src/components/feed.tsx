import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Heart, MessageCircle, Plus, ThumbsDown, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ECONOMY, formatBucks } from "@/lib/jaytalk";
import {
  addComment,
  buyChannel,
  countView,
  createPost,
  deletePost,
  getPostVideo,
  listComments,
  listPosts,
  reactPost,
  toggleFollow,
} from "@/lib/jaytalk-api";
import { PageHeading, useMe } from "@/components/shell";
import { Avatar, Button, Input, errText } from "@/components/ui";

export function SocialFeed({ kind }: { kind: "mood" | "video" }) {
  const me = useMe();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [bg, setBg] = useState("primary");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const posts = useQuery({ queryKey: ["posts", kind], queryFn: () => listPosts({ data: { kind } }) });

  async function publish() {
    setBusy(true);
    try {
      let videoData: string | undefined;
      if (kind === "video") {
        if (!file) throw new Error("Choose a video first.");
        if (file.size > 2_500_000) throw new Error("Choose a video under 2.5 MB.");
        videoData = await readFile(file);
      } else if (file) {
        if (file.size > 2_500_000) throw new Error("Choose a file under 2.5 MB.");
        videoData = await readFile(file);
      }
      await createPost({ data: { kind, body, bg, videoData } });
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

  return (
    <div>
      <PageHeading
        title={kind === "mood" ? "Moods" : "For you"}
        subtitle={kind === "mood" ? "Little moments, here for 24 hours." : `A channel costs ${formatBucks(ECONOMY.channel)}. Followers +${ECONOMY.follow}, comments +${ECONOMY.comment}, likes +${ECONOMY.like}. Dislikes −${ECONOMY.dislike}. Unfollows take the follow reward back.`}
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-primary">{kind === "mood" ? "Today's moods" : "Latest videos"}</p>
        {kind === "video" && me.data && !me.data.hasChannel ? (
          <Button onClick={() => void purchaseChannel()}>Buy channel · {formatBucks(ECONOMY.channel)}</Button>
        ) : (
          <Button onClick={() => setOpen((v) => !v)}><Plus className="size-4" />{kind === "mood" ? "Share mood" : "Post video"}</Button>
        )}
      </div>
      {open && (
        <section className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">{kind === "mood" ? "How are you feeling?" : "Share a video"}</h2>
            <Button variant="ghost" className="size-11 px-0" aria-label="Close" onClick={() => setOpen(false)}><X className="size-4" /></Button>
          </div>
          <Input aria-label="Caption" maxLength={500} placeholder={kind === "mood" ? "What's on your mind?" : "Add a caption"} value={body} onChange={(e) => setBody(e.target.value)} />
          {kind === "video" ? (
            <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-sm">
              <Upload className="size-4" /> {file?.name ?? "Choose a video under 2.5 MB"}
              <input className="sr-only" type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          ) : (
            <>
              <div className="mt-3 flex gap-2">
                {["primary", "mint", "night"].map((color) => (
                  <button key={color} type="button" aria-label={`${color} background`} className={`size-11 rounded-xl ${color === "mint" ? "bg-mint" : color === "night" ? "bg-foreground" : "bg-primary"} ${bg === color ? "ring-2 ring-ring ring-offset-2" : ""}`} onClick={() => setBg(color)} />
                ))}
              </div>
              <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-sm">
                <Upload className="size-4" /> {file?.name ?? "Add a photo or short video (optional, under 2.5 MB)"}
                <input className="sr-only" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
            </>
          )}
          <Button className="mt-3" disabled={busy} onClick={() => void publish()}>{busy ? "Posting…" : "Share"}</Button>
        </section>
      )}
      {posts.isError && <p className="text-sm text-destructive">{errText(posts.error)}</p>}
      {posts.isPending && <p className="text-sm text-muted-foreground">Loading moments…</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {posts.data?.map((post) => (
          <PostCard key={post.id} post={post} mine={post.author_id === me.data?.userId} kind={kind} />
        ))}
      </div>
      {posts.data?.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">{kind === "mood" ? "Share the first mood of the day." : "Be the first video on For You."}</p>}
    </div>
  );
}

function PostCard({
  post,
  mine,
  kind,
}: {
  post: Awaited<ReturnType<typeof listPosts>>[number];
  mine: boolean;
  kind: "mood" | "video";
}) {
  const qc = useQueryClient();
  const ref = useRef<HTMLElement>(null);
  const viewed = useRef(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [text, setText] = useState("");
  const video = useQuery({
    queryKey: ["video", post.id],
    enabled: Boolean(post.has_video),
    queryFn: () => getPostVideo({ data: { postId: post.id } }),
  });
  const comments = useQuery({
    queryKey: ["comments", post.id],
    enabled: commentsOpen,
    queryFn: () => listComments({ data: { postId: post.id } }),
  });

  useEffect(() => {
    const node = ref.current;
    if (!node || mine || viewed.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || viewed.current) return;
      viewed.current = true;
      window.setTimeout(() => {
        void countView({ data: { postId: post.id } }).then(() => qc.invalidateQueries({ queryKey: ["posts", kind] }));
      }, 5000);
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [kind, mine, post.id, qc]);

  async function react(reaction: "like" | "dislike") {
    try {
      await reactPost({ data: { postId: post.id, kind: reaction } });
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
      await addComment({ data: { postId: post.id, body: text } });
      setText("");
      await qc.invalidateQueries({ queryKey: ["comments", post.id] });
      await qc.invalidateQueries({ queryKey: ["posts", kind] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  const moodClass = post.bg === "mint" ? "bg-mint text-foreground" : post.bg === "night" ? "bg-foreground text-background" : "bg-primary text-primary-foreground";

  return (
    <article ref={ref} className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center gap-3 px-4 py-3">
        <Avatar photo={post.photo} emoji={post.avatar_emoji} className="size-10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{post.full_name}</p>
          <p className="text-xs text-muted-foreground">@{post.username}</p>
        </div>
        {post.has_channel && !mine && (
          <Button variant="outline" className="px-3" onClick={() => void follow()}>{post.following ? "Following" : "Follow"}</Button>
        )}
        {mine && (
          <Button variant="ghost" className="size-11 px-0" aria-label="Delete post" onClick={() => void deletePost({ data: { postId: post.id } }).then(() => qc.invalidateQueries({ queryKey: ["posts", kind] }))}>
            <Trash2 className="size-4" />
          </Button>
        )}
      </header>
      {kind === "mood" ? (
        <div className={`relative flex min-h-48 aspect-square flex-col items-center justify-center overflow-hidden p-6 text-center text-2xl font-bold ${moodClass}`}>
          {post.has_video && video.data?.startsWith("data:image/") && (
            <img src={video.data} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {post.has_video && video.data?.startsWith("data:video/") && (
            <video controls playsInline className="absolute inset-0 h-full w-full object-cover" src={video.data} />
          )}
          {post.body && <span className={`relative z-[1] ${post.has_video ? "rounded-xl bg-black/45 px-3 py-2 text-white" : ""}`}>{post.body}</span>}
        </div>
      ) : video.data ? (
        <video controls playsInline preload="metadata" className="aspect-[3/4] w-full bg-muted object-contain" src={video.data} />
      ) : (
        <div className="grid aspect-[3/4] place-items-center bg-muted text-sm">{video.isError ? "Video unavailable" : "Loading video…"}</div>
      )}
      <div className="space-y-3 p-4">
        {kind === "video" && post.body && <p className="text-sm">{post.body}</p>}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Button variant="ghost" className="px-2" onClick={() => void react("like")}><Heart className={`size-4 ${post.my_reaction === "like" ? "fill-current text-primary" : ""}`} /> {post.likes}</Button>
          <Button variant="ghost" className="px-2" onClick={() => void react("dislike")}><ThumbsDown className={`size-4 ${post.my_reaction === "dislike" ? "text-destructive" : ""}`} /> {post.dislikes}</Button>
          <Button variant="ghost" className="px-2" onClick={() => setCommentsOpen((v) => !v)}><MessageCircle className="size-4" /> {post.comments}</Button>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Eye className="size-4" /> {post.views}</span>
        </div>
        {commentsOpen && (
          <div className="space-y-2">
            {comments.data?.map((item) => (
              <p key={item.id} className="text-sm"><span className="font-semibold">@{item.username}</span> {item.body}</p>
            ))}
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void comment(); }}>
              <Input aria-label="Comment" value={text} maxLength={280} onChange={(e) => setText(e.target.value)} placeholder="Comment" />
              <Button type="submit" disabled={!text.trim()}>Send</Button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read that video."));
    reader.readAsDataURL(file);
  });
}
