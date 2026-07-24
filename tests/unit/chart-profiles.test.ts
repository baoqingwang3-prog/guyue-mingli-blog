import { describe, expect, it } from 'vitest';
import { loadPrimaryChartProfile } from '../../src/lib/chart-profiles';

function chartClient(result: { data: unknown; error: unknown }) {
  const query = {
    eq: () => query,
    maybeSingle: async () => result,
  };

  return {
    from: (table: string) => {
      expect(table).toBe('chart_profiles');
      return { select: () => query };
    },
  };
}

describe('loadPrimaryChartProfile', () => {
  it('loads the owner primary chart through the public data interface', async () => {
    const record = {
      id: 'chart-1',
      subject_key: 'CASE-TEST-001',
      display_name: '本人主盘',
      chart_verified: true,
      source_application: 'Horosa 星阙',
      source_version: '3.5.1',
      profile_data: { gender: 'male', birth_place: '测试地点' },
      chart_data: { system_snapshots: { bazi: { pillars: { day: '壬戌' } } } },
      updated_at: '2026-07-24T00:00:00Z',
    };

    await expect(loadPrimaryChartProfile(chartClient({ data: record, error: null }))).resolves.toEqual({
      ok: true,
      profile: record,
    });
  });

  it('distinguishes an empty profile from an unavailable service', async () => {
    await expect(loadPrimaryChartProfile(chartClient({ data: null, error: null }))).resolves.toEqual({
      ok: false,
      reason: 'missing',
    });

    await expect(
      loadPrimaryChartProfile(chartClient({ data: null, error: new Error('offline') })),
    ).resolves.toEqual({ ok: false, reason: 'unavailable' });
  });
});
