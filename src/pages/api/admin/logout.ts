import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { deleteSession, clearSessionCookie, SESSION_COOKIE } from '../../../lib/session';
import { timingSafeEqual } from '../../../lib/password';

export const prerender = false;

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async (ctx) => {
  let csrfToken: string | undefined;
  try {
    ({ csrfToken } = await ctx.request.json());
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const csrfCookie = ctx.cookies.get('csrf_token')?.value;
  if (!csrfCookie || !csrfToken || !timingSafeEqual(csrfCookie, csrfToken)) {
    return json({ error: 'Invalid request.' }, 403);
  }

  const db = (env as unknown as { DB: D1Database }).DB;
  const sessionId = ctx.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteSession(db, sessionId);
  }
  clearSessionCookie(ctx.cookies);
  return json({ ok: true }, 200);
};
