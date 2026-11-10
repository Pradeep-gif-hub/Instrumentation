import {
  BookOpen,
  Box,
  Briefcase,
  Calculator,
  ChevronDown,
  ChevronRight,
  Cpu,
  Factory,
  LayoutDashboard,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  buildUnifiedNavigationTree,
  getCanonicalInstrumentUrl,
  TOPIC_FAMILIES,
  type TopicFamilyKey,
} from '@/data/navigationTree';

interface NavigationTreeProps {
  mode: 'desktop' | 'mobile';
  activeInstrumentId?: string;
}

export function NavigationTree({ mode, activeInstrumentId }: NavigationTreeProps) {
  const {
    expandedSubjects,
    expandedFamilies,
    setTreeCollapsedDesktop,
    setMobileTreeOpen,
    treeFamilyFilter,
    setTreeFamilyFilter,
    treeOnly3D,
    setTreeOnly3D,
    toggleSubjectNode,
    toggleFamilyNode,
    expandSubjectAll,
    collapseSubjectAll,
  } = useApp();

  const location = useLocation();
  const treeRef = useRef<HTMLDivElement | null>(null);
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  const treeNodes = useMemo(
    () => buildUnifiedNavigationTree({ familyFilter: treeFamilyFilter, only3D: treeOnly3D }),
    [treeFamilyFilter, treeOnly3D],
  );

  // When a family filter or 3D-only filter is applied actively inside the tree, keep subjects easy to scan
  useEffect(() => {
    if (activeInstrumentId && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeInstrumentId]);

  const handleTreeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = treeRef.current;
    if (!container) return;

    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'SELECT';
    if (isInput && e.key !== 'Escape') return;

    if (e.key === 'Escape' && mode === 'mobile') {
      e.preventDefault();
      setMobileTreeOpen(false);
      return;
    }

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-tree-item="true"]'),
    );
    if (items.length === 0) return;

    const idx = items.indexOf(target);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = idx < items.length - 1 ? items[idx + 1] : items[0];
      next?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = idx > 0 ? items[idx - 1] : items[items.length - 1];
      prev?.focus();
    } else if (e.key === 'ArrowRight' && idx >= 0) {
      const el = items[idx];
      const expanded = el.getAttribute('aria-expanded');
      if (expanded === 'false') {
        e.preventDefault();
        el.click();
      } else if (expanded === 'true' && idx + 1 < items.length) {
        e.preventDefault();
        items[idx + 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx >= 0) {
      const el = items[idx];
      const expanded = el.getAttribute('aria-expanded');
      if (expanded === 'true') {
        e.preventDefault();
        el.click();
      } else {
        const parentKey = el.getAttribute('data-parent-id');
        if (parentKey) {
          const parentBtn = container.querySelector<HTMLElement>(
            `[data-node-id="${CSS.escape(parentKey)}"]`,
          );
          if (parentBtn) {
            e.preventDefault();
            parentBtn.focus();
          }
        }
      }
    }
  };

  const closeIfMobile = () => {
    if (mode === 'mobile') setMobileTreeOpen(false);
  };

  return (
    <div
      ref={treeRef}
      onKeyDown={handleTreeKeyDown}
      role="region"
      aria-label="Unified instrument navigation tree"
      className="flex h-full flex-col bg-[var(--st-0)] text-[var(--st-on)]"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-[var(--st-line)] px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="eyebrow text-[var(--st-accent-text)]">CURRICULUM TREE</p>
          <p className="truncate text-xs font-medium text-[var(--st-on)]">
            Subject → Family → Instrument
          </p>
        </div>

        {mode === 'desktop' ? (
          <button
            type="button"
            onClick={() => setTreeCollapsedDesktop(true)}
            aria-label="Collapse navigation panel to icon rail"
            title="Collapse tree panel"
            className="icon-btn size-8! shrink-0"
          >
            <PanelLeftClose className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMobileTreeOpen(false)}
            aria-label="Close browse menu"
            className="icon-btn size-9! shrink-0"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filters Inside Tree Panel (Step 2) */}
      <div className="space-y-2 border-b border-[var(--st-line)] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <select
            aria-label="Filter tree by topic family"
            value={treeFamilyFilter}
            onChange={(e) => setTreeFamilyFilter(e.target.value as TopicFamilyKey | 'all')}
            className="field min-w-0 flex-1 py-1.5! text-xs!"
          >
            <option value="all">All 9 Families</option>
            {TOPIC_FAMILIES.map((fam) => (
              <option key={fam.key} value={fam.key}>
                {fam.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setTreeOnly3D((v) => !v)}
            aria-pressed={treeOnly3D}
            title="Filter to dedicated 3D CAD instruments"
            className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition ${
              treeOnly3D
                ? 'border-[var(--st-accent)] bg-[var(--st-accent)]/15 text-[var(--st-accent-text)]'
                : 'border-[var(--st-line)] bg-[var(--st-1)] text-[var(--st-on-var)] hover:text-[var(--st-on)]'
            }`}
          >
            <Box className="size-3" />
            <span>3D</span>
          </button>
        </div>
      </div>

      {/* Hierarchical Tree: Subject -> Topic Family -> Instrument (Strict Lazy Children) */}
      <div className="flex-1 overflow-y-auto px-2 py-2.5" role="tree" aria-label="Subjects and instruments">
        <ul className="space-y-1">
          {treeNodes.map((node) => {
            const { subject, families, totalPrimaryCount, alsoUsedInInstruments } = node;
            const isSubjOpen = expandedSubjects.includes(subject.id);
            const subjFamilyKeys = families.map((f) => f.family.key);

            return (
              <li key={subject.id} role="treeitem" aria-expanded={isSubjOpen}>
                <button
                  type="button"
                  data-tree-item="true"
                  data-node-id={`subj:${subject.id}`}
                  aria-expanded={isSubjOpen}
                  onClick={() => toggleSubjectNode(subject.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-left transition ${
                    isSubjOpen
                      ? 'bg-[var(--st-2)] text-[var(--st-on)]'
                      : 'text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]'
                  }`}
                >
                  {isSubjOpen ? (
                    <ChevronDown className="size-3.5 shrink-0 text-[var(--st-accent-text)]" />
                  ) : (
                    <ChevronRight className="size-3.5 shrink-0 text-[var(--st-outline)]" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`mono rounded px-1.5 py-0.5 text-[9.5px] font-medium ${
                          subject.isSupplementary
                            ? 'bg-[var(--st-amber)]/15 text-[var(--st-amber)]'
                            : 'bg-[var(--st-3)] text-[var(--st-accent-text)]'
                        }`}
                      >
                        {subject.badgeText}
                      </span>
                      <span className="mono truncate text-[10px] text-[var(--st-outline)]">
                        {subject.code}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium text-[var(--st-on)]">
                      {subject.shortName}
                    </p>
                  </div>

                  <span className="mono shrink-0 rounded-full bg-[var(--st-1)] px-2 py-0.5 text-[10px] text-[var(--st-on-var)]">
                    {totalPrimaryCount}
                  </span>
                </button>

                {/* Render Level 2 Topic Families ONLY when Subject is open */}
                {isSubjOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-[var(--st-line)] pl-2">
                    {/* Expand all / Collapse all per subject (Step 1) */}
                    {families.length > 0 && (
                      <div className="flex items-center justify-between px-2 py-0.5 text-[10px]">
                        <span className="mono text-[var(--st-outline)]">
                          {families.length} {families.length === 1 ? 'family' : 'families'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => expandSubjectAll(subject.id, subjFamilyKeys)}
                            className="cursor-pointer font-medium text-[var(--st-accent-text)] hover:underline"
                          >
                            Expand all
                          </button>
                          <button
                            type="button"
                            onClick={() => collapseSubjectAll(subject.id, subjFamilyKeys)}
                            className="cursor-pointer text-[var(--st-on-var)] hover:text-[var(--st-on)] hover:underline"
                          >
                            Collapse all
                          </button>
                        </div>
                      </div>
                    )}

                    <ul className="space-y-0.5" role="group">
                      {families.map((famNode) => {
                        const famKey = `${subject.id}:${famNode.family.key}`;
                        const isFamOpen = expandedFamilies.includes(famKey);

                        return (
                          <li key={famKey} role="treeitem" aria-expanded={isFamOpen}>
                            <button
                              type="button"
                              data-tree-item="true"
                              data-node-id={`fam:${famKey}`}
                              data-parent-id={`subj:${subject.id}`}
                              aria-expanded={isFamOpen}
                              onClick={() => toggleFamilyNode(subject.id, famNode.family.key)}
                              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                                isFamOpen
                                  ? 'bg-[var(--st-2)] font-medium text-[var(--st-on)]'
                                  : 'text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]'
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-1.5">
                                {isFamOpen ? (
                                  <ChevronDown className="size-3 shrink-0 text-[var(--st-accent-text)]" />
                                ) : (
                                  <ChevronRight className="size-3 shrink-0 text-[var(--st-outline)]" />
                                )}
                                <span className="truncate">{famNode.family.label}</span>
                              </span>
                              <span className="mono shrink-0 text-[10px] text-[var(--st-outline)]">
                                {famNode.instruments.length}
                              </span>
                            </button>

                            {/* Render Level 3 Instruments ONLY when Family is open */}
                            {isFamOpen && (
                              <ul
                                className="ml-3 mt-0.5 space-y-0.5 border-l border-[var(--st-line)] pl-2"
                                role="group"
                              >
                                {famNode.instruments.map((inst) => {
                                  const active = activeInstrumentId === inst.id;
                                  return (
                                    <li key={inst.id} role="treeitem">
                                      <Link
                                        ref={active ? activeItemRef : undefined}
                                        data-tree-item="true"
                                        data-parent-id={`fam:${famKey}`}
                                        to={getCanonicalInstrumentUrl(inst.id)}
                                        aria-current={active ? 'page' : undefined}
                                        onClick={closeIfMobile}
                                        className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11.5px] transition ${
                                          active
                                            ? 'bg-[var(--st-3)] font-semibold text-[var(--st-accent-text)] ring-1 ring-[var(--st-accent)]/45'
                                            : 'text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]'
                                        }`}
                                      >
                                        <span className="truncate">{inst.name}</span>
                                        {inst.hasDedicated3D && (
                                          <span className="mono shrink-0 text-[9px] text-[var(--st-accent-text)]">
                                            3D
                                          </span>
                                        )}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Compact "Also used in" cross-links (no duplicate tree leaves) */}
                    {alsoUsedInInstruments.length > 0 && (
                      <div className="mt-1.5 rounded-lg bg-[var(--st-1)] px-2 py-1.5">
                        <p className="eyebrow text-[9px]! text-[var(--st-outline)]">
                          ALSO USED IN THIS COURSE
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {alsoUsedInInstruments.map((refInst) => (
                            <Link
                              key={refInst.id}
                              data-tree-item="true"
                              data-parent-id={`subj:${subject.id}`}
                              to={getCanonicalInstrumentUrl(refInst.id)}
                              onClick={closeIfMobile}
                              className="rounded border border-[var(--st-line)] bg-[var(--st-0)] px-1.5 py-0.5 text-[10px] text-[var(--st-on-var)] transition hover:border-[var(--st-accent)]/50 hover:text-[var(--st-accent-text)]"
                            >
                              {refInst.abbreviation || refInst.name.split('(')[0].trim()}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Ordered Navigation: Interview Prep · Engineering Toolbox · Overview (+ existing hubs) */}
      <div className="space-y-2 border-t border-[var(--st-line)] px-3 py-2.5">
        <nav aria-label="Platform tools" className="space-y-0.5">
          <Link
            data-tree-item="true"
            to="/interview"
            onClick={closeIfMobile}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
              location.pathname.startsWith('/interview')
                ? 'bg-[var(--st-3)] font-semibold text-[var(--st-on)]'
                : 'text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]'
            }`}
          >
            <Briefcase className="size-3.5 text-[var(--st-accent-text)]" />
            <span>Interview Prep</span>
          </Link>

          <Link
            data-tree-item="true"
            to="/toolbox"
            onClick={closeIfMobile}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
              location.pathname.startsWith('/toolbox')
                ? 'bg-[var(--st-3)] font-semibold text-[var(--st-on)]'
                : 'text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]'
            }`}
          >
            <Calculator className="size-3.5 text-[var(--st-amber)]" />
            <span>Engineering Toolbox</span>
          </Link>

          <Link
            data-tree-item="true"
            to="/"
            onClick={closeIfMobile}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
              location.pathname === '/'
                ? 'bg-[var(--st-3)] font-semibold text-[var(--st-on)]'
                : 'text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]'
            }`}
          >
            <LayoutDashboard className="size-3.5 text-[var(--st-accent-text)]" />
            <span>Overview</span>
          </Link>
        </nav>

        <div className="flex flex-wrap gap-1 border-t border-[var(--st-line)] pt-2">
          <Link
            to="/roadmap"
            onClick={closeIfMobile}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]"
          >
            <BookOpen className="size-3" /> Syllabus
          </Link>
          <Link
            to="/automation"
            onClick={closeIfMobile}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]"
          >
            <Cpu className="size-3" /> PLC Lab
          </Link>
          <Link
            to="/applications"
            onClick={closeIfMobile}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-[var(--st-on-var)] hover:bg-[var(--st-1)] hover:text-[var(--st-on)]"
          >
            <Factory className="size-3" /> Plant P&amp;ID
          </Link>
        </div>
      </div>
    </div>
  );
}

