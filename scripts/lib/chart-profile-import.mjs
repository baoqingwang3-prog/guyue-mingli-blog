export function buildChartProfileRow(input, ownerId) {
  if (!input || input.chart_verified !== true) {
    throw new Error('Only verified chart exports can be imported');
  }

  const primaryChart = input.charts?.find((chart) => chart.role === 'primary_legal_time');
  if (!input.schema || !input.subject || !primaryChart?.name) {
    throw new Error('Verified chart export is missing required identity fields');
  }

  return {
    owner_id: ownerId,
    subject_key: input.subject,
    display_name: primaryChart.name,
    is_primary: true,
    chart_verified: true,
    source_application: input.source?.application ?? 'Horosa',
    source_version: input.source?.version ?? 'unknown',
    schema_version: input.schema,
    profile_data: input.subject_profile ?? {},
    chart_data: {
      source: input.source ?? {},
      western_chart_settings: input.western_chart_settings ?? {},
      charts: input.charts ?? [],
      system_snapshots: input.system_snapshots ?? {},
    },
  };
}
