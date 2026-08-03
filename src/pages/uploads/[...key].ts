import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

// Publicly readable by design (no auth check): these are images embedded in published
// blog posts, so they need to load for any visitor, not just the logged-in admin.
export const GET: APIRoute = async (ctx) => {
  const bucket = (env as unknown as { POST_IMAGES: R2Bucket }).POST_IMAGES;
  const key = ctx.params.key;
  if (!key) {
    return new Response('Not found', { status: 404 });
  }

  const object = await bucket.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
};
