import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim } from '../CadPart';
import { buildDialFaceTexture, buildVerticalScaleTexture } from '../materials';
import { DialPointer, FlangeWithBolts, HelicalTube, PbrMat } from '../primitives';

export function StrainGaugeAssembly() {
  const sim = useCadSim();
  const bendAngle = -sim.primaryNorm * 0.14;

  return (
    <group>
      <CadPartGroup partId="sg_mount_block" basePos={[-1.05, -0.05, 0]} explodeOffset={[-0.65, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.55, 0.95, 0.85]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sg_cantilever_beam" basePos={[-0.78, 0.08, 0]} rotation={[0, 0, bendAngle]} explodeOffset={[0, -0.35, 0]}>
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[2.1, 0.14, 0.56]} />
          <PbrMat preset="ss316" />
        </mesh>
        {/* Force arrow cone pressing at beam tip */}
        <mesh position={[1.95, 0.35, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.12, 0.32, 18]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sg_kapton_carrier" basePos={[-0.1, 0.165, 0]} rotation={[0, 0, bendAngle * 0.45]} explodeOffset={[0, 0.45, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.015, 0.36]} />
          <PbrMat preset="kapton" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sg_foil_grid" basePos={[-0.1, 0.18, 0]} rotation={[0, 0, bendAngle * 0.45]} explodeOffset={[0, 0.85, 0]}>
        {[-0.1, -0.05, 0, 0.05, 0.1].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]}>
            <boxGeometry args={[0.52, 0.012, 0.018]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
        {[-0.25, 0.25].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0.12]}>
            <boxGeometry args={[0.09, 0.02, 0.09]} />
            <PbrMat preset="copper" />
          </mesh>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function LoadCellAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="lc_billet" basePos={[0, 0, 0]} explodeOffset={[0, -0.45, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.25, 0.62, 0.56]} />
          <PbrMat preset="ss316" />
        </mesh>
        {/* Inner thin flexure pockets */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.85, 0.32, 0.6]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lc_wheatstone_gauges" basePos={[0, 0.33, 0]} explodeOffset={[0, 0.55, 0.4]}>
        {[-0.25, 0.25].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <boxGeometry args={[0.24, 0.02, 0.28]} />
            <PbrMat preset="kapton" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="lc_load_pad" basePos={[0.82, 0.42 - sim.primaryNorm * 0.04, 0]} explodeOffset={[0.45, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.32, 0.2, 28]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lc_cable_gland" basePos={[-1.24, 0, 0]} explodeOffset={[-0.85, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.32, 18]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 14]} />
          <PbrMat preset="rubber" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function TorqueTransducerAssembly() {
  const sim = useCadSim();
  const twist = sim.primaryNorm * 0.14;

  return (
    <group>
      <CadPartGroup partId="tq_flanges" basePos={[0, 0, 0]} explodeOffset={[-0.85, 0, 0]}>
        <FlangeWithBolts outerR={0.55} innerR={0.18} thickness={0.14} boltCount={6} position={[-1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.55} innerR={0.18} thickness={0.14} boltCount={6} position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="tq_shaft" basePos={[0, 0, 0]} rotation={[twist, 0, 0]} explodeOffset={[0, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 2.0, 28]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tq_chevron_bridge" basePos={[0, 0, 0]} rotation={[twist, 0, 0]} explodeOffset={[0, 0.65, 0.45]}>
        <mesh position={[0, 0.185, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.24, 0.02, 0.18]} />
          <PbrMat preset="kapton" />
        </mesh>
        <mesh position={[0, -0.185, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.24, 0.02, 0.18]} />
          <PbrMat preset="kapton" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tq_telemetry_collar" basePos={[0, 0, 0]} explodeOffset={[0, -0.75, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 0.72, 32]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function BourdonGaugeAssembly() {
  const sim = useCadSim();
  const dialTex = useMemo(
    () =>
      buildDialFaceTexture({
        title: 'BOURDON EN 837',
        unit: 'bar',
        min: 0,
        max: 10,
        majorTicks: 5,
        subtitle: 'C-TUBE MECHANISM',
      }),
    [],
  );
  useEffect(() => () => dialTex.dispose(), [dialTex]);

  const cTubeGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 42; i++) {
      const a = THREE.MathUtils.degToRad(-125 + (i / 42) * 260);
      const r = 0.56 + sim.primaryNorm * 0.04 * (i / 42);
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 42, 0.068, 12, false);
  }, [sim.primaryNorm]);
  useEffect(() => () => cTubeGeo.dispose(), [cTubeGeo]);

  const pointerAngle = THREE.MathUtils.degToRad(225 - sim.primaryNorm * 270);

  return (
    <group>
      <CadPartGroup partId="bg_case_bezel" basePos={[0, 0.15, -0.08]} explodeOffset={[0, 0, -0.85]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.46, 44]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.94, 0.94, 0.03, 44]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bg_socket_stem" basePos={[0, -0.96, -0.05]} explodeOffset={[0, -0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.35, 6]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.28, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bg_bourdon_tube" basePos={[0, 0.15, -0.08]} explodeOffset={[-0.75, 0.25, 0]}>
        <mesh geometry={cTubeGeo} rotation={[0, 0, Math.PI / 2]}>
          <PbrMat preset="copper" />
        </mesh>
        {/* Sealed free tip (sensing displacement end) highlighted in warm red-orange */}
        <mesh
          position={[
            -Math.sin(THREE.MathUtils.degToRad(135)) * (0.56 + sim.primaryNorm * 0.04),
            Math.cos(THREE.MathUtils.degToRad(135)) * (0.56 + sim.primaryNorm * 0.04),
            0,
          ]}
        >
          <sphereGeometry args={[0.09, 16, 16]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bg_sector_pinion" basePos={[0, 0.15, 0.03]} explodeOffset={[0.7, 0.25, 0.35]}>
        <mesh position={[0.14, -0.18, 0]}>
          <boxGeometry args={[0.35, 0.06, 0.03]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh rotation={[Math.PI / 2, sim.primaryNorm * 4.5, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 16]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bg_dial_pointer" basePos={[0, 0.15, 0.12]} explodeOffset={[0, 0, 0.85]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.92, 0.92, 0.02, 44]} />
          <meshStandardMaterial map={dialTex} transparent opacity={0.9} roughness={0.5} />
        </mesh>
        <DialPointer angleRad={pointerAngle} length={0.72} centerOffset={[0, 0, 0.03]} />
      </CadPartGroup>
    </group>
  );
}

export function DiaphragmAssembly() {
  const sim = useCadSim();
  const flexY = sim.primaryNorm * 0.09;

  return (
    <group>
      <CadPartGroup partId="dg_upper_flange" basePos={[0, 0.22, 0]} explodeOffset={[0, 0.75, 0]} isCutawayShell>
        <FlangeWithBolts outerR={0.95} innerR={0.28} thickness={0.18} boltCount={8} />
      </CadPartGroup>

      <CadPartGroup partId="dg_corrugated_membrane" basePos={[0, flexY, 0]} explodeOffset={[0, 0.15, 0.7]}>
        <mesh>
          <cylinderGeometry args={[0.72, 0.72, 0.035, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
        {[0.25, 0.45, 0.62].map((r, idx) => (
          <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.022, 12, 32]} />
            <PbrMat preset="chrome" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="dg_lower_flange" basePos={[0, -0.22, 0]} explodeOffset={[0, -0.75, 0]}>
        <FlangeWithBolts outerR={0.95} innerR={0.18} thickness={0.18} boltCount={8} preset="ssDark" />
      </CadPartGroup>

      <CadPartGroup partId="dg_plunger" basePos={[0, 0.62 + flexY, 0]} explodeOffset={[0, 1.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.075, 0.75, 18]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function BellowsAssembly() {
  const sim = useCadSim();
  const compressScale = 1 - sim.primaryNorm * 0.22;

  return (
    <group>
      <CadPartGroup partId="bl_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.85, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.68, 0.68, 1.65, 36]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bl_convolutions" basePos={[0, -0.15, 0]} explodeOffset={[-0.75, 0, 0]}>
        <group scale={[1, compressScale, 1]}>
          {[-0.4, -0.25, -0.1, 0.05, 0.2, 0.35].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.38, 0.055, 14, 32]} />
              <PbrMat preset="brass" />
            </mesh>
          ))}
        </group>
      </CadPartGroup>

      <CadPartGroup partId="bl_range_spring" basePos={[0, 0.45, 0]} explodeOffset={[0.75, 0.35, 0]}>
        <HelicalTube radius={0.22} height={0.55 * compressScale} turns={5} tubeRadius={0.025} preset="ssDark" />
      </CadPartGroup>

      <CadPartGroup partId="bl_pushrod" basePos={[0, 0.82 - sim.primaryNorm * 0.18, 0]} explodeOffset={[0, 1.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.72, 18]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function StrainPressureAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="sp_hex_body" basePos={[0, 0, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.55, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.25, 6]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.95, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sp_silicon_diaphragm" basePos={[0, -0.25, 0]} explodeOffset={[-0.7, -0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 28]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sp_amplifier_pcb" basePos={[0, 0.35, 0]} explodeOffset={[0.7, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.65, 0.05]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sp_m12_connector" basePos={[0, 1.0, 0]} explodeOffset={[0, 0.95, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.38, 24]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function CapacitivePressureAssembly() {
  const sim = useCadSim();
  const centerDeflect = (sim.primaryNorm - 0.5) * 0.14;

  return (
    <group>
      <CadPartGroup partId="cp_isolators" basePos={[0, 0, 0]} explodeOffset={[-0.8, 0, 0]}>
        <mesh position={[-0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 0.08, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 0.08, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cp_glass_plates" basePos={[0, 0, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.62, 0.62, 0.28, 36]} />
          <PbrMat preset="alumina" />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.62, 0.62, 0.28, 36]} />
          <PbrMat preset="alumina" />
        </mesh>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 0.04, 32]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 0.04, 32]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cp_center_diaphragm" basePos={[centerDeflect, 0, 0]} explodeOffset={[0, -0.75, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.65, 0.65, 0.025, 36]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PiezoPressureAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="pz_flush_body" basePos={[0, 0, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.36, 0.36, 1.35, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pz_quartz_discs" basePos={[0, -0.35, 0]} explodeOffset={[-0.7, -0.15, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.1, 28]} />
          <PbrMat preset="quartz" />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.1, 28]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pz_electrode" basePos={[0, 0.05, 0]} explodeOffset={[0.7, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pz_bnc" basePos={[0, 0.88, 0]} explodeOffset={[0, 0.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.42, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function DeadWeightTesterAssembly() {
  const sim = useCadSim();
  const numWeights = Math.max(1, Math.min(7, Math.round(1 + sim.primaryNorm * 6)));

  return (
    <group>
      <CadPartGroup partId="dw_manifold_base" basePos={[0, -0.65, 0]} explodeOffset={[0, -0.55, 0]}>
        <mesh>
          <boxGeometry args={[2.3, 0.34, 1.05]} />
          <PbrMat preset="castIron" />
        </mesh>
        <mesh position={[0.72, 0.26, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.35, 24]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dw_screw_pump" basePos={[0.85, -0.3, 0]} explodeOffset={[0.8, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.65, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.08, 24]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dw_piston_cylinder" basePos={[-0.55, -0.1, 0]} explodeOffset={[-0.7, 0.1, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 0.8, 28]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dw_mass_discs" basePos={[-0.55, 0.48, 0]} explodeOffset={[-0.55, 0.85, 0]}>
        <mesh position={[0, -0.58, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.92, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
        {Array.from({ length: numWeights }, (_, i) => (
          <mesh key={i} position={[0, i * 0.11, 0]}>
            <cylinderGeometry args={[0.42 - i * 0.025, 0.42 - i * 0.025, 0.09, 32]} />
            <PbrMat preset="ss316" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="dw_uut_gauge" basePos={[0.38, 0.32, 0]} explodeOffset={[0.45, 0.75, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.45, 18]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.2, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ManometerAssembly() {
  const sim = useCadSim();
  const scaleTex = useMemo(() => buildVerticalScaleTexture('mm Δh', 0, 500, 5), []);
  useEffect(() => () => scaleTex.dispose(), [scaleTex]);

  const shift = (sim.primaryNorm - 0.5) * 1.1;
  const fluidPreset = sim.secondaryNorm > 0.5 ? 'mercury' : 'blueLiquid';

  return (
    <group>
      <CadPartGroup partId="mn_backboard" basePos={[0, 0, -0.14]} explodeOffset={[0, 0, -0.7]}>
        <mesh>
          <boxGeometry args={[1.18, 2.35, 0.1]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.36, 2.05]} />
          <meshStandardMaterial map={scaleTex} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mn_u_glass" basePos={[0, 0.05, 0.04]} explodeOffset={[0, 0.4, 0.5]} isCutawayShell>
        <mesh position={[-0.32, 0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.85, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0.32, 0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.85, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.78, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.32, 0.1, 14, 24, Math.PI]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mn_liquid_columns" basePos={[0, 0, 0.04]} explodeOffset={[0, -0.2, 0.7]}>
        <mesh position={[-0.32, -0.25 - shift * 0.45, 0]}>
          <cylinderGeometry args={[0.075, 0.075, Math.max(0.2, 1.0 - shift), 20]} />
          <PbrMat preset={fluidPreset} />
        </mesh>
        <mesh position={[0.32, -0.25 + shift * 0.45, 0]}>
          <cylinderGeometry args={[0.075, 0.075, Math.max(0.2, 1.0 + shift), 20]} />
          <PbrMat preset={fluidPreset} />
        </mesh>
        <mesh position={[0, -0.74, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.32, 0.075, 12, 24, Math.PI]} />
          <PbrMat preset={fluidPreset} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mn_barbs" basePos={[0, 1.15, 0.04]} explodeOffset={[0, 0.8, 0]}>
        <mesh position={[-0.32, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.11, 0.25, 16]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.32, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.11, 0.25, 16]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function VacuumGaugeAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="vg_kf_manifold" basePos={[0, -0.78, 0]} explodeOffset={[0, -0.65, 0]}>
        <FlangeWithBolts outerR={0.55} innerR={0.22} thickness={0.14} boltCount={6} />
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.18, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vg_pirani_tube" basePos={[-0.45, 0.25, 0]} explodeOffset={[-0.65, 0.35, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 1.25, 28]} />
          <PbrMat preset="glass" />
        </mesh>
        <HelicalTube radius={0.07} height={0.85} turns={8} tubeRadius={0.015} preset="gold" />
      </CadPartGroup>

      <CadPartGroup partId="vg_pirani_filament" basePos={[-0.45, 0.25, 0]} explodeOffset={[-0.65, 0.75, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.9, 14]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vg_mcleod_bulb" basePos={[0.48, 0.25, 0]} explodeOffset={[0.65, 0.35, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.85, 18]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.25 + sim.primaryNorm * 0.25, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.45, 14]} />
          <PbrMat preset="mercury" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function renderPressureForceModel(key: string) {
  switch (key) {
    case 'strain-gauge':
      return <StrainGaugeAssembly />;
    case 'load-cell':
      return <LoadCellAssembly />;
    case 'torque-transducer':
      return <TorqueTransducerAssembly />;
    case 'bourdon-tube':
      return <BourdonGaugeAssembly />;
    case 'diaphragm':
      return <DiaphragmAssembly />;
    case 'bellows':
      return <BellowsAssembly />;
    case 'strain-pressure':
      return <StrainPressureAssembly />;
    case 'cap-pressure':
      return <CapacitivePressureAssembly />;
    case 'piezo-sensor':
      return <PiezoPressureAssembly />;
    case 'deadweight-tester':
      return <DeadWeightTesterAssembly />;
    case 'manometer':
      return <ManometerAssembly />;
    case 'vacuum-gauge':
      return <VacuumGaugeAssembly />;
    default:
      return null;
  }
}

