import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '@/types/engineering';

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '').replace(/\/+$/, '');

function withBase(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 3000) : null;
  try {
    const res = await fetch(withBase(url), {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      signal: controller?.signal,
      ...init,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(body || `HTTP ${res.status}`);
    }
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      throw new Error('Non-JSON response from API endpoint');
    }
    return (await res.json()) as T;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const api = {
  health: () => requestJson<{ status: string; service: string; timestamp: string }>('/api/health'),

  listBookmarks: () => requestJson<{ items: BookmarkItem[] }>('/api/bookmarks'),
  upsertBookmark: (item: Omit<BookmarkItem, 'createdAt'>) =>
    requestJson<{ items: BookmarkItem[] }>('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  deleteBookmark: (id: string) =>
    requestJson<{ items: BookmarkItem[] }>(`/api/bookmarks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  listRoadmap: () => requestJson<{ subjects: AcademicSubject[] }>('/api/roadmap'),
  createSubject: (subject: Partial<AcademicSubject>) =>
    requestJson<{ subjects: AcademicSubject[] }>('/api/roadmap', {
      method: 'POST',
      body: JSON.stringify(subject),
    }),
  updateSubject: (id: string, subject: AcademicSubject) =>
    requestJson<{ subjects: AcademicSubject[] }>(`/api/roadmap/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(subject),
    }),
  deleteSubject: (id: string) =>
    requestJson<{ subjects: AcademicSubject[] }>(`/api/roadmap/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  resetRoadmap: () =>
    requestJson<{ subjects: AcademicSubject[] }>('/api/roadmap/reset', { method: 'POST' }),

  listProgress: () => requestJson<{ attempts: QuestionAttempt[] }>('/api/progress'),
  recordAttempt: (attempt: Omit<QuestionAttempt, 'answeredAt'>) =>
    requestJson<{ attempts: QuestionAttempt[] }>('/api/progress', {
      method: 'POST',
      body: JSON.stringify(attempt),
    }),
  clearProgress: () =>
    requestJson<{ attempts: QuestionAttempt[] }>('/api/progress', { method: 'DELETE' }),
};

