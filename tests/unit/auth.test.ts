import { describe, expect, it } from 'vitest';
import { callbackUrl, requestMagicLink } from '../../src/lib/auth';

describe('auth helpers', () => {
  it('builds a base-path-safe callback URL', () => {
    expect(callbackUrl('https://example.com', '/guyue-mingli-blog/'))
      .toBe('https://example.com/guyue-mingli-blog/auth/callback/');
  });

  it('returns a user-safe failure without exposing provider details', async () => {
    const client = { auth: { signInWithOtp: async () => ({ error: new Error('provider trace') }) } };
    await expect(requestMagicLink(client, 'owner@example.test', 'https://example.com/callback'))
      .resolves.toEqual({ ok: false, message: '登录邮件发送失败，请稍后重试。' });
  });
});
