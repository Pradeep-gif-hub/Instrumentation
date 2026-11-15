import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';
import { InstrumentaDatabase } from './db/database.ts';

const COOKIE = 'instrumenta_session';
const db = new InstrumentaDatabase();

type AuthResponse = {
  status: (code: number) => AuthResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

type AuthRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  body?: { credential?: string };
};

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  exp: number;
};

function sessionSecret(): string {
  return process.env.SESSION_SECRET || 'instrumenta-dev-session';
}

function adminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || 'pradeepka.ic.24@nitj.ac.in,pawasthi063@gmail.com';
  return new Set(
    raw
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function sign(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const mac = createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

function readSession(cookieHeader: string | undefined): SessionPayload | null {
  if (!cookieHeader) return null;
  const pair = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE}=`));
  if (!pair) return null;
  const token = decodeURIComponent(pair.slice(COOKIE.length + 1));
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  const expected = createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function writeSessionCookie(res: AuthResponse, token: string | null) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const value = token
    ? `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000${secure}`
    : `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
  res.setHeader('Set-Cookie', value);
}

export async function handleAuthHttp(req: AuthRequest, res: AuthResponse) {
  const method = (req.method || 'GET').toUpperCase();
  const session = readSession(req.headers.cookie);

  if (method === 'GET') {
    const isAdmin = Boolean(session && adminEmails().has(session.email.toLowerCase()));
    res.status(200).json({
      user: session ? { email: session.email, name: session.name } : null,
      isAdmin,
      userCount: isAdmin ? await db.countUsers() : undefined,
      users: isAdmin ? await db.listUsers() : undefined,
    });
    return;
  }

  if (method === 'DELETE') {
    writeSessionCookie(res, null);
    res.status(200).json({ user: null });
    return;
  }

  if (method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const credential = String(req.body?.credential || '');
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
  if (!credential || !clientId) {
    res.status(400).json({ error: 'Google sign-in is not configured yet.' });
    return;
  }

  const googleRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  );
  if (!googleRes.ok) {
    res.status(401).json({ error: 'Google could not verify that sign-in.' });
    return;
  }
  const profile = (await googleRes.json()) as {
    aud?: string;
    sub?: string;
    email?: string;
    email_verified?: string;
    name?: string;
    picture?: string;
  };
  if (profile.aud !== clientId || profile.email_verified !== 'true' || !profile.sub || !profile.email) {
    res.status(401).json({ error: 'That Google account could not be accepted.' });
    return;
  }

  const name = profile.name || profile.email;
  await db.upsertUser({
    id: profile.sub,
    email: profile.email,
    name,
    picture: profile.picture || '',
  });
  const token = sign({
    sub: profile.sub,
    email: profile.email,
    name,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  writeSessionCookie(res, token);
  const isAdmin = adminEmails().has(profile.email.toLowerCase());
  res.status(200).json({
    user: { email: profile.email, name },
    isAdmin,
    userCount: isAdmin ? await db.countUsers() : undefined,
  });
}
