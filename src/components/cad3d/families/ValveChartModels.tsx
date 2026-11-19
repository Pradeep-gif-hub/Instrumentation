import { useFrame } from '@react-three/fiber';
import { useRef, type MutableRefObject } from 'react';
import type * as THREE from 'three';
import { CadPartGroup, useCadSim } from '../CadPart';
import { FlangeWithBolts } from '../primitives';

const CYAN = '#2a9fd6';
const SILVER = '#d7dee4';
const YELLOW = '#e6b325';
const RED = '#c23b2e';
const BLACK = '#1c1c1c';

function Paint({ color, metal = 0.35 }: { color: string; metal?: number }) {
  return <meshStandardMaterial color={color} metalness={metal} roughness={0.4} />;
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.18, 0.028, 8, 16]} />
        <Paint color={CYAN} metal={0.2} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.3, 0.028, 0.028]} />
        <Paint color={CYAN} metal={0.2} />
      </mesh>
    </group>
  );
}

function LiquidStream({ opening }: { opening: MutableRefObject<number> }) {
  const upstream = useRef<THREE.Mesh>(null);
  const throat = useRef<THREE.Mesh>(null);
  const downstream = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const open = opening.current;
    if (throat.current) {
      const radius = 0.012 + open * 0.055;
      throat.current.scale.set(radius / 0.07, radius / 0.07, 1);
    }
    if (downstream.current) {
      downstream.current.scale.x = Math.max(0.04, open);
      downstream.current.position.x = 0.12 + open * 0.38;
      const mat = downstream.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.08 + open * 0.4;
    }
  });

  const water = (
    <meshStandardMaterial color="#4aa3d8" transparent opacity={0.42} roughness={0.06} metalness={0.02} depthWrite={false} />
  );

  return (
    <group>
      <mesh ref={upstream} position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.72, 16]} />
        {water}
      </mesh>
      <mesh ref={throat} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 14]} />
        <meshStandardMaterial color="#7ec8ee" transparent opacity={0.5} roughness={0.05} depthWrite={false} />
      </mesh>
      <mesh ref={downstream} position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.72, 16]} />
        <meshStandardMaterial color="#4aa3d8" transparent opacity={0.4} roughness={0.06} metalness={0.02} depthWrite={false} />
      </mesh>
    </group>
  );
}

function BodyShell({ kind }: { kind: string }) {
  if (kind === 'butterfly') {
    return (
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 0.24, 28]} />
        <Paint color={CYAN} metal={0.25} />
      </mesh>
    );
  }
  if (kind === 'needle') {
    return (
      <mesh>
        <sphereGeometry args={[0.2, 18, 12]} />
        <Paint color={SILVER} metal={0.7} />
      </mesh>
    );
  }
  if (kind === 'slide') {
    return (
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.22, 0.9, 0.62]} />
        <Paint color={CYAN} metal={0.25} />
      </mesh>
    );
  }
  if (kind === 'gate') {
    return (
      <mesh scale={[0.75, 1.05, 0.62]}>
        <sphereGeometry args={[0.36, 20, 14]} />
        <Paint color={CYAN} metal={0.25} />
      </mesh>
    );
  }
  if (kind === 'y-type') {
    return (
      <mesh position={[0.05, 0.08, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.16, 0.2, 0.7, 20]} />
        <Paint color={SILVER} metal={0.65} />
      </mesh>
    );
  }
  if (kind === 'angle') {
    return (
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.26, 18, 14]} />
        <Paint color={SILVER} metal={0.65} />
      </mesh>
    );
  }
  if (kind === 'ball') {
    return (
      <mesh>
        <sphereGeometry args={[0.32, 22, 16]} />
        <Paint color={RED} metal={0.28} />
      </mesh>
    );
  }
  if (kind === 'piston' || kind === 'piston-nrv') {
    return (
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.78, 22]} />
        <Paint color={CYAN} metal={0.25} />
      </mesh>
    );
  }
  if (kind === 'flush-bottom') {
    return (
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.16, 0.26, 0.46, 18]} />
        <Paint color={CYAN} metal={0.25} />
      </mesh>
    );
  }
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.24, 0.24, 0.5, 24]} />
      <Paint color={CYAN} metal={0.25} />
    </mesh>
  );
}

export function ValveFamilyModel({ kind }: { kind: string }) {
  const id = `valve-${kind}`;
  const sim = useCadSim();
  const stem = useRef<THREE.Group>(null);
  const diaphragm = useRef<THREE.Mesh>(null);
  const opening = useRef(0.5);

  useFrame(({ clock }) => {
    const wave = (Math.sin(clock.elapsedTime * 0.38) + 1) / 2;
    const command = wave * 0.72 + sim.primaryNorm * 0.28;
    opening.current = command;
    const rotary = kind === 'ball' || kind === 'butterfly' || kind === 'swing-nrv';
    if (stem.current) {
      if (rotary) {
        stem.current.rotation.x = command * 1.05;
        stem.current.position.y = 0;
        stem.current.position.x = 0;
      } else if (kind === 'slide') {
        stem.current.position.x = (0.5 - command) * 0.16;
        stem.current.position.y = 0.12;
      } else {
        stem.current.position.y = command * 0.18;
        stem.current.position.x = 0;
      }
    }
    if (diaphragm.current) diaphragm.current.scale.y = 1.05 - command * 0.28;
  });

  return (
    <group>
      <CadPartGroup partId={`${id}-flange`} basePos={[0, 0, 0]} explodeOffset={[-0.4, 0, 0]}>
        {kind !== 'angle' && kind !== 'flush-bottom' && kind !== 'slide' && (
          <>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.11, 0.11, 1.5, 16]} />
              <Paint color={SILVER} metal={0.7} />
            </mesh>
            <FlangeWithBolts outerR={0.36} innerR={0.13} thickness={0.07} boltCount={8} position={[-0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
            <FlangeWithBolts outerR={0.36} innerR={0.13} thickness={0.07} boltCount={8} position={[0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
          </>
        )}
        {kind === 'angle' && (
          <>
            <mesh position={[-0.4, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.55, 14]} />
              <Paint color={SILVER} metal={0.7} />
            </mesh>
            <FlangeWithBolts outerR={0.32} innerR={0.11} thickness={0.06} boltCount={6} position={[-0.72, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} />
            <mesh position={[0.08, -0.4, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.5, 14]} />
              <Paint color={SILVER} metal={0.7} />
            </mesh>
            <FlangeWithBolts outerR={0.32} innerR={0.11} thickness={0.06} boltCount={6} position={[0.08, -0.72, 0]} />
          </>
        )}
        {kind === 'flush-bottom' && (
          <FlangeWithBolts outerR={0.42} innerR={0.15} thickness={0.07} boltCount={8} position={[0, 0.62, 0]} />
        )}
      </CadPartGroup>

      <LiquidStream opening={opening} />

      <CadPartGroup partId={`${id}-body`} basePos={[0, 0, 0]} explodeOffset={[0, -0.35, 0]} isCutawayShell>
        <BodyShell kind={kind} />
        {kind === 'diaphragm' && (
          <mesh position={[0, -0.02, 0]} scale={[1, 0.35, 0.7]}>
            <sphereGeometry args={[0.28, 16, 10]} />
            <Paint color={CYAN} metal={0.2} />
          </mesh>
        )}
      </CadPartGroup>

      <CadPartGroup partId={`${id}-plug`} basePos={[0, 0, 0]} explodeOffset={[0.3, 0.15, 0.3]}>
        <group ref={stem}>
          <Trim kind={kind} />
        </group>
      </CadPartGroup>

      <CadPartGroup partId={`${id}-actuator`} basePos={[0, 0.72, 0]} explodeOffset={[0.25, 0.5, 0]}>
        <mesh ref={diaphragm}>
          <cylinderGeometry args={[0.28, 0.28, 0.16, 22]} />
          <Paint color={CYAN} metal={0.22} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.28, 10]} />
          <Paint color={SILVER} metal={0.75} />
        </mesh>
        <mesh position={[0.34, 0.02, 0]}>
          <boxGeometry args={[0.16, 0.18, 0.12]} />
          <Paint color={BLACK} metal={0.2} />
        </mesh>
        <mesh position={[0.18, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
          <Paint color={YELLOW} metal={0.4} />
        </mesh>
        {kind !== 'ball' && kind !== 'butterfly' && <Wheel position={[0, 0.22, 0]} />}
      </CadPartGroup>
    </group>
  );
}

function Trim({ kind }: { kind: string }) {
  if (kind === 'butterfly' || kind === 'swing-nrv') {
    return (
      <mesh>
        <cylinderGeometry args={[0.26, 0.26, 0.035, 22]} />
        <Paint color={SILVER} metal={0.7} />
      </mesh>
    );
  }
  if (kind === 'ball') {
    return (
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.5, 14]} />
        <Paint color={SILVER} metal={0.75} />
      </mesh>
    );
  }
  if (kind === 'gate' || kind === 'slide') {
    return (
      <mesh>
        <boxGeometry args={[0.07, 0.34, 0.28]} />
        <Paint color={SILVER} metal={0.7} />
      </mesh>
    );
  }
  if (kind === 'diaphragm') {
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.035, 18]} />
        <Paint color={BLACK} metal={0.05} />
      </mesh>
    );
  }
  if (kind === 'needle') {
    return (
      <mesh>
        <cylinderGeometry args={[0.012, 0.05, 0.32, 12]} />
        <Paint color={SILVER} metal={0.8} />
      </mesh>
    );
  }
  if (kind === 'piston' || kind === 'piston-nrv') {
    return (
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.18, 16]} />
        <Paint color={kind === 'piston' ? RED : SILVER} metal={0.4} />
      </mesh>
    );
  }
  return (
    <mesh>
      <cylinderGeometry args={[0.06, 0.12, 0.18, 16]} />
      <Paint color={SILVER} metal={0.7} />
    </mesh>
  );
}
