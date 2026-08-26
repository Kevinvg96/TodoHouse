-- ============================================================
-- Verhuis & Verbouwing checklist — database schema
-- Run this once in the Supabase SQL editor (Project > SQL Editor)
-- ============================================================

-- People allowed to use the app. Kevin adds one row per person
-- AFTER that person has signed up once on the login page (see README).
create table if not exists members (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  initials text not null
);

-- The checklist items themselves.
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  list text not null check (list in ('verhuis','verbouwing')),
  category text not null,
  title text not null,
  requires_both boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- Who checked off what, and when. For a requires_both task there
-- are up to two rows (person = 'kevin' / 'melissa'). For a normal
-- task there is one row (person = 'shared').
create table if not exists completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  person text not null default 'shared' check (person in ('shared','kevin','melissa')),
  completed_by uuid not null references auth.users(id),
  completed_by_name text not null,
  completed_at timestamptz not null default now(),
  unique (task_id, person)
);

-- ------------------------------------------------------------
-- Row Level Security: only people listed in `members` can see
-- or touch anything. This is the real login wall — the HTML
-- pages are just the door, this is the lock.
-- ------------------------------------------------------------
alter table members set (autovacuum_enabled = true);
alter table members enable row level security;
alter table tasks enable row level security;
alter table completions enable row level security;

create policy "members can read member list" on members
  for select using (exists (select 1 from members m where m.id = auth.uid()));

create policy "members can read tasks" on tasks
  for select using (exists (select 1 from members m where m.id = auth.uid()));
create policy "members can add tasks" on tasks
  for insert with check (exists (select 1 from members m where m.id = auth.uid()));
create policy "members can edit tasks" on tasks
  for update using (exists (select 1 from members m where m.id = auth.uid()));
create policy "members can delete tasks" on tasks
  for delete using (exists (select 1 from members m where m.id = auth.uid()));

create policy "members can read completions" on completions
  for select using (exists (select 1 from members m where m.id = auth.uid()));
create policy "members can add completions" on completions
  for insert with check (exists (select 1 from members m where m.id = auth.uid()));
create policy "members can remove completions" on completions
  for delete using (exists (select 1 from members m where m.id = auth.uid()));
