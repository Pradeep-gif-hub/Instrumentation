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
ALTER TABLE users ADD COLUMN IF NOT EXISTS feedback_done BOOLEAN NOT NULL DEFAULT FALSE;
CREATE TABLE IF NOT EXISTS suggestions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  reason TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  study_year TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS study_year TEXT NOT NULL DEFAULT '';
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS site_rating SMALLINT;
CREATE UNIQUE INDEX IF NOT EXISTS suggestions_one_site_feedback_per_user
  ON suggestions (user_id)
  WHERE family = 'Site feedback' AND user_id <> '';
UPDATE users
SET feedback_done = TRUE
WHERE feedback_done = FALSE
  AND created_at >= TIMESTAMPTZ '2026-11-21 18:00:00+00'
  AND NOT EXISTS (
    SELECT 1 FROM suggestions
    WHERE suggestions.user_id = users.id AND suggestions.family = 'Site feedback'
  );
CREATE TABLE IF NOT EXISTS engineer_applications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  study_year TEXT NOT NULL,
  email TEXT NOT NULL,
  linkedin TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS live_tabs (
  tab_id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '/',
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS live_tabs_seen ON live_tabs (last_seen_at);
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
    `INSERT INTO users (id, email, name, picture, branch, study_year, college, mobile, gender, feedback_done)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
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

/** True when this account already sent site feedback. Null when the account row is missing. */
export async function hasSiteFeedback(id: string): Promise<boolean | null> {
  const current = await ready();
  const result = await current.query<{ feedback_done: boolean }>(
    'SELECT feedback_done FROM users WHERE id = $1',
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return Boolean(row.feedback_done);
}

export async function saveSiteFeedback(input: {
  userId: string;
  accountEmail: string;
  accountName: string;
  name: string;
  email: string;
  year: string;
  feedback: string;
  rating: number;
}): Promise<'saved' | 'already'> {
  const current = await ready();
  const client = await current.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [input.userId, input.accountEmail, input.accountName],
    );
    const locked = await client.query<{ feedback_done: boolean }>(
      'SELECT feedback_done FROM users WHERE id = $1 FOR UPDATE',
      [input.userId],
    );
    if (locked.rows[0]?.feedback_done) {
      await client.query('COMMIT');
      return 'already';
    }
    await client.query(
      `INSERT INTO suggestions (name, family, reason, link, contact_name, contact_email, status, study_year, user_id, site_rating)
       VALUES ($1, 'Site feedback', $2, '', $3, $4, 'new', $5, $6, $7)`,
      [input.name, input.feedback, input.name, input.email, input.year, input.userId, input.rating],
    );
    await client.query('UPDATE users SET feedback_done = TRUE WHERE id = $1', [input.userId]);
    await client.query('COMMIT');
    return 'saved';
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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

export type LivePerson = {
  id: string;
  name: string;
  email: string;
  path: string;
  lastSeenAt: string;
};

export async function beatPresence(entry: {
  tabId: string;
  clientId: string;
  userId: string;
  name: string;
  email: string;
  path: string;
}): Promise<void> {
  const current = await ready();
  await current.query(
    `INSERT INTO live_tabs (tab_id, client_id, user_id, name, email, path, last_seen_at, left_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NULL)
     ON CONFLICT (tab_id) DO UPDATE
     SET client_id = EXCLUDED.client_id,
         user_id = EXCLUDED.user_id,
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         path = EXCLUDED.path,
         last_seen_at = NOW(),
         left_at = NULL`,
    [entry.tabId, entry.clientId, entry.userId, entry.name, entry.email, entry.path],
  );
}

export async function leavePresence(tabId: string): Promise<void> {
  const current = await ready();
  await current.query(`UPDATE live_tabs SET left_at = NOW() WHERE tab_id = $1`, [tabId]);
}

export async function listLivePeople(): Promise<LivePerson[]> {
  const current = await ready();
  await current.query(`DELETE FROM live_tabs WHERE last_seen_at < NOW() - INTERVAL '1 day'`);
  const result = await current.query<{
    id: string;
    name: string;
    email: string;
    path: string;
    last_seen_at: string;
  }>(
    `SELECT
       CASE WHEN user_id <> '' THEN 'u:' || user_id ELSE 'c:' || client_id END AS id,
       MAX(name) AS name,
       MAX(email) AS email,
       (ARRAY_AGG(path ORDER BY last_seen_at DESC))[1] AS path,
       MAX(last_seen_at) AS last_seen_at
     FROM live_tabs
     WHERE left_at IS NULL
       AND last_seen_at > NOW() - INTERVAL '40 seconds'
     GROUP BY 1
     ORDER BY MAX(last_seen_at) DESC`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    path: row.path,
    lastSeenAt: row.last_seen_at,
  }));
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
