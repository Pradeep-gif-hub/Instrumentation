import { useRef } from 'react';
import { GoogleSignIn } from '@/components/GoogleSignIn';
import { useAuth, type SignupDetails } from '@/context/AuthContext';

const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];
const GENDERS = ['Female', 'Male', 'Prefer not to say'];

const inputClass =
  'mt-1 w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-0)] px-3 py-2 text-[15px] font-normal text-[var(--st-on)] outline-none';

function savedTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem('instrument-ai:theme-v2') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function readDetails(form: HTMLFormElement | null): SignupDetails {
  const data = form ? new FormData(form) : null;
  const value = (key: string) => String(data?.get(key) ?? '').trim();
  return {
    name: value('name'),
    branch: value('branch'),
    year: value('year'),
    gmail: value('gmail'),
    college: value('college'),
    mobile: value('mobile'),
    gender: value('gender'),
  };
}

export function LoginPage() {
  const { loading, error, notice } = useAuth();
  const theme = savedTheme();
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <div className={`studio ${theme === 'light' ? 'light' : ''} grid min-h-screen place-items-center overflow-auto bg-[var(--st-0)] px-4 py-10`}>
      <main className="w-full max-w-[480px]">
        <section className="glass pointer-events-auto w-full px-6 py-8 sm:px-8">
          <img src="/favicon.svg" width={48} height={48} alt="" />
          <h1 className="mt-5 text-[32px] leading-tight">Welcome to Instrumentation AI</h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[var(--st-on-var)]">
            Before you start, let’s sign in. This is so we can follow up when you share feedback later.
          </p>
          {loading ? (
            <p className="mt-6 text-[15px] text-[var(--st-on-var)]">Checking your sign-in…</p>
          ) : (
            <form ref={formRef} className="mt-6 space-y-3" onSubmit={(event) => event.preventDefault()}>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Name
                <input className={inputClass} name="name" autoComplete="name" />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Branch
                <input className={inputClass} name="branch" placeholder="Instrumentation and Control Engineering" />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Year
                <select className={inputClass} name="year" defaultValue="">
                  <option value="">Choose year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Gmail
                <input className={inputClass} name="gmail" type="email" inputMode="email" autoComplete="email" />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                College
                <input className={inputClass} name="college" autoComplete="organization" />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Mobile number
                <input className={inputClass} name="mobile" type="tel" inputMode="tel" autoComplete="tel" />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Gender
                <select className={inputClass} name="gender" defaultValue="">
                  <option value="">Choose gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-2 pt-3">
                <p className="text-[14px] leading-snug text-[var(--st-on-var)]">
                  Sign in with Google. Filled details are saved with your account.
                </p>
                <GoogleSignIn readDetails={() => readDetails(formRef.current)} />
              </div>
            </form>
          )}
          {notice && <p className="mt-4 text-[14px] leading-snug text-[var(--st-on-var)]">{notice}</p>}
          {error && <p className="mt-4 text-[14px] leading-snug text-[var(--st-accent-text)]">{error}</p>}
        </section>
      </main>
    </div>
  );
}
