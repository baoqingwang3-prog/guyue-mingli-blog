import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { buildKnowledgeRuleRow } from './lib/knowledge-rule-import.mjs';

const { PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OWNER_EMAIL } = process.env;
const sourcePath = process.argv.slice(2).find((argument) => argument !== '--');
if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OWNER_EMAIL) {
  throw new Error('Supabase owner import environment is incomplete');
}
if (!sourcePath) throw new Error('Usage: pnpm import:owner-rule -- <approved-rule.json>');

const input = JSON.parse(await readFile(resolve(sourcePath), 'utf8'));
const client = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: users, error: usersError } = await client.auth.admin.listUsers();
if (usersError) throw new Error('Unable to resolve the owner account');
const owner = users.users.find((user) => user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
if (!owner) throw new Error('Owner must complete one magic-link login before rule import');

const row = buildKnowledgeRuleRow(input, owner.id);
const { error } = await client
  .from('knowledge_rules')
  .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: 'owner_id,rule_key' });
if (error) throw new Error('Unable to import the approved knowledge rule');
console.log(`Imported approved rule ${row.rule_key}`);
