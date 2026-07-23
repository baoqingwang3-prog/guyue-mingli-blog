import { describe, expect, it } from 'vitest';
import { checkOwnerAccess } from '../../src/lib/owner-access';

describe('checkOwnerAccess', () => {
  it('rejects a missing session before calling the RPC', async () => {
    let called = false;
    const client = {
      auth: { getSession: async () => ({ data: { session: null } }) },
      rpc: async () => {
        called = true;
        return { data: true, error: null };
      },
    };

    await expect(checkOwnerAccess(client)).resolves.toEqual({ allowed: false, reason: 'signed-out' });
    expect(called).toBe(false);
  });

  it('accepts only an authenticated owner RPC result', async () => {
    const client = {
      auth: { getSession: async () => ({ data: { session: { user: { id: 'owner' } } } }) },
      rpc: async () => ({ data: true, error: null }),
    };

    await expect(checkOwnerAccess(client)).resolves.toEqual({ allowed: true, reason: 'owner' });
  });

  it('distinguishes an unavailable service from a forbidden account', async () => {
    const client = {
      auth: { getSession: async () => ({ data: { session: { user: { id: 'owner' } } } }) },
      rpc: async () => ({ data: null, error: new Error('network unavailable') }),
    };

    await expect(checkOwnerAccess(client)).resolves.toEqual({ allowed: false, reason: 'unavailable' });
  });
});
