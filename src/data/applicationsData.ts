export interface PidLoopTag {
  tag: string;
  x: number;
  y: number;
  kind: 'field' | 'dcs' | 'sis' | 'valve';
  title: string;
  isaDecode: string;
  instrumentType: string;
  signal: string;
  failSafeOrRange: string;
  route?: string;
}

export const DISTILLATION_PID_TAGS: PidLoopTag[] = [
  {
    tag: 'FT-101',
    x: 135,
    y: 235,
    kind: 'field',
    title: 'Feed Flow Transmitter (Orifice + DP)',
    isaDecode: 'F (Flow) · T (Transmitter) · Loop 101',
    instrumentType: 'ISO 5167 Concentric Orifice + Smart DP Transmitter',
    signal: '4–20 mA + HART 7 (√ΔP Linearized)',
    failSafeOrRange: '0–150 m³/h · 3-Valve Manifold · Side Taps (Liquid)',
    route: '/instrumentation/flow/orifice-plate',
  },
  {
    tag: 'FIC-101',
    x: 225,
    y: 120,
    kind: 'dcs',
    title: 'Feed Flow Indicating Controller (DCS)',
    isaDecode: 'F (Flow) · I (Indicating) · C (Controller) · Loop 101',
    instrumentType: 'Shared Display / DCS PID Function Block',
    signal: 'DCS Digital Bus → 4–20 mA AO to Valve',
    failSafeOrRange: 'Reverse Acting PI Control (Kc=0.8, Ti=6s, Td=0)',
    route: '/automation/control-systems',
  },
  {
    tag: 'FV-101',
    x: 225,
    y: 280,
    kind: 'valve',
    title: 'Feed Control Valve (Globe Trim)',
    isaDecode: 'F (Flow) · V (Control Valve) · Loop 101',
    instrumentType: 'Equal-Percentage Globe Valve + Smart Positioner',
    signal: '4–20 mA → 3–15 psi / 0.2–1.0 bar Pneumatic',
    failSafeOrRange: 'FC (Fail Closed · Air-to-Open) stops feed on air loss',
    route: '/instrumentation/final-control/control-valves',
  },
  {
    tag: 'TT-201',
    x: 470,
    y: 195,
    kind: 'field',
    title: 'Column Tray Temperature Transmitter',
    isaDecode: 'T (Temperature) · T (Transmitter) · Loop 201',
    instrumentType: '4-Wire Class A Pt100 RTD in Drilled Bar-Stock Thermowell',
    signal: 'Head-Mount 4–20 mA + HART (NAMUR NE43)',
    failSafeOrRange: '0–350 °C · Upscale Burnout (21.5 mA)',
    route: '/instrumentation/temperature/rtd',
  },
  {
    tag: 'TIC-201',
    x: 615,
    y: 120,
    kind: 'dcs',
    title: 'Tray Temp Cascade Master Controller',
    isaDecode: 'T (Temperature) · I (Indicating) · C (Controller)',
    instrumentType: 'DCS Master PID writing Remote SP to Steam Slave FIC-202',
    signal: 'Cascade Master → FIC-202 Remote SP',
    failSafeOrRange: 'Slower 3×–5× than steam flow slave loop',
    route: '/automation/control-systems',
  },
  {
    tag: 'LT-301',
    x: 525,
    y: 350,
    kind: 'field',
    title: 'Column Sump Guided Wave Radar Level',
    isaDecode: 'L (Level) · T (Transmitter) · Loop 301',
    instrumentType: 'TDR Guided Wave Radar inside Bridle Chamber',
    signal: '4–20 mA + HART 7',
    failSafeOrRange: '0–2500 mm · Immune to hydrocarbon density shifts',
    route: '/instrumentation/level/guided-wave-radar',
  },
  {
    tag: 'PT-401',
    x: 405,
    y: 78,
    kind: 'sis',
    title: 'Column Overhead High-Pressure SIS Sensor',
    isaDecode: 'P (Pressure) · T (Transmitter) · SIS Safety Loop 401',
    instrumentType: 'SIL 2/3 Smart Pressure Transmitter (Independent from BPCS!)',
    signal: 'Dedicated Hardwired 4–20 mA to Safety PLC (2oo3)',
    failSafeOrRange: '0–16 barg · Trip PSHH @ 12.5 barg → Energize-to-Trip / De-energize',
    route: '/instrumentation/pressure/pressure-transmitters',
  },
  {
    tag: 'XV-401',
    x: 310,
    y: 380,
    kind: 'sis',
    title: 'Reboiler Steam Emergency Shutdown Valve',
    isaDecode: 'X (Unclassified / On-Off) · V (Valve) · SIS Trip 401',
    instrumentType: 'Ball/Butterfly Shutoff + Spring-Return Actuator + 3/2 Solenoid',
    signal: '24 VDC De-Energize-to-Trip (DTT) SOV',
    failSafeOrRange: 'FC (Fail Closed) with Partial Stroke Test (PST) diagnostic',
    route: '/instrumentation/final-control/solenoid-valves',
  },
];

export interface PlantSectorCaseStudy {
  sector: string;
  loopName: string;
  architecture: string;
  keyInstruments: string[];
  criticalEngineeringRule: string;
}

export const PLANT_CASE_STUDIES: PlantSectorCaseStudy[] = [
  {
    sector: 'Power Generation · Steam Boilers',
    loopName: 'Three-Element Boiler Drum Level Control',
    architecture: 'Combines Drum Level LT (Feedback) + Main Steam Flow FT (Feedforward) cascaded onto Boiler Feedwater Flow FIC (Slave) to defeat drum "Shrink & Swell" transient inverse response.',
    keyInstruments: ['DP Wet-Leg / GWR DVC Level', 'ASME Flow Nozzle', 'Multistage Anti-Cavitation Feedwater Control Valve'],
    criticalEngineeringRule: 'Independent SIL 2/3 low-low drum level trip (2oo3 voting) strictly isolated from BPCS control transmitters.',
  },
  {
    sector: 'Oil & Gas · Refining',
    loopName: 'Centrifugal Compressor Anti-Surge Control',
    architecture: 'High-speed PLC (<10–20 ms scan!) compares actual suction ΔP flow against surge curve minimum flow calculated from suction/discharge pressures & temps, rapidly opening Recycle Valve (FC → FO!).',
    keyInstruments: ['Fast 45 ms Suction Orifice DP Transmitter', 'Quick-Opening Fail-Open Anti-Surge Recycle Valve + Volume Booster'],
    criticalEngineeringRule: 'Anti-surge valves MUST fail OPEN on air loss and stroke full open in <1–2 seconds using air volume boosters!',
  },
  {
    sector: 'Pharmaceuticals & Bioreactors',
    loopName: 'Fermenter Dissolved Oxygen & pH Cascade',
    architecture: 'Split-range DO control steps Agitator RPM → Air Sparger Flow → Pure O₂ Trim, paired with deadband acid/base pH dosing and sanitary SIP-rated sensors.',
    keyInstruments: ['Optical DO Probe', 'Digital Memosens/ISFET pH Probe', 'Sanitary Tri-Clamp 316L Pt100 (Class AA)'],
    criticalEngineeringRule: 'Electropolished 316L wetted roughness (Ra ≤ 0.4 µm) and zero dead-leg diaphragm valves meet cleanability standards.',
  },
  {
    sector: 'Effluent Treatment (ETP)',
    loopName: 'Strong Acid/Base Neutralization Reactor',
    architecture: 'Coarse upstream tank pH dosing followed by fine downstream static-mixer pH trim (multi-stage residence vessels) using equal-percentage reagent metering.',
    keyInstruments: ['Double-Junction Self-Cleaning pH Electrode', 'Electromagnetic Flow Meter (Magmeter)', 'Ultrasonic Parshall Flume Effluent Flow'],
    criticalEngineeringRule: 'Titration gain varies 1,000× near pH 7.0—use nonlinear/piecewise gain-scheduled PID and fast mixing residence time!',
  },
];

