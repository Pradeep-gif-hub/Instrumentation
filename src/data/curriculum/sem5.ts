import type { CurriculumSubjectDetail } from '@/types/curriculum';
import { NITJ_ANALYTICAL_OPTICAL } from './analyticalOptical';
import { NITJ_MICROPROCESSORS_EMBEDDED } from './microprocessorsEmbedded';
import { NITJ_MODERN_CONTROL } from './modernControl';

export const NITJ_PROCESS_DYNAMICS_CONTROL: CurriculumSubjectDetail = {
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
};

export const SEM5_SUBJECTS: CurriculumSubjectDetail[] = [
  NITJ_MODERN_CONTROL,
  NITJ_ANALYTICAL_OPTICAL,
  NITJ_PROCESS_DYNAMICS_CONTROL,
  NITJ_MICROPROCESSORS_EMBEDDED,
];
