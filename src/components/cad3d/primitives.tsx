import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { MAT_PRESETS, type MatKey } from './materials';

export function PbrMat({ preset, colorOverride }: { preset: MatKey; colorOverride?: string }) {
  const m = MAT_PRESETS[preset];
  return (
    <meshStandardMaterial
      color={colorOverride ?? m.color}
      metalness={m.metalness}
      roughness={m.roughness}
      transparent={'transparent' in m ? m.transparent : false}
      opacity={'opacity' in m ? m.opacity : 1}
      depthWrite={'depthWrite' in m ? m.depthWrite : true}
    />
  );
}

export function FlangeWithBolts({
  outerR = 0.52,
  innerR = 0.24,
  thickness = 0.08,
  boltCount = 8,
  preset = 'ss316',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  outerR?: number;
  innerR?: number;
  thickness?: number;
  boltCount?: number;
  preset?: MatKey;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    if (innerR > 0.01) {
      const hole = new THREE.Path();
      hole.absarc(0, 0, innerR, 0, Math.PI * 2, true);
      shape.holes.push(hole);
    }
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
      curveSegments: 36,
    });
    g.center();
    return g;
  }, [outerR, innerR, thickness]);

  useEffect(() => () => geo.dispose(), [geo]);

  const boltR = innerR + (outerR - innerR) * 0.62;
  const bolts = useMemo(
    () =>
      Array.from({ length: boltCount }, (_, i) => {
        const a = (i / boltCount) * Math.PI * 2;
        return [Math.cos(a) * boltR, Math.sin(a) * boltR] as const;
      }),
    [boltCount, boltR],
  );

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} rotation={[Math.PI / 2, 0, 0]}>
        <PbrMat preset={preset} />
      </mesh>
      {bolts.map(([bx, bz], i) => (
        <mesh key={i} position={[bx, 0, bz]}>
          <cylinderGeometry args={[outerR * 0.075, outerR * 0.075, thickness * 1.45, 6]} />
          <PbrMat preset="ssDark" />
        </mesh>
      ))}
    </group>
  );
}

export function HelicalTube({
  radius = 0.25,
  height = 0.8,
  turns = 6,
  tubeRadius = 0.025,
  preset = 'copper',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  radialTaper = 0,
}: {
  radius?: number;
  height?: number;
  turns?: number;
  tubeRadius?: number;
  preset?: MatKey;
  position?: [number, number, number];
  rotation?: [number, number, number];
  radialTaper?: number;
}) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const total = Math.max(48, Math.round(turns * 24));
    for (let i = 0; i <= total; i++) {
      const t = i / total;
      const ang = t * turns * Math.PI * 2;
      const r = radius + radialTaper * t;
      const y = (t - 0.5) * height;
      pts.push(new THREE.Vector3(Math.cos(ang) * r, y, Math.sin(ang) * r));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, total, tubeRadius, 10, false);
  }, [radius, height, turns, tubeRadius, radialTaper]);

  useEffect(() => () => geo.dispose(), [geo]);

  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      <PbrMat preset={preset} />
    </mesh>
  );
}

export function DialPointer({
  angleRad,
  length = 0.52,
  centerOffset = [0, 0, 0.04],
  color = '#dc2626',
}: {
  angleRad: number;
  length?: number;
  centerOffset?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={centerOffset} rotation={[0, 0, angleRad]}>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.035, 18]} />
        <PbrMat preset="brass" />
      </mesh>
      <mesh position={[length * 0.42, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.022, length, 4]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.35} />
      </mesh>
    </group>
  );
}

