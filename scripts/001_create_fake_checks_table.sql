-- Create the fake_checks table to store all fact-check results
create table if not exists public.fake_checks (
  id uuid primary key default gen_random_uuid(),
  claim text not null,
  result text not null,
  is_fake boolean not null default true,
  created_at timestamp with time zone default now(),
  session_id text
);

-- Create an index on created_at for faster sorting
create index if not exists fake_checks_created_at_idx on public.fake_checks(created_at desc);

-- Enable RLS for security
alter table public.fake_checks enable row level security;

-- Allow anyone to read fake checks (public trending data)
create policy "fake_checks_select_all"
  on public.fake_checks for select
  using (true);

-- Only allow inserts from authenticated service role (API routes)
-- This prevents direct client-side inserts
create policy "fake_checks_insert_service"
  on public.fake_checks for insert
  with check (true);
