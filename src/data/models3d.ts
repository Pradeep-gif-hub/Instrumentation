export interface CadPartMetadata {
  id: string;
  code: string;
  name: string;
  material: string;
  description: string;
  function: string;
  industrialRelevance: string;
  explodeOffset: [number, number, number];
  anchor: [number, number, number];
}

export interface CadModelConfig {
  id: 'rtd-pt100' | 'thermocouple-k' | 'dp-transmitter' | 'orifice-plate';
  title: string;
  subtitle: string;
  glbUrl: string;
  standard: string;
  disclosure: string;
  defaultCameraPos: [number, number, number];
  target: [number, number, number];
  topicRoute: string;
  parts: CadPartMetadata[];
}

export const CAD_MODELS: Record<CadModelConfig['id'], CadModelConfig> = {
  'rtd-pt100': {
    id: 'rtd-pt100',
    title: 'Industrial DIN Form B Pt100 RTD Assembly',
    subtitle: '4-Wire IEC 60751 Resistance Temperature Detector with Flanged Thermowell',
    glbUrl: '/models/rtd-pt100-assembly.glb',
    standard: 'IEC 60751 · DIN EN 50446 Form B · ANSI B16.5 Flange',
    disclosure:
      'Illustrative Engineering CAD Model · Representative IEC 60751 industrial RTD construction; not a proprietary vendor STEP export.',
    defaultCameraPos: [2.6, 1.35, 3.2],
    target: [0, 0.1, 0],
    topicRoute: '/instrumentation/temperature/rtd',
    parts: [
      {
        id: 'terminal_head',
        code: '01',
        name: 'DIN Form B Terminal Head',
        material: 'Epoxy-coated Die-Cast Aluminum (IP67 / NEMA 4X) + Viton O-ring',
        description:
          'Weatherproof and flameproof junction housing enclosing the ceramic terminal block or head-mounted 4–20 mA temperature transmitter.',
        function:
          'Protects low-level resistive terminations from plant moisture, corrosive fumes, and electromagnetic noise while allowing inspection via screw cover.',
        industrialRelevance:
          'Damaged lid O-rings or upward-facing cable glands allow condensation inside the head, shunting resistance across terminals and causing negative temperature drift.',
        explodeOffset: [0, 0.95, 0],
        anchor: [0.32, 1.48, 0.15],
      },
      {
        id: 'cable_gland',
        code: '02',
        name: 'M20×1.5 Strain-Relief Cable Gland',
        material: 'Nickel-Plated Brass Body, PA6 Polymer Dome Nut, EPDM Grommet',
        description:
          'Threaded conduit entry compression gland securing the incoming instrumentation field cable into the terminal head side boss.',
        function:
          'Maintains IP66/67 ingress protection and mechanical pull-out strain relief on shielded twisted-pair signal leads.',
        industrialRelevance:
          'In Ex d / Zone 1 refineries, standard polymer glands are replaced with certified Ex d barrier glands to contain potential internal arcs.',
        explodeOffset: [-1.1, 0.95, 0],
        anchor: [-0.72, 1.24, 0],
      },
      {
        id: 'terminal_block',
        code: '03',
        name: 'Ceramic Terminal Block (4-Wire)',
        material: 'Steatite High-Temp Ceramic Base + Machined Brass Binding Plates',
        description:
          'Spring-loaded DIN Form B mounting disk featuring isolated barrier walls and four brass terminals color-coded Red–Red–White–White per IEC 60751.',
        function:
          'Provides electrically isolated, vibration-resistant junctions between fragile internal RTD leads and heavy field wiring.',
        industrialRelevance:
          'Spring-loaded mounting maintains positive tip contact at the bottom of the thermowell under thermal expansion, minimizing air-gap lag.',
        explodeOffset: [0.9, 1.35, 0],
        anchor: [0.0, 1.32, 0.18],
      },
      {
        id: 'process_connection',
        code: '04',
        name: '1/2" NPT Hex Process Fitting',
        material: 'Machined AISI 316L Stainless Steel (27 mm Hex Flats)',
        description:
          'Threaded hexagonal male fitting coupling the RTD stem assembly into a thermowell neck extension or directly into low-pressure vessels.',
        function:
          'Provides a wrenchable pressure-retaining mechanical mounting interface and axial alignment with the process nozzle.',
        industrialRelevance:
          'Process threads (NPT vs BSP) must match thermowell internal threads exactly; cross-threading compromises pressure containment and vibration durability.',
        explodeOffset: [0.85, 0.35, 0],
        anchor: [0.24, 0.65, 0],
      },
      {
        id: 'protective_sheath',
        code: '05',
        name: 'AISI 316L Protective Sheath',
        material: 'Seamless AISI 316L (1.4404) Stainless Steel Tube, Welded Tip',
        description:
          'Precision hollow metallic tube (typically 6 mm or 8 mm OD) sealed at the measuring tip by TIG welding.',
        function:
          'Shields the delicate platinum sensing element and internal ceramic insulation from oxidation, mechanical shock, and corrosive media.',
        industrialRelevance:
          'Sheath wall thickness trades off mechanical robustness against thermal response time constant (τ63%). Spring-loaded tips eliminate radial air gap.',
        explodeOffset: [0, -1.05, 0],
        anchor: [0.095, -0.45, 0],
      },
      {
        id: 'thermowell',
        code: '06',
        name: 'Bar-Stock Flanged Thermowell',
        material: 'Drilled Forged 316L Bar Stock · ANSI B16.5 Raised-Face Flange',
        description:
          'Heavy tapered solid-drilled pressure barrier welded or flanged directly onto high-velocity pipelines and pressurized reactors.',
        function:
          'Allows RTD removal, replacement, and bench calibration while the process vessel remains pressurized and in operation.',
        industrialRelevance:
          'Must pass ASME PTC 19.3 TW wake-frequency calculations so vortex shedding frequency never resonates with the thermowell natural frequency.',
        explodeOffset: [0, -1.85, 0],
        anchor: [0.40, 0.20, 0.15],
      },
      {
        id: 'ceramic_insulator',
        code: '07',
        name: 'Multi-Bore Alumina Insulator',
        material: 'Sintered 99.7% Al₂O₃ (Alumina) Ceramic Tubes',
        description:
          'Segmented high-purity cylindrical ceramic bores running concentrically inside the protective sheath.',
        function:
          'Maintains high dielectric isolation (>100 MΩ at 500 VDC) between internal connecting wires up to 600–850 °C.',
        industrialRelevance:
          'Cracked ceramic spacers from vibration or thermal shock cause wire-to-sheath ground faults, introducing erratic DCS readings.',
        explodeOffset: [-0.68, -0.15, 0],
        anchor: [-0.06, -0.20, 0],
      },
      {
        id: 'internal_leads',
        code: '08',
        name: '4-Wire Internal Connecting Leads',
        material: 'Silver/Nickel-Clad Copper Conductors with PTFE/Fiberglass Sleeving',
        description:
          'Two red and two white internal conductors routing from the sensing element through the ceramic bores to the terminal block.',
        function:
          'Enables full 4-wire Kelvin bridge lead-resistance cancellation (or 3-wire compensation) so cable resistance does not bias temperature output.',
        industrialRelevance:
          'In 2-wire Pt100, just 0.385 Ω of lead resistance creates a +1.0 °C false offset; industrial plants standardize on 3-wire or 4-wire wiring.',
        explodeOffset: [0.68, -0.15, 0],
        anchor: [0.03, 0.22, 0.03],
      },
      {
        id: 'sensing_element',
        code: '09',
        name: 'Pt100 Platinum Sensing Element',
        material: '99.999% Pure Platinum (α = 0.00385 Ω/Ω/°C) on Al₂O₃ + Glass Glaze',
        description:
          'Laser-trimmed meandering platinum thin-film or strain-free wire helix encapsulated in borosilicate glass at the measuring tip.',
        function:
          'Produces a repeatable, near-linear 100.00 Ω resistance at 0 °C (R₀) governed by the Callendar-Van Dusen equation.',
        industrialRelevance:
          'Class A tolerance is ±(0.15 + 0.002|t|) °C. Mechanical strain or metallic contamination shifts α away from the IEC 60751 curve.',
        explodeOffset: [0, -0.60, 0.45],
        anchor: [0.0, -1.35, 0.04],
      },
    ],
  },

  'thermocouple-k': {
    id: 'thermocouple-k',
    title: 'Mineral-Insulated Type-K Thermocouple Assembly',
    subtitle: 'Chromel (+Ni-Cr) / Alumel (-Ni-Al) IEC 60584 Assembly with Polarized Head',
    glbUrl: '/models/thermocouple-type-k.glb',
    standard: 'IEC 60584-1 / ASTM E230 Type K',
    disclosure:
      'Illustrative Engineering CAD Model · Representative mineral-insulated Type-K thermocouple construction for educational inspection.',
    defaultCameraPos: [2.4, 1.25, 3.0],
    target: [0, 0.05, 0],
    topicRoute: '/instrumentation/temperature/thermocouple',
    parts: [
      {
        id: 'tc_terminal_head',
        code: '01',
        name: 'Type-K Terminal Head',
        material: 'Cast Aluminum + IEC Yellow Identification Collar',
        description: 'Weatherproof industrial junction head coded yellow (ANSI/IEC Type K identification band).',
        function: 'Houses the polarized thermocouple terminal block or transmitter puck.',
        industrialRelevance: 'Head temperature defines the reference junction if transmitter/block sits locally inside the housing.',
        explodeOffset: [0, 0.85, 0],
        anchor: [0.28, 1.38, 0.12],
      },
      {
        id: 'tc_terminal_block',
        code: '02',
        name: 'Polarized Compensating Terminal Block',
        material: 'Ceramic Base + Alloy-Matched Chromel(+)/Alumel(-) Contacts',
        description: 'Thermocouple-grade terminal screws made from matching KP/KN alloys rather than generic brass.',
        function: 'Prevents parasitic secondary thermoelectric junctions across terminal temperature gradients.',
        industrialRelevance: 'Reversing + and − leads on Type K inverts the polarity and drives the DCS temperature negative as furnace heats up.',
        explodeOffset: [0.85, 1.1, 0],
        anchor: [0.0, 1.28, 0.14],
      },
      {
        id: 'tc_compression_fitting',
        code: '03',
        name: 'Adjustable Compression Fitting',
        material: 'AISI 316L Hex Body + Brass Ferrule Gland',
        description: 'Sliding threaded 1/2" NPT gland allowing field adjustment of insertion immersion depth.',
        function: 'Seals the sheath against low-pressure process ducts and sets immersion depth.',
        industrialRelevance: 'Once swaged onto a mineral-insulated sheath, the ferrule permanently locks onto the sheath.',
        explodeOffset: [0.75, 0.35, 0],
        anchor: [0.20, 0.68, 0],
      },
      {
        id: 'tc_cable_entry',
        code: '04',
        name: 'KX Extension Cable & Gland',
        material: 'Brass Gland + Yellow PVC-Jacketed KX Compensating Pair',
        description: 'Color-coded extension cable matching Type K Seebeck coefficient up to 200 °C.',
        function: 'Extends the thermoelectric circuit back to the marshalling cabinet reference junction without introducing voltage loss.',
        industrialRelevance: 'Never substitute copper instrumentation cable between head and marshalling room; it shifts the cold junction to the field!',
        explodeOffset: [-0.95, 0.85, 0],
        anchor: [-0.55, 1.20, 0],
      },
      {
        id: 'tc_inconel_sheath',
        code: '05',
        name: 'Inconel 600 Protection Sheath',
        material: 'Nickel-Chromium-Iron Alloy (Inconel 600), max ~1150 °C',
        description: 'Oxidation- and carburization-resistant seamless metal sheath.',
        function: 'Protects Chromel-Alumel conductors from sulfidation and green-rot embrittlement.',
        industrialRelevance: 'Inconel 600 outperforms 316SS above 800 °C in oxidizing flue gases.',
        explodeOffset: [0, -1.0, 0],
        anchor: [0.088, -0.45, 0],
      },
      {
        id: 'tc_mgo_beads',
        code: '06',
        name: 'Twin-Bore Ceramic Beads',
        material: 'High-Purity Magnesium Oxide / Porcelain Fish-Spine Beads',
        description: 'Interlocking ceramic spacer beads providing flexibility and electrical insulation.',
        function: 'Isolates the positive and negative thermoelements along the entire probe length.',
        industrialRelevance: 'High-temperature moisture absorption lowers insulation resistance, creating virtual parasitic junctions along the stem.',
        explodeOffset: [-0.65, -0.2, 0],
        anchor: [-0.06, -0.30, 0],
      },
      {
        id: 'tc_dissimilar_wires',
        code: '07',
        name: 'Chromel (+) & Alumel (−) Conductors',
        material: 'KP (90% Ni / 10% Cr) & KN (95% Ni / Mn-Al-Si)',
        description: 'Pair of dissimilar thermocouple alloys generating ~41 µV/°C differential Seebeck EMF.',
        function: 'Creates the distributed temperature-gradient voltage between hot measuring tip and cold junction.',
        industrialRelevance: 'Alumel is mildly magnetic—field technicians use a pocket magnet to identify the negative leg!',
        explodeOffset: [0.65, -0.2, 0],
        anchor: [0.025, 0.15, 0.03],
      },
      {
        id: 'tc_hot_junction',
        code: '08',
        name: 'TIG-Welded Measuring Hot Junction',
        material: 'Fused Chromel–Alumel Weld Bead',
        description: 'Precision welded tip joining the two alloys inside the closed sheath.',
        function: 'Forms the sensing measurement junction (can be exposed, grounded, or ungrounded).',
        industrialRelevance: 'Ungrounded junctions isolate the tip from plant ground loops; grounded junctions give fastest thermal response.',
        explodeOffset: [0, -0.55, 0.4],
        anchor: [0, -1.43, 0.04],
      },
    ],
  },

  'dp-transmitter': {
    id: 'dp-transmitter',
    title: 'Smart Differential Pressure Transmitter + Manifold',
    subtitle: 'Capacitive / Piezoresistive Industrial Transmitter with 3-Valve Manifold',
    glbUrl: '/models/dp-transmitter.glb',
    standard: 'IEC 61298 · NAMUR NE43 · HART 7',
    disclosure:
      'Illustrative Engineering CAD Model · Representative smart coplanar/traditional DP transmitter architecture for educational inspection.',
    defaultCameraPos: [2.7, 1.0, 2.9],
    target: [0, 0.18, 0],
    topicRoute: '/instrumentation/pressure/pressure-transmitters',
    parts: [
      {
        id: 'dpt_housing',
        code: '01',
        name: 'Dual-Compartment Ex d Housing',
        material: 'Epoxy-Coated Cast Aluminum (Explosion-Proof NEMA 4X)',
        description: 'Sealed dual-chamber enclosure separating field wiring terminals from microprocessor electronics.',
        function: 'Provides flameproof containment and EMI shielding for low-noise analog-to-digital conversion.',
        industrialRelevance: 'Dual compartments prevent corrosive field moisture entering through conduit from damaging the main ADC/HART board.',
        explodeOffset: [0, 0.95, 0],
        anchor: [0, 1.05, 0.25],
      },
      {
        id: 'dpt_lcd_module',
        code: '02',
        name: 'Digital LCD Indicator & Glass Window',
        material: 'Tempered Safety Glass + Backlit Dot-Matrix LCD',
        description: 'Local field display showing engineering units (kPa, mmH₂O), % span bargraph, and loop current.',
        function: 'Enables local calibration verification and diagnostic fault codes without opening the Ex d cover.',
        industrialRelevance: 'Supports instant verification of transmitter zero/span during plant walkdowns.',
        explodeOffset: [0.95, 0.95, 0],
        anchor: [0.56, 0.85, 0],
      },
      {
        id: 'dpt_conduit_entry',
        code: '03',
        name: 'Conduit Ports & M20 Gland',
        material: 'Nickel-Plated Brass Gland + 316L Hex Blind Plug',
        description: 'Threaded dual conduit entries on top/sides of the terminal housing for 4–20 mA twisted-pair loop wiring.',
        function: 'Allows loop power entry while sealing unused port against water ingress.',
        industrialRelevance: 'Always install drip loops before conduit entry so rainwater cannot travel down the cable into the electronics.',
        explodeOffset: [-0.85, 0.95, 0.55],
        anchor: [-0.14, 0.85, 0.60],
      },
      {
        id: 'dpt_sensor_module',
        code: '04',
        name: 'Welded Sensor Capsule Module',
        material: '316L Stainless Housing with Silicone Oil Fill & Sensing Cell',
        description: 'Hermetically welded transducer housing containing the differential capacitance or resonant silicon bridge.',
        function: 'Converts hydraulic differential pressure across the silicone oil into an electrical capacitance/frequency shift.',
        industrialRelevance: 'Overpressure stops protect the internal sensing diaphragm up to full static line pressure (e.g. 160 bar).',
        explodeOffset: [0, 0.25, 0],
        anchor: [0, 0.08, 0.24],
      },
      {
        id: 'dpt_isolating_diaphragms',
        code: '05',
        name: 'Corrugated Isolating Diaphragms (H & L)',
        material: 'Ultra-thin AISI 316L or Hastelloy C-276 Wave-Stamped Foil',
        description: 'Concentric wavy flexible metal membranes wetted directly by process fluid on High and Low sides.',
        function: 'Isolates internal silicone oil and electronics from corrosive process media while transmitting pressure cleanly.',
        industrialRelevance: 'Never poke or scrape a DP diaphragm with metal tools—any dent permanently ruins zero stability and linearity.',
        explodeOffset: [0, 0.0, 0.75],
        anchor: [0.30, 0.0, 0.15],
      },
      {
        id: 'dpt_process_flanges',
        code: '06',
        name: 'Forged Process Flanges & Bolts',
        material: 'Forged 316L Stainless Flanges + High-Tensile Alloy Bolts + Vent Plugs',
        description: 'Bolted pressure-containing chambers clamping the sensor capsule with upper bleed/vent needle valves.',
        function: 'Provides 1/4" NPT process ports and allows venting trapped air (liquid) or draining condensate (gas).',
        industrialRelevance: 'Vent plugs sit at top for liquid service (bleed gas bubbles) and bottom for gas service (drain moisture).',
        explodeOffset: [0.95, -0.15, 0],
        anchor: [0.46, 0.0, 0.22],
      },
      {
        id: 'dpt_manifold',
        code: '07',
        name: '3-Valve Isolation & Equalize Manifold',
        material: 'Bar-Stock 316L SS Block + H-Isolate, Equalize, L-Isolate Valves',
        description: 'Integrated valve block featuring High isolation, central Equalizing, and Low isolation needle valves.',
        function: 'Safely puts the transmitter in/out of service and applies equal static pressure to both sides for zero trim.',
        industrialRelevance: 'Correct commissioning sequence: Open Equalize → Open High slightly → Bleed → Close Equalize → Open Low.',
        explodeOffset: [0, -0.85, 0],
        anchor: [0, -0.58, 0.36],
      },
    ],
  },

  'orifice-plate': {
    id: 'orifice-plate',
    title: 'Concentric Square-Edged Orifice Metering Run',
    subtitle: 'ISO 5167 Primary Differential Pressure Flow Element with Flanges & Impulse Taps',
    glbUrl: '/models/orifice-plate-assembly.glb',
    standard: 'ISO 5167-2 · ASME MFC-3M · ASME B16.36',
    disclosure:
      'Illustrative Engineering CAD Model · Representative concentric orifice plate assembly with flange/vena-contracta taps.',
    defaultCameraPos: [2.3, 1.35, 3.0],
    target: [0, 0.15, 0],
    topicRoute: '/instrumentation/flow/orifice-plate',
    parts: [
      {
        id: 'orf_upstream_pipe',
        code: '01',
        name: 'Upstream Metering Pipe Spool',
        material: 'Schedule 40 Carbon Steel (ASTM A106 Gr. B)',
        description: 'Straight unobstructed approach run (typically 10D–40D depending on upstream fittings).',
        function: 'Develops a symmetrical, swirl-free turbulent velocity profile prior to the orifice restriction.',
        industrialRelevance: 'Insufficient upstream straight run skews velocity profile and induces +1% to +5% metering error.',
        explodeOffset: [-0.95, 0, 0],
        anchor: [-0.85, 0.28, 0],
      },
      {
        id: 'orf_downstream_pipe',
        code: '02',
        name: 'Downstream Recovery Pipe Spool',
        material: 'Schedule 40 Carbon Steel (ASTM A106 Gr. B)',
        description: 'Straight exit pipe spool (typically 4D–6D) allowing turbulent pressure recovery.',
        function: 'Contains the expanding vena contracta jet and pressure recovery zone.',
        industrialRelevance: 'Roughly 40%–85% of the differential pressure is permanently lost as viscous eddy dissipation.',
        explodeOffset: [0.95, 0, 0],
        anchor: [0.85, 0.28, 0],
      },
      {
        id: 'orf_flanges',
        code: '03',
        name: 'ASME B16.36 Orifice Flanges & Bolts',
        material: 'Forged Carbon / Stainless Steel Flanges + 8 Stud Bolts',
        description: 'Heavy raised-face weld-neck flanges featuring jack-screw spreaders and tapped impulse ports.',
        function: 'Clamps the orifice plate concentrically between pipe spools under full line pressure.',
        industrialRelevance: 'Jack screws allow spreading the flanges slightly so technicians can pull out the plate without cutting pipe.',
        explodeOffset: [0, 0, 0.65],
        anchor: [0.15, -0.45, 0.45],
      },
      {
        id: 'orf_plate',
        code: '04',
        name: 'Concentric Orifice Plate & Paddle Tab',
        material: 'Precision Ground AISI 316L Stainless Steel (45° Downstream Bevel)',
        description: 'Thin machined plate with sharp 90° upstream bore edge, 45° downstream bevel, and stamped handle tab.',
        function: 'Constricts flow cross-section (β = d/D) to convert static pressure into kinetic energy ΔP ∝ Q².',
        industrialRelevance: 'Installed backward (bevel facing upstream) ruins discharge coefficient Cd and causes 15–25% under-reading!',
        explodeOffset: [0, 0.85, 0],
        anchor: [0, 0.72, 0],
      },
      {
        id: 'orf_gaskets',
        code: '05',
        name: 'Spiral-Wound Pipe Gaskets',
        material: '316L Winding + Flexible Graphite Filler',
        description: 'Pair of precision-centered compressible sealing gaskets on upstream and downstream plate faces.',
        function: 'Prevents process fluid leaks past the flange faces while preserving exact tap spacing.',
        industrialRelevance: 'Oversized gaskets protruding into the pipe ID disrupt boundary layer separation near flange taps.',
        explodeOffset: [0, -0.55, 0],
        anchor: [-0.04, -0.35, 0.15],
      },
      {
        id: 'orf_impulse_taps',
        code: '06',
        name: 'High (P₁) & Low (P₂) Impulse Taps & Valves',
        material: '316L Nipples + Forged Root Isolation Valves',
        description: 'Pressure sensing ports (1" flange taps or D and D/2) fitted with primary root isolation valves.',
        function: 'Transmits static upstream pressure P₁ and vena-contracta pressure P₂ to the DP transmitter manifold.',
        industrialRelevance: 'Tap orientation follows fluid phase: horizontal side for liquids, top 12 o’clock for clean gas, side with condensate pots for steam.',
        explodeOffset: [0, 1.05, -0.45],
        anchor: [-0.17, 0.88, 0.08],
      },
      {
        id: 'orf_flow_stream',
        code: '07',
        name: 'Vena Contracta Flow Envelope',
        material: 'Translucent Educational Visualization Envelope',
        description: 'Visual envelope illustrating streamline convergence to the minimum cross-section (~0.5D downstream).',
        function: 'Demonstrates where fluid velocity peaks and static pressure drops to its minimum (P₂).',
        industrialRelevance: 'Because ΔP = P₁ − P₂ scales with Q², flow transmitters extract the square root to linearize 4–20 mA output.',
        explodeOffset: [0, 0, -0.75],
        anchor: [0.18, 0.0, 0.14],
      },
    ],
  },
};

