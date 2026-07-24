create table public.chart_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  subject_key text not null,
  display_name text not null,
  is_primary boolean not null default false,
  chart_verified boolean not null default false,
  source_application text not null,
  source_version text not null,
  schema_version text not null,
  profile_data jsonb not null,
  chart_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, subject_key),
  constraint chart_profiles_profile_object check (jsonb_typeof(profile_data) = 'object'),
  constraint chart_profiles_chart_object check (jsonb_typeof(chart_data) = 'object')
);

create unique index chart_profiles_one_primary_per_owner
  on public.chart_profiles (owner_id)
  where is_primary;

alter table public.chart_profiles enable row level security;

create policy "owners read their chart profiles"
  on public.chart_profiles
  for select
  to authenticated
  using (owner_id = auth.uid() and public.is_owner());

create policy "owners insert their chart profiles"
  on public.chart_profiles
  for insert
  to authenticated
  with check (owner_id = auth.uid() and public.is_owner());

create policy "owners update their chart profiles"
  on public.chart_profiles
  for update
  to authenticated
  using (owner_id = auth.uid() and public.is_owner())
  with check (owner_id = auth.uid() and public.is_owner());

create policy "owners delete their chart profiles"
  on public.chart_profiles
  for delete
  to authenticated
  using (owner_id = auth.uid() and public.is_owner());

grant select, insert, update, delete on public.chart_profiles to authenticated;
revoke all on public.chart_profiles from anon;
