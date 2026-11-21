import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';
import { readSession } from './authHandler.ts';
import { SEMESTER_NOTES } from '../src/data/semesterNotes.ts';

const FOLDER_ID = /^[a-zA-Z0-9_-]{10,80}$/;
const ROOT_IDS = new Set<string>(SEMESTER_NOTES.map((note) => note.folderId));
const CACHE_MS = 5 * 60 * 1000;

type NotesResponse = {
  status: (code: number) => NotesResponse;
  json: (body: unknown) => void;
};

type NotesRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  url?: string;
  query?: Record<string, unknown>;
};

export type NoteItem = {
  id: string;
  name: string;
  kind: 'folder' | 'file';
  proof?: string;
};

type Listing = { title: string; items: NoteItem[] };

const cache = new Map<string, { at: number; listing: Listing }>();

function notesSecret(): string {
  return process.env.SESSION_SECRET || 'instrumenta-dev-session';
}

function signFolder(id: string): string {
  return createHmac('sha256', notesSecret()).update(`notes:${id}`).digest('base64url');
}

function proofMatches(id: string, proof: string): boolean {
  const expected = signFolder(id);
  const left = Buffer.from(proof);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
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
  const items: NoteItem[] = [];
  const entryRe =
    /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]*)<\/div>/g;
  for (const match of html.matchAll(entryRe)) {
    const href = match[2];
    const name = decodeText(match[3]);
    if (!name) continue;
    if (href.includes('/folders/')) {
      const id = href.match(/\/folders\/([a-zA-Z0-9_-]+)/)?.[1];
      if (id) items.push({ id, name, kind: 'folder', proof: signFolder(id) });
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

export async function handleNotesHttp(req: NotesRequest, res: NotesResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!readSession(req.headers.cookie)) {
    res.status(401).json({ error: 'Sign in to read the notes.' });
    return;
  }

  const folder = queryValue(req, 'folder');
  const proof = queryValue(req, 'proof');
  if (!FOLDER_ID.test(folder)) {
    res.status(400).json({ error: 'That notes folder is not available.' });
    return;
  }
  const allowed = ROOT_IDS.has(folder) || (proof.length > 0 && proofMatches(folder, proof));
  if (!allowed) {
    res.status(403).json({ error: 'That notes folder is not available.' });
    return;
  }

  try {
    const listing = await loadFolder(folder);
    res.status(200).json(listing);
  } catch {
    res.status(502).json({ error: 'The notes could not be opened. Try again.' });
  }
}
