import type { InstrumentTopic } from '@/types/engineering';
import { createTopic } from './categories';

export const TEMPERATURE_TOPICS: InstrumentTopic[] = [
  // 1. RTD (FLAGSHIP 3D)
  createTopic({
    slug: 'rtd',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Resistance Temperature Detector (RTD)',
    shortTitle: 'RTD (Pt100)',
    subtitle: 'High-accuracy metallic resistance thermometry governed by IEC 60751 with 2-, 3-, and 4-wire Kelvin bridge compensation.',
    standardRef: 'IEC 60751:2022 · ASTM E1137',
    has3DModel: true,
    modelId: 'rtd-pt100',
    schematicKind: 'rtd-3wire',
    definition:
      'A Resistance Temperature Detector (RTD) is a passive, contact-based temperature sensor whose electrical resistance increases predictably and repeatably with rising temperature due to increased electron-phonon scattering inside a high-purity metallic conductor—most commonly 99.999% platinum (Pt100, R₀ = 100.00 Ω at 0 °C).',
    purpose:
      'Provides the primary industrial standard for precision process temperature measurement between −200 °C and +600 °C (extended to +850 °C in wire-wound ceramic housings) in custody transfer, reactor control, distillation trays, and calibration reference standards.',
    workingPrinciple:
      'In pure metals, free-electron mean free path decreases nearly linearly with lattice thermal vibration energy (Matthiessen’s rule). Exposing a precision platinum element to process heat shifts its resistance R(t) along the IEC 60751 Callendar-Van Dusen polynomial. Passing a small excitation current (typically 0.1–1.0 mA to prevent I²R self-heating) converts ΔR into a measurable bridge or ratiometric voltage.',
    principleSteps: [
      'Process fluid transfers convective/conductive heat through the thermowell wall and AISI 316L sheath into the MgO-insulated sensing capsule.',
      'Platinum crystal lattice vibration intensifies with temperature, raising resistivity ρ(T) with temperature coefficient α ≈ 0.00385 Ω/(Ω·°C).',
      'An external constant-current source or Wheatstone bridge excites the element using 3-wire or 4-wire leads to cancel field cable resistance.',
      'A temperature transmitter digitizes the voltage drop, applies Callendar-Van Dusen linearization, and outputs a 4–20 mA / HART signal.',
    ],
    constructionSummary:
      'Industrial RTDs enclose a delicate platinum sensing element inside a seamless AISI 316L or Inconel 600 protective sheath packed with compacted magnesium oxide (MgO) or sintered multi-bore alumina (Al₂O₃) ceramic tubes, terminating inside an IP67 DIN Form B cast aluminum head via a spring-loaded ceramic terminal block.',
    assemblyArchitecture:
      'Spring-loaded assembly forces the sensing tip hard against the bottom bore of a drilled bar-stock thermowell, eliminating insulating air gaps while absorbing differential thermal expansion.',
    internalComponents: [
      { partCode: '01', name: 'Pt100 Sensing Element', material: '99.999% Platinum on Al₂O₃ + Borosilicate Glaze', function: 'Generates deterministic ΔR/ΔT ≈ 0.385 Ω/°C', failureMode: 'Mechanical strain or metallic migration drifting R₀ and α' },
      { partCode: '02', name: 'Alumina Multi-Bore Insulator / MgO', material: 'Sintered 99.7% Al₂O₃ / Compacted MgO Powder', function: 'Maintains >100 MΩ dielectric isolation between wires and sheath', failureMode: 'Moisture absorption causing parallel shunt resistance error' },
      { partCode: '03', name: 'Internal Connecting Leads', material: 'Silver/Nickel-clad Copper in PTFE or Fiberglass', function: 'Connects element to terminal head in 2/3/4-wire layout', failureMode: 'Open circuit from vibration fatigue at transition weld' },
      { partCode: '04', name: 'Protective Sheath & 1/2" NPT Fitting', material: 'Seamless AISI 316L Stainless Steel', function: 'Mechanical/chemical shield and pressure thread retention', failureMode: 'Corrosion pitting or fatigue fracture in high flow' },
      { partCode: '05', name: 'DIN Form B Head & Terminal Block', material: 'Epoxy-coated Aluminum + Steatite Ceramic Block', function: 'Environmental enclosure (IP67) and field wire termination', failureMode: 'Damaged lid gasket letting rain/condensate pool at terminals' },
    ],
    typesAndClassification: [
      { type: 'Thin-Film Pt100', summary: 'Sputtered platinum meander on ceramic chip laser-trimmed to 100.00 Ω.', typicalRange: '−50 to +500 °C', accuracy: 'Class A / AA (±0.10–0.15 °C at 0 °C)', bestFor: 'Vibration-resistant industrial loops & fast response' },
      { type: 'Wire-Wound Ceramic', summary: 'Fine strain-free Pt helix coiled inside multi-bore alumina tube.', typicalRange: '−200 to +850 °C', accuracy: 'Class AA / 1/10 DIN', bestFor: 'Cryogenics, wide spans, low hysteresis laboratory standards' },
      { type: 'Pt1000 (R₀ = 1000 Ω)', summary: '10× higher base resistance reduces relative lead-wire error.', typicalRange: '−50 to +400 °C', accuracy: 'Class A / B', bestFor: '2-wire HVAC, battery-powered IoT nodes' },
      { type: 'Copper (Cu50 / Cu100) & Nickel (Ni120)', summary: 'Lower cost metals; higher α (Ni = 0.00672) but restricted upper temp.', typicalRange: '−50 to +180 °C (Cu) / +260 °C (Ni)', accuracy: '±0.5 °C', bestFor: 'Motor stator winding embedment' },
    ],
    equations: [
      {
        title: 'Callendar-Van Dusen Equation (IEC 60751, t ≥ 0 °C)',
        latex: 'R(t) = R_0 \\left(1 + A t + B t^2\\right)',
        variables: [
          { symbol: 'R_0', meaning: 'Nominal resistance at 0 °C (100.00 Ω for Pt100)', unit: 'Ω' },
          { symbol: 'A', meaning: '3.9083 × 10⁻³ °C⁻¹ (IEC 60751 platinum constant)', unit: '°C⁻¹' },
          { symbol: 'B', meaning: '−5.775 × 10⁻⁷ °C⁻² (IEC 60751 curvature term)', unit: '°C⁻²' },
          { symbol: 't', meaning: 'Process temperature in degrees Celsius', unit: '°C' },
        ],
        derivationSteps: [
          'Below 0 °C (−200 °C ≤ t < 0 °C), an extra fourth-order correction applies: R(t) = R₀[1 + At + Bt² + C(t − 100)t³], where C = −4.183 × 10⁻¹² °C⁻⁴.',
          'The standardized mean temperature coefficient α = (R₁₀₀ − R₀)/(100·R₀) = 0.00385055 °C⁻¹.',
          'Inverting the quadratic for t ≥ 0 °C gives t = [−A + √(A² − 4B(1 − R/R₀))] / (2B).',
        ],
      },
      {
        title: 'Self-Heating Temperature Error',
        latex: '\\Delta T_{\\text{self}} = \\frac{I_{\\text{exc}}^2 \\cdot R(T)}{\\delta}',
        variables: [
          { symbol: 'I_{\\text{exc}}', meaning: 'Excitation current through sensing element', unit: 'A' },
          { symbol: '\\delta', meaning: 'Self-heating dissipation constant (typical 15–50 mW/°C in flowing liquid)', unit: 'mW/°C' },
        ],
        derivationSteps: [
          'Electrical power dissipated in the element is P = I²R.',
          'At steady state, P equals convective heat loss δ · ΔT_self to the surrounding medium.',
          'Keeping I_exc ≤ 0.5–1.0 mA holds ΔT_self well below 0.02 °C in liquid service.',
        ],
      },
    ],
    characteristicCurve: {
      title: 'IEC 60751 Platinum Resistance vs Temperature Curve',
      subtitle: 'Exact Callendar-Van Dusen curve comparing Pt100 against linear α=0.00385 tangent (showing slight downward concavity at high temperature)',
      xLabel: 'Temperature',
      yLabel: 'Resistance',
      xUnit: '°C',
      yUnit: 'Ω',
      series: [
        {
          name: 'Pt100 (IEC 60751)',
          color: '#c5f467',
          points: [
            { x: -200, y: 18.52 },
            { x: -100, y: 60.26 },
            { x: 0, y: 100.0 },
            { x: 100, y: 138.51 },
            { x: 200, y: 175.86 },
            { x: 300, y: 212.05 },
            { x: 400, y: 247.09 },
            { x: 500, y: 280.98 },
            { x: 600, y: 313.71 },
          ],
        },
        {
          name: 'Ideal Linear Tangent (0.385 Ω/°C)',
          color: '#cdbdff',
          points: [
            { x: -200, y: 23.0 },
            { x: -100, y: 61.5 },
            { x: 0, y: 100.0 },
            { x: 100, y: 138.5 },
            { x: 200, y: 177.0 },
            { x: 300, y: 215.5 },
            { x: 400, y: 254.0 },
            { x: 500, y: 292.5 },
            { x: 600, y: 331.0 },
          ],
        },
      ],
    },
    specifications: [
      { parameter: 'Base Resistance R₀ (0 °C)', value: '100.00 Ω (Pt100) / 1000.0 Ω (Pt1000)', standardOrNote: 'IEC 60751 Table 1' },
      { parameter: 'Alpha Coefficient (α)', value: '0.003850 Ω/Ω/°C (DIN/IEC European curve)', standardOrNote: 'US legacy SAMA α=0.003923' },
      { parameter: 'Tolerance Class A (Thin-Film)', value: '±(0.15 + 0.002|t|) °C', standardOrNote: '−30 to +300 °C typical' },
      { parameter: 'Tolerance Class AA (1/3 DIN)', value: '±(0.10 + 0.0017|t|) °C', standardOrNote: '0 to +150 °C typical' },
      { parameter: 'Insulation Resistance', value: '≥ 100 MΩ at 500 VDC (20 °C)', standardOrNote: 'Element leads to metal sheath' },
      { parameter: 'Excitation Current', value: '0.1 mA – 1.0 mA DC', standardOrNote: 'Avoid >2 mA in still air' },
    ],
    measurementRange: {
      typicalSpan: '−50 °C to +450 °C (Industrial 316L spring-loaded mineral insulated)',
      extremeLimits: '−200 °C to +850 °C (Specialized wire-wound ceramic elements)',
      overrangeProtection: 'Exceeding 650 °C permanently accelerates platinum grain growth & zero drift in thin-film elements',
    },
    accuracyAndSensitivity: {
      accuracyClass: 'Class AA (±0.1 °C), Class A (±0.15 °C), Class B (±0.30 °C) at 0 °C',
      sensitivity: '0.385 Ω/°C mean (Pt100); 3.85 Ω/°C (Pt1000)',
      repeatability: '±0.05 °C over thermal cycling within rated envelope',
      responseTime: 'τ₆₃% ≈ 2.5–6 s bare 6 mm sheath in flowing water; 15–45 s inside heavy bar-stock thermowell',
    },
    advantages: [
      'Highest long-term stability (<0.05 °C/year drift) and superior accuracy among industrial temperature sensors.',
      'Near-linear resistance-temperature curve simplifying linearization.',
      'Uses standard copper extension cable (3-wire or 4-wire), avoiding costly alloy compensating cables.',
      'Does not require cold-junction compensation (CJC).',
    ],
    limitations: [
      'Lower upper temperature ceiling (~600–850 °C) compared to Type K/S thermocouples.',
      'Slower thermal response and larger fragile element geometry (cannot be a bare micro-bead).',
      'Susceptible to mechanical shock/vibration fatigue unless mineral-insulated.',
      'Requires external excitation current (risk of self-heating in still gas).',
    ],
    applications: [
      { industry: 'Refining & Petrochemicals', service: 'Distillation column tray temperature & custody transfer metering compensation', loopTagExample: 'TT-104A / TE-104A', engineeringNote: '4-wire Class A Pt100 paired with head-mounted HART transmitter for API density correction.' },
      { industry: 'Pharmaceutical & Bioreactors', service: 'SIP/CIP sterilization & fermenter jacket control', loopTagExample: 'TIC-302', engineeringNote: 'Sanitary Tri-Clamp electropolished 316L sheath with Class AA tolerance.' },
      { industry: 'Power Generation', service: 'Turbine bearing metal temperature & stator winding RTDs', loopTagExample: 'TE-411', engineeringNote: 'Dual-element 3-wire Pt100 embedded in Babbitt bearing shoes for redundancy.' },
    ],
    calibration: {
      referenceStandard: 'ITS-90 Fixed Points / Standard Platinum Resistance Thermometer (SPRT) per ASTM E1137 & IEC 60751',
      equipmentRequired: ['Dry-well block or stirred oil/fluid calibration bath', 'Reference SPRT / Calibrated Class AA probe', 'Precision 4-wire digital ohmmeter or documenting HART calibrator'],
      procedureSteps: [
        'Verify ambient insulation resistance between shorted leads and sheath (>100 MΩ at 100–500 VDC).',
        'Immerse both reference SPRT and unit under test (UUT) to matching depth (≥15× sheath diameter + element length) in dry-well/bath.',
        'Stabilize at 0%, 25%, 50%, 75%, and 100% of operating span (wait ≥10 min per step until dR/dt < 0.002 Ω/min).',
        'Record 4-wire resistance, convert via IEC 60751 equation, and log As-Found / As-Left error against Class A/B band.',
      ],
      acceptanceCriteria: 'Measured deviation within manufacturer/IEC Class tolerance and TUR ≥ 4:1.',
    },
    installation: {
      mechanicalRules: [
        'Immerse probe ≥ 10–15 × sheath OD into flowing stream to minimize axial stem conduction error.',
        'Install thermowell pointing slightly downward or horizontally; orient terminal head cable entry downward with drip loop.',
      ],
      electricalOrImpulseRules: [
        'Use 3-wire (matched conductor gauges/lengths) or 4-wire Kelvin topology; bond cable shield at one end only (marshalling cabinet ground).',
        'Route RTD low-level leads in separate instrumentation tray away from high-voltage VFD/motor cables.',
      ],
      commonMistakes: [
        'Wiring a 3-wire RTD with mismatched wire gauges between the two common legs, breaking bridge lead cancellation.',
        'Forgetting thermal paste or bottoming out the spring-loaded probe inside a slightly too-long thermowell.',
      ],
    },
    troubleshooting: [
      { symptom: 'DCS displays upscale burnout (+999 °C)', probableCause: 'Broken internal platinum wire or loose screw terminal on sensing loop', diagnosticCheck: 'Disconnect leads at terminal block and check loop continuity; open circuit (>10 MΩ) confirms break', correctiveAction: 'Tighten terminal lugs or replace RTD insert' },
      { symptom: 'Constant positive offset (+1.5 to +4 °C)', probableCause: '2-wire wiring without lead compensation, or corroded terminal contact adding resistance', diagnosticCheck: 'Measure lead loop resistance across same-color wires (R_lead); every 0.385 Ω adds ~1 °C', correctiveAction: 'Convert to 3-wire/4-wire and clean oxidized brass terminal screws' },
      { symptom: 'Erratic negative spikes during rain/washdown', probableCause: 'Moisture inside DIN head shunting parallel path across terminals', diagnosticCheck: 'Open head, inspect gasket, perform 100 VDC Megger insulation test to ground (<10 MΩ indicates wet MgO)', correctiveAction: 'Dry assembly, replace O-ring, seal cable gland downward' },
    ],
    manufacturers: [
      { vendor: 'Emerson (Rosemount)', modelSeries: 'Rosemount 0068 / 214C RTD Series', notes: 'Thin-film & wire-wound IEC 60751 sensors paired with 644/3144P transmitters.', sourceLabel: 'Emerson Rosemount Temperature Sensors', sourceUrl: 'https://www.emerson.com/en-us/automation/measurement-instrumentation/temperature-measurement', verificationStatus: 'sourced-reference' },
      { vendor: 'Endress+Hauser', modelSeries: 'iTHERM ModuLine TM101 / TM131', notes: 'Modular QuickNeck thermowell RTDs with StrongSens vibration-resistant elements.', sourceLabel: 'Endress+Hauser iTHERM Portfolio', sourceUrl: 'https://www.endress.com/en/field-instruments-overview/temperature-measurement', verificationStatus: 'sourced-reference' },
      { vendor: 'WIKA', modelSeries: 'TR10-B / TR10-C Industrial RTD', notes: 'DIN Form B head-mounted resistance thermometers with fabricated or bar-stock thermowells.', sourceLabel: 'WIKA Resistance Thermometers', sourceUrl: 'https://www.wika.com/en-en/products_temperature_electrical_temperature_measurement_resistance_thermometers.WIKA', verificationStatus: 'sourced-reference' },
    ],
    comparisons: [
      { parameter: 'Temperature Range', thisInstrument: '−200 to +600 °C (+850 °C max)', peerName: 'Type-K Thermocouple', peerValue: '−200 to +1260 °C', engineeringTakeaway: 'Use RTD below 500 °C for precision; use Thermocouple in furnaces/exhausts >600 °C.' },
      { parameter: 'Accuracy & Stability', thisInstrument: '±0.15 °C (Class A), <0.05 °C/yr drift', peerName: 'Type-K Thermocouple', peerValue: '±1.5 °C or 0.4%, drifts faster above 800 °C', engineeringTakeaway: 'RTDs are roughly 10× more accurate and stable over plant life.' },
      { parameter: 'Response Speed & Cost', thisInstrument: 'Slower (bigger element), higher sensor cost', peerName: 'Type-K Thermocouple', peerValue: 'Very fast (tiny bare/grounded junction), low cost', engineeringTakeaway: 'Thermocouples win for transient shock or tight-space surface probes.' },
    ],
    interviewQuestions: [
      { difficulty: 'Beginner', question: 'Why is 3-wire RTD configuration preferred over 2-wire in industrial plants?', answer: 'In a 2-wire RTD, both lead wires sit directly in series with R_RTD inside one bridge arm, adding R_L1 + R_L2 error (+1 °C per 0.385 Ω). In a 3-wire bridge, L1 and L2 are placed in adjacent ratio arms so equal lead resistances cancel out, while L3 carries only high-impedance detector sense current.' },
      { difficulty: 'Intermediate', question: 'You measure 138.51 Ω across a red-white pair of a 3-wire Pt100, and 1.20 Ω across the two red common leads. What is the true process temperature?', answer: 'In a 3-wire RTD, the two same-color (red) leads are shorted at the sensor element, so measuring across Red-to-Red yields the two-wire loop lead resistance 2 × R_L = 1.20 Ω (R_L = 0.60 Ω per conductor). The raw Red-to-White reading includes R_RTD + 2 × R_L = 138.51 Ω. Subtracting the 1.20 Ω lead loop resistance leaves R_element = 138.51 − 1.20 = 137.31 Ω, which corresponds to approximately 96.9 °C on the IEC 60751 curve.' },
      { difficulty: 'Industry-Oriented', question: 'Why should an RTD transmitter never use 2 mA+ excitation in a gas pipeline?', answer: 'Gases have low convective heat transfer coefficients (small dissipation constant δ). Higher excitation current raises I²R dissipation, causing self-heating error ΔT = I²R/δ and reading artificially high gas temperature.' },
    ],
    numericalProblems: [
      {
        title: 'Callendar-Van Dusen Resistance & Lead Error Calculation',
        statement: 'Calculate the IEC 60751 resistance of a Pt100 at 200 °C. If connected in 2-wire mode using 100 m of copper cable (0.04 Ω/m loop total = 4.0 Ω), determine the temperature error caused by the cable.',
        given: ['R₀ = 100.00 Ω', 't = 200 °C', 'A = 3.9083 × 10⁻³ °C⁻¹', 'B = −5.775 × 10⁻⁷ °C⁻²', 'R_cable_loop = 4.0 Ω'],
        steps: [
          'R(200) = 100 × [1 + (3.9083×10⁻³)(200) + (−5.775×10⁻⁷)(200²)]',
          'R(200) = 100 × [1 + 0.78166 − 0.02310] = 175.856 Ω',
          'In 2-wire mode, apparent resistance seen = 175.856 + 4.000 = 179.856 Ω',
          'Approximate local sensitivity around 200 °C: dR/dt = R₀(A + 2Bt) = 100(0.0039083 − 2×5.775×10⁻⁷×200) = 0.3677 Ω/°C',
          'Apparent error Δt ≈ 4.0 / 0.3677 ≈ +10.88 °C (exact inverse gives 210.95 °C, error = +10.95 °C)',
        ],
        answer: 'R(200 °C) = 175.86 Ω; 2-wire cable induces +10.95 °C error.',
      },
    ],
    quickRevisionNotes: [
      'Pt100 R₀ = 100.00 Ω at 0 °C; α = 0.00385 Ω/Ω/°C (≈ 0.385 Ω/°C sensitivity).',
      'Always wire 3-wire (matched legs) or 4-wire (zero lead error regardless of mismatch).',
      'Spring-loading against thermowell bottom avoids slow air-gap lag.',
      'Check insulation resistance (>100 MΩ) before replacing a transmitter when temperature drifts negatively.',
    ],
    sources: [
      { label: 'IEC 60751:2022', standardOrDoc: 'Industrial platinum resistance thermometers and platinum temperature sensors' },
      { label: 'Emerson Rosemount', standardOrDoc: 'Engineer’s Guide to Industrial Temperature Measurement', url: 'https://www.emerson.com/en-us/automation/measurement-instrumentation/temperature-measurement' },
    ],
  }),

  // 2. THERMOCOUPLE (FLAGSHIP 3D)
  createTopic({
    slug: 'thermocouple',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Thermocouple (Seebeck Thermometry)',
    shortTitle: 'Thermocouple',
    subtitle: 'Self-powered dissimilar-alloy thermoelectric sensors for extreme temperatures up to 1700 °C with cold-junction compensation.',
    standardRef: 'IEC 60584-1 · ASTM E230 / ITS-90',
    has3DModel: true,
    modelId: 'thermocouple-k',
    schematicKind: 'thermocouple-cjc',
    definition:
      'A thermocouple is an active temperature transducer formed by joining two dissimilar electrical conductors (thermoelements) at a measuring ("hot") junction. A temperature gradient between the measuring junction (T_m) and reference ("cold") junction (T_cj) generates a microvolt-to-millivolt EMF via the Seebeck effect.',
    purpose:
      'Measures extreme high temperatures in furnaces, reformers, gas turbines, boilers, and fast transient heat transfer where fragile RTDs melt or respond too slowly.',
    workingPrinciple:
      'Electron diffusion density varies with temperature differently in two dissimilar metals. Along any wire segment experiencing a thermal gradient dT/dx, an internal Seebeck voltage dV = S(T) dT develops. The closed loop measures the net integral V_net = ∫[T_cj to T_m] (S_A(T) − S_B(T)) dT. Knowing T_cj via an onboard RTD/thermistor at the receiver terminals allows computing absolute T_m (Cold Junction Compensation).',
    principleSteps: [
      'Process heat warms the welded measuring junction T_m inside an Inconel 600 or ceramic sheath.',
      'Thermal gradient along Chromel (+) and Alumel (−) conductors generates distributed thermoelectric EMF (voltage originates along the gradient zone, not merely at the weld bead!).',
      'Matching compensating extension cable extends the thermoelectric circuit safely to the transmitter/marshalling terminal block at temperature T_cj.',
      'An onboard CJC sensor measures T_cj, adds E(T_cj) to the measured mV signal, and looks up T_m on the NIST ITS-90 polynomial.',
    ],
    constructionSummary:
      'Industrial mineral-insulated thermocouples pack solid Chromel/Alumel (Type K) or Platinum/Rhodium (Type S) wires inside compressed MgO insulation or twin-bore ceramic beads within an Inconel 600, 310SS, or alumina protection tube, terminated in a polarized compensating terminal head.',
    assemblyArchitecture:
      'Junctions are built in three styles: Exposed (fastest ms response, non-corrosive gas), Grounded (welded to sheath tip, fast response, risk of ground loops), and Ungrounded (isolated from sheath by MgO, prevents ground-loop noise).',
    internalComponents: [
      { partCode: '01', name: 'Hot Measuring Junction', material: 'TIG-welded Chromel-Alumel (Type K)', function: 'Joins dissimilar thermoelements at T_m', failureMode: 'Open weld or green-rot chromium depletion in reducing atmosphere' },
      { partCode: '02', name: 'Dissimilar Thermoelements', material: 'KP (+ Ni-10%Cr) & KN (− Ni-Al-Mn-Si)', function: 'Generates differential Seebeck EMF along thermal gradient', failureMode: 'Inhomogeneity hysteresis after prolonged heating >900 °C' },
      { partCode: '03', name: 'MgO / Twin-Bore Ceramic Beads', material: 'Compacted MgO / Sintered Alumina', function: 'Insulates + and − conductors from each other and sheath', failureMode: 'High-temp MgO shunting creates virtual junction upstream' },
      { partCode: '04', name: 'Inconel 600 Protection Sheath', material: 'Nickel-Chromium Alloy (max ~1150 °C)', function: 'Resists oxidation and thermal cycling', failureMode: 'Sulfidation attack in sour fuel gas without ceramic well' },
      { partCode: '05', name: 'Polarized Head & KX Cable', material: 'Alloy-Matched Terminals + KX Extension Cable', function: 'Prevents secondary copper-junction errors', failureMode: 'Using copper wire between head and panel shifts CJC error!' },
    ],
    typesAndClassification: [
      { type: 'Type K (Chromel / Alumel)', summary: 'Most widespread base-metal thermocouple; linear above 0 °C (~41 µV/°C).', typicalRange: '−200 to +1260 °C', accuracy: 'Class 1: ±1.5 °C or 0.004|t|', bestFor: 'Refinery heaters, boilers, exhaust gas (oxidizing)' },
      { type: 'Type J (Iron / Constantan)', summary: 'High sensitivity (~52 µV/°C); positive leg is pure iron (rusts in moisture).', typicalRange: '−40 to +750 °C', accuracy: 'Class 1: ±1.5 °C or 0.004|t|', bestFor: 'Plastics extrusion, vacuum & inert atmospheres' },
      { type: 'Type T (Copper / Constantan)', summary: 'Excellent cryogenic stability and low inhomogeneity error.', typicalRange: '−200 to +350 °C', accuracy: 'Class 1: ±0.5 °C or 0.004|t|', bestFor: 'Cryogenics, food/pharma freezers, lab moisture' },
      { type: 'Type N (Nicrosil / Nisil)', summary: 'Resists Type-K short-range order drift & green rot at 800–1200 °C.', typicalRange: '−200 to +1300 °C', accuracy: 'Class 1: ±1.5 °C', bestFor: 'High-temperature heat treatment replacing Type K' },
      { type: 'Type S / R / B (Noble Pt–Rh)', summary: 'Platinum-rhodium alloys for extreme temperature & lab standards.', typicalRange: '0 to +1700 °C (B to 1800 °C)', accuracy: 'Class 1: ±1.0 °C', bestFor: 'Sulfur recovery Claus furnaces, glass melts' },
    ],
    equations: [
      {
        title: 'Seebeck Cold-Junction Compensation Equation',
        latex: 'E_{\\text{net}} = E(T_m, T_0) - E(T_{cj}, T_0) \\implies E(T_m, 0^\\circ\\text{C}) = E_{\\text{meas}} + E(T_{cj}, 0^\\circ\\text{C})',
        variables: [
          { symbol: 'E_{\\text{meas}}', meaning: 'Millivolt potential read across receiver terminals', unit: 'mV' },
          { symbol: 'T_{cj}', meaning: 'Reference (cold) junction temperature measured locally', unit: '°C' },
          { symbol: 'T_m', meaning: 'Measuring (hot) process temperature', unit: '°C' },
        ],
        derivationSteps: [
          'Standard NIST tables reference 0 °C (ice point).',
          'By the Law of Intermediate Temperatures, E(T_m, 0) = E(T_m, T_cj) + E(T_cj, 0).',
          'Therefore, software MUST add the reference table mV corresponding to T_cj BEFORE looking up T_m—never add T_cj directly in °C unless S is constant!',
        ],
      },
    ],
    characteristicCurve: {
      title: 'Thermocouple Seebeck EMF vs Temperature (IEC 60584 / NIST ITS-90)',
      subtitle: 'Reference junction at 0 °C comparing Types J, E, K, T, and S',
      xLabel: 'Temperature',
      yLabel: 'Thermoelectric EMF',
      xUnit: '°C',
      yUnit: 'mV',
      series: [
        {
          name: 'Type E (Chromel-Constantan)',
          color: '#cdbdff',
          points: [
            { x: 0, y: 0 }, { x: 100, y: 6.319 }, { x: 200, y: 13.421 }, { x: 400, y: 28.946 }, { x: 600, y: 45.093 }, { x: 800, y: 61.017 },
          ],
        },
        {
          name: 'Type J (Iron-Constantan)',
          color: '#ff9100',
          points: [
            { x: 0, y: 0 }, { x: 100, y: 5.269 }, { x: 200, y: 10.779 }, { x: 400, y: 21.848 }, { x: 600, y: 33.102 }, { x: 750, y: 42.281 },
          ],
        },
        {
          name: 'Type K (Chromel-Alumel)',
          color: '#c5f467',
          points: [
            { x: 0, y: 0 }, { x: 100, y: 4.096 }, { x: 200, y: 8.138 }, { x: 400, y: 16.397 }, { x: 600, y: 24.905 }, { x: 800, y: 33.275 }, { x: 1000, y: 41.276 },
          ],
        },
        {
          name: 'Type S (Pt-10%Rh / Pt)',
          color: '#22ef7e',
          points: [
            { x: 0, y: 0 }, { x: 200, y: 1.441 }, { x: 400, y: 3.259 }, { x: 600, y: 5.239 }, { x: 800, y: 7.345 }, { x: 1000, y: 9.587 },
          ],
        },
      ],
    },
    specifications: [
      { parameter: 'Type K Sensitivity (Seebeck)', value: '~41.0 µV/°C (0–1000 °C avg)', standardOrNote: 'IEC 60584-1' },
      { parameter: 'Type K IEC Color Code', value: 'Green outer (+ Green, − White); ANSI: Yellow (+ Yellow, − Red)', standardOrNote: 'IEC 60584-3 vs ANSI MC96.1' },
      { parameter: 'Tolerance Class 1 (Type K)', value: '±1.5 °C (−40 to 375 °C) or ±0.004|t| (375–1000 °C)', standardOrNote: 'Class 2: ±2.5 °C or 0.0075|t|' },
      { parameter: 'Loop Resistance Limit', value: 'Typically < 100–500 Ω for transmitter diagnostics', standardOrNote: 'Open-burnout pulse diagnostic' },
    ],
    measurementRange: {
      typicalSpan: '0 °C to +1100 °C (Type K Inconel 600 sheath)',
      extremeLimits: '−270 °C (Type E/T) up to +1800 °C (Type B Platinum-Rhodium in ceramic sheath)',
      overrangeProtection: 'Above rated limit, alloy oxidation & grain diffusion permanently shift Seebeck slope',
    },
    accuracyAndSensitivity: {
      accuracyClass: '±1.1 °C to ±2.2 °C (Standard); ±0.5–1.0 °C (Special Limits / Type T)',
      sensitivity: 'Type E (~68 µV/°C) > J (~52) > K (~41) > S (~10 µV/°C)',
      repeatability: '±0.5–2.0 °C; degrades after thermal cycling >800 °C',
      responseTime: '0.05 s (bare fine wire) to 5–20 s (grounded/ungrounded sheath)',
    },
    advantages: [
      'Self-powered passive EMF generation—no excitation current or self-heating.',
      'Extreme temperature capability up to 1700–1800 °C.',
      'Rugged, compact point-sensing tip offering millisecond response when grounded/exposed.',
    ],
    limitations: [
      'Microvolt output (~40 µV/°C) highly susceptible to EMI/RFI and ground loops.',
      'Requires cold-junction compensation (CJC) and specialized compensating extension cable.',
      'Lower absolute accuracy and long-term drift vs RTDs.',
    ],
    applications: [
      { industry: 'Refinery Fired Heaters', service: 'Tube-skin temperature & firebox flue gas monitoring', loopTagExample: 'TI-2101', engineeringNote: 'Type K welded pad tube-skin assemblies detect coking hot spots.' },
      { industry: 'Sulfur Recovery (Claus)', service: 'Reaction furnace temperature (1100–1450 °C)', loopTagExample: 'TT-510', engineeringNote: 'Dual Type B/S platinum-rhodium in recrystallized alumina well.' },
    ],
    calibration: {
      referenceStandard: 'NIST ITS-90 Monograph 175 / ASTM E220',
      equipmentRequired: ['High-temp tube furnace or dry-well calibrator', 'Reference Type S or calibrated Type N probe', 'Precision µV calibrator with ice-point/CJC reference'],
      procedureSteps: [
        'Keep the immersion profile identical to service (do not alter where the thermal gradient falls across a used probe!).',
        'Verify transmitter CJC offset against precision room thermometer at terminals.',
        'Inject known NIST mV values to test transmitter linearity, then compare sensor in furnace against reference TC.',
      ],
      acceptanceCriteria: 'Combined loop error within IEC Class 1/2 limits.',
    },
    installation: {
      mechanicalRules: [
        'Use ungrounded junctions wherever PLC/DCS inputs lack channel-to-channel galvanic isolation.',
        'Respect minimum bend radius (≥ 4× sheath OD) on mineral-insulated cables.',
      ],
      electricalOrImpulseRules: [
        'Match extension cable type strictly (KX/WX for Type K); keep negative leg red in ANSI or white in IEC—check standard!',
        'Verify polarity: swapping + and − causes reading to drop as temperature rises.',
      ],
      commonMistakes: [
        'Splicing copper wire inside a field junction box exposed to sun/heater radiation—creates a massive uncompensated error junction.',
        'Using grounded thermocouples on non-isolated multi-channel AI cards, causing ground loop drift.',
      ],
    },
    troubleshooting: [
      { symptom: 'Temperature drops when furnace heats up', probableCause: 'Reversed thermocouple polarity at head or marshalling cabinet', diagnosticCheck: 'Warm junction and check mV polarity (+Chromel non-magnetic, −Alumel slightly magnetic)', correctiveAction: 'Swap + and − leads at terminal block' },
      { symptom: 'Constant offset equal to ambient cabinet temperature delta', probableCause: 'Copper wire used instead of KX extension cable, OR faulty CJC thermistor on AI card', diagnosticCheck: 'Short transmitter input terminals with copper jumper—readout should equal terminal ambient temperature', correctiveAction: 'Replace with proper compensating wire or enable/repair CJC' },
    ],
    manufacturers: [
      { vendor: 'WIKA', modelSeries: 'TC10-B / TC40 High-Temp Thermocouples', notes: 'IEC 60584 MI cable and ceramic tube thermocouples.', sourceLabel: 'WIKA Thermocouples', sourceUrl: 'https://www.wika.com/en-en/products_temperature_electrical_temperature_measurement_thermocouples.WIKA', verificationStatus: 'sourced-reference' },
      { vendor: 'Emerson', modelSeries: 'Rosemount 214C / 644 Temperature', notes: 'Dual-sensor thermocouples with hot-backup diagnostics and drift alert.', sourceLabel: 'Emerson Temperature Sensors', sourceUrl: 'https://www.emerson.com/en-us/automation/measurement-instrumentation/temperature-measurement', verificationStatus: 'sourced-reference' },
    ],
    comparisons: [
      { parameter: 'Measurement Principle', thisInstrument: 'Seebeck Voltage (~41 µV/°C)', peerName: 'RTD Pt100', peerValue: 'Resistance (~0.385 Ω/°C)', engineeringTakeaway: 'TC needs CJC + compensating cable; RTD needs excitation + 3/4-wire.' },
      { parameter: 'Max Process Temp', thisInstrument: '1260 °C (K) / 1700 °C (S/B)', peerName: 'RTD Pt100', peerValue: '600 °C (850 °C special)', engineeringTakeaway: 'Above 600 °C, thermocouples dominate industrial process measurement.' },
    ],
    interviewQuestions: [
      { difficulty: 'Beginner', question: 'Why can’t you use plain copper wire to extend a Type-K thermocouple from the field to the control room?', answer: 'Joining Chromel/Alumel to copper inside the hot field junction box creates parasitic copper-Chromel and copper-Alumel junctions. The control room CJC measures cabinet temperature instead of the field junction box temperature, introducing an uncompensated error equal to (T_field_JB − T_cabinet).' },
      { difficulty: 'Intermediate', question: 'If a Type-K thermocouple has its measuring tip at 300 °C (12.209 mV wrt 0 °C) and terminal CJC block is at 25 °C (1.000 mV wrt 0 °C), what millivolt signal appears at the transmitter terminals?', answer: 'By the Law of Intermediate Temperatures: E_meas = E(300,0) − E(25,0) = 12.209 − 1.000 = 11.209 mV.' },
      { difficulty: 'Advanced', question: 'Where is the thermoelectric voltage actually generated in a thermocouple?', answer: 'Along the thermal gradient zone along the length of the homogeneous wires—NOT at the isothermal welded junction itself! If a welded junction sits inside a uniform-temperature oven, EMF is generated where the wires cross the oven wall gradient. That is why inhomogeneity along old wires ruins calibration when insertion depth changes.' },
    ],
    numericalProblems: [
      {
        title: 'Cold-Junction Compensation Inverse Lookup',
        statement: 'A Type-K thermocouple connected to an uncompensated millivoltmeter reads 15.397 mV while the terminal block sits at 25 °C (E(25 °C) = 1.000 mV). Given Type K sensitivity ≈ 41.0 µV/°C around 400 °C and E(400 °C) = 16.397 mV, find the true hot-junction temperature.',
        given: ['E_measured = 15.397 mV', 'T_cj = 25 °C', 'E(25 °C) = 1.000 mV', 'E(400 °C) = 16.397 mV'],
        steps: [
          'Apply CJC addition in voltage domain: E(T_m, 0 °C) = E_measured + E(T_cj, 0 °C)',
          'E(T_m, 0 °C) = 15.397 mV + 1.000 mV = 16.397 mV',
          'Lookup 16.397 mV in Type-K table -> T_m = 400.0 °C (Notice: naively assuming 15.397 mV was 375.6 °C + 25 °C gives 400.6 °C—wrong by 0.6 °C because Seebeck coefficient is nonlinear!).',
        ],
        answer: 'True temperature T_m = 400.0 °C.',
      },
    ],
    quickRevisionNotes: [
      'Law of Intermediate Metals: inserting brass/solder/copper terminals at constant temperature adds ZERO net EMF.',
      'Always add CJC in mV, NEVER in °C!',
      'Alumel (−) is slightly magnetic; Chromel (+) is non-magnetic.',
      'Ungrounded junctions eliminate ground loops on non-isolated PLC inputs.',
    ],
    sources: [
      { label: 'NIST ITS-90 Thermocouple Database', standardOrDoc: 'NIST Monograph 175 Polynomial Coefficients' },
      { label: 'IEC 60584-1', standardOrDoc: 'Thermocouples — EMF specifications and tolerances' },
    ],
  }),

  // 3. THERMISTOR
  createTopic({
    slug: 'thermistor',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Thermistor (NTC & PTC Semiconductor Resistors)',
    shortTitle: 'Thermistor',
    subtitle: 'High-sensitivity sintered metal-oxide semiconductor resistors governed by the exponential Steinhart-Hart relation.',
    standardRef: 'IEC 60539 · Steinhart-Hart Model',
    schematicKind: 'generic-transducer',
    definition: 'A Thermistor (Thermal Resistor) is a ceramic semiconductor sensor whose electrical resistance exhibits an extraordinarily large exponential change with temperature—decreasing with temperature in Negative Temperature Coefficient (NTC) oxides or spiking sharply at a Curie threshold in Positive Temperature Coefficient (PTC) barium titanate.',
    purpose: 'Provides micro-degree sensitivity over narrow spans (−40 °C to +150 °C) in HVAC, battery packs, medical probes, motor winding thermal protection (PTC), and RTD/TC cold-junction compensation.',
    workingPrinciple: 'Sintered oxides of Mn, Ni, Co, and Cu form a semiconductor bandgap; thermal energy promotes charge carriers across the gap exponentially: R(T) = R₀ exp[β(1/T − 1/T₀)], yielding −3% to −5%/°C sensitivity (10× greater than Pt100).',
    principleSteps: [
      'Ambient heat excites valence electrons into the conduction band in the sintered metal-oxide bead.',
      'Carrier density rises exponentially with absolute temperature T (Kelvin), dropping bulk resistance steeply (NTC).',
      'A voltage divider or precision bridge converts the high resistance (1 kΩ–100 kΩ) into a voltage read by an ADC.',
      'Firmware computes 1/T via the 3-coefficient Steinhart-Hart equation for ±0.05 °C accuracy.',
    ],
    constructionSummary: 'Pressed and sintered oxide discs, chips, or miniature glass-encapsulated beads (0.5–3 mm) bonded to Dumet/nickel leads and epoxy- or glass-sealed against humidity.',
    assemblyArchitecture: 'Glass-hermetic beads withstand up to +300 °C without drift; epoxy-dipped beads are limited to +125–150 °C.',
    internalComponents: [
      { partCode: '01', name: 'Sintered Metal-Oxide Bead', material: 'Mn-Ni-Co-Fe Spinel Oxide Ceramic', function: 'Produces exponential ΔR/ΔT response', failureMode: 'Microcracking under thermal shock causing resistance jump' },
      { partCode: '02', name: 'Encapsulation Shell', material: 'Borosilicate Glass or Epoxy Resin', function: 'Blocks moisture & oxygen diffusion into grain boundaries', failureMode: 'Epoxy outgassing or moisture drift above 125 °C' },
      { partCode: '03', name: 'Lead Wires', material: 'Dumet / Platinum-Iridium / Tinned Copper', function: 'Connects bead without excessive stem heat sink', failureMode: 'Fatigue fracture at bead neck' },
    ],
    typesAndClassification: [
      { type: 'NTC Glass Bead (e.g., 10 kΩ @ 25 °C)', summary: 'Exponential drop in resistance with rising temperature.', typicalRange: '−55 to +300 °C', accuracy: '±0.05 to ±0.2 °C interchangeable', bestFor: 'CJC reference, medical, EV battery BMS, HVAC' },
      { type: 'Switching PTC (BaTiO₃)', summary: 'Resistance stays low (~100 Ω) until Curie point, then jumps 10⁴×.', typicalRange: 'Trip points 60–180 °C', accuracy: '±5 °C switching band', bestFor: 'Electric motor winding over-temperature trip relays' },
    ],
    equations: [
      {
        title: 'Steinhart-Hart Equation (High Precision)',
        latex: '\\frac{1}{T} = A + B \\ln(R) + C \\left[\\ln(R)\\right]^3',
        variables: [
          { symbol: 'T', meaning: 'Absolute temperature', unit: 'K' },
          { symbol: 'R', meaning: 'Measured thermistor resistance', unit: 'Ω' },
          { symbol: 'A, B, C', meaning: 'Device-specific Steinhart-Hart calibration coefficients', unit: 'K⁻¹' },
        ],
        derivationSteps: [
          'Two-parameter Beta approximation: R(T) = R₀ · exp[β (1/T − 1/T₀)], accurate within ~±0.3 °C over a 50 °C window.',
          'Adding the cubic [ln R]³ Steinhart-Hart term reduces interpolation error below ±0.005 °C across −40 to +150 °C.',
        ],
      },
    ],
    characteristicCurve: {
      title: '10 kΩ NTC Thermistor (β = 3950 K) Resistance vs Temperature',
      subtitle: 'Strong exponential nonlinearity yields massive sensitivity near ambient temperatures',
      xLabel: 'Temperature',
      yLabel: 'Resistance',
      xUnit: '°C',
      yUnit: 'kΩ',
      series: [
        {
          name: '10 kΩ NTC (β=3950 K)',
          color: '#c5f467',
          points: [
            { x: -20, y: 97.1 }, { x: 0, y: 32.65 }, { x: 25, y: 10.0 }, { x: 50, y: 3.60 }, { x: 75, y: 1.48 }, { x: 100, y: 0.678 }, { x: 125, y: 0.339 },
          ],
        },
      ],
    },
    specifications: [
      { parameter: 'Nominal R₂₅ (at 25 °C)', value: '2.2 kΩ, 10 kΩ, 100 kΩ', standardOrNote: 'High resistance negates cable wire error' },
      { parameter: 'Material Constant β₂₅/₈₅', value: '3300 K – 4500 K (typical 3950 K)', standardOrNote: 'NTC sensitivity −3.5 to −5 %/°C' },
      { parameter: 'Thermal Dissipation Constant', value: '1–10 mW/°C in still air', standardOrNote: 'Keep bridge voltage low to prevent self-heating' },
    ],
    measurementRange: { typicalSpan: '−40 °C to +150 °C', extremeLimits: '−80 °C to +300 °C (glass bead)', overrangeProtection: 'Above 300 °C semiconductor oxide stoichiometry drifts irreversibly' },
    accuracyAndSensitivity: { accuracyClass: '±0.1 °C to ±0.5 °C (curve-matched)', sensitivity: '−440 Ω/°C at 25 °C for 10 kΩ NTC (≈1000× Pt100!)', repeatability: '±0.02 °C for glass beads', responseTime: '0.2–2 s bare bead' },
    advantages: ['Enormous sensitivity over narrow spans.', 'High base resistance makes lead-wire resistance negligible in 2-wire circuits.', 'Tiny bead mass gives very fast response and low cost.'],
    limitations: ['Highly nonlinear exponential curve.', 'Limited upper temperature (~150 °C epoxy, ~300 °C glass).', 'Self-heating error if excited continuously with >100 µW in still air.'],
    applications: [
      { industry: 'Instrumentation Electronics', service: 'Cold-junction reference sensing inside PLC AI terminal blocks', loopTagExample: 'CJC-1', engineeringNote: 'Compact footprint tracks copper terminal strip temperature closely.' },
      { industry: 'LV/MV Motors', service: '3-phase stator winding embedded PTC trip protection', loopTagExample: 'TSH-Motor', engineeringNote: 'Three PTCs wired in series trigger relay when resistance spikes >3 kΩ.' },
    ],
    calibration: {
      referenceStandard: 'Three-point Steinhart-Hart fit in stirred temperature bath',
      equipmentRequired: ['Precision DMM (6.5 digit)', 'Temperature bath', 'Reference SPRT'],
      procedureSteps: ['Measure R at T_low, T_mid, T_high (e.g. 0, 25, 80 °C).', 'Solve 3×3 linear system for A, B, C coefficients.', 'Verify residual error at intermediate check temperature.'],
      acceptanceCriteria: 'Residual fit error < ±0.05 °C.',
    },
    installation: {
      mechanicalRules: ['Use thermally conductive epoxy or silicone grease when bonding surface NTCs to heat sinks.'],
      electricalOrImpulseRules: ['Shunt with parallel resistor R_p ≈ R(T_mid) to linearize voltage divider response over narrow ranges.'],
      commonMistakes: ['Exposing epoxy-coated thermistors to condensing steam >100 °C, causing drift.'],
    },
    troubleshooting: [
      { symptom: 'ADC rails at maximum temperature reading', probableCause: 'Shorted NTC leads (R → 0 Ω mimics infinite heat)', diagnosticCheck: 'Disconnect and measure Ω at ambient', correctiveAction: 'Inspect pinched cable insulation' },
    ],
    manufacturers: [
      { vendor: 'TE Connectivity / Measurement Specialties', modelSeries: '44000 Series Precision Interchangeable NTC', notes: '±0.1 °C interchangeable epoxy thermistors.', sourceLabel: 'TE Thermistors', verificationStatus: 'editorial-verification' },
      { vendor: 'Vishay', modelSeries: 'NTCLE100E3 / Glass Encapsulated NTC', notes: 'Automotive & industrial grade curve-tracked NTCs.', sourceLabel: 'Vishay NTC Portfolio', verificationStatus: 'editorial-verification' },
    ],
    comparisons: [
      { parameter: 'Sensitivity @ 25 °C', thisInstrument: '−440 Ω/°C (10 kΩ NTC)', peerName: 'Pt100 RTD', peerValue: '+0.385 Ω/°C', engineeringTakeaway: 'NTC yields huge voltage swing without high-gain op-amps, over a narrow temp span.' },
      { parameter: 'Max Temp & Linearity', thisInstrument: '150–300 °C, strongly exponential', peerName: 'Pt100 RTD', peerValue: '600–850 °C, near-linear', engineeringTakeaway: 'RTD dominates industrial process plants; NTC dominates electronics/HVAC/BMS.' },
    ],
    interviewQuestions: [
      { difficulty: 'Beginner', question: 'Why does a thermistor require only 2 wires whereas a Pt100 needs 3 or 4 wires?', answer: 'A 10 kΩ NTC has ~100× higher resistance and ~1000× larger Ω/°C slope than a Pt100, so 1–2 Ω of copper wire resistance produces less than 0.005 °C error.' },
    ],
    numericalProblems: [
      {
        title: 'Beta Equation Temperature Calculation',
        statement: 'A 10 kΩ @ 25 °C NTC thermistor with β = 3950 K reads 3,600 Ω. Calculate the temperature in °C.',
        given: ['R₀ = 10,000 Ω at T₀ = 298.15 K', 'R = 3,600 Ω', 'β = 3950 K'],
        steps: [
          '1/T = 1/T₀ + (1/β) · ln(R / R₀)',
          '1/T = 1/298.15 + (1/3950) · ln(0.36) = 0.0033540 − 0.0002586 = 0.0030954 K⁻¹',
          'T = 323.06 K ⇒ t = 323.06 − 273.15 = 49.91 °C',
        ],
        answer: '49.91 °C',
      },
    ],
    quickRevisionNotes: ['NTC falls exponentially with T; PTC jumps sharply at Curie temp (motor trip).', 'Steinhart-Hart 3-term equation yields ±0.005 °C accuracy.', 'Ideal for short-range, low-cost, high-sensitivity sensing; poor above 150–300 °C.'],
    sources: [{ label: 'IEC 60539', standardOrDoc: 'Directly heated negative temperature coefficient thermistors' }],
  }),

  // 4. INFRARED SENSORS
  createTopic({
    slug: 'infrared-sensors',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Infrared (IR) Non-Contact Temperature Sensors',
    shortTitle: 'Infrared Sensors',
    subtitle: 'Stefan-Boltzmann non-contact thermal radiometry with emissivity compensation and D:S optical ratios.',
    standardRef: 'ASTM E1256 · Planck & Stefan-Boltzmann Laws',
    schematicKind: 'generic-transducer',
    definition: 'An Infrared Temperature Sensor detects emitted thermal electromagnetic radiation (typically 0.7–14 µm wavelength) from a target surface without physical contact, converting radiant power via a thermopile or photodiode into calibrated temperature using target emissivity ε.',
    purpose: 'Measures temperature of moving targets (steel strips, paper webs, rotating kilns), energized electrical switchgear, corrosive melts, and ultra-high-temperature surfaces where contact probes fail.',
    workingPrinciple: 'Every object above 0 K emits radiation proportional to ε·σ·T⁴ (Stefan-Boltzmann law). Germanium/ZnSe/quartz optics focus target IR onto a micromachined thermopile (array of miniature Seebeck junctions) or InGaAs photodiode. Because real surfaces emit less than an ideal blackbody (ε < 1.0), accurate readout requires setting emissivity ε and minimizing atmospheric absorption (choosing 8–14 µm atmospheric window for ambient targets).',
    principleSteps: [
      'Target emits broadband IR flux governed by Planck spectral distribution at temperature T.',
      'Optical lens defines the Distance-to-Spot (D:S) field-of-view cone onto the detector.',
      'Detector generates signal V ∝ ε·(T_target⁴ − T_ambient⁴) + (1 − ε)·T_reflected⁴.',
      'Signal processor compensates ambient housing temperature and user-entered emissivity ε to output 4–20 mA.',
    ],
    constructionSummary: 'Stainless IP65 housing containing coated IR lens (ZnSe/Ge/Si), spectral bandpass filter, thermopile or quantum detector, ambient CJC compensation sensor, and air-purge/water-cooling jacket options.',
    assemblyArchitecture: 'Air-purge collar keeps lens clean from dust/steam; laser sighting assists D:S target framing.',
    internalComponents: [
      { partCode: '01', name: 'IR Lens & Spectral Filter', material: 'Germanium / Zinc Selenide / Sapphire', function: 'Focuses specific IR band (e.g., 8–14 µm or 1.6 µm)', failureMode: 'Dust, oil film, or steam fog attenuates IR flux causing false low reading' },
      { partCode: '02', name: 'Thermopile / Quantum Detector', material: 'Silicon-Bismuth/Antimony Micromachined Array or InGaAs', function: 'Converts absorbed IR heat into voltage/current', failureMode: 'Thermal overload if cooling jacket fails near furnace' },
    ],
    typesAndClassification: [
      { type: 'Long-Wave Thermopile (8–14 µm)', summary: 'Insensitive to water vapor; ideal for non-metals & low-to-mid temperatures.', typicalRange: '−40 to +600 °C', accuracy: '±1% of reading or ±1.5 °C', bestFor: 'Plastics, food, paper, switchgear hot-spots' },
      { type: 'Short-Wave InGaAs/Si (0.8–2.2 µm)', summary: 'Higher emissivity for shiny metals & smaller emissivity errors per Planck law.', typicalRange: '+250 to +2000 °C', accuracy: '±0.5% of reading', bestFor: 'Steel rolling mills, molten metals, induction heating' },
    ],
    equations: [
      {
        title: 'Real-Surface Radiometric Power Balance',
        latex: 'W_{\\text{total}} = \\varepsilon \\sigma T_{\\text{target}}^4 + (1 - \\varepsilon) \\sigma T_{\\text{background}}^4',
        variables: [
          { symbol: '\\varepsilon', meaning: 'Target surface emissivity (0.05 shiny metal to 0.95 oxidized/painted)', unit: '—' },
          { symbol: '\\sigma', meaning: 'Stefan-Boltzmann constant (5.6704 × 10⁻⁸)', unit: 'W/(m²·K⁴)' },
        ],
        derivationSteps: [
          'By Kirchhoff’s law for opaque bodies, absorptivity α = ε and reflectivity ρ = 1 − ε.',
          'Low emissivity shiny metals (ε ≈ 0.1) reflect hot furnace walls strongly, causing large temperature errors unless short-wave or two-color ratio pyrometers are used.',
        ],
      },
    ],
    characteristicCurve: {
      title: 'Blackbody Radiant Emittance vs Temperature (Stefan-Boltzmann T⁴)',
      subtitle: 'Total hemispherical radiant exitance rises steeply with fourth power of Kelvin temperature',
      xLabel: 'Target Temperature',
      yLabel: 'Radiant Exitance',
      xUnit: '°C',
      yUnit: 'kW/m²',
      series: [
        {
          name: 'Blackbody (ε = 1.0)',
          color: '#c5f467',
          points: [
            { x: 100, y: 1.10 }, { x: 300, y: 6.11 }, { x: 500, y: 20.25 }, { x: 700, y: 50.83 }, { x: 900, y: 107.3 }, { x: 1100, y: 201.4 },
          ],
        },
        {
          name: 'Oxidized Steel (ε = 0.80)',
          color: '#cdbdff',
          points: [
            { x: 100, y: 0.88 }, { x: 300, y: 4.89 }, { x: 500, y: 16.20 }, { x: 700, y: 40.66 }, { x: 900, y: 85.84 }, { x: 1100, y: 161.1 },
          ],
        },
      ],
    },
    specifications: [
      { parameter: 'Optical Resolution (D:S)', value: '10:1 up to 100:1 (Distance-to-Spot)', standardOrNote: 'Target must exceed spot size!' },
      { parameter: 'Emissivity Setting', value: '0.10 – 1.00 adjustable', standardOrNote: 'Default 0.95 for non-metals' },
      { parameter: 'Response Time', value: '10 ms – 150 ms', standardOrNote: 'Orders of magnitude faster than thermowell RTDs' },
    ],
    measurementRange: { typicalSpan: '−40 °C to +1000 °C', extremeLimits: '+3000 °C (short-wave metallurgical pyrometers)', overrangeProtection: 'Water-cooled jacket & air purge required if ambient > 70 °C' },
    accuracyAndSensitivity: { accuracyClass: '±1% of reading or ±1.5 °C (assuming known ε)', sensitivity: 'Sub-millisecond photonic response', repeatability: '±0.5% of reading', responseTime: '10–150 ms' },
    advantages: ['Non-contact—zero disturbance of moving/delicate/high-voltage targets.', 'Ultra-fast millisecond response.', 'No chemical attack or immersion probe wear.'],
    limitations: ['Requires known surface emissivity ε; shiny metals cause huge errors.', 'Sight path blocked by smoke, dust, steam, or dirty lenses.', 'Measures surface skin temperature only—not bulk interior fluid.'],
    applications: [
      { industry: 'Cement & Rotary Kilns', service: 'Kiln shell hot-spot scanning for refractory brick failure', loopTagExample: 'TI-Kiln-Scan', engineeringNote: 'Line-scanner IR prevents catastrophic kiln shell burnout.' },
      { industry: 'Steel & Glass', service: 'Hot strip rolling mill & glass gob temperature', loopTagExample: 'TT-Roll-02', engineeringNote: '5.0 µm wavelength specifically measures glass surface opacity.' },
    ],
    calibration: {
      referenceStandard: 'Blackbody cavity furnace (ε ≥ 0.995) per ASTM E1256',
      equipmentRequired: ['Calibrated blackbody furnace', 'Target emissivity verification tape (ε=0.95) or contact probe'],
      procedureSteps: ['Set IR head ε = 1.00 (or 0.995 matching blackbody).', 'Align spot strictly inside isothermal cavity aperture.', 'Verify output across 3 span points.'],
      acceptanceCriteria: 'Within ±1% of blackbody reference.',
    },
    installation: {
      mechanicalRules: ['Ensure target diameter ≥ 1.5× calculated optical spot diameter at installation distance.', 'Install air-purge nozzle with clean instrument air to prevent soot deposition.'],
      electricalOrImpulseRules: ['Shielded twisted pair; keep laser sighting disabled in explosive atmospheres unless Ex certified.'],
      commonMistakes: ['Pointing at a shiny stainless pipe with ε left at 0.95—reads 40–100 °C too low!'],
    },
    troubleshooting: [
      { symptom: 'Reads dramatically lower than contact check', probableCause: 'Dirty lens, steam plume, or emissivity set too high for metallic surface', diagnosticCheck: 'Apply piece of black matte electrical tape (ε=0.95) to spot and re-check', correctiveAction: 'Clean optic with lens tissue & calibrate ε against contact probe' },
    ],
    manufacturers: [
      { vendor: 'Fluke Process Instruments / Raytek', modelSeries: 'Endurance / Thermalert Series', notes: 'Industrial 1-color and 2-color ratio IR pyrometers.', sourceLabel: 'Fluke Process Instruments', verificationStatus: 'editorial-verification' },
      { vendor: 'Optris', modelSeries: 'CTlaser / CSmicro Series', notes: 'Short- and long-wave industrial IR heads.', sourceLabel: 'Optris Industrial IR', verificationStatus: 'editorial-verification' },
    ],
    comparisons: [
      { parameter: 'Contact vs Non-Contact', thisInstrument: 'Non-contact surface optical', peerName: 'Thermocouple', peerValue: 'Immersion contact', engineeringTakeaway: 'IR excels on moving webs and >1300 °C targets; TC excels inside opaque closed pipes.' },
    ],
    interviewQuestions: [
      { difficulty: 'Intermediate', question: 'If an IR thermometer with 20:1 D:S ratio is mounted 2.0 m from a hot pipe, what is the spot size diameter?', answer: 'Spot diameter = Distance / (D:S) = 2.0 m / 20 = 0.10 m (100 mm). If the pipe OD is only 50 mm, the sensor averages in background wall radiation and reads inaccurately.' },
    ],
    numericalProblems: [
      {
        title: 'Spot Size & Radiance Drop',
        statement: 'An IR sensor with 30:1 D:S ratio views a steel billet 1.5 m away. What minimum target width is safe? Also calculate radiant power ratio at 1000 K vs 500 K.',
        given: ['D = 1.5 m', 'D:S = 30:1', 'T₁ = 500 K, T₂ = 1000 K'],
        steps: [
          'Spot diameter S = 1.5 / 30 = 0.05 m = 50 mm (recommended target ≥ 75 mm for margin).',
          'Radiant ratio = (T₂/T₁)⁴ = (1000/500)⁴ = 2⁴ = 16× higher power!',
        ],
        answer: '50 mm optical spot; 16× radiant flux increase.',
      },
    ],
    quickRevisionNotes: ['Measures surface temp only; spot size = Distance / (D:S).', 'Shiny metals need short-wave (1–2 µm) or two-color ratio pyrometers.', 'Black electrical tape (~0.95) quickly checks low-temp emissivity errors.'],
    sources: [{ label: 'ASTM E1256', standardOrDoc: 'Standard Test Methods for Radiation Thermometers' }],
  }),

  // 5. OPTICAL PYROMETERS
  createTopic({
    slug: 'optical-pyrometers',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Optical Pyrometers (Disappearing-Filament)',
    shortTitle: 'Optical Pyrometers',
    subtitle: 'Visible-spectrum monochromatic brightness matching around 650 nm for incandescent furnaces (>700 °C).',
    standardRef: 'Wien Radiation Law · 0.65 µm Monochromatic',
    schematicKind: 'generic-transducer',
    definition: 'An Optical Pyrometer (disappearing-filament pyrometer) measures incandescent target temperature (>700 °C) by visually or photoelectrically matching the spectral radiance of a hot object at a narrow red wavelength (~650 nm) against an internal calibrated tungsten lamp filament.',
    purpose: 'Portable and spot-check high-temperature measurement in steel foundries, ceramic kilns, glass melting tanks, and gasifier viewports.',
    workingPrinciple: 'An operator looks through an objective lens, red bandpass filter (λ = 0.65 µm), and calibrated tungsten filament lamp. Adjusting lamp current varies filament brightness until its outline blends seamlessly ("disappears") into the glowing target background. By Planck/Wien law, lamp current maps directly to brightness temperature.',
    principleSteps: [
      'Objective lens focuses incandescent furnace target onto the plane of a reference tungsten filament.',
      'Red filter isolates λ = 0.65 µm so color differences vanish and only brightness contrast remains.',
      'Rheostat varies filament DC current until filament neither glows brighter nor casts a dark silhouette against target.',
      'Scale reads brightness temperature, corrected for target spectral emissivity ε_λ.',
    ],
    constructionSummary: 'Telescopic barrel with objective focus, internal tungsten reference lamp, red 650 nm optical glass filter, absorption screen (for >1400 °C), precision rheostat, and calibrated milliammeter.',
    assemblyArchitecture: 'Manual visual telescope or automated photo-detector chopper matching target and reference lamp paths.',
    internalComponents: [
      { partCode: '01', name: 'Tungsten Reference Filament', material: 'Stabilized Vacuum Tungsten Lamp', function: 'Provides repeatable controllable 650 nm spectral brightness', failureMode: 'Lamp aging drift above 1500 °C without absorption wedge' },
      { partCode: '02', name: '650 nm Monochromatic Red Filter', material: 'Optical Ruby Bandpass Glass', function: 'Narrows waveband so human eye compares luminance accurately', failureMode: 'Scratched filter degrades visual contrast' },
    ],
    typesAndClassification: [
      { type: 'Disappearing-Filament Manual', summary: 'Operator matches filament current visually.', typicalRange: '+700 to +3000 °C', accuracy: '±0.5%–1% of reading', bestFor: 'Portable foundry/kiln spot calibration checks' },
      { type: 'Two-Color Ratio Optical Pyrometer', summary: 'Automatically computes intensity ratio at two close wavelengths (λ₁, λ₂), cancelling ε and partial dust!', typicalRange: '+600 to +3000 °C', accuracy: '±0.5% of reading', bestFor: 'Dusty cement kilns, molten metal streams, small targets' },
    ],
    equations: [
      {
        title: 'Wien Spectral Radiance & Emissivity Brightness Correction',
        latex: '\\frac{1}{T_{\\text{true}}} = \\frac{1}{T_{\\text{bright}}} + \\frac{\\lambda}{c_2} \\ln(\\varepsilon_\\lambda)',
        variables: [
          { symbol: 'T_{\\text{bright}}', meaning: 'Apparent brightness temperature (ε=1 reading)', unit: 'K' },
          { symbol: '\\lambda', meaning: 'Effective wavelength (0.65 µm)', unit: 'm' },
          { symbol: 'c_2', meaning: 'Second radiation constant (0.014388 m·K)', unit: 'm·K' },
        ],
        derivationSteps: [
          'Since ε_λ < 1, ln(ε_λ) < 0, meaning T_true is always HIGHER than T_bright.',
          'At short visible wavelength (0.65 µm), sensitivity to emissivity uncertainty is much smaller than at long IR wavelengths (10 µm).',
        ],
      },
    ],
    characteristicCurve: {
      title: 'True Temperature vs Brightness Temperature at 0.65 µm',
      subtitle: 'Effect of spectral emissivity ε on apparent temperature reading',
      xLabel: 'Brightness Temp',
      yLabel: 'True Temp',
      xUnit: '°C',
      yUnit: '°C',
      series: [
        { name: 'Blackbody (ε=1.0)', color: '#c5f467', points: [{ x: 800, y: 800 }, { x: 1000, y: 1000 }, { x: 1200, y: 1200 }, { x: 1400, y: 1400 }] },
        { name: 'Molten Steel (ε=0.4)', color: '#ff9100', points: [{ x: 800, y: 848 }, { x: 1000, y: 1068 }, { x: 1200, y: 1291 }, { x: 1400, y: 1517 }] },
      ],
    },
    specifications: [
      { parameter: 'Effective Wavelength', value: '0.65 µm (650 nm visible red)', standardOrNote: 'Lower limit ~700 °C where objects glow dull red' },
      { parameter: 'Measurement Span', value: '700 °C – 3000 °C (using neutral range screens)', standardOrNote: 'Non-contact' },
    ],
    measurementRange: { typicalSpan: '+700 °C to +2000 °C', extremeLimits: 'Up to +4000 °C with optical attenuator', overrangeProtection: 'Never view unattenuated plasma arcs without dark absorption filter' },
    accuracyAndSensitivity: { accuracyClass: '±5 to ±10 °C at 1500 °C', sensitivity: 'Eye distinguishes ~2–3 °C brightness mismatch', repeatability: '±3 °C', responseTime: 'Manual (2–5 s); Automatic two-color (<20 ms)' },
    advantages: ['Can measure targets beyond thermocouple melting limits.', 'Sighting through furnace sight-glass works seamlessly at 0.65 µm (glass transmits visible light!).', 'Two-color ratio variant rejects up to 90% smoke/dust obstruction!'],
    limitations: ['Cannot measure below ~700 °C (targets do not glow visibly).', 'Manual disappearing-filament model is non-continuous and operator-dependent.'],
    applications: [
      { industry: 'Metallurgy & Foundries', service: 'Tapping molten steel & furnace refractory inspection', loopTagExample: 'TI-Tap-01', engineeringNote: 'Two-color ratio optical pyrometer unaffected by slag fumes.' },
    ],
    calibration: {
      referenceStandard: 'Tungsten strip-lamp radiance standard',
      equipmentRequired: ['Calibrated tungsten ribbon lamp', 'Precision DC power supply'],
      procedureSteps: ['Match reference strip lamp current at 900, 1200, 1500 °C.', 'Verify absorption screen transmission factor.'],
      acceptanceCriteria: '±0.5% of span.',
    },
    installation: {
      mechanicalRules: ['Keep quartz/borosilicate furnace sight window clean; correct for window transmission loss (~8% two-surface Fresnel reflection).'],
      electricalOrImpulseRules: ['Replace/recharge lamp reference battery before field check.'],
      commonMistakes: ['Ignoring quartz viewport reflection loss (typically adds −15 °C error if uncorrected).'],
    },
    troubleshooting: [
      { symptom: 'Filament visible even at max current', probableCause: 'Target exceeds low-range scale—flip in high-range absorption screen', diagnosticCheck: 'Check range selector lever', correctiveAction: 'Engage high-range optical filter' },
    ],
    manufacturers: [
      { vendor: 'Pyrometer Instrument Co. / Chino', modelSeries: 'Micro-Optical & Ratio Pyrometers', notes: 'Disappearing filament and industrial two-color optical pyrometers.', sourceLabel: 'General Optical Pyrometer Ecosystem', verificationStatus: 'editorial-verification' },
    ],
    comparisons: [
      { parameter: 'Minimum Temp', thisInstrument: '~700 °C (visible glow)', peerName: 'Broadband Radiation Pyrometer', peerValue: '0 °C to 2000 °C', engineeringTakeaway: 'Optical pyrometer sees through glass viewports; broadband IR is blocked by standard glass!' },
    ],
    interviewQuestions: [
      { difficulty: 'Intermediate', question: 'Why does a two-color ratio pyrometer remain accurate even if dust blocks 50% of the viewport?', answer: 'Because dust attenuates both adjacent wavelengths (λ₁ and λ₂) equally ("grey body" attenuation). Taking the intensity ratio I(λ₁)/I(λ₂) cancels both optical obstruction and unknown emissivity (provided ε₁ = ε₂).' },
    ],
    numericalProblems: [
      {
        title: 'Brightness to True Temperature Correction',
        statement: 'An optical pyrometer (λ = 0.65 µm) reads T_bright = 1273 K on molten steel having ε_λ = 0.40. Find T_true.',
        given: ['T_bright = 1273 K', 'λ = 0.65×10⁻⁶ m', 'c₂ = 0.014388 m·K', 'ε = 0.40'],
        steps: [
          '1/T_true = 1/1273 + (0.65×10⁻⁶ / 0.014388) · ln(0.40)',
          '1/T_true = 0.00078555 + (4.5177×10⁻⁵)(−0.91629) = 0.00074415 K⁻¹',
          'T_true = 1343.8 K (1070.7 °C, +70.8 °C higher than reading!)',
        ],
        answer: '1343.8 K (1070.7 °C)',
      },
    ],
    quickRevisionNotes: ['Measures at 0.65 µm red filter; works only >700 °C.', 'Works through standard glass viewports (visible spectrum).', 'Two-color ratio pyrometry cancels grey dust/smoke and unknown constant emissivity.'],
    sources: [{ label: 'Planck & Wien Radiation Laws', standardOrDoc: 'ITS-90 High-Temperature Radiance Scale' }],
  }),

  // 6. RADIATION PYROMETERS
  createTopic({
    slug: 'radiation-pyrometers',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Total / Broadband Radiation Pyrometers',
    shortTitle: 'Radiation Pyrometers',
    subtitle: 'Full-spectrum thermal radiation collection using mirror/lens optics and blackened thermopile receivers.',
    standardRef: 'Stefan-Boltzmann Law · ASTM E1256',
    schematicKind: 'generic-transducer',
    definition: 'A Total Radiation Pyrometer collects radiant energy across a broad spectrum (typically 0.4–20 µm) from a target via a concave gold/aluminized mirror or CaF₂/fused-silica lens and focuses it onto a blackened thermopile or bolometer, producing an EMF roughly proportional to T⁴.',
    purpose: 'Continuous online monitoring of high-temperature kilns, soaking pits, glass lehrs, and brick tunnels.',
    workingPrinciple: 'Incoming broadband heat rays reflect off a parabolic mirror onto a blackened thermopile hot junction disk, while the housing acts as cold reference. Thermopile EMF scales with ε·(T⁴ − T_housing⁴).',
    principleSteps: [
      'Broadband IR and visible radiation enters open-end or quartz-windowed sighting tube.',
      'Parabolic mirror focuses full waveband onto thermopile receiver (no chromatic aberration!).',
      'Blackened receiver absorbs radiant heat and generates mV signal proportional to T⁴.',
    ],
    constructionSummary: 'Water- or air-cooled metallic barrel housing concave mirror, adjustable diaphragm aperture, blackened foil thermopile, and ambient compensation shunt resistor.',
    assemblyArchitecture: 'Often mounted with closed-end silicon carbide sighting target tube immersed in molten baths so ε approaches 1.0.',
    internalComponents: [
      { partCode: '01', name: 'Concave Mirror / CaF₂ Lens', material: 'Gold-Plated Mirror or Calcium Fluoride', function: 'Focuses broad IR spectrum without glass absorption', failureMode: 'Tarnished mirror surface drops gain' },
      { partCode: '02', name: 'Blackened Thermopile', material: 'Series array of 10–40 miniature thermocouples', function: 'Amplifies absorbed radiant heat into measurable mV', failureMode: 'Housing overheating shifts reference baseline' },
    ],
    typesAndClassification: [
      { type: 'Mirror-Type Broadband Pyrometer', summary: 'Reflective parabolic focusing eliminates lens spectral absorption.', typicalRange: '+400 to +2000 °C', accuracy: '±1%–2% of span', bestFor: 'Furnaces, kilns with closed SiC target tubes' },
    ],
    equations: [
      {
        title: 'Total Radiation Thermopile Output',
        latex: 'V_{\\text{out}} = K \\cdot \\varepsilon \\cdot \\tau_{\\text{atm}} \\cdot \\left(T_{\\text{target}}^4 - T_{\\text{det}}^4\\right)',
        variables: [
          { symbol: 'K', meaning: 'Optical geometry & thermopile sensitivity factor', unit: 'V/K⁴' },
          { symbol: '\\tau_{\\text{atm}}', meaning: 'Atmospheric transmission (affected by CO₂ & H₂O bands)', unit: '—' },
        ],
        derivationSteps: [
          'Unlike narrowband 8–14 µm IR thermometers, broadband pyrometers absorb slightly in CO₂ (4.3 µm) and H₂O (2.7 µm) gas bands unless purged with dry nitrogen.',
        ],
      },
    ],
    characteristicCurve: {
      title: 'Normalized Thermopile EMF vs Target Temperature',
      subtitle: 'Strong T⁴ curvature compresses low-end resolution and expands high-end scale',
      xLabel: 'Temperature',
      yLabel: 'Normalized Output',
      xUnit: '°C',
      yUnit: '% FS',
      series: [
        { name: 'Broadband T⁴ Response', color: '#c5f467', points: [{ x: 400, y: 5 }, { x: 700, y: 18 }, { x: 1000, y: 46 }, { x: 1200, y: 74 }, { x: 1400, y: 100 }] },
      ],
    },
    specifications: [
      { parameter: 'Spectral Bandwidth', value: '0.4 – 10 µm (lens) / up to 20 µm (mirror)', standardOrNote: 'Needs CaF₂/BaF₂ or open purge' },
      { parameter: 'Time Constant', value: '0.5 s – 2.0 s (thermopile thermal mass)', standardOrNote: 'Faster than sheathed TCs' },
    ],
    measurementRange: { typicalSpan: '+400 °C to +1800 °C', extremeLimits: '+2500 °C', overrangeProtection: 'Cooling jacket required above 60 °C ambient' },
    accuracyAndSensitivity: { accuracyClass: '±1%–2% of span', sensitivity: 'Nonlinear—highest sensitivity at upper range', repeatability: '±0.5% FS', responseTime: '0.5–2 s' },
    advantages: ['Continuous 24/7 output unlike manual optical pyrometers.', 'Closed-end SiC target tube gives true ε ≈ 1.0 inside corrosive slag/flame without sensor exposure.'],
    limitations: ['Highly nonlinear T⁴ scale.', 'CO₂/H₂O gas combustion plumes absorb broadband IR unless sighted inside a purged/closed target tube.'],
    applications: [{ industry: 'Glass & Steel Reheating', service: 'Furnace roof & closed SiC well monitoring', loopTagExample: 'TT-Furn-Roof', engineeringNote: 'Closed silicon carbide tube converts furnace atmosphere errors into blackbody target.' }],
    calibration: { referenceStandard: 'Blackbody furnace comparison', equipmentRequired: ['High-temp blackbody cavity', 'mV transmitter test loop'], procedureSteps: ['Clean optical mirror/window.', 'Compare against reference Type S inside blackbody cavity.'], acceptanceCriteria: '±1% span.' },
    installation: { mechanicalRules: ['Purge sighting tube continuously with dry clean air/N₂ to block flame gases.'], electricalOrImpulseRules: ['Standard copper leads suffice from housing—thermopile CJC happens inside head.'], commonMistakes: ['Using standard borosilicate glass window in front of broadband detector (blocks >2.7 µm!).'] },
    troubleshooting: [{ symptom: 'Gradual downward drift in gas furnace', probableCause: 'Soot coating window or fluctuating CO₂ plume', diagnosticCheck: 'Inspect purge flow & lens cleanliness', correctiveAction: 'Clean optics & increase purge air flow' }],
    manufacturers: [{ vendor: 'Land Instruments (AMETEK)', modelSeries: 'System 4 / Spot Broadband & Ratio', notes: 'Heavy steel/glass furnace radiation thermometers.', sourceLabel: 'AMETEK Land', verificationStatus: 'editorial-verification' }],
    comparisons: [{ parameter: 'Waveband', thisInstrument: 'Broadband (0.4–15 µm)', peerName: 'Optical Pyrometer', peerValue: 'Monochromatic 0.65 µm', engineeringTakeaway: 'Broadband works at lower temps and outputs continuous signal; narrowband resists gas absorption.' }],
    interviewQuestions: [{ difficulty: 'Intermediate', question: 'Why is a closed-end silicon carbide (SiC) target tube often paired with a radiation pyrometer?', answer: 'Looking directly through furnace flames suffers from CO₂/H₂O absorption and unknown brick emissivity. Pointing the pyrometer down the inside of a closed glowing SiC tube creates a blackbody cavity (ε → 1.0) free of flame interference while protecting the optics.' }],
    numericalProblems: [{ title: 'T⁴ Scale Nonlinearity', statement: 'If a radiation pyrometer reads 10 mV at 1000 K (ambient neglected), estimate mV at 1200 K.', given: ['V₁ = 10 mV at 1000 K', 'T₂ = 1200 K'], steps: ['V₂/V₁ = (1200/1000)⁴ = 1.2⁴ = 2.0736', 'V₂ = 20.74 mV'], answer: '20.74 mV' }],
    quickRevisionNotes: ['Output scales as T⁴ (extremely nonlinear at low end).', 'Uses parabolic mirrors or CaF₂/sapphire optics (ordinary glass blocks long-wave IR!).'],
    sources: [{ label: 'ASTM E1256', standardOrDoc: 'Radiation Thermometry Principles' }],
  }),

  // 7. BIMETALLIC THERMOMETERS
  createTopic({
    slug: 'bimetallic-thermometers',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Bimetallic Dial Thermometers',
    shortTitle: 'Bimetallic Thermometers',
    subtitle: 'Local mechanical temperature indication driven by differential thermal expansion of bonded Invar and brass/stainless strips.',
    standardRef: 'ASME B40.200 · EN 13190',
    schematicKind: 'generic-transducer',
    definition: 'A Bimetallic Thermometer is a self-contained mechanical local dial gauge utilizing a helically wound strip of two dissimilar metals bonded together (typically low-expansion Invar 36% Ni-Fe and high-expansion brass or 304 stainless steel) whose differential expansion rotates an indicator pointer directly with temperature.',
    purpose: 'Reliable local field indication requiring zero electrical power across piping skids, HVAC chillers, transformers, and pumps.',
    workingPrinciple: 'Heating the bonded strip causes the high-expansion metal to elongate faster than the Invar layer, forcing the helix to unwind or tighten smoothly proportional to ΔT. Rotating the free tip drives a pointer shaft across a circular dial calibrated in °C/°F.',
    principleSteps: [
      'Process fluid heats the stainless stem and helical bimetallic coil inside.',
      'High-expansion layer expands ~15–20× faster than Invar, twisting the helix.',
      'Central shaft rotates directly (no gears required in helical form) across anti-parallax dial.',
    ],
    constructionSummary: 'All-304/316SS hermetically sealed dial head (back-angle or every-angle swivel), glass/polycarbonate crystal, zero-adjust screw, and rigid stem containing helical coil damped in silicone oil against vibration.',
    assemblyArchitecture: 'Every-angle gimbal head permits ergonomic dial orientation regardless of thermowell angle.',
    internalComponents: [
      { partCode: '01', name: 'Helical Bimetallic Element', material: 'Bonded Invar 36 / Austenitic Stainless or Brass', function: 'Generates rotational deflection proportional to ΔT', failureMode: 'Overtemperature annealing permanently shifts zero' },
      { partCode: '02', name: 'Silicone Damping Fluid & Stem', material: '304/316SS Tube + Silicone Oil', function: 'Damps pointer flutter on vibrating pumps', failureMode: 'Stem bending warps internal shaft alignment' },
    ],
    typesAndClassification: [
      { type: 'Helical Stem Dial Gauge', summary: 'Compact coil inside stem rotates pointer directly.', typicalRange: '−70 to +550 °C', accuracy: 'ASME Grade A (±1% of span)', bestFor: 'Process piping local gauges' },
      { type: 'Spiral Thermostat Strip', summary: 'Flat spiral coil operating mechanical snap switch.', typicalRange: '−20 to +150 °C', accuracy: '±2 °C', bestFor: 'Local HVAC & transformer oil fan cut-in' },
    ],
    equations: [
      {
        title: 'Bimetallic Strip Curvature Radius',
        latex: '\\frac{1}{R} = \\frac{6 (\\alpha_2 - \\alpha_1)(T - T_0)(1 + m)^2}{h \\left[3(1+m)^2 + (1+mn)\\left(m^2 + \\frac{1}{mn}\\right)\\right]} \\approx \\frac{3(\\alpha_2 - \\alpha_1)\\Delta T}{2h}',
        variables: [
          { symbol: '\\alpha_2 - \\alpha_1', meaning: 'Difference in linear thermal expansion coefficients', unit: 'K⁻¹' },
          { symbol: 'h', meaning: 'Total strip thickness (with equal layer thicknesses m=1, equal moduli n=1)', unit: 'm' },
        ],
        derivationSteps: ['Thinner strip h and larger Δα maximize angular deflection per °C; multi-turn helix multiplies angular travel without backlash gears.'],
      },
    ],
    characteristicCurve: {
      title: 'Pointer Angular Travel vs Temperature (0–300 °C Dial)',
      subtitle: '270° mechanical sweep shows clean linear proportionality over operating span',
      xLabel: 'Temperature',
      yLabel: 'Pointer Angle',
      xUnit: '°C',
      yUnit: 'deg',
      series: [{ name: '270° Span Gauge', color: '#c5f467', points: [{ x: 0, y: 0 }, { x: 75, y: 67.5 }, { x: 150, y: 135 }, { x: 225, y: 202.5 }, { x: 300, y: 270 }] }],
    },
    specifications: [
      { parameter: 'Accuracy Class', value: '±1% full scale (ASME B40.200 Grade A / EN 13190 Class 1)', standardOrNote: 'Read at eye level to avoid parallax' },
      { parameter: 'Dial Sizes', value: '63 mm (2.5"), 100 mm (4"), 125 mm (5")', standardOrNote: 'Hermetically sealed IP65' },
    ],
    measurementRange: { typicalSpan: '−50 °C to +500 °C', extremeLimits: '+550 °C intermittent', overrangeProtection: '130% FS short-term; chronic over-temp anneals coil' },
    accuracyAndSensitivity: { accuracyClass: '±1% FS', sensitivity: 'Visual readability ~1% span', repeatability: '±0.5% FS', responseTime: '15–40 s (slower inside thermowell)' },
    advantages: ['Requires no power supply—works during total plant blackout.', 'Low cost, rugged all-stainless construction.', 'Direct rotational drive avoids delicate gear backlash.'],
    limitations: ['Local reading only (no 4–20 mA DCS output).', 'Lower accuracy than RTDs; vulnerable to severe mechanical vibration without oil filling.', 'Requires entire helical stem length (~65 mm) immersed for accuracy.'],
    applications: [{ industry: 'Refineries & Utilities', service: 'Local operator check next to DCS transmitters & cooling water headers', loopTagExample: 'TG-112', engineeringNote: 'Anti-parallax stepped dial preferred.' }],
    calibration: { referenceStandard: 'ASME B40.200', equipmentRequired: ['Stirred calibration bath', 'Reference RTD'], procedureSteps: ['Immerse full sensitive helix (~65 mm) into bath.', 'Compare 0, 50, 100% points; turn external zero-reset screw if offset is uniform.'], acceptanceCriteria: '±1% of span across all test points.' },
    installation: { mechanicalRules: ['Mount inside a thermowell for pressurized lines; ensure sensitive stem tip length matches well U-length.'], electricalOrImpulseRules: ['None (purely mechanical).'], commonMistakes: ['Inserting a 4" stem into an 8" thermowell—coil stays partly outside flow stream and reads close to ambient!'] },
    troubleshooting: [{ symptom: 'Pointer sticks or lags behind flow temperature', probableCause: 'Bent stem dragging shaft, or partial immersion', diagnosticCheck: 'Remove from thermowell and inspect straightness', correctiveAction: 'Replace gauge and verify immersion length' }],
    manufacturers: [{ vendor: 'WIKA / Ashcroft', modelSeries: 'Model 55 / EI Series Bimetallic Thermometers', notes: 'EN 13190 Class 1 / ASME Grade A industrial dial thermometers.', sourceLabel: 'WIKA Dial Thermometers', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'Power & Telemetry', thisInstrument: 'Zero power, local dial only', peerName: 'Gas-Filled Capillary Dial', peerValue: 'Zero power, allows remote capillary up to 10 m', engineeringTakeaway: 'Use gas-filled dial if dial must sit on panel away from hot pipe.' }],
    interviewQuestions: [{ difficulty: 'Beginner', question: 'Why is Invar always one of the two metals in a bimetallic strip?', answer: 'Invar (36% Ni–Fe) has an extraordinarily low thermal expansion coefficient (α ≈ 1.2×10⁻⁶ /°C), maximizing the differential Δα against brass or stainless steel (~17–19×10⁻⁶ /°C) for maximum pointer rotation.' }],
    numericalProblems: [{ title: 'Grade A Dial Error Budget', statement: 'A 0–300 °C ASME Grade A bimetallic thermometer indicates 182 °C. What is the maximum permissible absolute uncertainty?', given: ['Span = 300 °C', 'Class = ±1% FS'], steps: ['Max error = ±0.01 × 300 °C = ±3.0 °C', 'True value lies within 179.0 °C to 185.0 °C'], answer: '±3.0 °C' }],
    quickRevisionNotes: ['Uses Invar 36 + High-expansion alloy helix.', 'Immerse full sensitive helix length into thermowell.', 'Zero power, ±1% FS accuracy, local indication only.'],
    sources: [{ label: 'ASME B40.200 / EN 13190', standardOrDoc: 'Thermometers, Direct Reading and Remote Reading' }],
  }),

  // 8. THERMOWELLS
  createTopic({
    slug: 'thermowells',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Industrial Thermowells & Wake Frequency (ASME PTC 19.3 TW)',
    shortTitle: 'Thermowells',
    subtitle: 'Drilled solid bar-stock pressure barriers engineered against static pressure, fluid drag, and von Kármán vortex resonance.',
    standardRef: 'ASME PTC 19.3 TW-2016 · ANSI B16.5',
    schematicKind: 'generic-transducer',
    definition: 'A Thermowell is a closed-end pressure-retaining metallic socket screwed, flanged, or welded into a pipe or vessel to isolate an RTD, thermocouple, or dial thermometer from high-pressure, corrosive, or high-velocity process fluid while permitting sensor removal without process shutdown.',
    purpose: 'Maintains pressure containment integrity and allows hot-swap sensor maintenance; engineered specifically against vortex-induced fatigue rupture.',
    workingPrinciple: 'Process flow past a cylindrical thermowell sheds alternating von Kármán vortices at frequency f_s = St · V / d. If f_s approaches the thermowell’s cantilever natural frequency f_n (f_s/f_n ≥ 0.8), lock-in resonance causes catastrophic fatigue fracture within hours. Tapered bar-stock geometry maximizes root stiffness f_n while keeping tip bore compact for fast thermal response.',
    principleSteps: [
      'Process fluid flows perpendicularly across the tapered/stepped external thermowell shank.',
      'Vortex shedding frequency f_s and static/dynamic drag bending stresses are evaluated per ASME PTC 19.3 TW.',
      'Heat conducts radially through the well wall to the spring-loaded sensor tip.',
    ],
    constructionSummary: 'CNC gun-drilled from solid forged bar stock (316L, Inconel 625, Hastelloy C-276, Monel, Duplex SS) with flanged (ANSI RF/RTJ), threaded (1/2"–1" NPT), or socket-weld/van-stone process mounting.',
    assemblyArchitecture: 'Tapered shank offers best balance of high root stiffness and fast tip thermal response; helical strake thermowells suppress vortex shedding in ultra-high gas velocity.',
    internalComponents: [
      { partCode: '01', name: 'Process Mounting Flange / Weld Boss', material: 'Forged 316L / Alloy C-276', function: 'Primary pressure-boundary attachment to pipe nozzle', failureMode: 'Root fillet weld fatigue crack if inadequately calculated' },
      { partCode: '02', name: 'Tapered Bar-Stock Shank & Bore', material: 'Gun-Drilled Solid Bar (never welded pipe in high-velocity!)', function: 'Resists fluid bending drag & corrosion', failureMode: 'Vortex resonance fracture or erosion thinning' },
    ],
    typesAndClassification: [
      { type: 'Tapered Drilled Bar-Stock', summary: 'Decreasing OD from root to tip; industry gold standard.', typicalRange: 'High-velocity gas, steam, refineries', accuracy: 'Fastest thermal response for high f_n', bestFor: 'Mainline piping & steam headers' },
      { type: 'Stepped Shank', summary: 'Larger root diameter stepping sharply down near tip.', typicalRange: 'Moderate velocity liquids', accuracy: 'Good tip response', bestFor: 'Standard liquid lines' },
      { type: 'Straight Cylindrical', summary: 'Uniform OD along entire U-length.', typicalRange: 'Low-velocity tanks/vessels', accuracy: 'Lowest stiffness f_n', bestFor: 'Static storage vessels & agitated tanks' },
    ],
    equations: [
      {
        title: 'Strouhal Vortex Shedding Frequency & Wake Safety Ratio',
        latex: 'f_s = \\frac{\\text{St} \\cdot V}{d_{\\text{tip}}}, \\quad \\frac{f_s}{f_n} < 0.80 \\;\\;(\\text{ASME PTC 19.3 TW})',
        variables: [
          { symbol: '\\text{St}', meaning: 'Strouhal number (≈ 0.21–0.22 for circular cylinders in high Re)', unit: '—' },
          { symbol: 'V', meaning: 'Fluid velocity at thermowell tip', unit: 'm/s' },
          { symbol: 'f_n', meaning: 'First natural bending frequency of thermowell cantilever', unit: 'Hz' },
        ],
        derivationSteps: [
          'If f_s exceeds 0.80·f_n (in-line/transverse lock-in bands), thermowell fails ASME PTC 19.3 TW.',
          'Remedy if failing: shorten immersion U-length (f_n ∝ 1/U²), increase root diameter, change straight→tapered, add velocity collar, or mount in an elbow pointing upstream.',
        ],
      },
    ],
    characteristicCurve: {
      title: 'Thermowell Natural Frequency fₙ vs Immersion U-Length',
      subtitle: 'Natural frequency drops inversely with U²—making excessive immersion length the #1 cause of wake-frequency failure',
      xLabel: 'Unsupported Length U',
      yLabel: 'Natural Frequency fₙ',
      xUnit: 'mm',
      yUnit: 'Hz',
      series: [{ name: 'Tapered 316L (24→16 mm)', color: '#c5f467', points: [{ x: 100, y: 1450 }, { x: 150, y: 645 }, { x: 200, y: 360 }, { x: 250, y: 230 }, { x: 300, y: 160 }, { x: 350, y: 118 }] }],
    },
    specifications: [
      { parameter: 'Standard Bore Diameter', value: '6.6 mm (0.260") for 6 mm / 1/4" probes', standardOrNote: 'Tight clearance minimizes air-gap lag' },
      { parameter: 'Design Code', value: 'ASME PTC 19.3 TW-2016', standardOrNote: '4 checks: frequency, dynamic stress, static stress, external pressure' },
    ],
    measurementRange: { typicalSpan: 'Cryogenic to +1100 °C (material dependent)', extremeLimits: 'Up to 700 bar depending on wall thickness & ANSI rating', overrangeProtection: 'Hydrostatic pressure test & PMI material verification' },
    accuracyAndSensitivity: { accuracyClass: 'N/A (passive barrier; adds thermal lag & conduction error if U too short)', sensitivity: 'Minimum U ≈ 50–100 mm or centerline third of pipe', repeatability: 'N/A', responseTime: 'Increases sensor τ₆₃% by 3–10× vs bare sheath' },
    advantages: ['Safe sensor swap during live pressurized plant operation.', 'Protects delicate sensors from abrasion, acid, and high pressure.'],
    limitations: ['Adds substantial thermal lag (increases τ₆₃%).', 'Must pass wake-frequency calculation or risks breaking off inside turbines/compressors!'],
    applications: [{ industry: 'High-Pressure Steam & Gas Pipelines', service: 'Main steam headers and compressor discharge lines', loopTagExample: 'TW-204', engineeringNote: 'Always run ASME PTC 19.3 TW software calculation on every pipe thermowell.' }],
    calibration: { referenceStandard: 'ASME PTC 19.3 TW / Hydrostatic & Dye-Penetrant NDT', equipmentRequired: ['Calibrated bore gauge', 'Hydrostatic pressure test bench'], procedureSteps: ['Verify bore concentricity (wall thickness tolerance at tip).', 'Perform hydrostatic test at 1.5× design pressure.'], acceptanceCriteria: 'Zero leakage, zero bore eccentricity failure, PMI verified.' },
    installation: { mechanicalRules: ['On small pipes (<DN80), mount thermowell diagonally or at an elbow facing into flow to achieve immersion without choking pipe.'], electricalOrImpulseRules: ['Verify RTD/TC stem spring-loading presses probe tip flush against bottom of thermowell bore.'], commonMistakes: ['Inserting a thermowell that is too long—violates wake frequency and shears off downstream into a compressor impeller!'] },
    troubleshooting: [{ symptom: 'Very sluggish loop response (>60 s)', probableCause: 'Oversized bore air gap or probe backed out from bottom of well', diagnosticCheck: 'Verify probe spring tension and match U-length vs probe L-length', correctiveAction: 'Install correct spring-loaded sensor length' }],
    manufacturers: [{ vendor: 'WIKA', modelSeries: 'TW10 / TW15 Flanged & Threaded Bar-Stock', notes: 'ASME PTC 19.3 TW certified solid-drilled thermowells.', sourceLabel: 'WIKA Thermowells', sourceUrl: 'https://www.wika.com', verificationStatus: 'sourced-reference' }],
    comparisons: [{ parameter: 'Machined Bar-Stock vs Built-Up Pipe', thisInstrument: 'Gun-drilled solid forging (no tip weld)', peerName: 'Fabricated Pipe Well', peerValue: 'Welded plug tip', engineeringTakeaway: 'Never use fabricated pipe wells in high-pressure or ASME PTC 19.3 TW critical service; always specify solid bar-stock.' }],
    interviewQuestions: [{ difficulty: 'Industry-Oriented', question: 'Your thermowell fails ASME PTC 19.3 TW wake frequency calculation in a high-velocity gas line. How do you fix it?', answer: '1) Shorten immersion U-length (increases f_n ∝ 1/U²), 2) Increase root/tip OD or switch straight → tapered, 3) Install a Scruton helical-strake thermowell or support velocity collar, or 4) Relocate to an angled elbow pointing into flow.' }],
    numericalProblems: [{ title: 'Vortex Shedding Frequency Check', statement: 'Gas flows at V = 40 m/s past a 20 mm tip OD thermowell (St = 0.22). Calculate f_s and required minimum natural frequency f_n.', given: ['V = 40 m/s', 'd = 0.020 m', 'St = 0.22'], steps: ['f_s = (0.22 × 40) / 0.020 = 440 Hz', 'For f_s / f_n < 0.80, f_n > 440 / 0.80 = 550 Hz'], answer: 'f_s = 440 Hz; require f_n > 550 Hz.' }],
    quickRevisionNotes: ['f_s = St·V/d; keep f_s / f_n < 0.8.', 'Shortening U-length increases stiffness dramatically (f_n ∝ 1/U²).', 'Use solid gun-drilled bar-stock for pressurized process lines.'],
    sources: [{ label: 'ASME PTC 19.3 TW-2016', standardOrDoc: 'Thermowells Performance Test Code' }],
  }),

  // 9. TEMPERATURE TRANSMITTERS
  createTopic({
    slug: 'temperature-transmitters',
    category: 'temperature',
    categoryLabel: 'Temperature Measurement',
    title: 'Smart Temperature Transmitters (Head & Rail Mount)',
    shortTitle: 'Temperature Transmitters',
    subtitle: 'Universal RTD/Thermocouple signal conditioners converting μV/Ω sensor inputs into isolated 4–20 mA + HART digital telemetry.',
    standardRef: 'NAMUR NE43 · IEC 61298 · HART 7',
    schematicKind: 'loop-4-20ma',
    definition: 'A Smart Temperature Transmitter is a microprocessor-based field instrument mounted either inside a sensor DIN Form B head ("head-mount") or on a DIN rail in a marshalling room, converting low-level RTD resistance or thermocouple millivolts into a linearized, galvanically isolated 4–20 mA / HART (or Foundation Fieldbus/Profibus PA) signal.',
    purpose: 'Eliminates long-distance low-level signal noise, performs sensor-matching Callendar-Van Dusen / ITS-90 linearization, provides CJC, and diagnoses open-sensor / drift faults per NAMUR NE43.',
    workingPrinciple: 'An excitation current or precision 24-bit Sigma-Delta ADC samples the sensor, applies calibration curve coefficients (including custom Callendar-Van Dusen A/B/C matching the specific sensor!), isolates across a transformer/capacitive barrier, and drives a 2-wire loop regulator modulating 4–20 mA while superimposing Bell 202 FSK HART packets.',
    principleSteps: [
      'Universal terminal block accepts 2/3/4-wire RTD, TC, mV, or Ω input.',
      '24-bit Sigma-Delta ADC rejects 50/60 Hz mains hum and samples sensor + CJC.',
      'Microcontroller linearizes via IEC 60751 / ITS-90 / custom CVD match.',
      'Output DAC controls 2-wire 4–20 mA loop current + HART digital diagnostics.',
    ],
    constructionSummary: 'Potted moisture-proof puck (DIN Form B diameter 44 mm) or dual-compartment field-mount Ex d housing with local LCD and external pushbuttons.',
    assemblyArchitecture: 'Two-wire loop-powered architecture draws all operating power (<3.5 mA quiescent!) from the same pair carrying the 4–20 mA measurement.',
    internalComponents: [
      { partCode: '01', name: 'Universal Front-End & 24-bit ΣΔ ADC', material: 'Precision Analog ASIC + CJC Sensor', function: 'Measures μV/mΩ signals with 50/60 Hz line rejection', failureMode: 'Surge/lightning strike blowing front-end protection diodes' },
      { partCode: '02', name: 'Galvanic Isolation Barrier', material: '1.5–2.5 kVrms Transformer/Capacitive Isolator', function: 'Breaks ground loops on grounded thermocouples', failureMode: 'Moisture breakdown reduces isolation rating' },
      { partCode: '03', name: '4–20 mA Loop Regulator & HART Modem', material: 'Current-loop DAC + FSK Bell 202 transceiver', function: 'Sets exact loop current & handles digital HART commands', failureMode: 'Insufficient loop supply voltage (<12 V at terminals)' },
    ],
    typesAndClassification: [
      { type: 'DIN Form B Head-Mount Puck', summary: 'Mounts directly inside sensor terminal head right above thermowell.', typicalRange: '−40 to +85 °C ambient', accuracy: '±0.10 °C digital (Pt100)', bestFor: 'Short sensor wires, noise immunity' },
      { type: 'Field Dual-Compartment Mount', summary: 'Explosion-proof housing with local LCD, dual-sensor hot backup & drift alert.', typicalRange: '−40 to +85 °C ambient', accuracy: '±0.08 °C digital', bestFor: 'Hazardous Zone 1 areas & SIL 2/3 safety loops' },
      { type: 'DIN-Rail Marshalling Mount', summary: 'High-density cabinet rail mount for panel retrofits.', typicalRange: '−20 to +70 °C cabinet', accuracy: '±0.15 °C', bestFor: 'Locations with extreme ambient pipe heat or high vibration' },
    ],
    equations: [
      {
        title: 'NAMUR NE43 Fault Alarm Signaling & Transmitter Transfer',
        latex: 'I_{\\text{out}} = 4 + 16 \\cdot \\frac{T - \\text{LRV}}{\\text{URV} - \\text{LRV}} \\;\\;[\\text{mA}], \\quad \\text{Burnout: } \\le 3.6\\text{ mA (Down) or } \\ge 21.0\\text{ mA (Up)}',
        variables: [
          { symbol: '\\text{LRV}, \\text{URV}', meaning: 'Lower and Upper Range Values calibrated in °C', unit: '°C' },
          { symbol: 'I_{\\text{out}}', meaning: '2-wire loop current (3.8–20.5 mA normal operating band)', unit: 'mA' },
        ],
        derivationSteps: [
          'NAMUR NE43 reserves 3.8–20.5 mA for valid live measurements (slight over/underrange), and ≤3.6 mA or ≥21.0 mA strictly for sensor break / internal fault.',
        ],
      },
    ],
    characteristicCurve: {
      title: 'NAMUR NE43 Current Output Profile (0–200 °C Span)',
      subtitle: 'Distinguishing live measurement band (3.8–20.5 mA) from hardware burnout alarm levels',
      xLabel: 'Process Temp',
      yLabel: 'Loop Current',
      xUnit: '°C',
      yUnit: 'mA',
      series: [{ name: '4–20 mA Scaled Output', color: '#c5f467', points: [{ x: 0, y: 4.0 }, { x: 50, y: 8.0 }, { x: 100, y: 12.0 }, { x: 150, y: 16.0 }, { x: 200, y: 20.0 }] }],
    },
    specifications: [
      { parameter: 'Supply Voltage Requirement', value: '12 – 42 VDC (minimum ~12 V at transmitter terminals)', standardOrNote: 'Must include 250 Ω HART load drop (5 V @ 20 mA)' },
      { parameter: 'Galvanic Isolation', value: '1500 – 2500 VAC input-to-output', standardOrNote: 'Allows grounded thermocouples safely' },
      { parameter: 'Diagnostics', value: 'NAMUR NE43 Upscale (21.5 mA) / Downscale (3.5 mA)', standardOrNote: 'Dual-sensor Hot Backup & Drift Alert' },
    ],
    measurementRange: { typicalSpan: 'Configurable via HART/DTM across −200 to +1800 °C', extremeLimits: 'Electronics ambient −40 to +85 °C', overrangeProtection: 'Reverse polarity & transient surge diodes' },
    accuracyAndSensitivity: { accuracyClass: '±0.08 to ±0.15 °C (Pt100 digital); ±0.03% span D/A', sensitivity: '24-bit internal resolution', repeatability: '±0.05 °C', responseTime: '150–500 ms update rate' },
    advantages: ['Conveys temperature miles away over ordinary copper twisted-pair without noise or voltage drop.', 'Transmitter-Sensor Matching eliminates sensor interchangeability error by programming exact CVD constants.', 'Dual-input models provide automatic switchover ("Hot Backup") if primary sensor fails.'],
    limitations: ['Ambient head limit (+85 °C) prevents mounting directly onto unextended 400 °C steam nozzles.', 'Adds loop cost over wiring RTDs directly to an AI card (though saves multi-core compensating cables!).'],
    applications: [{ industry: 'All Process Plants & SIL Loops', service: 'Reactor runaway shutdown & custody metering', loopTagExample: 'TT-101 / TZT-101', engineeringNote: 'Use head-mount transmitter with 150 mm neck extension above hot insulated pipe.' }],
    calibration: { referenceStandard: 'IEC 61298 / Loop 5-point verification', equipmentRequired: ['Decade resistance box or mV simulator', 'HART communicator (Trex / FieldMate)', 'Precision loop ammeter (250 Ω HART resistor)'], procedureSteps: ['Isolate field sensor and attach precision resistance/mV calibrator.', 'Inject 0%, 25%, 50%, 75%, 100% span; perform Sensor Trim & 4–20 mA D/A Trim only if outside tolerance.'], acceptanceCriteria: 'Loop mA within ±0.02 mA (±0.125% span).' },
    installation: { mechanicalRules: ['Use ≥150 mm lagging extension neck on hot insulated pipes so head temperature stays <85 °C.'], electricalOrImpulseRules: ['Ensure total loop resistance ≤ (V_supply − V_min) / 0.0215 A; include 250 Ω minimum for HART communication!'], commonMistakes: ['Attempting HART communication across a 0 Ω PLC analog input without inserting a 250 Ω resistor!'] },
    troubleshooting: [{ symptom: 'Output stuck at 21.5 mA or 3.5 mA', probableCause: 'NAMUR NE43 sensor burnout alarm triggered by broken wire/open RTD', diagnosticCheck: 'Connect HART communicator to read exact diagnostic code ("Sensor Open / Break")', correctiveAction: 'Inspect sensor terminations inside head' }],
    manufacturers: [
      { vendor: 'Emerson (Rosemount)', modelSeries: 'Rosemount 644 / 3144P Smart Temperature Transmitter', notes: 'Industry benchmark for single/dual sensor matching & SIL 2/3 certification.', sourceLabel: 'Rosemount Temperature Transmitters', sourceUrl: 'https://www.emerson.com/en-us/automation/measurement-instrumentation/temperature-measurement', verificationStatus: 'sourced-reference' },
      { vendor: 'Endress+Hauser', modelSeries: 'iTEMP TMT72 / TMT82 / TMT162', notes: 'HART / PROFIBUS PA / Foundation Fieldbus dual-channel transmitters.', sourceLabel: 'Endress+Hauser iTEMP', sourceUrl: 'https://www.endress.com/en/field-instruments-overview/temperature-measurement', verificationStatus: 'sourced-reference' },
      { vendor: 'Yokogawa', modelSeries: 'YTA610 / YTA710 Temperature Transmitters', notes: 'Dual-sensor input with differential temperature & sensor backup.', sourceLabel: 'Yokogawa Temperature Transmitters', verificationStatus: 'editorial-verification' },
    ],
    comparisons: [{ parameter: 'Direct-Wired Sensor vs Smart Transmitter', thisInstrument: '2-wire 4–20 mA + HART, copper pair, galvanic isolation', peerName: 'Direct-to-DCS AI Card', peerValue: 'Long 3/4-wire or TC extension cable, higher noise risk', engineeringTakeaway: 'Long distances (>30 m) or noisy plants strongly favor head-mounted transmitters.' }],
    interviewQuestions: [{ difficulty: 'Industry-Oriented', question: 'What is "Callendar-Van Dusen Transmitter-Sensor Matching" (CVD matching)?', answer: 'Every real Pt100 slightly deviates from the generic IEC 60751 curve. Calibrating the individual sensor in a lab yields its exact R₀, A, B, C constants stamped on its tag. Programming those 4 constants into a smart transmitter eliminates the sensor’s interchangeability error, achieving <±0.05 °C loop accuracy!' }],
    numericalProblems: [{ title: 'Loop Load Resistance Budget', statement: 'A head-mount transmitter needs minimum 12.0 VDC at its terminals and draws up to 21.5 mA (upscale burnout) from a 24.0 VDC supply. What is the maximum total loop resistance (cable + PLC input resistor)?', given: ['V_supply = 24.0 V', 'V_min = 12.0 V', 'I_max = 0.0215 A'], steps: ['R_max = (V_supply − V_min) / I_max = (24.0 − 12.0) / 0.0215 = 558.1 Ω'], answer: '558.1 Ω maximum loop resistance (must be ≥ 250 Ω for HART).' }],
    quickRevisionNotes: ['NAMUR NE43: 3.8–20.5 mA valid; ≤3.6 mA or ≥21.0 mA = fault alarm.', 'Requires ≥250 Ω loop impedance for HART FSK modulation.', 'Never mount head transmitter directly on 300 °C pipe without thermal lagging neck!'],
    sources: [{ label: 'NAMUR NE43', standardOrDoc: 'Standardization of the Signal Level for the Failure Information of Digital Transmitters' }],
  }),
];

