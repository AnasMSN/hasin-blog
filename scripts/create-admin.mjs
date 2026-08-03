#!/usr/bin/env node
// Creates (or resets the password of) the single admin account, directly in D1.
// Deliberately a CLI-only tool with no HTTP equivalent — there is no "/admin/setup"
// route in the app, so there is nothing for an attacker to reach over the network to
// bootstrap or take over the admin account. Run it locally, from a machine you trust.
//
// Usage:
//   node scripts/create-admin.mjs             # targets the local D1 (for dev)
//   node scripts/create-admin.mjs --remote    # targets the real, deployed D1

import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import readline from 'node:readline';

// --- Password hashing: intentionally duplicated from src/lib/password.ts (which is
// also used client-side in the login page) so this script has no build dependency.
// Keep the algorithm identical to src/lib/password.ts. See that file for the full
// rationale (client-side stretching to fit Cloudflare Workers' 10ms free-tier CPU
// budget): this script performs the same "stretch then finalize" steps a real login
// will, so the stored value is verifiable the same way. ---
const ITERATIONS = 600_000;
const SALT_BYTES = 16;
const STRETCHED_BYTES = 32;

function toBase64(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function generateSalt() {
  return toBase64(crypto.getRandomValues(new Uint8Array(SALT_BYTES)));
}

async function stretchPassword(password, saltBase64) {
  const salt = fromBase64(saltBase64);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    STRETCHED_BYTES * 8,
  );
  return toBase64(new Uint8Array(bits));
}

async function finalizeHash(stretchedBase64) {
  const digest = await crypto.subtle.digest('SHA-256', fromBase64(stretchedBase64));
  return toBase64(new Uint8Array(digest));
}
// --- end duplicated section ---

function promptVisible(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Reads a password from stdin without echoing it, byte-by-byte (raw mode). Uses numeric
// character codes throughout instead of literal control-character strings, since those
// are invisible and easy to get wrong silently.
function promptHidden(question) {
  const ENTER_CODES = [10, 13]; // LF, CR
  const CTRL_C_CODE = 3;
  const CTRL_D_CODE = 4;
  const BACKSPACE_CODES = [8, 127];

  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    const chars = [];
    const onData = (buf) => {
      for (const byte of buf) {
        if (ENTER_CODES.includes(byte)) {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(chars.join(''));
          return;
        }
        if (byte === CTRL_C_CODE || byte === CTRL_D_CODE) {
          process.stdout.write('\n');
          process.exit(1);
        }
        if (BACKSPACE_CODES.includes(byte)) {
          chars.pop();
          continue;
        }
        chars.push(String.fromCharCode(byte));
      }
    };
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', onData);
  });
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

async function main() {
  const args = process.argv.slice(2);
  const remote = args.includes('--remote');

  const usernameFlagIndex = args.indexOf('--username');
  let username = usernameFlagIndex !== -1 ? args[usernameFlagIndex + 1] : undefined;
  if (!username) {
    username = (await promptVisible('Admin username: ')).trim();
  }
  if (!username) {
    console.error('Username is required.');
    process.exit(1);
  }

  const password = await promptHidden('Admin password (min 12 chars): ');
  const confirm = await promptHidden('Confirm password: ');
  if (password !== confirm) {
    console.error('Passwords do not match.');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
  }

  console.log('Deriving password hash (this takes a moment)...');
  const salt = generateSalt();
  const stretched = await stretchPassword(password, salt);
  const passwordHash = await finalizeHash(stretched);
  const id = crypto.randomUUID();

  const sql = `INSERT INTO admin_users (id, username, salt, password_hash) VALUES ('${id}', '${sqlEscape(username)}', '${salt}', '${passwordHash}')
ON CONFLICT(username) DO UPDATE SET salt = excluded.salt, password_hash = excluded.password_hash;`;

  const tmpFile = join(tmpdir(), `admin-user-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql, 'utf8');
  try {
    const flag = remote ? '--remote' : '--local';
    execFileSync('npx', ['wrangler', 'd1', 'execute', 'hasin-site-db', flag, '--file', tmpFile], {
      stdio: 'inherit',
    });
    console.log(`\nAdmin user "${username}" is ready (${remote ? 'remote' : 'local'} database).`);
  } finally {
    unlinkSync(tmpFile);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
