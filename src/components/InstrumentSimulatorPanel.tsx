import { Activity, Info, RotateCcw } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import type { InstrumentSimulationConfig, SimulationEvalResult } from '@/types/cad';
import { MathBlock } from './MathBlock';

interface InstrumentSimulatorPanelProps {
  simConfig: InstrumentSimulationConfig;
  primaryValue: number;
  secondaryValue: number;
  evalResult: SimulationEvalResult;
  onChangePrimary: (val: number) => void;
  onChangeSecondary: (val: number) => void;
  onReset: () => void;
}

export function InstrumentSimulatorPanel({
  simConfig,
  primaryValue,
  secondaryValue,
  evalResult,
  onChangePrimary,
  onChangeSecondary,
  onReset,
}: InstrumentSimulatorPanelProps) {
  const { theme } = useApp();

  const gridStroke = theme === 'light' ? 'rgba(20,20,20,0.09)' : 'rgba(255,255,255,0.08)';
  const axisTick = theme === 'light' ? '#525252' : '#a6a6a6';
  const lineMain = theme === 'light' ? '#0284c7' : '#38bdf8';
  const lineIdeal = theme === 'light' ? '#65a30d' : '#a3e635';
  const dotFill = '#f97316';
  const tooltipBg = theme === 'light' ? '#ffffff' : '#161b22';
  const tooltipBorder = theme === 'light' ? 'rgba(20,20,20,0.16)' : 'rgba(255,255,255,0.16)';

  const chartData = evalResult.curve.map((pt, i) => ({
    x: pt.x,
    y: pt.y,
    ideal: evalResult.idealCurve?.[i]?.y,
  }));

  const clampParam = (val: number, min: number, max: number) => {
    if (!Number.isFinite(val)) return min;
    return Math.min(max, Math.max(min, val));
  };

  return (
    <section className="glass space-y-4 p-5" aria-label="Interactive Instrument Simulation">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--st-line)] pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Activity className="size-4 text-[var(--st-cyan)]" />
            <p className="eyebrow text-[var(--st-cyan)]">OPERATING PRINCIPLE SIMULATION</p>
            {simConfig.isEducationalApproximation && (
              <span className="mono rounded-full border border-[var(--st-amber)]/40 bg-[var(--st-amber)]/10 px-2.5 py-0.5 text-[10px] text-[var(--st-amber)]">
                Educational Approximation
              </span>
            )}
          </div>
          <h3 className="mt-1 text-base font-semibold text-[var(--st-on)]">{simConfig.title}</h3>
        </div>

        <button type="button" onClick={onReset} className="btn py-1! text-xs!">
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </div>

      {/* Controls + Live Readout */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="sub space-y-3 p-4">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-medium text-[var(--st-on)]" htmlFor="sim-primary-input">
                {simConfig.primaryParam.label}{' '}
                <span className="mono text-[11px] text-[var(--st-outline)]">
                  ({simConfig.primaryParam.min} to {simConfig.primaryParam.max} {simConfig.primaryParam.unit})
                </span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="sim-primary-input"
                  type="number"
                  min={simConfig.primaryParam.min}
                  max={simConfig.primaryParam.max}
                  step={simConfig.primaryParam.step}
                  value={primaryValue}
                  onChange={(e) =>
                    onChangePrimary(
                      clampParam(
                        Number(e.target.value),
                        simConfig.primaryParam.min,
                        simConfig.primaryParam.max,
                      ),
                    )
                  }
                  className="field-rect w-24 py-1! text-right mono text-xs!"
                />
                <span className="mono text-xs text-[var(--st-cyan)]">
                  {simConfig.primaryParam.unit}
                </span>
              </div>
            </div>
            <input
              type="range"
              min={simConfig.primaryParam.min}
              max={simConfig.primaryParam.max}
              step={simConfig.primaryParam.step}
              value={primaryValue}
              onChange={(e) => onChangePrimary(Number(e.target.value))}
              aria-label={simConfig.primaryParam.label}
              className="w-full accent-[var(--st-cyan)]"
            />
          </div>

          {simConfig.secondaryParam && (
            <div className="border-t border-[var(--st-line)] pt-3">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium text-[var(--st-on)]" htmlFor="sim-sec-input">
                  {simConfig.secondaryParam.label}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="sim-sec-input"
                    type="number"
                    min={simConfig.secondaryParam.min}
                    max={simConfig.secondaryParam.max}
                    step={simConfig.secondaryParam.step}
                    value={secondaryValue}
                    onChange={(e) =>
                      onChangeSecondary(
                        clampParam(
                          Number(e.target.value),
                          simConfig.secondaryParam!.min,
                          simConfig.secondaryParam!.max,
                        ),
                      )
                    }
                    className="field-rect w-24 py-1! text-right mono text-xs!"
                  />
                  {simConfig.secondaryParam.unit && (
                    <span className="mono text-xs text-[var(--st-on-var)]">
                      {simConfig.secondaryParam.unit}
                    </span>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={simConfig.secondaryParam.min}
                max={simConfig.secondaryParam.max}
                step={simConfig.secondaryParam.step}
                value={secondaryValue}
                onChange={(e) => onChangeSecondary(Number(e.target.value))}
                aria-label={simConfig.secondaryParam.label}
                className="w-full accent-[var(--st-lime)]"
              />
            </div>
          )}

          <p className="border-t border-[var(--st-line)] pt-2.5 text-xs leading-relaxed text-[var(--st-on-var)]">
            <span className="mono mr-1 font-semibold text-[var(--st-lime)]">Observation:</span>
            {evalResult.observation}
          </p>
        </div>

        {/* Prominent Simulated Output Telemetry */}
        <div className="sub flex flex-col justify-between space-y-3 p-4">
          <div>
            <p className="eyebrow">SIMULATED INSTRUMENT OUTPUT</p>
            <p className="mono mt-2 text-2xl font-semibold tracking-tight text-[var(--st-cyan)] sm:text-3xl">
              {evalResult.outputValue}
            </p>
            <p className="mono mt-0.5 text-[11px] text-[var(--st-outline)]">
              Unit: {evalResult.outputUnit}
            </p>
            {evalResult.secondaryOutput && (
              <p className="mt-2 rounded-xl border border-[var(--st-line)] bg-[var(--st-1)] px-3 py-2 text-xs text-[var(--st-on)]">
                {evalResult.secondaryOutput}
              </p>
            )}
          </div>

          <div className="border-t border-[var(--st-line)] pt-2">
            <p className="eyebrow mb-1">GOVERNING RELATIONSHIP</p>
            <div className="overflow-x-auto text-[var(--st-on)]">
              <MathBlock latex={simConfig.governingFormulaLatex} displayMode />
            </div>
          </div>
        </div>
      </div>

      {/* Input-Output Curve */}
      <div className="sub p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-medium text-[var(--st-on)]">
            Characteristic Response: {evalResult.yLabel} ({evalResult.yUnit}) vs {evalResult.xLabel} ({evalResult.xUnit})
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="mono flex items-center gap-1.5 text-[var(--st-cyan)]">
              <span className="inline-block size-2 rounded-full bg-[var(--st-cyan)]" /> Physical Curve
            </span>
            {evalResult.idealCurve && (
              <span className="mono flex items-center gap-1.5 text-[var(--st-lime)]">
                <span className="inline-block size-2 rounded-full bg-[var(--st-lime)]" /> Linear Ref
              </span>
            )}
            <span className="mono flex items-center gap-1.5 text-[#f97316]">
              <span className="inline-block size-2.5 rounded-full bg-[#f97316]" /> Operating Point
            </span>
          </div>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 4, bottom: 8 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={['dataMin', 'dataMax']}
                stroke={axisTick}
                tick={{ fontSize: 11, fill: axisTick }}
              />
              <YAxis stroke={axisTick} tick={{ fontSize: 11, fill: axisTick }} width={56} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="y"
                name={evalResult.yLabel}
                stroke={lineMain}
                strokeWidth={2.5}
                dot={false}
              />
              {evalResult.idealCurve && (
                <Line
                  type="monotone"
                  dataKey="ideal"
                  name="Ideal Linear Ref"
                  stroke={lineIdeal}
                  strokeWidth={1.6}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
              <ReferenceDot
                x={Number(primaryValue.toFixed(3))}
                y={evalResult.outputNumeric}
                r={5.5}
                fill={dotFill}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-start gap-2 text-[11px] text-[var(--st-outline)]">
          <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--st-cyan)]" />
          <span>{simConfig.assumptions}</span>
        </div>
      </div>
    </section>
  );
}

