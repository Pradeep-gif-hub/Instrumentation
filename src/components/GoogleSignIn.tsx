import { useEffect, useRef } from 'react';
import { useAuth, type SignupDetails } from '@/context/AuthContext';

const CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            ux_mode?: 'popup' | 'redirect';
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, string | number | boolean>) => void;
        };
      };
    };
  }
}

export function GoogleSignIn({ readDetails }: { readDetails?: () => SignupDetails }) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const readDetailsRef = useRef(readDetails);
  readDetailsRef.current = readDetails;
  const { user, notice, error, signIn, signOut } = useAuth();

  useEffect(() => {
    if (!CLIENT_ID || user || !buttonRef.current) return;
    const parent = buttonRef.current;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.google || !parent) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        ux_mode: 'popup',
        use_fedcm_for_prompt: true,
        callback: (response) => {
          const profile = readDetailsRef.current?.() ?? {
            name: '',
            branch: '',
            year: '',
            gmail: '',
            college: '',
            mobile: '',
            gender: '',
          };
          void signIn(response.credential, profile).catch(() => {
            // The auth context stores the message shown under the button.
          });
        },
      });
      parent.replaceChildren();
      window.google.accounts.id.renderButton(parent, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: 280,
        shape: 'pill',
      });
    };

    if (window.google) {
      render();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    const script = existing ?? document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = render;
    if (!existing) document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, [signIn, user]);

  if (!CLIENT_ID) {
    return (
      <p className="text-[14px] leading-snug text-[var(--st-on-var)]">
        Google sign-in needs a client id in the site settings.
      </p>
    );
  }

  if (user) {
    return (
      <div className="space-y-1 px-3">
        <p className="truncate text-[14px] font-semibold text-[var(--st-on)]">{user.name}</p>
        {notice && <p className="text-[14px] leading-snug text-[var(--st-on-var)]">{notice}</p>}
        {error && <p className="text-[14px] leading-snug text-[var(--st-accent-text)]">{error}</p>}
        <button type="button" onClick={() => void signOut()} className="text-[14px] font-semibold text-[var(--st-accent-text)]">
          Sign out
        </button>
      </div>
    );
  }

  return <div ref={buttonRef} />;
}
