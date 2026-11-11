import {
  ArrowRight,
  BookOpen,
  Box,
  Calculator,
  Cpu,
  FolderTree,
  GraduationCap,
  HelpCircle,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { NITJ_CURRICULUM_SUBJECTS } from '@/data/curriculum';
import { CANONICAL_INSTRUMENTS } from '@/data/instrumentRegistry';
import { INTERVIEW_QUESTION_BANK } from '@/data/interviewBankData';
import {
  buildUnifiedNavigationTree,
  getCanonicalInstrumentUrl,
  resolveCanonicalPath,
  TREE_SUBJECTS,
} from '@/data/navigationTree';
import { getPlainDisplayName } from '@/data/simpleGuides';

const TOOLBOX_SEARCH_ITEMS = [
  { id: 'rtd-resistance', title: 'RTD Resistance Calculator', path: 'Toolbox › Temperature' },
  { id: 'temp-conversion', title: 'Temperature Unit Converter', path: 'Toolbox › Temperature' },
  { id: 'thermocouple-emf', title: 'Thermocouple Voltage Calculator', path: 'Toolbox › Temperature' },
  { id: 'pressure-units', title: 'Pressure Unit Converter', path: 'Toolbox › Pressure' },
  { id: 'flow-rate', title: 'Orifice Flow Rate Calculator', path: 'Toolbox › Flow' },
  { id: 'level-dp', title: 'Hydrostatic Tank Level Calculator', path: 'Toolbox › Level' },
  { id: 'loop-scaling', title: '4–20 mA Loop Calculator', path: 'Toolbox › Signals' },
  { id: 'adc-resolution', title: 'ADC Resolution Calculator', path: 'Toolbox › Electronics' },
  { id: 'wheatstone-bridge', title: 'Wheatstone Bridge Calculator', path: 'Toolbox › Bridges' },
  { id: 'measurement-error', title: 'Measurement Error Calculator', path: 'Toolbox › Calibration' },
  { id: 'pid-tuning', title: 'PID Tuning & Step Simulator', path: 'Toolbox › Control' },
  { id: 'valve-sizing', title: 'Control Valve Cv / Kv Sizing Calculator', path: 'Toolbox › Final Control' },
];

type SearchKind = 'Instrument' | 'Topic group' | 'Subject' | 'Concept' | 'Question' | 'Toolbox' | 'Simulator';

interface SearchEntry {
  key: string;
  kind: SearchKind;
  title: string;
  pathLabel: string;
  searchTokens: string;
  route: string;
}

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const index = useMemo<SearchEntry[]>(() => {
    const items: SearchEntry[] = [];

    for (const inst of CANONICAL_INSTRUMENTS) {
      const path = resolveCanonicalPath(inst.id);
      const pathLabel = path
        ? `${path.subject.shortName} › ${path.family.label} › ${inst.abbreviation || inst.name}`
        : inst.name;

      items.push({
        key: `inst-${inst.id}`,
        kind: 'Instrument',
        title: getPlainDisplayName(inst),
        pathLabel,
        searchTokens: `${inst.name} ${inst.abbreviation ?? ''} ${inst.id} ${pathLabel} ${inst.overview}`.toLowerCase(),
        route: getCanonicalInstrumentUrl(inst.id),
      });
    }

    for (const s of TREE_SUBJECTS) {
      items.push({
        key: `subj-${s.id}`,
        kind: 'Subject',
        title: s.name,
        pathLabel: `${s.semesterLabel} › ${s.code}`,
        searchTokens: `${s.code} ${s.name} ${s.shortName} ${s.semesterLabel}`.toLowerCase(),
        route: `/learn?sem=${s.semesterKey}&subject=${encodeURIComponent(s.id)}`,
      });
    }

    for (const node of buildUnifiedNavigationTree()) {
      for (const famNode of node.families) {
        items.push({
          key: `fam-${node.subject.id}-${famNode.family.key}`,
          kind: 'Topic group',
          title: famNode.family.label,
          pathLabel: `${node.subject.shortName} › ${famNode.family.label}`,
          searchTokens: `${famNode.family.label} ${node.subject.shortName}`.toLowerCase(),
          route: `/learn?sem=${node.subject.semesterKey}&subject=${encodeURIComponent(node.subject.id)}&family=${encodeURIComponent(famNode.family.key)}`,
        });
      }
    }

    for (const cSubj of NITJ_CURRICULUM_SUBJECTS) {
      const semKey =
        cSubj.semester === 'additional' ? 'additional' : `sem${cSubj.semester}`;
      for (const unit of cSubj.units) {
        items.push({
          key: `unit-${cSubj.id}-${unit.unitNumber}`,
          kind: 'Topic group',
          title: `Section ${unit.unitNumber}: ${unit.title}`,
          pathLabel: `${cSubj.shortName} › Section ${unit.unitNumber}`,
          searchTokens: `${unit.title} ${unit.summary} ${cSubj.shortName} ${cSubj.code}`.toLowerCase(),
          route: `/learn?sem=${semKey}&subject=${encodeURIComponent(cSubj.id)}&unit=${unit.unitNumber}`,
        });
        for (const topic of unit.topics) {
          items.push({
            key: `concept-${cSubj.id}-${topic.id}`,
            kind: 'Concept',
            title: topic.title,
            pathLabel: `${cSubj.shortName} › Section ${unit.unitNumber}`,
            searchTokens: `${topic.title} ${topic.summary} ${unit.title} ${cSubj.shortName} ${cSubj.code}`.toLowerCase(),
            route: `/learn?sem=${semKey}&subject=${encodeURIComponent(cSubj.id)}&unit=${unit.unitNumber}&concept=${encodeURIComponent(topic.id)}`,
          });
        }
      }
    }

    for (const q of INTERVIEW_QUESTION_BANK) {
      items.push({
        key: `q-${q.id}`,
        kind: 'Question',
        title: q.question,
        pathLabel: `Interview Prep › ${q.subject}`,
        searchTokens: `${q.question} ${q.subject} ${q.kind}`.toLowerCase(),
        route: `/interview?q=${q.id}`,
      });
    }

    for (const t of TOOLBOX_SEARCH_ITEMS) {
      items.push({
        key: `tool-${t.id}`,
        kind: 'Toolbox',
        title: t.title,
        pathLabel: t.path,
        searchTokens: `${t.title} ${t.path}`.toLowerCase(),
        route: `/toolbox/${t.id}`,
      });
    }

    items.push({
      key: 'ladder-sim',
      kind: 'Simulator',
      title: 'PLC Ladder Simulator',
      pathLabel: 'Automation › Ladder simulator',
      searchTokens: 'plc ladder simulator logic coils timers',
      route: '/automation/ladder',
    });

    return items;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return index.filter((i) => i.kind === 'Instrument').slice(0, 8);
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    return index
      .filter((entry) => tokens.every((tok) => entry.searchTokens.includes(tok)))
      .slice(0, 15);
  }, [index, query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const selectEntry = (entry: SearchEntry) => {
    setSearchOpen(false);
    navigate(entry.route);
  };

  const renderIcon = (kind: SearchKind) => {
    if (kind === 'Instrument') return <Box className="size-4 shrink-0 text-[var(--st-accent-text)]" />;
    if (kind === 'Subject') return <GraduationCap className="size-4 shrink-0 text-[var(--st-accent-text)]" />;
    if (kind === 'Topic group') return <FolderTree className="size-4 shrink-0 text-[var(--st-accent-text)]" />;
    if (kind === 'Concept') return <BookOpen className="size-4 shrink-0 text-[var(--st-iris)]" />;
    if (kind === 'Toolbox') return <Calculator className="size-4 shrink-0 text-[var(--st-amber)]" />;
    if (kind === 'Simulator') return <Cpu className="size-4 shrink-0 text-[var(--st-accent-text)]" />;
    return <HelpCircle className="size-4 shrink-0 text-[var(--st-on-var)]" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-4 pt-16 backdrop-blur-sm sm:pt-20"
      role="dialog"
      aria-modal="true"
      aria-label="Search site"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="glass w-full max-w-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--st-line)] px-4 py-3">
          <Search className="size-4 shrink-0 text-[var(--st-on-var)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchOpen(false);
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIdx((i) => Math.min(results.length - 1, i + 1));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIdx((i) => Math.max(0, i - 1));
              }
              if (e.key === 'Enter' && results[selectedIdx]) {
                selectEntry(results[selectedIdx]);
              }
            }}
            placeholder="Type an instrument, subject, or question…"
            className="w-full bg-transparent text-[16px] text-[var(--st-on)] outline-none placeholder:text-[var(--st-on-var)]"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="icon-btn"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="muted p-6 text-center text-[16px]">No matches found for &ldquo;{query}&rdquo;.</p>
          ) : (
            <ul className="space-y-1">
              {results.map((item, idx) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => selectEntry(item)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition ${
                      idx === selectedIdx ? 'bg-[var(--st-3)]' : 'hover:bg-[var(--st-2)]'
                    }`}
                  >
                    {renderIcon(item.kind)}
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-semibold text-[var(--st-on)]">
                        {item.title}
                      </span>
                      <p className="muted truncate text-[14px]">{item.pathLabel}</p>
                    </div>
                    <span className="pill shrink-0 text-[14px]">{item.kind}</span>
                    <ArrowRight className="size-4 shrink-0 text-[var(--st-on-var)]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
