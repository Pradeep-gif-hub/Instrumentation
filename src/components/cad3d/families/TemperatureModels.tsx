import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CadPartGroup, useCadSim, useInstrumentFinish } from '../CadPart';
import { buildDialFaceTexture, buildLcdDisplayTexture } from '../materials';
import { DialPointer, FlangeWithBolts, HelicalTube, PbrMat } from '../primitives';

export function ThermistorAssembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const hotColor = useMemo(() => {
    const c = new THREE.Color(finish.roles.primaryBody.color).lerp(new THREE.Color(finish.roles.sensing.color), sim.primaryNorm);
    return `#${c.getHexString()}`;
  }, [sim.primaryNorm, finish.roles.primaryBody.color, finish.roles.sensing.color]);

  return (
    <group>
      <CadPartGroup partId="th_cable" basePos={[0, 1.35, 0]} explodeOffset={[0, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.11, 0.11, 0.65, 24]} />
          <PbrMat preset="rubber" />
        </mesh>
        <mesh position={[-0.04, -0.36, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.25, 16]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
        <mesh position={[0.04, -0.36, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.25, 16]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="th_hex_body" basePos={[0, 0.52, 0]} explodeOffset={[0.65, 0.25, 0]} isCutawayShell>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.24, 6]} />
          <PbrMat preset="brass" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.5, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="th_epoxy_collar" basePos={[0, -0.1, 0]} explodeOffset={[-0.55, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.12, 0.55, 24]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="th_dumet_leads" basePos={[0, -0.55, 0]} explodeOffset={[0.45, -0.25, 0]}>
        <mesh position={[-0.038, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.75, 14]} />
          <PbrMat preset="copper" />
        </mesh>
        <mesh position={[0.038, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.75, 14]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="th_oxide_bead" basePos={[0, -0.98, 0]} explodeOffset={[0, -0.55, 0.45]}>
        <mesh>
          <sphereGeometry args={[0.11, 28, 28]} />
          <meshStandardMaterial
            color={hotColor}
            metalness={0.18}
            roughness={0.58}
          />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="th_glass_envelope" basePos={[0, -0.88, 0]} explodeOffset={[0, -0.85, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.55, 28]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <sphereGeometry args={[0.16, 28, 20]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function BimetallicAssembly() {
  const sim = useCadSim();
  const dialTex = useMemo(
    () =>
      buildDialFaceTexture({
        title: 'BIMETAL',
        unit: '°C',
        min: -50,
        max: 250,
        majorTicks: 6,
        subtitle: 'SS316 / INVAR HELIX',
      }),
    [],
  );
  useEffect(() => () => dialTex.dispose(), [dialTex]);

  const pointerAngle = THREE.MathUtils.degToRad(225 - sim.primaryNorm * 270);

  return (
    <group>
      <CadPartGroup partId="bm_bezel" basePos={[0, 0.72, 0]} explodeOffset={[0, 0.75, 0.35]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.36, 40]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.03, 40]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bm_dial_pointer" basePos={[0, 0.72, 0.15]} explodeOffset={[0, 0.35, 0.75]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 0.02, 40]} />
          <meshStandardMaterial map={dialTex} roughness={0.5} metalness={0.05} />
        </mesh>
        <DialPointer angleRad={pointerAngle} length={0.58} centerOffset={[0, 0, 0.03]} />
      </CadPartGroup>

      <CadPartGroup partId="bm_shaft" basePos={[0, 0.05, 0]} explodeOffset={[-0.65, 0.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 1.35, 18]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bm_process_hex" basePos={[0, 0.18, 0]} explodeOffset={[0.65, 0.1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.24, 0.24, 0.2, 6]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="bm_helix" basePos={[0, -0.78, 0]} explodeOffset={[0, -0.35, 0.55]}>
        <group rotation={[0, sim.primaryNorm * 1.4, 0]}>
          <HelicalTube radius={0.095} height={0.78} turns={7} tubeRadius={0.018} preset="brass" />
        </group>
      </CadPartGroup>

      <CadPartGroup partId="bm_stem" basePos={[0, -0.68, 0]} explodeOffset={[0, -0.85, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.145, 0.145, 1.55, 28]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function FilledSystemAssembly() {
  const sim = useCadSim();
  const dialTex = useMemo(
    () =>
      buildDialFaceTexture({
        title: 'FILLED BULB',
        unit: '°C',
        min: 0,
        max: 300,
        majorTicks: 6,
        subtitle: 'CLASS II VAPOR',
      }),
    [],
  );
  useEffect(() => () => dialTex.dispose(), [dialTex]);

  const spiralGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 72; i++) {
      const t = i / 72;
      const a = t * Math.PI * 4.5;
      const r = 0.16 + t * 0.28;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, 0.028, 10, false);
  }, []);
  useEffect(() => () => spiralGeo.dispose(), [spiralGeo]);

  const pointerAngle = THREE.MathUtils.degToRad(225 - sim.primaryNorm * 270);

  return (
    <group>
      <CadPartGroup partId="fs_case" basePos={[0, 0.72, -0.08]} explodeOffset={[0, 0.75, -0.45]} isCutawayShell>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.78, 0.78, 0.34, 36]} />
          <PbrMat preset="castIron" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fs_spiral_bourdon" basePos={[0, 0.72, 0.0]} explodeOffset={[-0.75, 0.45, 0.35]}>
        <mesh geometry={spiralGeo} scale={[1 + sim.primaryNorm * 0.05, 1 + sim.primaryNorm * 0.05, 1]}>
          <PbrMat preset="bronze" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="fs_dial_pointer" basePos={[0, 0.72, 0.12]} explodeOffset={[0, 0.45, 0.75]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.02, 36]} />
          <meshStandardMaterial map={dialTex} roughness={0.5} />
        </mesh>
        <DialPointer angleRad={pointerAngle} length={0.54} centerOffset={[0, 0, 0.025]} />
      </CadPartGroup>

      <CadPartGroup partId="fs_capillary" basePos={[0, -0.05, 0]} explodeOffset={[0.7, 0, 0]}>
        <HelicalTube radius={0.22} height={0.75} turns={5} tubeRadius={0.025} preset="ss316" />
      </CadPartGroup>

      <CadPartGroup partId="fs_sensing_bulb" basePos={[0, -0.95, 0]} explodeOffset={[0, -0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.95, 28]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.18, 6]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function OpticalPyrometerAssembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const filamentColor = useMemo(() => {
    const c = new THREE.Color(finish.roles.copper.color).lerp(
      new THREE.Color(finish.roles.sensing.color),
      Math.min(1, sim.primaryNorm),
    );
    return `#${c.getHexString()}`;
  }, [sim.primaryNorm, finish.roles.copper.color, finish.roles.sensing.color]);

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <CadPartGroup partId="op_barrel" basePos={[0, 0, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 2.35, 36]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="op_objective_lens" basePos={[-1.08, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="op_filament_lamp" basePos={[-0.25, 0, 0]} explodeOffset={[0, 0.45, 0.55]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.34, 24]} />
          <PbrMat preset="glass" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.075, 0.018, 12, 24, Math.PI]} />
          <meshStandardMaterial
            color={filamentColor}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="op_red_filter" basePos={[0.35, 0, 0]} explodeOffset={[0, -0.55, 0.45]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 32]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="op_rheostat_eyepiece" basePos={[1.1, 0, 0]} explodeOffset={[0.85, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.34, 0.45, 28]} />
          <PbrMat preset="rubber" />
        </mesh>
        <mesh position={[-0.6, -0.52, 0]} rotation={[0, sim.primaryNorm * 3.5, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.16, 20]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function RadiationPyrometerAssembly() {
  const sim = useCadSim();

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <CadPartGroup partId="rp_finned_body" basePos={[0, 0, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 1.95, 36]} />
          <PbrMat preset="ss316" />
        </mesh>
        {[-0.45, -0.2, 0.05, 0.3, 0.55].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.56, 0.56, 0.045, 36]} />
            <PbrMat preset="ssDark" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="rp_quartz_window" basePos={[-0.98, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.06, 32]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rp_gold_mirror" basePos={[0.62, 0, 0]} explodeOffset={[0.65, 0.35, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.15, 0.22, 32]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rp_filter_chopper" basePos={[-0.1, 0, 0]} explodeOffset={[0, -0.6, 0.4]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03, 12]} />
          <PbrMat preset="brass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="rp_thermopile" basePos={[-0.35, 0, 0]} explodeOffset={[0, 0.25, 0.65]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.16, 20]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function IrSensorAssembly() {
  const sim = useCadSim();
  const tempDisplay = Math.round(sim.primaryValue);
  const lcdTex = useMemo(
    () => buildLcdDisplayTexture(`${tempDisplay} °C`, 'ε = 0.95 · IR SPOT'),
    [tempDisplay],
  );
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="ir_m30_housing" basePos={[0, 0, 0]} explodeOffset={[0, 0.55, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 1.65, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.14, 6]} />
          <PbrMat preset="ssDark" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ir_fresnel_lens" basePos={[-0.86, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.27, 0.27, 0.06, 28]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ir_mems_thermopile" basePos={[0.0, 0, 0]} explodeOffset={[0, -0.55, 0.5]}>
        <mesh>
          <boxGeometry args={[0.42, 0.24, 0.24]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="ir_oled_tail" basePos={[0.88, 0, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.24, 0.45, 0.45]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.38, 0.26]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function ThermowellAssembly() {
  const sim = useCadSim();
  const finish = useInstrumentFinish();
  const safeRatio = (0.35 + sim.primaryNorm * 0.45).toFixed(2);
  const badgeTex = useMemo(
    () => buildLcdDisplayTexture(`r = ${safeRatio}`, 'ASME PTC 19.3 TW', '#102436', finish.roles.ceramic.color),
    [safeRatio, finish.roles.ceramic.color],
  );
  useEffect(() => () => badgeTex.dispose(), [badgeTex]);

  return (
    <group>
      <CadPartGroup partId="tw_flange" basePos={[0, 0.32, 0]} explodeOffset={[0, 0.75, 0]}>
        <FlangeWithBolts outerR={0.78} innerR={0.22} thickness={0.14} boltCount={8} preset="ss316" />
      </CadPartGroup>

      <CadPartGroup partId="tw_lagging_neck" basePos={[0, 0.78, 0]} explodeOffset={[0, 1.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.75, 24]} />
          <PbrMat preset="ssDark" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.16, 6]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tw_tapered_bar" basePos={[0, -0.58, 0]} explodeOffset={[0, -0.65, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.22, 0.11, 1.68, 32]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tw_inner_bore" basePos={[0, -0.42, 0]} explodeOffset={[0.68, -0.25, 0]}>
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 1.5, 20]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
        <mesh position={[0.45, 0.5, 0]}>
          <boxGeometry args={[0.55, 0.28, 0.06]} />
          <meshStandardMaterial map={badgeTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function TempTransmitterAssembly() {
  const sim = useCadSim();
  const ma = (4 + sim.primaryNorm * 16).toFixed(2);
  const lcdTex = useMemo(() => buildLcdDisplayTexture(`${ma} mA`, 'HART 7 · Pt100 INPUT'), [ma]);
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="tt_puck_housing" basePos={[0, 0, 0]} explodeOffset={[0, -0.45, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.78, 0.78, 0.44, 36]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tt_pcb_board" basePos={[0, 0.18, 0]} explodeOffset={[0, 0.35, 0]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.06, 36]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="tt_terminals" basePos={[0, 0.28, 0]} explodeOffset={[0.65, 0.55, 0]}>
        {[-0.45, -0.2, 0.2, 0.45].map((x, idx) => (
          <mesh key={idx} position={[x, 0, -0.35]}>
            <cylinderGeometry args={[0.065, 0.065, 0.12, 16]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="tt_lcd_module" basePos={[0, 0.32, 0.12]} explodeOffset={[0, 0.95, 0]}>
        <mesh>
          <boxGeometry args={[0.82, 0.14, 0.46]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.74, 0.38]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function DryWellCalibratorAssembly() {
  const sim = useCadSim();
  const tempC = (50 + sim.primaryNorm * 550).toFixed(1);
  const lcdTex = useMemo(
    () => buildLcdDisplayTexture('DRY-WELL CALIBRATOR', `${tempC} °C`, 'STABILITY ±0.03 °C'),
    [tempC],
  );
  useEffect(() => () => lcdTex.dispose(), [lcdTex]);

  return (
    <group>
      <CadPartGroup partId="dw_enclosure" basePos={[0, -0.15, 0]} explodeOffset={[0, -0.45, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[1.45, 1.55, 1.12]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0, -0.35, 0.58]}>
          <boxGeometry args={[1.15, 0.58, 0.08]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0, -0.35, 0.63]}>
          <planeGeometry args={[0.96, 0.42]} />
          <meshStandardMaterial map={lcdTex} />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dw_heater_block" basePos={[0, 0.25, 0]} explodeOffset={[0.65, 0.35, 0]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 1.1, 28]} />
          <PbrMat preset="brass" />
        </mesh>
        <HelicalTube position={[0, -0.1, 0]} radius={0.42} height={0.85} turns={6} tubeRadius={0.025} preset="copper" />
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.12, 24]} />
          <PbrMat preset="alumina" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="dw_uut_probe" basePos={[-0.08, 1.05, 0]} explodeOffset={[-0.45, 0.85, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 1.15, 18]} />
          <PbrMat preset="ss316" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.14, 0.12, 0.28, 20]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.16, 0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
          <PbrMat preset="chrome" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function renderTemperatureModel(key: string) {
  switch (key) {
    case 'thermistor':
      return <ThermistorAssembly />;
    case 'bimetallic':
      return <BimetallicAssembly />;
    case 'filled-system':
      return <FilledSystemAssembly />;
    case 'optical-pyrometer':
      return <OpticalPyrometerAssembly />;
    case 'radiation-pyrometer':
      return <RadiationPyrometerAssembly />;
    case 'ir-sensor':
      return <IrSensorAssembly />;
    case 'thermowell':
      return <ThermowellAssembly />;
    case 'temp-transmitter':
      return <TempTransmitterAssembly />;
    case 'dry-well-calibrator':
      return <DryWellCalibratorAssembly />;
    default:
      return null;
  }
}

