import { useMemo, useState } from 'react';
import { GoogleSignIn } from '@/components/GoogleSignIn';
import { useAuth, type SignupDetails } from '@/context/AuthContext';

const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];
const GENDERS = ['Female', 'Male', 'Prefer not to say'];

const inputClass =
  'mt-1 w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-0)] px-3 py-2 text-[15px] font-normal text-[var(--st-on)] outline-none';

function savedTheme(): 'dark' | 'light' {
  try {
    return localStorage.getItem('instrument-ai:theme-v2') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function emptyDetails(): SignupDetails {
  return { name: '', branch: '', year: '', gmail: '', college: '', mobile: '', gender: '' };
}

function formReady(details: SignupDetails): boolean {
  const digits = details.mobile.replace(/\D/g, '');
  return (
    details.name.trim().length >= 2 &&
    details.branch.trim().length >= 2 &&
    YEARS.includes(details.year) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.gmail.trim()) &&
    details.college.trim().length >= 2 &&
    digits.length >= 10 &&
    digits.length <= 15 &&
    GENDERS.includes(details.gender)
  );
}

export function LoginPage() {
  const { loading, error, notice } = useAuth();
  const theme = savedTheme();
  const [details, setDetails] = useState<SignupDetails>(emptyDetails);
  const ready = useMemo(() => formReady(details), [details]);

  const setField = (key: keyof SignupDetails, value: string) => {
    setDetails((current) => ({ ...current, [key]: value }));
  };

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
            <form className="mt-6 space-y-3" onSubmit={(event) => event.preventDefault()}>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Name
                <input className={inputClass} value={details.name} autoComplete="name" onChange={(event) => setField('name', event.target.value)} />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Branch
                <input
                  className={inputClass}
                  value={details.branch}
                  placeholder="Instrumentation and Control Engineering"
                  onChange={(event) => setField('branch', event.target.value)}
                />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Year
                <select className={inputClass} value={details.year} onChange={(event) => setField('year', event.target.value)}>
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
                <input
                  className={inputClass}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={details.gmail}
                  onChange={(event) => setField('gmail', event.target.value)}
                />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                College
                <input className={inputClass} value={details.college} autoComplete="organization" onChange={(event) => setField('college', event.target.value)} />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Mobile number
                <input
                  className={inputClass}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={details.mobile}
                  onChange={(event) => setField('mobile', event.target.value)}
                />
              </label>
              <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                Gender
                <select className={inputClass} value={details.gender} onChange={(event) => setField('gender', event.target.value)}>
                  <option value="">Choose gender</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </label>
              <div className="pt-3">
                {ready ? (
                  <GoogleSignIn details={details} />
                ) : (
                  <p className="text-[14px] leading-snug text-[var(--st-on-var)]">
                    Fill in the details above, then sign in with Google.
                  </p>
                )}
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
