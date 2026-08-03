import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { getSession, SESSION_COOKIE } from './lib/session';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);
const PUBLIC_API_PATHS = new Set(['/api/admin/login']);

const ADMIN_CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return next();
  }

  const isPublicRoute = PUBLIC_ADMIN_PATHS.has(pathname) || PUBLIC_API_PATHS.has(pathname);
  const sessionId = context.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionId ? await getSession((env as unknown as { DB: D1Database }).DB, sessionId) : null;

  let response: Response;
  if (session) {
    context.locals.user = { id: session.user_id, username: session.username };
    response = await next();
  } else if (isPublicRoute) {
    response = await next();
  } else if (isAdminApi) {
    response = new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  } else {
    response = context.redirect('/admin/login');
  }

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  response.headers.set('Content-Security-Policy', ADMIN_CSP);
  return response;
});
