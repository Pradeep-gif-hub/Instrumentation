import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCanonicalInstrument } from '@/data/instrumentRegistry';
import { getCanonicalInstrumentUrl } from '@/data/navigationTree';
import { getPlainDisplayName, getPlainSummaryLine } from '@/data/simpleGuides';

const STARTER_IDS = [
  'rtd-pt100',
  'thermocouple-k',
  'bourdon-tube',
  'dp-transmitter',
  'orifice-plate',
  'venturi-meter',
];

const LOOP_STEPS = [
  {
    step: '01',
    title: 'Sensor',
    detail: 'Turns a process variable into a physical effect you can measure.',
    to: '/browse?family=temperature',
  },
  {
    step: '02',
    title: 'Transmitter',
    detail: 'Conditions that effect into a standard 4–20 mA or fieldbus signal.',
    to: '/instrument/dp-transmitter',
  },
  {
    step: '03',
    title: 'Controller',
    detail: 'Compares the measurement with the setpoint and computes the correction.',
    to: '/toolbox/pid-tuning',
  },
  {
    step: '04',
    title: 'Final element',
    detail: 'A control valve or drive moves the process back toward the setpoint.',
    to: '/toolbox/valve-sizing',
  },
];

export function OverviewPage() {
  const starters = STARTER_IDS.map((id) => getCanonicalInstrument(id)).filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry),
  );

  return (
    <div className="mx-auto flex max-w-[980px] flex-col gap-8 pt-2 sm:pt-4">
      <header className="max-w-[68ch] space-y-3">
        <p className="text-[14px] font-semibold text-[var(--st-accent-text)]">
          Instrumentation and control
        </p>
        <h1>Read a plant the way an instrument engineer does.</h1>
        <p className="text-[16px] text-[var(--st-on-var)]">
          Every loop has a measured variable, a sensor, a standard signal, and a final control
          element. Open a topic and the working principle, range, and accuracy load with it.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <Link to="/learn" className="ui-card flex items-start justify-between gap-4 px-5 py-5">
          <span>
            <span className="block text-[20px] font-semibold text-[var(--st-on)]">
              Learn by semester
            </span>
            <span className="mt-1 block text-[14px] text-[var(--st-on-var)]">
              Semester notes, syllabus sections, and the instruments each subject uses.
            </span>
          </span>
          <ArrowRight className="mt-1 size-5 shrink-0 text-[var(--st-accent)]" />
        </Link>

        <Link
          to="/browse"
          className="ui-card flex items-start justify-between gap-4 px-5 py-5"
        >
          <span>
            <span className="block text-[20px] font-semibold text-[var(--st-on)]">
              Look up an instrument
            </span>
            <span className="mt-1 block text-[14px] text-[var(--st-on-var)]">
              Full catalog by temperature, pressure, flow, level, and the rest of the loop.
            </span>
          </span>
          <ArrowRight className="mt-1 size-5 shrink-0 text-[var(--st-accent)]" />
        </Link>

        <Link
          to="/interview"
          className="ui-card flex items-start justify-between gap-4 px-5 py-5"
        >
          <span>
            <span className="block text-[20px] font-semibold text-[var(--st-on)]">
              Practise interview questions
            </span>
            <span className="mt-1 block text-[14px] text-[var(--st-on-var)]">
              Viva questions on transmitters, loops, calibration, and plant faults.
            </span>
          </span>
          <ArrowRight className="mt-1 size-5 shrink-0 text-[var(--st-accent)]" />
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2>A standard control loop</h2>
          <Link
            to="/electronics"
            className="text-[14px] font-semibold text-[var(--st-accent-text)] hover:underline"
          >
            Signal chain
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {LOOP_STEPS.map((item) => (
            <Link key={item.step} to={item.to} className="ui-card block px-4 py-4">
              <p className="text-[14px] font-semibold text-[var(--st-accent-text)]">{item.step}</p>
              <p className="mt-1 text-[18px] font-semibold text-[var(--st-on)]">{item.title}</p>
              <p className="mt-1 text-[14px] text-[var(--st-on-var)]">{item.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2>Instruments to start with</h2>
          <Link
            to="/browse"
            className="text-[14px] font-semibold text-[var(--st-accent-text)] hover:underline"
          >
            Full catalog
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {starters.map((entry) => (
            <Link
              key={entry.id}
              to={getCanonicalInstrumentUrl(entry.id)}
              className="ui-card flex items-center justify-between gap-4 px-5 py-4"
            >
              <span className="min-w-0">
                <span className="block text-[16px] font-semibold text-[var(--st-on)]">
                  {getPlainDisplayName(entry)}
                </span>
                <span className="mt-0.5 block line-clamp-2 text-[14px] text-[var(--st-on-var)]">
                  {getPlainSummaryLine(entry)}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-[var(--st-accent)]" />
            </Link>
          ))}
        </div>
      </section>

      <p className="text-[14px] text-[var(--st-on-var)]">
        New to the subject?{' '}
        <Link
          to={getCanonicalInstrumentUrl('rtd-pt100')}
          className="font-semibold text-[var(--st-accent-text)] underline decoration-[var(--st-line)] underline-offset-4 hover:text-[var(--st-on)] hover:decoration-[var(--st-accent)]"
        >
          Start with the Pt100 RTD.
        </Link>
      </p>
    </div>
  );
}
