import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CadViewer3D, type CadViewerConfigLike } from '@/components/CadViewer3D';
import { CharacteristicChart } from '@/components/CharacteristicChart';
import { EngineeringSchematic } from '@/components/EngineeringSchematic';
import { InstrumentSimulatorPanel } from '@/components/InstrumentSimulatorPanel';
import { MathBlock } from '@/components/MathBlock';
import { useApp } from '@/context/AppContext';
import { getCanonicalInstrument } from '@/data/instrumentRegistry';
import { getInstrumentTopic } from '@/data/instruments';
import { CAD_MODELS } from '@/data/models3d';
import {
  getCanonicalInstrumentUrl,
  resolveCanonicalPath,
  type InstrumentTabKey,
} from '@/data/navigationTree';
import { getPlainDisplayName, getSimpleGuide } from '@/data/simpleGuides';
import { INSTRUMENT_SIMULATIONS } from '@/data/simulations';

const VALID_TABS: InstrumentTabKey[] = ['simple', 'theory', '3d', 'sim', 'interview'];

const ROMAN_SEMESTER_MAP: Array<[RegExp, string]> = [
  [/\bVIII\b/i, '8'],
  [/\bVII\b/i, '7'],
  [/\bVI\b/i, '6'],
  [/\bIV\b/i, '4'],
  [/\bV\b/i, '5'],
  [/\bIII\b/i, '3'],
  [/\bII\b/i, '2'],
  [/\bI\b/i, '1'],
];

function resolveRoadmapSemParam(semesterLabel: string, subjectId: string): string {
  const lowerLabel = semesterLabel.toLowerCase();
  const lowerSubject = subjectId.toLowerCase();
  if (
    lowerLabel.includes('additional') ||
    lowerLabel.includes('supplement') ||
    lowerSubject.includes('-supp-')
  ) {
    return 'additional';
  }
  const digitMatch = semesterLabel.match(/\b([1-8])\b/);
  if (digitMatch) return digitMatch[1];
  for (const [pattern, sem] of ROMAN_SEMESTER_MAP) {
    if (pattern.test(semesterLabel)) return sem;
  }
  const subjectMatch = lowerSubject.match(/sem([1-8])/);
  if (subjectMatch) return subjectMatch[1];
  return '3';
}

function parseTabParam(raw: string | null, focusRaw: string | null): InstrumentTabKey {
  if (raw && (VALID_TABS as string[]).includes(raw)) return raw as InstrumentTabKey;
  if (focusRaw === 'sim') return 'sim';
  return 'simple';
}

function ExpandableText({
  text,
  limit = 260,
  className = 'prose-measure text-[var(--st-on)]',
}: {
  text: string;
  limit?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  if (text.length <= limit) {
    return <p className={className}>{text}</p>;
  }
  return (
    <div className="space-y-1.5">
      <p className={className}>{expanded ? text : `${text.slice(0, limit).trimEnd()}…`}</p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="cursor-pointer text-[14px] font-semibold text-[var(--st-accent-text)] hover:underline"
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

function CollapsibleSection({
  id,
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="glass overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`theory-sec-${id}`}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start justify-between gap-3 p-5 text-left transition hover:bg-[var(--st-2)]/60"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h2>{title}</h2>
          {!open && <p className="muted truncate text-[14px]">{summary}</p>}
        </div>
        {open ? (
          <ChevronDown className="mt-1 size-5 shrink-0 text-[var(--st-accent-text)]" />
        ) : (
          <ChevronRight className="mt-1 size-5 shrink-0 text-[var(--st-outline)]" />
        )}
      </button>

      {open && (
        <div id={`theory-sec-${id}`} className="border-t border-[var(--st-line)] p-5">
          {children}
        </div>
      )}
    </section>
  );
}

export function InstrumentPage() {
  const { instrumentId } = useParams<{ instrumentId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isBookmarked, toggleBookmark } = useApp();

  const entry = getCanonicalInstrument(instrumentId);
  const pathInfo = resolveCanonicalPath(instrumentId);
  const topic = useMemo(() => {
    if (!entry?.existingTopicRef) return undefined;
    return getInstrumentTopic(entry.existingTopicRef.category, entry.existingTopicRef.slug);
  }, [entry]);

  const activeTab = parseTabParam(searchParams.get('tab'), searchParams.get('focus'));

  const setActiveTab = (tab: InstrumentTabKey) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('focus');
      if (tab === 'simple') next.delete('tab');
      else next.set('tab', tab);
      return next;
    });
  };

  const simConfig = entry?.simulationId ? INSTRUMENT_SIMULATIONS[entry.simulationId] : undefined;
  const [primaryVal, setPrimaryVal] = useState<number>(simConfig?.primaryParam.defaultValue ?? 0);
  const [secondaryVal, setSecondaryVal] = useState<number>(
    simConfig?.secondaryParam?.defaultValue ?? 0,
  );

  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [hiddenPartIds, setHiddenPartIds] = useState<Set<string>>(() => new Set());
  const [openTheory, setOpenTheory] = useState<Record<string, boolean>>({});
  const [showSchematic, setShowSchematic] = useState(false);

  // Interview one-question-at-a-time state
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (entry) {
      setSelectedPartId('');
      setHiddenPartIds(new Set());
      setOpenTheory({});
      setShowSchematic(false);
      setQuestionIdx(0);
      setShowAnswer(false);
      if (simConfig) {
        setPrimaryVal(simConfig.primaryParam.defaultValue);
        setSecondaryVal(simConfig.secondaryParam?.defaultValue ?? 0);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [entry?.id, simConfig]);

  const evalResult = useMemo(() => {
    if (!simConfig) return null;
    return simConfig.evaluate(primaryVal, secondaryVal);
  }, [simConfig, primaryVal, secondaryVal]);

  const legacyGlbCad =
    topic?.has3DModel && topic.modelId ? CAD_MODELS[topic.modelId] : undefined;

  const cadConfig: (CadViewerConfigLike & { disclosure: string }) | null = useMemo(() => {
    if (!entry?.hasDedicated3D) return null;
    if (legacyGlbCad) {
      return { ...legacyGlbCad, disclosure: legacyGlbCad.disclosure };
    }
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
      disclosure: entry.disclosure,
    };
  }, [entry, legacyGlbCad]);

  if (!entry) {
    return (
      <div className="glass mx-auto max-w-[70ch] space-y-4 p-6">
        <h1>Instrument not found</h1>
        <p className="text-[16px] text-[var(--st-on-var)]">
          We could not find an instrument matching &ldquo;{instrumentId}&rdquo;.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/browse" className="btn primary">
            Browse instruments
          </Link>
          <Link to="/" className="btn">
            Home
          </Link>
        </div>
      </div>
    );
  }

  const simpleGuide = getSimpleGuide(entry, topic);
  const selectedPart = entry.parts.find((p) => p.id === selectedPartId) ?? entry.parts[0];

  const qaList: { question: string; answer: string }[] = topic
    ? topic.interviewQuestions.map((q) => ({ question: q.question, answer: q.answer }))
    : entry.learning.vivaQuestions.map((vq) => ({ question: vq.q, answer: vq.a }));

  const currentQuestion = qaList[questionIdx] ?? qaList[0];

  const togglePartVisibility = (partId: string) => {
    setHiddenPartIds((prev) => {
      const next = new Set(prev);
      if (next.has(partId)) next.delete(partId);
      else next.add(partId);
      return next;
    });
  };

  const bmId = `instrument:${entry.id}`;
  const bookmarked = isBookmarked(bmId);

  const displayName = entry ? (topic?.title ?? getPlainDisplayName(entry)) : '';

  return (
    <div className="mx-auto flex max-w-[1060px] flex-col gap-5">
      {/* Header: Plain title & 5 clear tabs (no standard codes in header) */}
      <header className="glass space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            {pathInfo && (
              <p className="text-[14px] text-[var(--st-on-var)]">
                {pathInfo.subject.shortName} › {pathInfo.family.label}
              </p>
            )}
            <h1>{displayName}</h1>
          </div>

          <button
            type="button"
            onClick={() =>
              toggleBookmark({
                id: bmId,
                itemType: 'instrument',
                title: displayName,
                subtitle: pathInfo
                  ? `${pathInfo.subject.shortName} · ${pathInfo.family.label}`
                  : entry.categoryLabel,
                route: getCanonicalInstrumentUrl(entry.id, activeTab),
              })
            }
            className={`btn shrink-0 ${bookmarked ? 'primary' : ''}`}
          >
            <Bookmark className="size-4" />
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Five Clear Beginner Tabs */}
        <div className="border-t border-[var(--st-line)] pt-4">
          <div className="seg" role="tablist" aria-label="Instrument sections">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'simple'}
              onClick={() => setActiveTab('simple')}
              className={activeTab === 'simple' ? 'on' : ''}
            >
              Simple
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'theory'}
              onClick={() => setActiveTab('theory')}
              className={activeTab === 'theory' ? 'on' : ''}
            >
              Theory
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === '3d'}
              onClick={() => setActiveTab('3d')}
              className={activeTab === '3d' ? 'on' : ''}
            >
              3D
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sim'}
              onClick={() => setActiveTab('sim')}
              className={activeTab === 'sim' ? 'on' : ''}
            >
              Simulate
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'interview'}
              onClick={() => setActiveTab('interview')}
              className={activeTab === 'interview' ? 'on' : ''}
            >
              Interview
            </button>
          </div>
        </div>
      </header>

      {/* ==================== TAB 1: SIMPLE ==================== */}
      {activeTab === 'simple' && (
        <section aria-label="Simple overview" className="glass space-y-6 p-6">
          <div className="prose-measure space-y-3 text-[var(--st-on)]">
            {simpleGuide.sentences.slice(0, 3).map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>

          <div className="sub space-y-2 p-5">
            <h2>Everyday analogy</h2>
            <p className="prose-measure text-[var(--st-on-var)]">{simpleGuide.analogy}</p>
          </div>

          <div className="space-y-1">
            <h2>Where you&apos;ll see it</h2>
            <p className="prose-measure text-[var(--st-on-var)]">{simpleGuide.typicalUse}</p>
          </div>

          <div className="border-t border-[var(--st-line)] pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('theory')}
              className="btn primary"
            >
              Go deeper: Theory
              <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      )}

      {/* ==================== TAB 2: THEORY ==================== */}
      {activeTab === 'theory' && (
        <section aria-label="Theory and details" className="space-y-3">
          {topic?.schematicKind && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowSchematic((v) => !v)}
                className={`btn ${showSchematic ? 'primary' : ''}`}
              >
                {showSchematic ? 'Hide diagram' : 'Show diagram'}
              </button>
            </div>
          )}

          {showSchematic && topic?.schematicKind && (
            <EngineeringSchematic kind={topic.schematicKind} title={topic.title} />
          )}

          {topic ? (
            <div className="space-y-3">
              <CollapsibleSection
                id="def"
                title="Definition and working principle"
                summary={topic.definition}
                open={Boolean(openTheory.def)}
                onToggle={() => setOpenTheory((p) => ({ ...p, def: !p.def }))}
              >
                <div className="space-y-4">
                  <ExpandableText text={topic.definition} />
                  <ExpandableText
                    text={topic.purposeAndPrinciple.purpose}
                    className="prose-measure text-[var(--st-on-var)]"
                  />
                  <ExpandableText
                    text={topic.purposeAndPrinciple.workingPrinciple}
                    className="prose-measure text-[var(--st-on-var)]"
                  />
                  <ol className="space-y-2">
                    {topic.purposeAndPrinciple.principleSteps.map((step, i) => (
                      <li key={step} className="sub p-4 text-[16px]">
                        <span className="font-semibold text-[var(--st-accent-text)]">{i + 1}. </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="parts"
                title="Construction and internal parts"
                summary={topic.construction.summary}
                open={Boolean(openTheory.parts)}
                onToggle={() => setOpenTheory((p) => ({ ...p, parts: !p.parts }))}
              >
                <div className="space-y-4">
                  <ExpandableText text={topic.construction.summary} />
                  <div className="tech-table-wrap">
                    <table className="tech-table">
                      <thead>
                        <tr>
                          <th>Part</th>
                          <th>Material</th>
                          <th>Role and common faults</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topic.internalComponents.map((c) => (
                          <tr key={c.partCode + c.name}>
                            <td className="font-semibold">{c.name}</td>
                            <td className="text-[var(--st-on-var)]">{c.material}</td>
                            <td>
                              <p>{c.function}</p>
                              <p className="mt-1 text-[var(--st-amber)]">Fault: {c.failureMode}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="types"
                title="Types and variants"
                summary={topic.typesAndClassification.map((t) => t.type).join(', ')}
                open={Boolean(openTheory.types)}
                onToggle={() => setOpenTheory((p) => ({ ...p, types: !p.types }))}
              >
                <div className="tech-table-wrap">
                  <table className="tech-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Summary</th>
                        <th>Range</th>
                        <th>Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topic.typesAndClassification.map((t) => (
                        <tr key={t.type}>
                          <td className="font-semibold">{t.type}</td>
                          <td className="text-[var(--st-on-var)]">{t.summary}</td>
                          <td>{t.typicalRange}</td>
                          <td className="text-[var(--st-accent-text)]">{t.accuracy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="eq"
                title="Equations and response curve"
                summary={topic.equations.map((e) => e.title).join(', ')}
                open={Boolean(openTheory.eq)}
                onToggle={() => setOpenTheory((p) => ({ ...p, eq: !p.eq }))}
              >
                <div className="space-y-5">
                  {topic.equations.map((eq) => (
                    <div key={eq.title} className="sub space-y-3 p-4">
                      <p className="text-[16px] font-semibold text-[var(--st-on)]">{eq.title}</p>
                      <div className="overflow-x-auto rounded-xl bg-[var(--st-void)] p-3 text-center">
                        <MathBlock latex={eq.latex} />
                      </div>
                      <ul className="space-y-1 text-[14px] text-[var(--st-on-var)]">
                        {eq.derivationSteps.map((s) => (
                          <li key={s}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <CharacteristicChart curve={topic.characteristicCurve} />
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="specs"
                title="Specifications, range, and limits"
                summary={`Span: ${topic.measurementRange.typicalSpan}`}
                open={Boolean(openTheory.specs)}
                onToggle={() => setOpenTheory((p) => ({ ...p, specs: !p.specs }))}
              >
                <div className="space-y-4">
                  <div className="tech-table-wrap">
                    <table className="tech-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Value</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topic.specifications.map((sp) => (
                          <tr key={sp.parameter}>
                            <td className="font-semibold">{sp.parameter}</td>
                            <td className="text-[var(--st-accent-text)]">{sp.value}</td>
                            <td className="text-[var(--st-on-var)]">{sp.standardOrNote}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="sub p-4">
                    <div className="kv">
                      <span>Typical span</span>
                      <span>{topic.measurementRange.typicalSpan}</span>
                    </div>
                    <div className="kv">
                      <span>Accuracy</span>
                      <span>{topic.accuracyAndSensitivity.accuracyClass}</span>
                    </div>
                    <div className="kv">
                      <span>Response time</span>
                      <span>{topic.accuracyAndSensitivity.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="apps"
                title="Applications, calibration, and installation"
                summary={topic.applications.map((a) => a.industry).join(', ')}
                open={Boolean(openTheory.apps)}
                onToggle={() => setOpenTheory((p) => ({ ...p, apps: !p.apps }))}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    {topic.applications.map((app) => (
                      <div key={app.loopTagExample + app.service} className="sub p-4">
                        <p className="text-[16px] font-semibold text-[var(--st-on)]">
                          {app.industry}
                        </p>
                        <p className="mt-1 text-[14px] text-[var(--st-on-var)]">{app.service}</p>
                        <p className="mt-1 text-[14px] text-[var(--st-outline)]">
                          {app.engineeringNote}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="sub space-y-2 p-4">
                    <p className="text-[16px] font-semibold text-[var(--st-on)]">
                      Calibration steps
                    </p>
                    <ol className="space-y-1.5 text-[14px] text-[var(--st-on-var)]">
                      {topic.calibration.procedureSteps.map((st, idx) => (
                        <li key={st}>
                          {idx + 1}. {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="sub space-y-1.5 p-4 text-[14px] text-[var(--st-on-var)]">
                    <p className="text-[16px] font-semibold text-[var(--st-on)]">
                      Installation rules and mistakes
                    </p>
                    {topic.installation.mechanicalRules.map((r) => (
                      <p key={r}>• {r}</p>
                    ))}
                    {topic.installation.commonMistakes.map((m) => (
                      <p key={m} className="text-[var(--st-amber)]">
                        Mistake: {m}
                      </p>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="problems"
                title="Troubleshooting and worked numericals"
                summary={`${topic.troubleshooting.length} fault checks and ${topic.numericalProblems.length} solved numericals`}
                open={Boolean(openTheory.problems)}
                onToggle={() => setOpenTheory((p) => ({ ...p, problems: !p.problems }))}
              >
                <div className="space-y-4">
                  <div className="tech-table-wrap">
                    <table className="tech-table">
                      <thead>
                        <tr>
                          <th>Symptom</th>
                          <th>Cause</th>
                          <th>Fix</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topic.troubleshooting.map((tr) => (
                          <tr key={tr.symptom}>
                            <td className="font-semibold text-[var(--st-amber)]">{tr.symptom}</td>
                            <td>{tr.probableCause}</td>
                            <td className="text-[var(--st-accent-text)]">{tr.correctiveAction}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {topic.numericalProblems.map((prob) => (
                    <div key={prob.title} className="sub space-y-2 p-4">
                      <p className="text-[16px] font-semibold text-[var(--st-on)]">{prob.title}</p>
                      <p className="prose-measure text-[var(--st-on-var)]">{prob.statement}</p>
                      <ol className="space-y-1 text-[14px] text-[var(--st-on)]">
                        {prob.steps.map((st, idx) => (
                          <li key={st}>
                            {idx + 1}. {st}
                          </li>
                        ))}
                      </ol>
                      <p className="text-[16px] font-semibold text-[var(--st-accent-text)]">
                        Answer: {prob.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              {/* Standards belong inside Theory */}
              <CollapsibleSection
                id="standards"
                title="Standards and references"
                summary={entry.standardRef}
                open={Boolean(openTheory.standards)}
                onToggle={() => setOpenTheory((p) => ({ ...p, standards: !p.standards }))}
              >
                <div className="space-y-3">
                  <p className="text-[16px] text-[var(--st-on)]">{topic.standardRef}</p>
                  {topic.sources.map((src) => (
                    <div key={src.label} className="sub flex items-center justify-between gap-3 p-3.5 text-[14px]">
                      <div>
                        <p className="font-semibold text-[var(--st-on)]">{src.label}</p>
                        <p className="text-[var(--st-on-var)]">{src.standardOrDoc}</p>
                      </div>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--st-accent-text)]"
                          aria-label={`Open ${src.label}`}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          ) : (
            <div className="space-y-3">
              <CollapsibleSection
                id="ov"
                title="How it works"
                summary={entry.overview}
                open={Boolean(openTheory.ov)}
                onToggle={() => setOpenTheory((p) => ({ ...p, ov: !p.ov }))}
              >
                <div className="space-y-4">
                  <ExpandableText text={entry.overview} />
                  <ol className="space-y-2">
                    {entry.workingPrincipleSteps.map((st, idx) => (
                      <li key={st} className="sub p-4 text-[16px]">
                        <span className="font-semibold text-[var(--st-accent-text)]">{idx + 1}. </span>
                        {st}
                      </li>
                    ))}
                  </ol>
                </div>
              </CollapsibleSection>

              {entry.learning.equations.length > 0 && (
                <CollapsibleSection
                  id="ceq"
                  title="Equations"
                  summary={entry.learning.equations.map((e) => e.label).join(', ')}
                  open={Boolean(openTheory.ceq)}
                  onToggle={() => setOpenTheory((p) => ({ ...p, ceq: !p.ceq }))}
                >
                  <div className="space-y-3">
                    {entry.learning.equations.map((eq) => (
                      <div key={eq.label} className="sub space-y-2 p-4 text-center">
                        <p className="text-[14px] font-semibold text-[var(--st-on-var)]">{eq.label}</p>
                        <MathBlock latex={eq.latex} />
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              <CollapsibleSection
                id="cspecs"
                title="Performance and maintenance"
                summary={entry.measurementQuantity}
                open={Boolean(openTheory.cspecs)}
                onToggle={() => setOpenTheory((p) => ({ ...p, cspecs: !p.cspecs }))}
              >
                <div className="space-y-3">
                  <div className="sub p-4">
                    {Object.entries(entry.performance)
                      .filter(([, val]) => Boolean(val))
                      .map(([k, val]) => (
                        <div key={k} className="kv">
                          <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{val}</span>
                        </div>
                      ))}
                  </div>
                  <p className="prose-measure text-[var(--st-on-var)]">
                    {entry.practical.calibrationAndMaintenance}
                  </p>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="cstd"
                title="Standards and references"
                summary={entry.standardRef}
                open={Boolean(openTheory.cstd)}
                onToggle={() => setOpenTheory((p) => ({ ...p, cstd: !p.cstd }))}
              >
                <p className="text-[16px] text-[var(--st-on)]">{entry.standardRef}</p>
              </CollapsibleSection>
            </div>
          )}

          {/* Curriculum Units & Concepts inside Instrument Theory */}
          {entry.curriculumLinks.length > 0 && (
            <CollapsibleSection
              id="units"
              title="Curriculum units and concepts"
              summary={`${entry.curriculumLinks.length} related syllabus topics`}
              open={Boolean(openTheory.units)}
              onToggle={() => setOpenTheory((p) => ({ ...p, units: !p.units }))}
            >
              <div className="space-y-2">
                {entry.curriculumLinks.map((cl) => (
                  <Link
                    key={`${cl.subjectId}-${cl.conceptId}`}
                    to={`/roadmap?sem=${resolveRoadmapSemParam(cl.semesterLabel, cl.subjectId)}&subject=${encodeURIComponent(cl.subjectId)}&unit=${cl.unitNumber}&concept=${encodeURIComponent(cl.conceptId)}`}
                    className="sub block p-4 transition hover:border-[var(--st-accent)]"
                  >
                    <p className="text-[14px] text-[var(--st-on-var)]">
                      {cl.subjectName} · Unit {cl.unitNumber}
                    </p>
                    <p className="mt-0.5 text-[16px] font-semibold text-[var(--st-on)]">
                      {cl.conceptTitle}
                    </p>
                  </Link>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </section>
      )}

      {/* ==================== TAB 3: 3D (FULL WIDTH) ==================== */}
      {activeTab === '3d' && (
        <section aria-label="Interactive 3D view" className="space-y-4">
          {cadConfig && selectedPart ? (
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
                heightClass="h-[460px] sm:h-[580px]"
              />

              <div className="sub flex items-start gap-3 p-4 text-[14px] text-[var(--st-on-var)]">
                <Info className="mt-0.5 size-4 shrink-0 text-[var(--st-accent-text)]" />
                <span>{cadConfig.disclosure}</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass space-y-2 p-5">
                  <p className="text-[14px] font-semibold text-[var(--st-accent-text)]">
                    Selected part
                  </p>
                  <h2>{selectedPart.name}</h2>
                  <p className="prose-measure text-[var(--st-on-var)]">{selectedPart.description}</p>
                  <p className="text-[14px] text-[var(--st-on)]">
                    <span className="font-semibold">Material: </span>
                    {selectedPart.material}
                  </p>
                </div>

                <div className="glass space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <h2>Parts ({entry.parts.length})</h2>
                    {hiddenPartIds.size > 0 && (
                      <button
                        type="button"
                        onClick={() => setHiddenPartIds(new Set())}
                        className="cursor-pointer text-[14px] font-semibold text-[var(--st-accent-text)] hover:underline"
                      >
                        Show all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 space-y-1 overflow-y-auto">
                    {entry.parts.map((part) => {
                      const isHidden = hiddenPartIds.has(part.id);
                      const active = selectedPartId === part.id;
                      return (
                        <div key={part.id} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPartId(part.id)}
                            className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-[14px] transition ${
                              active
                                ? 'bg-[var(--st-3)] font-semibold text-[var(--st-on)]'
                                : 'text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                            }`}
                          >
                            <span className={`truncate ${isHidden ? 'line-through opacity-50' : ''}`}>
                              {part.name}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePartVisibility(part.id)}
                            aria-label={isHidden ? `Show ${part.name}` : `Hide ${part.name}`}
                            className="cursor-pointer rounded-lg p-2 text-[var(--st-on-var)] hover:bg-[var(--st-2)] hover:text-[var(--st-on)]"
                          >
                            {isHidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass space-y-4 p-6">
              <h2>No 3D enclosure for this topic</h2>
              <p className="prose-measure text-[var(--st-on-var)]">
                This topic covers a measurement principle or signaling method rather than a single device housing. Look at the diagram below or open one of the related physical instruments.
              </p>
              {topic?.schematicKind && (
                <EngineeringSchematic kind={topic.schematicKind} title={topic.title} />
              )}
              {entry.learning.relatedInstrumentIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.learning.relatedInstrumentIds.map((rid) => {
                    const rel = getCanonicalInstrument(rid);
                    if (!rel) return null;
                    return (
                      <Link key={rid} to={getCanonicalInstrumentUrl(rid, '3d')} className="btn">
                        {rel.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ==================== TAB 4: SIMULATE ==================== */}
      {activeTab === 'sim' && (
        <section aria-label="Interactive simulation">
          {simConfig && evalResult ? (
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
          ) : (
            <div className="glass space-y-4 p-6">
              <h2>No interactive simulator for this topic</h2>
              <p className="prose-measure text-[var(--st-on-var)]">
                This topic does not have a dedicated device simulator. Open Toolbox for general loop calculators.
              </p>
              <Link to="/toolbox" className="btn primary">
                Open Toolbox
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ==================== TAB 5: INTERVIEW (ONE QUESTION AT A TIME) ==================== */}
      {activeTab === 'interview' && (
        <section aria-label="Interview practice" className="glass space-y-5 p-6">
          {qaList.length > 0 && currentQuestion ? (
            <>
              <div className="flex items-center justify-between gap-2 text-[14px] text-[var(--st-on-var)]">
                <span>
                  Question {questionIdx + 1} of {qaList.length}
                </span>
              </div>

              <h2 className="prose-measure text-[20px] font-semibold text-[var(--st-on)]">
                {currentQuestion.question}
              </h2>

              {showAnswer && (
                <div className="sub p-5">
                  <p className="prose-measure text-[var(--st-on)]">{currentQuestion.answer}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--st-line)] pt-4">
                <button
                  type="button"
                  onClick={() => setShowAnswer((v) => !v)}
                  className="btn primary"
                >
                  {showAnswer ? 'Hide answer' : 'Show answer'}
                </button>

                {questionIdx > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuestionIdx((i) => i - 1);
                      setShowAnswer(false);
                    }}
                    className="btn"
                  >
                    <ArrowLeft className="size-4" />
                    Previous
                  </button>
                )}

                <button
                  type="button"
                  disabled={questionIdx >= qaList.length - 1}
                  onClick={() => {
                    setQuestionIdx((i) => Math.min(qaList.length - 1, i + 1));
                    setShowAnswer(false);
                  }}
                  className="btn"
                >
                  Next question
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-[16px] text-[var(--st-on-var)]">
              No practice questions available for this topic yet. Open Interview Prep for the full bank.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
