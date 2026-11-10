export interface CompanyPrepProfile {
  id: string;
  name: string;
  sector: 'oil-gas' | 'automation';
  roleFocus: string;
  coreTechnologies: string[];
  keySubjects: string[];
  publiclyKnownFocus: string;
  practiceQuestions: { topic: string; question: string; guidelineAnswer: string }[];
  sourceDisclosure: string;
}

export const INDUSTRY_PREP_DISCLAIMER =
  'Company tracks distinguish publicly documented technology ecosystems and domain focus areas from editorial engineering practice questions. Specific interview transcripts, hiring counts, or unreleased internal test patterns are never fabricated.';

export const COMPANY_PREP_PROFILES: CompanyPrepProfile[] = [
  // OIL & GAS (9 companies)
  {
    id: 'reliance-industries',
    name: 'Reliance Industries Limited (RIL)',
    sector: 'oil-gas',
    roleFocus: 'Refining & Petrochemicals (Jamnagar / Hazira / Dahej) — GET Instrumentation & Control',
    coreTechnologies: ['Honeywell Experion PKS & Emerson DeltaV DCS', 'Triconex / HIMA SIS', 'Rotating Machinery Bently Nevada Vibration', 'Smart HART / Foundation Fieldbus', 'Control Valves & CEMS Analyzers'],
    keySubjects: ['Process Control (Cascade, Split-Range, Anti-Surge)', 'Industrial Flow & Pressure (Orifice, Coriolis, DP Level)', 'Control Valve Cv Sizing, Cavitation & Fail-Safe', 'Hazardous Area Ex ia/Ex d & SIL Voting'],
    publiclyKnownFocus: 'Large-scale integrated refining and petrochemical complexes rely heavily on continuous regulatory control (DCS), safety instrumented trips (SIS), rotating compressor vibration protection, and process analyzers.',
    practiceQuestions: [
      { topic: 'Distillation & Valves', question: 'On a refinery crude distillation column overhead condenser cooling water valve, would you specify Fail-Open (FO) or Fail-Closed (FC)? Why?', guidelineAnswer: 'Specify Fail-Open (Air-to-Close) on cooling water so instrument air failure maximizes condensation and avoids overpressuring the column overhead into flare relief.' },
      { topic: 'Flow Metering', question: 'Why is a Coriolis meter preferred over an orifice plate on high-value liquid hydrocarbon custody transfer?', guidelineAnswer: 'Coriolis measures direct mass flow (±0.05%–0.1%) and fluid density without needing separate P/T compensation or straight pipe runs.' },
    ],
    sourceDisclosure: 'Domain focus aligned with public refining/petrochemical engineering practice; practice questions are editorial ICE preparation items.',
  },
  {
    id: 'nayara-energy',
    name: 'Nayara Energy (Vadinar Refinery)',
    sector: 'oil-gas',
    roleFocus: 'Refinery Field Instrumentation, DCS Maintenance & Turnaround Commissioning',
    coreTechnologies: ['Distributed Control Systems', 'Thermocouple Tube-Skin & Thermowells', 'Guided Wave Radar & Magnetic Level Gauges', '3-Valve / 5-Valve Manifolds'],
    keySubjects: ['Industrial Temperature (RTD 3/4-wire, TC CJC)', 'DP Wet/Dry Leg Level Calculations', 'ISA-5.1 P&ID Loop Tagging', '4–20 mA & HART Diagnostics'],
    publiclyKnownFocus: 'High-complexity refinery operations emphasize high-reliability field loop maintenance, boiler/heater instrumentation, and flare/CEMS environmental compliance.',
    practiceQuestions: [
      { topic: 'Fired Heaters', question: 'Why do furnace tube-skin thermocouples fail prematurely if welded improperly or routed with copper cable?', guidelineAnswer: 'Copper wire shifts the cold junction out into the hot junction box, creating huge offset errors; tube-skin pads need expansion loops to prevent weld shear.' },
    ],
    sourceDisclosure: 'Public downstream refining domain profile + editorial practice items.',
  },
  {
    id: 'iocl',
    name: 'Indian Oil Corporation Limited (IOCL)',
    sector: 'oil-gas',
    roleFocus: 'Refineries & Cross-Country Pipelines — Officer / Engineer (Instrumentation)',
    coreTechnologies: ['Pipeline SCADA & RTUs (Modbus/DNP3)', 'Custody Turbine & Ultrasonic Flow Meters', 'Tank Farm Radar Gauging (API MPMS 3.1B)', 'PLC ESD & Fire/Gas Detection'],
    keySubjects: ['GATE-Level Control Systems (Bode/Nyquist/Routh)', 'Analog Electronics (Op-Amps, Wheatstone, ADC)', 'Flow & Level Instrumentation', 'SCADA Telemetry & Pipeline Leak Detection'],
    publiclyKnownFocus: 'Covers both complex process refineries (DCS/SIS) and thousands of kilometers of crude/product pipelines monitored via SCADA, RTUs, custody prover skids, and tank farm gauging.',
    practiceQuestions: [
      { topic: 'Pipeline SCADA', question: 'How do pipeline RTUs prevent data loss during a 10-minute cellular/VSAT link outage?', guidelineAnswer: 'RTUs buffer timestamped events locally ("Store-and-Forward") using internal flash/memory and transmit sequence-of-events packets once master polling resumes.' },
      { topic: 'Control Theory', question: 'How does transport dead-time e^(−θs) affect Phase Margin on a Bode plot?', guidelineAnswer: 'Dead-time adds pure phase lag −ωθ radians without changing magnitude—rapidly eroding Phase Margin toward instability at high gain crossover frequencies.' },
    ],
    sourceDisclosure: 'Public PSU refining & pipeline instrumentation profile + editorial GATE/plant practice items.',
  },
  {
    id: 'bpcl',
    name: 'Bharat Petroleum Corporation Limited (BPCL)',
    sector: 'oil-gas',
    roleFocus: 'Refineries (Mumbai / Kochi / Bina) & Marketing Terminals — Instrumentation Engineering',
    coreTechnologies: ['Batch Loading Gantries (Turbine / Mass Meters)', 'DCS & Tank Automation', 'Vapor Recovery & Hydrocarbon Gas Detectors', 'Smart Positioners & Actuators'],
    keySubjects: ['Transducers & Signal Conditioning', 'Control Valves & Positioners', 'Hazardous Area Zone 0/1/2 Classification', 'Process Control PID Tuning'],
    publiclyKnownFocus: 'Focuses on refinery unit availability, automated truck/rail tank-wagon loading gantries (custody metering & grounding interlocks), and plant turnaround loop checks.',
    practiceQuestions: [
      { topic: 'Tank Farm', question: 'Why is an 80 GHz FMCW radar or guided wave radar inside a stilling well used for hydrocarbon custody tanks?', guidelineAnswer: 'Non-contact radar eliminates mechanical floats/tapes, stays immune to temperature/vapor shifts, and achieves ±0.5–1 mm repeatability per API MPMS 3.1B.' },
    ],
    sourceDisclosure: 'Public refinery/terminal domain profile + editorial practice items.',
  },
  {
    id: 'hpcl',
    name: 'Hindustan Petroleum Corporation Limited (HPCL)',
    sector: 'oil-gas',
    roleFocus: 'Refining & LPG Bottling / Terminal Automation — Instrumentation Engineer',
    coreTechnologies: ['LPG Bullet Level (MLG + Radar)', 'Gas Detectors (Catalytic / IR LEL)', 'PLC Interlocks & ESD', 'Steam Boiler 3-Element Drum Level'],
    keySubjects: ['Boiler Drum Level (Shrink/Swell & 3-Element)', 'Sensors & Error Analysis', '4–20 mA / NAMUR NE43 Diagnostics', 'Electronics & Op-Amp Conditioning'],
    publiclyKnownFocus: 'Combines continuous refinery units with safety-critical LPG storage spheres, gas detection shutdown matrices (Cause & Effect), and utility steam generation.',
    practiceQuestions: [
      { topic: 'Boiler Control', question: 'Why does single-element feedback level control struggle on a steam boiler drum during sudden steam load spikes?', guidelineAnswer: 'Sudden steam demand drops drum pressure, expanding submerged steam bubbles ("Swell") so drum level momentarily RISES—tricking a simple feedback controller into closing feedwater right when MORE water is actually needed! 3-element control adds steam-flow feedforward + feedwater cascade.' },
    ],
    sourceDisclosure: 'Public PSU downstream operations focus + editorial practice items.',
  },
  {
    id: 'ongc',
    name: 'Oil and Natural Gas Corporation (ONGC)',
    sector: 'oil-gas',
    roleFocus: 'Upstream Offshore Platforms & Onshore Processing — AEE (Instrumentation)',
    coreTechnologies: ['3-Phase Separator Interface (Displacer / GWR)', 'Wellhead Pneumatic/Hydraulic ESD Panels', 'Fire & Gas Detection (UV/IR Flame, H₂S)', 'Compressor Anti-Surge Control'],
    keySubjects: ['High-Pressure Wellhead Sensors & Seals', 'Safety Instrumented Systems (SIL 2/3, 2oo3 Voting)', 'Electrical Measurements & Transducers', 'Control Theory & Signal Processing'],
    publiclyKnownFocus: 'Upstream production platforms and gas processing complexes prioritize 3-phase oil/water/gas separation, toxic H₂S safety shutdowns, offshore Ex compliance, and centrifugal compressor surge protection.',
    practiceQuestions: [
      { topic: 'SIS Voting', question: 'Compare 1oo2 vs 2oo3 transmitter voting on an offshore high-pressure separator shutdown.', guidelineAnswer: '1oo2 maximizes safety (trips if either sensor fails high) at higher spurious-trip risk; 2oo3 tolerates 1 single failed sensor with BOTH high safety availability AND minimal spurious production shutdowns.' },
    ],
    sourceDisclosure: 'Public upstream O&G domain profile + editorial GATE/offshore practice items.',
  },
  {
    id: 'gail',
    name: 'GAIL (India) Limited',
    sector: 'oil-gas',
    roleFocus: 'Natural Gas Transmission Pipelines, Gas Processing & Petrochemicals — Executive Trainee',
    coreTechnologies: ['Multipath Ultrasonic Custody Meters (AGA-9)', 'Process Gas Chromatographs (BTU/Wobbe)', 'Pipeline SCADA & Leak Detection', 'Gas Turbine Compressor Controls'],
    keySubjects: ['Gas Flow Measurement (Orifice ISO 5167, Ultrasonic, Coriolis)', 'Gas Chromatography (TCD vs FID)', 'SCADA & Industrial Protocols (Modbus/OPC)', 'Process Control & Valve Sizing'],
    publiclyKnownFocus: 'Operates nationwide high-pressure natural gas grids and petrochemical crackers where custody gas volume, BTU heating value (PGC), and compressor station SCADA telemetry are mission-critical.',
    practiceQuestions: [
      { topic: 'Custody Gas', question: 'Why are multipath Ultrasonic flow meters paired with Process Gas Chromatographs at major gas custody transfer stations?', guidelineAnswer: 'AGA-9 ultrasonic meters measure volumetric gas flow with near-zero pressure drop across huge lines, while the PGC determines gas mole% (C₁–C₆, CO₂, N₂) for compressibility Z and Gross Calorific Value (BTU) energy billing.' },
    ],
    sourceDisclosure: 'Public gas transmission & processing profile + editorial practice items.',
  },
  {
    id: 'eil',
    name: 'Engineers India Limited (EIL)',
    sector: 'oil-gas',
    roleFocus: 'EPC Instrumentation Design Engineering (Detail Engineering & Project Consultancy)',
    coreTechnologies: ['SPI / INtools Instrument Index', 'ISA-5.1 P&IDs & Control Philosophies', 'ISA-20 Datasheets & Orifice/Valve Sizing', 'Cause & Effect Matrices, Hook-ups & Cable Schedules'],
    keySubjects: ['Engineering Deliverables (Index, I/O List, Hook-up Drawings)', 'ASME PTC 19.3 TW Thermowell Wake Calculations', 'Control Valve Sizing (Choked Flow, Noise, Cavitation)', 'Hazardous Area & SIL Allocation Studies'],
    publiclyKnownFocus: 'As an EPC consultancy, EIL engineers author P&ID instrumentation markups, size control valves and orifice plates, write vendor RFQs/datasheets, review vendor drawings, and lead FAT/SAT acceptance.',
    practiceQuestions: [
      { topic: 'EPC Deliverables', question: 'What is the difference between an Instrument Hook-up Drawing and an Instrument Loop Diagram?', guidelineAnswer: 'A Hook-up Drawing shows the physical piping/mechanical installation BOM (root valve, manifold, impulse tube fittings, condensate pots), whereas a Loop Diagram shows end-to-end electrical terminal-by-terminal wiring from field sensor through JB, marshalling barrier, to DCS I/O channel.' },
    ],
    sourceDisclosure: 'Public EPC engineering consultancy workflow + editorial design practice items.',
  },
  {
    id: 'oil-india',
    name: 'Oil India Limited (OIL)',
    sector: 'oil-gas',
    roleFocus: 'Upstream Exploration/Production & Trunk Crude Pipelines — Instrumentation Engineer',
    coreTechnologies: ['Pump Station SCADA & Telemetry', 'Pigging Launch/Receiver Signallers', 'Custody Oil Flow & BS&W Water-Cut Analyzers', 'Wellhead Flow/Pressure Monitoring'],
    keySubjects: ['Primary Flow, Pressure & Level Sensors', 'PLC/SCADA & Communication Buses', 'Signal Conditioning & Analog/Digital Electronics', 'Industrial Maintenance & Calibration'],
    publiclyKnownFocus: 'Focuses on onshore crude/gas gathering stations, trunk pipeline pump automation, water-cut monitoring, and rugged field instrumentation reliability.',
    practiceQuestions: [
      { topic: 'Calibration', question: 'Why is Test Uncertainty Ratio (TUR ≥ 4:1) required when calibrating pipeline custody meters?', guidelineAnswer: 'The reference calibration standard must be at least 4× more accurate than the unit under test so calibrator error contributes negligibly (<3% via RSS) to pass/fail verification.' },
    ],
    sourceDisclosure: 'Public upstream/pipeline PSU profile + editorial practice items.',
  },

  // AUTOMATION OEMs (8 companies)
  {
    id: 'siemens',
    name: 'Siemens (Digital Industries)',
    sector: 'automation',
    roleFocus: 'SIMATIC PLC/DCS Engineering, Drives & Process Instrumentation',
    coreTechnologies: ['TIA Portal (S7-1500 / S7-1200) & PCS 7 / PCS neo', 'PROFINET RT/IRT & PROFIBUS DP/PA', 'SITRANS P / F / L Field Instruments', 'SINAMICS VFD Drives'],
    keySubjects: ['IEC 61131-3 Ladder, FBD & SCL', 'PROFINET vs PROFIBUS Architecture', 'Analog Scaling (0–27,648 Raw Counts)', 'PID & Cascade Control'],
    publiclyKnownFocus: 'Siemens automation ecosystems center on TIA Portal, SIMATIC S7 PLCs, PCS 7 process DCS, PROFINET deterministic Ethernet, and SITRANS process instrumentation.',
    practiceQuestions: [
      { topic: 'TIA Scaling', question: 'In SIMATIC S7-1200/1500 analog cards, what raw integer range represents nominal 4–20 mA (0%–100%), and what indicates wire break?', guidelineAnswer: 'Nominal 0%–100% maps to integers 0 to 27,648; slight overrange reaches 32,511, while wire break (<1.185 mA / underflow) reports −32,768 (hex 8000) or overflow +32,767.' },
    ],
    sourceDisclosure: 'Public Siemens SIMATIC/SITRANS technical documentation + editorial practice items.',
  },
  {
    id: 'schneider-electric',
    name: 'Schneider Electric',
    sector: 'automation',
    roleFocus: 'EcoStruxure Process Automation, Modicon PLCs & Triconex Safety',
    coreTechnologies: ['EcoStruxure Foxboro DCS & Control Expert (Modicon M580)', 'Triconex TMR (Triple Modular Redundant) SIS', 'Modbus TCP/RTU & EtherNet/IP', 'AVEVA SCADA / Wonderware'],
    keySubjects: ['Safety Instrumented Systems (SIL 3 / TMR)', 'PLC Scan Cycle & Structured Text', 'Modbus RTU/TCP Framing & RS-485', 'Process Control & Energy Management'],
    publiclyKnownFocus: 'Spans Modicon M580 ePAC PLCs, Foxboro EcoStruxure DCS, Triconex triple-modular-redundant safety shutdown systems, and AVEVA/Wonderware SCADA.',
    practiceQuestions: [
      { topic: 'Safety TMR', question: 'How does Triple Modular Redundant (TMR) Triconex architecture guarantee both safety and continuous uptime?', guidelineAnswer: 'Three completely independent processor legs execute logic in parallel and execute 2oo3 hardware voting—meaning one failed CPU leg triggers neither a missed trip nor a false shutdown, and can be hot-replaced live.' },
    ],
    sourceDisclosure: 'Public Schneider Electric EcoStruxure/Triconex architecture + editorial practice items.',
  },
  {
    id: 'abb',
    name: 'ABB',
    sector: 'automation',
    roleFocus: 'Ability 800xA DCS, Measurement & Analytics, Drives & Electrification',
    coreTechnologies: ['ABB Ability System 800xA DCS', 'AC 800M Controllers & Profibus/PROFINET', 'ABB 266 Pressure, Coriolis & Magmeters', 'AC500 PLC & Industrial Drives'],
    keySubjects: ['DCS Architecture & Redundancy', 'Analytical Instrumentation (pH, CEMS, PGC)', 'Instrumentation Electronics & Isolation', 'Variable Speed Pump vs Control Valve Energy'],
    publiclyKnownFocus: 'Known globally for System 800xA unified electrical-plus-process DCS integration across power, metals, pulp/paper, and chemical industries alongside measurement instrumentation.',
    practiceQuestions: [
      { topic: 'Plant Efficiency', question: 'When is a Variable Frequency Drive (VFD) pump preferred over a throttling control valve for flow control?', guidelineAnswer: 'Where static head is low and friction losses dominate across wide flow swings—because affinity laws drop pump power with Q³, saving massive energy versus burning ΔP across a throttled valve (unless tight millisecond shutoff is needed).' },
    ],
    sourceDisclosure: 'Public ABB 800xA & Measurement documentation + editorial practice items.',
  },
  {
    id: 'honeywell',
    name: 'Honeywell Process Solutions',
    sector: 'automation',
    roleFocus: 'Experion PKS DCS, Safety Manager & SmartLine Field Instruments',
    coreTechnologies: ['Experion PKS (C300 Controller & ControlEdge PLC)', 'Safety Manager SIS', 'SmartLine Pressure/Temp/Radar Instruments', 'ISA-101 HMI & Alarm Management'],
    keySubjects: ['DCS Regulatory & APC/MPC Control', 'Alarm Management (ISA-18.2)', 'HART / Fieldbus / Industrial Cybersecurity', 'Process Modeling & PID'],
    publiclyKnownFocus: 'Honeywell Experion PKS C300 architectures lead in refining/petrochemical DCS, Advanced Process Control (MPC), Safety Manager SIS, and ISA-101 operator ergonomics.',
    practiceQuestions: [
      { topic: 'MPC vs PID', question: 'How does Supervisory Model Predictive Control (MPC) interact with base-layer DCS PID loops?', guidelineAnswer: 'MPC sits one layer above regulatory DCS PIDs—computing optimal steady-state constraints across interacting MIMO variables and writing smooth Setpoint moves down to slave PID controllers.' },
    ],
    sourceDisclosure: 'Public Honeywell Experion PKS domain focus + editorial practice items.',
  },
  {
    id: 'emerson',
    name: 'Emerson Automation Solutions',
    sector: 'automation',
    roleFocus: 'DeltaV / Ovation DCS, Rosemount, Micro Motion & Fisher Control Valves',
    coreTechnologies: ['DeltaV DCS & Electronic Marshalling (CHARMs)', 'Rosemount 3051 / 3144P / 5408 Instruments', 'Micro Motion Coriolis Mass Meters', 'Fisher Control Valves & FIELDVUE Positioners'],
    keySubjects: ['4–20 mA / HART 7 / WirelessHART Diagnostics', 'Control Valve Sizing & Positioner Signatures', 'Coriolis & Capacitance DP Measurement', 'Cascade, Feedforward & Override Control'],
    publiclyKnownFocus: 'Combines flagship Rosemount transmitters, Micro Motion Coriolis meters, Fisher valves/FIELDVUE diagnostics, DeltaV CHARMs electronic marshalling, and Ovation power-plant DCS.',
    practiceQuestions: [
      { topic: 'Electronic Marshalling', question: 'What wiring problem does DeltaV CHARMs (or universal I/O marshalling) solve compared to traditional fixed I/O marshalling?', guidelineAnswer: 'Every field wire lands in any order onto universal termination blocks with plug-in single-channel Characterization Modules (CHARMs)—eliminating tedious cross-wiring inside marshalling cabinets when field tags change late in EPC projects!' },
    ],
    sourceDisclosure: 'Public Emerson DeltaV/Rosemount/Fisher technical documentation + editorial practice items.',
  },
  {
    id: 'yokogawa',
    name: 'Yokogawa Electric',
    sector: 'automation',
    roleFocus: 'CENTUM VP DCS, ProSafe-RS SIS & OpreX Field Instruments',
    coreTechnologies: ['CENTUM VP FCS Controllers & Vnet/IP', 'ProSafe-RS Safety Instrumented System', 'DPharp EJX Resonant Silicon Transmitters', 'ZR22 Zirconia O₂ & ROTAMASS Coriolis'],
    keySubjects: ['DCS Architecture & Vnet/IP Redundancy', 'Silicon Resonant vs Capacitance DP Sensors', 'Zirconia O₂ & Gas Analyzers', 'Boiler & Refinery Process Control'],
    publiclyKnownFocus: 'Renowned for ultra-high-availability CENTUM VP DCS, ProSafe-RS integrated safety, DPharp resonant silicon DP transmitters, YEWFLO vortex meters, and zirconia combustion analyzers.',
    practiceQuestions: [
      { topic: 'Resonant DP', question: 'How does a DPharp silicon resonant sensor differ physically from a capacitive DP cell?', guidelineAnswer: 'Instead of measuring analog pF capacitance deflection, two microscopic H-shaped silicon beams oscillate at ~90 kHz—pressure puts one beam in tension (frequency ↑) and one in compression (frequency ↓), giving direct digital frequency readout!' },
    ],
    sourceDisclosure: 'Public Yokogawa CENTUM/DPharp technical documentation + editorial practice items.',
  },
  {
    id: 'endress-hauser',
    name: 'Endress+Hauser',
    sector: 'automation',
    roleFocus: 'Field Instrumentation Engineering, Flow/Level/Liquid Analysis & Heartbeat Tech',
    coreTechnologies: ['Promag Magmeters & Promass Coriolis', 'Micropilot 80 GHz Radar & Levelflex GWR', 'Memosens Digital Liquid pH/DO/Conductivity', 'HART / PROFIBUS PA / EtherNet-APL'],
    keySubjects: ['Flow Meter Selection Matrix (Conductive vs Gas vs Viscous)', '80 GHz Radar vs Guided Wave Radar', 'Digital Memosens Electrochemistry (pH/DO/Cond)', 'Calibration Traceability & Heartbeat Verification'],
    publiclyKnownFocus: 'Pure-play field instrumentation leader covering flow, level, pressure, temperature, liquid analysis (Memosens), and in-situ Heartbeat diagnostic verification without process interruption.',
    practiceQuestions: [
      { topic: 'Liquid Analysis', question: 'Why does inductive Memosens contactless coupling solve chronic plant pH probe maintenance failures?', guidelineAnswer: 'Classic analog pH BNC connectors fail whenever humidity shorts the 10¹² Ω glass signal. Memosens replaces metallic contacts with an inductive transformer gap inside waterproof polymer—immune to water splashes and storing calibration data inside the sensor head!' },
    ],
    sourceDisclosure: 'Public Endress+Hauser portfolio documentation + editorial practice items.',
  },
  {
    id: 'rockwell-automation',
    name: 'Rockwell Automation (Allen-Bradley)',
    sector: 'automation',
    roleFocus: 'ControlLogix / CompactLogix PAC, FactoryTalk SCADA & Motion/Drives',
    coreTechnologies: ['Studio 5000 Logix Designer (ControlLogix / CompactLogix)', 'EtherNet/IP CIP Safety & DLR Ring', 'FactoryTalk View SE / Optix HMI', 'PowerFlex Drives & GuardLogix'],
    keySubjects: ['PLC Tag-Based Programming & Add-On Instructions (AOIs)', 'Scan Execution, Periodic Tasks & Interrupts', 'EtherNet/IP Device-Level Ring (DLR) Topology', 'Interlocks, Timers & Analog Scaling'],
    publiclyKnownFocus: 'Dominant in discrete, batch, life sciences, CPG, and skid OEM automation using tag-based Studio 5000 ControlLogix controllers, GuardLogix safety, and EtherNet/IP.',
    practiceQuestions: [
      { topic: 'Logix Tasks', question: 'Why should a PID loop inside ControlLogix execute inside a deterministic Periodic Task (e.g., 100 ms) instead of the Continuous Main Task?', guidelineAnswer: 'PID integral and derivative calculations assume constant sampling time Δt. Continuous task scan times fluctuate as logic branches execute; placing PID inside a fixed Periodic Task guarantees exact constant Δt.' },
    ],
    sourceDisclosure: 'Public Rockwell Automation Studio 5000 / EtherNet/IP documentation + editorial practice items.',
  },
];

