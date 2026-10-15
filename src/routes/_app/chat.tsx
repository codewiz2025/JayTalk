import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Ban,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  Copy,
  Forward,
  ImagePlus,
  MoreVertical,
  Phone,
  Reply,
  Smile,
  Trash2,
  Video,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { CallFrame } from "@/components/jitsi";
import { useMe } from "@/components/shell";
import { Avatar, Button, Input, errText } from "@/components/ui";
import { getTyping, listConversations, listMessages, listPosts, markRead, searchPeople, sendMessage, setTyping } from "@/lib/jaytalk-api";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Chat — JayTalk" }] }),
});

type Person = { id: string; username: string; full_name: string; avatar_emoji: string; photo: string | null };
type Msg = { id: string; sender_id: string; body: string; created_at: string; read_at: string | null };

function loadSet(key: string) {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set<string>();
  }
}
function saveSet(key: string, value: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function isOnline(id: string) {
  // Demo: alternate online by id hash so UI always shows status
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 100;
  return h % 3 !== 0;
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(now) - start(d)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return d.toLocaleDateString([], { weekday: "long" });
  if (diff < 14) return "Last week";
  if (diff < 30) return "A few weeks ago";
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

function ChatPage() {
  const qc = useQueryClient();
  const [person, setPerson] = useState<Person | null>(null);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [menuMsg, setMenuMsg] = useState<Msg | null>(null);
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hiddenMsgs, setHiddenMsgs] = useState<Set<string>>(() => loadSet('jaytalk-hidden-msgs'));
  const [reactMsg, setReactMsg] = useState<Msg | null>(null);
  const [reactions, setReactions] = useState<Record<string, string[]>>(() => {
    try { return JSON.parse(localStorage.getItem('jaytalk-msg-reactions') || '{}'); } catch { return {}; }
  });
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [pickerMode, setPickerMode] = useState<null | "emoji" | "gif">(null);
  const [gifQ, setGifQ] = useState("");
  const [gifs, setGifs] = useState<{ id: string; url: string }[]>([]);
  const [gifLoading, setGifLoading] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [blocked, setBlocked] = useState<Set<string>>(() => loadSet("jaytalk-blocked"));
  const [archived, setArchived] = useState<Set<string>>(() => loadSet("jaytalk-archived"));
  const [showArchived, setShowArchived] = useState(false);
  const me = useMe();
  const bottom = useRef<HTMLDivElement>(null);
  const conversations = useQuery({ queryKey: ["conversations"], queryFn: () => listConversations(), refetchInterval: 4000 });
  const found = useQuery({ queryKey: ["people", q], enabled: q.trim().length >= 2, queryFn: () => searchPeople({ data: { q: q.trim() } }) });
  const messages = useQuery({
    queryKey: ["messages", person?.id],
    enabled: Boolean(person),
    queryFn: () => listMessages({ data: { userId: person!.id } }),
    refetchInterval: 3000,
  });
  const moods = useQuery({ queryKey: ["posts", "mood"], queryFn: () => listPosts({ data: { kind: "mood" } }), refetchInterval: 20000 });
  const typing = useQuery({
    queryKey: ["typing", person?.id, me.data?.userId],
    enabled: Boolean(person && me.data),
    queryFn: () => getTyping({ data: { key: dmKey(me.data!.userId, person!.id) } }),
    refetchInterval: 2000,
  });

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages.data?.length]);
  useEffect(() => {
    localStorage.setItem("jaytalk-msg-reactions", JSON.stringify(reactions));
  }, [reactions]);
  useEffect(() => {
    if (!person) return;
    void markRead({ data: { userId: person.id } }).then(() => qc.invalidateQueries({ queryKey: ["conversations"] }));
  }, [person, messages.data?.length, qc]);

  function toggle(key: "block" | "archive", id: string) {
    const [set, setter] = key === "block" ? [blocked, setBlocked] : [archived, setArchived];
    const next = new Set(set);
    const was = next.has(id);
    was ? next.delete(id) : next.add(id);
    setter(next);
    saveSet(key === "block" ? "jaytalk-blocked" : "jaytalk-archived", next);
    if (key === "block") {
      try {
        const meta = JSON.parse(localStorage.getItem("jaytalk-blocked-meta") || "[]") as { id: string; name: string; username?: string }[];
        if (!was) {
          const name = person?.full_name || person?.username || "Blocked user";
          const username = person?.username;
          const filtered = meta.filter((m) => m.id !== id);
          filtered.push({ id, name, username });
          localStorage.setItem("jaytalk-blocked-meta", JSON.stringify(filtered));
        } else {
          localStorage.setItem("jaytalk-blocked-meta", JSON.stringify(meta.filter((m) => m.id !== id)));
        }
      } catch { /* ignore */ }
    }
    toast.success(next.has(id) ? (key === "block" ? "Blocked" : "Archived") : key === "block" ? "Unblocked" : "Unarchived");
    if (key === "block" || key === "archive") setPerson(null);
    setSheet(false);
  }

  async function send(body = text) {
    if (!person || !body.trim()) return;
    if (blocked.has(person.id)) {
      toast.error("Unblock this person to send a message.");
      return;
    }
    try {
      const payload = replyTo ? `↩ ${replyTo.body.slice(0, 40)}\n${body}` : body;
      await sendMessage({ data: { userId: person.id, body: payload } });
      setText("");
      setReplyTo(null);
      await qc.invalidateQueries({ queryKey: ["messages", person.id] });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  async function call() {
    if (!person) return;
    const id = `JayTalk${crypto.randomUUID().replace(/-/g, "")}`;
    await send(`Call invitation: https://meet.jit.si/${id}`);
    setRoom(id);
  }

  const list = (conversations.data ?? []).filter(
    (row) => row.person && (showArchived ? archived.has(row.person.id) : !archived.has(row.person.id)) && !blocked.has(row.person.id),
  );

  const moodStories = useMemo(() => {
    const map = new Map<string, { id: string; username: string; photo: string | null; emoji: string; body: string }>();
    for (const p of moods.data ?? []) {
      if (!map.has(p.author_id)) {
        map.set(p.author_id, {
          id: p.author_id,
          username: p.username,
          photo: p.photo,
          emoji: p.avatar_emoji,
          body: p.body,
        });
      }
    }
    return [...map.values()].slice(0, 12);
  }, [moods.data]);

  const grouped = useMemo(() => {
    const rows: { label: string; items: Msg[] }[] = [];
    let last = "";
    for (const m of (messages.data as Msg[] | undefined) ?? []) {
      const label = dayLabel(m.created_at);
      if (label !== last) {
        rows.push({ label, items: [] });
        last = label;
      }
      rows[rows.length - 1]!.items.push(m);
    }
    return rows;
  }, [messages.data]);

  function onMsgAction(action: string, m: Msg) {
    setMenuMsg(null);
    if (action === "copy") {
      void navigator.clipboard.writeText(m.body.startsWith("data:image/") ? "[photo]" : m.body);
      toast.success("Copied");
    } else if (action === "reply") {
      setReplyTo(m);
    } else if (action === "forward") {
      toast.message("Copied — open another chat and paste to forward.");
      void navigator.clipboard.writeText(m.body);
    } else if (action === "delete") {
      setHiddenMsgs((prev) => {
        const next = new Set(prev);
        next.add(m.id);
        saveSet("jaytalk-hidden-msgs", next);
        return next;
      });
      toast.success("Message deleted");
    } else if (action === "select") {
      setSelectMode(true);
      setSelected(new Set([m.id]));
    } else if (action === "react") {
      setReactMsg(m);
    }
  }

  function addReaction(msgId: string, emoji: string) {
    setReactions((prev) => {
      const cur = prev[msgId] ?? [];
      const nextList = cur.includes(emoji) ? cur.filter((e) => e !== emoji) : [...cur, emoji];
      return { ...prev, [msgId]: nextList };
    });
    setReactMsg(null);
  }

  function scrollToLatest() {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setShowScrollDown(false);
  }

  function onThreadScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollDown(dist > 120);
  }

  function chatMyself() {
    if (!me.data) return;
    setPerson({
      id: me.data.userId,
      username: me.data.username,
      full_name: me.data.fullName || "Me",
      avatar_emoji: me.data.avatarEmoji || "🙂",
      photo: me.data.photo,
    });
  }

  async function searchGifs(q: string) {
    setGifLoading(true);
    try {
      const key =
        (import.meta as any).env?.VITE_GIPHY_API_KEY ||
        (import.meta as any).env?.VITE_TENOR_API_KEY ||
        localStorage.getItem("jaytalk-giphy-key") ||
        "";
      if (!key) {
        setGifs([]);
        toast.message("Add VITE_GIPHY_API_KEY in .env for GIFs");
        return;
      }
      const term = encodeURIComponent(q || "hello");
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${term}&limit=24&rating=pg-13&lang=en`,
      );
      if (!res.ok) throw new Error("giphy");
      const data = await res.json();
      const list = (data.data || [])
        .map((r: any) => ({
          id: String(r.id),
          url: r.images?.fixed_height?.url || r.images?.downsized?.url || r.images?.original?.url || "",
        }))
        .filter((x: { url: string }) => x.url);
      setGifs(list);
      if (!list.length) toast.message("No GIFs found — try another word");
    } catch {
      toast.error("Could not load GIFs");
    } finally {
      setGifLoading(false);
    }
  }

    async function enableNotifications() {
    if (!("Notification" in window)) {
      toast.error("Notifications not supported on this device");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      localStorage.setItem("jaytalk-notify", "1");
      new Notification("JayTalk", { body: "Notifications are on.", icon: "/brand/jaytalk-logo.png" });
      toast.success("Notifications enabled");
    } else toast.error("Permission denied");
  }

  return (
    <div className="chat-app">
      <aside className={`chat-list ${person ? "chat-list-hidden" : ""}`}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
          <h1 className="text-2xl font-extrabold">Chats</h1>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className="chip-btn rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-extrabold shadow-sm"
              onClick={chatMyself}
            >
              Note to self
            </button>
            <button
              type="button"
              className="chip-btn rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-extrabold shadow-sm"
              onClick={() => void enableNotifications()}
            >
              Notify
            </button>
            <button
              type="button"
              className="chip-btn rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] font-extrabold shadow-sm"
              onClick={() => setShowArchived((v) => !v)}
            >
              {showArchived ? "Active" : "Archived"}
            </button>
          </div>
        </div>

        {/* Mood stories — phone & desktop */}
        <div className="mood-stories mb-3 flex gap-3 overflow-x-auto px-1 pb-2">
          <Link to="/moods" className="flex w-16 shrink-0 flex-col items-center gap-1">
            <span className="story-ring story-ring-me grid size-14 place-items-center rounded-full bg-muted text-xl font-bold">+</span>
            <span className="w-full truncate text-center text-[10px] font-medium">Your mood</span>
          </Link>
          {moodStories.map((s) => (
            <Link key={s.id} to="/moods" className="flex w-16 shrink-0 flex-col items-center gap-1">
              <span className="story-ring relative">
                <Avatar photo={s.photo} emoji={s.emoji} className="size-14" />
              </span>
              <span className="w-full truncate text-center text-[10px] font-medium">@{s.username}</span>
            </Link>
          ))}
        </div>

        <Input aria-label="Search people" placeholder="Search or start a new chat" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="mt-2 space-y-1">
          {found.data?.map((p) => (
            <button
              key={p.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-2xl bg-muted p-2 text-left transition hover:scale-[1.01]"
              onClick={() => {
                setPerson(p);
                setQ("");
              }}
            >
              <span className="relative">
                <Avatar photo={p.photo} emoji={p.avatar_emoji} className="size-10" />
                <span className={`presence-dot ${isOnline(p.id) ? "online" : "offline"}`} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{p.full_name}</span>
                <span className="block text-xs text-muted-foreground">@{p.username}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-2 space-y-0.5">
          {list.map(
            (row) =>
              row.person && (
                <button
                  key={row.person.id}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition ${person?.id === row.person.id ? "bg-sky-100 dark:bg-sky-900/40" : "hover:bg-muted"}`}
                  onClick={() => setPerson(row.person)}
                >
                  <span className="relative shrink-0">
                    <Avatar photo={row.person.photo} emoji={row.person.avatar_emoji} className="size-12" />
                    <span className={`presence-dot ${isOnline(row.person.id) ? "online" : "offline"}`} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{row.person.full_name || `@${row.person.username}`}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {row.at ? new Date(row.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="block truncate text-xs text-muted-foreground">{row.last}</span>
                      {row.unread > 0 && <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">{row.unread}</span>}
                    </span>
                  </span>
                </button>
              ),
          )}
          {list.length === 0 && <p className="px-1 text-xs text-muted-foreground">{showArchived ? "No archived chats." : "No conversations yet."}</p>}
        </div>
      </aside>

      <section className={`chat-thread ${person ? "chat-thread-open" : ""}`}>
        {person ? (
          <>
            <header className="flex items-center gap-2 border-b border-border p-3">
              <button type="button" className="grid size-10 place-items-center rounded-full hover:bg-muted md:hidden" aria-label="Back" onClick={() => setPerson(null)}>
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={() => setSheet(true)}>
                <span className="relative">
                  <Avatar photo={person.photo} emoji={person.avatar_emoji} className="size-10" />
                  <span className={`presence-dot ${isOnline(person.id) ? "online" : "offline"}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{person.full_name}</span>
                  <span className="block text-xs text-muted-foreground">{typing.data?.length ? "Typing…" : isOnline(person.id) ? "Online" : `@${person.username}`}</span>
                </span>
              </button>
              <Button variant="ghost" className="size-11 px-0" aria-label="Voice call" onClick={() => void call()}>
                <Phone className="size-4" />
              </Button>
              <Button variant="ghost" className="size-11 px-0" aria-label="Video call" onClick={() => void call()}>
                <Video className="size-4" />
              </Button>
            </header>

            <div className="chat-messages flex-1 space-y-1 overflow-y-auto p-3" onScroll={onThreadScroll} ref={threadRef}>
              {grouped.map((g) => (
                <div key={g.label}>
                  <div className="sticky top-1 z-[1] my-3 flex justify-center">
                    <span className="rounded-full bg-muted/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm backdrop-blur">{g.label}</span>
                  </div>
                  {g.items.map((m) => {
                    const mine = m.sender_id === me.data?.userId;
                    const invite = m.body.match(/https:\/\/meet\.jit\.si\/(\S+)/);
                    const picked = selected.has(m.id);
                    return (
                      <div
                        key={m.id}
                        className={`group relative mb-1 max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
                          m.body.startsWith("data:image/") ||
                          /^https?:\/\/.*\.(gif|webp)/i.test(m.body) ||
                          m.body.includes("giphy.com") ||
                          m.body.includes("media.giphy") ||
                          m.body.includes("media.tenor")
                            ? `msg-bubble-media ${mine ? "ml-auto mine" : ""}`
                            : mine
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                        } ${picked ? "ring-2 ring-amber-400" : ""}`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setMenuMsg(m);
                        }}
                        onClick={() => {
                          if (selectMode) {
                            const next = new Set(selected);
                            next.has(m.id) ? next.delete(m.id) : next.add(m.id);
                            setSelected(next);
                          }
                        }}
                      >
                        {m.body.startsWith("data:image/") ? (
                          <img src={m.body} alt="" className="msg-media" />
                        ) : invite ? (
                          <button type="button" className="call-invite" onClick={() => setRoom(invite[1] ?? null)}>
                            <span className="call-pulse" />
                            <Phone className="size-4" /> Join call
                          </button>
                        ) : /^https?:\/\/.*\.(gif|webp)/i.test(m.body) || m.body.includes("media.tenor") || m.body.includes("giphy.com") || m.body.includes("media.giphy") ? (
                          <img src={m.body} alt="GIF" className="msg-media" />
                        ) : (
                          m.body
                        )}
                        <span className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {mine && (m.read_at ? <CheckCheck className="size-3 text-sky-200" /> : <Check className="size-3" />)}
                        </span>
                        {(reactions[m.id]?.length ?? 0) > 0 && (
                          <div className="msg-react-chip">
                            {reactions[m.id].join(" ")}
                          </div>
                        )}
                        <button
                          type="button"
                          className="absolute top-1 right-1 hidden rounded-full bg-black/20 p-1 group-hover:block"
                          aria-label="Message actions"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuMsg(m);
                          }}
                        >
                          <MoreVertical className="size-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={bottom} />
            </div>

            {selectMode && (
              <div className="select-toolbar">
                <span className="text-xs font-semibold">{selected.size} selected</span>
                <Button variant="outline" className="px-3" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Deselect</Button>
                <Button variant="outline" className="px-3" onClick={() => {
                  const bodies = (messages.data ?? []).filter((m) => selected.has(m.id)).map((m) => m.body).join("\n");
                  void navigator.clipboard.writeText(bodies);
                  toast.success("Copied to forward");
                }}>Forward</Button>
                <Button className="bg-rose-600 px-3 hover:bg-rose-700" onClick={() => {
                  setHiddenMsgs((prev) => {
                    const next = new Set(prev);
                    selected.forEach((id) => next.add(id));
                    saveSet("jaytalk-hidden-msgs", next);
                    return next;
                  });
                  setSelectMode(false);
                  setSelected(new Set());
                  toast.success("Deleted");
                }}>Delete</Button>
              </div>
            )}
            {replyTo && (
              <div className="flex items-center gap-2 border-t border-border bg-muted/50 px-3 py-2 text-xs">
                <Reply className="size-3.5 text-primary" />
                <span className="min-w-0 flex-1 truncate">Replying to: {replyTo.body.slice(0, 60)}</span>
                <button type="button" className="font-semibold text-primary" onClick={() => setReplyTo(null)}>
                  Cancel
                </button>
              </div>
            )}

            {showScrollDown && (
              <button type="button" className="chat-scroll-bottom" aria-label="Latest messages" onClick={scrollToLatest}>
                <ChevronDown className="size-5" />
              </button>
            )}
            <div className="chat-composer-wrap">
              {pickerMode === "emoji" && (
                <div className="emoji-panel">
                  <div className="emoji-grid">
                    {['😀', '😂', '🥰', '😊', '🙂', '🙏', '👍', '👏', '❤️', '🔥', '😎', '😭', '😢', '😮', '🤩', '😇', '🎉', '🎂', '🌹', '⭐', '💪', '👋', '😜', '😋', '🌈', '🍕', '☕', '🚗', '🏆', '🎮', '💡', '🎵'].map((e) => (
                      <button key={e} type="button" onClick={() => { void send(e); setPickerMode(null); }}>{e}</button>
                    ))}
                  </div>
                </div>
              )}
              {pickerMode === "gif" && (
                <div className="gif-panel space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search GIFs"
                      value={gifQ}
                      onChange={(e) => setGifQ(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void searchGifs(gifQ); } }}
                    />
                    <Button type="button" className="px-3" onClick={() => void searchGifs(gifQ)}>{gifLoading ? "…" : "Go"}</Button>
                  </div>
                  <div className="gif-grid">
                    {gifs.map((g) => (
                      <button key={g.id} type="button" onClick={() => { void send(g.url.startsWith("http") ? g.url : `GIF:${g.url}`); setPickerMode(null); }}>
                        <img src={g.url} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                  {!gifs.length && <p className="text-xs text-muted-foreground">Search for a GIF (powered by GIPHY).</p>}
                </div>
              )}
              <div className="flex items-center gap-2 px-3 pt-2">
                <button type="button" className={`rounded-lg px-2 py-1 text-lg ${pickerMode === "emoji" ? "bg-secondary" : ""}`} onClick={() => setPickerMode((m) => m === "emoji" ? null : "emoji")}>😊</button>
                <button type="button" className={`rounded-lg px-2 py-1 text-xs font-bold ${pickerMode === "gif" ? "bg-secondary text-primary" : "text-muted-foreground"}`} onClick={() => { setPickerMode((m) => m === "gif" ? null : "gif"); if (pickerMode !== "gif") void searchGifs(gifQ || "hello"); }}>GIF</button>
              </div>
            <form
              className="chat-composer flex gap-2 px-3 pb-3 pt-1"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <label className="grid size-11 cursor-pointer place-items-center rounded-xl border border-border" aria-label="Send a photo">
                <ImagePlus className="size-4" />
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void resizeImage(file)
                      .then((data) => send(data))
                      .catch((error) => toast.error(errText(error)));
                  }}
                />
              </label>
              <Input
                aria-label="Message"
                maxLength={2000}
                placeholder="Write a message"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (person && me.data) void setTyping({ data: { key: dmKey(me.data.userId, person.id) } });
                }}
              />
              <Button type="submit" className="px-3" aria-label="Send" disabled={!text.trim()}>
                <SendIcon />
              </Button>
            </form>
            </div>
          </>
        ) : (
          <div className="chat-empty hidden flex-1 flex-col items-center justify-center gap-4 p-8 text-center md:flex">
            <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 text-3xl shadow-inner dark:from-sky-900/40 dark:to-indigo-900/40">
              💬
            </div>
            <div>
              <p className="text-xl font-extrabold text-foreground">JayTalk</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Select a chat on the left, or search for someone to start a conversation.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Messages are private between you and your friends.</p>
          </div>
        )}
      </section>

      {sheet && person && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 md:items-center" onClick={() => setSheet(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()} style={{ animation: "pop .2s ease" }}>
            <div className="mb-4 flex flex-col items-center text-center">
              <span className="relative">
                <Avatar photo={person.photo} emoji={person.avatar_emoji} className="size-20 text-3xl" />
                <span className={`presence-dot presence-dot-lg ${isOnline(person.id) ? "online" : "offline"}`} />
              </span>
              <p className="mt-2 text-lg font-bold">{person.full_name}</p>
              <p className="text-sm text-muted-foreground">@{person.username}</p>
              <p className="mt-1 text-xs font-semibold text-primary">{isOnline(person.id) ? "Online" : "Offline"}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => void call()}>
                <Phone className="size-4" /> Call
              </Button>
              <Button variant="outline" onClick={() => void call()}>
                <Video className="size-4" /> Video
              </Button>
              <Link to="/wallet" className="col-span-2">
                <Button variant="outline" className="w-full">
                  <Wallet className="size-4" /> Send Bucks
                </Button>
              </Link>
              <Button variant="outline" onClick={() => toggle("archive", person.id)}>
                <Archive className="size-4" /> {archived.has(person.id) ? "Unarchive" : "Archive"}
              </Button>
              <Button variant="outline" className="text-rose-600" onClick={() => toggle("block", person.id)}>
                <Ban className="size-4" /> {blocked.has(person.id) ? "Unblock" : "Block"}
              </Button>
            </div>
            <Button className="mt-3 w-full" variant="secondary" onClick={() => setSheet(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {reactMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={() => setReactMsg(null)}>
          <div className="msg-react-bar" onClick={(e) => e.stopPropagation()}>
            {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
              <button key={emoji} type="button" className="text-2xl leading-none px-1" onClick={() => addReaction(reactMsg.id, emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {menuMsg && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center" onClick={() => setMenuMsg(null)}>
          <div className="w-full max-w-xs overflow-hidden rounded-2xl bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
            {[
              { id: "react", label: "React", icon: Smile },
              { id: "reply", label: "Reply", icon: Reply },
              { id: "forward", label: "Forward", icon: Forward },
              { id: "copy", label: "Copy", icon: Copy },
              { id: "select", label: "Select", icon: Check },
              { id: "delete", label: "Delete", icon: Trash2 },
            ].map((a) => (
              <button key={a.id} type="button" className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left text-sm font-semibold last:border-0 hover:bg-muted" onClick={() => onMsgAction(a.id, menuMsg)}>
                <a.icon className="size-4 text-primary" /> {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {room && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
          <div className="call-stage flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <div className="call-ring-wrap">
              <span className="call-ring" />
              <span className="call-ring delay" />
              <Avatar photo={person?.photo} emoji={person?.avatar_emoji} className="size-24 text-4xl" />
            </div>
            <p className="text-xl font-bold">{person?.full_name ?? "Call"}</p>
            <p className="text-sm text-white/70">Ringing…</p>
            <div className="mt-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10">
              <CallFrame room={room} onClose={() => setRoom(null)} />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="secondary" onClick={() => window.open(`https://meet.jit.si/${room}`, "_blank")}>
                Open full
              </Button>
              <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => setRoom(null)}>
                End
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function dmKey(a: string, b: string) {
  return [a, b].sort().join(":");
}

async function resizeImage(file: File) {
  if (file.size > 1_500_000) throw new Error("Choose a photo under 1.5 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image."));
      el.src = url;
    });
    const canvas = document.createElement("canvas");
    const max = 960;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}