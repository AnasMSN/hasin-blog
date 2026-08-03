const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

// Identifier is typically `login:<ip>:<username>` so a lockout is scoped to one
// ip+username pair and can't be used to lock a legitimate user out globally from a
// single attacker IP, nor let an attacker avoid lockout by rotating usernames.
export async function isLockedOut(db: D1Database, identifier: string): Promise<boolean> {
  // Compute the window entirely in SQLite (`datetime('now', '-N minutes')`) rather than
  // passing in a JS-computed timestamp: attempted_at is stored via SQLite's own
  // `datetime('now')` (space-separated, no ms/offset), which does not string-compare
  // correctly against a JS `toISOString()` value (T-separated, with ms and a Z suffix).
  const row = await db
    .prepare(
      `SELECT COUNT(*) as count FROM login_attempts
       WHERE identifier = ? AND attempted_at > datetime('now', ?)`,
    )
    .bind(identifier, `-${WINDOW_MINUTES} minutes`)
    .first<{ count: number }>();
  return (row?.count ?? 0) >= MAX_ATTEMPTS;
}

export async function recordFailedAttempt(db: D1Database, identifier: string): Promise<void> {
  await db.prepare('INSERT INTO login_attempts (identifier) VALUES (?)').bind(identifier).run();
}

export async function clearAttempts(db: D1Database, identifier: string): Promise<void> {
  await db.prepare('DELETE FROM login_attempts WHERE identifier = ?').bind(identifier).run();
}
