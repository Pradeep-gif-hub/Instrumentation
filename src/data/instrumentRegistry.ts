import { ALL_INSTRUMENTS } from '@/data/instruments';
import { NITJ_CURRICULUM_SUBJECTS } from '@/data/curriculum';
import { CAD_MODELS, type CadModelConfig } from '@/data/models3d';
import { INSTRUMENT_SIMULATIONS } from '@/data/simulations';
import type { CanonicalInstrumentEntry, InstrumentFamilyKey } from '@/types/cad';
import { ELECTRICAL_ANALYTICAL_CONTROL_ENTRIES } from './registry/electricalAnalyticalControl';
import { PROCESS_INSTRUMENT_ENTRIES } from './registry/processInstruments';

function adaptGlbToCanonical(
  cfg: CadModelConfig,
  opts: {
    abbreviation: string;
    categoryLabel: string;
    family: InstrumentFamilyKey;
    existingTopicRef: { category: string; slug: string };
    simulationId: string;
    measurementQuantity: string;
    physicalPhenomenon: string;
    inputOutput: { input: string; output: string };
    workingPrincipleSteps: string[];
    relatedIds: string[];
    equations: { label: string; latex: string }[];
  },
): CanonicalInstrumentEntry {
  const topic = ALL_INSTRUMENTS.find(
    (t) =>
      t.category === opts.existingTopicRef.category && t.slug === opts.existingTopicRef.slug,
  );

  return {
    id: cfg.id,
    name: topic?.title ?? cfg.title,
    abbreviation: opts.abbreviation,
    categoryLabel: opts.categoryLabel,
    family: opts.family,
    classification: 'standalone-instrument',
    standardRef: cfg.standard,
    primaryRoute: cfg.topicRoute,
    existingTopicRef: opts.existingTopicRef,
    hasDedicated3D: true,
    hasSimulation: Boolean(INSTRUMENT_SIMULATIONS[opts.simulationId]),
    sourceType: 'glb',
    glbUrl: cfg.glbUrl,
    simulationId: opts.simulationId,
    supportsExplode: true,
    supportsCutaway: true,
    hasAnimation: false,
    defaultCameraPos: cfg.defaultCameraPos,
    target: cfg.target,
    disclosure: cfg.disclosure,
    overview: topic?.definition ?? cfg.subtitle,
    measurementQuantity: opts.measurementQuantity,
    workingPrincipleSteps: opts.workingPrincipleSteps,
    physicalPhenomenon: opts.physicalPhenomenon,
    inputOutput: opts.inputOutput,
    constructionSummary: topic?.construction.summary ?? cfg.subtitle,
    performance: {
      accuracy: topic?.accuracyAndSensitivity.accuracyClass,
      sensitivity: topic?.accuracyAndSensitivity.sensitivity,
      precisionOrRepeatability: topic?.accuracyAndSensitivity.repeatability,
      responseTime: topic?.accuracyAndSensitivity.responseTime,
      range: topic?.measurementRange.typicalSpan,
    },
    practical: {
      industrialApps: topic?.applications.slice(0, 3).map((a) => `${a.industry}: ${a.service}`) ?? [cfg.subtitle],
      labApps: ['Bench calibration verification & IEC comparison tests'],
      advantages: topic?.advantages ?? ['High industrial reliability'],
      limitations: topic?.limitations ?? ['Periodic calibration required'],
      failureModes: topic?.internalComponents.map((c) => `${c.name}: ${c.failureMode}`) ?? [],
      calibrationAndMaintenance: topic?.calibration.acceptanceCriteria ?? 'Traceable laboratory calibration.',
    },
    learning: {
      equations: opts.equations,
      vivaQuestions:
        topic?.interviewQuestions.slice(0, 2).map((iq) => ({ q: iq.question, a: iq.answer })) ?? [],
      relatedInstrumentIds: opts.relatedIds,
    },
    parts: cfg.parts,
    curriculumLinks: [],
  };
}

const GLB_ENTRIES: CanonicalInstrumentEntry[] = [
  adaptGlbToCanonical(CAD_MODELS['rtd-pt100'], {
    abbreviation: 'RTD (Pt100)',
    categoryLabel: 'Temperature Measurement',
    family: 'temperature',
    existingTopicRef: { category: 'temperature', slug: 'rtd' },
    simulationId: 'rtd-pt100',
    measurementQuantity: 'Temperature (−200 to +850 °C)',
    physicalPhenomenon: 'Metallic electron-phonon resistance increase R(t) = R₀(1 + At + Bt²)',
    inputOutput: { input: 'Temperature (°C)', output: 'Platinum Resistance (Ω)' },
    workingPrincipleSteps: [
      'Process heat diffuses through 316L thermowell wall and MgO insulation into helical platinum sensor.',
      'Rising lattice vibration increases resistance at α = 0.00385 Ω/Ω/°C.',
      '3-wire or 4-wire Kelvin bridge cancels copper field cable resistance cleanly.',
    ],
    relatedIds: ['thermistor', 'thermocouple-k', 'thermowells', 'wheatstone-bridge'],
    equations: [{ label: 'Callendar-Van Dusen Polynomial', latex: 'R(t) = R_0(1 + A t + B t^2)' }],
  }),
  adaptGlbToCanonical(CAD_MODELS['thermocouple-k'], {
    abbreviation: 'Type-K TC',
    categoryLabel: 'Temperature Measurement',
    family: 'temperature',
    existingTopicRef: { category: 'temperature', slug: 'thermocouple' },
    simulationId: 'thermocouple-k',
    measurementQuantity: 'Temperature (−200 to +1260 °C)',
    physicalPhenomenon: 'Seebeck thermoelectric voltage gradient across Chromel/Alumel alloy junction',
    inputOutput: { input: 'Hot − Cold Junction ΔT (°C)', output: 'Seebeck EMF (mV)' },
    workingPrincipleSteps: [
      'Hot welded Chromel(+)/Alumel(−) bead develops differential electron diffusion EMF along temperature gradient.',
      'Compensating terminal block preserves thermoelectric alloy homogeneity out to transmitter CJC sensor.',
      'Electronics measures T_cj locally and adds V(T_cj, 0 °C) mathematically (Cold-Junction Compensation)!',
    ],
    relatedIds: ['rtd-pt100', 'thermistor', 'optical-pyrometers'],
    equations: [{ label: 'Law of Intermediate Temperatures', latex: 'E(T_h, 0^\\circ\\text{C}) = E(T_h, T_{cj}) + E(T_{cj}, 0^\\circ\\text{C})' }],
  }),
  adaptGlbToCanonical(CAD_MODELS['dp-transmitter'], {
    abbreviation: 'Smart DP Tx',
    categoryLabel: 'Pressure Measurement',
    family: 'pressure-force',
    existingTopicRef: { category: 'pressure', slug: 'pressure-transmitters' },
    simulationId: 'dp-transmitter',
    measurementQuantity: 'Differential Pressure ΔP (kPa / bar)',
    physicalPhenomenon: 'Dual-isolator silicone oil hydraulic coupling across smart resonant/capacitive sensor bridge',
    inputOutput: { input: 'Differential ΔP (kPa)', output: '4–20 mA / HART Digital PV' },
    workingPrincipleSteps: [
      '3-valve isolation/equalize manifold connects process HP and LP impulse lines to bolted flanges.',
      'Corrugated Hastelloy isolating diaphragms transfer pressure cleanly through silicone fill to sensor capsule.',
      '24-bit Sigma-Delta ADC compensates static line pressure & outputs linearized/√ΔP 4–20 mA + HART!',
    ],
    relatedIds: ['capacitive-sensors', 'orifice-plate', 'differential-pressure'],
    equations: [{ label: '4–20 mA Differential Scaling', latex: 'I_{\\text{mA}} = 4 + 16\\,\\frac{\\Delta P}{\\Delta P_{\\text{span}}}' }],
  }),
  adaptGlbToCanonical(CAD_MODELS['orifice-plate'], {
    abbreviation: 'Orifice Plate',
    categoryLabel: 'Flow Measurement',
    family: 'flow',
    existingTopicRef: { category: 'flow', slug: 'orifice-plate' },
    simulationId: 'orifice-plate',
    measurementQuantity: 'Liquid / Gas / Steam Volumetric Flow (m³/h)',
    physicalPhenomenon: 'Bernoulli continuity constriction forming vena-contracta ΔP proportional to Q²',
    inputOutput: { input: 'Volumetric Flow Q (m³/h)', output: 'Flange-Tap ΔP (kPa)' },
    workingPrincipleSteps: [
      'Fluid stream accelerates through sharp concentric bore hole (β = d/D) reaching peak velocity at vena contracta.',
      'Static pressure dips sharply proportionally to ρv²/2 across upstream/downstream flange taps.',
      'Smart DP transmitter extracts square root Q ∝ √ΔP into linear flow!',
    ],
    relatedIds: ['venturi-meter', 'flow-nozzle', 'dp-transmitter'],
    equations: [{ label: 'ISO 5167 Flow Equation', latex: 'Q = \\frac{C_d A_2}{\\sqrt{1-\\beta^4}}\\sqrt{\\frac{2\\Delta P}{\\rho}}' }],
  }),
];

const RAW_CANONICAL_ENTRIES: CanonicalInstrumentEntry[] = [
  ...GLB_ENTRIES,
  ...PROCESS_INSTRUMENT_ENTRIES,
  ...ELECTRICAL_ANALYTICAL_CONTROL_ENTRIES,
];

// Inject reverse curriculum links automatically from NITJ_CURRICULUM_SUBJECTS concepts
export const CANONICAL_INSTRUMENTS: CanonicalInstrumentEntry[] = (() => {
  const byId = new Map<string, CanonicalInstrumentEntry>(
    RAW_CANONICAL_ENTRIES.map((e) => [e.id, { ...e, curriculumLinks: [] }]),
  );

  for (const subj of NITJ_CURRICULUM_SUBJECTS) {
    for (const unit of subj.units) {
      for (const concept of unit.topics) {
        for (const li of concept.linkedInstruments ?? []) {
          const target = byId.get(li.id);
          if (!target) continue;
          const already = target.curriculumLinks.some(
            (cl) => cl.subjectId === subj.id && cl.conceptId === concept.id,
          );
          if (!already) {
            target.curriculumLinks.push({
              semesterLabel: subj.displaySemesterLabel,
              subjectId: subj.id,
              subjectCode: subj.code,
              subjectName: subj.shortName,
              unitNumber: unit.unitNumber,
              unitTitle: unit.title,
              conceptId: concept.id,
              conceptTitle: concept.title,
            });
          }
        }
      }
    }
  }

  return Array.from(byId.values());
})();

export const CANONICAL_INSTRUMENT_MAP = new Map<string, CanonicalInstrumentEntry>(
  CANONICAL_INSTRUMENTS.map((e) => [e.id, e]),
);

export function getCanonicalInstrument(id: string | undefined): CanonicalInstrumentEntry | undefined {
  if (!id) return undefined;
  return CANONICAL_INSTRUMENT_MAP.get(id);
}

export function findCanonicalForTopic(
  category: string | undefined,
  slug: string | undefined,
): CanonicalInstrumentEntry | undefined {
  if (!category || !slug) return undefined;
  return CANONICAL_INSTRUMENTS.find(
    (e) => e.existingTopicRef?.category === category && e.existingTopicRef?.slug === slug,
  );
}

export interface CoverageStats {
  totalInventoryEntries: number;
  physicalHardwareCount: number;
  conceptDomainCount: number;
  dedicated3DModels: number;
  simulationsCompleted: number;
  pendingHardwareModels: number;
  educationalApproximations: number;
  conceptsLinkedCount: number;
}

export function getRegistryCoverageStats(): CoverageStats {
  const physical = CANONICAL_INSTRUMENTS.filter(
    (e) => e.classification !== 'concept-domain',
  );
  const concepts = CANONICAL_INSTRUMENTS.filter(
    (e) => e.classification === 'concept-domain',
  );
  const models3D = CANONICAL_INSTRUMENTS.filter((e) => e.hasDedicated3D);
  const sims = CANONICAL_INSTRUMENTS.filter((e) => e.hasSimulation);
  const approxSims = sims.filter(
    (e) => e.simulationId && INSTRUMENT_SIMULATIONS[e.simulationId]?.isEducationalApproximation,
  );
  const linkedConceptKeys = new Set<string>();
  for (const inst of CANONICAL_INSTRUMENTS) {
    for (const cl of inst.curriculumLinks) {
      linkedConceptKeys.add(`${cl.subjectId}:${cl.conceptId}`);
    }
  }

  return {
    totalInventoryEntries: CANONICAL_INSTRUMENTS.length,
    physicalHardwareCount: physical.length,
    conceptDomainCount: concepts.length,
    dedicated3DModels: models3D.length,
    simulationsCompleted: sims.length,
    pendingHardwareModels: physical.length - models3D.length,
    educationalApproximations: approxSims.length,
    conceptsLinkedCount: linkedConceptKeys.size,
  };
}
