export type AutomationSectionId = 'plc' | 'dcs' | 'scada' | 'protocols' | 'control-systems';

export interface AutomationTopicBlock {
  title: string;
  tag: string;
  summary: string;
  keyPoints: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface AutomationModule {
  id: AutomationSectionId;
  title: string;
  shortTitle: string;
  standard: string;
  subtitle: string;
  mermaidTitle: string;
  mermaidCode: string;
  blocks: AutomationTopicBlock[];
}

export const AUTOMATION_MODULES: AutomationModule[] = [
  {
    id: 'plc',
    title: 'Programmable Logic Controllers (PLC)',
    shortTitle: 'PLC',
    standard: 'IEC 61131-3 · Deterministic Scan Execution',
    subtitle: 'Modular rack CPU, digital/analog I/O wiring, deterministic scan cycle, ladder logic, timers, counters, interlocks, and field troubleshooting.',
    mermaidTitle: 'Deterministic Cyclic PLC Scan Execution',
    mermaidCode: `flowchart LR
  A["1. Read Physical Inputs\\n(Update Input Image Table)"] --> B["2. Execute User Program\\n(Ladder / FBD / ST Rungs)"]
  B --> C["3. Housekeeping & Comms\\n(HMI / Modbus / Watchdog)"]
  C --> D["4. Write Physical Outputs\\n(Update Output Image Table)"]
  D --> A`,
    blocks: [
      {
        title: 'Hardware Architecture: Rack, Power Supply, CPU & I/O',
        tag: 'HARDWARE',
        summary: 'A modular PLC separates the switching power supply, real-time microprocessor CPU, communication couplers, and optically isolated DI/DO/AI/AO cards across a deterministic backplane.',
        keyPoints: [
          'Digital Input (DI) cards use optocouplers (~2.5 kV isolation) with RC debouncing (3–10 ms) to read 24 VDC field switches/proximity sensors.',
          'Sink vs Source wiring: In NPN (Sinking input / Sourcing field sensor) vs PNP (Sourcing field sensor feeding Sinking PLC common −M), matching polarity avoids dead channels.',
          'Digital Output (DO) cards use isolated relays (dry contact up to 2 A AC/DC), TRIACs (AC loads), or fast solid-state MOSFET/transistor outputs (DC solenoids + flyback diodes!).',
          'Analog I/O (AI/AO) integrates 12–16 bit SAR/ΣΔ converters scaling 4–20 mA (e.g., Siemens 0–27,648 counts; Allen-Bradley 4,000–20,000 counts) with out-of-range NAMUR NE43 diagnostics.',
        ],
      },
      {
        title: 'Scan Cycle, Watchdog & Race Conditions',
        tag: 'EXECUTION',
        summary: 'PLCs operate strictly sequentially from top rung to bottom rung using snapshot Input/Output Image Tables rather than reading live pins mid-scan.',
        keyPoints: [
          'Typical scan time sits between 1 ms and 20 ms depending on program size and remote Profinet/EtherNet/IP I/O polling.',
          'A hardware Watchdog Timer trips the CPU to Fault Stop (de-energizing all physical outputs safely!) if an infinite loop stalls execution beyond ~100–500 ms.',
          'Double-Coil Syndrome: writing the same physical output address Q:0/0 on two different ladder rungs lets the LAST rung overwrite earlier rungs during Output Update!',
        ],
      },
      {
        title: 'Timers (TON / TOF / RTO), Counters (CTU / CTD) & Fail-Safe Interlocks',
        tag: 'IEC 61131-3',
        summary: 'Standardized timing, event counting, and fail-safe Normally-Closed (NC) hardwired stop/trip interlocks form the backbone of machine and burner safety.',
        keyPoints: [
          'TON (On-Delay): accumulates elapsed time while rung stays TRUE; sets Done (DN/Q) bit once ACC ≥ PRE; resets immediately when rung goes FALSE.',
          'TOF (Off-Delay): energizes Q immediately when rung goes TRUE, then holds Q ON for Preset duration AFTER rung goes FALSE (e.g., cooling fan run-on).',
          'RTO (Retentive Timer On): preserves ACC value across rung drops or power cycles until explicitly cleared via RES coil.',
          'FAIL-SAFE STOP RULE: Wire physical emergency Stop & Trip field pushbuttons as Normally Closed (NC = 24 VDC healthy!). Therefore inside Ladder Logic, program an XIC / NO contact — so a cut field wire drops 24 V to 0 and cleanly trips the motor!',
        ],
        table: {
          headers: ['Instruction', 'Action When Input TRUE', 'Action When Input FALSE', 'Industrial Use Case'],
          rows: [
            ['TON (On-Delay)', 'Accumulates up to Preset → Q=1', 'Resets ACC=0, Q=0 immediately', 'Star-Delta motor transition delay, alarm debounce'],
            ['TOF (Off-Delay)', 'Q=1 immediately, ACC=0', 'Counts Preset delay → then Q=0', 'Turbine lube pump post-cool coast-down'],
            ['RTO (Retentive)', 'Accumulates & latches Q=1', 'Holds ACC frozen until RES', 'Compressor total run-hour maintenance counter'],
            ['CTU / CTD', 'Increments/Decrements on rising edge', 'Holds current CV count', 'Batch bottle counting & diverter gate control'],
          ],
        },
      },
      {
        title: 'Analog I/O Scaling & Field Troubleshooting',
        tag: 'DIAGNOSTICS',
        summary: 'Systematic verification separating physical field loop faults from PLC software scaling mistakes.',
        keyPoints: [
          'Raw counts underflow (<3.6 mA → negative Siemens counts / <3277 AB) indicates open field cable, blown loop fuse, or NAMUR downscale fault.',
          'Always verify DO inductive solenoid coils include parallel reverse-biased flyback suppression diodes (DC) or RC snubbers (AC) to save transistor switches.',
          'Never leave Force Tables active after commissioning—document and clear all forced I/O bits before plant handover!',
        ],
      },
    ],
  },
  {
    id: 'dcs',
    title: 'Distributed Control Systems (DCS)',
    shortTitle: 'DCS',
    standard: 'IEC 61131 / Function Blocks · ISA-18.2 / ISA-101',
    subtitle: 'Plant-wide continuous process control architecture, redundant controllers, operator/engineering stations, marshalling, and alarm rationalization.',
    mermaidTitle: 'Redundant Plant-Wide DCS Control Architecture',
    mermaidCode: `flowchart TB
  OS["Operator Stations (HMI Consoles)"] --- NET["Redundant Control Highway (Dual Ethernet)"]
  ES["Engineering Station & Historian"] --- NET
  NET --- FCS1["Controller Pair A (Primary / Hot-Standby)"]
  NET --- FCS2["Controller Pair B (Redundant)"]
  FCS1 --- IO1["Redundant I/O Bus & Marshalling Cabinets"]
  FCS2 --- IO2["Smart Fieldbus / HART 4-20 mA Field Loops"]`,
    blocks: [
      {
        title: 'DCS Philosophy vs PLC Philosophy',
        tag: 'ARCHITECTURE',
        summary: 'While PLCs excel at sub-10 ms discrete factory sequencing, a DCS provides a single unified plant-wide database integrating thousands of continuous PID loops, batch recipes, alarm management, and online hot-swappable redundancy.',
        keyPoints: [
          'Single Database Advantage: creating tag FIC-101 in the Engineering Station automatically binds the controller Function Block, Operator Faceplate, Historian tag, and Alarm configuration.',
          'Distributed Field Control Stations (FCS) execute 100–500 ms regulatory scans independently—so even if all operator workstations reboot, the plant continues running safely!',
          'Online Engineering Download allows modifying PID tuning, interlock logic, or adding cards without halting running refinery controllers.',
        ],
        table: {
          headers: ['Dimension', 'PLC Architecture', 'DCS Architecture'],
          rows: [
            ['Primary Strength', 'Fast discrete logic & motion (<5 ms)', 'Continuous regulatory process & plant integration (100–500 ms)'],
            ['Engineering Model', 'Separate PLC + SCADA tag databases (historically)', 'Unified single database across controller, HMI & historian'],
            ['Redundancy', 'Optional warm/hot standby CPU', 'Standard 1:1 CPU, Power, Network & I/O card hot-swap redundancy'],
            ['Typical Footprint', 'Packaging lines, compressor skids, ETP skids', 'Refineries, petrochemical complexes, power boilers'],
          ],
        },
      },
      {
        title: '1:1 Redundancy, Bumpless Failover & Marshalling',
        tag: 'RELIABILITY',
        summary: 'Continuous process units run 3–5 years nonstop between turnarounds; every controller, power bus, I/O bus, and network switch operates in active hot-standby pairs.',
        keyPoints: [
          'Active Primary controller continuously mirrors live state memory (integrator terms, timers, setpoints) to its Hot-Standby partner every scan via dedicated fiber sync link.',
          'If Primary CPU faults, Hot-Standby takes over within milliseconds ("bumpless transfer") with zero valve bump or output freeze.',
          'Marshalling Cabinets separate messy field multi-pair armored cables (at Field Termination Assemblies / Isolators) cleanly from neat prefabricated DCS system cables.',
        ],
      },
      {
        title: 'Operator Stations, Engineering Stations & ISA-18.2 Alarm Management',
        tag: 'ISA-18.2',
        summary: 'Rationalized alarm hierarchies prevent operator cognitive overload ("alarm floods") during plant upsets.',
        keyPoints: [
          'ISA-18.2 / EEMUA 191 target: steady-state ≤ 6 alarms per hour per operator console (<1 alarm every 10 minutes), and <10 alarms in the first 10 minutes of a trip!',
          'Chattering/repeating alarms are damped using deadbands and on/off-delay timers; state-based suppression hides "low pump discharge pressure" alarms automatically when the pump is intentionally stopped.',
          'Engineering Stations strictly control Role-Based Access & Management of Change (MoC) audit trails before downloading controller logic.',
        ],
      },
    ],
  },
  {
    id: 'scada',
    title: 'SCADA, RTUs, HMI & Process Historians',
    shortTitle: 'SCADA',
    standard: 'ISA-101 High-Performance HMI · IEC 60870 / DNP3',
    subtitle: 'Geographically distributed supervisory telemetry over cellular/radio/fiber links, RTUs, exception reporting, and time-series historians.',
    mermaidTitle: 'Wide-Area SCADA Telemetry & Historian Topology',
    mermaidCode: `flowchart LR
  F["Remote Wellhead / Pump Station"] --> RTU["Field RTU + Edge Buffer"]
  RTU -- "DNP3 / Modbus TCP / 4G / VSAT" --> FEP["SCADA Master / Comms Server"]
  FEP --> HMI["ISA-101 Operator HMI"]
  FEP --> HIST["Time-Series Historian (Swinging Door)"]`,
    blocks: [
      {
        title: 'RTUs & Wide-Area Communication Links',
        tag: 'TELEMETRY',
        summary: 'Supervisory Control And Data Acquisition (SCADA) supervises assets spread across hundreds of kilometers—oil/gas cross-country pipelines, water distribution networks, and electrical substations—where networks may drop intermittently.',
        keyPoints: [
          'Remote Terminal Units (RTUs) survive extreme −40 to +70 °C outdoor cabinets, run solar/battery low-power budgets, and store time-stamped local event logs ("Store-and-Forward") if radio/VSAT drops!',
          'DNP3 and IEC 60870-5-104 support Report-by-Exception (RBE) and millisecond sequence-of-events (SOE) timestamps at the RTU itself.',
        ],
      },
      {
        title: 'High-Performance HMI Ergonomics (ISA-101)',
        tag: 'ISA-101',
        summary: 'Modern control rooms replace gaudy rainbow 3D piping cartoons with restrained grayscale canvases where bright color appears ONLY for abnormal alarms and active deviations.',
        keyPoints: [
          'Normal steady operation stays low-contrast neutral gray/muted—allowing an operator to spot an amber/red alarm triangle across a 6-screen wall in <1 second!',
          'Replace naked numeric numbers alone with analog bar-range indicators showing normal operating bands, alarm trip thresholds, and sparkline 2-hour trends.',
        ],
      },
      {
        title: 'Process Historians & Data Compression',
        tag: 'HISTORIAN',
        summary: 'Historians (e.g., AVEVA PI / AspenTech IP.21) archive years of sub-second plant telemetry without exhausting disk space.',
        keyPoints: [
          'Exception Deviation Filtering drops noise jitter smaller than sensor deadband before data hits the archive.',
          'Swinging Door Trending (SDT) stores only linear slope-change pivot points—compressing flat steady-state tank temperatures 20:1 while faithfully preserving every sharp upset peak!',
        ],
      },
    ],
  },
  {
    id: 'protocols',
    title: 'Industrial Communication Protocols',
    shortTitle: 'Protocols',
    standard: 'HART 7 · Modbus · PROFIBUS · PROFINET · FF · EtherNet/IP · OPC UA',
    subtitle: 'Physical layers, determinism, topology, frame encoding, and industrial application boundaries across fieldbuses and industrial Ethernet.',
    mermaidTitle: 'Automation Network Pyramid & Protocol Placement',
    mermaidCode: `flowchart TB
  L3["Enterprise / MES / Cloud"] -- "OPC UA / MQTT" --> L2["Supervisory SCADA / DCS Engineering"]
  L2 -- "PROFINET / EtherNet/IP / Modbus TCP" --> L1["PLC / DCS Controllers"]
  L1 -- "HART (4-20 mA) / PROFIBUS DP-PA / Foundation Fieldbus / Modbus RTU" --> L0["Field Transmitters, Drives & Valves"]`,
    blocks: [
      {
        title: 'Protocol Comparison Matrix',
        tag: 'SPECIFICATIONS',
        summary: 'Choosing the right industrial bus depends on cycle speed determinism, hazardous-area intrinsic safety power, cable length, and vendor ecosystem.',
        keyPoints: [
          'HART (1200 bps FSK on 4–20 mA): backward compatible everywhere; requires ≥250 Ω loop load; great diagnostics, slow cyclic rate.',
          'Modbus RTU (RS-485, 9.6–115.2 kbps, max 1200 m, 120 Ω end termination) & Modbus TCP (Port 502): universal simple Master-Slave register polling (Coils, Holding Registers) with CRC-16 check—zero native encryption/determinism.',
          'PROFIBUS DP (RS-485 up to 12 Mbps for high-speed drives/MCCs) vs PROFIBUS PA (31.25 kbps Manchester IEC 61158-2 bus-powered into Ex ia zones via DP/PA coupler!).',
          'Foundation Fieldbus H1 (31.25 kbps IEC 61158-2): deterministic Link Active Scheduler (LAS) + "Control in the Field" (PID loop executes directly inside smart valve positioner!).',
          'PROFINET & EtherNet/IP (100/1000 Mbps Industrial Ethernet): deterministic real-time cyclic I/O (PROFINET RT/IRT <1 ms for motion/drives; EtherNet/IP CIP Implicit UDP multicast).',
          'OPC UA (IEC 62541): platform-independent, strongly typed, TLS-encrypted information model uniting PLCs, DCS historians, and MES/Edge analytics cleanly.',
        ],
        table: {
          headers: ['Protocol', 'Physical Layer / Speed', 'Max Distance / Devices', 'Key Advantage & Role'],
          rows: [
            ['HART 7', 'Bell 202 FSK on 4–20 mA (1.2 kbps)', '1.5–3 km / 1 (PtP) or 63 (Multidrop)', 'Adds digital diagnostics onto existing 4–20 mA loops'],
            ['Modbus RTU', '2-Wire RS-485 diff (up to 115 kbps)', '1200 m / 32 (247 w/ repeaters)', 'Simple open Master-Slave register polling (VFDs, analyzers)'],
            ['PROFIBUS PA', 'MBP-IS 31.25 kbps (IEC 61158-2)', '1900 m trunk / up to 32 (less in Ex)', 'Bus-powered Ex ia field transmitters via DP/PA segment coupler'],
            ['Foundation FF H1', 'MBP 31.25 kbps (IEC 61158-2)', '1900 m / 12–16 typical', 'LAS deterministic schedule + PID "Control in the Field"'],
            ['PROFINET / ENIP', '100BASE-TX / Fiber Industrial Eth', '100 m copper / km fiber', 'Sub-ms RT/IRT motion, drives & high-speed PLC remote I/O'],
            ['OPC UA', 'TCP/IP / PubSub Ethernet', 'Plant / Enterprise LAN', 'Vendor-neutral secure semantic data model (PLC ↔ MES/SCADA)'],
          ],
        },
      },
      {
        title: 'RS-485 Modbus RTU Field Wiring Pitfalls',
        tag: 'FIELD WIRING',
        summary: 'Over 80% of Modbus RTU commissioning headaches trace back to inverted polarity, missing terminators, or grounding.',
        keyPoints: [
          'Always wire 120 Ω terminating resistors ONLY at the two extreme physical ends of the RS-485 daisy chain (NEVER in middle stub drops!).',
          'RS-485 requires a 3rd signal reference wire (or clean shield ground) alongside A/B (+/−) differential data wires so common-mode voltage never exceeds ±7 V transceiver limits.',
          'Keep stub drop cables short (<1–5 m) and match Baud Rate + Parity (typically 9600/19200 8-N-1 or 8-E-1) identically across every slave.',
        ],
      },
    ],
  },
  {
    id: 'control-systems',
    title: 'Process Control Strategies & PID Architecture',
    shortTitle: 'Control Systems',
    standard: 'ISA Ideal PID · Cascade · Feedforward · Ratio · Split-Range · Override',
    subtitle: 'Industrial PID variants, anti-windup, derivative-on-PV, and multi-loop regulatory architectures.',
    mermaidTitle: 'Cascade + Feedforward Distillation Temperature Control',
    mermaidCode: `flowchart LR
  FF["Feed Flow Disturbance FT-101"] --> SUM(("+ Feedforward Lead-Lag"))
  SP1["Column Tray Temp SP"] --> PID1["Master TIC-101 (Slow)"]
  PID1 --> SUM
  SUM -- "Remote SP" --> PID2["Slave FIC-102 (Fast Reboiler Steam)"]
  PID2 --> V["Steam Control Valve FV-102"]`,
    blocks: [
      {
        title: 'Industrial PID Algorithm Nuances',
        tag: 'PID REALIZATION',
        summary: 'Real DCS/PLC PID blocks add critical refinements beyond textbook s-domain Laplace equations to avoid actuator shock and integrator saturation.',
        keyPoints: [
          'ISA Ideal Form: u(t) = Kc · [ e(t) + (1/Ti)∫e(t)dt + Td·d(−PV)/dt ] — Notice Kc multiplies ALL three terms!',
          'Derivative-on-Measurement (−dPV/dt): prevents massive actuator spike ("Derivative Kick") whenever an operator steps Setpoint SP!',
          'Integral Anti-Windup: freezes/back-calculates the integrator term whenever the valve hits 0% or 100% saturation so the loop recovers promptly without giant overshoot.',
          'Derivative Filtering (α ≈ 0.1): limits high-frequency gain of Td so noisy flow/level sensors do not chatter the valve packing to death (flow/fast level loops usually run PI only with Td = 0!).',
        ],
      },
      {
        title: 'Advanced Regulatory Control Topologies',
        tag: 'STRATEGIES',
        summary: 'Pairing single PID blocks into structured regulatory hierarchies rejects disturbances before they upset product quality.',
        keyPoints: [
          'Cascade Control (Master → Slave): Fast inner loop (e.g., steam pressure/flow) kills supply disturbances 3×–5× faster than outer slow loop (reactor temperature). Tune INNER loop first, then OUTER loop!',
          'Feedforward Control: Measures major upstream load disturbance (e.g., feed flow rate) and proactively shifts valve before output PV ever deviates—must pair with Feedback PID trim to handle unmeasured model errors!',
          'Ratio Control: Maintains stoichiometric flow ratio B/A (e.g., combustion air-to-fuel or monomer blending) by multiplying Wild Flow A by ratio K to compute Remote SP of Controlled Flow B.',
          'Split-Range Control: One PID output (0–100%) sequentially drives TWO valves (e.g., 0–50% closes/opens Coolant Valve FO; 50–100% opens Heating Steam Valve FC) with deadband to avoid simultaneous heating & cooling!',
          'Override / Selective Control (Low/High Selector): Normally runs primary flow/throughput PID until an equipment safety constraint (high discharge pressure or compressor surge) reaches limit and seamlessly takes command via low-select (<) block with external reset feedback anti-windup!',
        ],
        table: {
          headers: ['Strategy', 'Minimum Loops / Elements', 'Engineering Rule of Thumb', 'Classic Plant Example'],
          rows: [
            ['Cascade', '2 PIDs (Outer Master + Inner Slave)', 'Inner loop must be 3×–5× faster than outer loop; tune inner first!', 'Reactor Jacket Temp (Master) → Cooling Flow (Slave)'],
            ['Feedforward', 'Disturbance sensor + Lead-Lag + Feedback PID', 'Always combine FF with Feedback trim; keep FF gain conservative', 'Boiler Steam Flow FF → Drum Feedwater 3-element'],
            ['Ratio', 'Wild Flow + Multiplier K → Controlled Flow PID', 'Use fuel-rich/air-lead cross-limiting in boilers for safety!', 'Air-to-Fuel burner ratio; Acid-to-Water dilution'],
            ['Split-Range', '1 PID → 2 opposing Control Valves', 'Include 2–4% neutral deadband so both valves stay closed at 50%', 'Batch reactor Heating Steam (50–100%) + Cooling Water (0–50%)'],
            ['Override', '2+ PIDs → Low/High Selector Block', 'Feed selected output back to unselected PIDs ("External Reset") to kill windup!', 'Pipeline pump flow override on high discharge / low suction pressure'],
          ],
        },
      },
    ],
  },
];

export interface LadderPreset {
  id: string;
  name: string;
  description: string;
  timerPresetSec: number;
  counterPreset: number;
  initialInputs: Record<string, boolean>;
}

export const LADDER_PRESETS: LadderPreset[] = [
  {
    id: 'motor-seal-in',
    name: 'Motor Start/Stop Seal-In + Interlock',
    description: 'Classic 3-wire Start/Stop latch with fail-safe NC Stop & Thermal Overload contacts driving pump motor Q:0/0 and delayed lube valve Q:0/1.',
    timerPresetSec: 3,
    counterPreset: 5,
    initialInputs: { 'I:0/0': false, 'I:0/1': true, 'I:0/2': true, 'I:0/3': false, 'I:0/4': false, 'I:0/5': false },
  },
  {
    id: 'batch-counter',
    name: 'Batch Counter & Auto-Purge',
    description: 'Pulse input I:0/3 increments CTU batch counter toward Preset; upon reaching Preset, Q:0/2 energizes Batch Complete.',
    timerPresetSec: 4,
    counterPreset: 4,
    initialInputs: { 'I:0/0': false, 'I:0/1': true, 'I:0/2': true, 'I:0/3': false, 'I:0/4': false, 'I:0/5': false },
  },
  {
    id: 'high-level-trip',
    name: 'Tank High-Level Interlock Trip',
    description: 'Simulates an active High-Level switch (I:0/5 = TRUE) latching Alarm Q:0/3 and tripping Motor Pump Q:0/0 safely off.',
    timerPresetSec: 3,
    counterPreset: 5,
    initialInputs: { 'I:0/0': false, 'I:0/1': true, 'I:0/2': true, 'I:0/3': false, 'I:0/4': false, 'I:0/5': true },
  },
];

