import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];

const inputClass =
  'mt-1 w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-0)] px-3 py-2 text-[15px] font-normal text-[var(--st-on)] outline-none';

export function SiteFeedbackForm() {
  const { user, submitFeedback, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [year, setYear] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setError('');
    setSaving(true);
    try {
      await submitFeedback({ name, email, year, feedback });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That could not be saved. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60] grid place-items-center overflow-auto bg-[color-mix(in_srgb,var(--st-0)_78%,transparent)] px-4 py-8">
      <section className="glass w-full max-w-[480px] px-6 py-8 sm:px-8">
        <h1 className="text-[32px] leading-tight">A note before you start</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-[var(--st-on-var)]">
          Name, email, year, and a short review of the site. This is asked once, then the site stays open.
        </p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!saving) void submit();
          }}
        >
          <label className="block text-[13px] font-semibold text-[var(--st-on)]">
            Name
            <input className={inputClass} name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="block text-[13px] font-semibold text-[var(--st-on)]">
            Email
            <input className={inputClass} name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block text-[13px] font-semibold text-[var(--st-on)]">
            Year
            <select className={inputClass} name="year" value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="">Choose year</option>
              {YEARS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-semibold text-[var(--st-on)]">
            Review and feedback
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              name="feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="What is working, and what should change?"
            />
          </label>
          {error && <p className="text-[14px] leading-snug text-[var(--st-accent-text)]">{error}</p>}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button type="button" onClick={() => void signOut()} className="text-[13px] font-semibold text-[var(--st-accent-text)]">
              Sign out
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? 'Saving…' : 'Continue'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
