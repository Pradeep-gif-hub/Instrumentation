import {
  Activity,
  ArrowUpRight,
  Bookmark,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  Factory,
  GitBranch,
  HelpCircle,
  Sigma,
  Terminal,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { getCanonicalInstrument } from '@/data/instrumentRegistry';
import { getCanonicalInstrumentUrl } from '@/data/navigationTree';
import type { ConceptDetail, CurriculumSubjectDetail, CurriculumUnitDetail } from '@/types/curriculum';
import { ConceptInteractiveVisualizer } from './CurriculumVisualizers';
import { MathBlock } from './MathBlock';
import { MermaidDiagram } from './MermaidDiagram';

interface ConceptInspectorProps {
  subject: CurriculumSubjectDetail;
  unit: CurriculumUnitDetail;
  concept: ConceptDetail;
  onNavigateSubject: (subjectId: string) => void;
}

export function ConceptInspector({
  subject,
  unit,
  concept,
  onNavigateSubject,
}: ConceptInspectorProps) {
  const { toggleBookmark, isBookmarked } = useApp();
  const [revealedNumIdx, setRevealedNumIdx] = useState<Record<number, boolean>>({ 0: true });
  const [revealedQA, setRevealedQA] = useState<Record<number, boolean>>({});
  const [revealedFollowUp, setRevealedFollowUp] = useState<Record<number, boolean>>({});

  const numericSem = subject.semester === 'additional' ? 5 : subject.semester;
  const bookmarkId = `concept:${subject.id}:${concept.id}`;
  const saved = isBookmarked(bookmarkId);

  return (
    <article className="glass space-y-5 p-5 sm:p-6">
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--st-line)] pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">{subject.code}</span>
            <span className="rounded-full border border-[var(--st-line)] px-2.5 py-0.5 text-[14px] text-[var(--st-on-var)]">
              Unit {unit.unitNumber} · {unit.title}
            </span>
            {concept.isExtension && (
              <span className="rounded-full border border-[var(--st-accent)]/40 bg-[var(--st-accent)]/10 px-2.5 py-0.5 text-[14px] text-[var(--st-accent-text)]">
                Additional Extension
              </span>
            )}
          </div>
          <h3 className="text-[20px] font-semibold text-[var(--st-on)]">
            {concept.title}
          </h3>
          <p className="text-[16px] text-[var(--st-on-var)]">{concept.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              toggleBookmark({
                id: bookmarkId,
                itemType: 'subject',
                title: `${subject.code} · ${concept.title}`,
                subtitle: `${subject.displaySemesterLabel} · Unit ${unit.unitNumber}`,
                route: `/roadmap?sem=${subject.semester}&subject=${encodeURIComponent(subject.id)}&unit=${unit.unitNumber}&concept=${encodeURIComponent(concept.id)}`,
              })
            }
            className={`btn ${saved ? 'primary' : ''}`}
          >
            <Bookmark className="size-3.5" />
            {saved ? 'Bookmarked' : 'Bookmark Concept'}
          </button>

          {concept.linkedPlatformRoute && (
            <Link to={concept.linkedPlatformRoute} className="btn">
              {concept.linkedPlatformLabel || 'Open Interactive Module'}
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
      </header>

      {/* Optional Verification / Supplementary Disclaimer */}
      {concept.verificationFlag && (
        <div className="rounded-xl border border-[var(--st-amber)]/35 bg-[var(--st-amber)]/10 px-3.5 py-2.5 text-[14px] text-[var(--st-on)]">
          <span className="mr-2 font-semibold text-[var(--st-amber)]">
            Syllabus note:
          </span>
          {concept.verificationFlag}
        </div>
      )}

      {/* Input / Output Quick Spec if provided */}
      {concept.inputOutput && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sub px-4 py-3">
            <p className="eyebrow">Input / Stimulus</p>
            <p className="mt-1 text-[14px] font-semibold text-[var(--st-on)]">{concept.inputOutput.input}</p>
          </div>
          <div className="sub px-4 py-3">
            <p className="eyebrow">Output / Conditioned Signal</p>
            <p className="mt-1 text-[14px] font-semibold text-[var(--st-accent-text)]">{concept.inputOutput.output}</p>
          </div>
        </div>
      )}

      {/* Domain Interactive Visualizer (8085 Stepper, Sampling/Z-plane, Phase Portraits) */}
      <ConceptInteractiveVisualizer conceptId={concept.id} />

      {/* Linked 3D Instruments & Interactive Physics Simulations */}
      {concept.linkedInstruments && concept.linkedInstruments.length > 0 && (
        <section className="sub space-y-2.5 border-[color-mix(in_srgb,var(--st-accent)_28%,transparent)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Box className="size-4 text-[var(--st-accent-text)]" />
              <h4 className="eyebrow">
                Interactive 3D &amp; Simulations
              </h4>
            </div>
            <Link to="/browse" className="text-[14px] text-[var(--st-on-var)] hover:text-[var(--st-accent-text)]">
              Browse instruments →
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {concept.linkedInstruments.map((ref) => {
              const canonical = getCanonicalInstrument(ref.id);
              const hasSim = canonical?.hasSimulation ?? ref.hasSimulation;
              return (
                <div
                  key={ref.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[var(--st-on)]">
                      {ref.label}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {canonical?.hasDedicated3D !== false && (
                      <Link
                        to={getCanonicalInstrumentUrl(ref.id, '3d')}
                        className="rounded-lg border border-[var(--st-accent)]/40 bg-[var(--st-accent)]/10 px-2.5 py-1 text-[14px] font-semibold text-[var(--st-accent-text)] transition hover:bg-[var(--st-accent)]/20"
                      >
                        <Box className="mr-1 inline size-3.5" />
                        3D
                      </Link>
                    )}
                    {hasSim && (
                      <Link
                        to={getCanonicalInstrumentUrl(ref.id, 'sim')}
                        className="rounded-lg border border-[var(--st-accent)]/40 bg-[var(--st-accent)]/10 px-2.5 py-1 text-[14px] font-semibold text-[var(--st-accent-text)] transition hover:bg-[var(--st-accent)]/20"
                      >
                        <Activity className="mr-1 inline size-3.5" />
                        Simulate
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Core Explanation & Working Principle */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="sub space-y-2 p-4 lg:col-span-3">
          <p className="eyebrow">Engineering Explanation</p>
          <p className="text-sm leading-relaxed text-[var(--st-on-var)]">{concept.explanation}</p>
        </div>
        <div className="sub flex flex-col justify-between space-y-3 p-4 lg:col-span-2">
          <div>
            <p className="eyebrow">Core Working Principle</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--st-on)]">
              {concept.workingPrinciple}
            </p>
          </div>
          {concept.comparison && (
            <div className="border-t border-[var(--st-line)] pt-3">
              <p className="text-[14px] font-semibold text-[var(--st-accent-text)]">
                Comparison · {concept.comparison.peer}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--st-on-var)]">
                {concept.comparison.takeaway}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mathematical Equations */}
      {concept.equations && concept.equations.length > 0 && (
        <section className="sub space-y-3 p-4">
          <div className="flex items-center gap-2">
            <Sigma className="size-4 text-[var(--st-accent-text)]" />
            <h4 className="eyebrow">Key Mathematical Equations</h4>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {concept.equations.map((eq) => (
              <div
                key={eq.label}
                className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5"
              >
                <p className="label mb-2">{eq.label}</p>
                <div className="overflow-x-auto py-1 text-[var(--st-on)]">
                  <MathBlock latex={eq.latex} displayMode />
                </div>
                {eq.notes && (
                  <p className="mt-1.5 text-[14px] text-[var(--st-outline)]">{eq.notes}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Algorithm Flowchart, Pseudocode & Convergence Error Analysis */}
      {concept.algorithm && (
        <section className="sub space-y-3 p-4">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-[var(--st-accent-text)]" />
            <h4 className="eyebrow">Algorithm, Pseudocode &amp; Error / Convergence</h4>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {concept.algorithm.flowchartMermaid && (
              <MermaidDiagram title="Algorithm Flowchart" code={concept.algorithm.flowchartMermaid} />
            )}
            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5">
                <p className="label mb-2">Structured Pseudocode</p>
                <ol className="code-mono space-y-1 text-[14px] text-[var(--st-on)]">
                  {concept.algorithm.pseudocode.map((line, i) => (
                    <li key={i} className="leading-relaxed">
                      <span className="mr-2 text-[var(--st-outline)]">{i + 1}.</span>
                      {line}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5">
                <p className="label mb-1">Convergence &amp; Error Bound</p>
                <p className="text-[14px] leading-relaxed text-[var(--st-on-var)]">
                  {concept.algorithm.convergenceAndError}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Block / Optical / Loop Mermaid Diagram */}
      {concept.mermaidDiagram && (
        <MermaidDiagram title="Architecture & Signal Flow Diagram" code={concept.mermaidDiagram} />
      )}

      {/* Advantages & Limitations if present */}
      {(concept.advantages?.length || concept.limitations?.length) && (
        <div className="grid gap-3 md:grid-cols-2">
          {concept.advantages && concept.advantages.length > 0 && (
            <div className="sub p-4">
              <p className="eyebrow mb-2 text-[var(--st-accent-text)]">Advantages</p>
              <ul className="space-y-1.5 text-[14px] text-[var(--st-on-var)]">
                {concept.advantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--st-accent-text)]" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {concept.limitations && concept.limitations.length > 0 && (
            <div className="sub p-4">
              <p className="eyebrow mb-2 text-[var(--st-amber)]">Limitations</p>
              <ul className="space-y-1.5 text-[14px] text-[var(--st-on-var)]">
                {concept.limitations.map((lim) => (
                  <li key={lim} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--st-amber)]" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* WHERE IS THIS USED IN THE REAL WORLD? */}
      <section className="rounded-2xl border border-[var(--st-accent)]/30 bg-[var(--st-1)] p-4">
        <div className="flex items-center gap-2">
          <Factory className="size-4 text-[var(--st-accent-text)]" />
          <h4 className="eyebrow">Where Is This Used In The Real World?</h4>
        </div>
        <p className="mt-2 text-[16px] text-[var(--st-on)]">{concept.realWorldApplications.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {concept.realWorldApplications.industries.map((ind) => (
            <span
              key={ind}
              className="rounded-full border border-[var(--st-line)] bg-[var(--st-2)] px-2.5 py-0.5 text-[14px] text-[var(--st-on-var)]"
            >
              {ind}
            </span>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-[14px] text-[var(--st-on-var)]">
          {concept.realWorldApplications.examples.map((ex) => (
            <li key={ex} className="flex items-start gap-2">
              <Cpu className="mt-0.5 size-3.5 shrink-0 text-[var(--st-accent-text)]" />
              <span>{ex}</span>
            </li>
          ))}
        </ul>
        {concept.realWorldApplications.companyContexts && (
          <p className="mt-2.5 border-t border-[var(--st-line)] pt-2 text-[14px] text-[var(--st-outline)]">
            <span className="font-semibold text-[var(--st-on-var)]">Industrial Contexts: </span>
            {concept.realWorldApplications.companyContexts}
          </p>
        )}
      </section>

      {/* Troubleshooting Notes if present */}
      {concept.troubleshooting && concept.troubleshooting.length > 0 && (
        <section className="sub p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wrench className="size-4 text-[var(--st-amber)]" />
            <h4 className="eyebrow">Field Diagnostics &amp; Troubleshooting</h4>
          </div>
          <ul className="space-y-1.5 text-[14px] text-[var(--st-on-var)]">
            {concept.troubleshooting.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--st-amber)]" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Solved Numericals */}
      {concept.numericals && concept.numericals.length > 0 && (
        <section className="sub space-y-2.5 p-4">
          <h4 className="eyebrow">Solved Engineering Numericals</h4>
          {concept.numericals.map((num, idx) => {
            const open = revealedNumIdx[idx] ?? false;
            return (
              <div
                key={num.title}
                className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setRevealedNumIdx((prev) => ({ ...prev, [idx]: !open }))
                  }
                  className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-left"
                >
                  <div>
                    <p className="text-[16px] font-semibold text-[var(--st-on)]">{num.title}</p>
                    <p className="mt-0.5 text-[14px] text-[var(--st-on-var)]">{num.problem}</p>
                  </div>
                  {open ? (
                    <ChevronDown className="size-4 shrink-0 text-[var(--st-outline)]" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-[var(--st-outline)]" />
                  )}
                </button>
                {open && (
                  <div className="space-y-1.5 border-t border-[var(--st-line)] px-3.5 py-3 text-[14px]">
                    {num.steps.map((s, sIdx) => (
                      <p key={sIdx} className="text-[var(--st-on-var)]">
                        <span className="mr-2 text-[var(--st-accent-text)]">Step {sIdx + 1}:</span>
                        {s}
                      </p>
                    ))}
                    <p className="pt-1 font-semibold text-[var(--st-accent-text)]">
                      Final Result: {num.result}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Concept Interview Questions */}
      {concept.interviewItems && concept.interviewItems.length > 0 && (
        <section className="sub space-y-2.5 p-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-4 text-[var(--st-accent-text)]" />
            <h4 className="eyebrow">Interview Questions &amp; Follow-Ups</h4>
          </div>
          {concept.interviewItems.map((qa, idx) => {
            const showAns = revealedQA[idx] ?? false;
            const showFollow = revealedFollowUp[idx] ?? false;
            return (
              <div
                key={qa.question}
                className="space-y-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-[var(--st-line)] px-2 py-0.5 text-[14px] text-[var(--st-accent-text)]">
                    {qa.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealedQA((prev) => ({ ...prev, [idx]: !showAns }))}
                    className="btn py-1! text-[14px]!"
                  >
                    {showAns ? 'Hide Answer' : 'Show answer'}
                  </button>
                </div>
                <p className="text-[16px] font-semibold text-[var(--st-on)]">{qa.question}</p>
                {showAns && (
                  <div className="space-y-2 border-t border-[var(--st-line)] pt-2 text-[14px] text-[var(--st-on-var)]">
                    <p className="leading-relaxed">{qa.answer}</p>
                    {qa.followUpQuestion && (
                      <div className="rounded-lg border border-[var(--st-line)] bg-[var(--st-2)] p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-[var(--st-on)]">
                            Interviewer Follow-Up: {qa.followUpQuestion}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedFollowUp((prev) => ({ ...prev, [idx]: !showFollow }))
                            }
                            className="btn py-1! text-[14px]!"
                          >
                            {showFollow ? 'Hide' : 'Hint'}
                          </button>
                        </div>
                        {showFollow && qa.followUpAnswer && (
                          <p className="mt-1.5 text-[var(--st-accent-text)]">{qa.followUpAnswer}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Cross-Semester Connections */}
      {concept.crossLinks && concept.crossLinks.length > 0 && (
        <section className="sub space-y-2.5 p-4">
          <div className="flex items-center gap-2">
            <GitBranch className="size-4 text-[var(--st-accent-text)]" />
            <h4 className="eyebrow">How This Connects Across Semesters</h4>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {concept.crossLinks.map((cl) => (
              <button
                key={cl.targetSubjectId + cl.label}
                type="button"
                onClick={() => onNavigateSubject(cl.targetSubjectId)}
                className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 text-left transition hover:border-[var(--st-accent)]/50"
              >
                <div>
                  <p className="text-[14px] font-semibold text-[var(--st-on)]">{cl.label}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--st-on-var)]">
                    {cl.note}
                  </p>
                </div>
                <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-[var(--st-accent-text)]" />
              </button>
            ))}
          </div>
          <p className="text-[14px] text-[var(--st-outline)]">
            Active Track: Sem {numericSem} · {subject.name}
          </p>
        </section>
      )}
    </article>
  );
}

