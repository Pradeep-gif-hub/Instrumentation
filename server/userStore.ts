import pg from 'pg';

const USERS_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  picture TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    schemaReady = current.query(USERS_SQL).then(() => undefined).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
  return current;
}

export async function upsertUser(user: {
  id: string;
  email: string;
  name: string;
  picture: string;
}): Promise<void> {
  const current = await ready();
  await current.query(
    `INSERT INTO users (id, email, name, picture)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       name = EXCLUDED.name,
       picture = EXCLUDED.picture,
       last_seen_at = NOW()`,
    [user.id, user.email, user.name, user.picture],
  );
}

export async function countUsers(): Promise<number> {
  const current = await ready();
  const result = await current.query<{ n: number }>('SELECT COUNT(*)::int AS n FROM users');
  return Number(result.rows[0]?.n ?? 0);
}

export async function listUsers(): Promise<
  Array<{ id: string; email: string; name: string; picture: string; createdAt: string; lastSeenAt: string }>
> {
  const current = await ready();
  const result = await current.query<{
    id: string;
    email: string;
    name: string;
    picture: string;
    created_at: string;
    last_seen_at: string;
  }>('SELECT id, email, name, picture, created_at, last_seen_at FROM users ORDER BY last_seen_at DESC');
  return result.rows.map((row) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    picture: row.picture,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
  }));
}
