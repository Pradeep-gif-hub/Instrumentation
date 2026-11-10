import type { CurriculumSubjectDetail } from '@/types/curriculum';

export const NITJ_MODERN_CONTROL: CurriculumSubjectDetail = {
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
    'Official Semester V core (ICDC0303 · CO1–CO5): Continuous state-space representations, G(s)↔(A,B,C,D) transformations & State Transition Matrix; similarity transformations, Gilbert/Kalman/factor-cancellation/PBH controllability & observability, pole placement & full/reduced-order observers; nonlinear phase-plane trajectories, singular points & describing functions; BIBO/asymptotic stability, Sylvester quadratic forms, Lyapunov 1st & 2nd methods, Popov criterion; calculus of variations, Pontryagin principle, Hamilton-Jacobi-Bellman & Riccati optimal control.',
  units: [
    // =========================================================================
    // SECTION 1 — State-Space Analysis of Continuous Systems
    // =========================================================================
    {
      unitNumber: 1,
      title: 'State-Space Analysis of Continuous Systems',
      hours: 8,
      summary:
        'State-variable modeling, SS↔Transfer-Function conversions, Controllable/Observable canonical realizations [Extension], State-Transition Matrix Φ(t)=e^(At), and homogeneous/forced state solutions.',
      topics: [
        {
          id: 'mcs-u1-statespace-models',
          title: 'State-Variable Models, G(s) Conversions & Canonical Realizations',
          summary:
            'ẋ = Ax + Bu, y = Cx + Du; State-Space → Transfer Function G(s) = C(sI−A)⁻¹B + D; Transfer Function → Controllable & Observable Canonical Forms [Enrichment].',
          explanation:
            'Classical SISO transfer functions G(s) assume zero initial state and conceal internal unstable modes whenever poles and zeros cancel. Modern state-space representation captures full internal plant dynamics of MIMO/time-varying plants using n minimum internal state variables x(t) ∈ ℝⁿ governed by State Equation ẋ(t) = Ax(t) + Bu(t) and Output Equation y(t) = Cx(t) + Du(t). From any (A,B,C,D) model, Laplace transform yields G(s) = C(sI − A)⁻¹B + D. Conversely, converting a rational G(s) into state matrices produces non-unique realizations—notably Phase-Variable / Controllable Canonical Form (where companion matrix A carries negated denominator coefficients along its bottom row and output C carries numerator coefficients) and Dual Observable Canonical Form (supporting enrichment for observer design)!',
          workingPrinciple:
            'State coordinates are non-unique (z = P⁻¹x transforms matrices safely while preserving eigenvalues of A), letting engineers pick convenient Controllable, Observable, or Diagonal modal coordinates.',
          equations: [
            { label: 'Continuous LTI State-Space & Transfer Matrix', latex: '\\dot{x} = Ax + Bu, \\qquad y = Cx + Du \\implies G(s) = C(sI - A)^{-1}B + D' },
          ],
          realWorldApplications: {
            summary: 'Baseline dynamic plant representation in MIMO distillation control, MPC quadratic programming, and robotic manipulator kinematics.',
            industries: ['Aerospace GNC', 'Industrial Robotics', 'Refinery MPC'],
            examples: ['State vector [θ, θ̇, x, ẋ]ᵀ capturing coupled inverted pendulum motion cleanly', 'MIMO blending header model with cross-coupled composition states'],
          },
          crossLinks: [
            { label: 'Control System Engineering (Sem IV)', targetSubjectId: 'nitj-sem4-control', note: 'Classical block diagrams and Laplace ODEs convert straight into A, B, C, D matrices.' },
          ],
        },
        {
          id: 'mcs-u1-stm-solution',
          title: 'State-Transition Matrix (STM) & Solution of State Equations',
          summary:
            'Homogeneous & forced time solution x(t) = Φ(t)x(0) + ∫Φ(t−τ)Bu(τ)dτ; computing Φ(t) = e^(At) via Laplace resolvent, Modal spectral expansion & Cayley-Hamilton.',
          explanation:
            'Solving the vector differential equation ẋ = Ax + Bu cleanly separates initial condition drift from forced actuator driving terms via the State Transition Matrix (STM) Φ(t) = e^(At) = I + At + (At)²/2! + …. Key STM identities include Φ(0) = I, Φ(t₁ + t₂) = Φ(t₁)Φ(t₂) (semigroup transition property), Φ⁻¹(t) = Φ(−t), and dΦ/dt = AΦ(t). Three systematic methods compute Φ(t) analytically: (1) Laplace Resolvent Φ(t) = L⁻¹{(sI − A)⁻¹}; (2) Modal similarity transform Pe^(Λt)P⁻¹ when A is diagonalizable; and (3) Cayley-Hamilton theorem reducing infinite power series e^(At) identically to an exact finite polynomial α₀(t)I + α₁(t)A + … + α_(n−1)(t)A^(n−1)!',
          workingPrinciple:
            'Multiplying x(t₀) by Φ(t − t₀) smoothly propagates autonomous internal states forward or backward in time along natural system trajectories.',
          equations: [
            { label: 'STM Resolvent & Total Forced Response', latex: '\\Phi(t) = e^{At} = \\mathcal{L}^{-1}\\{(sI-A)^{-1}\\}, \\qquad x(t) = \\Phi(t)x(0) + \\int_0^t \\Phi(t-\\tau)Bu(\\tau)\\,d\\tau' },
          ],
          numericals: [
            {
              title: 'Computing STM e^(At) via Laplace Resolvent',
              problem: 'Given A = [[0, 1], [−2, −3]], compute State Transition Matrix Φ(t) = e^(At).',
              steps: [
                'Form resolvent (sI − A) = [[s, −1], [2, s+3]]; det(sI − A) = s² + 3s + 2 = (s + 1)(s + 2).',
                'Invert: (sI − A)⁻¹ = (1/((s+1)(s+2))) [[s+3, 1], [−2, s]].',
                'Invert Laplace element-wise: Φ₁₁ = 2e^(−t) − e^(−2t); Φ₁₂ = e^(−t) − e^(−2t); Φ₂₁ = −2e^(−t) + 2e^(−2t); Φ₂₂ = −e^(−t) + 2e^(−2t).',
              ],
              result: 'Φ(t) = [[2e^(−t)−e^(−2t), e^(−t)−e^(−2t)], [−2e^(−t)+2e^(−2t), −e^(−t)+2e^(−2t)]] (verify Φ(0) = I!).',
            },
          ],
          realWorldApplications: {
            summary: 'Exact zero-order-hold (ZOH) discretization x[k+1] = Φ(T_s)x[k] + Γu[k] for every modern digital PLC/MCU controller.',
            industries: ['Digital Avionics', 'EV Motor Drives', 'Embedded MPC'],
            examples: ['Discretizing continuous DC-servo A,B via Φ(T_s) = e^(AT_s) inside MCU firmware'],
          },
        },
        {
          id: 'mcs-u1-canonical-ext',
          title: 'Controllable & Observable Canonical Forms [Enrichment]',
          summary:
            'Systematic conversion from strictly proper G(s) into Controllable Canonical (companion matrix) & Observable Canonical coordinates (isExtension: true supporting material).',
          isExtension: true,
          verificationFlag: 'Supporting realization enrichment alongside Section 1 official SS↔G(s) conversion.',
          explanation:
            'Starting directly from nth-order G(s) = (b₁s^(n−1) + … + b_n) / (s^n + a₁s^(n−1) + … + a_n), Controllable Canonical Form builds a shift-integrator chain with feedback weights (−a_n, …, −a₁) on the last state row and numerator tap gains on C. Taking the dual transpose (A_o = A_cᵀ, B_o = C_cᵀ, C_o = B_cᵀ) immediately delivers Observable Canonical Form where every pole-placement or observer Ackermann coefficient reads almost by inspection!',
          workingPrinciple:
            'Controllable Canonical companion coordinates always achieve rank(Q_c) = n by structure, making manual Ackermann pole-placement design direct.',
          equations: [
            { label: 'Duality Transformation Between Canonical Realizations', latex: 'A_o = A_c^T, \\qquad B_o = C_c^T, \\qquad C_o = B_c^T' },
          ],
          realWorldApplications: {
            summary: 'Standard canonical baseline used inside MATLAB ss()/tf() realizations and control-law hand derivation.',
            industries: ['Control Engineering Tools', 'Academic & R&D Labs'],
            examples: ['Direct phase-variable conversion of 3rd-order pitch-autopilot transfer function before computing Ackermann vector K'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — State Feedback Control and Observer Design
    // =========================================================================
    {
      unitNumber: 2,
      title: 'State Feedback Control and Observer Design',
      hours: 9,
      summary:
        'Similarity transformation, Controllability & Observability (Gilbert, Kalman, Factor Cancellation & PBH rank tests), Ackermann pole-placement u = −Kx, full-order & reduced-order Luenberger observers.',
      topics: [
        {
          id: 'mcs-u2-ctrb-obsv-tests',
          title: 'Similarity Transformation, Controllability & Observability (Kalman, Gilbert, Factor & PBH)',
          summary:
            'State coordinate invariance Ā = P⁻¹AP; complete state controllability & observability; Kalman rank matrices; Gilbert diagonal test; factor-cancellation; PBH rank test.',
          explanation:
            'A similarity transform x = Pz yields identical external transfer dynamics G(s) and eigenvalues with transformed matrices (P⁻¹AP, P⁻¹B, CP). Before designing controllers or estimators, engineers verify two fundamental structural properties: (1) Complete State Controllability—can control u(t) drive any x(0) to x(t_f) in finite time? (2) Complete Observability—can output y(t) uniquely reconstruct x(0)? Four classic algebraic tests diagnose both: (a) Kalman Test: rank(Q_c) = rank([B, AB, …, A^(n−1)B]) = n for controllability, dual rank(Q_o) = rank([Cᵀ, AᵀCᵀ, …, (Aᵀ)^(n−1)Cᵀ]) = n for observability; (b) Gilbert’s Test: diagonalize distinct eigenvalues via modal transformation z = P⁻¹x—controllable iff B̂ has zero zero-rows, observable iff Ĉ has zero zero-columns!; (c) Factor Cancellation Test: any cancelled (s − λ) between numerator & denominator in SISO G(s) reveals an uncontrollable or unobservable hidden eigenvalue!; (d) PBH Test: rank([λI − A, B]) = n (controllability) and rank([λI − A; C]) = n (observability) across EVERY eigenvalue λ of A.',
          workingPrinciple:
            'PBH and Gilbert tests expose WHICH individual eigenvalue/mode is uncontrollable or unobservable (needed to check stabilizability/detectability), unlike raw Kalman determinant = 0.',
          equations: [
            { label: 'Kalman Matrices & PBH Rank Criterion', latex: 'Q_c = [B\\;\\;AB\\;\\cdots\\;A^{n-1}B], \\quad \\text{rank}[\\lambda I - A\\;\\;B] = n \\;\\;\\forall \\lambda \\in \\text{eig}(A)' },
          ],
          realWorldApplications: {
            summary: 'Diagnoses missing sensor placement (e.g., placing single thermocouple too symmetrically blocks odd temperature modes from observability!).',
            industries: ['Thermal Furnaces', 'Satellite Attitude Control', 'Power Grids'],
            examples: ['Detecting symmetric bridge resistance failure causing unobservable common-mode state'],
          },
        },
        {
          id: 'mcs-u2-poleplace-observers',
          title: 'Pole Placement, State Feedback & Full/Reduced-Order Observers',
          summary:
            'Closed-loop u = −Kx via direct coefficient match & Ackermann’s formula; Full-Order & Reduced-Order (minimal) Luenberger observers; Separation Principle.',
          explanation:
            'When (A,B) is completely controllable, linear state feedback u = −Kx shifts all closed-loop poles eig(A − BK) arbitrarily anywhere in the complex plane—computed cleanly via direct characteristic-polynomial comparison or Ackermann’s single formula K = [0…0 1]Q_c⁻¹α_d(A). Because industrial plants rarely instrument every velocity/flux/internal state, a Full-Order Luenberger Observer replicates plant dynamics cleanly inside software with output error correction: ẋ̂ = Ax̂ + Bu + L(y − Cx̂), driving estimation error ė = (A − LC)e exponentially to zero by placing observer eigenvalues 3–5× faster than closed-loop poles. Whenever p independent sensors already measure p states noiselessly directly in y, a Minimal Reduced-Order Observer estimates ONLY the remaining (n − p) unmeasured states cleanly! Crucially, the Separation Principle guarantees controller gain K and observer gain L combine without perturbing each other’s eigenvalues.',
          workingPrinciple:
            'Dual symmetry links observer gain L directly to state-feedback math on transpose system (Aᵀ, Cᵀ) followed by transposition L = K_dualᵀ.',
          equations: [
            { label: 'Ackermann Gain & Separation Matrix Block', latex: 'K = [0\\;\\cdots\\;0\\;1]Q_c^{-1}\\alpha_d(A), \\qquad \\det\\!\\left(sI - \\begin{bmatrix} A-BK & BK \\\\ 0 & A-LC \\end{bmatrix}\\right) = |sI-(A-BK)|\\,|sI-(A-LC)|' },
          ],
          mermaidDiagram: `flowchart LR
  REF["r"] --> SUM["+ Σ"]
  SUM -->|"u = -Kx̂"| PLANT["Plant (A, B, C)"]
  PLANT -->|"y"| OUT["Output y"]
  OUT --> OBS["Luenberger Observer ẋ̂ = Ax̂ + Bu + L(y - Cx̂)"]
  SUM --> OBS
  OBS -->|"x̂"| GAIN["Feedback Gain K"]
  GAIN -->|"-"| SUM`,
          numericals: [
            {
              title: '2nd-Order Pole Placement via Characteristic Match',
              problem: 'For double integrator A = [[0, 1], [0, 0]], B = [[0], [1]], find state feedback K = [k₁, k₂] placing poles at s = −2 ± j2.',
              steps: [
                'Desired characteristic polynomial: α_d(s) = (s + 2 − j2)(s + 2 + j2) = s² + 4s + 8.',
                'Closed-loop matrix A − BK = [[0, 1], [−k₁, −k₂]] ⇒ det(sI − (A − BK)) = s² + k₂s + k₁.',
                'Equating coefficients directly: k₁ = 8, k₂ = 4.',
              ],
              result: 'State feedback K = [8, 4] ⇒ u = −8x₁ − 4x₂.',
            },
          ],
          realWorldApplications: {
            summary: 'Eliminates physical tachogenerators/shaft encoders via virtual flux/speed observers inside industrial AC variable-frequency motor drives.',
            industries: ['Sensorless AC Drives', 'Inverted Pendulum / Robotics', 'Chemical Reactors'],
            examples: ['Reduced-order observer estimating armature flux & angular velocity using current sensor feedback alone'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Fundamentals of Nonlinear Systems
    // =========================================================================
    {
      unitNumber: 3,
      title: 'Fundamentals of Nonlinear Systems',
      hours: 8,
      summary:
        'Incidental/intentional nonlinearities, nonlinear phenomena (limit cycles, jump resonance), Jacobian linearization, 2nd-order phase-plane portraits, singular points, isocline construction, and Describing Function analysis.',
      topics: [
        {
          id: 'mcs-u3-nonlinear-phaseplane',
          title: 'Nonlinearities, Phenomena, Linearization, Phase Portraits & Singular Points',
          summary:
            'Saturation, dead-zone, backlash, relay/hysteresis; amplitude-dependent stability, jump resonance & limit cycles; Jacobian linearization; phase-plane isoclines & node/focus/saddle/center singularities.',
          explanation:
            'Industrial hardware exhibits saturation (op-amps/valve travel limits), dead-zone (valve packing friction), gear backlash, and bang-bang thermostat relays—violating superposition completely! Unlike LTI plants, nonlinear plants show multiple equilibria, initial-condition-dependent stability, jump resonance, subharmonic generation, and self-sustained oscillations (Limit Cycles). Around an operating point (x₀, u₀), Taylor expansion yields the small-signal Jacobian Linearization A = ∂f/∂x, B = ∂f/∂u. Globally for 2nd-order autonomous systems ẋ₁ = x₂, ẋ₂ = f(x₁, x₂), engineers sketch global trajectories in the Phase Plane (x₂ vs x₁) via constant-slope Isoclines (dx₂/dx₁ = m) around Equilibrium Singular Points (ẋ₁ = ẋ₂ = 0), classified by Jacobian eigenvalues into: Stable/Unstable Nodes (distinct same-sign real λ), Foci/Spirals (complex conjugate λ), Saddle points (opposite-sign real λ, always unstable), Centers (pure ±jω closed orbits), and isolated stable/unstable Limit Cycles!',
          workingPrinciple:
            'On the upper half-plane (ẋ₁ = x₂ > 0), trajectories MUST strictly flow left-to-right; on the lower half-plane (x₂ < 0), right-to-left.',
          equations: [
            { label: 'Equilibrium Jacobian Linearization & Slope Equation', latex: 'A = \\left.\\frac{\\partial f}{\\partial x}\\right|_{x_0}, \\qquad \\frac{dx_2}{dx_1} = \\frac{f(x_1, x_2)}{x_2} = m \\;(\\text{Isocline})' },
          ],
          realWorldApplications: {
            summary: 'Diagnoses sticky control valve hunting cycles in refineries and optimal bang-bang switching curves in crane/thruster positioning.',
            industries: ['Valve Maintenance Diagnostics', 'Spacecraft Thrusters', 'Thermostats/HVAC'],
            examples: ['Spotting a ±1.5% closed ellipse limit cycle on MV vs PV plot caused by excessive control-valve stiction'],
          },
        },
        {
          id: 'mcs-u3-describing-function',
          title: 'Describing Function Analysis & Limit-Cycle Stability',
          summary:
            'Harmonic linearization N(X) = (B₁ + jA₁)/X for separable nonlinearities under sinusoidal excitation X sin(ωt); intersection of G(jω) with −1/N(X) locus predicting limit cycles.',
          explanation:
            'Because phase-plane portraits cannot stretch easily beyond 2nd order, high-order closed loops containing one separable memoryless nonlinearity N preceding a low-pass linear plant G(jω) are analyzed using the Describing Function method (harmonic balance). Driving N with sinusoid x = X sin(ωt) generates fundamental + odd harmonics; assuming G(jω) strongly attenuates 3ω, 5ω harmonics (Low-Pass Hypothesis!), N is replaced accurately by an amplitude-dependent complex equivalent gain N(X) = (B₁ + jA₁)/X (e.g., ideal relay ±M gives purely real N(X) = 4M/(πX)). Sustained oscillation (Limit Cycle) emerges wherever G(jω) = −1/N(X) intersects on the complex polar plane! An intersection is STABLE if perturbing X upward shrinks encirclement (dragging −1/N(X) outside G(jω), damping back to X₀).',
          workingPrinciple:
            'Checking whether increasing amplitude X moves −1/N(X) out of or deeper inside the Nyquist curve G(jω) resolves stable vs unstable limit cycles identically to Nyquist encirclements.',
          equations: [
            { label: 'Describing Function & Harmonic Balance Intersection', latex: 'N(X) = \\frac{B_1 + jA_1}{X}, \\qquad 1 + N(X)G(j\\omega) = 0 \\iff G(j\\omega) = -\\frac{1}{N(X)}' },
            { label: 'Ideal Relay (±M) vs Saturation (±M slope k)', latex: 'N_{\\text{relay}}(X) = \\frac{4M}{\\pi X}, \\qquad N_{\\text{sat}}(X) = \\frac{2k}{\\pi}\\left[\\sin^{-1}\\!\\frac{a}{X} + \\frac{a}{X}\\sqrt{1 - \\frac{a^2}{X^2}}\\right]' },
          ],
          mermaidDiagram: `flowchart LR
  R["0"] --> S["(-) Sum"]
  S -->|"x = X sin(ωt)"| NL["Nonlinearity N(X)"]
  NL -->|"Fundamental N(X)·X"| G["Linear Low-Pass G(jω)"]
  G -->|"y(t)"| S`,
          realWorldApplications: {
            summary: 'Åström-Hägglund relay auto-tuning inside industrial PID controllers deliberately sparks a gentle limit cycle to extract ultimate gain K_u = N(X) = 4d/(πa)!',
            industries: ['Auto-Tuning PID Controllers', 'Hydraulic Servos'],
            examples: ['Single-button PID auto-tuner inserting ±5% output relay until temperature oscillates smoothly'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Stability
    // =========================================================================
    {
      unitNumber: 4,
      title: 'Stability (BIBO, Asymptotic, Quadratic Forms, Sylvester, Lyapunov & Popov)',
      hours: 8,
      summary:
        'BIBO vs asymptotic stability, sign definiteness, quadratic forms xᵀPx, Sylvester’s criterion, Lyapunov First (indirect) & Second (direct) methods, and Popov frequency-domain stability criterion.',
      topics: [
        {
          id: 'mcs-u4-bibo-quadratic-sylvester',
          title: 'BIBO vs Asymptotic Stability, Quadratic Forms & Sylvester Criterion',
          summary:
            'Internal vs external stability definitions, positive/negative/semi/indefinite scalar & quadratic functions V(x) = xᵀPx, and Sylvester’s Criterion leading principal minors.',
          explanation:
            'Internal state stability demands zero-input perturbations stay bounded within ε (Lyapunov stability) or return monotonically to equilibrium x_e (Asymptotic Stability)—stronger than external zero-state Bounded-Input Bounded-Output (BIBO) stability! To measure abstract system energy without solving nonlinear ODEs, we test scalar Quadratic Forms V(x) = xᵀPx (with symmetric P = Pᵀ) for Sign Definiteness: V(x) > 0 ∀ x ≠ 0 (Positive Definite), V(x) ≥ 0 (Positive Semidefinite), V(x) < 0 (Negative Definite), or Indefinite. By Sylvester’s Criterion, symmetric matrix P is Positive Definite if and only if ALL leading principal minors Δ₁, Δ₂, …, Δ_n = det(P) are strictly positive (> 0); and Negative Definite iff alternating signs Δ₁ < 0, Δ₂ > 0, Δ₃ < 0…!',
          workingPrinciple:
            'Testing determinant signs down the main diagonal of symmetric matrix P confirms instantaneously whether V(x) = xᵀPx curves upward like a valid multi-dimensional energy bowl.',
          equations: [
            { label: 'Sylvester Criterion for Positive Definiteness', latex: 'V(x) = x^T P x > 0 \\iff \\Delta_1 > 0,\\; \\Delta_2 > 0,\\; \\dots,\\; \\Delta_n = \\det(P) > 0' },
          ],
          realWorldApplications: {
            summary: 'Verifies valid LQR weighting matrices Q, R and candidate energy Lyapunov bowls in nonlinear stabilization.',
            industries: ['Adaptive Robotics', 'Power Grids'],
            examples: ['Confirming Q matrix weights yield positive eigenvalues prior to Riccati computation'],
          },
        },
        {
          id: 'mcs-u4-lyapunov-popov',
          title: 'Lyapunov’s First & Second Methods and Popov’s Stability Criterion',
          summary:
            'Lyapunov First (Indirect Jacobian) method, Lyapunov Second (Direct energy) theorem V(x) > 0 & V̇(x) < 0, LTI matrix equation AᵀP + PA = −Q, and Popov criterion.',
          explanation:
            'Lyapunov formulated two complementary stability methods: (1) First (Indirect) Method linearizes ẋ = f(x) via Jacobian A at equilibrium: if ALL Re(λ_i(A)) < 0, locally asymptotically stable; if ANY Re(λ_i) > 0, unstable; INCONCLUSIVE if max Re(λ_i) = 0! (2) Second (Direct) Method requires ZERO linearization or ODE solving: construct a positive definite energy function V(x) > 0 (V(0) = 0, radially unbounded V → ∞ as ||x|| → ∞ for Global stability) whose time derivative along dynamics V̇(x) = (∇V)ᵀf(x) is Negative Definite (< 0) ⇒ equilibrium is Asymptotically Stable! For LTI ẋ = Ax, pick any positive definite Q > 0 (e.g., Q = I) and solve Lyapunov Matrix Equation AᵀP + PA = −Q: A is globally asymptotically stable iff P > 0! Finally, for feedback loops uniting LTI G(s) with ANY time-invariant sector nonlinearity 0 ≤ f(e)/e ≤ k, Popov’s Criterion draws modified locus Re G(jω) + jω Im G(jω): strict absolute stability holds if the plot lies completely to the right of ANY straight Popov line through (−1/k, j0)!',
          workingPrinciple:
            'If generalized system energy V(x) shrinks steadily at every non-zero state (V̇ < 0), trajectories must sink monotonically down to equilibrium without needing analytical solution x(t).',
          equations: [
            { label: 'LTI Lyapunov Matrix Equation & Popov Criterion', latex: 'A^T P + PA = -Q \\;(Q > 0), \\qquad \\text{Re}\\left[(1 + j\\omega q)\\,G(j\\omega)\\right] + \\frac{1}{k} > 0' },
          ],
          numericals: [
            {
              title: 'Sylvester & Lyapunov Direct Matrix Check',
              problem: 'Verify global asymptotic stability of ẋ = [[0, 1], [−2, −3]]x by solving AᵀP + PA = −I.',
              steps: [
                'Set symmetric P = [[p₁₁, p₁₂], [p₁₂, p₂₂]] and solve [[0,−2],[1,−3]]P + P[[0,1],[−2,−3]] = [[−1,0],[0,−1]].',
                'Entry (1,1): −4p₁₂ = −1 ⇒ p₁₂ = 0.25.',
                'Entry (1,2): p₁₁ − 3p₁₂ − 2p₂₂ = 0; Entry (2,2): 2p₁₂ − 6p₂₂ = −1 ⇒ p₂₂ = 1.5/6 = 0.25 ⇒ p₁₁ = 0.75 + 0.50 = 1.25.',
                'Sylvester minors of P = [[1.25, 0.25], [0.25, 0.25]]: Δ₁ = 1.25 > 0; Δ₂ = 1.25(0.25) − 0.25² = 0.25 > 0 ⇒ P > 0!',
              ],
              result: 'Since P > 0 solves AᵀP + PA = −I, system is globally asymptotically stable.',
            },
          ],
          realWorldApplications: {
            summary: 'Certifies global convergence of adaptive process gain schedulers, multi-joint robot computed-torque controllers, and nonlinear grid stabilizers.',
            industries: ['Industrial Robotics', 'Power System Transient Stability', 'Aerospace'],
            examples: ['Constructing V(x) = ½ω² + 1 − cosθ kinetic+potential energy Lyapunov function for damped nonlinear pendulum'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Optimal Control
    // =========================================================================
    {
      unitNumber: 5,
      title: 'Optimal Control (Calculus of Variations, Pontryagin, HJB & Riccati)',
      hours: 8,
      summary:
        'Optimal control problem formulation, function minimization & Lagrange constrained optimization, Calculus of Variations (Euler-Lagrange), Pontryagin’s Minimum/Maximum Principle, Linear Quadratic Problem, Hamilton-Jacobi-Bellman equation, Riccati equation & LQR enrichment.',
      topics: [
        {
          id: 'mcs-u5-variational-pontryagin',
          title: 'Problem Formulation, Optimization, Calculus of Variations & Pontryagin Principle',
          summary:
            'Performance indices (minimum-time, minimum-fuel, minimum-energy/tracking); static constrained optimization via Lagrange multipliers; Euler-Lagrange variational necessary condition; Pontryagin’s Minimum/Maximum Principle.',
          explanation:
            'Rather than settling for "acceptable" pole locations, Optimal Control selects admissible input u*(t) steering dynamics ẋ = f(x,u) to minimize a scalar Performance Index J = φ(x(t_f)) + ∫ L(x,u,t) dt (capturing Minimum-Time L=1, Minimum-Fuel L=|u|, or Quadratic Energy L=xᵀQx+uᵀRu). Static constrained minimization extends cleanly to dynamic trajectories by adjoining plant ODEs via time-varying Co-State multipliers λ(t) inside Calculus of Variations, producing the Euler-Lagrange boundary-value equations (∂L/∂x − d/dt(∂L/∂ẋ) = 0). Crucially, when actuators face hard physical bounds |u(t)| ≤ U_max, smooth calculus derivative ∂H/∂u = 0 misses boundary optima! Pontryagin’s Minimum Principle minimizes Hamiltonian H(x, u, λ) = L(x,u) + λᵀf(x,u) directly over bounded admissible sets—proving Minimum-Time optimal thruster/servo control is strictly discontinuous Bang-Bang u* = −U_max sgn(switching fn)!',
          workingPrinciple:
            'Pontryagin elevates Euler-Lagrange variational optimization cleanly across saturating actuator limits by minimizing the scalar Hamiltonian directly rather than setting ∂H/∂u = 0 blindly.',
          equations: [
            { label: 'Control Hamiltonian & Co-State Canonical ODEs', latex: 'H(x, u, \\lambda) = L(x, u) + \\lambda^T f(x, u), \\qquad \\dot{x} = \\frac{\\partial H}{\\partial \\lambda}, \\quad \\dot{\\lambda} = -\\frac{\\partial H}{\\partial x}' },
          ],
          realWorldApplications: {
            summary: 'Computes minimum-time crane/elevator slewing profiles and minimum-propellant orbital spacecraft attitude re-orientations.',
            industries: ['Launch Vehicles', 'Automated Warehouse Cranes', 'Batch Reactor Time-Optimal Heating'],
            examples: ['Minimum-time double-integrator switching curve driving motor cleanly from stop to target with one full-accelerate / full-brake reversal'],
          },
        },
        {
          id: 'mcs-u5-lqp-hjb-riccati',
          title: 'Linear Quadratic Problem (LQP), Hamilton-Jacobi-Bellman & Riccati Equations',
          summary:
            'Infinite/finite-horizon Linear Quadratic Problem, Bellman Dynamic Programming / HJB PDE, Matrix Differential & Algebraic Riccati Equations (ARE) & solution.',
          explanation:
            'Minimizing quadratic cost J = ½ xᵀ(t_f)Sx(t_f) + ½ ∫(xᵀQx + uᵀRu) dt (with Q ≥ 0, R > 0) for LTI plant ẋ = Ax + Bu turns Two-Point Boundary Value shooting magically into crisp CLOSED-LOOP state feedback via either Pontryagin (setting λ = P(t)x) or Bellman’s Principle of Optimality yielding the Hamilton-Jacobi-Bellman (HJB) Partial Differential Equation −∂J*/∂t = min_u [L + (∇_x J*)ᵀ(Ax+Bu)]. Substituting quadratic value J*(x,t) = ½ xᵀP(t)x reduces the HJB PDE cleanly to the Matrix Differential Riccati Equation −Ṗ = AᵀP + PA − PBR⁻¹BᵀP + Q (solved backward from P(t_f) = S). In infinite-horizon steady state (t_f → ∞), Ṗ = 0 gives the symmetric Algebraic Riccati Equation (ARE), yielding optimal gain K* = R⁻¹BᵀP!',
          workingPrinciple:
            'Assuming optimal value-to-go is quadratic J*(x) = ½ xᵀPx solves the continuous Hamilton-Jacobi-Bellman PDE exactly, turning open-loop variational optimization into robust closed-loop feedback.',
          equations: [
            { label: 'Hamilton-Jacobi-Bellman PDE & Differential Riccati ODE', latex: '-\\frac{\\partial J^*}{\\partial t} = \\min_u\\left\\{ L + \\left(\\frac{\\partial J^*}{\\partial x}\\right)^T\\!\\dot{x}\\right\\}; \\quad -\\dot{P} = A^T P + PA - PBR^{-1}B^T P + Q' },
            { label: 'Continuous Algebraic Riccati Equation (ARE)', latex: 'A^T P + PA - PBR^{-1}B^T P + Q = 0 \\implies u^* = -R^{-1}B^T P\\,x' },
          ],
          numericals: [
            {
              title: 'Exact Scalar Algebraic Riccati (ARE) Solution',
              problem: 'Solve the infinite-horizon Linear Quadratic Problem for scalar system ẋ = −x + u minimizing J = ½ ∫(3x² + u²)dt.',
              steps: [
                'Identify A = −1, B = 1, Q = 3, R = 1.',
                'Substitute into ARE: (−1)p + p(−1) − p(1)(1⁻¹)(1)p + 3 = 0 ⇒ p² + 2p − 3 = 0.',
                'Factor (p + 3)(p − 1) = 0; choose unique positive-definite root p = +1 > 0.',
                'Optimal feedback K* = R⁻¹ Bᵀ p = 1 × 1 × 1 = 1 ⇒ closed-loop ẋ = (−1 − 1)x = −2x.',
              ],
              result: 'p = 1, optimal LQR law u*(t) = −x(t), doubling natural decay speed cleanly.',
            },
          ],
          realWorldApplications: {
            summary: 'Solves optimal MIMO control gains in aircraft pitch/roll stability augmentation, active vehicle suspension, and industrial MPC horizon costs.',
            industries: ['Aerospace', 'Automotive Suspension', 'Process MPC'],
            examples: ['Solving discrete Riccati ARE cleanly during linear Model Predictive Control terminal cost synthesis'],
          },
        },
        {
          id: 'mcs-u5-lqr-enrichment',
          title: 'LQR Engineering Design & Guaranteed Margins [Enrichment]',
          summary:
            'LQR (Linear Quadratic Regulator) Bryson scaling rules, Kalman inequality guaranteeing ≥ 60° Phase Margin & (−6 dB, ∞) Gain Margin (isExtension: true).',
          isExtension: true,
          verificationFlag: 'Applied LQR engineering tuning & margin enrichment complementing official Section 5 Linear Quadratic Problem.',
          explanation:
            'In practice, engineers deploy the Linear Quadratic Problem directly as LQR via Bryson’s Normalization Rule: set diagonal Q_ii = 1/(max_error_i)² and R_jj = 1/(max_actuator_j)² so heterogeneous meters/radians/volts scale fairly! Remarkable Kalman Frequency-Domain Return-Difference theorem proves every full-state LQR loop satisfies |1 + G_loop(jω)| ≥ 1, guaranteeing at least 60° Phase Margin and (−6 dB, +∞) Gain Margin automatically across ALL channels simultaneously (though beware LQG output-feedback using Kalman observers loses that guarantee cleanly unless Loop Transfer Recovery LTR is applied!).',
          workingPrinciple:
            'Keeping full state feedback keeps the Nyquist curve strictly outside a unit disk centered at (−1, j0), locking in generous phase and gain stability margins regardless of plant dimension.',
          equations: [
            { label: 'Bryson Scaling & Kalman Return-Difference Margin', latex: 'Q_{ii} = \\frac{1}{x_{i,\\max}^2}, \\; R_{jj} = \\frac{1}{u_{j,\\max}^2}; \\qquad |1 + K(j\\omega I - A)^{-1}B| \\ge 1' },
          ],
          realWorldApplications: {
            summary: 'Practical tuning blueprint behind self-balancing robots, multi-rotor flight controllers, and aerospace attitude regulators.',
            industries: ['Robotics', 'Drones/UAVs', 'Rockets'],
            examples: ['Initializing drone LQR weights cleanly via max pitch error (0.2 rad) vs max PWM thrust delta'],
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
        { criterion: 'System Scope', leftValue: 'Single-input single-output (SISO) LTI zero-initial-state plants', rightValue: 'Coupled MIMO, nonzero initial states, nonlinear/time-varying capable' },
        { criterion: 'Internal Modes', leftValue: 'Unobservable/uncontrollable unstable poles can hide in cancellations', rightValue: 'Explicitly tested via Kalman, Gilbert, Factor & PBH tests' },
        { criterion: 'Design Philosophy', leftValue: 'Trial-and-error lead/lag shaping for %Mp, GM, PM', rightValue: 'Systematic Ackermann pole placement, observers & optimal LQR Riccati ARE' },
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
      followUpIfCorrect: 'How does the PBH rank test expose which mode failed?',
      followUpIfReview: 'Remember BIBO transfer function G(s) only describes zero-state zero-noise I/O behavior—always check eig(A)!',
      followUpAnswer: 'Evaluating rank([(+1)I − A, B]) or rank([(+1)I − A; C]) drops strictly below n specifically at λ = +1!',
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
      followUpIfCorrect: 'What guaranteed classical Phase Margin does a properly formulated full-state LQR loop possess regardless of Q and R?',
      followUpIfReview: 'Scale factor: multiplying J by constant c > 0 multiplies P by c, so R⁻¹ cancels c out in K = (cR)⁻¹ Bᵀ (cP)!',
      followUpAnswer: 'By Kalman’s inequality |1 + K(jωI − A)⁻¹B| ≥ 1 on every Nyquist plot, continuous infinite-horizon LQR guarantees ≥ 60° Phase Margin and (−6 dB, +∞) Gain Margin!',
    },
  ],
};

