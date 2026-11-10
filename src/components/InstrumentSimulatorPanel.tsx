import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
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
  const [showGraph, setShowGraph] = useState(false);
  const [showEquation, setShowEquation] = useState(false);

  const gridStroke = theme === 'light' ? 'rgba(20,20,20,0.09)' : 'rgba(255,255,255,0.08)';
  const axisTick = theme === 'light' ? '#525252' : '#a6a6a6';
  const lineMain = theme === 'light' ? '#2F5F8A' : '#7FB3DE';
  const lineIdeal = theme === 'light' ? '#64748B' : '#9AA8B4';
  const dotFill = '#f97316';
  const tooltipBg = theme === 'light' ? '#ffffff' : '#2b2b2b';
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
    <section className="glass space-y-5 p-5 sm:p-6" aria-label="Interactive Instrument Simulation">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--st-line)] pb-4">
        <div className="space-y-2">
          <h2>{simConfig.title}</h2>
          {simConfig.isEducationalApproximation && (
            <span
              className="status"
              style={{ '--tone': 'var(--st-amber)' } as React.CSSProperties}
            >
              Educational approximation
            </span>
          )}
        </div>

        <button type="button" onClick={onReset} className="btn">
          <RotateCcw className="size-4" />
          Reset
        </button>
      </div>

      {/* Primary Control + Live Result FIRST */}
      <div className="sub space-y-5 p-5">
        {/* Slider & Number */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              className="text-[16px] font-semibold text-[var(--st-on)]"
              htmlFor="sim-primary-input"
            >
              {simConfig.primaryParam.label}{' '}
              <span className="text-[14px] font-normal text-[var(--st-on-var)]">
                ({simConfig.primaryParam.min} to {simConfig.primaryParam.max}{' '}
                {simConfig.primaryParam.unit})
              </span>
            </label>
            <div className="flex items-center gap-2">
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
                className="field-rect code-mono w-28 text-right"
              />
              <span className="code-mono text-[14px] font-semibold text-[var(--st-accent-text)]">
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
            className="w-full accent-[var(--st-accent)]"
          />
        </div>

        {simConfig.secondaryParam && (
          <div className="space-y-2 border-t border-[var(--st-line)] pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                className="text-[16px] font-semibold text-[var(--st-on)]"
                htmlFor="sim-sec-input"
              >
                {simConfig.secondaryParam.label}
              </label>
              <div className="flex items-center gap-2">
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
                  className="field-rect code-mono w-28 text-right"
                />
                {simConfig.secondaryParam.unit && (
                  <span className="code-mono text-[14px] text-[var(--st-on-var)]">
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
              className="w-full accent-[var(--st-accent)]"
            />
          </div>
        )}

        {/* Prominent Result */}
        <div className="border-t border-[var(--st-line)] pt-4">
          <p className="text-[14px] font-semibold text-[var(--st-on-var)]">Result</p>
          <p className="code-mono mt-1 text-[28px] font-semibold leading-tight text-[var(--st-accent-text)]">
            {evalResult.outputValue}
          </p>
          {evalResult.secondaryOutput && (
            <p className="code-mono mt-2 text-[14px] text-[var(--st-on)]">
              {evalResult.secondaryOutput}
            </p>
          )}
          <p className="prose-measure mt-3 text-[16px] text-[var(--st-on-var)]">
            {evalResult.observation}
          </p>
        </div>
      </div>

      {/* Collapsible Graph & Equation Toggles */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          aria-expanded={showGraph}
          onClick={() => setShowGraph((v) => !v)}
          className={`btn ${showGraph ? 'primary' : ''}`}
        >
          {showGraph ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          Show graph
        </button>

        <button
          type="button"
          aria-expanded={showEquation}
          onClick={() => setShowEquation((v) => !v)}
          className={`btn ${showEquation ? 'primary' : ''}`}
        >
          {showEquation ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          Show equation
        </button>
      </div>

      {showGraph && (
        <div className="sub space-y-3 p-5">
          <p className="text-[14px] font-semibold text-[var(--st-on)]">
            {evalResult.yLabel} ({evalResult.yUnit}) vs {evalResult.xLabel} ({evalResult.xUnit})
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 4, bottom: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  stroke={axisTick}
                  tick={{ fontSize: 14, fill: axisTick }}
                />
                <YAxis stroke={axisTick} tick={{ fontSize: 14, fill: axisTick }} width={64} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '14px',
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
                    name="Linear reference"
                    stroke={lineIdeal}
                    strokeWidth={1.6}
                    strokeDasharray="5 4"
                    dot={false}
                  />
                )}
                <ReferenceDot
                  x={Number(primaryValue.toFixed(3))}
                  y={evalResult.outputNumeric}
                  r={6}
                  fill={dotFill}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[14px] text-[var(--st-on-var)]">{simConfig.assumptions}</p>
        </div>
      )}

      {showEquation && (
        <div className="sub space-y-2 p-5">
          <p className="text-[14px] font-semibold text-[var(--st-on-var)]">Equation</p>
          <div className="overflow-x-auto text-[var(--st-on)]">
            <MathBlock latex={simConfig.governingFormulaLatex} displayMode />
          </div>
          <p className="text-[14px] text-[var(--st-on-var)]">{simConfig.assumptions}</p>
        </div>
      )}
    </section>
  );
}
