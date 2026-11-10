import type { CurriculumSubjectDetail } from '@/types/curriculum';

export const SEM3_SUBJECTS: CurriculumSubjectDetail[] = [
  // =========================================================================
  // A. TRANSDUCERS AND SIGNAL CONDITIONING (ICDC0205)
  // =========================================================================
  {
    id: 'nitj-sem3-tsc',
    semester: 3,
    displaySemesterLabel: 'Semester III',
    code: 'ICDC0205',
    name: 'Transducers and Signal Conditioning',
    shortName: 'Transducers & Signal Cond.',
    credits: 4,
    category: 'Core ICE',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Foundational ICE course covering static/dynamic instrument behavior, primary mechanical/thermal/optical/smart transducers, and analog bridge, op-amp, instrumentation amplifier, filter, and grounding conditioning.',
    units: [
      {
        unitNumber: 1,
        title: 'Characteristics of Instruments and Measurement Systems',
        hours: 8,
        summary: 'Architecture of measurement chains, active/passive classification, static metrics, dynamic order models, selection criteria, and calibration.',
        topics: [
          {
            id: 'tsc-u1-block',
            title: 'Instrumentation Block Diagram, Classification & Terminology',
            summary: 'Primary sensing element → variable conversion → signal conditioning → presentation/telemetry; active vs passive, analog vs digital transducers.',
            explanation:
              'An instrumentation system maps a physical measurand (temperature, force, displacement) via a primary sensing element into an intermediate physical variable, converts it with a transduction stage (resistive, capacitive, inductive, piezoelectric, thermoelectric), conditions noise and impedance, and displays or transmits calibrated output (4–20 mA / digital). Passive transducers (RTD, strain gauge) require external excitation power; active transducers (thermocouple, piezoelectric crystal) self-generate electrical energy.',
            workingPrinciple:
              'Each stage preserves information fidelity while isolating loading impedance: Z_input(next stage) >> Z_output(previous stage) prevents measurement loading error.',
            inputOutput: { input: 'Physical Measurand (x)', output: 'Calibrated Electrical/Display Signal (y)' },
            equations: [
              { label: 'Voltage Loading Error', latex: 'V_{\\text{meas}} = V_{\\text{true}} \\cdot \\frac{R_{\\text{load}}}{R_{\\text{source}} + R_{\\text{load}}}' },
            ],
            realWorldApplications: {
              summary: 'Defines loop architecture from field sensor element to DCS/PLC Analog Input card in every continuous process plant.',
              industries: ['Oil & Gas', 'Refining', 'Power Generation', 'Manufacturing'],
              examples: ['Field Pt100 element → 3-wire copper lead → head-mounted 4–20 mA HART transmitter → DCS AI card'],
            },
            crossLinks: [
              { label: 'Industrial Measurement Systems (Sem IV)', targetSubjectId: 'nitj-sem4-ims', note: 'Dynamic errors and industrial compensation build directly on Unit 1 models.' },
              { label: 'Testing & Calibration (Supplementary)', targetSubjectId: 'nitj-supp-cal', note: 'Calibration traceability extends terminology into ISO/IEC 17025.' },
            ],
            linkedPlatformRoute: '/instrumentation',
            linkedPlatformLabel: 'Browse 7 Knowledge Hubs',
          },
          {
            id: 'tsc-u1-static-dyn',
            title: 'Static & Dynamic Characteristics, Selection Criteria & Calibration',
            summary: 'Accuracy, precision, sensitivity, linearity, hysteresis, deadband, drift; zero/first/second-order step response; sensor selection & calibration.',
            explanation:
              'Static characteristics describe steady-state input-output behavior: accuracy (closeness to true value), precision (repeatability across trials), static sensitivity K = dy/dx, threshold/resolution, hysteresis (loading vs unloading loop gap), deadband, and zero/span drift. Dynamic characteristics govern transient tracking via differential equations: zero-order (potentiometer), first-order (bare thermometer/RTD with time constant τ = mC/hA), and second-order (spring-mass diaphragm accelerometer characterized by natural frequency ω_n and damping ratio ζ ≈ 0.65–0.707 for widest flat bandwidth).',
            workingPrinciple:
              'First-order instruments reach 63.2% of a step change in one time constant τ (99.3% in 5τ). Calibration compares instrument output against a certified reference standard (TUR ≥ 4:1) under controlled ascending/descending sweeps.',
            equations: [
              { label: 'First-Order Step & Sinusoidal Amplitude Ratio', latex: 'y(t) = K x_0\\left(1 - e^{-t/\\tau}\\right), \\qquad \\left|\\frac{Y(j\\omega)}{X(j\\omega)}\\right| = \\frac{K}{\\sqrt{1 + (\\omega\\tau)^2}}' },
              { label: 'Second-Order Transfer Function', latex: 'G(s) = \\frac{K\\,\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}' },
            ],
            numericals: [
              {
                title: 'First-Order Thermal Time Constant Lag',
                problem: 'A thermometer (τ = 4.0 s) initially at 25 °C is plunged into 125 °C oil. Find its indicated temperature after 4.0 s and 8.0 s.',
                steps: [
                  'At t = τ = 4.0 s: T = 25 + (125 − 25)(1 − e⁻¹) = 25 + 63.21 = 88.2 °C.',
                  'At t = 2τ = 8.0 s: T = 25 + 100(1 − e⁻²) = 25 + 86.47 = 111.5 °C.',
                ],
                result: '88.2 °C at 4 s; 111.5 °C at 8 s.',
              },
            ],
            realWorldApplications: {
              summary: 'Guides instrument engineers when specifying response speed (τ), accuracy class, wetted materials, and calibration intervals on EPC datasheets.',
              industries: ['Chemicals', 'Pharmaceuticals', 'Refineries'],
              examples: ['Selecting ζ ≈ 0.7 oil-filled accelerometers', 'Sizing bare vs thermowell RTD τ₆₃% for exothermic runaway protection'],
            },
            linkedPlatformRoute: '/toolbox/measurement-error',
            linkedPlatformLabel: 'Open Error & TUR Calculator',
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Measurement of Displacement, Strain, Force and Pressure',
        hours: 11,
        summary: 'Potentiometers, variable inductance, LVDT, piezoelectric sensors, bonded strain gauges, load cells, manometers, capacitive pressure, accelerometers, velocity & vibration.',
        topics: [
          {
            id: 'tsc-u2-lvdt-pot',
            title: 'Resistive Potentiometers, Variable Induction & LVDT',
            summary: 'Linear/rotary slide-wire pots vs frictionless magnetic-core Linear Variable Differential Transformer (LVDT) & variable inductance pickups.',
            explanation:
              'Resistive potentiometers convert displacement x into voltage ratio V_out/V_in = x/L (zero-order static element, subject to wiper friction/wear and loading error when R_load is too small). Variable inductance pickups vary coil self-inductance L = N²/ℜ by shifting air-gap reluctance ℜ. The LVDT pairs one central AC-excited primary coil (1–10 kHz) with two identical series-opposed secondary coils around a movable high-permeability ferromagnetic core: at mechanical null, E_S1 = E_S2 ⇒ V_diff = 0; shifting left/right induces linear AC amplitude with 180° phase flip across null (decoded by a phase-sensitive demodulator).',
            workingPrinciple:
              'Moving the soft-iron core alters mutual flux linkage M₁ vs M₂ symmetrically; phase-sensitive demodulation recovers both stroke magnitude and sign (+/- direction).',
            inputOutput: { input: 'Linear Displacement ±x (mm)', output: 'Phase-Sensitive AC/DC Voltage (mV/V/mm)' },
            equations: [
              { label: 'LVDT Differential Output Voltage', latex: 'V_{\\text{diff}}(x) = E_{S1} - E_{S2} = K_{\\text{LVDT}} \\cdot x \\cdot V_p \\sin(\\omega t + \\phi)' },
            ],
            comparison: {
              peer: 'Resistive Potentiometer',
              takeaway: 'LVDT has zero mechanical wiper friction, infinite resolution, and isolates coil from moving core, whereas potentiometer is cheaper/DC-only but wears out under vibration.',
            },
            realWorldApplications: {
              summary: 'Steam turbine governor valve stem position feedback, hydraulic servo actuators, and precision CNC/aerospace gauging.',
              industries: ['Power Generation', 'Aerospace', 'Manufacturing'],
              examples: ['Turbine control valve stroke LVDTs in power plants', 'CNC tool-wear probe heads'],
            },
            interviewItems: [
              {
                level: 'Intermediate',
                question: 'Why does an LVDT still show a tiny non-zero "residual null voltage" at exact mechanical center, and how is it removed?',
                answer: 'Slight winding asymmetry, odd harmonics in excitation, and inter-winding stray capacitance leave a small quadrature/harmonic voltage at null. Synchronous phase-sensitive demodulation + low-pass filtering rejects quadrature harmonics cleanly.',
              },
            ],
          },
          {
            id: 'tsc-u2-strain-load',
            title: 'Strain Measurement, Strain Gauges, Force, Torque & Load Cells',
            summary: 'Metallic foil & semiconductor strain gauges (Gauge Factor), Poisson effect, beam/shaft torque rosettes, and Wheatstone load cells.',
            explanation:
              'When a structural member stretches under axial strain ε = ΔL/L, its cross-section contracts laterally by Poisson’s ratio ν (Δd/d = −ν·ε), increasing wire resistance via both geometry and piezoresistive resistivity shift (Δρ/ρ). Bonded metal foil gauges (Constantan/Karma) exhibit G_f ≈ 2.0, while p/n-doped silicon semiconductor gauges reach G_f ≈ 100–150 (at higher temperature sensitivity). Mounting 4 active gauges in tension/compression onto calibrated steel/aluminum spring elements yields industrial strain-gauge Load Cells (tension, compression, shear-beam) and rotating shaft torque transducers.',
            workingPrinciple:
              'Four active gauges arranged as two tensile (+ΔR) and two compressive (−ΔR) arms in a full Wheatstone bridge quadruple bridge output (V_out = V_exc·G_f·ε) and cancel ambient thermal expansion.',
            inputOutput: { input: 'Force / Torque / Microstrain (με)', output: 'Differential Bridge Output (typically 2–3 mV/V)' },
            equations: [
              { label: 'Gauge Factor Derivation', latex: 'G_f = \\frac{\\Delta R / R}{\\varepsilon} = 1 + 2\\nu + \\frac{\\Delta\\rho / \\rho}{\\varepsilon}' },
              { label: '45° Shaft Torque Principal Strain', latex: '\\varepsilon_{\\pm 45^\\circ} = \\pm \\frac{\\tau_{\\max}}{2 G_{\\text{shear}}} = \\pm \\frac{16 T}{\\pi d^3 E}(1 + \\nu)' },
            ],
            numericals: [
              {
                title: 'Resistance Shift of Bonded Foil Strain Gauge',
                problem: 'A 350 Ω strain gauge (G_f = 2.05) undergoes 600 με tensile strain. Compute ΔR and quarter-bridge output with V_exc = 10 V.',
                steps: [
                  'ΔR = R · G_f · ε = 350 × 2.05 × 600×10⁻⁶ = 0.4305 Ω.',
                  'Quarter-bridge V_out ≈ V_exc · (ΔR / 4R) = 10 × (0.4305 / 1400) = 3.075 mV.',
                ],
                result: 'ΔR = 0.431 Ω; V_out = 3.08 mV.',
              },
            ],
            realWorldApplications: {
              summary: 'Industrial weighbridges, reactor batch tank weighing (inventory without wetted probes!), crane overload protection, and rotating turbine shaft dynamometers.',
              industries: ['Chemicals', 'Steel & Cement', 'Pharmaceuticals', 'Manufacturing'],
              examples: ['Batch reactor vessel load cells for sterile chemical charging', 'Highway truck weighbridges'],
            },
            linkedPlatformRoute: '/toolbox/wheatstone-bridge',
            linkedPlatformLabel: 'Open Wheatstone Solver',
          },
          {
            id: 'tsc-u2-pressure-vib',
            title: 'Pressure Elements, Piezoelectric, Capacitive, Accelerometers & Vibration',
            summary: 'Manometers, Bourdon/diaphragm/bellows elastic cells, capacitive & piezoelectric pressure, seismic accelerometers & velocity pickups.',
            explanation:
              'Pressure transducers measure P = F/A using fluid columns (U-tube/inclined manometers), elastic deformation (Bourdon, diaphragm, bellows), differential capacitance cells, or quartz piezoelectric crystals (Q = d·F). Vibration and seismic acceleration sensors mount a proof mass m on a spring-damper inside a housing: well BELOW natural frequency ω_n (ω << ω_n), relative mass force m·a deflects a piezoelectric crystal proportionally to Acceleration (accelerometer); well ABOVE a soft spring’s low natural frequency (ω >> ω_n), the mass stays stationary in space while a coil/magnet senses relative casing Velocity!',
            workingPrinciple:
              'Piezoelectric accelerometers and pressure sensors self-generate picocoulomb charge under dynamic acceleration/pressure pulses; high-Z charge/IEPE amplifiers prevent low-frequency RC roll-off.',
            equations: [
              { label: 'Piezo Charge & Accelerometer Seismic Mass', latex: 'Q = d_{33} F, \\qquad |x_{\\text{rel}}| \\approx \\frac{\\ddot{y}}{\\omega_n^2}\\;(\\omega \\ll \\omega_n)' },
            ],
            realWorldApplications: {
              summary: 'Refinery compressor bearing vibration trips (API 670), combustion knock detection, cleanroom furnace draft DP, and pipeline pressure.',
              industries: ['Oil & Gas', 'Power Generation', 'Aerospace', 'Automotive'],
              examples: ['Bently Nevada piezo accelerometers & eddy-current vibration probes on centrifugal compressors'],
            },
            linkedPlatformRoute: '/instrumentation/pressure/pressure-transmitters',
            linkedPlatformLabel: 'Explore 3D DP Transmitter',
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Temperature Measurement',
        hours: 7,
        summary: 'Non-electrical thermometers, bimetallic strips, resistance thermometers (RTDs), 2/3/4-wire configurations, and NTC/PTC thermistors.',
        topics: [
          {
            id: 'tsc-u3-nonelec-bimetal',
            title: 'Non-Electrical Thermometers & Bimetallic Strips',
            summary: 'Liquid-in-glass, filled-capillary thermal systems (vapor/gas/liquid), and differential-expansion Invar/brass bimetallic helices.',
            explanation:
              'Non-electrical thermal gauges convert heat directly into fluid expansion, vapor pressure, or mechanical bending without external power. Bimetallic thermometers bond low-expansion Invar (36% Ni-Fe, α ≈ 1.2×10⁻⁶/°C) to high-expansion brass or 304SS (α ≈ 18×10⁻⁶/°C) wound into a helical stem coil driving a local dial pointer.',
            workingPrinciple:
              'Differential linear thermal elongation forces the bonded strip to curve with radius inversely proportional to (α₂ − α₁)·ΔT.',
            equations: [{ label: 'Bimetallic Curvature', latex: '\\frac{1}{R} \\approx \\frac{3(\\alpha_2 - \\alpha_1)\\Delta T}{2h}' }],
            realWorldApplications: {
              summary: 'Zero-power local temperature indicators on pumps, lube-oil skids, HVAC chillers, and transformer alarm switches.',
              industries: ['Refineries', 'Power Generation', 'HVAC & Utilities'],
              examples: ['Every-angle bimetallic dial thermometers mounted inside pipe thermowells alongside DCS transmitters'],
            },
            linkedPlatformRoute: '/instrumentation/temperature/bimetallic-thermometers',
            linkedPlatformLabel: 'Open Bimetallic Topic Page',
          },
          {
            id: 'tsc-u3-rtd',
            title: 'Resistance Temperature Detectors (2-Wire, 3-Wire & 4-Wire RTDs)',
            summary: 'Pt100/Pt1000 Callendar-Van Dusen physics, 2-wire lead error, 3-wire Wheatstone cancellation, and 4-wire Kelvin zero-error topology.',
            explanation:
              'Pure platinum RTDs (IEC 60751: R₀ = 100.00 Ω at 0 °C, α = 0.00385 Ω/Ω/°C) increase resistance deterministically with lattice phonon scattering. In 2-wire wiring, both copper lead resistances (2·R_lead) add directly onto R_RTD (+1 °C per 0.385 Ω!). In 3-wire RTDs, two matched common leads sit in adjacent Wheatstone arms so equal cable drops cancel; in 4-wire Kelvin RTDs, two outer leads carry excitation current while two high-impedance inner leads measure pure voltage across the element itself—achieving complete lead-resistance immunity regardless of mismatch.',
            workingPrinciple:
              'Excitation current (0.1–1.0 mA to avoid I²R self-heating) converts ΔR into voltage linearized via the Callendar-Van Dusen polynomial.',
            inputOutput: { input: 'Temperature t (−200 to +600/850 °C)', output: 'Resistance R(t) (Ω)' },
            equations: [
              { label: 'Callendar-Van Dusen (t ≥ 0 °C)', latex: 'R(t) = R_0(1 + A t + B t^2), \\quad A = 3.9083\\times10^{-3},\\; B = -5.775\\times10^{-7}' },
            ],
            comparison: {
              peer: 'Thermocouple (Covered in detail in Sem IV ICDC0208)',
              takeaway: 'RTD delivers ~10× better accuracy/stability below 600 °C using standard copper wire; Thermocouple is self-powered and reaches >1600 °C but requires CJC and alloy extension wire.',
            },
            realWorldApplications: {
              summary: 'Custody metering temperature compensation, distillation column trays, pharmaceutical SIP/CIP autoclaves, and turbine bearings.',
              industries: ['Oil & Gas', 'Pharmaceuticals', 'Chemicals', 'Power'],
              examples: ['4-wire Class A Pt100 inside drilled bar-stock thermowell with head-mounted 4–20 mA HART transmitter'],
            },
            linkedPlatformRoute: '/instrumentation/temperature/rtd',
            linkedPlatformLabel: 'Inspect 3D Pt100 RTD CAD Model',
          },
          {
            id: 'tsc-u3-thermistor',
            title: 'Thermistors (NTC & PTC Semiconductor Resistors)',
            summary: 'Exponential negative-coefficient metal-oxide beads (Steinhart-Hart) and positive-coefficient barium titanate trip switches.',
            explanation:
              'Thermistors are sintered ceramic semiconductors whose carrier concentration rises exponentially with temperature. NTC beads offer ~−4%/°C sensitivity (~−440 Ω/°C for 10 kΩ @ 25 °C) ideal over narrow spans (−40 to +150 °C) using simple 2-wire leads. Switching PTCs stay low-ohmic until a sharp Curie threshold where resistance jumps 10⁴× to protect electric motor windings.',
            workingPrinciple:
              'Thermal excitation promotes valence electrons across the oxide bandgap; 3-coefficient Steinhart-Hart equation fits 1/T within ±0.005 °C.',
            equations: [{ label: 'Beta & Steinhart-Hart', latex: 'R(T) = R_0 \\exp\\!\\left[\\beta\\left(\\frac{1}{T} - \\frac{1}{T_0}\\right)\\right], \\quad \\frac{1}{T} = A + B\\ln R + C(\\ln R)^3' }],
            realWorldApplications: {
              summary: 'Thermocouple Cold-Junction Compensation (CJC) terminal monitoring, EV battery BMS, HVAC ducts, and motor stator PTC trip protection.',
              industries: ['Electronics', 'EV / Power Drives', 'HVAC', 'Medical'],
              examples: ['NTC sensor bonded inside PLC AI terminal strip for TC CJC compensation'],
            },
            linkedPlatformRoute: '/instrumentation/temperature/thermistor',
            linkedPlatformLabel: 'Open Thermistor Topic Page',
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Miscellaneous Transducers',
        hours: 8,
        summary: 'Optical (photo-emissive, photoconductive, photovoltaic), digital & optical/shaft encoders, Hall-effect, magnetostrictive, electrochemical, and smart sensors.',
        topics: [
          {
            id: 'tsc-u4-optical-digital',
            title: 'Optical Transducers & Digital Optical/Shaft Encoders',
            summary: 'Photo-emissive (PMT), photoconductive (LDR), photovoltaic/photodiode cells, and incremental/absolute Gray-code shaft encoders.',
            explanation:
              'Optical sensors map photon flux via external photoemission (vacuum phototubes/PMTs for ultra-low UV/scintillation light), internal resistance drop in CdS/CdSe photoconductors, or PN-junction electron-hole generation (photodiodes/photovoltaic cells). Digital Shaft Encoders convert angular position into crisp pulses: Incremental Encoders output two 90°-shifted square waves (Channels A & B quadrature for speed + CW/CCW direction + Z index), whereas Absolute Encoders read concentric multi-track Gray-code rings so position is retained immediately upon power restoration without multi-bit transition glitches.',
            workingPrinciple:
              'Quadrature A/B edge sequence detects rotation direction; Gray code changes strictly 1 bit per angular step to prevent spurious binary transition readings.',
            realWorldApplications: {
              summary: 'Servo motor positioning, CNC spindles, conveyor belt speed totalizers, flame UV scanners, and turbidimeters.',
              industries: ['Manufacturing', 'Robotics', 'Power Boilers', 'Packaging'],
              examples: ['1024-PPR quadrature optical encoder on VFD closed-loop vector motor shaft'],
            },
          },
          {
            id: 'tsc-u4-hall-mag-echem-smart',
            title: 'Hall-Effect, Magnetostrictive, Electrochemical & Smart Sensors',
            summary: 'Lorentz Hall voltage, Wiedemann magnetostrictive level/position, Nernst/amperometric electrochemical probes, and IEEE 1451 smart nodes.',
            explanation:
              'Hall-effect sensors generate transverse voltage V_H = (I·B)/(n·q·t) proportional to magnetic field B perpendicular to bias current—enabling non-contact DC/AC clamp current sensing and brushless motor commutation. Magnetostrictive sensors launch a current pulse down a ferromagnetic waveguide wire; interaction with a movable float magnet induces a torsional Wiedemann acoustic return pulse (±1 mm level accuracy!). Electrochemical cells convert ionic concentration into potential/current (pH, DO, CO/H₂S). Smart sensors integrate sensing element, ADC, digital compensation lookup, self-diagnostics, and HART/Fieldbus/IO-Link communications inside one head.',
            workingPrinciple:
              'Combining MEMS/digital linearization with non-volatile TEDS (Transducer Electronic Data Sheet) calibration curves eliminates manual scaling mismatches.',
            equations: [{ label: 'Hall Voltage', latex: 'V_H = \\frac{R_H \\cdot I \\cdot B}{t}' }],
            realWorldApplications: {
              summary: 'Closed-loop Hall DC bus current transducers in VFD drives, magnetostrictive tank gauging, toxic H₂S gas detectors, and smart HART transmitters.',
              industries: ['Oil & Gas', 'Power Electronics', 'Water Treatment', 'Automation'],
              examples: ['Magnetostrictive rod clamped onto Magnetic Level Gauge in refinery LPG bullets'],
            },
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Signal Conditioning',
        hours: 8,
        summary: 'AC/DC bridges, op-amps, 3-op-amp instrumentation amplifiers, charge amplifiers, active/passive filters, EMI interference, grounding & shielding.',
        topics: [
          {
            id: 'tsc-u5-bridges-amps',
            title: 'AC/DC Bridges, Op-Amps, Instrumentation Amps & Charge Amplifiers',
            summary: 'Bridge excitation & nonlinearity, 3-op-amp INA (G = 1 + 2R₁/R_G, >100 dB CMRR), and capacitive-feedback piezo charge amplifiers.',
            explanation:
              'Low-level bridges and thermocouples sit on top of common-mode voltage and suffer cable loading. A 3-op-amp Instrumentation Amplifier feeds both sensor wires into high-impedance non-inverting buffers (A₁, A₂) with gain set by a single resistor R_G before subtracting common-mode noise cleanly (>100–120 dB CMRR). For high-impedance capacitive/piezoelectric crystals, a Charge Amplifier puts capacitor C_f across an inverting op-amp (V_out = −Q/C_f)—making sensitivity completely independent of coaxial cable length capacitance!',
            workingPrinciple:
              'Virtual ground at the inverting node forces all piezoelectric charge Q onto C_f rather than stray cable capacitance C_cable.',
            equations: [
              { label: '3-Op-Amp INA & Charge Amp', latex: 'V_{\\text{INA}} = \\left(1 + \\frac{2R_1}{R_G}\\right)(V_+ - V_-), \\qquad V_{\\text{charge}} = -\\frac{Q}{C_f}' },
            ],
            realWorldApplications: {
              summary: 'Front-end analog IC stages inside every smart load-cell weighbridge, thermocouple AI card, and gas-turbine piezo vibration monitor.',
              industries: ['Process Automation', 'Aerospace', 'Power Turbines', 'Medical'],
              examples: ['INA128/AD8421 bridge frontend', 'Charge amplifier on gas turbine combustion pressure sensor'],
            },
            linkedPlatformRoute: '/instrumentation/signal-conditioning/instrumentation-amplifier',
            linkedPlatformLabel: 'Open INA Detailed Spec',
          },
          {
            id: 'tsc-u5-filter-emi',
            title: 'Filters, Interference Mitigation, Grounding & Shielding',
            summary: 'Anti-aliasing Sallen-Key/Notch filters, capacitive/inductive/common-mode EMI, single-point shield grounding & twisted pairs.',
            explanation:
              'Industrial plants flood low-level mV wires with 50/60 Hz hum, VFD PWM edges, and earth potential differences. Differential magnetic coupling is cancelled by twisted-pair wiring (equal and opposite loop area twists); capacitive electric coupling is blocked by conductive foil/braided cable shields grounded at ONE single point ONLY (marshalling cabinet earth—grounding both ends forms a 50 Hz ground loop!); high-frequency noise above f_s/2 must be removed by analog anti-aliasing low-pass filters BEFORE ADC sampling.',
            workingPrinciple:
              'Single-point shield bonding drains capacitive E-field noise safely while breaking closed ground-current loops.',
            realWorldApplications: {
              summary: 'IEC instrumentation cable tray routing separating 24 V/mV twisted shielded pairs ≥300 mm away from 415 V/6.6 kV motor feeders.',
              industries: ['All Process Plants', 'EPC Projects', 'Substations'],
              examples: ['Marshalling cabinet single-point IS/shield earth bar in refineries (EIL / Reliance standards)'],
            },
            linkedPlatformRoute: '/instrumentation/signal-conditioning/filters',
            linkedPlatformLabel: 'Open Analog Filters Page',
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'RTD vs Thermocouple',
        leftName: 'Pt100 RTD',
        rightName: 'Type-K Thermocouple',
        rows: [
          { criterion: 'Physical Principle', leftValue: 'Resistance rises with lattice scattering (passive)', rightValue: 'Seebeck voltage across dissimilar junction gradient (active)' },
          { criterion: 'Range & Accuracy', leftValue: '−200 to +600/850 °C · ±0.15 °C (Class A)', rightValue: '−200 to +1260 °C · ±1.5 °C' },
          { criterion: 'Wiring & CJC', leftValue: 'Standard copper 3/4-wire; NO CJC needed', rightValue: 'Requires matching KX alloy wire + Cold-Junction Comp' },
        ],
      },
      {
        title: 'LVDT vs Resistive Potentiometer',
        leftName: 'LVDT',
        rightName: 'Potentiometer',
        rows: [
          { criterion: 'Friction & Life', leftValue: 'Zero mechanical sliding contact; ultra-long cycle life', rightValue: 'Wiper rubs resistive track; wears under vibration' },
          { criterion: 'Excitation & Output', leftValue: 'Needs AC excitation + phase-sensitive demodulator', rightValue: 'Simple DC ratio output; zero-order response' },
        ],
      },
      {
        title: 'Strain Gauge vs Piezoelectric Transducer',
        leftName: 'Strain Gauge Bridge',
        rightName: 'Piezoelectric Crystal',
        rows: [
          { criterion: 'Static DC Measurement', leftValue: 'True static DC + moderate dynamic (<10 kHz)', rightValue: 'Dynamic AC pulses ONLY (charge leaks at DC!)' },
          { criterion: 'Power & Rigidity', leftValue: 'Passive (needs bridge V_exc); measurable elastic flex', rightValue: 'Self-generating; virtually rigid (>50 kHz resonance)' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-tsc-1',
        level: 'Beginner',
        topic: '3-Wire RTD Compensation',
        question: 'Why does a 2-wire Pt100 over-read temperature across a 100-meter field cable, and how does 3-wire wiring fix it?',
        options: [
          'Two leads add 2·R_lead in series with R_RTD; 3-wire places two matched leads into adjacent bridge ratio arms to cancel out.',
          '2-wire uses aluminum cable; 3-wire doubles platinum alpha to 0.0077.',
        ],
        correctIndex: 0,
        answer: '3-wire places two equal leads in opposing Wheatstone ratio arms so equal lead resistances subtract cleanly.',
        principle: 'Every 0.385 Ω uncompensated lead error shifts a Pt100 by +1.0 °C.',
        followUpIfCorrect: 'Great! Now suppose one of the two common red terminal screws loosens slightly and adds 0.77 Ω contact resistance to ONLY ONE leg. What happens to the 3-wire reading?',
        followUpIfReview: 'Think of the bridge ratio: L1 sits in the sensor arm while L2 sits in the reference arm. If L1 = L2, they subtract identically. What happens if one terminal corrodes and breaks that equality?',
        followUpAnswer: 'Bridge symmetry breaks—causing a +2.0 °C (if L1 rises) or −2.0 °C (if L2 rises) error! That is why high-precision labs upgrade to 4-wire Kelvin connections where lead mismatch causes ZERO error.',
      },
      {
        id: 'sim-tsc-2',
        level: 'Intermediate',
        topic: 'Charge Amplifier vs Coaxial Cable',
        question: 'When connecting a piezoelectric pressure/vibration sensor via a 20-meter coaxial cable, why choose a Charge Amplifier over a raw Voltage Amplifier?',
        options: [
          'In a voltage amp, cable capacitance divides down sensor voltage V = Q/(C_sensor + C_cable); in a charge amp, V_out = −Q/C_f is independent of C_cable!',
          'Charge amps eliminate the need for any coaxial shielding.',
        ],
        correctIndex: 0,
        answer: 'Charge amplifier virtual ground transfers all charge Q onto fixed feedback C_f, making gain immune to cable length capacitance.',
        principle: 'Inverting op-amp virtual short clamps cable node at 0 V so stray C_cable never charges up.',
        followUpIfCorrect: 'Spot on! Now what happens if oil or fingerprint moisture drops the sensor connector insulation resistance from 10¹² Ω down to 10⁷ Ω?',
        followUpIfReview: 'Remember V = Q / C_total for a voltage amp! Wait: what role does insulation resistance play in holding charge Q across low frequencies?',
        followUpAnswer: 'Lower insulation resistance accelerates charge leakage (smaller τ = R·C), lifting f_low cutoff and causing low-frequency pulses to droop rapidly toward zero!',
      },
    ],
  },

  // =========================================================================
  // B. ANALOG AND DIGITAL ELECTRONICS (ECDC0213)
  // =========================================================================
  {
    id: 'nitj-sem3-ade',
    semester: 3,
    displaySemesterLabel: 'Semester III',
    code: 'ECDC0213',
    name: 'Analog and Digital Electronics',
    shortName: 'Analog & Digital Electronics',
    credits: 4,
    category: 'Electronics',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Covers BJT/FET small-signal hybrid modeling, Class A/B/AB/C power stages, feedback & oscillators, linear/nonlinear op-amp topologies, 555 timer & PLL ICs, combinational/sequential logic, and DAC/ADC data conversion for embedded instrumentation.',
    units: [
      {
        unitNumber: 1,
        title: 'Transistors (BJT Hybrid Model, JFET & MOSFET)',
        hours: 8,
        summary: 'BJT review, small-signal low-frequency h-parameter model, CE/CC/CB hybrid analysis, JFET & enhancement/depletion MOSFET operation.',
        topics: [
          {
            id: 'ade-u1-bjt-fet',
            title: 'BJT Hybrid Model, JFET & MOSFET Characteristics',
            summary: 'h_ie, h_fe, h_re, h_oe small-signal modeling vs voltage-controlled pinch-off JFET and insulated-gate MOSFET devices.',
            explanation:
              'At low audio/instrumentation frequencies, a biased BJT linearizes around its Q-point via a two-port hybrid network: input impedance h_ie = β·r_e, reverse voltage feedback h_re (often neglected), current gain h_fe = β, and output conductance h_oe = 1/r_o. In contrast, JFETs and MOSFETs control drain current I_D via electric field V_GS with near-infinite (>10¹² Ω) DC gate impedance—making CMOS/JFET ideal for pH electrometer buffers and low-loss PLC solid-state DC outputs (R_DS(on) in mΩ).',
            workingPrinciple:
              'In saturation (pinch-off), MOSFET I_D = ½ μ_n C_ox (W/L)(V_GS − V_th)² behaves as a high-Z transconductance amplifier (g_m = ∂I_D/∂V_GS).',
            equations: [
              { label: 'CE Hybrid Voltage Gain (simplified)', latex: 'A_v \\approx -\\frac{h_{fe} (R_C \\parallel R_L)}{h_{ie}}, \\qquad I_{D,\\text{sat}} = K_n (V_{GS} - V_{th})^2' },
            ],
            realWorldApplications: {
              summary: '24 VDC PLC transistor digital output stages (MOSFET low-side drivers), 4–20 mA current-regulator pass transistors, and high-Z pH JFET front-ends.',
              industries: ['Industrial PLCs', 'Smart Transmitters', 'Power Electronics'],
              examples: ['24 VDC Sourcing/Sinking PLC output cards driving solenoid valves with flyback protection'],
            },
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Power and Multistage Amplifiers',
        hours: 6,
        summary: 'Class A, B, AB, and C power amplifier efficiency vs distortion; RC, transformer, and direct-coupled multistage cascades.',
        topics: [
          {
            id: 'ade-u2-power-multi',
            title: 'Class A, B, AB, C Power Amplifiers & Multistage Coupling',
            summary: 'Conduction angles (360°, 180°, >180°, <180°), thermal crossover distortion fixes (Class AB diode bias), and coupling frequency limits.',
            explanation:
              'Power stages trade linearity for efficiency: Class A conducts full 360° (max 25% resistive / 50% transformer efficiency, zero crossover distortion); Class B push-pull conducts 180° (max π/4 = 78.5% efficiency, suffers deadzone crossover distortion at ±0.7 V); Class AB uses diode biasing to eliminate crossover distortion cleanly; Class C conducts <180° into a tuned LC tank (>85% efficiency for RF/ultrasonic transmitters). Multistage cascades use RC coupling (blocks DC bias, passes AC), transformer coupling (impedance matching), or direct DC coupling (mandatory for DC sensor amplifiers!).',
            workingPrinciple:
              'Overall multistage gain multiplies stage gains (A_v = A_v1 · A_v2), while high-frequency −3 dB bandwidth narrows slightly due to cascaded poles.',
            equations: [{ label: 'Class B Theoretical Efficiency', latex: '\\eta_{\\max} = \\frac{\\pi}{4} \\cdot \\frac{V_p}{V_{CC}} \\approx 78.5\\%' }],
            realWorldApplications: {
              summary: 'Driving 40–100 kHz ultrasonic level/flow transducers, LVDT AC primary oscillators, and electromagnetic coil excitation drivers.',
              industries: ['Ultrasonics', 'Industrial Drives', 'Telemetry'],
              examples: ['Class AB push-pull stage driving magmeter excitation saddle coils'],
            },
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Feedback Amplifiers and Oscillators',
        hours: 6,
        summary: 'Four negative feedback topologies (V-series, V-shunt, I-series, I-shunt) and Barkhausen oscillation criteria (Wien, RC Phase-Shift, Hartley/Colpitts/Crystal).',
        topics: [
          {
            id: 'ade-u3-feedback-osc',
            title: 'Feedback Topologies & Barkhausen Oscillation Criterion',
            summary: 'How series vs shunt sampling/mixing transforms Z_in & Z_out, plus positive-feedback sustained sine wave generation.',
            explanation:
              'Negative feedback trades excess open-loop gain A for precise closed-loop gain A/(1 + Aβ), wider bandwidth (×(1+Aβ)), lower harmonic distortion, and tailored port impedances: Series mixing RAISES input Z while Shunt mixing LOWERS input Z; Voltage sampling LOWERS output Z (ideal voltage source) while Current sampling RAISES output Z (ideal 4–20 mA current transmitter!). Flipping feedback positive at loop gain |Aβ| = 1 and phase shift ∠Aβ = 0° (360°) satisfies Barkhausen’s Criterion to sustain precision sine-wave oscillators (Wien bridge f₀ = 1/2πRC, Colpitts, Quartz crystal).',
            workingPrinciple:
              'Current-series feedback inside a 4–20 mA output stage stabilizes load current independently of field cable resistance up to compliance voltage.',
            equations: [{ label: 'Closed-Loop Gain & Barkhausen Criterion', latex: 'A_f = \\frac{A}{1 + A\\beta}, \\qquad |A(j\\omega_0)\\beta(j\\omega_0)| = 1,\\; \\angle A\\beta = 0^\\circ' }],
            realWorldApplications: {
              summary: 'Precision 2.5 kHz sine excitation for LVDT primaries, Wien bridge AC bridge sources, and quartz clocks inside digital transmitters.',
              industries: ['Transducer Excitation', 'Embedded Systems', 'RF/HART Modems'],
              examples: ['Bell 202 1200/2200 Hz HART FSK oscillator and current-feedback 4–20 mA output driver'],
            },
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Operational Amplifiers and Applications',
        hours: 7,
        summary: 'Voltage-series/shunt feedback, summing, scaling, averaging, differential, 3-op-amp INA, differentiators, integrators, and Schmitt trigger comparators.',
        topics: [
          {
            id: 'ade-u4-opamp-apps',
            title: 'Linear & Nonlinear Op-Amp Conditioning Topologies',
            summary: 'Virtual short analysis for summing/scaling/averaging/integrating/differentiating and regenerative hysteresis in Schmitt triggers.',
            explanation:
              'Negative feedback topologies convert op-amps into mathematical analog blocks: Voltage-series (non-inverting, huge Z_in), Voltage-shunt (inverting/summing/TIA at virtual ground), weighted Summing/Averaging (combining multiple temperature sensors), Integrators (dual-slope ADC ramp & PID I-term), Practical Differentiators (with input series R to stop high-frequency noise oscillation), and 3-op-amp Instrumentation Amplifiers. Positive feedback around an open-loop comparator creates an inverting/non-inverting Schmitt Trigger whose upper/lower threshold hysteresis (V_UTP − V_LTP) eliminates relay chattering on noisy analog threshold alarms!',
            workingPrinciple:
              'Schmitt trigger hysteresis holds trip output cleanly steady until sensor noise drops well below the reset band.',
            equations: [
              { label: 'Op-Amp Integrator & Schmitt Hysteresis Width', latex: 'V_{\\text{out}}(t) = -\\frac{1}{RC}\\int V_{\\text{in}}\\,dt, \\qquad V_{\\text{hys}} = \\frac{2 R_1}{R_1 + R_2} V_{\\text{sat}}' },
            ],
            realWorldApplications: {
              summary: 'Chatter-free analog level alarm switches, dual-slope multimeter integrators, turbine tachometer pulse squaring, and analog PID controllers.',
              industries: ['Signal Conditioning', 'Test Instruments', 'Process Alarms'],
              examples: ['Schmitt trigger conditioning noisy magnetic turbine flowmeter sine pickoff into crisp PLC square pulses'],
            },
            linkedPlatformRoute: '/instrumentation/signal-conditioning/operational-amplifier',
            linkedPlatformLabel: 'Open Op-Amp Spec Sheet',
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Specialized ICs (555 Timer & PLL)',
        hours: 5,
        summary: '555 timer internal comparators/RS-latch (Monostable pulse-stretcher & Astable PWM/oscillator) and Phase-Locked Loop (PLL) frequency tracking.',
        topics: [
          {
            id: 'ade-u5-555-pll',
            title: '555 Timer (Monostable / Astable) & Phase-Locked Loop (PLL)',
            summary: 'One-shot switch debouncing & pulse timing (T = 1.1RC), astable clocks, and phase-detector + LPF + VCO frequency tracking.',
            explanation:
              'The 555 Timer integrates a 1/3·V_CC and 2/3·V_CC resistive divider, two comparators, an SR flip-flop, and a discharge transistor: in Monostable mode, a falling trigger pulse generates an exact single clean pulse of width T = 1.1·R·C (switch debouncing, missing-pulse detector); in Astable mode, free-running charge/discharge oscillates at f = 1.44 / [(R_A + 2R_B)·C]. A Phase-Locked Loop (PLL: Phase Detector → Low-Pass Filter → Voltage-Controlled Oscillator) locks VCO frequency/phase onto noisy input pulses—acting as an ultra-narrow tracking bandpass filter for FM demodulation, resonant Coriolis/DPharp frequency tracking, and motor speed synchronization.',
            workingPrinciple:
              'PLL feedback drives phase error toward steady lock so VCO control voltage V_c directly mirrors input frequency deviations.',
            equations: [{ label: '555 Monostable & Astable Timing', latex: 'T_{\\text{mono}} = 1.1\\,R C, \\qquad f_{\\text{astable}} = \\frac{1.44}{(R_A + 2R_B)C}' }],
            realWorldApplications: {
              summary: 'Capacitive level sensor frequency-to-voltage demodulation, ultrasonic pulse bursts, contact debouncing, and VFD shaft speed sync.',
              industries: ['Sensors', 'Motor Drives', 'Telemetry'],
              examples: ['PLL demodulating FSK HART / resonant frequency transmitters', '555 watchdog pulse monitor'],
            },
          },
        ],
      },
      {
        unitNumber: 6,
        title: 'Combinational and Sequential Circuits',
        hours: 8,
        summary: 'Boolean algebra, encoders, decoders, code converters, SR/JK/D/T flip-flops, level vs edge triggering, async/sync counters, and shift registers.',
        topics: [
          {
            id: 'ade-u6-logic',
            title: 'Combinational Logic & Sequential Flip-Flops, Counters & Shift Registers',
            summary: 'Priority encoders, BCD-to-7-seg decoders, Gray↔Binary converters, race-around-free JK/D/T edge-triggered FFs, ripple/sync counters & SIPO/PISO registers.',
            explanation:
              'Combinational gates depend solely on present inputs (Priority Encoders map highest-priority plant alarm lines; Decoders drive multiplexed display segments; Gray-to-Binary XOR converters decode absolute shaft encoders). Sequential circuits add memory via Flip-Flops: level-triggered latches follow inputs while enable is high (risking JK race-around unless Master-Slave or Edge-Triggered clocks are used). Chaining flip-flops builds Asynchronous (ripple propagation delay) or Synchronous (simultaneous clock, glitch-free decoding) counters and Shift Registers (SPI/UART serial sensor interfaces).',
            workingPrinciple:
              'Edge-triggered D and JK flip-flops sample data cleanly only on rising/falling clock edges, enabling deterministic state machines and PLC counter timing.',
            realWorldApplications: {
              summary: '2oo3 safety voting combinational gates, turbine pulse frequency counters, Gray-code encoder decoders, and SPI shift-register ADC interfaces.',
              industries: ['Safety PLC Logic', 'Digital Instrumentation', 'Embedded MCU Nodes'],
              examples: ['2oo3 Voting: Y = AB + BC + CA implemented in hardware safety relays & PLCs'],
            },
          },
        ],
      },
      {
        unitNumber: 7,
        title: 'Digital-to-Analog and Analog-to-Digital Converters',
        hours: 5,
        summary: 'Weighted-resistor & R-2R ladder DACs; Parallel (Flash), Counter-type, and Successive Approximation (SAR) ADCs.',
        topics: [
          {
            id: 'ade-u7-dac-adc',
            title: 'Weighted-Resistor / R-2R DACs & Flash, Counter & SAR ADCs',
            summary: 'Resistor spread limits vs constant R-2R ladder; O(1) Flash speed vs O(2^N) Counter vs O(N) SAR conversion.',
            explanation:
              'Binary-weighted DACs require resistors spanning 2^(N−1):1 (impractical beyond 6–8 bits!), whereas R-2R ladders use only R and 2R across any bit depth. For Analog-to-Digital conversion: Parallel (Flash) uses 2^N − 1 comparators for 1-clock nanosecond speed (oscilloscopes); Counter-type ramps a DAC steadily (slow 2^N worst-case cycles); Successive Approximation (SAR) performs binary search across N bits in strictly N clock cycles—powering the vast majority of industrial multiplexed PLC Analog Input modules!',
            workingPrinciple:
              'SAR ADC sets MSB = 1 first, compares V_DAC vs sampled V_in, keeps or clears the bit, and steps down through N bits deterministically.',
            equations: [{ label: 'N-Bit Conversion Time & LSB', latex: 'T_{\\text{SAR}} = N \\cdot T_{\\text{clk}}, \\quad T_{\\text{counter, max}} = (2^N - 1) T_{\\text{clk}}, \\quad \\text{LSB} = \\frac{V_{\\text{FS}}}{2^N}' }],
            realWorldApplications: {
              summary: '16-bit SAR cards inside industrial PLCs, digital oscilloscope Flash front-ends, and R-2R precision analog output (4–20 mA) DAC stages.',
              industries: ['PLC/DCS I/O', 'Smart Transmitters', 'Test Instruments'],
              examples: ['AD7606 simultaneous 16-bit SAR ADC in power grid & motor vibration monitoring'],
            },
            linkedPlatformRoute: '/toolbox/adc-resolution',
            linkedPlatformLabel: 'Open ADC & ENOB Calculator',
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'SAR vs Counter vs Flash ADC',
        leftName: 'SAR ADC',
        rightName: 'Flash (Parallel) / Counter ADC',
        rows: [
          { criterion: 'Conversion Time', leftValue: 'Fixed N clock cycles (deterministic)', rightValue: 'Flash: 1 cycle (fastest) | Counter: up to 2^N cycles' },
          { criterion: 'Hardware Scaling', leftValue: '1 comparator + N-bit DAC (compact up to 18 bits)', rightValue: 'Flash needs 2^N − 1 comparators (max ~8–10 bits)' },
          { criterion: 'Instrumentation Role', leftValue: 'PLC multiplexed AI cards & DAQ', rightValue: 'Flash: Digital oscilloscopes | Counter: low-cost slow sensors' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-ade-1',
        level: 'Beginner',
        topic: 'R-2R vs Binary Weighted DAC',
        question: 'Why are 12-to-16 bit industrial DACs built using R-2R ladders rather than binary-weighted resistors?',
        options: [
          'R-2R needs only two matched resistor values (R & 2R), whereas 16-bit binary-weighted would need a 32,768:1 resistance ratio impossible to match across temperature.',
          'R-2R eliminates the need for a voltage reference V_ref.',
        ],
        correctIndex: 0,
        answer: 'R-2R keeps ratio 2:1 regardless of bit count, preserving monotonicity and low thermal drift.',
        principle: 'Monotonicity requires resistor matching tolerances tighter than 1/2^N.',
        followUpIfCorrect: 'Exactly right! Now what happens to an R-2R DAC output voltage if the op-amp feedback resistor changes slightly, versus what happens if V_ref drifts?',
        followUpIfReview: 'Remember the MSB resistor is R, while the LSB resistor in binary-weighted is 2^(N−1)·R! Think about fabricating 1 kΩ and 32.7 MΩ accurately on the same IC.',
        followUpAnswer: 'Gain error scales linearly with both R_f and V_ref—which is why precision current loops use low-TCR (<10 ppm/°C) V_ref references.',
      },
      {
        id: 'sim-ade-2',
        level: 'Intermediate',
        topic: 'Schmitt Trigger Hysteresis',
        question: 'When converting a noisy sensor sine wave into clean digital PLC pulses, why use a Schmitt trigger instead of a basic zero-crossing comparator?',
        options: [
          'Hysteresis (V_UTP ≠ V_LTP) prevents multiple rapid false output chatters when noise crosses the single threshold repeatedly.',
          'A basic comparator cannot accept AC input voltages.',
        ],
        correctIndex: 0,
        answer: 'Positive feedback creates separate rising and falling thresholds, rejecting peak-to-peak noise smaller than V_hys.',
        principle: 'Hysteresis width V_UTP − V_LTP must slightly exceed worst-case input noise ripple.',
        followUpIfCorrect: 'Great! Suppose your turbine pickoff sine wave has ±50 mV noise at low flow. What minimum hysteresis width should you design?',
        followUpIfReview: 'Imagine noise fluctuating ±50 mV right as the signal crosses 0 V slowly—a single threshold flips ON/OFF dozens of times per crossing!',
        followUpAnswer: 'Design V_hys > 100 mV (e.g., 150–200 mV) so peak-to-peak noise cannot re-trigger the threshold after switching.',
      },
    ],
  },

  // =========================================================================
  // C. NUMERICAL METHODS (MCDC0203)
  // =========================================================================
  {
    id: 'nitj-sem3-nm',
    semester: 3,
    displaySemesterLabel: 'Semester III',
    code: 'MCDC0203',
    name: 'Numerical Methods',
    shortName: 'Numerical Methods',
    credits: 4,
    category: 'Foundations',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Computational mathematics for nonlinear sensor inversion, linear circuit/bridge network matrices, empirical calibration curve interpolation, flow totalization integration, dynamic ODE simulation (RK4), and thermal PDE finite differences.',
    units: [
      {
        unitNumber: 1,
        title: 'Roots of Algebraic and Transcendental Equations',
        hours: 7,
        summary: 'Bisection, Newton-Raphson, Bairstow’s quadratic factor extraction, and Graeffe’s root-squaring method.',
        topics: [
          {
            id: 'nm-u1-roots',
            title: 'Bisection, Newton-Raphson, Bairstow & Graeffe Root Finding',
            summary: 'Guaranteed bracketing convergence (Bisection) vs quadratic convergence (Newton-Raphson) and complex polynomial roots (Bairstow/Graeffe).',
            explanation:
              'When inverting nonlinear instrumentation laws (e.g., solving Callendar-Van Dusen below 0 °C, Colebrook pipe friction factor, or characteristic polynomial poles), analytical formulas fail or become unwieldy. Bisection halves a bracket [a,b] where f(a)·f(b)<0 (guaranteed linear convergence, error drops ½ per step). Newton-Raphson iterates x_{k+1} = x_k − f(x_k)/f′(x_k) with rapid quadratic convergence whenever f′(x) ≠ 0 near the root. For higher-order control characteristic polynomials with complex conjugate poles, Bairstow’s method extracts quadratic factors (x² + px + q) via synthetic division & 2×2 Newton updates, while Graeffe’s method repeatedly squares roots to separate root magnitudes algebraically.',
            workingPrinciple:
              'Newton-Raphson replaces the curve with its local tangent line at each step; Bairstow avoids complex arithmetic while finding complex poles.',
            equations: [
              { label: 'Newton-Raphson Update', latex: 'x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}, \\qquad |e_{n+1}| \\approx \\left|\\frac{f\'\'(r)}{2f\'(r)}\\right| e_n^2' },
              { label: 'Bisection Iteration Bound', latex: 'n \\ge \\left\\lceil \\frac{\\ln((b-a)/\\varepsilon)}{\\ln 2} \\right\\rceil' },
            ],
            algorithm: {
              flowchartMermaid: `flowchart LR
  S["Start: Bracket [a,b] or x0"] --> E{"f(x) or |dx| < tol?"}
  E -- "Yes" --> D["Return Root x*"]
  E -- "No" --> U["Bisection: mid=(a+b)/2\\nNewton: x1 = x0 - f(x0)/f'(x0)"]
  U --> E`,
              pseudocode: [
                'function newtonRaphson(f, df, x0, tol=1e-6, maxIter=50):',
                '  for k = 1..maxIter:',
                '    if |df(x0)| < 1e-12: break (zero slope guard)',
                '    x1 = x0 - f(x0) / df(x0)',
                '    if |x1 - x0| < tol: return x1',
                '    x0 = x1',
              ],
              convergenceAndError: 'Bisection: order 1 (guaranteed if f continuous & sign flips). Newton-Raphson: order 2 (diverges if f′≈0 or poor initial guess).',
            },
            numericals: [
              {
                title: 'Newton-Raphson Root of Transcendental Equation',
                problem: 'Find one iteration of Newton-Raphson for f(x) = x·eˣ − 2 = 0 starting at x₀ = 1.0.',
                steps: [
                  'f(1.0) = 1·e¹ − 2 = 2.7183 − 2 = 0.7183.',
                  'f′(x) = (1 + x)eˣ ⇒ f′(1.0) = 2 × 2.7183 = 5.4366.',
                  'x₁ = 1.0 − 0.7183 / 5.4366 = 0.8679 (exact root ≈ 0.8526!).',
                ],
                result: 'x₁ = 0.8679 after 1 iteration.',
              },
            ],
            realWorldApplications: {
              summary: 'Inverting 4th-order RTD/Thermocouple polynomials inside smart transmitter firmware and finding closed-loop poles of high-order control polynomials.',
              industries: ['Smart Transmitters', 'Control Engineering', 'Fluid Piping Design'],
              examples: ['Solving below-zero Callendar-Van Dusen cubic-quartic inside Pt100 transmitters', 'Solving Colebrook-White pipe friction for flow sizing'],
            },
            crossLinks: [{ label: 'Control System Engineering (Sem IV)', targetSubjectId: 'nitj-sem4-control', note: 'Finding closed-loop characteristic roots and breakaway points on Root Locus.' }],
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Simultaneous Algebraic Equations and Eigenvalue Problems',
        hours: 8,
        summary: 'Matrix inversion, LU triangularization, Jacobi & Gauss-Seidel iterations, partition matrix inversion, Power method & Jacobi eigenvalue rotation.',
        topics: [
          {
            id: 'nm-u2-linear-eigen',
            title: 'Linear Systems (LU, Jacobi, Gauss-Seidel, Partition) & Eigenvalues (Power, Jacobi)',
            summary: 'Direct LU triangularization vs iterative diagonal-dominant solvers and dominant/full eigenvalue extraction.',
            explanation:
              'Solving multi-node resistor/bridge mesh networks and MIMO state-space models requires solving Ax = b and Av = λv. Direct methods decompose A = LU (triangularization) or invert block sub-matrices via Partitioning. Iterative Jacobi updates all variables from previous-step values, while Gauss-Seidel substitutes newly updated x_i immediately inside the same sweep (converging ~2× faster whenever A is strictly diagonally dominant: |a_ii| > Σ_{j≠i} |a_ij|). For system stability poles/modes, the Power Method iterates y_{k+1} = A·y_k / ||A·y_k|| to isolate the largest eigenvalue |λ₁|, while Jacobi’s orthogonal Givens rotations diagonalize symmetric matrices to yield ALL eigenvalues.',
            workingPrinciple:
              'Diagonal dominance ensures iteration matrix spectral radius ρ(T) < 1 so residual errors decay geometrically.',
            equations: [
              { label: 'Gauss-Seidel Update & Power Method', latex: 'x_i^{(k+1)} = \\frac{1}{a_{ii}}\\left(b_i - \\sum_{j<i} a_{ij} x_j^{(k+1)} - \\sum_{j>i} a_{ij} x_j^{(k)}\\right), \\quad \\lambda_1 \\approx \\frac{\\mathbf{x}^T A \\mathbf{x}}{\\mathbf{x}^T \\mathbf{x}}' },
            ],
            algorithm: {
              pseudocode: [
                'function gaussSeidel(A, b, x, tol):',
                '  repeat until max|x_new - x| < tol:',
                '    for i = 1..n:',
                '      sum = b[i] - sum_{j != i}(A[i][j] * x[j])',
                '      x[i] = sum / A[i][i]  // uses latest x immediately',
              ],
              convergenceAndError: 'Guaranteed convergence for Jacobi/Gauss-Seidel if A is strictly diagonally dominant or symmetric positive definite.',
            },
            numericals: [
              {
                title: 'First Sweep of Gauss-Seidel on Diagonally Dominant Circuit Matrix',
                problem: 'Solve 4x + y = 9 and x + 5y = 11 starting from (x⁰, y⁰) = (0, 0) for 1 sweep.',
                steps: [
                  'x¹ = (9 − 0) / 4 = 2.25.',
                  'y¹ = (11 − 2.25) / 5 = 8.75 / 5 = 1.75 (uses updated x¹ = 2.25 immediately! Exact solution is x=2, y=1.8).',
                ],
                result: '(x¹, y¹) = (2.25, 1.75) in one sweep.',
              },
            ],
            realWorldApplications: {
              summary: 'Solving multi-mesh nodal/loop electrical circuits, state-space modal eigenvalues (stability poles of A matrix), and multi-sensor calibration decoupling.',
              industries: ['Control Systems', 'Circuit Simulation', 'MIMO Refinery APC'],
              examples: ['Computing eigenvalues of state matrix A in Sem V Modern Control Systems'],
            },
            crossLinks: [{ label: 'Modern Control System (Sem V)', targetSubjectId: 'nitj-sem5-mcs', note: 'State-space eigenvalues determine stability and modal response directly.' }],
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Interpolation, Finite Differences & Numerical Differentiation',
        hours: 8,
        summary: 'Forward/backward/central differences, Newton forward/backward/divided differences, Lagrange, Stirling, Bessel interpolation & numerical derivatives.',
        topics: [
          {
            id: 'nm-u3-interp',
            title: 'Finite Differences, Newton/Lagrange/Stirling/Bessel & Numerical Differentiation',
            summary: 'Interpolating discrete sensor calibration tables (equally and unequally spaced) and estimating rates dy/dt.',
            explanation:
              'Field calibration tables (thermocouple NIST mV points, valve Cv curves) provide discrete pairs (x_i, y_i). For equally spaced steps h: Newton Forward uses Δy₀ near the top of the table; Newton Backward uses ∇y_n near the end; Central-difference Stirling (best right around center integer u) and Bessel (best around u = 0.5) maximize accuracy in the table interior. For unevenly spaced lab points, Lagrange and Newton’s Divided-Difference polynomials require zero uniform spacing. Differentiating the interpolating polynomial gives numerical velocity/rate estimators (forward, central O(h²) formulas).',
            workingPrinciple:
              'Finite differences approximate polynomial Taylor coefficients directly from tabular readings without closed-form equations.',
            equations: [
              { label: 'Newton Forward & Central Difference Derivative', latex: 'y(x_0 + u h) = y_0 + u\\Delta y_0 + \\frac{u(u-1)}{2!}\\Delta^2 y_0 + \\cdots, \\quad f\'(x_0) \\approx \\frac{f(x_0+h) - f(x_0-h)}{2h}' },
              { label: 'Lagrange Polynomial (Unequal Spacing)', latex: 'P(x) = \\sum_{i=0}^{n} y_i \\prod_{j \\ne i} \\frac{x - x_j}{x_i - x_j}' },
            ],
            algorithm: {
              pseudocode: [
                'function lagrangeEval(xs, ys, xTarget):',
                '  sum = 0',
                '  for i = 0..n:',
                '    term = ys[i]',
                '    for j = 0..n: if j != i: term *= (xTarget - xs[j]) / (xs[i] - xs[j])',
                '    sum += term',
                '  return sum',
              ],
              convergenceAndError: 'Truncation error scales with h^(n+1)·f^(n+1)(ξ)/(n+1)!; central O(h²) differences avoid noisy high-order polynomial Runge oscillation.',
            },
            realWorldApplications: {
              summary: 'Microcontroller lookup-table interpolation for thermistors, tank strapping volume tables, and thermocouple linearization.',
              industries: ['Smart Transmitters', 'Tank Gauging', 'Signal Processing'],
              examples: ['Interpolating nonlinear cylindrical tank level-to-volume API strapping tables'],
            },
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Numerical Integration',
        hours: 6,
        summary: 'Trapezoidal rule, Simpson’s 1/3 rule, error order comparisons, and 2D double integration over rectangular grids.',
        topics: [
          {
            id: 'nm-u4-int',
            title: 'Trapezoidal Rule, Simpson’s 1/3 Rule & Double Integration',
            summary: 'Integrating flow totalizers, batch mass, and RMS signal energy from discrete sampled readings.',
            explanation:
              'Totalizing flow Q(t) over time or integrating PID error requires numerical quadrature. The Trapezoidal rule joins adjacent samples with straight lines (error O(h²), exact for linear functions). Simpson’s 1/3 rule fits parabolas across pairs of intervals (requires even number of subintervals n; achieves O(h⁴) accuracy—exact up to cubic polynomials!). Extending 1D rules sequentially along x then y performs Double Integration over rectangular domains (e.g., velocity-profile flux integration across duct cross-sections).',
            workingPrinciple:
              'Higher-order polynomial weighting (1, 4, 2, 4, ..., 1) cancels odd truncation errors cleanly.',
            equations: [
              { label: 'Trapezoidal & Simpson’s 1/3 Rules', latex: 'I_{\\text{trap}} = \\frac{h}{2}\\left[y_0 + 2\\sum_{i=1}^{n-1} y_i + y_n\\right], \\quad I_{\\text{Simp 1/3}} = \\frac{h}{3}\\left[y_0 + 4\\sum_{\\text{odd}} y_i + 2\\sum_{\\text{even}} y_i + y_n\\right]' },
            ],
            algorithm: {
              pseudocode: [
                'function simpson13(y, h):  // len(y)-1 must be even',
                '  sum = y[0] + y[n]',
                '  for i = 1..n-1:',
                '    sum += (i % 2 == 1 ? 4 : 2) * y[i]',
                '  return (h / 3) * sum',
              ],
              convergenceAndError: 'Trapezoidal global error = O(h²); Simpson’s 1/3 global error = O(h⁴) requiring n = even.',
            },
            numericals: [
              {
                title: 'Flow Totalization via Simpson’s 1/3 Rule',
                problem: 'Hourly flow readings (m³/h) at t = 0, 1, 2, 3, 4 h are [20, 26, 30, 24, 18]. Integrate total batch volume (h = 1 h, n = 4 even).',
                steps: [
                  'V = (1/3) × [20 + 4(26 + 24) + 2(30) + 18]',
                  'V = (1/3) × [20 + 200 + 60 + 18] = 298 / 3 = 99.33 m³.',
                ],
                result: '99.33 m³ total batch volume.',
              },
            ],
            realWorldApplications: {
              summary: 'PLC/SCADA batch flow totalizers, RMS AC power integration, and PID integral accumulator discretization.',
              industries: ['Custody Transfer', 'Batch Processing', 'Power Analytics'],
              examples: ['Integrating fuel gas flow rate Q(t) to compute daily refinery custody balance'],
            },
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Numerical Methods for ODEs',
        hours: 7,
        summary: 'Taylor series, Euler, Modified Euler (Heun), 4th-order Runge-Kutta (RK4), and coupled simultaneous 1st/2nd-order ODEs.',
        topics: [
          {
            id: 'nm-u5-odes',
            title: 'Taylor, Euler, Modified Euler & Runge-Kutta 4th-Order (RK4)',
            summary: 'Time-stepping continuous thermal, tank, and RLC dynamic state models including 2nd-order ODE reduction to coupled 1st-order systems.',
            explanation:
              'Dynamic instrumentation and control models take the form dy/dt = f(t,y). Forward Euler steps linearly using initial slope (O(h) local truncation error, unstable for large steps). Modified Euler (Heun’s predictor-corrector) averages slopes at start and predicted end (O(h²) global error). Fourth-Order Runge-Kutta (RK4) evaluates four weighted slopes (k₁, k₂, k₃, k₄) per step—achieving extraordinary O(h⁴) global accuracy without computing analytical higher derivatives! Higher-order (2nd-order RLC/mechanical) ODEs convert effortlessly into simultaneous 1st-order systems [x₁ = y, x₂ = y′] solved in parallel by vector RK4.',
            workingPrinciple:
              'RK4 samples midpoint slopes twice to match Taylor series terms identically up through h⁴/4!.',
            equations: [
              { label: 'Classic 4th-Order Runge-Kutta (RK4)', latex: 'y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4), \\quad k_1 = f(t_n,y_n),\\; k_2 = f(t_n+\\tfrac{h}{2}, y_n+\\tfrac{hk_1}{2})' },
            ],
            algorithm: {
              flowchartMermaid: `flowchart LR
  A["State (t_n, y_n)"] --> B["k1 = f(t, y)\\nk2 = f(t+h/2, y+hk1/2)"]
  B --> C["k3 = f(t+h/2, y+hk2/2)\\nk4 = f(t+h, y+hk3)"]
  C --> D["y_{n+1} = y_n + (h/6)(k1+2k2+2k3+k4)"]`,
              pseudocode: [
                'function rk4Step(f, t, y, h):',
                '  k1 = f(t, y)',
                '  k2 = f(t + 0.5*h, y + 0.5*h*k1)',
                '  k3 = f(t + 0.5*h, y + 0.5*h*k2)',
                '  k4 = f(t + h, y + h*k3)',
                '  return y + (h / 6) * (k1 + 2*k2 + 2*k3 + k4)',
              ],
              convergenceAndError: 'Euler O(h); Modified Euler O(h²); RK4 O(h⁴) global error. Note stiff systems require small h or implicit solvers.',
            },
            numericals: [
              {
                title: 'First-Order Thermal Tank Step via Euler vs Modified Euler',
                problem: 'Given dy/dt = 1 − y with y(0) = 0 and step h = 0.2 s, compute y(0.2) by Euler and Modified Euler (exact = 1 − e⁻⁰·² = 0.1813).',
                steps: [
                  'Euler: k₁ = 1 − 0 = 1.0 ⇒ y_E(0.2) = 0 + 0.2(1.0) = 0.2000.',
                  'Modified Euler: k₂ = f(0.2, 0.20) = 1 − 0.20 = 0.80 ⇒ y_ME(0.2) = 0 + (0.2/2)(1.0 + 0.80) = 0.1800 (only 0.0013 error!).',
                ],
                result: 'Euler = 0.2000; Modified Euler = 0.1800 (exact = 0.1813).',
              },
            ],
            realWorldApplications: {
              summary: 'Real-time plant dynamic simulators (OTS operator training), closed-loop PID step-response solvers, and aerospace flight state integration.',
              industries: ['Process Simulation', 'Control Engineering', 'Aerospace'],
              examples: ['Solving coupled CSTR reactor temperature/concentration ODEs in Sem V Process Dynamics'],
            },
            crossLinks: [{ label: 'Process Dynamics & Control (Sem V)', targetSubjectId: 'nitj-sem5-pdc', note: 'CSTR, heat exchanger, and tank ODEs rely on linearization & RK4 simulation.' }],
          },
        ],
      },
      {
        unitNumber: 6,
        title: 'Boundary Value Problems and PDEs',
        hours: 6,
        summary: 'Finite-difference BVP discretization and explicit/implicit finite-difference schemes for Elliptic (Laplace), Parabolic (Heat), and Hyperbolic (Wave) PDEs.',
        topics: [
          {
            id: 'nm-u6-pdes',
            title: 'Finite-Difference BVPs & Elliptic, Parabolic, Hyperbolic PDEs',
            summary: 'Replacing spatial/temporal partial derivatives with central differences for thermal walls, packed beds, and transmission lines.',
            explanation:
              'Distributed engineering systems (heat conduction along a thermowell stem, electrostatic field inside a capacitive sensor, fluid acoustic hammer in pipelines) satisfy second-order PDEs classified by B² − 4AC: Elliptic (B²−4AC < 0, e.g. steady Laplace ∇²T = 0 → solved via 5-point Liebmann Gauss-Seidel grid relaxation); Parabolic (B²−4AC = 0, transient 1D heat diffusion ∂T/∂t = α ∂²T/∂x² → solved via Bender-Schmidt explicit or unconditionally stable Crank-Nicolson implicit grid); Hyperbolic (B²−4AC > 0, wave equation ∂²u/∂t² = c² ∂²u/∂x² → Courant condition c·Δt/Δx ≤ 1).',
            workingPrinciple:
              'Discretizing a continuous domain into grid nodes turns differential equations into algebraic tridiagonal or banded sparse matrix updates.',
            equations: [
              { label: '5-Point Laplace & Explicit Heat Stability', latex: 'T_{i,j} = \\frac{1}{4}(T_{i+1,j} + T_{i-1,j} + T_{i,j+1} + T_{i,j-1}), \\qquad r = \\frac{\\alpha \\Delta t}{\\Delta x^2} \\le \\frac{1}{2}' },
            ],
            algorithm: {
              pseudocode: [
                'function heat1D_explicit(T, alpha, dt, dx, steps):',
                '  r = alpha * dt / (dx * dx)  // stability requires r <= 0.5',
                '  for step = 1..steps:',
                '    for i = 1..Nx-1: T_next[i] = T[i] + r*(T[i+1] - 2*T[i] + T[i-1])',
                '    T = T_next',
              ],
              convergenceAndError: 'Explicit heat equation explodes immediately if Fourier mesh number r = α·Δt/Δx² > 0.5; Crank-Nicolson remains unconditionally stable for all Δt.',
            },
            realWorldApplications: {
              summary: 'Thermal conduction error estimation along thermowells, furnace wall heat transfer, and ultrasonic/EM wave propagation modeling.',
              industries: ['Thermal Design', 'CFD / FEA Modeling', 'Refinery Furnaces'],
              examples: ['Computing steady temperature profile along a partially immersed thermowell shaft'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Bisection vs Newton-Raphson',
        leftName: 'Bisection Method',
        rightName: 'Newton-Raphson Method',
        rows: [
          { criterion: 'Convergence Rate', leftValue: 'Linear (halves error per step, guaranteed)', rightValue: 'Quadratic (doubles significant digits per step)' },
          { criterion: 'Requirements', leftValue: 'Requires sign-changing bracket [a, b]; no derivative', rightValue: 'Needs analytical f′(x); can diverge near flat extrema' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-nm-1',
        level: 'Beginner',
        topic: 'Gauss-Seidel Convergence',
        question: 'Why does rearranging equations to place the largest coefficients on the main diagonal guarantee Gauss-Seidel iteration convergence?',
        options: [
          'Strict diagonal dominance (|a_ii| > Σ|a_ij|) guarantees spectral radius < 1 so iteration errors decay monotonically.',
          'Diagonal dominance converts nonlinear equations into Simpson quadrature.',
        ],
        correctIndex: 0,
        answer: 'Strict diagonal dominance guarantees contraction of the iterative error matrix across sweeps.',
        principle: 'If an equation fails diagonal dominance, simply swapping row order often restores immediate convergence.',
        followUpIfCorrect: 'Nice! Between Jacobi and Gauss-Seidel on the exact same diagonally dominant matrix, which converges in fewer iterations and why?',
        followUpIfReview: 'Check the denominator in x_i = (b_i − Σ a_ij x_j) / a_ii — making |a_ii| larger shrinks the feedback multiplier of previous errors!',
        followUpAnswer: 'Gauss-Seidel typically converges in roughly half as many sweeps as Jacobi because each variable immediately uses the freshly updated values of earlier variables in the same iteration.',
      },
      {
        id: 'sim-nm-2',
        level: 'Intermediate',
        topic: 'Simpson’s 1/3 vs Trapezoidal Rule',
        question: 'When integrating logged 10-minute plant flow readings, what structural constraint must the number of subintervals n satisfy to apply Simpson’s 1/3 rule?',
        options: [
          'n must be EVEN (so total data points n+1 is odd), because each parabolic arc spans two adjacent intervals.',
          'n must be a prime number.',
        ],
        correctIndex: 0,
        answer: 'Number of subintervals n must be EVEN; if n is odd, pair Simpson’s 1/3 on n−3 intervals with Simpson’s 3/8 (or Trapezoidal) on the remaining segment.',
        principle: 'Simpson’s 1/3 interpolates a quadratic through 3 points (2 equal intervals) at a time.',
        followUpIfCorrect: 'Correct! What polynomial degree does Simpson’s 1/3 rule integrate with ZERO truncation error?',
        followUpIfReview: 'Count the points used per quadratic parabola: x₀, x₁, x₂ — that spans 2 subintervals (n = 2, 4, 6...).',
        followUpAnswer: 'Even though derived from a quadratic (degree 2), symmetry cancels the cubic term automatically—making Simpson’s 1/3 exact up to degree 3 (cubic polynomials)!',
      },
    ],
  },

  // =========================================================================
  // D. ELECTRICAL MEASUREMENTS AND MEASURING INSTRUMENTS (ICDC0203)
  // =========================================================================
  {
    id: 'nitj-sem3-emmi',
    semester: 3,
    displaySemesterLabel: 'Semester III',
    code: 'ICDC0203',
    name: 'Electrical Measurements and Measuring Instruments (EMMI)',
    shortName: 'EMMI',
    credits: 4,
    category: 'Core ICE',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Official EMMI course covering measurement standards, analog electromechanical meters (PMMC, MI, Dynamometer, Wattmeters, Energy meters), complete DC/AC/High-R bridges, magnetic testing, CT/PT instrument transformers, and CRO/DSO waveforms.',
    units: [
      {
        unitNumber: 1,
        title: 'Measurement Systems and Standards',
        hours: 6,
        summary: 'Architecture, systematic/random errors, electrical/time/frequency/physical standards, direct/indirect methods, mechanical/electrical/electronic instruments.',
        topics: [
          {
            id: 'emmi-u1-standards',
            title: 'Standards (Electrical, Time/Freq, Physical) & Instrument Classification',
            summary: 'SI primary/secondary/working standards, absolute vs secondary instruments, analog deflecting/null vs electronic digital.',
            explanation:
              'Measurement metrology links industrial plant calibrators back via an unbroken traceability chain to primary international SI standards: Cesiums/atomic clocks (time & frequency), Josephson junction arrays (Volt), Quantum Hall effect (Ohm), and physical mass/length artifacts. Instruments classify into Absolute (tangent galvanometer) vs Secondary (calibrated against standard); Mechanical, Electrical (electromechanical coil torque), and Electronic (high-Z solid-state amplification); and Direct (ammeter) vs Indirect (power P = V·I or bridge null balancing).',
            workingPrinciple:
              'Deflecting instruments balance Deflecting Torque (T_d) against spring Controlling Torque (T_c = K·θ) damped by eddy-current or air-friction Damping Torque (T_D).',
            realWorldApplications: {
              summary: 'Traceability chains from NABL/NIST calibration labs down to plant bench multimeters and loop calibrators.',
              industries: ['Metrology Labs', 'Power Substations', 'Manufacturing QA'],
              examples: ['6.5-digit DMM calibrated against Josephson/Zener voltage transfer standard'],
            },
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Electrical Measuring Instruments',
        hours: 8,
        summary: 'PMMC (D’Arsonval), Moving Iron (MI attraction/repulsion), Electrodynamometer, LPF/UPF Wattmeters, and single/3-phase induction Energy Meters.',
        topics: [
          {
            id: 'emmi-u2-meters',
            title: 'PMMC, Moving Iron, Electrodynamometer, Wattmeters & Energy Meters',
            summary: 'Linear DC-average PMMC vs True-RMS AC/DC Moving Iron, AC/DC Dynamometer Wattmeter (with pressure-coil lag comp), and kWh Energy Meters.',
            explanation:
              'PMMC uses a permanent Alnico magnet + moving copper coil on an aluminum former (eddy-current damped): T_d = N·B·A·I gives a uniform linear scale reading strictly DC AVERAGE value (reads 0 on pure AC!). Moving Iron (MI) attraction/repulsion instruments pull soft iron vanes proportional to I² (T_d = ½ I² dL/dθ)—reading True-RMS on BOTH DC and AC with a cramped non-linear square-law scale. Electrodynamometers replace the permanent magnet with fixed air-core current coils: T_d ∝ I₁·I₂·cosφ measures True Real Power (Watts) directly! Induction kWh Energy Meters use phase-quadrature shunt/series electromagnets spinning an aluminum disc against a permanent braking magnet.',
            workingPrinciple:
              'Using a shunt resistor expands a basic 1 mA PMMC movement into an ammeter (R_sh = R_m / (m − 1)); series multiplier resistors expand it into a voltmeter.',
            equations: [
              { label: 'PMMC Linear vs MI RMS Torque & Shunt Multiplier', latex: '\\theta_{\\text{PMMC}} \\propto I_{\\text{avg}}, \\quad \\theta_{\\text{MI}} \\propto I_{\\text{RMS}}^2, \\quad R_{\\text{shunt}} = \\frac{R_m}{(I / I_m) - 1}' },
            ],
            comparison: {
              peer: 'Moving Iron (MI) vs PMMC',
              takeaway: 'PMMC = DC average ONLY, linear scale, highest accuracy & lowest burden; MI = DC & AC True-RMS, cramped I² scale, cheap & rugged.',
            },
            realWorldApplications: {
              summary: 'MCC motor switchboard ammeters/voltmeters (MI), DC battery panel meters (PMMC), and feeder kW/kWh revenue panels.',
              industries: ['Power Distribution', 'Substations', 'Motor Control Centers'],
              examples: ['Two-wattmeter method measuring balanced/unbalanced 3-phase motor real & reactive power'],
            },
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'AC/DC Bridge Measurements',
        hours: 10,
        summary: 'Wheatstone, Kelvin Double, Constant-Current, Resistance-Ratio; Schering, Parallel-C, De Sauty, Wien; Maxwell, Hay, Owen, Anderson, Heaviside; Loss-of-Charge, Megaohm & Megger.',
        topics: [
          {
            id: 'emmi-u3-dc-high-r',
            title: 'DC Bridges (Wheatstone, Kelvin Double, Ratio) & High-Resistance (Loss-of-Charge, Megaohm, Megger)',
            summary: 'Medium R (1 Ω–1 MΩ), low R (<1 Ω eliminating lead/contact errors via Kelvin Double), and >1 MΩ insulation testing via Megger & capacitor decay.',
            explanation:
              'Wheatstone bridges measure medium resistances (1 Ω to ~1 MΩ) cleanly via null balance R_x = R₃·(R₂/R₁). Below 1 Ω, test lead & binding post resistances ruin Wheatstone accuracy—so the Kelvin Double Bridge adds a second inner ratio pair (p/q = P/Q) across a low-resistance yoke so lead resistance cancels mathematically! Above 1 MΩ (cable/motor insulation), Loss-of-Charge times voltage decay V(t) = V₀·e^(−t/RC) across capacitor C; Guard-ring Megaohm bridges shunt surface leakage past the detector; and the hand/electronic Megger (500–5000 VDC) compares deflecting coil current against controlling coil ratio directly in MΩ/GΩ.',
            workingPrinciple:
              'Null detection achieves maximum precision independent of battery voltage sag, while Megger guard terminals isolate surface dirt leakage from bulk volume insulation resistance.',
            equations: [
              { label: 'Kelvin Double Bridge & Loss-of-Charge High R', latex: 'R_x = \\frac{P}{Q} R_s + \\frac{q\\,r}{p+q+r}\\left(\\frac{P}{Q} - \\frac{p}{q}\\right), \\qquad R_{\\text{ins}} = \\frac{t}{C \\ln(V_0 / V(t))}' },
            ],
            realWorldApplications: {
              summary: 'Checking busbar/breaker micro-ohm joints (Kelvin bridge) and Meggering motor windings & wet RTD sheath insulation (>100 MΩ at 500 VDC).',
              industries: ['Power Plants', 'Motor Maintenance', 'Field Instrumentation'],
              examples: ['500 VDC Megger insulation check between Pt100 leads and 316L sheath'],
            },
            linkedPlatformRoute: '/toolbox/wheatstone-bridge',
            linkedPlatformLabel: 'Open Bridge Calculator',
          },
          {
            id: 'emmi-u3-ac-bridges',
            title: 'AC Bridges for C, L, Mutual-M & Frequency (Maxwell, Hay, Owen, Anderson, Schering, De Sauty, Wien)',
            summary: 'Complex impedance null balance Z₁Z₄ = Z₂Z₃: matching magnitude AND phase angles cleanly across Q-factor bands.',
            explanation:
              'Every AC bridge satisfies complex balance Z₁·Z₄ = Z₂·Z₃ (both Real and Imaginary parts simultaneously!). Capacitance & tanδ loss angle: De Sauty (pure C ratio), Parallel-C, Schering Bridge (high-voltage transformer oil/bushing insulation loss tanδ = ωC₄R₄), and Wien Bridge (frequency-selective null f = 1/(2π√(R₁R₂C₁C₂))). Inductance L & Q-factor: Maxwell’s L bridge (compares against standard inductor); Maxwell L-C bridge (measures medium Q = 1–10 using a standard capacitor!); Hay’s Bridge (uses series C in opposing arm, ideal for high-Q > 10 coils); Owen’s Bridge (L in terms of C & R independent of frequency); Anderson’s Bridge (ultra-precise low-Q < 1 coils); and Heaviside Mutual-Inductance Bridge (measures M between coupled transformer windings).',
            workingPrinciple:
              'Using a known capacitor standard (much cheaper, lighter, and purer than bulky standard inductors!) enables clean orthogonal adjustment of L_x and R_x.',
            equations: [
              { label: 'Maxwell L-C (Q=1–10) & Schering tan δ', latex: 'L_x = R_2 R_3 C_4, \\quad R_x = \\frac{R_2 R_3}{R_4}; \\qquad \\tan\\delta_{\\text{Schering}} = \\omega C_4 R_4' },
              { label: 'Wien Bridge Frequency Null', latex: 'f = \\frac{1}{2\\pi\\sqrt{R_1 R_2 C_1 C_2}}' },
            ],
            numericals: [
              {
                title: 'Maxwell Inductance-Capacitance Bridge Null',
                problem: 'At balance, Maxwell L-C arms have R₂ = 1000 Ω, R₃ = 2000 Ω, and parallel branch R₄ = 5000 Ω, C₄ = 0.20 µF. Find L_x and coil winding resistance R_x.',
                steps: [
                  'L_x = R₂ · R₃ · C₄ = 1000 × 2000 × 0.20×10⁻⁶ = 0.40 H (400 mH).',
                  'R_x = (R₂ · R₃) / R₄ = (1000 × 2000) / 5000 = 400 Ω.',
                ],
                result: 'L_x = 0.40 H, R_x = 400 Ω.',
              },
            ],
            realWorldApplications: {
              summary: 'High-voltage power transformer bushing tanδ preventive testing (Schering bridge) and LCR component metrology.',
              industries: ['High-Voltage Testing', 'Transformer OEMs', 'Component QA'],
              examples: ['HV Schering bridge tanδ test on substation transformer bushings before energization'],
            },
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Magnetic Measurements',
        hours: 5,
        summary: 'B-H hysteresis loop plotting, Hopkinson bar permeameter, wattmeter iron-loss separation (hysteresis vs eddy current), and fluxmeter leakage factor.',
        topics: [
          {
            id: 'emmi-u4-magnetic',
            title: 'Hysteresis Loop, Hopkinson Permeameter, Iron Loss Separation & Leakage Factor',
            summary: 'Ballistic galvanometer/fluxmeter B-H testing and frequency-swept wattmeter separation of core losses.',
            explanation:
              'Determining magnetic steel lamination quality requires plotting B-H magnetization and hysteresis loops via step-reversal flux switching (Hopkinson bar permeameter uses a massive low-reluctance yoke clamping the test specimen with magnetizing & search coils). Core iron loss splits into Hysteresis loss (P_h = k_h·f·B_max^1.6, linear with f) and Eddy-Current loss (P_e = k_e·f²·B_max², quadratic with f). Keeping flux peak B_max constant (via constant V/f ratio!) while measuring core watts at two frequencies plots P_core/f vs f as a straight line (intercept = k_h, slope = k_e)! Magnetic Leakage Factor λ = Φ_total / Φ_useful is measured by pulling search coils linked to a heavily damped Grassot Fluxmeter.',
            workingPrinciple:
              'Holding V/f constant holds peak core flux density B_max fixed so P_core / f = A + B·f cleanly separates hysteresis and eddy losses.',
            equations: [
              { label: 'Core Loss Separation (Constant V/f)', latex: '\\frac{P_{\\text{iron}}}{f} = k_h B_m^{1.6} + k_e B_m^2\\, f = A + B f' },
            ],
            realWorldApplications: {
              summary: 'Qualifying CRGO silicon steel laminations for transformers, motors, and solenoid actuators to minimize no-load heating.',
              industries: ['Electrical Machines OEMs', 'Power Utilities'],
              examples: ['Epstein frame core-loss grading test on transformer core steel'],
            },
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Instrument Transformers (CT & PT)',
        hours: 6,
        summary: 'Current Transformer (CT) and Potential Transformer (PT) theory, construction, phasor ratios, ratio & phase-angle errors, and open-secondary hazard.',
        topics: [
          {
            id: 'emmi-u5-ct-pt',
            title: 'Current Transformers (CT) & Potential Transformers (PT)',
            summary: 'Stepping 1000+ A / 11–400 kV lines down to standardized 1 A / 5 A and 110 V relay/meter inputs safely.',
            explanation:
              'Instrument transformers galvanically isolate and scale lethal high-voltage/high-current switchgear down to standard 5 A / 1 A (CT) and 110 V (PT) inputs for protection relays, wattmeters, and SCADA transducers. Because magnetizing current I_0 (with core-loss component I_w and magnetizing component I_m) steals a tiny portion of primary current, real CTs suffer Ratio Error and Phase Angle Error θ (crucial for wattmeter/energy accuracy!). CRITICAL SAFETY RULE: NEVER open-circuit the secondary of an energized CT! Without secondary counter-MMF, the entire primary line current turns into magnetizing current—driving the core into deep magnetic saturation and inducing lethal multi-kilovolt spikes across the open secondary terminals while overheating the core!',
            workingPrinciple:
              'Shorting blocks on CT terminal strips keep secondary closed near zero-impedance burden at all times during meter swaps.',
            equations: [
              { label: 'CT Ratio Error & Phase Angle', latex: '\\%\\text{Ratio Error} = \\frac{K_n I_s - I_p}{I_p} \\times 100\\%, \\qquad \\theta \\approx \\frac{180}{\\pi} \\left(\\frac{I_m \\cos\\delta - I_w \\sin\\delta}{n I_s}\\right)^\\circ' },
            ],
            comparison: {
              peer: 'Potential Transformer (PT) vs Current Transformer (CT)',
              takeaway: 'PT acts like a conventional voltage transformer (secondary MUST NEVER be shorted!); CT runs as a current-fed series transformer (secondary MUST NEVER be opened!).',
            },
            realWorldApplications: {
              summary: 'Plant electrical substations, motor MCC feeder protection relays, and tariff kWh/kVAR metering.',
              industries: ['Power Substations', 'Refineries', 'Steel & Cement'],
              examples: ['11 kV / 110 V PT & 800/5 A Protection CT feeding differential motor relay'],
            },
            interviewItems: [
              {
                level: 'Beginner',
                question: 'Why must the secondary of a live Current Transformer (CT) NEVER be left open-circuited?',
                answer: 'Normally, secondary current MMF opposes primary current MMF to keep core flux small. Opening the secondary eliminates opposing MMF, forcing the entire primary current to act as magnetizing current—saturating the core violently and inducing dangerous high-voltage peaks across the open terminals!',
              },
            ],
          },
        ],
      },
      {
        unitNumber: 6,
        title: 'Cathode Ray Oscilloscope (CRO) and DSO',
        hours: 7,
        summary: 'CRO principle & block diagram, CRT gun/deflection plates, Lissajous patterns, V/f/phase measurement, 10× passive probes, and Digital Storage Oscilloscopes (DSO).',
        topics: [
          {
            id: 'emmi-u6-cro-dso',
            title: 'CRO Block Diagram, CRT, Lissajous Patterns, Probes & DSO',
            summary: 'Sawtooth time-base triggering, X-Y Lissajous frequency ratios & phase sinθ = y₁/y₂, 10× RC probe compensation, and DSO ADC capture.',
            explanation:
              'An analog CRO sweeps a focused electron beam horizontally via an internal linear sawtooth time-base generator (triggered synchronously on input rising/falling edge so repetitive waveforms stand steady) while vertical plates deflect proportional to input voltage. In X-Y mode (time-base OFF), applying two sine waves displays Lissajous figures: frequency ratio f_y / f_x = (horizontal tangencies) / (vertical tangencies), and for equal frequency ellipses, phase difference sin φ = y_intercept / y_max! Compensating a 10× probe (9 MΩ || C_comp) aligns its RC time constant with scope 1 MΩ || C_in so high-frequency square edges neither droop nor overshoot. Modern DSOs replace CRT persistence with high-speed Flash/interleaved ADCs, circular capture memory, pre-trigger fault capture, and FFT spectral views.',
            workingPrinciple:
              'Vertical electrostatic deflection D = (L·l_d·V_d)/(2·d·V_a) scales linearly with deflection voltage V_d and inversely with accelerating anode voltage V_a.',
            equations: [
              { label: 'Lissajous Phase & Frequency Ratio', latex: '\\sin\\phi = \\frac{y_1}{y_2}, \\qquad \\frac{f_y}{f_x} = \\frac{\\text{Number of Horizontal Tangencies}}{\\text{Number of Vertical Tangencies}}' },
              { label: '10× Probe Compensation Balance', latex: 'R_1 C_1 = R_{\\text{scope}} (C_{\\text{cable}} + C_{\\text{scope}})' },
            ],
            realWorldApplications: {
              summary: 'Debugging VFD PWM switching edges, HART FSK waveforms, Modbus RS-485 bus ringing, and single-shot relay trip capture on DSOs.',
              industries: ['Electronics Labs', 'Industrial Maintenance', 'Drives & Automation'],
              examples: ['Using DSO pre-trigger single-shot capture to catch intermittent PLC power-supply brownouts'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'PMMC vs Moving Iron (MI) Instruments',
        leftName: 'PMMC (D’Arsonval)',
        rightName: 'Moving Iron (MI)',
        rows: [
          { criterion: 'Quantity Measured', leftValue: 'DC Average ONLY (reads 0 on symmetric AC)', rightValue: 'Both DC and AC (True RMS!)' },
          { criterion: 'Scale & Damping', leftValue: 'Uniform linear scale; Eddy-current damping', rightValue: 'Non-uniform cramped scale (θ ∝ I²); Air-friction damping' },
          { criterion: 'Accuracy & Burden', leftValue: 'High precision (0.1%–0.5%), low power loss', rightValue: 'Robust & cheap switchboard meter (1%–2%)' },
        ],
      },
      {
        title: 'Current Transformer (CT) vs Potential Transformer (PT)',
        leftName: 'Current Transformer (CT)',
        rightName: 'Potential Transformer (PT)',
        rows: [
          { criterion: 'Connection & Burden', leftValue: 'Primary wired in SERIES; secondary operates nearly SHORTED', rightValue: 'Primary wired in PARALLEL; secondary operates nearly OPEN (high Z)' },
          { criterion: 'Forbidden Fault State', leftValue: 'NEVER open secondary under load (core saturation + kV shock!)', rightValue: 'NEVER short secondary (burns primary fuse/winding!)' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-emmi-1',
        level: 'Beginner',
        topic: 'PMMC vs Moving Iron',
        question: 'If you pass a half-wave rectified 10 A peak sine current through both a PMMC ammeter and a Moving Iron (MI) ammeter wired in series, what does each read?',
        options: [
          'PMMC reads Average (I_m/π = 3.18 A); MI reads RMS (I_m/2 = 5.00 A).',
          'Both read 7.07 A.',
        ],
        correctIndex: 0,
        answer: 'PMMC = 3.18 A (average); MI = 5.00 A (RMS).',
        principle: 'Half-wave rectified average = I_m/π; RMS = I_m/2.',
        followUpIfCorrect: 'Great! Now suppose you replace the half-wave signal with pure symmetric 50 Hz AC (10 A peak). What do the PMMC and MI read now?',
        followUpIfReview: 'Remember PMMC torque reverses every half-cycle, so it averages linearly; MI torque goes as I² so negative half-cycles deflect in the same direction!',
        followUpAnswer: 'On pure 50 Hz AC, PMMC inertia cannot follow 50 Hz reversals and reads 0.00 A, while MI reads full-wave RMS = 10 / √2 = 7.07 A!',
      },
      {
        id: 'sim-emmi-2',
        level: 'Intermediate',
        topic: 'AC Bridge Selection',
        question: 'Which AC bridge is specifically preferred to measure high-voltage insulation capacitance & dielectric loss angle (tan δ), and why?',
        options: [
          'Schering Bridge—because the unknown HV capacitor sits on the high-voltage arm while variable R₄ and C₄ stay safely grounded near operator potential!',
          'Maxwell Inductance Bridge.',
        ],
        correctIndex: 0,
        answer: 'Schering Bridge keeps low-impedance adjustment elements safely on the grounded low-voltage arms.',
        principle: 'High-voltage insulation testing measures tanδ = ωC₄R₄ safely at null.',
        followUpIfCorrect: 'Spot on! And which bridge would you pick instead if measuring a high-Q (Q > 10) air-core inductor?',
        followUpIfReview: 'Think safety: in high-voltage transformer tests, the technician’s adjustment dials must sit at earth potential!',
        followUpAnswer: 'Use Hay’s Bridge for high-Q (>10) coils (uses a small series resistance R₄ instead of huge parallel MΩ resistor required by Maxwell L-C!).',
      },
    ],
  },

  // =========================================================================
  // E. CIRCUIT THEORY (Listed in Sem III Learning Scope — Code Pending Verification)
  // =========================================================================
  {
    id: 'nitj-sem3-ct',
    semester: 3,
    displaySemesterLabel: 'Semester III',
    code: 'VERIFY-CODE',
    name: 'Circuit Theory',
    shortName: 'Circuit Theory',
    credits: 4,
    category: 'Foundations',
    syllabusStatus: 'core-code-verify',
    syllabusBadge: 'Core Foundation · Code Flagged for Verification',
    overview:
      'Foundational network theory (KVL/KCL, Thevenin/Norton, Laplace s-domain transients, two-port networks & resonance) feeding directly into Control Systems and Analog Electronics. Note: exact NITJ course code is flagged for official registration sheet verification.',
    units: [
      {
        unitNumber: 1,
        title: 'Network Theorems, Nodal/Mesh Analysis & Thevenin/Norton Equivalents',
        hours: 10,
        summary: 'Dependent-source network reduction, superposition, maximum power transfer, and bridge Thevenin equivalents.',
        topics: [
          {
            id: 'ct-u1-theorems',
            title: 'Thevenin, Norton, Superposition & Maximum Power Transfer',
            summary: 'Reducing complex sensor bridges into a single V_th + R_th source to quantify loading errors cleanly.',
            explanation:
              'Every linear Wheatstone bridge or divider reduces via Thevenin’s theorem to V_th in series with R_th (R_1||R_2 + R_3||R_4), allowing immediate loading-error checks when connected to an amplifier or galvanometer.',
            workingPrinciple: 'Maximum power transfers when R_L = R_th (for DC) or Z_L = Z_th* (for AC); maximum voltage fidelity transfers when R_L >> R_th.',
            equations: [{ label: 'Bridge Thevenin Impedance', latex: 'R_{\\text{th}} = (R_1 \\parallel R_2) + (R_3 \\parallel R_4)' }],
            realWorldApplications: {
              summary: 'Calculating 4–20 mA compliance drops, bridge loading distortion, and impedance matching on ultrasonic transducers.',
              industries: ['Electronics', 'Instrumentation Design'],
              examples: ['Computing Wheatstone bridge loading error across analog galvanometer vs INA'],
            },
            crossLinks: [{ label: 'Control System Engineering (Sem IV)', targetSubjectId: 'nitj-sem4-control', note: 'Electrical RLC networks and s-domain transfer functions directly build Sem IV control models.' }],
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Laplace Transients, AC Resonance & Two-Port Networks',
        hours: 10,
        summary: 'RL/RC/RLC natural/forced response, initial/final value theorems, Q-factor resonance, and Z/Y/h/ABCD two-port matrices.',
        topics: [
          {
            id: 'ct-u2-laplace-twoport',
            title: 's-Domain Laplace Transients, Resonance & Two-Port Parameters',
            summary: 'Converting differential equations to s-domain algebraic impedances (sL, 1/sC) and modeling cascaded blocks via h/ABCD parameters.',
            explanation:
              'Applying Laplace transforms converts coupled RLC differential equations into s-domain algebra including initial capacitor voltage V_0/s and inductor current I_0/s. Two-port parameter sets (h-parameters for BJT small-signal analysis in ECDC0213; ABCD transmission parameters for long instrumentation cables) link cascading hardware cleanly.',
            workingPrinciple: 'Poles of network transfer function H(s) dictate transient decay rate and resonant oscillation frequency ω_0 = 1/√(LC).',
            equations: [{ label: 'Series RLC Resonance & Quality Factor', latex: '\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\qquad Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}' }],
            realWorldApplications: {
              summary: 'Directly underlies BJT hybrid models (Sem III ECDC0213), transfer-function modeling (Sem IV ICDC0206), and active filter design.',
              industries: ['Control Systems', 'Analog Front-Ends', 'Filter Design'],
              examples: ['Converting an RLC circuit into s-domain transfer function V_out(s)/V_in(s) for Bode/Root-Locus design'],
            },
          },
        ],
      },
    ],
    comparisons: [],
    simulatorQuestions: [
      {
        id: 'sim-ct-1',
        level: 'Beginner',
        topic: 'Thevenin Sensor Loading',
        question: 'A voltage sensor with V_th = 2.0 V and internal R_th = 10 kΩ connects to an ADC buffer with R_in = 90 kΩ. What % loading error occurs?',
        options: ['10% under-reading (reads 1.80 V)', '1% over-reading'],
        correctIndex: 0,
        answer: 'V_meas = 2.0 × 90 / (10 + 90) = 1.80 V ⇒ −10% loading error!',
        principle: 'Voltage fidelity demands R_load >> R_th (at least 1000× for <0.1% error).',
        followUpIfCorrect: 'Spot on! That is why pH glass electrodes (R_th ~100 MΩ) demand >10¹² Ω CMOS electrometers.',
        followUpIfReview: 'Apply the simple voltage divider rule: R_load / (R_th + R_load) = 90 / 100 = 0.90.',
        followUpAnswer: 'Always buffer high-source-impedance sensors with an op-amp voltage follower before sampling.',
      },
    ],
  },
];

