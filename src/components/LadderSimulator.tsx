import { Play, Pause, RotateCcw, StepForward, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LADDER_PRESETS } from '@/data/automationData';

interface PlcState {
  inputs: Record<string, boolean>;
  coils: {
    motorRun: boolean;
    lubePump: boolean;
    batchDone: boolean;
    highAlarm: boolean;
  };
  tonAccMs: number;
  tonDn: boolean;
  tonEn: boolean;
  ctuAcc: number;
  ctuDn: boolean;
  prevCountPulse: boolean;
  scanCount: number;
}

const INPUT_DESCRIPTIONS = [
  { addr: 'I:0/0', label: 'Start Pushbutton (NO)', kind: 'Momentary / Toggle' },
  { addr: 'I:0/1', label: 'Stop Pushbutton (Fail-Safe NC)', kind: 'Healthy = TRUE' },
  { addr: 'I:0/2', label: 'Motor Thermal OL (Fail-Safe NC)', kind: 'Healthy = TRUE' },
  { addr: 'I:0/3', label: 'Batch Proximity Pulse Sensor', kind: 'Rising-Edge Trigger' },
  { addr: 'I:0/4', label: 'Counter & Alarm Reset PB', kind: 'Reset NO' },
  { addr: 'I:0/5', label: 'Tank High-Level Switch (Trip)', kind: 'TRUE = High Level' },
];

export function LadderSimulator() {
  const [running, setRunning] = useState(true);
  const [timerPresetSec, setTimerPresetSec] = useState(3);
  const [counterPreset, setCounterPreset] = useState(5);
  const [activePresetId, setActivePresetId] = useState(LADDER_PRESETS[0].id);

  const [plc, setPlc] = useState<PlcState>({
    inputs: { ...LADDER_PRESETS[0].initialInputs },
    coils: { motorRun: false, lubePump: false, batchDone: false, highAlarm: false },
    tonAccMs: 0,
    tonDn: false,
    tonEn: false,
    ctuAcc: 0,
    ctuDn: false,
    prevCountPulse: false,
    scanCount: 0,
  });

  const plcRef = useRef(plc);
  plcRef.current = plc;

  const executeOneScan = (dtMs: number) => {
    setPlc((prev) => {
      const inp = prev.inputs;
      // Rung 1: Seal-in Start/Stop with Fail-Safe NC Stop, NC Overload, and NOT High-Level Trip
      const startPressed = Boolean(inp['I:0/0']);
      const stopHealthy = Boolean(inp['I:0/1']);
      const overloadHealthy = Boolean(inp['I:0/2']);
      const highLevelTrip = Boolean(inp['I:0/5']);

      const motorRun =
        (startPressed || prev.coils.motorRun) &&
        stopHealthy &&
        overloadHealthy &&
        !highLevelTrip;

      // Rung 2: TON On-Delay T4:0 driven by Motor Run (Q:0/0) -> Q:0/1 Aux Lube / Purge Valve
      const presetMs = timerPresetSec * 1000;
      let tonAccMs = prev.tonAccMs;
      let tonDn = prev.tonDn;
      const tonEn = motorRun;
      if (tonEn) {
        tonAccMs = Math.min(presetMs, prev.tonAccMs + dtMs);
        tonDn = tonAccMs >= presetMs;
      } else {
        tonAccMs = 0;
        tonDn = false;
      }
      const lubePump = tonDn;

      // Rung 3: CTU Batch Counter C5:0 triggered on rising edge of I:0/3, cleared by I:0/4
      const resetPressed = Boolean(inp['I:0/4']);
      const countPulse = Boolean(inp['I:0/3']);
      let ctuAcc = prev.ctuAcc;
      if (resetPressed) {
        ctuAcc = 0;
      } else if (countPulse && !prev.prevCountPulse) {
        ctuAcc = prev.ctuAcc + 1;
      }
      const ctuDn = ctuAcc >= counterPreset;
      const batchDone = ctuDn;

      // Rung 4: Latched Tank High-Level Alarm Q:0/3 (cleared only when level normalizes AND reset pressed)
      const highAlarm = (highLevelTrip || prev.coils.highAlarm) && !resetPressed;

      return {
        ...prev,
        coils: { motorRun, lubePump, batchDone, highAlarm },
        tonAccMs,
        tonDn,
        tonEn,
        ctuAcc,
        ctuDn,
        prevCountPulse: countPulse,
        scanCount: prev.scanCount + 1,
      };
    });
  };

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => executeOneScan(100), 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timerPresetSec, counterPreset]);

  const toggleInput = (addr: string) => {
    setPlc((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [addr]: !prev.inputs[addr] },
    }));
  };

  const pulseInput = (addr: string) => {
    setPlc((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [addr]: true },
    }));
    setTimeout(() => {
      setPlc((prev) => ({
        ...prev,
        inputs: { ...prev.inputs, [addr]: false },
      }));
    }, 220);
  };

  const loadPreset = (presetId: string) => {
    const found = LADDER_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(presetId);
    setTimerPresetSec(found.timerPresetSec);
    setCounterPreset(found.counterPreset);
    setPlc({
      inputs: { ...found.initialInputs },
      coils: { motorRun: false, lubePump: false, batchDone: false, highAlarm: false },
      tonAccMs: 0,
      tonDn: false,
      tonEn: false,
      ctuAcc: 0,
      ctuDn: false,
      prevCountPulse: false,
      scanCount: 0,
    });
  };

  const Contact = ({
    addr,
    label,
    inverted = false,
    active,
  }: {
    addr: string;
    label: string;
    inverted?: boolean;
    active: boolean;
  }) => (
    <div
      className={`flex flex-col items-center rounded-xl border px-2.5 py-1.5 text-center transition ${
        active
          ? 'border-[var(--st-lime)] bg-[color-mix(in_srgb,var(--st-lime)_16%,transparent)] text-[var(--st-on)]'
          : 'border-[var(--st-line)] bg-[var(--st-void)] text-[var(--st-on-var)]'
      }`}
    >
      <span className="mono text-[10px] font-semibold">{addr}</span>
      <span className="mono text-xs font-bold tracking-wider">
        {inverted ? '─┤/├─' : '─┤ ├─'}
      </span>
      <span className="text-[10px] leading-tight">{label}</span>
    </div>
  );

  const Coil = ({ addr, label, active }: { addr: string; label: string; active: boolean }) => (
    <div
      className={`ml-auto flex flex-col items-center rounded-xl border px-3 py-1.5 text-center transition ${
        active
          ? 'border-[var(--st-phosphor)] bg-[color-mix(in_srgb,var(--st-phosphor)_18%,transparent)] text-[var(--st-phosphor)]'
          : 'border-[var(--st-line)] bg-[var(--st-void)] text-[var(--st-on-var)]'
      }`}
    >
      <span className="mono text-[10px] font-semibold">{addr}</span>
      <span className="mono text-xs font-bold">─( )─</span>
      <span className="text-[10px] leading-tight">{label}</span>
    </div>
  );

  return (
    <div className="glass space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-[var(--st-cyan)]">INTERACTIVE IEC 61131-3 PLC SANDBOX</p>
          <h3 className="text-lg font-semibold text-[var(--st-on)]">Real-Time Cyclic Ladder Logic Simulator</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="status"
            style={{ '--tone': running ? 'var(--st-phosphor)' : 'var(--st-amber)' } as React.CSSProperties}
          >
            {running ? `RUN · SCAN #${plc.scanCount}` : `PAUSED · SCAN #${plc.scanCount}`}
          </span>
          <button type="button" onClick={() => setRunning((r) => !r)} className="btn primary py-1.5!">
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {running ? 'Pause PLC' : 'Run PLC'}
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => executeOneScan(200)}
            className="btn py-1.5!"
            title="Step 1 single PLC scan (200 ms)"
          >
            <StepForward className="size-3.5" />
            Step Scan
          </button>
          <button type="button" onClick={() => loadPreset(activePresetId)} className="btn py-1.5!">
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Scenario Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">SCENARIO PRESET:</span>
        <div className="seg">
          {LADDER_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className={activePresetId === p.id ? 'on' : ''}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[310px_minmax(0,1fr)]">
        {/* Field Input Rack & Timer/Counter Config */}
        <div className="sub space-y-3 p-4">
          <p className="eyebrow">24 VDC FIELD INPUT SIMULATOR</p>
          <div className="space-y-2">
            {INPUT_DESCRIPTIONS.map((item) => {
              const isOn = Boolean(plc.inputs[item.addr]);
              return (
                <div
                  key={item.addr}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="mono text-[11px] font-semibold text-[var(--st-cyan)]">{item.addr}</span>
                      <span
                        className={`size-2 rounded-full ${isOn ? 'bg-[var(--st-phosphor)]' : 'bg-[var(--st-4)]'}`}
                      />
                    </div>
                    <p className="truncate text-xs text-[var(--st-on)]">{item.label}</p>
                    <p className="muted text-[10px]">{item.kind}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {(item.addr === 'I:0/0' || item.addr === 'I:0/3' || item.addr === 'I:0/4') && (
                      <button
                        type="button"
                        onClick={() => pulseInput(item.addr)}
                        className="btn py-1! px-2.5! text-[10px]!"
                        title="Momentary pulse (220 ms)"
                      >
                        Pulse
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleInput(item.addr)}
                      className={`btn py-1! px-2.5! text-[10px]! ${isOn ? 'primary' : ''}`}
                    >
                      {isOn ? '1' : '0'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <label className="space-y-1">
              <span className="label">TON T4:0 PRE (s)</span>
              <input
                type="number"
                min={1}
                max={20}
                value={timerPresetSec}
                onChange={(e) => setTimerPresetSec(Math.max(1, Number(e.target.value) || 1))}
                className="field-rect py-1.5!"
              />
            </label>
            <label className="space-y-1">
              <span className="label">CTU C5:0 PRE</span>
              <input
                type="number"
                min={1}
                max={25}
                value={counterPreset}
                onChange={(e) => setCounterPreset(Math.max(1, Number(e.target.value) || 1))}
                className="field-rect py-1.5!"
              />
            </label>
          </div>
        </div>

        {/* Live Ladder Rung Visualizer */}
        <div className="sub space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="eyebrow">LADDER PROGRAM EXECUTION (POWER RAIL FLOW)</p>
            <span className="muted mono text-[10px]">Green/Lime = Energized Logic Path</span>
          </div>

          {/* Rung 001 */}
          <div className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3">
            <p className="eyebrow mb-2">RUNG 001 · MOTOR START/STOP SEAL-IN &amp; FAIL-SAFE INTERLOCK</p>
            <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-cyan)] pl-3">
              <Contact addr="I:0/0 OR Q:0/0" label="Start / Seal-In" active={Boolean(plc.inputs['I:0/0'] || plc.coils.motorRun)} />
              <Contact addr="I:0/1" label="Stop (NC)" active={Boolean(plc.inputs['I:0/1'])} />
              <Contact addr="I:0/2" label="Overload (NC)" active={Boolean(plc.inputs['I:0/2'])} />
              <Contact addr="I:0/5" label="Not Hi-Level" inverted active={!plc.inputs['I:0/5']} />
              <Coil addr="Q:0/0" label="Motor Run" active={plc.coils.motorRun} />
            </div>
          </div>

          {/* Rung 002 */}
          <div className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3">
            <p className="eyebrow mb-2">RUNG 002 · ON-DELAY TIMER (TON T4:0) → AUX LUBE / PURGE VALVE</p>
            <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-cyan)] pl-3">
              <Contact addr="Q:0/0" label="Motor Running" active={plc.coils.motorRun} />
              <div
                className={`rounded-xl border px-3 py-1.5 ${
                  plc.tonEn
                    ? 'border-[var(--st-amber)] bg-[color-mix(in_srgb,var(--st-amber)_14%,transparent)]'
                    : 'border-[var(--st-line)] bg-[var(--st-void)]'
                }`}
              >
                <p className="mono text-[10px] font-semibold text-[var(--st-on)]">TON · T4:0</p>
                <p className="mono text-[11px] text-[var(--st-cyan)]">
                  ACC: {(plc.tonAccMs / 1000).toFixed(1)}s / PRE: {timerPresetSec}.0s
                </p>
                <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-[var(--st-3)]">
                  <div
                    className="h-full bg-[var(--st-lime)] transition-all"
                    style={{ width: `${Math.min(100, (plc.tonAccMs / (timerPresetSec * 1000)) * 100)}%` }}
                  />
                </div>
              </div>
              <Coil addr="Q:0/1" label="Aux Lube Ready" active={plc.coils.lubePump} />
            </div>
          </div>

          {/* Rung 003 */}
          <div className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3">
            <p className="eyebrow mb-2">RUNG 003 · BATCH PULSE COUNTER (CTU C5:0) &amp; RESET</p>
            <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-cyan)] pl-3">
              <Contact addr="I:0/3" label="Pulse Sensor" active={Boolean(plc.inputs['I:0/3'])} />
              <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-void)] px-3 py-1.5">
                <p className="mono text-[10px] font-semibold text-[var(--st-on)]">CTU · C5:0</p>
                <p className="mono text-[11px] text-[var(--st-iris)]">
                  CV: {plc.ctuAcc} / PV: {counterPreset} {plc.ctuDn ? '(DN)' : ''}
                </p>
              </div>
              <Contact addr="I:0/4" label="Clear / Reset" active={Boolean(plc.inputs['I:0/4'])} />
              <Coil addr="Q:0/2" label="Batch Complete" active={plc.coils.batchDone} />
            </div>
          </div>

          {/* Rung 004 */}
          <div className="rounded-2xl border border-[var(--st-line)] bg-[var(--st-1)] p-3">
            <p className="eyebrow mb-2">RUNG 004 · LATCHED HIGH-LEVEL ALARM INTERLOCK</p>
            <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-cyan)] pl-3">
              <Contact addr="I:0/5 OR Q:0/3" label="Trip / Alarm Latch" active={Boolean(plc.inputs['I:0/5'] || plc.coils.highAlarm)} />
              <Contact addr="I:0/4" label="Not Reset" inverted active={!plc.inputs['I:0/4']} />
              <Coil addr="Q:0/3" label="Alarm Horn" active={plc.coils.highAlarm} />
            </div>
          </div>

          {/* Output Status Strip */}
          <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
            {[
              { tag: 'Q:0/0', name: 'Main Pump Motor', on: plc.coils.motorRun },
              { tag: 'Q:0/1', name: 'Aux Lube Valve', on: plc.coils.lubePump },
              { tag: 'Q:0/2', name: 'Batch Complete', on: plc.coils.batchDone },
              { tag: 'Q:0/3', name: 'Hi-Level Alarm', on: plc.coils.highAlarm, warn: true },
            ].map((o) => (
              <div
                key={o.tag}
                className={`rounded-2xl border px-3 py-2 text-xs ${
                  o.on
                    ? o.warn
                      ? 'border-[var(--st-crimson)] bg-[color-mix(in_srgb,var(--st-crimson)_15%,transparent)]'
                      : 'border-[var(--st-phosphor)] bg-[color-mix(in_srgb,var(--st-phosphor)_14%,transparent)]'
                    : 'border-[var(--st-line)] bg-[var(--st-1)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="mono font-semibold">{o.tag}</span>
                  <Zap className={`size-3.5 ${o.on ? (o.warn ? 'text-[var(--st-crimson)]' : 'text-[var(--st-phosphor)]') : 'text-[var(--st-4)]'}`} />
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--st-on-var)]">{o.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

