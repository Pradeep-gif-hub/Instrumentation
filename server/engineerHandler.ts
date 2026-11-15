import { insertEngineerApplication } from './userStore.ts';

const YEARS = new Set(['1st year', '2nd year', '3rd year', '4th year']);

type EngineerRequest = {
  method?: string;
  body?: unknown;
};

type EngineerResponse = {
  status: (code: number) => EngineerResponse;
  json: (body: unknown) => void;
};

function clip(value: unknown, max: number): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function handleEngineerHttp(req: EngineerRequest, res: EngineerResponse) {
  if ((req.method || 'GET').toUpperCase() !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
  const name = clip(body.name, 80);
  const year = clip(body.year, 20);
  const email = clip(body.email, 120).toLowerCase();
  const linkedin = clip(body.linkedin, 200);
  const contact = clip(body.contact, 160);

  if (name.length < 2) {
    res.status(400).json({ error: 'Enter your name.' });
    return;
  }
  if (!YEARS.has(year)) {
    res.status(400).json({ error: 'Choose your year.' });
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Enter a valid email.' });
    return;
  }
  if (linkedin.length < 3) {
    res.status(400).json({ error: 'Add your LinkedIn.' });
    return;
  }
  if (contact.length < 5) {
    res.status(400).json({ error: 'Add your contact details.' });
    return;
  }

  try {
    await insertEngineerApplication({ name, year, email, linkedin, contact });
  } catch {
    res.status(503).json({ error: 'Could not save that just now.' });
    return;
  }

  res.status(200).json({ ok: true });
}
