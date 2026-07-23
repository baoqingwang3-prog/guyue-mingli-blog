import { describe, expect, it } from 'vitest';
import { parsePublicConfig } from '../../src/lib/public-config';

describe('parsePublicConfig', () => {
  it('accepts a Supabase URL and public anon key', () => {
    expect(parsePublicConfig({
      PUBLIC_SUPABASE_URL: 'https://project.supabase.co',
      PUBLIC_SUPABASE_ANON_KEY: 'public-anon-key',
    })).toEqual({ url: 'https://project.supabase.co', anonKey: 'public-anon-key' });
  });

  it('rejects a missing URL', () => {
    expect(() => parsePublicConfig({ PUBLIC_SUPABASE_ANON_KEY: 'key' }))
      .toThrow('Supabase public configuration is invalid');
  });
});
