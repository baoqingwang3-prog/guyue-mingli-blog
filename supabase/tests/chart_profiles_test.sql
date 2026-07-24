begin;
select plan(8);

select has_table('public', 'chart_profiles', 'private chart profile table exists');
select row_security_active('public.chart_profiles', 'chart profiles enforce row security');
select policies_are(
  'public',
  'chart_profiles',
  array[
    'owners delete their chart profiles',
    'owners insert their chart profiles',
    'owners read their chart profiles',
    'owners update their chart profiles'
  ],
  'chart profiles expose only owner-scoped policies'
);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password)
values
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'owner@example.test', ''),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'other@example.test', '');

insert into public.app_owners (user_id) values ('00000000-0000-0000-0000-000000000010');
insert into public.chart_profiles (
  owner_id, subject_key, display_name, is_primary, chart_verified,
  source_application, source_version, schema_version, profile_data, chart_data
) values (
  '00000000-0000-0000-0000-000000000010', 'CASE-OWNER', 'owner chart', true, true,
  'Horosa', '3.5.1', 'test.v1', '{}'::jsonb, '{}'::jsonb
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000010', true);
select results_eq('select subject_key from public.chart_profiles', array['CASE-OWNER'], 'owner can read own chart');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000011', true);
select is_empty('select subject_key from public.chart_profiles', 'non-owner cannot read owner chart');
select throws_ok(
  $$insert into public.chart_profiles (
    owner_id, subject_key, display_name, source_application, source_version,
    schema_version, profile_data, chart_data
  ) values (
    '00000000-0000-0000-0000-000000000011', 'CASE-OTHER', 'other chart',
    'Horosa', '3.5.1', 'test.v1', '{}'::jsonb, '{}'::jsonb
  )$$,
  '42501',
  null,
  'non-owner cannot insert a chart'
);

reset role;
select col_is_pk('public', 'chart_profiles', 'id', 'chart profile id is primary key');
select has_index('public', 'chart_profiles', 'chart_profiles_one_primary_per_owner', 'one primary chart per owner is indexed');

select * from finish();
rollback;
