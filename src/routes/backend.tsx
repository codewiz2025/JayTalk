import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";

export const Route = createFileRoute("/backend")({
  component: BackendPage,
  head: () => ({ meta: [{ title: "JayTalk Backend" }] }),
});

const PASS = "JayTech2022!";
const HQ_LOGO = "https://jaytech.online/_next/image?url=%2Fbrand%2Flogo.png&w=1080&q=75";

type Advert = {
  id: string;
  title: string;
  media: string;
  kind: "image" | "video";
  seconds: number;
};
type Broadcast = { id: string; body: string; media?: string; at: string };
type UserRow = { id: string; username: string; balance: number; blockedUntil?: string };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function BackendPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<"users" | "ads" | "broadcast">("users");
  const [users, setUsers] = useState<UserRow[]>(() => load("jaytalk-admin-users", []));
  const [ads, setAds] = useState<Advert[]>(() =>
    load("jaytalk-admin-ads", [
      { id: "1", title: "JayTech", media: "", kind: "image" as const, seconds: 20 },
    ]),
  );
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(() => load("jaytalk-admin-broadcasts", []));
  const [creditUser, setCreditUser] = useState("");
  const [creditAmt, setCreditAmt] = useState("1000");
  const [adTitle, setAdTitle] = useState("");
  const [adSeconds, setAdSeconds] = useState("20");
  const [adMedia, setAdMedia] = useState("");
  const [bcBody, setBcBody] = useState("");
  const [bcMedia, setBcMedia] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("jaytalk-backend-ok") === "1") setAuthed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("jaytalk-admin-users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("jaytalk-admin-ads", JSON.stringify(ads));
  }, [ads]);
  useEffect(() => {
    localStorage.setItem("jaytalk-admin-broadcasts", JSON.stringify(broadcasts));
  }, [broadcasts]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pw === PASS) {
      sessionStorage.setItem("jaytalk-backend-ok", "1");
      setAuthed(true);
    } else toast.error("Wrong password");
  }

  function credit() {
    const amt = Number(creditAmt) || 0;
    if (!creditUser.trim() || amt <= 0) return;
    setUsers((list) => {
      const i = list.findIndex((u) => u.username === creditUser.trim() || u.id === creditUser.trim());
      if (i >= 0) {
        const next = [...list];
        next[i] = { ...next[i], balance: next[i].balance + amt };
        return next;
      }
      return [...list, { id: crypto.randomUUID(), username: creditUser.trim(), balance: amt }];
    });
    // also write a credit ledger the wallet can read
    const ledger = load<{ username: string; amount: number; at: string }[]>("jaytalk-admin-credits", []);
    ledger.push({ username: creditUser.trim(), amount: amt, at: new Date().toISOString() });
    localStorage.setItem("jaytalk-admin-credits", JSON.stringify(ledger));
    toast.success(`Credited ${amt} Bucks`);
  }

  function addAd() {
    if (!adTitle.trim()) return;
    setAds((a) => [
      ...a,
      {
        id: crypto.randomUUID(),
        title: adTitle.trim(),
        media: adMedia,
        kind: adMedia.includes("video") || adMedia.endsWith(".mp4") ? "video" : "image",
        seconds: Math.max(5, Number(adSeconds) || 20),
      },
    ]);
    setAdTitle("");
    setAdMedia("");
    toast.success("Advert saved");
  }

  function sendBroadcast() {
    if (!bcBody.trim() && !bcMedia) return;
    const item = {
      id: crypto.randomUUID(),
      body: bcBody.trim(),
      media: bcMedia || undefined,
      at: new Date().toISOString(),
    };
    setBroadcasts((b) => [item, ...b]);
    localStorage.setItem("jaytalk-hq-pending", JSON.stringify(item));
    setBcBody("");
    setBcMedia("");
    toast.success("Broadcast queued for JayTalk HQ");
  }

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
        <form onSubmit={login} className="w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <img src={HQ_LOGO} alt="JayTech" className="mx-auto h-12 object-contain" />
          <h1 className="text-center text-xl font-bold">JayTalk Backend</h1>
          <Input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="bg-slate-800 text-white"
          />
          <Button type="submit" className="w-full">
            Enter
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={HQ_LOGO} alt="" className="h-10 object-contain" />
            <h1 className="text-2xl font-extrabold">Backend</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("jaytalk-backend-ok");
              setAuthed(false);
            }}
          >
            Lock
          </Button>
        </div>
        <div className="flex gap-2">
          {(["users", "ads", "broadcast"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${tab === t ? "bg-indigo-600" : "bg-slate-800"}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <section className="space-y-3 rounded-2xl bg-slate-900 p-4">
            <h2 className="font-bold">Credit Bucks / manage</h2>
            <div className="flex flex-wrap gap-2">
              <Input placeholder="username" value={creditUser} onChange={(e) => setCreditUser(e.target.value)} className="bg-slate-800" />
              <Input placeholder="amount" value={creditAmt} onChange={(e) => setCreditAmt(e.target.value)} className="w-28 bg-slate-800" />
              <Button onClick={credit}>Give Bucks</Button>
            </div>
            <p className="text-xs text-slate-400">
              Temporary store — wire to Supabase admin API later for live balances, block, and delete.
            </p>
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2 text-sm">
                  <span>@{u.username}</span>
                  <span>{u.balance} B</span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      className="px-2 text-xs"
                      onClick={() =>
                        setUsers((list) =>
                          list.map((x) =>
                            x.id === u.id
                              ? { ...x, blockedUntil: new Date(Date.now() + 86400000).toISOString() }
                              : x,
                          ),
                        )
                      }
                    >
                      Block 24h
                    </Button>
                    <Button
                      variant="outline"
                      className="px-2 text-xs text-rose-400"
                      onClick={() => setUsers((list) => list.filter((x) => x.id !== u.id))}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "ads" && (
          <section className="space-y-3 rounded-2xl bg-slate-900 p-4">
            <h2 className="font-bold">Adverts (default 20s)</h2>
            <Input placeholder="Title" value={adTitle} onChange={(e) => setAdTitle(e.target.value)} className="bg-slate-800" />
            <Input placeholder="Image/video URL" value={adMedia} onChange={(e) => setAdMedia(e.target.value)} className="bg-slate-800" />
            <Input placeholder="Seconds" value={adSeconds} onChange={(e) => setAdSeconds(e.target.value)} className="bg-slate-800" />
            <Button onClick={addAd}>Add advert</Button>
            <ul className="space-y-2">
              {ads.map((a) => (
                <li key={a.id} className="rounded-xl bg-slate-800 px-3 py-2 text-sm">
                  {a.title} · {a.seconds}s · {a.kind}
                  <Button
                    variant="outline"
                    className="ml-2 px-2 text-xs"
                    onClick={() => setAds((list) => list.filter((x) => x.id !== a.id))}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "broadcast" && (
          <section className="space-y-3 rounded-2xl bg-slate-900 p-4">
            <h2 className="font-bold">Broadcast → JayTalk HQ chat</h2>
            <textarea
              className="min-h-24 w-full rounded-xl bg-slate-800 p-3 text-sm"
              placeholder="Message"
              value={bcBody}
              onChange={(e) => setBcBody(e.target.value)}
            />
            <Input placeholder="Optional image URL" value={bcMedia} onChange={(e) => setBcMedia(e.target.value)} className="bg-slate-800" />
            <Button onClick={sendBroadcast}>Send broadcast</Button>
            <ul className="space-y-2 text-sm">
              {broadcasts.map((b) => (
                <li key={b.id} className="rounded-xl bg-slate-800 px-3 py-2">
                  {b.body}
                  <span className="ml-2 text-xs text-slate-400">{new Date(b.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
