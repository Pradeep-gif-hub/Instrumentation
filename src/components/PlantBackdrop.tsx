import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { useApp } from '@/context/AppContext';

const STEAM_COUNT = 48;

function Pipe({
  a,
  b,
  radius = 0.08,
  color = '#b7c3cc',
}: {
  a: [number, number, number];
  b: [number, number, number];
  radius?: number;
  color?: string;
}) {
  const geo = useMemo(() => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const dir = end.clone().sub(start);
    const length = Math.max(dir.length(), 0.05);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    );
    return { mid, quat, length };
  }, [a, b]);
  return (
    <group position={geo.mid} quaternion={geo.quat}>
      <mesh>
        <cylinderGeometry args={[radius, radius, geo.length, 14]} />
        <meshStandardMaterial color={color} metalness={0.84} roughness={0.28} />
      </mesh>
      <mesh position={[0, geo.length / 2 - 0.02, 0]}>
        <cylinderGeometry args={[radius * 1.65, radius * 1.65, radius * 0.9, 14]} />
        <meshStandardMaterial color="#8e99a3" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, -geo.length / 2 + 0.02, 0]}>
        <cylinderGeometry args={[radius * 1.65, radius * 1.65, radius * 0.9, 14]} />
        <meshStandardMaterial color="#8e99a3" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Worker({
  position,
  task = 'walk',
  person,
  labelRoot,
}: {
  position: [number, number, number];
  task?: 'walk' | 'gauge' | 'valve' | 'furnace';
  person: { name: string; detail: string };
  labelRoot: RefObject<HTMLDivElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const group = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + position[0];
    if (!group.current) return;
    const stride = Math.sin(t * 3.6);
    if (leftLeg.current) leftLeg.current.rotation.x = stride * 0.55;
    if (rightLeg.current) rightLeg.current.rotation.x = -stride * 0.55;
    if (task === 'walk') {
      const phase = (Math.sin(t * 0.38) + 1) / 2;
      group.current.position.set(-4.2 + phase * 6.6, Math.abs(stride) * 0.04, position[2]);
      group.current.rotation.y = Math.cos(t * 0.38) > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else if (task === 'gauge') {
      const phase = (Math.sin(t * 0.7) + 1) / 2;
      group.current.position.set(position[0] + phase * 1.3, Math.abs(stride) * 0.03, position[2]);
      group.current.rotation.y = Math.cos(t * 0.7) > 0 ? 0.6 : -2.4;
    } else if (task === 'valve') {
      const angle = t * 0.55;
      group.current.position.set(position[0] + Math.cos(angle) * 0.7, Math.abs(stride) * 0.03, position[2] + Math.sin(angle) * 0.45);
      group.current.rotation.y = -angle + Math.PI;
    } else {
      const phase = (Math.sin(t * 0.5) + 1) / 2;
      group.current.position.set(position[0] - phase * 1.6, Math.abs(stride) * 0.03, position[2] + phase * 0.8);
      group.current.rotation.y = phase > 0.5 ? 0.4 : 2.4;
    }
    if (arm.current) {
      arm.current.rotation.x = task === 'valve' ? Math.sin(t * 2.4) * 0.8 : task === 'gauge' ? -0.9 + Math.sin(t * 2) * 0.25 : -0.4 + stride * 0.2;
    }
  });
  return (
    <group
      ref={group}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        setOpen((value) => !value);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
    >
      <mesh
        position={[0, 0.9, 0]}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <capsuleGeometry args={[0.34, 0.9, 4, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={leftLeg} position={[0, 0.42, 0.08]}>
        <capsuleGeometry args={[0.07, 0.34, 4, 8]} />
        <meshStandardMaterial color="#243e56" roughness={0.75} />
      </mesh>
      <mesh ref={rightLeg} position={[0, 0.42, -0.08]}>
        <capsuleGeometry args={[0.07, 0.34, 4, 8]} />
        <meshStandardMaterial color="#243e56" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <capsuleGeometry args={[0.2, 0.42, 4, 8]} />
        <meshStandardMaterial color="#3c6e96" roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.95, 0.16]}>
        <boxGeometry args={[0.34, 0.16, 0.04]} />
        <meshStandardMaterial color="#e07a2f" roughness={0.55} />
      </mesh>
      <group ref={arm} position={[0.22, 1.05, 0]}>
        <mesh position={[0.12, -0.12, 0.08]} rotation={[0.5, 0, -0.4]}>
          <capsuleGeometry args={[0.05, 0.28, 3, 6]} />
          <meshStandardMaterial color="#3c6e96" roughness={0.62} />
        </mesh>
      </group>
      <mesh position={[-0.22, 0.95, 0]} rotation={[0.2, 0, 0.5]}>
        <capsuleGeometry args={[0.05, 0.26, 3, 6]} />
        <meshStandardMaterial color="#3c6e96" roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#e4c2a2" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.44, 0]}>
        <cylinderGeometry args={[0.15, 0.16, 0.08, 14]} />
        <meshStandardMaterial color="#f2c14b" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.025, 14]} />
        <meshStandardMaterial color="#f2c14b" roughness={0.45} />
      </mesh>
      {open && (
        <Html position={[0, 1.85, 0]} center portal={labelRoot as RefObject<HTMLElement>} distanceFactor={8} zIndexRange={[40, 0]}>
          <div
            style={{
              background: '#f7f4ec',
              color: '#1a242e',
              border: '1px solid #c84b31',
              borderRadius: 10,
              padding: '6px 8px',
              minWidth: 120,
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13 }}>{person.name}</div>
            <div style={{ fontSize: 12, marginTop: 2 }}>{person.detail}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function TankFarm() {
  return (
    <group>
      {[-6.1, -3.7, 7.2, 9.3].map((x, index) => (
        <group key={x} position={[x, 0, index > 1 ? 0.4 : -1.7]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[1.15, 1.2, 0.18, 20]} />
            <meshStandardMaterial color="#6a737c" metalness={0.45} roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.7, 0]}>
            <cylinderGeometry args={[0.92, 0.96, 3.15, 28]} />
            <meshStandardMaterial color={index === 1 ? '#d7dee4' : '#c5ced6'} metalness={0.78} roughness={0.32} />
          </mesh>
          <mesh position={[0, 3.28, 0]}>
            <sphereGeometry args={[0.92, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#e4ebf0" metalness={0.72} roughness={0.28} />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.98, 0.98, 0.16, 28]} />
            <meshStandardMaterial color="#2f6f9a" metalness={0.25} roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.15, 0]}>
            <cylinderGeometry args={[0.98, 0.98, 0.08, 28]} />
            <meshStandardMaterial color="#8e99a3" metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[0.98, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.28, 10]} />
            <meshStandardMaterial color="#9aa6b0" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.78, 1.55, 0.55]}>
            <boxGeometry args={[0.05, 0.7, 0.16]} />
            <meshStandardMaterial color="#dfe7ee" metalness={0.15} roughness={0.2} transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SightGlass() {
  const level = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!level.current) return;
    const h = 0.28 + (Math.sin(clock.elapsedTime * 0.8) + 1) * 0.16;
    level.current.scale.y = h;
    level.current.position.y = 1.25 + h * 0.15;
  });
  return (
    <mesh ref={level} position={[-2.92, 1.45, -1.15]}>
      <boxGeometry args={[0.06, 0.5, 0.1]} />
      <meshStandardMaterial color="#2f7d4a" transparent opacity={0.75} roughness={0.2} />
    </mesh>
  );
}

function Furnace() {
  const fire = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!fire.current) return;
    const t = clock.elapsedTime;
    fire.current.intensity = 2.1 + Math.sin(t * 13) * 0.55 + Math.sin(t * 27) * 0.25;
  });
  return (
    <group position={[4.4, 0, -0.4]}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[3.6, 0.28, 2.5]} />
        <meshStandardMaterial color="#4d565e" metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[3.15, 2.05, 2.15]} />
        <meshStandardMaterial color="#6a5548" metalness={0.18} roughness={0.78} />
      </mesh>
      <mesh position={[0, 2.42, 0]}>
        <boxGeometry args={[3.3, 0.12, 2.3]} />
        <meshStandardMaterial color="#3d4650" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.85, 1.08]}>
        <boxGeometry args={[0.9, 0.9, 0.06]} />
        <meshStandardMaterial color="#1c140f" roughness={0.9} emissive="#ff6a1a" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 0.85, 1.14]}>
        <coneGeometry args={[0.22, 0.45, 10]} />
        <meshBasicMaterial color="#ffb15a" transparent opacity={0.8} />
      </mesh>
      <pointLight ref={fire} position={[0, 1.1, 1.5]} color="#ff7a2a" distance={9} />
      <mesh position={[1.05, 3.55, -0.35]}>
        <cylinderGeometry args={[0.22, 0.32, 2.5, 16]} />
        <meshStandardMaterial color="#3c444c" metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh position={[1.05, 4.85, -0.35]}>
        <cylinderGeometry args={[0.34, 0.22, 0.16, 16]} />
        <meshStandardMaterial color="#2c333a" metalness={0.5} roughness={0.45} />
      </mesh>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]}>
          <boxGeometry args={[0.08, 2.1, 2.2]} />
          <meshStandardMaterial color="#8d96a0" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function PumpAndValve() {
  const shaft = useRef<THREE.Mesh>(null);
  const wheel = useRef<THREE.Mesh>(null);
  const needle = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (shaft.current) shaft.current.rotation.x = t * 6;
    if (wheel.current) wheel.current.rotation.z = t * 0.7;
    if (needle.current) needle.current.rotation.z = -0.4 + Math.sin(t * 1.2) * 0.5;
  });
  return (
    <group>
      <group position={[-4.6, 0, 0.35]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.7, 0.16, 0.5]} />
          <meshStandardMaterial color="#5c6770" metalness={0.4} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.28, 16]} />
          <meshStandardMaterial color="#3c6e96" metalness={0.3} roughness={0.45} />
        </mesh>
        <mesh ref={shaft} position={[0.38, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.28, 10]} />
          <meshStandardMaterial color="#c0c8d0" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      <group position={[0.85, 1.55, 0.15]}>
        <mesh>
          <boxGeometry args={[0.42, 0.36, 0.36]} />
          <meshStandardMaterial color="#3c6e96" metalness={0.28} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.32, 12]} />
          <meshStandardMaterial color="#d5dde4" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh ref={wheel} position={[0, 0.52, 0]}>
          <torusGeometry args={[0.22, 0.035, 8, 16]} />
          <meshStandardMaterial color="#e6edf2" metalness={0.82} roughness={0.22} />
        </mesh>
      </group>
      <group position={[-5.4, 1.15, 1.35]}>
        <mesh>
          <boxGeometry args={[0.08, 1.15, 0.78]} />
          <meshStandardMaterial color="#eef3f7" metalness={0.15} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 0.12, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 24]} />
          <meshStandardMaterial color="#f6f3ea" metalness={0.1} roughness={0.35} />
        </mesh>
        <group ref={needle} position={[0.09, 0.12, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.2, 0.012]} />
            <meshStandardMaterial color="#b4332a" />
          </mesh>
        </group>
        <mesh position={[0.05, 0.12, 0]}>
          <sphereGeometry args={[0.03, 10, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </group>
  );
}

function PipeRack() {
  const lines: Array<{ y: number; color: string; r: number }> = [
    { y: 2.55, color: '#c5ced6', r: 0.09 },
    { y: 2.25, color: '#3c6e96', r: 0.07 },
    { y: 1.95, color: '#8d5a32', r: 0.06 },
    { y: 1.68, color: '#2f7d4a', r: 0.055 },
    { y: 1.42, color: '#d2a03c', r: 0.05 },
  ];
  return (
    <group>
      {[-6.2, -2.4, 1.4, 4.6].map((x) => (
        <mesh key={x} position={[x, 1.35, -0.15]}>
          <boxGeometry args={[0.1, 2.7, 0.1]} />
          <meshStandardMaterial color="#5e6972" metalness={0.45} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-0.8, 2.75, -0.15]}>
        <boxGeometry args={[12.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#5e6972" metalness={0.45} roughness={0.5} />
      </mesh>
      {lines.map((line) => (
        <Pipe key={line.y} a={[-6.4, line.y, -0.15]} b={[5.6, line.y, -0.15]} radius={line.r} color={line.color} />
      ))}
      <Pipe a={[-6.1, 2.4, -1.7]} b={[-6.1, 2.55, -0.15]} radius={0.07} color="#c5ced6" />
      <Pipe a={[-3.7, 2.2, -1.7]} b={[-3.7, 2.25, -0.15]} radius={0.06} color="#3c6e96" />
      <Pipe a={[-1.3, 2.5, -1.7]} b={[-1.3, 1.95, -0.15]} radius={0.06} color="#8d5a32" />
      <Pipe a={[4.4, 1.95, -0.15]} b={[4.4, 1.5, 0.4]} radius={0.07} color="#8d5a32" />
      <Pipe a={[0.85, 2.55, -0.15]} b={[0.85, 1.9, 0.15]} radius={0.07} color="#c5ced6" />
      <Pipe a={[-4.6, 1.68, -0.15]} b={[-4.6, 0.55, 0.35]} radius={0.06} color="#2f7d4a" />
    </group>
  );
}

function Conveyor() {
  const crates = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    if (!crates.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < 6; i += 1) {
      const travel = (t * 0.42 + i * 0.72) % 5.2;
      const x = 2.4 - travel;
      const droppingOn = travel < 0.45;
      const fallingOff = travel > 4.6;
      const y = droppingOn ? 1.35 - travel * 1.2 : fallingOff ? 0.78 - (travel - 4.6) * 1.4 : 0.78;
      dummy.position.set(x, y, 3.05);
      dummy.rotation.set(fallingOff ? (travel - 4.6) * 2 : 0, 0, 0);
      dummy.updateMatrix();
      crates.current.setMatrixAt(i, dummy.matrix);
    }
    crates.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <mesh position={[2.55, 1.35, 2.55]}>
        <boxGeometry args={[0.7, 0.16, 0.7]} />
        <meshStandardMaterial color="#6a5548" roughness={0.7} />
      </mesh>
      <mesh position={[2.15, 1.05, 2.8]} rotation={[0.7, 0, 0.4]}>
        <boxGeometry args={[0.46, 0.08, 0.9]} />
        <meshStandardMaterial color="#4d565e" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.1, 0.48, 3.05]}>
        <boxGeometry args={[4.6, 0.16, 0.78]} />
        <meshStandardMaterial color="#2c343b" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0.1, 0.58, 3.05]}>
        <boxGeometry args={[4.4, 0.05, 0.62]} />
        <meshStandardMaterial color="#d7a441" roughness={0.4} metalness={0.15} />
      </mesh>
      {[-2.1, 2.2].map((x) => (
        <mesh key={x} position={[x, 0.26, 3.05]}>
          <boxGeometry args={[0.1, 0.48, 0.62]} />
          <meshStandardMaterial color="#6a737c" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-2.35, 0.28, 3.05]}>
        <boxGeometry args={[0.4, 0.4, 0.55]} />
        <meshStandardMaterial color="#5c6770" metalness={0.35} roughness={0.55} />
      </mesh>
      <instancedMesh ref={crates} args={[undefined, undefined, 6]}>
        <boxGeometry args={[0.34, 0.24, 0.34]} />
        <meshStandardMaterial color="#e07a2f" roughness={0.45} />
      </instancedMesh>
    </group>
  );
}

function Road() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.015, 5.35]}>
        <planeGeometry args={[28, 2.35]} />
        <meshStandardMaterial color="#6e767c" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.02, 6.4]}>
        <planeGeometry args={[28, 0.08]} />
        <meshStandardMaterial color="#f4f7f8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.02, 4.3]}>
        <planeGeometry args={[28, 0.08]} />
        <meshStandardMaterial color="#f4f7f8" />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-10 + i * 2.6, 0.025, 5.35]}>
          <planeGeometry args={[1.1, 0.08]} />
          <meshStandardMaterial color="#f2d15a" />
        </mesh>
      ))}
    </group>
  );
}

function DangerSign() {
  const board = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (!board.current) return;
    const height = board.current.position.y;
    board.current.lookAt(camera.position.x, height, camera.position.z);
  });
  return (
    <group position={[1.6, 0, 6.2]}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 1.1, 8]} />
        <meshStandardMaterial color="#4a5258" metalness={0.4} roughness={0.5} />
      </mesh>
      <group ref={board} position={[0, 1.25, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.62, 0.62, 0.05]} />
          <meshStandardMaterial color="#e2b326" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.16, 0.32, 0.02]} />
          <meshStandardMaterial color="#9b1c1c" />
        </mesh>
      </group>
    </group>
  );
}

function Truck({
  lane,
  direction,
  color,
  offset = 0,
}: {
  lane: number;
  direction: 1 | -1;
  color: string;
  offset?: number;
}) {
  const rig = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!rig.current) return;
    const span = 24;
    const travel = ((clock.elapsedTime * 1.05 * direction + offset) % span + span) % span;
    rig.current.position.x = -12 + travel;
    rig.current.position.z = lane;
    rig.current.rotation.y = direction === 1 ? 0 : Math.PI;
  });
  return (
    <group ref={rig} position={[0, 0, lane]}>
      <mesh position={[1.15, 0.48, 0]}>
        <boxGeometry args={[1.15, 0.62, 0.82]} />
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.42} />
      </mesh>
      <mesh position={[1.5, 0.78, 0]}>
        <boxGeometry args={[0.48, 0.36, 0.74]} />
        <meshStandardMaterial color="#d5e4f0" metalness={0.1} roughness={0.15} />
      </mesh>
      <mesh position={[-0.7, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 1.9, 18]} />
        <meshStandardMaterial color="#dfe6ec" metalness={0.8} roughness={0.22} />
      </mesh>
      {[-1.35, -0.15, 0.7, 1.45].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 12]} />
          <meshStandardMaterial color="#1c2126" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Steam() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < STEAM_COUNT; i += 1) {
      const stack = i < 20;
      const life = (t * (stack ? 0.35 : 0.55) + i * 0.13) % 1;
      const sway = Math.sin(t * 1.2 + i) * 0.12;
      if (stack) dummy.position.set(5.45 + sway, 5.05 + life * 1.8, -0.75);
      else dummy.position.set(0.4 + (i % 5) * 0.35, 2.15 + life * 0.9, 0.2 + sway);
      dummy.scale.setScalar(0.06 + life * (stack ? 0.28 : 0.14));
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, STEAM_COUNT]}>
      <sphereGeometry args={[1, 7, 6]} />
      <meshBasicMaterial color="#f4f8fb" transparent opacity={0.28} depthWrite={false} />
    </instancedMesh>
  );
}

function Hazards() {
  return (
    <group>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={i}
          position={[2.6 + (i % 5) * 0.42, 0.02, -1.8 + Math.floor(i / 5) * 0.42]}
          rotation={[-Math.PI / 2, 0, 0.55]}
        >
          <planeGeometry args={[0.36, 0.08]} />
          <meshStandardMaterial color={i % 2 ? '#111' : '#e2b326'} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function PlantScene({
  light,
  labelRoot,
}: {
  light: boolean;
  labelRoot: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <color attach="background" args={[light ? '#d5e6f3' : '#10161d']} />
      <fog attach="fog" args={[light ? '#d5e6f3' : '#10161d', 14, 36]} />
      <hemisphereLight args={[light ? '#f4f8fc' : '#1c2a3a', light ? '#c8bfb0' : '#12100e', light ? 0.9 : 0.38]} />
      <directionalLight position={[8, 14, 10]} intensity={light ? 1.55 : 0.42} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 30]} />
        <meshStandardMaterial color={light ? '#cfc6b4' : '#242b32'} roughness={1} />
      </mesh>
      <Road />
      <TankFarm />
      <SightGlass />
      <PipeRack />
      <Furnace />
      <PumpAndValve />
      <Conveyor />
      <Truck lane={5.05} direction={1} color="#c84b31" />
      <Truck lane={5.7} direction={-1} color="#2f6f9a" offset={11} />
      <Steam />
      <Hazards />
      <DangerSign />
      <Pipe a={[7.2, 1.1, 0.4]} b={[7.2, 0.7, 3.6]} radius={0.07} color="#c5ced6" />
      <Pipe a={[9.3, 1.1, 0.4]} b={[7.6, 0.85, 3.2]} radius={0.06} color="#3c6e96" />
      <Worker position={[-2, 0, 2.15]} task="walk" labelRoot={labelRoot} person={{ name: 'Pradeep Awasthi', detail: 'GET · Instrumentation' }} />
      <Worker position={[-5.4, 0, 1.15]} task="gauge" labelRoot={labelRoot} person={{ name: 'Shanmukh Datta', detail: 'GET · Instrumentation' }} />
      <Worker position={[1.15, 0, 1.15]} task="valve" labelRoot={labelRoot} person={{ name: 'Elon Musk', detail: 'SpaceX' }} />
      <Worker position={[4.6, 0, 1.35]} task="furnace" labelRoot={labelRoot} person={{ name: 'Jensen Huang', detail: 'Fresher' }} />
      <mesh position={[-7.4, 1.25, -3.1]}>
        <boxGeometry args={[1.5, 2.3, 1.35]} />
        <meshStandardMaterial color={light ? '#e7eef3' : '#243140'} roughness={0.6} />
      </mesh>
      <mesh position={[-7.4, 1.65, -2.4]}>
        <planeGeometry args={[0.85, 0.5]} />
        <meshStandardMaterial color="#b7d7ee" emissive="#7eb6dd" emissiveIntensity={light ? 0.12 : 0.55} />
      </mesh>
    </>
  );
}

export function PlantBackdrop() {
  const { theme } = useApp();
  const labelRoot = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas
            style={{ pointerEvents: 'auto' }}
            camera={{ position: [0.4, 5.8, 13.2], fov: 36 }}
            dpr={1}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            onCreated={({ camera }) => camera.lookAt(0.2, 1.3, 0)}
          >
            <PlantScene light={theme === 'light'} labelRoot={labelRoot} />
          </Canvas>
        </Suspense>
      </div>
      <div ref={labelRoot} className="pointer-events-none fixed inset-0 z-30" />
    </>
  );
}
