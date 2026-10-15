import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Flame, MessageCircle, Send, Trophy, Tv, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/shell";
import { Avatar, Button, Input, errText } from "@/components/ui";
import { PACKS, WHATSAPP_DISPLAY, formatBucks, transferAmount, waLink, type PortfolioSite } from "@/lib/jaytalk";
import { claimAd, claimStreak, getWallet, leaderboard, listTx, searchPeople, startAd, transferBucks, useStreakRestore } from "@/lib/jaytalk-api";

export const Route = createFileRoute("/_app/wallet")({
  component: WalletPage,
  head: () => ({ meta: [{ title: "JayTalk Bucks" }] }),
});

const AD_GRADIENTS: Record<string, string> = {
  "AI & Technology": "linear-gradient(135deg, #0f172a 0%, #312e81 50%, #4f46e5 100%)",
  Education: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #99f6e4 100%)",
  "E-commerce": "linear-gradient(135deg, #9f1239 0%, #e11d48 50%, #fb7185 100%)",
  Creative: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fdba74 100%)",
  Business: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #93c5fd 100%)",
  Sports: "linear-gradient(135deg, #14532d 0%, #16a34a 50%, #86efac 100%)",
};

function WalletPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"overview" | "navigation" | "activity">("overview");
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: () => getWallet() });
  const tx = useQuery({ queryKey: ["tx"], queryFn: () => listTx() });
  const board = useQuery({ queryKey: ["board"], queryFn: () => leaderboard() });
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["wallet"] });
    void qc.invalidateQueries({ queryKey: ["tx"] });
    void qc.invalidateQueries({ queryKey: ["board"] });
    void qc.invalidateQueries({ queryKey: ["me"] });
  };
  const w = wallet.data;

  const navLinks = [
    { to: "/chat", label: "Chat" },
    { to: "/friends", label: "Friends" },
    { to: "/groups", label: "Groups" },
    { to: "/fyp", label: "For you" },
    { to: "/moods", label: "Moods" },
    { to: "/games", label: "Games" },
    { to: "/challenges", label: "Challenges" },
    { to: "/store", label: "Store" },
    { to: "/avatar", label: "Avatar" },
    { to: "/wallet", label: "Bucks" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
  ] as const;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <PageHeading title="JayTalk Bucks" subtitle="Streaks, a daily portfolio advert, sending, and the richest members." />
      <div className="flex gap-2 overflow-x-auto rounded-2xl bg-card p-1">
        {(["overview", "navigation", "activity"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`min-h-11 flex-1 rounded-xl px-3 text-sm font-semibold capitalize ${tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {key}
          </button>
        ))}
      </div>
      {tab === "navigation" && (
        <section className="rounded-2xl bg-card p-4">
          <h2 className="mb-3 font-semibold">Navigation</h2>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} className="flex min-h-11 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      )}
      {tab === "overview" && (
        <>
          <section className="rounded-3xl bg-primary p-6 text-primary-foreground">
            <p className="text-sm font-semibold opacity-80">Balance</p>
            <p className="text-5xl font-extrabold">{formatBucks(w?.balance ?? 0).replace(" Bucks", "")}</p>
            <p className="text-sm opacity-80">Bucks</p>
          </section>
          <section className="flex items-center gap-3 rounded-2xl bg-card p-4">
            <Flame className="size-8 text-primary" />
            <div className="flex-1">
              <p className="font-semibold">{w?.streak ?? 0}-day streak</p>
              <p className="text-sm text-muted-foreground">{w?.claimedToday ? "Come back tomorrow to keep it going." : "Claim today. Miss a day and it resets."}</p>
            </div>
            <Button disabled={w?.claimedToday} onClick={() => void claimStreak().then((r) => { toast.success(`Day ${r.streak}! +${formatBucks(r.reward + r.bonus)}`); refresh(); }).catch((e) => toast.error(errText(e)))}>
              {w?.claimedToday ? "Claimed" : "Claim"}
            </Button>
          </section>
          <Button variant="outline" onClick={() => void useStreakRestore().then(() => { toast.success("Streak protected. Claim it today."); refresh(); }).catch((e) => toast.error(errText(e)))}>
            Use streak restore
          </Button>
          <AdCard done={Boolean(w?.adDone)} onDone={refresh} />
          <SendBucks onDone={refresh} />
          <section className="space-y-3 rounded-2xl bg-card p-4">
            <h2 className="font-semibold">Buy Bucks</h2>
            <div className="grid grid-cols-2 gap-2">
              {PACKS.map((pack) => (
                <a key={pack.bucks} href={waLink(pack.bucks, pack.naira)} target="_blank" rel="noreferrer" className="rounded-xl border border-border p-3 text-center hover:border-primary">
                  <p className="font-bold">{formatBucks(pack.bucks)}</p>
                  <p className="text-xs text-muted-foreground">₦{pack.naira.toLocaleString("en-NG")}</p>
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Pay on WhatsApp {WHATSAPP_DISPLAY}. An admin will credit your wallet.</p>
          </section>
          <section className="rounded-2xl bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 font-semibold"><Trophy className="size-4 text-primary" /> Leaderboard</h2>
            <div className="space-y-2">
              {board.data?.map((row, i) => (
                <div key={row.username} className="flex items-center gap-2">
                  <span className="w-6 text-sm font-bold text-muted-foreground">{i + 1}</span>
                  <Avatar photo={row.photo} emoji={row.avatar_emoji} className="size-8" />
                  <span className="flex-1 truncate text-sm font-semibold">@{row.username}</span>
                  <span className="text-sm font-bold text-primary">{Number(row.balance).toLocaleString("en-NG")}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      {tab === "activity" && (
        <section className="space-y-2 rounded-2xl bg-card p-4">
          <h2 className="mb-2 font-semibold">History</h2>
          {tx.data?.map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-2 border-b border-border py-2 text-sm last:border-0">
              <span className="min-w-0 flex-1 truncate">{row.note}</span>
              <span className={row.amount >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>
                {row.amount >= 0 ? "+" : ""}{row.amount.toLocaleString("en-NG")}
              </span>
            </div>
          ))}
          {tx.data?.length === 0 && <p className="text-sm text-muted-foreground">Nothing yet.</p>}
        </section>
      )}
    </div>
  );
}

function AdCard({ done, onDone }: { done: boolean; onDone: () => void }) {
  const [site, setSite] = useState<PortfolioSite | null>(null);
  const [secs, setSecs] = useState(15);
  const [askClose, setAskClose] = useState(false);
  useEffect(() => {
    if (!site || secs <= 0) return;
    const timer = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [site, secs]);

  async function start() {
    try {
      const next = await startAd();
      setSite(next);
      setSecs(15);
    } catch (error) {
      toast.error(errText(error));
    }
  }
  async function claim(clicked: boolean) {
    try {
      const result = await claimAd({ data: { clicked } });
      toast.success(`+${formatBucks(result.reward)} from JayTech Digitals`);
      setSite(null);
      onDone();
    } catch (error) {
      toast.error(errText(error));
    }
  }

  if (site) {
    const gradient = AD_GRADIENTS[site.category] ?? AD_GRADIENTS["Business"]!;
    const initial = site.name.slice(0, 1).toUpperCase();
    return (
      <section
        className="fixed inset-0 z-50 flex flex-col justify-end text-white"
        style={{ background: gradient }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-[28vw] font-black leading-none select-none">{initial}</span>
        </div>
        <button type="button" aria-label="Close advert" className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-black/40" onClick={() => setAskClose(true)}>
          <X />
        </button>
        <div className="relative m-4 rounded-3xl bg-black/60 p-5 backdrop-blur-md">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-80">{site.category}</p>
          <h3 className="mt-1 text-2xl font-extrabold">{site.name}</h3>
          <p className="my-2 text-sm opacity-80">{site.blurb}</p>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${((15 - secs) / 15) * 100}%` }} />
          </div>
          <a
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            href={site.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (secs <= 0) void claim(true);
            }}
          >
            Visit site
          </a>
          <div className="mt-3">
            {secs > 0 ? (
              <p className="text-sm text-white/70">Reward unlocks in {secs}s</p>
            ) : (
              <Button variant="secondary" onClick={() => void claim(false)}>
                Claim reward
              </Button>
            )}
          </div>
          {askClose && (
            <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm">
              <p>Close now and you won&apos;t get today&apos;s advert Bucks.</p>
              <div className="mt-2 flex justify-center gap-2">
                <Button variant="secondary" onClick={() => setAskClose(false)}>
                  Keep watching
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSite(null);
                    setAskClose(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-3 rounded-2xl bg-card p-4">
      <Tv className="size-8 text-primary" />
      <div className="flex-1">
        <p className="font-semibold">Daily advert</p>
        <p className="text-sm text-muted-foreground">A random JayTech portfolio site · 50–500 Bucks</p>
      </div>
      <Button disabled={done} onClick={() => void start()}>
        {done ? "Done today" : "Watch"}
      </Button>
    </section>
  );
}

function SendBucks({ onDone }: { onDone: () => void }) {
  const [q, setQ] = useState("");
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const results = useQuery({ queryKey: ["pay-search", q], enabled: q.trim().length >= 2 && !username, queryFn: () => searchPeople({ data: { q } }) });
  return (
    <section className="space-y-3 rounded-2xl bg-card p-4">
      <h2 className="flex items-center gap-2 font-semibold">
        <Send className="size-4 text-primary" /> Send Bucks
      </h2>
      {username ? (
        <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
          <span>To @{username}</span>
          <button type="button" className="font-semibold text-primary" onClick={() => setUsername("")}>
            Change
          </button>
        </div>
      ) : (
        <div>
          <Input placeholder="Search username" value={q} onChange={(e) => setQ(e.target.value)} />
          {results.data?.map((user) => (
            <button key={user.id} type="button" className="block w-full px-2 py-2 text-left text-sm hover:bg-muted" onClick={() => setUsername(user.username)}>
              {user.full_name} <span className="text-muted-foreground">@{user.username}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input inputMode="numeric" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button
          onClick={() => {
            const n = transferAmount(amount);
            if (!username || !n) {
              toast.error("Pick a person and a valid amount.");
              return;
            }
            void transferBucks({ data: { username, amount: n } })
              .then(() => {
                toast.success("Sent");
                setAmount("");
                setUsername("");
                setQ("");
                onDone();
              })
              .catch((e) => toast.error(errText(e)));
          }}
        >
          Send
        </Button>
      </div>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <MessageCircle className="size-3" /> Transfers are instant and secure.
      </p>
    </section>
  );
}
