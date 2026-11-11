import type { InstrumentTopic } from '@/types/engineering';
import { createTopic } from './categories';

export const SIGNAL_CONDITIONING_TOPICS: InstrumentTopic[] = [
  createTopic({
    slug: 'wheatstone-bridge',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'DC & AC Wheatstone Bridge Signal Conditioning',
    shortTitle: 'Wheatstone Bridge',
    subtitle: 'Null-deflection and quarter/half/full differential bridge topologies for RTDs, strain gauges, and capacitive transducers.',
    standardRef: 'IEC 60751 3-Wire · Strain Bridge Theory',
    schematicKind: 'wheatstone-bridge',
    definition:
      'A Wheatstone Bridge is a four-arm resistive (or AC impedance) diamond network powered by excitation voltage V_exc across two opposite nodes, converting tiny fractional sensor resistance changes (ΔR/R) into a clean differential output voltage V_out.',
    purpose:
      'Extracts millivolt transducer variations atop large nominal resistance baselines (e.g., 1 Ω change on a 100 Ω Pt100 or 0.1 Ω on a 350 Ω strain gauge) while cancelling ambient temperature drift and power-supply ripple.',
    workingPrinciple:
      'When R₁/R₂ = R₃/R₄, the bridge is balanced and V_out = 0. When a sensor arm changes by ΔR, differential node voltage shifts proportionally: V_out ≈ V_exc · (ΔR / 4R) for a single active quarter-bridge, doubled to (ΔR / 2R) for a push-pull half-bridge, and quadrupled to V_exc · (ΔR / R) with zero nonlinearity in a full 4-active-arm bridge!',
    principleSteps: [
      'Precision voltage reference or current source excites top/bottom bridge vertices.',
      'Passive or active bridge arms convert fractional ΔR/R into symmetric differential millivolts.',
      'In 3-wire RTD bridges, matching lead wires L1 and L2 sit in adjacent ratio arms so cable resistance drops out equally.',
      'High-CMRR Instrumentation Amplifier amplifies V_out rejecting common-mode V_exc/2.',
    ],
    constructionSummary:
      'Ultra-low-TCR (≤ 5 ppm/°C) Vishay bulk metal foil reference resistors paired with precision 3-wire RTDs or bonded foil/silicon strain rosettes on PCB front-ends.',
    assemblyArchitecture:
      'Quarter-bridge suffers slight quadratic nonlinearity (1 / [1 + ΔR/(2R)]); replacing fixed excitation with a constant-current bridge or full 4-arm active bridge linearizes the output cleanly.',
    internalComponents: [
      { partCode: '01', name: 'Low-TCR Precision Bridge Resistors', material: '0.01% Thin-Film / Bulk Metal Foil (≤5 ppm/°C)', function: 'Sets stable bridge zero balance without ambient thermal drift', failureMode: 'Resistor drift shifts zero baseline across ambient temp swings' },
      { partCode: '02', name: '3-Wire / Kelvin Lead Compensation Arm', material: 'Matched Copper Field Leads', function: 'Routes L1 and L2 into adjacent canceling arms', failureMode: 'Corroded terminal screw breaks symmetry between L1 and L2' },
    ],
    typesAndClassification: [
      { type: 'Quarter-Bridge (1 Active Arm)', summary: 'Single RTD or single strain gauge + 3 fixed resistors.', typicalRange: 'ΔV = V_exc · (ΔR / 4R)', accuracy: 'Slight nonlinearity for large ΔR', bestFor: 'RTDs, single axial stress coupons' },
      { type: 'Half-Bridge (2 Opposing Active Arms)', summary: 'One tensile (+ΔR) and one compressive (−ΔR) gauge.', typicalRange: 'ΔV = V_exc · (ΔR / 2R)', accuracy: 'Linearized + cancels temperature!', bestFor: 'Cantilever bending beam load cells' },
      { type: 'Full-Bridge (4 Active Arms)', summary: 'Two +ΔR and two −ΔR arms wired symmetrically.', typicalRange: 'ΔV = V_exc · (ΔR / R)', accuracy: '4× gain, zero nonlinearity, full temp cancellation', bestFor: 'Pressure diaphragms, commercial load cells' },
    ],
    equations: [
      {
        title: 'General Wheatstone Bridge & Quarter/Half/Full Sensitivities',
        latex: 'V_{\\text{out}} = V_{\\text{exc}} \\left(\\frac{R_3}{R_3 + R_4} - \\frac{R_2}{R_1 + R_2}\\right), \\quad V_{\\text{quarter}} \\approx \\frac{V_{\\text{exc}}}{4} \\frac{\\Delta R}{R}, \\quad V_{\\text{full}} = V_{\\text{exc}} \\frac{\\Delta R}{R}',
        variables: [
          { symbol: 'V_{\\text{exc}}', meaning: 'Bridge DC or AC excitation voltage', unit: 'V' },
          { symbol: '\\Delta R / R', meaning: 'Fractional resistance shift of active sensor arm(s)', unit: '—' },
        ],
        derivationSteps: ['Notice the bridge inherently sits at a DC common-mode potential of V_exc/2—demanding an Instrumentation Amplifier with high CMRR (>90 dB) rather than a single-ended grounded amplifier!'],
      },
    ],
    characteristicCurve: {
      title: 'Quarter vs Half vs Full Bridge Output Linearity (Large ΔR/R)',
      subtitle: 'Full 4-active-arm bridge remains strictly linear even up to ±20% ΔR/R while quarter-bridge droops nonlinearly',
      xLabel: 'Fractional Resistance Change (ΔR/R)',
      yLabel: 'Normalized Output (V_out / V_exc)',
      xUnit: '%',
      yUnit: 'V/V',
      series: [
        { name: 'Full-Bridge (4 Active)', color: '#7FB3DE', points: [{ x: 0, y: 0 }, { x: 5, y: 0.05 }, { x: 10, y: 0.10 }, { x: 15, y: 0.15 }, { x: 20, y: 0.20 }] },
        { name: 'Half-Bridge (2 Active)', color: '#cdbdff', points: [{ x: 0, y: 0 }, { x: 5, y: 0.025 }, { x: 10, y: 0.05 }, { x: 15, y: 0.075 }, { x: 20, y: 0.10 }] },
        { name: 'Quarter-Bridge (Nonlinear)', color: '#ff9100', points: [{ x: 0, y: 0 }, { x: 5, y: 0.0122 }, { x: 10, y: 0.0238 }, { x: 15, y: 0.0349 }, { x: 20, y: 0.0455 }] },
      ],
    },
    specifications: [
      { parameter: 'Excitation Levels', value: '1–10 VDC (Strain); ≤0.5 mA current (RTD)', standardOrNote: 'Keep RTD I²R low to stop self-heating!' },
      { parameter: 'Thevenin Output Resistance', value: 'R_out = R (for equal-arm balanced bridge)', standardOrNote: 'Load resistance must be >> R (use INA!)' },
    ],
    measurementRange: { typicalSpan: 'µV to hundreds of mV differential', extremeLimits: 'AC excitation up to MHz (LVDT/capacitive)', overrangeProtection: 'Current-limiting excitation resistor' },
    accuracyAndSensitivity: { accuracyClass: 'Set by reference resistor TCR (<5 ppm/°C) & INA CMRR', sensitivity: '1× (Quarter), 2× (Half), 4× (Full)', repeatability: 'Sub-ppm', responseTime: 'Instantaneous (bandwidth set by filter)' },
    advantages: ['Rejects baseline resistance so tiny ΔR fills the full ADC dynamic range.', 'Full and half bridges cancel uniform ambient thermal drift automatically.', '3-wire topology balances equal cable lengths cleanly.'],
    limitations: ['Quarter-bridge is nonlinear for wide temperature RTD spans unless linearized in firmware or current-driven.', 'Balanced output sits at V_exc/2 common-mode voltage—requires differential Instrumentation Amplifier.'],
    applications: [{ industry: 'Weighing & Force / Temp Front-Ends', service: 'Truck weighbridge load cells & precision Pt100 bridge transmitters', loopTagExample: 'WT-101 / TT-101', engineeringNote: 'Use 6-wire Kelvin sense lines on long weighbridge load cell cables so excitation voltage drop across cable never shifts span!' }],
    calibration: { referenceStandard: 'Decade Resistor Box / Shunt Calibration', equipmentRequired: ['Precision 0.01% decade box', '6.5-digit DMM'], procedureSteps: ['Balance zero with exact nominal R₀ resistor.', 'Switch shunt resistor across one bridge arm ("shunt cal") to verify full-scale span without physical weight!'], acceptanceCriteria: 'Zero < ±0.05 mV, span within ±0.1%.' },
    installation: { mechanicalRules: ['Match lead wire lengths & gauges strictly on 3-wire RTD bridges.'], electricalOrImpulseRules: ['Route excitation + sense differential pairs in twisted shielded cable.'], commonMistakes: ['Connecting a grounded single-ended oscilloscope probe across V_out—shorts the lower half of the bridge straight to earth ground!'] },
    troubleshooting: [{ symptom: 'Bridge output saturated permanently at +V_rail or −V_rail', probableCause: 'Open wire on one strain gauge or RTD element driving node straight to V_exc or 0 V', diagnosticCheck: 'Measure individual arm resistances with excitation disconnected', correctiveAction: 'Repair open gauge lead or terminal crimp' }],
    manufacturers: [{ vendor: 'Analog Devices / Texas Instruments / Vishay', modelSeries: 'AD7193 / ADS1232 / Vishay Precision Foil Bridges', notes: 'Ratiometric 24-bit bridge ADCs and ultra-low TCR bridge resistor networks.', sourceLabel: 'Analog Devices Bridge Front-Ends', sourceUrl: 'https://www.analog.com', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'Quarter vs Full Bridge', thisInstrument: 'Full bridge: 4× gain, perfectly linear, cancels temp drift', peerName: 'Quarter Bridge', peerValue: '1× gain, slight quadratic error, needs dummy gauge/3-wire lead comp', engineeringTakeaway: 'Always use Full Bridge for strain/pressure load cells; use 3/4-wire Kelvin/ratiometric for single RTDs.' }],
    interviewQuestions: [{ difficulty: 'Beginner', question: 'Why should you NEVER probe the differential output of a DC-powered Wheatstone bridge using an earth-grounded oscilloscope ground clip?', answer: 'Neither output terminal of a Wheatstone bridge sits at ground—both sit around +V_exc/2! Attaching a grounded probe clip directly shorts the lower bridge arm to ground, skewing the balance and potentially damaging the excitation supply.' }],
    numericalProblems: [{ title: 'Quarter-Bridge Pt100 Unbalanced Voltage', statement: 'An equal-arm 100 Ω Wheatstone bridge excited by V_exc = 2.00 V has three fixed 100.0 Ω arms and one Pt100 at 100 °C (R = 138.51 Ω). Compute exact V_out.', given: ['R1 = R2 = R3 = 100.0 Ω', 'R4 = 138.51 Ω', 'V_exc = 2.00 V'], steps: ['V_out = 2.00 × [138.51/(100+138.51) − 100/(100+100)]', '= 2.00 × [0.58073 − 0.50000] = 0.16146 V = 161.5 mV'], answer: '161.5 mV' }],
    quickRevisionNotes: ['Quarter: ΔR/4R (nonlinear); Half: ΔR/2R; Full: ΔR/R (4× & linear!).', 'Output sits at V_exc/2 common-mode → use Instrumentation Amplifier (high CMRR!).', '3-wire RTD places L1 & L2 in adjacent arms so equal lead R cancels.'],
    sources: [{ label: 'Analog Devices', standardOrDoc: 'Sensor Signal Conditioning — Bridge Circuits' }],
  }),

  createTopic({
    slug: 'instrumentation-amplifier',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'Three-Op-Amp Instrumentation Amplifier (INA)',
    shortTitle: 'Instrumentation Amplifier',
    subtitle: 'Ultra-high input impedance, single-resistor gain, and >100 dB CMRR precision differential bridge/thermocouple amplifier.',
    standardRef: 'IEEE Op-Amp Topologies · AD620 / INA128',
    schematicKind: 'wheatstone-bridge',
    definition:
      'An Instrumentation Amplifier (INA) is a specialized closed-loop differential voltage amplifier built with dual non-inverting input buffer stages feeding a precision difference amplifier, delivering GΩ/TΩ input impedance, single-resistor gain adjustment R_G, and >100 dB Common-Mode Rejection Ratio (CMRR).',
    purpose:
      'Amplifies microvolt-to-millivolt differential outputs from thermocouples, strain-gauge Wheatstone bridges, biopotentials (ECG/EEG), and current shunts while rejecting large 50/60 Hz mains hum and V_exc/2 common-mode DC offsets.',
    workingPrinciple:
      'Unlike a basic 1-op-amp difference amplifier (whose low input impedance loads down bridge arms and breaks balance!), the classic 3-op-amp INA puts both + and − sensor leads straight into high-impedance non-inverting op-amp inputs (A1, A2). A single external resistor R_G sets differential gain G = 1 + (2·R₁ / R_G) cleanly without altering common-mode unity gain (1×), before stage A3 subtracts them with laser-trimmed resistor ratios for >100–120 dB CMRR.',
    principleSteps: [
      'Stage 1 (A1 & A2): Dual non-inverting input buffers draw femto/nanoampere bias current, applying zero loading error to high-Z bridges.',
      'Common-mode signals (V_cm) pass through Stage 1 with unity gain (zero current flows across R_G!).',
      'Differential signal (V_in+ − V_in−) drives current across R_G, amplifying difference cleanly by 1 + 2R₁/R_G.',
      'Stage 2 (A3): Laser-matched difference stage cancels V_cm by >100 dB and outputs V_out = G·(V+ − V−) + V_ref.',
    ],
    constructionSummary:
      'Monolithic IC (INA128, AD620, AD8421, INA333 zero-drift chopper) containing laser-trimmed thin-film SiCr internal resistors (R₁, R₂, R₃) requiring just ONE user resistor R_G to set gain from 1 to 10,000.',
    assemblyArchitecture:
      'IMPORTANT PRACTICAL RULE: Even though an INA rejects common-mode DC/AC signals, its inputs MUST still have a DC return path (two 100 kΩ–1 MΩ bias return resistors to ground) when amplifying floating thermocouples or AC-coupled sensors—otherwise input bias currents charge stray capacitance and slam stage A1/A2 into the supply rail!',
    internalComponents: [
      { partCode: '01', name: 'Input Buffer Op-Amps (A1, A2)', material: 'Low-Noise Matched BJT / Zero-Drift CMOS', function: 'Provides >10 GΩ differential impedance and programmable differential gain via R_G', failureMode: 'Missing input bias return resistor saturating floating TC inputs' },
      { partCode: '02', name: 'Laser-Trimmed Difference Stage (A3)', material: '0.005% Matched On-Chip Thin-Film Resistors', function: 'Achieves 100–130 dB CMRR without external matched discrete resistors', failureMode: 'Exceeding input common-mode diamond voltage envelope clips Stage 1!' },
    ],
    typesAndClassification: [
      { type: 'BJT Precision Low-Noise INA (INA128 / AD8421)', summary: 'Ultra-low broadband voltage noise (~1–8 nV/√Hz).', typicalRange: 'Gain 1 to 10,000; CMRR ≥ 110–120 dB', accuracy: '0.01% gain nonlinearity; <50 µV offset', bestFor: 'Strain gauge bridges, dynamic piezo, medical ECG' },
      { type: 'Zero-Drift Chopper INA (INA333 / AD8428)', summary: 'Auto-zero chopper stabilization cuts offset drift near zero (<0.05 µV/°C).', typicalRange: 'Microvolt low-frequency DC sensing', accuracy: 'Offset < 25 µV', bestFor: 'Thermocouples, microvolt shunts, battery bridges' },
    ],
    equations: [
      {
        title: '3-Op-Amp INA Gain & Common-Mode Rejection Ratio (CMRR)',
        latex: 'V_{\\text{out}} = \\left(1 + \\frac{2 R_1}{R_G}\\right)\\left(V_+ - V_-\\right) + V_{\\text{ref}}, \\qquad \\text{CMRR}_{\\text{dB}} = 20 \\log_{10}\\left(\\frac{A_d}{A_{cm}}\\right)',
        variables: [
          { symbol: 'R_G', meaning: 'Single external gain-setting resistor', unit: 'Ω' },
          { symbol: 'V_{\\text{ref}}', meaning: 'Reference pin voltage shifting 0 V output (e.g., mid-rail 2.5 V for single-supply ADCs)', unit: 'V' },
        ],
        derivationSteps: ['Notice why discrete 3-op-amp builds fail to match monolithic ICs: just 0.1% resistor mismatch in Stage A3 drops CMRR down to ~66 dB! Monolithic laser trimming guarantees >100–120 dB.'],
      },
    ],
    characteristicCurve: {
      title: 'INA Common-Mode Rejection Ratio (CMRR) vs Frequency',
      subtitle: 'High gain pushes Stage 1 CMRR higher at DC/50 Hz before op-amp bandwidth rolls off at high kHz',
      xLabel: 'Signal Frequency',
      yLabel: 'CMRR',
      xUnit: 'Hz',
      yUnit: 'dB',
      series: [
        { name: 'Gain = 100 (AD8421)', color: '#7FB3DE', points: [{ x: 10, y: 130 }, { x: 100, y: 128 }, { x: 1000, y: 118 }, { x: 10000, y: 98 }, { x: 100000, y: 78 }] },
        { name: 'Gain = 1', color: '#cdbdff', points: [{ x: 10, y: 94 }, { x: 100, y: 94 }, { x: 1000, y: 88 }, { x: 10000, y: 72 }, { x: 100000, y: 52 }] },
      ],
    },
    specifications: [
      { parameter: 'CMRR (DC to 60 Hz)', value: '100 dB to 130 dB (at Gain ≥ 100)', standardOrNote: 'Rejects >100,000× common-mode noise!' },
      { parameter: 'Input Impedance', value: '10¹⁰ Ω to 10¹³ Ω', standardOrNote: 'Zero loading on bridges!' },
    ],
    measurementRange: { typicalSpan: '±10 µV to ±10 V input differential', extremeLimits: 'Wide supply ±2.25 V to ±18 V (or 1.8–5 V rail-to-rail)', overrangeProtection: 'Add series protection resistors + clamp diodes for ESD/faults' },
    accuracyAndSensitivity: { accuracyClass: '±0.005% to ±0.05% gain nonlinearity', sensitivity: 'Resolves <1 µV', repeatability: 'Sub-ppm', responseTime: 'µs settling (bandwidth drops slightly at Gain = 1000)' },
    advantages: ['Enormous balanced input impedance prevents Wheatstone bridge loading.', 'Single external resistor R_G preserves matched >100 dB CMRR across any gain.', 'V_ref pin shifts zero cleanly to ADC mid-scale for bipolar signals on single +5 V / +3.3 V supplies.'],
    limitations: ['Input common-mode vs output swing "diamond plot" limits single-supply headroom near 0 V unless rail-to-rail.', 'Floating sensors (thermocouples) rail the output if bias-current return resistors to ground are omitted!'],
    applications: [{ industry: 'Smart Transmitters & PLC AI Cards', service: 'Thermocouple µV amplifiers, strain load-cell conditioners, high-side current shunts', loopTagExample: 'AI-Bridge-FE', engineeringNote: 'Always drive V_ref pin from a low-impedance buffered op-amp (<1 Ω)—never a raw resistor divider (which ruins CMRR!).' }],
    calibration: { referenceStandard: 'Precision µV Calibrator & Common-Mode Injection Check', equipmentRequired: ['Precision mV source', '6.5-digit DMM'], procedureSteps: ['Short inputs to ground through 100 Ω and measure zero offset.', 'Inject 10.0 mV differential and verify Gain = V_out / 0.010 V.', 'Apply 5 V common-mode onto both shorted inputs to confirm ΔV_out < 50 µV!'], acceptanceCriteria: 'Gain within R_G tolerance, CMRR > 100 dB.' },
    installation: { mechanicalRules: ['Place precision R_G resistor right beside IC pins with tight Kelvin PCB routing; avoid thermocouple effects across solder joints!'], electricalOrImpulseRules: ['Add balanced RC differential RFI filter (10× smaller C_cm than C_diff!) ahead of INA pins to stop rectifying cell-phone/walkie-talkie RF!'], commonMistakes: ['Connecting a floating ungrounded thermocouple straight to an INA without 1 MΩ bias return resistors to ground—output slams to +rail immediately!'] },
    troubleshooting: [{ symptom: 'Thermocouple INA output locks pinned against +15 V supply rail', probableCause: 'Missing DC input bias return path on floating ungrounded thermocouple!', diagnosticCheck: 'Measure voltage from both + and − INA pins to circuit GND', correctiveAction: 'Add 100 kΩ–1 MΩ bias return resistor from negative TC pin (or both pins symmetrically) to circuit GND' }],
    manufacturers: [{ vendor: 'Analog Devices / Texas Instruments', modelSeries: 'AD620 / AD8421 / INA128 / INA333', notes: 'Industry standard monolithic 3-op-amp instrumentation amplifiers.', sourceLabel: 'Analog Devices In-Amp Guide', sourceUrl: 'https://www.analog.com', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: '1-Op-Amp Diff Amp vs 3-Op-Amp INA', thisInstrument: '10¹⁰ Ω input Z, single R_G gain, >110 dB CMRR', peerName: 'Basic 1-Op-Amp Difference Amp', peerValue: 'Low unequal input impedance (loads bridge!), changing gain breaks all 4 matched resistors', engineeringTakeaway: 'Always use a true 3-op-amp INA for bridges and thermocouples; reserve 1-op-amp diff amps only for low-Z buffered signals.' }],
    interviewQuestions: [
      { difficulty: 'Intermediate', question: 'Why does a 1-op-amp difference amplifier fail on a Wheatstone bridge, whereas a 3-op-amp INA works accurately?', answer: 'In a 1-op-amp difference circuit, the inverting and non-inverting inputs have unequal, relatively low resistor input impedances (R₁ vs R₁+R₂), which draw unbalanced current from the bridge legs, ruin bridge calibration, and break resistor-ratio matching. A 3-op-amp INA puts both inputs straight into high-Z op-amp gates with zero loading and isolates gain adjustment to one resistor R_G.' },
      { difficulty: 'Industry-Oriented', question: 'Why must you connect a high-value resistor (e.g., 1 MΩ) to ground when feeding a floating ungrounded thermocouple into an INA?', answer: 'Every op-amp input draws tiny DC bias current (nA or pA). With an ungrounded floating thermocouple, those bias currents have nowhere to drain to ground—charging input capacitances until the input voltage walks outside the supply rails and saturates the amplifier!' },
    ],
    numericalProblems: [{ title: 'INA128 Gain Resistor Selection', statement: 'An INA128 uses internal R₁ = 25.0 kΩ (Gain G = 1 + 50 kΩ / R_G). What exact R_G sets Gain = 201 to amplify a 20 mV full-scale bridge to 4.02 V?', given: ['2·R₁ = 50,000 Ω', 'G = 201'], steps: ['201 = 1 + 50,000 / R_G ⇒ 200 = 50,000 / R_G', 'R_G = 50,000 / 200 = 250.0 Ω'], answer: 'R_G = 250.0 Ω' }],
    quickRevisionNotes: ['G = 1 + 2R₁/R_G (single resistor gain without ruining CMRR!).', 'High Z_in (>10 GΩ), >100 dB CMRR; keep RFI RC filter symmetric before inputs.', 'Always include bias return resistor on floating thermocouples, and buffer V_ref!'],
    sources: [{ label: 'Analog Devices', standardOrDoc: 'A Designer’s Guide to Instrumentation Amplifiers' }],
  }),

  createTopic({
    slug: 'operational-amplifier',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'Precision Operational Amplifiers in Instrumentation',
    shortTitle: 'Operational Amplifier',
    subtitle: 'Inverting/non-inverting, charge, transimpedance (TIA), integrator, and Howland V-to-I current-pump topologies.',
    standardRef: 'IEEE Std · Precision Analog Conditioning',
    schematicKind: 'generic-transducer',
    definition:
      'An Operational Amplifier (Op-Amp) is a high-gain DC-coupled differential voltage amplifier whose closed-loop transfer function is sculpted almost entirely by passive feedback networks—forming precision buffers, summers, transimpedance photodiode amps, charge amps, and 4–20 mA current pumps.',
    purpose:
      'Forms the fundamental analog building block inside pH electrometers, photodiode optical pyrometers, piezoelectric charge amplifiers, active anti-aliasing filters, and analog V-to-I transmitters.',
    workingPrinciple:
      'Using negative feedback, infinite open-loop gain forces the inverting (−) and non-inverting (+) input pins to track at identical voltage ("virtual short") while drawing near-zero current. Real precision design balances non-ideal limits: input offset voltage V_os, input bias current I_b (picoamps in FET/CMOS vs nanoamps in BJT), Gain-Bandwidth Product (GBWP = Gain × f_−3dB), and Slew Rate (SR).',
    principleSteps: [
      'Negative feedback wraps from output back to inverting (−) terminal.',
      'Op-amp drives output until V− ≈ V+ within microvolts (V_out/A_OL).',
      'Transimpedance (TIA) places feedback resistor R_f directly to convert photodiode current I_pd into V_out = −I_pd·R_f.',
      'Howland Current Pump combines positive and negative feedback to source precision load-independent current I_L = V_in / R_sense.',
    ],
    constructionSummary:
      'Precision monolithic CMOS/JFET/Bipolar silicon IC (e.g., OPA189 zero-drift, ADA4530-1 femtoamp electrometer, OP07/OPA227 low-noise precision) with guard-ring PCB layout for high-Z nodes.',
    assemblyArchitecture:
      'Never use generic LM741/LM358 op-amps in precision instrumentation—choose Chopper/Zero-Drift (<10 µV V_os) for low-frequency RTDs/thermocouples and JFET/CMOS (<1 pA I_b) for pH/photodiodes!',
    internalComponents: [
      { partCode: '01', name: 'Matched Differential Input Stage', material: 'Super-Beta BJT / JFET / Chopper-Stabilized CMOS', function: 'Sets input offset voltage V_os, bias current I_b, and noise floor', failureMode: 'PCB solder flux leakage exceeding pA input current on pH electrodes!' },
    ],
    typesAndClassification: [
      { type: 'Zero-Drift Chopper (OPA189 / AD8628)', summary: 'Internal clock nulls V_os continuously below 5 µV & 0.02 µV/°C.', typicalRange: 'DC to ~100 kHz precision', accuracy: 'Offset < 5 µV', bestFor: 'Thermocouples, strain shunts, low-level DC loops' },
      { type: 'Electrometer / Femtoamp CMOS (ADA4530 / LMP7721)', summary: 'Input bias < 20 fA (0.02 pA) with driven guard-ring pin.', typicalRange: 'DC to MHz', accuracy: 'R_in > 10¹⁴ Ω', bestFor: 'Glass pH electrodes, ion chambers, photodiode TIAs' },
      { type: 'Precision Low-Noise BJT (OPA227 / LT1028)', summary: 'Ultra-low broadband voltage noise (<1–3 nV/√Hz).', typicalRange: 'Low-impedance sensors (<5 kΩ)', accuracy: 'Offset < 50 µV', bestFor: 'Dynamic bridges, inductive coils, audio/vibration' },
    ],
    equations: [
      {
        title: 'Closed-Loop Gain, GBWP Tradeoff & Slew-Rate Full-Power Bandwidth',
        latex: 'A_{v,\\text{non-inv}} = 1 + \\frac{R_f}{R_1}, \\qquad f_{-3\\text{dB}} = \\frac{\\text{GBWP}}{A_{\\text{noise}}}, \\qquad f_{\\text{max, sine}} = \\frac{\\text{SR}}{2\\pi V_{\\text{peak}}}',
        variables: [
          { symbol: '\\text{GBWP}', meaning: 'Unity-gain bandwidth product (constant tradeoff between gain and bandwidth)', unit: 'Hz' },
          { symbol: '\\text{SR}', meaning: 'Maximum output voltage slew rate before triangular distortion', unit: 'V/µs' },
        ],
        derivationSteps: ['Notice that amplifying a sensor ×1000 with a 1 MHz GBWP op-amp cuts closed-loop −3 dB bandwidth all the way down to 1 kHz!'],
      },
    ],
    characteristicCurve: {
      title: 'Op-Amp Open-Loop vs Closed-Loop Gain-Bandwidth Roll-Off',
      subtitle: 'Increasing closed-loop gain by 10× reduces usable −3 dB bandwidth by 10× along the −20 dB/decade open-loop ceiling',
      xLabel: 'Frequency',
      yLabel: 'Voltage Gain',
      xUnit: 'Hz',
      yUnit: 'dB',
      series: [
        { name: 'Open-Loop Gain (1 MHz GBWP)', color: '#cdbdff', points: [{ x: 10, y: 100 }, { x: 100, y: 80 }, { x: 1000, y: 60 }, { x: 10000, y: 40 }, { x: 100000, y: 20 }, { x: 1000000, y: 0 }] },
        { name: 'Closed-Loop G = 100 (40 dB)', color: '#7FB3DE', points: [{ x: 10, y: 40 }, { x: 100, y: 40 }, { x: 1000, y: 40 }, { x: 10000, y: 37 }, { x: 100000, y: 20 }] },
      ],
    },
    specifications: [
      { parameter: 'Input Offset Voltage (Precision)', value: '1–50 µV (vs 3,000 µV on general LM741!)', standardOrNote: 'Multiplies by noise gain!' },
      { parameter: 'Bias Current (pH / TIA)', value: '< 1 pA (JFET/CMOS electrometer)', standardOrNote: 'Use driven guard trace on PCB!' },
    ],
    measurementRange: { typicalSpan: 'µV to ±15 V signal conditioning', extremeLimits: 'Single 1.8 V up to ±18 V (high-voltage ±40 V parts)', overrangeProtection: 'Never drive inputs above supply rails without current-limiting resistor!' },
    accuracyAndSensitivity: { accuracyClass: 'Set by 0.01%–0.1% feedback resistors & V_os', sensitivity: 'Down to nV / fA', repeatability: 'Sub-ppm', responseTime: 'Set by GBWP & Slew Rate' },
    advantages: ['Infinite circuit versatility (amplifiers, filters, current pumps, TIAs, integrators).', 'Negative feedback trades excess open-loop gain for rock-solid resistor-ratio precision.'],
    limitations: ['Directly driving >100 pF capacitive loads (like long coax cables!) reduces phase margin and makes op-amps oscillate—add 50–100 Ω isolation resistor in series with output!'],
    applications: [{ industry: 'All Smart Sensor Front-Ends', service: 'pH electrometer buffers, photodiode IR pyrometer TIAs, Howland 4–20 mA drivers', loopTagExample: 'SigCond-AFE', engineeringNote: 'Always clean solder flux thoroughly around high-impedance (>1 MΩ) feedback nodes and route a PCB guard ring!' }],
    calibration: { referenceStandard: 'DC Offset, Gain & Bandwidth Bench Verification', equipmentRequired: ['Function generator + oscilloscope', 'Precision DC voltage standard'], procedureSteps: ['Measure DC output offset with input grounded.', 'Verify gain and phase stability under actual capacitive cable load.'], acceptanceCriteria: 'Zero oscillation, offset within budget.' },
    installation: { mechanicalRules: ['Place 0.1 µF ceramic decoupling capacitors <3 mm from V+ and V− supply pins!'], electricalOrImpulseRules: ['Include R_iso (47–100 Ω) before long output cables; add small feedback cap C_f (5–22 pF) across high-value TIA R_f to stop oscillation!'], commonMistakes: ['Leaving an unused op-amp channel inside a quad package floating open—wire unused channels as unity-gain followers tied to mid-rail/ground so they don’t oscillate and heat up!'] },
    troubleshooting: [{ symptom: 'Precision amplifier output sits noisy/thick on oscilloscope (~1–5 MHz ringing) whenever sensor cable is plugged in', probableCause: 'Cable capacitance (>200 pF) eroded op-amp phase margin causing high-frequency oscillation!', diagnosticCheck: 'Touch 100 pF scope probe directly or check supply current spike', correctiveAction: 'Insert 47–100 Ω series isolation resistor inside feedback loop ("dual-feedback")' }],
    manufacturers: [{ vendor: 'Texas Instruments / Analog Devices', modelSeries: 'OPA189 / OPA227 / ADA4530 / LT1028', notes: 'Precision instrumentation op-amps.', sourceLabel: 'TI & Analog Devices Op-Amps', sourceUrl: 'https://www.ti.com', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'Non-Inverting vs Inverting', thisInstrument: 'Non-Inverting: very high input impedance (doesn’t load source), gain ≥ 1', peerName: 'Inverting Topology', peerValue: 'Input Z = R₁, allows summing multiple currents & gain < 1 at virtual ground', engineeringTakeaway: 'Use Non-Inverting for high-Z voltage sensors; Inverting/TIA for current sensors and summers.' }],
    interviewQuestions: [
      { difficulty: 'Intermediate', question: 'Why should you add a tiny feedback capacitor (e.g., 10 pF) across the MΩ feedback resistor in a photodiode Transimpedance Amplifier (TIA)?', answer: 'The photodiode’s large junction capacitance (C_pd) combines with the large feedback resistor R_f to add an extra pole in the feedback loop—pushing phase lag toward 180° and causing peaking or violent MHz oscillation! Adding a tiny phase-lead zero capacitor C_f in parallel with R_f restores 45°–65° phase margin cleanly.' },
      { difficulty: 'Beginner', question: 'If a non-inverting amplifier is configured for Gain = 100 using an op-amp with GBWP = 2 MHz, what is its −3 dB signal bandwidth?', answer: 'Bandwidth = GBWP / Gain = 2,000,000 / 100 = 20 kHz.' },
    ],
    numericalProblems: [{ title: 'Op-Amp Slew Rate & Offset Budget', statement: 'An op-amp (V_os = 25 µV, GBWP = 1.5 MHz, SR = 0.5 V/µs) runs at non-inverting Gain = 150. Find its output DC offset error, −3 dB bandwidth, and max undistorted 5 V peak sine frequency.', given: ['V_os = 25 µV', 'G = 150', 'GBWP = 1.5 MHz', 'SR = 0.5×10⁶ V/s', 'V_p = 5 V'], steps: ['Output offset error = 150 × 25 µV = 3.75 mV', 'f_−3dB = 1.5 MHz / 150 = 10.0 kHz', 'f_max(SR) = SR / (2π V_p) = 500,000 / (2π × 5) = 15.9 kHz'], answer: 'Offset = 3.75 mV; BW = 10.0 kHz; Slew limit = 15.9 kHz.' }],
    quickRevisionNotes: ['Virtual short (V+ ≈ V−) holds ONLY under negative feedback & inside supply/slew limits!', 'GBWP = Gain × Bandwidth (constant!); always decouple supplies with 0.1 µF.', 'Use zero-drift CMOS for µV DC sensors; electrometer <1 pA for pH/TIA; guard unused pins!'],
    sources: [{ label: 'Texas Instruments', standardOrDoc: 'Op Amps for Everyone — Precision Conditioning' }],
  }),

  createTopic({
    slug: 'filters',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'Active & Passive Signal Conditioning Filters',
    shortTitle: 'Analog Filters',
    subtitle: 'Anti-aliasing Sallen-Key Butterworth/Bessel low-pass and 50/60 Hz Twin-T notch filters ahead of industrial ADCs.',
    standardRef: 'Nyquist-Shannon · Sallen-Key / Twin-T',
    schematicKind: 'generic-transducer',
    definition:
      'An Instrumentation Filter selectively passes desired process signal frequencies while attenuating out-of-band electromagnetic interference (VFD PWM switching, 50/60 Hz mains hum) and preventing high-frequency noise from aliasing back into the sampled band ahead of an ADC.',
    purpose:
      'Protects SAR/ΣΔ ADCs against aliasing distortion, eliminates 50/60 Hz powerline ripple on thermocouple/load-cell channels, and smooths vortex/turbulent flow sensor noise without distorting transient steps.',
    workingPrinciple:
      'Passive RC filters attenuate at −20 dB/decade per pole without power, while active op-amp topologies (Sallen-Key, Multiple-Feedback MFB) realize complex conjugate poles (Butterworth for maximally flat passband; Chebyshev for steep cutoff with passband ripple; Bessel for overshoot-free linear phase pulse fidelity!). Always place an analog RC anti-aliasing filter BEFORE the ADC sampler because digital filters CANNOT remove frequencies already aliased below f_s/2!',
    principleSteps: [
      'Passive differential RFI RC stage shunts MHz radio/VFD transients right at PCB connector.',
      'Active Sallen-Key or MFB low-pass stage rolls off high-frequency noise cleanly (−40 dB/dec per 2nd-order stage).',
      'Optional Twin-T notch or ΣΔ digital sinc filter places a deep >60 dB null directly at 50 Hz and 60 Hz.',
    ],
    constructionSummary:
      'NP0/C0G low-dielectric-absorption ceramic or polypropylene film capacitors paired with 0.1%–1% thin-film resistors around precision low-noise op-amps.',
    assemblyArchitecture:
      'CRITICAL CAPACITOR RULE: NEVER use X7R/Y5V ceramic capacitors inside precision analog filters! Their capacitance drops up to 50% with applied voltage ("piezoelectric microphonic/DC bias effect"), creating huge harmonic distortion! Always use C0G/NP0 ceramic or film!',
    internalComponents: [
      { partCode: '01', name: 'C0G / NP0 Film Filter Capacitors', material: 'Temperature-Stable Class-I Ceramic / Polypropylene', function: 'Sets exact pole cutoff f_c without voltage distortion', failureMode: 'Using cheap X7R ceramic causes harmonic distortion & thermal f_c drift' },
    ],
    typesAndClassification: [
      { type: 'Butterworth Low-Pass (Q = 0.707)', summary: 'Maximally flat passband magnitude; −20n dB/dec roll-off.', typicalRange: 'General anti-aliasing', accuracy: '0 dB passband ripple; ~4.3% step overshoot', bestFor: 'Steady pressure, temp, vibration spectra' },
      { type: 'Bessel Low-Pass (Q = 0.577)', summary: 'Constant group delay (linear phase); zero step overshoot!', typicalRange: 'Step/time-domain signals', accuracy: 'Gentlest roll-off; 0.4% overshoot', bestFor: 'Time-domain pulses, ultrasound, SCADA step tracking' },
      { type: 'Twin-T Mains Notch Filter', summary: 'Sharp deep null centered at 50 Hz or 60 Hz.', typicalRange: 'f_0 = 50 / 60 Hz', accuracy: '30–60 dB rejection with active Q bootstrap', bestFor: 'Removing mains hum from bridge/ECG signals' },
    ],
    equations: [
      {
        title: 'Sallen-Key 2nd-Order Equal-Component Cutoff & Nyquist Anti-Aliasing',
        latex: 'f_c = \\frac{1}{2\\pi \\sqrt{R_1 R_2 C_1 C_2}}, \\qquad f_{\\text{alias}} = \\left|f_{\\text{in}} - k \\cdot f_s\\right|',
        variables: [
          { symbol: 'f_c', meaning: '−3 dB filter corner frequency (set well below f_s/2!)', unit: 'Hz' },
          { symbol: 'f_s', meaning: 'ADC sampling frequency (Nyquist = f_s/2)', unit: 'Hz' },
        ],
        derivationSteps: ['In a 2nd-order unity-gain Sallen-Key with R₁=R₂=R, choosing C₁ = 2·C₂ yields Q = 1/√2 = 0.7071—an exact Butterworth maximally flat response!'],
      },
    ],
    characteristicCurve: {
      title: '2nd-Order Filter Responses (Butterworth vs Bessel vs Chebyshev)',
      subtitle: 'Tradeoff between steep stopband attenuation and step-response ringing/overshoot',
      xLabel: 'Normalized Frequency (f / f_c)',
      yLabel: 'Magnitude Gain',
      xUnit: '×f_c',
      yUnit: 'dB',
      series: [
        { name: 'Butterworth (Flat)', color: '#7FB3DE', points: [{ x: 0.2, y: 0 }, { x: 0.5, y: -0.3 }, { x: 1, y: -3.0 }, { x: 2, y: -12.3 }, { x: 5, y: -28.0 }] },
        { name: 'Chebyshev 1 dB (Steep)', color: '#ff9100', points: [{ x: 0.2, y: -0.5 }, { x: 0.5, y: -0.1 }, { x: 1, y: -3.0 }, { x: 2, y: -17.5 }, { x: 5, y: -34.0 }] },
        { name: 'Bessel (Linear Phase)', color: '#cdbdff', points: [{ x: 0.2, y: -0.1 }, { x: 0.5, y: -0.8 }, { x: 1, y: -3.0 }, { x: 2, y: -10.2 }, { x: 5, y: -25.1 }] },
      ],
    },
    specifications: [
      { parameter: 'Roll-off Slope', value: '−20 dB/decade per pole (−6 dB/octave per pole)', standardOrNote: '4th-order = −80 dB/dec' },
      { parameter: 'Component Tolerance', value: 'Use C0G/NP0 (1–2%) + 0.1% resistors', standardOrNote: 'Avoid X7R ceramic!' },
    ],
    measurementRange: { typicalSpan: '0.1 Hz (process) to >1 MHz (ultrasonics)', extremeLimits: 'Active filters limited to ~0.1× op-amp GBWP!', overrangeProtection: 'Add passive RC pre-filter BEFORE op-amp (active filters lose rejection above op-amp GBWP!)' },
    accuracyAndSensitivity: { accuracyClass: '±0.5% passband flatness', sensitivity: 'High-Q (>5) filters sensitive to component tolerance (use MFB instead of Sallen-Key!)', repeatability: '±0.1%', responseTime: 'Rise time t_r ≈ 0.35 / f_c' },
    advantages: ['Analog anti-aliasing prevents irreversible digital folding distortion.', 'Active filters realize sharp −40/−80 dB/dec poles without bulky expensive inductors.', 'Bessel/Butterworth options match exact phase vs amplitude needs.'],
    limitations: ['Every active Sallen-Key filter stops attenuating at high MHz frequencies above op-amp GBWP (where op-amp impedance rises and feeds high-freq noise straight through C₁!)—always precede with a tiny passive RC stage!'],
    applications: [{ industry: 'PLC AI Cards & Vibration Monitoring', service: 'Anti-aliasing front-end ahead of 16-bit SAR ADCs & 50/60 Hz mains rejection', loopTagExample: 'AAF-Stage', engineeringNote: 'Set analog f_c ≈ f_s / 5 to f_s / 10 so high-frequency noise drops ≥40 dB before Nyquist f_s/2!' }],
    calibration: { referenceStandard: 'Swept-Sine Bode Magnitude & Phase Verification', equipmentRequired: ['Bode network analyzer or swept function gen + DSO'], procedureSteps: ['Sweep 0.1×f_c to 100×f_c and verify −3 dB corner and high-frequency stopband floor.'], acceptanceCriteria: 'Corner f_c within ±3%, zero peaking above spec.' },
    installation: { mechanicalRules: ['Place passive RFI RC right at board edge before active stage.'], electricalOrImpulseRules: ['Ensure op-amp GBWP ≥ 50× f_c × Q so active pole placement stays exact.'], commonMistakes: ['Omitting an analog anti-aliasing filter and relying strictly on a "digital moving average" in PLC code—aliased VFD tones look like slow DC oscillations inside the PLC!'] },
    troubleshooting: [{ symptom: 'High-frequency 200 MHz radio/walkie-talkie transmission bypasses Sallen-Key low-pass filter completely', probableCause: 'Active op-amp loses open-loop gain above GBWP, turning Sallen-Key feedback capacitor C₁ into a direct feedthrough path!', diagnosticCheck: 'Check high-frequency >10 MHz attenuation', correctiveAction: 'Add simple passive RC low-pass right in front of Sallen-Key input!' }],
    manufacturers: [{ vendor: 'Analog Devices / Texas Instruments', modelSeries: 'Filter Wizard / WEBENCH Filter Designer Tools', notes: 'Design tools and precision op-amps (OPA320, ADA4807) for active filtering.', sourceLabel: 'TI Filter Design Reference', sourceUrl: 'https://www.ti.com', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'Analog vs Digital Filtering', thisInstrument: 'Mandatory BEFORE ADC to stop Nyquist aliasing and prevent op-amp saturation', peerName: 'Digital FIR / IIR Filter', peerValue: 'Runs AFTER ADC; razor-sharp brick-wall slopes with zero component drift', engineeringTakeaway: 'Use a gentle 2nd-order analog anti-aliasing filter before ADC + sharp digital FIR/sinc filter after ADC!' }],
    interviewQuestions: [
      { difficulty: 'Intermediate', question: 'Why CANNOT a digital software filter inside a PLC/microcontroller replace an analog anti-aliasing filter?', answer: 'Once an analog signal containing frequency f > f_s/2 enters the ADC sampler, sampling folds ("aliases") that high-frequency tone permanently down into the low-frequency passband where it becomes indistinguishable from real process signal. Only a continuous-time analog filter placed BEFORE the ADC sampler can prevent aliasing!' },
      { difficulty: 'Beginner', question: 'You sample a noisy pressure transmitter at f_s = 100 Hz while a nearby pump vibrates at 90 Hz. What false alias frequency appears in your PLC data?', answer: 'f_alias = |f_in − k·f_s| = |90 − 100| = 10 Hz! The PLC falsely sees a phantom 10 Hz pressure oscillation.' },
    ],
    numericalProblems: [{ title: 'Butterworth Sallen-Key Capacitor Design', statement: 'Design a 2nd-order unity-gain Butterworth Sallen-Key low-pass filter with f_c = 1.00 kHz using equal resistors R₁ = R₂ = 10.0 kΩ (for Butterworth Q = 0.7071, C₁ = 2·C₂). Find C₁ and C₂.', given: ['f_c = 1000 Hz', 'R = 10,000 Ω', 'C₁ = 2·C₂'], steps: ['f_c = 1 / (2π R √(2 C₂²)) = 1 / (2π √2 · R · C₂)', 'C₂ = 1 / (2π √2 × 10,000 × 1000) = 1 / 88,857,658 = 11.25 nF (standard 11 nF or 10 nF/12 nF pair)', 'C₁ = 2 · C₂ = 22.5 nF (standard 22 nF C0G!)'], answer: 'C₂ ≈ 11.3 nF (10–11 nF), C₁ ≈ 22.5 nF (22 nF C0G)' }],
    quickRevisionNotes: ['Analog anti-aliasing MUST sit BEFORE the ADC sampler!', 'Use C0G/NP0 ceramic or film caps (NEVER X7R in precision filters!).', 'Butterworth = flat amplitude; Bessel = zero step overshoot; Chebyshev = steepest cutoff.'],
    sources: [{ label: 'Analog Devices / TI', standardOrDoc: 'Active Filter Design Techniques' }],
  }),

  createTopic({
    slug: 'isolation-amplifiers',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'Galvanic Isolation Amplifiers & Barriers',
    shortTitle: 'Isolation Amplifiers',
    subtitle: 'Transformer, capacitive, and optical galvanic barriers breaking ground loops and enforcing Ex ia intrinsic safety.',
    standardRef: 'IEC 60079-11 · UL 1577 / VDE 0884',
    schematicKind: 'loop-4-20ma',
    definition:
      'A Galvanic Isolation Amplifier transfers an analog measurement signal (or 4–20 mA loop) across an electrical non-conductive barrier—magnetic transformer, high-voltage SiO₂ capacitor, or optical LED-photodiode—with zero direct ohmic copper path between field input ground and PLC/DCS ground.',
    purpose:
      'Eliminates destructive plant ground-loop circulating currents, protects expensive DCS analog cards from 1,000+ V motor/lightning common-mode surges, and implements Ex ia Intrinsically Safe energy limiting into Zone 0/1 explosive gas hazards.',
    workingPrinciple:
      'In modern digital-barrier isolation amplifiers (e.g., AMC1301 / ISO224), an input Sigma-Delta modulator powered by an isolated DC-DC side converts the analog input into a 10–20 MHz 1-bit PWM/digital stream, couples it cleanly across a 5 kVrms silicon-dioxide (SiO₂) capacitive or micro-transformer barrier, and reconstructs an isolated differential analog output—completely unaffected by LED aging that plagued older analog optocouplers!',
    principleSteps: [
      'Field sensor connects to floating isolated front-end referenced only to local pipe/vessel ground.',
      'Sigma-Delta modulator encodes analog voltage into digital high-speed stream.',
      'Reinforced SiO₂ capacitive or transformer barrier blocks DC and 50/60 Hz ground potential differences up to 1.5–5 kVrms.',
      'Output stage drives grounded PLC/DCS analog input cleanly with >120 dB CMTI.',
    ],
    constructionSummary:
      'Surface-mount reinforced-isolation IC (SOIC-8/16 widebody) or DIN-rail slim isolator module (6.2 mm wide) with isolated internal DC-DC converter and optional Zener/fuse Ex ia intrinsic safety energy clamp.',
    assemblyArchitecture:
      'Galvanic Ex ia Isolators are strongly preferred over passive Zener safety barriers because galvanic isolators do NOT require an ultra-low-impedance (<1 Ω) dedicated Intrinsic Safety (IS) earth bus!',
    internalComponents: [
      { partCode: '01', name: 'Reinforced Isolation Barrier (SiO₂ / Transformer)', material: 'Silicon Dioxide Capacitor or Micro-Polyimide Coil', function: 'Withstands 2.5–5 kVrms surge while passing MHz digital data', failureMode: 'Moisture/dust creepage across PCB slot under barrier!' },
      { partCode: '02', name: 'Isolated Side DC-DC Converter', material: 'Mini Planar Isolation Transformer', function: 'Powers floating field-side ADC or 2-wire loop cleanly', failureMode: 'Excessive loop load collapsing isolated rail' },
    ],
    typesAndClassification: [
      { type: '3-Way Signal Isolator / Splitter', summary: 'Isolates Input, Output, and 24 VDC Supply completely from one another.', typicalRange: '4–20 mA / 0–10 V / RTD / TC', accuracy: '±0.05%–0.1% span', bestFor: 'Breaking plant ground loops & splitting 1 sensor to 2 PLCs' },
      { type: 'Ex ia Intrinsically Safe Galvanic Barrier', summary: 'Limits fault voltage/current/energy below hydrogen ignition spark threshold.', typicalRange: 'Zone 0/1/2 hazardous field loops', accuracy: '±0.1% + HART pass-through', bestFor: 'Refineries, chemical tank farms, offshore rigs' },
    ],
    equations: [
      {
        title: 'Ground Loop Error Cancellation & CMTI',
        latex: 'V_{\\text{error, unisolated}} = I_{\\text{ground}} \\cdot R_{\\text{cable}}, \\qquad V_{\\text{error, isolated}} = \\frac{\\Delta V_{\\text{ground}}}{10^{\\text{CMRR}/20}} \\approx 0',
        variables: [
          { symbol: '\\Delta V_{\\text{ground}}', meaning: 'Potential difference between field pipe earth and control room marshalling ground', unit: 'V' },
          { symbol: '\\text{CMTI}', meaning: 'Common-Mode Transient Immunity (≥ 50–100 kV/µs for motor/IGBT inverters)', unit: 'kV/µs' },
        ],
        derivationSteps: ['Even a 2 V 50 Hz earth-potential difference between two plant buildings ruins a 10 mV grounded thermocouple unless broken by galvanic isolation!'],
      },
    ],
    characteristicCurve: {
      title: 'Isolated Barrier Surge & Common-Mode Rejection Characteristic',
      subtitle: 'Reinforced SiO₂ isolation holds signal distortion <0.05% across ±1000 V field-to-PLC ground shifts',
      xLabel: 'Field-to-PLC Ground Offset',
      yLabel: 'Output Error Shift',
      xUnit: 'Vrms',
      yUnit: '% FS',
      series: [{ name: 'Galvanic Isolator (5 kV Rated)', color: '#7FB3DE', points: [{ x: 0, y: 0 }, { x: 250, y: 0.01 }, { x: 500, y: 0.02 }, { x: 1000, y: 0.03 }, { x: 1500, y: 0.04 }] }],
    },
    specifications: [
      { parameter: 'Isolation Working Voltage', value: '1.5 kV – 5.0 kVrms surge (IEC 60747-17)', standardOrNote: 'Check creepage/clearance distance!' },
      { parameter: 'HART Pass-Through', value: 'Bi-directional 1200/2200 Hz FSK pass-through on modern isolators', standardOrNote: 'Verify "HART Transparent" when ordering!' },
    ],
    measurementRange: { typicalSpan: '0/4–20 mA, ±10 V, ±50 mV motor shunts', extremeLimits: 'Reinforced 5 kVrms isolation', overrangeProtection: 'Series current-limiting fuses & TVS' },
    accuracyAndSensitivity: { accuracyClass: '±0.05%–0.1% FS', sensitivity: 'Preserves full 16-bit clarity', repeatability: '±0.02%', responseTime: '<1–10 ms' },
    advantages: ['Completely breaks ground loops on grounded thermocouples, pH electrodes, and long inter-building cables.', 'Protects PLC racks and operators from high-voltage motor/VFD transients.', 'Ex ia galvanic isolators eliminate dedicated <1 Ω IS safety-ground maintenance!'],
    limitations: ['Adds voltage drop/loop burden or requires external 24 VDC DIN-rail power.', 'Legacy cheap isolators block 1200/2200 Hz HART digital signals unless explicitly HART-transparent!'],
    applications: [{ industry: 'Refineries & Variable Speed Drives', service: 'Zone 0/1 Ex ia tank radar/valve loops & grounded motor winding shunt sensors', loopTagExample: 'IS-Barrier-101', engineeringNote: 'Always specify "HART Transparent" isolators on smart transmitters so asset management AMS/PACTware works from control room!' }],
    calibration: { referenceStandard: '4–20 mA Loop Verification & Insulation Hipot Check', equipmentRequired: ['Loop calibrator', 'HART communicator'], procedureSteps: ['Inject 4, 12, 20 mA into isolated input and verify output tracks within ±0.02 mA.', 'Confirm HART communicator connects cleanly through barrier from safe side!'], acceptanceCriteria: 'Error ≤ ±0.1% span; HART pass-through intact.' },
    installation: { mechanicalRules: ['Cut anti-creepage PCB slots under isolation ICs; keep Ex ia intrinsically safe blue-labeled wiring physically separated (≥50 mm) from non-IS gray cables!'], electricalOrImpulseRules: ['Never short isolated input ground to safe output ground during troubleshooting!'], commonMistakes: ['Buying a standard non-HART 4–20 mA isolator and wondering why the HART communicator cannot talk to the field valve positioner!'] },
    troubleshooting: [{ symptom: 'Control room HART modem cannot detect transmitter while field handheld right at transmitter works fine', probableCause: 'Non-HART-transparent DIN-rail isolator or Zener barrier blocking 1.2/2.2 kHz FSK signal', diagnosticCheck: 'Check isolator datasheet for HART FSK transparency', correctiveAction: 'Replace with HART-transparent isolator (e.g., Pepperl+Fuchs HiC2025 / MTL5541)' }],
    manufacturers: [
      { vendor: 'Pepperl+Fuchs / MTL (Eaton) / Phoenix Contact', modelSeries: 'K-System / MTL5500 / MINI Analog Pro', notes: 'Ex ia galvanic isolators & HART-transparent signal conditioners.', sourceLabel: 'Pepperl+Fuchs & MTL Isolators', sourceUrl: 'https://www.pepperl-fuchs.com', verificationStatus: 'sourced-reference' },
      { vendor: 'Texas Instruments / Analog Devices', modelSeries: 'AMC1301 / ADuM3190', notes: 'Reinforced SiO₂ capacitive and iCoupler magnetic isolation amplifiers.', sourceLabel: 'TI & ADI Isolation ICs', sourceUrl: 'https://www.ti.com', verificationStatus: 'sourced-reference' },
    ],
    comparisons: [{ parameter: 'Galvanic Isolator vs Zener Barrier', thisInstrument: 'Galvanic Isolator: breaks ground loop, needs NO <1 Ω IS earth bus, HART friendly', peerName: 'Passive Zener Barrier', peerValue: 'Cheaper, no 24 V supply needed, BUT ties field ground straight to <1 Ω IS earth (no ground-loop break!)', engineeringTakeaway: 'Modern plants standardize on active Galvanic Ex ia Isolators over passive Zener barriers.' }],
    interviewQuestions: [{ difficulty: 'Industry-Oriented', question: 'Why have modern refineries largely replaced cheap passive Zener safety barriers with active Ex ia Galvanic Isolators?', answer: 'A passive Zener barrier relies on shunting fault current straight to a dedicated <1 Ω Intrinsically Safe (IS) earth bus—meaning it does NOT break ground loops and demands expensive annual earth-resistance testing. An active Galvanic Isolator safely breaks ground loops via transformer/optical isolation with zero dedicated IS ground bus required!' }],
    numericalProblems: [{ title: 'Isolation CMRR Attenuation', statement: 'A VFD inverter induces 400 V peak common-mode surge across a motor shunt. If an isolation amplifier has 110 dB CMRR at that frequency, what false error appears at its unity-gain output?', given: ['V_cm = 400 V', 'CMRR = 110 dB'], steps: ['Rejection ratio = 10^(110/20) = 10^5.5 = 316,228', 'V_error = 400 / 316,228 = 1.265 mV'], answer: '1.27 mV' }],
    quickRevisionNotes: ['Breaks ground loops & blocks kV surges across transformer/SiO₂/optical barrier.', 'Ex ia Galvanic Isolator beats Zener Barrier (no <1 Ω IS ground needed!).', 'Order "HART-Transparent" isolators for smart field instruments!'],
    sources: [{ label: 'IEC 60079-11', standardOrDoc: 'Explosive atmospheres — Equipment protection by intrinsic safety "i"' }],
  }),

  createTopic({
    slug: 'adc-and-dac',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'ADC & DAC Architectures (SAR, Sigma-Delta & R-2R)',
    shortTitle: 'ADC & DAC',
    subtitle: 'Successive approximation, 24-bit Sigma-Delta noise-shaping ADCs, and R-2R/current-steering DACs for smart instrumentation.',
    standardRef: 'IEEE 1241 · ENOB & Quantization',
    schematicKind: 'generic-transducer',
    definition:
      'Analog-to-Digital Converters (ADCs) quantize continuous sensor voltages into discrete N-bit binary words (1 LSB = V_ref / 2^N), while Digital-to-Analog Converters (DACs) reconstruct calibrated digital setpoints back into analog 4–20 mA / 0–10 V control signals.',
    purpose:
      'Bridges real-world analog sensors (RTDs, thermocouples, vibration pickups) with microprocessors, PLC analog I/O racks, and smart 4–20 mA transmitters.',
    workingPrinciple:
      'Successive Approximation Register (SAR) ADCs use a sample-and-hold plus binary-weighted capacitor DAC to perform binary search in N clock cycles (ideal for fast 100 kSPS–5 MSPS multiplexed PLC cards). Sigma-Delta (ΣΔ) ADCs oversample at MHz rates with a 1-bit modulator, pushing quantization noise upward out of band before a digital sinc filter yields ultra-clean 24-bit resolution with automatic 50/60 Hz mains rejection inside smart transmitters! For output, R-2R ladders or precision ΣΔ/PWM DACs drive 4–20 mA loop regulators.',
    principleSteps: [
      'Sample-and-Hold freezes continuous analog voltage (SAR) or oversamples continuously (ΣΔ).',
      'N-bit quantizer produces binary code round(V_in / LSB) with quantization error ±½ LSB.',
      'In ΣΔ ADCs, programmable Sinc3 digital filter notches out 50 Hz and 60 Hz hum simultaneously!',
      'Output DAC (R-2R ladder or string DAC) sets analog output current cleanly with 16-bit monotonicity.',
    ],
    constructionSummary:
      'Precision mixed-signal CMOS ASICs (e.g., ADS124S08 24-bit RTD/TC ΣΔ ADC, AD7606 16-bit simultaneous SAR ADC, DAC8760 16-bit 4–20 mA industrial DAC) paired with low-drift 2.5 V / 4.096 V bandgap references.',
    assemblyArchitecture:
      'Ratiometric Tip: Power BOTH the Wheatstone bridge/RTD excitation AND the ADC V_ref from the exact same voltage/current source—so power-supply drift cancels 100% identically!',
    internalComponents: [
      { partCode: '01', name: '24-Bit ΣΔ Modulator & Sinc Filter', material: 'Switched-Capacitor CMOS + Digital Decimator', function: 'Achieves >20 ENOB & simultaneous 50/60 Hz line rejection', failureMode: 'Excessive V_ref noise limits real ENOB well below 24 bits!' },
      { partCode: '02', name: 'Precision R-2R / String DAC Stage', material: 'Laser-Trimmed Thin-Film R-2R Ladder', function: 'Guarantees monotonic 16-bit D/A step linearity', failureMode: 'Non-monotonic DAC steps cause control-loop limit-cycle hunting!' },
    ],
    typesAndClassification: [
      { type: 'Sigma-Delta (ΣΔ) ADC (16–24 Bit)', summary: 'Oversampling + noise shaping + digital sinc filter; king of low-frequency precision.', typicalRange: '5 SPS to 50 kSPS', accuracy: 'ENOB 18–22 bits (sub-µV!)', bestFor: 'Smart RTD/TC transmitters, weigh scales, pH' },
      { type: 'SAR ADC (12–18 Bit)', summary: 'Zero cycle latency; deterministic exact trigger instant.', typicalRange: '100 kSPS to 10 MSPS', accuracy: 'ENOB 11–16 bits', bestFor: 'Multiplexed PLC AI cards, motor current, vibration' },
      { type: 'R-2R Ladder & String DAC', summary: 'Uses just two resistor values (R and 2R) regardless of N bits!', typicalRange: '12–18 bits', accuracy: '±1 LSB DNL/INL', bestFor: 'PLC Analog Output (AO) & 4–20 mA loop drivers' },
    ],
    equations: [
      {
        title: 'ADC Resolution, Quantization Noise & Ideal SNR / ENOB',
        latex: '\\text{LSB} = \\frac{V_{\\text{FS}}}{2^N}, \\qquad \\text{SNR}_{\\text{ideal}} = 6.02 N + 1.76\\text{ dB}, \\qquad \\text{ENOB} = \\frac{\\text{SINAD} - 1.76}{6.02}',
        variables: [
          { symbol: 'N', meaning: 'Nominal ADC bit width (e.g., 12, 16, or 24 bits)', unit: 'bits' },
          { symbol: '\\text{ENOB}', meaning: 'Effective Number of Bits after real thermal noise & distortion (SINAD)', unit: 'bits' },
        ],
        derivationSteps: ['Quantization error uniformly spans ±½ LSB, giving RMS noise = LSB / √12; integrating over sine wave full scale yields the famous 6.02N + 1.76 dB SNR law!'],
      },
    ],
    characteristicCurve: {
      title: 'Quantization Resolution & Ideal Dynamic Range vs Bit Depth (N)',
      subtitle: 'Each extra bit doubles resolution (+6.02 dB dynamic range)—though thermal noise limits real 24-bit ΣΔ ADCs to ~20–21 ENOB',
      xLabel: 'ADC Bit Depth (N)',
      yLabel: 'Ideal Dynamic Range',
      xUnit: 'bits',
      yUnit: 'dB',
      series: [{ name: 'Ideal SNR (6.02N + 1.76)', color: '#7FB3DE', points: [{ x: 8, y: 49.9 }, { x: 10, y: 62.0 }, { x: 12, y: 74.0 }, { x: 16, y: 98.1 }, { x: 20, y: 122.2 }, { x: 24, y: 146.2 }] }],
    },
    specifications: [
      { parameter: '12-bit PLC Card Counts', value: '0–4095 counts (0.0244% span/count)', standardOrNote: 'Often scaled 0–27648 in Siemens S7!' },
      { parameter: '16-bit Industrial AI', value: '65,536 counts (0.0015% span/count)', standardOrNote: 'Resolves <0.25 µA on 4–20 mA!' },
    ],
    measurementRange: { typicalSpan: '0–5 V, ±10 V, 4–20 mA scaled inputs', extremeLimits: 'PGA boosts ±10 mV thermocouple signals directly inside ΣΔ ADC', overrangeProtection: 'Clamp Schottky diodes + series R limit fault currents' },
    accuracyAndSensitivity: { accuracyClass: '±0.001%–0.02% FSR', sensitivity: 'nV/count on 24-bit ΣΔ PGA', repeatability: 'Noise-limited RMS counts', responseTime: 'µs (SAR) to 20–50 ms (ΣΔ 50/60 Hz notch)' },
    advantages: ['24-bit ΣΔ eliminates bulky external gain stages and notches 50/60 Hz mains hum digitally.', 'R-2R DAC uses only 2 resistor values rather than 2^N binary-weighted monsters.', 'Ratiometric referencing cancels reference drift completely.'],
    limitations: ['A "24-bit" datasheet rating NEVER achieves 24 noise-free bits in reality (~19–21 ENOB max due to kTB thermal noise!).', 'Multiplexing ΣΔ ADCs rapidly incurs digital filter settling latency (switch to SAR for high-speed multi-channel scans!).'],
    applications: [{ industry: 'All Smart Transmitters & PLCs', service: 'PLC AI/AO modules, temperature head transmitters, digital oscilloscopes', loopTagExample: 'AI-Module-16b', engineeringNote: 'Verify PLC scaling card counts (e.g., Siemens 0–27,648, Allen-Bradley 0–32,767 or 4,000–20,000) during commissioning!' }],
    calibration: { referenceStandard: 'Zero/Gain Linearity & DNL/INL Verification', equipmentRequired: ['Precision 20-bit DC voltage standard'], procedureSteps: ['Step calibrated voltage across 0%, 25%, 50%, 75%, 100% of V_ref.', 'Record shorted-input noise standard deviation to compute true ENOB / noise-free bits.'], acceptanceCriteria: 'Error ≤ ±2 LSB, noise-free resolution meets spec.' },
    installation: { mechanicalRules: ['Partition analog ground (AGND) and noisy digital ground (DGND) cleanly under ADC IC star point!'], electricalOrImpulseRules: ['Bypass V_ref tightly with low-ESR capacitor per ADC datasheet.'], commonMistakes: ['Feeding a noisy 5 V switching USB rail as ADC V_ref—every 1% supply ripple modulates 100% of your ADC readings directly!'] },
    troubleshooting: [{ symptom: '24-bit ADC last 6 bits flicker wildly even with input shorted', probableCause: 'Normal thermal kTB noise floor (~18–19 noise-free bits) OR noisy V_ref / switching regulator ripple', diagnosticCheck: 'Measure standard deviation (RMS counts) with shorted inputs & check V_ref ripple on scope', correctiveAction: 'Lower ΣΔ output data rate (SPS), enable PGA/notch filter, or upgrade to clean LDO V_ref' }],
    manufacturers: [{ vendor: 'Texas Instruments / Analog Devices', modelSeries: 'ADS124S08 / AD7124 / AD7606 / DAC8760', notes: 'Industrial ΣΔ, simultaneous SAR ADCs, and 4–20 mA loop DACs.', sourceLabel: 'TI & ADI Data Converters', sourceUrl: 'https://www.analog.com', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'SAR vs Sigma-Delta (ΣΔ)', thisInstrument: 'ΣΔ: 24-bit, built-in 50/60 Hz notch, best for slow sensors (RTD/TC/weigh)', peerName: 'SAR ADC', peerValue: '12–18 bit, zero filter latency, best for fast multiplexed PLC & vibration', engineeringTakeaway: 'Slow precision sensor = ΣΔ; Fast deterministic multiplexing = SAR.' }],
    interviewQuestions: [
      { difficulty: 'Beginner', question: 'Why is an R-2R Ladder DAC overwhelmingly preferred over a Binary-Weighted Resistor DAC for 12-to-16 bit conversion?', answer: 'A 16-bit binary-weighted DAC would need resistors spanning a 2¹⁵ = 32,768:1 ratio (e.g., 1 kΩ up to 32.768 MΩ!), which is impossible to fabricate accurately on silicon. An R-2R ladder uses ONLY two identical resistor values (R and 2R) regardless of bit depth, making laser matching easy!' },
      { difficulty: 'Intermediate', question: 'If a 12-bit ADC with 0–10 V range reads a 4–20 mA transmitter across a 250 Ω resistor (1.00 V to 5.00 V), how many counts represent the live 4–20 mA span?', answer: '1 LSB = 10 V / 4096 = 2.441 mV. 1.00 V (4 mA) = 410 counts; 5.00 V (20 mA) = 2048 counts. Only 2048 − 410 = 1638 counts (40% of ADC capacity!) span the process! Using a 0–5 V ADC range doubles resolution to 3277 counts.' },
    ],
    numericalProblems: [{ title: 'ADC LSB & ENOB Calculation', statement: 'A 16-bit ADC spans 0–5.000 V. Calculate 1 LSB voltage in µV. If measured SINAD = 86.0 dB, compute real ENOB.', given: ['N = 16', 'V_FS = 5.000 V', 'SINAD = 86.0 dB'], steps: ['1 LSB = 5.000 / 65,536 = 76.29 µV', 'ENOB = (86.0 − 1.76) / 6.02 = 84.24 / 6.02 = 13.99 ≈ 14.0 bits'], answer: '1 LSB = 76.29 µV; ENOB = 14.0 bits.' }],
    quickRevisionNotes: ['1 LSB = V_FS / 2^N; SNR_ideal = 6.02N + 1.76 dB.', 'ΣΔ = high bit depth + 50/60 Hz notch (temp/weigh); SAR = fast zero-latency (PLC/vibration).', 'R-2R DAC uses only R and 2R; power bridge + V_ref ratiometrically!'],
    sources: [{ label: 'IEEE Std 1241', standardOrDoc: 'Standard for Terminology and Test Methods for Analog-to-Digital Converters' }],
  }),

  createTopic({
    slug: '4-20-ma',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: '4–20 mA Current Loop & NAMUR NE43 Standard',
    shortTitle: '4–20 mA Loop',
    subtitle: 'Two-wire loop-powered live-zero current signaling immune to long cable resistance drops and enabling instant wire-break detection.',
    standardRef: 'IEC 60381-1 · NAMUR NE43',
    schematicKind: 'loop-4-20ma',
    definition:
      'The 4–20 mA Current Loop is the universal industrial analog signaling standard where a field transmitter regulates loop DC current linearly between 4.00 mA (0% LRV) and 20.00 mA (100% URV), completely immune to wire resistance voltage drops and self-powering 2-wire electronics off the <3.5 mA baseline.',
    purpose:
      'Transmits accurate process measurements reliably across kilometers of copper cable in noisy chemical/refinery plants while immediately distinguishing a true 0% process reading (4 mA) from a cut wire or dead power supply (0 mA!).',
    workingPrinciple:
      'By Kirchhoff’s Current Law, current flowing anywhere around a closed series loop is identical at every point—whether the twisted pair is 10 m or 1,500 m long! A 24 VDC supply pushes current through the transmitter’s active series current-regulator transistor and across a precision 250 Ω input resistor at the PLC/DCS (converting 4–20 mA cleanly into 1.00–5.00 V). Because quiescent current sits at 4 mA ("Live Zero"), the transmitter’s microcontroller & LCD harvest ~3.5 mA continuously from the same two wires!',
    principleSteps: [
      '24 VDC power supply feeds loop positive (+) out to field transmitter.',
      '2-wire transmitter acts as a precision variable current sink consuming <3.5 mA internally while regulating total loop current I = 4 + 16·((PV−LRV)/(URV−LRV)).',
      'Return current flows through a 250 Ω precision resistor inside the PLC/DCS AI card (1–5 V).',
      'NAMUR NE43 reserves ≤3.6 mA and ≥21.0 mA strictly as hardware fault alarms!',
    ],
    constructionSummary:
      'Shielded twisted-pair instrumentation cable (0.5–1.5 mm²), 24 VDC loop PSU, 2-wire/4-wire transmitter, optional 250 Ω HART resistor, and PLC/DCS AI channel.',
    assemblyArchitecture:
      'CRITICAL LOOP BUDGET CHECK: Total voltage drops around the loop (I_max · [R_cable + R_AI + R_barrier] + V_tx_min) MUST stay strictly below V_supply (24 VDC) even at 21.5 mA upscale alarm!',
    internalComponents: [
      { partCode: '01', name: '2-Wire Loop Current Regulator Stage', material: 'Precision DAC + Pass Transistor', function: 'Powers internal MCU (<3.5 mA) and holds exact 4–20 mA regardless of supply ripple', failureMode: 'Insufficient terminal voltage (<12 V) drops loop below 20 mA!' },
      { partCode: '02', name: '250 Ω Precision Sensing Resistor', material: '0.1% Low-TCR Foil Resistor', function: 'Converts 4–20 mA into 1–5 VDC for ADC + provides HART impedance', failureMode: 'Burned open resistor when 24 V is shorted directly across AI pins!' },
    ],
    typesAndClassification: [
      { type: '2-Wire Loop-Powered (Type 2)', summary: 'Same 2 wires carry both 24 VDC power AND 4–20 mA signal.', typicalRange: '4.00–20.00 mA (max load ~550–700 Ω @ 24 V)', accuracy: '±0.02%–0.1% loop', bestFor: '90% of P/T/DP/Level field transmitters' },
      { type: '4-Wire Externally Powered', summary: 'Dedicated 24 VDC / 110/230 VAC mains pair + isolated 4–20 mA output pair.', typicalRange: 'High-power analyzers, magmeters, Coriolis', accuracy: '±0.05%', bestFor: 'Meters needing >1 W coil/heater/laser power' },
    ],
    equations: [
      {
        title: '4–20 mA Transfer Equation & Maximum Loop Load Budget',
        latex: 'I_{\\text{mA}} = 4 + 16 \\left(\\frac{\\text{PV} - \\text{LRV}}{\\text{URV} - \\text{LRV}}\\right), \\qquad R_{\\text{load, max}} = \\frac{V_{\\text{supply}} - V_{\\text{tx, min}}}{0.0215\\text{ A}}',
        variables: [
          { symbol: 'V_{\\text{tx, min}}', meaning: 'Minimum terminal lift-off voltage required by transmitter (typically 10.5–12 V)', unit: 'V' },
          { symbol: '0.0215\\text{ A}', meaning: 'Worst-case NAMUR NE43 upscale burnout current (21.5 mA)', unit: 'A' },
        ],
        derivationSteps: ['Always size loop resistance at worst-case 21.5–22.0 mA upscale burnout—NOT 20 mA—otherwise upscale fault alarms will saturate and collapse below 20 mA!'],
      },
    ],
    characteristicCurve: {
      title: 'NAMUR NE43 Live-Zero & Fault Diagnostic Bands',
      subtitle: '3.8–20.5 mA valid process band leaves unmistakable fault bands below 3.6 mA and above 21.0 mA',
      xLabel: 'Process Variable',
      yLabel: 'Loop Current',
      xUnit: '% Span',
      yUnit: 'mA',
      series: [{ name: '4–20 mA Linear Transfer', color: '#7FB3DE', points: [{ x: -1.25, y: 3.8 }, { x: 0, y: 4.0 }, { x: 25, y: 8.0 }, { x: 50, y: 12.0 }, { x: 75, y: 16.0 }, { x: 100, y: 20.0 }, { x: 103.1, y: 20.5 }] }],
    },
    specifications: [
      { parameter: 'Live Zero (0%) / Full Scale (100%)', value: '4.00 mA / 20.00 mA (1.00–5.00 V across 250 Ω)', standardOrNote: '0 mA = cut wire / power loss!' },
      { parameter: 'NAMUR NE43 Fault Thresholds', value: 'Downscale ≤ 3.6 mA; Upscale ≥ 21.0 mA', standardOrNote: 'Triggers DCS Bad-PV alarm immediately' },
    ],
    measurementRange: { typicalSpan: '4.00–20.00 mA (valid 3.8–20.5 mA)', extremeLimits: '0 mA open circuit; 22.5 mA saturation', overrangeProtection: 'Series diode & fuse protect against reversed 24 V wiring' },
    accuracyAndSensitivity: { accuracyClass: '±0.01–0.05 mA loop D/A accuracy', sensitivity: 'Resolves µA changes cleanly across miles of wire', repeatability: '±0.01 mA', responseTime: 'Instantaneous DC (<10 ms)' },
    advantages: ['Completely immune to long cable IR voltage drops (unlike 0–10 V!).', 'Live-zero 4 mA immediately detects broken wires/dead power (0 mA) AND powers 2-wire smart transmitters.', 'Natural high noise immunity against electric fields (low loop impedance ~250 Ω).'],
    limitations: ['Only carries ONE primary analog variable (solved by superimposing HART digital FSK!).', 'Cannot connect multiple transmitters in parallel on the same pair (only ONE transmitter per series loop, though multiple receivers/indicators can sit in series up to R_max!).'],
    applications: [{ industry: 'Universal Industrial Standard', service: 'Virtually all analog field transmitters, control valve positioners, VFD speed references', loopTagExample: 'Loop-4-20', engineeringNote: 'Use a clamp-on milliammeter (e.g., Fluke 773) to troubleshoot live loops WITHOUT breaking the series circuit!' }],
    calibration: { referenceStandard: '5-Point Loop Injection (4, 8, 12, 16, 20 mA)', equipmentRequired: ['Fluke 789/773 ProcessMeter or Loop Calibrator'], procedureSteps: ['Simulate 4.00, 8.00, 12.00, 16.00, 20.00 mA into DCS AI channel and confirm exact 0–100% engineering readout.', 'Test broken-wire fault behavior (0 mA triggers Bad-PV alarm & failsafe logic).'], acceptanceCriteria: 'DCS readout within ±0.1% span.' },
    installation: { mechanicalRules: ['Single-point shield ground ONLY at control room marshalling cabinet—leave field shield cut/insulated neatly!'], electricalOrImpulseRules: ['Verify Polarity (+ to +, − to −); check active vs passive AI card configuration (never put two 24 V supplies fighting in one loop!).'], commonMistakes: ['Wiring a 4-wire ACTIVE sourcing transmitter into an ACTIVE 24 V loop-powered PLC AI card—two 24 V sources fight and burn out the card fuse! Always check Active vs Passive!'] },
    troubleshooting: [{ symptom: 'Loop current clamps at 15.8 mA and refuses to climb to 20 mA even though process is 100%', probableCause: 'Excessive total loop resistance (too many series indicators + cable + barrier) starved transmitter terminal voltage below 12 V!', diagnosticCheck: 'Measure voltage right across field transmitter +/− terminals at high flow', correctiveAction: 'Remove unnecessary series indicator, boost PSU to 26–28 V, or upgrade wire gauge' }],
    manufacturers: [{ vendor: 'Emerson / Siemens / Fluke / Yokogawa', modelSeries: 'IEC 60381-1 Standard Hardware Ecosystem', notes: 'All major process transmitters & calibrators implement NAMUR NE43 4–20 mA.', sourceLabel: 'NAMUR NE43 Specification', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: '4–20 mA vs 0–10 V', thisInstrument: 'Immune to cable voltage drop; live-zero detects open wire (0 mA); 2-wire powers transmitter', peerName: '0–10 VDC Signal', peerValue: 'Cannot detect cut wire vs true 0%; voltage drops across long wires; needs 3–4 wires', engineeringTakeaway: '0–10 V belongs inside local control panels (<5 m); 4–20 mA owns industrial field wiring.' }],
    interviewQuestions: [
      { difficulty: 'Beginner', question: 'Why did industry standardize on 4–20 mA ("live zero") instead of 0–20 mA or 0–10 V for field transmitters?', answer: '1) Live-zero 4 mA clearly distinguishes a true 0% measurement (4 mA) from a cut field wire or blown fuse (0 mA). 2) 4 mA gives ~3.5 mA of continuous quiescent current to power 2-wire smart transmitters over the same wire pair. 3) Current stays identical everywhere in a series loop regardless of cable resistance voltage drop!' },
      { difficulty: 'Industry-Oriented', question: 'What happens if you connect an Active (externally powered) 4-wire transmitter directly onto an Active (loop-powered) PLC Analog Input channel?', answer: 'Both devices supply 24 VDC onto the loop wires—blocking or reversing loop current regulation and frequently blowing the PLC card fuse or transmitter output stage. An Active 4-wire transmitter MUST wire into a Passive AI card (or through an isolator/sink converter)!' },
    ],
    numericalProblems: [{ title: '4–20 mA Loop Scaling & Load Check', statement: 'A pressure transmitter ranged 50 to 250 kPa outputs 14.40 mA into a 250 Ω PLC resistor over 300 m copper pair (18 Ω loop total). Find pressure PV and voltage across transmitter terminals if PSU = 24.0 V.', given: ['LRV = 50 kPa, URV = 250 kPa (Span = 200 kPa)', 'I = 14.40 mA', 'R_total = 250 + 18 = 268 Ω', 'V_supply = 24.0 V'], steps: ['Fraction = (14.40 − 4.00) / 16.00 = 10.40 / 16.00 = 0.65 (65%)', 'PV = 50 + 0.65 × 200 = 180.0 kPa', 'Loop resistance drop = 0.0144 A × 268 Ω = 3.86 V ⇒ V_tx = 24.0 − 3.86 = 20.14 V (healthy!)'], answer: 'PV = 180.0 kPa; V_tx = 20.14 V' }],
    quickRevisionNotes: ['4 mA = 0%, 8 mA = 25%, 12 mA = 50%, 16 mA = 75%, 20 mA = 100%!', 'NAMUR NE43 fault alarms: ≤3.6 mA or ≥21.0 mA; 0 mA = dead loop/cut wire.', 'Never mix two active 24 V sources in one loop; check R_max at 21.5 mA!'],
    sources: [{ label: 'NAMUR NE43 / IEC 60381-1', standardOrDoc: 'Analogue Signals for Process Control Systems' }],
  }),

  createTopic({
    slug: 'hart',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'HART Protocol (Highway Addressable Remote Transducer)',
    shortTitle: 'HART Protocol',
    subtitle: 'Bell 202 FSK digital packets (1200 Hz / 2200 Hz) superimposed cleanly atop live 4–20 mA analog loops without disrupting PID control.',
    standardRef: 'IEC 61158 · HART 7 (FieldComm Group)',
    schematicKind: 'loop-4-20ma',
    definition:
      'HART (Highway Addressable Remote Transducer) is a bi-directional hybrid analog+digital field communication protocol that superimposes a ±0.5 mA Bell 202 Frequency-Shift Keyed (FSK) AC signal directly onto a standard 4–20 mA DC loop—enabling remote configuration, multi-variable telemetry, and predictive diagnostics with zero interference to the DC control signal.',
    purpose:
      'Allows commissioning engineers and asset management systems (AMS/PRM/FieldCare) to re-range transmitters, read secondary variables (e.g., Coriolis density & temp alongside mass flow), and inspect sensor health from the control room over existing 4–20 mA twisted pairs.',
    workingPrinciple:
      'Logic "1" is transmitted at 1200 Hz and Logic "0" at 2200 Hz as continuous zero-mean ±0.5 mA AC sine waves superimposed onto the 4–20 mA DC baseline. Because the average DC value of any symmetrical sine wave is strictly ZERO, the 4–20 mA analog PID input sees zero offset! Communicating reliably requires ≥250 Ω total loop resistance (typically 250–600 Ω, maximum ~1100 Ω) across which the ±0.5 mA FSK signal develops a readable ±125 mV peak AC voltage.',
    principleSteps: [
      'Master (HART Communicator / Asset Manager / HART-AI card) modulates 1200/2200 Hz voltage onto the loop.',
      'Across the mandatory ≥250 Ω loop resistor, the FSK carrier rides smoothly atop the 4–20 mA DC current.',
      'Field slave transmitter decodes command (1200 bps half-duplex) and replies with PV, SV, TV, QV, tag, range, or NAMUR NE107 diagnostics.',
      'Supports Point-to-Point (4–20 mA active, Polling Addr 0) or Multidrop (up to 63 devices fixed at 4 mA, Addr 1–63).',
    ],
    constructionSummary:
      'Bell 202 FSK modem IC inside smart field instruments + standard 24 VDC power supply + ≥250 Ω series load resistor + twisted shielded copper pair (up to ~1.5–3 km depending on cable capacitance).',
    assemblyArchitecture:
      'CLASSIC EXAM/FIELD TRAP: Trying to communicate with a HART transmitter sitting directly across a low-resistance power supply (0 Ω impedance!) fails completely—because the power supply capacitor shorts out the 1200/2200 Hz FSK AC voltage to zero! Always clip the HART communicator across the 250 Ω resistor OR directly across the transmitter terminals WITH ≥250 Ω in series with the supply!',
    internalComponents: [
      { partCode: '01', name: 'Bell 202 FSK Modem & Loop Shunt', material: 'CMOS HART Modem IC (AD5700 / DS8500)', function: 'Superimposes phase-continuous 1200/2200 Hz ±0.5 mA AC carrier onto DC loop', failureMode: 'Excessive cable capacitance (>0.22 µF) attenuates 2200 Hz edge cleanly' },
    ],
    typesAndClassification: [
      { type: 'Point-to-Point Mode (Addr 0)', summary: 'Standard 4–20 mA analog control PLUS digital HART diagnostics simultaneously.', typicalRange: '1 device per cable pair; ~2 updates/sec', accuracy: 'Pure digital PV matches internal 24-bit ADC!', bestFor: '99% of industrial PID loops & SIS devices' },
      { type: 'Multidrop Mode (Addr 1–63)', summary: 'All transmitters lock output at 4 mA DC while communicating digitally on one pair.', typicalRange: 'Up to 63 devices (HART 6/7)', accuracy: 'Digital only (slow polling)', bestFor: 'Tank farm level monitoring (non-control telemetry)' },
      { type: 'WirelessHART (IEC 62591)', summary: '2.4 GHz IEEE 802.15.4 TDMA self-healing mesh carrying full HART commands over battery.', typicalRange: '100–250 m per hop', accuracy: 'Digital HART 7', bestFor: 'Rotating kilns, remote wellheads, steam trap monitoring' },
    ],
    equations: [
      {
        title: 'HART FSK Modulation & Loop Impedance / Capacitance Limits',
        latex: 'f_1 = 1200\\text{ Hz (Logic 1)}, \\quad f_0 = 2200\\text{ Hz (Logic 0)}, \\quad 250\\,\\Omega \\le R_{\\text{loop}} \\le 1100\\,\\Omega, \\quad \\int_0^T I_{\\text{FSK}}(t)\\,dt = 0',
        variables: [
          { symbol: 'R_{\\text{loop}}', meaning: 'Series impedance between transmitter and PSU (250 Ω mandatory floor!)', unit: 'Ω' },
          { symbol: 'C_{\\text{max}}', meaning: 'Total cable + device capacitance limit (keeps RC cutoff > 2.2 kHz)', unit: 'µF' },
        ],
        derivationSteps: ['At 2200 Hz, long multi-kilometer cables with high shunt capacitance form an RC low-pass filter with R_loop, rounding off Logic "0" pulses unless kept under ~3 km.'],
      },
    ],
    characteristicCurve: {
      title: 'HART FSK Carrier Superimposed on 12 mA DC Analog Signal',
      subtitle: 'Zero-mean ±0.5 mA 1200/2200 Hz sine wave leaves DC average undisturbed at 12.00 mA',
      xLabel: 'Time',
      yLabel: 'Loop Current',
      xUnit: 'ms',
      yUnit: 'mA',
      series: [{ name: '12 mA DC + ±0.5 mA FSK', color: '#7FB3DE', points: [{ x: 0, y: 12.0 }, { x: 0.21, y: 12.5 }, { x: 0.42, y: 12.0 }, { x: 0.63, y: 11.5 }, { x: 0.83, y: 12.0 }, { x: 1.04, y: 12.5 }, { x: 1.25, y: 12.0 }] }],
    },
    specifications: [
      { parameter: 'Data Rate & Carrier', value: '1200 bps half-duplex Bell 202 FSK (1200/2200 Hz)', standardOrNote: '2–3 master-slave polls per second' },
      { parameter: 'Mandatory Loop Resistor', value: '250 Ω minimum (250–600 Ω ideal)', standardOrNote: 'Needed to turn ±0.5 mA into readable mV!' },
      { parameter: 'Dual Masters', value: 'Supports 1 Primary (DCS/AMS) + 1 Secondary (Handheld)', standardOrNote: 'Coexist peacefully on same wires!' },
    ],
    measurementRange: { typicalSpan: '4 dynamic variables (PV, SV, TV, QV) + full device parameters', extremeLimits: 'Max ~3,000 m cable length (single twisted pair)', overrangeProtection: 'Short-circuit & polarity-insensitive HART modems' },
    accuracyAndSensitivity: { accuracyClass: 'Zero digital conversion loss (reads exact internal 24-bit PV)', sensitivity: 'Detects ±0.5 mA FSK across 250 Ω', repeatability: 'Exact digital checksum', responseTime: '~300–500 ms per poll' },
    advantages: ['Upgrades existing 4–20 mA twisted-pair wiring to smart digital diagnostics without pulling new fieldbus cables!', 'Zero-average FSK never disturbs live analog PID control.', 'Supports simultaneous Primary DCS + Secondary Handheld communicator.'],
    limitations: ['Slow 1200 bps speed (~2–3 updates/sec) unsuitable for fast closed-loop digital control (use Profibus/Profinet/FF instead).', 'Fails immediately if someone forgets the 250 Ω series loop resistor or tests across a stiff power supply!'],
    applications: [{ industry: 'Global Process Plants', service: 'Universal smart transmitter commissioning, valve signature diagnostics, PV+Temp dual readout', loopTagExample: 'HART-Loop-All', engineeringNote: 'Verify PLC AI card has built-in 250 Ω resistance before adding an external 250 Ω resistor in series!' }],
    calibration: { referenceStandard: 'Digital PV vs Analog Loop Current Trim Check', equipmentRequired: ['HART Communicator (Emerson Trex / Fluke 754)', '250 Ω resistor + 24 VDC supply'], procedureSteps: ['Confirm communicator polls Device Tag & PV reliably.', 'Compare HART Digital PV (sensor value) against Analog Loop mA read by DCS to catch D/A trim mismatches!'], acceptanceCriteria: 'Digital PV matches physical input AND 4–20 mA agrees within ±0.02 mA.' },
    installation: { mechanicalRules: ['Label junction-box HART test terminals clearly.'], electricalOrImpulseRules: ['Ensure ≥250 Ω sits between transmitter and 24 VDC PSU (note: power supply output cap shorts AC FSK if R_loop = 0 Ω!).'], commonMistakes: ['Wiring a bench transmitter straight to a 24 V power supply with NO 250 Ω resistor and wondering why the HART communicator says "No Device Found"!', 'Putting a transmitter in Multidrop Address > 0 by mistake—locks analog current permanently at 4.00 mA!'] },
    troubleshooting: [
      { symptom: 'Transmitter output is locked strictly at 4.00 mA regardless of real pressure/temperature', probableCause: 'HART Polling Address accidentally set to 1–63 (Multidrop mode disables variable 4–20 mA!) OR Loop Current Fixed Mode left active!', diagnosticCheck: 'Connect HART communicator and check Polling Address (must be 0!) & Loop Test status', correctiveAction: 'Reset Polling Address back to 0 and exit Fixed Current Test Mode' },
      { symptom: '"No Device Found" error on HART handheld', probableCause: 'Loop resistance < 250 Ω (power supply shorting FSK carrier), open loop, or non-HART isolator', diagnosticCheck: 'Check series resistance ≥ 250 Ω and verify loop DC current 4–20 mA is flowing', correctiveAction: 'Insert 250 Ω resistor in series with 24 V supply' },
    ],
    manufacturers: [{ vendor: 'FieldComm Group Ecosystem (Emerson / E+H / Yokogawa / ABB / Siemens)', modelSeries: 'HART 7 / WirelessHART Certified Portfolio', notes: 'Supported natively across >40 million installed smart instruments worldwide.', sourceLabel: 'FieldComm Group HART Spec', sourceUrl: 'https://www.fieldcommgroup.org', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'HART vs Foundation Fieldbus / Profibus PA', thisInstrument: 'Hybrid 4–20 mA + 1200 bps digital; zero new wiring; slow digital rate', peerName: 'Foundation Fieldbus / Profibus PA', peerValue: 'Pure 31.25 kbps all-digital multi-drop bus powering 8–16 devices per segment with PID-in-field', engineeringTakeaway: 'HART dominates 90% of process loops for rugged simplicity; FF/Profibus shines in digital bus architectures.' }],
    interviewQuestions: [
      { difficulty: 'Beginner', question: 'Why doesn’t the 1200 Hz / 2200 Hz HART signal corrupt the 4–20 mA analog signal going into a PID controller?', answer: 'HART uses symmetrical ±0.5 mA sinusoidal FSK modulation whose average integral over every cycle is strictly ZERO. Therefore the analog DC current receiver sees the exact unaltered 4–20 mA average!' },
      { difficulty: 'Industry-Oriented', question: 'You connect a HART communicator across a brand-new transmitter sitting on a lab bench connected straight to a 24 VDC power supply, and it displays "No Device Found". Why?', answer: 'A 24 VDC bench power supply has huge internal output capacitance acting as a dead short to the 1200/2200 Hz AC HART FSK signal! You MUST place at least a 250 Ω resistor in series between the power supply and transmitter so the ±0.5 mA FSK develops readable AC voltage across the terminals.' },
    ],
    numericalProblems: [{ title: 'HART FSK Peak-to-Peak Voltage Across Loop Resistor', statement: 'A HART transmitter modulates ±0.5 mA peak FSK across a 250 Ω load resistor. What peak-to-peak AC FSK voltage appears across the resistor?', given: ['I_peak = ±0.5 mA → I_pp = 1.0 mA', 'R = 250 Ω'], steps: ['V_peak = 0.0005 A × 250 Ω = 0.125 V = 125 mV', 'V_pp = 2 × 125 mV = 250 mVpp'], answer: '250 mVpp (±125 mV peak)' }],
    quickRevisionNotes: ['Bell 202 FSK: 1200 Hz = Logic 1, 2200 Hz = Logic 0, ±0.5 mA zero-average!', 'Requires ≥250 Ω series resistance in loop (PSU output caps short FSK otherwise!).', 'Polling Address = 0 for live 4–20 mA; Address 1–63 locks loop at 4.00 mA (Multidrop)!'],
    sources: [{ label: 'IEC 61158 / FieldComm Group', standardOrDoc: 'HART 7 Communication Protocol Specification' }],
  }),
  createTopic({
    slug: 'process-loop-calibrator',
    category: 'signal-conditioning',
    categoryLabel: 'Signal Conditioning',
    title: 'Multifunction 4–20 mA & HART Process Loop Calibrator',
    shortTitle: 'Process Loop Calibrator',
    subtitle: 'Handheld precision 24 VDC loop-powered mA source, sink simulator, RTD/TC injector, and HART communicator.',
    standardRef: 'IEC 61010 CAT III · ±0.01% mA + 250 Ω HART',
    schematicKind: 'loop-4-20ma',
    definition: 'A Multifunction Process Loop Calibrator is the essential field commissioning handheld capable of precision-sourcing 0–24 mA (with optional 24 VDC internal loop power and switchable 250 Ω HART resistor), simulating a 2-wire transmitter (Sink mode), measuring live loop current non-intrusively via test diodes, and reading/sourcing RTD/TC/pressure signals.',
    purpose: 'Enables an instrumentation engineer to test PLC/DCS analog I/O cards independently from field transmitters, stroke control valves across 0–100%, and document 5-point as-found/as-left field loops.',
    workingPrinciple: 'Internal precision DAC + operational current regulator either forces exact current out into a passive PLC AI card (Source mode), regulates externally powered loop current like a real 2-wire transmitter (Simulate/Sink mode), or acts as a low-burden microammeter (Measure mode) with an internal 24 VDC supply powering isolated transmitters on the bench.',
    principleSteps: [
      'SOURCE mode: calibrator supplies 24 VDC/current directly into a passive DCS/PLC AI terminal or I/P valve.',
      'SIMULATE (SINK) mode: calibrator acts like a 2-wire transmitter drawing 4–20 mA from an already-powered DCS loop.',
      'MEASURE (+24 V LOOP POWER): powers an unhooked field transmitter and reads its 4–20 mA output simultaneously.',
      'Switch in internal 250 Ω resistor when testing standalone transmitters with a HART modem.',
    ],
    constructionSummary: 'Impact-protected field handheld housing dual-row backlit LCD, rotary/step keys (25% / 0% / 100% span keys), internal 24 V boost converter, 250 Ω HART switch, and 4 mm shrouded banana jacks.',
    assemblyArchitecture: 'Top RTD/mA/V measurement terminal block isolated galvanically from the lower sourcing/HART loop channel.',
    internalComponents: [
      { partCode: '01', name: 'Precision 4–20 mA Source/Sink DAC Stage', material: '24-bit DAC + Low-Drift Current Sense Shunt', function: 'Holds ±0.01% reading accuracy (~1–2 µA resolution)', failureMode: 'Blown 44 mA/100 mA fast fuse from probing AC mains voltage' },
      { partCode: '02', name: 'Switchable 24 V Loop Boost & 250 Ω HART Resistor', material: 'Isolated DC-DC + 0.1% 250 Ω Resistor', function: 'Powers single transmitter + establishes HART FSK loop drop', failureMode: 'Forgetting internal 250 Ω ON adds extra drop in high-R loops' },
    ],
    typesAndClassification: [
      { type: 'Basic mA Loop Calibrator', summary: 'Dedicated Source / Simulate / Measure 4–20 mA + 24 V loop power.', typicalRange: '0–24 mA (±0.015% reading)', accuracy: '±1–2 µA', bestFor: 'Daily valve stroking, PLC AI checkout' },
      { type: 'Documenting Multifunction HART Calibrator', summary: 'Simultaneous Sensor Source (RTD/TC/Pressure) + mA Measure + As-Found/As-Left HART Trim.', typicalRange: 'mA, V, Ω, RTD, TC, Hz + Pressure Modules', accuracy: '±0.01% reading', bestFor: 'Pharmaceutical/SIL Paperless Calibration Records' },
    ],
    equations: [
      {
        title: 'Linear 4–20 mA Percentage Conversion & Loop Check',
        latex: 'I_{\\text{mA}} = 4 + 16\\left(\\frac{\\text{PV} - \\text{LRV}}{\\text{URV} - \\text{LRV}}\\right), \\quad \\%\\,\\text{Span} = \\frac{I - 4}{16}\\times 100\\%',
        variables: [
          { symbol: 'I_{\\text{mA}}', meaning: 'Loop current at 5-point steps (4, 8, 12, 16, 20 mA)', unit: 'mA' },
          { symbol: '\\text{URV} - \\text{LRV}', meaning: 'Calibrated transmitter span', unit: 'EU' },
        ],
        derivationSteps: ['Always verify 0% (4.000 mA), 25% (8.000 mA), 50% (12.000 mA), 75% (16.000 mA), and 100% (20.000 mA) ascending and descending to check hysteresis!'],
      },
    ],
    characteristicCurve: {
      title: 'Standard 5-Point Step Calibration Ramp (0–100% Span)',
      subtitle: 'Step-auto-ramp automates hands-free DCS HMI verification while walking control rooms',
      xLabel: 'Span Command',
      yLabel: 'Current Output',
      xUnit: '% Span',
      yUnit: 'mA',
      series: [{ name: 'Loop Calibrator Source', color: '#7FB3DE', points: [{ x: 0, y: 4 }, { x: 25, y: 8 }, { x: 50, y: 12 }, { x: 75, y: 16 }, { x: 100, y: 20 }] }],
    },
    specifications: [
      { parameter: 'Current Accuracy & Compliance', value: '±0.01% + 2 µA · Drives up to 1000 Ω @ 20 mA', standardOrNote: 'Internal 24 VDC loop supply (~28 mA cap)' },
      { parameter: 'Safety Rating', value: 'IEC 61010 CAT III 300 V / Intrinsically Safe (Ex ia) models', standardOrNote: 'Keep spare 50 mA fast-acting fuses!' },
    ],
    measurementRange: { typicalSpan: '0.000 to 24.000 mA; −10 to +100 mV; Pt100/TC Types', extremeLimits: 'Max external compliance 30 VDC', overrangeProtection: 'Current-limited 24 mA ceiling & internal fast fuse' },
    accuracyAndSensitivity: { accuracyClass: '±0.01% reading (≈ ±2 µA)', sensitivity: '0.001 mA (1 µA) display resolution', repeatability: '±0.005%', responseTime: '<50 ms step jump' },
    advantages: ['Solves "Is the fault in the field transmitter or the DCS card?" in 10 seconds using Simulate mode!', 'Built-in 250 Ω resistor eliminates carrying loose bench resistors during HART checks.'],
    limitations: ['Sourcing mode into an already powered 24 V DCS AI card without switching to SIMULATE causes rail conflict or blown fuse!'],
    applications: [{ industry: 'Commissioning & Turnaround Maintenance (All Plants)', service: 'Cold loop checks, valve positioner auto-stroke, HART trim', loopTagExample: 'Loop-Test-FAT/SAT', engineeringNote: 'Verify whether the PLC AI terminal is PASSIVE (needs SOURCE) or ACTIVE 24V (needs SIMULATE/SINK) before hooking leads!' }],
    calibration: { referenceStandard: 'Annual ISO 17025 Standard DMM + Precision Resistor', equipmentRequired: ['8.5-digit metrology DMM', '100 Ω / 250 Ω standard shunt'], procedureSteps: ['Compare sourced & measured mA across 4, 12, 20 mA against NIST-traceable 8.5-digit DMM.', 'Verify internal 24 V voltage under 20 mA load and mV thermocouple CJC offset.'], acceptanceCriteria: 'Within ±0.015% reading.' },
    installation: { mechanicalRules: ['Attach magnetic hanger strap safely outside live switchgear panels.'], electricalOrImpulseRules: ['Know your mode: Passive Input ⇒ SOURCE; Externally Powered Loop ⇒ SIMULATE (Sink); Live Transmitter ⇒ MEASURE (+24V if isolated)!'], commonMistakes: ['Putting calibrator in Voltage Measure across a live 240 VAC relay contact while plugged into the 30 V mA jack—blows the internal mA fuse immediately!', 'Using SOURCE mode onto an ACTIVE DCS AI card instead of SIMULATE!'] },
    troubleshooting: [{ symptom: 'Calibrator reads 0.000 mA continuously even though transmitter is alive and DCS reads 12 mA', probableCause: 'Blown internal mA protection fuse inside calibrator OR plugged into wrong jack', diagnosticCheck: 'Touch leads in continuity/resistance or check fuse compartment inside battery door', correctiveAction: 'Replace fast-acting ceramic mA fuse (exact rated A/V spec only!)' }],
    manufacturers: [{ vendor: 'Fluke / Beamex / Druck (Baker Hughes)', modelSeries: 'Fluke 754 / 789 ProcessMeter / Beamex MC6', notes: 'Documenting & HART loop calibrators.', sourceLabel: 'Fluke 754 / Beamex MC6', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'Source vs Simulate (Sink) Mode', thisInstrument: 'Source pushes current into passive loads; Simulate sinks current from powered 24 V AI cards', peerName: 'Basic Bench Multimeter', peerValue: 'Can only passively measure—cannot power transmitters or stroke valves', engineeringTakeaway: 'A multifunction loop calibrator cuts loop troubleshooting time by 80%.' }],
    interviewQuestions: [{ difficulty: 'Industry-Oriented', question: 'On a live plant PLC cabinet, when do you select SOURCE vs SIMULATE (Sink) on your 4–20 mA loop calibrator?', answer: 'Use SOURCE when the PLC analog input card is passive (unpowered, 250 Ω to ground) or when driving a valve I/P directly—the calibrator supplies the current and voltage. Use SIMULATE (Sink) when the DCS card itself supplies 24 VDC loop power on the terminals, so the calibrator acts just like a 2-wire transmitter regulating the return current.' }],
    numericalProblems: [{ title: 'Five-Point Loop Verification Currents', statement: 'You are calibrating a pressure transmitter ranged −100 mbar (LRV) to +300 mbar (URV). Calculate the exact target mA at +100 mbar and +200 mbar.', given: ['LRV = −100 mbar', 'URV = +300 mbar', 'Span = 400 mbar'], steps: ['At +100 mbar: % Span = (100 − (−100)) / 400 = 200 / 400 = 50% ⇒ I = 4 + 16 × 0.50 = 12.000 mA', 'At +200 mbar: % Span = (200 − (−100)) / 400 = 300 / 400 = 75% ⇒ I = 4 + 16 × 0.75 = 16.000 mA'], answer: '12.000 mA (50%) and 16.000 mA (75%).' }],
    quickRevisionNotes: ['SOURCE for passive AI / valves; SIMULATE (Sink) for 24 V powered DCS AI cards!', 'Never measure >30 V or 240 VAC on the mA jacks or you will pop the fast ceramic fuse.', 'Built-in 250 Ω switch enables bench HART communication without extra resistors.'],
    sources: [{ label: 'Fluke 754 / Beamex MC6 Guide', standardOrDoc: 'Field Loop & HART Calibration Procedures' }],
  }),
];

