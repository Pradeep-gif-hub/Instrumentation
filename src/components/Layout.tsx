import {
  Activity,
  ArrowLeft,
  Bookmark,
  BookOpen,
  Briefcase,
  Calculator,
  ChevronDown,
  Cpu,
  Factory,
  Gauge,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sun,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { INSTRUMENT_CATEGORIES } from '@/data/instruments';
import { AUTOMATION_MODULES } from '@/data/automationData';
import { BookmarksDrawer } from './BookmarksDrawer';
import { SearchModal } from './SearchModal';

interface NavMenuConfig {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; sub?: string; to: string }[];
}

const MAIN_NAV: NavMenuConfig[] = [
  { id: 'overview', label: 'Overview', path: '/', icon: LayoutDashboard },
  { id: 'roadmap', label: 'Academic Roadmap', path: '/roadmap', icon: BookOpen },
  {
    id: 'instrumentation',
    label: 'Instrumentation',
    path: '/instrumentation',
    icon: Gauge,
    children: [
      ...INSTRUMENT_CATEGORIES.map((c) => ({
        label: c.label,
        sub: c.standards,
        to: `/instrumentation/${c.id}`,
      })),
      { label: 'Flagship: Pt100 RTD 3D CAD', sub: 'Interactive 9-Part Assembly', to: '/instrumentation/temperature/rtd' },
      { label: '3D Virtual Instrument Lab & Inventory', sub: 'All Curriculum 3D Assemblies & Physics Sims', to: '/lab' },
    ],
  },
  { id: 'electronics', label: 'Electronics', path: '/electronics', icon: Activity },
  {
    id: 'automation',
    label: 'Automation',
    path: '/automation',
    icon: Cpu,
    children: AUTOMATION_MODULES.map((m) => ({
      label: m.title,
      sub: m.standard,
      to: `/automation/${m.id}`,
    })),
  },
  { id: 'applications', label: 'Industrial Applications', path: '/applications', icon: Factory },
  {
    id: 'interview',
    label: 'Interview Preparation',
    path: '/interview',
    icon: Briefcase,
    children: [
      { label: 'Interactive Question Bank', sub: '40+ MCQ, Numerical, Scenario & Troubleshooting', to: '/interview?tab=bank' },
      { label: 'Oil & Gas Core PSUs & Refineries', sub: 'RIL, Nayara, IOCL, BPCL, HPCL, ONGC, GAIL, EIL, OIL', to: '/interview?tab=companies&sector=oil-gas' },
      { label: 'Automation & Instrumentation OEMs', sub: 'Siemens, Schneider, ABB, Honeywell, Emerson, Yokogawa, E+H, Rockwell', to: '/interview?tab=companies&sector=automation' },
    ],
  },
  {
    id: 'toolbox',
    label: 'Engineering Toolbox',
    path: '/toolbox',
    icon: Calculator,
    children: [
      { label: 'RTD Callendar-Van Dusen & Lead Error', sub: 'IEC 60751 Solver', to: '/toolbox/rtd-resistance' },
      { label: 'Thermocouple ITS-90 & CJC', sub: 'Types K, J, T, E, N, S', to: '/toolbox/thermocouple-emf' },
      { label: 'Orifice / DP Flow Calculator', sub: 'ISO 5167 Mass/Volume Flow', to: '/toolbox/flow-rate' },
      { label: '4–20 mA Loop Scaling & Burden', sub: 'NAMUR NE43 + Load Ω Budget', to: '/toolbox/loop-scaling' },
      { label: 'PID Tuning & Step Simulator', sub: 'ZN / IMC + Closed-Loop Plot', to: '/toolbox/pid-tuning' },
      { label: 'All 11 Engineering Calculators →', sub: 'Temp, Pressure, Level, ADC, Bridge, Error', to: '/toolbox' },
    ],
  },
];

function buildBreadcrumbs(pathname: string): { label: string; to?: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [{ label: 'Overview' }];

  const mapLabel = (seg: string) =>
    seg
      .split('-')
      .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
      .join(' ');

  const crumbs: { label: string; to?: string }[] = [];
  let acc = '';
  parts.forEach((seg, idx) => {
    acc += `/${seg}`;
    crumbs.push({
      label: mapLabel(seg),
      to: idx < parts.length - 1 ? acc : undefined,
    });
  });
  return crumbs;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, setSearchOpen, bookmarks, setBookmarksOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const topNavRef = useRef<HTMLDivElement | null>(null);

  // Close menus on route change or outside click / Escape
  useEffect(() => {
    setOpenMenu(null);
    setMobileNavOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (topNavRef.current && !topNavRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isNavActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const crumbs = buildBreadcrumbs(location.pathname);

  return (
    <div className={`studio ${theme === 'light' ? 'light' : ''}`}>
      {/* Odyssey-aligned Left Icon Rail (Desktop lg+) */}
      <aside
        aria-label="Primary icon navigation"
        className="rail fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center pb-5 pt-2.5 lg:flex"
      >
        <Link
          to="/"
          aria-label="INSTRUMENTA Overview"
          title="INSTRUMENTA Home"
          className="grid size-10 place-items-center rounded-full bg-[var(--st-lime)] text-[#07090e] transition hover:brightness-105"
        >
          {/* Precision Crosshair / Instrument Dial Brand Emblem */}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="8" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <path d="M12 12l4-4" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </Link>

        <nav className="mt-7 flex flex-col gap-3">
          {MAIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-label={item.label}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className={`grid size-10 place-items-center rounded-full bg-[var(--st-3)] transition-colors ${
                  active
                    ? 'text-[var(--st-on)] ring-1 ring-[var(--st-cyan)] ring-offset-2 ring-offset-[var(--st-0)]'
                    : 'text-[var(--st-on-var)] hover:text-[var(--st-on)]'
                }`}
              >
                <Icon className="size-[18px]" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBookmarksOpen(true)}
            aria-label="Open saved bookmarks"
            title="Saved Bookmarks"
            className="icon-btn relative"
          >
            <Bookmark className="size-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[var(--st-lime)] text-[9px] font-bold text-[#07090e]">
                {bookmarks.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title="Toggle theme"
            className="icon-btn"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="flex min-h-screen flex-col lg:pl-16">
        {/* Sticky Topbar with Breadcrumbs, Desktop Mega-Menus, Search & Mobile Trigger */}
        <header className="topbar sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2">
          {/* Mobile Brand + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen((o) => !o)}
              className="icon-btn size-9!"
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <Link to="/" className="mono text-xs font-semibold tracking-wider text-[var(--st-on)]">
              INSTRUMENTA
            </Link>
          </div>

          {/* Back Button + Breadcrumbs */}
          <div className="flex min-w-0 items-center gap-2">
            {location.pathname !== '/' && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="icon-btn size-8! hidden sm:grid"
                aria-label="Go back"
                title="Back"
              >
                <ArrowLeft className="size-3.5" />
              </button>
            )}
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              <Link to="/" className="eyebrow hidden text-[var(--st-on)] hover:text-[var(--st-cyan)] sm:inline">
                INSTRUMENTA
              </Link>
              {crumbs.map((c, idx) => (
                <span key={`${c.label}-${idx}`} className="flex min-w-0 items-center gap-1.5">
                  <span className="eyebrow hidden sm:inline">/</span>
                  {c.to ? (
                    <Link to={c.to} className="eyebrow truncate hover:text-[var(--st-on)]">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="eyebrow truncate text-[var(--st-on)]">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* Desktop Dropdown / Mega-Menu Navigation */}
          <div ref={topNavRef} className="ml-2 hidden flex-1 items-center gap-1 xl:flex">
            {MAIN_NAV.map((item) => {
              const active = isNavActive(item.path);
              const isOpen = openMenu === item.id;
              if (!item.children) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`rounded-full px-3 py-1.5 text-xs transition ${
                      active
                        ? 'bg-[var(--st-3)] font-medium text-[var(--st-on)]'
                        : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenMenu((prev) => (prev === item.id ? null : item.id))}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs transition ${
                      active || isOpen
                        ? 'bg-[var(--st-3)] font-medium text-[var(--st-on)]'
                        : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`size-3 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="pod absolute left-0 top-full z-40 mt-2 w-80 rounded-3xl p-2 shadow-2xl">
                      <div className="mb-1 flex items-center justify-between px-3 py-1.5">
                        <span className="eyebrow">{item.label}</span>
                        <Link
                          to={item.path}
                          onClick={() => setOpenMenu(null)}
                          className="mono text-[10px] text-[var(--st-cyan)] hover:underline"
                        >
                          Open Hub →
                        </Link>
                      </div>
                      <div className="space-y-0.5">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setOpenMenu(null)}
                            className="block rounded-2xl px-3 py-2 transition hover:bg-[var(--st-3)]"
                          >
                            <p className="text-xs font-medium text-[var(--st-on)]">{sub.label}</p>
                            {sub.sub && <p className="muted truncate text-[10.5px]">{sub.sub}</p>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Controls: Search Trigger + Bookmarks + Mobile Theme */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--st-line)] bg-[var(--st-void)] px-3 py-1.5 text-xs text-[var(--st-on-var)] transition hover:border-[var(--st-edge)] hover:text-[var(--st-on)]"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search platform…</span>
              <kbd className="mono hidden rounded bg-[var(--st-2)] px-1.5 py-0.5 text-[10px] text-[var(--st-outline)] md:inline">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setBookmarksOpen(true)}
              className="btn py-1.5! lg:hidden"
              aria-label="Open bookmarks"
            >
              <Bookmark className="size-3.5" />
              <span className="mono text-[11px]">{bookmarks.length}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="icon-btn size-9! lg:hidden"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </header>

        {/* Secondary Compact Horizontal Sub-Nav for Medium Viewports (lg to xl) */}
        <nav
          aria-label="Desktop section links"
          className="hidden items-center gap-1.5 overflow-x-auto border-b border-[var(--st-line)] bg-[var(--st-0)] px-4 py-1.5 lg:flex xl:hidden"
        >
          {MAIN_NAV.map((item) => {
            const active = isNavActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                  active
                    ? 'bg-[var(--st-3)] font-medium text-[var(--st-on)]'
                    : 'text-[var(--st-on-var)] hover:text-[var(--st-on)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Expandable Accordion Navigation */}
        {mobileNavOpen && (
          <div className="border-b border-[var(--st-line)] bg-[var(--st-0)] p-3 lg:hidden">
            <nav aria-label="Mobile navigation" className="space-y-1.5">
              {MAIN_NAV.map((item) => {
                const Icon = item.icon;
                const expanded = mobileAccordion === item.id;
                const active = isNavActive(item.path);
                if (!item.children) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm ${
                        active ? 'bg-[var(--st-3)] font-medium text-[var(--st-on)]' : 'text-[var(--st-on-var)]'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                }
                return (
                  <div key={item.id} className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)]">
                    <button
                      type="button"
                      onClick={() => setMobileAccordion((prev) => (prev === item.id ? null : item.id))}
                      aria-expanded={expanded}
                      className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm font-medium text-[var(--st-on)]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="size-4 text-[var(--st-cyan)]" />
                        {item.label}
                      </span>
                      <ChevronDown className={`size-4 transition ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    {expanded && (
                      <div className="space-y-1 border-t border-[var(--st-line)] px-2 py-2">
                        <Link
                          to={item.path}
                          className="block rounded-xl px-3 py-1.5 text-xs font-medium text-[var(--st-cyan)] hover:bg-[var(--st-2)]"
                        >
                          View All {item.label}
                        </Link>
                        {item.children.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="block rounded-xl px-3 py-1.5 text-xs text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>

        <footer className="border-t border-[var(--st-line)] px-6 py-4 text-xs text-[var(--st-on-var)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Wrench className="size-3.5 text-[var(--st-cyan)]" />
              <strong className="font-medium text-[var(--st-on)]">INSTRUMENTA</strong>
              <span>· B.Tech Instrumentation &amp; Control Engineering Platform (Semesters 1–6)</span>
            </span>
            <span className="mono text-[11px]">
              IEC 60751 · IEC 60584 · ISO 5167 · IEC 61131-3 · ISA-5.1
            </span>
          </div>
        </footer>
      </div>

      <SearchModal />
      <BookmarksDrawer />
    </div>
  );
}

