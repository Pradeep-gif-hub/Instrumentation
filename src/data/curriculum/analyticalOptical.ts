import type { CurriculumSubjectDetail } from '@/types/curriculum';

export const NITJ_ANALYTICAL_OPTICAL: CurriculumSubjectDetail = {
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
    'Official Semester V core (ICDC0305 · CO1–CO4): Elements & performance metrics of analytical instruments (errors, accuracy/precision, SNR, PC-based, MEMS & microfluidics); GC, GC-MS, LC, HPLC, LC-MS & Ion Chromatography; TCD, heat-of-reaction, O₂/H₂/CH₄/CO₂/CO, paramagnetic, electrochemical, polarography & gas density; pH, Redox, conductivity & solid/liquid/gas density; optical phenomena, lenses/mirrors/gratings/filters/monochromators, photodetectors, optical alignment, LED/LASER & fiber optics; EM spectrum, Beer-Lambert law, UV/IR/Photoacoustic/NMR/MS/AAS/Flame & Colorimeters/Spectrophotometers.',
  units: [
    // =========================================================================
    // SECTION 1 — Introduction
    // =========================================================================
    {
      unitNumber: 1,
      title: 'Introduction to Analytical Instrumentation, Metrics, MEMS & Microfluidics',
      hours: 6,
      summary:
        'Elements & performance requirements, errors in chemical analysis (accuracy, precision, SNR), intelligent PC-based analytical instruments, MEMS sensors, and microfluidic lab-on-a-chip devices.',
      topics: [
        {
          id: 'aoi-u1-metrics',
          title: 'Elements, Performance Requirements, Errors, Accuracy, Precision & SNR',
          summary:
            'Sample conditioning → transducer → amplifier → readout chain; systematic vs random chemical errors; Accuracy vs Precision; Signal-to-Noise Ratio (SNR) & Detection Limit.',
          explanation:
            'Every quantitative analytical instrument unites four functional blocks: (1) Sample Conditioning & Delivery (filtering dust/moisture, regulating temperature & flow); (2) Primary Analytical Sensor/Disperser converting specific chemical composition into an optical, thermal, electrochemical, or mass-charge impulse; (3) Lock-in / Electrometer Signal Conditioning suppressing thermal Johnson, shot, and 1/f flicker noise; and (4) Calibration & Display. Distinguishing Accuracy (closeness to true concentration—governed by systematic standard calibration & blank subtraction) from Precision (scatter σ across replicate injections—governed by random noise) is essential. Performance hinges directly on Signal-to-Noise Ratio (SNR = S/N): ensemble averaging N repeated scans boosts SNR proportionally to √N cleanly, pushing Limit of Detection (LOD = 3σ_blank / sensitivity m) down to parts-per-billion (ppb)!',
          workingPrinciple:
            'Optical chopping or modulation moves slow noisy chemical absorption signals up to kHz carrier frequencies where lock-in amplification strips ambient drift.',
          inputOutput: { input: 'Conditioned Sample Stream (gas / liquid)', output: 'Calibrated ppm / % Concentration + SNR' },
          equations: [
            { label: 'Signal-to-Noise Gain & Limit of Detection', latex: '\\text{SNR}_N = \\sqrt{N}\\,\\text{SNR}_1, \\qquad \\text{LOD} = \\frac{3\\sigma_{\\text{blank}}}{S}' },
          ],
          mermaidDiagram: `flowchart LR
  SAMP["Sample Conditioning (Filter/Dry/Pressure)"] --> SENS["Selective Analytical Sensor / Cell"]
  SENS --> COND["Lock-In / Electrometer Preamplifier"]
  COND --> ADC["24-Bit ADC + PC Chemometrics"]
  ADC --> OUT["Digital Readout & Calibration Alarms"]`,
          realWorldApplications: {
            summary: 'Governs CEMS environmental stack analyzer shelters, clinical pathology QA, and pharmaceutical cleanroom validation.',
            industries: ['Environmental Monitoring', 'Pharma QA', 'Refinery Analyzers'],
            examples: ['Running spiked recovery blanks to prove ppm heavy-metal accuracy free of matrix bias'],
          },
        },
        {
          id: 'aoi-u1-smart-mems-ufluidics',
          title: 'Intelligent PC-Based Analytical Instruments, MEMS & Microfluidics',
          summary:
            'PC-based automated chemometric deconvolution, Intelligent self-calibrating transmitters, silicon wafer MEMS chemical micro-hotplates/cantilevers, and Microfluidic Lab-on-a-Chip channels.',
          explanation:
            'Modern Intelligent & PC-Based Analytical Instruments replace manual curve interpolation with embedded microcontrollers, USB/Ethernet chemometric multi-component least-squares fitting (PLS), automated zero/span solenoid sequencing, and remote self-diagnostics. At microscopic scale, Micro-Electro-Mechanical Systems (MEMS) batch-fabricate suspended µm-thick silicon-nitride micro-hotplates with nanomole SnO₂ gas films or piezoresistive micro-cantilevers consuming milliwatts instead of Watts! Paired seamlessly with Microfluidics (Lab-on-a-Chip etched PDMS/glass channels 10–200 μm wide driven by laminar electro-osmotic or piezoelectric micro-pumps), diagnostic analyzers execute extraction, reagent mixing, electrophoretic separation, and fluorescence detection using nanoliter sample droplets within seconds.',
          workingPrinciple:
            'Micrometer channel hydraulic diameters force ultra-low Reynolds numbers (Re ≪ 1), creating deterministic strictly laminar diffusion streams without turbulent mixing dead-volumes.',
          equations: [
            { label: 'Microfluidic Channel Reynolds Number', latex: '\\text{Re} = \\frac{\\rho\\,v\\,D_h}{\\mu} \\ll 1 \\quad (\\text{Pure Laminar Flow})' },
          ],
          realWorldApplications: {
            summary: 'Enables handheld multi-gas safety badges, blood glucose/electrolyte cartridges, and portable MEMS PCR/DNA sequencers.',
            industries: ['Medical Point-of-Care', 'Industrial Safety Badges', 'Semiconductor Wafer Fabs'],
            examples: ['CMOS-MEMS pellistor methane detector operating months from one lithium coin cell', 'Disposable microfluidic cartridge running blood electrolyte pH/Na⁺/K⁺ assays in 60 s'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Chromatographic Techniques
    // =========================================================================
    {
      unitNumber: 2,
      title: 'Chromatographic Techniques (GC, GC-MS, LC, HPLC, LC-MS & IC)',
      hours: 8,
      summary:
        'Chromatographic partition theory, Gas Chromatography (GC), GC-MS, Liquid Chromatography (LC), High-Performance Liquid Chromatography (HPLC), LC-MS, and Ion Chromatography (IC) principles, components & applications.',
      topics: [
        {
          id: 'aoi-u2-chrom-gc',
          title: 'Chromatography Principles, Gas Chromatography (GC) & GC-MS',
          summary:
            'Partition equilibrium between Mobile & Stationary phases; retention time t_R & resolution R_s; Carrier gas, Injector, Column oven, TCD/FID/ECD & Quadrupole Mass Spectrometer (GC-MS) interfacing.',
          explanation:
            'Chromatography physically separates multi-component chemical mixtures prior to sensing based on differential equilibrium distribution coefficient K = C_stationary / C_mobile between a continuous flowing Mobile Phase and an immobilized Stationary Phase. Components strongly retained in the stationary layer lag behind, emerging sequentially as resolved peaks at characteristic Retention Times t_R. In Gas Chromatography (GC), volatile thermally stable mixtures (< 400 °C) vaporize inside a heated septum injector into an inert Carrier Gas (He, H₂, or N₂), sweep down temperature-programmed coiled capillary columns (15–100 m coated silica), and exit into selective detectors: non-destructive TCD (universal thermal difference), hypersensitive Flame Ionization Detector (FID burning C–H hydrocarbons cleanly in H₂/air flame), Electron Capture (ECD for halogenated pesticides), or hyphenated Quadrupole Mass Spectrometry (GC-MS)! Because MS ionizers require < 10⁻⁵ Torr vacuum, a heated capillary transfer interface / jet separator drops carrier pressure cleanly before 70 eV Electron Ionization fractures molecules into unique m/z fingerprint ions.',
          workingPrinciple:
            'Differential partitioning continuously transfers solute back and forth between carrier gas and coated column film, multiplying single-plate separation across thousands of theoretical plates.',
          inputOutput: { input: 'Volatile Liquid / Gas Mixture Sample', output: 'Time-Resolved Chromatogram & m/z Library ID' },
          equations: [
            { label: 'Capacity Factor, Resolution & Van Deemter Plate Height', latex: 'k\' = \\frac{t_R - t_0}{t_0}, \\qquad R_s = \\frac{2(t_{R2} - t_{R1})}{W_1 + W_2}, \\qquad H = A + \\frac{B}{u} + C u' },
          ],
          mermaidDiagram: `flowchart LR
  CG["Carrier Gas (He/N2/H2) + Flow Ctrl"] --> INJ["Heated Split/Splitless Injector"]
  INJ --> COL["Heated Capillary Column Oven (Stationary Phase)"]
  COL --> DET["FID / TCD / ECD Detector"]
  COL -->|"Vacuum Jet / Heated Transfer Line"| MS["70 eV Ion Source + Quadrupole MS (GC-MS)"]`,
          realWorldApplications: {
            summary: 'Measures natural gas calorific BTU heating value (C₁–C₆+ online process GC), petrochemical feedstock olefins, and forensic/environmental VOC screening (GC-MS).',
            industries: ['Oil & Gas Refining', 'Forensics & Toxicology', 'Fragrance/Food QC'],
            examples: ['Process GC analyzing C1–C6 hydrocarbon splits every 4 minutes on natural gas pipeline custody skids'],
          },
        },
        {
          id: 'aoi-u2-chrom-hplc-ic',
          title: 'Liquid Chromatography (LC), HPLC, LC-MS & Ion Chromatography (IC)',
          summary:
            'High-pressure 100–400 bar pumping across 3–5 μm C18 reverse-phase columns; UV-Vis/DAD/RI detectors; Electrospray (ESI) LC-MS interface; Ion-exchange columns & background eluent Suppressor in IC.',
          explanation:
            'Thermally unstable drugs, proteins, polymers, and polar organic salts decompose before boiling inside a GC oven! Liquid Chromatography (LC)—and High-Performance Liquid Chromatography (HPLC) forcing liquid Mobile Phase (methanol/acetonitrile + aqueous buffers) at 100–400 bar via reciprocating check-valve pumps through packed microparticle columns (1.7–5 μm reversed-phase C18 silica)—resolves non-volatile solutes cleanly at ambient temperature. Non-destructive detectors include fixed/variable UV-Vis Photodiode Array (DAD) and Refractive Index (RI). Linking LC to Mass Spectrometry (LC-MS) demands evaporating large mL/min solvent loads cleanly at atmospheric pressure using soft Electrospray Ionization (ESI) or Atmospheric Pressure Chemical Ionization (APCI) heated nebulizers without breaking fragile biomolecules. For inorganic water anions/cations (Cl⁻, SO₄²⁻, NO₃⁻, Na⁺, Ca²⁺), Ion Chromatography (IC) packs sulfonated or quaternary-ammonium ion-exchange resins paired with a membrane Suppressor neutralizing conductive eluent into pure H₂O so trace ppb analyte ions register sharply on a conductivity detector!',
          workingPrinciple:
            'High pressure overcomes hydraulic resistance across sub-5 μm porous particles, slashing eddy & mass-transfer broadening (Van Deemter) to resolve complex non-volatile peaks rapidly.',
          equations: [
            { label: 'Poiseuille High-Pressure Column Drop', latex: '\\Delta P = \\frac{\\eta\\,L\\,u\\,\\phi}{d_p^2} \\quad (\\text{halving } d_p \\implies 4\\times \\text{pump pressure!})' },
          ],
          realWorldApplications: {
            summary: 'Essential backbone of pharmaceutical potency assay/stability testing (HPLC), proteomics (LC-MS/MS), and supercritical boiler trace chloride control (IC).',
            industries: ['Pharmaceuticals (cGMP)', 'Biotech Proteomics', 'Power Plant Water Chemistry'],
            examples: ['Gradient reversed-phase C18 HPLC confirming paracetamol purity and related impurities', 'Suppressed IC catching < 2 ppb chloride leakage inside turbine condensate polishers'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Gas Analysis
    // =========================================================================
    {
      unitNumber: 3,
      title: 'Industrial Gas Analysis (TCD, Paramagnetic O₂, Electrochemical, Polarography & Gas Density)',
      hours: 8,
      summary:
        'Thermal conductivity gas analyzers, heat-of-reaction catalytic sensors, O₂/H₂/CH₄/CO₂/CO estimation, binary vs complex mixtures, paramagnetic O₂ dumbbells, electrochemical cells, polarography, and gas density measurement.',
      topics: [
        {
          id: 'aoi-u3-tcd-heat-mixtures',
          title: 'TCD, Heat-of-Reaction & O₂/H₂/CH₄/CO₂/CO Binary/Complex Gas Analysis',
          summary:
            'Wheatstone heated-wire TCD (binary H₂/CO₂ vs carrier-separated complex streams), catalytic combustion (heat-of-reaction %LEL for CH₄/H₂), and NDIR estimation of CO/CO₂/CH₄.',
          explanation:
            'Measuring target gases cleanly depends on isolating physical property contrasts: (1) Thermal Conductivity Detector (TCD) passes sample gas and reference carrier over matched heated Platinum/Tungsten filaments in a constant-current Wheatstone bridge—high thermal conductivity gases like H₂ (k ≈ 0.18 W/m·K vs N₂ 0.026) cool the filament and drop resistance sharply, while low-k CO₂ raises filament temperature! Crucially, TCD gives unambiguous concentration directly ONLY for Binary Gas Mixtures (e.g., H₂ in N₂ purge or CO₂ in flue air); Complex Multi-Component Mixtures vary bulk k non-uniquely unless pre-separated cleanly (GC) or paired with selective channels! (2) Heat-of-Reaction (Catalytic Pellistor) oxidizes flammable Methane CH₄ or H₂ on a platinum-alumina bead heated to 500 °C against an inactive compensator bead, releasing heat ΔH linear up to 100% Lower Explosive Limit (LEL); and (3) Non-Dispersive Infrared (NDIR) measures narrow molecular vibrational bands directly for heteroatomic CO, CO₂, CH₄ (whereas symmetric N₂, O₂, H₂ absorb NO infrared!).',
          workingPrinciple:
            'Balancing active sensing filaments/beads inside temperature-controlled Wheatstone bridges cancels ambient temperature and flow sensitivity cleanly against identical reference cells.',
          inputOutput: { input: 'Sample Flue / Ambient Gas Mixture', output: 'Selective % / ppm Concentration + Bridge mV' },
          equations: [
            { label: 'Thermal Conductivity Wheatstone Heat Loss', latex: 'I^2 R(T_f) = G\\,\\bar{k}_{\\text{gas}}\\,\\left(T_f - T_w\\right) \\quad (\\text{high } k \\implies \\text{cooler filament!})' },
          ],
          realWorldApplications: {
            summary: 'Detects explosive CH₄/H₂ leaks in refineries (%LEL catalytic), tracks ammonia synthesis H₂:N₂ ratio (TCD), and monitors boiler CO/CO₂ stack emissions (NDIR).',
            industries: ['Oil & Gas Refining', 'Power Boilers (CEMS)', 'Ammonia / Hydrogen Plants'],
            examples: ['Binary TCD monitoring hydrogen-cooled turbogenerator stator purity safely during CO₂ purge transition', 'NDIR analyzing stack CO (ppm) + CO₂ (%) continuously'],
          },
        },
        {
          id: 'aoi-u3-o2-electrochem-density',
          title: 'Paramagnetic O₂, Electrochemical / Polarography & Gas Density Analyzers',
          summary:
            'Pauling paramagnetic susceptibility O₂ dumbbell cell, Zirconia Nernst high-temp O₂, 3-electrode electrochemical gas cells, Clark polarographic oxygen membrane cell, and vibrating-cylinder gas density.',
          explanation:
            'Unlike nearly all diamagnetic industrial gases (N₂, CO₂, CH₄), molecular O₂ carries two unpaired π* electrons giving strong positive magnetic susceptibility! (1) Pauling / Magnetodynamic Paramagnetic O₂ Analyzers suspend two nitrogen-filled glass spheres on a quartz torsion band inside an intense inhomogeneous magnet—O₂ drawn into the highest field pushes the diamagnetic spheres aside while optical photocells drive a feedback torque coil proportional to 0–100% O₂! (For hot > 600 °C boiler flues, Zirconia ZrO₂ ceramic cells directly compute O₂ via Nernst logarithmic EMF). (2) Amperometric Electrochemical Gas Cells diffuse CO, H₂S, NH₃, Cl₂ through porous PTFE membranes onto potentiostat-biased Au/Pt electrodes generating Faraday oxidation/reduction current linear to ppm. (3) Polarography (Clark Dissolved/Gaseous O₂ Electrode) applies fixed −0.6 to −0.8 V polarizing potential on a noble cathode behind an O₂-permeable membrane, reducing O₂ completely so diffusion-limited plateau current I_d ∝ pO₂! (4) Gas Density balances gas molecular weight dynamically using oscillating vibrating cylinders or dual balanced buoyancy blowers.',
          workingPrinciple:
            'Polarographic electrodes bias the cathode far onto the diffusion-limiting plateau of the I-V polarogram so current depends strictly on O₂ membrane permeation rate rather than reaction voltage jitter.',
          equations: [
            { label: 'Paramagnetic Force & Clark Polarographic Current', latex: 'F_{\\text{mag}} \\propto \\chi_{\\text{O}_2}\\,B\\,\\frac{dB}{dx}, \\qquad I_{\\text{diff}} = n\\,F\\,A\\,\\frac{P_m}{\\delta}\\,p_{\\text{O}_2}' },
          ],
          realWorldApplications: {
            summary: 'Trims boiler combustion air-fuel ratio cleanly for maximum efficiency & low NOₓ while guarding enclosed spaces from toxic H₂S/CO and hypoxia.',
            industries: ['Thermal Power Plants', 'Wastewater Aeration', 'Air Separation Cryo'],
            examples: ['Paramagnetic O₂ analyzer guarding reactor inert N₂ blanketing below explosive O₂ limits', 'Clark polarographic DO probe tuning bioreactor dissolved oxygen at 30% air saturation'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Chemical Composition Measurements
    // =========================================================================
    {
      unitNumber: 4,
      title: 'Chemical Composition (pH, Redox, Conductivity & Solid/Liquid/Gas Density)',
      hours: 6,
      summary:
        'Definition & measurement methods of pH, glass/reference electrodes & ATC, Redox potential (ORP), electrolytic conductivity & cell constants, and density measurement of solids, liquids, and gases.',
      topics: [
        {
          id: 'aoi-u4-ph-redox-cond',
          title: 'Measurement of pH, Redox Potential (ORP) & Electrical Conductivity',
          summary:
            'Definition pH = −log₁₀(a_H⁺); Glass + Ag/AgCl Reference electrode methods, >10¹² Ω preamp & temperature compensation; ORP platinum redox probes; 2/4-electrode & toroidal conductivity cells.',
          explanation:
            'Acidity/alkalinity is strictly defined on active hydrogen ion molarity pH = −log₁₀(a_H⁺) (spanning 0 acidic to 14 alkaline; neutral pure water is pH 7.00 at 25 °C). Industrial potentiometric measurement immerses a hydrated lithium-silicate pH glass bulb alongside an Ag/AgCl constant-potential KCl reference electrode, obeying the Nernst Equation E_cell = E₀ − (2.303 RT/F)(pH − 7) yielding −59.16 mV/pH at 25 °C! Because glass resistance hits 10–1000 MΩ AND slope depends linearly on Kelvin temperature, transmitters MUST embed >10¹² Ω FET buffers plus a Pt100/Pt1000 temperature compensator. Substituting an inert Platinum band for the pH glass measures Electron-Transfer Oxidizing/Reducing Strength (Redox Potential / ORP in mV) crucial in Cr⁶⁺ reduction & Cl₂ disinfection. Electrical Conductivity κ = G · K_cell (μS/cm or mS/cm) tracks total dissolved ionized salts via AC sine/square excitation (preventing electrode electrolysis polarization!) inside 2-electrode (ultrapure boiler), 4-electrode (fouling resistant), or electrodeless toroidal inductive cells (scaling brines/acids!).',
          workingPrinciple:
            'AC bipolar excitation on conductivity electrodes prevents polarizing DC gas bubbles on metal plates, while toroidal dual-coils couple ionic solution current inductively completely free of wet metal contact.',
          equations: [
            { label: 'Nernst pH Equation & Conductivity Cell Constant', latex: 'E = E_0 - 0.1984\\,T_K\\,(\\text{pH} - 7)\\,[\\text{mV}], \\qquad \\kappa = \\frac{1}{R}\\cdot\\frac{L}{A} = G\\,K_{\\text{cell}}' },
          ],
          realWorldApplications: {
            summary: 'Governs industrial effluent neutralization, cooling tower blowdown conductivity, CIP caustic recovery, and chrome/cyanide redox treatment.',
            industries: ['Effluent Treatment (ETP)', 'Power Steam Boilers', 'Pharma Ultrapure Water'],
            examples: ['Toroidal inductive probe monitoring 2–4% NaOH concentration in dairy CIP loops', 'Two-point buffer cal (Zero pH 7, Slope pH 4) maintaining pharmaceutical fermenter acidity'],
          },
        },
        {
          id: 'aoi-u4-density-multiphase',
          title: 'Density Measurement of Solids, Liquids and Gases',
          summary:
            'Hydrostatic DP/bubbler, displacer buoyancy, vibrating U-tube & Coriolis liquid densitometers; vibrating gas cylinder density; pycnometer/immersion & radiometric Cs-137 slurry/solid density.',
          explanation:
            'Bulk process density ρ = m/V enters both mass-flow conversion and direct product concentration (% Brix sugar, °API crude gravity, % sulfuric acid). Measurement architecture depends sharply on phase: (1) Liquids: Hydrostatic Differential Pressure across constant height H (ΔP = ρgH via dual seal diaphragms/bubbler), Buoyancy Displacers (Archimedes force ∝ ρ), Oscillating U-Tube resonant densitometers (precision mechanical spring-mass frequency f ∝ 1/√(ρV_tube + m_tube) accurate to ±0.0001 g/cm³!), and Coriolis vibrators simultaneously reporting mass flow + density; (2) Gases: Vibrating thin-walled nickel-iron spool cylinder resonators surrounded by process gas where gas inertia shifts natural frequency cleanly at high line pressures without ideal-gas P/ZT drift; (3) Solids & Abrasive Slurries: Precision liquid displacement / hydrostatic pycnometry on discrete samples, nuclear weigh-scales, and non-contact Gamma-Ray Cs-137 attenuation densitometers (I = I₀ e^(−μρd)) clamped externally outside heavy ore slurry pipes!',
          workingPrinciple:
            'An oscillating tube filled with denser process liquid increases effective oscillating mass m_eff while pipe wall stiffness k remains fixed, lowering resonant frequency f = (1/2π)√(k/(m₀+ρV)).',
          equations: [
            { label: 'Oscillating Tube Resonance & Hydrostatic Head Density', latex: '\\rho = A\\,\\tau^2 - B \\quad (\\tau = 1/f), \\qquad \\rho_{\\text{liq}} = \\frac{\\Delta P}{g\\,H}' },
          ],
          realWorldApplications: {
            summary: 'Real-time refinery crude API blending, beverage sugar/alcohol Brix control, mine tailing %solids monitoring, and natural-gas energy density.',
            industries: ['Refining & Beverages', 'Mining Slurries', 'Custody Natural Gas'],
            examples: ['Clamp-on Cs-137 gamma densitometer controlling 65% solids coal slurry feed on flotation banks'],
          },
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Optical Measurements
    // =========================================================================
    {
      unitNumber: 5,
      title: 'Optical Measurements, Dispersive Elements, Detectors, LASERS & Fiber Optics',
      hours: 8,
      summary:
        'Refraction, reflection, transmission & scattering; lenses, mirrors, gratings, filters & monochromators; photosensitive detectors; optical alignment; LED vs LASER sources; basics of optical fibers.',
      topics: [
        {
          id: 'aoi-u5-optics-monochromators',
          title: 'Light Interactions, Lenses/Mirrors, Filters, Gratings & Monochromators',
          summary:
            'Snell refraction n₁sinθ₁ = n₂sinθ₂, specular/total internal reflection, transmission & Rayleigh/Mie scattering; chromatic aberration vs front-surface mirrors; dielectric filters; diffraction gratings & Czerny-Turner monochromators.',
          explanation:
            'Optical sensing manipulates photon propagation across interfaces via four fundamental behaviors: Reflection (mirrors, specular beams), Refraction (Snell’s law n₁ sin θ₁ = n₂ sin θ₂ through curved converging/diverging Lenses), Selective Transmission / Absorption, and Rayleigh/Mie Scattering (utilized directly in 90° nephelometric turbidity!). Because simple glass Lenses suffer focal wavelength shift (chromatic aberration) AND absorb UV < 350 nm, high-grade analytical instruments swap lenses for Al/Au-coated Front-Surface Parabolic/Toroidal Mirrors. Selecting narrow pure wavelengths uses either Colored Absorption Glass / Multi-Layer Dielectric Interference Bandpass Filters (constructive thin-film tuning) OR Diffraction Gratings inside Czerny-Turner Monochromators following d(sin α + sin β) = mλ—splitting white lamp arcs into pure sub-nanometer exit beams with Optical Alignment performed carefully via autocollimators, pinholes, and kinematic mirror mounts.',
          workingPrinciple:
            'Uniformly ruled micrometer grating grooves scatter incident parallel wavefronts so only wavelengths meeting phase-path integer mλ interfere constructively toward the exit slit.',
          inputOutput: { input: 'Polychromatic Source Photons', output: 'Aligned Monochromatic Slit Beam λ ± Δλ' },
          equations: [
            { label: 'Snell Refraction & Blazed Grating Dispersion', latex: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2, \\qquad d(\\sin\\alpha + \\sin\\beta) = m\\lambda' },
          ],
          realWorldApplications: {
            summary: 'Core optical chassis inside UV-Vis, atomic absorption, Raman analyzers, and process color/turbidity photometers.',
            industries: ['Analytical Spectroscopy', 'Optical Metrology', 'Semiconductor Wafer Inspection'],
            examples: ['Replacing glass condenser with quartz optics and Al mirrors to scan deep-UV benzene absorption cleanly at 254 nm'],
          },
        },
        {
          id: 'aoi-u5-detectors-laser-fiber',
          title: 'Photosensitive Detectors, Light Sources (LED / LASER) & Basics of Fiber Optics',
          summary:
            'Phototube, PMT avalanche dynodes (10⁶ gain), LDR photoconductor, Si/InGaAs photodiodes & thermal IR thermopiles; LED spontaneous vs LASER stimulated coherent cavity emission; Step/graded-index fiber TIR & Numerical Aperture.',
          explanation:
            'Choosing a Photosensitive Detector matches spectral band and photon flux: (1) Photomultiplier Tubes (PMTs) cascade UV/Vis photoelectrons down 10 high-voltage dynodes for 10⁶ noise-free gain on tiny luminescence flashes; (2) Reverse-biased PIN Silicon (190–1100 nm) & InGaAs (900–2600 nm) Photodiodes yield ultra-linear nanoamp/microamp photocurrents into op-amp Transimpedance Amplifiers; (3) Photoresistive CdS LDRs trade cheap visible lux sensitivity for slow recovery; (4) Thermal Thermopiles / Pyroelectric DTGS sensors respond flatly across mid-IR (2.5–25 μm) where silicon is blind! On the emitter side, broadband LEDs emit incoherent spontaneous recombination light cleanly for simple filter colorimeters, whereas LASERS rely on Population Inversion + Optical Resonant Cavity + Stimulated Emission to unleash coherent, monochromatic, diffraction-limited beams capable of cross-duct stack gas absorption (TDLAS) over tens of meters! Finally, Optical Fibers trap pulses via Total Internal Reflection inside high-index silica cores surrounded by lower-index cladding (Numerical Aperture NA = sin θ_max = √(n₁² − n₂²)), powering EMI-immune intrinsic-safe plant telemetry and Fiber Bragg Grating (FBG) sensors.',
          workingPrinciple:
            'Whenever core refractive index n₁ exceeds cladding index n₂ inside an acceptance cone sin θ ≤ √(n₁² − n₂²), rays reflect 100% internally without escaping down kilometers of glass fiber.',
          equations: [
            { label: 'Optical Fiber Acceptance Cone & Bragg Shift', latex: '\\text{NA} = \\sin\\theta_{\\max} = \\sqrt{n_1^2 - n_2^2}, \\qquad \\lambda_B = 2\\,n_{\\text{eff}}\\,\\Lambda' },
          ],
          realWorldApplications: {
            summary: 'Cross-stack TDLAS ammonia/O₂ monitoring, HV transformer winding hot-spot FBG sensing, and hazardous-zone photometric probes.',
            industries: ['Refinery Flare Stacks', 'HV Power Transformers', 'Oil-Well Downhole Fiber'],
            examples: ['Intrinsic-safe FBG optical fibers measuring winding temperatures directly inside 400 kV oil-filled power transformers'],
          },
          crossLinks: [
            { label: 'Transducers (Sem III Photo & Fiber Sensors)', targetSubjectId: 'nitj-sem3-tsc', note: 'Reviews photoelectric encoders, LDRs, and FBG strain transducers in instrumentation.' },
          ],
        },
      ],
    },

    // =========================================================================
    // SECTION 6 — Colorimeters and Spectrophotometers
    // =========================================================================
    {
      unitNumber: 6,
      title: 'Colorimeters and Spectrophotometers (Beer-Lambert, UV, IR, NMR, MS, AAS & Flame)',
      hours: 9,
      summary:
        'Electromagnetic spectrum, radiation-matter interaction, Beer-Lambert absorption law, UV/IR/Photoacoustic spectrophotometry, NMR, Mass Spectrometry, AAS, Flame Photometers, and Single/Double-Beam Colorimeters.',
      topics: [
        {
          id: 'aoi-u6-em-beer-colorimeters',
          title: 'EM Spectrum, Radiation-Matter Interaction, Beer-Lambert Law & Colorimeters/UV-Vis',
          summary:
            'Frequency/wavelength transitions (UV electronic, IR vibrational, NMR nuclear spin); Beer-Lambert A = log₁₀(I₀/I) = εbc derivation & deviations; Single-beam Filter Photometer vs Double-Beam Chopper UV-Vis.',
          explanation:
            'Every Electromagnetic Spectrum region excites specific quantized matter transitions: high-energy UV-Vis (190–750 nm) promotes outer valence electrons, Mid-IR (2.5–25 μm) vibrates covalent molecular bonds (unique "molecular fingerprint"), and MHz radio waves inside Tesla magnets flip nuclear spins (NMR)! Passing monochromatic beam intensity I₀ through sample length b containing molar concentration c decays exponentially as each differential slice absorbs proportional to concentration, proving the Beer-Lambert Law: Transmittance T = I/I₀ = 10^(−εbc), or linear Absorbance A = −log₁₀(T) = log₁₀(I₀/I) = ε·b·c (exact strictly for monochromatic radiation & dilute non-associating solutions!). Simple portable Single-Beam Filter Photometers / Colorimeters align tungsten LED → glass absorption filter → test tube → photocell (requiring manual zero-blank swapping before reading each sample), whereas Double-Beam Scanning Spectrophotometers spin a 30–60 Hz rotating sector mirror alternating light rapidly between Sample (I) and Blank Reference (I₀) cuvettes onto ONE detector to cancel source drift and solvent absorbance continuously!',
          workingPrinciple:
            'Rotating optical beam choppers let a single detector compute live transmittance ratio T = I_sample / I_ref electronically every millisecond, cancelling lamp aging and warm-up intensity shifts.',
          equations: [
            { label: 'Beer-Lambert Law & Transmittance', latex: 'T = \\frac{I}{I_0}, \\qquad A = \\log_{10}\\!\\left(\\frac{I_0}{I}\\right) = -\\log_{10}(T) = \\varepsilon\\,b\\,c' },
          ],
          mermaidDiagram: `flowchart LR
  LAMP["D2 (UV) + Tungsten (Vis) Lamp"] --> MONO["Czerny-Turner Grating"]
  MONO --> CHOP["Rotating Sector Mirror"]
  CHOP -->|"Sample Beam (I)"| CELL["Sample Cuvette"]
  CHOP -->|"Ref Beam (I0)"| BLANK["Blank Reference Cuvette"]
  CELL --> PMT["Single PMT / Photodiode"]
  BLANK --> PMT
  PMT -->|"log10(I0/I)"| ABS["Direct Absorbance A = εbc"]`,
          numericals: [
            {
              title: 'Beer-Lambert % Transmittance to Concentration',
              problem: 'An aqueous dye sample in a b = 1.0 cm quartz cell transmits 25.0% light (%T = 25%) at 520 nm where ε = 6020 L/(mol·cm). Find Absorbance A and concentration c.',
              steps: [
                'Convert %T to fractional transmittance: T = 25.0 / 100 = 0.250.',
                'Absorbance A = −log₁₀(0.250) = +0.6021.',
                'From Beer-Lambert A = ε·b·c: c = 0.6021 / (6020 × 1.0) = 1.00 × 10⁻⁴ mol/L = 0.10 mM.',
              ],
              result: 'Absorbance A = 0.602; Concentration c = 0.10 mM.',
            },
          ],
          realWorldApplications: {
            summary: 'Assays municipal chlorine/fluoride/iron water quality (field colorimeters), dissolved pharmaceuticals (double-beam UV-Vis), and silica boiler traces.',
            industries: ['Pharma QC', 'Municipal Water Plants', 'Chemical Reactors'],
            examples: ['Rotating sector double-beam UV-Vis spectrophotometer validating automated tablet dissolution curves'],
          },
        },
        {
          id: 'aoi-u6-ir-pas-nmr-ms-aas-flame',
          title: 'IR / FTIR, Photoacoustic (PAS), NMR, Mass Spectrometry, Flame Photometer & AAS',
          summary:
            'Fourier-Transform IR (Michelson interferometer); Photoacoustic gas/solid microphone spectroscopy; FT-NMR Larmor RF resonance; Electron/Quadrupole Mass Spectrometry m/z; Flame emission photometer (Na/K) & Atomic Absorption (AAS HCL).',
          explanation:
            'Specialized instruments extend composition analysis across opaque slurries, trace ppb metals, and unknown structures: (1) IR & Michelson FTIR replace mechanical gratings with a moving beamsplitter mirror collecting an Interferogram (inverse-FFT’d to full IR spectrum simultaneously for massive Fellgett SNR + Jacquinot throughput gains!); (2) Photoacoustic Spectroscopy (PAS) chops modulated IR light inside a sealed gas/powder cell—absorbed heat pulses expand the gas cleanly as acoustic sound pressure waves detected by a sensitive microphone (zero optical scattering error on opaque powders or dark SF₆ transformer oils!); (3) Atomic Absorption Spectrophotometry (AAS) aspirates aqueous samples into a 2300 °C flame/graphite atomizer while passing narrow element-specific emission lines from a Hollow Cathode Lamp (HCL)—ground-state free atoms absorb selectively down to ppb, whereas Flame Emission Photometers excite Alkali Na⁺ (589 nm yellow) / K⁺ (766 nm violet) thermally in a cool propane flame without an external lamp; (4) Nuclear Magnetic Resonance (NMR) probes spinning ¹H/¹³C nuclei aligned in superconducting B₀ magnets at Larmor frequency ω₀ = γB₀ to map chemical structures; and (5) Mass Spectrometry (MS) ionizes gaseous samples, filters trajectories by mass-to-charge ratio m/z via magnetic sector/quadrupole/TOF fields cleanly down to ppt!',
          workingPrinciple:
            'In AAS, ground-state flame atoms outnumber thermally excited atoms 1000:1, granting orders-of-magnitude higher heavy-metal sensitivity than simple flame emission photometers.',
          equations: [
            { label: 'FTIR Optical Path Difference & NMR Larmor Resonance', latex: '\\delta = 2\\Delta x \\implies I(\\delta) \\xleftrightarrow{\\text{FFT}} S(\\tilde{\\nu}), \\qquad \\nu_0 = \\frac{\\gamma\\,B_0}{2\\pi}' },
            { label: 'Quadrupole / Magnetic Sector m/z Dispersion', latex: '\\frac{m}{z} = \\frac{e\\,B^2\\,r^2}{2\\,V}' },
          ],
          realWorldApplications: {
            summary: 'Dissolved fault-gas (CO, C₂H₂, CH₄) transformer oil warning via Photoacoustic PAS, heavy-metal effluent Pb/Cd check via AAS, and structural synthesis via FT-NMR/MS.',
            industries: ['Power Transformer DGA', 'Metallurgy & Mining', 'Pharma Drug Discovery'],
            examples: ['Online Photoacoustic gas monitor catching 2 ppm acetylene arcing inside high-voltage substations', 'AAS verifying safe ppb Arsenic/Lead levels in groundwater'],
          },
          crossLinks: [
            { label: 'Testing & Calibration (Supplementary ICMI0303)', targetSubjectId: 'nitj-supp-cal', note: 'Holmium-oxide glass wavelength filters and dichromate absorbance standards verify spectrophotometers.' },
          ],
        },
      ],
    },
  ],

  comparisons: [
    {
      title: 'Single-Beam Colorimeter vs Double-Beam UV-Vis Spectrophotometer',
      leftName: 'Single-Beam Filter Photometer / Colorimeter',
      rightName: 'Double-Beam Grating Spectrophotometer',
      rows: [
        { criterion: 'Blank Reference Compensation', leftValue: 'Sequential manual re-zero insertion of blank tube between samples', rightValue: 'Continuous chopper switching automatically cancels lamp drift & blank' },
        { criterion: 'Optical Bandwidth & Range', leftValue: 'Fixed broadband glass filters (~20–40 nm); visible only', rightValue: 'Scanning diffraction grating (0.5–2 nm); UV + Visible (190–900 nm)' },
      ],
    },
    {
      title: 'Atomic Absorption (AAS) vs Flame Emission Photometer',
      leftName: 'Flame Photometer (Emission)',
      rightName: 'Atomic Absorption (AAS)',
      rows: [
        { criterion: 'Measured Physical Event', leftValue: 'Thermal excitation & optical photon emission intensity', rightValue: 'Ground-state free atom absorption of Hollow Cathode Lamp beam' },
        { criterion: 'Best Application', leftValue: 'Low-excitation alkalis Na⁺, K⁺, Li⁺, Ca²⁺ (ppm clinical/soil)', rightValue: '60+ heavy/transition metals Pb, Cd, Zn, Cu down to ppb trace' },
      ],
    },
    {
      title: 'Gas Chromatography (GC) vs HPLC',
      leftName: 'Gas Chromatography (GC)',
      rightName: 'High-Performance LC (HPLC)',
      rows: [
        { criterion: 'Mobile Phase & Analytes', leftValue: 'Inert gas (He/H₂/N₂); volatile stable molecules (< 400 °C)', rightValue: 'Pressurized solvents (100–400 bar); thermally labile APIs/proteins' },
        { criterion: 'Typical Detectors', leftValue: 'TCD, FID, ECD, 70 eV EI Mass Spectrometer', rightValue: 'UV Photodiode Array (DAD), RI, Soft ESI Mass Spectrometer' },
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
      followUpAnswer: 'High concentration shifts solute-solvent refractive index & dimer association, while wide filter slits average unequal ε(λ) wavelengths, curving Beer plots downward.',
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
      answer: 'Slope is 59.16 mV/pH strictly at 25 °C (0.1984·T_K mV/pH), and ordinary 10 MΩ multimeters would load/destroy the high-impedance mV signal!',
      principle: 'High source resistance (100 MΩ) + temperature-proportional Nernst factor (RT/F) require local ultra-high-Z electrometer buffering plus Pt100/Pt1000 slope compensation.',
      followUpIfCorrect: 'What does standard buffer calibration (e.g., pH 7.00 then pH 4.01) adjust inside the transmitter?',
      followUpIfReview: 'Look carefully at the two constants in E = E₀ − Slope(T)·(pH − 7)!',
      followUpAnswer: 'pH 7.00 buffer corrects Zero Asymmetry potential (E₀), while the second pH 4.01 or 10.01 buffer calibrates Slope % efficiency!',
    },
  ],
};

