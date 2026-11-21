import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AuthUser = { email: string; name: string };
export type SignupDetails = {
  name: string;
  branch: string;
  year: string;
  gmail: string;
  college: string;
  mobile: string;
  gender: string;
};
export type SignedInAccount = {
  id: string;
  email: string;
  name: string;
  branch: string;
  year: string;
  college: string;
  mobile: string;
  gender: string;
};

type AuthResponse = {
  user: AuthUser | null;
  isAdmin: boolean;
  feedbackDone?: boolean;
  userCount?: number;
  users?: SignedInAccount[];
  notice?: string;
  error?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAdmin: boolean;
  feedbackDone: boolean;
  userCount?: number;
  users: SignedInAccount[];
  notice: string | null;
  error: string | null;
  loading: boolean;
  signIn: (credential: string, details: SignupDetails) => Promise<void>;
  signOut: () => Promise<void>;
  submitFeedback: (input: { name: string; email: string; year: string; feedback: string; rating: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readAuthResponse(res: Response): Promise<AuthResponse> {
  const data = (await res.json().catch(() => ({}))) as AuthResponse;
  if (!res.ok) {
    throw new Error(data.error || 'Sign-in could not be completed.');
  }
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [userCount, setUserCount] = useState<number | undefined>(undefined);
  const [users, setUsers] = useState<SignedInAccount[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apply = useCallback((data: AuthResponse) => {
    setUser(data.user);
    setIsAdmin(Boolean(data.isAdmin));
    setFeedbackDone(Boolean(data.feedbackDone));
    setUserCount(data.userCount);
    setUsers(Array.isArray(data.users) ? data.users : []);
    setNotice(data.notice || null);
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/auth', { credentials: 'include' })
      .then((res) => readAuthResponse(res))
      .then((data) => {
        if (active) apply(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setUser(null);
        setError(err instanceof Error ? err.message : 'Sign-in could not be checked.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [apply]);

  const signIn = useCallback(
    async (credential: string, details: SignupDetails) => {
      setError(null);
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential, profile: details }),
        });
        const data = await readAuthResponse(res);
        apply(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in could not be completed.');
        throw err;
      }
    },
    [apply],
  );

  const signOut = useCallback(async () => {
    await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
    setUser(null);
    setIsAdmin(false);
    setFeedbackDone(false);
    setUserCount(undefined);
    setUsers([]);
    setNotice(null);
    setError(null);
  }, []);

  const submitFeedback = useCallback(async (input: { name: string; email: string; year: string; feedback: string; rating: string }) => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await readAuthResponse(res);
    if (data.feedbackDone) setFeedbackDone(true);
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin, feedbackDone, userCount, users, notice, error, loading, signIn, signOut, submitFeedback }),
    [user, isAdmin, feedbackDone, userCount, users, notice, error, loading, signIn, signOut, submitFeedback],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
