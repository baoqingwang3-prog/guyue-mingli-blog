begin;
select plan(5);

select has_table('public', 'app_owners', 'owner allowlist exists');
select has_function('public', 'is_owner', array[]::text[], 'is_owner function exists');
select policies_are('public', 'app_owners', array[]::text[], 'owner table exposes no client policies');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select is(public.is_owner(), false, 'unknown authenticated user is rejected');

insert into auth.users (id, instance_id, aud, role, email, encrypted_password)
values (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'owner@example.test',
  ''
);
insert into public.app_owners (user_id) values ('00000000-0000-0000-0000-000000000002');
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
select is(public.is_owner(), true, 'allowlisted owner is accepted');

select * from finish();
rollback;
