import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Box,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  Info,
  Layers,
  Search,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CadViewer3D, type CadViewerConfigLike } from '@/components/CadViewer3D';
import { InstrumentSimulatorPanel } from '@/components/InstrumentSimulatorPanel';
import { MathBlock } from '@/components/MathBlock';
import { useApp } from '@/context/AppContext';
import {
  CANONICAL_INSTRUMENTS,
  getCanonicalInstrument,
  getRegistryCoverageStats,
} from '@/data/instrumentRegistry';
import { INSTRUMENT_SIMULATIONS } from '@/data/simulations';
import type { CanonicalInstrumentEntry } from '@/types/cad';

const FAMILY_LABELS: { key: string; label: string }[] = [
  { key: 'all', label: 'All Families' },
  { key: 'temperature', label: 'Temperature' },
  { key: 'motion', label: 'Motion & Position' },
  { key: 'pressure-force', label: 'Pressure & Force' },
  { key: 'flow', label: 'Flow' },
  { key: 'level-props', label: 'Level & Properties' },
  { key: 'electrical-bridge', label: 'Electrical & Bridges' },
  { key: 'analytical-optical', label: 'Analytical & Optical' },
  { key: 'control-actuator', label: 'Control & Actuation' },
  { key: 'signal-transducer', label: 'Special & Signal Cond.' },
];

export function InstrumentLabPage() {
  const { instrumentId } = useParams<{ instrumentId?: string }>();
  const [searchParams] = useSearchParams();
  const entry = instrumentId ? getCanonicalInstrument(instrumentId) : undefined;

  if (instrumentId && !entry) {
    return (
      <div className="glass mx-auto max-w-3xl space-y-3 p-8 text-center">
        <p className="eyebrow text-[var(--st-amber)]">INSTRUMENT NOT FOUND</p>
        <h1 className="text-xl font-semibold text-[var(--st-on)]">
          No canonical 3D instrument entry found for "{instrumentId}"
        </h1>
        <Link to="/lab" className="btn primary">
          Browse Full Virtual Instrument Inventory
        </Link>
      </div>
    );
  }

  if (entry) {
    return <SingleInstrumentLabView entry={entry} initialFocusSim={searchParams.get('focus') === 'sim'} />;
  }

  return <InventoryDirectoryView />;
}

function InventoryDirectoryView() {
  const [familyFilter, setFamilyFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [only3D, setOnly3D] = useState(false);

  const stats = useMemo(() => getRegistryCoverageStats(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CANONICAL_INSTRUMENTS.filter((inst) => {
      if (familyFilter !== 'all' && inst.family !== familyFilter) return false;
      if (only3D && !inst.hasDedicated3D) return false;
      if (!q) return true;
      return `${inst.name} ${inst.abbreviation ?? ''} ${inst.categoryLabel} ${inst.standardRef} ${inst.overview}`
        .toLowerCase()
        .includes(q);
    });
  }, [familyFilter, only3D, query]);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[var(--st-cyan)]">
            CURRICULUM INSTRUMENT INVENTORY · 3D &amp; SIMULATION COVERAGE
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)]">
            Virtual Instrumentation 3D Laboratory
          </h1>
          <p className="muted mt-1 max-w-3xl text-sm">
            Canonical registry connecting every instrument across Semesters III–V &amp; Calibration to bespoke 3D hardware assemblies, exploded cutaways, and physics-based simulations.
          </p>
        </div>

        <Link to="/roadmap" className="btn">
          Open Curriculum Tree
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      {/* Honest Coverage Dashboard */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Coverage metrics">
        <div className="glass p-4">
          <p className="eyebrow">Inventory Classified</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--st-on)]">{stats.totalInventoryEntries}</p>
          <p className="muted mt-0.5 text-[11px]">
            {stats.physicalHardwareCount} hardware · {stats.conceptDomainCount} concept standards
          </p>
        </div>
        <div className="glass p-4">
          <p className="eyebrow">Dedicated 3D Models</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--st-cyan)]">{stats.dedicated3DModels}</p>
          <p className="muted mt-0.5 text-[11px]">4 GLB + {stats.dedicated3DModels - 4} bespoke procedural assemblies</p>
        </div>
        <div className="glass p-4">
          <p className="eyebrow">Interactive Simulations</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--st-lime)]">{stats.simulationsCompleted}</p>
          <p className="muted mt-0.5 text-[11px]">{stats.educationalApproximations} educational approx models</p>
        </div>
        <div className="glass p-4">
          <p className="eyebrow">Curriculum Concepts</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--st-on)]">{stats.conceptsLinkedCount}</p>
          <p className="muted mt-0.5 text-[11px]">Bi-directional syllabus ↔ 3D links</p>
        </div>
        <div className="glass p-4">
          <p className="eyebrow">Pending Hardware</p>
          <p className="mt-1.5 text-2xl font-semibold text-[var(--st-on)]">{stats.pendingHardwareModels}</p>
          <p className="muted mt-0.5 text-[11px]">
            {stats.pendingHardwareModels === 0 ? 'All classified hardware completed' : 'In queue'}
          </p>
        </div>
      </section>

      {/* Filter Toolbar */}
      <div className="glass flex flex-wrap items-center gap-2.5 p-3">
        <label className="relative min-w-60 flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--st-on-var)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by instrument (LVDT, Bourdon, PMMC, UV-Vis, Rotameter, Wheatstone)…"
            className="field pl-10!"
          />
        </label>
        <button
          type="button"
          onClick={() => setOnly3D((v) => !v)}
          className={`btn ${only3D ? 'primary' : ''}`}
        >
          <Box className="size-3.5" />
          Dedicated 3D Only ({stats.dedicated3DModels})
        </button>
      </div>

      {/* Family Tabs */}
      <div className="seg flex-wrap" role="tablist" aria-label="Filter by family">
        {FAMILY_LABELS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={familyFilter === f.key}
            onClick={() => setFamilyFilter(f.key)}
            className={familyFilter === f.key ? 'on' : ''}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((inst) => (
          <article key={inst.id} className="ui-card flex flex-col justify-between gap-3 p-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="eyebrow text-[var(--st-cyan)]">{inst.categoryLabel}</span>
                <div className="flex items-center gap-1.5">
                  {inst.hasDedicated3D ? (
                    <span className="status" style={{ '--tone': 'var(--st-cyan)' } as React.CSSProperties}>
                      3D CAD
                    </span>
                  ) : (
                    <span className="pill mono text-[10px]">Concept Standard</span>
                  )}
                  {inst.hasSimulation && (
                    <span className="pill mono text-[10px] text-[var(--st-lime)]!">Sim</span>
                  )}
                </div>
              </div>

              <h2 className="text-base font-semibold text-[var(--st-on)]">{inst.name}</h2>
              <p className="muted line-clamp-2 text-xs">{inst.overview}</p>
            </div>

            <div className="space-y-2 border-t border-[var(--st-line)] pt-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                <span className="mono text-[var(--st-outline)]">{inst.standardRef}</span>
                {inst.curriculumLinks.length > 0 && (
                  <span className="mono text-[10px] text-[var(--st-lime)]">
                    {inst.curriculumLinks.length} curriculum link{inst.curriculumLinks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to={inst.primaryRoute} className="btn primary py-1.5! text-xs!">
                  {inst.hasDedicated3D ? 'Explore in 3D' : 'Open Concept Guide'}
                  <ArrowUpRight className="size-3.5" />
                </Link>
                {inst.hasSimulation && (
                  <Link
                    to={`${inst.existingTopicRef ? `/lab/${inst.id}` : inst.primaryRoute}?focus=sim`}
                    className="btn py-1.5! text-xs!"
                  >
                    <Activity className="size-3.5" />
                    Simulate
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SingleInstrumentLabView({
  entry,
  initialFocusSim,
}: {
  entry: CanonicalInstrumentEntry;
  initialFocusSim: boolean;
}) {
  const { isBookmarked, toggleBookmark } = useApp();
  const simRef = useRef<HTMLDivElement>(null);

  const [selectedPartId, setSelectedPartId] = useState<string>(entry.parts[0]?.id ?? '');
  const [hiddenPartIds, setHiddenPartIds] = useState<Set<string>>(() => new Set());
  const [openViva, setOpenViva] = useState<Record<number, boolean>>({ 0: true });

  const simConfig = entry.simulationId ? INSTRUMENT_SIMULATIONS[entry.simulationId] : undefined;
  const [primaryVal, setPrimaryVal] = useState<number>(simConfig?.primaryParam.defaultValue ?? 0);
  const [secondaryVal, setSecondaryVal] = useState<number>(
    simConfig?.secondaryParam?.defaultValue ?? 0,
  );

  useEffect(() => {
    setSelectedPartId(entry.parts[0]?.id ?? '');
    setHiddenPartIds(new Set());
    if (simConfig) {
      setPrimaryVal(simConfig.primaryParam.defaultValue);
      setSecondaryVal(simConfig.secondaryParam?.defaultValue ?? 0);
    }
    if (initialFocusSim) {
      setTimeout(() => simRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [entry.id, initialFocusSim, simConfig]);

  const evalResult = useMemo(() => {
    if (!simConfig) return null;
    return simConfig.evaluate(primaryVal, secondaryVal);
  }, [simConfig, primaryVal, secondaryVal]);

  const cadConfig: CadViewerConfigLike | null = useMemo(() => {
    if (!entry.hasDedicated3D) return null;
    return {
      id: entry.id,
      title: entry.name,
      standard: entry.standardRef,
      sourceType: entry.sourceType === 'none' ? 'procedural' : entry.sourceType,
      glbUrl: entry.glbUrl,
      family: entry.family,
      proceduralKey: entry.proceduralKey,
      supportsExplode: entry.supportsExplode,
      supportsCutaway: entry.supportsCutaway,
      defaultCameraPos: entry.defaultCameraPos,
      target: entry.target,
      parts: entry.parts,
    };
  }, [entry]);

  const familyPeers = useMemo(
    () => CANONICAL_INSTRUMENTS.filter((c) => c.family === entry.family && c.hasDedicated3D),
    [entry.family],
  );

  const selectedPart =
    entry.parts.find((pt) => pt.id === selectedPartId) ?? entry.parts[0];

  const togglePartVisibility = (partId: string) => {
    setHiddenPartIds((prev) => {
      const next = new Set(prev);
      if (next.has(partId)) next.delete(partId);
      else next.add(partId);
      return next;
    });
  };

  const bmId = `lab:${entry.id}`;
  const bookmarked = isBookmarked(bmId);

  return (
    <div className="mx-auto flex max-w-[1480px] flex-col gap-5">
      {/* Page Title & Action Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[var(--st-cyan)]">{entry.categoryLabel}</span>
            <span className="pill mono text-[10px]">{entry.standardRef}</span>
            {entry.hasDedicated3D && (
              <span className="status" style={{ '--tone': 'var(--st-cyan)' } as React.CSSProperties}>
                Interactive 3D Virtual Lab
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)] md:text-3xl">
            {entry.name}
          </h1>
          <p className="muted max-w-4xl text-sm">{entry.overview}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/lab" className="btn">
            <Layers className="size-3.5" />
            Full Inventory
          </Link>
          {entry.existingTopicRef && (
            <Link
              to={`/instrumentation/${entry.existingTopicRef.category}/${entry.existingTopicRef.slug}`}
              className="btn"
            >
              <BookOpen className="size-3.5" />
              Full 20-Point Spec Sheet
            </Link>
          )}
          <button
            type="button"
            onClick={() =>
              toggleBookmark({
                id: bmId,
                itemType: 'instrument',
                title: entry.name,
                subtitle: `${entry.categoryLabel} · ${entry.standardRef}`,
                route: `/lab/${entry.id}`,
              })
            }
            className={`btn ${bookmarked ? 'primary' : ''}`}
          >
            <Bookmark className="size-3.5" />
            {bookmarked ? 'Saved' : 'Bookmark'}
          </button>
        </div>
      </header>

      {/* SIGNATURE 3-COLUMN RTD REFERENCE WORKSPACE */}
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_340px]">
        {/* LEFT SIDEBAR: Family Peers + Sub-Assemblies with Show/Hide Visibility */}
        <aside className="glass flex flex-col gap-3 p-3.5">
          {entry.parts.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="eyebrow">CAD SUB-ASSEMBLIES</p>
                {hiddenPartIds.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setHiddenPartIds(new Set())}
                    className="mono cursor-pointer text-[10px] text-[var(--st-cyan)] hover:underline"
                  >
                    Show All
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {entry.parts.map((part) => {
                  const isHidden = hiddenPartIds.has(part.id);
                  const active = selectedPart?.id === part.id;
                  return (
                    <div key={part.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPartId(part.id)}
                        className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-[11px] transition ${
                          active
                            ? 'bg-[var(--st-3)] font-medium text-[var(--st-on)] ring-1 ring-[var(--st-cyan)]/40'
                            : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                        }`}
                      >
                        <span className="mono shrink-0 text-[10px] text-[var(--st-cyan)]">
                          {part.code}
                        </span>
                        <span className={`truncate ${isHidden ? 'line-through opacity-50' : ''}`}>
                          {part.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePartVisibility(part.id)}
                        aria-label={isHidden ? `Show ${part.name}` : `Hide ${part.name}`}
                        title={isHidden ? 'Show component' : 'Hide component'}
                        className="cursor-pointer rounded-lg p-1.5 text-[var(--st-outline)] hover:bg-[var(--st-3)] hover:text-[var(--st-on)]"
                      >
                        {isHidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Family Peers */}
          <div className="border-t border-[var(--st-line)] pt-3">
            <p className="eyebrow px-1 mb-2">SAME FAMILY INSTRUMENTS</p>
            <nav className="max-h-72 space-y-1 overflow-y-auto pr-1">
              {familyPeers.map((peer) => {
                const active = peer.id === entry.id;
                return (
                  <Link
                    key={peer.id}
                    to={`/lab/${peer.id}`}
                    className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-xs transition ${
                      active
                        ? 'bg-[var(--st-3)] font-semibold text-[var(--st-cyan)]'
                        : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
                    }`}
                  >
                    <span className="truncate">{peer.abbreviation ?? peer.name}</span>
                    <span className="mono text-[9px] text-[var(--st-cyan)]">3D</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* CENTER STAGE: 3D CAD Viewport + Live Simulation */}
        <section className="flex flex-col gap-4">
          {cadConfig && selectedPart ? (
            <>
              <CadViewer3D
                config={cadConfig}
                selectedPart={selectedPart}
                onSelectPart={setSelectedPartId}
                hiddenPartIds={hiddenPartIds}
                simState={
                  evalResult
                    ? {
                        primaryNorm: evalResult.normalizedPrimary,
                        primaryValue: primaryVal,
                        secondaryNorm: evalResult.normalizedSecondary ?? 0.5,
                        secondaryValue: secondaryVal,
                      }
                    : undefined
                }
                heightClass="h-[520px]"
              />
              <div className="sub flex items-center gap-2.5 px-4 py-2.5 text-[11px] text-[var(--st-on-var)]">
                <Info className="size-4 shrink-0 text-[var(--st-cyan)]" />
                <span>{entry.disclosure}</span>
              </div>
            </>
          ) : (
            <div className="glass space-y-2 p-6">
              <p className="eyebrow text-[var(--st-amber)]">CONCEPTUAL STANDARD DOMAIN</p>
              <p className="text-sm text-[var(--st-on)]">{entry.overview}</p>
            </div>
          )}

          {/* LIVE PHYSICS SIMULATION PANEL */}
          {simConfig && evalResult ? (
            <div ref={simRef}>
              <InstrumentSimulatorPanel
                simConfig={simConfig}
                primaryValue={primaryVal}
                secondaryValue={secondaryVal}
                evalResult={evalResult}
                onChangePrimary={setPrimaryVal}
                onChangeSecondary={setSecondaryVal}
                onReset={() => {
                  setPrimaryVal(simConfig.primaryParam.defaultValue);
                  setSecondaryVal(simConfig.secondaryParam?.defaultValue ?? 0);
                }}
              />
            </div>
          ) : (
            <div className="sub p-4 text-xs text-[var(--st-on-var)]">
              <span className="mono font-semibold text-[var(--st-amber)]">Simulation Note: </span>
              This classification represents an engineering standard/concept rather than a single standalone physical curve. Inspect related hardware models below for live simulations.
            </div>
          )}
        </section>

        {/* RIGHT INSPECTOR: Component Details + Envelope + Reverse Curriculum Links */}
        <aside className="flex flex-col gap-3">
          {selectedPart && (
            <div className="glass space-y-3 p-5">
              <div>
                <span className="eyebrow text-[var(--st-cyan)]">
                  SELECTED COMPONENT · #{selectedPart.code}
                </span>
                <h2 className="mt-1 text-lg font-semibold text-[var(--st-on)]">
                  {selectedPart.name}
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-[var(--st-on-var)]">
                {selectedPart.description}
              </p>
              <div className="sub space-y-2 p-3 text-xs">
                <div>
                  <span className="eyebrow">FUNCTION</span>
                  <p className="mt-0.5 text-[var(--st-on)]">{selectedPart.function}</p>
                </div>
                <div className="border-t border-[var(--st-line)] pt-2">
                  <span className="eyebrow">MATERIAL</span>
                  <p className="mono mt-0.5 text-[11px] text-[var(--st-cyan)]">
                    {selectedPart.material}
                  </p>
                </div>
                <div className="border-t border-[var(--st-line)] pt-2">
                  <span className="eyebrow text-[var(--st-amber)]">INDUSTRIAL RELEVANCE</span>
                  <p className="mt-0.5 text-[var(--st-on-var)]">{selectedPart.industrialRelevance}</p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Envelope */}
          <div className="glass space-y-2.5 p-5">
            <p className="eyebrow text-[var(--st-cyan)]">MEASUREMENT ENVELOPE</p>
            <div className="sub space-y-1.5 p-3 text-xs">
              <div className="kv">
                <span>Measurand</span>
                <span className="text-right">{entry.measurementQuantity}</span>
              </div>
              <div className="kv">
                <span>Input</span>
                <span className="text-right">{entry.inputOutput.input}</span>
              </div>
              <div className="kv">
                <span>Output</span>
                <span className="text-right text-[var(--st-cyan)]">{entry.inputOutput.output}</span>
              </div>
              {Object.entries(entry.performance).map(([k, v]) =>
                v ? (
                  <div key={k} className="kv">
                    <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-right">{v}</span>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          {/* REVERSE CURRICULUM NAVIGATION */}
          {entry.curriculumLinks.length > 0 && (
            <div className="glass space-y-2.5 p-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-[var(--st-lime)]" />
                <p className="eyebrow text-[var(--st-lime)]">
                  CURRICULUM TOPICS ({entry.curriculumLinks.length})
                </p>
              </div>
              <div className="space-y-2">
                {entry.curriculumLinks.map((cl) => (
                  <Link
                    key={`${cl.subjectId}:${cl.conceptId}`}
                    to={`/roadmap?subject=${encodeURIComponent(cl.subjectId)}&unit=${cl.unitNumber}&concept=${encodeURIComponent(cl.conceptId)}`}
                    className="block rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-2.5 text-xs transition hover:border-[var(--st-lime)]"
                  >
                    <p className="mono text-[10px] text-[var(--st-cyan)]">
                      {cl.semesterLabel} · {cl.subjectCode} · Unit {cl.unitNumber}
                    </p>
                    <p className="mt-0.5 font-medium text-[var(--st-on)]">{cl.conceptTitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* SECTION 7: STANDARDIZED INSTRUMENT DETAIL PANEL */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-cyan)]">WORKING PRINCIPLE &amp; CONSTRUCTION</p>
          <p className="text-sm text-[var(--st-on)]">
            <strong className="text-[var(--st-cyan)]">Phenomenon: </strong>
            {entry.physicalPhenomenon}
          </p>
          <ol className="space-y-2">
            {entry.workingPrincipleSteps.map((st, idx) => (
              <li key={idx} className="sub flex items-start gap-3 p-3 text-xs">
                <span className="mono font-semibold text-[var(--st-cyan)]">0{idx + 1}</span>
                <span className="text-[var(--st-on)]">{st}</span>
              </li>
            ))}
          </ol>
          <p className="muted pt-1 text-xs leading-relaxed">
            <strong className="text-[var(--st-on)]">Construction: </strong>
            {entry.constructionSummary}
          </p>
        </section>

        <section className="glass space-y-3 p-6">
          <div className="flex items-center gap-2">
            <Wrench className="size-4 text-[var(--st-amber)]" />
            <p className="eyebrow text-[var(--st-amber)]">PRACTICAL ENGINEERING &amp; MAINTENANCE</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="sub p-3 space-y-1">
              <p className="eyebrow text-[var(--st-lime)]">ADVANTAGES</p>
              {entry.practical.advantages.map((a) => (
                <p key={a} className="flex items-start gap-1.5 text-[var(--st-on-var)]">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--st-lime)]" />
                  <span>{a}</span>
                </p>
              ))}
            </div>
            <div className="sub p-3 space-y-1">
              <p className="eyebrow text-[var(--st-amber)]">LIMITATIONS &amp; FAULTS</p>
              {entry.practical.limitations.concat(entry.practical.failureModes).slice(0, 4).map((l) => (
                <p key={l} className="flex items-start gap-1.5 text-[var(--st-on-var)]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--st-amber)]" />
                  <span>{l}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="sub p-3 text-xs">
            <p className="eyebrow">INDUSTRIAL &amp; LAB APPLICATIONS</p>
            <p className="mt-1 text-[var(--st-on)]">
              {entry.practical.industrialApps.join(' · ')}
            </p>
            <p className="mt-1.5 text-[var(--st-outline)]">
              Lab: {entry.practical.labApps.join(' · ')}
            </p>
          </div>
          <div className="sub p-3 text-xs">
            <p className="eyebrow text-[var(--st-cyan)]">CALIBRATION &amp; CARE</p>
            <p className="mt-1 text-[var(--st-on-var)]">{entry.practical.calibrationAndMaintenance}</p>
          </div>
        </section>
      </div>

      {/* LEARNING: EQUATIONS, VIVA QUESTIONS & RELATED */}
      <section className="glass space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-[var(--st-cyan)]" />
            <p className="eyebrow text-[var(--st-cyan)]">EQUATIONS, VIVA QUESTIONS &amp; RELATED INSTRUMENTS</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {entry.learning.equations.map((eq) => (
              <div key={eq.label} className="sub p-3.5">
                <p className="label mb-1.5">{eq.label}</p>
                <MathBlock latex={eq.latex} displayMode />
              </div>
            ))}
            {entry.learning.relatedInstrumentIds.length > 0 && (
              <div className="sub p-3.5">
                <p className="label mb-2">Related Instruments in Lab</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.learning.relatedInstrumentIds.map((rid) => {
                    const rel = getCanonicalInstrument(rid);
                    if (!rel) return null;
                    return (
                      <Link key={rid} to={`/lab/${rid}`} className="btn py-1! text-xs!">
                        {rel.abbreviation ?? rel.name}
                        <ArrowUpRight className="size-3" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {entry.learning.vivaQuestions.map((vq, idx) => {
              const isOpen = openViva[idx] ?? false;
              return (
                <div key={vq.q} className="sub p-3.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-[var(--st-on)]">{vq.q}</p>
                    <button
                      type="button"
                      onClick={() => setOpenViva((p) => ({ ...p, [idx]: !isOpen }))}
                      className="btn shrink-0 py-0.5! text-[11px]!"
                    >
                      {isOpen ? 'Hide' : 'Answer'}
                    </button>
                  </div>
                  {isOpen && (
                    <p className="mt-2 border-t border-[var(--st-line)] pt-2 text-[var(--st-lime)]">
                      {vq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

