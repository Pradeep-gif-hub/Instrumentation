import { ArrowRight, Factory, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DISTILLATION_PID_TAGS, PLANT_CASE_STUDIES } from '@/data/applicationsData';

export function ApplicationsPage() {
  const [selectedTag, setSelectedTag] = useState(DISTILLATION_PID_TAGS[0]);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header>
        <p className="eyebrow text-[var(--st-cyan)]">ISA-5.1 P&amp;ID SYMBOLOGY · HAZARDOUS ZONES · PLANT LOOPS</p>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--st-on)]">
          Industrial Applications &amp; Plant Loop Engineering
        </h1>
        <p className="muted mt-1 max-w-3xl text-sm">
          Interactive distillation column P&amp;ID explorer separating Basic Process Control (BPCS) from Safety Instrumented Systems (SIS), alongside cross-sector industrial control loops and Ex hazardous protection rules.
        </p>
      </header>

      {/* Interactive P&ID Distillation Loop Explorer */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="glass stage relative overflow-hidden p-5">
          <div className="stage-grid pointer-events-none absolute inset-0" />
          <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="eyebrow">INTERACTIVE ISA-5.1 P&amp;ID SCHEMATIC</p>
              <h2 className="text-base font-semibold text-[var(--st-on)]">
                Distillation Column Feed, Tray Temp Cascade &amp; SIS Shutdown
              </h2>
            </div>
            <span className="pill mono text-[10px]">Click any tag bubble to inspect</span>
          </div>

          <div className="relative z-10 rounded-2xl border border-[var(--st-line)] bg-[var(--st-0)]/80 p-3">
            <svg viewBox="0 0 740 440" className="h-auto w-full" role="img" aria-label="Distillation Column P&ID">
              {/* Distillation Tower Vessel */}
              <rect x="350" y="95" width="110" height="275" rx="45" fill="var(--st-1)" stroke="var(--st-edge)" strokeWidth="2.5" />
              <text x="405" y="240" textAnchor="middle" fill="var(--st-outline)" fontSize="11" fontFamily="JetBrains Mono">COLUMN C-101</text>
              {/* Trays */}
              {[155, 195, 235, 275, 315].map((ty) => (
                <line key={ty} x1="358" y1={ty} x2="452" y2={ty} stroke="var(--st-line)" strokeWidth="1.5" strokeDasharray="6 4" />
              ))}

              {/* Feed Pipe */}
              <line x1="40" y1="280" x2="350" y2="280" stroke="var(--st-on-var)" strokeWidth="3" />
              <text x="55" y="268" fill="var(--st-on-var)" fontSize="10" fontFamily="JetBrains Mono">PROCESS FEED</text>

              {/* Overhead Vapor Pipe */}
              <path d="M 405 95 L 405 40 L 620 40" fill="none" stroke="var(--st-on-var)" strokeWidth="2.5" />
              <text x="540" y="32" fill="var(--st-on-var)" fontSize="10" fontFamily="JetBrains Mono">OVERHEAD VAPOR</text>

              {/* Bottom Reboiler Steam Loop */}
              <path d="M 240 380 L 405 380 L 405 370" fill="none" stroke="var(--st-amber)" strokeWidth="2.5" />
              <text x="255" y="405" fill="var(--st-amber)" fontSize="10" fontFamily="JetBrains Mono">HP REBOILER STEAM</text>

              {/* Signal Lines (4-20 mA dashed / pneumatic / DCS) */}
              <line x1="135" y1="235" x2="135" y2="120" stroke="var(--st-cyan)" strokeDasharray="5 4" strokeWidth="1.5" />
              <line x1="135" y1="120" x2="225" y2="120" stroke="var(--st-cyan)" strokeDasharray="5 4" strokeWidth="1.5" />
              <line x1="225" y1="120" x2="225" y2="265" stroke="var(--st-cyan)" strokeDasharray="5 4" strokeWidth="1.5" />
              <line x1="470" y1="195" x2="615" y2="195" stroke="var(--st-iris)" strokeDasharray="5 4" strokeWidth="1.5" />
              <line x1="615" y1="195" x2="615" y2="120" stroke="var(--st-iris)" strokeDasharray="5 4" strokeWidth="1.5" />
              <line x1="405" y1="78" x2="310" y2="78" stroke="var(--st-crimson)" strokeDasharray="3 3" strokeWidth="1.5" />
              <line x1="310" y1="78" x2="310" y2="365" stroke="var(--st-crimson)" strokeDasharray="3 3" strokeWidth="1.5" />

              {/* Interactive Tag Bubbles */}
              {DISTILLATION_PID_TAGS.map((node) => {
                const isSel = selectedTag.tag === node.tag;
                const strokeColor =
                  node.kind === 'sis'
                    ? 'var(--st-crimson)'
                    : node.kind === 'dcs'
                    ? 'var(--st-iris)'
                    : node.kind === 'valve'
                    ? 'var(--st-amber)'
                    : 'var(--st-cyan)';

                return (
                  <g
                    key={node.tag}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedTag(node)}
                    className="cursor-pointer"
                  >
                    {node.kind === 'dcs' ? (
                      <g>
                        <rect
                          x="-28"
                          y="-22"
                          width="56"
                          height="44"
                          rx="6"
                          fill={isSel ? 'var(--st-3)' : 'var(--st-1)'}
                          stroke={strokeColor}
                          strokeWidth={isSel ? '3' : '2'}
                        />
                        <circle cx="0" cy="0" r="19" fill="none" stroke={strokeColor} strokeWidth="1.4" />
                        <line x1="-19" y1="0" x2="19" y2="0" stroke={strokeColor} strokeWidth="1.2" />
                      </g>
                    ) : node.kind === 'sis' ? (
                      <polygon
                        points="0,-25 28,0 0,25 -28,0"
                        fill={isSel ? 'var(--st-3)' : 'var(--st-1)'}
                        stroke={strokeColor}
                        strokeWidth={isSel ? '3' : '2'}
                      />
                    ) : (
                      <circle
                        cx="0"
                        cy="0"
                        r="23"
                        fill={isSel ? 'var(--st-3)' : 'var(--st-1)'}
                        stroke={strokeColor}
                        strokeWidth={isSel ? '3' : '2'}
                      />
                    )}
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="var(--st-on)"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="JetBrains Mono"
                    >
                      {node.tag}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Tag Inspector */}
        <aside className="glass flex flex-col justify-between gap-4 p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[var(--st-cyan)]">SELECTED ISA-5.1 TAG</span>
              <span
                className="status"
                style={{
                  '--tone':
                    selectedTag.kind === 'sis'
                      ? 'var(--st-crimson)'
                      : selectedTag.kind === 'dcs'
                      ? 'var(--st-iris)'
                      : 'var(--st-cyan)',
                } as React.CSSProperties}
              >
                {selectedTag.kind.toUpperCase()}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-[var(--st-on)]">
              <span className="mono mr-2 text-[var(--st-cyan)]">{selectedTag.tag}</span>
              {selectedTag.title}
            </h3>

            <div className="sub space-y-2 p-3.5 text-xs">
              <div>
                <span className="eyebrow">ISA-5.1 TAG DECODING</span>
                <p className="mt-1 text-[var(--st-on)]">{selectedTag.isaDecode}</p>
              </div>
              <div className="border-t border-[var(--st-line)] pt-2">
                <span className="eyebrow">HARDWARE / ELEMENT</span>
                <p className="mt-1 text-[var(--st-on-var)]">{selectedTag.instrumentType}</p>
              </div>
              <div className="border-t border-[var(--st-line)] pt-2">
                <span className="eyebrow">SIGNAL INTERFACE</span>
                <p className="mono mt-1 text-[11px] text-[var(--st-cyan)]">{selectedTag.signal}</p>
              </div>
              <div className="border-t border-[var(--st-line)] pt-2">
                <span className="eyebrow">RANGE / FAIL-SAFE SPEC</span>
                <p className="mt-1 text-[var(--st-on)]">{selectedTag.failSafeOrRange}</p>
              </div>
            </div>
          </div>

          {selectedTag.route && (
            <Link to={selectedTag.route} className="btn primary w-full justify-between">
              <span>Inspect Instrument Module</span>
              <ArrowRight className="size-4" />
            </Link>
          )}
        </aside>
      </section>

      {/* Sector Case Studies */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Factory className="size-4 text-[var(--st-cyan)]" />
          <p className="eyebrow">CROSS-INDUSTRY PROCESS CONTROL CASE STUDIES</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {PLANT_CASE_STUDIES.map((cs) => (
            <article key={cs.loopName} className="glass space-y-3 p-5">
              <span className="eyebrow text-[var(--st-cyan)]">{cs.sector}</span>
              <h3 className="text-base font-semibold text-[var(--st-on)]">{cs.loopName}</h3>
              <p className="text-xs leading-relaxed text-[var(--st-on-var)]">{cs.architecture}</p>
              <div className="flex flex-wrap gap-1.5">
                {cs.keyInstruments.map((inst) => (
                  <span key={inst} className="pill text-[11px]">{inst}</span>
                ))}
              </div>
              <p className="sub p-3 text-xs text-[var(--st-amber)]">
                Critical Rule: {cs.criticalEngineeringRule}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Hazardous Area Classification & SIL Summary */}
      <section className="glass space-y-3 p-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-[var(--st-crimson)]" />
          <p className="eyebrow text-[var(--st-crimson)]">HAZARDOUS AREA (IEC 60079) &amp; SAFETY SYSTEMS (IEC 61511)</p>
        </div>
        <div className="tech-table-wrap">
          <table className="tech-table">
            <thead>
              <tr>
                <th>Zone / Class</th>
                <th>Explosive Gas Presence</th>
                <th>Allowed Protection Concept</th>
                <th>Typical Field Practice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono font-semibold text-[var(--st-crimson)]">Zone 0 (Class I Div 1)</td>
                <td>Continuous / long-term presence (&gt;1000 h/yr)</td>
                <td className="mono text-xs text-[var(--st-cyan)]">Ex ia Intrinsic Safety ONLY</td>
                <td>Inside crude tank vapor space (radar/RTD via galvanic IS barrier)</td>
              </tr>
              <tr>
                <td className="mono font-semibold text-[var(--st-amber)]">Zone 1 (Class I Div 1)</td>
                <td>Likely during normal operation (10–1000 h/yr)</td>
                <td className="mono text-xs">Ex ia / Ex ib / Ex d (Flameproof) / Ex p</td>
                <td>Process pump seals, vents; heavy cast Ex d housings or IS loops</td>
              </tr>
              <tr>
                <td className="mono font-semibold text-[var(--st-phosphor)]">Zone 2 (Class I Div 2)</td>
                <td>Abnormal only / short duration (&lt;10 h/yr)</td>
                <td className="mono text-xs">Ex nA / Ex ec (Non-sparking) / Ex d / Ex ia</td>
                <td>Open refinery pipe racks and outdoor tank dyke areas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

