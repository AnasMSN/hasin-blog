import type { AstroCookies } from 'astro';
import { randomToken, timingSafeStringEqual } from './tokens';

const CSRF_COOKIE = 'csrf_token';

// Double-submit cookie pattern: a token is set as a cookie and also rendered into the
// form; a cross-site request can't read the cookie to reproduce it in the form field
// (browsers won't let another origin's JS read our cookie, and SameSite=Strict already
// stops the cookie itself from being sent on cross-site requests), so both must agree.
export function getOrCreateCsrfToken(cookies: AstroCookies): string {
  const existing = cookies.get(CSRF_COOKIE)?.value;
  if (existing) return existing;
  const token = randomToken(24);
  cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  return token;
}

export function verifyCsrfToken(cookies: AstroCookies, submitted: FormDataEntryValue | null): boolean {
  const cookieToken = cookies.get(CSRF_COOKIE)?.value;
  if (!cookieToken || typeof submitted !== 'string' || submitted.length === 0) return false;
  return timingSafeStringEqual(cookieToken, submitted);
}
