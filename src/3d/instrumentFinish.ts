import type { InstrumentFamilyKey } from '@/types/cad';
import type { MatKey } from '@/components/cad3d/materials';

/**
 * Semantic hardware part roles across both GLB assemblies and procedural CAD families.
 */
export type PartRole =
  | 'primaryBody'
  | 'secondaryBody'
  | 'fitting'
  | 'structural'
  | 'wettedMetal'
  | 'chrome'
  | 'ceramic'
  | 'wire'
  | 'copper'
  | 'sensing'
  | 'glass'
  | 'quartz'
  | 'liquid'
  | 'silicon'
  | 'rubber';

export interface FinishMaterialSpec {
  color: string;
  metalness: number;
  roughness: number;
  transparent?: boolean;
  opacity?: number;
  depthWrite?: boolean;
}

export interface InstrumentFinishProfile {
  id: string;
  label: string;
  roles: Record<PartRole, FinishMaterialSpec>;
  /** Exact GLB partId -> PartRole lookup */
  glbPartRoleMap?: Record<string, PartRole>;
  /** Optional GLB material name -> explicit role override when sub-meshes share one partId */
  glbMaterialRoleMap?: Record<string, PartRole>;
  /** Preserves LCD bitmap textures */
  preserveLcdMaterials?: string[];
}

/** Map legacy MAT_PRESETS keys cleanly onto semantic PartRoles */
export const PRESET_TO_ROLE: Record<MatKey, PartRole> = {
  // Pipes, housings, bodies, sheaths, heads, covers -> steel blue (#4F7FA6)
  blueHousing: 'primaryBody',
  ssDark: 'secondaryBody',
  yellowSafety: 'fitting',
  // Flanges, bolts, nuts, fittings, valve trim -> brass/copper-red (#B5714A)
  brass: 'fitting',
  bronze: 'fitting',
  // Bases, brackets, structural supports -> dark blue (#2E4F6B), no black
  castIron: 'structural',
  anodizedDark: 'structural',
  phenolic: 'structural',
  peek: 'fitting',
  rubber: 'rubber',
  siliconWafer: 'silicon',
  // Wetted / inner stainless parts -> stainless grey (#9AA8B4)
  ss316: 'wettedMetal',
  mercury: 'wettedMetal',
  chrome: 'chrome',
  // Ceramics / dials -> off-white (#E8ECEF)
  alumina: 'ceramic',
  steatite: 'ceramic',
  ptfe: 'ceramic',
  // Wires / cables / coils -> copper (#B8703F)
  copper: 'copper',
  gold: 'fitting',
  kapton: 'copper',
  // Sensing elements / active parts -> rust accent (#C84B31)
  alnicoRed: 'sensing',
  // Glass & transparent fluids -> pale blue
  glass: 'glass',
  quartz: 'quartz',
  blueLiquid: 'liquid',
};

function makeBaseRoles(
  overrides: Partial<Record<PartRole, FinishMaterialSpec>>,
): Record<PartRole, FinishMaterialSpec> {
  const defaults: Record<PartRole, FinishMaterialSpec> = {
    // Pipes, housings, bodies, sheaths, heads, covers -> #4F7FA6
    primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
    // Secondary bodies/structural frames -> dark steel blue #2E4F6B (no black)
    secondaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
    // Flanges, bolts, nuts, couplings, hex fittings, cable glands, terminal blocks, valve trim -> #B5714A
    fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
    // Structural brackets/supports -> #2E4F6B dark blue (no black)
    structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
    // Wetted / inner parts (orifice plate, thermowell, float, impeller) -> #9AA8B4 stainless grey
    wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
    chrome: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
    // Off-white ceramics / insulators / dials -> #E8ECEF
    ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.78 },
    // Wires and cables -> copper #B8703F or dark blue #2E4F6B
    wire: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
    copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
    // Sensing / active moving parts -> rust accent #C84B31
    sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    // Pale blue transparent glass
    glass: { color: '#C6DCEF', metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.28, depthWrite: false },
    quartz: { color: '#C6DCEF', metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.26, depthWrite: false },
    liquid: { color: '#4F7FA6', metalness: 0.06, roughness: 0.2, transparent: true, opacity: 0.62, depthWrite: false },
    silicon: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
    // Cables / elastomers -> #2E4F6B dark blue (not black)
    rubber: { color: '#2E4F6B', metalness: 0.04, roughness: 0.72 },
  };
  return { ...defaults, ...overrides };
}

/**
 * Per-instrument hardware finish profiles enforcing:
 * - Steel blue (#4F7FA6) bodies, pipes, heads, sheaths
 * - Brass/copper-red (#B5714A) flanges, bolts, fittings, glands, terminal blocks, trim
 * - Stainless grey (#9AA8B4) wetted/inner orifice plates, thermowells, floats
 * - No black parts (former blacks map to #2E4F6B dark blue or #4F7FA6, except dark PMMC meter case with blue/brass trim)
 */
export const INSTRUMENT_FINISH_PROFILES: Record<string, InstrumentFinishProfile> = {
  /** 1. RTD Pt100: steel blue head & sheath, brass-copper gland/hex fitting/terminal block, stainless thermowell, rust element */
  'rtd-industrial-blue': {
    id: 'rtd-industrial-blue',
    label: 'RTD Steel Blue Head & Brass Fittings',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.78 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      rubber: { color: '#2E4F6B', metalness: 0.04, roughness: 0.72 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
    glbPartRoleMap: {
      terminal_head: 'primaryBody',
      cable_gland: 'fitting',
      terminal_block: 'fitting',
      process_connection: 'fitting',
      protective_sheath: 'primaryBody',
      thermowell: 'wettedMetal',
      ceramic_insulator: 'ceramic',
      internal_leads: 'copper',
      sensing_element: 'sensing',
    },
    glbMaterialRoleMap: {
      DieCast_Aluminum_Coated: 'primaryBody',
      Industrial_Polymer_PA6: 'fitting',
      PVC_Cable_Jacket: 'rubber',
      Nickel_Plated_Brass: 'fitting',
      Forged_Stainless_Steel: 'wettedMetal',
      AISI_316L_Stainless: 'wettedMetal',
      Alumina_Ceramic_99_7: 'ceramic',
      Machined_Brass: 'fitting',
      PTFE_Lead_White: 'ceramic',
      PTFE_Lead_Red: 'sensing',
      High_Purity_Platinum: 'sensing',
      Borosilicate_Glass: 'glass',
    },
  },

  /** 2. Thermocouple Type K: dark blue head, steel blue sheath, brass compression/gland/block, copper wires, rust hot junction */
  'thermocouple-dark-inconel': {
    id: 'thermocouple-dark-inconel',
    label: 'Thermocouple Dark Blue Head & Brass Compression Fitting',
    roles: makeBaseRoles({
      primaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.78 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      rubber: { color: '#2E4F6B', metalness: 0.04, roughness: 0.72 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
    glbPartRoleMap: {
      tc_terminal_head: 'primaryBody',
      tc_cable_entry: 'fitting',
      tc_terminal_block: 'fitting',
      tc_compression_fitting: 'fitting',
      tc_inconel_sheath: 'secondaryBody',
      tc_mgo_beads: 'ceramic',
      tc_dissimilar_wires: 'copper',
      tc_hot_junction: 'sensing',
    },
    glbMaterialRoleMap: {
      DieCast_Aluminum_Coated: 'primaryBody',
      IEC_TypeK_Yellow: 'primaryBody',
      Forged_Stainless_Steel: 'fitting',
      AISI_316L_Stainless: 'fitting',
      Inconel_600: 'secondaryBody',
      Alumina_Ceramic_99_7: 'ceramic',
      Machined_Brass: 'fitting',
      Chromel_Alloy_KP: 'copper',
      Alumel_Alloy_KN: 'copper',
      High_Purity_Platinum: 'sensing',
    },
  },

  /** 3. Orifice Plate Flow Meter: steel blue pipe spools, brass-copper ASME flanges/taps, stainless inner orifice plate, dark blue gasket */
  'orifice-bare-stainless': {
    id: 'orifice-bare-stainless',
    label: 'Steel Blue Meter Run & Brass-Copper Flanges',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.55 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      sensing: { color: '#C84B31', metalness: 0.25, roughness: 0.48 },
      glass: { color: '#C6DCEF', metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.25, depthWrite: false },
    }),
    glbPartRoleMap: {
      orf_upstream_pipe: 'primaryBody',
      orf_downstream_pipe: 'primaryBody',
      orf_flanges: 'fitting',
      orf_gaskets: 'structural',
      orf_impulse_taps: 'fitting',
      orf_plate: 'wettedMetal',
      orf_flow_stream: 'glass',
    },
    glbMaterialRoleMap: {
      Carbon_Steel_Pipe: 'primaryBody',
      Forged_Stainless_Steel: 'fitting',
      Spiral_Wound_Graphite_Gasket: 'structural',
      AISI_316L_Stainless: 'wettedMetal',
      Machined_Brass: 'fitting',
      PTFE_Lead_Red: 'sensing',
      Borosilicate_Glass: 'glass',
    },
  },

  /** 4. DP Transmitter: steel blue housing, brass flanges/manifold, stainless wetted diaphragms */
  'dp-transmitter-epoxy': {
    id: 'dp-transmitter-epoxy',
    label: 'Steel Blue Transmitter & Brass Process Flanges',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.78 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
    glbPartRoleMap: {
      dpt_housing: 'primaryBody',
      dpt_lcd_module: 'ceramic',
      dpt_conduit_entry: 'fitting',
      dpt_sensor_module: 'wettedMetal',
      dpt_process_flanges: 'fitting',
      dpt_manifold: 'fitting',
      dpt_isolating_diaphragms: 'sensing',
    },
    glbMaterialRoleMap: {
      Industrial_Epoxy_SlateBlue: 'primaryBody',
      DieCast_Aluminum_Coated: 'primaryBody',
      Nickel_Plated_Brass: 'fitting',
      Forged_Stainless_Steel: 'fitting',
      AISI_316L_Stainless: 'wettedMetal',
      Borosilicate_Glass: 'glass',
    },
    preserveLcdMaterials: ['Backlit_LCD_Face'],
  },

  /** 5. PMMC Meter: true dark meter case (#2A323D) with blue & brass trim, off-white dial (#E8ECEF), copper coil */
  'pmmc-black-case': {
    id: 'pmmc-black-case',
    label: 'Dark Case with Blue/Brass Trim & White Dial',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2A323D', metalness: 0.16, roughness: 0.58 }, // Molded dark slate Bakelite meter case
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.76 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      sensing: { color: '#C84B31', metalness: 0.24, roughness: 0.5 },
    }),
  },

  /** 6. Control Valve: steel blue body, dark blue actuator & yoke, brass-copper flanges/bolts & valve trim */
  'control-valve-grey-dark': {
    id: 'control-valve-grey-dark',
    label: 'Steel Blue Globe Valve & Brass Flanges/Trim',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      chrome: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
  },

  /** 7. Rotameter: steel blue end blocks, pale blue glass tube, brass valve/fittings, stainless float */
  'rotameter-glass-metal': {
    id: 'rotameter-glass-metal',
    label: 'Steel Blue End Blocks, Pale Blue Glass & Brass Valve',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      chrome: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      glass: { color: '#C6DCEF', metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.28, depthWrite: false },
      rubber: { color: '#2E4F6B', metalness: 0.04, roughness: 0.72 },
      sensing: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
    }),
  },

  /** 8. LVDT: steel blue cylindrical housing, brass-copper windings/fittings, stainless inner core, rust core accent */
  'lvdt-steel-core': {
    id: 'lvdt-steel-core',
    label: 'Steel Blue Housing, Brass Coils & Stainless Core',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      chrome: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.78 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
  },

  /** 9. Optical & Analytical: steel blue / dark blue optical bench, brass mounts, pale blue quartz */
  'optical-lab-beige': {
    id: 'optical-lab-beige',
    label: 'Steel Blue Optical Bench & Brass Mounts',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      chrome: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      quartz: { color: '#C6DCEF', metalness: 0.05, roughness: 0.12, transparent: true, opacity: 0.26, depthWrite: false },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
  },

  /** 10. General Industrial Field Default (Steel Blue + Brass Fittings + Stainless Internals) */
  'industrial-field-default': {
    id: 'industrial-field-default',
    label: 'Steel Blue Body & Brass-Copper Fittings',
    roles: makeBaseRoles({}),
  },

  /** 11. Pressure & Force Instruments: steel blue housings, brass hex sockets & sectors, off-white dials */
  'pressure-gauge-steel': {
    id: 'pressure-gauge-steel',
    label: 'Steel Blue Gauge Case & Brass Socket',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      wettedMetal: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      ceramic: { color: '#E8ECEF', metalness: 0, roughness: 0.78 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
  },

  /** 12. Embedded PCBs & Signal Conditioning Boards: dark blue solder-mask (#2E4F6B), brass pins/headers */
  'embedded-pcb-slate': {
    id: 'embedded-pcb-slate',
    label: 'Steel Blue IC Lid, Dark Blue PCB & Brass Headers',
    roles: makeBaseRoles({
      primaryBody: { color: '#4F7FA6', metalness: 0.2, roughness: 0.5 },
      secondaryBody: { color: '#2E4F6B', metalness: 0.2, roughness: 0.5 },
      fitting: { color: '#B5714A', metalness: 0.9, roughness: 0.4 },
      structural: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      silicon: { color: '#2E4F6B', metalness: 0.2, roughness: 0.52 },
      chrome: { color: '#9AA8B4', metalness: 0.85, roughness: 0.35 },
      copper: { color: '#B8703F', metalness: 1.0, roughness: 0.4 },
      sensing: { color: '#C84B31', metalness: 0.22, roughness: 0.5 },
    }),
  },
};

const INSTRUMENT_ID_TO_PROFILE: Record<string, string> = {
  'rtd-pt100': 'rtd-industrial-blue',
  'thermocouple-k': 'thermocouple-dark-inconel',
  'orifice-plate': 'orifice-bare-stainless',
  'dp-transmitter': 'dp-transmitter-epoxy',
  'pmmc-instrument': 'pmmc-black-case',
  'moving-iron': 'pmmc-black-case',
  'electrodynamometer-wattmeter': 'pmmc-black-case',
  'power-factor-meter': 'pmmc-black-case',
  megger: 'pmmc-black-case',
  'wheatstone-bridge': 'pmmc-black-case',
  'kelvin-double-bridge': 'pmmc-black-case',
  'control-valves': 'control-valve-grey-dark',
  rotameter: 'rotameter-glass-metal',
  lvdt: 'lvdt-steel-core',
  'uv-vis-spectrophotometer': 'optical-lab-beige',
  colorimeter: 'optical-lab-beige',
  'ftir-spectrometer': 'optical-lab-beige',
  monochromator: 'optical-lab-beige',
  'polarimeter-refractometer': 'optical-lab-beige',
  'bourdon-tube': 'pressure-gauge-steel',
  'diaphragm-pressure': 'pressure-gauge-steel',
  bellows: 'pressure-gauge-steel',
  'dead-weight-tester': 'pressure-gauge-steel',
};

const PROCEDURAL_KEY_TO_PROFILE: Record<string, string> = {
  pmmc: 'pmmc-black-case',
  'moving-iron': 'pmmc-black-case',
  wattmeter: 'pmmc-black-case',
  'phase-meter': 'pmmc-black-case',
  megger: 'pmmc-black-case',
  'control-valve': 'control-valve-grey-dark',
  rotameter: 'rotameter-glass-metal',
  lvdt: 'lvdt-steel-core',
  'uv-vis': 'optical-lab-beige',
  colorimeter: 'optical-lab-beige',
  ftir: 'optical-lab-beige',
  monochromator: 'optical-lab-beige',
  bourdon: 'pressure-gauge-steel',
};

const FAMILY_DEFAULT_PROFILE: Partial<Record<InstrumentFamilyKey, string>> = {
  temperature: 'industrial-field-default',
  flow: 'industrial-field-default',
  'pressure-force': 'pressure-gauge-steel',
  'level-props': 'industrial-field-default',
  motion: 'lvdt-steel-core',
  'electrical-bridge': 'pmmc-black-case',
  'analytical-optical': 'optical-lab-beige',
  'control-actuator': 'control-valve-grey-dark',
  'signal-transducer': 'embedded-pcb-slate',
  'embedded-digital': 'embedded-pcb-slate',
};

export function getFinishProfile(
  instrumentId?: string,
  family?: InstrumentFamilyKey,
  proceduralKey?: string,
): InstrumentFinishProfile {
  const key =
    (instrumentId && INSTRUMENT_ID_TO_PROFILE[instrumentId]) ||
    (proceduralKey && PROCEDURAL_KEY_TO_PROFILE[proceduralKey]) ||
    (family && FAMILY_DEFAULT_PROFILE[family]) ||
    'industrial-field-default';

  return INSTRUMENT_FINISH_PROFILES[key] ?? INSTRUMENT_FINISH_PROFILES['industrial-field-default'];
}

/**
 * Resolves the exact per-part material finish inside a loaded GLB assembly.
 * Keeps sensing parts pinned to 'sensing' (or wetted role when configured)
 * and uses part role + material-type distinction per sub-mesh.
 */
export function resolveGlbPartMaterial(
  profile: InstrumentFinishProfile,
  materialName: string,
  partId: string | null,
): { spec: FinishMaterialSpec; preserveLcd: boolean } {
  if (profile.preserveLcdMaterials?.includes(materialName)) {
    return { spec: profile.roles.ceramic, preserveLcd: true };
  }

  const partRole = partId ? profile.glbPartRoleMap?.[partId] : undefined;
  const matRole = profile.glbMaterialRoleMap?.[materialName];

  // Prioritize explicit orifice plate / sensing element part roles cleanly,
  // while letting sub-mesh material differences (brass terminals vs ceramic, red vs white leads) show.
  let resolvedRole: PartRole;
  if (partId === 'orf_plate' || partId === 'thermowell' || partId === 'protective_sheath') {
    resolvedRole = partRole ?? 'wettedMetal';
  } else if (partRole === 'sensing') {
    resolvedRole = 'sensing';
  } else if (partId === 'cable_gland' || partId === 'process_connection' || partId === 'orf_flanges' || partId === 'tc_compression_fitting' || partId === 'tc_cable_entry') {
    resolvedRole = partRole ?? 'fitting';
  } else {
    resolvedRole = matRole ?? partRole ?? 'primaryBody';
  }

  return {
    spec: profile.roles[resolvedRole] ?? profile.roles.primaryBody,
    preserveLcd: false,
  };
}
