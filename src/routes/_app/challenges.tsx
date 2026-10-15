import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, MessageCircle, Play } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/shell";
import { Button, errText } from "@/components/ui";
import { formatBucks } from "@/lib/jaytalk";
import { challengeStatus, claimChallenge } from "@/lib/jaytalk-api";

export const Route = createFileRoute("/_app/challenges")({
  component: ChallengesPage,
  head: () => ({ meta: [{ title: "Challenges — JayTalk" }] }),
});

const items = [
  { key: "chat" as const, title: "Send 3 messages", need: 3, reward: 150, icon: MessageCircle },
  { key: "post" as const, title: "Post a video or mood", need: 1, reward: 200, icon: Play },
  { key: "view" as const, title: "Watch 5 posts", need: 5, reward: 150, icon: Eye },
];

function ChallengesPage() {
  const qc = useQueryClient();
  const status = useQuery({ queryKey: ["challenges"], queryFn: () => challengeStatus() });
  return (
    <div>
      <PageHeading title="Daily challenges" subtitle="New goals every day at midnight, Lagos time." />
      <div className="grid max-w-3xl gap-3">
        {items.map((item) => {
          const have = Math.min(Number(status.data?.[item.key] ?? 0), item.need);
          const claimed = status.data?.claimed.includes(item.key);
          const done = have >= item.need;
          return (
            <article key={item.key} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><item.icon className="size-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{have}/{item.need} · {formatBucks(item.reward)}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${(have / item.need) * 100}%` }} /></div>
              </div>
              <Button disabled={!done || claimed} onClick={() => void claimChallenge({ data: { key: item.key } }).then((r) => { toast.success(`+${formatBucks(r.reward)}`); return qc.invalidateQueries(); }).catch((e) => toast.error(errText(e)))}>
                {claimed ? "Claimed" : done ? "Claim" : "In progress"}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
