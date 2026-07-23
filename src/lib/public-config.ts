import { z } from 'zod';

const schema = z.object({
  PUBLIC_SUPABASE_URL: z.url(),
  PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export function parsePublicConfig(env: Record<string, unknown>) {
  const result = schema.safeParse(env);
  if (!result.success) throw new Error('Supabase public configuration is invalid');
  return { url: result.data.PUBLIC_SUPABASE_URL, anonKey: result.data.PUBLIC_SUPABASE_ANON_KEY };
}
