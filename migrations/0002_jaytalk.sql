-- JayTalk social data: profiles, bucks, chat, groups, posts, store.

create table if not exists profiles (
  user_id text primary key,
  username text not null,
  full_name text not null,
  bio text not null default '',
  avatar_emoji text not null default '🙂',
  photo text,
  chat_theme text not null default 'classic',
  wallpaper text,
  has_channel boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_username_lower_idx on profiles (lower(username));

create table if not exists wallets (
  user_id text primary key references profiles (user_id) on delete cascade,
  balance integer not null default 0,
  streak integer not null default 0,
  last_streak_date text,
  last_ad_date text,
  ad_started_at timestamptz,
  ad_slug text,
  updated_at timestamptz not null default now()
);

create table if not exists bucks_transactions (
  id text primary key,
  user_id text not null references profiles (user_id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);
create index if not exists bucks_tx_user_idx on bucks_transactions (user_id, created_at desc);

create table if not exists friendships (
  id text primary key,
  requester text not null references profiles (user_id) on delete cascade,
  addressee text not null references profiles (user_id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (requester, addressee)
);

create table if not exists messages (
  id text primary key,
  sender_id text not null references profiles (user_id) on delete cascade,
  recipient_id text not null references profiles (user_id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists messages_pair_idx on messages (sender_id, recipient_id, created_at);

create table if not exists chat_groups (
  id text primary key,
  name text not null,
  owner_id text not null references profiles (user_id) on delete cascade,
  call_room text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  group_id text not null references chat_groups (id) on delete cascade,
  user_id text not null references profiles (user_id) on delete cascade,
  primary key (group_id, user_id)
);

create table if not exists group_messages (
  id text primary key,
  group_id text not null references chat_groups (id) on delete cascade,
  sender_id text not null references profiles (user_id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists group_messages_idx on group_messages (group_id, created_at);

create table if not exists typing_status (
  user_id text not null references profiles (user_id) on delete cascade,
  peer_key text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, peer_key)
);

create table if not exists channel_follows (
  channel_user_id text not null references profiles (user_id) on delete cascade,
  follower_id text not null references profiles (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (channel_user_id, follower_id)
);

create table if not exists posts (
  id text primary key,
  author_id text not null references profiles (user_id) on delete cascade,
  kind text not null,
  body text not null default '',
  bg text,
  video_data text,
  likes integer not null default 0,
  dislikes integer not null default 0,
  views integer not null default 0,
  comments integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists posts_kind_idx on posts (kind, created_at desc);

create table if not exists post_reactions (
  post_id text not null references posts (id) on delete cascade,
  user_id text not null references profiles (user_id) on delete cascade,
  kind text not null,
  primary key (post_id, user_id)
);

create table if not exists post_comments (
  id text primary key,
  post_id text not null references posts (id) on delete cascade,
  user_id text not null references profiles (user_id) on delete cascade,
  body text not null,
  rewarded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists post_views (
  post_id text not null references posts (id) on delete cascade,
  viewer_id text not null references profiles (user_id) on delete cascade,
  started_at timestamptz not null default now(),
  primary key (post_id, viewer_id)
);

create table if not exists store_items (
  key text primary key,
  kind text not null,
  name text not null,
  preview text not null,
  price_bucks integer not null,
  sort integer not null default 0
);

create table if not exists user_items (
  user_id text not null references profiles (user_id) on delete cascade,
  item_key text not null references store_items (key) on delete cascade,
  equipped boolean not null default false,
  quantity integer not null default 1,
  created_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

create table if not exists challenge_claims (
  user_id text not null references profiles (user_id) on delete cascade,
  challenge text not null,
  day text not null,
  primary key (user_id, challenge, day)
);

create table if not exists auth_codes (
  id text primary key,
  email text not null,
  purpose text not null,
  code_hash text not null,
  payload text,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists auth_codes_email_idx on auth_codes (email, purpose);

insert into store_items (key, kind, name, preview, price_bucks, sort) values
  ('avatar-smile', 'avatar', 'Smile', '🙂', 0, 1),
  ('avatar-sun', 'avatar', 'Sunny', '😎', 150, 2),
  ('avatar-fox', 'avatar', 'Fox', '🦊', 200, 3),
  ('avatar-bot', 'avatar', 'Bot', '🤖', 220, 4),
  ('avatar-lion', 'avatar', 'Lion', '🦁', 280, 5),
  ('avatar-alien', 'avatar', 'Alien', '👽', 320, 6),
  ('avatar-crown', 'avatar', 'Crown', '👑', 500, 7),
  ('avatar-star', 'avatar', 'Star', '⭐', 180, 8),
  ('theme-classic', 'theme', 'Classic chat', 'classic', 0, 10),
  ('theme-mint', 'theme', 'Mint chat', 'mint', 250, 11),
  ('theme-night', 'theme', 'Night chat', 'night', 250, 12),
  ('wall-sky', 'wallpaper', 'Sky wash', 'linear-gradient(160deg,#dbeafe,#e0e7ff)', 180, 20),
  ('wall-mint', 'wallpaper', 'Mint wash', 'linear-gradient(160deg,#ccfbf1,#dbeafe)', 180, 21),
  ('wall-dusk', 'wallpaper', 'Dusk wash', 'linear-gradient(160deg,#1e1b4b,#312e81)', 300, 22),
  ('streak-restore', 'powerup', 'Streak restore', 'flame', 400, 30)
on conflict (key) do nothing;
