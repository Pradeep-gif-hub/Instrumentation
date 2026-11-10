import { Cpu, Play, RotateCcw, StepForward } from 'lucide-react';
import { useState } from 'react';

interface PinGroupInfo {
  name: string;
  pins: string;
  direction: string;
  role: string;
}

const PIN_GROUPS_8085: PinGroupInfo[] = [
  { name: 'AD0–AD7', pins: 'Pins 12–19', direction: 'Multiplexed In/Out', role: 'Carries lower 8 address bits A0–A7 during clock T1 (captured by external latch via ALE), then 8-bit data D0–D7 during T2–T3.' },
  { name: 'A8–A15', pins: 'Pins 21–28', direction: 'Output Only', role: 'Supplies upper byte of 16-bit memory address uninterrupted across machine cycles.' },
  { name: 'ALE, IO/M̄, RD̄, WR̄', pins: 'Pins 30, 34, 32, 31', direction: 'Control Output', role: 'ALE strobes A0–A7 latch; IO/M̄=0 selects Memory while 1 selects I/O port; RD̄/WR̄ strobe transfers active-low.' },
  { name: 'TRAP, RST7.5..INTR', pins: 'Pins 6–10', direction: 'Interrupt Inputs', role: 'TRAP (0024H) is highest-priority Non-Maskable shutdown line; RST7.5–5.5 are maskable vectored priorities; INTR needs external 8259.' },
  { name: 'HOLD, HLDA, X1/X2', pins: 'Pins 39, 38, 1–2', direction: 'DMA & Clock', role: 'DMA controller raises HOLD; CPU finishes current cycle, raises HLDA, and tri-states buses for high-speed memory writes.' },
];

interface Sim8085Program {
  id: string;
  title: string;
  lines: string[];
  exec: (step: number) => {
    pc: string;
    a: string;
    b: string;
    hl: string;
    sp: string;
    mem: string;
    flags: string;
    tStates: string;
    note: string;
  }[];
}

const SAMPLE_8085_PROGRAMS: Sim8085Program[] = [
  {
    id: 'add-store',
    title: 'Add Two Bytes & Store Result (25H + 14H -> 2050H)',
    lines: ['2000H: MVI A, 25H', '2002H: MVI B, 14H', '2004H: ADD B', '2005H: STA 2050H', '2008H: HLT'],
    exec: () => [
      { pc: '2002H', a: '25H', b: '00H', hl: '0000H', sp: '2400H', mem: '[2050H]=00H', flags: 'S=0 Z=0 AC=0 P=0 CY=0', tStates: '7T (Opcode Fetch + Mem Rd)', note: 'Loaded immediate constant 25H cleanly into Accumulator A.' },
      { pc: '2004H', a: '25H', b: '14H', hl: '0000H', sp: '2400H', mem: '[2050H]=00H', flags: 'S=0 Z=0 AC=0 P=0 CY=0', tStates: '7T (Opcode Fetch + Mem Rd)', note: 'Loaded 14H into Register B while A holds 25H.' },
      { pc: '2005H', a: '39H', b: '14H', hl: '0000H', sp: '2400H', mem: '[2050H]=00H', flags: 'S=0 Z=0 AC=0 P=1 CY=0', tStates: '4T (1 Machine Cycle)', note: 'ALU added A + B = 25H + 14H = 39H (Even parity P=1 set, Carry=0).' },
      { pc: '2008H', a: '39H', b: '14H', hl: '0000H', sp: '2400H', mem: '[2050H]=39H', flags: 'S=0 Z=0 AC=0 P=1 CY=0', tStates: '13T (Fetch + 2×Rd + Mem Wr)', note: 'Stored Accumulator 39H directly into RAM location 2050H.' },
      { pc: '2009H', a: '39H', b: '14H', hl: '0000H', sp: '2400H', mem: '[2050H]=39H', flags: 'S=0 Z=0 AC=0 P=1 CY=0', tStates: '5T Halted', note: 'Execution halted until Reset or Interrupt arrives.' },
    ],
  },
  {
    id: 'twos-comp',
    title: 'Pointer Load & Two’s Complement ([2100H]=05H -> -5)',
    lines: ['2000H: LXI H, 2100H', '2003H: MOV A, M', '2004H: CMA', '2005H: INR A', '2006H: HLT'],
    exec: () => [
      { pc: '2003H', a: '00H', b: '00H', hl: '2100H', sp: '2400H', mem: '[2100H]=05H', flags: 'S=0 Z=0 AC=0 P=0 CY=0', tStates: '10T (3-Byte Immediate)', note: 'Initialized 16-bit HL memory pointer cleanly to 2100H.' },
      { pc: '2004H', a: '05H', b: '00H', hl: '2100H', sp: '2400H', mem: '[2100H]=05H', flags: 'S=0 Z=0 AC=0 P=0 CY=0', tStates: '7T (Register Indirect M)', note: 'Fetched byte [2100H] = 05H indirectly via HL into A.' },
      { pc: '2005H', a: 'FAH', b: '00H', hl: '2100H', sp: '2400H', mem: '[2100H]=05H', flags: 'S=0 Z=0 AC=0 P=0 CY=0', tStates: '4T (1’s Complement)', note: 'Inverted all bits cleanly (~05H = FAH); flags untouched.' },
      { pc: '2006H', a: 'FBH', b: '00H', hl: '2100H', sp: '2400H', mem: '[2100H]=05H', flags: 'S=1 Z=0 AC=0 P=0 CY=0', tStates: '4T (Increment A)', note: 'Adding 1 forms 2’s complement FBH (−5 decimal; Sign flag S=1!).' },
      { pc: '2007H', a: 'FBH', b: '00H', hl: '2100H', sp: '2400H', mem: '[2100H]=05H', flags: 'S=1 Z=0 AC=0 P=0 CY=0', tStates: '5T Halted', note: 'Program complete — Sign flag S=1 reflects negative signed byte.' },
    ],
  },
];

function Sim8085Widget() {
  const [progIdx, setProgIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [pinIdx, setPinIdx] = useState(0);

  const prog = SAMPLE_8085_PROGRAMS[progIdx];
  const trace = prog.exec(step);
  const cur = trace[Math.min(step, trace.length - 1)];
  const activePin = PIN_GROUPS_8085[pinIdx];

  return (
    <div className="sub space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-[var(--st-accent-text)]" />
          <p className="text-[16px] font-semibold text-[var(--st-on)]">
            Interactive 8085 Execution Stepper &amp; Pinout Explorer
          </p>
        </div>
        <span className="pill text-[14px]">Deterministic logic model (non-SPICE)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={progIdx}
          onChange={(e) => {
            setProgIdx(Number(e.target.value));
            setStep(0);
          }}
          aria-label="Select 8085 assembly program"
          className="field-rect w-full sm:w-auto sm:flex-1"
        >
          {SAMPLE_8085_PROGRAMS.map((p, idx) => (
            <option key={p.id} value={idx}>
              {p.title}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setStep((s) => Math.min(trace.length - 1, s + 1))}
          disabled={step >= trace.length - 1}
          className="btn primary"
        >
          <StepForward className="size-4" />
          Step ({step + 1}/{trace.length})
        </button>

        <button type="button" onClick={() => setStep(trace.length - 1)} className="btn">
          <Play className="size-4" />
          Run end
        </button>

        <button type="button" onClick={() => setStep(0)} className="btn">
          <RotateCcw className="size-4" />
          Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3">
          <p className="mb-2 text-[14px] font-semibold text-[var(--st-on-var)]">Assembly trace</p>
          <ol className="space-y-1">
            {prog.lines.map((line, i) => (
              <li
                key={line}
                className={`code-mono rounded-lg px-2.5 py-1 text-[14px] ${
                  i === step
                    ? 'bg-[var(--st-3)] font-semibold text-[var(--st-accent-text)]'
                    : 'text-[var(--st-on-var)]'
                }`}
              >
                {i === step ? '▶ ' : '  '}
                {line}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 space-y-1.5">
          <p className="mb-1 text-[14px] font-semibold text-[var(--st-on-var)]">Registers &amp; flags</p>
          <p className="code-mono text-[14px] text-[var(--st-accent-text)]">
            A = {cur.a} · B = {cur.b} · HL = {cur.hl}
          </p>
          <p className="code-mono text-[14px] text-[var(--st-on)]">
            PC = {cur.pc} · SP = {cur.sp} · {cur.mem}
          </p>
          <p className="code-mono text-[14px] text-[var(--st-amber)]">{cur.flags}</p>
          <p className="text-[14px] text-[var(--st-on-var)]">Cycle: {cur.tStates}</p>
          <p className="text-[14px] text-[var(--st-on)]">{cur.note}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-[var(--st-line)] pt-3">
        <p className="text-[14px] font-semibold text-[var(--st-on-var)]">Inspect 8085 pin group:</p>
        <div className="seg" role="group" aria-label="8085 pin groups">
          {PIN_GROUPS_8085.map((pg, idx) => (
            <button
              key={pg.name}
              type="button"
              onClick={() => setPinIdx(idx)}
              className={pinIdx === idx ? 'on' : ''}
            >
              {pg.name}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3 text-[14px]">
          <p className="font-semibold text-[var(--st-on)]">
            {activePin.name} ({activePin.pins}) · {activePin.direction}
          </p>
          <p className="mt-1 text-[var(--st-on-var)]">{activePin.role}</p>
        </div>
      </div>
    </div>
  );
}

function SignalProcessingMiniLab() {
  const [fSig, setFSig] = useState(400);
  const [fSample, setFSample] = useState(1000);
  const [poleRadius, setPoleRadius] = useState(0.75);

  const nyquist = fSample / 2;
  const isAliased = fSig > nyquist;
  const k = Math.round(fSig / fSample);
  const aliasFreq = Math.abs(fSig - k * fSample);

  const stabilityLabel =
    poleRadius < 0.99 ? 'BIBO Stable (|z| < 1)' : poleRadius <= 1.01 ? 'Marginally Stable (|z| = 1)' : 'Unstable Growth (|z| > 1)';

  return (
    <div className="sub space-y-4 p-4">
      <p className="text-[16px] font-semibold text-[var(--st-on)]">
        Interactive Sampling Aliasing &amp; Z-Plane Pole Radius Check
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-semibold text-[var(--st-on)]">Input Tone f_in</span>
            <span className="code-mono text-[var(--st-accent-text)]">{fSig} Hz</span>
          </div>
          <input
            type="range"
            min={100}
            max={1800}
            step={50}
            value={fSig}
            onChange={(e) => setFSig(Number(e.target.value))}
            aria-label="Input frequency Hz"
            className="w-full accent-[var(--st-accent)]"
          />

          <div className="flex items-center justify-between text-[14px]">
            <span className="font-semibold text-[var(--st-on)]">Sample Rate f_s</span>
            <span className="code-mono text-[var(--st-accent-text)]">{fSample} Hz</span>
          </div>
          <input
            type="range"
            min={400}
            max={2400}
            step={100}
            value={fSample}
            onChange={(e) => setFSample(Number(e.target.value))}
            aria-label="Sample rate Hz"
            className="w-full accent-[var(--st-accent)]"
          />

          <p className={`text-[14px] font-semibold ${isAliased ? 'text-[var(--st-amber)]' : 'text-[var(--st-accent-text)]'}`}>
            {isAliased
              ? `Aliasing detected! f_in (${fSig} Hz) > f_s/2 (${nyquist} Hz) folds to ${aliasFreq} Hz.`
              : `Clean Nyquist capture: reconstructed frequency = ${fSig} Hz (f_s/2 = ${nyquist} Hz).`}
          </p>
        </div>

        <div className="space-y-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] p-3.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-semibold text-[var(--st-on)]">Causal Z-Plane Pole |p|</span>
            <span className="code-mono text-[var(--st-accent-text)]">{poleRadius.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={1.25}
            step={0.05}
            value={poleRadius}
            onChange={(e) => setPoleRadius(Number(e.target.value))}
            aria-label="Pole radius magnitude"
            className="w-full accent-[var(--st-accent)]"
          />
          <p className={`text-[14px] font-semibold ${poleRadius < 1 ? 'text-[var(--st-accent-text)]' : poleRadius === 1 ? 'text-[var(--st-amber)]' : 'text-[var(--st-crimson)]'}`}>
            {stabilityLabel}
          </p>
          <p className="text-[14px] text-[var(--st-on-var)]">
            h[4] impulse sample magnitude ≈ ({poleRadius.toFixed(2)})⁴ = {Math.pow(poleRadius, 4).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

const PHASE_PORTRAITS: {
  id: string;
  label: string;
  eigs: string;
  desc: string;
  pathD: string;
}[] = [
  {
    id: 'node',
    label: 'Stable Node',
    eigs: 'Real negative eigenvalues (λ₁, λ₂ < 0)',
    desc: 'Trajectories glide smoothly inward along dominant eigenvector straight toward origin (0,0) with zero spiral oscillation.',
    pathD: 'M 20,25 Q 50,55 90,60 M 160,95 Q 130,65 90,60 M 30,105 Q 60,72 90,60',
  },
  {
    id: 'focus',
    label: 'Stable Focus',
    eigs: 'Complex conjugate LHP (−α ± jω)',
    desc: 'Trajectories spiral exponentially clockwise inward until settling calmly at equilibrium.',
    pathD: 'M 155,35 C 155,95 45,105 45,55 C 45,25 125,30 120,65 C 115,80 75,72 90,60',
  },
  {
    id: 'center',
    label: 'Center',
    eigs: 'Pure imaginary (±jω)',
    desc: 'Undamped harmonic trajectories form nested closed concentric loops without decaying toward or blowing away from origin.',
    pathD: 'M 90,20 A 45,40 0 1,1 89.9,20 M 90,34 A 28,26 0 1,1 89.9,34',
  },
  {
    id: 'saddle',
    label: 'Saddle Point',
    eigs: 'Opposite-sign real (λ₁ < 0 < λ₂)',
    desc: 'Stable eigenvector manifold pulls state toward origin briefly before the positive unstable mode ejects hyperbolically!',
    pathD: 'M 30,22 Q 82,58 150,22 M 30,98 Q 82,62 150,98 M 20,60 L 160,60',
  },
];

function ModernControlMiniLab() {
  const [portraitIdx, setPortraitIdx] = useState(1);
  const active = PHASE_PORTRAITS[portraitIdx];

  return (
    <div className="sub space-y-3 p-4">
      <p className="text-[16px] font-semibold text-[var(--st-on)]">
        Phase-Plane Singular Point Explorer
      </p>
      <div className="seg" role="group" aria-label="Phase portrait type">
        {PHASE_PORTRAITS.map((pt, idx) => (
          <button
            key={pt.id}
            type="button"
            onClick={() => setPortraitIdx(idx)}
            className={portraitIdx === idx ? 'on' : ''}
          >
            {pt.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] items-center">
        <svg viewBox="0 0 180 120" className="w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-0)] p-2">
          <line x1="10" y1="60" x2="170" y2="60" stroke="var(--st-line)" strokeWidth="1" />
          <line x1="90" y1="10" x2="90" y2="110" stroke="var(--st-line)" strokeWidth="1" />
          <path d={active.pathD} fill="none" stroke="var(--st-accent)" strokeWidth="2.2" />
          <circle cx="90" cy="60" r="3.5" fill="var(--st-accent)" />
        </svg>
        <div className="space-y-1 text-[14px]">
          <p className="font-semibold text-[var(--st-accent-text)]">{active.eigs}</p>
          <p className="text-[var(--st-on-var)]">{active.desc}</p>
        </div>
      </div>
    </div>
  );
}

export function ConceptInteractiveVisualizer({ conceptId }: { conceptId: string }) {
  if (conceptId.startsWith('mpes-u2-') || conceptId === 'mpes-u3-mem-io-schemes') {
    return <Sim8085Widget />;
  }
  if (conceptId.startsWith('sp-u1-') || conceptId.startsWith('sp-u3-')) {
    return <SignalProcessingMiniLab />;
  }
  if (conceptId.startsWith('mcs-u3-') || conceptId.startsWith('mcs-u4-')) {
    return <ModernControlMiniLab />;
  }
  return null;
}

