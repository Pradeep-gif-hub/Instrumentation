import * as THREE from 'three';

export const CAD_CLIP_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.005);

export interface MaterialPreset {
  color: string;
  metalness: number;
  roughness: number;
  transparent?: boolean;
  opacity?: number;
  depthWrite?: boolean;
}

export const MAT_PRESETS = {
  ss316: { color: '#c4ccd4', metalness: 0.86, roughness: 0.25 },
  ssDark: { color: '#78828e', metalness: 0.82, roughness: 0.34 },
  chrome: { color: '#eef2f6', metalness: 0.94, roughness: 0.11 },
  brass: { color: '#cfa548', metalness: 0.85, roughness: 0.28 },
  bronze: { color: '#9c6b3a', metalness: 0.8, roughness: 0.34 },
  copper: { color: '#c96b3e', metalness: 0.85, roughness: 0.28 },
  gold: { color: '#ebb844', metalness: 0.94, roughness: 0.16 },
  castIron: { color: '#3b424c', metalness: 0.56, roughness: 0.48 },
  anodizedDark: { color: '#21262d', metalness: 0.42, roughness: 0.54 },
  blueHousing: { color: '#1e4e79', metalness: 0.38, roughness: 0.42 },
  yellowSafety: { color: '#d49a17', metalness: 0.18, roughness: 0.45 },
  alnicoRed: { color: '#a3322c', metalness: 0.58, roughness: 0.35 },
  alumina: { color: '#f3eee4', metalness: 0.02, roughness: 0.4 },
  steatite: { color: '#e6dcc6', metalness: 0.03, roughness: 0.48 },
  ptfe: { color: '#f1f5f9', metalness: 0.02, roughness: 0.36 },
  peek: { color: '#a88459', metalness: 0.04, roughness: 0.46 },
  kapton: { color: '#d97706', metalness: 0.12, roughness: 0.32, transparent: true, opacity: 0.88 },
  rubber: { color: '#1b1d22', metalness: 0.02, roughness: 0.82 },
  phenolic: { color: '#422014', metalness: 0.05, roughness: 0.55 },
  siliconWafer: { color: '#39465e', metalness: 0.65, roughness: 0.18 },
  glass: { color: '#d8e8f8', metalness: 0.05, roughness: 0.08, transparent: true, opacity: 0.32, depthWrite: false },
  quartz: { color: '#e6f4ff', metalness: 0.05, roughness: 0.06, transparent: true, opacity: 0.26, depthWrite: false },
  blueLiquid: { color: '#2b8cbe', metalness: 0.08, roughness: 0.15, transparent: true, opacity: 0.68, depthWrite: false },
  mercury: { color: '#d1d5db', metalness: 0.96, roughness: 0.08 },
} as const satisfies Record<string, MaterialPreset>;

export type MatKey = keyof typeof MAT_PRESETS;

/**
 * Generates an engineering circular dial gauge face Texture (Bourdon, Bimetallic, PMMC, Wattmeter, etc.)
 */
export function buildDialFaceTexture(opts: {
  title: string;
  unit: string;
  min: number;
  max: number;
  majorTicks?: number;
  sweepDeg?: number;
  startDeg?: number;
  nonlinearCRAMP?: boolean;
  subtitle?: string;
}): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.49, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.47, 0, Math.PI * 2);
  ctx.stroke();

  const sweep = ((opts.sweepDeg ?? 270) * Math.PI) / 180;
  const start = ((opts.startDeg ?? 135) * Math.PI) / 180;
  const ticks = opts.majorTicks ?? 6;

  ctx.strokeStyle = '#1e293b';
  ctx.fillStyle = '#0f172a';
  ctx.lineCap = 'round';

  for (let i = 0; i <= ticks * 5; i++) {
    const tLin = i / (ticks * 5);
    const tMapped = opts.nonlinearCRAMP ? Math.pow(tLin, 1.45) : tLin;
    const ang = start + tMapped * sweep;
    const isMajor = i % 5 === 0;
    const rOut = r * 0.88;
    const rIn = isMajor ? r * 0.72 : r * 0.8;
    ctx.lineWidth = isMajor ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn);
    ctx.lineTo(cx + Math.cos(ang) * rOut, cy + Math.sin(ang) * rOut);
    ctx.stroke();

    if (isMajor) {
      const val = opts.min + (opts.max - opts.min) * (i / (ticks * 5));
      const label = Number.isInteger(val) ? String(val) : val.toFixed(1);
      const tx = cx + Math.cos(ang) * (r * 0.56);
      const ty = cy + Math.sin(ang) * (r * 0.56);
      ctx.font = 'bold 26px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, tx, ty);
    }
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 28px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(opts.unit, cx, cy + r * 0.34);

  ctx.fillStyle = '#475569';
  ctx.font = '600 18px system-ui, sans-serif';
  ctx.fillText(opts.title, cx, cy - r * 0.22);
  if (opts.subtitle) {
    ctx.fillStyle = '#0284c7';
    ctx.font = '600 15px ui-monospace, monospace';
    ctx.fillText(opts.subtitle, cx, cy + r * 0.52);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates an illuminated LCD / OLED numeric display CanvasTexture (DMM, pH meter, Transmitter)
 */
export function buildLcdDisplayTexture(
  primaryText: string,
  secondaryText: string,
  bgHex = '#0f1d28',
  fgHex = '#67e8f9',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 240);

  ctx.fillStyle = fgHex;
  ctx.font = 'bold 84px ui-monospace, SFMono-Regular, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(primaryText, 256, 110);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 32px ui-monospace, monospace';
  ctx.fillText(secondaryText, 256, 194);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Draws a CRT phosphor graticule + live Lissajous or sine trace
 */
export function buildCroScreenTexture(freqRatio = 1, phaseDeg = 90): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#051a10';
  ctx.fillRect(0, 0, 512, 384);

  ctx.strokeStyle = 'rgba(74, 222, 128, 0.22)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 512; x += 51.2) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 384);
    ctx.stroke();
  }
  for (let y = 0; y <= 384; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 192);
  ctx.lineTo(512, 192);
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 384);
  ctx.stroke();

  const phi = (phaseDeg * Math.PI) / 180;
  ctx.strokeStyle = '#86efac';
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 4;
  ctx.beginPath();
  const steps = 360;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 256 + 175 * Math.sin(t);
    const y = 192 - 135 * Math.sin(freqRatio * t + phi);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates an etched vertical glass scale strip (Rotameter / Manometer / Level)
 */
export function buildVerticalScaleTexture(
  label: string,
  min: number,
  max: number,
  ticks = 5,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 160, 512);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 0, 160, 512);

  ctx.strokeStyle = '#94a3b8';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px ui-monospace, monospace';
  ctx.textAlign = 'left';

  for (let i = 0; i <= ticks * 2; i++) {
    const frac = i / (ticks * 2);
    const y = 468 - frac * 424;
    const isMajor = i % 2 === 0;
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(10, y);
    ctx.lineTo(isMajor ? 46 : 28, y);
    ctx.stroke();
    if (isMajor) {
      const val = min + (max - min) * frac;
      ctx.fillText(String(Math.round(val)), 54, y + 8);
    }
  }
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px ui-monospace, monospace';
  ctx.fillText(label, 14, 28);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function wavelengthToHex(nm: number): string {
  if (nm < 380) return '#a855f7';
  if (nm < 440) return '#6366f1';
  if (nm < 490) return '#06b6d4';
  if (nm < 510) return '#10b981';
  if (nm < 580) return '#84cc16';
  if (nm < 645) return '#f59e0b';
  return '#ef4444';
}

