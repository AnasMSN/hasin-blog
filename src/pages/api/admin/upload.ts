import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { timingSafeEqual } from '../../../lib/password';

export const prerender = false;

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// Detect the real image format from its magic bytes rather than trusting the
// client-supplied File.type (which is just an OS/browser guess based on filename and
// can be spoofed in a crafted request) — this decides both the stored content-type
// and the file extension, and rejects anything that isn't actually one of these
// raster formats. SVG is deliberately not supported: it can embed scripts and is a
// classic image-upload XSS vector.
async function detectImageType(file: File): Promise<{ mime: string; ext: string } | null> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
    return { mime: 'image/png', ext: 'png' };
  }
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }
  if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
    return { mime: 'image/gif', ext: 'gif' };
  }
  if (
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return { mime: 'image/webp', ext: 'webp' };
  }
  return null;
}

export const POST: APIRoute = async (ctx) => {
  const bucket = (env as unknown as { POST_IMAGES: R2Bucket }).POST_IMAGES;

  const form = await ctx.request.formData();

  const csrfCookie = ctx.cookies.get('csrf_token')?.value;
  const csrfToken = form.get('csrf_token');
  if (!csrfCookie || typeof csrfToken !== 'string' || !timingSafeEqual(csrfCookie, csrfToken)) {
    return json({ error: 'Invalid request.' }, 403);
  }

  const file = form.get('image');
  if (!(file instanceof File)) {
    return json({ error: 'No image provided.' }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json({ error: 'Image is too large (max 5MB).' }, 400);
  }

  const detected = await detectImageType(file);
  if (!detected) {
    return json({ error: 'Unsupported image type. Use PNG, JPEG, WEBP, or GIF.' }, 400);
  }

  const key = `posts/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${detected.ext}`;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: detected.mime },
  });

  return json({ url: `/uploads/${key}` }, 201);
};
