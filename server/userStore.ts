import pg from 'pg';

const USERS_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  picture TEXT NOT NULL DEFAULT '',
  branch TEXT NOT NULL DEFAULT '',
  study_year TEXT NOT NULL DEFAULT '',
  college TEXT NOT NULL DEFAULT '',
  mobile TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS study_year TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS college TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS engineer_applications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  study_year TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

let pool: pg.Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing');
  }
  if (!pool) {
    pool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? undefined : { rejectUnauthorized: false },
      max: 1,
    });
  }
  return pool;
}

async function ready(): Promise<pg.Pool> {
  const current = getPool();
  if (!schemaReady) {
    const statements = USERS_SQL.split(';').map((statement) => statement.trim()).filter(Boolean);
    schemaReady = (async () => {
      for (const statement of statements) {
        await current.query(statement);
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
  return current;
}

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
  branch: string;
  year: string;
  college: string;
  mobile: string;
  gender: string;
  createdAt: string;
  lastSeenAt: string;
};

export async function upsertUser(user: {
  id: string;
  email: string;
  name: string;
  picture: string;
  branch: string;
  year: string;
  college: string;
  mobile: string;
  gender: string;
}): Promise<void> {
  const current = await ready();
  await current.query(
    `INSERT INTO users (id, email, name, picture, branch, study_year, college, mobile, gender)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       name = EXCLUDED.name,
       picture = EXCLUDED.picture,
       branch = EXCLUDED.branch,
       study_year = EXCLUDED.study_year,
       college = EXCLUDED.college,
       mobile = EXCLUDED.mobile,
       gender = EXCLUDED.gender,
       last_seen_at = NOW()`,
    [user.id, user.email, user.name, user.picture, user.branch, user.year, user.college, user.mobile, user.gender],
  );
}

export async function getUser(id: string): Promise<StoredUser | null> {
  const current = await ready();
  const result = await current.query<{
    id: string;
    email: string;
    name: string;
    picture: string;
    branch: string;
    study_year: string;
    college: string;
    mobile: string;
    gender: string;
    created_at: string;
    last_seen_at: string;
  }>(
    `SELECT id, email, name, picture, branch, study_year, college, mobile, gender, created_at, last_seen_at
     FROM users WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapUser(row);
}

export async function countUsers(): Promise<number> {
  const current = await ready();
  const result = await current.query<{ n: number }>('SELECT COUNT(*)::int AS n FROM users');
  return Number(result.rows[0]?.n ?? 0);
}

function mapUser(row: {
  id: string;
  email: string;
  name: string;
  picture: string;
  branch: string;
  study_year: string;
  college: string;
  mobile: string;
  gender: string;
  created_at: string;
  last_seen_at: string;
}): StoredUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
    branch: row.branch,
    year: row.study_year,
    college: row.college,
    mobile: row.mobile,
    gender: row.gender,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
  };
}

export async function insertEngineerApplication(entry: {
  name: string;
  year: string;
  email: string;
  linkedin: string;
  contact: string;
}): Promise<void> {
  const current = await ready();
  await current.query(
    `INSERT INTO engineer_applications (name, study_year, email, linkedin, contact)
     VALUES ($1, $2, $3, $4, $5)`,
    [entry.name, entry.year, entry.email, entry.linkedin, entry.contact],
  );
}

export function profileIsComplete(user: StoredUser): boolean {
  return Boolean(user.name && user.branch && user.year && user.college && user.mobile && user.gender);
}

export async function listUsers(): Promise<StoredUser[]> {
  const current = await ready();
  const result = await current.query<{
    id: string;
    email: string;
    name: string;
    picture: string;
    branch: string;
    study_year: string;
    college: string;
    mobile: string;
    gender: string;
    created_at: string;
    last_seen_at: string;
  }>(
    `SELECT id, email, name, picture, branch, study_year, college, mobile, gender, created_at, last_seen_at
     FROM users ORDER BY last_seen_at DESC`,
  );
  return result.rows.map(mapUser);
}
