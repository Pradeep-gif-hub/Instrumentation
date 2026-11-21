import type { IncomingHttpHeaders } from 'node:http';
import { readSession } from './authHandler.ts';
import { saveSiteFeedback } from './userStore.ts';

const YEARS = new Set(['1st year', '2nd year', '3rd year', '4th year']);

type FeedbackResponse = {
  status: (code: number) => FeedbackResponse;
  json: (body: unknown) => void;
};

type FeedbackRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  body?: unknown;
};

function clip(value: unknown, max: number): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function readRating(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  const text = String(value ?? '').trim();
  if (!/^\d{1,2}$/.test(text)) return null;
  return Number(text);
}

function readForm(body: unknown): { name: string; email: string; year: string; feedback: string; rating: number | null } {
  let value = body;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) value = value.toString('utf8');
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return { name: '', email: '', year: '', feedback: '', rating: null };
    }
  }
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return {
    name: clip(record.name, 80),
    email: clip(record.email, 120).toLowerCase(),
    year: clip(record.year, 20),
    feedback: String(record.feedback ?? '').replace(/\s+/g, ' ').trim().slice(0, 2000),
    rating: readRating(record.rating),
  };
}

export async function handleFeedbackHttp(req: FeedbackRequest, res: FeedbackResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = readSession(req.headers.cookie);
  if (!session) {
    res.status(401).json({ error: 'Sign in before sending feedback.' });
    return;
  }

  const form = readForm(req.body);
  if (form.name.length < 2) {
    res.status(400).json({ error: 'Enter your name.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    res.status(400).json({ error: 'Enter your email.' });
    return;
  }
  if (!YEARS.has(form.year)) {
    res.status(400).json({ error: 'Choose your year.' });
    return;
  }
  if (form.feedback.length < 8) {
    res.status(400).json({ error: 'Write a short review of the site.' });
    return;
  }
  if (form.rating === null || form.rating < 1 || form.rating > 10) {
    res.status(400).json({ error: 'Rate the site with a whole number from 1 to 10.' });
    return;
  }

  try {
    await saveSiteFeedback({
      userId: session.sub,
      accountEmail: session.email,
      accountName: session.name,
      name: form.name,
      email: form.email,
      year: form.year,
      feedback: form.feedback,
      rating: form.rating,
    });
  } catch {
    res.status(503).json({ error: 'That could not be saved. Try again.' });
    return;
  }

  res.status(200).json({ feedbackDone: true });
}
