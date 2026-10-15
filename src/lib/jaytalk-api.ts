import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ECONOMY, PORTFOLIO, lagosDate, lagosDayStart, usernameOk } from "@/lib/jaytalk";
import { sendCodeEmail } from "@/lib/email";

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Check that form and try again.");
  }
  return result.data;
}

const Username = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9_]{3,20}$/, "Use 3–20 letters, numbers, or underscores");
const Email = z.string().trim().toLowerCase().email("Enter a valid email");
const Password = z.string().min(8, "Use at least 8 characters").max(72, "Password is too long");
const Name = z.string().trim().min(2, "Enter your name").max(60);

async function hashCode(purpose: string, email: string, code: string) {
  const data = new TextEncoder().encode(`${purpose}|${email}|${code}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sixDigit() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0]! % 900000;
  return String(100000 + n);
}

async function emailTaken(sql: Sql, email: string) {
  const rows = await sql<{ id: string }>`select id from "user" where lower(email) = ${email} limit 1`;
  return rows.length > 0;
}

async function usernameTaken(sql: Sql, username: string, exceptUserId?: string) {
  const rows = await sql<{ user_id: string }>`
    select user_id from profiles where lower(username) = ${username.toLowerCase()} limit 1
  `;
  return rows.some((row) => row.user_id !== exceptUserId);
}

async function addBucks(sql: Sql, userId: string, delta: number, reason: string) {
  if (!delta) return 0;
  await sql`insert into wallets (user_id, balance) values (${userId}, 0) on conflict (user_id) do nothing`;
  const rows = await sql<{ balance: number }>`select balance from wallets where user_id = ${userId}`;
  const current = Number(rows[0]?.balance ?? 0);
  const next = Math.max(0, current + delta);
  const applied = next - current;
  if (!applied) return 0;
  await sql`update wallets set balance = ${next}, updated_at = now() where user_id = ${userId}`;
  await sql`
    insert into bucks_transactions (id, user_id, amount, reason)
    values (${crypto.randomUUID()}, ${userId}, ${applied}, ${reason})
  `;
  return applied;
}

async function spend(sql: Sql, userId: string, cost: number, reason: string) {
  const rows = await sql<{ balance: number }>`select balance from wallets where user_id = ${userId}`;
  const current = Number(rows[0]?.balance ?? 0);
  if (current < cost) throw new Error("Not enough Bucks.");
  await addBucks(sql, userId, -cost, reason);
}

async function grantWelcome(sql: Sql, userId: string) {
  await sql`insert into wallets (user_id, balance) values (${userId}, 0) on conflict (user_id) do nothing`;
  const existing = await sql`
    select 1 from bucks_transactions where user_id = ${userId} and reason = 'Welcome bonus' limit 1
  `;
  if (!existing.length) await addBucks(sql, userId, ECONOMY.welcome, "Welcome bonus");
}

type ProfileRow = {
  user_id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_emoji: string;
  photo: string | null;
  chat_theme: string;
  wallpaper: string | null;
  has_channel: boolean;
  is_admin: boolean;
  balance: number;
  streak: number;
};

function mapMe(row: ProfileRow) {
  return {
    userId: row.user_id,
    username: row.username,
    fullName: row.full_name,
    bio: row.bio,
    avatarEmoji: row.avatar_emoji,
    photo: row.photo,
    chatTheme: row.chat_theme,
    wallpaper: row.wallpaper,
    hasChannel: row.has_channel,
    isAdmin: row.is_admin,
    balance: Number(row.balance ?? 0),
    streak: Number(row.streak ?? 0),
  };
}

async function loadMe(sql: Sql, userId: string) {
  const rows = await sql<ProfileRow>`
    select p.user_id, p.username, p.full_name, p.bio, p.avatar_emoji, p.photo, p.chat_theme,
           p.wallpaper, p.has_channel, p.is_admin, coalesce(w.balance, 0) as balance, coalesce(w.streak, 0) as streak
    from profiles p
    left join wallets w on w.user_id = p.user_id
    where p.user_id = ${userId}
  `;
  return rows[0] ? mapMe(rows[0]) : null;
}

async function insertProfile(sql: Sql, userId: string, username: string, fullName: string) {
  if (await usernameTaken(sql, username)) throw new Error("That username is taken.");
  await sql`
    insert into profiles (user_id, username, full_name)
    values (${userId}, ${username}, ${fullName})
  `;
  await grantWelcome(sql, userId);
  return loadMe(sql, userId);
}

export const checkUsername = createServerFn({ method: "POST" })
  .validator((data: unknown) => parse(z.object({ username: z.string() }), data))
  .handler(async ({ data }) => {
    const username = data.username.trim();
    if (!usernameOk(username)) {
      return { available: false, reason: "Use 3–20 letters, numbers, or underscores.", suggestions: [] as string[] };
    }
    const sql = await getSql();
    const taken = await usernameTaken(sql, username);
    if (!taken) {
      return { available: true, reason: "Username is available.", suggestions: [] as string[] };
    }
    const base = username.replace(/_+$/, "").slice(0, 16) || "user";
    const candidates = [
      `${base}${Math.floor(Math.random() * 90) + 10}`,
      `${base}_${Math.floor(Math.random() * 90) + 10}`,
      `${base}${new Date().getFullYear().toString().slice(2)}`,
      `the_${base}`,
      `${base}_jt`,
    ];
    const suggestions: string[] = [];
    for (const c of candidates) {
      if (suggestions.length >= 3) break;
      if (!usernameOk(c)) continue;
      if (!(await usernameTaken(sql, c))) suggestions.push(c);
    }
    return {
      available: false,
      reason: "That username is taken.",
      suggestions,
    };
  });

export const resolveUsernameForLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) => parse(z.object({ username: z.string().min(1) }), data))
  .handler(async ({ data }) => {
    const username = data.username.trim().replace(/^@/, "");
    const sql = await getSql();
    const rows = await sql<{ email: string }>`
      select u.email
      from profiles p
      join "user" u on u.id = p.user_id
      where lower(p.username) = ${username.toLowerCase()}
      limit 1
    `;
    if (!rows[0]?.email) throw new Error("No account with that username.");
    return { email: rows[0].email };
  });


export const requestSignupCode = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    parse(z.object({ email: Email, username: Username, fullName: Name }), data),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (await emailTaken(sql, data.email)) {
      throw new Error("An account with this email already exists. Sign in instead.");
    }
    if (await usernameTaken(sql, data.username)) throw new Error("That username is taken.");
    const code = sixDigit();
    const codeHash = await hashCode("signup", data.email, code);
    await sql`delete from auth_codes where email = ${data.email} and purpose = 'signup' and used_at is null`;
    await sql`
      insert into auth_codes (id, email, purpose, code_hash, payload, expires_at)
      values (
        ${crypto.randomUUID()},
        ${data.email},
        'signup',
        ${codeHash},
        ${JSON.stringify({ username: data.username, fullName: data.fullName })},
        now() + interval '15 minutes'
      )
    `;
    await sendCodeEmail(data.email, "signup", code);
    return { sent: true as const };
  });

export const requestResetCode = createServerFn({ method: "POST" })
  .validator((data: unknown) => parse(z.object({ email: Email }), data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (!(await emailTaken(sql, data.email))) return { found: false as const, sent: false as const };
    const code = sixDigit();
    const codeHash = await hashCode("reset", data.email, code);
    await sql`delete from auth_codes where email = ${data.email} and purpose = 'reset' and used_at is null`;
    await sql`
      insert into auth_codes (id, email, purpose, code_hash, payload, expires_at)
      values (${crypto.randomUUID()}, ${data.email}, 'reset', ${codeHash}, null, now() + interval '15 minutes')
    `;
    await sendCodeEmail(data.email, "reset", code);
    return { found: true as const, sent: true as const };
  });

export const resetPassword = createServerFn({ method: "POST" })
  .validator((data: unknown) => parse(z.object({ email: Email, code: z.string().trim(), password: Password }), data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const codeHash = await hashCode("reset", data.email, data.code);
    const codes = await sql<{ id: string }>`
      select id from auth_codes
      where email = ${data.email} and purpose = 'reset' and used_at is null
        and code_hash = ${codeHash} and expires_at > now()
      order by created_at desc limit 1
    `;
    if (!codes[0]) throw new Error("That reset code is wrong or expired.");
    const users = await sql<{ id: string }>`select id from "user" where lower(email) = ${data.email} limit 1`;
    if (!users[0]) throw new Error("No account uses that email.");
    const { hashPassword } = await import("better-auth/crypto");
    const hashed = await hashPassword(data.password);
    const updated = await sql`
      update "account" set "password" = ${hashed}, "updatedAt" = now()
      where "userId" = ${users[0].id} and "providerId" = 'credential'
      returning id
    `;
    if (!updated.length) throw new Error("This account does not use a password. Sign in another way.");
    await sql`update auth_codes set used_at = now() where id = ${codes[0].id}`;
    return { ok: true };
  });

export const finishSignup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ code: z.string().trim() }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const existing = await loadMe(sql, context.userId);
    if (existing) return existing;
    const users = await sql<{ email: string; name: string }>`
      select email, name from "user" where id = ${context.userId} limit 1
    `;
    const email = users[0]?.email?.toLowerCase();
    if (!email) throw new Error("Sign in again to finish your account.");
    const codeHash = await hashCode("signup", email, data.code);
    const codes = await sql<{ id: string; payload: string | null }>`
      select id, payload from auth_codes
      where email = ${email} and purpose = 'signup' and used_at is null
        and code_hash = ${codeHash} and expires_at > now()
      order by created_at desc limit 1
    `;
    if (!codes[0]) throw new Error("That confirmation code is wrong or expired.");
    const payload = JSON.parse(codes[0].payload || "{}") as { username?: string; fullName?: string };
    const username = payload.username ?? "";
    const fullName = payload.fullName || users[0]?.name || "JayTalk member";
    if (!usernameOk(username)) throw new Error("Pick a valid username and request a new code.");
    const me = await insertProfile(sql, context.userId, username, fullName);
    await sql`update auth_codes set used_at = now() where id = ${codes[0].id}`;
    return me;
  });

export const createProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ username: Username, fullName: Name }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const existing = await loadMe(sql, context.userId);
    if (existing) return existing;
    const users = await sql<{ email: string }>`select email from "user" where id = ${context.userId} limit 1`;
    const email = users[0]?.email?.toLowerCase();
    if (email) {
      const pending = await sql`
        select 1 from auth_codes
        where email = ${email} and purpose = 'signup' and used_at is null and expires_at > now()
        limit 1
      `;
      if (pending.length) throw new Error("Enter the confirmation code from sign-up to finish this account.");
    }
    return insertProfile(sql, context.userId, data.username, data.fullName);
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    let me = await loadMe(sql, context.userId);
    if (me) return me;

    // First login after email sign-up sometimes has a user row but no profile yet.
    // Auto-create a profile so the app does not sit on "Loading your profile…".
    const users = await sql<{ email: string; name: string | null }>`
      select email, name from "user" where id = ${context.userId} limit 1
    `;
    const u = users[0];
    if (!u) return null;

    const raw = (u.name || u.email?.split("@")[0] || "user")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 16) || "user";
    let username = raw.length >= 3 ? raw : `user${Math.floor(Math.random() * 900 + 100)}`;
    let n = 0;
    while (await usernameTaken(sql, username)) {
      n += 1;
      username = `${raw.slice(0, 12)}${n}`;
      if (n > 50) {
        username = `user${Date.now().toString(36).slice(-8)}`;
        break;
      }
    }
    const fullName = (u.name || username).trim() || username;
    try {
      me = await insertProfile(sql, context.userId, username, fullName);
    } catch (err) {
      // Race: another request may have created the profile.
      me = await loadMe(sql, context.userId);
      if (!me) throw err;
    }
    return me;
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    parse(z.object({ username: Username, fullName: Name, bio: z.string().max(160) }), data),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    if (!(await loadMe(sql, context.userId))) throw new Error("Finish your profile first.");
    if (await usernameTaken(sql, data.username, context.userId)) throw new Error("That username is taken.");
    await sql`
      update profiles set username = ${data.username}, full_name = ${data.fullName.trim()},
        bio = ${data.bio.trim()}, updated_at = now()
      where user_id = ${context.userId}
    `;
    return loadMe(sql, context.userId);
  });

export const setPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ dataUrl: z.string().max(220000) }), data))
  .handler(async ({ data, context }) => {
    if (!data.dataUrl.startsWith("data:image/")) throw new Error("Choose a photo.");
    const sql = await getSql();
    const me = await loadMe(sql, context.userId);
    if (!me) throw new Error("Finish your profile first.");
    await spend(sql, context.userId, ECONOMY.photo, "Profile photo");
    await sql`update profiles set photo = ${data.dataUrl}, updated_at = now() where user_id = ${context.userId}`;
    return loadMe(sql, context.userId);
  });

export const clearPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update profiles set photo = null, updated_at = now() where user_id = ${context.userId}`;
    return loadMe(sql, context.userId);
  });

type Person = {
  id: string;
  username: string;
  full_name: string;
  avatar_emoji: string;
  photo: string | null;
  has_channel: boolean;
};

async function peopleByIds(sql: Sql, ids: string[]) {
  if (!ids.length) return [] as Person[];
  const slots = ids.map((_, i) => `$${i + 1}`).join(", ");
  return sql.query<Person>(
    `select user_id as id, username, full_name, avatar_emoji, photo, has_channel from profiles where user_id in (${slots})`,
    ids,
  );
}

export const searchPeople = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ q: z.string().trim().min(2).max(40) }), data))
  .handler(async ({ data, context }) => {
    const q = `%${data.q.toLowerCase().replace(/[%_]/g, "")}%`;
    const sql = await getSql();
    return sql<Person>`
      select user_id as id, username, full_name, avatar_emoji, photo, has_channel
      from profiles
      where user_id <> ${context.userId}
        and (lower(username) like ${q} or lower(full_name) like ${q})
      order by username
      limit 12
    `;
  });

export const listFriends = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; requester: string; addressee: string; status: string }>`
      select id, requester, addressee, status from friendships
      where requester = ${context.userId} or addressee = ${context.userId}
      order by created_at desc
    `;
    const ids = [...new Set(rows.flatMap((row) => [row.requester, row.addressee]))];
    const people = await peopleByIds(sql, ids);
    return rows.map((row) => ({
      ...row,
      person: people.find((p) => p.id === (row.requester === context.userId ? row.addressee : row.requester)) ?? null,
    }));
  });

export const requestFriend = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ userId: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    if (data.userId === context.userId) throw new Error("You can't add yourself.");
    const sql = await getSql();
    const existing = await sql`
      select id from friendships
      where (requester = ${context.userId} and addressee = ${data.userId})
         or (requester = ${data.userId} and addressee = ${context.userId})
      limit 1
    `;
    if (existing.length) throw new Error("You already have a request with this person.");
    await sql`
      insert into friendships (id, requester, addressee, status)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.userId}, 'pending')
    `;
    return { ok: true };
  });

export const acceptFriend = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ id: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const rows = await sql`
      update friendships set status = 'accepted'
      where id = ${data.id} and addressee = ${context.userId} and status = 'pending'
      returning id
    `;
    if (!rows.length) throw new Error("That request isn't yours to accept.");
    return { ok: true };
  });

export const listConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const messages = await sql<{
      sender_id: string;
      recipient_id: string;
      body: string;
      read_at: string | null;
      created_at: string;
    }>`
      select sender_id, recipient_id, body, read_at::text, created_at::text
      from messages
      where sender_id = ${context.userId} or recipient_id = ${context.userId}
      order by created_at desc
      limit 400
    `;
    const map = new Map<string, { last: string; at: string; unread: number }>();
    for (const message of messages) {
      const other = message.sender_id === context.userId ? message.recipient_id : message.sender_id;
      const unread = message.recipient_id === context.userId && !message.read_at ? 1 : 0;
      const current = map.get(other);
      if (!current) map.set(other, { last: message.body, at: message.created_at, unread });
      else current.unread += unread;
    }
    const people = await peopleByIds(sql, [...map.keys()]);
    return [...map.entries()].map(([id, meta]) => ({
      person: people.find((p) => p.id === id) ?? null,
      last: meta.last.startsWith("data:image/") ? "Photo" : meta.last.slice(0, 80),
      at: meta.at,
      unread: meta.unread,
    }));
  });

export const listMessages = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ userId: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    return sql<{ id: string; sender_id: string; body: string; read_at: string | null; created_at: string }>`
      select id, sender_id, body, read_at::text, created_at::text
      from messages
      where (sender_id = ${context.userId} and recipient_id = ${data.userId})
         or (sender_id = ${data.userId} and recipient_id = ${context.userId})
      order by created_at asc
      limit 200
    `;
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ userId: z.string().min(1), body: z.string().min(1).max(500000) }), data))
  .handler(async ({ data, context }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Write a message first.");
    if (body.startsWith("data:") && !body.startsWith("data:image/")) throw new Error("That file isn't supported.");
    if (!body.startsWith("data:image/") && body.length > 2000) throw new Error("Message is too long.");
    const sql = await getSql();
    const other = await sql`select user_id from profiles where user_id = ${data.userId}`;
    if (!other.length) throw new Error("That person isn't on JayTalk.");
    await sql`
      insert into messages (id, sender_id, recipient_id, body)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.userId}, ${body})
    `;
    return { ok: true };
  });

export const markRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ userId: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      update messages set read_at = now()
      where sender_id = ${data.userId} and recipient_id = ${context.userId} and read_at is null
    `;
    return { ok: true };
  });

export const setTyping = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ key: z.string().min(1).max(80) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into typing_status (user_id, peer_key, updated_at)
      values (${context.userId}, ${data.key}, now())
      on conflict (user_id, peer_key) do update set updated_at = now()
    `;
    return { ok: true };
  });

export const getTyping = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ key: z.string().min(1).max(80) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const rows = await sql<{ username: string }>`
      select p.username from typing_status t
      join profiles p on p.user_id = t.user_id
      where t.peer_key = ${data.key} and t.user_id <> ${context.userId}
        and t.updated_at > now() - interval '4 seconds'
    `;
    return rows.map((row) => row.username);
  });

export const listGroups = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ id: string; name: string; call_room: string; owner_id: string; members: number }>`
      select g.id, g.name, g.call_room, g.owner_id, count(m.user_id)::int as members
      from chat_groups g
      join group_members mine on mine.group_id = g.id and mine.user_id = ${context.userId}
      join group_members m on m.group_id = g.id
      group by g.id
      order by g.created_at desc
    `;
  });

export const createGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    parse(z.object({ name: z.string().trim().min(2, "Name the group").max(40), memberIds: z.array(z.string()).max(20) }), data),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    if (!(await loadMe(sql, context.userId))) throw new Error("Finish your profile first.");
    const id = crypto.randomUUID();
    const room = `JayTalk${id.replace(/-/g, "")}`;
    await sql`
      insert into chat_groups (id, name, owner_id, call_room)
      values (${id}, ${data.name}, ${context.userId}, ${room})
    `;
    for (const member of new Set([context.userId, ...data.memberIds])) {
      const ok = await sql`select user_id from profiles where user_id = ${member}`;
      if (ok.length) await sql`insert into group_members (group_id, user_id) values (${id}, ${member}) on conflict do nothing`;
    }
    return { id, callRoom: room };
  });

async function assertMember(sql: Sql, groupId: string, userId: string) {
  const rows = await sql<{ owner_id: string; name: string; call_room: string }>`
    select g.owner_id, g.name, g.call_room
    from chat_groups g
    join group_members m on m.group_id = g.id and m.user_id = ${userId}
    where g.id = ${groupId}
  `;
  if (!rows[0]) throw new Error("You aren't in that group.");
  return rows[0];
}

export const getGroup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ groupId: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const group = await assertMember(sql, data.groupId, context.userId);
    const members = await sql<Person>`
      select p.user_id as id, p.username, p.full_name, p.avatar_emoji, p.photo, p.has_channel
      from group_members m join profiles p on p.user_id = m.user_id
      where m.group_id = ${data.groupId}
      order by p.username
    `;
    const messages = await sql<{ id: string; sender_id: string; body: string; created_at: string; username: string }>`
      select gm.id, gm.sender_id, gm.body, gm.created_at::text, p.username
      from group_messages gm join profiles p on p.user_id = gm.sender_id
      where gm.group_id = ${data.groupId}
      order by gm.created_at asc
      limit 300
    `;
    return { ...group, members, messages };
  });

export const sendGroupMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ groupId: z.string(), body: z.string().min(1).max(500000) }), data))
  .handler(async ({ data, context }) => {
    const body = data.body.trim();
    if (!body.startsWith("data:image/") && body.length > 2000) throw new Error("Message is too long.");
    const sql = await getSql();
    await assertMember(sql, data.groupId, context.userId);
    await sql`
      insert into group_messages (id, group_id, sender_id, body)
      values (${crypto.randomUUID()}, ${data.groupId}, ${context.userId}, ${body})
    `;
    return { ok: true };
  });

export const getWallet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const today = lagosDate();
    const rows = await sql<{ balance: number; streak: number; last_streak_date: string | null; last_ad_date: string | null }>`
      select balance, streak, last_streak_date, last_ad_date from wallets where user_id = ${context.userId}
    `;
    const w = rows[0];
    return {
      balance: Number(w?.balance ?? 0),
      streak: Number(w?.streak ?? 0),
      claimedToday: w?.last_streak_date === today,
      adDone: w?.last_ad_date === today,
    };
  });

export const listTx = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ id: string; amount: number; reason: string; created_at: string }>`
      select id, amount, reason, created_at::text from bucks_transactions
      where user_id = ${context.userId} order by created_at desc limit 20
    `;
  });

export const leaderboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const sql = await getSql();
    return sql<{ username: string; full_name: string; balance: number; photo: string | null; avatar_emoji: string }>`
      select p.username, p.full_name, w.balance, p.photo, p.avatar_emoji
      from wallets w join profiles p on p.user_id = w.user_id
      order by w.balance desc, p.username asc limit 10
    `;
  });

export const claimStreak = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const today = lagosDate();
    const yesterday = lagosDate(-1);
    const rows = await sql<{ streak: number; last_streak_date: string | null }>`
      select streak, last_streak_date from wallets where user_id = ${context.userId}
    `;
    const last = rows[0]?.last_streak_date ?? null;
    if (last === today) throw new Error("You already claimed today's streak.");
    const next = last === yesterday ? Number(rows[0]?.streak ?? 0) + 1 : 1;
    const reward = ECONOMY.streakPerDay * next;
    const bonus = next % 7 === 0 ? ECONOMY.streakWeekBonus : 0;
    await sql`update wallets set streak = ${next}, last_streak_date = ${today}, updated_at = now() where user_id = ${context.userId}`;
    await addBucks(sql, context.userId, reward + bonus, `Day ${next} streak`);
    return { streak: next, reward, bonus };
  });

export const useStreakRestore = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const today = lagosDate();
    const yesterday = lagosDate(-1);
    const rows = await sql<{ last_streak_date: string | null }>`select last_streak_date from wallets where user_id = ${context.userId}`;
    const last = rows[0]?.last_streak_date;
    if (last === today || last === yesterday) throw new Error("Your streak is still safe.");
    const items = await sql<{ quantity: number }>`
      select quantity from user_items where user_id = ${context.userId} and item_key = 'streak-restore'
    `;
    if (!items[0] || Number(items[0].quantity) < 1) throw new Error("Buy a streak restore in the store first.");
    await sql`update user_items set quantity = quantity - 1 where user_id = ${context.userId} and item_key = 'streak-restore'`;
    await sql`update wallets set last_streak_date = ${yesterday}, updated_at = now() where user_id = ${context.userId}`;
    return { ok: true };
  });

export const startAd = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const today = lagosDate();
    const rows = await sql<{ last_ad_date: string | null }>`select last_ad_date from wallets where user_id = ${context.userId}`;
    if (rows[0]?.last_ad_date === today) throw new Error("You've already watched today's advert.");
    const site = PORTFOLIO[Math.floor(Math.random() * PORTFOLIO.length)]!;
    await sql`update wallets set ad_started_at = now(), ad_slug = ${site.slug}, updated_at = now() where user_id = ${context.userId}`;
    return site;
  });

export const claimAd = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ clicked: z.boolean() }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const today = lagosDate();
    const rows = await sql<{ last_ad_date: string | null; secs: string | number | null; ad_slug: string | null }>`
      select last_ad_date, ad_slug, extract(epoch from (now() - ad_started_at)) as secs
      from wallets where user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row || row.last_ad_date === today) throw new Error("Today's advert is already claimed.");
    if (row.secs == null || Number(row.secs) < 15) throw new Error("Stay for the full 15 seconds.");
    const reward = 50 + Math.floor(Math.random() * 451) + (data.clicked ? 50 : 0);
    await sql`update wallets set last_ad_date = ${today}, ad_started_at = null, updated_at = now() where user_id = ${context.userId}`;
    await addBucks(sql, context.userId, reward, "JayTech portfolio advert");
    return { reward };
  });

export const transferBucks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ username: Username, amount: z.number().int().positive().max(1_000_000) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const people = await sql<{ user_id: string; username: string }>`
      select user_id, username from profiles where lower(username) = ${data.username.toLowerCase()} limit 1
    `;
    const to = people[0];
    if (!to) throw new Error("No one uses that username.");
    if (to.user_id === context.userId) throw new Error("You can't send Bucks to yourself.");
    await spend(sql, context.userId, data.amount, `Sent to @${to.username}`);
    await addBucks(sql, to.user_id, data.amount, "Received Bucks");
    return { username: to.username };
  });

export const buyChannel = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await loadMe(sql, context.userId);
    if (!me) throw new Error("Finish your profile first.");
    if (me.hasChannel) throw new Error("You already have a channel.");
    await spend(sql, context.userId, ECONOMY.channel, "Bought a FYP channel");
    await sql`update profiles set has_channel = true, updated_at = now() where user_id = ${context.userId}`;
    return loadMe(sql, context.userId);
  });

export const toggleFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ userId: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    if (data.userId === context.userId) throw new Error("You can't follow yourself.");
    const sql = await getSql();
    const channel = await sql<{ has_channel: boolean }>`select has_channel from profiles where user_id = ${data.userId}`;
    if (!channel[0]?.has_channel) throw new Error("That person doesn't have a channel yet.");
    const existing = await sql`select 1 from channel_follows where channel_user_id = ${data.userId} and follower_id = ${context.userId}`;
    if (existing.length) {
      await sql`delete from channel_follows where channel_user_id = ${data.userId} and follower_id = ${context.userId}`;
      await addBucks(sql, data.userId, -ECONOMY.follow, "Channel unfollow");
      return { following: false };
    }
    await sql`insert into channel_follows (channel_user_id, follower_id) values (${data.userId}, ${context.userId})`;
    await addBucks(sql, data.userId, ECONOMY.follow, "New channel follower");
    return { following: true };
  });

type PostRow = {
  id: string;
  author_id: string;
  body: string;
  bg: string | null;
  has_video: boolean;
  likes: number;
  dislikes: number;
  views: number;
  comments: number;
  created_at: string;
  username: string;
  full_name: string;
  avatar_emoji: string;
  photo: string | null;
  has_channel: boolean;
  my_reaction: string | null;
  following: boolean;
};

export const listPosts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ kind: z.enum(["video", "mood"]) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const moodCutoff = new Date(Date.now() - 86400000).toISOString();
    return sql<PostRow>`
      select p.id, p.author_id, p.body, p.bg, (p.video_data is not null) as has_video,
             p.likes, p.dislikes, p.views, p.comments, p.created_at::text,
             pr.username, pr.full_name, pr.avatar_emoji, pr.photo, pr.has_channel,
             r.kind as my_reaction,
             exists(
               select 1 from channel_follows f
               where f.channel_user_id = p.author_id and f.follower_id = ${context.userId}
             ) as following
      from posts p
      join profiles pr on pr.user_id = p.author_id
      left join post_reactions r on r.post_id = p.id and r.user_id = ${context.userId}
      where p.kind = ${data.kind}
        and (${data.kind} <> 'mood' or p.created_at > ${moodCutoff})
      order by p.created_at desc
      limit 40
    `;
  });

export const getPostVideo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ postId: z.string() }), data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ video_data: string | null }>`select video_data from posts where id = ${data.postId}`;
    return rows[0]?.video_data ?? null;
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    parse(
      z.object({
        kind: z.enum(["video", "mood"]),
        body: z.string().max(500),
        bg: z.string().max(20).optional(),
        videoData: z.string().max(3_500_000).optional(),
      }),
      data,
    ),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const me = await loadMe(sql, context.userId);
    if (!me) throw new Error("Finish your profile first.");
    if (data.kind === "video") {
      if (!me.hasChannel) throw new Error("Buy a channel with Bucks before you post on For You.");
      if (!data.videoData?.startsWith("data:video/")) throw new Error("Choose a video under 2.5 MB.");
    } else if (!data.body.trim() && !data.videoData) {
      throw new Error("Write your mood or add a photo/video.");
    }
    const media =
      data.kind === "video"
        ? (data.videoData ?? null)
        : data.videoData && (data.videoData.startsWith("data:image/") || data.videoData.startsWith("data:video/"))
          ? data.videoData
          : null;
    await sql`
      insert into posts (id, author_id, kind, body, bg, video_data)
      values (
        ${crypto.randomUUID()}, ${context.userId}, ${data.kind}, ${data.body.trim()},
        ${data.kind === "mood" ? (data.bg ?? "primary") : null},
        ${media}
      )
    `;
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ postId: z.string() }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const rows = await sql`delete from posts where id = ${data.postId} and author_id = ${context.userId} returning id`;
    if (!rows.length) throw new Error("You can only delete your own post.");
    return { ok: true };
  });

async function refreshCounts(sql: Sql, postId: string) {
  await sql`
    update posts set
      likes = (select count(*)::int from post_reactions where post_id = ${postId} and kind = 'like'),
      dislikes = (select count(*)::int from post_reactions where post_id = ${postId} and kind = 'dislike'),
      comments = (select count(*)::int from post_comments where post_id = ${postId})
    where id = ${postId}
  `;
}

export const reactPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ postId: z.string(), kind: z.enum(["like", "dislike"]) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const posts = await sql<{ author_id: string }>`select author_id from posts where id = ${data.postId}`;
    const author = posts[0]?.author_id;
    if (!author) throw new Error("That post is gone.");
    if (author === context.userId) throw new Error("You can't react to your own post.");
    const current = await sql<{ kind: string }>`
      select kind from post_reactions where post_id = ${data.postId} and user_id = ${context.userId}
    `;
    const prev = current[0]?.kind ?? null;
    const next = prev === data.kind ? null : data.kind;
    if (prev) {
      await sql`delete from post_reactions where post_id = ${data.postId} and user_id = ${context.userId}`;
      await addBucks(sql, author, prev === "like" ? -ECONOMY.like : ECONOMY.dislike, prev === "like" ? "Like removed" : "Dislike removed");
    }
    if (next) {
      await sql`insert into post_reactions (post_id, user_id, kind) values (${data.postId}, ${context.userId}, ${next})`;
      await addBucks(sql, author, next === "like" ? ECONOMY.like : -ECONOMY.dislike, next === "like" ? "Post like" : "Post dislike");
    }
    await refreshCounts(sql, data.postId);
    return { reaction: next };
  });

export const listComments = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ postId: z.string() }), data))
  .handler(async ({ data }) => {
    const sql = await getSql();
    return sql<{ id: string; body: string; created_at: string; username: string; avatar_emoji: string }>`
      select c.id, c.body, c.created_at::text, p.username, p.avatar_emoji
      from post_comments c join profiles p on p.user_id = c.user_id
      where c.post_id = ${data.postId} order by c.created_at asc limit 50
    `;
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ postId: z.string(), body: z.string().trim().min(1).max(280) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const posts = await sql<{ author_id: string }>`select author_id from posts where id = ${data.postId}`;
    const author = posts[0]?.author_id;
    if (!author) throw new Error("That post is gone.");
    const prior = await sql`
      select 1 from post_comments where post_id = ${data.postId} and user_id = ${context.userId} and rewarded limit 1
    `;
    const reward = author !== context.userId && !prior.length;
    await sql`
      insert into post_comments (id, post_id, user_id, body, rewarded)
      values (${crypto.randomUUID()}, ${data.postId}, ${context.userId}, ${data.body}, ${reward})
    `;
    if (reward) await addBucks(sql, author, ECONOMY.comment, "Comment on your post");
    await refreshCounts(sql, data.postId);
    return { ok: true };
  });

export const countView = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ postId: z.string() }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const posts = await sql<{ author_id: string }>`select author_id from posts where id = ${data.postId}`;
    const author = posts[0]?.author_id;
    if (!author || author === context.userId) return { ok: true };
    const inserted = await sql`
      insert into post_views (post_id, viewer_id) values (${data.postId}, ${context.userId})
      on conflict do nothing returning post_id
    `;
    if (inserted.length) {
      await sql`update posts set views = views + 1 where id = ${data.postId}`;
      await addBucks(sql, author, ECONOMY.view, "Someone watched your post");
    }
    return { ok: true };
  });

export const listStore = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      key: string;
      kind: string;
      name: string;
      preview: string;
      price_bucks: number;
      equipped: boolean | null;
      quantity: number | null;
    }>`
      select s.key, s.kind, s.name, s.preview, s.price_bucks, u.equipped, u.quantity
      from store_items s
      left join user_items u on u.item_key = s.key and u.user_id = ${context.userId}
      order by s.sort
    `;
  });

export const buyItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ key: z.string().min(1) }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const items = await sql<{ key: string; price_bucks: number; kind: string; name: string }>`
      select key, price_bucks, kind, name from store_items where key = ${data.key}
    `;
    const item = items[0];
    if (!item) throw new Error("That item isn't in the store.");
    const price = Number(item.price_bucks);
    if (item.kind === "powerup") {
      if (price > 0) await spend(sql, context.userId, price, `Bought ${item.name}`);
      await sql`
        insert into user_items (user_id, item_key, quantity) values (${context.userId}, ${item.key}, 1)
        on conflict (user_id, item_key) do update set quantity = user_items.quantity + 1
      `;
      return { ok: true };
    }
    const owned = await sql`select 1 from user_items where user_id = ${context.userId} and item_key = ${item.key}`;
    if (owned.length) throw new Error("You already own that.");
    if (price > 0) await spend(sql, context.userId, price, `Bought ${item.name}`);
    await sql`insert into user_items (user_id, item_key, quantity) values (${context.userId}, ${item.key}, 1) on conflict do nothing`;
    return { ok: true };
  });

export const equipItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ key: z.string() }), data))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const items = await sql<{ key: string; kind: string; preview: string; price_bucks: number }>`
      select key, kind, preview, price_bucks from store_items where key = ${data.key}
    `;
    const item = items[0];
    if (!item || item.kind === "powerup") throw new Error("That can't be equipped.");
    const owned = await sql`select 1 from user_items where user_id = ${context.userId} and item_key = ${item.key}`;
    if (!owned.length) {
      if (Number(item.price_bucks) > 0) throw new Error("Buy it first.");
      await sql`insert into user_items (user_id, item_key) values (${context.userId}, ${item.key}) on conflict do nothing`;
    }
    await sql`
      update user_items set equipped = false
      where user_id = ${context.userId} and item_key in (select key from store_items where kind = ${item.kind})
    `;
    await sql`update user_items set equipped = true where user_id = ${context.userId} and item_key = ${item.key}`;
    if (item.kind === "avatar") {
      await sql`update profiles set avatar_emoji = ${item.preview}, updated_at = now() where user_id = ${context.userId}`;
    } else if (item.kind === "theme") {
      await sql`update profiles set chat_theme = ${item.preview}, updated_at = now() where user_id = ${context.userId}`;
    } else if (item.kind === "wallpaper") {
      await sql`update profiles set wallpaper = ${item.preview}, updated_at = now() where user_id = ${context.userId}`;
    }
    return loadMe(sql, context.userId);
  });

async function challengeCount(sql: Sql, userId: string, key: "chat" | "post" | "view") {
  const start = lagosDayStart();
  if (key === "chat") {
    const rows = await sql<{ n: number }>`select count(*)::int as n from messages where sender_id = ${userId} and created_at >= ${start}`;
    return Number(rows[0]?.n ?? 0);
  }
  if (key === "post") {
    const rows = await sql<{ n: number }>`select count(*)::int as n from posts where author_id = ${userId} and created_at >= ${start}`;
    return Number(rows[0]?.n ?? 0);
  }
  const rows = await sql<{ n: number }>`select count(*)::int as n from post_views where viewer_id = ${userId} and started_at >= ${start}`;
  return Number(rows[0]?.n ?? 0);
}

export const challengeStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const day = lagosDate();
    const claimed = await sql<{ challenge: string }>`
      select challenge from challenge_claims where user_id = ${context.userId} and day = ${day}
    `;
    return {
      chat: await challengeCount(sql, context.userId, "chat"),
      post: await challengeCount(sql, context.userId, "post"),
      view: await challengeCount(sql, context.userId, "view"),
      claimed: claimed.map((row) => row.challenge),
    };
  });

export const claimChallenge = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => parse(z.object({ key: z.enum(["chat", "post", "view"]) }), data))
  .handler(async ({ data, context }) => {
    const rewards = { chat: 150, post: 200, view: 150 };
    const needs = { chat: 3, post: 1, view: 5 };
    const sql = await getSql();
    const have = await challengeCount(sql, context.userId, data.key);
    if (have < needs[data.key]) throw new Error("Finish the challenge before claiming.");
    const day = lagosDate();
    const inserted = await sql`
      insert into challenge_claims (user_id, challenge, day)
      values (${context.userId}, ${data.key}, ${day})
      on conflict do nothing returning challenge
    `;
    if (!inserted.length) throw new Error("Already claimed today.");
    await addBucks(sql, context.userId, rewards[data.key], `Challenge reward`);
    return { reward: rewards[data.key] };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await loadMe(sql, context.userId);
    if (!me) throw new Error("Finish your profile first.");
    if (me.isAdmin) return me;
    const admins = await sql`select 1 from profiles where is_admin limit 1`;
    if (admins.length) throw new Error("JayTalk already has an admin.");
    await sql`update profiles set is_admin = true where user_id = ${context.userId}`;
    return loadMe(sql, context.userId);
  });

export const creditBucks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) =>
    parse(z.object({ username: Username, amount: z.number().int().positive().max(1_000_000) }), data),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const me = await loadMe(sql, context.userId);
    if (!me?.isAdmin) throw new Error("Only an admin can add bought Bucks.");
    const people = await sql<{ user_id: string; username: string }>`
      select user_id, username from profiles where lower(username) = ${data.username.toLowerCase()} limit 1
    `;
    if (!people[0]) throw new Error("No one uses that username.");
    await addBucks(sql, people[0].user_id, data.amount, "WhatsApp Bucks purchase");
    return { username: people[0].username };
  });
