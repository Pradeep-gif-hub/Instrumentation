import { ArrowRight, Bookmark, Box, Compass, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { findCanonicalForTopic } from '@/data/instrumentRegistry';
import {
  ALL_INSTRUMENTS,
  getCategoryMeta,
  INSTRUMENT_CATEGORIES,
  INSTRUMENTS_BY_CATEGORY,
} from '@/data/instruments';
import type { InstrumentCategoryId } from '@/types/engineering';

export function InstrumentationHubPage() {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useApp();
  const [filterText, setFilterText] = useState('');
  const [only3D, setOnly3D] = useState(false);

  const activeCategoryMeta = getCategoryMeta(category);
  const selectedCat: InstrumentCategoryId | 'all' = activeCategoryMeta ? activeCategoryMeta.id : 'all';

  const topicHas3D = (cat: string, slug: string, legacy3D: boolean) =>
    legacy3D || Boolean(findCanonicalForTopic(cat, slug)?.hasDedicated3D);

  const total3DInHub = useMemo(
    () => ALL_INSTRUMENTS.filter((t) => Boolean(t.has3DModel) || Boolean(findCanonicalForTopic(t.category, t.slug)?.hasDedicated3D)).length,
    [],
  );

  const visibleTopics = useMemo(() => {
    const base =
      selectedCat === 'all' ? ALL_INSTRUMENTS : INSTRUMENTS_BY_CATEGORY[selectedCat];
    const q = filterText.trim().toLowerCase();
    return base.filter((t) => {
      if (only3D && !topicHas3D(t.category, t.slug, Boolean(t.has3DModel))) return false;
      if (!q) return true;
      return `${t.title} ${t.subtitle} ${t.standardRef} ${t.categoryLabel}`
        .toLowerCase()
        .includes(q);
    });
  }, [selectedCat, filterText, only3D]);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[var(--st-accent-text)]">
            {activeCategoryMeta ? activeCategoryMeta.eyebrow : 'INSTRUMENTATION KNOWLEDGE HUB · 7 DOMAINS'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)]">
            {activeCategoryMeta ? activeCategoryMeta.label : 'Process Instrumentation Encyclopedia'}
          </h1>
          <p className="muted mt-1 max-w-3xl text-sm">
            {activeCategoryMeta
              ? activeCategoryMeta.summary
              : 'All 59 industrial instrumentation topics—each standardized with working principle, equations, characteristic curves, installation, calibration, troubleshooting, and worked numericals.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/lab" className="btn">
            <Compass className="size-4 text-[var(--st-accent-text)]" />
            Full Curriculum 3D Lab &amp; Inventory
          </Link>
          <Link to="/instrumentation/temperature/rtd" className="btn primary">
            <Box className="size-4" />
            Launch Flagship RTD 3D CAD
          </Link>
        </div>
      </header>

      {/* Search + Category Filter Bar matching Odyssey datasets bar */}
      <div className="glass flex flex-wrap items-center gap-2.5 p-3">
        <label className="relative min-w-60 flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--st-on-var)]" />
          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter instruments by name, standard (IEC/ISO/ISA), or principle…"
            aria-label="Filter instruments"
            className="field pl-10!"
          />
        </label>

        <button
          type="button"
          onClick={() => setOnly3D((v) => !v)}
          className={`btn ${only3D ? 'primary' : ''}`}
        >
          <Box className="size-3.5" />
          3D CAD Only ({total3DInHub})
        </button>
      </div>

      {/* Category Segmented Filter */}
      <div className="seg" role="tablist" aria-label="Instrumentation categories">
        <button
          type="button"
          onClick={() => navigate('/instrumentation')}
          className={selectedCat === 'all' ? 'on' : ''}
        >
          All Categories <span className="mono ml-1 opacity-60">{ALL_INSTRUMENTS.length}</span>
        </button>
        {INSTRUMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => navigate(`/instrumentation/${cat.id}`)}
            className={selectedCat === cat.id ? 'on' : ''}
          >
            {cat.shortLabel}
            <span className="mono ml-1 opacity-60">{INSTRUMENTS_BY_CATEGORY[cat.id].length}</span>
          </button>
        ))}
      </div>

      {/* Instrument Cards Grid */}
      {visibleTopics.length === 0 ? (
        <div className="glass p-10 text-center">
          <p className="text-sm font-medium text-[var(--st-on)]">No matching instruments found.</p>
          <p className="muted mt-1 text-xs">Clear the filter text or disable the 3D CAD filter.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleTopics.map((topic) => {
            const bmId = `instrument:${topic.category}:${topic.slug}`;
            const saved = isBookmarked(bmId);
            const canonical = findCanonicalForTopic(topic.category, topic.slug);
            const has3D = topicHas3D(topic.category, topic.slug, Boolean(topic.has3DModel));
            const hasSim = Boolean(canonical?.hasSimulation);
            return (
              <div key={topic.id} className="ui-card flex flex-col justify-between gap-3 p-5">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="eyebrow">{topic.categoryLabel}</span>
                    <div className="flex items-center gap-1.5">
                      {has3D && (
                        <span className="status" style={{ '--tone': 'var(--st-accent)' } as React.CSSProperties}>
                          {hasSim ? '3D + Sim' : '3D CAD'}
                        </span>
                      )}
                      {!has3D && canonical?.classification === 'concept-domain' && (
                        <span className="pill text-[9px] mono">Reference</span>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          toggleBookmark({
                            id: bmId,
                            itemType: 'instrument',
                            title: topic.title,
                            subtitle: `${topic.categoryLabel} · ${topic.standardRef}`,
                            route: `/instrumentation/${topic.category}/${topic.slug}`,
                          })
                        }
                        aria-label={`Bookmark ${topic.title}`}
                        className={`icon-btn size-7! ${saved ? 'border-[var(--st-accent)]! text-[var(--st-accent-text)]!' : ''}`}
                      >
                        <Bookmark className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <Link
                    to={`/instrumentation/${topic.category}/${topic.slug}`}
                    className="block group"
                  >
                    <h2 className="text-base font-semibold text-[var(--st-on)] transition group-hover:text-[var(--st-accent-text)]">
                      {topic.title}
                    </h2>
                    <p className="muted mt-1 line-clamp-2 text-xs leading-relaxed">{topic.subtitle}</p>
                  </Link>
                </div>

                <div className="space-y-2 border-t border-[var(--st-line)] pt-3">
                  <div className="kv py-1!">
                    <span>Standard</span>
                    <span>{topic.standardRef.split('·')[0].trim()}</span>
                  </div>
                  <div className="kv py-1!">
                    <span>Typical Span</span>
                    <span className="max-w-[180px] truncate" title={topic.measurementRange.typicalSpan}>
                      {topic.measurementRange.typicalSpan}
                    </span>
                  </div>
                  <Link
                    to={`/instrumentation/${topic.category}/${topic.slug}`}
                    className="btn mt-1 w-full justify-between"
                  >
                    <span>
                      {has3D
                        ? hasSim
                          ? 'Open 3D Explorer, Sim & Docs'
                          : 'Open 3D Explorer & Docs'
                        : 'Open 20-Point Spec Sheet'}
                    </span>
                    <ArrowRight className="size-3.5 text-[var(--st-accent-text)]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

