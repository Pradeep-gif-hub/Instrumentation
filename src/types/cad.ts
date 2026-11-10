export type InstrumentFamilyKey =
  | 'temperature'
  | 'motion'
  | 'pressure-force'
  | 'flow'
  | 'level-props'
  | 'electrical-bridge'
  | 'analytical-optical'
  | 'control-actuator'
  | 'signal-transducer';

export type InventoryClassification =
  | 'standalone-instrument'
  | 'system-setup'
  | 'component-accessory'
  | 'concept-domain';

export interface CadPartMeta {
  id: string;
  code: string;
  name: string;
  material: string;
  description: string;
  function: string;
  interactionNote?: string;
  industrialRelevance: string;
  explodeOffset: [number, number, number];
  anchor: [number, number, number];
  isCutawayShell?: boolean;
}

export interface SimulationParamSpec {
  key: 'primary' | 'secondary';
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface SimulationPoint {
  x: number;
  y: number;
}

export interface SimulationEvalResult {
  outputValue: string;
  outputNumeric: number;
  outputUnit: string;
  secondaryOutput?: string;
  normalizedPrimary: number;
  normalizedSecondary?: number;
  observation: string;
  curve: SimulationPoint[];
  idealCurve?: SimulationPoint[];
  xLabel: string;
  xUnit: string;
  yLabel: string;
  yUnit: string;
}

export interface InstrumentSimulationConfig {
  id: string;
  title: string;
  governingFormulaLatex: string;
  assumptions: string;
  isEducationalApproximation: boolean;
  primaryParam: SimulationParamSpec;
  secondaryParam?: SimulationParamSpec;
  evaluate: (primary: number, secondary: number) => SimulationEvalResult;
}

export interface InstrumentPerformanceSpec {
  accuracy?: string;
  sensitivity?: string;
  precisionOrRepeatability?: string;
  resolution?: string;
  linearity?: string;
  hysteresis?: string;
  responseTime?: string;
  range?: string;
  [metric: string]: string | undefined;
}

export interface CanonicalInstrumentEntry {
  id: string;
  name: string;
  abbreviation?: string;
  categoryLabel: string;
  family: InstrumentFamilyKey;
  classification: InventoryClassification;
  standardRef: string;
  /** Existing route on /instrumentation/:cat/:slug OR /lab/:id */
  primaryRoute: string;
  existingTopicRef?: { category: string; slug: string };
  hasDedicated3D: boolean;
  hasSimulation: boolean;
  sourceType: 'glb' | 'procedural' | 'none';
  glbUrl?: string;
  proceduralKey?: string;
  simulationId?: string;
  supportsExplode: boolean;
  supportsCutaway: boolean;
  hasAnimation: boolean;
  defaultCameraPos: [number, number, number];
  target: [number, number, number];
  disclosure: string;
  overview: string;
  measurementQuantity: string;
  workingPrincipleSteps: string[];
  physicalPhenomenon: string;
  inputOutput: { input: string; output: string };
  constructionSummary: string;
  performance: InstrumentPerformanceSpec;
  practical: {
    industrialApps: string[];
    labApps: string[];
    advantages: string[];
    limitations: string[];
    failureModes: string[];
    calibrationAndMaintenance: string;
  };
  learning: {
    equations: { label: string; latex: string }[];
    vivaQuestions: { q: string; a: string }[];
    relatedInstrumentIds: string[];
  };
  parts: CadPartMeta[];
  curriculumLinks: {
    semesterLabel: string;
    subjectId: string;
    subjectCode: string;
    subjectName: string;
    unitNumber: number;
    unitTitle: string;
    conceptId: string;
    conceptTitle: string;
  }[];
}
