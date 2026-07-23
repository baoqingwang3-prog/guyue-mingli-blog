import { withBase } from './paths';

type OtpClient = {
  auth: {
    signInWithOtp(args: { email: string; options: { emailRedirectTo: string } }): Promise<{ error: Error | null }>;
  };
};

export function callbackUrl(origin: string, base = import.meta.env.BASE_URL): string {
  return new URL(withBase('/auth/callback/', base), origin).toString();
}

export async function requestMagicLink(client: OtpClient, email: string, redirectTo: string) {
  const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
  return error
    ? { ok: false as const, message: '登录邮件发送失败，请稍后重试。' }
    : { ok: true as const, message: '登录链接已发送，请检查邮箱。' };
}
