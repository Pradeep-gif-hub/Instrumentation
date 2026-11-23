import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';
import { readSession } from './authHandler.ts';
import { semesterFolderId } from './semesterFolders.ts';

const CACHE_MS = 5 * 60 * 1000;

type NotesResponse = {
  status: (code: number) => NotesResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  send: (body: Buffer) => void;
};

type NotesRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  url?: string;
  query?: Record<string, unknown>;
};

type NoteKind = 'folder' | 'file';

type StoredItem = {
  id: string;
  name: string;
  kind: NoteKind;
};

export type NoteItem = {
  ref: string;
  name: string;
  kind: NoteKind;
};

type Listing = { title: string; items: StoredItem[] };
type NoteRef = { id: string; name: string; kind: NoteKind };

const cache = new Map<string, { at: number; listing: Listing }>();

function notesSecret(): string {
  return process.env.SESSION_SECRET || 'instrumenta-dev-session';
}

function signRef(item: StoredItem): string {
  const body = Buffer.from(JSON.stringify({ id: item.id, name: item.name, kind: item.kind })).toString('base64url');
  const mac = createHmac('sha256', notesSecret()).update(`note:${body}`).digest('base64url');
  return `${body}.${mac}`;
}

function readRef(token: string): NoteRef | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac('sha256', notesSecret()).update(`note:${body}`).digest('base64url');
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as NoteRef;
    if (!payload?.id || (payload.kind !== 'file' && payload.kind !== 'folder')) return null;
    if (!/^[a-zA-Z0-9_-]{10,80}$/.test(payload.id)) return null;
    return payload;
  } catch {
    return null;
  }
}

function decodeText(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseFolderEmbed(html: string): Listing {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = decodeText(titleMatch?.[1] ?? '');
  const items: StoredItem[] = [];
  const entryRe =
    /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]*)<\/div>/g;
  for (const match of html.matchAll(entryRe)) {
    const href = match[2];
    const name = decodeText(match[3]);
    if (!name) continue;
    if (href.includes('/folders/')) {
      const id = href.match(/\/folders\/([a-zA-Z0-9_-]+)/)?.[1];
      if (id) items.push({ id, name, kind: 'folder' });
    } else if (href.includes('/file/d/')) {
      const id = href.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (id) items.push({ id, name, kind: 'file' });
    }
  }
  items.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return { title, items };
}

function queryValue(req: NotesRequest, key: string): string {
  const fromQuery = req.query?.[key];
  if (typeof fromQuery === 'string') return fromQuery;
  const raw = req.url ?? '';
  const search = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';
  return new URLSearchParams(search).get(key) ?? '';
}

function toPublic(listing: Listing): { title: string; items: NoteItem[] } {
  return {
    title: listing.title,
    items: listing.items.map((item) => ({ ref: signRef(item), name: item.name, kind: item.kind })),
  };
}

async function loadFolder(id: string): Promise<Listing> {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.listing;
  const response = await fetch(`https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(id)}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!response.ok) throw new Error('folder');
  const listing = parseFolderEmbed(await response.text());
  cache.set(id, { at: Date.now(), listing });
  return listing;
}

async function fetchDriveFile(id: string): Promise<Response> {
  const first = await fetch(`https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const type = first.headers.get('content-type') || '';
  if (!type.includes('text/html')) return first;
  const html = await first.text();
  const action = html.match(/action="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
  const uuid = html.match(/name="uuid" value="([^"]+)"/)?.[1];
  const confirm = html.match(/name="confirm" value="([^"]+)"/)?.[1] ?? 't';
  if (action && uuid) {
    const url = new URL(action);
    url.searchParams.set('id', id);
    url.searchParams.set('export', 'download');
    url.searchParams.set('confirm', confirm);
    url.searchParams.set('uuid', uuid);
    return fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
  }
  return fetch(
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`,
    { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } },
  );
}

function contentTypeFor(name: string, header: string | null): string {
  const raw = (header || '').split(';')[0].trim().toLowerCase();
  if (raw && raw !== 'application/octet-stream' && !raw.includes('text/html')) return raw;
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  return raw || 'application/octet-stream';
}

async function sendFile(res: NotesResponse, file: NoteRef) {
  const downloaded = await fetchDriveFile(file.id);
  const headerType = downloaded.headers.get('content-type');
  if (!downloaded.ok || (headerType || '').includes('text/html')) {
    res.status(502).json({ error: 'That note could not be opened. Try again.' });
    return;
  }
  const bytes = Buffer.from(await downloaded.arrayBuffer());
  const type = contentTypeFor(file.name, headerType);
  const safeName = file.name.replace(/[\r\n"]/g, '') || 'note';
  res.status(200);
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Length', String(bytes.length));
  res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(bytes);
}

export async function handleNotesHttp(req: NotesRequest, res: NotesResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!readSession(req.headers.cookie)) {
    res.status(401).json({ error: 'Sign in to read the notes.' });
    return;
  }

  const view = queryValue(req, 'view');
  if (view) {
    const file = readRef(view);
    if (!file || file.kind !== 'file') {
      res.status(403).json({ error: 'That note is not available.' });
      return;
    }
    try {
      await sendFile(res, file);
    } catch {
      res.status(502).json({ error: 'That note could not be opened. Try again.' });
    }
    return;
  }

  const refToken = queryValue(req, 'ref');
  const semester = queryValue(req, 'semester');
  let folderId = '';
  if (refToken) {
    const folder = readRef(refToken);
    if (!folder || folder.kind !== 'folder') {
      res.status(403).json({ error: 'That notes folder is not available.' });
      return;
    }
    folderId = folder.id;
  } else {
    folderId = semesterFolderId(semester) ?? '';
    if (!folderId) {
      res.status(503).json({ error: 'Notes are not available right now.' });
      return;
    }
  }

  try {
    const listing = await loadFolder(folderId);
    res.status(200).json(toPublic(listing));
  } catch {
    res.status(502).json({ error: 'The notes could not be opened. Try again.' });
  }
}
