export function withBase(pathname: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = `/${base.split('/').filter(Boolean).join('/')}`;
  const normalizedPath = `/${pathname.split('/').filter(Boolean).join('/')}`;
  const baseWithSlash = normalizedBase === '/' ? '/' : `${normalizedBase}/`;

  if (baseWithSlash !== '/' && `${normalizedPath}/`.startsWith(baseWithSlash)) {
    return `${normalizedPath}/`.replace(/\/+/g, '/');
  }

  return `${baseWithSlash}${normalizedPath.replace(/^\//, '')}/`.replace(/\/+/g, '/');
}
