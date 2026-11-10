import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim } from '../CadPart';
import { buildCroScreenTexture, buildDialFaceTexture, buildLcdDisplayTexture } from '../materials';
import { DialPointer, HelicalTube, PbrMat } from '../primitives';

export function PmmcAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(
    () => buildDialFaceTexture({ title: "d'ARSONVAL PMMC", unit: 'mA DC', min: 0, max: 100, majorTicks: 5, sweepDeg: 110, startDeg: 215 }),
    [],
  );
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);

  const pointerAngle = THREE.MathUtils.degToRad(145 - sim.primaryNorm * 110);

  return (
    <group>
      <CadPartGroup partId="pm_magnet" basePos={[0, -0.35, -0.15]} explodeOffset={[0, -0.65, -0.5]}>
        <mesh position={[-0.65, 0, 0]}>
          <boxGeometry args={[0.28, 1.05, 0.45]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
        <mesh position={[0.65, 0, 0]}>
          <boxGeometry args={[0.28, 1.05, 0.45]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[1.58, 0.28, 0.45]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pm_core" basePos={[0, -0.15, -0.15]} explodeOffset={[0, 0, -0.45]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.42, 28]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pm_moving_coil" basePos={[0, -0.15, -0.15]} rotation={[0, 0, pointerAngle - Math.PI / 2]} explodeOffset={[0, 0.45, 0.45]}>
        <mesh>
          <boxGeometry args={[0.72, 0.68, 0.48]} />
          <PbrMat preset="copper" />
        </mesh>
        <HelicalTube position={[0, 0, 0.3]} radius={0.14} height={0.05} turns={3} tubeRadius={0.01} preset="bronze" />
      </CadPartGroup>

      <CadPartGroup partId="pm_scale" basePos={[0, 0.68, 0.16]} explodeOffset={[0, 0.75, 0.75]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 0.03, 36]} />
          <meshStandardMaterial map={scaleTex} roughness={0.5} />
        </mesh>
        <DialPointer angleRad={pointerAngle} length={0.85} centerOffset={[0, -0.55, 0.03]} />
      </CadPartGroup>
    </group>
  );
}

export function MovingIronAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(
    () => buildDialFaceTexture({ title: 'MOVING IRON AC/DC', unit: 'A RMS', min: 0, max: 50, majorTicks: 5, sweepDeg: 110, startDeg: 215, nonlinearCRAMP: true }),
    [],
  );
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);

  const deflectFrac = sim.primaryNorm * sim.primaryNorm;
  const pointerAngle = THREE.MathUtils.degToRad(145 - deflectFrac * 110);

  return (
    <group>
      <CadPartGroup partId="mi_coil" basePos={[0, -0.25, -0.1]} explodeOffset={[-0.7, -0.3, 0]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.65, 32]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mi_vane" basePos={[0, -0.25, -0.1]} rotation={[0, 0, -deflectFrac * 1.4]} explodeOffset={[0.6, 0.25, 0.45]}>
        <mesh position={[0.18, 0, 0]}>
          <boxGeometry args={[0.38, 0.24, 0.48]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mi_damping" basePos={[0, -0.78, 0.08]} explodeOffset={[0, -0.8, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.28, 24]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mi_scale" basePos={[0, 0.62, 0.16]} explodeOffset={[0, 0.75, 0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.74, 0.74, 0.03, 36]} />
          <meshStandardMaterial map={scaleTex} roughness={0.5} />
        </mesh>
        <DialPointer angleRad={pointerAngle} length={0.82} centerOffset={[0, -0.52, 0.03]} />
      </CadPartGroup>
    </group>
  );
}

export function WattmeterAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(
    () => buildDialFaceTexture({ title: 'DYNAMOMETER WATTS', unit: 'kW', min: 0, max: 10, majorTicks: 5, sweepDeg: 110, startDeg: 215 }),
    [],
  );
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);

  const wattFraction = sim.primaryNorm * (0.2 + 0.8 * sim.secondaryNorm);
  const pointerAngle = THREE.MathUtils.degToRad(145 - wattFraction * 110);

  return (
    <group>
      <CadPartGroup partId="wm_terminals" basePos={[0, -0.82, 0]} explodeOffset={[0, -0.7, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.22, 0.72]} />
          <PbrMat preset="phenolic" />
        </mesh>
        {[-0.68, -0.22, 0.22, 0.68].map((x, idx) => (
          <mesh key={idx} position={[x, 0.16, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.16, 16]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="wm_current_coils" basePos={[0, -0.15, -0.1]} explodeOffset={[-0.75, 0, 0]}>
        <mesh position={[-0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.24, 28]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.24, 28]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="wm_voltage_coil" basePos={[0, -0.15, -0.1]} rotation={[0, -wattFraction * 1.1, 0]} explodeOffset={[0.7, 0.25, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="wm_scale" basePos={[0, 0.68, 0.18]} explodeOffset={[0, 0.85, 0.65]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 0.03, 36]} />
          <meshStandardMaterial map={scaleTex} />
        </mesh>
        <DialPointer angleRad={pointerAngle} length={0.82} centerOffset={[0, -0.52, 0.03]} />
      </CadPartGroup>
    </group>
  );
}

export function EnergyMeterAssembly() {
  const sim = useCadSim();
  const discRef = useRef<THREE.Mesh>(null);
  const regTex = useMemo(() => {
    const kwh = (1284 + sim.primaryNorm * 45).toFixed(1);
    return buildLcdDisplayTexture(`${kwh} kWh`, '3200 imp / kWh', '#1e293b', '#f8fafc');
  }, [sim.primaryNorm]);
  useEffect(() => () => regTex.dispose(), [regTex]);

  useFrame((_, delta) => {
    if (discRef.current) {
      discRef.current.rotation.y += delta * (0.2 + sim.primaryNorm * 10);
    }
  });

  return (
    <group>
      <CadPartGroup partId="em_cover" basePos={[0, 0, 0]} explodeOffset={[0, 0, 0.85]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 2.05, 0.95]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_shunt_magnet" basePos={[0, 0.58, 0]} explodeOffset={[0, 0.75, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 0.52, 0.52]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.38, 0.35, 0.58]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_series_magnet" basePos={[0, -0.45, 0]} explodeOffset={[0, -0.75, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 0.45, 0.52]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[-0.28, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.48, 20]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0.28, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.48, 20]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_disc" basePos={[0, 0.08, 0]} explodeOffset={[-0.75, 0, 0.35]}>
        <mesh ref={discRef}>
          <cylinderGeometry args={[0.66, 0.66, 0.035, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_brake_magnet" basePos={[0.62, 0.08, 0.1]} explodeOffset={[0.85, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.34, 0.28, 0.38]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_register" basePos={[0, 0.8, 0.46]} explodeOffset={[0, 0.85, 0.65]}>
        <mesh>
          <planeGeometry args={[0.92, 0.36]} />
          <meshStandardMaterial map={regTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function DmmAssembly() {
  const sim = useCadSim();
  const modeIdx = sim.secondaryNorm > 0.66 ? 2 : sim.secondaryNorm > 0.33 ? 1 : 0;
  const valStr = modeIdx === 0 ? `${sim.primaryValue.toFixed(2)} V` : modeIdx === 1 ? `${(sim.primaryNorm * 20).toFixed(2)} mA` : `${(sim.primaryNorm * 1000).toFixed(1)} Ω`;
  const lcdTex = useMemo(() => buildLcdDisplayTexture(valStr, 'TRUE RMS · AUTO RANGE', '#18241d', '#a3e635'), [valStr]);
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="dm_body" basePos={[0, 0, 0]} explodeOffset={[0, 0, -0.55]}>
        <mesh>
          <boxGeometry args={[1.38, 2.25, 0.48]} />
          <PbrMat preset="yellowSafety" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[1.18, 2.02, 0.46]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dm_lcd" basePos={[0, 0.6, 0.29]} explodeOffset={[0, 0.55, 0.6]}>
        <mesh>
          <planeGeometry args={[0.96, 0.54]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dm_rotary_knob" basePos={[0, -0.1, 0.32]} rotation={[0, 0, -modeIdx * 0.75 + 0.7]} explodeOffset={[0, 0, 0.85]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.4, 0.14, 28]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, 0.08, 0.08]}>
          <boxGeometry args={[0.08, 0.58, 0.1]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dm_jacks" basePos={[0, -0.78, 0.28]} explodeOffset={[0, -0.75, 0.55]}>
        {[-0.4, -0.13, 0.13, 0.4].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.12, 18]} />
            <meshStandardMaterial color={idx === 1 ? '#111827' : '#dc2626'} />
          </mesh>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function CroCrtAssembly() {
  const sim = useCadSim();
  const fRatio = Math.max(1, Math.round(1 + sim.primaryNorm * 3));
  const phaseDeg = Math.round(sim.secondaryNorm * 180);
  const crtTex = useMemo(() => buildCroScreenTexture(fRatio, phaseDeg), [fRatio, phaseDeg]);
  useEffect(() => () => crtTex.dispose(), [crtTex]);

  return (
    <group rotation={[0, Math.PI / 10, 0]}>
      <CadPartGroup partId="cr_case" basePos={[0, 0, 0]} explodeOffset={[0, 0.85, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.35, 1.35, 1.55]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cr_electron_gun" basePos={[0, 0.08, -0.45]} explodeOffset={[0, 0, -0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.55, 22]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh userData={{ selfEmissive: true }} position={[0, 0, -0.26]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={1.2} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cr_deflection_plates" basePos={[0, 0.08, 0.02]} explodeOffset={[0, 0.7, 0.1]}>
        <mesh position={[-0.14, 0, -0.08]}>
          <boxGeometry args={[0.025, 0.22, 0.22]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.14, 0, -0.08]}>
          <boxGeometry args={[0.025, 0.22, 0.22]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, 0.14, 0.14]}>
          <boxGeometry args={[0.24, 0.025, 0.22]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0, -0.14, 0.14]}>
          <boxGeometry args={[0.24, 0.025, 0.22]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cr_crt_glass" basePos={[0, 0.08, 0.12]} explodeOffset={[0, -0.55, 0.45]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.18, 1.05, 32]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cr_phosphor_screen" basePos={[0, 0.08, 0.78]} explodeOffset={[0, 0, 0.9]}>
        <mesh>
          <planeGeometry args={[1.05, 0.8]} />
          <meshStandardMaterial map={crtTex} />
        </mesh>
        <mesh position={[0.78, -0.1, 0]}>
          <boxGeometry args={[0.42, 0.9, 0.06]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PhaseMeterAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(
    () => buildDialFaceTexture({ title: 'POWER FACTOR / PHASE', unit: 'cos φ', min: -0.5, max: 0.5, majorTicks: 4, sweepDeg: 100, startDeg: 220 }),
    [],
  );
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);
  const angle = THREE.MathUtils.degToRad(140 - sim.primaryNorm * 100);

  return (
    <group>
      <CadPartGroup partId="pf_case" basePos={[0, 0, -0.15]} explodeOffset={[0, 0, -0.7]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.55, 1.55, 0.65]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="pf_crossed_coils" basePos={[0, -0.2, 0.05]} explodeOffset={[-0.7, 0, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.25, 0.25, 0.55, 22]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.25, 0.25, 0.55, 22]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="pf_scale" basePos={[0, 0.35, 0.2]} explodeOffset={[0, 0.5, 0.7]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.03, 36]} />
          <meshStandardMaterial map={scaleTex} />
        </mesh>
        <DialPointer angleRad={angle} length={0.72} centerOffset={[0, -0.4, 0.03]} />
      </CadPartGroup>
    </group>
  );
}

export function MeggerAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(
    () => buildDialFaceTexture({ title: 'MEGGER 1000 V DC', unit: 'MΩ', min: 0, max: 500, majorTicks: 5, sweepDeg: 100, startDeg: 220, nonlinearCRAMP: true }),
    [],
  );
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);
  const crankRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (crankRef.current) crankRef.current.rotation.z += delta * 4;
  });
  const needle = THREE.MathUtils.degToRad(140 - sim.primaryNorm * 100);

  return (
    <group>
      <CadPartGroup partId="mg_case" basePos={[0, 0, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 1.15, 1.05]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="mg_crank_gen" basePos={[1.0, 0, 0]} explodeOffset={[0.85, 0, 0]}>
        <group ref={crankRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.4, 20]} />
            <PbrMat preset="brass" />
          </mesh>
          <mesh position={[0.24, 0.22, 0]}>
            <boxGeometry args={[0.08, 0.52, 0.08]} />
            <PbrMat preset="chrome" />
          </mesh>
        </group>
      </CadPartGroup>
      <CadPartGroup partId="mg_crossed_coils" basePos={[-0.25, 0.2, 0]} explodeOffset={[-0.65, 0.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.45, 24]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="mg_scale" basePos={[-0.2, 0.62, 0]} explodeOffset={[0, 0.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.56, 0.56, 0.04, 32]} />
          <meshStandardMaterial map={scaleTex} />
        </mesh>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <DialPointer angleRad={needle} length={0.55} centerOffset={[0, -0.3, 0.04]} />
        </group>
      </CadPartGroup>
    </group>
  );
}

export function FluxmeterAssembly() {
  const sim = useCadSim();
  const angle = THREE.MathUtils.degToRad(140 - sim.primaryNorm * 100);

  return (
    <group>
      <CadPartGroup partId="fx_frame" basePos={[0, 0, -0.1]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.35, 1.85, 0.72]} />
          <PbrMat preset="phenolic" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="fx_movement" basePos={[0, 0.2, 0.1]} explodeOffset={[0, 0.5, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.48, 24]} />
          <PbrMat preset="copper" />
        </mesh>
        <DialPointer angleRad={angle} length={0.62} centerOffset={[0, 0.35, 0.25]} />
      </CadPartGroup>
      <CadPartGroup partId="fx_search_coil" basePos={[1.15, -0.35, 0]} explodeOffset={[0.85, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.045, 14, 28]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.55, 14]} />
          <PbrMat preset="rubber" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function CtAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="ct_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.7, 0]} isCutawayShell>
        <mesh>
          <torusGeometry args={[0.68, 0.26, 20, 44]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ct_core" basePos={[0, 0, 0]} explodeOffset={[-0.7, 0, 0.3]}>
        <mesh>
          <torusGeometry args={[0.68, 0.17, 18, 40]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ct_secondary" basePos={[0, 0, 0]} explodeOffset={[0.7, 0.3, 0]}>
        <HelicalTube position={[0.45, 0, 0]} radius={0.21} height={0.5} turns={8} tubeRadius={0.018} preset="copper" />
      </CadPartGroup>
      <CadPartGroup partId="ct_primary_bar" basePos={[0, 0, 0]} explodeOffset={[0, 0, 0.9]}>
        <mesh userData={{ selfEmissive: true }} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 1.85, 24]} />
          <meshStandardMaterial color="#c96b3e" emissive="#c2410c" emissiveIntensity={sim.primaryNorm * 0.45} metalness={0.85} roughness={0.25} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PtAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="pt_tank" basePos={[0, -0.35, 0]} explodeOffset={[0, -0.6, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.45, 1.15, 1.15]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="pt_core" basePos={[0, -0.35, 0]} explodeOffset={[-0.65, 0, 0.4]}>
        <mesh>
          <boxGeometry args={[0.95, 0.85, 0.55]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="pt_windings" basePos={[0, -0.35, 0]} explodeOffset={[0.65, 0, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.72, 28]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="pt_hv_bushings" basePos={[0, 0.65, 0]} explodeOffset={[0, 0.95, 0]}>
        {[-0.36, 0.36].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            <mesh userData={{ selfEmissive: true }}>
              <cylinderGeometry args={[0.14, 0.18, 0.95, 20]} />
              <meshStandardMaterial color="#78350f" emissive="#d97706" emissiveIntensity={sim.primaryNorm * 0.25} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function WheatstoneAssembly() {
  const sim = useCadSim();
  const galvoTex = useMemo(
    () => buildDialFaceTexture({ title: 'NULL GALVANOMETER', unit: 'μA', min: -50, max: 50, majorTicks: 4, sweepDeg: 90, startDeg: 225 }),
    [],
  );
  useEffect(() => () => galvoTex.dispose(), [galvoTex]);

  const diffFrac = sim.primaryNorm - sim.secondaryNorm;
  const galvoAngle = THREE.MathUtils.degToRad(90 - diffFrac * 80);

  return (
    <group>
      <CadPartGroup partId="wb_console" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[2.15, 0.42, 1.55]} />
          <PbrMat preset="phenolic" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="wb_dials" basePos={[0, 0.05, 0.35]} explodeOffset={[0, 0.65, 0.4]}>
        {[-0.65, -0.22, 0.22, 0.65].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, sim.secondaryNorm * 4 + idx, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 0.2, 20]} />
            <PbrMat preset="anodizedDark" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="wb_terminals" basePos={[0, 0.02, -0.52]} explodeOffset={[0, 0.6, -0.4]}>
        {[-0.75, -0.25, 0.25, 0.75].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="wb_galvo" basePos={[0, 0.45, -0.22]} explodeOffset={[0, 1.0, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 0.68, 0.42]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, 0.04, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
          <meshStandardMaterial map={galvoTex} />
        </mesh>
        <DialPointer angleRad={galvoAngle} length={0.34} centerOffset={[0, -0.1, 0.24]} />
      </CadPartGroup>
    </group>
  );
}

export function KelvinDoubleAssembly() {
  const sim = useCadSim();
  const galvoAngle = THREE.MathUtils.degToRad(90 - (sim.primaryNorm - sim.secondaryNorm) * 80);

  return (
    <group>
      <CadPartGroup partId="kb_console" basePos={[0, -0.2, 0]} explodeOffset={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[2.3, 0.45, 1.65]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="kb_shunt_bar" basePos={[0, 0.12, 0.55]} explodeOffset={[0, 0.45, 0.65]}>
        <mesh>
          <boxGeometry args={[1.9, 0.14, 0.22]} />
          <PbrMat preset="copper" />
        </mesh>
        {[-0.85, -0.45, 0.45, 0.85].map((x, idx) => (
          <mesh key={idx} position={[x, 0.12, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.18, 16]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>
      <CadPartGroup partId="kb_ratio_yoke" basePos={[0, 0.1, -0.15]} explodeOffset={[0, 0.7, 0]}>
        {[-0.45, 0.45].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, sim.secondaryNorm * 4, 0]}>
            <cylinderGeometry args={[0.26, 0.28, 0.22, 24]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>
      <CadPartGroup partId="kb_galvo" basePos={[0, 0.48, -0.45]} explodeOffset={[0, 1.0, -0.3]}>
        <mesh>
          <boxGeometry args={[0.78, 0.58, 0.36]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <DialPointer angleRad={galvoAngle} length={0.32} centerOffset={[0, -0.05, 0.2]} />
      </CadPartGroup>
    </group>
  );
}

export function AcImpedanceBridgeAssembly() {
  const sim = useCadSim();
  const mode = sim.secondaryNorm < 0.25 ? 'MAXWELL' : sim.secondaryNorm < 0.5 ? 'HAY' : sim.secondaryNorm < 0.75 ? 'OWEN' : 'ANDERSON';
  const lcdTex = useMemo(
    () => buildLcdDisplayTexture(`${mode} MODE`, `Lx = ${sim.primaryValue.toFixed(1)} mH · NULL`),
    [mode, sim.primaryValue],
  );
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="ac_chassis" basePos={[0, -0.15, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.25, 0.95, 1.4]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ac_mode_switch" basePos={[-0.65, 0.05, 0.72]} explodeOffset={[-0.5, 0.4, 0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.16, 24]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ac_dials" basePos={[0.3, -0.15, 0.72]} explodeOffset={[0.5, 0, 0.65]}>
        {[-0.25, 0.25, 0.72].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[Math.PI / 2, sim.primaryNorm * 4 + idx, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.14, 20]} />
            <PbrMat preset="ss316" />
          </mesh>
        ))}
      </CadPartGroup>
      <CadPartGroup partId="ac_null_meter" basePos={[0.35, 0.16, 0.72]} explodeOffset={[0, 0.7, 0.7]}>
        <mesh>
          <planeGeometry args={[1.05, 0.42]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ScheringWienBridgeAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="sw_guard_enclosure" basePos={[0, -0.15, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.15, 0.65, 1.45]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="sw_hv_cap" basePos={[-0.58, 0.55, -0.25]} explodeOffset={[-0.65, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 1.05, 32]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="sw_dials" basePos={[0.45, 0.24, 0.25]} explodeOffset={[0.65, 0.6, 0.4]}>
        <mesh rotation={[0, sim.primaryNorm * 5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 24]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.45, 0, -0.35]}>
          <cylinderGeometry args={[0.18, 0.18, 0.18, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function renderElectricalBridgeModel(key: string) {
  switch (key) {
    case 'pmmc':
      return <PmmcAssembly />;
    case 'moving-iron':
      return <MovingIronAssembly />;
    case 'wattmeter':
      return <WattmeterAssembly />;
    case 'energy-meter':
      return <EnergyMeterAssembly />;
    case 'dmm':
      return <DmmAssembly />;
    case 'cro-crt':
      return <CroCrtAssembly />;
    case 'phase-meter':
      return <PhaseMeterAssembly />;
    case 'megger':
      return <MeggerAssembly />;
    case 'fluxmeter':
      return <FluxmeterAssembly />;
    case 'ct':
      return <CtAssembly />;
    case 'pt':
      return <PtAssembly />;
    case 'wheatstone':
      return <WheatstoneAssembly />;
    case 'kelvin-double':
      return <KelvinDoubleAssembly />;
    case 'ac-bridge':
      return <AcImpedanceBridgeAssembly />;
    case 'schering-wien':
      return <ScheringWienBridgeAssembly />;
    default:
      return null;
  }
}

