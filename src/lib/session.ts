import type { AstroCookies } from 'astro';
import { randomToken } from './tokens';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

export interface SessionRow {
  id: string;
  user_id: string;
  username: string;
  expires_at: string;
}

export async function createSession(
  db: D1Database,
  userId: string,
  meta: { userAgent: string | null; ip: string | null },
): Promise<{ id: string; expiresAt: string }> {
  const id = randomToken(32);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await db
    .prepare(
      'INSERT INTO sessions (id, user_id, expires_at, user_agent, ip) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(id, userId, expiresAt, meta.userAgent, meta.ip)
    .run();
  return { id, expiresAt };
}

export async function getSession(db: D1Database, sessionId: string): Promise<SessionRow | null> {
  const row = await db
    .prepare(
      `SELECT s.id, s.user_id, s.expires_at, u.username
       FROM sessions s
       JOIN admin_users u ON u.id = s.user_id
       WHERE s.id = ?`,
    )
    .bind(sessionId)
    .first<SessionRow>();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await deleteSession(db, sessionId);
    return null;
  }
  return row;
}

export async function deleteSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

// `secure` requires HTTPS; disabled only in local dev (plain http://localhost) so login
// isn't broken there, since the dev server doesn't terminate TLS itself.
const cookieOptions = {
  httpOnly: true,
  secure: !import.meta.env.DEV,
  sameSite: 'strict' as const,
  path: '/',
};

export function setSessionCookie(cookies: AstroCookies, sessionId: string): void {
  cookies.set(SESSION_COOKIE, sessionId, { ...cookieOptions, maxAge: SESSION_TTL_SECONDS });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
