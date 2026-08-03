import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { finalizeHash, timingSafeEqual } from '../../../lib/password';
import { createSession, setSessionCookie } from '../../../lib/session';
import { isLockedOut, recordFailedAttempt, clearAttempts } from '../../../lib/rateLimit';

export const prerender = false;

interface LoginBody {
  username?: string;
  stretched?: string;
  csrfToken?: string;
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async (ctx) => {
  const db = (env as unknown as { DB: D1Database }).DB;

  let body: LoginBody;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { username, stretched, csrfToken } = body;
  if (!username || !stretched || !csrfToken) {
    return json({ error: 'Invalid request.' }, 400);
  }

  const csrfCookie = ctx.cookies.get('csrf_token')?.value;
  if (!csrfCookie || !timingSafeEqual(csrfCookie, csrfToken)) {
    return json({ error: 'Invalid request.' }, 403);
  }

  const ip = ctx.request.headers.get('cf-connecting-ip') ?? 'unknown';
  const identifier = `login:${ip}:${username.toLowerCase()}`;

  if (await isLockedOut(db, identifier)) {
    return json({ error: 'Too many attempts. Please wait and try again.' }, 429);
  }

  const user = await db
    .prepare('SELECT id, password_hash FROM admin_users WHERE username = ?')
    .bind(username)
    .first<{ id: string; password_hash: string }>();

  // Always compute the hash, even if no user matched, so response timing doesn't
  // reveal whether the username exists.
  const computedHash = await finalizeHash(stretched);
  const valid = !!user && timingSafeEqual(computedHash, user.password_hash);

  if (!valid) {
    await recordFailedAttempt(db, identifier);
    return json({ error: 'Invalid username or password.' }, 401);
  }

  await clearAttempts(db, identifier);
  const { id: sessionId } = await createSession(db, user!.id, {
    userAgent: ctx.request.headers.get('user-agent'),
    ip,
  });
  setSessionCookie(ctx.cookies, sessionId);

  return json({ ok: true }, 200);
};
