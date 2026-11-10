import type { SchematicKind } from '@/types/engineering';

export function EngineeringSchematic({ kind, title }: { kind: SchematicKind; title: string }) {
  return (
    <div className="glass stage relative overflow-hidden p-5">
      <div className="stage-grid pointer-events-none absolute inset-0" />
      <div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="eyebrow">ENGINEERING VECTOR SCHEMATIC</p>
          <p className="text-sm font-medium text-[var(--st-on)]">{title}</p>
        </div>
        <span className="pill mono text-[10px] uppercase">{kind}</span>
      </div>

      <div className="relative z-10 flex items-center justify-center rounded-2xl border border-[var(--st-line)] bg-[var(--st-0)]/75 p-4">
        <svg viewBox="0 0 760 280" className="h-auto w-full max-w-[740px]" role="img" aria-label={`${title} engineering schematic`}>
          <defs>
            <marker id="arrowAccent" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="var(--st-accent)" />
            </marker>
            <marker id="arrowMuted" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="var(--st-on-var)" />
            </marker>
          </defs>

          {kind === 'rtd-3wire' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              {/* Platinum RTD Sensor */}
              <rect x="40" y="65" width="150" height="150" rx="14" stroke="var(--st-edge)" fill="var(--st-1)" />
              <text x="115" y="90" textAnchor="middle" fill="var(--st-outline)" stroke="none">Pt100 (IEC 60751)</text>
              <path d="M 95 140 L 105 120 L 115 160 L 125 120 L 135 160 L 145 140" stroke="var(--st-accent)" strokeWidth="2.5" />
              <text x="115" y="185" textAnchor="middle" fill="var(--st-on)" stroke="none">R_RTD (100Ω @ 0°C)</text>

              {/* 3 Lead Wires */}
              <line x1="145" y1="140" x2="360" y2="90" stroke="var(--st-crimson)" />
              <text x="255" y="102" textAnchor="middle" fill="var(--st-crimson)" stroke="none">Lead L1 (Red) · R_L</text>
              <line x1="145" y1="140" x2="360" y2="140" stroke="var(--st-crimson)" strokeDasharray="5 3" />
              <text x="255" y="133" textAnchor="middle" fill="var(--st-crimson)" stroke="none">Lead L2 (Red Common) · R_L</text>
              <line x1="95" y1="140" x2="360" y2="195" stroke="var(--st-on)" />
              <text x="255" y="190" textAnchor="middle" fill="var(--st-on)" stroke="none">Lead L3 (White) · Sense</text>

              {/* Bridge Cancellation Block */}
              <rect x="360" y="55" width="350" height="175" rx="14" stroke="var(--st-edge)" fill="var(--st-1)" />
              <text x="535" y="80" textAnchor="middle" fill="var(--st-outline)" stroke="none">3-WIRE KELVIN BRIDGE COMPENSATION</text>
              <rect x="410" y="105" width="90" height="36" rx="8" stroke="var(--st-accent)" fill="var(--st-2)" />
              <text x="455" y="127" textAnchor="middle" fill="var(--st-on)" stroke="none">Arm A: R_ref</text>
              <rect x="410" y="158" width="90" height="36" rx="8" stroke="var(--st-accent)" fill="var(--st-2)" />
              <text x="455" y="180" textAnchor="middle" fill="var(--st-on)" stroke="none">Arm B: R_RTD+L1</text>
              <rect x="545" y="128" width="135" height="44" rx="8" stroke="var(--st-iris)" fill="var(--st-2)" />
              <text x="612" y="147" textAnchor="middle" fill="var(--st-iris)" stroke="none">V_diff ∝ R_RTD</text>
              <text x="612" y="163" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="9.5">(L1 − L2 = 0 Ω error)</text>
              <line x1="500" y1="123" x2="545" y2="145" stroke="var(--st-on-var)" markerEnd="url(#arrowMuted)" />
              <line x1="500" y1="176" x2="545" y2="155" stroke="var(--st-on-var)" markerEnd="url(#arrowMuted)" />
            </g>
          )}

          {kind === 'thermocouple-cjc' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <circle cx="85" cy="140" r="14" stroke="var(--st-amber)" fill="var(--st-2)" />
              <text x="85" y="175" textAnchor="middle" fill="var(--st-amber)" stroke="none">Hot Junction (T_m)</text>
              <line x1="99" y1="133" x2="340" y2="95" stroke="var(--st-accent)" strokeWidth="2.5" />
              <text x="220" y="96" textAnchor="middle" fill="var(--st-accent)" stroke="none">Chromel (+) / KX+</text>
              <line x1="99" y1="147" x2="340" y2="185" stroke="var(--st-iris)" strokeWidth="2.5" />
              <text x="220" y="188" textAnchor="middle" fill="var(--st-iris)" stroke="none">Alumel (−) / KX−</text>

              <rect x="340" y="65" width="145" height="150" rx="14" stroke="var(--st-edge)" fill="var(--st-1)" />
              <text x="412" y="88" textAnchor="middle" fill="var(--st-outline)" stroke="none">ISOTHERMAL CJC</text>
              <rect x="368" y="114" width="88" height="48" rx="8" stroke="var(--st-accent)" fill="var(--st-2)" />
              <text x="412" y="135" textAnchor="middle" fill="var(--st-accent)" stroke="none">Onboard RTD</text>
              <text x="412" y="151" textAnchor="middle" fill="var(--st-on)" stroke="none">Reads T_cj</text>

              <line x1="485" y1="140" x2="535" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />
              <rect x="540" y="75" width="180" height="130" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="630" y="108" textAnchor="middle" fill="var(--st-on)" stroke="none">ITS-90 Look-Up</text>
              <text x="630" y="135" textAnchor="middle" fill="var(--st-accent)" stroke="none">E_tot = E_mV + E(T_cj)</text>
              <text x="630" y="160" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">Outputs 4–20 mA / HART</text>
            </g>
          )}

          {kind === 'dp-transmitter' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <rect x="50" y="70" width="170" height="50" rx="10" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="135" y="100" textAnchor="middle" fill="var(--st-accent)" stroke="none">HIGH PORT (P_H)</text>
              <rect x="50" y="165" width="170" height="50" rx="10" stroke="var(--st-iris)" fill="var(--st-1)" />
              <text x="135" y="195" textAnchor="middle" fill="var(--st-iris)" stroke="none">LOW PORT (P_L)</text>

              {/* 3-Valve Manifold */}
              <rect x="255" y="65" width="145" height="155" rx="14" stroke="var(--st-edge)" fill="var(--st-2)" />
              <text x="327" y="88" textAnchor="middle" fill="var(--st-outline)" stroke="none">3-VALVE MANIFOLD</text>
              <line x1="220" y1="95" x2="435" y2="95" stroke="var(--st-accent)" />
              <line x1="220" y1="190" x2="435" y2="190" stroke="var(--st-iris)" />
              <line x1="327" y1="95" x2="327" y2="190" stroke="var(--st-amber)" strokeDasharray="4 3" />
              <circle cx="290" cy="95" r="8" fill="var(--st-1)" stroke="var(--st-accent)" />
              <circle cx="290" cy="190" r="8" fill="var(--st-1)" stroke="var(--st-iris)" />
              <circle cx="327" cy="142" r="9" fill="var(--st-1)" stroke="var(--st-amber)" />
              <text x="365" y="146" fill="var(--st-amber)" stroke="none" fontSize="10">EQUALIZE</text>

              {/* Sensor Capsule + Electronics */}
              <rect x="435" y="65" width="275" height="155" rx="14" stroke="var(--st-edge)" fill="var(--st-1)" />
              <text x="572" y="92" textAnchor="middle" fill="var(--st-on)" stroke="none">DIFF CAPACITANCE / RESONANT</text>
              <rect x="465" y="112" width="215" height="44" rx="8" stroke="var(--st-accent)" fill="var(--st-2)" />
              <text x="572" y="138" textAnchor="middle" fill="var(--st-accent)" stroke="none">ΔP = (C_L−C_H)/(C_L+C_H)</text>
              <text x="572" y="192" textAnchor="middle" fill="var(--st-accent)" stroke="none">24-bit ADC → 4–20 mA + HART</text>
            </g>
          )}

          {kind === 'orifice-flow' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              {/* Pipe */}
              <line x1="40" y1="80" x2="720" y2="80" stroke="var(--st-edge)" strokeWidth="3" />
              <line x1="40" y1="200" x2="720" y2="200" stroke="var(--st-edge)" strokeWidth="3" />
              {/* Orifice Plate */}
              <rect x="330" y="68" width="12" height="52" fill="var(--st-accent)" stroke="var(--st-accent)" />
              <rect x="330" y="160" width="12" height="52" fill="var(--st-accent)" stroke="var(--st-accent)" />
              <text x="336" y="54" textAnchor="middle" fill="var(--st-accent)" stroke="none">Orifice (90° Inlet · 45° Bevel)</text>
              {/* Streamlines & Vena Contracta */}
              <path d="M 80 105 C 240 105, 310 124, 390 124 C 460 124, 530 105, 680 105" stroke="var(--st-iris)" strokeDasharray="6 4" markerEnd="url(#arrowMuted)" />
              <path d="M 80 175 C 240 175, 310 156, 390 156 C 460 156, 530 175, 680 175" stroke="var(--st-iris)" strokeDasharray="6 4" markerEnd="url(#arrowMuted)" />
              <text x="395" y="144" textAnchor="middle" fill="var(--st-on)" stroke="none" fontSize="10">Vena Contracta (~0.5D)</text>
              {/* Taps */}
              <line x1="280" y1="80" x2="280" y2="245" stroke="var(--st-accent)" />
              <line x1="395" y1="200" x2="395" y2="245" stroke="var(--st-amber)" />
              <text x="245" y="248" textAnchor="end" fill="var(--st-accent)" stroke="none">P₁ (High Tap)</text>
              <text x="425" y="248" textAnchor="start" fill="var(--st-amber)" stroke="none">P₂ (Low Tap) → Q ∝ √(P₁ − P₂)</text>
            </g>
          )}

          {kind === 'control-valve-loop' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <rect x="40" y="95" width="135" height="90" rx="12" stroke="var(--st-edge)" fill="var(--st-1)" />
              <text x="107" y="130" textAnchor="middle" fill="var(--st-on)" stroke="none">DCS PID</text>
              <text x="107" y="152" textAnchor="middle" fill="var(--st-accent)" stroke="none">4–20 mA AO</text>

              <line x1="175" y1="140" x2="245" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="250" y="90" width="175" height="100" rx="12" stroke="var(--st-iris)" fill="var(--st-1)" />
              <text x="337" y="122" textAnchor="middle" fill="var(--st-iris)" stroke="none">Smart Positioner</text>
              <text x="337" y="143" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">I/P + Stem Feedback</text>
              <text x="337" y="165" textAnchor="middle" fill="var(--st-amber)" stroke="none">0.2–1.0 bar Air</text>

              <line x1="425" y1="140" x2="495" y2="140" stroke="var(--st-amber)" markerEnd="url(#arrowMuted)" />

              <rect x="500" y="75" width="210" height="130" rx="12" stroke="var(--st-edge)" fill="var(--st-1)" />
              <text x="605" y="105" textAnchor="middle" fill="var(--st-on)" stroke="none">Diaphragm Actuator</text>
              <text x="605" y="130" textAnchor="middle" fill="var(--st-accent)" stroke="none">+ Contoured Trim</text>
              <text x="605" y="155" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">ATO (FC) or ATC (FO)</text>
              <text x="605" y="177" textAnchor="middle" fill="var(--st-accent)" stroke="none">Q = Cv √(ΔP/SG)</text>
            </g>
          )}

          {kind === 'loop-4-20ma' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <rect x="45" y="80" width="150" height="115" rx="14" stroke="var(--st-amber)" fill="var(--st-1)" />
              <text x="120" y="112" textAnchor="middle" fill="var(--st-amber)" stroke="none">24 VDC PSU</text>
              <text x="120" y="140" textAnchor="middle" fill="var(--st-on-var)" stroke="none">+ / − Loop Power</text>
              <text x="120" y="164" textAnchor="middle" fill="var(--st-on)" stroke="none">V_s ≥ V_min + I·R</text>

              <line x1="195" y1="108" x2="305" y2="108" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="310" y="75" width="175" height="125" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="397" y="106" textAnchor="middle" fill="var(--st-accent)" stroke="none">2-Wire Transmitter</text>
              <text x="397" y="132" textAnchor="middle" fill="var(--st-on)" stroke="none">Regulates 4–20 mA</text>
              <text x="397" y="154" textAnchor="middle" fill="var(--st-iris)" stroke="none">+ HART ±0.5 mA FSK</text>
              <text x="397" y="176" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="9.5">NE43: ≤3.6 / ≥21 mA Fault</text>

              <line x1="485" y1="108" x2="565" y2="108" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="570" y="75" width="145" height="125" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="642" y="108" textAnchor="middle" fill="var(--st-accent)" stroke="none">PLC / DCS AI</text>
              <text x="642" y="135" textAnchor="middle" fill="var(--st-on)" stroke="none">R = 250 Ω</text>
              <text x="642" y="160" textAnchor="middle" fill="var(--st-on-var)" stroke="none">1.00–5.00 VDC</text>
              <path d="M 642 200 L 642 232 L 120 232 L 120 195" stroke="var(--st-on-var)" markerEnd="url(#arrowMuted)" />
            </g>
          )}

          {kind === 'wheatstone-bridge' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <circle cx="240" cy="48" r="16" stroke="var(--st-amber)" fill="var(--st-1)" />
              <text x="240" y="52" textAnchor="middle" fill="var(--st-amber)" stroke="none">V_exc</text>
              <line x1="240" y1="64" x2="140" y2="140" stroke="var(--st-edge)" />
              <line x1="240" y1="64" x2="340" y2="140" stroke="var(--st-edge)" />
              <line x1="140" y1="140" x2="240" y2="216" stroke="var(--st-edge)" />
              <line x1="340" y1="140" x2="240" y2="216" stroke="var(--st-edge)" />
              <text x="165" y="96" fill="var(--st-on)" stroke="none">R₁</text>
              <text x="305" y="96" fill="var(--st-on)" stroke="none">R₃</text>
              <text x="165" y="192" fill="var(--st-on)" stroke="none">R₂</text>
              <text x="295" y="192" fill="var(--st-accent)" stroke="none">R_sensor ± ΔR</text>
              <line x1="240" y1="216" x2="240" y2="246" stroke="var(--st-on-var)" />
              <text x="240" y="262" textAnchor="middle" fill="var(--st-outline)" stroke="none">GND</text>

              <line x1="140" y1="140" x2="450" y2="115" stroke="var(--st-iris)" markerEnd="url(#arrowMuted)" />
              <line x1="340" y1="140" x2="450" y2="165" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <polygon points="455,80 455,200 575,140" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="500" y="144" textAnchor="middle" fill="var(--st-on)" stroke="none">3-OpAmp INA</text>
              <line x1="575" y1="140" x2="705" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />
              <text x="645" y="128" textAnchor="middle" fill="var(--st-accent)" stroke="none">G·(V+ − V−)</text>
              <text x="645" y="160" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">CMRR &gt; 100 dB</text>
            </g>
          )}

          {kind === 'level-dp' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <rect x="85" y="45" width="160" height="190" rx="22" stroke="var(--st-edge)" fill="var(--st-1)" />
              <rect x="89" y="125" width="152" height="106" rx="16" fill="var(--st-accent)" fillOpacity="0.16" stroke="none" />
              <line x1="89" y1="125" x2="241" y2="125" stroke="var(--st-accent)" />
              <text x="165" y="100" textAnchor="middle" fill="var(--st-outline)" stroke="none">Vapor Space P_g</text>
              <text x="165" y="182" textAnchor="middle" fill="var(--st-accent)" stroke="none">Liquid ρ·g·H</text>

              <line x1="245" y1="75" x2="430" y2="75" stroke="var(--st-iris)" />
              <line x1="430" y1="75" x2="430" y2="150" stroke="var(--st-iris)" />
              <text x="340" y="65" textAnchor="middle" fill="var(--st-iris)" stroke="none">Low Port (Dry or Wet Leg)</text>

              <line x1="245" y1="210" x2="430" y2="210" stroke="var(--st-accent)" />
              <text x="340" y="200" textAnchor="middle" fill="var(--st-accent)" stroke="none">High Port (Bottom Tap)</text>

              <rect x="430" y="130" width="260" height="105" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="560" y="162" textAnchor="middle" fill="var(--st-on)" stroke="none">Hydrostatic DP Transmitter</text>
              <text x="560" y="186" textAnchor="middle" fill="var(--st-accent)" stroke="none">ΔP = ρ_proc·g·h − ρ_seal·g·H_wet</text>
              <text x="560" y="210" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">Wet Leg: LRV &lt; 0 (Zero Elevation)</text>
            </g>
          )}

          {kind === 'ph-electrode' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <rect x="70" y="65" width="180" height="150" rx="14" stroke="var(--st-edge)" fill="var(--st-1)" />
              <circle cx="160" cy="180" r="22" stroke="var(--st-accent)" fill="var(--st-2)" />
              <text x="160" y="100" textAnchor="middle" fill="var(--st-on)" stroke="none">Glass pH Bulb</text>
              <text x="160" y="122" textAnchor="middle" fill="var(--st-iris)" stroke="none">+ Ag/AgCl Reference</text>
              <text x="160" y="144" textAnchor="middle" fill="var(--st-accent)" stroke="none">+ Pt1000 Temp Comp</text>

              <line x1="250" y1="140" x2="345" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="350" y="80" width="175" height="120" rx="14" stroke="var(--st-iris)" fill="var(--st-1)" />
              <text x="437" y="114" textAnchor="middle" fill="var(--st-iris)" stroke="none">Electrometer</text>
              <text x="437" y="138" textAnchor="middle" fill="var(--st-on)" stroke="none">Z_in &gt; 10¹² Ω</text>
              <text x="437" y="162" textAnchor="middle" fill="var(--st-on-var)" stroke="none">−59.16 mV/pH @ 25°C</text>

              <line x1="525" y1="140" x2="575" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="580" y="90" width="135" height="100" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="647" y="128" textAnchor="middle" fill="var(--st-accent)" stroke="none">Analyzer</text>
              <text x="647" y="152" textAnchor="middle" fill="var(--st-on)" stroke="none">0–14 pH</text>
              <text x="647" y="172" textAnchor="middle" fill="var(--st-on-var)" stroke="none">4–20 mA</text>
            </g>
          )}

          {kind === 'generic-transducer' && (
            <g strokeWidth="2" fill="none" fontFamily="JetBrains Mono, monospace" fontSize="11">
              <rect x="45" y="90" width="160" height="100" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="125" y="128" textAnchor="middle" fill="var(--st-accent)" stroke="none">Primary Element</text>
              <text x="125" y="152" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">Process Measurand</text>

              <line x1="205" y1="140" x2="275" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="280" y="90" width="190" height="100" rx="14" stroke="var(--st-iris)" fill="var(--st-1)" />
              <text x="375" y="128" textAnchor="middle" fill="var(--st-iris)" stroke="none">Signal Conditioning</text>
              <text x="375" y="152" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">Amplify · Filter · Linearize</text>

              <line x1="470" y1="140" x2="540" y2="140" stroke="var(--st-accent)" markerEnd="url(#arrowAccent)" />

              <rect x="545" y="90" width="170" height="100" rx="14" stroke="var(--st-accent)" fill="var(--st-1)" />
              <text x="630" y="128" textAnchor="middle" fill="var(--st-accent)" stroke="none">Transmitter Output</text>
              <text x="630" y="152" textAnchor="middle" fill="var(--st-on-var)" stroke="none" fontSize="10">4–20 mA / HART / Bus</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

