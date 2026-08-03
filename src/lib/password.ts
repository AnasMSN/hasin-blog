// Password verification split across two cheap-vs-expensive steps, because Cloudflare
// Workers' free tier caps CPU time at 10ms per request — nowhere near enough for a
// properly-parameterized KDF (a 600k-iteration PBKDF2 alone takes ~250-300ms on
// comparable hardware). Moving the expensive part to the browser (its CPU, its time,
// no Workers billing implication) while keeping the server-side step cheap is what
// makes strong password stretching possible at all on the free plan:
//
//   stretchPassword (client, ~300ms, 600k-iteration PBKDF2-SHA256)
//     -> finalizeHash (server, <1ms, single SHA-256)
//     -> compared against the stored hash
//
// This still costs an attacker the full 600k-iteration effort per guess (the only way
// to reach a given finalizeHash output is to have derived the matching stretched value,
// which requires knowing/guessing the original password and re-running the expensive
// step) while keeping every Worker-side request comfortably under the CPU budget. It
// also means a stolen database row alone can't be replayed as a login credential,
// because what's stored is finalizeHash(stretched), not the stretched value itself —
// reversing a SHA-256 digest is infeasible, so an attacker can't reconstruct a valid
// login request from the database alone.
//
// This module only uses the Web Crypto API (crypto.subtle / crypto.getRandomValues),
// so the exact same code runs in the browser, in the Cloudflare Worker, and (as a
// deliberately duplicated copy — see scripts/create-admin.mjs) in the Node CLI script.

const ITERATIONS = 600_000;
const SALT_BYTES = 16;
const STRETCHED_BYTES = 32;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function generateSalt(): string {
  return toBase64(crypto.getRandomValues(new Uint8Array(SALT_BYTES)));
}

/** Expensive step (~hundreds of ms) — run this in the browser, never on the Worker. */
export async function stretchPassword(password: string, saltBase64: string): Promise<string> {
  const salt = fromBase64(saltBase64);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    STRETCHED_BYTES * 8,
  );
  return toBase64(new Uint8Array(bits));
}

/** Cheap step (<1ms) — safe to run on every Worker request. */
export async function finalizeHash(stretchedBase64: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', fromBase64(stretchedBase64));
  return toBase64(new Uint8Array(digest));
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
