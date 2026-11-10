import type { CurriculumSubjectDetail } from '@/types/curriculum';

export const SEM5_SUBJECTS: CurriculumSubjectDetail[] = [
  // =========================================================================
  // 1. MODERN CONTROL SYSTEM (ICDC0303)
  // =========================================================================
  {
    id: 'nitj-sem5-mcs',
    semester: 5,
    displaySemesterLabel: 'Semester V',
    code: 'ICDC0303',
    name: 'Modern Control System',
    shortName: 'Modern Control System',
    credits: 4,
    category: 'Control & Automation',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Time-domain MIMO state-space control: state transition matrices, Kalman/Gilbert/PBH controllability & observability, pole placement & Luenberger observers, nonlinear phase-plane & describing functions, Lyapunov/Popov stability, and optimal LQR / Pontryagin / Riccati design.',
    units: [
      {
        unitNumber: 1,
        title: 'State-Space Representation & Solution of State Equations',
        hours: 8,
        summary: 'State vectors (A, B, C, D), controllable/observable/Jordan canonical realizations, G(s) ↔ SS conversion, STM Φ(t) = e^(At), and eigenvalues/eigenvectors.',
        topics: [
          {
            id: 'mcs-u1-statespace',
            title: 'State Models, Canonical Forms, Transfer Matrix & State Transition Matrix',
            summary: 'ẋ = Ax + Bu, y = Cx + Du; phase-variable/observable/modal realizations; STM properties & Cayley-Hamilton; forced response.',
            explanation:
              'Unlike classical transfer functions—which hide internal modes during pole-zero cancellation and assume zero initial conditions across SISO terminals—state-space models capture full internal system dynamics via n first-order ODEs: ẋ(t) = Ax(t) + Bu(t) and y(t) = Cx(t) + Du(t). Any proper SISO transfer function G(s) converts to Controllable Canonical (companion bottom row = −a_i), Observable Canonical, or Diagonal/Jordan modal form via partial fractions. Conversely, G(s) = C(sI − A)⁻¹B + D recovers external transfer dynamics. Solving homogeneous evolution x(t) = Φ(t)x(0) relies on the State Transition Matrix Φ(t) = e^(At) = L⁻¹{(sI − A)⁻¹}, computable via Laplace inverse, spectral modal decomposition, or finite Cayley-Hamilton polynomial reduction.',
            workingPrinciple:
              'The eigenvalues of A (roots of det(sI − A) = 0) are similarity-invariant and dictate internal natural modes e^(λ_i t), while Φ(t+τ) = Φ(t)Φ(τ) guarantees semigroup state propagation.',
            equations: [
              { label: 'Continuous State-Space & Transfer Matrix', latex: '\\dot{x} = Ax + Bu, \\quad y = Cx + Du \\implies G(s) = C(sI - A)^{-1}B + D' },
              { label: 'State Transition Matrix & Forced Solution', latex: '\\Phi(t) = e^{At} = \\mathcal{L}^{-1}\\{(sI-A)^{-1}\\}, \\qquad x(t) = \\Phi(t)x(0) + \\int_0^t \\Phi(t-\\tau)Bu(\\tau)\\,d\\tau' },
            ],
            numericals: [
              {
                title: 'Computing STM e^(At) via Laplace Resolvent',
                problem: 'Given A = [[0, 1], [−2, −3]], compute the State Transition Matrix Φ(t) = e^(At).',
                steps: [
                  'sI − A = [[s, −1], [2, s+3]]; det(sI − A) = s² + 3s + 2 = (s + 1)(s + 2).',
                  '(sI − A)⁻¹ = (1/((s+1)(s+2))) [[s+3, 1], [−2, s]].',
                  'Partial fractions: Φ₁₁(t) = 2e^(−t) − e^(−2t); Φ₁₂(t) = e^(−t) − e^(−2t); Φ₂₁(t) = −2e^(−t) + 2e^(−2t); Φ₂₂(t) = −e^(−t) + 2e^(−2t).',
                ],
                result: 'Φ(t) = [[2e^(−t)−e^(−2t), e^(−t)−e^(−2t)], [−2e^(−t)+2e^(−2t), −e^(−t)+2e^(−2t)]].',
              },
            ],
            realWorldApplications: {
              summary: 'Standard representation in multi-axis robotics, aerospace autopilots, Kalman state estimators, and Model Predictive Control (MPC).',
              industries: ['Aerospace', 'Robotics', 'EV Battery BMS', 'Advanced Process Control'],
              examples: ['6-DOF quadrotor flight dynamics state vector [x,y,z,φ,θ,ψ,rates]', 'MIMO distillation tray composition state model'],
            },
            crossLinks: [
              { label: 'Control System Engineering (Sem IV)', targetSubjectId: 'nitj-sem4-control', note: 'Classical ODEs and Transfer Functions map into canonical A, B, C, D matrices.' },
            ],
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Controllability, Observability, Pole Placement & Observers',
        hours: 8,
        summary: 'Kalman/Gilbert/PBH/pole-zero tests, Ackermann state-feedback pole placement, full/reduced-order Luenberger observers & Separation Principle.',
        topics: [
          {
            id: 'mcs-u2-ctrb-obsv',
            title: 'Controllability, Observability, Pole Placement & Luenberger Observers',
            summary: 'Kalman rank n, Gilbert diagonal row/column test, hidden pole-zero cancellation, u = −Kx Ackermann formula, and dual observer design.',
            explanation:
              'Complete state controllability (A, B) guarantees an unconstrained input u(t) can steer x(0) to any target state in finite time: checked by Kalman rank([B, AB, …, A^(n−1)B]) = n, Gilbert’s test (in distinct-eigenvalue diagonal form, no zero row in transformed B̂), or Popov-Belevitch-Hautus (PBH) rank([λI − A, B]) = n at every eigenvalue λ. Dually, complete observability (A, C) ensures x(0) is recoverable from y(t): rank([Cᵀ, AᵀCᵀ, …, (Aᵀ)^(n−1)Cᵀ]) = n. Crucially, pole-zero cancellation inside C(sI−A)⁻¹B reveals an uncontrollable or unobservable hidden mode! When controllable, state feedback u = −Kx places closed-loop eigenvalues of (A − BK) arbitrarily via Ackermann’s formula. When internal states aren’t measured directly, a full-order (or minimal reduced-order) Luenberger observer ẋ̂ = A x̂ + Bu + L(y − C x̂) estimates x̂ with error dynamics (A − LC); the Separation Principle proves controller poles and observer poles evolve independently!',
            workingPrinciple:
              'By duality, designing observer gain L for (Aᵀ, Cᵀ) uses the exact same pole-placement math as designing controller gain K for (A, B), placing observer poles 3–5× faster than closed-loop controller poles.',
            equations: [
              { label: 'Kalman Controllability & Observability Matrices', latex: 'Q_c = \\begin{bmatrix} B & AB & \\cdots & A^{n-1}B \\end{bmatrix}, \\qquad Q_o = \\begin{bmatrix} C \\\\ CA \\\\ \\vdots \\\\ CA^{n-1} \\end{bmatrix}' },
              { label: 'Ackermann State-Feedback Formula & Observer Error', latex: 'K = \\begin{bmatrix} 0 & \\cdots & 0 & 1 \\end{bmatrix} Q_c^{-1} \\alpha_d(A), \\qquad \\dot{e} = (A - LC)e' },
            ],
            realWorldApplications: {
              summary: 'Replaces unmeasurable rotor flux, reactor tray temperatures, or missile angle-of-attack with fast virtual observers in industrial drives.',
              industries: ['Sensorless Motor Drives', 'Autonomous Drones', 'Chemical Reactors'],
              examples: ['Luenberger observer estimating rotor speed in sensorless PMSM drives', 'Inverted pendulum pole placement'],
            },
            interviewItems: [
              {
                level: 'Advanced',
                question: 'If a system has a hidden unstable mode due to a RHP pole-zero cancellation, can state feedback stabilize it?',
                answer: 'Only if the RHP mode is controllable! If the cancellation came from uncontrollability of that RHP mode, NO input u = −Kx can shift that eigenvalue (though detectability/stabilizability suffices for uncontrollable stable modes). If the mode is merely unobservable, state feedback moves it cleanly—output feedback cannot see it.',
              },
            ],
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Nonlinear Control Systems: Phase Plane & Describing Functions',
        hours: 8,
        summary: 'Physical nonlinearities, Jacobian linearization, phase-plane isoclines & singular points, limit cycles, and Describing Function N(X) analysis.',
        topics: [
          {
            id: 'mcs-u3-nonlinear',
            title: 'Phase-Plane Analysis, Singular Points & Describing Functions',
            summary: 'Saturation/deadzone/backlash/relay, Taylor linearization, node/focus/saddle/center portraits, and −1/N(X) vs G(jω) limit-cycle stability.',
            explanation:
              'Real actuators always violate superposition: valve stiction/dead-zone, gear backlash, magnetic/amplifier saturation, and on-off relays with hysteresis. Small-signal perturbations linearize ẋ = f(x, u) via Jacobian matrices A = ∂f/∂x, B = ∂f/∂u around equilibrium (x₀, u₀). For 2nd-order nonlinear systems, the Phase Plane (x₂ = ẋ₁ vs x₁) plots global trajectories via isoclines (slopes dx₂/dx₁ = const) around equilibrium singular points: Nodes (real same-sign λ), Foci/Spirals (complex λ), Saddle points (opposite-sign real λ, always unstable), Centers (pure ±jω), and isolated closed Limit Cycles (sustained nonlinear oscillation, e.g., Van der Pol or thermostat hysteresis). For higher-order systems with one separable nonlinearity N preceding low-pass linear plant G(s), the Describing Function N(X) = (B₁ + jA₁)/X tracks fundamental harmonic gain vs input amplitude X: intersection of G(jω) and −1/N(X) predicts sustained limit cycles.',
            workingPrinciple:
              'A limit cycle predicted at G(jω₀) = −1/N(X₀) is stable if slight amplitude growth X > X₀ pushes −1/N(X) OUT of the G(jω) encirclement region (damping oscillation back to X₀).',
            equations: [
              { label: 'Equilibrium Jacobian & Harmonic Balance Equation', latex: 'A = \\left.\\frac{\\partial f}{\\partial x}\\right|_{(x_0, u_0)}, \\qquad G(j\\omega) = -\\frac{1}{N(X)}' },
              { label: 'Ideal Relay Describing Function', latex: 'N(X) = \\frac{4M}{\\pi X} \\quad (\\text{amplitude } M, \\text{ input } X\\sin\\omega t)' },
            ],
            mermaidDiagram: `flowchart LR
  IN["Zero Ref r=0"] --> SUM["(-) Sum"]
  SUM -->|"x = X sin wt"| NL["Nonlinearity N(X)"]
  NL -->|"N(X)·x fundamental"| LIN["Linear Plant G(s) (LPF)"]
  LIN -->|"y(t)"| SUM`,
            realWorldApplications: {
              summary: 'Explains sticky control-valve hunting in chemical plants, bang-bang satellite thruster limit cycles, and PWM saturation recovery.',
              industries: ['Process Valve Diagnostics', 'Spacecraft RCS', 'Hydraulic Servos'],
              examples: ['Diagnosing ±2% sticky valve oscillation limit cycle on phase portrait', 'Relay auto-tuner (Åström-Hägglund) deliberately exciting a limit cycle to extract K_u and P_u!'],
            },
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Lyapunov, Popov & Asymptotic Stability',
        hours: 7,
        summary: 'Lyapunov/asymptotic vs BIBO stability, quadratic forms V(x) = xᵀPx, Sylvester’s criterion, Lyapunov 1st & 2nd methods, and Popov circle criterion.',
        topics: [
          {
            id: 'mcs-u4-lyapunov',
            title: 'Lyapunov Direct/Indirect Methods, Sylvester Criterion & Popov Stability',
            summary: 'Energy-like positive definite V(x) > 0 with negative definite V̇(x) < 0, AᵀP + PA = −Q matrix solution, and nonlinear sector bounds.',
            explanation:
              'BIBO stability applies strictly to external zero-initial-state input-output mappings and can miss internal unstable unobservable modes. Lyapunov stability evaluates internal equilibrium trajectories: equilibrium x_e is asymptotically stable if trajectories starting inside δ reach x_e as t → ∞. Lyapunov’s First (Indirect) Method examines linearized Jacobian eigenvalues (all Re(λ_i) < 0 proves local asymptotic stability; fails if any Re(λ_i) = 0). Lyapunov’s Second (Direct) Method generalizes total stored energy without solving ODEs: find a continuously differentiable Positive Definite function V(x) = xᵀPx (verified positive definite via Sylvester’s Criterion: all leading principal minors Δ_k > 0) whose trajectory derivative V̇(x) is Negative Definite (or Negative Semidefinite via LaSalle invariance). For LTI systems, choosing Q > 0 and solving AᵀP + PA = −Q proves global asymptotic stability iff P > 0. Popov’s frequency-domain criterion bounds sector-nonlinearities [0, k] using modified locus Re G(jω) + jω·Im G(jω).',
            workingPrinciple:
              'If stored generalized energy V(x) is strictly positive away from equilibrium and monotonically decays V̇(x) < 0 along every system trajectory, the state must collapse to equilibrium x = 0.',
            equations: [
              { label: 'Quadratic Lyapunov Function & Matrix Equation', latex: 'V(x) = x^T P x > 0, \\quad \\dot{V}(x) = x^T (A^T P + PA) x = -x^T Q x < 0' },
              { label: 'Popov Sector Condition (q ≥ 0)', latex: '\\text{Re}\\left[(1 + j\\omega q)\\,G(j\\omega)\\right] + \\frac{1}{k} > 0 \\quad \\forall\\, \\omega \\ge 0' },
            ],
            realWorldApplications: {
              summary: 'Certifies global stability of adaptive controllers, robotic computed-torque laws, and power-grid transient fault clearing.',
              industries: ['Industrial Robotics', 'Smart Grid Stability', 'Flight Control Laws'],
              examples: ['Proving MRAC adaptive gain convergence via V(e, θ̃)', 'Estimating Region of Attraction around faulted synchronous generator'],
            },
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Optimal Control: Pontryagin, LQR & Riccati Equations',
        hours: 7,
        summary: 'Quadratic cost indices, Pontryagin’s Minimum Principle, LQR state feedback, Hamilton-Jacobi-Bellman (HJB) equation, and Differential/Algebraic Riccati equations.',
        topics: [
          {
            id: 'mcs-u5-optimal-lqr',
            title: 'Pontryagin Minimum Principle, LQR & Algebraic Riccati Equation',
            summary: 'Minimizing J = ∫(xᵀQx + uᵀRu)dt trading regulation speed Q against actuator effort R; HJB optimality and ARE AᵀP + PA − PBR⁻¹BᵀP + Q = 0.',
            explanation:
              'Arbitrary pole placement specifies closed-loop eigenvalues without accounting for actuator saturation limits. Optimal Control minimizes a scalar performance functional J = ½ xᵀ(t_f)Sx(t_f) + ½ ∫(xᵀQx + uᵀRu)dt over admissible controls. Pontryagin’s Minimum Principle introduces co-state vector λ(t) and Hamiltonian H(x, u, λ) = L(x,u) + λᵀ(Ax+Bu), demanding ∂H/∂u = 0 along optimal trajectories (producing Bang-Bang minimum-time control for fuel/thrust saturation!). For linear plants and quadratic costs (LQR), both Pontryagin and Dynamic Programming’s Hamilton-Jacobi-Bellman (HJB) PDE collapse cleanly into the Matrix Riccati Differential Equation; for infinite-horizon regulation (t_f → ∞), P becomes constant satisfying the Algebraic Riccati Equation (ARE). Optimal full-state feedback u*(t) = −K x(t) = −R⁻¹Bᵀ P x(t) astonishingly guarantees ≥ 60° Phase Margin and (−6 dB, ∞) Gain Margin in every SISO/MIMO loop!',
            workingPrinciple:
              'Increasing state penalty Q drives faster transient decay at higher actuator energy; increasing control penalty R keeps actuator commands smooth and fuel-efficient.',
            equations: [
              { label: 'LQR Cost Functional & Optimal Gain', latex: 'J = \\frac{1}{2}\\int_0^\\infty \\left(x^T Q x + u^T R u\\right) dt, \\qquad u^*(t) = -R^{-1}B^T P\\,x(t)' },
              { label: 'Continuous Algebraic Riccati Equation (ARE)', latex: 'A^T P + PA - PBR^{-1}B^T P + Q = 0 \\quad (Q \\ge 0,\\; R > 0)' },
            ],
            numericals: [
              {
                title: 'Scalar Integrator Plant LQR Design',
                problem: 'Find the optimal infinite-horizon LQR gain K for scalar plant ẋ = u with Q = 4 and R = 1.',
                steps: [
                  'Here A = 0, B = 1, Q = 4, R = 1.',
                  'Scalar ARE: 0·p + p·0 − p·1·1⁻¹·1·p + 4 = 0 ⇒ p² = 4 ⇒ p = +2 (must be P > 0).',
                  'Optimal gain K = R⁻¹ Bᵀ P = 1 × 1 × 2 = 2 ⇒ u* = −2x, closed-loop pole λ = −2.',
                ],
                result: 'Optimal gain K = 2; closed-loop dynamics ẋ = −2x.',
              },
            ],
            realWorldApplications: {
              summary: 'Drives Falcon-9 rocket landing thrusters, quadrotor hover/trajectory tracking, active vehicle suspension, and MPC quadratic solvers.',
              industries: ['Space & Defense', 'Autonomous Vehicles', 'Precision Manufacturing'],
              examples: ['Balancing state deviation vs thruster propellant consumption via Q/R tuning', 'Combined LQR + Kalman Filter forming LQG autopilot'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Classical SISO vs Modern State-Space Control',
        leftName: 'Classical (Bode / Root Locus)',
        rightName: 'Modern State-Space / LQR',
        rows: [
          { criterion: 'System Structure', leftValue: 'SISO LTI transfer functions G(s)', rightValue: 'MIMO coupled systems (nonlinear/time-varying capable)' },
          { criterion: 'Internal Modes', leftValue: 'Hidden during pole-zero cancellation', rightValue: 'Explicitly tested via Controllability & Observability' },
          { criterion: 'Performance Metric', leftValue: '%Mp, t_s, GM/PM Margins', rightValue: 'Optimal cost J = ∫(xᵀQx + uᵀRu)dt via Riccati ARE' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-mcs-1',
        level: 'Intermediate',
        topic: 'Controllability & Hidden Modes',
        question: 'A 2nd-order state model produces transfer function G(s) = 1 / (s + 3) after cancelling an (s − 1) factor between numerator and denominator. Is the system internally BIBO & asymptotically stable?',
        options: [
          'No! The cancelled (s − 1) factor corresponds to an unstable eigenvalue λ = +1 hidden from input-output transfer G(s).',
          'Yes — G(s) has its pole at s = −3 inside the LHP.',
          'Yes, provided zero initial state and bounded noise.',
        ],
        correctIndex: 0,
        answer: 'No — the cancelled (s − 1) is an uncontrollable or unobservable RHP mode at λ = +1; initial state perturbation or noise blows up exponentially!',
        principle: 'Cancellation of (s − λ) between B(sI−A)⁻¹ and C implies λ is uncontrollable and/or unobservable; internal stability requires ALL eigenvalues of A in open LHP.',
        followUpIfCorrect: 'How does the Kalman Controllability matrix rank behave in this case?',
        followUpIfReview: 'Remember BIBO transfer function G(s) only describes zero-state zero-noise I/O behavior—always check eig(A)!',
        followUpAnswer: 'Either rank(Q_c) < 2 (mode λ=+1 uncontrollable) or rank(Q_o) < 2 (mode λ=+1 unobservable)—or both!',
      },
      {
        id: 'sim-mcs-2',
        level: 'Advanced',
        topic: 'LQR Weight Tuning',
        question: 'During flight test of an LQR drone controller, the motors saturate heavily when correcting small wind gusts. How should you retune Q and R?',
        options: [
          'Increase R (control penalty) relative to Q (state penalty)',
          'Decrease R toward zero while increasing Q',
          'Double both Q and R identically (2Q, 2R)',
        ],
        correctIndex: 0,
        answer: 'Increase R relative to Q so optimal feedback u* = −Kx uses gentler motor commands (note doubling both Q and R leaves gain K completely unchanged!).',
        principle: 'Only the relative ratio Q : R determines optimal Riccati gain K = R⁻¹BᵀP.',
        followUpIfCorrect: 'What guaranteed classical Phase Margin does a properly formulated SISO/MIMO LQR loop possess regardless of Q and R?',
        followUpIfReview: 'Scale factor: multiplying J by constant c > 0 multiplies P by c, so R⁻¹ cancels c out in K = (cR)⁻¹ Bᵀ (cP)!',
        followUpAnswer: 'By Kalman’s inequality |1 + K(jωI − A)⁻¹B| ≥ 1 on every Nyquist plot, continuous infinite-horizon LQR guarantees ≥ 60° Phase Margin and (−6 dB, +∞) Gain Margin!',
      },
    ],
  },

  // =========================================================================
  // 2. ANALYTICAL AND OPTICAL INSTRUMENTATION (ICDC0305)
  // =========================================================================
  {
    id: 'nitj-sem5-aoi',
    semester: 5,
    displaySemesterLabel: 'Semester V',
    code: 'ICDC0305',
    name: 'Analytical and Optical Instrumentation',
    shortName: 'Analytical & Optical Inst.',
    credits: 4,
    category: 'Core ICE',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Chemical composition, photonic, and spectroscopic measurement instrumentation: SNR/LOD/MEMS/microfluidics, GC/LC/HPLC/IC/MS chromatography, industrial TCD/paramagnetic/zirconia/NDIR gas analyzers, pH/ORP/conductivity/density, geometrical & fiber optics/LASERs, and UV-Vis/IR/NMR/AAS spectrophotometers.',
    units: [
      {
        unitNumber: 1,
        title: 'Analytical Principles, Error/SNR & Micro-Analytical Systems',
        hours: 6,
        summary: 'Instrumental vs classical analysis, systematic/random error, SNR & LOD, PC chemometrics, MEMS chemical sensors, and lab-on-a-chip microfluidics.',
        topics: [
          {
            id: 'aoi-u1-metrics',
            title: 'Instrumental Metrics (SNR, LOD) & MEMS / Microfluidic Analyzers',
            summary: 'Signal-to-noise ratio enhancement (lock-in/boxcar averaging), sensitivity & detection limit, PC DAQ, silicon MEMS MOx gas/cantilever sensors, lab-on-a-chip.',
            explanation:
              'Modern instrumental analyzers measure trace ppm/ppb species continuously online via physical/optical/electrochemical transduction, overcoming slow offline wet-chemistry titrations. Quantitative reliability hinges on Signal-to-Noise Ratio (SNR) improved by ensemble averaging (SNR grows as √N scans) or optical lock-in modulation; Limit of Detection (LOD = 3σ_blank / sensitivity m) defines the smallest distinguishable analyte peak. Today’s analyzers integrate PC chemometric deconvolution alongside wafer-scale MEMS micro-hotplate catalytic/MOx gas arrays and Microfluidic Lab-on-a-Chip capillary channels consuming nanoliter reagents.',
            workingPrinciple:
              'Periodic optical chopping shifts faint DC photocurrents up into a narrow AC lock-in frequency band away from 1/f drift and ambient light interference.',
            equations: [
              { label: 'Detection Limit & Scan Averaging Gain', latex: '\\text{LOD} = \\frac{3\\sigma_{\\text{blank}}}{S}, \\qquad \\text{SNR}_N = \\sqrt{N}\\cdot \\text{SNR}_1' },
            ],
            realWorldApplications: {
              summary: 'Enables portable trace gas detectors, point-of-care microfluidic diagnostics, and automated refinery online analyzer shelters.',
              industries: ['Biomedical Point-of-Care', 'Environmental CEMS', 'Pharmaceutical QC'],
              examples: ['Point-of-care microfluidic blood electrolyte cartridge', 'MEMS Pellistor combustible-gas transmitter'],
            },
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Chromatography & Hyphenated Mass Separation (GC, HPLC, IC)',
        hours: 8,
        summary: 'Retention partitioning, resolution, Gas Chromatography (GC & GC-MS), Liquid Chromatography (LC, HPLC & LC-MS), and Ion Chromatography (IC).',
        topics: [
          {
            id: 'aoi-u2-chrom',
            title: 'GC, GC-MS, HPLC, LC-MS & Ion Chromatography Architecture',
            summary: 'Mobile/stationary phase partitioning, Van Deemter plate height, GC TCD/FID/ECD, HPLC C18 + UV/DAD, ESI/EI MS interfaces, and IC conductivity suppression.',
            explanation:
              'Chromatography physically separates multi-component mixtures prior to detection based on differential distribution coefficient K = C_stationary / C_mobile between a moving fluid phase and column stationary bed, separating peaks at characteristic retention times t_R with resolution R_s. Gas Chromatography (GC) vaporizes volatile thermally stable samples (< 400 °C) in He/H₂/N₂ carrier gas through capillary columns into TCD (universal), FID (sensitive C-H ions), ECD (halogenated trace), or quadrupole Mass Spectrometer (GC-MS using 70 eV Electron Ionization). High-Performance Liquid Chromatography (HPLC) pumps liquid solvent at 100–400 bar through microparticle C18 columns for non-volatile biomolecules/pharmaceuticals into UV-Vis/DAD or Soft Electrospray LC-MS. Ion Chromatography (IC) separates inorganic anions/cations via ion-exchange resins followed by an eluent suppressor stripping background conductance before conductivity detection.',
            workingPrinciple:
              'Stronger analyte affinity for the stationary column retards elution speed, resolving co-existing hydrocarbons or ions into distinct time-separated Gaussian peaks whose area quantifies concentration.',
            equations: [
              { label: 'Chromatographic Resolution & Retention Factor', latex: 'k\' = \\frac{t_R - t_0}{t_0}, \\qquad R_s = \\frac{2(t_{R2} - t_{R1})}{W_1 + W_2}' },
            ],
            realWorldApplications: {
              summary: 'Measures natural gas calorific BTU content (process GC), pharma API purity (HPLC), trace boiler feedwater chloride/sodium (IC), and forensics (GC-MS).',
              industries: ['Refining & Petrochemicals', 'Pharma Quality Control', 'Power Boiler Chemistry'],
              examples: ['Online Process GC measuring C1–C6+ hydrocarbons on ethylene cracker overhead', 'IC monitoring ppb sulfate/chloride in supercritical turbine steam'],
            },
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Industrial Gas Analyzers & Gas Density',
        hours: 7,
        summary: 'TCD thermal conductivity, heat-of-reaction/catalytic, O₂/H₂/CH₄/CO₂/CO, paramagnetic O₂, electrochemical, polarography, and binary/complex gas mixtures.',
        topics: [
          {
            id: 'aoi-u3-gas',
            title: 'TCD, Catalytic, Paramagnetic O₂, NDIR & Electrochemical Analyzers',
            summary: 'TCD Wheatstone k-contrast (H₂/CO₂), catalytic LEL bead, Pauling paramagnetic O₂ susceptibility, Clark polarographic O₂, NDIR CO/CO₂/CH₄.',
            explanation:
              'Continuous stack and safety gas analyzers exploit molecule-specific physics: (1) Thermal Conductivity Detector (TCD) passes sample vs reference gas over heated Pt filaments in a Wheatstone bridge—high-k gases like H₂ (k ≈ 0.18 W/m·K vs N₂ 0.026) cool filaments and shift resistance sharply (ideal for binary H₂-in-N₂ or CO₂ flue mixtures; complex mixtures need carrier correction or GC pre-separation); (2) Heat-of-Reaction / Catalytic Pellistor oxidizes flammable CH₄/H₂ at 500 °C on Pt-alumina beads (%LEL detection); (3) Paramagnetic O₂ analyzers exploit oxygen’s unique two unpaired electrons giving high magnetic susceptibility +1.9×10⁻⁶, swinging a nitrogen-filled glass dumbbell inside a strong non-uniform magnet; (4) Electrochemical toxic cells & Clark Polarographic O₂ sensors reduce gas across a PTFE membrane onto bias-polarized gold/AgCl electrodes generating Faraday diffusion current I_d ∝ pO₂; (5) Vibrating-cylinder density transducers measure gas density via resonant frequency shift.',
            workingPrinciple:
              'Unlike almost all diamagnetic flue gases (N₂, CO₂, CH₄), molecular O₂ is strongly paramagnetic—experiencing magnetic body force toward higher field gradient.',
            realWorldApplications: {
              summary: 'Optimizes boiler excess-air combustion O₂/CO trim, ammonia synthesis H₂/N₂ ratio, and confined-space LEL/H₂S safety monitoring.',
              industries: ['Power Boilers', 'Fertilizers', 'Steel Furnaces', 'Oil Platforms'],
              examples: ['Paramagnetic O₂ + NDIR CO₂/CO CEMS rack on thermal power plant stack', '4–20 mA catalytic %LEL & electrochemical H₂S gas detectors on compressor skids'],
            },
            linkedPlatformRoute: '/instrumentation/analytical/oxygen-analyzers',
            linkedPlatformLabel: 'Open Oxygen Analyzer Guide',
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Chemical Electrochemical & Liquid/Solid/Gas Density',
        hours: 6,
        summary: 'pH glass electrode & ATC, Redox/ORP potential, 2/4-electrode & toroidal conductivity, and industrial density measurement of solids, liquids, and gases.',
        topics: [
          {
            id: 'aoi-u4-chem',
            title: 'pH, ORP, Conductivity & Multi-Phase Density Measurement',
            summary: 'Nernst glass electrode 59.16 mV/pH (at 25 °C), high-Z (~100 MΩ) preamplifier & ATC, toroidal inductive conductivity, oscillating U-tube density.',
            explanation:
              'Liquid-phase quality relies on ionic activity and bulk density: (1) pH measures −log₁₀[H⁺] across an ultrathin hydrated lithium-silicate glass bulb vs an Ag/AgCl double-junction reference electrode per the Nernst equation (−59.16 mV/pH at 298.15 K, shifting proportionally with T_K so Pt100/Pt1000 Automatic Temperature Compensation is mandatory!). Because glass bulb impedance reaches 10–1000 MΩ, transmitters require JFET/MOSFET electrometer buffers (>10¹² Ω) right inside the sensor head; (2) ORP (Redox) substitutes an inert Pt band to track oxidizing/reducing strength (Cr⁶⁺ reduction, Cl₂ dosing); (3) Conductivity measures G = (1/ρ)(A/l) using AC excitation (eliminating polarization) in 2-electrode clean ultrapure water (< 0.055 μS/cm), 4-electrode fouling resistance, or electrodeless toroidal transformers in scaling brines; (4) Density spans Anton-Paarr vibrating U-tubes (f ∝ 1/√ρ for liquids), Coriolis density, hydrostatic differential head, and non-contact Cs-137 gamma densitometers for mining slurries.',
            workingPrinciple:
              'Hydrated gel layers on outer vs inner glass bulb surfaces exchange H⁺ ions, generating a Nernstian membrane boundary potential read strictly under zero-current electrometer isolation.',
            equations: [
              { label: 'Nernst Equation for pH Glass Electrode', latex: 'E_{\\text{cell}} = E_0 - \\frac{2.3026\\,R\\,T_K}{F}\\,(\\text{pH} - 7), \\qquad \\text{Slope}(25^\\circ\\text{C}) = 59.16\\ \\text{mV/pH}' },
              { label: 'Electrolytic Conductivity & Cell Constant', latex: '\\kappa = G \\cdot K_{\\text{cell}}, \\qquad K_{\\text{cell}} = \\frac{L}{A}\\ (\\text{cm}^{-1})' },
            ],
            realWorldApplications: {
              summary: 'Controls boiler feedwater demineralizer regeneration, effluent neutralization basins, beverage Brix sugar density, and cyanide/chromate detox.',
              industries: ['Water Treatment', 'Biotech/Fermentation', 'Food/Beverage', 'Mining'],
              examples: ['Toroidal inductive conductivity probe on caustic CIP cleaning return', 'Split-range acid/caustic pH titration skid'],
            },
            linkedPlatformRoute: '/instrumentation/analytical/ph',
            linkedPlatformLabel: 'Inspect 3D Glass pH Sensor Assembly',
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Optical Elements, Photodetectors, LASERS & Fiber Optics',
        hours: 7,
        summary: 'Refraction/reflection/scattering, lenses/mirrors/gratings/filters/monochromators, PMT/photodiode/IR detectors, optical alignment, LED/LASER, and fiber optics.',
        topics: [
          {
            id: 'aoi-u5-optics',
            title: 'Dispersive Optics, Photodetectors, LASERS & Fiber-Optic Sensing',
            summary: 'Diffraction grating resolution, Czerny-Turner monochromator, PMT vs Si photodiode vs pyroelectric IR, optical rail alignment, stimulated emission, NA = √(n₁²−n₂²).',
            explanation:
              'Spectroscopic accuracy starts with photon steering and conversion: Lenses refract (Snell’s law) while front-surface aluminum/gold Mirrors avoid UV/IR glass absorption and chromatic aberration. Wavelength selection relies on dielectric interference bandpass filters or ruled/holographic Diffraction Gratings following d(sin α + sin β) = mλ inside Czerny-Turner monochromators (curved collimator → grating → focusing mirror → exit slit). Photodetectors cover broad energy bands: Photomultiplier Tubes (PMTs, vacuum dynode cascade giving 10⁶ gain for trace UV/Vis luminescence), Silicon/InGaAs photodiodes (fast solid-state response), and thermal Pyroelectric/Thermopile sensors (room-temperature broadband MIR). Coherent LASER sources (stimulated emission inside optical resonant cavity) power TDLAS stack gas tuners and interferometers, while Fiber Optics guide light via Total Internal Reflection (NA = sin θ_max = √(n₁² − n₂²)) enabling explosion-proof intrinsic optical temperature/strain (FBG) and remote spectrometer probes.',
            workingPrinciple:
              'A blazed diffraction grating concentrates optical energy into a specific first-order reflection angle, yielding linear wavelength dispersion across slit bandwidths without UV prism absorption.',
            equations: [
              { label: 'Grating Equation & Fiber Numerical Aperture', latex: 'd(\\sin\\alpha + \\sin\\beta) = m\\lambda, \\qquad \\text{NA} = \\sin\\theta_{\\max} = \\sqrt{n_1^2 - n_2^2}' },
            ],
            realWorldApplications: {
              summary: 'Enables remote flare-stack FTIR/TDLAS monitoring, explosion-proof transformer hot-spot fiber sensors, and optical encoder readheads.',
              industries: ['Petrochemical Fenceline', 'Power Transformers', 'Semiconductors', 'Telecom/Biomedical'],
              examples: ['Tunable Diode Laser (TDLAS) cross-duct NH₃ slip analyzer', 'Fiber Bragg Grating (FBG) strain monitoring inside composite wind blades'],
            },
          },
        ],
      },
      {
        unitNumber: 6,
        title: 'Colorimeters & Spectrophotometers (UV-Vis, FTIR, NMR, MS, AAS)',
        hours: 8,
        summary: 'EM spectrum, Beer-Lambert law, Colorimeters, single/double-beam UV-Vis, IR/FTIR, photoacoustic, NMR, MS, Flame Photometry & AAS.',
        topics: [
          {
            id: 'aoi-u6-spectro',
            title: 'Beer-Lambert Spectroscopy: UV-Vis, FTIR, AAS, Flame, NMR & MS',
            summary: 'A = εbc, single-beam vs double-beam chopping architecture, Michelson FTIR Fellgett advantage, photoacoustic PAS, Larmor NMR, m/z MS & AAS lamps.',
            explanation:
              'Across the electromagnetic spectrum, different transitions probe unique structure: rotational/vibrational modes absorb Infrared (2.5–25 μm), outer valence electrons absorb UV-Vis (190–750 nm), inner/ground atoms absorb narrow resonant lines in AAS/Flame Photometry, and nuclear spins resonate at RF frequencies inside multi-Tesla magnets (NMR: ω₀ = γB₀). Quantitative liquid/gas optics obey the Beer-Lambert Law: Absorbance A = log₁₀(I₀/I) = ε·b·c (linear with molar absorptivity ε, path length b, concentration c—strictly using monochromatic light and dilute non-associating species!). Double-beam spectrophotometers spin a rotating sector mirror to alternate source beam dynamically between Sample cuvette and Reference blank on ONE detector, canceling source lamp drift and solvent background simultaneously! FTIR swaps slow mechanical slits for a scanning Michelson Interferometer + FFT, measuring all IR wavelengths at once (Fellgett multiplex + Jacquinot throughput gains). AAS nebulizes liquid into an acetylene flame or graphite furnace through a element-specific Hollow Cathode Lamp.',
            workingPrinciple:
              'In a double-beam spectrophotometer, chopping between sample and reference paths at 30–60 Hz lets one photomultiplier compute ratio I_sample / I_ref electronically, cancelling lamp intensity drift.',
            equations: [
              { label: 'Beer-Lambert Law & NMR Larmor Frequency', latex: 'A = \\log_{10}\\!\\left(\\frac{I_0}{I}\\right) = \\varepsilon\\,b\\,c, \\qquad \\nu_0 = \\frac{\\gamma B_0}{2\\pi}' },
            ],
            mermaidDiagram: `flowchart LR
  SRC["D2 / Tungsten Lamp"] --> MONO["Monochromator Grating"]
  MONO --> CHOP["Rotating Sector Chopper"]
  CHOP -->|"Sample Path"| SAMP["Sample Cell (I)"]
  CHOP -->|"Reference Path"| REF["Blank Reference (I0)"]
  SAMP --> DET["PMT / Photodiode"]
  REF --> DET
  DET -->|"A = log10(I0/I)"| READ["Absorbance Output"]`,
            numericals: [
              {
                title: 'Beer-Lambert Concentration from % Transmittance',
                problem: 'A dyed sample in a b = 1.0 cm cuvette transmits 25.0% light (%T = 25%) at 520 nm where molar absorptivity ε = 6020 L/(mol·cm). Find concentration c.',
                steps: [
                  'Transmittance T = 0.250 ⇒ Absorbance A = −log₁₀(0.250) = +0.6021.',
                  'c = A / (ε · b) = 0.6021 / (6020 × 1.0) = 1.00 × 10⁻⁴ mol/L = 0.10 mM.',
                ],
                result: 'A = 0.602, Concentration c = 1.0 × 10⁻⁴ M (0.10 mM).',
              },
            ],
            realWorldApplications: {
              summary: 'Quantifies trace heavy metals (Pb, Hg via AAS), water nitrate/COD (UV-Vis), polymer functional groups (FTIR), and clinical metabolic profiling (NMR/MS).',
              industries: ['Pharma R&D', 'Metallurgy/Mining', 'Environmental Labs', 'Petrochemicals'],
              examples: ['Online UV-Vis silica analyzer in power plant condensate', 'Double-beam UV-Vis assaying paracetamol tablet dissolution'],
            },
            crossLinks: [
              { label: 'Testing & Calibration (Supplementary)', targetSubjectId: 'nitj-supp-cal', note: 'Holmium-oxide wavelength standards & potassium dichromate absorbance filters verify spectrophotometer accuracy.' },
            ],
            linkedPlatformRoute: '/instrumentation/analytical',
            linkedPlatformLabel: 'Inspect UV-Vis Spectrophotometer Hub',
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Single-Beam vs Double-Beam Spectrophotometer',
        leftName: 'Single-Beam Spectrophotometer',
        rightName: 'Double-Beam Spectrophotometer',
        rows: [
          { criterion: 'Blank Subtraction', leftValue: 'Sequential manual re-zero with blank cuvette before sample', rightValue: 'Simultaneous chopper alternation cancels source & solvent drift continuously' },
          { criterion: 'Optical Throughput', leftValue: 'Higher photons reaching detector (fewer mirrors)', rightValue: 'Half-duty split beam; excellent long-term stability & automated scanning' },
        ],
      },
      {
        title: 'Gas Chromatography (GC) vs HPLC',
        leftName: 'Gas Chromatography (GC)',
        rightName: 'High-Performance LC (HPLC)',
        rows: [
          { criterion: 'Mobile Phase & Analytes', leftValue: 'Inert gas (He/N₂); volatile thermally stable organics (<400 °C)', rightValue: 'Pressurized liquid solvents; thermally labile proteins, APIs, polymers' },
          { criterion: 'Common Detectors', leftValue: 'TCD, FID, ECD, EI-Quadrupole MS', rightValue: 'UV-Vis Photodiode Array (DAD), Refractive Index, ESI-MS' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-aoi-1',
        level: 'Beginner',
        topic: 'Beer-Lambert Linearity & Transmittance',
        question: 'If monochromatic absorbance A increases linearly from 1.0 to 2.0 when concentration doubles, what happens to percentage Transmittance (%T)?',
        options: [
          'Drops by 10× from 10% to 1%',
          'Halves from 50% to 25%',
          'Halves from 10% to 5%',
        ],
        correctIndex: 0,
        answer: 'Drops logarithmically by factor 10 from 10% T (A=1) to 1% T (A=2)!',
        principle: 'T = 10^(−A): A = 1 ⇒ T = 10%, A = 2 ⇒ T = 1%, explaining why Beer-Lambert precision degrades sharply at A > 2 due to stray light floor.',
        followUpIfCorrect: 'Why should chemical deviations or non-monochromatic lamp bandwidth break Beer-Lambert linearity at high absorbance?',
        followUpIfReview: 'Remember Absorbance A = −log₁₀(T), NOT a linear fraction of blocked light!',
        followUpAnswer: 'High concentration changes solute-solvent refractive index & self-association, while finite slit spectral width averages unequal ε(λ) wavelengths, curving calibration downward.',
      },
      {
        id: 'sim-aoi-2',
        level: 'Practical Scenario',
        topic: 'Gas & Electrochemical Analyzers',
        question: 'Why must a glass pH probe always be paired with a temperature sensor (ATC) and a >10¹² Ω FET input amplifier?',
        options: [
          'Nernst slope (2.303 RT/F) scales directly with absolute Kelvin temperature AND glass bulb resistance reaches 10–1000 MΩ.',
          'To heat the reference junction up to boiling point.',
          'Because glass bulbs act as variable capacitors that melt above 10 V.',
        ],
        correctIndex: 0,
        answer: 'Slope is 59.16 mV/pH strictly at 25 °C (0.1984·T_K mV/pH), and ordinary 10 MΩ multimeters would divide/destroy the high-impedance mV signal!',
        principle: 'High source resistance (100 MΩ) + temperature-proportional Nernst factor (RT/F) require local ultra-high-Z electrometer buffering plus Pt100/Pt1000 slope compensation.',
        followUpIfCorrect: 'What does standard buffer calibration (e.g., pH 7.00 then pH 4.01) adjust inside the transmitter?',
        followUpIfReview: 'Look carefully at the two constants in E = E₀ − Slope(T)·(pH − 7)!',
        followUpAnswer: 'pH 7.00 buffer corrects Zero Asymmetry potential (E₀), while the second pH 4.01 or 10.01 buffer calibrates Slope % efficiency!',
      },
    ],
  },

  // =========================================================================
  // 3. PROCESS DYNAMICS AND CONTROL (ICDC0307)
  // =========================================================================
  {
    id: 'nitj-sem5-pdc',
    semester: 5,
    displaySemesterLabel: 'Semester V',
    code: 'ICDC0307',
    name: 'Process Dynamics and Control',
    shortName: 'Process Dynamics & Control',
    credits: 3,
    category: 'Control & Automation',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Chemical and continuous plant dynamics: degrees of freedom, lumped vs distributed mass/energy balance models (reactors, heat exchangers, distillation, CSTR), step-test regression & Padé dead-time approximation, industrial PID/Ziegler-Nichols/Cohen-Coon tuning, valve sizing & actuators, plus APC and HAZID/HAZOP safety.',
    units: [
      {
        unitNumber: 1,
        title: 'Process Modelling: Conservation Laws, Tanks, Reactors & Linearization',
        hours: 8,
        summary: 'DOF analysis, lumped vs distributed PDE, 1st/2nd order tanks (interacting/non-interacting), blending/heating, Jacobian linearization, reactors, heat exchangers, distillation, manometer.',
        topics: [
          {
            id: 'pdc-u1-models',
            title: 'Lumped/Distributed Models, Interacting Tanks, CSTR & Linearization',
            summary: 'Mass/energy balances, Taylor Jacobian linearization around steady state, interacting vs non-interacting level tanks, CSTR exothermic stability & U-tube manometer.',
            explanation:
              'Before placing any PID loop, Process Degrees of Freedom (DOF = Variables − Equations) determines how many independent variables can and must be manipulated. Most equipment models come from unsteady conservation balances: Rate of Accumulation = In − Out + Generation. Lumped systems (well-mixed tank, CSTR, mercury thermometer) produce ODEs—non-interacting cascaded tanks factor cleanly as τ₁τ₂s² + (τ₁+τ₂)s + 1, whereas interacting tanks share head dependence creating cross-term (τ₁ + τ₂ + A₁R₂)s yielding overdamped sluggish response without oscillation (unlike underdamped 2nd-order U-tube manometers!). Distributed systems (plug-flow conduction bar, double-pipe heat exchanger, packed-bed catalytic reactor) vary spatially via PDEs. Nonlinear flow resistances (q = C_v √h) and Arrhenius kinetics (k₀ e^(−E/RT)) linearize into deviation variables around operating steady state (x̄, ū) via Taylor Jacobian expansion.',
            workingPrinciple:
              'Deviation variables x′(t) = x(t) − x_ss shift equilibrium cleanly to zero so linearized Laplace transfer functions directly predict small-signal plant disturbances.',
            equations: [
              { label: 'Non-Interacting vs Interacting 2-Tank Denominator', latex: 'D_{\\text{non}}(s) = (\\tau_1 s + 1)(\\tau_2 s + 1), \\qquad D_{\\text{int}}(s) = \\tau_1\\tau_2 s^2 + (\\tau_1 + \\tau_2 + A_1 R_2)s + 1' },
              { label: 'Deviation Linearization Around Steady State', latex: 'f(h) \\approx f(\\bar{h}) + \\left.\\frac{df}{dh}\\right|_{\\bar{h}}(h - \\bar{h}), \\qquad R_{\\text{lin}} = \\frac{1}{(df/dh)_{\\bar{h}}}' },
            ],
            realWorldApplications: {
              summary: 'Explains why heat exchangers and exothermic CSTR reactors require cascade temperature loops while series surge vessels never oscillate on their own.',
              industries: ['Petrochemical Refining', 'Polymer Reactors', 'Distillation', 'Power Boilers'],
              examples: ['Distillation tray holdup composition dynamics (heavy vs light key)', 'Exothermic CSTR cooling-jacket runaway prevention'],
            },
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Empirical Identification, Regression & Transportation Lag',
        hours: 6,
        summary: 'Linear/nonlinear regression, open-loop FOPDT step-test identification, pure transportation lag e^(−sθ), and Padé rational approximation.',
        topics: [
          {
            id: 'pdc-u2-id-deadtime',
            title: 'Step-Test FOPDT Identification & Padé Dead-Time Approximation',
            summary: 'Fitting K_p, τ, θ_d from Process Reaction Curve (28.3%/63.2% Smith method), e^(−sθ) phase erosion, and 1st/2nd-order Padé RHP zero.',
            explanation:
              'Analytical plant models for complex industrial towers are rarely exact; engineers run a 5–10% open-loop bump test (Process Reaction Curve) and fit First-Order-Plus-Dead-Time (FOPDT): G(s) = K_p e^(−sθ_d) / (τs + 1) using nonlinear regression or two-point t₂₈.₃% / t₆₃.₂% timestamps (which reject graphical tangent slope errors cleanly!). Pipe transport velocity creates pure Transportation Lag θ_d = L/v, delaying measurements by e^(−sθ_d) with unity magnitude |e^(−jωθ)| = 1 and linear phase lag −ωθ_d. Because e^(−sθ_d) is irrational for polynomial Routh/Root-Locus tools, the 1st-order Padé approximation (1 − sθ/2)/(1 + sθ/2) substitutes an equal-magnitude LHP pole and RHP non-minimum phase zero.',
            workingPrinciple:
              'Extracting τ = 1.5(t₆₃.₂% − t₂₈.₃%) and θ_d = t₆₃.₂% − τ avoids noisy inflection-tangent hand drawing while pinning FOPDT dynamics within ±3%.',
            equations: [
              { label: 'FOPDT Model & Smith Two-Point Identification', latex: 'G_p(s) = \\frac{K_p\\,e^{-\\theta_d s}}{\\tau s + 1}, \\qquad \\tau = 1.5(t_{63.2\\%} - t_{28.3\\%}), \\quad \\theta_d = t_{63.2\\%} - \\tau' },
              { label: '1st-Order Padé Approximation', latex: 'e^{-\\theta_d s} \\approx \\frac{1 - \\frac{\\theta_d}{2}s}{1 + \\frac{\\theta_d}{2}s}' },
            ],
            realWorldApplications: {
              summary: 'Routine field step-testing workflow for refinery distillation reboilers, paper-machine consistency headers, and kiln fuel trim.',
              industries: ['Pulp & Paper', 'Refineries', 'Food Processing'],
              examples: ['Pipeline blending mixer downstream analyzer transportation lag θ_d = 45 s'],
            },
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Industrial PID Topologies & Tuning Rules',
        hours: 7,
        summary: 'Ideal/series/parallel/digital PID, QADR performance, Ziegler-Nichols open/closed-loop tuning, and Cohen-Coon rules for high dead-time loops.',
        topics: [
          {
            id: 'pdc-u3-pid-tuning',
            title: 'Series/Parallel/Digital PID, Ziegler-Nichols & Cohen-Coon Tuning',
            summary: 'Interacting vs ideal ISA PID, anti-reset windup, QADR ¼-decay, ZN reaction curve & continuous cycling (Ku, Pu), Cohen-Coon for θ/τ > 0.3.',
            explanation:
              'Industrial DCS/PLC blocks implement PID in three common mathematical equations: Ideal (ISA) K_c(1 + 1/(τ_I s) + τ_D s), Parallel (independent k_p, k_i, k_d), or Series/Interacting K_c′(1 + 1/(τ_I′ s))(1 + τ_D′ s); digital controllers implement incremental Velocity PID (preventing integral windup automatically when valves saturate!) and apply Derivative strictly to Process Variable (−d(PV)/dt) to prevent "derivative kick" on step SP changes. Ziegler-Nichols (ZN) tunes toward a snappy Quarter-Amplitude Decay Ratio (QADR = 0.25) either open-loop (FOPDT tangent/S-curve) or closed-loop (raising pure P gain to ultimate K_u until sustained period P_u oscillation). When transportation lag grows large (θ_d/τ > 0.3), ZN gets sluggish or oscillatory—Cohen-Coon explicitly corrects tuning using controllability ratio R = θ_d/τ.',
            workingPrinciple:
              'In Velocity-form Digital PID Δu_k, only incremental changes are sent to the actuator; when the valve reaches 0% or 100%, Δu stops accumulating—inherently defeating integral windup.',
            equations: [
              { label: 'Ideal ISA PID vs Series Interacting Form', latex: 'U_{\\text{ISA}}(s) = K_c\\!\\left(1 + \\frac{1}{\\tau_I s} + \\frac{\\tau_D s}{1 + \\alpha\\tau_D s}\\right)E(s)' },
              { label: 'ZN Closed-Loop PID Rules (K_u, P_u)', latex: 'K_c = 0.6\\,K_u, \\qquad \\tau_I = 0.5\\,P_u, \\qquad \\tau_D = 0.125\\,P_u' },
            ],
            realWorldApplications: {
              summary: 'Tunes thousands of continuous Flow (fast PI, low K_c), Level (gentle P/averaging), Pressure (PI), and Reactor Temperature (full PID) DCS loops.',
              industries: ['All Continuous Process Industries'],
              examples: ['Setting gentle averaging PI on surge drum level so downstream feed pump stays smooth', 'ZN cycling on thermal oven to capture K_u and P_u'],
            },
            linkedPlatformRoute: '/toolbox/pid-tuning',
            linkedPlatformLabel: 'Experiment in Live PID Tuning Simulator',
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Final Control Elements, Valves, Actuators & Sizing',
        hours: 7,
        summary: 'Control valves (ATO/ATC fail-safe, Linear vs EQ% trim), pneumatic actuator TF, Cv sizing & flashing/cavitation, DP transducers, I/P & hydraulic/stepper actuators.',
        topics: [
          {
            id: 'pdc-u4-valves',
            title: 'Control Valve Trim, Fail-Safe ATO/ATC, Cv Sizing & I/P Actuators',
            summary: 'ISA S75 Cv equation, Quick-Opening/Linear/Equal-% inherent vs installed characteristics, ATO vs ATC safety selection, spool valves & solenoids.',
            explanation:
              'The Final Control Element translates low-power controller mA commands into high-energy pipeline throttling. Electric/PLC 4–20 mA signals convert inside an I/P transducer (flapper-nozzle feedback relay) to standard 3–15 psig (0.2–1.0 bar) air driving a spring-diaphragm actuator (modeled dynamically as first-order lag τ_v ≈ 0.5–3 s). Safety dictates spring fail-action: cooling water & reflux valves fail Open (ATC / FO) so overheating halts on instrument air loss, whereas fuel gas & steam feed valves fail Closed (ATO / FC)! Inherent trim geometry—Quick-Opening (on-off relief), Linear (Q ∝ lift at constant ΔP), and Equal-Percentage (each equal lift increment changes flow by equal %: ideal when long piping leaves low ΔP_valve/ΔP_total so Equal-% + pipe drop yields near-LINEAR installed response!). Valve flow coefficient C_v = Q_gpm √(SG/ΔP_psi) sizes orifice diameter cleanly without cavitation or choked sonic vapor flash.',
            workingPrinciple:
              'When line friction steals pressure drop at high flow, Equal-Percentage trim restores constant loop gain across 20–90% valve lift so PID tuning remains stable everywhere.',
            equations: [
              { label: 'ISA Liquid Control Valve Flow Coefficient C_v', latex: 'C_v = Q_{\\text{gpm}} \\sqrt{\\frac{\\text{SG}}{\\Delta P_{\\text{psi}}}}, \\qquad Q_{\\text{SI}} (\\text{m}^3/\\text{h}) = 0.865\\,C_v\\sqrt{\\frac{\\Delta P_{\\text{bar}}}{\\text{SG}}}' },
              { label: 'Equal-Percentage Inherent Flow Law', latex: '\\frac{Q}{Q_{\\max}} = R^{(l/L - 1)} \\quad (\\text{rangeability } R \\approx 30\\text{–}50)' },
            ],
            realWorldApplications: {
              summary: 'Prevents pump dead-heading, valve cavitation erosion, and non-linear limit cycles across every pipework rack.',
              industries: ['Refining', 'Power Steam Cycles', 'Chemical Plants', 'Water Networks'],
              examples: ['Specifying ATO/Fail-Close fuel-gas globe valve on fired heater', 'Checking vapor pressure P_v vs P_vc to prevent flashing erosion'],
            },
            linkedPlatformRoute: '/instrumentation/final-control/control-valves',
            linkedPlatformLabel: 'Open Control Valve Cv & Choke Calculator',
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Advanced Process Control (APC) & Industrial Safety Management',
        hours: 6,
        summary: 'Cascade, feedforward, ratio & Smith-predictor APC overview; HAZID, Risk Matrices, SMS, safety standards (IEC 61511), PSI, and chemical hazards.',
        topics: [
          {
            id: 'pdc-u5-apc-safety',
            title: 'Cascade / Feedforward / Smith Predictor APC & HAZID / SMS Safety',
            summary: 'Inner disturbance rejection via Cascade, proactive Feedforward, Smith dead-time predictor; plus HAZID, Risk Matrices, IEC 61511 SIS & PSI hazards.',
            explanation:
              'When single-loop PID struggles against multi-variable coupling or long dead times, Advanced Process Control (APC) elevates loop stability: Cascade pairs a fast inner slave loop (jacket temperature or fuel pressure, rejecting supply disturbances before they touch product!) inside a slower master quality controller; Feedforward cancels measured load upsets proactively before output error forms (strictly requiring accurate model + PID feedback trim); Ratio holds exact reactant stoichiometry; Smith Predictor wraps an internal FOPDT model minus dead time to control fast without delay instability. Alongside control performance, Process Safety (PSM / IEC 61511) puts an independent Safety Instrumented System (SIS) layer completely separate from BPCS/DCS: teams conduct HAZID & HAZOP studies using guidewords (NO, MORE, LESS, REVERSE), score Likelihood × Severity on Risk Matrices to set required Safety Integrity Level (SIL 1–4), maintain Process Safety Information (PSI), and manage Safety Management Systems (SMS) across toxic/flammable/runaway hazards.',
            workingPrinciple:
              'Separate Safety Instrumented Systems (SIS) use dedicated sensors, triple-modular-redundant logic solvers, and ESD valves—never sharing hardware with daily BPCS PID regulation.',
            mermaidDiagram: `flowchart LR
  BPCS["Layer 1: BPCS / DCS Regulation"] --> ALARM["Layer 2: Operator Alarms"]
  ALARM --> SIS["Layer 3: Independent SIS / ESD (IEC 61511 SIL)"]
  SIS --> RELIEF["Layer 4: Mechanical PSV / Rupture Disc"]`,
            realWorldApplications: {
              summary: 'Standard EPC engineering practice across all hydrocarbon refineries, pharma reactors, and offshore FPSOs.',
              industries: ['Oil & Gas', 'Chemicals', 'Specialty Pharma', 'Power'],
              examples: ['Cascade reactor core TC → jacket cooling TC loop', 'SIL-2 independent high-high pressure ESD trip shutting feed valve during SIS proof test'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Control Valve Trim Characteristics (Linear vs Equal-% vs Quick-Opening)',
        leftName: 'Linear vs Equal-Percentage',
        rightName: 'Application Fit',
        rows: [
          { criterion: 'Linear Trim', leftValue: 'Constant slope dQ/d(lift)', rightValue: 'Liquid level & constant-ΔP services (ΔP_valve/ΔP_total > 0.5)' },
          { criterion: 'Equal-Percentage Trim', leftValue: 'Q changes exponentially per lift increment', rightValue: 'Flow & pressure loops with high line-friction losses (most common!)' },
          { criterion: 'Quick-Opening', leftValue: 'Sharp surge at low lift', rightValue: 'On-off relief & interlock dump valves' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-pdc-1',
        level: 'Practical Scenario',
        topic: 'ATO vs ATC Safety Fail Position',
        question: 'On an exothermic batch reactor cooled by chilled brine jacket flow and heated with a live steam bypass valve, what Spring Fail Position should Instrument Engineers specify for the Cooling Valve and Steam Valve upon instrument air failure?',
        options: [
          'Cooling Valve = ATC (Fail-Open); Steam Valve = ATO (Fail-Closed)',
          'Cooling Valve = ATO (Fail-Closed); Steam Valve = ATC (Fail-Open)',
          'Both ATO (Fail-Closed) to save utilities',
        ],
        correctIndex: 0,
        answer: 'Cooling Valve = Air-to-Close (Fail-Open); Steam Valve = Air-to-Open (Fail-Closed).',
        principle: 'Loss of plant instrument air or 4–20 mA control signal must drive the exothermic reactor toward its safest state: maximum cooling ON, heat source OFF.',
        followUpIfCorrect: 'Would an Equal-Percentage or Linear plug fit best on the cooling water jacket valve if pumping header ΔP drops heavily at high flow?',
        followUpIfReview: 'Ask: "If power/air dies completely at 2 AM, does the valve spring push the reactor colder or hotter?"',
        followUpAnswer: 'Equal-Percentage trim! It compensates for cooling-pipe friction loss at high flows, keeping heat-transfer loop gain consistent across cooling loads.',
      },
    ],
  },
];
