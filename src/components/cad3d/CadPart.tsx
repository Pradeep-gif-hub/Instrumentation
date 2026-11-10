import { useFrame } from '@react-three/fiber';
import { createContext, type ReactNode, useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CAD_CLIP_PLANE } from './materials';

export interface CadSimState {
  primaryNorm: number;
  primaryValue: number;
  secondaryNorm: number;
  secondaryValue: number;
}

export interface CadRuntimeCtxValue {
  explodeAmount: number;
  crossSection: boolean;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  hiddenPartIds?: Set<string>;
  simState: CadSimState;
}

export const CadRuntimeContext = createContext<CadRuntimeCtxValue>({
  explodeAmount: 0,
  crossSection: false,
  selectedPartId: null,
  hoveredPartId: null,
  simState: { primaryNorm: 0.5, primaryValue: 0, secondaryNorm: 0.5, secondaryValue: 0 },
});

export function useCadSim() {
  return useContext(CadRuntimeContext).simState;
}

interface CadPartGroupProps {
  partId: string;
  basePos?: [number, number, number];
  explodeOffset?: [number, number, number];
  rotation?: [number, number, number];
  isCutawayShell?: boolean;
  children: ReactNode;
}

/**
 * Reusable engineering sub-assembly node.
 * Automatically manages explode offset animation, visibility hide/show,
 * hover/selection highlight, shadow casting, and Z=0 section clipping.
 */
export function CadPartGroup({
  partId,
  basePos = [0, 0, 0],
  explodeOffset = [0, 0, 0],
  rotation = [0, 0, 0],
  isCutawayShell = false,
  children,
}: CadPartGroupProps) {
  const { explodeAmount, crossSection, selectedPartId, hoveredPartId, hiddenPartIds } =
    useContext(CadRuntimeContext);
  const groupRef = useRef<THREE.Group>(null);
  const visible = !(hiddenPartIds && hiddenPartIds.has(partId));
  const isSelected = selectedPartId === partId;
  const isHovered = hoveredPartId === partId;

  useEffect(() => {
    const grp = groupRef.current;
    if (!grp) return;
    grp.traverse((obj) => {
      obj.userData.partId = partId;
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          if (!m) continue;
          const std = m as THREE.MeshStandardMaterial;
          if ('emissive' in std) {
            // Preserve intentional glowing filaments/lasers marked with userData.selfEmissive
            if (!mesh.userData?.selfEmissive) {
              if (isSelected) {
                std.emissive.set('#9fd138');
                std.emissiveIntensity = 0.3;
              } else if (isHovered) {
                std.emissive.set('#c5f467');
                std.emissiveIntensity = 0.14;
              } else {
                std.emissive.set('#000000');
                std.emissiveIntensity = 0;
              }
            }
          }
          std.clippingPlanes = crossSection && isCutawayShell ? [CAD_CLIP_PLANE] : [];
          std.clipShadows = crossSection && isCutawayShell;
          if (crossSection && isCutawayShell) {
            std.side = THREE.DoubleSide;
          } else if (!std.transparent) {
            std.side = THREE.FrontSide;
          }
          std.needsUpdate = true;
        }
      }
    });
  }, [partId, isSelected, isHovered, crossSection, isCutawayShell, children]);

  useFrame((_, delta) => {
    const grp = groupRef.current;
    if (!grp) return;
    const alpha = Math.min(1, delta * 9);
    grp.position.x = THREE.MathUtils.lerp(
      grp.position.x,
      basePos[0] + explodeOffset[0] * explodeAmount,
      alpha,
    );
    grp.position.y = THREE.MathUtils.lerp(
      grp.position.y,
      basePos[1] + explodeOffset[1] * explodeAmount,
      alpha,
    );
    grp.position.z = THREE.MathUtils.lerp(
      grp.position.z,
      basePos[2] + explodeOffset[2] * explodeAmount,
      alpha,
    );
  });

  return (
    <group
      ref={groupRef}
      name={partId}
      position={basePos}
      rotation={rotation}
      visible={visible}
      userData={{ partId }}
    >
      {children}
    </group>
  );
}

