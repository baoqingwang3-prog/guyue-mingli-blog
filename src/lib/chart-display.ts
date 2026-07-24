type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as UnknownRecord) : {};
}

function text(value: unknown, fallback = '未记录'): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function chartSummary(profile: {
  display_name: string;
  chart_verified: boolean;
  source_application: string;
  source_version: string;
  profile_data: UnknownRecord;
  chart_data: UnknownRecord;
}) {
  const chartData = record(profile.chart_data);
  const charts = Array.isArray(chartData.charts) ? chartData.charts.map(record) : [];
  const primary = charts.find((chart) => chart.role === 'primary_legal_time') ?? {};
  const snapshots = record(chartData.system_snapshots);
  const bazi = record(snapshots.bazi);
  const pillars = record(bazi.pillars);
  const ziwei = record(snapshots.ziwei_doushu);
  const western = record(chartData.western_chart_settings);

  return {
    name: profile.display_name,
    verified: profile.chart_verified,
    source: `${profile.source_application} ${profile.source_version}`.trim(),
    birthPlace: text(profile.profile_data.birth_place),
    legalTime: text(primary.birth),
    pillars: [pillars.year, pillars.month, pillars.day, pillars.hour].map((value) => text(value)).join('　'),
    ziwei: `命宫 ${text(ziwei.life_palace)} · 命主 ${text(ziwei.life_master)} · 身主 ${text(ziwei.body_master)}`,
    western: `${text(western.house_system_canonical)} 宫制`,
  };
}
