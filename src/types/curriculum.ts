export type SyllabusStatus =
  | 'official-core'
  | 'core-code-verify'
  | 'supplementary-elective'
  | 'foundation-drive';

export interface ConceptEquation {
  label: string;
  latex: string;
  notes?: string;
}

export interface ConceptNumerical {
  title: string;
  problem: string;
  steps: string[];
  result: string;
}

export interface ConceptAlgorithm {
  flowchartMermaid?: string;
  pseudocode: string[];
  convergenceAndError: string;
}

export interface ConceptInterviewItem {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Scenario';
  question: string;
  answer: string;
  followUpQuestion?: string;
  followUpAnswer?: string;
}

export interface ConceptDetail {
  id: string;
  title: string;
  summary: string;
  explanation: string;
  workingPrinciple: string;
  inputOutput?: { input: string; output: string };
  equations?: ConceptEquation[];
  algorithm?: ConceptAlgorithm;
  mermaidDiagram?: string;
  realWorldApplications: {
    summary: string;
    industries: string[];
    examples: string[];
    companyContexts?: string;
  };
  advantages?: string[];
  limitations?: string[];
  comparison?: { peer: string; takeaway: string };
  troubleshooting?: string[];
  numericals?: ConceptNumerical[];
  interviewItems?: ConceptInterviewItem[];
  crossLinks?: { label: string; targetSubjectId: string; note: string }[];
  linkedPlatformRoute?: string;
  linkedPlatformLabel?: string;
  linkedInstruments?: { id: string; label: string; hasSimulation?: boolean }[];
  isExtension?: boolean;
  verificationFlag?: string;
}

export interface CurriculumUnitDetail {
  unitNumber: number;
  title: string;
  hours: number;
  summary: string;
  isExtension?: boolean;
  topics: ConceptDetail[];
}

export interface SubjectComparisonPair {
  title: string;
  leftName: string;
  rightName: string;
  isEnrichment?: boolean;
  rows: { criterion: string; leftValue: string; rightValue: string }[];
}

export interface SubjectSimulatorQuestion {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Practical Scenario';
  topic: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  answer: string;
  principle: string;
  followUpIfCorrect: string;
  followUpIfReview: string;
  followUpAnswer: string;
}

export interface CurriculumSubjectDetail {
  id: string;
  semester: number | 'additional';
  displaySemesterLabel: string;
  code: string;
  name: string;
  shortName: string;
  credits: number;
  category: 'Core ICE' | 'Electronics' | 'Control & Automation' | 'Foundations' | 'Supplementary';
  syllabusStatus: SyllabusStatus;
  syllabusBadge: string;
  overview: string;
  units: CurriculumUnitDetail[];
  comparisons: SubjectComparisonPair[];
  simulatorQuestions: SubjectSimulatorQuestion[];
}

export interface CrossSemesterPathway {
  id: string;
  title: string;
  chain: { semesterLabel: string; subjectId: string; subjectName: string; concept: string }[];
  prerequisiteConcept: string;
  introducedIn: string;
  developedIn: string;
  industrialApplication: string;
  interviewQuestion: string;
  interviewAnswer: string;
}

