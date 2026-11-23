import type { IncomingHttpHeaders } from 'node:http';
import { isAdminCookie, readSession } from './authHandler.ts';
import { beatPresence, leavePresence, listLivePeople } from './userStore.ts';

type PresenceResponse = {
  status: (code: number) => PresenceResponse;
  json: (body: unknown) => void;
};

type PresenceRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  body?: unknown;
};

const ID_PATTERN = /^[A-Za-z0-9_-]{8,80}$/;

function readBody(body: unknown): Record<string, unknown> {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (body && typeof body === 'object') return body as Record<string, unknown>;
  return {};
}

function cleanId(value: unknown): string | null {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) return null;
  return value;
}

function cleanPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/')) return '/';
  return value.slice(0, 180);
}

export async function handlePresenceHttp(req: PresenceRequest, res: PresenceResponse) {
  const method = (req.method || 'GET').toUpperCase();

  if (method === 'GET') {
    if (!isAdminCookie(req.headers.cookie)) {
      res.status(403).json({ error: 'Not allowed.' });
      return;
    }
    try {
      const people = await listLivePeople();
      res.status(200).json({ count: people.length, people });
    } catch {
      res.status(503).json({ error: 'Live visitors could not be loaded.' });
    }
    return;
  }

  if (method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = readBody(req.body);
  const tabId = cleanId(body.tabId);
  const clientId = cleanId(body.clientId);
  if (!tabId || !clientId) {
    res.status(400).json({ error: 'Missing visitor id.' });
    return;
  }

  try {
    if (body.leave === true) {
      await leavePresence(tabId);
      res.status(200).json({ ok: true });
      return;
    }
    const session = readSession(req.headers.cookie);
    await beatPresence({
      tabId,
      clientId,
      userId: session?.sub || '',
      name: session?.name || '',
      email: session?.email || '',
      path: cleanPath(body.path),
    });
    res.status(200).json({ ok: true });
  } catch {
    res.status(503).json({ error: 'Presence could not be saved.' });
  }
}
