import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const CLIENT_KEY = 'instrumenta-live-client';
const TAB_KEY = 'instrumenta-live-tab';

type LivePerson = {
  id: string;
  name: string;
  email: string;
  path: string;
};

function browserId(storage: Storage, key: string): string {
  const existing = storage.getItem(key);
  if (existing && /^[A-Za-z0-9_-]{8,80}$/.test(existing)) return existing;
  const next = crypto.randomUUID().replace(/-/g, '');
  storage.setItem(key, next);
  return next;
}

function sendPresence(body: { tabId: string; clientId: string; path?: string; leave?: boolean }, keepalive = false) {
  const payload = JSON.stringify(body);
  if (keepalive && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    if (navigator.sendBeacon('/api/presence', blob)) return;
  }
  void fetch('/api/presence', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive,
  }).catch(() => undefined);
}

export function LivePresencePing() {
  const location = useLocation();
  const { user } = useAuth();
  const pathRef = useRef(location.pathname);

  useEffect(() => {
    pathRef.current = `${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);

  useEffect(() => {
    const clientId = browserId(localStorage, CLIENT_KEY);
    const tabId = browserId(sessionStorage, TAB_KEY);
    const beat = () => sendPresence({ tabId, clientId, path: pathRef.current });
    beat();
    const timer = window.setInterval(beat, 12_000);
    const leave = () => sendPresence({ tabId, clientId, leave: true }, true);
    window.addEventListener('pagehide', leave);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('pagehide', leave);
    };
  }, [user?.email]);

  return null;
}

export function LiveNowButton() {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [people, setPeople] = useState<LivePerson[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    const load = () => {
      fetch('/api/presence', { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { count?: number; people?: LivePerson[] } | null) => {
          if (!active || !data || typeof data.count !== 'number') return;
          setCount(data.count);
          setPeople(Array.isArray(data.people) ? data.people : []);
        })
        .catch(() => undefined);
    };
    load();
    const timer = window.setInterval(load, 4_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [open]);

  if (!isAdmin) return null;

  const label = count === null ? 'Live' : count === 1 ? '1 live' : `${count} live`;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="btn shrink-0"
      >
        <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <span>{label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 shadow-lg">
          <p className="text-[13px] font-semibold text-[var(--st-on)]">{label} on the site now</p>
          <ul className="mt-2 max-h-56 space-y-2 overflow-auto">
            {people.length === 0 && <li className="text-[13px] text-[var(--st-on-var)]">Nobody else is here.</li>}
            {people.map((person) => (
              <li key={person.id}>
                <p className="truncate text-[13px] font-medium text-[var(--st-on)]">{person.name || 'Guest'}</p>
                <p className="truncate text-[12px] text-[var(--st-on-var)]">{person.email || 'Not signed in'}</p>
                <p className="truncate text-[12px] text-[var(--st-on-var)]">{person.path || '/'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
