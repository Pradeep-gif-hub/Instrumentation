import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const YEARS = ['1st year', '2nd year', '3rd year', '4th year'];

const inputClass =
  'mt-1 w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-0)] px-3 py-2 text-[15px] font-normal text-[var(--st-on)] outline-none';

type FormState = {
  name: string;
  year: string;
  email: string;
  linkedin: string;
  contact: string;
};

const emptyForm: FormState = { name: '', year: '', email: '', linkedin: '', contact: '' };

export function OverviewPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [thanks, setThanks] = useState(false);

  const setField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/engineers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Could not save that just now.');
        return;
      }
      setThanks(true);
      window.setTimeout(() => navigate('/learn'), 1800);
    } catch {
      setError('Could not save that just now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="pointer-events-none w-full text-center">
        <h1
          className="text-[var(--st-on)]"
          style={{
            fontSize: 'clamp(15px, 1.7vw, 30px)',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            textShadow: '0 2px 8px rgba(0,0,0,0.85)',
          }}
        >
          Welcome to the ICE Factory of NITJ where Engineers are produced.. 😭😭
        </h1>
        <button
          type="button"
          onClick={() => {
            setThanks(false);
            setError('');
            setOpen(true);
          }}
          className="pointer-events-auto mt-3 cursor-pointer text-[16px] text-[var(--st-on)] underline decoration-2 underline-offset-4"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}
        >
          You wanna be one of those engineers?
        </button>
      </div>

      {open && (
        <div className="pointer-events-auto fixed inset-0 z-40 grid place-items-center bg-black/45 px-4">
          <section className="glass w-full max-w-[440px] px-6 py-6">
            {thanks ? (
              <p className="text-center text-[18px] font-semibold leading-snug text-[var(--st-on)]">
                Thanks, now your dummy character will be added on the site.
              </p>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submit();
                }}
              >
                <h2>Join the factory</h2>
                <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                  Name
                  <input className={inputClass} value={form.name} onChange={(event) => setField('name', event.target.value)} />
                </label>
                <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                  Year
                  <select className={inputClass} value={form.year} onChange={(event) => setField('year', event.target.value)}>
                    <option value="">Choose year</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                  Email
                  <input
                    className={inputClass}
                    type="email"
                    value={form.email}
                    onChange={(event) => setField('email', event.target.value)}
                  />
                </label>
                <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                  LinkedIn
                  <input
                    className={inputClass}
                    value={form.linkedin}
                    placeholder="https://www.linkedin.com/in/..."
                    onChange={(event) => setField('linkedin', event.target.value)}
                  />
                </label>
                <label className="block text-[13px] font-semibold text-[var(--st-on)]">
                  Contact details
                  <input
                    className={inputClass}
                    value={form.contact}
                    onChange={(event) => setField('contact', event.target.value)}
                  />
                </label>
                {error && <p className="text-[14px] text-[var(--st-accent-text)]">{error}</p>}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-[14px] font-semibold text-[var(--st-on-var)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-[var(--st-accent)] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
