import { useEffect, useRef, useState } from 'react';

type AuthUser = { email: string; name: string };
type AuthState = {
  user: AuthUser | null;
  isAdmin: boolean;
  userCount?: number;
};

const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

async function readSession(): Promise<AuthState> {
  const res = await fetch('/api/auth', { credentials: 'include' });
  if (!res.ok) return { user: null, isAdmin: false };
  return (await res.json()) as AuthState;
}

export function GoogleSignIn() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<AuthState>({ user: null, isAdmin: false });

  useEffect(() => {
    let active = true;
    readSession()
      .then((next) => {
        if (active) setState(next);
      })
      .catch(() => {
        if (active) setState({ user: null, isAdmin: false });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!CLIENT_ID || state.user || !buttonRef.current) return;
    const parent = buttonRef.current;
    const render = () => {
      if (!window.google || !parent) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          const res = await fetch('/api/auth', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential }),
          });
          if (res.ok) setState((await res.json()) as AuthState);
        },
      });
      parent.replaceChildren();
      window.google.accounts.id.renderButton(parent, {
        type: 'standard',
        theme: 'outline',
        size: 'medium',
        text: 'signin_with',
        width: 210,
      });
    };
    if (window.google) {
      render();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [state.user]);

  const signOut = async () => {
    await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
    setState({ user: null, isAdmin: false });
  };

  if (!CLIENT_ID) {
    return (
      <p className="px-3 text-[13px] leading-snug text-[var(--st-on-var)]">
        Google sign-in needs a client id in the site settings.
      </p>
    );
  }

  if (state.user) {
    return (
      <div className="space-y-1 px-3">
        <p className="truncate text-[14px] font-semibold text-[var(--st-on)]">{state.user.name}</p>
        {state.isAdmin && typeof state.userCount === 'number' && (
          <p className="text-[13px] text-[var(--st-on-var)]">{state.userCount} signed-in users</p>
        )}
        <button type="button" onClick={signOut} className="text-[13px] font-semibold text-[var(--st-accent-text)]">
          Sign out
        </button>
      </div>
    );
  }

  return <div ref={buttonRef} className="px-2" />;
}
