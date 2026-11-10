import { CadPartGroup, useCadSim } from '../CadPart';
import { HelicalTube, PbrMat } from '../primitives';

export function HallEffectAssembly() {
  const sim = useCadSim();
  const magGapX = -0.35 - (1 - sim.primaryNorm) * 0.55;

  return (
    <group>
      <CadPartGroup partId="hl_wafer" basePos={[0.35, 0, 0]} explodeOffset={[0.65, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.14, 0.72, 0.85]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 14]} />
          <PbrMat preset="gold" />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 14]} />
          <PbrMat preset="gold" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="hl_magnet" basePos={[magGapX, 0, 0]} explodeOffset={[-0.75, 0, 0]}>
        <mesh position={[-0.25, 0, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.55]} />
          <PbrMat preset="blueHousing" />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.55]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="hl_pcb" basePos={[0.52, -0.6, 0]} explodeOffset={[0.45, -0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.65, 0.14, 1.15]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function MagnetostrictiveAssembly() {
  const sim = useCadSim();
  const collarY = -0.68 + sim.primaryNorm * 1.36;

  return (
    <group>
      <CadPartGroup partId="mg_tube" basePos={[0, -0.1, 0]} explodeOffset={[-0.65, 0, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 2.0, 24]} />
          <PbrMat preset="ss316" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mg_waveguide" basePos={[0, -0.1, 0]} explodeOffset={[0.65, 0, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.032, 0.032, 1.95, 16]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mg_collar" basePos={[0, collarY, 0]} explodeOffset={[0, 0, 0.75]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.09, 16, 32]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="mg_head" basePos={[0, 1.05, 0]} explodeOffset={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 0.45, 28]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function OpticalFiberAssembly() {
  const sim = useCadSim();
  const stretch = 1 + sim.primaryNorm * 0.25;

  return (
    <group>
      <CadPartGroup partId="of_cladding" basePos={[0, 0, 0]} explodeOffset={[0, 0.65, 0]} isCutawayShell>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 2.4, 32]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="of_core" basePos={[0, 0, 0]} explodeOffset={[0, -0.55, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 2.4, 24]} />
          <PbrMat preset="quartz" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="of_fbg" basePos={[0, 0, 0]} explodeOffset={[0, 0, 0.7]}>
        <group scale={[stretch, 1, 1]}>
          {[-0.3, -0.18, -0.06, 0.06, 0.18, 0.3].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
              <PbrMat preset="alnicoRed" />
            </mesh>
          ))}
        </group>
      </CadPartGroup>
    </group>
  );
}

export function PhotoDetectorsAssembly() {
  const sim = useCadSim();

  return (
    <group>
      <CadPartGroup partId="pd_envelope" basePos={[-0.35, 0, 0]} explodeOffset={[-0.55, 0.45, 0]} isCutawayShell>
        <mesh>
          <cylinderGeometry args={[0.48, 0.48, 1.85, 32]} />
          <PbrMat preset="glass" />
        </mesh>
      </CadPartGroup>

      <CadPartGroup partId="pd_dynodes" basePos={[-0.35, 0, 0]} explodeOffset={[0, 0, 0.7]}>
        {[-0.55, -0.28, 0, 0.28, 0.55].map((y, idx) => (
          <mesh key={idx} position={[idx % 2 === 0 ? -0.12 : 0.12, y, 0]} rotation={[0, 0, idx % 2 === 0 ? 0.5 : -0.5]}>
            <boxGeometry args={[0.2, 0.06, 0.26]} />
            <PbrMat preset="copper" />
          </mesh>
        ))}
      </CadPartGroup>

      <CadPartGroup partId="pd_ldr" basePos={[0.85, -0.25, 0]} explodeOffset={[0.75, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.12, 28]} />
          <PbrMat preset="alumina" />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.45, 0.45, 0.02]} />
          <PbrMat preset="alnicoRed" />
        </mesh>
      </CadPartGroup>
    </group>
  );
}

export function InaOpampAssembly() {
  return (
    <group>
      <CadPartGroup partId="in_pcb" basePos={[0, -0.15, 0]} explodeOffset={[0, -0.45, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.12, 1.35]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="in_ic_chips" basePos={[0, 0.05, 0]} explodeOffset={[0, 0.65, 0]}>
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.48, 0.18, 0.42]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.48, 0.18, 0.42]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="in_resistors" basePos={[0, 0.04, 0.45]} explodeOffset={[0, 0.55, 0.5]}>
        {[-0.4, 0, 0.4].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.28, 16]} />
            <PbrMat preset="blueHousing" />
          </mesh>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function ActiveFilterAssembly() {
  return (
    <group>
      <CadPartGroup partId="af_pcb" basePos={[0, -0.15, 0]} explodeOffset={[0, -0.45, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 0.12, 1.35]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="af_opamp_ic" basePos={[0, 0.04, 0]} explodeOffset={[0, 0.6, 0]}>
        <mesh>
          <boxGeometry args={[0.56, 0.18, 0.42]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="af_caps" basePos={[0, 0.14, 0.35]} explodeOffset={[0, 0.75, 0.45]}>
        {[-0.45, 0.45].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <boxGeometry args={[0.28, 0.34, 0.18]} />
            <PbrMat preset="yellowSafety" />
          </mesh>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function IsolatorBarrierAssembly() {
  return (
    <group>
      <CadPartGroup partId="is_housing" basePos={[0, 0, 0]} explodeOffset={[0, -0.5, 0]} isCutawayShell>
        <mesh>
          <boxGeometry args={[0.62, 1.85, 1.55]} />
          <PbrMat preset="blueHousing" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="is_transformer" basePos={[0, 0.25, 0]} explodeOffset={[0.65, 0.35, 0]}>
        <mesh>
          <torusGeometry args={[0.32, 0.1, 16, 30]} />
          <PbrMat preset="copper" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="is_zeners" basePos={[0, -0.45, 0]} explodeOffset={[-0.65, -0.35, 0]}>
        {[-0.25, 0.25].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.34, 16]} />
            <PbrMat preset="brass" />
          </mesh>
        ))}
      </CadPartGroup>
    </group>
  );
}

export function AdcDacBoardAssembly() {
  const sim = useCadSim();
  const code = Math.min(255, Math.max(0, Math.round(sim.primaryNorm * 255)));

  return (
    <group>
      <CadPartGroup partId="ad_pcb" basePos={[0, -0.15, 0]} explodeOffset={[0, -0.45, 0]}>
        <mesh>
          <boxGeometry args={[2.25, 0.12, 1.45]} />
          <PbrMat preset="siliconWafer" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ad_ic_sh" basePos={[-0.35, 0.05, 0]} explodeOffset={[-0.5, 0.65, 0]}>
        <mesh>
          <boxGeometry args={[0.68, 0.18, 0.68]} />
          <PbrMat preset="anodizedDark" />
        </mesh>
      </CadPartGroup>
      <CadPartGroup partId="ad_r2r" basePos={[0.5, 0.05, 0.35]} explodeOffset={[0.5, 0.75, 0.3]}>
        {Array.from({ length: 8 }, (_, bit) => {
          const on = ((code >> bit) & 1) === 1;
          return (
            <mesh key={bit} position={[-0.4 + bit * 0.12, 0.05, -0.55]}>
              <sphereGeometry args={[0.04, 14, 14]} />
              <PbrMat preset={on ? 'alnicoRed' : 'anodizedDark'} />
            </mesh>
          );
        })}
        <HelicalTube position={[0, 0.05, 0]} radius={0.14} height={0.3} turns={3} tubeRadius={0.015} preset="brass" />
      </CadPartGroup>
    </group>
  );
}

export function renderSignalTransducerModel(key: string) {
  switch (key) {
    case 'hall-effect':
      return <HallEffectAssembly />;
    case 'magnetostrictive':
      return <MagnetostrictiveAssembly />;
    case 'optical-fiber':
      return <OpticalFiberAssembly />;
    case 'photo-detectors':
      return <PhotoDetectorsAssembly />;
    case 'ina-opamp':
      return <InaOpampAssembly />;
    case 'active-filter':
      return <ActiveFilterAssembly />;
    case 'isolator-barrier':
      return <IsolatorBarrierAssembly />;
    case 'adc-dac-board':
      return <AdcDacBoardAssembly />;
    default:
      return null;
  }
}
