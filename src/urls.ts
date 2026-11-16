/** Resolve public assets and page links under Vite's configured deployment root. */
export function siteUrl(path = ''): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

/** Keep the existing page router independent of the GitHub repository prefix. */
export function pagePath(pathname: string): string {
  const base = import.meta.env.BASE_URL;
  const root = base.replace(/\/$/, '');
  if (pathname === root || pathname === base) return '';
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return path.replace(/^\/+|\/+$/g, '');
}
