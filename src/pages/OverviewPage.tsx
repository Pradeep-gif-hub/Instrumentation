import { ArrowRight, Bookmark, Box, Calculator, Compass, Cpu, Factory, GraduationCap, Layers, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CadViewer3D } from '@/components/CadViewer3D';
import { useApp } from '@/context/AppContext';
import { getRegistryCoverageStats } from '@/data/instrumentRegistry';
import { ALL_INSTRUMENTS, INSTRUMENT_CATEGORIES, INSTRUMENTS_BY_CATEGORY } from '@/data/instruments';
import { CAD_MODELS, type CadModelConfig } from '@/data/models3d';
import { INTERVIEW_QUESTION_BANK } from '@/data/interviewBankData';

const FEATURED_MODEL_IDS: CadModelConfig['id'][] = [
  'rtd-pt100',
  'thermocouple-k',
  'dp-transmitter',
  'orifice-plate',
];

export function OverviewPage() {
  const { subjects, attempts, bookmarks } = useApp();
  const [activeModelId, setActiveModelId] = useState<CadModelConfig['id']>('rtd-pt100');
  const activeConfig = CAD_MODELS[activeModelId];
  const [selectedPartId, setSelectedPartId] = useState<string>(activeConfig.parts[0].id);

  const selectedPart =
    activeConfig.parts.find((p) => p.id === selectedPartId) ?? activeConfig.parts[0];

  const stats = useMemo(() => getRegistryCoverageStats(), []);
  const completedSubjects = subjects.filter((s) => s.completed).length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const accuracyPct = attempts.length > 0 ? Math.round((correctAttempts / attempts.length) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      {/* Header matching Odyssey's crisp top intro */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[var(--st-cyan)]">INSTRUMENTA · B.TECH ICE ENGINEERING STUDIO</span>
            <span className="status" style={{ '--tone': 'var(--st-phosphor)' } as React.CSSProperties}>
              SEMESTERS 1–6 · {ALL_INSTRUMENTS.length} SPEC SHEETS · {stats.dedicated3DModels} 3D ASSEMBLIES
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)] md:text-3xl">
            Instrumentation &amp; Control Engineering Knowledge Base
          </h1>
          <p className="muted max-w-3xl text-sm">
            Reference-grade field instrumentation documentation, interactive 3D CAD hardware inspection, PLC ladder simulation, engineering calculators, and core O&amp;G / OEM placement preparation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/lab" className="btn primary">
            <Compass className="size-4" />
            Explore {stats.dedicated3DModels} 3D Virtual Instruments
          </Link>
          <Link to="/instrumentation/temperature/rtd" className="btn">
            <Box className="size-4" />
            Inspect RTD 3D CAD
          </Link>
          <Link to="/roadmap" className="btn">
            <GraduationCap className="size-4" />
            Academic Roadmap
          </Link>
        </div>
      </header>

      {/* Odyssey-style KPI Telemetry Strip (1 Lime Accent Card + 3 Neutral Cards) */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Platform telemetry">
        <div className="glass p-5 bg-[var(--st-lime)]! text-[#07090e]">
          <p className="eyebrow text-[#07090e]/75!">Knowledge Catalog</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{ALL_INSTRUMENTS.length} Topics</p>
          <p className="mt-1 text-xs font-medium text-[#07090e]/80">
            Across 7 core ICE measurement &amp; signal hubs
          </p>
        </div>

        <div className="glass p-5">
          <p className="eyebrow">Academic Progress</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--st-on)]">
            {completedSubjects} / {subjects.length}
          </p>
          <p className="muted mt-1 text-xs">NITJ B.Tech. ICE curriculum &amp; core roadmap</p>
        </div>

        <div className="glass p-5">
          <p className="eyebrow">Interview Bank Readiness</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--st-on)]">
            {attempts.length > 0 ? `${accuracyPct}%` : `${INTERVIEW_QUESTION_BANK.length} Qs`}
          </p>
          <p className="muted mt-1 text-xs">
            {attempts.length > 0
              ? `${correctAttempts}/${attempts.length} answered accurately`
              : '4 difficulty tiers · MCQ, Numerical & Scenario'}
          </p>
        </div>

        <div className="glass p-5">
          <p className="eyebrow">Saved Bookmarks</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--st-on)]">{bookmarks.length}</p>
          <p className="muted mt-1 text-xs">Persisted in local SQLite database</p>
        </div>
      </section>

      {/* Signature Interactive 3D CAD Hardware Laboratory Preview */}
      <section className="space-y-3" aria-label="Interactive 3D CAD hardware laboratory">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">INTERACTIVE 3D HARDWARE LABORATORY</p>
            <h2 className="text-lg font-semibold text-[var(--st-on)]">
              Inspect Industrial Assemblies in Real-Time CAD
            </h2>
          </div>

          <div className="seg" role="group" aria-label="Select 3D instrument model">
            {FEATURED_MODEL_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveModelId(id);
                  setSelectedPartId(CAD_MODELS[id].parts[0].id);
                }}
                className={activeModelId === id ? 'on' : ''}
              >
                {CAD_MODELS[id].id === 'rtd-pt100' && 'Pt100 RTD'}
                {CAD_MODELS[id].id === 'thermocouple-k' && 'Type-K Thermocouple'}
                {CAD_MODELS[id].id === 'dp-transmitter' && 'Smart DP Transmitter'}
                {CAD_MODELS[id].id === 'orifice-plate' && 'Orifice Metering Run'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <CadViewer3D
            config={activeConfig}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPartId}
            heightClass="h-[520px]"
          />

          <aside className="flex flex-col gap-3">
            <div className="glass flex-1 space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="eyebrow text-[var(--st-cyan)]">COMPONENT {selectedPart.code}</p>
                  <h3 className="mt-1 text-base font-semibold text-[var(--st-on)]">{selectedPart.name}</h3>
                </div>
                <Link to={activeConfig.topicRoute} className="btn py-1.5! text-[11px]!">
                  Full Guide <ArrowRight className="size-3" />
                </Link>
              </div>

              <p className="text-xs leading-relaxed text-[var(--st-on-var)]">{selectedPart.description}</p>

              <div className="sub space-y-1 p-3.5">
                <div className="kv">
                  <span>Material</span>
                  <span className="max-w-[200px] truncate" title={selectedPart.material}>
                    {selectedPart.material}
                  </span>
                </div>
                <div className="kv">
                  <span>Standard</span>
                  <span>{activeConfig.standard.split('·')[0].trim()}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="eyebrow">ENGINEERING FUNCTION</p>
                <p className="text-[var(--st-on)]">{selectedPart.function}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="eyebrow text-[var(--st-amber)]">INDUSTRIAL RELEVANCE</p>
                <p className="text-[var(--st-on-var)]">{selectedPart.industrialRelevance}</p>
              </div>

              {/* Part selector pills */}
              <div className="pt-1">
                <p className="eyebrow mb-2">ASSEMBLY SUB-COMPONENTS ({activeConfig.parts.length})</p>
                <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
                  {activeConfig.parts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSelectedPartId(part.id)}
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] transition ${
                        part.id === selectedPart.id
                          ? 'border-[var(--st-cyan)] bg-[var(--st-3)] font-medium text-[var(--st-cyan)]'
                          : 'border-[var(--st-line)] bg-[var(--st-2)] text-[var(--st-on-var)] hover:text-[var(--st-on)]'
                      }`}
                    >
                      <span className="mono mr-1 opacity-75">{part.code}</span>
                      {part.name.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <p className="border-t border-[var(--st-line)] pt-2 text-[10.5px] text-[var(--st-outline)]">
                {activeConfig.disclosure}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* 7 Instrumentation Knowledge Hubs */}
      <section className="space-y-3" aria-label="Instrumentation Knowledge Hubs">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">CURATED KNOWLEDGE ARCHITECTURE</p>
            <h2 className="text-lg font-semibold text-[var(--st-on)]">7 Instrumentation Hubs</h2>
          </div>
          <Link to="/instrumentation" className="mono text-xs text-[var(--st-cyan)] hover:underline">
            Browse all {ALL_INSTRUMENTS.length} instruments →
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {INSTRUMENT_CATEGORIES.map((cat) => {
            const count = INSTRUMENTS_BY_CATEGORY[cat.id].length;
            const has3D = INSTRUMENTS_BY_CATEGORY[cat.id].some((t) => t.has3DModel);
            return (
              <Link
                key={cat.id}
                to={`/instrumentation/${cat.id}`}
                className="ui-card flex flex-col justify-between gap-3 p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="eyebrow">{cat.shortLabel}</span>
                    <div className="flex items-center gap-1.5">
                      {has3D && (
                        <span className="status" style={{ '--tone': 'var(--st-cyan)' } as React.CSSProperties}>
                          3D
                        </span>
                      )}
                      <span className="pill mono text-[10px]">{count} topics</span>
                    </div>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[var(--st-on)]">{cat.label}</h3>
                  <p className="muted mt-1 text-xs leading-relaxed">{cat.summary}</p>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--st-line)] pt-2.5 text-[11px]">
                  <span className="mono text-[var(--st-outline)]">{cat.standards}</span>
                  <ArrowRight className="size-3.5 text-[var(--st-cyan)]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Core Engineering Labs & Placement Modules */}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Core engineering modules">
        <Link to="/automation/plc" className="ui-card flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <Cpu className="size-5 text-[var(--st-phosphor)]" />
            <span className="pill mono text-[10px]">LIVE SIMULATOR</span>
          </div>
          <h3 className="text-base font-semibold text-[var(--st-on)]">PLC Ladder &amp; DCS / SCADA</h3>
          <p className="muted text-xs">
            Interactive cyclic ladder logic sandbox (TON, CTU, Seal-in, Interlocks) plus DCS, SCADA, Protocols &amp; PID architectures.
          </p>
        </Link>

        <Link to="/toolbox" className="ui-card flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <Calculator className="size-5 text-[var(--st-amber)]" />
            <span className="pill mono text-[10px]">11 TOOLS</span>
          </div>
          <h3 className="text-base font-semibold text-[var(--st-on)]">Engineering Toolbox</h3>
          <p className="muted text-xs">
            Validated solvers for Callendar-Van Dusen RTD, Thermocouple CJC, ISO 5167 Flow, Wet-Leg DP Level, 4–20 mA, and PID tuning.
          </p>
        </Link>

        <Link to="/applications" className="ui-card flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <Factory className="size-5 text-[var(--st-iris)]" />
            <span className="pill mono text-[10px]">ISA-5.1 P&amp;ID</span>
          </div>
          <h3 className="text-base font-semibold text-[var(--st-on)]">Industrial Applications</h3>
          <p className="muted text-xs">
            Interactive distillation column P&amp;ID explorer, boiler 3-element control, compressor anti-surge, and SIL/Ex safety rules.
          </p>
        </Link>

        <Link to="/interview" className="ui-card flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between">
            <ShieldCheck className="size-5 text-[var(--st-cyan)]" />
            <span className="pill mono text-[10px]">17 COMPANIES</span>
          </div>
          <h3 className="text-base font-semibold text-[var(--st-on)]">Core Industry &amp; Interview Prep</h3>
          <p className="muted text-xs">
            Scored question engine plus structured preparation tracks for 9 Oil &amp; Gas PSUs/Refineries and 8 Global Automation OEMs.
          </p>
        </Link>
      </section>

      {/* Quick Start Footer Row */}
      <section className="glass flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[var(--st-3)] text-[var(--st-cyan)]">
            <Layers className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--st-on)]">
              Fast Keyboard Search (<kbd className="mono">⌘K</kbd> or <kbd className="mono">/</kbd>) &amp; SQLite Bookmarks
            </p>
            <p className="muted text-xs">
              Jump directly to any of the 59 instrument specs, Semester 1–6 units, or saved revision bookmarks.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/electronics" className="btn">
            Signal Conditioning Chain
          </Link>
          <Link to="/roadmap?view=graph" className="btn">
            Cross-Semester Graph
          </Link>
          <Link to="/roadmap" className="btn">
            <Bookmark className="size-3.5" />
            Open NITJ Curriculum
          </Link>
        </div>
      </section>
    </div>
  );
}

