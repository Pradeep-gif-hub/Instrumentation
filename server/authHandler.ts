import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';
import { countUsers, getUser, listUsers, upsertUser } from './userStore.ts';

const COOKIE = 'instrumenta_session';

type AuthResponse = {
  status: (code: number) => AuthResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

type AuthRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  body?: unknown;
};

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  exp: number;
};

type GoogleProfile = {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
};

function sessionSecret(): string {
  return process.env.SESSION_SECRET || 'instrumenta-dev-session';
}

function adminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || 'pradeepka.ic.24@nitj.ac.in,pawasthi063@gmail.com,pradeep240818@gmail.com';
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

const YEARS = new Set(['1st year', '2nd year', '3rd year', '4th year']);
const GENDERS = new Set(['Female', 'Male', 'Prefer not to say']);

export type SignupDetails = {
  name: string;
  branch: string;
  year: string;
  gmail: string;
  college: string;
  mobile: string;
  gender: string;
};

function clip(value: unknown, max: number): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function readSignup(body: unknown): { credential: string; details: SignupDetails } {
  let value = body;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) value = value.toString('utf8');
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return { credential: '', details: emptyDetails() };
    }
  }
  const record = value && typeof value === 'object' ? (value as { credential?: unknown; profile?: unknown }) : {};
  const profile = record.profile && typeof record.profile === 'object' ? (record.profile as Record<string, unknown>) : {};
  const mobile = clip(profile.mobile, 24).replace(/[^\d+]/g, '');
  return {
    credential: String(record.credential || ''),
    details: {
      name: clip(profile.name, 80),
      branch: clip(profile.branch, 80),
      year: clip(profile.year, 20),
      gmail: clip(profile.gmail, 120).toLowerCase(),
      college: clip(profile.college, 120),
      mobile,
      gender: clip(profile.gender, 40),
    },
  };
}

function emptyDetails(): SignupDetails {
  return { name: '', branch: '', year: '', gmail: '', college: '', mobile: '', gender: '' };
}

function formTouched(details: SignupDetails): boolean {
  return Object.values(details).some((value) => value.trim().length > 0);
}

function detailError(details: SignupDetails, googleEmail: string): string | null {
  if (!formTouched(details)) return null;
  if (details.name.length < 2) return 'Enter your name.';
  if (details.branch.length < 2) return 'Enter your branch.';
  if (!YEARS.has(details.year)) return 'Choose your year.';
  if (details.gmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.gmail)) return 'Enter your Gmail address.';
  if (details.gmail && details.gmail !== googleEmail.toLowerCase()) {
    return 'The Gmail in the form has to match the Google account you sign in with.';
  }
  if (details.college.length < 2) return 'Enter your college.';
  const digits = details.mobile.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return 'Enter a valid mobile number.';
  if (!GENDERS.has(details.gender)) return 'Choose a gender.';
  return null;
}

export async function handleAuthHttp(req: AuthRequest, res: AuthResponse) {
  const method = (req.method || 'GET').toUpperCase();
  const session = readSession(req.headers.cookie);

  if (method === 'GET') {
    if (!session) {
      res.status(200).json({ user: null, isAdmin: false });
      return;
    }
    const isAdmin = adminEmails().has(session.email.toLowerCase());
    try {
      const saved = await getUser(session.sub);
      res.status(200).json({
        user: { email: saved?.email || session.email, name: saved?.name || session.name },
        isAdmin,
        userCount: isAdmin ? await countUsers() : undefined,
        users: isAdmin ? await listUsers() : undefined,
      });
    } catch {
      res.status(200).json({
        user: { email: session.email, name: session.name },
        isAdmin,
        notice: 'Signed in, but the account list could not be loaded.',
      });
    }
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

  const { credential, details } = readSignup(req.body);
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
  const profile = (await googleRes.json()) as GoogleProfile;
  const verified = profile.email_verified === true || profile.email_verified === 'true';
  if (profile.aud !== clientId || !verified || !profile.sub || !profile.email) {
    res.status(401).json({ error: 'That Google account could not be accepted.' });
    return;
  }

  const problem = detailError(details, profile.email);
  if (problem) {
    res.status(400).json({ error: problem });
    return;
  }

  const name = details.name || profile.name || profile.email;
  try {
    await upsertUser({
      id: profile.sub,
      email: profile.email,
      name,
      picture: profile.picture || '',
      branch: details.branch,
      year: details.year,
      college: details.college,
      mobile: details.mobile.replace(/\D/g, ''),
      gender: details.gender,
    });
  } catch {
    res.status(503).json({ error: 'Your details could not be saved. The database is not connected yet.' });
    return;
  }

  const token = sign({
    sub: profile.sub,
    email: profile.email,
    name,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });
  writeSessionCookie(res, token);
  const isAdmin = adminEmails().has(profile.email.toLowerCase());
  let userCount: number | undefined;
  let users: Awaited<ReturnType<typeof listUsers>> | undefined;
  if (isAdmin) {
    try {
      userCount = await countUsers();
      users = await listUsers();
    } catch {
      userCount = undefined;
    }
  }
  res.status(200).json({
    user: { email: profile.email, name },
    isAdmin,
    userCount,
    users,
  });
}
