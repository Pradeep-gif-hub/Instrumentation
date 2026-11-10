-- PostgreSQL Migration-Ready DDL for INSTRUMENTA

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('instrument', 'subject', 'question', 'tool', 'module')),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  route TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academic_allocations (
  id TEXT PRIMARY KEY,
  semester SMALLINT NOT NULL CHECK (semester BETWEEN 1 AND 6),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  credits SMALLINT NOT NULL CHECK (credits BETWEEN 1 AND 10),
  category TEXT NOT NULL,
  overview TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  units_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_attempts (
  question_id TEXT PRIMARY KEY,
  is_correct BOOLEAN NOT NULL,
  selected_option INTEGER,
  user_numeric_answer DOUBLE PRECISION,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  reason TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

