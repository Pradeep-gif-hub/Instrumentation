import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { resolveCanonicalPath, type TopicFamilyKey } from '@/data/navigationTree';
import { DEFAULT_ACADEMIC_SUBJECTS } from '@/data/roadmapData';
import { api } from '@/lib/api';
import type { AcademicSubject, BookmarkItem, QuestionAttempt } from '@/types/engineering';

type ThemeMode = 'dark' | 'light';

export interface TreePreferences {
  expandedSubjects: string[];
  expandedFamilies: string[];
  treeCollapsedDesktop: boolean;
}

const DEFAULT_TREE_PREFS: TreePreferences = {
  expandedSubjects: [],
  expandedFamilies: [],
  treeCollapsedDesktop: false,
};

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
  // Navigation Tree State
  expandedSubjects: string[];
  expandedFamilies: string[];
  treeCollapsedDesktop: boolean;
  setTreeCollapsedDesktop: (collapsed: boolean) => void;
  mobileTreeOpen: boolean;
  setMobileTreeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  treeFamilyFilter: TopicFamilyKey | 'all';
  setTreeFamilyFilter: React.Dispatch<React.SetStateAction<TopicFamilyKey | 'all'>>;
  treeOnly3D: boolean;
  setTreeOnly3D: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSubjectNode: (subjectId: string) => void;
  toggleFamilyNode: (subjectId: string, familyKey: TopicFamilyKey) => void;
  expandSubjectAll: (subjectId: string, familyKeys: TopicFamilyKey[]) => void;
  collapseSubjectAll: (subjectId: string, familyKeys: TopicFamilyKey[]) => void;
  expandSubjectFirstLevel: (subjectIds: string[]) => void;
  expandPathToInstrument: (instrumentId: string) => void;
  expandFamilyPath: (subjectId: string, familyKey: TopicFamilyKey) => void;
}

const STORAGE_KEYS = {
  theme: 'instrument-ai:theme-v2',
  bookmarks: 'instrumenta:bookmarks',
  subjects: 'instrumenta:subjects',
  attempts: 'instrumenta:attempts',
  treePrefs: 'instrumenta:tree_prefs',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota/privacy mode errors
  }
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = readStorage<BookmarkItem[]>(STORAGE_KEYS.bookmarks, []);
    return Array.isArray(saved) ? saved : [];
  });
  const [subjects, setSubjects] = useState<AcademicSubject[]>(() => {
    const saved = readStorage<AcademicSubject[]>(STORAGE_KEYS.subjects, DEFAULT_ACADEMIC_SUBJECTS);
    return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_ACADEMIC_SUBJECTS;
  });
  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() => {
    const saved = readStorage<QuestionAttempt[]>(STORAGE_KEYS.attempts, []);
    return Array.isArray(saved) ? saved : [];
  });
  const [treePrefs, setTreePrefs] = useState<TreePreferences>(() => {
    const saved = readStorage<TreePreferences>(STORAGE_KEYS.treePrefs, DEFAULT_TREE_PREFS);
    return {
      expandedSubjects: Array.isArray(saved?.expandedSubjects) ? saved.expandedSubjects : [],
      expandedFamilies: Array.isArray(saved?.expandedFamilies) ? saved.expandedFamilies : [],
      treeCollapsedDesktop: Boolean(saved?.treeCollapsedDesktop),
    };
  });
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const [treeFamilyFilter, setTreeFamilyFilter] = useState<TopicFamilyKey | 'all'>('all');
  const [treeOnly3D, setTreeOnly3D] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.bookmarks, bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.subjects, subjects);
  }, [subjects]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.attempts, attempts);
  }, [attempts]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.treePrefs, treePrefs);
    if (apiConnected) {
      api.setPreference('tree_prefs', treePrefs).catch(() => {
        // fallback cleanly to localStorage
      });
    }
  }, [treePrefs, apiConnected]);

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

  // Load persisted data from SQLite/Express API if reachable, else remain in browser storage mode
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await api.health();
        const [bmRes, rmRes, prRes, prefRes] = await Promise.all([
          api.listBookmarks(),
          api.listRoadmap(),
          api.listProgress(),
          api.getPreference<TreePreferences>('tree_prefs').catch(() => ({ key: 'tree_prefs', value: null })),
        ]);
        if (!active) return;
        setBookmarks(bmRes.items);
        if (rmRes.subjects.length > 0) setSubjects(rmRes.subjects);
        setAttempts(prRes.attempts);
        if (prefRes?.value) {
          setTreePrefs((prev) => ({
            expandedSubjects: Array.from(
              new Set([
                ...(Array.isArray(prefRes.value?.expandedSubjects) ? prefRes.value.expandedSubjects : []),
                ...prev.expandedSubjects,
              ]),
            ),
            expandedFamilies: Array.from(
              new Set([
                ...(Array.isArray(prefRes.value?.expandedFamilies) ? prefRes.value.expandedFamilies : []),
                ...prev.expandedFamilies,
              ]),
            ),
            treeCollapsedDesktop: prev.treeCollapsedDesktop || Boolean(prefRes.value?.treeCollapsedDesktop),
          }));
        }
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

  const setTreeCollapsedDesktop = useCallback((collapsed: boolean) => {
    setTreePrefs((prev) => ({ ...prev, treeCollapsedDesktop: collapsed }));
  }, []);

  const toggleSubjectNode = useCallback((subjectId: string) => {
    setTreePrefs((prev) => {
      const open = prev.expandedSubjects.includes(subjectId);
      return {
        ...prev,
        expandedSubjects: open
          ? prev.expandedSubjects.filter((s) => s !== subjectId)
          : [...prev.expandedSubjects, subjectId],
      };
    });
  }, []);

  const toggleFamilyNode = useCallback((subjectId: string, familyKey: TopicFamilyKey) => {
    const key = `${subjectId}:${familyKey}`;
    setTreePrefs((prev) => {
      const open = prev.expandedFamilies.includes(key);
      return {
        ...prev,
        expandedSubjects: prev.expandedSubjects.includes(subjectId)
          ? prev.expandedSubjects
          : [...prev.expandedSubjects, subjectId],
        expandedFamilies: open
          ? prev.expandedFamilies.filter((f) => f !== key)
          : [...prev.expandedFamilies, key],
      };
    });
  }, []);

  const expandSubjectAll = useCallback((subjectId: string, familyKeys: TopicFamilyKey[]) => {
    const keys = familyKeys.map((fk) => `${subjectId}:${fk}`);
    setTreePrefs((prev) => ({
      ...prev,
      expandedSubjects: prev.expandedSubjects.includes(subjectId)
        ? prev.expandedSubjects
        : [...prev.expandedSubjects, subjectId],
      expandedFamilies: Array.from(new Set([...prev.expandedFamilies, ...keys])),
    }));
  }, []);

  const collapseSubjectAll = useCallback((subjectId: string, familyKeys: TopicFamilyKey[]) => {
    const removeSet = new Set(familyKeys.map((fk) => `${subjectId}:${fk}`));
    setTreePrefs((prev) => ({
      ...prev,
      expandedFamilies: prev.expandedFamilies.filter((f) => !removeSet.has(f)),
    }));
  }, []);

  const expandSubjectFirstLevel = useCallback((subjectIds: string[]) => {
    setTreePrefs((prev) => ({
      ...prev,
      treeCollapsedDesktop: false,
      expandedSubjects: Array.from(new Set([...prev.expandedSubjects, ...subjectIds])),
    }));
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileTreeOpen(true);
    }
  }, []);

  const expandPathToInstrument = useCallback((instrumentId: string) => {
    const resolved = resolveCanonicalPath(instrumentId);
    if (!resolved) return;
    const famKey = `${resolved.subject.id}:${resolved.family.key}`;
    setTreePrefs((prev) => {
      const hasSubj = prev.expandedSubjects.includes(resolved.subject.id);
      const hasFam = prev.expandedFamilies.includes(famKey);
      if (hasSubj && hasFam) return prev;
      return {
        ...prev,
        expandedSubjects: hasSubj ? prev.expandedSubjects : [...prev.expandedSubjects, resolved.subject.id],
        expandedFamilies: hasFam ? prev.expandedFamilies : [...prev.expandedFamilies, famKey],
      };
    });
  }, []);

  const expandFamilyPath = useCallback((subjectId: string, familyKey: TopicFamilyKey) => {
    const famKey = `${subjectId}:${familyKey}`;
    setTreePrefs((prev) => ({
      ...prev,
      treeCollapsedDesktop: false,
      expandedSubjects: prev.expandedSubjects.includes(subjectId)
        ? prev.expandedSubjects
        : [...prev.expandedSubjects, subjectId],
      expandedFamilies: prev.expandedFamilies.includes(famKey)
        ? prev.expandedFamilies
        : [...prev.expandedFamilies, famKey],
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEYS.theme, next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (item: Omit<BookmarkItem, 'createdAt'>) => {
      const exists = bookmarks.some((b) => b.id === item.id);
      if (apiConnected) {
        try {
          const res = exists
            ? await api.deleteBookmark(item.id)
            : await api.upsertBookmark(item);
          setBookmarks(res.items);
          return;
        } catch {
          // fall through to browser storage
        }
      }
      setBookmarks((prev) =>
        exists
          ? prev.filter((b) => b.id !== item.id)
          : [{ ...item, createdAt: new Date().toISOString() }, ...prev],
      );
    },
    [bookmarks, apiConnected],
  );

  const removeBookmark = useCallback(
    async (id: string) => {
      if (apiConnected) {
        try {
          const res = await api.deleteBookmark(id);
          setBookmarks(res.items);
          return;
        } catch {
          // fall through to browser storage
        }
      }
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    },
    [apiConnected],
  );

  const saveSubject = useCallback(
    async (subject: AcademicSubject, isNew = false) => {
      if (apiConnected) {
        try {
          const res = isNew
            ? await api.createSubject(subject)
            : await api.updateSubject(subject.id, subject);
          setSubjects(res.subjects);
          return;
        } catch {
          // fall through to browser storage
        }
      }
      setSubjects((prev) => {
        const exists = prev.some((s) => s.id === subject.id);
        return exists ? prev.map((s) => (s.id === subject.id ? subject : s)) : [...prev, subject];
      });
    },
    [apiConnected],
  );

  const deleteSubject = useCallback(
    async (id: string) => {
      if (apiConnected) {
        try {
          const res = await api.deleteSubject(id);
          setSubjects(res.subjects);
          return;
        } catch {
          // fall through to browser storage
        }
      }
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    },
    [apiConnected],
  );

  const resetSubjects = useCallback(async () => {
    if (apiConnected) {
      try {
        const res = await api.resetRoadmap();
        setSubjects(res.subjects);
        return;
      } catch {
        // fall through to browser storage
      }
    }
    setSubjects(DEFAULT_ACADEMIC_SUBJECTS);
  }, [apiConnected]);

  const submitAttempt = useCallback(
    async (attempt: Omit<QuestionAttempt, 'answeredAt'>) => {
      if (apiConnected) {
        try {
          const res = await api.recordAttempt(attempt);
          setAttempts(res.attempts);
          return;
        } catch {
          // fall through to browser storage
        }
      }
      setAttempts((prev) => [
        ...prev.filter((a) => a.questionId !== attempt.questionId),
        { ...attempt, answeredAt: new Date().toISOString() },
      ]);
    },
    [apiConnected],
  );

  const resetProgress = useCallback(async () => {
    if (apiConnected) {
      try {
        const res = await api.clearProgress();
        setAttempts(res.attempts);
        return;
      } catch {
        // fall through to browser storage
      }
    }
    setAttempts([]);
  }, [apiConnected]);

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
        expandedSubjects: treePrefs.expandedSubjects,
        expandedFamilies: treePrefs.expandedFamilies,
        treeCollapsedDesktop: treePrefs.treeCollapsedDesktop,
        setTreeCollapsedDesktop,
        mobileTreeOpen,
        setMobileTreeOpen,
        treeFamilyFilter,
        setTreeFamilyFilter,
        treeOnly3D,
        setTreeOnly3D,
        toggleSubjectNode,
        toggleFamilyNode,
        expandSubjectAll,
        collapseSubjectAll,
        expandSubjectFirstLevel,
        expandPathToInstrument,
        expandFamilyPath,
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

