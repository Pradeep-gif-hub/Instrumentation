import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { InstrumentaDatabase } from './db/database.ts';
import type { AcademicSubject } from '../src/types/engineering.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 4100);

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const db = new InstrumentaDatabase();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'instrumenta-api', timestamp: new Date().toISOString() });
});

// Bookmarks
app.get('/api/bookmarks', (_req, res) => {
  res.json({ items: db.listBookmarks() });
});

app.post('/api/bookmarks', (req, res) => {
  const { id, itemType, title, subtitle, route } = req.body ?? {};
  if (!id || !itemType || !title || !route) {
    res.status(400).json({ error: 'Missing required bookmark fields (id, itemType, title, route).' });
    return;
  }
  const items = db.upsertBookmark({
    id: String(id),
    itemType,
    title: String(title),
    subtitle: String(subtitle ?? ''),
    route: String(route),
  });
  res.json({ items });
});

app.delete('/api/bookmarks/:id', (req, res) => {
  const items = db.deleteBookmark(req.params.id);
  res.json({ items });
});

// Academic Roadmap Editable Allocations
app.get('/api/roadmap', (_req, res) => {
  res.json({ subjects: db.listAcademicSubjects() });
});

app.post('/api/roadmap', (req, res) => {
  const payload = req.body as AcademicSubject;
  if (!payload?.name || !payload?.code || !payload?.semester) {
    res.status(400).json({ error: 'Missing required subject fields (semester, code, name).' });
    return;
  }
  const subject: AcademicSubject = {
    ...payload,
    id: payload.id || `custom-sem${payload.semester}-${Date.now()}`,
    credits: Number(payload.credits) || 3,
    isCustom: payload.isCustom ?? true,
    units: Array.isArray(payload.units) && payload.units.length > 0 ? payload.units : [
      {
        unitNumber: 1,
        title: 'Foundations & Principles',
        hours: 10,
        topics: [{ name: 'Core Concepts', subtopics: ['Overview', 'Engineering Applications'] }],
      },
    ],
  };
  res.json({ subjects: db.upsertAcademicSubject(subject) });
});

app.put('/api/roadmap/:id', (req, res) => {
  const payload = req.body as AcademicSubject;
  if (!payload?.name || !payload?.code) {
    res.status(400).json({ error: 'Invalid subject payload.' });
    return;
  }
  const subjects = db.upsertAcademicSubject({ ...payload, id: req.params.id });
  res.json({ subjects });
});

app.delete('/api/roadmap/:id', (req, res) => {
  res.json({ subjects: db.deleteAcademicSubject(req.params.id) });
});

app.post('/api/roadmap/reset', (_req, res) => {
  res.json({ subjects: db.resetAcademicSubjects() });
});

// Interview Progress
app.get('/api/progress', (_req, res) => {
  res.json({ attempts: db.listQuestionAttempts() });
});

app.post('/api/progress', (req, res) => {
  const { questionId, isCorrect, selectedOption, userNumericAnswer } = req.body ?? {};
  if (!questionId || typeof isCorrect !== 'boolean') {
    res.status(400).json({ error: 'Missing questionId or isCorrect boolean.' });
    return;
  }
  const attempts = db.upsertQuestionAttempt({
    questionId: String(questionId),
    isCorrect,
    selectedOption: typeof selectedOption === 'number' ? selectedOption : undefined,
    userNumericAnswer: typeof userNumericAnswer === 'number' ? userNumericAnswer : undefined,
  });
  res.json({ attempts });
});

app.delete('/api/progress', (_req, res) => {
  res.json({ attempts: db.clearQuestionAttempts() });
});

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '../dist');
  app.use(express.static(distDir));
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`INSTRUMENTA API listening on http://127.0.0.1:${PORT}`);
});

