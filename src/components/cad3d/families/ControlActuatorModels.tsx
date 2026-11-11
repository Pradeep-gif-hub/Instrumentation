import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim, useInstrumentFinish } from '../CadPart';
import { buildDialFaceTexture, buildLcdDisplayTexture } from '../materials';
import { DialPointer, FlangeWithBolts, HelicalTube, PbrMat } from '../primitives';

export function ControlValveAssembly() {
  const sim = useCadSim();
  const stemLift = sim.primaryNorm * 0.28;

  return (
    <group>
      <CadPartGroup partId="cv_globe_body" basePos={[0, -0.72, 0]} explodeOffset={[0, -0.75, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 1.8, 32]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <FlangeWithBolts outerR={0.62} innerR={0.34} thickness={0.12} boltCount={8} position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.62} innerR={0.34} thickness={0.12} boltCount={8} position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      </CadPartGroup>

      <CadPartGroup partId="cv_plug_stem" basePos={[0, -0.22 + stemLift, 0]} explodeOffset={[0, 0.35, 0.7]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.14, 0.24, 0.36, 28]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 1.35, 20]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cv_yoke" basePos={[0, 0.12, 0]} explodeOffset={[-0.65, 0.35, 0]}>
        <mesh position={[-0.24, 0, 0]}>
          <boxGeometry args={[0.1, 0.92, 0.2]} />
          <PbrMat preset="castIron" />
        </mesh>
        <mesh position={[0.24, 0, 0]}>
          <boxGeometry args={[0.1, 0.92, 0.2]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="cv_actuator" basePos={[0, 0.98, 0]} explodeOffset={[0, 0.95, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.88, 0.88, 0.32, 36]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <HelicalTube position={[0, -0.22, 0]} radius={0.18} height={0.32} turns={4} tubeRadius={0.025} preset="brass" />
      </CadPartGroup>
    </group>
  );
}

export function PneumaticActuatorAssembly() {
  const sim = useCadSim();
  const pistonOffset = 0.22 + sim.primaryNorm * 0.42;
  const pinionAngle = -sim.primaryNorm * (Math.PI / 2);

  return (
    <group>
      <CadPartGroup partId="pa_body" basePos={[0, 0, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.56, 0.56, 2.35, 36]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pa_pistons" basePos={[0, 0, 0]} explodeOffset={[0, 0.55, 0.4]}>
        <mesh position={[-pistonOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 28]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[pistonOffset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.32, 28]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pa_pinion" basePos={[0, 0.15, 0]} rotation={[0, pinionAngle, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 1.35, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[0.45, 0.12, 0.16]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function SmartPositionerAssembly() {
  const sim = useCadSim();
  const posPct = Math.round(sim.primaryNorm * 100);
  const lcdTex = useMemo(() => buildLcdDisplayTexture(`${posPct} % POS`, 'HART 7 · AUTO CAL'), [posPct]);
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="ps_housing" basePos={[0, 0, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.45, 1.15, 0.78]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ps_piezo_relay" basePos={[-0.35, -0.15, 0.1]} explodeOffset={[-0.75, 0, 0.45]}>
        <mesh>
          <boxGeometry args={[0.46, 0.48, 0.44]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ps_cam_arm" basePos={[-0.95, 0, 0]} rotation={[0, 0, -0.35 + sim.primaryNorm * 0.7]} explodeOffset={[-0.95, 0, 0]}>
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.75, 0.1, 0.08]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ps_gauges" basePos={[0.35, -0.78, 0]} explodeOffset={[0.45, -0.65, 0]}>
        {[-0.25, 0.25].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 24]} />
            <PbrMat preset="ss316" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="ps_lcd" basePos={[0.15, 0.12, 0.41]} explodeOffset={[0, 0.45, 0.8]}>
        <mesh>
          <planeGeometry args={[0.85, 0.48]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function IpConverterAssembly() {
  const sim = useCadSim();
  const flapTilt = (sim.primaryNorm - 0.5) * 0.12;
  const psiTex = useMemo(
    () => buildDialFaceTexture({ title: 'I/P OUT', unit: 'psi', min: 3, max: 15, majorTicks: 4 }),
    [],
  );
  useEffect(() => () => psiTex.dispose(), [psiTex]);

  return (
    <group>
      <CadPartGroup partId="ip_housing" basePos={[0, 0, -0.15]} explodeOffset={[0, -0.5, -0.6]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.65, 1.35, 0.92]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ip_flapper" basePos={[-0.25, 0.15, 0.15]} rotation={[0, 0, flapTilt]} explodeOffset={[-0.65, 0.45, 0.4]}>
        <mesh>
          <boxGeometry args={[0.82, 0.1, 0.18]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[-0.32, 0.22, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.3, 22]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ip_nozzle" basePos={[0.1, -0.12, 0.15]} explodeOffset={[0.4, -0.45, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.14, 0.34, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ip_gauge" basePos={[0.98, 0.2, 0.1]} explodeOffset={[0.85, 0.35, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.18, 30]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.02, 30]} />
          <meshStandardMaterial map={psiTex} />
        </mesh>
        <DialPointer angleRad={THREE.MathUtils.degToRad(225 - sim.primaryNorm * 270)} length={0.28} centerOffset={[0, 0, 0.12]} />
      </CadPartGroup>
    </group>
  );
}

export function SolenoidValveAssembly() {
  const sim = useCadSim();
  const energized = sim.primaryNorm >= 0.5;
  const plungerLift = energized ? 0.22 : 0;

  return (
    <group>
      <CadPartGroup partId="sv_manifold" basePos={[0, -0.48, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.55, 0.68, 0.72]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        {[-0.45, 0, 0.45].map((x, idx) => (
          <mesh key={idx} position={[x, -0.42, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.24, 18]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="sv_coil" basePos={[0, 0.42, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[0.86, 0.86, 0.86]} />
          <PbrMat preset={energized ? 'alnicoRed' : 'blueHousing'} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.75, 24]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sv_plunger" basePos={[0, 0.05 + plungerLift, 0]} explodeOffset={[0.7, 0.35, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.14, 0.82, 24]} />
          <PbrMat preset="chrome" />
        </mesh>
        <HelicalTube position={[0, -0.45, 0]} radius={0.14} height={0.25} turns={3} tubeRadius={0.02} preset="ssDark" />
      </CadPartGroup>
    </group>
  );
}

export function SpoolValveAssembly() {
  const sim = useCadSim();
  const spoolX = (sim.primaryNorm - 0.5) * 0.48;

  return (
    <group>
      <CadPartGroup partId="spv_block" basePos={[0, 0, 0]} explodeOffset={[0, -0.55, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.95, 0.95, 0.88]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="spv_spool" basePos={[spoolX, 0.08, 0]} explodeOffset={[0, 0.75, 0.45]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.8, 22]} />
          <PbrMat preset="chrome" />
        </mesh>
        {[-0.48, 0, 0.48].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.24, 24]} />
            <PbrMat preset="ss316" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="spv_solenoids" basePos={[0, 0.08, 0]} explodeOffset={[-0.7, 0, 0]}>
        <mesh position={[-1.25, 0, 0]}>
          <boxGeometry args={[0.52, 0.58, 0.58]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[1.25, 0, 0]}>
          <boxGeometry args={[0.52, 0.58, 0.58]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function StepperMotorAssembly() {
  const sim = useCadSim();
  const rotorAngle = sim.primaryValue * (Math.PI / 12);

  return (
    <group>
      <CadPartGroup partId="st_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.45, 1.45, 1.25]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="st_stator_poles" basePos={[0, 0, 0]} explodeOffset={[0, 0, -0.7]}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.48, Math.sin(a) * 0.48, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.26, 0.16, 0.85]} />
              <PbrMat preset="copper" />
            </mesh>
          );
        })}
      </CadPartGroup>

      <CadPartGroup partId="st_rotor" basePos={[0, 0, 0]} rotation={[0, 0, rotorAngle]} explodeOffset={[0, 0, 0.85]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.85, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0, 0.68]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.85, 18]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ServomotorAssembly() {
  const sim = useCadSim();
  const rotorRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.x += delta * (0.5 + sim.primaryNorm * 12);
    }
  });

  return (
    <group>
      <CadPartGroup partId="sm_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.75, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.68, 0.68, 1.75, 32]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="sm_rotor" basePos={[0, 0, 0]} explodeOffset={[0, 0, 0.85]}>
        <group ref={rotorRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 1.05, 24]} />
            <PbrMat preset="copper" />
          </mesh>
          <mesh position={[-1.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 18]} />
            <PbrMat preset="chrome" />
          </mesh>
        </group>
      </CadPartGroup>

      <CadPartGroup partId="sm_encoder" basePos={[0.98, 0, 0]} explodeOffset={[0.85, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.45, 0.45, 0.35, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ProcessControllerAssembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const pv = Math.round(50 + sim.primaryNorm * 120);
  const out = Math.min(100, Math.max(0, Math.round((150 - pv) * 1.4)));
  const lcdTex = useMemo(
    () => buildLcdDisplayTexture(`PV ${pv}°C`, `SP 150°C · OUT ${out}%`, '#102436', finish.roles.ceramic.color),
    [pv, out, finish.roles.ceramic.color],
  );
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="pc_chassis" basePos={[0, 0, -0.15]} explodeOffset={[0, 0, -0.65]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.35, 1.35, 1.45]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pc_display" basePos={[0, 0, 0.62]} explodeOffset={[0, 0.4, 0.75]}>
        <mesh>
          <boxGeometry args={[1.42, 1.42, 0.14]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, 0.14, 0.08]}>
          <planeGeometry args={[1.15, 0.78]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pc_io_cards" basePos={[0, 0, -0.25]} explodeOffset={[0.75, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.08, 1.05, 1.05]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function VfdDriveAssembly() {
  const sim = useCadSim();
  const freqHz = (10 + sim.primaryNorm * 50).toFixed(1);
  const rpm = Math.round(Number(freqHz) * 30);
  const lcdTex = useMemo(
    () => buildLcdDisplayTexture('PWM VFD · V/f DRIVE', `${freqHz} Hz`, `${rpm} RPM · RUN`),
    [freqHz, rpm],
  );
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="vfd_chassis" basePos={[0, 0, -0.32]} explodeOffset={[0, 0, -0.75]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.38, 1.95, 0.52]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        {[-0.48, -0.24, 0, 0.24, 0.48].map((x) => (
          <mesh key={x} position={[x, 0, -0.3]}>
            <boxGeometry args={[0.06, 1.82, 0.16]} />
            <PbrMat preset="ss316" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="vfd_dc_bus_igbt" basePos={[0, 0, 0.05]} explodeOffset={[0, 0, 0.15]}>
        <mesh position={[-0.32, 0.36, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.56, 20]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0.05, 0.36, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.56, 20]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.92, 0.5, 0.16]} />
          <PbrMat preset="alumina" />
        </mesh>
        {[-0.28, 0, 0.28].map((x) => (
          <mesh key={x} position={[x, -0.72, 0.05]}>
            <boxGeometry args={[0.12, 0.34, 0.06]} />
            <PbrMat preset="copper" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="vfd_keypad" basePos={[0, 0, 0.42]} explodeOffset={[0, 0, 0.78]}>
        <mesh>
          <boxGeometry args={[1.32, 1.88, 0.14]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, 0.36, 0.08]}>
          <planeGeometry args={[0.96, 0.56]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
        <mesh position={[-0.26, -0.35, 0.08]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 18]} />
          <PbrMat preset="blueLiquid" />
        </mesh>
        <mesh position={[0.26, -0.35, 0.08]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 18]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function renderControlActuatorModel(key: string) {
  switch (key) {
    case 'control-valve':
      return <ControlValveAssembly />;
    case 'pneumatic-actuator':
      return <PneumaticActuatorAssembly />;
    case 'smart-positioner':
      return <SmartPositionerAssembly />;
    case 'ip-converter':
      return <IpConverterAssembly />;
    case 'solenoid-valve':
      return <SolenoidValveAssembly />;
    case 'spool-valve':
      return <SpoolValveAssembly />;
    case 'stepper-motor':
      return <StepperMotorAssembly />;
    case 'servomotor':
      return <ServomotorAssembly />;
    case 'process-controller':
      return <ProcessControllerAssembly />;
    case 'vfd-drive':
      return <VfdDriveAssembly />;
    default:
      return null;
  }
}

