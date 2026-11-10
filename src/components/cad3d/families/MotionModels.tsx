import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim } from '../CadPart';
import { HelicalTube, PbrMat } from '../primitives';

export function LvdtAssembly() {
  const sim = useCadSim();
  const coreShift = (sim.primaryNorm - 0.5) * 0.9;

  return (
    <group>
      <CadPartGroup partId="lvdt_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.8, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.58, 0.58, 2.3, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lvdt_former" basePos={[0, 0, 0]} explodeOffset={[0, -0.75, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 2.1, 32]} />
          <PbrMat preset="peek" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lvdt_primary" basePos={[0, 0, 0]} explodeOffset={[0, 0.55, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.44, 0.52, 32]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lvdt_sec_s1" basePos={[-0.65, 0, 0]} explodeOffset={[-0.65, 0.45, 0.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.44, 0.55, 32]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lvdt_sec_s2" basePos={[0.65, 0, 0]} explodeOffset={[0.65, 0.45, 0.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.44, 0.55, 32]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="lvdt_core_rod" basePos={[coreShift, 0, 0]} explodeOffset={[0, 0, 0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.17, 0.17, 0.95, 28]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 1.35, 20]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function PotentiometerAssembly() {
  const sim = useCadSim();
  const wiperX = (sim.primaryNorm - 0.5) * 1.65;

  return (
    <group>
      <CadPartGroup partId="pot_housing" basePos={[0, 0, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[2.3, 0.44, 0.62]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pot_track" basePos={[0, 0.14, 0]} explodeOffset={[0, 0.25, -0.4]}>
        <mesh>
          <boxGeometry args={[1.95, 0.08, 0.28]} />
          <PbrMat preset="alumina" colorOverride="#9a3412" />
        </mesh>
        {[-0.95, 0.95].map((x, idx) => (
          <mesh key={idx} position={[x, 0.08, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.15, 14]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="pot_wiper_rod" basePos={[wiperX, 0.34, 0]} explodeOffset={[0, 0.75, 0.35]}>
        <mesh>
          <boxGeometry args={[0.28, 0.22, 0.34]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[-0.9, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 1.8, 18]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function VariableInductanceAssembly() {
  const sim = useCadSim();
  const gapShift = 0.2 + sim.primaryNorm * 0.48;

  return (
    <group>
      <CadPartGroup partId="vi_e_core" basePos={[-0.45, 0, 0]} explodeOffset={[-0.6, 0, 0]}>
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.25, 1.35, 0.6]} />
          <PbrMat preset="ssDark" />
        </mesh>
        {[-0.55, 0, 0.55].map((y, idx) => (
          <mesh key={idx} position={[0.1, y, 0]}>
            <boxGeometry args={[0.8, 0.22, 0.6]} />
            <PbrMat preset="ssDark" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="vi_coil" basePos={[-0.32, 0, 0]} explodeOffset={[0, 0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.52, 0.58, 0.76]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vi_armature" basePos={[gapShift, 0, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 1.35, 0.6]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.9, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function CapacitiveDisplacementAssembly() {
  const sim = useCadSim();
  const plateY = 0.08 + sim.primaryNorm * 0.45;

  return (
    <group>
      <CadPartGroup partId="cd_guard_ring" basePos={[0, -0.32, 0]} explodeOffset={[0, -0.65, 0]}>
        <mesh>
          <cylinderGeometry args={[0.82, 0.82, 0.16, 40]} />
          <PbrMat preset="alumina" />
        </mesh>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 0.06, 40]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cd_sense_plate" basePos={[0, -0.18, 0]} explodeOffset={[-0.65, -0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.48, 0.48, 0.08, 36]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cd_target_plate" basePos={[0, plateY, 0]} explodeOffset={[0, 0.65, 0]}>
        <mesh>
          <cylinderGeometry args={[0.68, 0.68, 0.1, 36]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 1.0, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 1.08, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.24, 24]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function OpticalEncoderAssembly() {
  const sim = useCadSim();
  const discRef = useRef<THREE.Group>(null);
  const discTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#e2e8f0';
    for (let i = 0; i < 36; i++) {
      if (i % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo(256, 256);
        ctx.arc(256, 256, 240, (i * Math.PI) / 18, ((i + 1) * Math.PI) / 18);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(256, 256, 85, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => discTex.dispose(), [discTex]);

  useFrame((_, delta) => {
    if (discRef.current) {
      discRef.current.rotation.z += delta * (0.6 + sim.primaryNorm * 7.5);
    }
  });

  return (
    <group>
      <CadPartGroup partId="oe_housing" basePos={[0, 0, -0.15]} explodeOffset={[0, 0, -0.85]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.92, 0.92, 0.65, 40]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="oe_code_wheel" basePos={[0, 0, 0]} explodeOffset={[0, 0.45, 0.45]}>
        <group ref={discRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.76, 0.76, 0.04, 48]} />
            <meshStandardMaterial map={discTex} roughness={0.2} metalness={0.35} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 1.3, 24]} />
            <PbrMat preset="chrome" />
          </mesh>
        </group>
      </CadPartGroup>

      <CadPartGroup partId="oe_led_array" basePos={[0, 0.58, 0.14]} explodeOffset={[0, 0.85, 0.4]}>
        <mesh>
          <boxGeometry args={[0.42, 0.16, 0.18]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh userData={{ selfEmissive: true }} position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="oe_photodetector" basePos={[0, 0.58, -0.14]} explodeOffset={[0, -0.65, -0.35]}>
        <mesh>
          <boxGeometry args={[0.44, 0.22, 0.18]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function TachogeneratorAssembly() {
  const sim = useCadSim();
  const rotorRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x += delta * (0.4 + sim.primaryNorm * 10);
    }
  });

  return (
    <group>
      <CadPartGroup partId="tg_stator_shell" basePos={[0, 0, 0]} explodeOffset={[0, 0.75, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 1.55, 36]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tg_pm_poles" basePos={[0, 0, 0]} explodeOffset={[0, 0.35, -0.6]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.95, 0.18, 0.6]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.95, 0.18, 0.6]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tg_armature" basePos={[0, 0, 0]} explodeOffset={[0, 0, 0.85]}>
        <group ref={rotorRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.82, 16]} />
            <PbrMat preset="copper" />
          </mesh>
          <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.25, 24]} />
            <PbrMat preset="gold" />
          </mesh>
          <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 1.45, 20]} />
            <PbrMat preset="chrome" />
          </mesh>
        </group>
      </CadPartGroup>

      <CadPartGroup partId="tg_brushes" basePos={[0.55, 0, 0]} explodeOffset={[0.85, 0.45, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.18, 0.2, 0.14]} />
          <PbrMat preset="rubber" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.18, 0.2, 0.14]} />
          <PbrMat preset="rubber" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function AccelerometerAssembly() {
  const sim = useCadSim();
  const massRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (massRef.current) {
      const freq = 6 + sim.secondaryNorm * 14;
      const amp = 0.03 + sim.primaryNorm * 0.11;
      massRef.current.position.y = Math.sin(clock.elapsedTime * freq) * amp;
    }
  });

  return (
    <group>
      <CadPartGroup partId="acc_hex_case" basePos={[0, 0, 0]} explodeOffset={[0, 0.85, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.58, 0.58, 1.05, 6]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="acc_pzt_crystals" basePos={[0, -0.18, 0]} explodeOffset={[-0.7, -0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.36, 0.36, 0.22, 28]} />
          <PbrMat preset="alumina" colorOverride="#facc15" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="acc_seismic_mass" basePos={[0, 0.14, 0]} explodeOffset={[0.7, 0.25, 0]}>
        <group ref={massRef}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.36, 32]} />
            <PbrMat preset="brass" />
          </mesh>
        </group>
      </CadPartGroup>

      <CadPartGroup partId="acc_preload_spring" basePos={[0, 0.42, 0]} explodeOffset={[0, 0.55, 0.4]}>
        <HelicalTube radius={0.22} height={0.22} turns={3} tubeRadius={0.025} preset="ssDark" />
      </CadPartGroup>

      <CadPartGroup partId="acc_connector" basePos={[0, 0.72, 0]} explodeOffset={[0, 1.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.4, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function VelocityPickupAssembly() {
  const sim = useCadSim();
  const magRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (magRef.current) {
      magRef.current.position.y = Math.sin(clock.elapsedTime * 7) * (0.04 + sim.primaryNorm * 0.14);
    }
  });

  return (
    <group>
      <CadPartGroup partId="vp_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.8, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.65, 0.65, 1.45, 36]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vp_pickup_coil" basePos={[0, 0, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.48, 0.48, 0.65, 32]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="vp_suspended_magnet" basePos={[0, 0, 0]} explodeOffset={[-0.7, 0.2, 0]}>
        <group ref={magRef}>
          <mesh>
            <cylinderGeometry args={[0.25, 0.25, 0.62, 28]} />
            <PbrMat preset="alnicoRed" />
          </mesh>
          <HelicalTube position={[0, 0.42, 0]} radius={0.22} height={0.28} turns={4} tubeRadius={0.018} preset="bronze" />
          <HelicalTube position={[0, -0.42, 0]} radius={0.22} height={0.28} turns={4} tubeRadius={0.018} preset="bronze" />
        </group>
      </CadPartGroup>
    </group>
  );
}

export function renderMotionModel(key: string) {
  switch (key) {
    case 'lvdt':
      return <LvdtAssembly />;
    case 'potentiometer':
      return <PotentiometerAssembly />;
    case 'var-inductance':
      return <VariableInductanceAssembly />;
    case 'cap-displacement':
      return <CapacitiveDisplacementAssembly />;
    case 'optical-encoder':
      return <OpticalEncoderAssembly />;
    case 'tachogenerator':
      return <TachogeneratorAssembly />;
    case 'accelerometer':
      return <AccelerometerAssembly />;
    case 'velocity-pickup':
      return <VelocityPickupAssembly />;
    default:
      return null;
  }
}
