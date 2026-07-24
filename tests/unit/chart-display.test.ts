import { describe, expect, it } from 'vitest';
import { chartSummary } from '../../src/lib/chart-display';

describe('chartSummary', () => {
  it('creates a stable private-desk summary from a chart profile', () => {
    const profile = {
      display_name: '测试主盘',
      chart_verified: true,
      source_application: 'Horosa',
      source_version: '3.5.1',
      profile_data: { birth_place: '测试地点' },
      chart_data: {
        western_chart_settings: { house_system_canonical: 'Alcabitius' },
        charts: [{ role: 'primary_legal_time', birth: '1999-01-02 03:04:05' }],
        system_snapshots: {
          bazi: { pillars: { year: '甲子', month: '乙丑', day: '丙寅', hour: '丁卯' } },
          ziwei_doushu: { life_palace: '戊辰', life_master: '廉贞', body_master: '天梁' },
        },
      },
    };

    expect(chartSummary(profile)).toEqual({
      name: '测试主盘',
      verified: true,
      source: 'Horosa 3.5.1',
      birthPlace: '测试地点',
      legalTime: '1999-01-02 03:04:05',
      pillars: '甲子　乙丑　丙寅　丁卯',
      ziwei: '命宫 戊辰 · 命主 廉贞 · 身主 天梁',
      western: 'Alcabitius 宫制',
    });
  });
});
