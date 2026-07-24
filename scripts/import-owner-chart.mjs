import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { buildChartProfileRow } from './lib/chart-profile-import.mjs';

const { PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OWNER_EMAIL } = process.env;
const sourcePath = process.argv.slice(2).find((argument) => argument !== '--');

if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OWNER_EMAIL) {
  throw new Error('Supabase owner import environment is incomplete');
}
if (!sourcePath) throw new Error('Usage: pnpm import:owner-chart -- <verified-horosa-export.json>');

const input = JSON.parse(await readFile(resolve(sourcePath), 'utf8'));
const client = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: users, error: usersError } = await client.auth.admin.listUsers();
if (usersError) throw new Error('Unable to resolve the owner account');

const owner = users.users.find((user) => user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
if (!owner) throw new Error('Owner must complete one magic-link login before chart import');

const row = buildChartProfileRow(input, owner.id);
const { error: demoteError } = await client
  .from('chart_profiles')
  .update({ is_primary: false, updated_at: new Date().toISOString() })
  .eq('owner_id', owner.id)
  .neq('subject_key', row.subject_key);
if (demoteError) throw new Error('Unable to prepare the primary chart slot');

const { error: upsertError } = await client
  .from('chart_profiles')
  .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'owner_id,subject_key' });
if (upsertError) throw new Error('Unable to import the verified chart profile');

console.log(`Imported verified primary chart ${row.subject_key}`);
