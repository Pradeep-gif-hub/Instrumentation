import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim } from '../CadPart';
import { buildLcdDisplayTexture, buildVerticalScaleTexture } from '../materials';
import { FlangeWithBolts, PbrMat } from '../primitives';

export function VenturiAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="vt_flanges" basePos={[0, 0, 0]} explodeOffset={[0, 0.7, 0]}>
        <FlangeWithBolts outerR={0.62} innerR={0.28} thickness={0.12} boltCount={8} position={[-1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.62} innerR={0.28} thickness={0.12} boltCount={8} position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="vt_converging" basePos={[-0.95, 0, 0]} explodeOffset={[-0.55, 0, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.34, 0.78, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vt_throat" basePos={[-0.36, 0, 0]} explodeOffset={[0, -0.55, 0.45]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.42, 32]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.44, 24]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vt_diverging" basePos={[0.58, 0, 0]} explodeOffset={[0.65, 0, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.19, 1.48, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vt_dp_taps" basePos={[-0.65, 0.5, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 16]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.29, -0.1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function FlowNozzleAssembly() {
  const nozzleGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.45, -0.25),
      new THREE.Vector2(0.45, 0.25),
      new THREE.Vector2(0.32, 0.25),
      new THREE.Vector2(0.21, 0.05),
      new THREE.Vector2(0.18, -0.25),
      new THREE.Vector2(0.45, -0.25),
    ];
    return new THREE.LatheGeometry(pts, 36);
  }, []);
  useEffect(() => () => nozzleGeo.dispose(), [nozzleGeo]);

  return (
    <group>
      <CadPartGroup partId="fn_pipe" basePos={[0, 0, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 2.2, 36]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <FlangeWithBolts outerR={0.72} innerR={0.44} thickness={0.12} boltCount={8} position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.72} innerR={0.44} thickness={0.12} boltCount={8} position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="fn_nozzle" basePos={[0, 0, 0]} explodeOffset={[0, 0.75, 0.35]}>
        <mesh geometry={nozzleGeo} rotation={[0, 0, Math.PI / 2]}>
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fn_taps" basePos={[0, 0.62, 0]} explodeOffset={[0, 1.05, 0]}>
        <mesh position={[-0.55, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.45, 16]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.45, 16]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function RotameterAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(() => buildVerticalScaleTexture('LPM', 0, 100, 5), []);
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);

  const floatY = -0.62 + sim.primaryNorm * 1.24;

  return (
    <group>
      <CadPartGroup partId="rm_end_blocks" basePos={[0, 0, 0]} explodeOffset={[0, -0.65, 0]}>
        <mesh position={[0, 0.98, 0]}>
          <boxGeometry args={[0.72, 0.28, 0.72]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.98, 0]}>
          <boxGeometry args={[0.72, 0.28, 0.72]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        {[-0.28, 0.28].map((x, idx) => (
          <mesh key={idx} position={[x, 0, -0.26]}>
            <cylinderGeometry args={[0.035, 0.035, 1.85, 16]} />
            <PbrMat preset="ss316" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="rm_glass_tube" basePos={[0, 0, 0]} explodeOffset={[0, 0.2, 0.55]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.31, 0.17, 1.72, 32]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rm_scale" basePos={[0.36, 0, 0.08]} explodeOffset={[0.7, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.28, 1.56]} />
          <meshStandardMaterial map={scaleTex} transparent />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rm_float_bob" basePos={[0, floatY, 0]} explodeOffset={[-0.65, 0.2, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.075, 0.22, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rm_needle_valve" basePos={[0.42, -0.98, 0]} explodeOffset={[0.85, -0.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.35, 18]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.22, 0, 0]} rotation={[sim.primaryNorm * 4, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
          <PbrMat preset="rubber" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function MagmeterAssembly() {
  const sim = useCadSim();
  const mv = (sim.primaryNorm * 2.8).toFixed(2);
  const lcdTex = useMemo(() => buildLcdDisplayTexture(`${mv} mV`, 'FARADAY E = B·D·v'), [mv]);
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="em_pipe_body" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.56, 0.56, 1.75, 36]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <FlangeWithBolts outerR={0.78} innerR={0.46} thickness={0.12} boltCount={8} position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.78} innerR={0.46} thickness={0.12} boltCount={8} position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="em_ptfe_liner" basePos={[0, -0.25, 0]} explodeOffset={[-0.75, 0, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.47, 0.47, 1.78, 32]} />
          <PbrMat preset="ptfe" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_field_coils" basePos={[0, -0.25, 0]} explodeOffset={[0, 0.45, -0.6]}>
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.68, 0.16, 0.56]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[0.68, 0.16, 0.56]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_electrodes" basePos={[0, -0.25, 0]} explodeOffset={[0, 0, 0.75]}>
        <mesh position={[0, 0, 0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.14, 18]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.14, 18]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="em_converter" basePos={[0, 0.78, 0]} explodeOffset={[0, 0.95, 0]}>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.35, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.78, 0.62, 0.56]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, 0.02, 0.29]}>
          <planeGeometry args={[0.66, 0.38]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function UltrasonicFlowAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="uf_pipe" basePos={[0, -0.2, 0]} explodeOffset={[0, -0.6, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 2.5, 36]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uf_rail" basePos={[0, 0.38, 0]} explodeOffset={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[1.95, 0.1, 0.32]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uf_transducers" basePos={[0, 0.48, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh position={[-0.62, 0, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.38, 0.28, 0.26]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0.62, 0, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.38, 0.28, 0.26]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uf_beam_ray" basePos={[0, -0.2, 0]} explodeOffset={[0, 0, 0.7]}>
        <mesh position={[-0.31, 0, 0]} rotation={[0, 0, 0.72]}>
          <cylinderGeometry args={[0.03, 0.03, 0.92, 14]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
        <mesh position={[0.31, 0, 0]} rotation={[0, 0, -0.72]}>
          <cylinderGeometry args={[0.03, 0.03, 0.92, 14]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uf_converter" basePos={[0, 1.0, 0]} explodeOffset={[0, 1.25, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.48, 0.32]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function TurbineFlowAssembly() {
  const sim = useCadSim();
  const rotorRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x += delta * (0.4 + sim.primaryNorm * 14);
    }
  });

  return (
    <group>
      <CadPartGroup partId="tf_body" basePos={[0, 0, 0]} explodeOffset={[0, -0.6, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 1.9, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
        <FlangeWithBolts outerR={0.68} innerR={0.38} thickness={0.12} boltCount={8} position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.68} innerR={0.38} thickness={0.12} boltCount={8} position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="tf_straightener" basePos={[-0.45, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        {[0, 1, 2].map((idx) => (
          <mesh key={idx} rotation={[(idx * Math.PI) / 3, 0, 0]}>
            <boxGeometry args={[0.35, 0.72, 0.03]} />
            <PbrMat preset="ssDark" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="tf_rotor" basePos={[0.05, 0, 0]} explodeOffset={[0, 0, 0.75]}>
        <group ref={rotorRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.36, 20]} />
            <PbrMat preset="brass" />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              position={[0, Math.cos((i * Math.PI) / 3) * 0.24, Math.sin((i * Math.PI) / 3) * 0.24]}
              rotation={[(i * Math.PI) / 3, 0.5, 0]}
            >
              <boxGeometry args={[0.24, 0.26, 0.03]} />
              <PbrMat preset="chrome" />
            </mesh>
          ))}
        </group>
      </CadPartGroup>

      <CadPartGroup partId="tf_pickup" basePos={[0.05, 0.68, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.45, 22]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[0.42, 0.3, 0.42]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function VortexFlowAssembly() {
  const sim = useCadSim();
  const trailRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (trailRef.current) {
      const freq = 3 + sim.primaryNorm * 14;
      trailRef.current.children.forEach((child, idx) => {
        child.position.y = Math.sin(clock.elapsedTime * freq - idx * 1.1) * 0.16;
      });
    }
  });

  return (
    <group>
      <CadPartGroup partId="vx_body" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 1.75, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vx_shedder_bar" basePos={[-0.25, -0.25, 0]} explodeOffset={[-0.6, 0, 0.55]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.15, 0.78, 3]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vx_vortex_street" basePos={[0.3, -0.25, 0]} explodeOffset={[0.4, 0, 0.6]}>
        <group ref={trailRef}>
          {[0, 0.25, 0.5].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <PbrMat preset="blueHousing" />
            </mesh>
          ))}
        </group>
      </CadPartGroup>

      <CadPartGroup partId="vx_transmitter" basePos={[0, 0.72, 0]} explodeOffset={[0, 0.9, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.65, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.42, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function CoriolisFlowAssembly() {
  const sim = useCadSim();
  const tubeRef = useRef<THREE.Group>(null);
  const loopGeo = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.75, 0.5, 0),
      new THREE.Vector3(-0.75, -0.65, 0),
      new THREE.Vector3(0, -1.05, 0),
      new THREE.Vector3(0.75, -0.65, 0),
      new THREE.Vector3(0.75, 0.5, 0),
    ];
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.085, 16, false);
  }, []);
  useEffect(() => () => loopGeo.dispose(), [loopGeo]);

  useFrame(({ clock }) => {
    if (tubeRef.current) {
      const amp = 0.04 + sim.primaryNorm * 0.09;
      tubeRef.current.rotation.x = Math.sin(clock.elapsedTime * 11) * amp;
    }
  });

  return (
    <group>
      <CadPartGroup partId="cr_manifold" basePos={[0, 0.6, 0]} explodeOffset={[0, 0.75, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.95, 0.36, 0.75]} />
          <PbrMat preset="ss316" />
        </mesh>
        <FlangeWithBolts outerR={0.48} innerR={0.18} thickness={0.1} boltCount={6} position={[-1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.48} innerR={0.18} thickness={0.1} boltCount={6} position={[1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="cr_u_tubes" basePos={[0, 0.1, 0]} explodeOffset={[0, -0.65, 0.45]}>
        <group ref={tubeRef}>
          <mesh geometry={loopGeo} position={[0, 0, -0.16]}>
            <PbrMat preset="chrome" />
          </mesh>
          <mesh geometry={loopGeo} position={[0, 0, 0.16]}>
            <PbrMat preset="chrome" />
          </mesh>
        </group>
      </CadPartGroup>

      <CadPartGroup partId="cr_drive_coil" basePos={[0, -0.88, 0]} explodeOffset={[0, -1.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.3, 24]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cr_pickoffs" basePos={[0, -0.25, 0]} explodeOffset={[0, 0, 0.75]}>
        <mesh position={[-0.75, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.25, 20]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.75, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.25, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ThermalFlowAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="thf_transmitter" basePos={[0, 0.9, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.48, 32]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="thf_probe" basePos={[0, 0.12, 0]} explodeOffset={[0, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 1.35, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.22, 6]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="thf_shroud" basePos={[0, -0.78, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 0.55, 24]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="thf_heated_rtd" basePos={[-0.08, -0.78, 0]} explodeOffset={[-0.45, -0.5, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.42, 16]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="thf_ref_rtd" basePos={[0.08, -0.78, 0]} explodeOffset={[0.45, -0.5, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.42, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PitotTubeAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="pt_duct" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.62, 0.62, 2.4, 36]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pt_impact_tip" basePos={[-0.15, -0.05, 0]} explodeOffset={[0, 0.55, 0.4]}>
        <mesh position={[-0.45, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.085, 0.07, 0.95, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0.05, 0.42, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 1.32, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[-0.95, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pt_static_ports" basePos={[0.08, 0.85, 0]} explodeOffset={[0.55, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.35, 20]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[-0.18, 0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 14]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.18, 0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 14]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function OvalGearPdAssembly() {
  const sim = useCadSim();
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const rate = delta * (0.4 + sim.primaryNorm * 7);
    if (g1.current) g1.current.rotation.z += rate;
    if (g2.current) g2.current.rotation.z -= rate;
  });

  return (
    <group>
      <CadPartGroup partId="pd_chamber" basePos={[0, 0, -0.08]} explodeOffset={[0, 0, -0.75]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 1.15, 0.52]} />
          <PbrMat preset="castIron" />
        </mesh>
        <mesh position={[-1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.45, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.45, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pd_gears" basePos={[0, 0, 0.04]} explodeOffset={[0, 0.35, 0.5]}>
        <mesh ref={g1} position={[-0.32, 0, 0]} scale={[1.38, 0.72, 1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.28, 24]} />
          <PbrMat preset="bronze" />
        </mesh>
        <mesh ref={g2} position={[0.32, 0, 0]} scale={[1.38, 0.72, 1]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.28, 24]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pd_cover" basePos={[0, 0, 0.26]} explodeOffset={[0, 0, 0.9]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.55, 1.05, 0.06]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function MassFlowControllerAssembly() {
  const sim = useCadSim();
  const sccm = (sim.primaryNorm * 500).toFixed(1);
  const lcdTex = useMemo(
    () => buildLcdDisplayTexture('MFC · N2 MASS FLOW', `${sccm} sccm`, `VALVE ${(sim.primaryNorm * 100).toFixed(0)}%`),
    [sccm, sim.primaryNorm],
  );
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="mfc_manifold" basePos={[0, -0.58, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.68, 0.56, 0.64]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[-1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.42, 6]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.42, 6]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[-0.22, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.55, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mfc_thermal_bridge" basePos={[-0.36, 0.15, 0]} explodeOffset={[-0.55, 0.45, 0.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.16, 18]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.16, 18]} />
          <PbrMat preset="copper" />
        </mesh>
        {/* Internal laminar flow restrictor & bypass bore exposed inside mfc_manifold cutaway */}
        <mesh position={[0.36, -0.73, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 1.5, 18]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0.14, -0.73, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.125, 0.125, 0.48, 20]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mfc_piezo_valve" basePos={[0.38, 0.25, 0]} explodeOffset={[0.6, 0.5, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.52, 24]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, -0.52 + sim.primaryNorm * 0.09, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.24, 18]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[-0.38, 0.36, 0]}>
          <boxGeometry args={[1.52, 0.58, 0.62]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[-0.38, 0.38, 0.32]}>
          <planeGeometry args={[1.08, 0.38]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function renderFlowModel(key: string) {
  switch (key) {
    case 'venturi':
      return <VenturiAssembly />;
    case 'flow-nozzle':
      return <FlowNozzleAssembly />;
    case 'rotameter':
      return <RotameterAssembly />;
    case 'magmeter':
      return <MagmeterAssembly />;
    case 'ultrasonic-flow':
      return <UltrasonicFlowAssembly />;
    case 'turbine-flow':
      return <TurbineFlowAssembly />;
    case 'vortex-flow':
      return <VortexFlowAssembly />;
    case 'coriolis-flow':
      return <CoriolisFlowAssembly />;
    case 'thermal-flow':
      return <ThermalFlowAssembly />;
    case 'pitot-tube':
      return <PitotTubeAssembly />;
    case 'oval-gear-pd':
      return <OvalGearPdAssembly />;
    case 'mass-flow-controller':
      return <MassFlowControllerAssembly />;
    default:
      return null;
  }
}

