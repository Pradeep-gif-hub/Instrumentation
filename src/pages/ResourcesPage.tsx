import { Globe, Youtube } from 'lucide-react';
import { STUDY_RESOURCES } from '@/data/studyResources';

function isYoutube(href: string): boolean {
  return href.includes('youtube.com') || href.includes('youtu.be');
}

export function ResourcesPage() {
  return (
    <div className="pointer-events-auto relative z-10 mx-auto flex w-full max-w-[1100px] flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <h1>Resources</h1>
        <Youtube className="size-7 shrink-0 text-[var(--st-signal)]" aria-label="YouTube" />
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STUDY_RESOURCES.map((group, index) => (
          <section key={group.subject} className="tag-plate">
            <header className="flex items-center justify-between gap-2">
              <span className="mono text-[14px] text-[var(--st-iris)]">RES-{String(index + 1).padStart(2, '0')}</span>
              <span className="status-lamp" aria-hidden="true" />
            </header>
            <p className="text-[16px] font-semibold leading-snug text-[var(--st-on)]">{group.subject}</p>
            <div className="mt-auto flex items-center gap-1">
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${group.subject} video`}
                  title={group.subject}
                  className="grid size-10 place-items-center text-[var(--st-signal)] hover:bg-[var(--st-2)]"
                >
                  {isYoutube(link.href) ? <Youtube className="size-5" /> : <Globe className="size-4 text-[var(--st-on)]" />}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-[15px] leading-snug text-[var(--st-on-var)]">
        Do visit the mentioned notes as per the faculty teaching styles. All the relevant books are very well illustrated.
      </p>
    </div>
  );
}
