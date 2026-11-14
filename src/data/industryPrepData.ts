export interface CompanyPrepProfile {
  id: string;
  name: string;
  sector: 'oil-gas' | 'automation' | 'campus';
  roleFocus: string;
  coreTechnologies: string[];
  keySubjects: string[];
  publiclyKnownFocus: string;
  practiceQuestions: { topic: string; question: string; guidelineAnswer: string }[];
  sourceDisclosure: string;
  /** Shown for NITJ ICE 2026 and 2027 campus tracks. */
  campusNote?: string;
  rounds?: { title: string; points: string[] }[];
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

  // NITJ ICE campus companies seen in 2026–2027 shared experiences.
  // Names of students are not copied. Questions are study items built from the
  // topics those write-ups actually covered, plus the role's core instruments.
  {
    id: 'siemens-energy',
    name: 'Siemens Energy',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Graduate Engineer, power and energy instrumentation',
    coreTechnologies: ['TIA Portal and SIMATIC ladder', 'Tank level loops', 'Float and DP level switches', 'Stepper and field instrumentation'],
    keySubjects: ['Accuracy, precision, range and span', 'PLC vs microprocessor', 'Ladder logic and flip-flop latches', 'Control systems including Kalman filtering at a basic level'],
    publiclyKnownFocus: 'ICE seniors who sat Siemens Energy described a resume-led technical round, then a combined technical and HR round. The technical talk stayed on the candidate’s project plus plant instrumentation and PLC basics.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Introduce yourself, then walk the project aim.', 'Define accuracy, precision, range, and span from that project.', 'Draw a start-stop-seal ladder and say how you would open it in TIA Portal.', 'For a tank level loop, name the inputs and outputs.', 'Explain a float level switch and the discrete signal it produces.', 'Difference between a microprocessor and a PLC. Implement a latch or flip-flop in ladder.'] },
      { title: 'Round 2: Technical and HR', points: ['Why that actuator or motor was chosen in the project.', 'What predictive control and a Kalman filter are doing in one plain sentence.', 'How you handle a teammate who is not contributing.', 'Whether you can relocate, travel, and meet clients.'] },
      { title: 'What to revise', points: ['Industrial instrumentation and measurement systems first.', 'Be able to explain every line of the resume without notes.'] },
    ],
    practiceQuestions: [
      { topic: 'Static characteristics', question: 'A level transmitter reads 1.52 m when the dip tape says 1.50 m, and it repeats 1.52 m every time. Is that an accuracy problem or a precision problem?', guidelineAnswer: 'It is precise (repeatable) but not accurate. Accuracy is closeness to the true value. Precision is repeatability. The 0.02 m offset is a bias you remove in calibration. Range is the region it can measure. Span is upper range value minus lower range value.' },
      { topic: 'Level loop', question: 'A tank high-level trip uses a float switch into a PLC. What are the inputs and outputs, and what kind of signal is the float?', guidelineAnswer: 'Input is the float contact (discrete 24 V DC or a dry contact). Output is the pump or inlet valve command, plus an alarm. A float switch is a digital on/off signal, not a 4–20 mA continuous level. Continuous level would be a DP, radar, or ultrasonic transmitter.' },
      { topic: 'PLC vs microprocessor', question: 'Why is a PLC used for that tank instead of the microprocessor you used in lab?', guidelineAnswer: 'A PLC is an industrial computer with rugged I/O, a fixed scan cycle, and ladder that electricians can maintain. A microprocessor kit is a general CPU you wire and program at register level. The PLC also gives you deterministic scan, watchdogs, and easy latches. A flip-flop in ladder is a seal-in coil: output contact in parallel with the start button, broken by stop.' },
    ],
    sourceDisclosure: 'Topics taken from an NITJ ICE Siemens Energy write-up on the placement portal. Guideline answers are study notes, not a transcript.',
  },
  {
    id: 'lnt',
    name: 'Larsen & Toubro',
    sector: 'campus',
    roleFocus: 'NITJ ICE — GET / PGET, EPC instrumentation and site commissioning',
    coreTechnologies: ['P&ID and loop diagrams', 'Hook-up and cable schedule', 'Control valve and orifice datasheets', 'FAT and site loop check'],
    keySubjects: ['ISA-5.1 tags', '4–20 mA loop check', 'Hazardous area basics', 'Construction versus design engineering'],
    publiclyKnownFocus: 'L&T hires ICE graduates into both design offices and site commissioning. Seniors from the 2026 cycle posted L&T GET and PGET experiences. The interview follows the same shape as the other core companies: project and fundamentals, then HR on posting and travel.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Project deep-dive, then a P&ID symbol or loop tag.', 'Difference between a hook-up drawing and a loop diagram.', 'How you prove a 4–20 mA loop from field to panel.', 'Fail-open versus fail-close on a named valve.'] },
      { title: 'Round 2: Technical and HR', points: ['Site versus office: are you ready for a project site?', 'A teamwork or deadline story from a lab or internship.', 'Willingness to travel between design office and site.'] },
      { title: 'What to revise', points: ['One instrument you can draw from memory: RTD, orifice, or control valve.', 'One drawing you can explain: P&ID tag, hook-up, or loop diagram.'] },
    ],
    practiceQuestions: [
      { topic: 'Drawings', question: 'What is the difference between an instrument hook-up and a loop diagram?', guidelineAnswer: 'The hook-up is the mechanical installation: root valve, manifold, impulse tube, fittings, and bill of material. The loop diagram is the electrical path: sensor terminals, junction box, barrier or marshalling, and the DCS or PLC channel.' },
      { topic: 'Loop check', question: 'How do you check a 4–20 mA pressure loop before startup?', guidelineAnswer: 'Simulate 4 mA, 12 mA, and 20 mA with a loop calibrator at the transmitter. Confirm the DCS reads 0%, 50%, and 100% of the configured range. Check polarity, the 250 ohm HART resistor if used, and that a broken wire falls to the configured fail state, not a frozen last value.' },
    ],
    sourceDisclosure: 'L&T appears repeatedly in NITJ ICE 2026 shared experiences. Questions are the EPC instrumentation topics that role tests.',
  },
  {
    id: 'jsw-steel',
    name: 'JSW Steel',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Plant instrumentation, iron and steel utilities',
    coreTechnologies: ['Furnace and stove temperature', 'Blast furnace and coke oven gas analysis', 'Hydraulic and cooling-water loops', 'PLC interlocks on mills'],
    keySubjects: ['Thermocouple versus RTD', 'Gas analyzers', 'Interlocks and permissives', 'Harsh-environment installation'],
    publiclyKnownFocus: 'JSW Steel showed up in ICE shared experiences, including a CPC (capex and insurance) posting and plant roles. Steel-plant instrumentation is high temperature, dirty gas, and hard interlocks.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Where you use a thermocouple instead of an RTD.', 'One gas-analyzer or flow measurement you understand.', 'What an interlock is, with a cooling-water or furnace example.'] },
      { title: 'Round 2: Technical and HR', points: ['Shift work and a plant location.', 'A safety example from lab or training.'] },
      { title: 'What to revise', points: ['Temperature sensors, 4–20 mA, and one control loop you can narrate.'] },
    ],
    practiceQuestions: [
      { topic: 'Temperature', question: 'Why is a Type K or S thermocouple used on a furnace and not a Pt100 RTD?', guidelineAnswer: 'A Pt100 is accurate but typically limited to about 600 °C in an industrial sheath, and it is slower inside a heavy well. A thermocouple junction survives much higher temperature and responds faster. Type S (platinum-rhodium) is used where the furnace is hottest and drift must stay small.' },
      { topic: 'Interlock', question: 'The stove or reheating furnace must not fire if cooling water flow is low. How do you build that interlock?', guidelineAnswer: 'A flow switch or transmitter low-alarm is a permissive into the burner management PLC. Loss of flow drops the permissive, which closes the fuel valve (fail-closed) and raises an alarm. You do not leave this only to a PID. It is a discrete safety permissive, tested during commissioning.' },
    ],
    sourceDisclosure: 'JSW Steel is named in NITJ ICE shared experiences. Questions match steel-plant instrumentation, not a copied transcript.',
  },
  {
    id: 'jindal-stainless',
    name: 'Jindal Stainless',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Plant and melt-shop instrumentation',
    coreTechnologies: ['High-temperature thermocouples', 'Cooling-water and hydraulic loops', 'Weighing and level on furnaces', 'PLC mill interlocks'],
    keySubjects: ['Temperature and flow', 'Cold-junction compensation', 'Permissives', 'Calibration on a running plant'],
    publiclyKnownFocus: 'Jindal Stainless Limited experiences were posted by NITJ students in the same 2026 cycle. The technical test is plant measurement under heat, scale, and vibration.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Thermocouple cold junction and extension wire.', 'A flow or level measurement on a harsh line.', 'One interlock you would not trust to a PID alone.'] },
      { title: 'Round 2: HR', points: ['Plant location, shifts, and why core instrumentation instead of software.'] },
      { title: 'What to revise', points: ['Be able to sketch a thermocouple loop from tip to transmitter.'] },
    ],
    practiceQuestions: [
      { topic: 'Thermocouple', question: 'Why must a Type K thermocouple use Type K extension cable back to the transmitter?', guidelineAnswer: 'The cold junction is only corrected at the transmitter or card. If you join the thermocouple to copper too early, you create extra junctions at the plant temperature and the reading is wrong by that temperature. Matching extension wire moves the cold junction to the conditioned terminal.' },
    ],
    sourceDisclosure: 'Jindal Stainless is named in NITJ shared experiences. The question is the temperature fundamental that role needs.',
  },
  {
    id: 'tata-steel',
    name: 'Tata Steel',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Works instrumentation, ironmaking and utilities',
    coreTechnologies: ['Furnace temperature and gas analysis', 'Weigh feeders and belt scales', 'Water and gas flow', 'DCS and PLC on utilities'],
    keySubjects: ['Sensor selection', '4–20 mA and HART', 'Safety interlocks', 'Measurement error'],
    publiclyKnownFocus: 'Tata Steel appears in the 2026 experience list. ICE roles sit on utilities, coke oven and blast furnace gas, and material weighing rather than on software service companies.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['One sensor, its principle, and its failure mode.', 'How a belt weigher or a gas flow measurement is checked.', 'A utility control loop: drum level, cooling water, or combustion air.'] },
      { title: 'Round 2: HR', points: ['Plant township posting and shift pattern.'] },
      { title: 'What to revise', points: ['Three instruments only, explained cleanly: thermocouple, DP flow, control valve.'] },
    ],
    practiceQuestions: [
      { topic: 'Flow', question: 'Blast furnace gas is dirty and the line is large. Why might you avoid a sharp-edge orifice?', guidelineAnswer: 'Dirt erodes the sharp edge and plugs the taps, so the discharge coefficient drifts. A Venturi or a flow nozzle keeps a contoured inlet, loses less pressure, and tolerates dirty gas better. You still need a purge or a seal pot on the impulse lines.' },
    ],
    sourceDisclosure: 'Tata Steel is named in NITJ shared experiences. The question is the flow choice a steel-plant interview expects.',
  },
  {
    id: 'bel',
    name: 'Bharat Electronics Limited (BEL)',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Electronics, embedded measurement, and defence systems',
    coreTechnologies: ['Analog signal conditioning', 'ADC and embedded controllers', 'Sensors and test equipment', 'Defence-grade documentation'],
    keySubjects: ['Op-amps and filters', 'ADC resolution', 'Microprocessor versus microcontroller', 'Measurement error'],
    publiclyKnownFocus: 'A BEL recruitment drive was posted in the same experience set. BEL interviews for ICE lean toward electronics, embedded labs, and sensors more than refinery valves.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Op-amp configurations and a filter.', 'ADC bits and what one LSB means.', 'A sensor from the transducers lab.', 'Microprocessor lab experiment you actually did.'] },
      { title: 'Round 2: HR', points: ['Bond or posting if the offer has one.', 'Why a PSU electronics role.'] },
      { title: 'What to revise', points: ['Analog electronics and the microprocessor lab manual.'] },
    ],
    practiceQuestions: [
      { topic: 'ADC', question: 'A 12-bit ADC spans 0 to 10 V. What is 1 LSB, and why does that matter for a 4–20 mA measurement?', guidelineAnswer: '1 LSB is 10 V / 4096 ≈ 2.44 mV. Across a 250 ohm resistor, 4–20 mA is 1 to 5 V, so the current resolution is about 2.44 mV / 250 ohm ≈ 9.8 µA. If the process span is small, those counts become the limit on resolution, separate from the sensor accuracy.' },
    ],
    sourceDisclosure: 'BEL is named in NITJ shared experiences. The question is the electronics topic that drive tests.',
  },
  {
    id: 'srf',
    name: 'SRF Limited',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Chemicals and fluorochemicals plant instrumentation',
    coreTechnologies: ['Corrosive-service transmitters', 'Reactor temperature and pressure', 'pH and gas detection', 'DCS regulatory control'],
    keySubjects: ['Material of construction', 'Ex classification', 'Cascade temperature control', 'Analyzers'],
    publiclyKnownFocus: 'SRF Limited was posted as a placement experience. Chemical-plant ICE work is wetted-part selection, hazardous area, and reactor temperature control.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Why Hastelloy or PTFE instead of plain 316 on a fluoride or acid line.', 'Reactor temperature cascade.', 'A gas detector or pH loop.'] },
      { title: 'Round 2: HR', points: ['Plant location and rotating shifts.'] },
      { title: 'What to revise', points: ['One analyzer and one control loop, both drawn.'] },
    ],
    practiceQuestions: [
      { topic: 'Materials', question: 'Why can a standard 316L diaphragm fail quickly in a fluorochemical reactor?', guidelineAnswer: 'Wet halogen acids and fluorides attack stainless steel. The wetted diaphragm and seal have to be Hastelloy, tantalum, or a PTFE-faced seal chosen from the corrosion chart. The transmitter body can stay outside the process. Picking 316L because it is the default stock item is a common datasheet mistake.' },
    ],
    sourceDisclosure: 'SRF is named in NITJ shared experiences. The question is the materials decision that chemical-plant instrumentation interviews use.',
  },
  {
    id: 'medtronic',
    name: 'Medtronic',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Internship and full-time conversion, medical devices and measurement',
    coreTechnologies: ['Sensors and signal conditioning', 'Embedded firmware basics', 'Data integrity and test methods', 'Quality documentation'],
    keySubjects: ['Measurement error and calibration', 'Analog front end', 'Filters', 'Why a result is trustworthy'],
    publiclyKnownFocus: 'The question bank lists a Medtronic online assessment, and a senior posted an internship-to-full-time conversion. The technical talk is measurement quality and the candidate’s project, not a refinery P&ID.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Online assessment', points: ['Aptitude plus basic electronics or programming. The portal lists a Medtronic OA shell, but the questions themselves were not filled in.'] },
      { title: 'Technical', points: ['Project: what you measured, the sensor, and how you knew the number was right.', 'Noise, filtering, and calibration.', 'A simple circuit from analog electronics.'] },
      { title: 'HR', points: ['Why a medical-device company, and how you handle a regulated document.'] },
    ],
    practiceQuestions: [
      { topic: 'Measurement quality', question: 'You calibrated a sensor at two points and the line between them is used everywhere. What error are you ignoring?', guidelineAnswer: 'Linearity and hysteresis. Two-point calibration removes offset and span error only if the sensor is straight. A real sensor curves, and it does not come back down the same path. You need intermediate points, and you state the residual as a percent of span.' },
    ],
    sourceDisclosure: 'Medtronic is named in the NITJ question bank and in a conversion experience. The OA items themselves were empty on the portal, so this question is a measurement fundamental.',
  },
  {
    id: 'technip-energies',
    name: 'Technip Energies',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Intern and PPO, process EPC instrumentation',
    coreTechnologies: ['P&ID markup', 'Datasheets and instrument index', 'Control valve and relief interfaces', 'Vendor document review'],
    keySubjects: ['EPC deliverables', 'Control narrative', 'Hazardous area', 'Loop and hook-up drawings'],
    publiclyKnownFocus: 'A Technip Energies intern-plus-PPO experience is in the 2026 set. The work is design-office instrumentation: documents, not a shift on a panel.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['Explain a P&ID tag from sensor to valve.', 'What goes on an instrument datasheet.', 'Fail position of a valve and who decides it.'] },
      { title: 'Intern to PPO', points: ['What you produced in the internship: index, datasheet, or comment on a vendor drawing.', 'How you ask when a senior’s markup conflicts with the process licensor.'] },
      { title: 'What to revise', points: ['One control loop drawn with tag numbers.'] },
    ],
    practiceQuestions: [
      { topic: 'EPC', question: 'Who decides that a cooling-water valve fails open, and where is that written?', guidelineAnswer: 'Process and safety decide the fail position from the hazard. Instrumentation records it on the P&ID, the control narrative, and the valve datasheet as FC or FO. The vendor then builds the actuator and spring to match. Changing it on site without revising those three documents is how a trip ends up backwards.' },
    ],
    sourceDisclosure: 'Technip Energies intern and PPO is named in NITJ shared experiences. The question is the EPC decision that role owns.',
  },
  {
    id: 'jio-bp',
    name: 'Jio-bp',
    sector: 'campus',
    roleFocus: 'NITJ ICE — Fuels retail, terminals, and energy operations',
    coreTechnologies: ['Tank farm level and leak detection', 'Loading-gantry metering', 'Fire and gas', 'Terminal PLC and SCADA'],
    keySubjects: ['Radar or servo tank gauging', 'Custody metering', 'ESD and grounding interlocks', 'Hazardous area'],
    publiclyKnownFocus: 'Jio-bp appears in the 2026 experiences next to Reliance. Terminal work for an ICE graduate is tank gauging, gantry interlocks, and fire-and-gas rather than refinery DCS design.',
    campusNote: 'NITJ Instrumentation and Control, batches 2026 and 2027.',
    rounds: [
      { title: 'Round 1: Technical', points: ['How you measure fuel level in a storage tank.', 'Why a loading arm will not start until the tanker is grounded and the vapour recovery is healthy.', '4–20 mA versus a digital alarm.'] },
      { title: 'Round 2: HR', points: ['Retail or terminal posting, travel, and shift.'] },
      { title: 'What to revise', points: ['Level measurement and one safety interlock.'] },
    ],
    practiceQuestions: [
      { topic: 'Terminal safety', question: 'Why is the tanker earthing interlock hardwired into the loading permissive?', guidelineAnswer: 'A floating road tanker can spark while hydrocarbon flows. The earth-proving unit must see a low-resistance bond before the PLC or the loading controller opens the batch valve. It is a permissive, not a soft alarm the operator can bypass from the HMI.' },
    ],
    sourceDisclosure: 'Jio-bp is named in NITJ shared experiences. The question is the terminal interlock that role is hired to understand.',
  },
];

