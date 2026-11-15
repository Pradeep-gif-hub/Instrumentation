import { Youtube } from 'lucide-react';
import { STUDY_RESOURCES } from '@/data/studyResources';

export function StudyResources({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div
      className="mt-1 space-y-3 rounded-xl px-1 py-2"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.75)' }}
    >
      <div className="flex items-center justify-between gap-2 px-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--st-on-var)]">Study material</p>
        <Youtube className="size-5 shrink-0 text-[#ff0033]" aria-label="YouTube" />
      </div>
      {STUDY_RESOURCES.map((group) => (
        <div key={group.subject}>
          <p className="px-2 text-[13px] font-semibold leading-snug text-[var(--st-on)]">{group.subject}</p>
          <div className="mt-0.5">
            {group.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className="block rounded-lg px-2 py-1.5 text-[13px] font-normal text-[var(--st-accent-text)] transition hover:bg-[var(--st-2)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ))}
      <p className="px-2 pt-1 text-[12px] leading-snug text-[var(--st-on-var)]">
        Do visit the mentioned notes as per the faculty teaching styles. All the relevant books are very well illustrated.
      </p>
    </div>
  );
}
