import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagesSquare, Phone, Send, Video } from "lucide-react";
import { toast } from "sonner";
import { CallFrame } from "@/components/jitsi";
import { PageHeading } from "@/components/shell";
import { Avatar, Button, Input, errText } from "@/components/ui";
import { createGroup, getGroup, getTyping, listFriends, listGroups, sendGroupMessage, setTyping } from "@/lib/jaytalk-api";

export const Route = createFileRoute("/_app/groups")({
  component: GroupsPage,
  head: () => ({ meta: [{ title: "Groups — JayTalk" }] }),
});

function GroupsPage() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const groups = useQuery({ queryKey: ["groups"], queryFn: () => listGroups() });
  const friends = useQuery({ queryKey: ["friends"], queryFn: () => listFriends() });
  const detail = useQuery({ queryKey: ["group", active], enabled: Boolean(active), queryFn: () => getGroup({ data: { groupId: active! } }), refetchInterval: 3000 });
  const typing = useQuery({
    queryKey: ["gtyping", active],
    enabled: Boolean(active),
    queryFn: () => getTyping({ data: { key: `group:${active}` } }),
    refetchInterval: 2000,
  });

  async function makeGroup(event: React.FormEvent) {
    event.preventDefault();
    try {
      const created = await createGroup({ data: { name, memberIds: picked } });
      setName("");
      setPicked([]);
      setActive(created.id);
      toast.success("Group created");
      await qc.invalidateQueries({ queryKey: ["groups"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!active || !text.trim()) return;
    try {
      await sendGroupMessage({ data: { groupId: active, body: text } });
      setText("");
      await qc.invalidateQueries({ queryKey: ["group", active] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  const accepted = friends.data?.filter((row) => row.status === "accepted" && row.person) ?? [];

  return (
    <div>
      <PageHeading title="Groups" subtitle="Start a group, add friends, and jump into a Jitsi call together." />
      <div className="chat-layout">
        <aside className="chat-people space-y-4">
          <Button type="button" className="w-full" onClick={() => setShowCreate(true)}>Create group</Button>
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center" onClick={() => setShowCreate(false)}>
              <form
                className="w-full max-w-md space-y-3 rounded-3xl bg-card p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => { void makeGroup(e).then(() => setShowCreate(false)); }}
              >
                <h2 className="text-lg font-bold">New group</h2>
                <Input aria-label="Group name" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} required />
                <p className="text-xs font-semibold text-muted-foreground">Select members</p>
                <div className="max-h-48 space-y-1 overflow-y-auto">
                  {accepted.map((row) => row.person && (
                    <label key={row.person.id} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-muted">
                      <input type="checkbox" checked={picked.includes(row.person.id)} onChange={(e) => setPicked((current) => e.target.checked ? [...current, row.person!.id] : current.filter((id) => id !== row.person!.id))} />
                      <Avatar photo={row.person.photo} emoji={row.person.avatar_emoji} className="size-8" />
                      @{row.person.username}
                    </label>
                  ))}
                  {accepted.length === 0 && <p className="text-xs text-muted-foreground">Add friends first.</p>}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Create</Button>
                </div>
              </form>
            </div>
          )}
          <div className="space-y-1">
            {groups.data?.map((group) => (
              <button key={group.id} type="button" className={`w-full rounded-xl px-3 py-2 text-left ${active === group.id ? "bg-secondary" : "hover:bg-muted"}`} onClick={() => setActive(group.id)}>
                <span className="block text-sm font-semibold">{group.name}</span>
                <span className="text-xs text-muted-foreground">{group.members} members</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="chat-window">
          {detail.data ? (
            <>
              <header className="flex items-center gap-2 border-b border-border p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{detail.data.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {typing.data?.length ? `${typing.data.join(", ")} typing…` : detail.data.members.map((m) => `@${m.username}`).join(" ")}
                  </p>
                </div>
                <Button variant="ghost" className="size-11 px-0" aria-label="Group voice call" onClick={() => setRoom(detail.data.call_room)}><Phone className="size-4" /></Button>
                <Button variant="ghost" className="size-11 px-0" aria-label="Group video call" onClick={() => setRoom(detail.data.call_room)}><Video className="size-4" /></Button>
              </header>
              <div className="flex max-h-[480px] flex-1 flex-col gap-2 overflow-y-auto p-4">
                {detail.data.messages.map((m) => (
                  <div key={m.id} className="max-w-[85%] self-start rounded-2xl bg-muted px-3 py-2 text-sm">
                    <p className="text-xs font-semibold text-primary">@{m.username}</p>
                    {m.body.startsWith("data:image/") ? <img src={m.body} alt="" className="mt-1 max-h-60 rounded-xl" /> : m.body}
                  </div>
                ))}
              </div>
              <form className="flex gap-2 border-t border-border p-3" onSubmit={send}>
                <Input aria-label="Group message" value={text} maxLength={2000} onChange={(e) => { setText(e.target.value); if (active) void setTyping({ data: { key: `group:${active}` } }); }} placeholder="Message the group" />
                <Button type="submit" className="px-3" aria-label="Send" disabled={!text.trim()}><Send className="size-4" /></Button>
              </form>
            </>
          ) : (
            <div className="m-auto px-6 py-16 text-center text-muted-foreground">
              <MessagesSquare className="mx-auto size-8 text-primary" />
              <p className="mt-3 font-semibold text-foreground">Create a group to talk together</p>
            </div>
          )}
        </section>
      </div>
      {room && <CallFrame room={room} onClose={() => setRoom(null)} />}
    </div>
  );
}
