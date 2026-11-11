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

  // Semester IV — ICDC0204 Signal Processing
  'sp-u1-signals-ops': [
    { id: 'dsp-processor-board', label: 'Modified Harvard DSP', hasSimulation: true },
    { id: 'cro-crt', label: 'Waveform Scope Monitor', hasSimulation: true },
  ],
  'sp-u1-systems-conv-corr': [
    { id: 'ultrasonic-flow-meter', label: 'Cross-Correlation Flowmeter', hasSimulation: true },
    { id: 'radar', label: 'FMCW Echo Correlator', hasSimulation: true },
  ],
  'sp-u1-sampling-quantization': [
    { id: 'sampling-quantizer', label: 'Sampling & SQNR Analyzer', hasSimulation: true },
    { id: 'adc-and-dac', label: 'SAR ADC & R-2R DAC', hasSimulation: true },
  ],
  'sp-u2-ctfs-dtft': [
    { id: 'dft-fft-analyzer', label: 'DFT / FFT Analyzer', hasSimulation: true },
    { id: 'filters', label: 'Practical Active LPF', hasSimulation: true },
  ],
  'sp-u2-dft-convolution': [
    { id: 'dft-fft-analyzer', label: 'Radix-2 DFT Matrix Engine', hasSimulation: true },
    { id: 'dsp-processor-board', label: 'DSP Core', hasSimulation: true },
  ],
  'sp-u2-fft-butterflies': [
    { id: 'dft-fft-analyzer', label: 'DIT/DIF Butterfly Spectrum', hasSimulation: true },
    { id: 'ftir-spectrometer', label: 'FTIR Interferogram FFT', hasSimulation: true },
  ],
  'sp-u3-ztransform-roc': [
    { id: 'fir-iir-filter', label: 'Z-Plane Pole-Zero Filter', hasSimulation: true },
    { id: 'process-controller', label: 'Discrete PID Controller', hasSimulation: true },
  ],
  'sp-u3-zplane-stability': [
    { id: 'fir-iir-filter', label: 'Digital Stability Unit-Circle', hasSimulation: true },
    { id: 'load-cell', label: '50 Hz Notch Load Cell DSP', hasSimulation: true },
  ],
  'sp-u4-fir-structures-design': [
    { id: 'fir-iir-filter', label: 'Linear-Phase FIR Window', hasSimulation: true },
    { id: 'dsp-processor-board', label: 'Hardware MAC Delay Line', hasSimulation: true },
  ],
  'sp-u4-iir-analog-design': [
    { id: 'fir-iir-filter', label: 'IIR Butterworth / Bilinear', hasSimulation: true },
    { id: 'filters', label: 'Analog Sallen-Key Prototype', hasSimulation: true },
  ],
  'sp-u5-dsp-arch-fwl': [
    { id: 'dsp-processor-board', label: 'Modified Harvard MAC DSP', hasSimulation: true },
    { id: 'sampling-quantizer', label: 'Fixed-Point Quantizer', hasSimulation: true },
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
    { id: 'mass-flow-controller', label: 'Thermal Mass Flow Controller (MFC)', hasSimulation: true },
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
    { id: 'vibrating-fork-level', label: 'Vibrating Tuning Fork Switch', hasSimulation: true },
    { id: 'humidity-sensor', label: 'Polymer RH & Chilled Mirror', hasSimulation: true },
    { id: 'viscometer', label: 'Rotational Viscometer', hasSimulation: true },
    { id: 'density-meter', label: 'U-Tube Density Meter', hasSimulation: true },
    { id: 'torque-transducer', label: 'Shaft Power Torsiometer', hasSimulation: true },
    { id: 'load-cell', label: 'Shear-Beam Load Cell', hasSimulation: true },
  ],

  // Semester V — ICDC0303 Modern Control System
  'mcs-u1-statespace-models': [
    { id: 'state-space-feedback', label: 'State-Space (A,B,C,D) Model', hasSimulation: true },
    { id: 'servomotor', label: '2nd-Order DC Servomotor', hasSimulation: true },
  ],
  'mcs-u1-stm-solution': [
    { id: 'state-space-feedback', label: 'STM Transient Solver', hasSimulation: true },
    { id: 'process-controller', label: 'ZOH Digital Controller', hasSimulation: true },
  ],
  'mcs-u1-canonical-ext': [
    { id: 'state-space-feedback', label: 'Canonical Realization Model', hasSimulation: true },
  ],
  'mcs-u2-ctrb-obsv-tests': [
    { id: 'state-space-feedback', label: 'Controllability / Observer', hasSimulation: true },
  ],
  'mcs-u2-poleplace-observers': [
    { id: 'state-space-feedback', label: 'Ackermann Pole Placement', hasSimulation: true },
    { id: 'servomotor', label: 'Servo Velocity Observer', hasSimulation: true },
  ],
  'mcs-u3-nonlinear-phaseplane': [
    { id: 'control-valves', label: 'Stiction / Dead-Zone Valve', hasSimulation: true },
    { id: 'spool-valve', label: 'Deadband Hydraulic Spool', hasSimulation: true },
  ],
  'mcs-u3-describing-function': [
    { id: 'process-controller', label: 'Relay Auto-Tuning Loop', hasSimulation: true },
    { id: 'control-valves', label: 'Limit-Cycle Valve Actuator', hasSimulation: true },
  ],
  'mcs-u4-bibo-quadratic-sylvester': [
    { id: 'lqr-optimal-regulator', label: 'Quadratic Weight Matrix Q, P', hasSimulation: true },
  ],
  'mcs-u4-lyapunov-popov': [
    { id: 'state-space-feedback', label: 'Lyapunov Stability Solver', hasSimulation: true },
  ],
  'mcs-u5-variational-pontryagin': [
    { id: 'lqr-optimal-regulator', label: 'Pontryagin Optimal Control', hasSimulation: true },
    { id: 'stepper-motor', label: 'Minimum-Time Stepper Move', hasSimulation: true },
  ],
  'mcs-u5-lqp-hjb-riccati': [
    { id: 'lqr-optimal-regulator', label: 'Riccati / LQR Controller', hasSimulation: true },
  ],
  'mcs-u5-lqr-enrichment': [
    { id: 'lqr-optimal-regulator', label: 'Bryson Q/R LQR Tuner', hasSimulation: true },
  ],

  // Semester V — ICDC0305 Analytical and Optical Instrumentation
  'aoi-u1-metrics': [
    { id: 'uv-vis-spectrophotometer', label: 'Analytical UV-Vis Bench', hasSimulation: true },
    { id: 'electrochemical-gas-sensor', label: 'MEMS / Chem Gas Cell', hasSimulation: true },
  ],
  'aoi-u1-smart-mems-ufluidics': [
    { id: 'electrochemical-gas-sensor', label: 'Micro Gas Sensor Cell', hasSimulation: true },
    { id: 'arduino-uno', label: 'PC / MCU DAQ Interface', hasSimulation: true },
  ],
  'aoi-u2-chrom-gc': [
    { id: 'chromatography', label: 'Gas Chromatograph (GC)', hasSimulation: true },
    { id: 'mass-spectrometer', label: 'GC-MS Quadrupole Mass Spec', hasSimulation: true },
  ],
  'aoi-u2-chrom-hplc-ic': [
    { id: 'hplc-ic-system', label: 'HPLC & Ion Chromatograph', hasSimulation: true },
    { id: 'mass-spectrometer', label: 'LC-MS Mass Interface', hasSimulation: true },
  ],
  'aoi-u3-tcd-heat-mixtures': [
    { id: 'gas-analyzers', label: 'NDIR & TCD Gas Bench', hasSimulation: true },
    { id: 'wheatstone-bridge', label: 'TCD Filament Bridge', hasSimulation: true },
  ],
  'aoi-u3-o2-electrochem-density': [
    { id: 'oxygen-analyzers', label: 'Paramagnetic O₂ Analyzer', hasSimulation: true },
    { id: 'electrochemical-gas-sensor', label: '3-Electrode Toxic Gas Cell', hasSimulation: true },
    { id: 'dissolved-oxygen', label: 'Clark Polarographic DO', hasSimulation: true },
    { id: 'density-meter', label: 'Vibrating Gas Density', hasSimulation: true },
  ],
  'aoi-u4-ph-redox-cond': [
    { id: 'ph', label: 'Glass Electrode pH Meter', hasSimulation: true },
    { id: 'conductivity', label: 'Toroidal Conductivity Cell', hasSimulation: true },
  ],
  'aoi-u4-density-multiphase': [
    { id: 'density-meter', label: 'Oscillating U-Tube Density', hasSimulation: true },
    { id: 'coriolis-flow-meter', label: 'Coriolis Mass & Density', hasSimulation: true },
  ],
  'aoi-u5-optics-monochromators': [
    { id: 'monochromator-optics', label: 'Czerny-Turner Monochromator', hasSimulation: true },
    { id: 'refractometer-polarimeter', label: 'Refractometer & Polarimeter', hasSimulation: true },
    { id: 'turbidity', label: '90° Scattering Nephelometer', hasSimulation: true },
  ],
  'aoi-u5-detectors-laser-fiber': [
    { id: 'photo-detectors', label: 'PMT Photomultiplier & LDR', hasSimulation: true },
    { id: 'optical-fiber-sensor', label: 'Optical Fiber FBG Bench', hasSimulation: true },
    { id: 'monochromator-optics', label: 'LED/LASER Optical Rail', hasSimulation: true },
  ],
  'aoi-u6-em-beer-colorimeters': [
    { id: 'uv-vis-spectrophotometer', label: 'Double-Beam UV-Vis Bench', hasSimulation: true },
    { id: 'colorimeter', label: 'Single-Beam Colorimeter', hasSimulation: true },
    { id: 'monochromator-optics', label: 'Grating Dispersion Stage', hasSimulation: true },
  ],
  'aoi-u6-ir-pas-nmr-ms-aas-flame': [
    { id: 'ftir-spectrometer', label: 'Michelson FTIR Bench', hasSimulation: true },
    { id: 'flame-aas-spectrometer', label: 'Flame Photometer & AAS', hasSimulation: true },
    { id: 'nmr-photoacoustic', label: 'FT-NMR & Photoacoustic', hasSimulation: true },
    { id: 'mass-spectrometer', label: 'Quadrupole Mass Spec', hasSimulation: true },
  ],

  // Semester V — ICDC0301 Microprocessors and Embedded Systems
  'mpes-u1-arch-org': [
    { id: 'intel-8085', label: 'Intel 8085 Von Neumann', hasSimulation: true },
    { id: 'intel-8051', label: 'Intel 8051 Harvard MCU', hasSimulation: true },
  ],
  'mpes-u2-8085-arch-pins': [
    { id: 'intel-8085', label: 'Intel 8085 40-Pin DIP', hasSimulation: true },
  ],
  'mpes-u2-8085-instr-timing-stack-int': [
    { id: 'intel-8085', label: 'Intel 8085 Timing & CPU', hasSimulation: true },
  ],
  'mpes-u3-mem-io-schemes': [
    { id: 'intel-8085', label: '8085 Bus Interface', hasSimulation: true },
    { id: 'ic-8255', label: '8255A I/O Expander', hasSimulation: true },
  ],
  'mpes-u3-peripherals-825x': [
    { id: 'ic-8255', label: '8255A PPI (24 Pins)', hasSimulation: true },
    { id: 'ic-8253', label: '8253/8254 PIT Timers', hasSimulation: true },
    { id: 'ic-8251', label: '8251A USART Serial', hasSimulation: true },
    { id: 'ic-8279', label: '8279 Kbd/Display Ctrl', hasSimulation: true },
  ],
  'mpes-u4-8086-arch-seg': [
    { id: 'intel-8086', label: 'Intel 8086 BIU/EU CPU', hasSimulation: true },
  ],
  'mpes-u4-8086-modes-addr-int': [
    { id: 'intel-8086', label: 'Intel 8086 Min/Max Modes', hasSimulation: true },
  ],
  'mpes-u5-8051-arch-instr': [
    { id: 'intel-8051', label: 'Intel 8051 Harvard MCU', hasSimulation: true },
  ],
  'mpes-u5-8051-timers-uart-int': [
    { id: 'intel-8051', label: '8051 Timer & UART Baud', hasSimulation: true },
    { id: 'ic-8251', label: 'USART Serial Ref', hasSimulation: true },
  ],
  'mpes-u5-8051-interfacing': [
    { id: 'lcd-display-16x2', label: '16×2 HD44780 LCD Module', hasSimulation: true },
    { id: 'seven-segment-display', label: '7-Segment LED Display', hasSimulation: true },
    { id: 'adc-and-dac', label: 'SAR ADC & R-2R DAC Board', hasSimulation: true },
    { id: 'intel-8051', label: 'Intel 8051 MCU', hasSimulation: true },
  ],
  'mpes-u6-embedded-codesign': [
    { id: 'intel-8051', label: '8051 Embedded Core', hasSimulation: true },
    { id: 'dsp-processor-board', label: 'Dedicated MAC DSP', hasSimulation: true },
  ],
  'mpes-u7-arduino-platform': [
    { id: 'arduino-uno', label: 'Arduino UNO R3 Board', hasSimulation: true },
    { id: 'lcd-display-16x2', label: '16×2 LCD Shield', hasSimulation: true },
  ],
  'mpes-u7-raspberry-pi': [
    { id: 'raspberry-pi', label: 'Raspberry Pi Linux SBC', hasSimulation: true },
    { id: 'arduino-uno', label: 'Arduino Co-Processor', hasSimulation: true },
    { id: 'adc-and-dac', label: 'External I2C/SPI ADC', hasSimulation: true },
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
    { id: 'variable-frequency-drive', label: 'PWM Variable Frequency Drive', hasSimulation: true },
  ],

  // Supplementary — ICMI0303 Testing and Calibration
  'cal-u1-fundamentals': [
    { id: 'deadweight-tester', label: 'Primary Dead-Weight Tester', hasSimulation: true },
    { id: 'digital-multimeter', label: 'Reference True-RMS DMM', hasSimulation: true },
    { id: 'dry-well-calibrator', label: 'Dry-Well Block Calibrator', hasSimulation: true },
    { id: 'process-loop-calibrator', label: '4–20 mA / HART Loop Calibrator', hasSimulation: true },
  ],
  'cal-u2-practices': [
    { id: 'rtd-pt100', label: 'Pt100 RTD Calibration', hasSimulation: true },
    { id: 'thermocouple-k', label: 'Type-K TC CJC Test', hasSimulation: true },
    { id: 'dry-well-calibrator', label: 'Dry-Well RTD Block Test', hasSimulation: true },
    { id: 'process-loop-calibrator', label: '5-Point Loop Calibration', hasSimulation: true },
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
    sem: '4th Sem Core + Drive',
    name: 'Signal Processing (ICDC0204) & Data Structures',
    note: 'Signal Processing ICDC0204 now integrated as full 5-section Sem IV NITJ Core subject; DS supports placements',
  },
  {
    sem: '5th Sem Core + Drive',
    name: 'Microprocessors & Embedded Systems (ICDC0301) · Computer Org & Architecture',
    note: 'Microprocessors & Embedded Systems ICDC0301 now integrated as full 7-section Sem V NITJ Core subject with 8085/8086/8051/Arduino 3D models',
  },
] as const;

export const NITJ_SYLLABUS_BANNER =
  'Curriculum strictly aligned with Dr. B. R. Ambedkar NIT Jalandhar — B.Tech. Instrumentation & Control Engineering (July 2023 Admissions Onwards, Revised June 2025) for Semesters III–V Core, plus transparently flagged Drive foundations, supplementary electives (ICMI0303 Testing & Calibration), and extensions.';
