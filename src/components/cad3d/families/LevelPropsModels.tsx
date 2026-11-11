import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim } from '../CadPart';
import { HelicalTube, PbrMat } from '../primitives';

export function FloatMlgAssembly() {
  const sim = useCadSim();
  const levelY = -0.75 + sim.primaryNorm * 1.5;

  return (
    <group>
      <CadPartGroup partId="fm_chamber" basePos={[-0.25, 0, 0]} explodeOffset={[-0.55, 0, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 2.2, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[-0.4, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.55, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[-0.4, -0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.55, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fm_float" basePos={[-0.25, levelY, 0]} explodeOffset={[-0.75, 0.25, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.21, 0.21, 0.42, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fm_flag_rail" basePos={[0.35, 0, 0]} explodeOffset={[0.75, 0, 0.2]}>
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.32, 1.9, 0.08]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        {Array.from({ length: 11 }, (_, i) => {
          const y = -0.75 + i * 0.15;
          const submerged = y <= levelY;
          return (
            <mesh key={i} position={[0, y, 0.02]} rotation={[submerged ? 0 : Math.PI, 0, 0]}>
              <boxGeometry args={[0.26, 0.09, 0.05]} />
              <PbrMat preset={submerged ? 'alnicoRed' : 'alumina'} />
            </mesh>
          );
        })}
      </CadPartGroup>
    </group>
  );
}

export function DisplacerAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.15, 0.2 + sim.primaryNorm * 1.45);
  const torqueTwist = -sim.primaryNorm * 0.22;

  return (
    <group>
      <CadPartGroup partId="dp_cage" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.52, 0.52, 1.85, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, -0.92 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.48, 0.48, fluidH, 28]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dp_displacer" basePos={[0, -0.22 + sim.primaryNorm * 0.08, 0]} explodeOffset={[-0.75, -0.25, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 1.4, 28]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dp_torque_head" basePos={[0.28, 0.92, 0]} explodeOffset={[0.65, 0.75, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.9, 20]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[-0.28, -0.1, 0]} rotation={[0, 0, torqueTwist]}>
          <boxGeometry args={[0.35, 0.06, 0.06]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.42, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function DpLevelAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.15, 0.15 + sim.primaryNorm * 1.45);

  return (
    <group>
      <CadPartGroup partId="dl_tank" basePos={[-0.35, 0.1, 0]} explodeOffset={[-0.5, 0.35, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.72, 0.72, 2.0, 36]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.98 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.68, 0.68, fluidH, 32]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dl_hp_leg" basePos={[0.52, -0.68, 0]} explodeOffset={[0.5, -0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.55, 16]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dl_wet_leg" basePos={[0.62, 0.18, 0]} explodeOffset={[0.85, 0.35, 0]}>
        <mesh position={[-0.12, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.55, 16]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0.14, 0.72, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.28, 20]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.14, -0.05, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.6, 16]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dl_transmitter" basePos={[0.78, -0.78, 0]} explodeOffset={[0.85, -0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.44, 0.48, 0.44]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function CapLevelAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.15, 0.15 + sim.primaryNorm * 1.45);

  return (
    <group>
      <CadPartGroup partId="cl_nozzle" basePos={[0, 0.98, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.42, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.22, 6]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cl_probe" basePos={[0, -0.22, 0]} explodeOffset={[0, 0.3, 0.55]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 1.8, 20]} />
          <PbrMat preset="ptfe" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 1.65, 24]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cl_tank" basePos={[0, -0.25, 0]} explodeOffset={[-0.75, -0.35, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.78, 0.78, 1.85, 36]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.9 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.74, 0.74, fluidH, 32]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function UltrasonicLevelAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.12, 0.15 + sim.primaryNorm * 1.15);
  const surfaceY = -0.95 + fluidH;
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const cycle = (clock.elapsedTime * 1.4) % 1;
      ringRef.current.position.y = THREE.MathUtils.lerp(0.62, surfaceY, cycle);
      const s = 0.4 + cycle * 1.4;
      ringRef.current.scale.set(s, 1, s);
    }
  });

  return (
    <group>
      <CadPartGroup partId="ul_horn" basePos={[0, 0.92, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.42, 24]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.14, 0.34, 0.32, 28]} />
          <PbrMat preset="ptfe" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ul_echo" basePos={[0, 0, 0]} explodeOffset={[0, 0, 0.5]}>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.25, 0.02, 12, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ul_tank" basePos={[0, -0.22, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 1.55, 36]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.75 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.76, 0.76, fluidH, 32]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function RadarLevelAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.12, 0.15 + sim.primaryNorm * 1.15);

  return (
    <group>
      <CadPartGroup partId="rd_antenna" basePos={[0, 0.95, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.45, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.1, 0.32, 0.38, 28]} />
          <PbrMat preset="peek" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rd_beam" basePos={[0, 0.05, 0]} explodeOffset={[0, 0, 0.55]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.45, 1.45, 24]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rd_tank" basePos={[0, -0.22, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 1.55, 36]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.75 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.76, 0.76, fluidH, 32]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function GwrLevelAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.15, 0.15 + sim.primaryNorm * 1.45);
  const pulseY = -0.95 + fluidH;

  return (
    <group>
      <CadPartGroup partId="gw_head" basePos={[0, 1.0, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.44, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="gw_rod" basePos={[0, -0.12, 0]} explodeOffset={[-0.65, 0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 1.85, 20]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="gw_tdr_pulse" basePos={[0, pulseY, 0]} explodeOffset={[0.6, 0, 0.4]}>
        <mesh>
          <torusGeometry args={[0.14, 0.035, 12, 24]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="gw_tank" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.75, 0.75, 1.8, 36]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.88 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.71, 0.71, fluidH, 32]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function NuclearLevelAssembly() {
  const sim = useCadSim();
  const fluidH = Math.max(0.15, 0.15 + sim.primaryNorm * 1.45);

  return (
    <group>
      <CadPartGroup partId="nl_source" basePos={[-1.08, 0.15, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.56, 28]} />
          <PbrMat preset="yellowSafety" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="nl_vessel" basePos={[0, 0, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.68, 0.68, 1.9, 36]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, -0.92 + fluidH / 2, 0]}>
          <cylinderGeometry args={[0.62, 0.62, fluidH, 32]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="nl_detector" basePos={[0.98, 0, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 1.65, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, 0.88, 0]}>
          <boxGeometry args={[0.36, 0.28, 0.36]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function HumiditySensorAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="hm_filter" basePos={[0, -0.55, 0]} explodeOffset={[0, -0.75, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.36, 0.34, 0.72, 28]} />
          <PbrMat preset="bronze" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="hm_polymer_cap" basePos={[-0.14, -0.5, 0]} explodeOffset={[-0.65, -0.2, 0.4]}>
        <mesh>
          <boxGeometry args={[0.22, 0.42, 0.04]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="hm_chilled_mirror" basePos={[0.18, -0.5, 0]} explodeOffset={[0.65, -0.2, 0.4]}>
        <mesh rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="hm_probe_body" basePos={[0, 0.45, 0]} explodeOffset={[0, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 1.25, 28]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ViscometerAssembly() {
  const sim = useCadSim();
  const spindleRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (spindleRef.current) {
      spindleRef.current.rotation.y += delta * (2.5 - sim.primaryNorm * 1.4);
    }
  });

  return (
    <group>
      <CadPartGroup partId="vs_motor_head" basePos={[0, 0.85, 0]} explodeOffset={[0, 0.75, 0]}>
        <mesh>
          <boxGeometry args={[1.05, 0.56, 0.75]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vs_torsion_spring" basePos={[0, 0.45, 0]} explodeOffset={[-0.65, 0.35, 0.4]}>
        <HelicalTube radius={0.14} height={0.28} turns={4} tubeRadius={0.018} preset="bronze" />
      </CadPartGroup>

      <CadPartGroup partId="vs_spindle" basePos={[0, -0.35, 0]} explodeOffset={[0.65, 0.2, 0]}>
        <mesh ref={spindleRef}>
          <cylinderGeometry args={[0.04, 0.04, 1.1, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.32, 28]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vs_beaker" basePos={[0, -0.68, 0]} explodeOffset={[0, -0.75, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 0.95, 32]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.68, 30]} />
          <PbrMat preset="kapton" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function DensityMeterAssembly() {
  const sim = useCadSim();
  const uRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (uRef.current) {
      const f = 14 - sim.primaryNorm * 5;
      uRef.current.position.z = Math.sin(clock.elapsedTime * f) * 0.03;
    }
  });

  return (
    <group>
      <CadPartGroup partId="dn_thermal_block" basePos={[0, 0, -0.1]} explodeOffset={[0, 0, -0.75]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 1.45, 0.55]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dn_u_tube" basePos={[0, 0.1, 0.1]} explodeOffset={[0, 0.35, 0.55]}>
        <mesh ref={uRef} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.42, 0.075, 14, 30, Math.PI]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dn_exciter" basePos={[0, -0.35, 0.18]} explodeOffset={[0, -0.65, 0.55]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 22]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function VibratingForkAssembly() {
  const sim = useCadSim();
  const tinesRef = useRef<THREE.Group>(null);
  const wet = sim.primaryNorm >= 0.5;

  useFrame((state) => {
    if (!tinesRef.current) return;
    const freq = wet ? 14 : 30;
    const amp = wet ? 0.004 : 0.014;
    tinesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * freq) * amp;
  });

  return (
    <group>
      <CadPartGroup partId="vf_housing" basePos={[0, 0.92, 0]} explodeOffset={[0, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.4, 0.68, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.1, 28]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.26, 16]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, 0.42, 0.18]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <PbrMat preset={wet ? 'alnicoRed' : 'blueLiquid'} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vf_process_boss" basePos={[0, 0.28, 0]} explodeOffset={[0, 0.15, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 6]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.42, 24]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.22, 20]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vf_tines" basePos={[0, -0.58, 0]} explodeOffset={[0, -0.75, 0]}>
        <group ref={tinesRef}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.18, 0.16, 0.18, 24]} />
            <PbrMat preset="ss316" />
          </mesh>
          <mesh position={[-0.14, -0.12, 0]}>
            <boxGeometry args={[0.09, 1.05, 0.16]} />
            <PbrMat preset="chrome" />
          </mesh>
          <mesh position={[0.14, -0.12, 0]}>
            <boxGeometry args={[0.09, 1.05, 0.16]} />
            <PbrMat preset="chrome" />
          </mesh>
        </group>
      </CadPartGroup>
    </group>
  );
}

export function renderLevelPropsModel(key: string) {
  switch (key) {
    case 'float-mlg':
      return <FloatMlgAssembly />;
    case 'displacer':
      return <DisplacerAssembly />;
    case 'dp-level':
      return <DpLevelAssembly />;
    case 'cap-level':
      return <CapLevelAssembly />;
    case 'ultrasonic-level':
      return <UltrasonicLevelAssembly />;
    case 'radar-level':
      return <RadarLevelAssembly />;
    case 'gwr-level':
      return <GwrLevelAssembly />;
    case 'nuclear-level':
      return <NuclearLevelAssembly />;
    case 'humidity-sensor':
      return <HumiditySensorAssembly />;
    case 'viscometer':
      return <ViscometerAssembly />;
    case 'density-meter':
      return <DensityMeterAssembly />;
    case 'vibrating-fork-level':
      return <VibratingForkAssembly />;
    default:
      return null;
  }
}

