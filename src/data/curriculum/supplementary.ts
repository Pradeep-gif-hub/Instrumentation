import type { CrossSemesterPathway, CurriculumSubjectDetail } from '@/types/curriculum';

export const SUPPLEMENTARY_SUBJECTS: CurriculumSubjectDetail[] = [
  // =========================================================================
  // TESTING AND CALIBRATION (ICMI0303 - Sem V Elective-I / Minor Digital Healthcare)
  // =========================================================================
  {
    id: 'nitj-supp-cal',
    semester: 'additional',
    displaySemesterLabel: 'Additional · Sem V Elective-I (Minor)',
    code: 'ICMI0303',
    name: 'Testing and Calibration',
    shortName: 'Testing & Calibration',
    credits: 3,
    category: 'Supplementary',
    syllabusStatus: 'supplementary-elective',
    syllabusBadge: 'Sem V Elective-I · Minor in Digital Healthcare (Supplementary)',
    overview:
      'IMPORTANT NOTE: ICMI0303 is a Semester V Elective-I in the NITJ Minor Degree in Digital Healthcare (observed in student notes), NOT a confirmed compulsory core ICE subject. It bridges laboratory metrology, field loop calibration, uncertainty budgets, and ISO/IEC 17025 documentation.',
    units: [
      {
        unitNumber: 1,
        title: 'Metrology Fundamentals, Traceability & Uncertainty',
        hours: 7,
        summary: 'True vs indicated value, NIST/NABL unbroken traceability chain, TUR ≥ 4:1 rule, Type A/B uncertainty budgets, and zero/span/linearity adjustments.',
        isExtension: true,
        topics: [
          {
            id: 'cal-u1-fundamentals',
            title: 'Calibration vs Verification, Traceability & Test Uncertainty Ratio',
            summary: 'Broken vs unbroken standard hierarchy, 5-point upscale/downscale sweep, TUR ≥ 4:1, zero/span interaction, and combined expanded uncertainty k=2.',
            isExtension: true,
            verificationFlag: 'Supplementary Module (ICMI0303 — Sem V Elective-I / Minor in Digital Healthcare; not confirmed compulsory ICE core).',
            explanation:
              'Calibration compares a Unit Under Test (UUT) against a working standard of known higher accuracy without necessarily altering the UUT (adjustment follows only if As-Found errors exceed tolerance). Metrological traceability links every plant calibrator through an unbroken chain of comparisons—working standard → secondary lab → NPL India (NABL) / NIST → SI primary realization—with documented uncertainty at each tier. Good engineering practice requires Test Uncertainty Ratio (TUR = Tolerance_UUT / Uncertainty_standard) ≥ 4:1 so calibration decisions avoid false pass/fail calls. Combining statistical repeatability (Type A: s/√n) with datasheet/drift tolerances (Type B: a/√3 for rectangular distribution) yields combined uncertainty u_c and 95%-confidence expanded uncertainty U = 2·u_c.',
            workingPrinciple:
              'Five-point bidirectional sweeps (0%, 25%, 50%, 75%, 100% ↑ then ↓) isolate Zero Shift (offset), Span Slope error, Linearity curvature, and mechanical Hysteresis loop width simultaneously.',
            equations: [
              { label: 'Test Uncertainty Ratio & Expanded Uncertainty (k=2)', latex: '\\text{TUR} = \\frac{\\text{Tol}_{\\text{UUT}}}{\\text{U}_{\\text{cal}}} \\ge 4, \\qquad U_{95\\%} = 2\\sqrt{u_A^2 + u_B^2}' },
            ],
            realWorldApplications: {
              summary: 'Essential QA competency for shutdown instrumentation engineers, NABL accredited calibration labs, and pharmaceutical GMP audits.',
              industries: ['Pharmaceuticals (GMP)', 'NABL Metrology Labs', 'Refineries', 'Medical Devices'],
              examples: ['Running 5-point As-Found loop checks before adjusting HART transmitter LRV/URV trim', 'Maintaining TUR ≥ 4:1 using ±0.025% BEAMEX/Fluke document calibrators'],
            },
            linkedPlatformRoute: '/toolbox/measurement-error',
            linkedPlatformLabel: 'Compute RSS Uncertainty & TUR',
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Calibration Practices for Field & Lab Instruments',
        hours: 8,
        summary: 'RTD ice-bath/dry-well, thermocouple CJC simulation, Dead-Weight Tester pressure/DP, flow provers, pH two-point buffers, DMM & CRO calibration.',
        isExtension: true,
        topics: [
          {
            id: 'cal-u2-practices',
            title: 'Temperature, Pressure, Flow, Analyzer & Electronic Test Calibration',
            summary: 'Dry-block vs SPRT bath, DWT gravity/buoyancy correction, 4–20 mA smart trim, gravimetric flow proving, pH buffer 7/4, DMM & CRO 1 kHz probe comp.',
            isExtension: true,
            explanation:
              'Each physical variable requires distinct reference artifacts: (1) RTDs undergo whole-loop immersion in silicone-oil stirred baths or dry-well calibrators (checking α = 0.00385 against SPRT) or electrical Ω simulation at the transmitter terminals; (2) Thermocouples require ice-point or precision dry-well furnaces plus ice-bath CJC verification (electrical mV simulation checks transmitter electronics only, NOT thermocouple wire inhomogeneity!); (3) Pressure/DP gauges use hydraulic Dead-Weight Testers or precision pneumatic piston calibrators; (4) Flowmeters rely on gravimetric bucket/weigh-tank timing, ballistic volume provers (custody pipelines), or clamped master meters; (5) pH transmitters use temperature-equilibrated NIST buffers (Zero at pH 7.00, Slope at pH 4.01/10.01) while UV-Vis specs use holmium-oxide wavelength filters; (6) DMMs and CROs calibrate DC/AC gain across decades plus oscilloscope 1 kHz square-wave probe compensation.',
            workingPrinciple:
              'Never confuse electrical sensor simulation (tests transmitter ADC/DAC only) with full physical stimulus calibration (tests thermowell-to-DCS end-to-end sensor degradation).',
            realWorldApplications: {
              summary: 'Daily turnaround and preventive maintenance execution across refineries, biotech fermenters, and electronics ATE benches.',
              industries: ['Turnaround Maintenance', 'Clinical Diagnostics', 'Utilities', 'Test & Measurement'],
              examples: ['Annual USP pharmaceutical autoclave RTD dry-block verification', 'Proving custody oil turbine meters via bidirectional sphere prover'],
            },
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Industrial SOPs, Calibration Certificates & ISO/IEC 17025',
        hours: 6,
        summary: 'SOP structure, As-Found vs As-Left datasheets, interval drift scheduling, tamper stickers, and ISO/IEC 17025 competence requirements.',
        isExtension: true,
        topics: [
          {
            id: 'cal-u3-iso17025',
            title: 'Calibration SOPs, As-Found / As-Left Records & ISO/IEC 17025',
            summary: 'Audit-proof certificate fields, drift-based interval extension vs shortening, and ISO/IEC 17025 traceability + decision-rule compliance.',
            isExtension: true,
            explanation:
              'Every industrial calibration executes under an approved Standard Operating Procedure (SOP) recording ambient temperature/RH, standard serial & expiry, As-Found readings BEFORE touching trim screws (crucial for retrospective batch impact recalls!), adjustment log, and verified As-Left readings. Calibration intervals start conservatively (6–12 months) and adapt statistically: repeated clean As-Found checks allow doubling interval, while out-of-tolerance drift triggers root-cause analysis and shorter intervals. ISO/IEC 17025 mandates documented unbroken SI traceability, complete measurement uncertainty statements, validated test methods, and explicit binary Decision Rules (ILAC-G8 guard-banding accounting for uncertainty near spec limits).',
            workingPrinciple:
              'Recording As-Found data before adjustment proves whether historical plant production between previous and current calibrations remained within quality limits.',
            realWorldApplications: {
              summary: 'Mandatory for FDA 21 CFR Part 11 pharma compliance, CPCB emission stack certification, and ISO 9001 plant audits.',
              industries: ['Pharma GMP', 'NABL Calibration Houses', 'Environmental Compliance'],
              examples: ['Generating signed As-Found/As-Left certificates with guard-band pass/fail', 'Applying tamper-evident calibration due stickers to field pressure gauges'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Electrical Sensor Simulation vs Full Physical Calibration',
        leftName: 'Terminal Electrical Simulation (mV / Ω)',
        rightName: 'Physical Reference Stimulus (Dry-Well / DWT)',
        rows: [
          { criterion: 'Scope Tested', leftValue: 'Transmitter electronics, loop wiring & PLC/DCS scaling only', rightValue: 'Complete chain: primary sensor element + transmitter + readout' },
          { criterion: 'Detects Sensor Poisoning?', leftValue: 'No — fails to catch thermocouple oxidation or clogged impulse leg', rightValue: 'Yes — exposes probe drift, stem conduction, or diaphragm hysteresis' },
        ],
      },
      {
        title: 'FIR vs IIR Digital Filters (Additional Signal Processing Enrichment)',
        leftName: 'FIR (Finite Impulse Response)',
        rightName: 'IIR (Infinite Impulse Response)',
        isEnrichment: true,
        rows: [
          { criterion: 'Impulse Duration & Poles', leftValue: 'Non-recursive (all poles at z=0); inherently BIBO stable', rightValue: 'Recursive feedback y[n−k]; stability requires poles inside unit circle |z|<1' },
          { criterion: 'Phase Response', leftValue: 'Exact linear phase easily achieved via symmetric coefficients', rightValue: 'Nonlinear phase distortion near cutoff (requires group-delay compensation)' },
          { criterion: 'Computational Cost', leftValue: 'Higher filter order N for sharp transition bands', rightValue: 'Compact low order (Butterworth/Chebyshev) mimicking analog prototypes' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-cal-1',
        level: 'Practical Scenario',
        topic: 'As-Found Protocol & TUR',
        question: 'A field engineer adjusts a zero-drifted DP flow transmitter BEFORE recording initial output, then logs 0.00% error on the calibration sheet. Why is this audit-critical failure?',
        options: [
          'Destroys As-Found evidence needed to assess product quality/safety risk since the last calibration.',
          'Damages the HART modem EEPROM memory.',
          'Violates Nyquist sampling theorem.',
        ],
        correctIndex: 0,
        answer: 'Deleting As-Found history blinds quality/safety engineers to how far out-of-tolerance the loop was operating before turnaround maintenance.',
        principle: 'ISO/IEC 17025 and GMP require untouched As-Found recording prior to any zero/span trim adjustment.',
        followUpIfCorrect: 'If a ±0.5% accuracy pressure gauge is calibrated using a ±0.25% digital gauge (TUR = 2:1), why is that calibration statistically unsafe?',
        followUpIfReview: 'Think about a pharma bioreactor running slightly too hot for 6 months—what record tells QA whether batches were ruined?',
        followUpAnswer: 'TUR = 2:1 falls short of ≥ 4:1—standard uncertainty equals half the tolerance band, creating wide false-accept / false-reject guard-band overlap!',
      },
    ],
  },

  // =========================================================================
  // DRIVE-ALIGNED FOUNDATION SUBJECTS (Semesters I & II — No fabricated codes)
  // =========================================================================
  {
    id: 'nitj-sem1-found',
    semester: 1,
    displaySemesterLabel: 'Semester I (Foundation)',
    code: 'SEM1-FOUND',
    name: 'Engineering Mathematics I, Physics & Basic Circuit Foundations',
    shortName: 'Sem I Math & Physics',
    credits: 4,
    category: 'Foundations',
    syllabusStatus: 'foundation-drive',
    syllabusBadge: 'Foundational Bridge · Verify Official Sem I Codes',
    overview:
      'Indicative first-semester STEM foundations preparing students for NITJ ICE Semester III: multivariable calculus, differential equations, matrices, semiconductor/optical physics, and KCL/KVL DC fundamentals (exact Sem I codes vary by Year-1 physics/chemistry cycle rotation).',
    units: [
      {
        unitNumber: 1,
        title: 'Calculus, Linear Algebra & Applied Optics/Semiconductors',
        hours: 10,
        summary: 'Taylor series, eigenvalues, ordinary differential equations, electromagnetic waves/interference, and semiconductor carrier basics.',
        isExtension: true,
        topics: [
          {
            id: 'f1-u1-bridge',
            title: 'Taylor Series, Linear ODEs & Eigenvalues as Control/Numerical Backbone',
            summary: 'Every linearization (PDC), state transition matrix e^(At) (MCS), and Newton-Raphson step (NM) builds directly on Semester I calculus & linear algebra.',
            verificationFlag: 'Foundational bridge module — verify individual Year-1 course registration codes on your NITJ ERP portal.',
            explanation:
              'Linear approximation f(x) ≈ f(x₀) + f′(x₀)Δx underpins Jacobian linearization in Process Dynamics & Control as well as Newton-Raphson iteration in Numerical Methods. Matrix determinants and eigenvectors evolve directly into Kalman controllability rank and natural modes of State-Space models, while first/second-order homogeneous and forced ODEs define thermal thermometer lag (τ) and seismic accelerometer damping (ζ, ω_n).',
            workingPrinciple:
              'Consistent first-year calculus and matrix algebra directly eliminate derivation bottlenecks across Semesters III–V.',
            realWorldApplications: {
              summary: 'Universal quantitative foundation for engineering analysis and simulation scripts.',
              industries: ['Engineering R&D', 'Embedded Modeling', 'Control Design'],
              examples: ['Computing thermal ramp response via 1st-order integrating factor', 'Eigenvalue natural frequency modal extraction'],
            },
            crossLinks: [
              { label: 'Numerical Methods (Sem III)', targetSubjectId: 'nitj-sem3-nm', note: 'Taylor truncation error yields Euler/RK order proofs.' },
              { label: 'Control System Engineering (Sem IV)', targetSubjectId: 'nitj-sem4-control', note: 'Linear ODEs transform directly into s-domain Transfer Functions.' },
            ],
          },
        ],
      },
    ],
    comparisons: [],
    simulatorQuestions: [],
  },
  {
    id: 'nitj-sem2-drive',
    semester: 2,
    displaySemesterLabel: 'Semester II (Drive-Aligned)',
    code: 'SEM2-DRIVE',
    name: 'Mathematics II, Python, Basic Electronics, EME & Management (MPP)',
    shortName: 'Sem II Drive Foundations',
    credits: 4,
    category: 'Foundations',
    syllabusStatus: 'foundation-drive',
    syllabusBadge: 'Drive-Aligned Sem II Folders · Verify Exact Codes',
    overview:
      'Aligned directly with your uploaded 2nd Semester Drive archive: Python Programming, Mathematics 2 (Laplace/Fourier/Complex Variables), Basic Electronics, Element of Mechanical Engineering (EME), and Management Principles (MPP).',
    units: [
      {
        unitNumber: 1,
        title: 'Mathematics II & Python Computing',
        hours: 8,
        summary: 'Laplace transforms, Fourier series/transforms, vector calculus, and Python scientific scripting (functions, arrays, iterative solvers).',
        isExtension: true,
        topics: [
          {
            id: 'f2-u1-math2-py',
            title: 'Laplace / Fourier Transforms & Python Engineering Scripting',
            summary: 'Frequency-domain Laplace pairs and Python numerical loops powering Sem III Numerical Methods and Sem IV Bode/Nyquist analysis.',
            verificationFlag: 'Aligned with uploaded 2nd Semester Drive folders ("Mathematics 2", "Python") — official Sem II codes intentionally omitted unless confirmed.',
            explanation:
              'Mathematics II equips ICE engineers with Laplace transforms (converting differential equations into rational s-plane transfer functions), partial differential heat/wave PDEs (used in distributed heat exchangers), and Fourier series (harmonic analysis in EMMI & analytical FTIR). Simultaneously, Python provides reproducible numerical verification via NumPy/SciPy iteration for Bisection, Newton-Raphson, and RK4 ODE simulation in Semester III Numerical Methods.',
            workingPrinciple:
              'Replacing time-domain convolution integrals with algebraic s-domain multiplication Y(s) = G(s)·U(s) unlocks block-diagram control design.',
            realWorldApplications: {
              summary: 'Drives rapid laboratory curve fitting, sensor calibration linearization polynomials, and automated test scripts.',
              industries: ['ATE Test Engineering', 'Data Analytics', 'Process Simulation'],
              examples: ['Python least-squares Callendar-Van Dusen Pt100 curve fitting', 'FFT harmonic analysis of power-line 50 Hz pickup'],
            },
            crossLinks: [
              { label: 'Numerical Methods (Sem III)', targetSubjectId: 'nitj-sem3-nm', note: 'Implement Bisection/RK4/Simpson algorithms directly in Python.' },
            ],
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Basic Electronics, Elements of Mechanical Engineering & MPP',
        hours: 8,
        summary: 'PN diode, BJT basics, op-amp intro; stress/strain/thermodynamics/fluid mechanics (EME); and engineering economics/project management (MPP).',
        isExtension: true,
        topics: [
          {
            id: 'f2-u2-elec-eme',
            title: 'Basic Electronics & Element of Mechanical Engineering (EME) Bridge',
            summary: 'Diode/BJT building blocks leading into ADE (ECDC0213), plus Bernoulli fluid mechanics, stress-strain, and thermodynamics feeding TSC & IMS.',
            verificationFlag: 'Aligned with uploaded 2nd Semester Drive folders ("Basic Electronics", "Element of Mechanical Engineering", "Management Principles MPP").',
            explanation:
              'Element of Mechanical Engineering supplies Hooke’s law σ = Eε (foundation of bonded metal-foil strain gauges & Bourdon tubes), Bernoulli pressure-velocity conservation (directly giving Orifice/Venturi flow ΔP ∝ Q²!), and Fourier conduction thermal balance (leading to CSTR & heat exchanger dynamics in PDC). Basic Electronics introduces semiconductor PN junctions, Zener regulation, and small-signal transistors expanded thoroughly in Sem III Analog & Digital Electronics. Management Principles (MPP) introduces technical project scheduling, ISO quality management, and lifecycle plant economics.',
            workingPrinciple:
              'Sensor transduction translates mechanical elasticity (strain ε) or fluid pressure drops (ΔP) into analog millivolt signals processed by electronic stages.',
            realWorldApplications: {
              summary: 'Connects first-year mechanical thermodynamics/fluid basics to field plant pressure vessels, flow meters, and engineering project delivery.',
              industries: ['EPC Project Execution', 'Fluid Process Plants', 'Mechanical/Mechatronics'],
              examples: ['Applying EME Bernoulli + Continuity to compute Venturi throat velocity', 'Biasing LED indicator stages from Basic Electronics'],
            },
            crossLinks: [
              { label: 'Analog & Digital Electronics (Sem III)', targetSubjectId: 'nitj-sem3-ade', note: 'Advances PN/BJT basics into op-amps, timers, logic, and DAC/ADC.' },
              { label: 'Industrial Measurement Systems (Sem IV)', targetSubjectId: 'nitj-sem4-ims', note: 'Applies Bernoulli and stress mechanics directly to flowmeters & load cells.' },
            ],
          },
        ],
      },
    ],
    comparisons: [],
    simulatorQuestions: [],
  },
];

// =========================================================================
// SECTION 8: CROSS-SEMESTER KNOWLEDGE GRAPH (6 CORE PATHWAYS)
// =========================================================================
export const CROSS_SEMESTER_PATHWAYS: CrossSemesterPathway[] = [
  {
    id: 'path-temperature-chain',
    title: '1. Thermal & Resistance Physics -> Industrial Thermometry -> Calibration Traceability',
    chain: [
      { semesterLabel: 'Sem I/II', subjectId: 'nitj-sem2-drive', subjectName: 'Math II & Mech./Physics', concept: 'Fourier conduction & electrical resistivity ρ(T)' },
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-tsc', subjectName: 'TSC (ICDC0205)', concept: 'RTD Callendar-Van Dusen, 3-wire Wheatstone & Thermocouple CJC' },
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-ims', subjectName: 'IMS (ICDC0208)', concept: 'ITS-90, ASME thermowells, filled bulbs & two-color pyrometers' },
      { semesterLabel: 'Addl.', subjectId: 'nitj-supp-cal', subjectName: 'Calibration (ICMI0303)', concept: 'Dry-well bath sweeps, TUR ≥ 4:1 & ISO 17025 certificates' },
    ],
    prerequisiteConcept: 'Electrical resistance variation α = (1/R)(dR/dT), Seebeck thermoelectric junctions, and lumped thermal capacitance τ = mC/hA.',
    introducedIn: 'Sem III · Transducers & Signal Conditioning (ICDC0205) — Unit 1 & Unit 3',
    developedIn: 'Sem IV · Industrial Measurement Systems (ICDC0208) + Additional Calibration (ICMI0303)',
    industrialApplication: 'End-to-end temperature loop in an exothermic chemical reactor: Pt100 sensor inside tapered thermowell → 3-wire compensated head transmitter → SIL-rated safety barrier → DCS cascade controller.',
    interviewQuestion: 'Why does a 3-wire Pt100 bridge cancel equal lead-wire resistance completely only when balanced, and why might a dry-well bath calibration still miss thermocouple installation error?',
    interviewAnswer: 'At Wheatstone null, two matched copper leads sit in adjacent ratio arms and cancel if R_L1 = R_L2; off-null introduces minor span ratio error (solved cleanly by 4-wire Kelvin). Thermocouple dry-well tests verify the sensing junction, whereas electrical mV simulation ignores heterogeneous drift along degraded thermowell extension wire.',
  },
  {
    id: 'path-feedback-control',
    title: '2. ODE/Laplace -> Circuit s-Domain -> Classical Control -> Process Loops -> Modern State-Space',
    chain: [
      { semesterLabel: 'Sem II', subjectId: 'nitj-sem2-drive', subjectName: 'Mathematics II', concept: 'Laplace transforms & linear differential equations' },
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-ct', subjectName: 'Circuit Theory', concept: 'RLC s-domain Transfer Functions & 2-port impedance' },
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-control', subjectName: 'Control Systems (ICDC0206)', concept: 'Routh, Root-Locus, Bode/Nyquist margins & Lead/Lag' },
      { semesterLabel: 'Sem V', subjectId: 'nitj-sem5-pdc', subjectName: 'Process Dynamics (ICDC0307)', concept: 'FOPDT dead-time Padé, PID/ZN/Cohen-Coon & Equal-% valves' },
      { semesterLabel: 'Sem V', subjectId: 'nitj-sem5-mcs', subjectName: 'Modern Control (ICDC0303)', concept: 'MIMO State-Space, Observers, Lyapunov & Optimal LQR' },
    ],
    prerequisiteConcept: 'Linear ODEs converted via zero-initial-condition Laplace transforms to s-plane poles/zeros, then generalized to coupled first-order state vectors ẋ = Ax + Bu.',
    introducedIn: 'Sem II Mathematics II & Sem III Circuit Theory (s-domain impedance)',
    developedIn: 'Sem IV Control Systems (ICDC0206) -> Sem V Process Dynamics (ICDC0307) & Modern Control (ICDC0303)',
    industrialApplication: 'Refinery distillation column control: cascading jacket flow/temperature PID loops via DCS (PDC/CSE) up to plantwide MIMO Model Predictive Control & state estimation (MCS).',
    interviewQuestion: 'A system has an open-loop unstable RHP pole cancelled by a numerator zero in its transfer function G(s). How do Classical Control vs Modern State-Space treat this?',
    interviewAnswer: 'Classical I/O transfer function G(s) cancels the (s − p) factor blindly and falsely predicts stability! Modern state-space tests eig(A) and Kalman Controllability/Observability rank, immediately catching the hidden unstable internal mode.',
  },
  {
    id: 'path-signal-conditioning',
    title: '3. Analog Electronics -> Instrumentation Amplifiers -> Noise-Immune 4–20 mA Loops -> Analytical Optics',
    chain: [
      { semesterLabel: 'Sem II', subjectId: 'nitj-sem2-drive', subjectName: 'Basic Electronics', concept: 'PN diodes, small-signal BJT biasing & KCL' },
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-ade', subjectName: 'ADE (ECDC0213)', concept: 'Op-Amps, Diff-Amps, Active Filters, 555 & SAR ADC' },
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-tsc', subjectName: 'TSC (ICDC0205)', concept: '3-Op-Amp In-Amp (CMRR), V-to-I 4–20 mA, Shielding & Grounding' },
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-ims', subjectName: 'IMS (ICDC0208)', concept: 'Dynamic lead compensation & ground-loop isolation' },
      { semesterLabel: 'Sem V', subjectId: 'nitj-sem5-aoi', subjectName: 'Analytical & Optical (ICDC0305)', concept: '>10¹² Ω JFET pH electrometer & lock-in PMT detection' },
    ],
    prerequisiteConcept: 'High common-mode rejection differential gain (CMRR), negative feedback virtual short, and active filtering against 50 Hz / VFD switching noise.',
    introducedIn: 'Sem III · Analog & Digital Electronics (ECDC0213) & TSC (ICDC0205)',
    developedIn: 'Sem IV · IMS Interference Mitigation -> Sem V · Analytical pH/Spectrometer front-ends',
    industrialApplication: 'Converting microvolt thermocouple/strain-bridge signals or 100 MΩ pH glass potentials cleanly into noise-immune 4–20 mA twisted-pair loops over 300 m cable runs.',
    interviewQuestion: 'Why does a plant instrumentation amplifier need CMRR > 100 dB and single-end shield grounding when interfacing a field bridge next to an AC motor VFD?',
    interviewAnswer: 'Induced 50 Hz/VFD common-mode spikes (several volts) appear equally on both differential bridge leads; high CMRR suppresses them cleanly, while grounding the foil shield at ONLY the control cabinet stops earth-potential ground-loop currents from flowing in the shield.',
  },
  {
    id: 'path-precision-metrology',
    title: '4. Measurement Fundamentals -> Electrical Bridges -> Industrial Flow/Level -> Analytical Quality',
    chain: [
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-tsc', subjectName: 'TSC (ICDC0205)', concept: 'Static/dynamic error, sensitivity & loading error' },
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-emmi', subjectName: 'EMMI (ICDC0203)', concept: 'Kelvin/Maxwell/Schering bridges, PMMC/MI & Wattmeter' },
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-ims', subjectName: 'IMS (ICDC0208)', concept: 'Orifice/Coriolis/Mag flow, DP level & Dead-Weight Testers' },
      { semesterLabel: 'Sem V', subjectId: 'nitj-sem5-aoi', subjectName: 'Analytical (ICDC0305)', concept: 'SNR, LOD, GC/HPLC retention & Beer-Lambert accuracy' },
      { semesterLabel: 'Addl.', subjectId: 'nitj-supp-cal', subjectName: 'Calibration (ICMI0303)', concept: 'TUR ≥ 4:1, As-Found/As-Left & ISO/IEC 17025' },
    ],
    prerequisiteConcept: 'Impedance matching, null-bridge insensitivity to excitation drift, and RSS uncertainty propagation across every link of a measurement chain.',
    introducedIn: 'Sem III · TSC & EMMI (ICDC0205 / ICDC0203)',
    developedIn: 'Sem IV · IMS Field Flow/Level -> Sem V · Analytical Analyzers -> ISO 17025 Calibration',
    industrialApplication: 'Custody-transfer LNG Coriolis metering and CEMS flue-gas compliance monitoring audited against NABL/ISO 17025 uncertainties.',
    interviewQuestion: 'Why are null-deflection AC/DC bridges intrinsically more accurate than simple deflection voltmeters for primary lab resistance/capacitance metrology?',
    interviewAnswer: 'At bridge null balance, zero current flows through the detector—eliminating meter spring calibration drift, coil loading error, and supply-voltage fluctuation!',
  },
  {
    id: 'path-machines-actuation',
    title: '5. Magnetics -> Rotating Machines & Drives -> Control Servomotors -> Final Control Valves',
    chain: [
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-machines', subjectName: 'Electrical Machines (ICDC0202)', concept: 'Hysteresis/eddy losses, Transformers, IM V/f & DC drives' },
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-control', subjectName: 'Control Systems (ICDC0206)', concept: 'AC/DC Servomotors, Tachogenerators & Stepper dynamics' },
      { semesterLabel: 'Sem V', subjectId: 'nitj-sem5-pdc', subjectName: 'Process Control (ICDC0307)', concept: 'I/P actuators, ATO/ATC valves, solenoids & hydraulic spools' },
    ],
    prerequisiteConcept: 'Lorentz torque generation T ∝ Φ·I, Faraday back-EMF e = Blv, and electromechanical transfer function ω(s)/V(s).',
    introducedIn: 'Sem IV · Electrical Machines (ICDC0202)',
    developedIn: 'Sem IV · Control Components (ICDC0206) -> Sem V · Final Control Elements (ICDC0307)',
    industrialApplication: 'Replacing throttling control valves on centrifugal cooling-water pumps with VFD-controlled 3-phase induction motors (saving cube-law affinity power) alongside pneumatic fail-safe globe valves on critical steam headers.',
    interviewQuestion: 'When choosing between throttling a fixed-speed pump with a control valve vs running an induction motor on a VFD, why can a VFD save massive plant kWh yet still not replace ESD shutdown valves?',
    interviewAnswer: 'VFD slows the pump directly so power drops with speed cubed (P ∝ N³) instead of wasting energy as valve ΔP heat loss; however, VFDs cannot provide tight bubble-tight mechanical shutoff or spring-fail-safe isolation in emergency trips!',
  },
  {
    id: 'path-numerical-control',
    title: '6. Python & Applied Math -> Numerical Algorithms -> Stability Polynomials -> Riccati Optimality',
    chain: [
      { semesterLabel: 'Sem II', subjectId: 'nitj-sem2-drive', subjectName: 'Python & Math II', concept: 'Iterative functions, matrices & differential calculus' },
      { semesterLabel: 'Sem III', subjectId: 'nitj-sem3-nm', subjectName: 'Numerical Methods (MCDC0203)', concept: 'Newton-Raphson, Gauss-Seidel, Splines, Simpson & RK4' },
      { semesterLabel: 'Sem IV', subjectId: 'nitj-sem4-control', subjectName: 'Control Systems (ICDC0206)', concept: 'Routh array & iterative root-locus breakaway solving' },
      { semesterLabel: 'Sem V', subjectId: 'nitj-sem5-mcs', subjectName: 'Modern Control (ICDC0303)', concept: 'Matrix exponential e^(At), eigenvalues & Algebraic Riccati' },
    ],
    prerequisiteConcept: 'Taylor truncation bounds, iterative convergence guarantees, Condition Numbers, and matrix factorization stability.',
    introducedIn: 'Sem III · Numerical Methods (MCDC0203)',
    developedIn: 'Sem IV · Control breakaway/characteristic solving -> Sem V · Modern Control matrix Riccati & RK4 plant simulation',
    industrialApplication: 'Embedded real-time nonlinear plant simulators, Kalman filter covariance propagation (RK4 + matrix inversion), and automated sensor cubic-spline linearization inside PLC firmware.',
    interviewQuestion: 'Why does microcontroller firmware prefer 4th-Order Runge-Kutta (RK4) or trapezoidal integration over Forward Euler when simulating stiff/underdamped control loops?',
    interviewAnswer: 'Forward Euler has O(h) global error and easily turns numerically unstable (false oscillation blowup) unless tiny step sizes are used; RK4 achieves O(h⁴) accuracy with generous stability margin without needing symbolic higher derivatives.',
  },
];

