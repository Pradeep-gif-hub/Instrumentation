import type { CanonicalInstrumentEntry } from '@/types/cad';
import { CANONICAL_INSTRUMENTS, CANONICAL_INSTRUMENT_MAP } from './instrumentRegistry';
import { NITJ_SUBJECT_MAP } from './curriculum';

export type TopicFamilyKey =
  | 'temperature'
  | 'pressure'
  | 'flow'
  | 'level'
  | 'electrical'
  | 'bridges'
  | 'analytical-optical'
  | 'control-actuators'
  | 'sensors-motion'
  | 'embedded-digital';

export type InstrumentTabKey = 'simple' | 'theory' | '3d' | 'sim' | 'interview';

export interface TopicFamilyMeta {
  key: TopicFamilyKey;
  label: string;
  shortLabel: string;
}

export const TOPIC_FAMILIES: TopicFamilyMeta[] = [
  { key: 'temperature', label: 'Temperature', shortLabel: 'Temperature' },
  { key: 'pressure', label: 'Pressure', shortLabel: 'Pressure' },
  { key: 'flow', label: 'Flow', shortLabel: 'Flow' },
  { key: 'level', label: 'Level', shortLabel: 'Level' },
  { key: 'electrical', label: 'Electrical', shortLabel: 'Electrical' },
  { key: 'bridges', label: 'Bridges', shortLabel: 'Bridges' },
  { key: 'analytical-optical', label: 'Analytical & Optical', shortLabel: 'Analytical' },
  { key: 'control-actuators', label: 'Control & Actuators', shortLabel: 'Control' },
  { key: 'sensors-motion', label: 'Sensors & Motion', shortLabel: 'Sensors/Motion' },
  { key: 'embedded-digital', label: 'Embedded & Digital', shortLabel: 'Embedded/DSP' },
];

export const TOPIC_FAMILY_MAP = new Map<TopicFamilyKey, TopicFamilyMeta>(
  TOPIC_FAMILIES.map((f) => [f.key, f]),
);

export const PRIMARY_BROWSE_FAMILIES: TopicFamilyMeta[] = TOPIC_FAMILIES.filter((f) =>
  ['temperature', 'pressure', 'flow', 'level', 'electrical', 'sensors-motion'].includes(f.key),
);

export const MORE_BROWSE_FAMILIES: TopicFamilyMeta[] = TOPIC_FAMILIES.filter((f) =>
  ['bridges', 'analytical-optical', 'control-actuators', 'embedded-digital'].includes(f.key),
);

export interface LearnSemesterMeta {
  key: 'sem3' | 'sem4' | 'sem5' | 'additional';
  label: string;
  subjectIds: string[];
}

export const LEARN_SEMESTERS: LearnSemesterMeta[] = [
  {
    key: 'sem3',
    label: 'Semester 3',
    subjectIds: ['nitj-sem3-tsc', 'nitj-sem3-ade', 'nitj-sem3-emmi', 'nitj-sem3-nm', 'nitj-sem3-ct'],
  },
  {
    key: 'sem4',
    label: 'Semester 4',
    subjectIds: ['nitj-sem4-control', 'nitj-sem4-ims', 'nitj-sem4-machines', 'nitj-sem4-sp'],
  },
  {
    key: 'sem5',
    label: 'Semester 5',
    subjectIds: ['nitj-sem5-mcs', 'nitj-sem5-aoi', 'nitj-sem5-pdc', 'nitj-sem5-mpes'],
  },
  {
    key: 'additional',
    label: 'Extra: Testing & calibration',
    subjectIds: ['nitj-supp-cal'],
  },
];

export interface TreeSubjectMeta {
  id: string;
  code: string;
  name: string;
  shortName: string;
  semesterKey: 'sem3' | 'sem4' | 'sem5' | 'additional';
  semesterLabel: string;
  badgeText: string;
  isSupplementary?: boolean;
}

/**
 * Official NITJ ICE course order:
 * Semester III -> Semester IV -> Semester V -> Additional Learning (Supplementary).
 */
export const TREE_SUBJECTS: TreeSubjectMeta[] = [
  {
    id: 'nitj-sem3-tsc',
    code: 'ICDC0205',
    name: 'Transducers and Signal Conditioning',
    shortName: 'Transducers & Signal Cond.',
    semesterKey: 'sem3',
    semesterLabel: 'Semester III',
    badgeText: 'Sem III',
  },
  {
    id: 'nitj-sem3-ade',
    code: 'ECDC0213',
    name: 'Analog and Digital Electronics',
    shortName: 'Analog & Digital Electronics',
    semesterKey: 'sem3',
    semesterLabel: 'Semester III',
    badgeText: 'Sem III',
  },
  {
    id: 'nitj-sem3-emmi',
    code: 'ICDC0203',
    name: 'Electrical Measurements and Measuring Instruments',
    shortName: 'Electrical Measurements (EMMI)',
    semesterKey: 'sem3',
    semesterLabel: 'Semester III',
    badgeText: 'Sem III',
  },
  {
    id: 'nitj-sem3-nm',
    code: 'MCDC0203',
    name: 'Numerical Methods',
    shortName: 'Numerical Methods',
    semesterKey: 'sem3',
    semesterLabel: 'Semester III',
    badgeText: 'Sem III',
  },
  {
    id: 'nitj-sem3-ct',
    code: 'VERIFY-CODE',
    name: 'Circuit Theory',
    shortName: 'Circuit Theory',
    semesterKey: 'sem3',
    semesterLabel: 'Semester III',
    badgeText: 'Sem III',
  },
  {
    id: 'nitj-sem4-control',
    code: 'ICDC0206',
    name: 'Control System Engineering',
    shortName: 'Control System Engineering',
    semesterKey: 'sem4',
    semesterLabel: 'Semester IV',
    badgeText: 'Sem IV',
  },
  {
    id: 'nitj-sem4-ims',
    code: 'ICDC0208',
    name: 'Industrial Measurement Systems',
    shortName: 'Industrial Measurement Systems',
    semesterKey: 'sem4',
    semesterLabel: 'Semester IV',
    badgeText: 'Sem IV',
  },
  {
    id: 'nitj-sem4-machines',
    code: 'ICDC0202',
    name: 'Electrical Machines',
    shortName: 'Electrical Machines',
    semesterKey: 'sem4',
    semesterLabel: 'Semester IV',
    badgeText: 'Sem IV',
  },
  {
    id: 'nitj-sem4-sp',
    code: 'ICDC0204',
    name: 'Signal Processing',
    shortName: 'Signal Processing',
    semesterKey: 'sem4',
    semesterLabel: 'Semester IV',
    badgeText: 'Sem IV',
  },
  {
    id: 'nitj-sem5-mcs',
    code: 'ICDC0303',
    name: 'Modern Control System',
    shortName: 'Modern Control System',
    semesterKey: 'sem5',
    semesterLabel: 'Semester V',
    badgeText: 'Sem V',
  },
  {
    id: 'nitj-sem5-aoi',
    code: 'ICDC0305',
    name: 'Analytical and Optical Instrumentation',
    shortName: 'Analytical & Optical Instr.',
    semesterKey: 'sem5',
    semesterLabel: 'Semester V',
    badgeText: 'Sem V',
  },
  {
    id: 'nitj-sem5-pdc',
    code: 'ICDC0307',
    name: 'Process Dynamics and Control',
    shortName: 'Process Dynamics & Control',
    semesterKey: 'sem5',
    semesterLabel: 'Semester V',
    badgeText: 'Sem V',
  },
  {
    id: 'nitj-sem5-mpes',
    code: 'ICDC0301',
    name: 'Microprocessors and Embedded Systems',
    shortName: 'Microprocessors & Embedded',
    semesterKey: 'sem5',
    semesterLabel: 'Semester V',
    badgeText: 'Sem V',
  },
  {
    id: 'nitj-supp-cal',
    code: 'ICMI0303',
    name: 'Testing and Calibration',
    shortName: 'Testing and Calibration',
    semesterKey: 'additional',
    semesterLabel: 'Additional Learning',
    badgeText: 'Supplementary',
    isSupplementary: true,
  },
];

export const TREE_SUBJECT_MAP = new Map<string, TreeSubjectMeta>(
  TREE_SUBJECTS.map((s) => [s.id, s]),
);

interface PlacementRule {
  subjectId: string;
  familyKey: TopicFamilyKey;
  alsoUsedIn?: string[];
}

/**
 * Every canonical instrument belongs to ONE primary Subject and ONE primary Topic Family.
 * Secondary uses render as compact "Also used in" links rather than duplicate leaves.
 */
export const PRIMARY_PLACEMENT: Record<string, PlacementRule> = {
  // === Sem III: ICDC0205 Transducers & Signal Conditioning (23) ===
  thermistor: { subjectId: 'nitj-sem3-tsc', familyKey: 'temperature' },
  'bimetallic-thermometers': { subjectId: 'nitj-sem3-tsc', familyKey: 'temperature' },
  'filled-system-thermometer': { subjectId: 'nitj-sem3-tsc', familyKey: 'temperature', alsoUsedIn: ['nitj-sem4-ims'] },
  'strain-gauge': { subjectId: 'nitj-sem3-tsc', familyKey: 'pressure' },
  'load-cell': { subjectId: 'nitj-sem3-tsc', familyKey: 'pressure', alsoUsedIn: ['nitj-sem4-ims'] },
  'torque-transducer': { subjectId: 'nitj-sem3-tsc', familyKey: 'pressure', alsoUsedIn: ['nitj-sem4-ims'] },
  'capacitive-sensors': { subjectId: 'nitj-sem3-tsc', familyKey: 'pressure' },
  'piezoelectric-sensors': { subjectId: 'nitj-sem3-tsc', familyKey: 'pressure' },
  lvdt: { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion' },
  'potentiometer-transducer': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem4-control'] },
  'variable-inductance': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion' },
  'capacitive-displacement': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion' },
  'optical-encoder': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem4-control'] },
  accelerometer: { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion' },
  'velocity-vibration-pickup': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion' },
  'hall-effect-sensor': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-emmi'] },
  'magnetostrictive-transducer': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion' },
  'optical-fiber-sensor': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem5-aoi'] },
  'photo-detectors': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem5-aoi'] },
  'instrumentation-amplifier': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-ade'] },
  'isolation-amplifiers': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem4-ims'] },
  '4-20-ma': { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem4-ims', 'nitj-sem5-pdc'] },
  hart: { subjectId: 'nitj-sem3-tsc', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem4-ims', 'nitj-sem5-pdc'] },

  // === Sem III: ECDC0213 Analog & Digital Electronics (3) ===
  'operational-amplifier': { subjectId: 'nitj-sem3-ade', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-tsc'] },
  filters: { subjectId: 'nitj-sem3-ade', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-tsc', 'nitj-sem4-ims'] },
  'adc-and-dac': { subjectId: 'nitj-sem3-ade', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-tsc'] },

  // === Sem III: ICDC0203 EMMI (15) ===
  'pmmc-instrument': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'moving-iron-instrument': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'electrodynamometer-wattmeter': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'induction-energy-meter': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'digital-multimeter': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical', alsoUsedIn: ['nitj-sem3-ade', 'nitj-supp-cal'] },
  'cro-crt': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical', alsoUsedIn: ['nitj-supp-cal'] },
  'frequency-phase-meter': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'megger-insulation-tester': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  fluxmeter: { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'current-transformer': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'potential-transformer': { subjectId: 'nitj-sem3-emmi', familyKey: 'electrical' },
  'wheatstone-bridge': { subjectId: 'nitj-sem3-emmi', familyKey: 'bridges', alsoUsedIn: ['nitj-sem3-tsc'] },
  'kelvin-double-bridge': { subjectId: 'nitj-sem3-emmi', familyKey: 'bridges' },
  'ac-impedance-bridge': { subjectId: 'nitj-sem3-emmi', familyKey: 'bridges' },
  'schering-wien-bridge': { subjectId: 'nitj-sem3-emmi', familyKey: 'bridges' },

  // === Sem IV: ICDC0206 Control System Engineering (3) ===
  tachogenerator: { subjectId: 'nitj-sem4-control', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-tsc'] },
  'stepper-motor': { subjectId: 'nitj-sem4-control', familyKey: 'control-actuators' },
  servomotor: { subjectId: 'nitj-sem4-control', familyKey: 'control-actuators' },

  // === Sem IV: ICDC0208 Industrial Measurement Systems (40) ===
  'rtd-pt100': { subjectId: 'nitj-sem4-ims', familyKey: 'temperature', alsoUsedIn: ['nitj-sem3-tsc', 'nitj-supp-cal'] },
  'thermocouple-k': { subjectId: 'nitj-sem4-ims', familyKey: 'temperature', alsoUsedIn: ['nitj-sem3-tsc', 'nitj-supp-cal'] },
  'optical-pyrometers': { subjectId: 'nitj-sem4-ims', familyKey: 'temperature' },
  'radiation-pyrometers': { subjectId: 'nitj-sem4-ims', familyKey: 'temperature' },
  'infrared-sensors': { subjectId: 'nitj-sem4-ims', familyKey: 'temperature' },
  thermowells: { subjectId: 'nitj-sem4-ims', familyKey: 'temperature', alsoUsedIn: ['nitj-sem3-tsc'] },
  'temperature-transmitters': { subjectId: 'nitj-sem4-ims', familyKey: 'temperature', alsoUsedIn: ['nitj-sem3-tsc'] },

  'dp-transmitter': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure', alsoUsedIn: ['nitj-sem3-tsc', 'nitj-supp-cal'] },
  'bourdon-tube': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure', alsoUsedIn: ['nitj-sem3-tsc'] },
  diaphragm: { subjectId: 'nitj-sem4-ims', familyKey: 'pressure', alsoUsedIn: ['nitj-sem3-tsc'] },
  bellows: { subjectId: 'nitj-sem4-ims', familyKey: 'pressure', alsoUsedIn: ['nitj-sem3-tsc'] },
  'strain-gauge-pressure-sensors': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure' },
  manometers: { subjectId: 'nitj-sem4-ims', familyKey: 'pressure', alsoUsedIn: ['nitj-sem3-tsc', 'nitj-sem5-pdc'] },
  'vacuum-gauges': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure' },
  'absolute-pressure': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure' },
  'gauge-pressure': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure' },
  'differential-pressure-concept': { subjectId: 'nitj-sem4-ims', familyKey: 'pressure' },

  'orifice-plate': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'venturi-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'flow-nozzle': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  rotameter: { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'electromagnetic-flow-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'ultrasonic-flow-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'turbine-flow-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'vortex-flow-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'coriolis-flow-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'thermal-mass-flow-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'pitot-tube': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },
  'positive-displacement-flowmeter': { subjectId: 'nitj-sem4-ims', familyKey: 'flow' },

  float: { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  displacer: { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  'differential-pressure': { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  capacitive: { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  ultrasonic: { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  radar: { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  'guided-wave-radar': { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  'nuclear-level-measurement': { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  'humidity-sensor': { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  viscometer: { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  'density-meter': { subjectId: 'nitj-sem4-ims', familyKey: 'level', alsoUsedIn: ['nitj-sem5-aoi'] },

  // === Sem IV: ICDC0204 Signal Processing (4) ===
  'dsp-processor-board': { subjectId: 'nitj-sem4-sp', familyKey: 'embedded-digital', alsoUsedIn: ['nitj-sem5-mpes'] },
  'sampling-quantizer': { subjectId: 'nitj-sem4-sp', familyKey: 'embedded-digital', alsoUsedIn: ['nitj-sem3-ade'] },
  'dft-fft-analyzer': { subjectId: 'nitj-sem4-sp', familyKey: 'embedded-digital', alsoUsedIn: ['nitj-sem5-aoi'] },
  'fir-iir-filter': { subjectId: 'nitj-sem4-sp', familyKey: 'embedded-digital', alsoUsedIn: ['nitj-sem3-ade'] },

  // === Sem V: ICDC0303 Modern Control System (2) ===
  'state-space-feedback': { subjectId: 'nitj-sem5-mcs', familyKey: 'control-actuators', alsoUsedIn: ['nitj-sem4-control'] },
  'lqr-optimal-regulator': { subjectId: 'nitj-sem5-mcs', familyKey: 'control-actuators' },

  // === Sem V: ICDC0305 Analytical & Optical Instrumentation (17) ===
  'uv-vis-spectrophotometer': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical', alsoUsedIn: ['nitj-supp-cal'] },
  colorimeter: { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'ftir-spectrometer': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'flame-aas-spectrometer': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  chromatography: { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'hplc-ic-system': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'mass-spectrometer': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  ph: { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical', alsoUsedIn: ['nitj-sem3-tsc', 'nitj-supp-cal'] },
  conductivity: { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'dissolved-oxygen': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  turbidity: { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'oxygen-analyzers': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'gas-analyzers': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'refractometer-polarimeter': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'nmr-photoacoustic': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'monochromator-optics': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },
  'electrochemical-gas-sensor': { subjectId: 'nitj-sem5-aoi', familyKey: 'analytical-optical' },

  // === Sem V: ICDC0301 Microprocessors & Embedded Systems (11) ===
  'intel-8085': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'intel-8086': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'intel-8051': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'ic-8251': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'ic-8253': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'ic-8255': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'ic-8279': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'arduino-uno': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital', alsoUsedIn: ['nitj-sem5-aoi'] },
  'raspberry-pi': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'lcd-display-16x2': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },
  'seven-segment-display': { subjectId: 'nitj-sem5-mpes', familyKey: 'embedded-digital' },

  // === Sem V: ICDC0307 Process Dynamics & Control (9) ===
  'control-valves': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  actuators: { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  positioners: { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  'ip-converters': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  'solenoid-valves': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  'spool-valve': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  'process-controller': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators', alsoUsedIn: ['nitj-sem4-control'] },
  'valve-characteristics': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  'fail-open-and-fail-close': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators' },
  'vibrating-fork-level': { subjectId: 'nitj-sem4-ims', familyKey: 'level' },
  'mass-flow-controller': { subjectId: 'nitj-sem4-ims', familyKey: 'flow', alsoUsedIn: ['nitj-sem5-pdc'] },
  'variable-frequency-drive': { subjectId: 'nitj-sem5-pdc', familyKey: 'control-actuators', alsoUsedIn: ['nitj-sem4-machines'] },

  // === Additional Learning: ICMI0303 Testing & Calibration — Supplementary (3 primary + cross-refs) ===
  'deadweight-tester': { subjectId: 'nitj-supp-cal', familyKey: 'pressure', alsoUsedIn: ['nitj-sem4-ims'] },
  'dry-well-calibrator': { subjectId: 'nitj-supp-cal', familyKey: 'temperature', alsoUsedIn: ['nitj-sem4-ims'] },
  'process-loop-calibrator': { subjectId: 'nitj-supp-cal', familyKey: 'sensors-motion', alsoUsedIn: ['nitj-sem3-emmi', 'nitj-sem4-ims'] },
};

export function getCanonicalInstrumentUrl(id: string, tab?: InstrumentTabKey): string {
  if (!tab || tab === 'simple') return `/instrument/${id}`;
  return `/instrument/${id}?tab=${tab}`;
}

export interface CanonicalPathInfo {
  entry: CanonicalInstrumentEntry;
  subject: TreeSubjectMeta;
  family: TopicFamilyMeta;
  alsoUsedInSubjects: TreeSubjectMeta[];
}

export function resolveCanonicalPath(id: string | undefined): CanonicalPathInfo | undefined {
  if (!id) return undefined;
  const entry = CANONICAL_INSTRUMENT_MAP.get(id);
  if (!entry) return undefined;

  const rule = PRIMARY_PLACEMENT[entry.id];
  const subject = (rule && TREE_SUBJECT_MAP.get(rule.subjectId)) ?? TREE_SUBJECTS[4];
  const family = (rule && TOPIC_FAMILY_MAP.get(rule.familyKey)) ?? TOPIC_FAMILIES[0];

  const secondarySet = new Set<string>(rule?.alsoUsedIn ?? []);
  for (const cl of entry.curriculumLinks) {
    if (cl.subjectId !== subject.id && TREE_SUBJECT_MAP.has(cl.subjectId)) {
      secondarySet.add(cl.subjectId);
    }
  }
  const alsoUsedInSubjects = Array.from(secondarySet)
    .map((sid) => TREE_SUBJECT_MAP.get(sid))
    .filter((s): s is TreeSubjectMeta => Boolean(s));

  return { entry, subject, family, alsoUsedInSubjects };
}

export interface TreeFamilyNode {
  family: TopicFamilyMeta;
  instruments: CanonicalInstrumentEntry[];
}

export interface TreeSubjectNode {
  subject: TreeSubjectMeta;
  totalPrimaryCount: number;
  families: TreeFamilyNode[];
  alsoUsedInInstruments: CanonicalInstrumentEntry[];
}

export function buildUnifiedNavigationTree(options?: {
  familyFilter?: TopicFamilyKey | 'all';
  only3D?: boolean;
}): TreeSubjectNode[] {
  const familyFilter = options?.familyFilter ?? 'all';
  const only3D = options?.only3D ?? false;

  return TREE_SUBJECTS.map((subject) => {
    const families: TreeFamilyNode[] = [];

    for (const family of TOPIC_FAMILIES) {
      if (familyFilter !== 'all' && family.key !== familyFilter) continue;

      const matched = CANONICAL_INSTRUMENTS.filter((inst) => {
        const rule = PRIMARY_PLACEMENT[inst.id];
        if (!rule) return false;
        if (rule.subjectId !== subject.id || rule.familyKey !== family.key) return false;
        if (only3D && !inst.hasDedicated3D) return false;
        return true;
      });

      if (matched.length > 0) {
        families.push({ family, instruments: matched });
      }
    }

    const totalPrimaryCount = families.reduce((acc, f) => acc + f.instruments.length, 0);

    // Secondary "Also used in" references placed under this subject cleanly without duplicating leaves
    const alsoUsedInInstruments = CANONICAL_INSTRUMENTS.filter((inst) => {
      const rule = PRIMARY_PLACEMENT[inst.id];
      if (!rule || rule.subjectId === subject.id) return false;
      if (familyFilter !== 'all' && rule.familyKey !== familyFilter) return false;
      if (only3D && !inst.hasDedicated3D) return false;

      const secondaryHit =
        rule.alsoUsedIn?.includes(subject.id) ||
        inst.curriculumLinks.some((cl) => cl.subjectId === subject.id);
      return Boolean(secondaryHit);
    });

    return {
      subject,
      totalPrimaryCount,
      families,
      alsoUsedInInstruments,
    };
  });
}

export interface OverviewSemesterCardMeta {
  key: 'sem3' | 'sem4' | 'sem5' | 'additional';
  title: string;
  subtitle: string;
  badge: string;
  subjectIds: string[];
  primaryCount: number;
}

export function getOverviewSemesterCards(): OverviewSemesterCardMeta[] {
  const countFor = (semKey: OverviewSemesterCardMeta['key']) =>
    CANONICAL_INSTRUMENTS.filter((inst) => {
      const rule = PRIMARY_PLACEMENT[inst.id];
      const subj = rule ? TREE_SUBJECT_MAP.get(rule.subjectId) : undefined;
      return subj?.semesterKey === semKey;
    }).length;

  return [
    {
      key: 'sem3',
      title: 'Semester III',
      subtitle: 'Transducers (ICDC0205), Electronics (ECDC0213), EMMI (ICDC0203)',
      badge: 'Core Foundation',
      subjectIds: ['nitj-sem3-tsc', 'nitj-sem3-ade', 'nitj-sem3-emmi'],
      primaryCount: countFor('sem3'),
    },
    {
      key: 'sem4',
      title: 'Semester IV',
      subtitle: 'Industrial Measurement Systems (ICDC0208) & Control (ICDC0206)',
      badge: 'Field Instruments',
      subjectIds: ['nitj-sem4-ims', 'nitj-sem4-control'],
      primaryCount: countFor('sem4'),
    },
    {
      key: 'sem5',
      title: 'Semester V',
      subtitle: 'Analytical & Optical (ICDC0305) & Process Control (ICDC0307)',
      badge: 'Analyzers & Valves',
      subjectIds: ['nitj-sem5-aoi', 'nitj-sem5-pdc'],
      primaryCount: countFor('sem5'),
    },
    {
      key: 'additional',
      title: 'Additional Learning',
      subtitle: 'Testing and Calibration (ICMI0303)',
      badge: 'Supplementary',
      subjectIds: ['nitj-supp-cal'],
      primaryCount: countFor('additional'),
    },
  ];
}

export function getLegacyCategoryToFamily(category: string | undefined): TopicFamilyKey | 'all' {
  switch (category) {
    case 'temperature':
      return 'temperature';
    case 'pressure':
      return 'pressure';
    case 'flow':
      return 'flow';
    case 'level':
      return 'level';
    case 'analytical':
      return 'analytical-optical';
    case 'final-control':
      return 'control-actuators';
    case 'signal-conditioning':
      return 'sensors-motion';
    default:
      return 'all';
  }
}

export function getCurriculumSubjectTitle(subjectId: string): string {
  return TREE_SUBJECT_MAP.get(subjectId)?.name ?? NITJ_SUBJECT_MAP.get(subjectId)?.name ?? subjectId;
}

