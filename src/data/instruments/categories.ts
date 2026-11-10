import type { InstrumentCategoryId, InstrumentTopic } from '@/types/engineering';

export interface CategoryMeta {
  id: InstrumentCategoryId;
  label: string;
  shortLabel: string;
  eyebrow: string;
  summary: string;
  standards: string;
}

export const INSTRUMENT_CATEGORIES: CategoryMeta[] = [
  {
    id: 'temperature',
    label: 'Temperature Measurement',
    shortLabel: 'Temperature',
    eyebrow: 'THERMAL SENSING · IEC 60751 / IEC 60584',
    summary: 'Contact resistive, thermoelectric, bimetallic, and non-contact optical/infrared thermal sensors with thermowell protection and transmitters.',
    standards: 'IEC 60751, IEC 60584, ASME PTC 19.3 TW',
  },
  {
    id: 'pressure',
    label: 'Pressure Measurement',
    shortLabel: 'Pressure',
    eyebrow: 'FLUID FORCE & DP · ASME B40.100 / IEC 61298',
    summary: 'Elastic mechanical gauges, electrical strain/capacitive/piezo sensors, pressure domains, and smart differential pressure transmitters.',
    standards: 'ASME B40.100, EN 837, IEC 61298',
  },
  {
    id: 'flow',
    label: 'Flow Measurement',
    shortLabel: 'Flow',
    eyebrow: 'VOLUMETRIC & MASS FLOW · ISO 5167 / ASME MFC',
    summary: 'Differential pressure primary elements, variable area meters, electromagnetic, ultrasonic, turbine, vortex, Coriolis, and thermal mass meters.',
    standards: 'ISO 5167, ISO 20456, ASME MFC-11',
  },
  {
    id: 'level',
    label: 'Level Measurement',
    shortLabel: 'Level',
    eyebrow: 'INVENTORY & INTERFACE · HYDROSTATIC / RADAR',
    summary: 'Buoyancy floats and displacers, hydrostatic DP legs, capacitance probes, ultrasonic, non-contact radar, guided wave radar, and radiometric gauges.',
    standards: 'API MPMS Ch. 3, IEC 61511',
  },
  {
    id: 'analytical',
    label: 'Analytical Instrumentation',
    shortLabel: 'Analytical',
    eyebrow: 'COMPOSITION & ELECTROCHEMISTRY · NERNST / NDIR',
    summary: 'Inline liquid electrochemistry (pH, conductivity, DO, turbidity) and gas/stream analyzers (zirconia O₂, paramagnetic, NDIR, gas chromatography).',
    standards: 'ASTM D1293, EPA 180.1, ISO 6974',
  },
  {
    id: 'final-control',
    label: 'Final Control Elements',
    shortLabel: 'Final Control',
    eyebrow: 'ACTUATION & THROTTLING · ISA S75.01',
    summary: 'Control valve trim styles, pneumatic/electric actuators, smart digital positioners, I/P transducers, solenoids, flow characteristics, and fail-safe action.',
    standards: 'IEC 60534, ISA S75.01, NAMUR NE',
  },
  {
    id: 'signal-conditioning',
    label: 'Signal Conditioning',
    shortLabel: 'Signal Conditioning',
    eyebrow: 'BRIDGES, AMPS & FIELD LOOPS · 4–20 MA / HART',
    summary: 'Precision Wheatstone bridges, instrumentation amplifiers, op-amps, anti-aliasing filters, galvanic isolators, ADC/DAC conversion, 4–20 mA loops, and HART FSK.',
    standards: 'NAMUR NE43, HART 7 (IEC 61158), IEEE 754',
  },
];

export type CompactTopicInput = {
  slug: string;
  category: InstrumentCategoryId;
  categoryLabel: string;
  title: string;
  shortTitle?: string;
  subtitle: string;
  standardRef: string;
  has3DModel?: boolean;
  modelId?: InstrumentTopic['modelId'];
  schematicKind: InstrumentTopic['schematicKind'];
  definition: string;
  purpose: string;
  workingPrinciple: string;
  principleSteps: string[];
  constructionSummary: string;
  assemblyArchitecture: string;
  internalComponents: InstrumentTopic['internalComponents'];
  typesAndClassification: InstrumentTopic['typesAndClassification'];
  equations: InstrumentTopic['equations'];
  characteristicCurve: InstrumentTopic['characteristicCurve'];
  specifications: InstrumentTopic['specifications'];
  measurementRange: InstrumentTopic['measurementRange'];
  accuracyAndSensitivity: InstrumentTopic['accuracyAndSensitivity'];
  advantages: string[];
  limitations: string[];
  applications: InstrumentTopic['applications'];
  calibration: InstrumentTopic['calibration'];
  installation: InstrumentTopic['installation'];
  troubleshooting: InstrumentTopic['troubleshooting'];
  manufacturers: InstrumentTopic['manufacturers'];
  comparisons: InstrumentTopic['comparisons'];
  interviewQuestions: InstrumentTopic['interviewQuestions'];
  numericalProblems: InstrumentTopic['numericalProblems'];
  quickRevisionNotes: string[];
  sources: InstrumentTopic['sources'];
};

export function createTopic(input: CompactTopicInput): InstrumentTopic {
  return {
    id: `${input.category}:${input.slug}`,
    slug: input.slug,
    category: input.category,
    categoryLabel: input.categoryLabel,
    title: input.title,
    shortTitle: input.shortTitle ?? input.title,
    subtitle: input.subtitle,
    standardRef: input.standardRef,
    has3DModel: input.has3DModel,
    modelId: input.modelId,
    schematicKind: input.schematicKind,
    isFlagship: Boolean(input.has3DModel),
    definition: input.definition,
    purposeAndPrinciple: {
      purpose: input.purpose,
      workingPrinciple: input.workingPrinciple,
      principleSteps: input.principleSteps,
    },
    construction: {
      summary: input.constructionSummary,
      assemblyArchitecture: input.assemblyArchitecture,
    },
    internalComponents: input.internalComponents,
    typesAndClassification: input.typesAndClassification,
    equations: input.equations,
    characteristicCurve: input.characteristicCurve,
    specifications: input.specifications,
    measurementRange: input.measurementRange,
    accuracyAndSensitivity: input.accuracyAndSensitivity,
    advantages: input.advantages,
    limitations: input.limitations,
    applications: input.applications,
    calibration: input.calibration,
    installation: input.installation,
    troubleshooting: input.troubleshooting,
    manufacturers: input.manufacturers,
    comparisons: input.comparisons,
    interviewQuestions: input.interviewQuestions,
    numericalProblems: input.numericalProblems,
    quickRevisionNotes: input.quickRevisionNotes,
    sources: input.sources,
  };
}

