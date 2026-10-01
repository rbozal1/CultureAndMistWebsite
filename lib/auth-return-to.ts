const APP_ORIGIN = 'https://cultureandmist.com';
const AUTH_PATHS = new Set(['/sign-in', '/sign-up', '/reset-password']);

export function safeAuthReturnTo(value?: string): string {
  if (!value?.startsWith('/') || value.startsWith('//')) return '/';

  try {
    const url = new URL(value, APP_ORIGIN);
    if (url.origin !== APP_ORIGIN || AUTH_PATHS.has(url.pathname)) return '/';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}