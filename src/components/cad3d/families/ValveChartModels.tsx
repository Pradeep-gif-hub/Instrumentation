import { useCadSim } from '../CadPart';
import { FlangeWithBolts } from '../primitives';

const CYAN = '#2a9fd6';
const SILVER = '#d7dee4';
const YELLOW = '#e6b325';
const RED = '#c23b2e';
const BLACK = '#1c1c1c';

function Paint({ color, metal = 0.35 }: { color: string; metal?: number }) {
  return <meshStandardMaterial color={color} metalness={metal} roughness={0.4} />;
}

function Wheel({
  position,
  rotation = [Math.PI / 2, 0, 0] as [number, number, number],
  color = CYAN,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[0.2, 0.03, 8, 18]} />
        <Paint color={color} metal={0.2} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.34, 0.03, 0.03]} />
        <Paint color={color} metal={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.34, 0.03, 0.03]} />
        <Paint color={color} metal={0.2} />
      </mesh>
    </group>
  );
}

function TeeHandle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.46, 0.06, 0.08]} />
        <Paint color={SILVER} metal={0.7} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.28, 12]} />
        <Paint color={SILVER} metal={0.7} />
      </mesh>
    </group>
  );
}

function SideFlanges() {
  return (
    <>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.55, 16]} />
        <Paint color={SILVER} metal={0.7} />
      </mesh>
      <FlangeWithBolts outerR={0.38} innerR={0.14} thickness={0.07} boltCount={8} position={[-0.88, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      <FlangeWithBolts outerR={0.38} innerR={0.14} thickness={0.07} boltCount={8} position={[0.88, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
    </>
  );
}

function StemAndWheel({ lift, top = 1.15, color = CYAN }: { lift: number; top?: number; color?: string }) {
  return (
    <group position={[0, lift * 0.12, 0]}>
      <mesh position={[0, top * 0.42, 0]}>
        <cylinderGeometry args={[0.04, 0.04, top * 0.85, 12]} />
        <Paint color={SILVER} metal={0.75} />
      </mesh>
      <Wheel position={[0, top * 0.9, 0]} color={color} />
    </group>
  );
}

export function ValveFamilyModel({ kind }: { kind: string }) {
  const lift = useCadSim().primaryNorm;

  if (kind === 'globe') {
    return (
      <group>
        <SideFlanges />
        <mesh>
          <sphereGeometry args={[0.34, 24, 16]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.28, 16]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, -0.05 + lift * 0.14, 0]}>
          <cylinderGeometry args={[0.07, 0.13, 0.2, 16]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <StemAndWheel lift={lift} />
      </group>
    );
  }

  if (kind === 'butterfly') {
    return (
      <group>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 0.22, 28]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <FlangeWithBolts outerR={0.62} innerR={0.4} thickness={0.05} boltCount={8} position={[-0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.62} innerR={0.4} thickness={0.05} boltCount={8} position={[0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <mesh rotation={[lift * 1.2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 24]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.26, 0.2, 0.22]} />
          <Paint color={BLACK} metal={0.15} />
        </mesh>
        <mesh position={[-0.22, 0.55, 0]} rotation={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 8]} />
          <Paint color={BLACK} metal={0.2} />
        </mesh>
        <Wheel position={[-0.42, 0.78, 0]} rotation={[0, 0, 0.7]} color={SILVER} />
      </group>
    );
  }

  if (kind === 'needle') {
    return (
      <group>
        <SideFlanges />
        <mesh>
          <sphereGeometry args={[0.22, 20, 14]} />
          <Paint color={SILVER} metal={0.75} />
        </mesh>
        <mesh position={[0, 0.28 - lift * 0.1, 0]}>
          <cylinderGeometry args={[0.015, 0.06, 0.42, 12]} />
          <Paint color={SILVER} metal={0.8} />
        </mesh>
        <TeeHandle position={[0, 0.62, 0]} />
      </group>
    );
  }

  if (kind === 'flow-reg') {
    return (
      <group>
        <SideFlanges />
        <mesh scale={[1.2, 0.85, 0.85]}>
          <sphereGeometry args={[0.38, 22, 16]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 0.22, 24]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0.28, 0.62, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 10]} />
          <Paint color={YELLOW} metal={0.45} />
        </mesh>
        <mesh position={[-0.22, 0.38, 0.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.28, 8]} />
          <Paint color={YELLOW} metal={0.45} />
        </mesh>
      </group>
    );
  }

  if (kind === 'slide') {
    return (
      <group>
        <FlangeWithBolts outerR={0.36} innerR={0.14} thickness={0.06} boltCount={6} position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <FlangeWithBolts outerR={0.36} innerR={0.14} thickness={0.06} boltCount={6} position={[0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        <mesh position={[0, 0.15 + lift * 0.2, 0]}>
          <boxGeometry args={[0.12, 1.15, 0.7]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 10]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
      </group>
    );
  }

  if (kind === 'gate') {
    return (
      <group>
        <SideFlanges />
        <mesh scale={[0.8, 1.2, 0.65]}>
          <sphereGeometry args={[0.36, 22, 16]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[-0.14, 0.5, 0]}>
          <boxGeometry args={[0.05, 0.62, 0.07]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
        <mesh position={[0.14, 0.5, 0]}>
          <boxGeometry args={[0.05, 0.62, 0.07]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
        <mesh position={[0, -0.02 + lift * 0.32, 0]}>
          <boxGeometry args={[0.07, 0.4, 0.32]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <StemAndWheel lift={lift} top={1.25} />
      </group>
    );
  }

  if (kind === 'diaphragm') {
    return (
      <group>
        <SideFlanges />
        <mesh position={[0, -0.06, 0]} scale={[1.15, 0.5, 0.8]}>
          <sphereGeometry args={[0.32, 20, 12]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.035, 20]} />
          <Paint color={BLACK} metal={0.05} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.28, 18]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <StemAndWheel lift={lift} top={0.9} />
      </group>
    );
  }

  if (kind === 'y-type') {
    return (
      <group>
        <SideFlanges />
        <mesh rotation={[0, 0, -0.55]} position={[0.08, 0.12, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.85, 20]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <group position={[0.28, 0.32, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.11, 0.13, 0.4, 16]} />
            <Paint color={SILVER} metal={0.65} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.35, 10]} />
            <Paint color={SILVER} metal={0.75} />
          </mesh>
          <Wheel position={[0, 0.78, 0]} color={CYAN} />
        </group>
      </group>
    );
  }

  if (kind === 'piston-nrv') {
    return (
      <group>
        <SideFlanges />
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.9, 24]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[-0.05 + lift * 0.18, 0.12, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.16, 16]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <mesh position={[0.12, 0.28, 0]}>
          <torusGeometry args={[0.08, 0.018, 8, 12]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
        <mesh position={[0.12, 0.4, 0]}>
          <torusGeometry args={[0.07, 0.016, 8, 12]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
      </group>
    );
  }

  if (kind === 'bpr') {
    return (
      <group>
        <SideFlanges />
        <mesh>
          <sphereGeometry args={[0.3, 20, 14]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.45, 12]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <torusGeometry args={[0.1, 0.02, 8, 14]} />
          <Paint color={SILVER} metal={0.55} />
        </mesh>
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 10]} />
          <Paint color={BLACK} metal={0.3} />
        </mesh>
      </group>
    );
  }

  if (kind === 'ball') {
    const turn = lift * (Math.PI / 2);
    return (
      <group>
        <SideFlanges />
        <mesh>
          <sphereGeometry args={[0.32, 24, 16]} />
          <Paint color={RED} metal={0.3} />
        </mesh>
        <mesh rotation={[0, turn, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.62, 14]} />
          <Paint color={SILVER} metal={0.75} />
        </mesh>
        <mesh position={[0, 0.38, 0]} rotation={[0, 0, turn]}>
          <boxGeometry args={[0.62, 0.07, 0.1]} />
          <Paint color={CYAN} metal={0.2} />
        </mesh>
      </group>
    );
  }

  if (kind === 'piston') {
    return (
      <group>
        <SideFlanges />
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.72, 24]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.08 + lift * 0.16, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.32, 16]} />
          <Paint color={RED} metal={0.3} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 0.22, 14]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <StemAndWheel lift={lift} />
      </group>
    );
  }

  if (kind === 'flush-bottom') {
    return (
      <group>
        <FlangeWithBolts outerR={0.46} innerR={0.16} thickness={0.07} boltCount={8} position={[0, 0.55, 0]} />
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.16, 0.24, 0.5, 18]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0.32, -0.12, 0]} rotation={[0, 0, Math.PI / 2.4]}>
          <cylinderGeometry args={[0.11, 0.11, 0.55, 14]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <FlangeWithBolts outerR={0.3} innerR={0.11} thickness={0.06} boltCount={6} position={[0.58, -0.32, 0]} rotation={[0, 0, Math.PI / 2.4]} />
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 10]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <Wheel position={[0, 0.82, 0]} color={CYAN} />
      </group>
    );
  }

  if (kind === 'swing-nrv') {
    return (
      <group>
        <SideFlanges />
        <mesh scale={[1.2, 0.8, 0.7]}>
          <sphereGeometry args={[0.32, 20, 14]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
        <mesh position={[0.04, 0.02, 0]} rotation={[0, 0, -0.4 - lift * 0.6]}>
          <cylinderGeometry args={[0.16, 0.16, 0.035, 18]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
      </group>
    );
  }

  if (kind === 'pr') {
    return (
      <group>
        <SideFlanges />
        <mesh>
          <sphereGeometry args={[0.3, 20, 14]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.28, 20]} />
          <Paint color={CYAN} metal={0.25} />
        </mesh>
        <mesh position={[0.32, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
          <Paint color={SILVER} metal={0.6} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 10]} />
          <Paint color={BLACK} metal={0.3} />
        </mesh>
      </group>
    );
  }

  if (kind === 'angle') {
    return (
      <group>
        <mesh position={[-0.4, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.6, 16]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <FlangeWithBolts outerR={0.34} innerR={0.12} thickness={0.06} boltCount={6} position={[-0.75, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} />
        <mesh position={[0.05, -0.35, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.55, 16]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <FlangeWithBolts outerR={0.34} innerR={0.12} thickness={0.06} boltCount={6} position={[0.05, -0.7, 0]} />
        <mesh position={[0.02, 0.12, 0]}>
          <sphereGeometry args={[0.2, 18, 14]} />
          <Paint color={SILVER} metal={0.7} />
        </mesh>
        <mesh position={[0.15, 0.38, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.07, 0.09, 0.28, 12]} />
          <Paint color={SILVER} metal={0.65} />
        </mesh>
        <Wheel position={[0.32, 0.55, 0]} rotation={[0.4, 0, 0.5]} color={SILVER} />
      </group>
    );
  }

  return (
    <group>
      <SideFlanges />
      <mesh>
        <sphereGeometry args={[0.3, 20, 14]} />
        <Paint color={CYAN} metal={0.25} />
      </mesh>
    </group>
  );
}
