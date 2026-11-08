-- Rail verse signalling works: secure login foundation.
-- Run this in Supabase Dashboard > SQL Editor only after reviewing it.
-- This creates a private per-user records table for the next cloud-sync phase.
create table if not exists public.rv_records (
  owner_id uuid not null references auth.users(id) on delete cascade,
  table_name text not null check (table_name in ('projects','staff','attendance','materials','expenses','payroll')),
  record_id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (owner_id, table_name, record_id)
);
alter table public.rv_records enable row level security;
drop policy if exists "Users can read their own Railverse records" on public.rv_records;
create policy "Users can read their own Railverse records"
  on public.rv_records for select to authenticated
  using (auth.uid() = owner_id);
drop policy if exists "Users can insert their own Railverse records" on public.rv_records;
create policy "Users can insert their own Railverse records"
  on public.rv_records for insert to authenticated
  with check (auth.uid() = owner_id);
drop policy if exists "Users can update their own Railverse records" on public.rv_records;
create policy "Users can update their own Railverse records"
  on public.rv_records for update to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
drop policy if exists "Users can delete their own Railverse records" on public.rv_records;
create policy "Users can delete their own Railverse records"
  on public.rv_records for delete to authenticated
  using (auth.uid() = owner_id);
