import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { deleteSession, clearSessionCookie, SESSION_COOKIE } from '../../../lib/session';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const db = (env as unknown as { DB: D1Database }).DB;
  const sessionId = ctx.cookies.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await deleteSession(db, sessionId);
  }
  clearSessionCookie(ctx.cookies);
  return ctx.redirect('/admin/login');
};
