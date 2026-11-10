import { Activity, ArrowRight, Calculator, Cpu, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MermaidDiagram } from '@/components/MermaidDiagram';
import { findCanonicalForTopic } from '@/data/instrumentRegistry';
import { INSTRUMENTS_BY_CATEGORY } from '@/data/instruments';
import { getCanonicalInstrumentUrl } from '@/data/navigationTree';

const SIGNAL_CHAIN_DIAGRAM = `flowchart LR
  S["Primary Transducer\\n(RTD / TC / Strain / pH)"] --> B["Wheatstone Bridge\\n& Bias Return"]
  B --> I["3-Op-Amp INA\\n(CMRR > 100 dB)"]
  I --> F["Anti-Aliasing Filter\\n(Sallen-Key / Notch)"]
  F --> ISO["Galvanic Isolator\\n(2.5–5 kVrms SiO2)"]
  ISO --> ADC["24-bit Sigma-Delta ADC\\n(50/60 Hz Sinc Filter)"]
  ADC --> TX["DAC + 4–20 mA Loop\\n+ HART 1200/2200 Hz"]`;

export function ElectronicsPage() {
  const sigTopics = INSTRUMENTS_BY_CATEGORY['signal-conditioning'];

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Signal conditioning electronics</p>
          <h1 className="text-[28px] font-semibold text-[var(--st-on)]">
            Electronics &amp; Sensor Signal Conditioning Chain
          </h1>
          <p className="muted mt-1 prose-measure text-[16px]">
            End-to-end engineering architecture taking small physical signals through Wheatstone bridges, precision amplifiers, anti-aliasing filters, galvanic isolators, ADCs, and loop transmitters.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/toolbox/wheatstone-bridge" className="btn primary">
            <Calculator className="size-4" />
            Wheatstone Calculator
          </Link>
          <Link to="/toolbox/adc-resolution" className="btn">
            <Cpu className="size-4" />
            ADC ENOB Solver
          </Link>
        </div>
      </header>

      <section className="glass p-5">
        <MermaidDiagram
          title="Smart Transmitter Signal Conditioning Front-End"
          code={SIGNAL_CHAIN_DIAGRAM}
        />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {sigTopics.map((topic, idx) => {
          const canonical = findCanonicalForTopic('signal-conditioning', topic.slug);
          const route = canonical ? getCanonicalInstrumentUrl(canonical.id) : `/instrumentation/signal-conditioning/${topic.slug}`;
          return (
          <Link
            key={topic.id}
            to={route}
            className="ui-card flex flex-col justify-between gap-3 p-5"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="pill text-[14px]">
                  Stage {idx + 1}
                </span>
                <Activity className="size-4 text-[var(--st-iris)]" />
              </div>
              <h2 className="text-[20px] font-semibold text-[var(--st-on)]">{topic.title}</h2>
              <p className="muted text-[14px] leading-relaxed">{topic.subtitle}</p>
            </div>

            <div className="flex items-center justify-end border-t border-[var(--st-line)] pt-2.5 text-[14px]">
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--st-accent-text)]">
                Open <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
          );
        })}
      </section>

      {/* High-Yield Engineering Rules Summary */}
      <section className="glass grid gap-4 p-6 md:grid-cols-3">
        <div className="sub space-y-1.5 p-4 text-[14px]">
          <div className="flex items-center gap-2 text-[var(--st-accent-text)]">
            <Zap className="size-4" />
            <p className="eyebrow">Ground loops and isolation</p>
          </div>
          <p className="text-[var(--st-on)] font-semibold">Never ground a cable shield at both ends</p>
          <p className="text-[var(--st-on-var)]">
            Bond instrumentation twisted-pair drain shields strictly at the control room marshalling earth bar to prevent circulating 50/60 Hz currents.
          </p>
        </div>

        <div className="sub space-y-1.5 p-4 text-[14px]">
          <div className="flex items-center gap-2 text-[var(--st-accent-text)]">
            <Activity className="size-4" />
            <p className="eyebrow">Anti-aliasing before sampling</p>
          </div>
          <p className="text-[var(--st-on)] font-semibold">Analog filter sits ahead of ADC sampler</p>
          <p className="text-[var(--st-on-var)]">
            Digital moving averages cannot cure frequencies already aliased below f_s / 2. Place a C0G/NP0 analog RC/Sallen-Key pole before conversion.
          </p>
        </div>

        <div className="sub space-y-1.5 p-4 text-[14px]">
          <div className="flex items-center gap-2 text-[var(--st-amber)]">
            <Cpu className="size-4" />
            <p className="eyebrow">Ratiometric bridges and HART</p>
          </div>
          <p className="text-[var(--st-on)] font-semibold">Power bridge &amp; V_ref identically; ≥250 Ω for HART</p>
          <p className="text-[var(--st-on-var)]">
            Ratiometric excitation cancels V_ref thermal drift cleanly; HART FSK communication strictly requires ≥250 Ω series resistance against PSU output caps.
          </p>
        </div>
      </section>
    </div>
  );
}

