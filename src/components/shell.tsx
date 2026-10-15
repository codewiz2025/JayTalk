import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import {
  CircleUser,
  Download,
  Gamepad2,
  Heart,
  MessageCircle,
  MessagesSquare,
  Moon,
  Play,
  Settings,
  ShoppingBag,
  Sun,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMe } from "@/lib/jaytalk-api";
import { Avatar, Button } from "@/components/ui";

const NAV = [
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/groups", label: "Groups", icon: MessagesSquare },
  { to: "/fyp", label: "For you", icon: Play },
  { to: "/moods", label: "Moods", icon: Heart },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/challenges", label: "Challenges", icon: Trophy },
  { to: "/store", label: "Store", icon: ShoppingBag },
  { to: "/avatar", label: "Avatar", icon: CircleUser },
  { to: "/wallet", label: "Bucks", icon: Wallet },
  { to: "/profile", label: "Profile", icon: CircleUser },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/chat" className="flex min-w-0 items-center gap-2">
      <img
        src="/brand/jaytalk-logo.png"
        width={40}
        height={40}
        alt="JayTalk"
        className="size-10 rounded-xl object-cover shadow-sm"
      />
      <span className="min-w-0">
        <span className="block text-lg font-extrabold leading-none">JayTalk</span>
        {!compact && <span className="block text-xs text-muted-foreground">JayTech Digitals</span>}
      </span>
    </Link>
  );
}

export function ThemeButton() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("jaytalk-theme", next ? "dark" : "light");
    setDark(next);
  }
  return (
    <Button
      variant="ghost"
      className="size-11 px-0"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function InstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  return (
    <Button
      variant="outline"
      className="px-3"
      onClick={() => {
        if (prompt) {
          void prompt.prompt();
          setPrompt(null);
          return;
        }
        window.alert("Use your browser menu to install JayTalk. On iPhone: Share → Add to Home Screen.");
      }}
    >
      <Download className="size-4" /> <span className="hidden sm:inline">Install</span>
    </Button>
  );
}

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };

export function useMe() {
  const { user } = useCurrentUserState();
  return useQuery({
    queryKey: ["me", user?.id],
    enabled: Boolean(user),
    queryFn: () => getMe(),
    retry: 2,
    retryDelay: 1500,
    staleTime: 30_000,
  });
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const me = useMe();
  const isChat = pathname === "/chat" || pathname.startsWith("/chat");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="app-topbar">
        <Brand compact />
        <div className="flex items-center gap-1 sm:gap-2">
          {me.data && (
            <Link
              to="/profile"
              className="flex min-h-11 items-center gap-2 rounded-full py-1 pr-2 pl-1 hover:bg-muted"
            >
              <Avatar photo={me.data.photo} emoji={me.data.avatarEmoji} className="size-9" />
              <span className="hidden max-w-28 truncate text-sm font-semibold sm:inline">
                @{me.data.username}
              </span>
            </Link>
          )}
          <ThemeButton />
          {me.data && (
            <Link
              to="/wallet"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-sm font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
              aria-label="Your Bucks"
            >
              <span className="grid size-5 place-items-center rounded-full bg-amber-400 text-[11px] text-amber-950">
                B
              </span>
              <span>{Number(me.data.balance ?? 0).toLocaleString("en-NG")}</span>
            </Link>
          )}
          <InstallButton />
        </div>
      </header>

      <main className={`app-main-full flex-1 ${isChat ? "app-main-chat" : "px-3 py-4 sm:px-6"}`}>
        {children}
      </main>

      {/* Bottom nav — all breakpoints (matches design mockup) */}
      <nav className="app-bottom-nav" aria-label="Main">
        <div className="app-bottom-nav-inner">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`app-bottom-nav-item ${active ? "active" : ""}`}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">JayTalk</p>
      <h1 className="mt-1 text-3xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}