import { createClient } from '@supabase/supabase-js';
import { parsePublicConfig } from './public-config';

const config = parsePublicConfig(import.meta.env);

export const supabase = createClient(config.url, config.anonKey, {
  auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true },
});
