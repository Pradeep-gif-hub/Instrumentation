import {
  Activity,
  AlertTriangle,
  Bookmark,
  Box,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  Info,
  Layers,
  Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CadViewer3D, type CadViewerConfigLike } from '@/components/CadViewer3D';
import { CharacteristicChart } from '@/components/CharacteristicChart';
import { EngineeringSchematic } from '@/components/EngineeringSchematic';
import { InstrumentSimulatorPanel } from '@/components/InstrumentSimulatorPanel';
import { MathBlock } from '@/components/MathBlock';
import { useApp } from '@/context/AppContext';
import { findCanonicalForTopic } from '@/data/instrumentRegistry';
import { getInstrumentTopic, INSTRUMENTS_BY_CATEGORY } from '@/data/instruments';
import { CAD_MODELS } from '@/data/models3d';
import { INSTRUMENT_SIMULATIONS } from '@/data/simulations';

export function InstrumentDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const [searchParams] = useSearchParams();
  const initialFocusSim = searchParams.get('focus') === 'sim';
  const simRef = useRef<HTMLDivElement>(null);

  const topic = getInstrumentTopic(category, slug);
  const { isBookmarked, toggleBookmark } = useApp();

  const legacyCad = topic?.has3DModel && topic.modelId ? CAD_MODELS[topic.modelId] : undefined;
  const canonical = useMemo(
    () => findCanonicalForTopic(topic?.category, topic?.slug),
    [topic?.category, topic?.slug],
  );

  const cadConfig: (CadViewerConfigLike & { disclosure: string }) | undefined = useMemo(() => {
    if (legacyCad) {
      return {
        ...legacyCad,
        disclosure: legacyCad.disclosure,
      };
    }
    if (canonical?.hasDedicated3D) {
      return {
        id: canonical.id,
        title: canonical.name,
        standard: canonical.standardRef,
        sourceType: canonical.sourceType === 'none' ? 'procedural' : canonical.sourceType,
        glbUrl: canonical.glbUrl,
        family: canonical.family,
        proceduralKey: canonical.proceduralKey,
        supportsExplode: canonical.supportsExplode,
        supportsCutaway: canonical.supportsCutaway,
        defaultCameraPos: canonical.defaultCameraPos,
        target: canonical.target,
        parts: canonical.parts,
        disclosure: canonical.disclosure,
      };
    }
    return undefined;
  }, [legacyCad, canonical]);

  const simConfig = canonical?.simulationId
    ? INSTRUMENT_SIMULATIONS[canonical.simulationId]
    : undefined;

  const [viewportMode, setViewportMode] = useState<'3d' | 'schematic'>('3d');
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [hiddenPartIds, setHiddenPartIds] = useState<Set<string>>(() => new Set());
  const [primaryVal, setPrimaryVal] = useState<number>(simConfig?.primaryParam.defaultValue ?? 0);
  const [secondaryVal, setSecondaryVal] = useState<number>(
    simConfig?.secondaryParam?.defaultValue ?? 0,
  );
  const [openQA, setOpenQA] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    setViewportMode(cadConfig ? '3d' : 'schematic');
    setSelectedPartId(cadConfig?.parts[0]?.id ?? '');
    setHiddenPartIds(new Set());
    if (simConfig) {
      setPrimaryVal(simConfig.primaryParam.defaultValue);
      setSecondaryVal(simConfig.secondaryParam?.defaultValue ?? 0);
    }
    setOpenQA({ 0: true });
    if (initialFocusSim && simConfig) {
      setTimeout(() => simRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [category, slug, cadConfig, simConfig, initialFocusSim]);

  const evalResult = useMemo(() => {
    if (!simConfig) return null;
    return simConfig.evaluate(primaryVal, secondaryVal);
  }, [simConfig, primaryVal, secondaryVal]);

  const togglePartVisibility = (partId: string) => {
    setHiddenPartIds((prev) => {
      const next = new Set(prev);
      if (next.has(partId)) next.delete(partId);
      else next.add(partId);
      return next;
    });
  };

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl glass p-8 text-center space-y-3">
        <p className="eyebrow text-[var(--st-crimson)]">INSTRUMENT NOT FOUND</p>
        <h1 className="text-xl font-semibold">No technical specification found for "{slug}"</h1>
        <Link to="/instrumentation" className="btn primary">
          Return to Instrumentation Hub
        </Link>
      </div>
    );
  }

  const categoryPeers = INSTRUMENTS_BY_CATEGORY[topic.category] ?? [];
  const selectedPart =
    cadConfig?.parts.find((p) => p.id === selectedPartId) ?? cadConfig?.parts[0];
  const bmId = `instrument:${topic.category}:${topic.slug}`;
  const bookmarked = isBookmarked(bmId);

  return (
    <div className="mx-auto flex max-w-[1480px] flex-col gap-5">
      {/* Page Title & Quick Action Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[var(--st-accent-text)]">{topic.categoryLabel}</span>
            <span className="pill mono text-[10px]">{topic.standardRef}</span>
            {cadConfig && (
              <span className="status" style={{ '--tone': 'var(--st-accent)' } as React.CSSProperties}>
                Interactive 3D CAD Assembly
              </span>
            )}
            {simConfig && (
              <button
                type="button"
                onClick={() => simRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="status cursor-pointer"
                style={{ '--tone': 'var(--st-accent)' } as React.CSSProperties}
              >
                <Activity className="mr-1 inline size-3" />
                Live Physics Sim
              </button>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)] md:text-3xl">
            {topic.title}
          </h1>
          <p className="muted max-w-4xl text-sm">{topic.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {cadConfig && (
            <div className="seg" role="tablist" aria-label="Viewport mode">
              <button
                type="button"
                role="tab"
                aria-selected={viewportMode === '3d'}
                onClick={() => setViewportMode('3d')}
                className={viewportMode === '3d' ? 'on' : ''}
              >
                <Box className="size-3.5" />
                3D Assembly
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewportMode === 'schematic'}
                onClick={() => setViewportMode('schematic')}
                className={viewportMode === 'schematic' ? 'on' : ''}
              >
                <Layers className="size-3.5" />
                Circuit / Loop Schematic
              </button>
            </div>
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
            className={`btn ${bookmarked ? 'primary' : ''}`}
          >
            <Bookmark className="size-3.5" />
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>
      </header>

      {/* SIGNATURE 3-COLUMN WORKSPACE: LEFT (Category Nav) | CENTER (Large 3D / Schematic) | RIGHT (Component Inspector / Key Specs) */}
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_330px]">
        {/* LEFT PANEL: Category Navigation & Quick Peer Switcher */}
        <aside className="glass flex flex-col gap-3 p-3.5">
          <div>
            <p className="eyebrow px-2">{topic.categoryLabel}</p>
            <nav aria-label={`${topic.categoryLabel} sensors`} className="mt-2 space-y-1">
              {categoryPeers.map((peer) => {
                const active = peer.slug === topic.slug;
                const peer3D =
                  peer.has3DModel ||
                  Boolean(findCanonicalForTopic(peer.category, peer.slug)?.hasDedicated3D);
                return (
                  <Link
                    key={peer.id}
                    to={`/instrumentation/${peer.category}/${peer.slug}`}
                    className={`flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs transition ${
                      active
                        ? 'bg-[var(--st-3)] font-semibold text-[var(--st-accent-text)] ring-1 ring-[var(--st-accent)]/50'
                        : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]'
                    }`}
                  >
                    <span className="truncate">{peer.shortTitle}</span>
                    {peer3D && (
                      <span className="mono rounded bg-[var(--st-void)] px-1.5 py-0.5 text-[9px] text-[var(--st-accent-text)]">
                        3D
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {cadConfig && (
            <div className="border-t border-[var(--st-line)] pt-3">
              <p className="eyebrow px-2 mb-2">CAD SUB-ASSEMBLIES ({cadConfig.parts.length})</p>
              <div className="space-y-1">
                {cadConfig.parts.map((part) => {
                  const isHidden = hiddenPartIds.has(part.id);
                  return (
                    <div key={part.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedPartId(part.id)}
                        className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-[11px] transition ${
                          selectedPart?.id === part.id
                            ? 'bg-[var(--st-3)] font-medium text-[var(--st-on)]'
                            : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                        }`}
                      >
                        <span className="mono text-[10px] text-[var(--st-accent-text)]">{part.code}</span>
                        <span className={`truncate ${isHidden ? 'line-through opacity-50' : ''}`}>
                          {part.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePartVisibility(part.id)}
                        aria-label={isHidden ? `Show ${part.name}` : `Hide ${part.name}`}
                        title={isHidden ? 'Show component' : 'Hide component'}
                        className="cursor-pointer rounded-lg p-1 text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
                      >
                        {isHidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER PANEL: Large Interactive 3D CAD Viewport or Technical Schematic + Live Simulator */}
        <section className="flex flex-col gap-3">
          {cadConfig && viewportMode === '3d' && selectedPart ? (
            <>
              <CadViewer3D
                config={cadConfig}
                selectedPart={selectedPartId ? selectedPart : null}
                onSelectPart={setSelectedPartId}
                hiddenPartIds={hiddenPartIds}
                simState={{
                  primaryNorm: evalResult?.normalizedPrimary ?? 0.45,
                  primaryValue: primaryVal,
                  secondaryNorm: evalResult?.normalizedSecondary ?? 0.5,
                  secondaryValue: secondaryVal,
                }}
                heightClass="h-[580px]"
              />
              <div className="sub flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 text-[11px] text-[var(--st-on-var)]">
                <div className="flex items-center gap-2.5">
                  <Info className="size-4 shrink-0 text-[var(--st-accent-text)]" />
                  <span>{cadConfig.disclosure}</span>
                </div>
                {canonical && (
                  <Link
                    to={`/lab/${canonical.id}`}
                    className="mono shrink-0 text-[10px] text-[var(--st-accent-text)] hover:underline"
                  >
                    Open in 3D Virtual Lab →
                  </Link>
                )}
              </div>
            </>
          ) : (
            <EngineeringSchematic kind={topic.schematicKind} title={topic.title} />
          )}

          {simConfig && evalResult && (
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
          )}

          {/* Definition & Overview Banner right below central stage */}
          <div className="glass space-y-2 p-5">
            <p className="eyebrow text-[var(--st-accent-text)]">01 · TECHNICAL DEFINITION</p>
            <p className="text-sm leading-relaxed text-[var(--st-on)]">{topic.definition}</p>
          </div>
        </section>

        {/* RIGHT PANEL: Selected 3D Component Inspector OR Technical Summary Telemetry */}
        <aside className="flex flex-col gap-3">
          {cadConfig && selectedPart ? (
            <div className="glass space-y-3.5 p-5">
              <div>
                <span className="eyebrow text-[var(--st-accent-text)]">SELECTED COMPONENT · #{selectedPart.code}</span>
                <h2 className="mt-1 text-lg font-semibold text-[var(--st-on)]">{selectedPart.name}</h2>
              </div>

              <p className="text-xs leading-relaxed text-[var(--st-on-var)]">{selectedPart.description}</p>

              <div className="sub space-y-2 p-3.5 text-xs">
                <div>
                  <span className="eyebrow">FUNCTION</span>
                  <p className="mt-1 text-[var(--st-on)]">{selectedPart.function}</p>
                </div>
                <div className="border-t border-[var(--st-line)] pt-2">
                  <span className="eyebrow">CONSTRUCTION MATERIAL</span>
                  <p className="mono mt-1 text-[11px] text-[var(--st-accent-text)]">{selectedPart.material}</p>
                </div>
                <div className="border-t border-[var(--st-line)] pt-2">
                  <span className="eyebrow text-[var(--st-amber)]">INDUSTRIAL RELEVANCE</span>
                  <p className="mt-1 text-[var(--st-on-var)]">{selectedPart.industrialRelevance}</p>
                </div>
              </div>

              <div className="sub space-y-1 p-3.5">
                <p className="eyebrow mb-1">INSTRUMENT ENVELOPE</p>
                <div className="kv">
                  <span>Accuracy</span>
                  <span>{topic.accuracyAndSensitivity.accuracyClass}</span>
                </div>
                <div className="kv">
                  <span>Sensitivity</span>
                  <span>{topic.accuracyAndSensitivity.sensitivity}</span>
                </div>
                <div className="kv">
                  <span>Response τ</span>
                  <span>{topic.accuracyAndSensitivity.responseTime}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass space-y-3.5 p-5">
              <p className="eyebrow text-[var(--st-accent-text)]">PERFORMANCE TELEMETRY</p>
              <div className="sub space-y-1 p-3.5">
                <div className="kv">
                  <span>Typical Span</span>
                  <span>{topic.measurementRange.typicalSpan}</span>
                </div>
                <div className="kv">
                  <span>Extreme Limits</span>
                  <span>{topic.measurementRange.extremeLimits}</span>
                </div>
                <div className="kv">
                  <span>Accuracy Class</span>
                  <span>{topic.accuracyAndSensitivity.accuracyClass}</span>
                </div>
                <div className="kv">
                  <span>Sensitivity</span>
                  <span>{topic.accuracyAndSensitivity.sensitivity}</span>
                </div>
                <div className="kv">
                  <span>Repeatability</span>
                  <span>{topic.accuracyAndSensitivity.repeatability}</span>
                </div>
                <div className="kv">
                  <span>Response Time</span>
                  <span>{topic.accuracyAndSensitivity.responseTime}</span>
                </div>
              </div>

              <div className="sub space-y-2 p-3.5 text-xs">
                <p className="eyebrow">QUICK REVISION HIGHLIGHTS</p>
                <ul className="space-y-1.5 text-[var(--st-on-var)]">
                  {topic.quickRevisionNotes.map((n) => (
                    <li key={n} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--st-accent-text)]" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {canonical && canonical.curriculumLinks.length > 0 && (
            <div className="glass space-y-2.5 p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-[var(--st-accent-text)]" />
                <p className="eyebrow text-[var(--st-accent-text)]">
                  NITJ SYLLABUS COVERAGE ({canonical.curriculumLinks.length})
                </p>
              </div>
              <div className="space-y-1.5">
                {canonical.curriculumLinks.slice(0, 6).map((cl) => (
                  <Link
                    key={`${cl.subjectId}-${cl.conceptId}`}
                    to={`/roadmap?sem=${cl.semesterLabel.toLowerCase().includes('supplement') ? 'additional' : cl.semesterLabel.replace(/[^0-9]/g, '') || '3'}&subject=${encodeURIComponent(cl.subjectId)}&unit=${cl.unitNumber}&concept=${encodeURIComponent(cl.conceptId)}`}
                    className="sub block px-3 py-2 text-xs transition hover:border-[var(--st-accent)]/50"
                  >
                    <p className="mono text-[10px] text-[var(--st-accent-text)]">
                      {cl.subjectCode} · {cl.semesterLabel} · Unit {cl.unitNumber}
                    </p>
                    <p className="mt-0.5 font-medium text-[var(--st-on)]">{cl.conceptTitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* BELOW: Complete 20-Point Engineering Documentation Layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 02. Purpose & Working Principle */}
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">02 · PURPOSE &amp; WORKING PRINCIPLE</p>
          <p className="text-sm text-[var(--st-on)]">{topic.purposeAndPrinciple.purpose}</p>
          <p className="text-xs leading-relaxed text-[var(--st-on-var)]">
            {topic.purposeAndPrinciple.workingPrinciple}
          </p>
          <ol className="space-y-2 pt-1">
            {topic.purposeAndPrinciple.principleSteps.map((step, i) => (
              <li key={step} className="sub flex items-start gap-3 p-3 text-xs">
                <span className="mono font-semibold text-[var(--st-accent-text)]">0{i + 1}</span>
                <span className="text-[var(--st-on)]">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 03 & 04. Construction & Internal Components */}
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">03–04 · CONSTRUCTION &amp; INTERNAL COMPONENTS</p>
          <p className="text-xs leading-relaxed text-[var(--st-on)]">{topic.construction.summary}</p>
          <p className="muted text-xs leading-relaxed">{topic.construction.assemblyArchitecture}</p>
          <div className="tech-table-wrap">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Material</th>
                  <th>Function &amp; Failure Mode</th>
                </tr>
              </thead>
              <tbody>
                {topic.internalComponents.map((c) => (
                  <tr key={c.partCode + c.name}>
                    <td className="font-medium">
                      <span className="mono mr-1.5 text-[var(--st-accent-text)]">{c.partCode}</span>
                      {c.name}
                    </td>
                    <td className="mono text-[11px] text-[var(--st-on-var)]">{c.material}</td>
                    <td className="text-xs">
                      <p>{c.function}</p>
                      <p className="mt-0.5 text-[11px] text-[var(--st-amber)]">Failure: {c.failureMode}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 05. Types & Classification */}
      <section className="glass space-y-3 p-6">
        <p className="eyebrow text-[var(--st-accent-text)]">05 · TYPES &amp; CLASSIFICATION</p>
        <div className="tech-table-wrap">
          <table className="tech-table">
            <thead>
              <tr>
                <th>Variant / Type</th>
                <th>Summary</th>
                <th>Typical Range</th>
                <th>Accuracy</th>
                <th>Best Industrial Fit</th>
              </tr>
            </thead>
            <tbody>
              {topic.typesAndClassification.map((t) => (
                <tr key={t.type}>
                  <td className="font-semibold">{t.type}</td>
                  <td className="text-[var(--st-on-var)]">{t.summary}</td>
                  <td className="mono text-[11px]">{t.typicalRange}</td>
                  <td className="mono text-[11px] text-[var(--st-accent-text)]">{t.accuracy}</td>
                  <td>{t.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 06 & 07. Equations + Characteristic Graph */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass space-y-4 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">06 · GOVERNING EQUATIONS &amp; DERIVATIONS</p>
          {topic.equations.map((eq) => (
            <div key={eq.title} className="sub space-y-3 p-4">
              <p className="text-sm font-semibold text-[var(--st-on)]">{eq.title}</p>
              <div className="overflow-x-auto rounded-xl bg-[var(--st-void)] p-3 text-center">
                <MathBlock latex={eq.latex} />
              </div>
              <div className="space-y-1">
                {eq.variables.map((v) => (
                  <div key={v.symbol} className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="mono text-[var(--st-accent-text)]">
                      <MathBlock latex={v.symbol} displayMode={false} />
                    </span>
                    <span className="flex-1 text-[var(--st-on-var)]">{v.meaning}</span>
                    <span className="mono text-[11px] text-[var(--st-outline)]">{v.unit}</span>
                  </div>
                ))}
              </div>
              <ul className="space-y-1 border-t border-[var(--st-line)] pt-2 text-xs text-[var(--st-on-var)]">
                {eq.derivationSteps.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">07 · CHARACTERISTIC RESPONSE CURVE</p>
          <CharacteristicChart curve={topic.characteristicCurve} />
        </section>
      </div>

      {/* 08, 09, 10 & 11. Specifications, Range, Accuracy, Pros/Cons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">08–10 · TECHNICAL SPECIFICATIONS, RANGE &amp; ACCURACY</p>
          <div className="tech-table-wrap">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Specification</th>
                  <th>Standard / Note</th>
                </tr>
              </thead>
              <tbody>
                {topic.specifications.map((sp) => (
                  <tr key={sp.parameter}>
                    <td className="font-medium">{sp.parameter}</td>
                    <td className="mono text-xs text-[var(--st-accent-text)]">{sp.value}</td>
                    <td className="text-xs text-[var(--st-on-var)]">{sp.standardOrNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sub space-y-1.5 p-3.5 text-xs">
            <div className="kv">
              <span>Typical Span</span>
              <span>{topic.measurementRange.typicalSpan}</span>
            </div>
            <div className="kv">
              <span>Extreme Envelope</span>
              <span>{topic.measurementRange.extremeLimits}</span>
            </div>
            <div className="kv">
              <span>Overrange Behavior</span>
              <span>{topic.measurementRange.overrangeProtection}</span>
            </div>
          </div>
        </section>

        <section className="glass space-y-4 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">11 · ADVANTAGES &amp; LIMITATIONS</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sub space-y-2 p-4">
              <p className="eyebrow text-[var(--st-accent-text)]">STRENGTHS</p>
              <ul className="space-y-2 text-xs text-[var(--st-on)]">
                {topic.advantages.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--st-accent-text)]" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sub space-y-2 p-4">
              <p className="eyebrow text-[var(--st-amber)]">LIMITATIONS</p>
              <ul className="space-y-2 text-xs text-[var(--st-on-var)]">
                {topic.limitations.map((l) => (
                  <li key={l} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-[var(--st-amber)]" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* 12, 13 & 14. Applications, Calibration & Installation */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">12 · INDUSTRIAL APPLICATIONS</p>
          <div className="space-y-2.5">
            {topic.applications.map((app) => (
              <div key={app.loopTagExample + app.service} className="sub space-y-1 p-3.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--st-on)]">{app.industry}</span>
                  <span className="mono rounded bg-[var(--st-void)] px-2 py-0.5 text-[10px] text-[var(--st-accent-text)]">
                    {app.loopTagExample}
                  </span>
                </div>
                <p className="text-[var(--st-on-var)]">{app.service}</p>
                <p className="text-[11px] text-[var(--st-outline)]">{app.engineeringNote}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">13 · CALIBRATION PROCEDURE</p>
          <p className="mono text-[11px] text-[var(--st-iris)]">{topic.calibration.referenceStandard}</p>
          <div className="sub p-3 text-xs">
            <p className="eyebrow mb-1">EQUIPMENT</p>
            <ul className="space-y-1 text-[var(--st-on-var)]">
              {topic.calibration.equipmentRequired.map((eq) => (
                <li key={eq}>• {eq}</li>
              ))}
            </ul>
          </div>
          <ol className="space-y-1.5 text-xs text-[var(--st-on)]">
            {topic.calibration.procedureSteps.map((st, idx) => (
              <li key={st}>
                <span className="mono mr-1.5 text-[var(--st-accent-text)]">{idx + 1}.</span>
                {st}
              </li>
            ))}
          </ol>
          <p className="rounded-xl bg-[var(--st-void)] px-3 py-2 text-xs text-[var(--st-accent-text)]">
            Acceptance: {topic.calibration.acceptanceCriteria}
          </p>
        </section>

        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">14 · INSTALLATION &amp; COMMON MISTAKES</p>
          <div className="space-y-2 text-xs">
            <p className="eyebrow">MECHANICAL</p>
            {topic.installation.mechanicalRules.map((r) => (
              <p key={r} className="text-[var(--st-on)]">• {r}</p>
            ))}
            <p className="eyebrow pt-1">ELECTRICAL / IMPULSE</p>
            {topic.installation.electricalOrImpulseRules.map((r) => (
              <p key={r} className="text-[var(--st-on-var)]">• {r}</p>
            ))}
            <div className="sub mt-2 space-y-1 border-[color-mix(in_srgb,var(--st-crimson)_35%,transparent)] p-3">
              <p className="eyebrow text-[var(--st-crimson)]">COMMON PITFALLS</p>
              {topic.installation.commonMistakes.map((m) => (
                <p key={m} className="text-[var(--st-on-var)]">! {m}</p>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 15. Troubleshooting */}
      <section className="glass space-y-3 p-6">
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-[var(--st-amber)]" />
          <p className="eyebrow text-[var(--st-accent-text)]">15 · FIELD TROUBLESHOOTING MATRIX</p>
        </div>
        <div className="tech-table-wrap">
          <table className="tech-table">
            <thead>
              <tr>
                <th>Symptom</th>
                <th>Probable Cause</th>
                <th>Diagnostic Check</th>
                <th>Corrective Action</th>
              </tr>
            </thead>
            <tbody>
              {topic.troubleshooting.map((tr) => (
                <tr key={tr.symptom}>
                  <td className="font-medium text-[var(--st-amber)]">{tr.symptom}</td>
                  <td>{tr.probableCause}</td>
                  <td className="text-[var(--st-on-var)]">{tr.diagnosticCheck}</td>
                  <td className="text-[var(--st-accent-text)]">{tr.correctiveAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 16 & 17. Manufacturers + Peer Comparisons */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">16 · MANUFACTURERS &amp; REPRESENTATIVE SERIES</p>
          <div className="space-y-2.5">
            {topic.manufacturers.map((m) => (
              <div key={m.vendor + m.modelSeries} className="sub space-y-1.5 p-3.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--st-on)]">
                    {m.vendor} · <span className="text-[var(--st-accent-text)]">{m.modelSeries}</span>
                  </span>
                  <span
                    className="status"
                    style={{
                      '--tone':
                        m.verificationStatus === 'sourced-reference'
                          ? 'var(--st-accent)'
                          : 'var(--st-amber)',
                    } as React.CSSProperties}
                  >
                    {m.verificationStatus === 'sourced-reference'
                      ? 'Sourced Reference'
                      : 'Editorial Verification'}
                  </span>
                </div>
                <p className="text-[var(--st-on-var)]">{m.notes}</p>
                {m.sourceUrl ? (
                  <a
                    href={m.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mono text-[11px] text-[var(--st-accent-text)] hover:underline"
                  >
                    {m.sourceLabel} <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="mono text-[11px] text-[var(--st-outline)]">{m.sourceLabel}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">17 · PEER INSTRUMENT COMPARISON</p>
          <div className="tech-table-wrap">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>{topic.shortTitle}</th>
                  <th>Peer Instrument</th>
                  <th>Engineering Takeaway</th>
                </tr>
              </thead>
              <tbody>
                {topic.comparisons.map((cmp) => (
                  <tr key={cmp.parameter + cmp.peerName}>
                    <td className="font-medium">{cmp.parameter}</td>
                    <td className="text-[var(--st-accent-text)]">{cmp.thisInstrument}</td>
                    <td>
                      <p className="font-medium">{cmp.peerName}</p>
                      <p className="muted text-xs">{cmp.peerValue}</p>
                    </td>
                    <td className="text-xs text-[var(--st-on-var)]">{cmp.engineeringTakeaway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 18 & 19. Worked Numericals + Interview Q&A */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">18 · WORKED NUMERICAL PROBLEMS</p>
          {topic.numericalProblems.map((prob) => (
            <div key={prob.title} className="sub space-y-2.5 p-4 text-xs">
              <p className="text-sm font-semibold text-[var(--st-on)]">{prob.title}</p>
              <p className="text-[var(--st-on-var)]">{prob.statement}</p>
              <div className="flex flex-wrap gap-1.5">
                {prob.given.map((g) => (
                  <span key={g} className="pill mono text-[10px]">{g}</span>
                ))}
              </div>
              <ol className="space-y-1 border-t border-[var(--st-line)] pt-2 text-[var(--st-on)]">
                {prob.steps.map((st, idx) => (
                  <li key={st}>
                    <span className="mono mr-1.5 text-[var(--st-accent-text)]">{idx + 1}.</span>
                    {st}
                  </li>
                ))}
              </ol>
              <p className="rounded-xl bg-[var(--st-void)] px-3 py-2 font-semibold text-[var(--st-accent-text)]">
                Final Answer: {prob.answer}
              </p>
            </div>
          ))}
        </section>

        <section className="glass space-y-3 p-6">
          <p className="eyebrow text-[var(--st-accent-text)]">19 · INTERVIEW PRACTICE QUESTIONS</p>
          <div className="space-y-2">
            {topic.interviewQuestions.map((qa, idx) => {
              const open = Boolean(openQA[idx]);
              return (
                <div key={qa.question} className="sub overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpenQA((prev) => ({ ...prev, [idx]: !open }))}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 p-4 text-left"
                  >
                    <div className="space-y-1">
                      <span className="pill mono text-[10px]">{qa.difficulty}</span>
                      <p className="text-xs font-medium text-[var(--st-on)]">{qa.question}</p>
                    </div>
                    <ChevronDown className={`mt-1 size-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <div className="border-t border-[var(--st-line)] bg-[var(--st-1)] p-4 text-xs leading-relaxed text-[var(--st-on-var)]">
                      {qa.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 20. Quick Revision Notes & Standards Sources */}
      <section className="glass grid gap-4 p-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="eyebrow text-[var(--st-accent-text)]">20 · QUICK REVISION NOTES</p>
          <ul className="space-y-1.5 text-xs text-[var(--st-on)]">
            {topic.quickRevisionNotes.map((note) => (
              <li key={note} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--st-accent-text)]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="eyebrow text-[var(--st-accent-text)]">TECHNICAL STANDARDS &amp; SOURCES</p>
          <div className="space-y-2">
            {topic.sources.map((src) => (
              <div key={src.label} className="sub flex items-center justify-between gap-2 px-3.5 py-2 text-xs">
                <div>
                  <span className="font-semibold text-[var(--st-on)]">{src.label}</span>
                  <span className="muted ml-2">{src.standardOrDoc}</span>
                </div>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--st-accent-text)] hover:underline"
                    aria-label={`Open ${src.label}`}
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

