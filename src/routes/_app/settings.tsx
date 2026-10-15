import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  LogOut,
  Moon,
  Shield,
  Smartphone,
  User,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth/client";
import { PageHeading, ThemeButton, useMe, InstallButton } from "@/components/shell";
import { Avatar, Button } from "@/components/ui";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — JayTalk" }] }),
});

type BlockedPerson = { id: string; name: string; username?: string };

function loadBlocked(): BlockedPerson[] {
  try {
    const raw = localStorage.getItem("jaytalk-blocked-meta");
    if (raw) return JSON.parse(raw) as BlockedPerson[];
  } catch {
    /* ignore */
  }
  // fallback: only ids from older key
  try {
    const ids = JSON.parse(localStorage.getItem("jaytalk-blocked") || "[]") as string[];
    return ids.map((id) => ({ id, name: "Blocked user" }));
  } catch {
    return [];
  }
}

function saveBlocked(list: BlockedPerson[]) {
  localStorage.setItem("jaytalk-blocked-meta", JSON.stringify(list));
  localStorage.setItem("jaytalk-blocked", JSON.stringify(list.map((p) => p.id)));
}

function SettingsPage() {
  const me = useMe();
  const [signingOut, setSigningOut] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [blocked, setBlocked] = useState<BlockedPerson[]>([]);

  useEffect(() => {
    setBlocked(loadBlocked());
  }, []);

  function unblock(id: string) {
    const next = blocked.filter((p) => p.id !== id);
    setBlocked(next);
    saveBlocked(next);
    toast.success("User unblocked");
  }

  const rows = [
    { to: "/profile", label: "Profile", icon: User, hint: "Photo, name, bio" },
    { to: "/avatar", label: "Avatar", icon: User, hint: "3D look & outfits" },
    { to: "/wallet", label: "Bucks & wallet", icon: Wallet, hint: "Balance, ads, transfers" },
  ] as const;

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-8">
      <PageHeading title="Settings" subtitle="Account, privacy, install, and sign out." />

      {me.data && (
        <section className="flex items-center gap-3 rounded-2xl bg-card p-4">
          <Avatar photo={me.data.photo} emoji={me.data.avatarEmoji} className="size-14" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{me.data.fullName}</p>
            <p className="truncate text-sm text-muted-foreground">@{me.data.username}</p>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl bg-card">
        {rows.map((row) => (
          <Link
            key={row.to}
            to={row.to}
            className="flex min-h-14 items-center gap-3 border-b border-border px-4 last:border-0 hover:bg-muted/60"
          >
            <row.icon className="size-5 text-primary" />
            <span className="flex-1">
              <span className="block text-sm font-semibold">{row.label}</span>
              <span className="block text-xs text-muted-foreground">{row.hint}</span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl bg-card">
        <div className="flex min-h-14 items-center gap-3 border-b border-border px-4">
          <Moon className="size-5 text-primary" />
          <span className="flex-1 text-sm font-semibold">Appearance</span>
          <ThemeButton />
        </div>
        <div className="flex min-h-14 items-center gap-3 border-b border-border px-4 text-sm text-muted-foreground">
          <Bell className="size-5 text-primary" />
          <span className="flex-1 font-semibold text-foreground">Notifications</span>
          <span className="text-xs">Coming soon</span>
        </div>

        <button
          type="button"
          className="flex min-h-14 w-full items-center gap-3 border-b border-border px-4 text-left hover:bg-muted/60"
          onClick={() => setPrivacyOpen((v) => !v)}
        >
          <Shield className="size-5 text-primary" />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-foreground">Privacy</span>
            <span className="block text-xs text-muted-foreground">
              Blocked users · more options later
            </span>
          </span>
          <ChevronRight
            className={`size-4 text-muted-foreground transition ${privacyOpen ? "rotate-90" : ""}`}
          />
        </button>

        {privacyOpen && (
          <div className="space-y-2 border-b border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Blocked users
            </p>
            {blocked.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No one blocked. Block people from a chat profile sheet.
              </p>
            ) : (
              blocked.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-card px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    {p.username && (
                      <p className="truncate text-xs text-muted-foreground">@{p.username}</p>
                    )}
                  </div>
                  <Button variant="outline" className="shrink-0 px-3" onClick={() => unblock(p.id)}>
                    Unblock
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex min-h-14 items-center gap-3 px-4">
          <Smartphone className="size-5 text-primary" />
          <span className="flex-1 text-sm font-semibold">Install app</span>
          <InstallButton />
        </div>
      </section>

      <Button
        variant="outline"
        className="w-full border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
        disabled={signingOut}
        onClick={() => {
          setSigningOut(true);
          void signOut().catch(() => setSigningOut(false));
        }}
      >
        <LogOut className="size-4" /> {signingOut ? "Signing out…" : "Log out"}
      </Button>
    </div>
  );
}
