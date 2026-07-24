export function buildKnowledgeRuleRow(input, ownerId) {
  if (!input?.rule_id || !input?.system || !input?.topic) throw new Error('Rule identity is incomplete');
  if (input.approved !== true) throw new Error('Only locally approved rules can be imported');

  return {
    owner_id: ownerId,
    rule_key: input.rule_id,
    system: input.system,
    topic: input.topic,
    source_type: input.source_type ?? 'unknown',
    source_title: input.source_title ?? '',
    source_location: input.source_location ?? '',
    original_text: input.original_text ?? '',
    normalized_claim: input.normalized_claim ?? '',
    required_conditions: input.required_conditions ?? [],
    supporting_conditions: input.supporting_conditions ?? [],
    counterconditions: input.counterconditions ?? [],
    invalid_if: input.invalid_if ?? [],
    scope: input.scope ?? [],
    expected_manifestations: input.expected_manifestations ?? [],
    non_claims: input.non_claims ?? [],
    evidence_grade: input.evidence_grade ?? 'ungraded',
    confidence: input.confidence ?? 'low',
    cases_supporting: input.cases_supporting ?? [],
    cases_counter: input.cases_counter ?? [],
    notes: input.notes ?? '',
    approved: true,
    approved_at: input.approved_at ?? new Date().toISOString(),
  };
}
