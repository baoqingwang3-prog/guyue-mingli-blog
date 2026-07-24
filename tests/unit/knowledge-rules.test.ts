import { describe, expect, it } from 'vitest';
import { buildEvidenceReading, loadApprovedRules } from '../../src/lib/knowledge-rules';

function rulesClient(result: { data: unknown; error: unknown }) {
  const query = { eq: () => query, order: async () => result };
  return { from: () => ({ select: () => query }) };
}

describe('private knowledge rules', () => {
  it('loads approved owner rules through the private data interface', async () => {
    const rules = [{ rule_key: 'rule-1', topic: 'wealth' }];
    await expect(loadApprovedRules(rulesClient({ data: rules, error: null }))).resolves.toEqual({
      ok: true,
      rules,
    });
  });

  it('marks an explicitly recorded counterexample as not directly applicable', () => {
    const reading = buildEvidenceReading('分析财富和名利', 'CASE-TEST-001', [
      {
        rule_key: 'rule-1',
        system: 'bazi',
        topic: 'fame_wealth',
        source_title: '测试断语',
        original_text: '测试原文',
        normalized_claim: '测试条件句',
        required_conditions: ['条件甲'],
        counterconditions: ['反条件乙'],
        invalid_if: ['失效条件丙'],
        non_claims: ['不得推出终身结论'],
        evidence_grade: 'C',
        confidence: 'low',
        cases_counter: ['CASE-TEST-001'],
        notes: '必要条件不成立。',
      },
    ]);

    expect(reading.status).toBe('limited');
    expect(reading.items[0]).toMatchObject({ applicability: 'counterexample', notes: '必要条件不成立。' });
  });

  it('returns evidence-insufficient instead of inventing an answer', () => {
    expect(buildEvidenceReading('分析感情', 'CASE-TEST-001', [])).toEqual({
      status: 'insufficient',
      summary: '当前私有资料中没有可核验的对应规则，暂不生成结论。',
      items: [],
    });
  });
});
