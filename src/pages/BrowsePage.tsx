import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CANONICAL_INSTRUMENTS } from '@/data/instrumentRegistry';
import { getPlainDisplayName, getPlainSummaryLine } from '@/data/simpleGuides';
import {
  getCanonicalInstrumentUrl,
  getLegacyCategoryToFamily,
  MORE_BROWSE_FAMILIES,
  PRIMARY_BROWSE_FAMILIES,
  resolveCanonicalPath,
  type TopicFamilyKey,
} from '@/data/navigationTree';

const PAGE_SIZE = 10;

export function BrowsePage() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const urlFamily =
    (searchParams.get('family') as TopicFamilyKey | null) ||
    (category ? getLegacyCategoryToFamily(category) : 'all');

  const [query, setQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<TopicFamilyKey | null>(
    urlFamily && urlFamily !== 'all' ? urlFamily : null,
  );
  const [showMoreChips, setShowMoreChips] = useState(
    Boolean(selectedFamily && MORE_BROWSE_FAMILIES.some((f) => f.key === selectedFamily)),
  );
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    const nextFamily = urlFamily && urlFamily !== 'all' ? urlFamily : null;
    setSelectedFamily(nextFamily);
    if (nextFamily && MORE_BROWSE_FAMILIES.some((f) => f.key === nextFamily)) {
      setShowMoreChips(true);
    }
    setLimit(PAGE_SIZE);
  }, [urlFamily]);

  useEffect(() => {
    if (searchParams.get('focus') === 'search') {
      inputRef.current?.focus();
    }
  }, [searchParams]);

  const hasFilter = query.trim().length > 0 || selectedFamily !== null;

  const matched = useMemo(() => {
    if (!hasFilter) return [];
    const q = query.trim().toLowerCase();
    return CANONICAL_INSTRUMENTS.filter((entry) => {
      const path = resolveCanonicalPath(entry.id);
      if (selectedFamily && path?.family.key !== selectedFamily) return false;
      if (!q) return true;
      return `${entry.name} ${entry.abbreviation ?? ''} ${path?.family.label ?? ''} ${entry.overview}`
        .toLowerCase()
        .includes(q);
    });
  }, [hasFilter, query, selectedFamily]);

  const visible = matched.slice(0, limit);

  const pickFamily = (key: TopicFamilyKey) => {
    const next = selectedFamily === key ? null : key;
    setSelectedFamily(next);
    setLimit(PAGE_SIZE);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (next) p.set('family', next);
      else p.delete('family');
      return p;
    });
  };

  return (
    <div className="mx-auto flex max-w-[70ch] flex-col gap-6">
      <div className="space-y-2">
        <h1>Look up an instrument</h1>
        <p className="text-[16px] text-[var(--st-on-var)]">
          Search by name or choose a group below.
        </p>
      </div>

      {/* Search Box */}
      <label className="relative block">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--st-on-var)]" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          placeholder="Type an instrument name (for example, RTD or Venturi)"
          aria-label="Search instruments"
          className="field pl-11!"
        />
      </label>

      {/* 6 Primary Group Chips + More */}
      <div className="space-y-3">
        <div className="seg" role="group" aria-label="Topic groups">
          {PRIMARY_BROWSE_FAMILIES.map((fam) => (
            <button
              key={fam.key}
              type="button"
              onClick={() => pickFamily(fam.key)}
              className={selectedFamily === fam.key ? 'on' : ''}
            >
              {fam.label}
            </button>
          ))}
          <button
            type="button"
            aria-expanded={showMoreChips}
            onClick={() => setShowMoreChips((v) => !v)}
            className={showMoreChips ? 'on' : ''}
          >
            More
          </button>
        </div>

        {showMoreChips && (
          <div className="seg" role="group" aria-label="More topic groups">
            {MORE_BROWSE_FAMILIES.map((fam) => (
              <button
                key={fam.key}
                type="button"
                onClick={() => pickFamily(fam.key)}
                className={selectedFamily === fam.key ? 'on' : ''}
              >
                {fam.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty Initial State vs Plain List (max 10 + Show more) */}
      {!hasFilter ? (
        <div className="glass p-6">
          <p className="text-[16px] text-[var(--st-on-var)]">
            Type a name or pick a group.
          </p>
        </div>
      ) : matched.length === 0 ? (
        <div className="glass p-6">
          <p className="text-[16px] text-[var(--st-on)]">No instruments match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            {visible.map((entry) => (
              <Link
                key={entry.id}
                to={getCanonicalInstrumentUrl(entry.id)}
                className="ui-card flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-[var(--st-on)]">
                    {getPlainDisplayName(entry)}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[14px] text-[var(--st-on-var)]">
                    {getPlainSummaryLine(entry)}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-[var(--st-accent)]" />
              </Link>
            ))}
          </div>

          {matched.length > visible.length && (
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
              className="btn w-full"
            >
              Show more ({matched.length - visible.length} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
