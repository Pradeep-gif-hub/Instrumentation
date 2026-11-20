import {
  ArrowLeft,
  Bookmark,
  Github,
  Globe,
  Linkedin,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { resolveCanonicalPath } from '@/data/navigationTree';
import { getPlainDisplayName } from '@/data/simpleGuides';
import { DEVELOPERS } from '@/lib/siteConfig';
import { BookmarksDrawer } from './BookmarksDrawer';
import { GoogleSignIn } from './GoogleSignIn';
import { UserCountButton } from './UserCountButton';
import { PlantBackdrop } from './PlantBackdrop';
import { CursorDotField } from './CursorDotField';
import { SearchModal } from './SearchModal';
import { SuggestInstrumentModal } from './SuggestInstrumentModal';

function BrandMark({ size = 28 }: { size?: number }) {
  return <img src="/favicon.svg" width={size} height={size} alt="" className="shrink-0" />;
}

function MiniGauge() {
  return (
    <svg className="mini-gauge shrink-0 text-[var(--st-accent-text)]" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 22 A10 10 0 1 1 26 22" fill="none" stroke="currentColor" strokeWidth="2" />
      <line className="mini-gauge-needle" x1="16" y1="20" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}

function PlantHorizon() {
  return (
    <div className="plant-horizon pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1200 72" preserveAspectRatio="xMidYMax slice">
        <rect width="1200" height="72" fill="#14181c" />
        <g fill="#232a31" stroke="#3c6e96" strokeWidth="1.5">
          <rect x="40" y="18" width="46" height="54" />
          <rect x="98" y="28" width="36" height="44" />
          <rect x="150" y="8" width="18" height="64" />
          <rect x="190" y="34" width="220" height="8" />
          <rect x="190" y="48" width="220" height="6" />
          <rect x="430" y="22" width="70" height="50" />
          <path d="M470 22 L500 4 L500 22" fill="#2d353d" />
          <rect x="540" y="16" width="40" height="56" />
          <rect x="600" y="30" width="180" height="8" />
          <rect x="820" y="12" width="16" height="60" />
          <rect x="860" y="26" width="50" height="46" />
          <rect x="930" y="20" width="42" height="52" />
          <rect x="990" y="36" width="160" height="6" />
        </g>
        <path className="plant-flow" d="M190 38 H410" fill="none" stroke="#ffb000" strokeWidth="2" />
        <path className="plant-flow" d="M600 34 H780" fill="none" stroke="#f25c1f" strokeWidth="2" />
        <path className="plant-flow" d="M990 39 H1150" fill="none" stroke="#3c6e96" strokeWidth="2" />
      </svg>
    </div>
  );
}

const MAIN_LINKS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'learn', label: 'Learn', path: '/learn' },
  { id: 'browse', label: 'Browse', path: '/browse' },
  { id: 'interview', label: 'Interview Prep', path: '/interview' },
  { id: 'toolbox', label: 'Toolbox', path: '/toolbox' },
  { id: 'resources', label: 'Resources', path: '/resources' },
];

const NOTE_LINKS = [
  { label: 'Semester 1', href: 'https://drive.google.com/drive/folders/1p49STgJqpYccV_EAPbOXggUUQut-Omdj?usp=sharing' },
  { label: 'Semester 2', href: 'https://drive.google.com/drive/folders/1qKgMco_DMXC6CNVOgyZC95FfZtWE074b?usp=sharing' },
  { label: 'Semester 3', href: 'https://drive.google.com/drive/folders/14sL1xKHOQUE1i2ULdxyNv29PgsN2ZJIZ?usp=sharing' },
  { label: 'Semester 4', href: 'https://drive.google.com/drive/folders/1Ek8sYBgBtd_RQM2V-9lPstkOca5vQSNV?usp=sharing' },
  { label: 'Semester 5', href: 'https://drive.google.com/drive/folders/1uP6ZAVXDa25fUbJ7sSw7qcr3EO-CM2RZ?usp=sharing' },
  { label: 'Additional semesters', href: 'https://drive.google.com/drive/folders/1p49STgJqpYccV_EAPbOXggUUQut-Omdj?usp=sharing' },
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
  if (pathname.startsWith('/browse') || pathname.startsWith('/instrumentation')) return [{ label: 'Browse' }];
  if (pathname.startsWith('/interview')) return [{ label: 'Interview Prep' }];
  if (pathname.startsWith('/toolbox')) return [{ label: 'Toolbox' }];
  if (pathname.startsWith('/automation/ladder')) {
    return [{ label: 'Automation', to: '/automation' }, { label: 'Ladder simulator' }];
  }
  if (pathname.startsWith('/automation')) return [{ label: 'Automation' }];
  if (pathname.startsWith('/applications')) return [{ label: 'Plant diagrams' }];
  if (pathname.startsWith('/electronics')) return [{ label: 'Signal chain' }];
  if (pathname.startsWith('/roadmap')) return [{ label: 'Full syllabus notes' }];
  if (pathname.startsWith('/resources')) return [{ label: 'Resources' }];
  return [{ label: 'Instrument-AI' }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, setSearchOpen, bookmarks, setBookmarksOpen } = useApp();
  const [plantMenuOpen, setPlantMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const plantMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeSuggestTriggerRef = useRef<HTMLElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const instMatch = matchPath('/instrument/:instrumentId', location.pathname);
  const activeInstrumentId = instMatch?.params.instrumentId;
  const canonicalPath = activeInstrumentId ? resolveCanonicalPath(activeInstrumentId) : undefined;
  const fallbackCrumbs = canonicalPath ? null : buildPlainBreadcrumb(location.pathname);

  useEffect(() => {
    setMobileMenuOpen(false);
    setPlantMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setPlantMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const isNavActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const openSuggest = (fromMobile: boolean) => {
    activeSuggestTriggerRef.current = fromMobile ? mobileMenuBtnRef.current : plantMenuBtnRef.current;
    setPlantMenuOpen(false);
    setMobileMenuOpen(false);
    setSuggestOpen(true);
  };

  const menuBody = (onNavigate: () => void, fromMobile: boolean) => (
    <div className="flex h-full flex-col justify-between overflow-y-auto px-4 py-5">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-[28px] uppercase tracking-wide text-[var(--st-on)]">Plant menu</p>
          <button type="button" onClick={onNavigate} aria-label="Close plant menu" className="icon-btn">
            <X className="size-5" />
          </button>
        </div>
        <nav aria-label="Plant menu" className="space-y-5">
          <div>
            <p className="eyebrow">Notes</p>
            <div className="mt-2 space-y-1">
              {NOTE_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onNavigate}
                  className="block px-2 py-2 text-[16px] text-[var(--st-on)] hover:bg-[var(--st-2)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">More</p>
            <div className="mt-2 space-y-1">
              {MORE_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onNavigate}
                  className="block px-2 py-2 text-[16px] text-[var(--st-on)] hover:bg-[var(--st-2)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => openSuggest(fromMobile)}
            className="block w-full px-2 py-2 text-left text-[16px] text-[var(--st-on)] hover:bg-[var(--st-2)]"
          >
            Make a suggestion
          </button>
        </nav>
      </div>
      <div className="space-y-3 border-t border-[var(--st-line)] pt-4">
        <GoogleSignIn />
      </div>
    </div>
  );

  return (
    <div className={`studio ${theme === 'light' ? 'light' : ''}`}>
      <CursorDotField theme={theme} />
      <PlantBackdrop live={isHome} />

      <div className={`relative z-10 flex min-h-screen min-w-0 flex-col overflow-x-hidden ${isHome ? 'pointer-events-none' : ''}`}>
        <header className={`control-bar sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-2 px-3 py-2 sm:px-4 ${isHome ? 'pointer-events-auto' : ''}`}>
          <button
            ref={mobileMenuBtnRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="btn shrink-0 md:hidden!"
          >
            <Menu className="size-4" />
            <span>Menu</span>
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2 text-[var(--st-on)]">
            <BrandMark />
            <MiniGauge />
            <span className="hidden font-[family-name:var(--font-display)] text-[22px] font-semibold uppercase tracking-wide lg:inline">
              Instrument-AI
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden min-w-0 items-center gap-1 md:flex">
            {MAIN_LINKS.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isNavActive(item.path) ? 'page' : undefined}
                className="nav-tag"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search instruments" className="btn">
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden border border-[var(--st-line)] px-1.5 py-0.5 text-[14px] lg:inline">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setBookmarksOpen(true)}
              aria-label="Saved"
              className="btn"
            >
              <Bookmark className="size-4" />
              <span className="hidden xl:inline">Saved</span>
              {bookmarks.length > 0 && <span>{bookmarks.length}</span>}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="icon-btn"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              ref={plantMenuBtnRef}
              type="button"
              onClick={() => setPlantMenuOpen(true)}
              aria-expanded={plantMenuOpen}
              className="btn hidden md:inline-flex!"
            >
              Plant menu
            </button>
          </div>
        </header>

        {!isHome && <PlantHorizon />}

        <div className={`flex min-w-0 items-center gap-2 border-b border-[var(--st-line)] bg-[var(--st-0)] px-3 py-2 sm:px-4 ${isHome ? 'pointer-events-auto' : ''}`}>
          {location.pathname !== '/' && (
            <button type="button" onClick={() => navigate(-1)} className="icon-btn size-9!" aria-label="Go back">
              <ArrowLeft className="size-4" />
            </button>
          )}
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 overflow-x-auto text-[14px]">
            {canonicalPath ? (
              <>
                <Link
                  to={`/learn?sem=${canonicalPath.subject.semesterKey}&subject=${encodeURIComponent(canonicalPath.subject.id)}`}
                  className="shrink-0 text-[var(--st-on-var)] hover:text-[var(--st-on)]"
                >
                  {canonicalPath.subject.shortName}
                </Link>
                <span className="shrink-0 text-[var(--st-iris)]" aria-hidden="true">—</span>
                <Link
                  to={`/learn?sem=${canonicalPath.subject.semesterKey}&subject=${encodeURIComponent(canonicalPath.subject.id)}&family=${encodeURIComponent(canonicalPath.family.key)}`}
                  className="shrink-0 text-[var(--st-on-var)] hover:text-[var(--st-on)]"
                >
                  {canonicalPath.family.label}
                </Link>
                <span className="shrink-0 text-[var(--st-iris)]" aria-hidden="true">—</span>
                <span className="truncate font-semibold text-[var(--st-on)]">{getPlainDisplayName(canonicalPath.entry)}</span>
              </>
            ) : (
              fallbackCrumbs?.map((c, idx) => (
                <span key={`${c.label}-${idx}`} className="flex min-w-0 items-center gap-2">
                  {idx > 0 && <span className="text-[var(--st-iris)]" aria-hidden="true">—</span>}
                  {c.to ? (
                    <Link to={c.to} className="truncate text-[var(--st-on-var)] hover:text-[var(--st-on)]">{c.label}</Link>
                  ) : (
                    <span className="truncate font-semibold text-[var(--st-on)]">{c.label}</span>
                  )}
                </span>
              ))
            )}
          </nav>
        </div>

        <main className={`min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 ${isHome ? 'pointer-events-none' : 'page-sheet'}`}>{children}</main>

        <footer className={`plant-status flex min-h-[56px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 text-[14px] sm:px-8 ${isHome ? 'pointer-events-auto' : ''}`}>
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="status-lamp" aria-hidden="true" />
            <UserCountButton />
            <span className="font-medium">&copy; {new Date().getFullYear()} Instrument-AI</span>
            <span aria-hidden="true">·</span>
            <span>Meet the Developers</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {DEVELOPERS.map((dev) => (
              <div key={dev.name} className="flex items-center gap-2">
                <span className="whitespace-nowrap font-medium">{dev.name}</span>
                <div className="flex shrink-0 items-center gap-1">
                  {[
                    { label: `${dev.name} — GitHub`, href: dev.githubUrl, Icon: Github },
                    { label: `${dev.name} — LinkedIn`, href: dev.linkedinUrl, Icon: Linkedin },
                    { label: `${dev.name} — Portfolio`, href: dev.websiteUrl, Icon: Globe },
                  ].map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="inline-flex items-center justify-center p-1.5"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </footer>
      </div>

      {plantMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="presentation" onClick={() => setPlantMenuOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Plant menu"
            className="h-full w-full max-w-md bg-[var(--st-0)] shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {menuBody(() => setPlantMenuOpen(false), false)}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--st-0)] md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="border-b border-[var(--st-line)] px-4 py-3">
            <nav aria-label="Primary mobile" className="grid gap-1">
              {MAIN_LINKS.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isNavActive(item.path) ? 'page' : undefined}
                  className="nav-tag"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          {menuBody(() => setMobileMenuOpen(false), true)}
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
