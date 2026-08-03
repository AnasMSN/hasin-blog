-- Single admin account (created out-of-band via `make admin-create`, never through a web route).
-- password_hash = SHA-256(client-side 600k-iteration PBKDF2(password, salt)) -- see src/lib/password.ts
-- for why the expensive stretching step happens in the browser rather than here.
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Server-side session store. The cookie only ever holds the random session id.
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  user_agent TEXT,
  ip TEXT
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Failed login attempts, used to lock out an identifier (ip or username) for a cooldown window.
CREATE TABLE login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  identifier TEXT NOT NULL,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_login_attempts_identifier ON login_attempts(identifier, attempted_at);

-- Blog posts. Mirrors the frontmatter fields used by the legacy _posts markdown files
-- (title, date, categories) plus a markdown body that can include inline images.
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  categories TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_posts_date ON posts(date DESC);
