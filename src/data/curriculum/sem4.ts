import type { CurriculumSubjectDetail } from '@/types/curriculum';
import { NITJ_SIGNAL_PROCESSING } from './signalProcessing';

export const SEM4_SUBJECTS: CurriculumSubjectDetail[] = [
  // =========================================================================
  // 1. CONTROL SYSTEM ENGINEERING (ICDC0206)
  // =========================================================================
  {
    id: 'nitj-sem4-control',
    semester: 4,
    displaySemesterLabel: 'Semester IV',
    code: 'ICDC0206',
    name: 'Control System Engineering',
    shortName: 'Control System Engg.',
    credits: 4,
    category: 'Control & Automation',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Classical linear feedback control course covering block diagrams, multi-domain mathematical modelling, time-domain transient/steady-state performance, Routh-Hurwitz stability, root-locus design, frequency-domain Bode/Nyquist margins, lag/lead compensation, and electro-mechanical control components.',
    units: [
      {
        unitNumber: 1,
        title: 'Introduction, Feedback Architecture & Signal-Flow Graphs',
        hours: 7,
        summary: 'Open-loop vs closed-loop sensitivity, block-diagram reduction algebra, and Mason’s Gain Formula on signal-flow graphs.',
        topics: [
          {
            id: 'cse-u1-feedback',
            title: 'Open-Loop vs Closed-Loop Feedback & Block Diagram Algebra',
            summary: 'Disturbance rejection, parameter sensitivity reduction, negative feedback loops, and canonical block reduction.',
            explanation:
              'An open-loop system drives an actuator strictly from a calibrated schedule without measuring the output (e.g., timed toaster, stepper positioning without encoder); it is cheap and inherently stable only if the plant is stable, but fails under disturbances or plant drift. A closed-loop system continuously feeds back the measured output through a sensor H(s) to compute actuating error E(s) = R(s) − B(s), reducing sensitivity to plant variations G(s) by the loop return difference (1 + G(s)H(s)). Block diagram algebra systematically collapses cascade, parallel, summing-point shifts, take-off shifts, and inner feedback loops.',
            workingPrinciple:
              'Negative feedback scales plant uncertainty ΔG/G and external load disturbances D(s) down by 1/(1 + GH) within the loop bandwidth.',
            inputOutput: { input: 'Setpoint R(s) & Disturbance D(s)', output: 'Controlled Output C(s)' },
            equations: [
              { label: 'Closed-Loop Transfer Function', latex: '\\frac{C(s)}{R(s)} = \\frac{G(s)}{1 + G(s)H(s)}' },
              { label: 'Sensitivity to Plant Gain G(s)', latex: 'S_G^T = \\frac{\\partial T / T}{\\partial G / G} = \\frac{1}{1 + G(s)H(s)}' },
              { label: 'Mason’s Gain Formula (SFG)', latex: 'T = \\frac{1}{\\Delta} \\sum_{k} P_k \\Delta_k, \\quad \\Delta = 1 - \\sum L_i + \\sum L_i L_j - \\cdots' },
            ],
            mermaidDiagram: `flowchart LR
  R["Setpoint R(s)"] --> SUM["(+) Sum (-)"]
  SUM -->|"Error E(s)"| C["Controller Gc(s)"]
  C -->|"Control U(s)"| P["Plant Gp(s)"]
  P --> Y["Output C(s)"]
  Y --> H["Sensor H(s)"]
  H -->|"Feedback B(s)"| SUM`,
            realWorldApplications: {
              summary: 'Underpins every regulatory loop in refineries, CNC servo axes, flight control computers, and battery management systems.',
              industries: ['Process Automation', 'Robotics', 'Aerospace', 'Automotive'],
              examples: ['Steam header pressure control under sudden downstream demand drops', 'Closed-loop BLDC speed control under variable load torque'],
              companyContexts: 'Honeywell Experion PKS, Yokogawa CENTUM VP, Rockwell ControlLogix.',
            },
            advantages: [
              'Rejects unmeasured process load disturbances inside loop bandwidth',
              'Reduces sensitivity to component aging and plant nonlinearity',
              'Shapes transient speed and damping arbitrarily via controller poles/zeros',
            ],
            limitations: [
              'Excessive loop gain or phase lag can destabilize an otherwise stable plant',
              'Adds sensor cost, wiring complexity, and high-frequency measurement noise amplification',
            ],
            comparison: {
              peer: 'Open-Loop Schedule vs Closed-Loop Feedback',
              takeaway: 'Use open-loop only when disturbances are negligible and the plant model is invariant; use feedback whenever safety, disturbance rejection, or tracking accuracy matters.',
            },
            interviewItems: [
              {
                level: 'Beginner',
                question: 'Why does negative feedback reduce system sensitivity to plant gain variations, and what price do we pay?',
                answer: 'Closed-loop sensitivity S_G^T = 1/(1 + GH), so large loop gain |GH| shrinks plant drift error by factor |1 + GH|. The price is reduced overall closed-loop DC gain (approx 1/H), tighter stability margins (risk of oscillation if phase hits −180° while |GH| ≥ 1), and sensor noise injection.',
                followUpQuestion: 'What happens to sensor noise N(s) inside a unity-feedback loop at high loop gain?',
                followUpAnswer: 'Closed-loop transfer from sensor noise to output is −GH/(1 + GH) ≈ −1 at high loop gain, meaning sensor noise passes 1:1 to the output — hence high-frequency roll-off or low-pass filtering is essential.',
              },
            ],
            crossLinks: [
              { label: 'Process Dynamics & Control (Sem V)', targetSubjectId: 'nitj-sem5-pdc', note: 'Industrial PID loops extend canonical feedback with valve nonlinearity and dead time.' },
              { label: 'Modern Control System (Sem V)', targetSubjectId: 'nitj-sem5-mcs', note: 'MIMO state-space control generalizes scalar transfer functions.' },
            ],
            linkedPlatformRoute: '/automation',
            linkedPlatformLabel: 'Explore Control & Automation Hub',
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Mathematical Modelling of Physical Systems',
        hours: 8,
        summary: 'Differential equations, Transfer Functions, State-Variable models, Characteristic Equation, and Electrical/Mechanical/Thermal/Fluid analogies.',
        topics: [
          {
            id: 'cse-u2-modelling',
            title: 'Multi-Domain Transfer Functions, Analogies & Characteristic Equation',
            summary: 'RLC electrical, translational/rotational mechanical, thermal R-C, hydraulic/pneumatic models; Force-Voltage & Force-Current analogies; state-space intro.',
            explanation:
              'Physical control components share isomorphic linear ODEs. Mechanical translational elements—mass M (inertia), damper B (viscous friction), spring K (stiffness)—map via Force-Voltage analogy to L, R, 1/C (velocity ↔ current), or via Force-Current (mobility) analogy to C, 1/R, 1/L (velocity ↔ voltage, preserving node topology!). Similarly, thermal resistance R_th = ΔT/q and capacitance C_th = mc produce first-order τ = R_th C_th dynamics; pneumatic bellows and hydraulic tanks follow Poiseuille/linearized orifice resistance and fluid capacitance C_h = A/ρg. Setting initial conditions to zero and taking Laplace transforms yields the transfer function G(s) = N(s)/D(s), whose denominator D(s) = 0 defines the characteristic equation governing natural modes.',
            workingPrinciple:
              'Through-variables (force, torque, current, heat flow, mass flow) and across-variables (velocity, angular speed, voltage, temperature, pressure) yield unified energy-storage state equations.',
            equations: [
              { label: 'Translational Mass-Spring-Damper', latex: 'M\\ddot{x} + B\\dot{x} + Kx = f(t) \\implies \\frac{X(s)}{F(s)} = \\frac{1}{Ms^2 + Bs + K}' },
              { label: 'Force-Voltage vs Force-Current Correspondence', latex: 'F\\text{-}V:\\ (M, B, K) \\leftrightarrow (L, R, 1/C) \\qquad F\\text{-}I:\\ (M, B, K) \\leftrightarrow (C, 1/R, 1/L)' },
              { label: 'Linearized Thermal / Hydraulic First-Order TF', latex: 'G(s) = \\frac{R_{eq}}{R_{eq} C_{eq} s + 1}, \\qquad \\tau = R_{eq}C_{eq}' },
            ],
            numericals: [
              {
                title: 'Transfer Function & Damping from Mechanical Analog',
                problem: 'A seismic accelerometer has seismic mass M = 0.05 kg, spring K = 200 N/m, and viscous damping B = 4.0 N·s/m. Find ω_n and ζ.',
                steps: [
                  'Characteristic equation: Ms² + Bs + K = 0 ⇒ s² + (B/M)s + (K/M) = 0.',
                  'ω_n = √(K/M) = √(200 / 0.05) = √4000 = 63.25 rad/s (10.07 Hz).',
                  '2ζω_n = B/M = 4.0 / 0.05 = 80 ⇒ ζ = 80 / (2 × 63.25) = 0.632.',
                ],
                result: 'ω_n = 63.25 rad/s, ζ = 0.632 (near-optimal flat accelerometer response).',
              },
            ],
            realWorldApplications: {
              summary: 'Allows instrumentation engineers to prototype mechanical valves, thermal chambers, and robotic actuators in electrical SPICE or MATLAB/Simulink before fabrication.',
              industries: ['Aerospace Actuation', 'HVAC', 'Automotive Suspension', 'Robotics'],
              examples: ['Quarter-car active suspension model', 'Pneumatic diaphragm actuator spring-chamber transfer function'],
            },
            crossLinks: [
              { label: 'Circuit Theory (Sem III)', targetSubjectId: 'nitj-sem3-ct', note: 'Laplace s-domain impedance and KCL/KVL build the Force-Current electrical dual.' },
              { label: 'Process Dynamics & Control (Sem V)', targetSubjectId: 'nitj-sem5-pdc', note: 'Lumped thermal, liquid-level, and CSTR conservation balances extend Unit 2 models.' },
            ],
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Time-Domain Analysis & Routh-Hurwitz Stability',
        hours: 8,
        summary: 'First/second-order responses, transient specs, dominant poles, static error constants (Kp, Kv, Ka), and Routh-Hurwitz criterion.',
        topics: [
          {
            id: 'cse-u3-time-specs',
            title: 'Second-Order Response, Dominant Poles & Steady-State Error',
            summary: 'Overdamped, critically damped, underdamped step responses; td, tr, tp, %Mp, ts; System Type 0/1/2 and error coefficients.',
            explanation:
              'Canonical second-order unity-feedback dynamics G_cl(s) = ω_n² / (s² + 2ζω_n s + ω_n²) depend solely on damping ratio ζ and undamped natural frequency ω_n. Underdamped behavior (0 < ζ < 1) governs most fast servo systems: poles sit at −ζω_n ± jω_d where σ = ζω_n dictates settling time (2% criterion t_s ≈ 4/ζω_n) and ω_d = ω_n√(1−ζ²) sets oscillation frequency. In higher-order systems, a complex pair five times closer to the jω-axis than all other poles acts as dominant poles governing transient shape. Steady-state tracking accuracy depends on open-loop free integrators (System Type N = power of s in G(s)H(s) denominator): Type 0 has finite step error 1/(1+K_p), Type 1 tracks steps with zero error and ramps with 1/K_v, Type 2 tracks ramps cleanly and parabolas with 1/K_a.',
            workingPrinciple:
              'Adding an open-loop integrator eliminates step steady-state error (Type 1) at the cost of −90° constant phase lag, trading steady-state precision against relative stability.',
            equations: [
              { label: 'Transient Specifications (0 < ζ < 1)', latex: '\\%M_p = 100\\,e^{-\\frac{\\pi\\zeta}{\\sqrt{1-\\zeta^2}}}, \\quad t_p = \\frac{\\pi}{\\omega_n\\sqrt{1-\\zeta^2}}, \\quad t_s (2\\%) \\approx \\frac{4}{\\zeta\\omega_n}' },
              { label: 'Static Error Constants', latex: 'K_p = \\lim_{s\\to 0} G(s)H(s), \\quad K_v = \\lim_{s\\to 0} sG(s)H(s), \\quad K_a = \\lim_{s\\to 0} s^2 G(s)H(s)' },
            ],
            numericals: [
              {
                title: 'Overshoot & Settling Time Sizing',
                problem: 'Design an underdamped unity-feedback servo for %Mp ≤ 10% and 2% settling time t_s ≤ 2.0 s.',
                steps: [
                  'From %Mp = 10% ⇒ exp(−πζ/√(1−ζ²)) = 0.10 ⇒ ζ = √((ln² 0.10)/(π² + ln² 0.10)) = 0.591 (use ζ = 0.6).',
                  'From t_s = 4/(ζω_n) ≤ 2.0 ⇒ ζω_n ≥ 2.0 rad/s ⇒ ω_n ≥ 2.0 / 0.6 = 3.33 rad/s.',
                ],
                result: 'Required closed-loop poles: σ ≥ 2.0 s⁻¹, ζ ≥ 0.6, ω_n ≥ 3.33 rad/s.',
              },
            ],
            realWorldApplications: {
              summary: 'Directly sets PID derivative damping vs integral speed targets during DCS loop tuning and CNC motion commissioning.',
              industries: ['CNC Machining', 'Robotics', 'Drones/UAVs', 'Process Valves'],
              examples: ['Ensuring robotic arm joint %Mp < 2% to avoid colliding with fixture walls', 'Type-1 antenna azimuth tracking a moving satellite ramp'],
            },
            linkedPlatformRoute: '/toolbox/pid-tuning',
            linkedPlatformLabel: 'Simulate Response in PID Workbench',
          },
          {
            id: 'cse-u3-routh',
            title: 'Routh-Hurwitz Stability Criterion & Special Cases',
            summary: 'Necessary/sufficient conditions for LHP roots, first-column sign changes, ε-method for zero pivot, and auxiliary polynomial for imaginary/symmetric roots.',
            explanation:
              'Bounded-Input Bounded-Output (BIBO) LTI stability requires every root of the characteristic equation 1 + G(s)H(s) = 0 to lie strictly in the open Left Half Plane (Re(s) < 0). Routh-Hurwitz determines exact RHP pole counts strictly from polynomial coefficients without solving roots: (1) necessary condition—all coefficients must exist and share the same sign; (2) sufficient condition—all entries in the first column of the Routh array share the same sign, with number of sign changes equal to RHP roots. Two special cases appear routinely in design: Case A (zero in first column with non-zero remainder in row) replaces 0 with ε → 0⁺; Case B (entire row of zeros) indicates symmetric roots about the origin (including jω-axis conjugate pairs!), resolved by differentiating the auxiliary polynomial A(s) from the preceding even-power row.',
            workingPrinciple:
              'Finding the marginal gain K_max that triggers an all-zero row directly identifies both ultimate gain K_u and sustained oscillation frequency ω_u = √(roots of A(s)).',
            equations: [
              { label: 'Auxiliary Row & Sustained Oscillation Condition', latex: 'A(s) = a_2 s^2 + a_0 = 0 \\implies s = \\pm j\\omega_u, \\quad \\text{replace zero row with } \\frac{dA(s)}{ds}' },
            ],
            numericals: [
              {
                title: 'Marginal Gain K_max & Oscillation Frequency via Routh Array',
                problem: 'Characteristic equation s³ + 6s² + 11s + (6 + K) = 0 (K > 0). Find K_max for stability and ω_osc at K = K_max.',
                steps: [
                  'Routh rows: s³: [1, 11]; s²: [6, 6+K]; s¹: [(66 − (6+K))/6 = (60−K)/6, 0]; s⁰: [6+K].',
                  'Stability requires 60 − K > 0 and 6 + K > 0 ⇒ 0 < K < 60.',
                  'At K = 60, s¹ row is zero. Auxiliary polynomial A(s) = 6s² + 66 = 0 ⇒ s² = −11 ⇒ ω_osc = √11 = 3.317 rad/s.',
                ],
                result: 'Stable for 0 < K < 60; marginal oscillation at ω_osc = 3.32 rad/s.',
              },
            ],
            realWorldApplications: {
              summary: 'Determines safe gain ceilings before energizing unstable chemical reactors, magnetic levitation loops, or quadrotor attitude controllers.',
              industries: ['Petrochemical Safety', 'Magnetic Bearings', 'Power Grid AVR'],
              examples: ['Computing Ziegler-Nichols ultimate gain K_u analytically from transfer function without destabilizing live plant'],
            },
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Root-Locus Techniques',
        hours: 6,
        summary: 'Magnitude/angle conditions, 8 construction rules, centroid/asymptotes, breakaway points, jω-crossings, and relative stability via gain K.',
        topics: [
          {
            id: 'cse-u4-rootlocus',
            title: 'Root-Locus Construction Rules & Gain/Stability Tuning',
            summary: '180° phase condition, branches n = max(P,Z), real-axis segments, centroid σ_a, breakaway dK/ds = 0, departure angles, and dominant-pole gain lookup.',
            explanation:
              'As open-loop scalar gain K sweeps from 0 to ∞ in 1 + K·G(s)H(s) = 0, every closed-loop pole satisfies the angle condition ∠G(s)H(s) = ±180°(2k+1) and magnitude condition |G(s)H(s)| = 1/K. Branches originate at the P open-loop poles (K=0), terminate at the Z finite open-loop zeros plus (P−Z) zeros at infinity along asymptotes centered at σ_a = (Σp_i − Σz_i)/(P − Z) at angles θ_k = (2k+1)180°/(P−Z). Adding an open-loop zero bends the root locus leftward (stabilizing, faster settling), whereas adding an open-loop pole pulls branches rightward toward the jω-axis (degrading relative stability).',
            workingPrinciple:
              'Plot branches satisfying −180° total phase first, then calibrate gain K at desired damping line ζ = cos θ using K = ∏|s_d − p_i| / ∏|s_d − z_j|.',
            equations: [
              { label: 'Angle & Magnitude Conditions', latex: '\\angle G(s)H(s) = \\pm 180^\\circ(2k+1), \\qquad K = \\frac{\\prod_{i=1}^{P}|s - p_i|}{\\prod_{j=1}^{Z}|s - z_j|}' },
              { label: 'Asymptote Centroid & Angles', latex: '\\sigma_a = \\frac{\\sum p_i - \\sum z_j}{P - Z}, \\qquad \\phi_k = \\frac{(2k+1)\\,180^\\circ}{P - Z}' },
              { label: 'Breakaway / Break-in Condition', latex: '\\frac{dK}{ds} = 0 \\quad \\text{where } K(s) = -\\frac{1}{G(s)H(s)}' },
            ],
            realWorldApplications: {
              summary: 'Visualizes exactly how proportional gain and PD zero placement trade overshoot against response speed and instability.',
              industries: ['Missile Autopilot', 'Disk Drive Servo', 'Motor Drives'],
              examples: ['Tuning DC servo proportional gain to hit ζ = 0.707 damping line', 'Inserting a PD zero to pull complex poles away from RHP'],
            },
            interviewItems: [
              {
                level: 'Intermediate',
                question: 'What happens geometrically to a root locus when you add a bare integral controller (pole at s = 0) vs a PD zero?',
                answer: 'Adding a pole at s = 0 increases P−Z, bends asymptotes toward the Right Half Plane, and slows down settling—reducing relative stability even though steady-state error improves. Adding a finite LHP zero (PD action) decreases P−Z and bends the locus leftward, increasing damping and speed.',
              },
            ],
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Frequency-Domain Analysis (Bode, Polar & Nyquist)',
        hours: 8,
        summary: 'Polar plots, asymptotic Bode magnitude/phase, minimum vs non-minimum phase, Nyquist stability criterion (Z = N + P), and Gain/Phase margins.',
        topics: [
          {
            id: 'cse-u5-bode-nyquist',
            title: 'Bode Diagrams, Nyquist Encirclements & Stability Margins',
            summary: 'dB slopes (±20N dB/dec), corner frequencies, GM/PM interpretation, RHP zeros/non-minimum phase lag, and handling open-loop unstable plants.',
            explanation:
              'Frequency-domain methods evaluate G(jω)H(jω) directly from experimental sinusoidal sweeps without even knowing a parametric differential equation. On a Bode plot, Gain Margin (GM = −20 log|G(jω_pc)H(jω_pc)| dB at phase crossover −180°) measures how much pure loop gain multiplier pushes the system to instability; Phase Margin (PM = 180° + ∠G(jω_gc)H(jω_gc) at 0 dB gain crossover) quantifies tolerance to unmodeled transportation lag (τ_max = PM_rad / ω_gc). Whereas Bode margins directly apply to open-loop stable minimum-phase plants, the Nyquist Criterion (Z = N + P, where Z = closed-loop RHP poles, P = open-loop RHP poles, N = clockwise encirclements of −1 + j0) handles open-loop unstable plants, non-minimum phase RHP zeros (extra phase lag without magnitude change), and pure time delays e^(−sθ) rigorously.',
            workingPrinciple:
              'Every pure time delay θ leaves |e^(−jωθ)| = 1 intact while adding −ωθ radians of linear phase lag, directly eroding Phase Margin.',
            equations: [
              { label: 'Gain Margin & Phase Margin', latex: '\\text{GM}_{\\text{dB}} = -20\\log_{10}|G(j\\omega_{pc})H(j\\omega_{pc})|, \\qquad \\text{PM} = 180^\\circ + \\angle G(j\\omega_{gc})H(j\\omega_{gc})' },
              { label: 'Maximum Tolerable Dead Time Before Instability', latex: '\\theta_{\\max} = \\frac{\\text{PM}_{\\text{rad}}}{\\omega_{gc}}' },
              { label: 'Nyquist Stability Identity', latex: 'Z = N_{\\text{CW}(-1+j0)} + P_{\\text{open-loop RHP}} = 0 \\text{ for stability}' },
            ],
            realWorldApplications: {
              summary: 'Standard industrial tool in SMPS power supply compensation (cross-over frequency & PM ≥ 45°), audio amplifiers, and slow dead-time chemical loops.',
              industries: ['Power Electronics', 'Precision Motion', 'Process Industries'],
              examples: ['Ensuring PM ≥ 45° and GM ≥ 6 dB on buck converter voltage loops', 'Diagnosing non-minimum phase boiler drum shrink-and-swell level response'],
            },
            interviewItems: [
              {
                level: 'Advanced',
                question: 'Two systems have identical Bode magnitude plots, yet one has smaller Phase Margin. Why?',
                answer: 'One is non-minimum phase (containing a Right-Half-Plane zero or pure transportation delay e^(−sθ)). RHP zeros and pure dead time contribute extra negative phase lag without altering the magnitude curve, shrinking Phase Margin.',
                followUpQuestion: 'Give a real physical example of an inverse/non-minimum phase response in a process plant.',
                followUpAnswer: 'Boiler steam-drum water level ("shrink and swell"): feeding cold feedwater collapses steam bubbles initially, making level dip downward before rising—a classic RHP zero.',
              },
            ],
          },
        ],
      },
      {
        unitNumber: 6,
        title: 'Compensation Techniques & Control System Components',
        hours: 7,
        summary: 'Series vs parallel compensation; Lag, Lead, and Lag-Lead networks; AC/DC servomotors, tachogenerators, stepper motors, and synchros.',
        topics: [
          {
            id: 'cse-u6-compensators',
            title: 'Lead, Lag & Lag-Lead Compensator Design',
            summary: 'Lead (phase boost, faster transient, wider BW), Lag (low-frequency DC gain boost, improved steady-state error), and combined Lag-Lead topologies.',
            explanation:
              'When pure gain adjustment cannot satisfy both steady-state accuracy and transient stability, dynamic compensators reshape G(s)H(s) in series (cascade) or feedback (minor-loop tachometer): (1) Phase-Lead compensator G_c(s) = α(1 + sT)/(1 + αsT) with α < 1 (zero closer to origin than pole) adds positive phase lead φ_m up to sin φ_m = (1−α)/(1+α) centered at geometric mean ω_m = 1/(T√α), widening bandwidth and raising Phase Margin—equivalent to practical filtered PD control; (2) Phase-Lag compensator G_c(s) = (1 + sT)/(1 + βsT) with β > 1 (pole closer to origin than zero) attenuates high-frequency gain by 20 log β without sacrificing phase margin if ω_gc shifts down, preserving transient shape while boosting K_v/K_p by factor β—equivalent to bounded PI control.',
            workingPrinciple:
              'Place the maximum lead frequency ω_m at the new desired gain crossover to inject peak phase margin, whereas lag corners sit at least one decade below ω_gc to minimize phase penalty.',
            equations: [
              { label: 'Phase-Lead Max Phase Boost (0 < α < 1)', latex: 'G_{\\text{lead}}(s) = \\frac{s + 1/T}{s + 1/(\\alpha T)}, \\quad \\sin\\phi_m = \\frac{1 - \\alpha}{1 + \\alpha}, \\quad \\omega_m = \\frac{1}{T\\sqrt{\\alpha}}' },
              { label: 'Phase-Lag High-Freq Attenuation (β > 1)', latex: 'G_{\\text{lag}}(s) = \\beta\\frac{1 + sT}{1 + \\beta sT}, \\quad \\text{High-freq gain} = -20\\log_{10}\\beta' },
            ],
            comparison: {
              peer: 'Phase-Lead vs Phase-Lag Compensator',
              takeaway: 'Lead speeds up rise/settling time and boosts Phase Margin (watch high-frequency sensor noise); Lag slashes steady-state error by β× while slowing bandwidth slightly.',
            },
            realWorldApplications: {
              summary: 'Forms Type-II and Type-III op-amp feedback compensators inside switching power supplies, optical pick-up heads, and CNC velocity/position loops.',
              industries: ['Power Electronics', 'Disk Drives', 'Radar Tracking'],
              examples: ['Lead network stabilizing resonant gimbal mount', 'Lag-Lead controller achieving both K_v = 100 s⁻¹ and PM = 50°'],
            },
          },
          {
            id: 'cse-u6-components',
            title: 'Servomotors (AC/DC), Tachogenerators & Stepper Motors',
            summary: 'Armature/field-controlled DC servomotors, 2-phase drag-cup AC servomotor (high R/X rotor), DC/AC tachogenerator rate feedback, and stepper indexing.',
            explanation:
              'Precision closed-loop control hardware requires linear torque-speed curves with zero cogging and low rotor inertia: (1) DC Servomotors (armature-controlled with permanent magnet or constant field) feature low L/R time constant and linear speed vs armature voltage ω(s)/V_a(s) = K_m / [s(τ_m s + 1)]; (2) 2-Phase AC Servomotors feature orthogonal reference and control windings driven 90° out of phase, engineered with high rotor resistance R₂ ≫ X₂ so torque-speed curves remain negatively sloped across the entire operating quadrant (preventing single-phasing run-on!); (3) Tachogenerators produce voltage directly proportional to ω (rate feedback s·K_t adding artificial viscous damping without steady-state position drag); (4) Stepper Motors index discrete angular increments θ_step = 360°/(Phases × Teeth) cleanly under open-loop digital pulses.',
            workingPrinciple:
              'High rotor resistance in an AC servomotor pushes pull-out torque into negative slip (>1), guaranteeing positive electromechanical damping at zero control voltage.',
            equations: [
              { label: 'Armature-Controlled DC Servomotor TF', latex: '\\frac{\\Theta(s)}{V_a(s)} = \\frac{K_t}{s\\left[(R_a + sL_a)(Js + B) + K_t K_b\\right]} \\approx \\frac{K_m}{s(\\tau_m s + 1)}' },
            ],
            realWorldApplications: {
              summary: 'Drives XY CNC stages, 3D printers, robotic grippers, radar pedestals, and industrial proportional valve positioners.',
              industries: ['Factory Automation', 'Semiconductor Lithography', 'Defense/Aerospace'],
              examples: ['Tachogenerator velocity minor loop inside Ward-Leonard / CNC drive', 'Hybrid bipolar stepper in micro-stepping syringe pumps'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Open-Loop vs Closed-Loop Control',
        leftName: 'Open-Loop Control',
        rightName: 'Closed-Loop Feedback',
        rows: [
          { criterion: 'Feedback Path', leftValue: 'None; relies solely on pre-calibration', rightValue: 'Continuous sensor H(s) compares C(s) vs R(s)' },
          { criterion: 'Disturbance Rejection', leftValue: 'Poor — output drifts with load changes', rightValue: 'Rejects disturbances by factor 1/(1 + GH)' },
          { criterion: 'Stability Risk', leftValue: 'Stable whenever open-loop plant is stable', rightValue: 'Can oscillate if high loop gain crosses −180° phase' },
        ],
      },
      {
        title: 'Lead vs Lag Compensation',
        leftName: 'Phase-Lead Network',
        rightName: 'Phase-Lag Network',
        rows: [
          { criterion: 'Dynamic Equivalent', leftValue: 'Filtered PD controller', rightValue: 'Bounded PI controller' },
          { criterion: 'Bandwidth & Speed', leftValue: 'Increases ω_gc; faster rise & settling time', rightValue: 'Lowers ω_gc slightly; slower settling' },
          { criterion: 'Steady-State Accuracy', leftValue: 'Minimal DC error reduction', rightValue: 'Reduces steady-state error by factor β' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-cse-1',
        level: 'Beginner',
        topic: 'System Type & Steady-State Error',
        question: 'A unity-feedback plant has G(s) = 20 / [s(s + 2)(s + 5)]. What is its steady-state error for a unit step R(s) = 1/s and a unit ramp R(s) = 1/s²?',
        options: [
          'Step error = 0; Ramp error = 0.50',
          'Step error = 0.05; Ramp error = ∞',
          'Step error = 0; Ramp error = 0.05',
          'Step error = 0; Ramp error = 0',
        ],
        correctIndex: 0,
        answer: 'Step error = 0; Ramp error = 0.50.',
        principle: 'Presence of one free s term makes it Type 1: K_p = ∞ ⇒ e_ss(step) = 0; K_v = lim_{s→0} sG(s) = 20/(2×5) = 2.0 s⁻¹ ⇒ e_ss(ramp) = 1/K_v = 0.50.',
        followUpIfCorrect: 'How would inserting a Lead compensator change K_v if DC gain stays unchanged?',
        followUpIfReview: 'Why didn’t the gain 20 make step error nonzero here?',
        followUpAnswer: 'One free integrator (1/s) yields infinite DC gain (K_p = ∞), so Type-1 closed-loop DC output always equals the step setpoint identically.',
      },
      {
        id: 'sim-cse-2',
        level: 'Advanced',
        topic: 'Routh-Hurwitz & Nyquist Stability',
        question: 'In Nyquist stability Z = N + P, an open-loop plant has one RHP pole (P = 1), and the Nyquist plot encircles (−1, j0) ONCE counter-clockwise (N = −1). Is the closed-loop system stable?',
        options: [
          'Yes — Z = N + P = −1 + 1 = 0 closed-loop RHP poles',
          'No — any encirclement of (−1, j0) always means instability',
          'Cannot be determined without knowing the open-loop zeros',
        ],
        correctIndex: 0,
        answer: 'Yes — Z = −1 + 1 = 0 (closed-loop stable!).',
        principle: 'For open-loop unstable plants (P > 0), you MUST encircle (−1, j0) counter-clockwise P times so Z = N + P drops to zero.',
        followUpIfCorrect: 'Would you use a single Bode gain/phase margin reading blindly on this P = 1 plant?',
        followUpIfReview: 'Remember N counts clockwise encirclements as positive, so counter-clockwise encirclements enter as negative N.',
        followUpAnswer: 'Never apply simple Bode positive GM/PM rules blindly when P > 0 — open-loop unstable plants often require conditional stability inside a finite K_min < K < K_max window!',
      },
    ],
  },

  // =========================================================================
  // 2. ELECTRICAL MACHINES (ICDC0202)
  // =========================================================================
  {
    id: 'nitj-sem4-machines',
    semester: 4,
    displaySemesterLabel: 'Semester IV',
    code: 'ICDC0202',
    name: 'Electrical Machines',
    shortName: 'Electrical Machines',
    credits: 4,
    category: 'Core ICE',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025 + Sync Extension',
    overview:
      'Industrial rotating machines and power transformers: magnetic losses, electromechanical energy conversion, single-phase/auto transformers, 3-phase induction motors, fractional-kW/special actuators, DC machines, plus clearly separated synchronous-machine fundamentals.',
    units: [
      {
        unitNumber: 1,
        title: 'Magnetic Circuits, Losses & Electromechanical Principles',
        hours: 6,
        summary: 'B-H saturation, hysteresis & eddy current losses, motor vs generator action, multipolar geometry, and electrical vs mechanical angles.',
        topics: [
          {
            id: 'em-u1-magnetics',
            title: 'Hysteresis/Eddy Core Losses & Multipolar Energy Conversion',
            summary: 'Steinmetz hysteresis P_h, lamination eddy reduction P_e, Lorentz e = Blv & F = BIl, and P-pole electrical degree conversion.',
            explanation:
              'Alternating magnetic flux in silicon-steel cores creates two no-load iron losses: Hysteresis loss P_h = k_h f B_m^1.6 V (minimized using narrow-loop CRGO silicon steel) and Eddy Current loss P_e = k_e f² B_m² t² V (suppressed by stacking thin 0.35–0.5 mm varnished laminations perpendicular to flux!). Electromechanical conversion obeys two twin laws: generator EMF e = B l v and motor force F = B I l (back-EMF opposing supply voltage during motoring). In a P-pole machine, one full mechanical revolution sweeps P/2 magnetic pole pairs, relating electrical angle θ_e = (P/2)θ_m and synchronous mechanical speed N_s = 120f/P.',
            workingPrinciple:
              'Laminating cores increases eddy current path resistance R ∝ 1/t² while maintaining low reluctance along flux lines, slashing circulating eddy heating without sacrificing flux density.',
            equations: [
              { label: 'Core Losses (Steinmetz & Eddy)', latex: 'P_h = k_h f B_m^{1.6} V, \\qquad P_e = k_e f^2 B_m^2 t^2 V' },
              { label: 'Electrical Angle & Synchronous Speed', latex: '\\theta_e = \\frac{P}{2}\\,\\theta_m, \\qquad N_s = \\frac{120f}{P}\\ \\text{rpm}' },
            ],
            realWorldApplications: {
              summary: 'Governs transformer core selection, VFD motor derating under PWM harmonics, and encoder pole-pair calibration on servo drives.',
              industries: ['Power Utilities', 'Electric Drives', 'EV Traction'],
              examples: ['Selecting 0.27 mm CRGO laminations for distribution transformers', 'Setting resolver pole-pair ratio P/2 inside VFD parameter table'],
            },
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Transformers: Theory, Testing & Parallel Operation',
        hours: 9,
        summary: 'EMF equation, exact/referred equivalent circuits, OC/SC tests, regulation, efficiency, per-unit impedance, autotransformers, parallel operation, nameplates.',
        topics: [
          {
            id: 'em-u2-transformer',
            title: 'Equivalent Circuit, OC/SC Tests, Regulation & Autotransformers',
            summary: 'EMF E = 4.44 f N Φ_m, referred R_eq/X_eq, core-loss OC vs copper-loss SC tests, zero-reg lagging/leading PF, pu system, parallel banks.',
            explanation:
              'Transformers transfer AC power magnetically via mutual flux Φ_m at constant frequency with E₁/N₁ ≈ E₂/N₂. Referring secondary parameters to primary via turns ratio a = N₁/N₂ yields the T/cantilever equivalent circuit (core-loss R_c ∥ magnetizing X_m in shunt; winding R_01 + jX_01 in series). Open-Circuit (OC) test at rated voltage (HV open) measures iron loss P_i and R_c, X_m; Short-Circuit (SC) test at reduced voltage for rated current measures full-load copper loss P_cu and R_01, X_01. Efficiency peaks when variable copper loss x² P_cu,fl equals constant iron loss P_i. Parallel transformer banks must share identical voltage ratio, frequency, phase group/polarity, and comparable %Z_pu to avoid circulating currents.',
            workingPrinciple:
              'Autotransformers share part of one continuous winding electrically and magnetically, transferring fraction (1 − 1/a) conductively and saving copper by factor (1 − 1/a).',
            equations: [
              { label: 'Transformer EMF & Max Efficiency Condition', latex: 'E_{\\text{rms}} = 4.44\\,f\\,N\\,\\Phi_m, \\qquad x_{\\max\\eta} = \\sqrt{\\frac{P_i}{P_{cu,fl}}}' },
              { label: 'Approximate Voltage Regulation', latex: '\\%VR = \\frac{I_2 (R_{02}\\cos\\phi_2 \\pm X_{02}\\sin\\phi_2)}{E_2} \\times 100\\% \\quad (+ \\text{ lag}, - \\text{ lead})' },
            ],
            numericals: [
              {
                title: 'Transformer Peak Efficiency Load Calculation',
                problem: 'A 100 kVA, 50 Hz transformer has iron loss P_i = 1.2 kW and full-load copper loss P_cu = 1.8 kW. Find kVA load for maximum efficiency.',
                steps: [
                  'At peak efficiency, copper loss equals iron loss: x² P_cu = P_i.',
                  'x = √(1.2 / 1.8) = √0.6667 = 0.8165 ⇒ S_opt = 0.8165 × 100 kVA = 81.65 kVA.',
                ],
                result: 'Peak efficiency occurs at 81.65 kVA.',
              },
            ],
            realWorldApplications: {
              summary: 'Supplies isolated 11 kV/415 V plant MCC buses, PT/CT instrument transformers, and stepped-voltage autotransformer motor starters.',
              industries: ['Substations', 'Plant Power Distribution', 'Switchgear'],
              examples: ['Measuring substation CT/PT burden', 'Reading %Z on a 2 MVA plant transformer nameplate to compute prospective fault kA'],
            },
            interviewItems: [
              {
                level: 'Intermediate',
                question: 'Why can a transformer experience zero or negative voltage regulation on a leading power factor load?',
                answer: 'From %VR ≈ I₂(R₀₂ cosφ − X₀₂ sinφ)/E₂, when capacitive leading current makes X₀₂ sinφ ≥ R₀₂ cosφ, the reactive voltage drop raises terminal voltage V₂ ≥ E₂.',
              },
            ],
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Three-Phase Induction Motors',
        hours: 9,
        summary: 'Rotating magnetic field, slip-torque curve, phasors/equivalent circuit, cogging/crawling, no-load/blocked-rotor tests, starters, V/f speed control, nameplate.',
        topics: [
          {
            id: 'em-u3-im',
            title: 'Slip-Torque Characteristic, Tests, Starters & V/f Control',
            summary: 'N_s = 120f/P, s = (N_s−N_r)/N_s, T_max independent of R₂, crawling/cogging, DOL/Y-Δ starters, constant V/f flux regulation.',
            explanation:
              'Balanced 3-phase stator currents establish a constant-amplitude rotating magnetic field at synchronous speed N_s = 120f/P. By Lenz’s law, the rotor chases at N_r < N_s with slip s = (N_s − N_r)/N_s and rotor EMF frequency f_r = s f. Referred rotor mechanical power divides across slip as P_g : P_cu : P_m = 1 : s : (1−s). Adding external rotor resistance (slip-ring IM) boosts starting torque T_st and shifts s_m = R₂/X₂ without changing pull-out torque T_max ∝ V²/(2X₂). Harmonics cause crawling at N_s/7 (7th harmonic) while matching stator/rotor slot multiples causes magnetic cogging at zero speed. No-load and blocked-rotor tests parameterize the equivalent circuit.',
            workingPrinciple:
              'Maintaining constant V/f keeps air-gap flux Φ_m ∝ E/f constant across VFD speed commands, delivering flat rated torque from low speed up to base speed.',
            equations: [
              { label: 'Induction Motor Torque & Power Split', latex: 'T = \\frac{3}{\\omega_s} \\frac{V_{th}^2 (R_2/s)}{(R_{th} + R_2/s)^2 + (X_{th} + X_2)^2}, \\qquad P_{m} = (1-s)P_g' },
              { label: 'Star-Delta Starting Advantage', latex: 'I_{\\text{line}, Y} = \\frac{1}{3} I_{\\text{line}, \\Delta}, \\qquad T_{\\text{start}, Y} = \\frac{1}{3} T_{\\text{start}, \\Delta}' },
            ],
            numericals: [
              {
                title: 'Rotor Frequency & Copper Loss Split',
                problem: 'A 4-pole, 50 Hz, 3-phase IM runs at 1440 rpm delivering 30 kW air-gap power P_g. Find slip, rotor frequency, and rotor copper loss.',
                steps: [
                  'N_s = 120 × 50 / 4 = 1500 rpm.',
                  'Slip s = (1500 − 1440)/1500 = 0.04 (4%).',
                  'Rotor frequency f_r = s·f = 0.04 × 50 = 2.0 Hz.',
                  'Rotor copper loss P_cu = s · P_g = 0.04 × 30 kW = 1.2 kW (mechanical P_m = 28.8 kW).',
                ],
                result: 's = 4%, f_r = 2.0 Hz, P_cu = 1.2 kW.',
              },
            ],
            realWorldApplications: {
              summary: 'Drives 85%+ of industrial pumps, centrifugal compressors, boiler ID/FD fans, conveyor belts, and mixers via VFD variable-torque speed control.',
              industries: ['Petrochemical', 'Water Treatment', 'Cement', 'HVAC'],
              examples: ['VFD ramp saving 40% pump power via cube-law affinity', 'Star-delta starter cutting 6× inrush current on 75 kW chiller compressor'],
            },
            linkedPlatformRoute: '/applications',
            linkedPlatformLabel: 'Explore Industrial Pump/Motor Applications',
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Fractional-kW & Special Purpose Motors',
        hours: 6,
        summary: 'Single-phase induction (split-phase, capacitor, shaded-pole), reluctance, hysteresis, stepper (VR/PM/hybrid), and universal AC/DC motors.',
        topics: [
          {
            id: 'em-u4-special',
            title: 'Single-Phase IM, Reluctance, Hysteresis, Stepper & Universal Motors',
            summary: 'Double revolving field theory (zero starting torque without auxiliary phase), capacitor-start/run, shaded-pole, and synchronous fractional drives.',
            explanation:
              'A single-phase pulsating stator MMF resolves via Double Revolving Field Theory into two equal half-amplitude fields rotating oppositely at ±N_s—producing identical opposing torques at standstill (zero starting torque!). Splitting stator current into Main and Auxiliary windings separated electrically near 90° (split-phase resistance/inductance, electrolytic capacitor-start, permanent split-phase capacitor, or copper shading ring) generates net starting torque. Reluctance motors align salient rotor teeth along minimum reluctance; Hysteresis motors run silently via hysteresis torque drag in hard chrome-cobalt sleeves (electric clocks, precision gyroscopes); Universal motors are compensated DC series motors operating on both AC and DC at high speeds (hand drills, vacuum cleaners).',
            workingPrinciple:
              'An auxiliary winding phase-shifted by capacitor C establishes an elliptical rotating field just enough to cross standstill; a centrifugal switch opens around 75% N_s.',
            realWorldApplications: {
              summary: 'Powers residential appliances, lab centrifuges, constant-speed chart recorders, HVAC fans, and valve stepper actuators.',
              industries: ['Building Automation', 'Lab Instruments', 'Consumer Appliances'],
              examples: ['Shaded-pole exhaust fan', 'Hysteresis synchronous motor in mechanical chart/timer drives', 'Hybrid stepper in fluid dosing pumps'],
            },
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'DC Machines: Windings, Armature Reaction & Drives',
        hours: 9,
        summary: 'Armature EMF/torque, commutation, armature reaction, series/shunt/compound curves, losses/tests, 3/4-point starters, braking, jogging & terminal markings.',
        topics: [
          {
            id: 'em-u5-dc',
            title: 'DC Motor/Generator Characteristics, Starting, Braking & Markings',
            summary: 'E_b = PΦZN/60A, armature reaction cross/demagnetizing, shunt/series/compound torque-speed, plugging/regenerative braking, A1-A2/F1-F2/D1-D2.',
            explanation:
              'In DC machines, stationary stator poles establish excitation Φ while a mechanical commutator-brush assembly reverses armature coil currents under each pole to keep unidirectional DC torque T_a = (PZ/2πA) Φ I_a. Under load, armature MMF distorts main field flux (cross-magnetization shifting neutral plane + saturation demagnetization), countered by interpoles and pole-face compensating windings. Shunt motors give nearly constant speed; Series motors give massive starting torque T ∝ I_a² (never start unloaded lest N ∝ 1/Φ runs away!); Compound motors combine both. Stators/armatures require external 3-point/4-point starters at rest because back-EMF E_b = 0 makes I_a = V/R_a dangerously huge. Braking stops rotors via dynamic resistor dissipation, plugging (reversing armature leads—never field!), or regenerative feed-back above no-load speed. Standard terminal markings: Armature A1–A2, Shunt field F1–F2, Series field D1–D2.',
            workingPrinciple:
              'Mechanical speed adjusts until back-EMF E_b = V − I_a R_a draws the exact armature current demanded by load torque.',
            equations: [
              { label: 'DC Back-EMF & Torque Equations', latex: 'E_b = \\frac{P\\Phi Z N}{60 A}, \\qquad T_a = 0.159\\,\\Phi I_a\\,\\frac{P Z}{A}, \\qquad N \\propto \\frac{V - I_a R_a}{\\Phi}' },
            ],
            realWorldApplications: {
              summary: 'Used in heavy steel rolling mills, crane hoists (DC series), traction locomotives, and servo positioning actuators.',
              industries: ['Steel & Rolling Mills', 'Rail Traction', 'Heavy Cranes'],
              examples: ['Dynamic braking resistor bank on mine hoist', 'Checking A1–A2 vs F1–F2 terminal blocks before commissioning DC drive'],
            },
            interviewItems: [
              {
                level: 'Intermediate',
                question: 'Why must a DC Series motor never be started without mechanical load connected (e.g., broken belt)?',
                answer: 'In a series motor Φ ∝ I_a, so under no load I_a and Φ collapse toward zero; since speed N ∝ (V − I_a R_a)/Φ, speed rises catastrophically past centrifugal limits and destroys the armature.',
              },
            ],
          },
        ],
      },
      {
        unitNumber: 6,
        title: 'Synchronous Machine Fundamentals (Additional Extension)',
        hours: 4,
        summary: 'Clearly marked supplementary extension: cylindrical vs salient-pole alternators, armature reaction, synchronous impedance, V-curves, power-angle & hunting.',
        isExtension: true,
        topics: [
          {
            id: 'em-u6-sync-ext',
            title: 'Alternator Armature Reaction, Power-Angle & Synchronous V-Curves',
            summary: 'Z_s = R_a + jX_s, lag/lead PF armature reaction, P = (E_f V/X_s) sin δ, V-curves as synchronous condenser, damper windings for hunting.',
            isExtension: true,
            verificationFlag: 'Additional Extension beyond base 5-unit core summary—essential for substation/power placements.',
            explanation:
              'Included here as an explicit industrial extension: a 3-phase synchronous generator locks rotor speed rigidly to grid frequency N_s = 120f/P via DC field excitation. Armature current power factor dictates armature reaction: purely resistive (UPF) cross-magnetizes, lagging inductive current demagnetizes main flux (requiring higher excitation E_f), and leading capacitive current magnetizes main flux. Plotting armature current I_a against DC field excitation I_f at constant shaft load produces classic V-curves: over-excited synchronous motors run at leading PF, acting as grid synchronous condensers. Copper damper bars in pole shoes damp transient rotor oscillations ("hunting") following sudden torque swings.',
            workingPrinciple:
              'Real electrical power transfers across load angle δ between rotor field E_f and grid bus V via P = (E_f V / X_s) sin δ (pull-out limit at δ = 90°).',
            equations: [
              { label: 'Cylindrical Rotor Power-Angle Curve', latex: 'P = \\frac{E_f V}{X_s}\\sin\\delta, \\qquad Q = \\frac{E_f V \\cos\\delta - V^2}{X_s}' },
            ],
            realWorldApplications: {
              summary: 'Generates grid electricity in thermal/hydro power plants and regulates industrial plant power factor on large synchronous compressor drives.',
              industries: ['Power Generation', 'Petrochemical Refineries', 'Steel Plants'],
              examples: ['Turbo-alternator automatic voltage regulator (AVR) holding bus voltage under reactive spikes', 'Over-excited synchronous condenser boosting substation PF'],
            },
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'DC Shunt vs DC Series vs 3-Phase Induction Motor',
        leftName: 'DC Shunt / Series',
        rightName: '3-Phase Induction Motor',
        rows: [
          { criterion: 'Commutation', leftValue: 'Brushes + copper commutator (maintenance)', rightValue: 'Brushless squirrel cage (ultra rugged)' },
          { criterion: 'Speed Control', leftValue: 'Natural wide range via V_a or Φ_f', rightValue: 'Needs VFD (constant V/f PWM inverter)' },
          { criterion: 'Starting Torque', leftValue: 'Very high in Series (T ∝ I_a²)', rightValue: 'Moderate; requires Y-Δ or VFD boost' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-em-1',
        level: 'Beginner',
        topic: 'Core Laminations & Eddy Loss',
        question: 'If core lamination thickness t is halved while keeping total core volume and peak flux B_m constant at 50 Hz, how does Eddy Current loss change?',
        options: [
          'Drops to 1/4 (25%) because P_e ∝ t²',
          'Halves to 50%',
          'Doubles because there are twice as many laminations',
          'Stays unchanged since B_m and f are fixed',
        ],
        correctIndex: 0,
        answer: 'Drops to 1/4 (25%) because P_e ∝ t².',
        principle: 'Cutting lamination thickness t in half divides induced loop voltage per lamination by 2 and cross-section area, cutting eddy P_e = k_e f² B_m² t² V by 4×.',
        followUpIfCorrect: 'Does halving lamination thickness affect Hysteresis loss P_h?',
        followUpIfReview: 'Remember Hysteresis depends on magnetic domain volume and B_m^1.6, whereas Eddy currents depend on circulating loop area (thickness²).',
        followUpAnswer: 'No — hysteresis loss P_h depends only on steel alloy k_h, frequency f, peak flux B_m^1.6, and total iron volume V (slightly modified by stacking factor).',
      },
      {
        id: 'sim-em-2',
        level: 'Practical Scenario',
        topic: 'Transformer Open-Circuit vs Short-Circuit Tests',
        question: 'On a 2200 V / 220 V transformer, which winding side is typically excited during Open-Circuit (OC) and Short-Circuit (SC) lab tests for safety and meter convenience?',
        options: [
          'OC on LV (220 V) side; SC on HV (2200 V) side',
          'OC on HV side; SC on LV side',
          'Both tests on HV side only',
          'Both tests on LV side only',
        ],
        correctIndex: 0,
        answer: 'OC on LV (220 V) side (rated voltage easy to supply safely); SC on HV side (rated HV current is 10× smaller, easy to measure at ~5% reduced voltage).',
        principle: 'OC needs rated voltage & tiny no-load current; SC needs tiny impedance voltage (~5% rated) & rated current—exciting HV during SC keeps test current small and controllable.',
        followUpIfCorrect: 'Which parameter—iron loss P_i or copper loss P_cu—is negligible during the SC test, and why?',
        followUpIfReview: 'Always check which side gives moderate current and safe voltage for benchtop Variac/ammeter instrumentation!',
        followUpAnswer: 'Iron loss P_i ∝ V² drops to (0.05)² = 0.25% of rated during the reduced-voltage SC test, so SC wattmeter reads almost purely full-load copper loss P_cu.',
      },
    ],
  },

  // =========================================================================
  // 3. INDUSTRIAL MEASUREMENT SYSTEMS (ICDC0208)
  // =========================================================================
  {
    id: 'nitj-sem4-ims',
    semester: 4,
    displaySemesterLabel: 'Semester IV',
    code: 'ICDC0208',
    name: 'Industrial Measurement Systems',
    shortName: 'Industrial Measurement Sys.',
    credits: 4,
    category: 'Core ICE',
    syllabusStatus: 'official-core',
    syllabusBadge: 'NITJ Core · Rev. June 2025',
    overview:
      'Industrial field instrumentation engineering: dynamic error compensation, noise/ground-loop immunity, industrial thermometry & thermowells, pressure/vacuum & dead-weight standards, orifice/Venturi/Coriolis/mag/ultrasonic flow, and level, humidity, viscosity, bulk solid & shaft power.',
    units: [
      {
        unitNumber: 1,
        title: 'Dynamic Errors, Compensation & Interference Immunity',
        hours: 6,
        summary: 'Dynamic tracking error, dynamic compensator networks, EMI/ground-loop rejection, shielded twisted pairs, 4–20 mA loops, and intrinsic safety barriers.',
        topics: [
          {
            id: 'ims-u1-dyn-noise',
            title: 'Dynamic Error Compensation, EMI Shielding & Ground Loops',
            summary: 'Lead-compensating first-order lag τ_s, ramp lag error ε = τ·R, common-mode interference, single-point shield earthing, and 4–20 mA immunity.',
            explanation:
              'When measuring fast thermal or pressure transients, an instrument with time constant τ_s shows dynamic lag error (phase delay on sinusoids and steady-state ramp error = τ_s · dX/dt). Multiplying the output through an electrical dynamic compensator G_c(s) = (1 + τ_s s)/(1 + τ_fast s) with τ_fast ≪ τ_s cancels the slow physical pole and extends useful bandwidth. In noisy plants, long cable runs next to VFD motor feeders face magnetic (loop-area pickup), capacitive (dv/dt coupling), and conductive ground-loop interference (two different earth potentials driving circulating current in shield/negative lead). Industry mitigates this using twisted pair (cancels magnetic flux), foil shield grounded strictly at ONE end (control-room marshalling cabinet), differential instrumentation amplifiers, and 4–20 mA current loops insensitive to cable resistance.',
            workingPrinciple:
              'Kirchhoff’s Current Law ensures 4–20 mA loop current stays identical from field transmitter to PLC AI card regardless of voltage drops across intermediate terminals.',
            equations: [
              { label: 'First-Order Ramp Lag Error', latex: 'e_{\\text{ramp}}(\\infty) = \\tau_s \\cdot \\dot{X}_{\\text{ramp}}' },
              { label: 'Dynamic Lag Compensation', latex: 'G_{\\text{total}}(s) = \\underbrace{\\frac{K}{1 + \\tau_s s}}_{\\text{Sensor}} \\cdot \\underbrace{\\frac{1 + \\tau_s s}{1 + \\tau_{\\text{fast}} s}}_{\\text{Compensator}} = \\frac{K}{1 + \\tau_{\\text{fast}} s}' },
            ],
            realWorldApplications: {
              summary: 'Prevents erratic readings, nuisance ESD trips, and thermocouple noise spikes in refinery and power-plant cable trays.',
              industries: ['Oil & Gas', 'Power Plants', 'Chemical Complex', 'Pharma'],
              examples: ['Separating 4–20 mA intrinsically safe trays from 415 V VFD trays by ≥ 300 mm', 'Ground-loop elimination via isolated signal splitters'],
            },
          },
        ],
      },
      {
        unitNumber: 2,
        title: 'Industrial Temperature Measurement',
        hours: 9,
        summary: 'ITS-90 fixed points, filled systems (liquid/gas/vapor), industrial RTDs & thermocouples, thermowells, optical/two-color radiation pyrometers.',
        topics: [
          {
            id: 'ims-u2-temp',
            title: 'ITS-90, Filled Thermometers, RTDs/Thermocouples & Radiation Pyrometers',
            summary: 'Triple point of water (0.01 °C), Class I-IV filled bulbs, thermowell vortex shedding check, optical disappearing filament & two-color ratio pyrometry.',
            explanation:
              'Industrial temperature spans cryogenic LNG (−162 °C) to blast-furnace melts (>1600 °C). ITS-90 defines fixed phase-equilibrium points anchored by Triple Point of Water (273.16 K). Locally without electric power, mechanical Filled-System Thermometers (Class I liquid, Class II vapor-pressure nonlinear bulb, Class III gas-filled, Class IV mercury) drive Bourdon dials directly. Electrical control loops rely on Pt100 RTDs inside stainless/Inconel bar-stock thermowells (check ASME PTC 19.3 TW so vortex-shedding frequency stays below 0.8× natural frequency!) and Type K/J/S/B thermocouples. Above 1200 °C or on moving steel billets, non-contact Radiation Pyrometers follow Stefan-Boltzmann E = εσT⁴; Ratio (two-color) pyrometers measure radiance at two wavelengths λ₁, λ₂ to cancel target emissivity uncertainty ε and sight-glass dust.',
            workingPrinciple:
              'Two-color pyrometers take log(E(λ₁)/E(λ₂)), eliminating equal grey-body emissivity ε from numerator and denominator.',
            equations: [
              { label: 'Stefan-Boltzmann & Two-Color Ratio Principle', latex: 'E = \\varepsilon\\sigma T^4, \\qquad \\frac{E(\\lambda_1)}{E(\\lambda_2)} \\approx \\left(\\frac{\\lambda_2}{\\lambda_1}\\right)^5 \\exp\\!\\left[\\frac{C_2}{T}\\left(\\frac{1}{\\lambda_2} - \\frac{1}{\\lambda_1}\\right)\\right]' },
            ],
            realWorldApplications: {
              summary: 'Controls exothermic reactors, boiler superheaters, cement rotary kilns, and rolling-mill slabs.',
              industries: ['Steel & Metallurgy', 'Petrochemicals', 'Cement Kilns', 'Power Boilers'],
              examples: ['Two-color IR pyrometer reading 1450 °C molten steel stream through furnace fume', 'ASME PTC 19.3 tapered thermowell on high-velocity steam header'],
            },
            crossLinks: [
              { label: 'Transducers & Signal Conditioning (Sem III)', targetSubjectId: 'nitj-sem3-tsc', note: 'Builds upon RTD 3-wire bridge and thermocouple CJC laws.' },
            ],
            linkedPlatformRoute: '/instrumentation/temperature/rtd',
            linkedPlatformLabel: 'Inspect 3D Industrial Pt100 Assembly',
          },
        ],
      },
      {
        unitNumber: 3,
        title: 'Industrial Pressure & Vacuum Measurement',
        hours: 8,
        summary: 'Manometers, Bourdon/diaphragm/bellows, capacitive/strain-gauge transmitters, high-vacuum (McLeod, Pirani, Ionization), and Dead-Weight Testers.',
        topics: [
          {
            id: 'ims-u3-pressure',
            title: 'Mechanical Gauges, DP Cells, Vacuum Gauges & Dead-Weight Testers',
            summary: 'U-tube/inclined manometer, C-Bourdon oval flattening, strain/capacitive DP transducers, McLeod/Pirani/Ionization vacuum range, DWT calibration.',
            explanation:
              'Pressure instrumentation spans 10⁻¹⁰ Torr ultra-high vacuum to 4000 bar hydraulic presses. Low static drops use U-tube/inclined manometers (ΔP = ρgΔh sin θ). Plant gauges employ oval C-shaped Bourdon tubes (pressure tends to circularize cross-section, uncurling tip proportionally), corrugated diaphragms (for viscous slurries via remote seals), and bellows. Modern smart transmitters use silicon piezoresistive strain bridges or dual-capacitor center-diaphragm DP cells (C₁/C₂ ratio cancels temperature oil expansion). Vacuum ranges demand specialized physics: McLeod gauge (Boyle’s law PV = const compression, primary low-vacuum reference), Pirani/Thermocouple gauges (10⁻³ to 10 Torr, gas thermal conductivity drops with pressure), and Penning/Bayard-Alpert ionization gauges (10⁻¹⁰ to 10⁻³ Torr, electron-impact gas ion current). Primary gauge calibration uses Dead-Weight Testers (P = m·g/A_eff) corrected for local gravity g and air buoyancy.',
            workingPrinciple:
              'Spinning the dead-weight tester piston breaks static O-ring/cylinder stiction so effective hydraulic pressure equals exact gravitational force divided by effective piston-cylinder area.',
            equations: [
              { label: 'Dead-Weight Tester & Differential Capacitance', latex: 'P = \\frac{\\sum m \\cdot g_{\\text{local}}}{A_{\\text{eff}}}, \\qquad \\frac{C_1 - C_2}{C_1 + C_2} \\propto \\Delta P' },
            ],
            realWorldApplications: {
              summary: 'Monitors distillation column DP, vacuum distillation condenser vacuum, turbine exhaust vacuum, and plant calibration labs.',
              industries: ['Semiconductors', 'Petrochemicals', 'Turbines', 'Metrology Labs'],
              examples: ['Pirani + Penning combo gauge on sputter vacuum coater', 'Hydrostatic dead-weight tester calibrating 0–400 bar hydraulic switches'],
            },
            linkedPlatformRoute: '/instrumentation/pressure/bourdon-tube',
            linkedPlatformLabel: 'Inspect 3D Bourdon Pressure Gauge',
          },
        ],
      },
      {
        unitNumber: 4,
        title: 'Industrial Flow Measurement',
        hours: 10,
        summary: 'Head-type (orifice, Venturi, nozzle, Pitot), variable-area rotameter, PD oval-gear, turbine, electromagnetic, vortex, ultrasonic, Coriolis, hot-wire anemometer.',
        topics: [
          {
            id: 'ims-u4-flow',
            title: 'Head-Type, Velocity, Mass Flowmeters & Hot-Wire Anemometer',
            summary: 'Orifice vs Venturi ΔP ∝ Q², rotameter constant-ΔP, Faraday magmeter, Strouhal vortex, transit-time ultrasonic, Coriolis ṁ, CTA anemometer.',
            explanation:
              'Obstruction Head meters apply Bernoulli + Continuity so volumetric flow follows square-root law Q = C_d A₂ √(2ΔP/ρ(1−β⁴)), requiring square-root extraction (4–20 mA linear flow). Sharp-edged Orifice plates are cheap and field-replaceable (concentric clean fluid; eccentric/segmental for entrained gas/slurries) with 50–70% permanent pressure drop, whereas Venturi tubes recover 85–90% pressure for large cooling-water headers. Rotameters float at variable area under constant ΔP for linear visual scale. Velocity meters give linear output directly: Turbine (blade pulses ∝ Q), Electromagnetic (Faraday E = B·L·v for conductive liquids ≥ 5 μS/cm, zero obstruction!), Vortex Shedding (shed frequency f_v = St·v/d for clean steam/gas/liquid), Ultrasonic (transit-time Δt for clean fluid, Doppler for bubbly/slurry). True Mass Flow meters measure mass directly independent of P, T, ρ: Coriolis twin vibrating tubes twist by Δt ∝ ṁ, and Thermal/Hot-Wire Anemometers use King’s law I²R = (A + B√v)(T_w − T_f) in Constant-Temperature mode (CTA) for ultra-fast turbulence.',
            workingPrinciple:
              'Coriolis oscillating tubes induce opposite Coriolis forces on inlet vs outlet fluid halves, twisting the tube linearly with mass flow rate ṁ while tube natural frequency simultaneously reads density ρ.',
            equations: [
              { label: 'Orifice / Venturi Volumetric Flow', latex: 'Q = \\frac{C_d A_2}{\\sqrt{1 - \\beta^4}} \\sqrt{\\frac{2\\Delta P}{\\rho}}, \\qquad \\beta = \\frac{d}{D}' },
              { label: 'Faraday Magmeter & Strouhal Vortex', latex: 'E = B D v = \\frac{4 B Q}{\\pi D}, \\qquad f_v = \\text{St}\\cdot\\frac{v}{d}' },
              { label: 'King’s Law (Constant-Temp Hot-Wire Anemometer)', latex: 'I^2 R_w = (A + B\\sqrt{v})(T_w - T_f)' },
            ],
            numericals: [
              {
                title: 'Orifice DP Transmitter 4–20 mA Flow Scaling',
                problem: 'An orifice plate produces 100 kPa ΔP at full-scale flow 400 m³/h. What flow corresponds to 50% DP (50 kPa) and 8.0 mA linear DP output?',
                steps: [
                  'Wait: at 8.0 mA on a linear DP transmitter: %DP = (8 − 4)/(20 − 4) = 4/16 = 25% of span (25 kPa).',
                  'Because Q ∝ √ΔP: Q = Q_max √(%DP) = 400 × √0.25 = 400 × 0.50 = 200 m³/h.',
                  'At 50 kPa (50% DP): Q = 400 × √0.50 = 282.8 m³/h.',
                ],
                result: '200 m³/h at 25 kPa (8 mA linear DP); 282.8 m³/h at 50 kPa.',
              },
            ],
            realWorldApplications: {
              summary: 'Monitors custody-transfer oil/gas pipelines, wastewater treatment effluent, steam boiler output, and aerodynamic wind-tunnel turbulence.',
              industries: ['Oil & Gas Custody Transfer', 'Food & Beverage', 'Water/Wastewater', 'Aerodynamics'],
              examples: ['Coriolis meter on LNG/pharma dosing skids (±0.1% mass accuracy)', 'Electromagnetic flowmeter in corrosive pulp/effluent lines', 'Venturi meter in municipal main pipelines'],
            },
            linkedPlatformRoute: '/toolbox/flow-rate',
            linkedPlatformLabel: 'Open Orifice β & DP Flow Calculator',
          },
        ],
      },
      {
        unitNumber: 5,
        title: 'Level, Humidity, Viscosity, Solids Mass & Shaft Power',
        hours: 7,
        summary: 'Float/displacer/DP/capacitive/ultrasonic liquid level, hygrometers, rotational/capillary viscometers, solid-level/belt-weighers, and shaft torque/power.',
        topics: [
          {
            id: 'ims-u5-other-vars',
            title: 'Level, Humidity, Viscosity, Bulk Solid Weight & Shaft Power',
            summary: 'Wet/dry leg DP level, capacitive level, chilled-mirror dew point & polymer RH, rotational viscometers, silo load cells, and shaft torsiometers.',
            explanation:
              'Beyond T, P, and Q, continuous plants measure five critical secondary variables: (1) Liquid Level—buoyancy floats, torque-tube displacers (Archimedes upward thrust vs immersion height), hydrostatic DP transmitters (wet-leg correction P_high − P_low on pressurized boilers/drums), insulated capacitive probes (dielectric constant ε_r jumps from air 1 to water 80), ultrasonic air-time, and FMCW radar (immune to vapor/pressure); (2) Humidity—wet/dry bulb psychrometer, optical chilled-mirror dew-point mirror (primary standard), and thin-film capacitive polymer %RH sensor; (3) Viscosity—capillary Hagen-Poiseuille, falling-sphere Stokes law, and rotational Brookfield spindle torque; (4) Solid Level & Mass—belt weighers (load cell × belt tachometer pulses), tuning-fork/RF admittance bin switches, and hopper shear-beam load cells; (5) Shaft Power—wireless strain-gauge torque collars or dual optical gear-tooth phase twist Δθ multiplying by angular velocity P = T·ω.',
            workingPrinciple:
              'Hydrostatic DP level cancels vessel static pressure P_static identically across high/low impulse ports, isolating strictly liquid head ρgh.',
            equations: [
              { label: 'Pressurized Wet-Leg DP Level & Shaft Power', latex: '\\Delta P = \\rho_{\\text{liq}} g h - \\rho_{\\text{seal}} g H_{\\text{ref}}, \\qquad P_{\\text{shaft}} = T\\cdot\\omega = \\frac{2\\pi N T}{60}' },
            ],
            realWorldApplications: {
              summary: 'Controls boiler steam drums, cleanroom humidity, polymer extrusion melt viscosity, coal conveyor tonnage, and marine propulsion shaft kW.',
              industries: ['Cleanrooms/Pharma', 'Power Boilers', 'Polymers', 'Marine/Cement'],
              examples: ['Zero-suppressed wet-leg DP transmitter on steam condenser hotwell', 'Rotational torque viscometer on heavy fuel oil preheater before boiler burners'],
            },
            linkedPlatformRoute: '/toolbox/level-dp',
            linkedPlatformLabel: 'Open DP Wet/Dry-Leg Level Calculator',
          },
        ],
      },
    ],
    comparisons: [
      {
        title: 'Industrial Flowmeters Selection Matrix',
        leftName: 'Differential Pressure (Orifice / Venturi)',
        rightName: 'Electromagnetic vs Coriolis',
        rows: [
          { criterion: 'Physical Principle', leftValue: 'Bernoulli ΔP ∝ Q² (requires √ extraction)', rightValue: 'Mag: Faraday E=BLv (vol.); Coriolis: Δt ∝ ṁ (mass)' },
          { criterion: 'Fluid Requirement', leftValue: 'Liquid, gas, or steam; any conductivity', rightValue: 'Mag: conductive liquid ≥ 5 μS/cm; Coriolis: any liquid/gas' },
          { criterion: 'Head Loss & Accuracy', leftValue: 'Orifice high loss (~0.5–1.5%); Venturi low loss', rightValue: 'Zero obstruction; Coriolis ±0.1% mass custody accuracy' },
        ],
      },
    ],
    simulatorQuestions: [
      {
        id: 'sim-ims-1',
        level: 'Practical Scenario',
        topic: 'Flowmeter Selection',
        question: 'A plant needs non-intrusive volumetric flow measurement of conductive wastewater containing suspended solids (150 mS/m) with zero pipe pressure drop. Which flowmeter fits best?',
        options: [
          'Electromagnetic flowmeter (Magmeter) with PTFE liner',
          'Sharp-edged concentric orifice plate',
          'Rotameter with glass tube',
          'Hot-wire anemometer',
        ],
        correctIndex: 0,
        answer: 'Electromagnetic flowmeter (Magmeter) with PTFE liner.',
        principle: 'Fluid conductivity comfortably exceeds 5 μS/cm, while full-bore insulated tube eliminates moving parts, solids clogging, and permanent head loss.',
        followUpIfCorrect: 'Why cannot a standard electromagnetic flowmeter measure deionized water (< 0.1 μS/cm) or hydrocarbon crude oil?',
        followUpIfReview: 'Remember Faraday induction needs free charge carriers (ions) in the flowing fluid to complete the electrode EMF circuit.',
        followUpAnswer: 'Non-conductive fluids have practically infinite source impedance between electrodes, collapsing Faraday voltage at the converter input and leaving severe flow noise.',
      },
      {
        id: 'sim-ims-2',
        level: 'Intermediate',
        topic: 'Radiation Pyrometry',
        question: 'A steel rolling slab passes beneath dense steam/dust plumes where surface emissivity varies as scale peels off. Which pyrometer minimizes error?',
        options: [
          'Two-color (Ratio) radiation pyrometer',
          'Single-wavelength broadband infrared pyrometer',
          'J-type exposed thermocouple',
          'Vapor-pressure filled bulb thermometer',
        ],
        correctIndex: 0,
        answer: 'Two-color (Ratio) radiation pyrometer.',
        principle: 'Measuring the radiance ratio at two close wavelengths λ₁, λ₂ cancels gray-body emissivity variations and uniform dust attenuation up to ~90% beam blockage.',
        followUpIfCorrect: 'When can even a two-color pyrometer produce slight error?',
        followUpIfReview: 'Check what cancels out when taking E(λ₁)/E(λ₂).',
        followUpAnswer: 'When target emissivity is non-gray (ε(λ₁) ≠ ε(λ₂)) or selective gas bands (like water/CO₂ infrared absorption) attenuate one wavelength disproportionately.',
      },
    ],
  },
  NITJ_SIGNAL_PROCESSING,
];
