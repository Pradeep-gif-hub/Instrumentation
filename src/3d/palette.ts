/**
 * Shared 3D CAD colour palette — single source of truth for all GLB assemblies,
 * procedural family models, material presets, and 3D viewer overlays.
 *
 * Keep real-world material physics (stainless steel, matte ceramics,
 * painted cast housings, dull copper); only colours and material parameters
 * derive from this file.
 */
export const PALETTE_3D = {
  /** Housings, heads, sheaths, bodies */
  primaryBody: '#3C6E96',
  /** Fittings, covers, flanges, secondary housings */
  secondaryBody: '#4F7FA6',
  /** Bases, brackets, structural supports */
  darkStructural: '#22435E',
  /** Process fittings, threads, wetted stainless steel (brushed, not chrome) */
  wettedMetal: '#8FA3B3',
  /** Ceramics, insulators, plastics (matte grey-blue) */
  insulatorCeramic: '#B9C7D2',
  /** Wires, conductors, copper coils */
  copperWire: '#B8703F',
  /** Sensing elements, measuring tips, active moving parts (kept small) */
  sensingAccent: '#C84B31',
  /** Selected part highlight on click (softer coral, non-emissive) */
  selectedHighlight: '#E06A4F',
} as const;

export const VIEWER_3D_THEME = {
  /** Soft cool key light (~19% reduced intensity so deep blue stays rich) */
  keyLight: '#EAF3FF',
  /** Low opposite warm fill light */
  warmFillLight: '#FFD7BE',
  /** Reduced ambient & hemisphere fill */
  hemisphereSky: '#E6EFF8',
  hemisphereGround: '#182430',
  /** Environment lightformers (~20% reduced) */
  envTop: '#F5F8FC',
  envLeft: '#D4E4F4',
  envRight: '#E8F0F8',
  envBottom: PALETTE_3D.secondaryBody,
  /** Callout pins inside dark 3D viewport */
  calloutBgDark: 'rgba(60, 110, 150, 0.22)',
  calloutBgLight: 'rgba(79, 127, 166, 0.24)',
  calloutBorder: PALETTE_3D.secondaryBody,
  calloutBorderLight: PALETTE_3D.darkStructural,
  calloutSelectedBorder: PALETTE_3D.selectedHighlight,
  calloutTextDark: '#FFFFFF',
  calloutTextLight: '#0F172A',
  /** Active viewer control buttons & sliders */
  controlActiveBg: PALETTE_3D.primaryBody,
  controlActiveText: '#FFFFFF',
  controlWarnBg: PALETTE_3D.sensingAccent,
} as const;

export interface GlbMaterialOverride {
  color: string;
  metalness?: number;
  roughness?: number;
  preserveTransparency?: boolean;
  isLcd?: boolean;
}

/**
 * Runtime material-name map for GLB assemblies in public/models/*.glb.
 * Tuned for realistic industrial hardware:
 * - Painted / moulded housings: metalness 0.1–0.2, roughness 0.5–0.65
 * - Stainless steel: metalness 0.8–0.9, roughness 0.35–0.5
 * - Ceramics / insulators: metalness 0, roughness 0.7–0.85
 * - Copper conductors: metalness 1.0, roughness 0.4
 */
export const GLB_MATERIAL_PALETTE_MAP: Record<string, GlbMaterialOverride> = {
  // Painted / moulded housings -> #3C6E96
  DieCast_Aluminum_Coated: { color: PALETTE_3D.primaryBody, metalness: 0.18, roughness: 0.56 },
  Industrial_Epoxy_SlateBlue: { color: PALETTE_3D.primaryBody, metalness: 0.15, roughness: 0.58 },
  IEC_TypeK_Yellow: { color: PALETTE_3D.primaryBody, metalness: 0.15, roughness: 0.6 },
  Carbon_Steel_Pipe: { color: PALETTE_3D.primaryBody, metalness: 0.2, roughness: 0.56 },

  // Secondary LCD face
  Backlit_LCD_Face: { color: PALETTE_3D.insulatorCeramic, isLcd: true },

  // Dark structural bases, glands, jackets & gaskets -> #22435E
  Industrial_Polymer_PA6: { color: PALETTE_3D.darkStructural, metalness: 0, roughness: 0.76 },
  PVC_Cable_Jacket: { color: PALETTE_3D.darkStructural, metalness: 0, roughness: 0.78 },
  Spiral_Wound_Graphite_Gasket: { color: PALETTE_3D.darkStructural, metalness: 0.15, roughness: 0.65 },

  // Brushed stainless & metal process fittings/sheaths -> #8FA3B3
  Forged_Stainless_Steel: { color: PALETTE_3D.wettedMetal, metalness: 0.85, roughness: 0.42 },
  Nickel_Plated_Brass: { color: PALETTE_3D.wettedMetal, metalness: 0.84, roughness: 0.4 },
  AISI_316L_Stainless: { color: PALETTE_3D.wettedMetal, metalness: 0.86, roughness: 0.4 },
  Inconel_600: { color: PALETTE_3D.wettedMetal, metalness: 0.86, roughness: 0.42 },
  Chromel_Alloy_KP: { color: PALETTE_3D.wettedMetal, metalness: 0.88, roughness: 0.38 },
  High_Purity_Platinum: { color: PALETTE_3D.wettedMetal, metalness: 0.88, roughness: 0.36 },

  // Matte ceramics, insulators, plastics & glass -> #B9C7D2
  Alumina_Ceramic_99_7: { color: PALETTE_3D.insulatorCeramic, metalness: 0, roughness: 0.8 },
  PTFE_Lead_White: { color: PALETTE_3D.insulatorCeramic, metalness: 0, roughness: 0.76 },
  Borosilicate_Glass: {
    color: PALETTE_3D.insulatorCeramic,
    metalness: 0.05,
    roughness: 0.12,
    preserveTransparency: true,
  },

  // Dull copper-orange wires & conductors -> #B8703F
  Machined_Brass: { color: PALETTE_3D.copperWire, metalness: 1.0, roughness: 0.4 },
  Alumel_Alloy_KN: { color: PALETTE_3D.copperWire, metalness: 1.0, roughness: 0.4 },

  // Rust-red sensing accent lead / high-tap cap -> #C84B31
  PTFE_Lead_Red: { color: PALETTE_3D.sensingAccent, metalness: 0.1, roughness: 0.6 },
};

/**
 * Specific GLB node/partIds whose active sensing element or restriction plate
 * takes the sparing rust-red accent (#C84B31).
 */
export const GLB_SENSING_PART_IDS = new Set<string>([
  'sensing_element',
  'tc_hot_junction',
  'dpt_isolating_diaphragms',
  'orf_plate',
]);

/**
 * Selection / hover surface highlight constants (no glowing emissive).
 */
export const HIGHLIGHT_EMISSIVE = {
  selectedHex: PALETTE_3D.selectedHighlight,
  selectedColorLerp: 1.0,
  selectedIntensity: 0,
  hoveredHex: PALETTE_3D.selectedHighlight,
  hoveredColorLerp: 0.45,
  hoveredIntensity: 0,
} as const;
