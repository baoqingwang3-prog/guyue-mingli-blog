create table public.knowledge_rules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  rule_key text not null,
  system text not null check (system in ('bazi', 'ziwei', 'western', 'cross_system')),
  topic text not null,
  source_type text not null,
  source_title text not null,
  source_location text not null default '',
  original_text text not null,
  normalized_claim text not null,
  required_conditions jsonb not null default '[]'::jsonb,
  supporting_conditions jsonb not null default '[]'::jsonb,
  counterconditions jsonb not null default '[]'::jsonb,
  invalid_if jsonb not null default '[]'::jsonb,
  scope jsonb not null default '[]'::jsonb,
  expected_manifestations jsonb not null default '[]'::jsonb,
  non_claims jsonb not null default '[]'::jsonb,
  evidence_grade text not null,
  confidence text not null,
  cases_supporting jsonb not null default '[]'::jsonb,
  cases_counter jsonb not null default '[]'::jsonb,
  notes text not null default '',
  approved boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, rule_key),
  constraint knowledge_rules_required_array check (jsonb_typeof(required_conditions) = 'array'),
  constraint knowledge_rules_counter_array check (jsonb_typeof(counterconditions) = 'array'),
  constraint knowledge_rules_invalid_array check (jsonb_typeof(invalid_if) = 'array')
);

create index knowledge_rules_owner_topic_approved
  on public.knowledge_rules (owner_id, topic, approved)
  where approved;

alter table public.knowledge_rules enable row level security;

create policy "owners read their approved knowledge rules"
  on public.knowledge_rules
  for select
  to authenticated
  using (owner_id = auth.uid() and public.is_owner() and approved);

grant select on public.knowledge_rules to authenticated;
revoke all on public.knowledge_rules from anon;
