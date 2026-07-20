-- Shift Cockpit v0.10 — Supabase schema (RLS by auth.uid())
-- Run in Supabase SQL Editor after creating a project.
-- See docs/CLOUD_SYNC.md for full setup.

-- Handovers: full ShiftHandover object in payload JSONB
create table if not exists public.handovers (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create index if not exists handovers_user_id_idx on public.handovers (user_id);
create index if not exists handovers_user_updated_idx
  on public.handovers (user_id, updated_at desc);
create index if not exists handovers_user_live_idx
  on public.handovers (user_id)
  where deleted_at is null;

-- Settings: one row per user (Settings object in payload)
create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.handovers enable row level security;
alter table public.settings enable row level security;

-- Handovers policies
drop policy if exists "handovers_select_own" on public.handovers;
create policy "handovers_select_own"
  on public.handovers for select
  using (auth.uid() = user_id);

drop policy if exists "handovers_insert_own" on public.handovers;
create policy "handovers_insert_own"
  on public.handovers for insert
  with check (auth.uid() = user_id);

drop policy if exists "handovers_update_own" on public.handovers;
create policy "handovers_update_own"
  on public.handovers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "handovers_delete_own" on public.handovers;
create policy "handovers_delete_own"
  on public.handovers for delete
  using (auth.uid() = user_id);

-- Settings policies
drop policy if exists "settings_select_own" on public.settings;
create policy "settings_select_own"
  on public.settings for select
  using (auth.uid() = user_id);

drop policy if exists "settings_insert_own" on public.settings;
create policy "settings_insert_own"
  on public.settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "settings_update_own" on public.settings;
create policy "settings_update_own"
  on public.settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "settings_delete_own" on public.settings;
create policy "settings_delete_own"
  on public.settings for delete
  using (auth.uid() = user_id);
