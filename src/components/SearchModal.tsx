import { Search, X, ArrowRight, Box, Cpu, Calculator, BookOpen, HelpCircle, Building2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ALL_INSTRUMENTS } from '@/data/instruments';
import { CANONICAL_INSTRUMENTS, findCanonicalForTopic } from '@/data/instrumentRegistry';
import { AUTOMATION_MODULES } from '@/data/automationData';
import { COMPANY_PREP_PROFILES } from '@/data/industryPrepData';
import { INTERVIEW_QUESTION_BANK } from '@/data/interviewBankData';
import { NITJ_CURRICULUM_SUBJECTS } from '@/data/curriculum';

const TOOLBOX_SEARCH_ITEMS = [
  { id: 'rtd-resistance', title: 'RTD Pt100 / Pt1000 Callendar-Van Dusen Calculator', sub: 'Toolbox · Resistance ↔ Temperature + Lead Error' },
  { id: 'temp-conversion', title: 'Temperature Unit Converter (°C / °F / K / °R)', sub: 'Toolbox · Absolute & Thermal Span Conversion' },
  { id: 'thermocouple-emf', title: 'Thermocouple Reference & CJC Calculator', sub: 'Toolbox · Type K/J/T/E/N/S mV ↔ °C with Cold Junction' },
  { id: 'pressure-units', title: 'Pressure Unit & Hydrostatic Head Converter', sub: 'Toolbox · bar, psi, kPa, mmH₂O, mmHg, ρgh' },
  { id: 'flow-rate', title: 'Orifice / DP Flow Rate Calculator', sub: 'Toolbox · ISO 5167 Mass/Volume Flow & Pressure Loss' },
  { id: 'level-dp', title: 'Hydrostatic DP Level (Open / Dry Leg / Wet Leg)', sub: 'Toolbox · LRV/URV Zero Elevation & Suppression' },
  { id: 'loop-scaling', title: '4–20 mA Loop Scaling & Burden Budget', sub: 'Toolbox · PV ↔ mA ↔ % + NAMUR NE43 + Max Load Ω' },
  { id: 'adc-resolution', title: 'ADC Resolution, Quantization & ENOB', sub: 'Toolbox · LSB, SNR = 6.02N + 1.76, Counts' },
  { id: 'wheatstone-bridge', title: 'Wheatstone Bridge Analyzer', sub: 'Toolbox · Quarter/Half/Full Bridge V_out & Lead Error' },
  { id: 'measurement-error', title: 'Measurement Error, RSS Uncertainty & TUR', sub: 'Toolbox · % FS vs % Reading + Combined RSS' },
  { id: 'pid-tuning', title: 'PID Tuning (Ziegler-Nichols & IMC) + Step Simulator', sub: 'Toolbox · FOPDT K, τ, θ → Kc, Ti, Td' },
];

interface SearchEntry {
  key: string;
  kind: 'Instrument' | 'Roadmap' | 'Automation' | 'Toolbox' | 'Company' | 'Interview';
  title: string;
  subtitle: string;
  route: string;
  is3D?: boolean;
}

export function SearchModal() {
  const { searchOpen, setSearchOpen, subjects } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const index = useMemo<SearchEntry[]>(() => {
    const items: SearchEntry[] = [];
    for (const inst of ALL_INSTRUMENTS) {
      const canonical = findCanonicalForTopic(inst.category, inst.slug);
      const has3D = inst.has3DModel || Boolean(canonical?.hasDedicated3D);
      items.push({
        key: `inst-${inst.id}`,
        kind: 'Instrument',
        title: inst.title,
        subtitle: `${inst.categoryLabel} · ${inst.standardRef}`,
        route: `/instrumentation/${inst.category}/${inst.slug}`,
        is3D: has3D,
      });
    }
    for (const cInst of CANONICAL_INSTRUMENTS) {
      if (cInst.existingTopicRef) continue;
      items.push({
        key: `lab-${cInst.id}`,
        kind: 'Instrument',
        title: cInst.abbreviation ? `${cInst.name} (${cInst.abbreviation})` : cInst.name,
        subtitle: `${cInst.categoryLabel} · ${cInst.standardRef}`,
        route: cInst.primaryRoute,
        is3D: cInst.hasDedicated3D,
      });
    }
    for (const s of subjects) {
      const semParam = s.id === 'nitj-supp-cal' ? 'additional' : String(s.semester);
      items.push({
        key: `subj-${s.id}`,
        kind: 'Roadmap',
        title: `${s.code} · ${s.name}`,
        subtitle: `Semester ${semParam === 'additional' ? 'V Elective (Supp.)' : s.semester} · ${s.credits} Credits · ${s.units.length} Units`,
        route: `/roadmap?sem=${semParam}&subject=${encodeURIComponent(s.id)}`,
      });
    }
    for (const cSubj of NITJ_CURRICULUM_SUBJECTS) {
      for (const unit of cSubj.units) {
        for (const topic of unit.topics) {
          items.push({
            key: `concept-${cSubj.id}-${topic.id}`,
            kind: 'Roadmap',
            title: topic.title,
            subtitle: `${cSubj.code} · ${cSubj.shortName} · Unit ${unit.unitNumber}`,
            route: `/roadmap?sem=${cSubj.semester}&subject=${encodeURIComponent(cSubj.id)}&unit=${unit.unitNumber}&concept=${encodeURIComponent(topic.id)}`,
          });
        }
      }
    }
    for (const mod of AUTOMATION_MODULES) {
      items.push({
        key: `auto-${mod.id}`,
        kind: 'Automation',
        title: mod.title,
        subtitle: mod.standard,
        route: `/automation/${mod.id}`,
      });
    }
    for (const t of TOOLBOX_SEARCH_ITEMS) {
      items.push({
        key: `tool-${t.id}`,
        kind: 'Toolbox',
        title: t.title,
        subtitle: t.sub,
        route: `/toolbox/${t.id}`,
      });
    }
    for (const c of COMPANY_PREP_PROFILES) {
      items.push({
        key: `comp-${c.id}`,
        kind: 'Company',
        title: c.name,
        subtitle: c.roleFocus,
        route: `/interview?tab=companies&company=${c.id}`,
      });
    }
    for (const q of INTERVIEW_QUESTION_BANK) {
      items.push({
        key: `q-${q.id}`,
        kind: 'Interview',
        title: q.question,
        subtitle: `${q.difficulty} · ${q.kind} · ${q.subject}`,
        route: `/interview?q=${q.id}`,
      });
    }
    return items;
  }, [subjects]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return index.filter((i) => i.is3D || i.kind === 'Toolbox').slice(0, 12);
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    return index
      .filter((entry) => {
        const hay = `${entry.title} ${entry.subtitle} ${entry.kind}`.toLowerCase();
        return tokens.every((tok) => hay.includes(tok));
      })
      .slice(0, 20);
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

  const go = (route: string) => {
    setSearchOpen(false);
    navigate(route);
  };

  const renderIcon = (kind: SearchEntry['kind']) => {
    if (kind === 'Instrument') return <Box className="size-4 text-[var(--st-cyan)]" />;
    if (kind === 'Roadmap') return <BookOpen className="size-4 text-[var(--st-iris)]" />;
    if (kind === 'Automation') return <Cpu className="size-4 text-[var(--st-phosphor)]" />;
    if (kind === 'Toolbox') return <Calculator className="size-4 text-[var(--st-amber)]" />;
    if (kind === 'Company') return <Building2 className="size-4 text-[var(--st-cyan)]" />;
    return <HelpCircle className="size-4 text-[var(--st-on-var)]" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-4 pt-20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Global engineering search"
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
                go(results[selectedIdx].route);
              }
            }}
            placeholder="Search instruments, 3D CAD, Semester 1–6 subjects, PLC/DCS, companies, calculators…"
            className="w-full bg-transparent text-sm text-[var(--st-on)] outline-none placeholder:text-[var(--st-on-var)]"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="icon-btn size-8!"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="muted p-6 text-center text-xs">No engineering records match "{query}".</p>
          ) : (
            <ul className="space-y-1">
              {results.map((item, idx) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => go(item.route)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition ${
                      idx === selectedIdx ? 'bg-[var(--st-3)]' : 'hover:bg-[var(--st-2)]'
                    }`}
                  >
                    {renderIcon(item.kind)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-[var(--st-on)]">{item.title}</span>
                        {item.is3D && (
                          <span className="status shrink-0" style={{ '--tone': 'var(--st-cyan)' } as React.CSSProperties}>
                            3D CAD
                          </span>
                        )}
                      </div>
                      <p className="muted truncate text-xs">{item.subtitle}</p>
                    </div>
                    <span className="pill shrink-0 text-[10px] mono">{item.kind}</span>
                    <ArrowRight className="size-3.5 shrink-0 text-[var(--st-on-var)]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--st-line)] px-4 py-2 text-[10px] mono text-[var(--st-outline)]">
          <span>↑↓ Navigate · Enter Open · Esc Close</span>
          <span>{ALL_INSTRUMENTS.length} Spec Sheets · {CANONICAL_INSTRUMENTS.filter((c) => c.hasDedicated3D).length} 3D Assemblies · 6 Semesters</span>
        </div>
      </div>
    </div>
  );
}

