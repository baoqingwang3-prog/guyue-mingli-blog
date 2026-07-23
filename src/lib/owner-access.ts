type OwnerClient = {
  auth: { getSession(): Promise<{ data: { session: unknown | null } }> };
  rpc(name: 'is_owner'): PromiseLike<{ data: boolean | null; error: unknown | null }>;
};

export async function checkOwnerAccess(client: OwnerClient) {
  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session) return { allowed: false as const, reason: 'signed-out' as const };

  const { data, error } = await client.rpc('is_owner');
  if (error) return { allowed: false as const, reason: 'unavailable' as const };
  if (data !== true) return { allowed: false as const, reason: 'forbidden' as const };

  return { allowed: true as const, reason: 'owner' as const };
}
