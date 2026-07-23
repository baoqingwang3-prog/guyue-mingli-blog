import { createClient } from '@supabase/supabase-js';

const { PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OWNER_EMAIL } = process.env;
if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OWNER_EMAIL) {
  throw new Error('PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and OWNER_EMAIL are required');
}

const client = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await client.auth.admin.listUsers();
if (error) throw error;
const owner = data.users.find((user) => user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
if (!owner) throw new Error('Owner must complete one magic-link login before bootstrap');

const { error: upsertError } = await client.from('app_owners').upsert({ user_id: owner.id });
if (upsertError) throw upsertError;
console.log('Owner access granted');
