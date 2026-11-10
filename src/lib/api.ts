import type {
  SuggestionActionResponse,
  SuggestionInputPayload,
} from '@/shared/suggestionValidation';
import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '@/types/engineering';

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '').replace(/\/+$/, '');

function withBase(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

export class ApiSubmissionError extends Error {
  status: number;
  field?: string;
  constructor(status: number, message: string, field?: string) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), 15000) : null;
  try {
    const res = await fetch(withBase(url), {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      signal: controller?.signal,
      ...init,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let parsedError = '';
      let parsedMessage = '';
      if ((res.headers.get('content-type') ?? '').includes('application/json')) {
        try {
          const parsed = JSON.parse(text) as { error?: string; message?: string };
          if (parsed?.error) parsedError = parsed.error;
          if (parsed?.message) parsedMessage = parsed.message;
        } catch {
          // ignore invalid json error body
        }
      }
      if (parsedMessage) {
        throw new ApiSubmissionError(res.status, parsedMessage, parsedError || undefined);
      }
      throw new ApiSubmissionError(
        res.status,
        parsedError || text || 'Could not send right now. Please try again.',
      );
    }
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      throw new ApiSubmissionError(502, 'Could not send right now. Please try again.');
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

  getPreference: <T = unknown>(key: string) =>
    requestJson<{ key: string; value: T | null }>(`/api/preferences/${encodeURIComponent(key)}`),
  setPreference: <T = unknown>(key: string, value: T) =>
    requestJson<{ key: string; value: T }>(`/api/preferences/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),

  requestSuggestionOtp: (payload: SuggestionInputPayload) =>
    requestJson<SuggestionActionResponse>('/api/suggestions', {
      method: 'POST',
      body: JSON.stringify({ ...payload, action: 'request-otp' }),
    }),

  verifySuggestionAndSubmit: (
    payload: SuggestionInputPayload & { otp: string; otpToken: string },
  ) =>
    requestJson<SuggestionActionResponse>('/api/suggestions', {
      method: 'POST',
      body: JSON.stringify({ ...payload, action: 'verify-submit' }),
    }),
};

