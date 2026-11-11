import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Briefcase,
  Calculator,
  ChevronDown,
  ChevronRight,
  Compass,
  Github,
  Globe,
  Home,
  Linkedin,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { resolveCanonicalPath } from '@/data/navigationTree';
import { getPlainDisplayName } from '@/data/simpleGuides';
import { SITE_LINKS } from '@/lib/siteConfig';
import { BookmarksDrawer } from './BookmarksDrawer';
import { CursorDotField } from './CursorDotField';
import { SearchModal } from './SearchModal';
import { SuggestInstrumentModal } from './SuggestInstrumentModal';

const SIDEBAR_WIDTH_KEY = 'instrument-ai:sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 230;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 360;

function clampSidebarWidth(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SIDEBAR_WIDTH;
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, Math.round(value)));
}

function readStoredSidebarWidth(): number {
  try {
    const raw = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (!raw) return DEFAULT_SIDEBAR_WIDTH;
    return clampSidebarWidth(Number(raw));
  } catch {
    return DEFAULT_SIDEBAR_WIDTH;
  }
}

function BrandMark({ size = 32 }: { size?: number }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `inst-ai-bg-${uid}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0 rounded-[7px]"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F2D3D" />
          <stop offset="1" stopColor="#121A24" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gradId})`} />
      <path
        d="M17.9 46.1 A20 20 0 1 1 46.1 46.1"
        fill="none"
        stroke="#7FB3DE"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <line
        x1="32"
        y1="32"
        x2="42"
        y2="23"
        stroke="#E06A4F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="3.5" fill="#E8F1F8" />
    </svg>
  );
}

const MAIN_LINKS = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'learn', label: 'Learn', path: '/learn', icon: BookOpen },
  { id: 'browse', label: 'Browse', path: '/browse', icon: Compass },
  { id: 'interview', label: 'Interview Prep', path: '/interview', icon: Briefcase },
  { id: 'toolbox', label: 'Toolbox', path: '/toolbox', icon: Calculator },
];

const MORE_LINKS = [
  { label: 'Automation & PLC', to: '/automation' },
  { label: 'Plant diagrams', to: '/applications' },
  { label: 'Signal chain', to: '/electronics' },
  { label: 'Full syllabus notes', to: '/roadmap' },
  { label: 'Knowledge graph', to: '/roadmap?view=graph' },
  { label: 'Subject simulator', to: '/roadmap?view=simulator' },
];

function buildPlainBreadcrumb(pathname: string): { label: string; to?: string }[] {
  if (pathname === '/') return [{ label: 'Home' }];
  if (pathname.startsWith('/learn')) return [{ label: 'Learn' }];
  if (pathname.startsWith('/browse') || pathname.startsWith('/instrumentation')) {
    return [{ label: 'Browse' }];
  }
  if (pathname.startsWith('/interview')) return [{ label: 'Interview Prep' }];
  if (pathname.startsWith('/toolbox')) return [{ label: 'Toolbox' }];
  if (pathname.startsWith('/automation/ladder')) {
    return [{ label: 'Automation', to: '/automation' }, { label: 'Ladder simulator' }];
  }
  if (pathname.startsWith('/automation')) return [{ label: 'Automation' }];
  if (pathname.startsWith('/applications')) return [{ label: 'Plant diagrams' }];
  if (pathname.startsWith('/electronics')) return [{ label: 'Signal chain' }];
  if (pathname.startsWith('/roadmap')) return [{ label: 'Full syllabus notes' }];
  return [{ label: 'Instrument-AI' }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, setSearchOpen, bookmarks, setBookmarksOpen } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState<number>(readStoredSidebarWidth);
  const [isResizing, setIsResizing] = useState(false);

  const desktopSuggestBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeSuggestTriggerRef = useRef<HTMLElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const instMatch = matchPath('/instrument/:instrumentId', location.pathname);
  const activeInstrumentId = instMatch?.params.instrumentId;
  const canonicalPath = activeInstrumentId ? resolveCanonicalPath(activeInstrumentId) : undefined;

  const updateSidebarWidth = useCallback((nextWidth: number) => {
    const clamped = clampSidebarWidth(nextWidth);
    setSidebarWidth(clamped);
    try {
      localStorage.setItem(SIDEBAR_WIDTH_KEY, String(clamped));
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    setIsResizing(true);

    const prevSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const onMove = (moveEvt: PointerEvent) => {
      updateSidebarWidth(startWidth + (moveEvt.clientX - startX));
    };

    const onUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = prevSelect;
      document.body.style.cursor = prevCursor;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const isNavActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const fallbackCrumbs = canonicalPath ? null : buildPlainBreadcrumb(location.pathname);

  const openSuggestFromSidebar = (isMobileDrawer: boolean) => {
    activeSuggestTriggerRef.current = isMobileDrawer
      ? mobileMenuBtnRef.current
      : desktopSuggestBtnRef.current;
    if (isMobileDrawer) setMobileMenuOpen(false);
    setSuggestOpen(true);
  };

  const renderSidebarContents = (onNavigate?: () => void) => {
    const isMobileDrawer = Boolean(onNavigate);
    return (
      <div className="flex h-full flex-col justify-between overflow-y-auto px-2 py-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2 px-1.5">
            <Link
              to="/"
              onClick={onNavigate}
              className="flex min-w-0 items-center gap-2.5 text-[20px] font-semibold tracking-normal text-[var(--st-on)]"
            >
              <BrandMark size={32} />
              <span className="truncate">Instrument-AI</span>
            </Link>
            {onNavigate && (
              <button
                type="button"
                onClick={onNavigate}
                aria-label="Close navigation menu"
                className="icon-btn"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          <nav aria-label="Main navigation" className="space-y-1">
            {MAIN_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2.5 text-[16px] transition ${active
                    ? 'border-[var(--st-accent)]/60 bg-[var(--st-3)] font-semibold text-[var(--st-on)]'
                    : 'border-transparent font-normal text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
                    }`}
                >
                  <Icon
                    className={`size-[18px] shrink-0 ${active ? 'text-[var(--st-accent-text)]' : ''}`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}

            <button
              ref={!isMobileDrawer ? desktopSuggestBtnRef : undefined}
              type="button"
              onClick={() => openSuggestFromSidebar(isMobileDrawer)}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2.5 text-left text-[16px] font-normal leading-snug text-[var(--st-on-var)] transition hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
            >
              <Plus className="size-[18px] shrink-0" />
              <span>Suggest an instrument</span>
            </button>

            <div className="pt-2">
              <button
                type="button"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[16px] font-normal text-[var(--st-on-var)] transition hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
              >
                <span>More</span>
                {moreOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </button>

              {moreOpen && (
                <div className="mt-1 space-y-1 border-l border-[var(--st-line)] pl-3">
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={onNavigate}
                      className="block rounded-lg px-3 py-2 text-[14px] font-normal text-[var(--st-on-var)] transition hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="space-y-2 pt-4">
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              setBookmarksOpen(true);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-normal text-[var(--st-on-var)] transition hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
          >
            <span className="flex items-center gap-2.5">
              <Bookmark className="size-4" />
              Saved
            </span>
            {bookmarks.length > 0 && (
              <span className="rounded-full bg-[var(--st-3)] px-2 py-0.5 text-[14px] font-semibold text-[var(--st-on)]">
                {bookmarks.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-normal text-[var(--st-on-var)] transition hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span>{theme === 'dark' ? 'Light theme' : 'Dark theme'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`studio ${theme === 'light' ? 'light' : ''}`}
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      <CursorDotField theme={theme} />
      {/* ONE Sidebar (Desktop lg+) */}
      <aside
        aria-label="Sidebar navigation"
        className="rail fixed inset-y-0 left-0 z-20 hidden w-[var(--sidebar-width)] lg:block"
      >
        {renderSidebarContents()}

        {/* Vertical divider drag handle (desktop only >= 1024px) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          aria-valuemin={MIN_SIDEBAR_WIDTH}
          aria-valuemax={MAX_SIDEBAR_WIDTH}
          aria-valuenow={sidebarWidth}
          tabIndex={0}
          onPointerDown={handleResizePointerDown}
          onDoubleClick={() => updateSidebarWidth(DEFAULT_SIDEBAR_WIDTH)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              updateSidebarWidth(sidebarWidth - 8);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              updateSidebarWidth(sidebarWidth + 8);
            } else if (e.key === 'Home') {
              e.preventDefault();
              updateSidebarWidth(MIN_SIDEBAR_WIDTH);
            } else if (e.key === 'End') {
              e.preventDefault();
              updateSidebarWidth(MAX_SIDEBAR_WIDTH);
            }
          }}
          title="Drag to resize sidebar (double-click to reset)"
          className="group absolute inset-y-0 -right-1 z-30 flex w-2.5 cursor-col-resize items-center justify-center focus-visible:outline-none"
        >
          <span
            className={`h-full w-[2px] transition-colors ${isResizing
              ? 'bg-[var(--st-accent)]'
              : 'bg-transparent group-hover:bg-[var(--st-accent)] group-focus-visible:bg-[var(--st-accent)]'
              }`}
          />
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden lg:pl-[var(--sidebar-width)]">
        <header className="topbar sticky top-0 z-10 flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6">
          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuBtnRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="btn shrink-0 lg:hidden!"
          >
            <Menu className="size-4" />
            <span>Menu</span>
          </button>

          {/* Back + Plain Breadcrumb */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {location.pathname !== '/' && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="icon-btn size-9! hidden sm:grid"
                aria-label="Go back"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}

            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 overflow-hidden text-[14px]">
              {canonicalPath ? (
                <>
                  <Link
                    to={`/learn?sem=${canonicalPath.subject.semesterKey}&subject=${encodeURIComponent(canonicalPath.subject.id)}`}
                    className="hidden shrink-0 text-[var(--st-on-var)] hover:text-[var(--st-on)] md:inline"
                  >
                    {canonicalPath.subject.shortName}
                  </Link>
                  <span className="hidden shrink-0 text-[var(--st-outline)] md:inline">›</span>
                  <Link
                    to={`/learn?sem=${canonicalPath.subject.semesterKey}&subject=${encodeURIComponent(canonicalPath.subject.id)}&family=${encodeURIComponent(canonicalPath.family.key)}`}
                    className="shrink-0 text-[var(--st-on-var)] hover:text-[var(--st-on)]"
                  >
                    {canonicalPath.family.label}
                  </Link>
                  <span className="shrink-0 text-[var(--st-outline)]">›</span>
                  <span className="truncate font-semibold text-[var(--st-on)]">
                    {getPlainDisplayName(canonicalPath.entry)}
                  </span>
                </>
              ) : (
                fallbackCrumbs?.map((c, idx) => (
                  <span key={`${c.label}-${idx}`} className="flex min-w-0 items-center gap-2">
                    {idx > 0 && <span className="text-[var(--st-outline)]">›</span>}
                    {c.to ? (
                      <Link to={c.to} className="truncate text-[var(--st-on-var)] hover:text-[var(--st-on)]">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="truncate font-semibold text-[var(--st-on)]">{c.label}</span>
                    )}
                  </span>
                ))
              )}
            </nav>
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search instruments"
            className="btn shrink-0"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>

        <footer className="flex min-h-[48px] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--st-line)] px-4 py-2.5 text-[14px] text-[var(--st-on-var)] sm:px-8">
          <span className="min-w-0">Meet the Developer - Pradeep Awasthi</span>
          <div className="flex shrink-0 items-center gap-4 whitespace-nowrap">
            <a
              href={SITE_LINKS.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center justify-center rounded p-1 text-[var(--st-on-var)] transition hover:text-[var(--st-accent)]"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              href={SITE_LINKS.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center justify-center rounded p-1 text-[var(--st-on-var)] transition hover:text-[var(--st-accent)]"
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
            <a
              href={SITE_LINKS.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="inline-flex items-center justify-center rounded p-1 text-[var(--st-on-var)] transition hover:text-[var(--st-accent)]"
            >
              <Globe size={18} aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>

      {/* Mobile Full-Screen Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[var(--st-0)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {renderSidebarContents(() => setMobileMenuOpen(false))}
        </div>
      )}

      <SearchModal />
      <BookmarksDrawer />
      <SuggestInstrumentModal
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        returnFocusRef={activeSuggestTriggerRef}
      />
    </div>
  );
}
