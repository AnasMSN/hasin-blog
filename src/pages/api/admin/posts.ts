import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { timingSafeEqual } from '../../../lib/password';

export const prerender = false;

interface CreatePostBody {
  title?: string;
  date?: string;
  categories?: string;
  bodyMarkdown?: string;
  csrfToken?: string;
}

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'post';
}

export const POST: APIRoute = async (ctx) => {
  const db = (env as unknown as { DB: D1Database }).DB;

  let body: CreatePostBody;
  try {
    body = await ctx.request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const csrfCookie = ctx.cookies.get('csrf_token')?.value;
  if (!csrfCookie || !body.csrfToken || !timingSafeEqual(csrfCookie, body.csrfToken)) {
    return json({ error: 'Invalid request.' }, 403);
  }

  const title = (body.title ?? '').trim();
  const date = (body.date ?? '').trim();
  const categories = (body.categories ?? '').trim();
  const bodyMarkdown = body.bodyMarkdown ?? '';

  if (!title || !date || !bodyMarkdown.trim()) {
    return json({ error: 'Title, date, and body are required.' }, 400);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ error: 'Date must be in YYYY-MM-DD format.' }, 400);
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await db.prepare('SELECT 1 FROM posts WHERE slug = ?').bind(slug).first()) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const id = crypto.randomUUID();
  await db
    .prepare(
      'INSERT INTO posts (id, slug, title, date, categories, body_markdown) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .bind(id, slug, title, date, categories, bodyMarkdown)
    .run();

  return json({ ok: true, slug }, 201);
};
