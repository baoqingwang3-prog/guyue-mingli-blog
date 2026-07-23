import { describe, expect, it } from 'vitest';
import { publicErrorMessage } from '../../src/lib/safe-error';

describe('publicErrorMessage', () => {
  it('never returns provider traces or birth data', () => {
    const error = new Error('OpenAI 401 for 2004-06-12 02:52 token=secret');

    expect(publicErrorMessage(error)).toBe('操作失败，请稍后重试。');
  });
});
