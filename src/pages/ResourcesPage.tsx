import { Globe, Youtube } from 'lucide-react';
import { STUDY_RESOURCES } from '@/data/studyResources';

function isYoutube(href: string): boolean {
  return href.includes('youtube.com') || href.includes('youtu.be');
}

export function ResourcesPage() {
  return (
    <div className="glass pointer-events-auto relative z-10 mx-auto -my-6 flex h-[calc(100dvh-7.5rem)] w-full max-w-[1080px] flex-col gap-2 overflow-hidden px-4 py-3 sm:-my-8 sm:px-5">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <h1 style={{ fontSize: '1.45rem', lineHeight: 1.15 }}>Resources</h1>
        <Youtube className="size-7 shrink-0 text-[#ff0033]" aria-label="YouTube" />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-9 gap-2 lg:grid-cols-3 lg:grid-rows-6">
        {STUDY_RESOURCES.map((group) => (
          <section
            key={group.subject}
            className="flex min-h-0 items-center justify-between gap-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-0)] px-3"
          >
            <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-[var(--st-on)]">{group.subject}</p>
            <div className="flex shrink-0 items-center gap-0.5">
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${group.subject} video`}
                  title={group.subject}
                  className="grid size-8 place-items-center rounded-lg text-[#ff0033] transition hover:bg-[var(--st-2)]"
                >
                  {isYoutube(link.href) ? <Youtube className="size-5" /> : <Globe className="size-4 text-[var(--st-on)]" />}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="shrink-0 text-[12px] leading-snug text-[var(--st-on-var)]">
        Do visit the mentioned notes as per the faculty teaching styles. All the relevant books are very well illustrated.
      </p>
    </div>
  );
}
