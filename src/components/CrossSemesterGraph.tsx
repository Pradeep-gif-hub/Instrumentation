import { ArrowRight, ArrowUpRight, GitBranch, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { CROSS_SEMESTER_PATHWAYS } from '@/data/curriculum';
import { MermaidDiagram } from './MermaidDiagram';

interface CrossSemesterGraphProps {
  onSelectSubject: (subjectId: string) => void;
}

const OVERVIEW_MERMAID = `flowchart LR
  S12["Sem I & II · Math, Physics, EME, Basic Elec, Python"] --> TSC["Sem III · ICDC0205 TSC"]
  S12 --> ADE["Sem III · ECDC0213 ADE"]
  S12 --> NM["Sem III · MCDC0203 Numerical"]
  S12 --> EMMI["Sem III · ICDC0203 EMMI"]
  S12 --> CT["Sem III · Circuit Theory"]
  TSC --> IMS["Sem IV · ICDC0208 IMS"]
  EMMI --> IMS
  ADE --> TSC
  CT --> CSE["Sem IV · ICDC0206 Control"]
  NM --> CSE
  CSE --> MCS["Sem V · ICDC0303 Modern Control"]
  CSE --> PDC["Sem V · ICDC0307 Process Control"]
  IMS --> AOI["Sem V · ICDC0305 Analytical & Optical"]
  EM["Sem IV · ICDC0202 Electrical Machines"] --> PDC
  IMS --> CAL["Supp · ICMI0303 Testing & Calibration"]`;

export function CrossSemesterGraph({ onSelectSubject }: CrossSemesterGraphProps) {
  const [activeId, setActiveId] = useState<string>(CROSS_SEMESTER_PATHWAYS[0].id);
  const [showInterviewAns, setShowInterviewAns] = useState<boolean>(false);

  const pathway =
    CROSS_SEMESTER_PATHWAYS.find((p) => p.id === activeId) ?? CROSS_SEMESTER_PATHWAYS[0];

  return (
    <div className="space-y-5">
      <div className="glass p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="eyebrow">LONGITUDINAL ENGINEERING ARCHITECTURE</p>
            <h3 className="mt-1 text-lg font-semibold text-[var(--st-on)]">
              Cross-Semester ICE Knowledge Graph
            </h3>
          </div>
          <span className="pill">Sem I–II → Sem III → Sem IV → Sem V → Calibration</span>
        </div>
        <MermaidDiagram
          title="Curriculum Dependency & Progression Map (NITJ ICE)"
          code={OVERVIEW_MERMAID}
        />
      </div>

      {/* 6 Interactive Pathway Selector + Detail */}
      <div className="glass space-y-5 p-5">
        <div className="flex items-center gap-2">
          <GitBranch className="size-4 text-[var(--st-cyan)]" />
          <p className="eyebrow">SELECT A CONCEPT PROGRESSION TRACK (6 CORE PATHWAYS)</p>
        </div>

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {CROSS_SEMESTER_PATHWAYS.map((p) => {
            const active = p.id === pathway.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActiveId(p.id);
                  setShowInterviewAns(false);
                }}
                className={`cursor-pointer rounded-2xl border p-3 text-left transition ${
                  active
                    ? 'border-[var(--st-cyan)] bg-[var(--st-3)] text-[var(--st-on)]'
                    : 'border-[var(--st-line)] bg-[var(--st-1)] text-[var(--st-on-var)] hover:bg-[var(--st-2)]'
                }`}
              >
                <p className="text-xs font-semibold">{p.title}</p>
                <p className="mono mt-1 text-[10px] text-[var(--st-outline)]">
                  {p.chain.length} semester stages · Click to trace
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Pathway Multi-Stage Chain */}
        <div className="sub space-y-4 p-4">
          <h4 className="text-base font-semibold text-[var(--st-on)]">{pathway.title}</h4>

          <div className="flex flex-wrap items-stretch gap-2">
            {pathway.chain.map((node, i) => (
              <div key={node.subjectId + i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectSubject(node.subjectId)}
                  className="group flex h-full min-w-[175px] max-w-[235px] cursor-pointer flex-col justify-between rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 text-left transition hover:border-[var(--st-cyan)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="mono text-[10px] font-semibold uppercase text-[var(--st-cyan)]">
                        {node.semesterLabel}
                      </span>
                      <ArrowUpRight className="size-3 text-[var(--st-outline)] group-hover:text-[var(--st-cyan)]" />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[var(--st-on)]">
                      {node.subjectName}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-snug text-[var(--st-on-var)]">
                    {node.concept}
                  </p>
                </button>
                {i < pathway.chain.length - 1 && (
                  <ArrowRight className="hidden size-4 shrink-0 text-[var(--st-outline)] sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5">
              <p className="label">Prerequisite Physics / Math Concept</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--st-on-var)]">
                {pathway.prerequisiteConcept}
              </p>
              <p className="label mt-3">Introduced &amp; Developed Across</p>
              <p className="mt-1 text-xs text-[var(--st-on)]">{pathway.introducedIn}</p>
              <p className="mt-0.5 text-xs text-[var(--st-cyan)]">→ {pathway.developedIn}</p>
            </div>
            <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5">
              <p className="label">Industrial Loop Execution</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--st-on-var)]">
                {pathway.industrialApplication}
              </p>
            </div>
          </div>

          {/* Pathway Synthesis Interview Question */}
          <div className="rounded-xl border border-[var(--st-lime)]/30 bg-[var(--st-1)] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="size-4 text-[var(--st-lime)]" />
                <span className="mono text-[11px] font-semibold uppercase text-[var(--st-lime)]">
                  Cross-Semester Placement Question
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowInterviewAns((s) => !s)}
                className="btn py-1! text-xs!"
              >
                {showInterviewAns ? 'Hide Answer' : 'Reveal Synthesis Answer'}
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-[var(--st-on)]">
              {pathway.interviewQuestion}
            </p>
            {showInterviewAns && (
              <p className="mt-2 border-t border-[var(--st-line)] pt-2 text-xs leading-relaxed text-[var(--st-on-var)]">
                {pathway.interviewAnswer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

