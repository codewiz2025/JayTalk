import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MessageCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeading, useMe } from "@/components/shell";
import { Avatar, Button, Input, errText } from "@/components/ui";
import { acceptFriend, listFriends, requestFriend, searchPeople } from "@/lib/jaytalk-api";

export const Route = createFileRoute("/_app/friends")({
  component: FriendsPage,
  head: () => ({ meta: [{ title: "Friends — JayTalk" }] }),
});

function FriendsPage() {
  const qc = useQueryClient();
  const me = useMe();
  const myId = me.data?.userId;
  const [q, setQ] = useState("");
  const friends = useQuery({ queryKey: ["friends"], queryFn: () => listFriends() });
  const found = useQuery({
    queryKey: ["people", q],
    enabled: q.trim().length >= 2,
    queryFn: () => searchPeople({ data: { q: q.trim() } }),
  });

  async function add(userId: string) {
    try {
      await requestFriend({ data: { userId } });
      toast.success("Friend request sent");
      await qc.invalidateQueries({ queryKey: ["friends"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  async function accept(id: string) {
    try {
      await acceptFriend({ data: { id } });
      toast.success("You are now friends");
      await qc.invalidateQueries({ queryKey: ["friends"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeading title="Friends" subtitle="Find your people." />
      <Input
        aria-label="Search people"
        placeholder="Search name or @username"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="mt-3 space-y-2">
        {found.data?.map((person) => (
          <div key={person.id} className="flex items-center gap-3 rounded-xl bg-muted p-2">
            <Avatar photo={person.photo} emoji={person.avatar_emoji} className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{person.full_name}</p>
              <p className="text-xs text-muted-foreground">@{person.username}</p>
            </div>
            <Button variant="secondary" className="px-3" onClick={() => void add(person.id)}>
              Add
            </Button>
          </div>
        ))}
      </div>
      <h2 className="mt-8 mb-3 font-bold">Your circle</h2>
      <div className="space-y-2">
        {friends.data?.map((row) => {
          const isIncoming = row.status === "pending" && myId && row.addressee === myId;
          const isOutgoing = row.status === "pending" && myId && row.requester === myId;
          return (
            <div key={row.id} className="flex items-center gap-3 border-b border-border py-3">
              <Avatar photo={row.person?.photo} emoji={row.person?.avatar_emoji} className="size-10" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{row.person?.full_name ?? "Member"}</p>
                <p className="text-xs text-muted-foreground">
                  {row.status === "accepted"
                    ? "Friends"
                    : isIncoming
                      ? "Wants to be your friend"
                      : isOutgoing
                        ? "Request sent"
                        : row.status}
                </p>
              </div>
              {isIncoming ? (
                <Button className="px-3" onClick={() => void accept(row.id)}>
                  <Check className="size-4" /> Accept
                </Button>
              ) : row.status === "accepted" ? (
                <Link
                  to="/chat"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-3 text-sm font-semibold"
                >
                  <MessageCircle className="size-4" /> Chat
                </Link>
              ) : (
                <UserPlus className="size-4 text-muted-foreground" />
              )}
            </div>
          );
        })}
        {friends.data?.length === 0 && (
          <p className="text-sm text-muted-foreground">Your circle is waiting to grow.</p>
        )}
      </div>
    </div>
  );
}
