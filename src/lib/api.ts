import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '@/types/engineering';

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
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

