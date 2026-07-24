export type ChartProfile = {
  id: string;
  subject_key: string;
  display_name: string;
  chart_verified: boolean;
  source_application: string;
  source_version: string;
  profile_data: Record<string, unknown>;
  chart_data: Record<string, unknown>;
  updated_at: string;
};

type ChartQuery = {
  eq(column: string, value: boolean): ChartQuery;
  maybeSingle(): PromiseLike<{ data: ChartProfile | null; error: unknown | null }>;
};

type ChartClient = {
  from(table: 'chart_profiles'): {
    select(columns: string): ChartQuery;
  };
};

const PROFILE_COLUMNS = [
  'id',
  'subject_key',
  'display_name',
  'chart_verified',
  'source_application',
  'source_version',
  'profile_data',
  'chart_data',
  'updated_at',
].join(',');

export async function loadPrimaryChartProfile(client: unknown) {
  const chartClient = client as ChartClient;
  const { data, error } = await chartClient
    .from('chart_profiles')
    .select(PROFILE_COLUMNS)
    .eq('is_primary', true)
    .maybeSingle();

  if (error) return { ok: false as const, reason: 'unavailable' as const };
  if (!data) return { ok: false as const, reason: 'missing' as const };
  return { ok: true as const, profile: data };
}
