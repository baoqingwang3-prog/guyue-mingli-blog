export type KnowledgeRule = {
  rule_key: string;
  system: string;
  topic: string;
  source_title: string;
  original_text: string;
  normalized_claim: string;
  required_conditions: string[];
  counterconditions: string[];
  invalid_if: string[];
  non_claims: string[];
  evidence_grade: string;
  confidence: string;
  cases_supporting?: string[];
  cases_counter?: string[];
  notes?: string;
};

type RulesQuery = {
  eq(column: string, value: boolean): RulesQuery;
  order(column: string): PromiseLike<{ data: KnowledgeRule[] | null; error: unknown | null }>;
};

type RulesClient = {
  from(table: 'knowledge_rules'): { select(columns: string): RulesQuery };
};

const RULE_COLUMNS = [
  'rule_key', 'system', 'topic', 'source_title', 'original_text', 'normalized_claim',
  'required_conditions', 'counterconditions', 'invalid_if', 'non_claims',
  'evidence_grade', 'confidence', 'cases_supporting', 'cases_counter', 'notes',
].join(',');

export async function loadApprovedRules(client: unknown) {
  const rulesClient = client as RulesClient;
  const { data, error } = await rulesClient
    .from('knowledge_rules')
    .select(RULE_COLUMNS)
    .eq('approved', true)
    .order('rule_key');

  if (error) return { ok: false as const, reason: 'unavailable' as const };
  return { ok: true as const, rules: data ?? [] };
}

function requestedTopics(question: string): Set<string> {
  const topics = new Set<string>();
  if (/财富|财运|名利|收入|事业/.test(question)) topics.add('fame_wealth');
  if (/学业|考试|考研|学校/.test(question)) topics.add('study');
  if (/感情|恋爱|婚姻|对象/.test(question)) topics.add('relationship');
  if (/应期|时间|何时|什么时候/.test(question)) topics.add('timing');
  return topics;
}

export function buildEvidenceReading(question: string, subjectKey: string, rules: KnowledgeRule[]) {
  const topics = requestedTopics(question);
  const relevant = topics.size ? rules.filter((rule) => topics.has(rule.topic)) : rules;

  if (!relevant.length) {
    return {
      status: 'insufficient' as const,
      summary: '当前私有资料中没有可核验的对应规则，暂不生成结论。',
      items: [],
    };
  }

  const items = relevant.map((rule) => {
    const counterexample = rule.cases_counter?.includes(subjectKey) ?? false;
    const supporting = rule.cases_supporting?.includes(subjectKey) ?? false;
    return {
      ...rule,
      applicability: counterexample ? 'counterexample' as const : supporting ? 'supporting' as const : 'requires-review' as const,
      notes: rule.notes ?? '',
    };
  });

  const hasDirectSupport = items.some((item) => item.applicability === 'supporting');
  return {
    status: hasDirectSupport ? 'evidence' as const : 'limited' as const,
    summary: hasDirectSupport
      ? '找到已审核且有命例支持的资料，仍需结合完整盘面条件解读。'
      : '找到相关资料，但当前只能核对条件与反条件，不能据此直接下结论。',
    items,
  };
}
