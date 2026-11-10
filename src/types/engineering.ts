export type InstrumentCategoryId =
  | 'temperature'
  | 'pressure'
  | 'flow'
  | 'level'
  | 'analytical'
  | 'final-control'
  | 'signal-conditioning';

export interface EquationEntry {
  title: string;
  latex: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  derivationSteps: string[];
}

export interface CharacteristicSeries {
  name: string;
  color: string;
  points: { x: number; y: number }[];
}

export interface CharacteristicCurveData {
  title: string;
  subtitle: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  series: CharacteristicSeries[];
}

export interface InternalComponentSpec {
  partCode: string;
  name: string;
  material: string;
  function: string;
  failureMode: string;
}

export interface TypeClassification {
  type: string;
  summary: string;
  typicalRange: string;
  accuracy: string;
  bestFor: string;
}

export interface SpecificationRow {
  parameter: string;
  value: string;
  standardOrNote: string;
}

export interface IndustrialApplication {
  industry: string;
  service: string;
  loopTagExample: string;
  engineeringNote: string;
}

export interface TroubleshootingEntry {
  symptom: string;
  probableCause: string;
  diagnosticCheck: string;
  correctiveAction: string;
}

export interface ManufacturerProduct {
  vendor: string;
  modelSeries: string;
  notes: string;
  sourceLabel: string;
  sourceUrl?: string;
  verificationStatus: 'sourced-reference' | 'editorial-verification';
}

export interface ComparisonRow {
  parameter: string;
  thisInstrument: string;
  peerName: string;
  peerValue: string;
  engineeringTakeaway: string;
}

export interface TopicInterviewQA {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry-Oriented';
  question: string;
  answer: string;
}

export interface NumericalProblem {
  title: string;
  statement: string;
  given: string[];
  steps: string[];
  answer: string;
}

export interface SourceCitation {
  label: string;
  standardOrDoc: string;
  url?: string;
}

export type SchematicKind =
  | 'rtd-3wire'
  | 'thermocouple-cjc'
  | 'dp-transmitter'
  | 'orifice-flow'
  | 'control-valve-loop'
  | 'loop-4-20ma'
  | 'wheatstone-bridge'
  | 'level-dp'
  | 'ph-electrode'
  | 'generic-transducer';

export interface InstrumentTopic {
  id: string;
  slug: string;
  category: InstrumentCategoryId;
  categoryLabel: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  standardRef: string;
  has3DModel?: boolean;
  modelId?: 'rtd-pt100' | 'thermocouple-k' | 'dp-transmitter' | 'orifice-plate';
  schematicKind: SchematicKind;
  isFlagship?: boolean;
  definition: string;
  purposeAndPrinciple: {
    purpose: string;
    workingPrinciple: string;
    principleSteps: string[];
  };
  construction: {
    summary: string;
    assemblyArchitecture: string;
  };
  internalComponents: InternalComponentSpec[];
  typesAndClassification: TypeClassification[];
  equations: EquationEntry[];
  characteristicCurve: CharacteristicCurveData;
  specifications: SpecificationRow[];
  measurementRange: {
    typicalSpan: string;
    extremeLimits: string;
    overrangeProtection: string;
  };
  accuracyAndSensitivity: {
    accuracyClass: string;
    sensitivity: string;
    repeatability: string;
    responseTime: string;
  };
  advantages: string[];
  limitations: string[];
  applications: IndustrialApplication[];
  calibration: {
    referenceStandard: string;
    equipmentRequired: string[];
    procedureSteps: string[];
    acceptanceCriteria: string;
  };
  installation: {
    mechanicalRules: string[];
    electricalOrImpulseRules: string[];
    commonMistakes: string[];
  };
  troubleshooting: TroubleshootingEntry[];
  manufacturers: ManufacturerProduct[];
  comparisons: ComparisonRow[];
  interviewQuestions: TopicInterviewQA[];
  numericalProblems: NumericalProblem[];
  quickRevisionNotes: string[];
  sources: SourceCitation[];
}

export interface AcademicUnit {
  unitNumber: number;
  title: string;
  hours: number;
  topics: {
    name: string;
    subtopics: string[];
    linkedRoute?: string;
  }[];
}

export interface AcademicSubject {
  id: string;
  semester: number;
  code: string;
  name: string;
  credits: number;
  category: 'Core ICE' | 'Electronics' | 'Control & Automation' | 'Foundations';
  overview: string;
  completed?: boolean;
  isCustom?: boolean;
  units: AcademicUnit[];
}

export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry-Oriented';
export type QuestionKind = 'MCQ' | 'Conceptual' | 'Numerical' | 'Practical' | 'Scenario' | 'Troubleshooting';

export interface BankQuestion {
  id: string;
  difficulty: QuestionDifficulty;
  kind: QuestionKind;
  subject: string;
  topicSlug?: string;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  numericExpected?: number;
  numericUnit?: string;
  numericTolerance?: number;
  modelAnswer: string;
  engineeringPrinciple: string;
  formulaLatex?: string;
  sourceTag: 'Core Engineering Principle' | 'Standard Industrial Practice' | 'Editorial Practice Item';
}

export interface BookmarkItem {
  id: string;
  itemType: 'instrument' | 'subject' | 'question' | 'tool' | 'module';
  title: string;
  subtitle: string;
  route: string;
  createdAt: string;
}

export interface QuestionAttempt {
  questionId: string;
  isCorrect: boolean;
  selectedOption?: number;
  userNumericAnswer?: number;
  answeredAt: string;
}

