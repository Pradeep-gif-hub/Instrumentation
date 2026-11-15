import { GoogleSignIn } from '@/components/GoogleSignIn';
import { useAuth } from '@/context/AuthContext';

function savedTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem('instrument-ai:theme-v2') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function LoginPage() {
  const { loading, error } = useAuth();
  const theme = savedTheme();

  return (
    <div className={`studio ${theme === 'light' ? 'light' : ''} relative grid min-h-screen place-items-center bg-[var(--st-0)] px-4 py-10`}>
      <main className="w-full max-w-[480px]">
        <section className="glass pointer-events-auto w-full max-w-[480px] px-6 py-8 sm:px-8">
          <img src="/favicon.svg" width={48} height={48} alt="" />
          <h1 className="mt-5 text-[32px] leading-tight">Welcome to Instrumentation AI</h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[var(--st-on-var)]">
            Before you start, let’s sign in. This is so we can follow up when you share feedback later.
          </p>
          <div className="mt-6 min-h-11">
            {loading ? (
              <p className="text-[15px] text-[var(--st-on-var)]">Checking your sign-in…</p>
            ) : (
              <GoogleSignIn />
            )}
          </div>
          {error && <p className="mt-4 text-[14px] leading-snug text-[var(--st-accent-text)]">{error}</p>}
        </section>
      </main>
    </div>
  );
}
