import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_ACADEMIC_SUBJECTS } from '@/data/roadmapData';
import { api } from '@/lib/api';
import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '@/types/engineering';

type ThemeMode = 'dark' | 'light';

interface AppContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  bookmarks: BookmarkItem[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (item: Omit<BookmarkItem, 'createdAt'>) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  subjects: AcademicSubject[];
  saveSubject: (subject: AcademicSubject, isNew?: boolean) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  resetSubjects: () => Promise<void>;
  attempts: QuestionAttempt[];
  submitAttempt: (attempt: Omit<QuestionAttempt, 'answeredAt'>) => Promise<void>;
  resetProgress: () => Promise<void>;
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookmarksOpen: boolean;
  setBookmarksOpen: React.Dispatch<React.SetStateAction<boolean>>;
  apiConnected: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem('instrumenta:theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [subjects, setSubjects] = useState<AcademicSubject[]>(DEFAULT_ACADEMIC_SUBJECTS);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('instrumenta:theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // Global keyboard shortcuts (Cmd/Ctrl+K or '/' for Search)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Load persisted data from SQLite API
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await api.health();
        const [bmRes, rmRes, prRes] = await Promise.all([
          api.listBookmarks(),
          api.listRoadmap(),
          api.listProgress(),
        ]);
        if (!active) return;
        setBookmarks(bmRes.items);
        if (rmRes.subjects.length > 0) setSubjects(rmRes.subjects);
        setAttempts(prRes.attempts);
        setApiConnected(true);
      } catch {
        if (!active) return;
        setApiConnected(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (item: Omit<BookmarkItem, 'createdAt'>) => {
      const exists = bookmarks.some((b) => b.id === item.id);
      if (exists) {
        try {
          const res = await api.deleteBookmark(item.id);
          setBookmarks(res.items);
        } catch {
          setBookmarks((prev) => prev.filter((b) => b.id !== item.id));
        }
      } else {
        try {
          const res = await api.upsertBookmark(item);
          setBookmarks(res.items);
        } catch {
          setBookmarks((prev) => [{ ...item, createdAt: new Date().toISOString() }, ...prev]);
        }
      }
    },
    [bookmarks],
  );

  const removeBookmark = useCallback(async (id: string) => {
    try {
      const res = await api.deleteBookmark(id);
      setBookmarks(res.items);
    } catch {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
  }, []);

  const saveSubject = useCallback(async (subject: AcademicSubject, isNew = false) => {
    try {
      const res = isNew
        ? await api.createSubject(subject)
        : await api.updateSubject(subject.id, subject);
      setSubjects(res.subjects);
    } catch {
      setSubjects((prev) => {
        const exists = prev.some((s) => s.id === subject.id);
        return exists ? prev.map((s) => (s.id === subject.id ? subject : s)) : [...prev, subject];
      });
    }
  }, []);

  const deleteSubject = useCallback(async (id: string) => {
    try {
      const res = await api.deleteSubject(id);
      setSubjects(res.subjects);
    } catch {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  const resetSubjects = useCallback(async () => {
    try {
      const res = await api.resetRoadmap();
      setSubjects(res.subjects);
    } catch {
      setSubjects(DEFAULT_ACADEMIC_SUBJECTS);
    }
  }, []);

  const submitAttempt = useCallback(async (attempt: Omit<QuestionAttempt, 'answeredAt'>) => {
    try {
      const res = await api.recordAttempt(attempt);
      setAttempts(res.attempts);
    } catch {
      setAttempts((prev) => [
        ...prev.filter((a) => a.questionId !== attempt.questionId),
        { ...attempt, answeredAt: new Date().toISOString() },
      ]);
    }
  }, []);

  const resetProgress = useCallback(async () => {
    try {
      const res = await api.clearProgress();
      setAttempts(res.attempts);
    } catch {
      setAttempts([]);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        bookmarks,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        subjects,
        saveSubject,
        deleteSubject,
        resetSubjects,
        attempts,
        submitAttempt,
        resetProgress,
        searchOpen,
        setSearchOpen,
        bookmarksOpen,
        setBookmarksOpen,
        apiConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

