import type {
  CadPartMeta,
  CanonicalInstrumentEntry,
  InstrumentFamilyKey,
  InstrumentPerformanceSpec,
  InventoryClassification,
} from '@/types/cad';

export interface SimplePartSeed {
  id: string;
  code: string;
  name: string;
  material: string;
  function: string;
  anchor: [number, number, number];
  explodeOffset: [number, number, number];
  description?: string;
  interactionNote?: string;
  industrialRelevance?: string;
  isCutawayShell?: boolean;
}

export function p(seed: SimplePartSeed): CadPartMeta {
  return {
    id: seed.id,
    code: seed.code,
    name: seed.name,
    material: seed.material,
    description:
      seed.description ??
      `${seed.name} fabricated from ${seed.material}; integral sub-assembly of this instrument.`,
    function: seed.function,
    interactionNote: seed.interactionNote,
    industrialRelevance:
      seed.industrialRelevance ??
      `Degradation or misalignment of ${seed.name} shifts loop calibration accuracy and dynamic response.`,
    explodeOffset: seed.explodeOffset,
    anchor: seed.anchor,
    isCutawayShell: seed.isCutawayShell,
  };
}

export interface InstrumentEntrySeed {
  id: string;
  name: string;
  abbreviation?: string;
  categoryLabel: string;
  family: InstrumentFamilyKey;
  classification?: InventoryClassification;
  standardRef: string;
  existingTopicRef?: { category: string; slug: string };
  proceduralKey?: string;
  simulationId?: string;
  supportsExplode?: boolean;
  supportsCutaway?: boolean;
  hasAnimation?: boolean;
  defaultCameraPos?: [number, number, number];
  target?: [number, number, number];
  overview: string;
  measurementQuantity: string;
  physicalPhenomenon: string;
  inputOutput: { input: string; output: string };
  workingPrincipleSteps: string[];
  constructionSummary: string;
  performance: InstrumentPerformanceSpec;
  practical: CanonicalInstrumentEntry['practical'];
  learning: CanonicalInstrumentEntry['learning'];
  parts: CadPartMeta[];
}

export function buildProceduralInstrument(seed: InstrumentEntrySeed): CanonicalInstrumentEntry {
  const has3D = Boolean(seed.proceduralKey);
  const route = `/instrument/${seed.id}`;

  return {
    id: seed.id,
    name: seed.name,
    abbreviation: seed.abbreviation,
    categoryLabel: seed.categoryLabel,
    family: seed.family,
    classification: seed.classification ?? 'standalone-instrument',
    standardRef: seed.standardRef,
    primaryRoute: route,
    existingTopicRef: seed.existingTopicRef,
    hasDedicated3D: has3D,
    hasSimulation: Boolean(seed.simulationId),
    sourceType: has3D ? 'procedural' : 'none',
    proceduralKey: seed.proceduralKey,
    simulationId: seed.simulationId,
    supportsExplode: seed.supportsExplode ?? has3D,
    supportsCutaway: seed.supportsCutaway ?? has3D,
    hasAnimation: seed.hasAnimation ?? true,
    defaultCameraPos: seed.defaultCameraPos ?? [2.5, 1.35, 3.0],
    target: seed.target ?? [0, 0, 0],
    disclosure: has3D
      ? `Illustrative Engineering CAD Model · Representative ${seed.standardRef} industrial construction with real-time physics linkage.`
      : `Conceptual Reference Domain · Classified as a non-hardware standard/concept linked to associated physical instruments.`,
    overview: seed.overview,
    measurementQuantity: seed.measurementQuantity,
    workingPrincipleSteps: seed.workingPrincipleSteps,
    physicalPhenomenon: seed.physicalPhenomenon,
    inputOutput: seed.inputOutput,
    constructionSummary: seed.constructionSummary,
    performance: seed.performance,
    practical: seed.practical,
    learning: seed.learning,
    parts: seed.parts,
    curriculumLinks: [],
  };
}

