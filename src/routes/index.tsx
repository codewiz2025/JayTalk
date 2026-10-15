import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowUpRight, Heart, MessageCircle, Send, Users } from "lucide-react";
import friends from "@/assets/jaytalk-friends.jpg";
import community from "@/assets/jaytalk-community.jpg";
import { Brand, InstallButton, ThemeButton } from "@/components/shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "JayTalk — Connect. Share. Talk." },
      { name: "description", content: "JayTalk is your social space for conversations, friends, calls and everyday moments." },
    ],
  }),
});

const features = [
  { icon: MessageCircle, title: "Chat", copy: "Private messages, groups, and Jitsi calls." },
  { icon: Send, title: "Share", copy: "Moods for a day. Videos once you own a channel." },
  { icon: Users, title: "Make friends", copy: "Find people, follow channels, and talk." },
  { icon: Heart, title: "Bucks", copy: "Earn from likes, comments, and follows. Spend in the store." },
];

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/chat" />;
  return (
    <div>
      <header className="app-topbar">
        <Brand />
        <div className="flex items-center gap-2">
          <ThemeButton />
          <InstallButton />
          {!isPending && (user ? (
            <Link to="/chat" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Open JayTalk</Link>
          ) : (
            <Link to="/login" className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold">Log in</Link>
          ))}
        </div>
      </header>
      <main>
        <section className="landing-hero">
          <img src={friends} width={1536} height={1024} alt="Friends sharing a moment over a phone" />
          <div className="landing-copy">
            <p className="text-sm font-semibold text-primary">Welcome to JayTalk</p>
            <h1 className="mt-3 max-w-xl text-5xl font-extrabold leading-tight sm:text-6xl">Connect.<br />Share. <span className="text-primary">Talk.</span></h1>
            <p className="mt-5 max-w-sm text-sm leading-7">Your people. Your moments. Your space. Chat, make friends, and earn JayTalk Bucks along the way.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Get started <ArrowUpRight className="size-4" /></Link>
              <Link to="/chat" className="inline-flex min-h-11 items-center rounded-xl border border-border bg-card px-5 text-sm font-semibold">Open chat</Link>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><feature.icon className="size-5" /></div>
              <h2 className="mt-3 text-sm font-bold">{feature.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{feature.copy}</p>
            </div>
          ))}
        </section>
        <section className="mx-auto grid max-w-6xl items-center gap-6 px-6 pb-12 md:grid-cols-2">
          <img src={community} alt="People together at a bright gathering" className="h-72 w-full rounded-2xl object-cover" />
          <div>
            <h2 className="text-3xl font-extrabold">A little conversation. A lot of connection.</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Groups have a built-in Jitsi room. For You posts need a channel you buy with Bucks. Likes, comments, and new followers pay the creator. Dislikes and unfollows take Bucks back.</p>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl justify-between border-t border-border px-6 py-5 text-xs text-muted-foreground">
        <span>JayTalk · Made for connection</span>
        <a href="https://jaytech.online" target="_blank" rel="noreferrer">JayTech Digitals</a>
      </footer>
    </div>
  );
}
