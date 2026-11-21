import { useEffect, useState } from 'react';

/** 30 November 2026, 9:00 AM IST. */
const END_SEM_AT = new Date('2026-11-30T09:00:00+05:30').getTime();

const UNITS = [
  { key: 'days', label: 'days', short: 'd', size: 86400 },
  { key: 'hours', label: 'hours', short: 'h', size: 3600 },
  { key: 'minutes', label: 'minutes', short: 'm', size: 60 },
  { key: 'seconds', label: 'seconds', short: 's', size: 1 },
] as const;

function splitRemaining(totalSeconds: number) {
  let left = totalSeconds;
  return UNITS.map((unit) => {
    const value = Math.floor(left / unit.size);
    left -= value * unit.size;
    return { ...unit, value };
  });
}

export function EndSemCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, Math.floor((END_SEM_AT - now) / 1000));
  const parts = splitRemaining(remaining);
  const spoken =
    remaining === 0
      ? 'End Sem is here'
      : `End Sem, ${parts.map((part) => `${part.value} ${part.value === 1 ? part.label.slice(0, -1) : part.label}`).join(', ')} to go`;

  return (
    <div
      role="timer"
      aria-label={spoken}
      title="30 Nov, 9:00 AM"
      className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl border border-[var(--st-line)] bg-[color-mix(in_srgb,var(--st-1)_88%,transparent)] px-2 py-1 sm:flex-row sm:gap-2 sm:px-2.5 sm:py-1.5"
    >
      <span className="text-[10px] font-semibold leading-none tracking-wide text-[var(--st-accent-text)] sm:text-[12px]">
        End Sem
      </span>
      <span className="flex items-baseline gap-1 font-[family-name:var(--font-mono-code)] text-[13px] leading-none text-[var(--st-on)] tabular-nums sm:gap-1.5">
        {parts.map((part) => (
          <span
            key={part.key}
            className={
              part.key === 'minutes'
                ? 'hidden items-baseline gap-px sm:inline-flex'
                : 'inline-flex items-baseline gap-px'
            }
          >
            <span className="font-semibold">{String(part.value).padStart(2, '0')}</span>
            <span className="text-[11px] font-medium text-[var(--st-on-var)]">{part.short}</span>
          </span>
        ))}
      </span>
    </div>
  );
}
