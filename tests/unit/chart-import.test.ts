import { describe, expect, it } from 'vitest';
import { buildChartProfileRow } from '../../scripts/lib/chart-profile-import.mjs';

const verifiedExport = {
  schema: 'guyue.horosa.birth-chart-comparison.v1',
  subject: 'CASE-TEST-001',
  chart_verified: true,
  source: { application: 'Horosa 星阙', version: '3.5.1', raw_export_sha256: 'abc' },
  subject_profile: { gender: 'male', birth_place: '测试地点' },
  western_chart_settings: { house_system_canonical: 'Alcabitius' },
  charts: [{ role: 'primary_legal_time', name: '测试主盘', birth: '1999-01-02 03:04:05' }],
  system_snapshots: { bazi: { pillars: { day: '壬戌' } } },
};

describe('buildChartProfileRow', () => {
  it('maps a verified Horosa export into the private chart contract', () => {
    expect(buildChartProfileRow(verifiedExport, 'owner-1')).toEqual({
      owner_id: 'owner-1',
      subject_key: 'CASE-TEST-001',
      display_name: '测试主盘',
      is_primary: true,
      chart_verified: true,
      source_application: 'Horosa 星阙',
      source_version: '3.5.1',
      schema_version: 'guyue.horosa.birth-chart-comparison.v1',
      profile_data: verifiedExport.subject_profile,
      chart_data: {
        source: verifiedExport.source,
        western_chart_settings: verifiedExport.western_chart_settings,
        charts: verifiedExport.charts,
        system_snapshots: verifiedExport.system_snapshots,
      },
    });
  });

  it('rejects an unverified export before cloud upload', () => {
    expect(() => buildChartProfileRow({ ...verifiedExport, chart_verified: false }, 'owner-1')).toThrow(
      'Only verified chart exports can be imported',
    );
  });
});
