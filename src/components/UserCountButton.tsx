import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function UserCountButton() {
  const { isAdmin, userCount, users, notice } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [open]);

  if (!isAdmin) return null;

  const count = typeof userCount === 'number' ? userCount : null;
  const label = count === null ? 'Users' : count === 1 ? '1 user' : `${count} users`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="border border-[#ffb000] bg-[#1b2026] px-3 py-1 text-[14px] font-semibold text-[#f4f1ea] transition hover:bg-[#232a31]"
      >
        {label}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 z-40 mb-2 w-72 rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 shadow-lg">
          <p className="text-[14px] font-semibold text-[var(--st-on)]">{label} signed in</p>
          {notice && <p className="mt-1 text-[14px] leading-snug text-[var(--st-on-var)]">{notice}</p>}
          <ul className="mt-2 max-h-48 space-y-1 overflow-auto">
            {users.length === 0 && <li className="text-[14px] text-[var(--st-on-var)]">No accounts saved yet.</li>}
            {users.map((person) => (
              <li key={person.id}>
                <p className="truncate text-[14px] font-medium text-[var(--st-on)]">{person.name}</p>
                <p className="truncate text-[14px] text-[var(--st-on-var)]">{person.email}</p>
                <p className="truncate text-[14px] text-[var(--st-on-var)]">
                  {[person.branch, person.year, person.college].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
