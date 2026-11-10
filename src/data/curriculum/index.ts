import type { CurriculumSubjectDetail } from '@/types/curriculum';
import { SEM3_SUBJECTS } from './sem3';
import { SEM4_SUBJECTS } from './sem4';
import { SEM5_SUBJECTS } from './sem5';
import { CROSS_SEMESTER_PATHWAYS, SUPPLEMENTARY_SUBJECTS } from './supplementary';

export { SEM3_SUBJECTS, SEM4_SUBJECTS, SEM5_SUBJECTS, SUPPLEMENTARY_SUBJECTS, CROSS_SEMESTER_PATHWAYS };

/**
 * Canonical conceptId -> Instrument 3D & Simulation links.
 * Verified against CANONICAL_INSTRUMENTS in src/data/instrumentRegistry.ts.
 */
const CONCEPT_INSTRUMENT_LINKS: Record<
  string,
  { id: string; label: string; hasSimulation?: boolean }[]
> = {
  // Semester III — ICDC0205 Transducers and Signal Conditioning
  'tsc-u1-block': [
    { id: 'rtd-pt100', label: 'Pt100 RTD Sensor', hasSimulation: true },
    { id: 'dp-transmitter', label: 'Smart DP Transmitter', hasSimulation: true },
    { id: 'temperature-transmitters', label: 'DIN Head Transmitter', hasSimulation: true },
  ],
  'tsc-u1-static-dyn': [
    { id: 'thermistor', label: 'NTC Thermistor', hasSimulation: true },
    { id: 'accelerometer', label: 'Seismic Accelerometer', hasSimulation: true },
  ],
  'tsc-u2-lvdt-pot': [
    { id: 'lvdt', label: 'LVDT Assembly', hasSimulation: true },
    { id: 'potentiometer-transducer', label: 'Potentiometer Transducer', hasSimulation: true },
    { id: 'variable-inductance', label: 'Variable Inductance', hasSimulation: true },
    { id: 'capacitive-displacement', label: 'Capacitive Micrometer', hasSimulation: true },
  ],
  'tsc-u2-strain-load': [
    { id: 'strain-gauge', label: 'Foil Strain Gauge', hasSimulation: true },
    { id: 'load-cell', label: 'Shear-Beam Load Cell', hasSimulation: true },
    { id: 'torque-transducer', label: 'Rotary Torque Sensor', hasSimulation: true },
  ],
  'tsc-u2-pressure-vib': [
    { id: 'bourdon-tube', label: 'Bourdon Tube Gauge', hasSimulation: true },
    { id: 'diaphragm', label: 'Diaphragm Sensor', hasSimulation: true },
    { id: 'bellows', label: 'Metallic Bellows', hasSimulation: true },
    { id: 'capacitive-sensors', label: 'Capacitive DP Cell', hasSimulation: true },
    { id: 'piezoelectric-sensors', label: 'Piezo Pressure Sensor', hasSimulation: true },
    { id: 'accelerometer', label: 'Piezoelectric Accelerometer', hasSimulation: true },
    { id: 'velocity-vibration-pickup', label: 'Moving-Coil Velocity Pickup', hasSimulation: true },
    { id: 'manometers', label: 'U-Tube Manometer', hasSimulation: true },
  ],
  'tsc-u3-nonelec-bimetal': [
    { id: 'bimetallic-thermometers', label: 'Bimetallic Dial Thermometer', hasSimulation: true },
    { id: 'filled-system-thermometer', label: 'Filled-System Thermometer', hasSimulation: true },
  ],
  'tsc-u3-rtd': [
    { id: 'rtd-pt100', label: 'Pt100 RTD Assembly', hasSimulation: true },
    { id: 'thermowells', label: 'Flanged Thermowell', hasSimulation: true },
  ],
  'tsc-u3-thermistor': [
    { id: 'thermistor', label: 'NTC/PTC Thermistor', hasSimulation: true },
    { id: 'thermocouple-k', label: 'Type-K Thermocouple', hasSimulation: true },
  ],
  'tsc-u4-optical-digital': [
    { id: 'optical-encoder', label: 'Optical Shaft Encoder', hasSimulation: true },
    { id: 'photo-detectors', label: 'PMT / LDR Photodetectors', hasSimulation: true },
    { id: 'optical-fiber-sensor', label: 'Optical Fiber FBG', hasSimulation: true },
  ],
  'tsc-u4-hall-mag-echem-smart': [
    { id: 'hall-effect-sensor', label: 'Hall-Effect Sensor', hasSimulation: true },
    { id: 'magnetostrictive-transducer', label: 'Magnetostrictive Probe', hasSimulation: true },
    { id: 'ph', label: 'Glass pH Sensor', hasSimulation: true },
    { id: 'temperature-transmitters', label: 'Smart Transmitter', hasSimulation: true },
  ],
  'tsc-u5-bridges-amps': [
    { id: 'wheatstone-bridge', label: 'Wheatstone Bridge', hasSimulation: true },
    { id: 'instrumentation-amplifier', label: '3-Op-Amp In-Amp (INA)', hasSimulation: true },
  ],
  'tsc-u5-filter-emi': [
    { id: 'filters', label: 'Sallen-Key Active Filter', hasSimulation: true },
    { id: 'isolation-amplifiers', label: 'Galvanic Isolator & Barrier', hasSimulation: true },
  ],

  // Semester III — ECDC0213 Analog & Digital Electronics
  'ade-u4-opamp-apps': [
    { id: 'instrumentation-amplifier', label: '3-Op-Amp In-Amp', hasSimulation: true },
    { id: 'filters', label: 'Active Filter PCB', hasSimulation: true },
  ],
  'ade-u7-dac-adc': [
    { id: 'adc-and-dac', label: 'SAR ADC & R-2R DAC', hasSimulation: true },
    { id: 'digital-multimeter', label: 'Dual-Slope DMM', hasSimulation: true },
  ],

  // Semester III — ICDC0203 Electrical Measurements (EMMI)
  'emmi-u2-meters': [
    { id: 'pmmc-instrument', label: 'PMMC Moving-Coil', hasSimulation: true },
    { id: 'moving-iron-instrument', label: 'Moving-Iron AC/DC', hasSimulation: true },
    { id: 'electrodynamometer-wattmeter', label: 'Dynamometer Wattmeter', hasSimulation: true },
    { id: 'induction-energy-meter', label: 'Induction Energy Meter', hasSimulation: true },
    { id: 'frequency-phase-meter', label: 'Crossed-Coil PF Meter', hasSimulation: true },
    { id: 'digital-multimeter', label: 'True-RMS DMM', hasSimulation: true },
  ],
  'emmi-u3-dc-high-r': [
    { id: 'wheatstone-bridge', label: 'Wheatstone Bridge', hasSimulation: true },
    { id: 'kelvin-double-bridge', label: 'Kelvin Double Bridge', hasSimulation: true },
    { id: 'megger-insulation-tester', label: 'HV Megger Ohmmeter', hasSimulation: true },
  ],
  'emmi-u3-ac-bridges': [
    { id: 'ac-impedance-bridge', label: 'Maxwell/Hay/Owen/Anderson Bridge', hasSimulation: true },
    { id: 'schering-wien-bridge', label: 'Schering / Wien Bridge', hasSimulation: true },
  ],
  'emmi-u4-magnetic': [
    { id: 'fluxmeter', label: 'Grassot Ballistic Fluxmeter', hasSimulation: true },
    { id: 'hall-effect-sensor', label: 'Hall Flux Probe', hasSimulation: true },
  ],
  'emmi-u5-ct-pt': [
    { id: 'current-transformer', label: 'Bar-Primary CT', hasSimulation: true },
    { id: 'potential-transformer', label: 'Wound-Core HV PT', hasSimulation: true },
  ],
  'emmi-u6-cro-dso': [
    { id: 'cro-crt', label: 'CRO Cutaway CRT & Lissajous', hasSimulation: true },
    { id: 'digital-multimeter', label: 'Digital Multimeter', hasSimulation: true },
  ],

  // Semester IV — ICDC0206 Control System Engineering
  'cse-u6-components': [
    { id: 'servomotor', label: 'AC/DC Servomotor', hasSimulation: true },
    { id: 'tachogenerator', label: 'DC Tachogenerator', hasSimulation: true },
    { id: 'stepper-motor', label: 'Hybrid Stepper Motor', hasSimulation: true },
    { id: 'optical-encoder', label: 'Optical Shaft Encoder', hasSimulation: true },
  ],

  // Semester IV — ICDC0202 Electrical Machines
  'em-u2-transformer': [
    { id: 'current-transformer', label: 'Instrument CT', hasSimulation: true },
    { id: 'potential-transformer', label: 'Instrument PT', hasSimulation: true },
  ],
  'em-u4-special': [{ id: 'stepper-motor', label: 'Hybrid Stepper Motor', hasSimulation: true }],
  'em-u5-dc': [{ id: 'tachogenerator', label: 'DC Commutator Machine', hasSimulation: true }],

  // Semester IV — ICDC0208 Industrial Measurement Systems
  'ims-u1-dyn-noise': [
    { id: 'isolation-amplifiers', label: 'Galvanic Barrier', hasSimulation: true },
    { id: 'filters', label: 'Active Conditioning Filter', hasSimulation: true },
  ],
  'ims-u2-temp': [
    { id: 'rtd-pt100', label: 'Pt100 RTD', hasSimulation: true },
    { id: 'thermocouple-k', label: 'Type-K Thermocouple', hasSimulation: true },
    { id: 'thermowells', label: 'Tapered Thermowell', hasSimulation: true },
    { id: 'filled-system-thermometer', label: 'Filled-System Bulb', hasSimulation: true },
    { id: 'optical-pyrometers', label: 'Optical Pyrometer', hasSimulation: true },
    { id: 'radiation-pyrometers', label: '2-Color Radiation Pyrometer', hasSimulation: true },
    { id: 'infrared-sensors', label: 'IR Spot Pyrometer', hasSimulation: true },
  ],
  'ims-u3-pressure': [
    { id: 'dp-transmitter', label: 'Smart DP Transmitter', hasSimulation: true },
    { id: 'bourdon-tube', label: 'Bourdon C-Tube Gauge', hasSimulation: true },
    { id: 'diaphragm', label: 'Diaphragm Sensor', hasSimulation: true },
    { id: 'bellows', label: 'Bellows Capsule', hasSimulation: true },
    { id: 'strain-gauge-pressure-sensors', label: 'Piezo-Bridge PT', hasSimulation: true },
    { id: 'deadweight-tester', label: 'Dead-Weight Tester', hasSimulation: true },
    { id: 'manometers', label: 'U-Tube Manometer', hasSimulation: true },
    { id: 'vacuum-gauges', label: 'Pirani & McLeod Vacuum', hasSimulation: true },
  ],
  'ims-u4-flow': [
    { id: 'orifice-plate', label: 'ISO 5167 Orifice Plate', hasSimulation: true },
    { id: 'venturi-meter', label: 'Venturi Tube Meter', hasSimulation: true },
    { id: 'flow-nozzle', label: 'ASME Flow Nozzle', hasSimulation: true },
    { id: 'rotameter', label: 'Tapered Glass Rotameter', hasSimulation: true },
    { id: 'electromagnetic-flow-meter', label: 'Faraday Magmeter', hasSimulation: true },
    { id: 'ultrasonic-flow-meter', label: 'Ultrasonic Flowmeter', hasSimulation: true },
    { id: 'turbine-flow-meter', label: 'Helical Turbine Meter', hasSimulation: true },
    { id: 'vortex-flow-meter', label: 'Vortex Shedding Meter', hasSimulation: true },
    { id: 'coriolis-flow-meter', label: 'Coriolis Mass Flowmeter', hasSimulation: true },
    { id: 'thermal-mass-flow-meter', label: 'Thermal Mass / Hot-Wire', hasSimulation: true },
    { id: 'pitot-tube', label: 'Pitot-Static Probe', hasSimulation: true },
    { id: 'positive-displacement-flowmeter', label: 'Oval-Gear PD Meter', hasSimulation: true },
  ],
  'ims-u5-other-vars': [
    { id: 'float', label: 'Magnetic Float MLG', hasSimulation: true },
    { id: 'displacer', label: 'Torque-Tube Displacer', hasSimulation: true },
    { id: 'differential-pressure', label: 'DP Wet-Leg Level', hasSimulation: true },
    { id: 'capacitive', label: 'RF Capacitance Level', hasSimulation: true },
    { id: 'ultrasonic', label: 'Ultrasonic Level', hasSimulation: true },
    { id: 'radar', label: '80 GHz FMCW Radar', hasSimulation: true },
    { id: 'guided-wave-radar', label: 'Guided Wave Radar', hasSimulation: true },
    { id: 'nuclear-level-measurement', label: 'Cs-137 Gamma Level', hasSimulation: true },
    { id: 'humidity-sensor', label: 'Polymer RH & Chilled Mirror', hasSimulation: true },
    { id: 'viscometer', label: 'Rotational Viscometer', hasSimulation: true },
    { id: 'density-meter', label: 'U-Tube Density Meter', hasSimulation: true },
    { id: 'torque-transducer', label: 'Shaft Power Torsiometer', hasSimulation: true },
    { id: 'load-cell', label: 'Shear-Beam Load Cell', hasSimulation: true },
  ],

  // Semester V — ICDC0305 Analytical and Optical Instrumentation
  'aoi-u2-chrom': [
    { id: 'chromatography', label: 'Gas Chromatograph (GC)', hasSimulation: true },
    { id: 'hplc-ic-system', label: 'HPLC & Ion Chromatograph', hasSimulation: true },
    { id: 'mass-spectrometer', label: 'Quadrupole Mass Spec', hasSimulation: true },
  ],
  'aoi-u3-gas': [
    { id: 'oxygen-analyzers', label: 'Paramagnetic O₂ Analyzer', hasSimulation: true },
    { id: 'gas-analyzers', label: 'NDIR & TCD Gas Bench', hasSimulation: true },
    { id: 'dissolved-oxygen', label: 'Clark Polarographic DO', hasSimulation: true },
  ],
  'aoi-u4-chem': [
    { id: 'ph', label: 'Glass Electrode pH Meter', hasSimulation: true },
    { id: 'conductivity', label: 'Toroidal Conductivity Probe', hasSimulation: true },
    { id: 'density-meter', label: 'Oscillating U-Tube Density', hasSimulation: true },
  ],
  'aoi-u5-optics': [
    { id: 'photo-detectors', label: 'PMT Photomultiplier & LDR', hasSimulation: true },
    { id: 'optical-fiber-sensor', label: 'Optical Fiber FBG', hasSimulation: true },
    { id: 'refractometer-polarimeter', label: 'Polarimeter & Refractometer', hasSimulation: true },
  ],
  'aoi-u6-spectro': [
    { id: 'uv-vis-spectrophotometer', label: 'Double-Beam UV-Vis Bench', hasSimulation: true },
    { id: 'colorimeter', label: 'Single-Beam Colorimeter', hasSimulation: true },
    { id: 'ftir-spectrometer', label: 'Michelson FTIR Bench', hasSimulation: true },
    { id: 'flame-aas-spectrometer', label: 'Flame Photometer & AAS', hasSimulation: true },
    { id: 'nmr-photoacoustic', label: 'FT-NMR & Photoacoustic', hasSimulation: true },
    { id: 'turbidity', label: '90° Nephelometer', hasSimulation: true },
  ],

  // Semester V — ICDC0307 Process Dynamics and Control
  'pdc-u1-models': [{ id: 'manometers', label: '2nd-Order U-Tube Manometer', hasSimulation: true }],
  'pdc-u3-pid-tuning': [{ id: 'process-controller', label: '1/4 DIN PID Controller', hasSimulation: true }],
  'pdc-u4-valves': [
    { id: 'control-valves', label: 'Cutaway Globe Control Valve', hasSimulation: true },
    { id: 'actuators', label: 'Rack & Pinion Actuator', hasSimulation: true },
    { id: 'positioners', label: 'Smart Valve Positioner', hasSimulation: true },
    { id: 'ip-converters', label: 'Flapper-Nozzle I/P', hasSimulation: true },
    { id: 'solenoid-valves', label: '3/2 NAMUR Solenoid', hasSimulation: true },
    { id: 'spool-valve', label: '4/3 Hydraulic Spool Valve', hasSimulation: true },
  ],

  // Supplementary — ICMI0303 Testing and Calibration
  'cal-u1-fundamentals': [
    { id: 'deadweight-tester', label: 'Primary Dead-Weight Tester', hasSimulation: true },
    { id: 'digital-multimeter', label: 'Reference True-RMS DMM', hasSimulation: true },
  ],
  'cal-u2-practices': [
    { id: 'rtd-pt100', label: 'Pt100 RTD Calibration', hasSimulation: true },
    { id: 'thermocouple-k', label: 'Type-K TC CJC Test', hasSimulation: true },
    { id: 'deadweight-tester', label: 'DWT Pressure Standard', hasSimulation: true },
    { id: 'dp-transmitter', label: '4–20 mA DP Trim', hasSimulation: true },
    { id: 'cro-crt', label: 'CRO 1 kHz Probe Comp', hasSimulation: true },
    { id: 'ph', label: 'Two-Point pH Buffer Cal', hasSimulation: true },
    { id: 'uv-vis-spectrophotometer', label: 'UV-Vis Wavelength Check', hasSimulation: true },
  ],
};

function enrichSubjectsWithLinks(raw: CurriculumSubjectDetail[]): CurriculumSubjectDetail[] {
  return raw.map((subj) => ({
    ...subj,
    units: subj.units.map((u) => ({
      ...u,
      topics: u.topics.map((c) => {
        const extra = CONCEPT_INSTRUMENT_LINKS[c.id];
        if (!extra) return c;
        return { ...c, linkedInstruments: extra };
      }),
    })),
  }));
}

const SEM_FOUNDATIONS = enrichSubjectsWithLinks(
  SUPPLEMENTARY_SUBJECTS.filter((s) => typeof s.semester === 'number'),
);
const SUPP_ADDITIONAL = enrichSubjectsWithLinks(
  SUPPLEMENTARY_SUBJECTS.filter((s) => s.semester === 'additional'),
);

export const NITJ_CURRICULUM_SUBJECTS: CurriculumSubjectDetail[] = [
  ...SEM_FOUNDATIONS,
  ...enrichSubjectsWithLinks(SEM3_SUBJECTS),
  ...enrichSubjectsWithLinks(SEM4_SUBJECTS),
  ...enrichSubjectsWithLinks(SEM5_SUBJECTS),
  ...SUPP_ADDITIONAL,
];

export const NITJ_SUBJECT_MAP = new Map<string, CurriculumSubjectDetail>(
  NITJ_CURRICULUM_SUBJECTS.map((s) => [s.id, s]),
);

export function getCurriculumSubjectById(id: string): CurriculumSubjectDetail | undefined {
  return NITJ_SUBJECT_MAP.get(id);
}

export function getSubjectsForSemesterTab(tab: number | 'additional'): CurriculumSubjectDetail[] {
  return NITJ_CURRICULUM_SUBJECTS.filter((s) => s.semester === tab);
}

export const DRIVE_COMPANION_COURSES = [
  { sem: '3rd Sem Drive', name: 'OOPs Minor', note: 'CS Minor elective tracked alongside core ICE Sem III' },
  {
    sem: '4th Sem Drive',
    name: 'Data Structures & Signal Processing (+ SP_Lab)',
    note: 'Signal Processing feeds FIR/IIR enrichment & analytical FFT; DS supports technical software placements',
  },
  {
    sem: '5th Sem Drive',
    name: 'Microprocessor & Embedded Systems · Computer Organisation & Architecture',
    note: 'Covered interactively in INSTRUMENTA Electronics & Embedded / Automation PLC hubs',
  },
] as const;

export const NITJ_SYLLABUS_BANNER =
  'Curriculum strictly aligned with Dr. B. R. Ambedkar NIT Jalandhar — B.Tech. Instrumentation & Control Engineering (July 2023 Admissions Onwards, Revised June 2025) for Semesters III–V Core, plus transparently flagged Drive foundations, supplementary electives (ICMI0303 Testing & Calibration), and extensions.';
