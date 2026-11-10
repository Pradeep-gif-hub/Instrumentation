import { Pause, Play, RotateCcw, StepForward, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  { addr: 'I:0/0', label: 'Start pushbutton (NO)' },
  { addr: 'I:0/1', label: 'Stop pushbutton (NC safe)' },
  { addr: 'I:0/2', label: 'Motor overload (NC safe)' },
  { addr: 'I:0/3', label: 'Batch pulse sensor' },
  { addr: 'I:0/4', label: 'Reset pushbutton' },
  { addr: 'I:0/5', label: 'High-level switch (trip)' },
];

export function LadderSimulator() {
  const [running, setRunning] = useState(false);
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

  const executeOneScan = (dtMs: number) => {
    setPlc((prev) => {
      const inp = prev.inputs;
      const startPressed = Boolean(inp['I:0/0']);
      const stopHealthy = Boolean(inp['I:0/1']);
      const overloadHealthy = Boolean(inp['I:0/2']);
      const highLevelTrip = Boolean(inp['I:0/5']);

      const motorRun =
        (startPressed || prev.coils.motorRun) &&
        stopHealthy &&
        overloadHealthy &&
        !highLevelTrip;

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
      className={`flex flex-col items-center rounded-xl border px-3 py-2 text-center transition ${
        active
          ? 'border-[var(--st-accent)] bg-[color-mix(in_srgb,var(--st-accent)_16%,transparent)] text-[var(--st-on)]'
          : 'border-[var(--st-line)] bg-[var(--st-void)] text-[var(--st-on-var)]'
      }`}
    >
      <span className="code-mono text-[14px] font-semibold">{addr}</span>
      <span className="code-mono text-[14px] font-semibold">
        {inverted ? '─┤/├─' : '─┤ ├─'}
      </span>
      <span className="text-[14px]">{label}</span>
    </div>
  );

  const Coil = ({ addr, label, active }: { addr: string; label: string; active: boolean }) => (
    <div
      className={`ml-auto flex flex-col items-center rounded-xl border px-3 py-2 text-center transition ${
        active
          ? 'border-[var(--st-accent)] bg-[color-mix(in_srgb,var(--st-accent)_18%,transparent)] text-[var(--st-accent-text)]'
          : 'border-[var(--st-line)] bg-[var(--st-void)] text-[var(--st-on-var)]'
      }`}
    >
      <span className="code-mono text-[14px] font-semibold">{addr}</span>
      <span className="code-mono text-[14px] font-semibold">─( )─</span>
      <span className="text-[14px]">{label}</span>
    </div>
  );

  const activeScenario = LADDER_PRESETS.find((p) => p.id === activePresetId) ?? LADDER_PRESETS[0];

  return (
    <div className="space-y-5">
      {/* One Scenario Selector + Controls */}
      <div className="glass space-y-4 p-5">
        <label className="block space-y-2">
          <span className="text-[14px] font-semibold text-[var(--st-on-var)]">Scenario</span>
          <select
            aria-label="Select PLC scenario"
            value={activePresetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="field-rect"
          >
            {LADDER_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <p className="text-[14px] text-[var(--st-on-var)]">{activeScenario.description}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => executeOneScan(200)}
            disabled={running}
            className="btn primary"
          >
            <StepForward className="size-4" />
            Step
          </button>

          <button type="button" onClick={() => setRunning((r) => !r)} className="btn">
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? 'Pause' : 'Run continuously'}
          </button>

          <button type="button" onClick={() => loadPreset(activePresetId)} className="btn">
            <RotateCcw className="size-4" />
            Reset
          </button>

          <span className="code-mono ml-auto text-[14px] text-[var(--st-on-var)]">
            Scan #{plc.scanCount}
          </span>
        </div>
      </div>

      {/* Single-Column Field Inputs */}
      <section className="glass space-y-3 p-5" aria-label="Field inputs">
        <h2>Field inputs</h2>
        <div className="space-y-2">
          {INPUT_DESCRIPTIONS.map((item) => {
            const isOn = Boolean(plc.inputs[item.addr]);
            return (
              <div
                key={item.addr}
                className="sub flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <span className="code-mono mr-2 text-[14px] font-semibold text-[var(--st-accent-text)]">
                    {item.addr}
                  </span>
                  <span className="text-[16px] text-[var(--st-on)]">{item.label}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleInput(item.addr)}
                  className={`btn shrink-0 ${isOn ? 'primary' : ''}`}
                >
                  {isOn ? 'On (1)' : 'Off (0)'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Single-Column Ladder Rungs */}
      <section className="glass space-y-3 p-5" aria-label="Ladder rungs">
        <h2>Ladder rungs</h2>

        <div className="sub space-y-2 p-4">
          <p className="text-[14px] font-semibold text-[var(--st-on-var)]">
            Rung 1: Motor start / stop and safety interlock
          </p>
          <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-accent)] pl-3">
            <Contact addr="I:0/0" label="Start" active={Boolean(plc.inputs['I:0/0'] || plc.coils.motorRun)} />
            <Contact addr="I:0/1" label="Stop (NC)" active={Boolean(plc.inputs['I:0/1'])} />
            <Contact addr="I:0/2" label="Overload" active={Boolean(plc.inputs['I:0/2'])} />
            <Contact addr="I:0/5" label="Not high" inverted active={!plc.inputs['I:0/5']} />
            <Coil addr="Q:0/0" label="Motor run" active={plc.coils.motorRun} />
          </div>
        </div>

        <div className="sub space-y-2 p-4">
          <p className="text-[14px] font-semibold text-[var(--st-on-var)]">
            Rung 2: On-delay timer (T4:0) for lube pump
          </p>
          <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-accent)] pl-3">
            <Contact addr="Q:0/0" label="Motor run" active={plc.coils.motorRun} />
            <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-void)] px-3 py-2">
              <p className="code-mono text-[14px] font-semibold text-[var(--st-on)]">TON T4:0</p>
              <p className="code-mono text-[14px] text-[var(--st-accent-text)]">
                {(plc.tonAccMs / 1000).toFixed(1)}s / {timerPresetSec}.0s
              </p>
            </div>
            <Coil addr="Q:0/1" label="Lube ready" active={plc.coils.lubePump} />
          </div>
        </div>

        <div className="sub space-y-2 p-4">
          <p className="text-[14px] font-semibold text-[var(--st-on-var)]">
            Rung 3: Batch counter (C5:0)
          </p>
          <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-accent)] pl-3">
            <Contact addr="I:0/3" label="Pulse" active={Boolean(plc.inputs['I:0/3'])} />
            <div className="rounded-xl border border-[var(--st-line)] bg-[var(--st-void)] px-3 py-2">
              <p className="code-mono text-[14px] font-semibold text-[var(--st-on)]">CTU C5:0</p>
              <p className="code-mono text-[14px] text-[var(--st-accent-text)]">
                {plc.ctuAcc} / {counterPreset}
              </p>
            </div>
            <Contact addr="I:0/4" label="Reset" active={Boolean(plc.inputs['I:0/4'])} />
            <Coil addr="Q:0/2" label="Batch done" active={plc.coils.batchDone} />
          </div>
        </div>

        <div className="sub space-y-2 p-4">
          <p className="text-[14px] font-semibold text-[var(--st-on-var)]">
            Rung 4: Latched high-level alarm
          </p>
          <div className="flex flex-wrap items-center gap-2 border-l-4 border-[var(--st-accent)] pl-3">
            <Contact addr="I:0/5" label="High trip" active={Boolean(plc.inputs['I:0/5'] || plc.coils.highAlarm)} />
            <Contact addr="I:0/4" label="Not reset" inverted active={!plc.inputs['I:0/4']} />
            <Coil addr="Q:0/3" label="Alarm horn" active={plc.coils.highAlarm} />
          </div>
        </div>

        {/* Outputs Summary */}
        <div className="space-y-2 pt-2">
          {[
            { tag: 'Q:0/0', name: 'Main pump motor', on: plc.coils.motorRun },
            { tag: 'Q:0/1', name: 'Aux lube valve', on: plc.coils.lubePump },
            { tag: 'Q:0/2', name: 'Batch complete', on: plc.coils.batchDone },
            { tag: 'Q:0/3', name: 'High-level alarm', on: plc.coils.highAlarm },
          ].map((o) => (
            <div
              key={o.tag}
              className="sub flex items-center justify-between px-4 py-2.5 text-[14px]"
            >
              <span>
                <span className="code-mono mr-2 font-semibold">{o.tag}</span>
                {o.name}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold">
                <Zap className={`size-4 ${o.on ? 'text-[var(--st-accent-text)]' : 'text-[var(--st-4)]'}`} />
                {o.on ? 'Active' : 'Off'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
