import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim, useInstrumentFinish } from '../CadPart';
import { buildLcdDisplayTexture, wavelengthToHex } from '../materials';
import { HelicalTube, PbrMat } from '../primitives';

export function UvVisAssembly() {
  const sim = useCadSim();
  const wavelengthNm = Math.round(sim.primaryValue || 520);
  const beamColor = wavelengthToHex(wavelengthNm);
  const sampleOpacity = Math.max(0.15, 0.92 * Math.exp(-sim.secondaryNorm * 1.8));
  const gratingRot = -0.35 + sim.primaryNorm * 0.7;
  const chopperRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (chopperRef.current) chopperRef.current.rotation.z += delta * 6.0;
  });

  return (
    <group>
      <CadPartGroup partId="uv_bench" basePos={[0, -0.42, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.75, 0.35, 1.65]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uv_lamp" basePos={[-1.08, 0.08, -0.45]} explodeOffset={[-0.65, 0.45, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.48, 22]} />
          <PbrMat preset="quartz" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uv_grating" basePos={[-0.38, 0.12, -0.48]} rotation={[0, gratingRot, 0]} explodeOffset={[-0.3, 0.75, -0.35]}>
        <mesh>
          <boxGeometry args={[0.38, 0.44, 0.08]} />
          <PbrMat preset="chrome" />
        </mesh>
        {[-0.12, -0.04, 0.04, 0.12].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0.045]}>
            <boxGeometry args={[0.025, 0.38, 0.01]} />
            <PbrMat preset="alnicoRed" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="uv_chopper" basePos={[0.05, 0.1, -0.1]} explodeOffset={[0, 0.85, 0]}>
        <mesh ref={chopperRef}>
          <cylinderGeometry args={[0.28, 0.28, 0.03, 12]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uv_cuvettes" basePos={[0.45, 0.08, 0.25]} explodeOffset={[0, 0.55, 0.65]}>
        {/* Sample Cuvette */}
        <mesh position={[-0.25, 0, 0.15]}>
          <boxGeometry args={[0.24, 0.56, 0.24]} />
          <PbrMat preset="quartz" />
        </mesh>
        {/* Reference Blank Cuvette */}
        <mesh position={[-0.25, 0, -0.35]}>
          <boxGeometry args={[0.24, 0.56, 0.24]} />
          <PbrMat preset="quartz" />
        </mesh>
        {/* Optical Sample Beam (attenuated by concentration) */}
        <mesh position={[-0.1, 0, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.35, 14]} />
          <meshStandardMaterial color={beamColor} transparent opacity={sampleOpacity} roughness={0.35} />
        </mesh>
        {/* Reference Beam (100% T) */}
        <mesh position={[-0.1, 0, -0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.35, 14]} />
          <meshStandardMaterial color={beamColor} transparent opacity={0.85} roughness={0.35} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="uv_detector" basePos={[1.08, 0.08, -0.05]} explodeOffset={[0.65, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ColorimeterAssembly() {
  const sim = useCadSim();
  const beamColor = wavelengthToHex(420 + sim.primaryNorm * 260);

  return (
    <group>
      <CadPartGroup partId="col_housing" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.1, 0.65, 1.2]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="col_lamp" basePos={[-0.75, 0.15, 0]} explodeOffset={[-0.6, 0.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.16, 20, 20]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="col_filter_wheel" basePos={[-0.25, 0.15, 0]} rotation={[sim.primaryNorm * Math.PI, 0, Math.PI / 2]} explodeOffset={[-0.2, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.04, 24]} />
          <meshStandardMaterial color={beamColor} transparent opacity={0.75} roughness={0.15} />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="col_cuvette" basePos={[0.3, 0.2, 0]} explodeOffset={[0.2, 0.75, 0.35]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.72, 24]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="col_detector" basePos={[0.78, 0.15, 0]} explodeOffset={[0.65, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.18, 0.38, 0.38]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function FtirAssembly() {
  const sim = useCadSim();
  const scanRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (scanRef.current) {
      scanRef.current.position.x = 0.72 + Math.sin(clock.elapsedTime * 3.5) * (0.06 + sim.primaryNorm * 0.15);
    }
  });

  return (
    <group>
      <CadPartGroup partId="ft_bench" basePos={[0, -0.35, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.5, 0.32, 1.75]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ft_globar" basePos={[-0.95, 0.12, 0]} explodeOffset={[-0.65, 0.4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.42, 20]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ft_beamsplitter" basePos={[0, 0.12, 0]} rotation={[0, Math.PI / 4, 0]} explodeOffset={[0, 0.8, 0]}>
        <mesh>
          <boxGeometry args={[0.58, 0.5, 0.05]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ft_fixed_mirror" basePos={[0, 0.12, -0.68]} explodeOffset={[0, 0.4, -0.75]}>
        <mesh>
          <boxGeometry args={[0.48, 0.48, 0.08]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ft_scan_mirror" basePos={[0.72, 0.12, 0]} explodeOffset={[0.75, 0.4, 0]}>
        <group ref={scanRef}>
          <mesh>
            <boxGeometry args={[0.08, 0.48, 0.48]} />
            <PbrMat preset="gold" />
          </mesh>
        </group>
      </CadPartGroup>
      <CadPartGroup partId="ft_detector" basePos={[0, 0.12, 0.68]} explodeOffset={[0, 0.4, 0.75]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.35, 22]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function FlameAasAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="fa_hcl" basePos={[-1.05, 0.35, 0]} explodeOffset={[-0.75, 0.4, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.72, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.85, 12]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fa_burner" basePos={[0, -0.35, 0]} explodeOffset={[0, -0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.95, 0.45, 0.42]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.72, 0.52, 0.1]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fa_monochromator" basePos={[1.05, 0.25, 0]} explodeOffset={[0.75, 0.4, 0]}>
        <mesh>
          <boxGeometry args={[0.65, 0.75, 0.65]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function GcChromatographAssembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const ovenGlow = `#${new THREE.Color(finish.roles.primaryBody.color).lerp(new THREE.Color(finish.roles.sensing.color), sim.primaryNorm).getHexString()}`;

  return (
    <group>
      <CadPartGroup partId="gc_oven" basePos={[0, 0, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 1.55, 1.35]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="gc_column" basePos={[0, -0.08, 0.05]} explodeOffset={[0, 0.2, 0.85]}>
        <mesh>
          <torusGeometry args={[0.48, 0.035, 14, 48]} />
          <meshStandardMaterial color={ovenGlow} metalness={0.18} roughness={0.55} />
        </mesh>
        <HelicalTube radius={0.44} height={0.42} turns={6} tubeRadius={0.02} preset="copper" />
      </CadPartGroup>

      <CadPartGroup partId="gc_injector" basePos={[-0.55, 0.95, 0.2]} explodeOffset={[-0.55, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.14, 0.45, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="gc_detector" basePos={[0.55, 0.98, 0.2]} explodeOffset={[0.55, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.52, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="gc_carrier" basePos={[-1.25, -0.1, 0]} explodeOffset={[-0.85, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 1.4, 24]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function HplcIcAssembly() {
  return (
    <group>
      <CadPartGroup partId="hp_chassis" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.45, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 1.35, 1.15]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="hp_reservoirs" basePos={[-0.35, 0.82, -0.1]} explodeOffset={[-0.6, 0.85, 0]}>
        <mesh position={[-0.25, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.65, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.65, 24]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="hp_pump" basePos={[-0.45, -0.2, 0.25]} explodeOffset={[-0.7, 0, 0.6]}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.5]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="hp_column" basePos={[0.25, 0.05, 0.35]} explodeOffset={[0.4, 0.55, 0.65]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 1.15, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="hp_uv_cell" basePos={[0.62, 0.25, 0.25]} explodeOffset={[0.75, 0.4, 0.4]}>
        <mesh>
          <boxGeometry args={[0.36, 0.48, 0.36]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function MassSpecAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="ms_chamber" basePos={[0, 0, 0]} explodeOffset={[0, 0.75, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.58, 0.58, 2.3, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ms_ion_source" basePos={[-0.85, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.35, 22]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ms_quadrupole" basePos={[0.02, 0, 0]} explodeOffset={[0, 0, 0.75]}>
        {[
          [0, 0.22, 0.22],
          [0, 0.22, -0.22],
          [0, -0.22, 0.22],
          [0, -0.22, -0.22],
        ].map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.075, 0.075, 1.15, 20]} />
            <PbrMat preset="chrome" />
          </mesh>
        ))}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 1.35, 12]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ms_detector" basePos={[0.92, 0, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.26, 0.35, 22]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PhElectrodeAssembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const phVal = sim.primaryValue.toFixed(2);
  const mvVal = ((7 - sim.primaryValue) * 59.16).toFixed(1);
  const lcdTex = useMemo(() => buildLcdDisplayTexture(`pH ${phVal}`, `${mvVal} mV · ATC 25°C`), [phVal, mvVal]);
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="ph_beaker" basePos={[0, -0.58, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.72, 0.72, 1.05, 36]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.76, 32]} />
          <PbrMat
            preset="blueLiquid"
            colorOverride={
              sim.primaryValue < 6.5
                ? finish.roles.sensing.color
                : sim.primaryValue > 7.5
                  ? finish.roles.structural.color
                  : finish.roles.primaryBody.color
            }
          />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ph_reference_atc" basePos={[0, 0.15, 0]} explodeOffset={[0, 0.45, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 1.65, 28]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.4, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0.08, -0.1, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.3, 14]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ph_glass_bulb" basePos={[0, -0.78, 0]} explodeOffset={[0, -0.25, 0.55]}>
        <mesh>
          <sphereGeometry args={[0.18, 28, 28]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ph_meter_lcd" basePos={[0.92, 0.68, 0]} explodeOffset={[0.75, 0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.85, 0.56, 0.25]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, 0, 0.135]}>
          <planeGeometry args={[0.75, 0.42]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ConductivityToroidalAssembly() {
  return (
    <group>
      <CadPartGroup partId="cd_peek_body" basePos={[0, 0, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.95, 24]} />
          <PbrMat preset="peek" />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <torusGeometry args={[0.52, 0.22, 20, 40]} />
          <PbrMat preset="peek" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cd_toroids" basePos={[0, -0.25, 0]} explodeOffset={[0, -0.65, 0.6]}>
        <mesh position={[0, 0, -0.07]}>
          <torusGeometry args={[0.52, 0.1, 16, 36]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <torusGeometry args={[0.52, 0.1, 16, 36]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function DoClarkAssembly() {
  return (
    <group>
      <CadPartGroup partId="do_body" basePos={[0, 0.1, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 1.55, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="do_electrodes" basePos={[0, -0.25, 0]} explodeOffset={[-0.55, 0, 0.45]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.85, 20]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="do_membrane" basePos={[0, -0.78, 0]} explodeOffset={[0, -0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.27, 0.27, 0.22, 32]} />
          <PbrMat preset="ptfe" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function TurbidityAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="tb_cell" basePos={[0, 0, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.45, 0.45, 1.35, 32]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 1.05, 28]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="tb_led" basePos={[-0.95, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.42, 22]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.72, 14]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="tb_ref_0deg" basePos={[0.92, 0, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.24, 0.42, 0.42]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="tb_scatter_90deg" basePos={[0, 0, 0.92]} explodeOffset={[0, 0, 0.75]}>
        <mesh>
          <boxGeometry args={[0.42, 0.42, 0.24]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ParamagneticO2Assembly() {
  const sim = useCadSim();
  const twist = sim.primaryNorm * 0.42;

  return (
    <group>
      <CadPartGroup partId="po_magnet" basePos={[0, 0, -0.1]} explodeOffset={[0, -0.55, -0.5]} isCutawayShell>
        <mesh position={[-0.75, 0, 0]}>
          <boxGeometry args={[0.34, 1.35, 0.8]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
        <mesh position={[0.75, 0, 0]}>
          <boxGeometry args={[0.34, 1.35, 0.8]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="po_dumbbell" basePos={[0, 0, 0]} rotation={[0, twist, 0]} explodeOffset={[0, 0.55, 0.6]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.55, 14]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.82, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[-0.4, 0, 0]}>
          <sphereGeometry args={[0.21, 24, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.21, 24, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, 0.22, 0.04]}>
          <boxGeometry args={[0.16, 0.16, 0.03]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function NdirTcdAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="nd_ir_cells" basePos={[0, 0.18, 0]} explodeOffset={[0, 0.55, 0]} isCutawayShell>
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.55, 28]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.55, 28]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="nd_chopper_ir" basePos={[-1.02, 0.18, 0]} explodeOffset={[-0.75, 0.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 0.05, 14]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="nd_tcd_block" basePos={[0, -0.62, 0]} explodeOffset={[0, -0.75, 0]}>
        <mesh>
          <boxGeometry args={[1.25, 0.42, 0.72]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 14]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PolarimeterRefractometerAssembly() {
  const sim = useCadSim();
  const rotAngle = sim.primaryNorm * 1.1;

  return (
    <group>
      <CadPartGroup partId="rp_na_lamp" basePos={[-1.18, 0.1, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.48, 22]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="rp_polarizer" basePos={[-0.65, 0.1, 0]} explodeOffset={[-0.3, 0.65, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.14, 28]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="rp_sample_tube" basePos={[0, 0.1, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.05, 28]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.96, 24]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="rp_analyzer" basePos={[0.82, 0.1, 0]} rotation={[rotAngle, 0, 0]} explodeOffset={[0.75, 0.45, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 32]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0.1, 0.38, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function NmrPhotoacousticAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="nm_cryomagnet" basePos={[-0.2, 0, 0]} explodeOffset={[-0.5, 0, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.78, 0.78, 1.85, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="nm_rf_coil" basePos={[-0.2, 0, 0]} explodeOffset={[0, 0.65, 0.6]}>
        <HelicalTube radius={0.22} height={0.95} turns={6} tubeRadius={0.024} preset="copper" />
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 1.75, 20]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="nm_pas_cell" basePos={[0.92, -0.35, 0]} explodeOffset={[0.8, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.72, 26]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.15, 20]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function MonochromatorOpticsAssembly() {
  const sim = useCadSim();
  const wavelengthNm = Math.round(sim.primaryValue || 540);
  const beamColor = wavelengthToHex(wavelengthNm);
  const gratingRot = -0.35 + (sim.primaryNorm ?? 0.5) * 0.7;

  return (
    <group>
      {/* Optical rail chassis */}
      <CadPartGroup partId="mo_chassis" basePos={[0, -0.45, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.8, 0.28, 1.55]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      {/* Light source: LED / LASER diode collimated emitter */}
      <CadPartGroup partId="mo_source" basePos={[-1.15, 0.08, -0.4]} explodeOffset={[-0.7, 0.35, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.44, 22]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <sphereGeometry args={[0.07, 14, 14]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>

      {/* Entrance slit & focusing mirror */}
      <CadPartGroup partId="mo_mirrors" basePos={[-0.45, 0.08, 0.35]} explodeOffset={[-0.35, 0.55, 0.45]}>
        <mesh rotation={[0, 0.38, 0]}>
          <boxGeometry args={[0.08, 0.44, 0.42]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0.92, 0, 0]} rotation={[0, -0.38, 0]}>
          <boxGeometry args={[0.08, 0.44, 0.42]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      {/* Rotatable Blazed Diffraction Grating */}
      <CadPartGroup partId="mo_grating" basePos={[0.02, 0.1, -0.45]} rotation={[0, gratingRot, 0]} explodeOffset={[0, 0.78, -0.4]}>
        <mesh>
          <boxGeometry args={[0.42, 0.46, 0.08]} />
          <PbrMat preset="chrome" />
        </mesh>
        {[-0.12, -0.04, 0.04, 0.12].map((x) => (
          <mesh key={x} position={[x, 0, 0.045]}>
            <boxGeometry args={[0.015, 0.42, 0.015]} />
            <meshStandardMaterial color={beamColor} roughness={0.4} metalness={0.2} />
          </mesh>
        ))}
      </CadPartGroup>

      {/* Bandpass filter wheel & lens stage */}
      <CadPartGroup partId="mo_filter_fiber" basePos={[0.58, 0.08, 0]} explodeOffset={[0.35, 0.55, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 20]} />
          <meshStandardMaterial color={beamColor} transparent opacity={0.75} />
        </mesh>
      </CadPartGroup>

      {/* Exit slit & Si Photodiode / PMT detector */}
      <CadPartGroup partId="mo_detector" basePos={[1.1, 0.08, -0.15]} explodeOffset={[0.75, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.38, 0.34]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0.14, 0.08, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={beamColor} roughness={0.4} metalness={0.2} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ElectrochemicalGasSensorAssembly() {
  const sim = useCadSim();
  const level = sim.primaryNorm ?? 0.45;

  return (
    <group>
      {/* Flameproof / cylindrical cell body */}
      <CadPartGroup partId="eg_body" basePos={[0, -0.05, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.56, 0.56, 1.12, 32]} />
          <PbrMat preset="ptfe" />
        </mesh>
      </CadPartGroup>

      {/* Top PTFE Hydrophobic Diffusion Membrane + Capillary barrier */}
      <CadPartGroup partId="eg_membrane" basePos={[0, 0.54, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 28]} />
          <PbrMat preset="alumina" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.04, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      {/* 3-Electrode stack: Sensing WE, Counter CE, Reference RE */}
      <CadPartGroup partId="eg_electrodes" basePos={[0, 0.14, 0]} explodeOffset={[0.65, 0.45, 0]}>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.05, 24]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.05, 24]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.05, 24]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      {/* Acid Electrolyte reservoir */}
      <CadPartGroup partId="eg_electrolyte" basePos={[0, -0.22, 0]} explodeOffset={[-0.65, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 0.42, 24]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
      </CadPartGroup>

      {/* Bottom Potentiostat Conditioning PCB & Pin Header */}
      <CadPartGroup partId="eg_potentiostat" basePos={[0, -0.68, 0]} explodeOffset={[0, -0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.12, 24]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.1, 0.25]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function renderAnalyticalOpticalModel(key: string) {
  switch (key) {
    case 'uv-vis':
      return <UvVisAssembly />;
    case 'colorimeter':
      return <ColorimeterAssembly />;
    case 'ftir':
      return <FtirAssembly />;
    case 'flame-aas':
      return <FlameAasAssembly />;
    case 'gc-chrom':
      return <GcChromatographAssembly />;
    case 'hplc-ic':
      return <HplcIcAssembly />;
    case 'mass-spec':
      return <MassSpecAssembly />;
    case 'ph-electrode':
      return <PhElectrodeAssembly />;
    case 'conductivity-toroidal':
      return <ConductivityToroidalAssembly />;
    case 'do-clark':
      return <DoClarkAssembly />;
    case 'turbidity':
      return <TurbidityAssembly />;
    case 'paramagnetic-o2':
      return <ParamagneticO2Assembly />;
    case 'ndir-tcd':
      return <NdirTcdAssembly />;
    case 'polarimeter-refractometer':
      return <PolarimeterRefractometerAssembly />;
    case 'nmr-photoacoustic':
      return <NmrPhotoacousticAssembly />;
    case 'monochromator-optics':
      return <MonochromatorOpticsAssembly />;
    case 'electrochemical-gas-sensor':
      return <ElectrochemicalGasSensorAssembly />;
    default:
      return null;
  }
}

