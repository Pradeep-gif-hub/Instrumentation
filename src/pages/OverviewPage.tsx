import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCanonicalInstrumentUrl } from '@/data/navigationTree';

export function OverviewPage() {
  return (
    <div className="mx-auto flex max-w-[70ch] flex-col gap-6 pt-4 sm:pt-8">
      <h1>What do you want to learn?</h1>

      <div className="flex flex-col gap-3">
        <Link
          to="/learn"
          className="ui-card flex items-center justify-between gap-4 px-6 py-5"
        >
          <span className="text-[20px] font-semibold text-[var(--st-on)]">
            Learn by semester
          </span>
          <ArrowRight className="size-5 shrink-0 text-[var(--st-accent)]" />
        </Link>

        <Link
          to="/browse?focus=search"
          className="ui-card flex items-center justify-between gap-4 px-6 py-5"
        >
          <span className="text-[20px] font-semibold text-[var(--st-on)]">
            Look up an instrument
          </span>
          <ArrowRight className="size-5 shrink-0 text-[var(--st-accent)]" />
        </Link>

        <Link
          to="/interview"
          className="ui-card flex items-center justify-between gap-4 px-6 py-5"
        >
          <span className="text-[20px] font-semibold text-[var(--st-on)]">
            Practise interview questions
          </span>
          <ArrowRight className="size-5 shrink-0 text-[var(--st-accent)]" />
        </Link>
      </div>

      <p className="text-[14px] text-[var(--st-on-var)]">
        <Link
          to={getCanonicalInstrumentUrl('rtd-pt100')}
          className="underline decoration-[var(--st-line)] underline-offset-4 hover:text-[var(--st-on)] hover:decoration-[var(--st-accent)]"
        >
          Start with RTD if you&apos;re new.
        </Link>
      </p>
    </div>
  );
}
