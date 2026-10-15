import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeading, useMe } from "@/components/shell";
import { Avatar, Button, Field, Input, errText } from "@/components/ui";
import { ECONOMY, formatBucks, usernameOk } from "@/lib/jaytalk";
import { buyChannel, checkUsername, clearPhoto, createProfile, finishSignup, setPhoto, updateProfile } from "@/lib/jaytalk-api";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — JayTalk" }] }),
});

function ProfilePage() {
  const me = useMe();
  const account = useCurrentUser();
  const qc = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [hint, setHint] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!me.data) return;
    setFullName(me.data.fullName);
    setUsername(me.data.username);
    setBio(me.data.bio);
  }, [me.data]);

  useEffect(() => {
    if (!username || (me.data && username === me.data.username)) {
      setHint(me.data ? "This is your username." : "");
      return;
    }
    if (!usernameOk(username)) {
      setHint("Use 3–20 letters, numbers, or underscores.");
      return;
    }
    const timer = window.setTimeout(() => {
      void checkUsername({ data: { username } }).then((r) => setHint(r.reason ?? "")).catch((e) => setHint(errText(e)));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [username, me.data]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (!me.data) {
        if (code.trim()) await finishSignup({ data: { code: code.trim() } });
        else await createProfile({ data: { username: username.trim(), fullName: fullName.trim() } });
      } else await updateProfile({ data: { username: username.trim(), fullName: fullName.trim(), bio } });
      toast.success(me.data ? "Profile saved" : "Welcome to JayTalk");
      await qc.invalidateQueries({ queryKey: ["me"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  async function onPhoto(file: File) {
    try {
      const dataUrl = await resize(file);
      await setPhoto({ data: { dataUrl } });
      toast.success(`Photo updated · −${formatBucks(ECONOMY.photo)}`);
      await qc.invalidateQueries({ queryKey: ["me"] });
    } catch (error) {
      toast.error(errText(error));
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeading title="Profile" subtitle={me.data ? `@${me.data.username}` : "Choose a unique username to finish signing up."} />
      <div className="mb-6 flex items-center gap-4">
        <Avatar photo={me.data?.photo} emoji={me.data?.avatarEmoji} className="size-20 text-3xl" />
        <div>
          <p className="font-semibold">{me.data?.fullName || account?.displayName || "New member"}</p>
          <p className="text-sm text-muted-foreground">{me.data ? `${formatBucks(me.data.balance)} · ${me.data.hasChannel ? "Channel owner" : "No channel yet"}` : account?.primaryEmail}</p>
        </div>
      </div>
      <form className="space-y-4" onSubmit={save}>
        <Field label="Full name"><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} /></Field>
        <Field label="Username" hint={hint}><Input required value={username} onChange={(e) => setUsername(e.target.value)} /></Field>
        {me.data && <Field label="Bio"><Input maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} /></Field>}
        {!me.data && (
          <Field label="Confirmation code" hint="Only needed if you already received a sign-up code.">
            <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} />
          </Field>
        )}
        <Button type="submit">Save profile</Button>
      </form>
      {me.data && (
        <section className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-bold">Photo and avatar</h2>
          <p className="text-sm text-muted-foreground">A profile photo costs {formatBucks(ECONOMY.photo)}. Avatars are bought in the store and show when you don't have a photo.</p>
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Upload photo · {formatBucks(ECONOMY.photo)}
            <input className="sr-only" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void onPhoto(file); }} />
          </label>
          {me.data.photo && <Button variant="outline" onClick={() => void clearPhoto().then(() => qc.invalidateQueries({ queryKey: ["me"] }))}>Remove photo</Button>}
          <p className="text-sm">Avatar in use: <span className="text-2xl">{me.data.avatarEmoji}</span></p>
          {!me.data.hasChannel && (
            <Button onClick={() => void buyChannel().then(() => { toast.success("Channel unlocked"); return qc.invalidateQueries({ queryKey: ["me"] }); }).catch((e) => toast.error(errText(e)))}>
              Buy a channel · {formatBucks(ECONOMY.channel)}
            </Button>
          )}
          <Link to="/admin" className="block text-sm font-semibold text-primary">Admin: credit bought Bucks</Link>
        </section>
      )}
    </div>
  );
}

function resize(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 256 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("Couldn't read that photo."));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
