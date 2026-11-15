import { Youtube } from 'lucide-react';
import { STUDY_RESOURCES } from '@/data/studyResources';

export function ResourcesPage() {
  return (
    <div className="glass pointer-events-auto relative z-10 mx-auto flex w-full max-w-[860px] flex-col gap-6 px-6 py-6 sm:px-8 sm:py-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1>Resources</h1>
          <p className="text-[16px] leading-relaxed text-[var(--st-on-var)]">
            Study material for the subjects. Open a lecture when you want the video.
          </p>
        </div>
        <Youtube className="size-8 shrink-0 text-[#ff0033]" aria-label="YouTube" />
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {STUDY_RESOURCES.map((group) => (
          <section key={group.subject} className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-0)] px-4 py-3">
            <h2 className="text-[16px]">{group.subject}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[var(--st-line)] px-3 py-1.5 text-[14px] font-semibold text-[var(--st-accent-text)] transition hover:border-[var(--st-accent)] hover:bg-[var(--st-2)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-[14px] leading-relaxed text-[var(--st-on-var)]">
        Do visit the mentioned notes as per the faculty teaching styles. All the relevant books are very well illustrated.
      </p>
    </div>
  );
}
