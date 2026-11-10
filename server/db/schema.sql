-- SQLite Schema for INSTRUMENTA (PostgreSQL migration path in postgres.schema.sql)

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('instrument', 'subject', 'question', 'tool', 'module')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  route TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS academic_allocations (
  id TEXT PRIMARY KEY,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 6),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 10),
  category TEXT NOT NULL,
  overview TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  is_custom INTEGER NOT NULL DEFAULT 0,
  units_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS question_attempts (
  question_id TEXT PRIMARY KEY,
  is_correct INTEGER NOT NULL,
  selected_option INTEGER,
  user_numeric_answer REAL,
  answered_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS preferences (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  reason TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

