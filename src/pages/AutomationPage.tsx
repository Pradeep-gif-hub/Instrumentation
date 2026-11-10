import { CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LadderSimulator } from '@/components/LadderSimulator';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { AUTOMATION_MODULES, type AutomationSectionId } from '@/data/automationData';

export function AutomationPage() {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  const activeId: AutomationSectionId =
    AUTOMATION_MODULES.find((m) => m.id === section)?.id ?? 'plc';
  const activeModule = AUTOMATION_MODULES.find((m) => m.id === activeId) ?? AUTOMATION_MODULES[0];

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-[var(--st-cyan)]">{activeModule.standard}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)]">
            Industrial Automation &amp; Control Engineering
          </h1>
          <p className="muted mt-1 max-w-3xl text-sm">{activeModule.subtitle}</p>
        </div>
      </header>

      {/* Segmented Module Switcher */}
      <div className="seg" role="tablist" aria-label="Automation modules">
        {AUTOMATION_MODULES.map((mod) => (
          <button
            key={mod.id}
            type="button"
            role="tab"
            aria-selected={mod.id === activeId}
            onClick={() => navigate(`/automation/${mod.id}`)}
            className={mod.id === activeId ? 'on' : ''}
          >
            {mod.shortTitle}
          </button>
        ))}
      </div>

      {/* Interactive PLC Ladder Logic Simulator on PLC tab */}
      {activeId === 'plc' && <LadderSimulator />}

      {/* Architecture Mermaid Diagram */}
      <section className="glass p-5">
        <MermaidDiagram title={activeModule.mermaidTitle} code={activeModule.mermaidCode} />
      </section>

      {/* Deep Engineering Blocks */}
      <div className="grid gap-4 lg:grid-cols-2">
        {activeModule.blocks.map((block) => (
          <section key={block.title} className="glass space-y-3 p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="eyebrow text-[var(--st-cyan)]">{block.tag}</span>
            </div>
            <h2 className="text-lg font-semibold text-[var(--st-on)]">{block.title}</h2>
            <p className="text-xs leading-relaxed text-[var(--st-on-var)]">{block.summary}</p>

            <ul className="space-y-2 pt-1">
              {block.keyPoints.map((pt) => (
                <li key={pt} className="sub flex items-start gap-2.5 p-3 text-xs text-[var(--st-on)]">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[var(--st-phosphor)]" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>

            {block.table && (
              <div className="tech-table-wrap mt-3">
                <table className="tech-table">
                  <thead>
                    <tr>
                      {block.table.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.table.rows.map((row, idx) => (
                      <tr key={idx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={cIdx === 0 ? 'font-semibold text-[var(--st-cyan)]' : 'text-xs'}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

