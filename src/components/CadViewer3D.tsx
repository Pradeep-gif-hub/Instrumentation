import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Component, type ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Eye, EyeOff, Layers, Maximize2, RotateCcw, Scissors } from 'lucide-react';
import type { CadPartMeta, InstrumentFamilyKey } from '@/types/cad';
import {
  HIGHLIGHT_EMISSIVE,
  PALETTE_3D,
  VIEWER_3D_THEME,
} from '@/3d/palette';
import {
  getFinishProfile,
  resolveGlbPartMaterial,
  type InstrumentFinishProfile,
} from '@/3d/instrumentFinish';
import { CadRuntimeContext, InstrumentFinishContext, type CadSimState } from './cad3d/CadPart';
import { ProceduralCadRouter } from './cad3d/ProceduralCadRouter';

export type CameraPreset = 'iso' | 'front' | 'side' | 'top';

export interface CadViewerConfigLike {
  id: string;
  title: string;
  standard: string;
  sourceType?: 'glb' | 'procedural';
  glbUrl?: string;
  family?: InstrumentFamilyKey;
  proceduralKey?: string;
  supportsExplode?: boolean;
  supportsCutaway?: boolean;
  defaultCameraPos: [number, number, number];
  target: [number, number, number];
  parts: CadPartMeta[];
}

const OUTER_CUTAWAY_IDS = new Set([
  'terminal_head',
  'process_connection',
  'protective_sheath',
  'thermowell',
  'tc_terminal_head',
  'tc_compression_fitting',
  'tc_inconel_sheath',
  'dpt_housing',
  'dpt_lcd_module',
  'dpt_sensor_module',
  'dpt_process_flanges',
  'orf_upstream_pipe',
  'orf_downstream_pipe',
  'orf_flanges',
  'orf_gaskets',
]);

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallbackTitle: string },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode; fallbackTitle: string }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="eyebrow text-[var(--st-amber)]">3D VIEWPORT FALLBACK</p>
          <p className="text-sm font-medium text-[var(--st-on)]">{this.props.fallbackTitle}</p>
          <p className="muted max-w-md text-xs">
            Interactive WebGL rendering encountered an issue ({this.state.message}). Use the component list or switch to the schematic tab.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function resolvePartId(obj: THREE.Object3D | null): string | null {
  let curr: THREE.Object3D | null = obj;
  while (curr) {
    if (typeof curr.userData?.partId === 'string') return curr.userData.partId;
    if (curr.name && curr.name !== 'Scene' && !curr.name.endsWith('_Assembly')) {
      return curr.name;
    }
    curr = curr.parent;
  }
  return null;
}

function GlbAssemblyContents({
  glbUrl,
  parts,
  finishProfile,
  selectedPartId,
  hoveredPartId,
  hiddenPartIds,
  explodeAmount,
  crossSection,
}: {
  glbUrl: string;
  parts: CadPartMeta[];
  finishProfile: InstrumentFinishProfile;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  hiddenPartIds?: Set<string>;
  explodeAmount: number;
  crossSection: boolean;
}) {
  const gltf = useGLTF(glbUrl);
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.005), []);

  const { clonedScene, partGroups } = useMemo(() => {
    const root = gltf.scene.clone(true);
    const groups = new Map<string, { obj: THREE.Object3D; basePos: THREE.Vector3 }>();
    const partIds = new Set(parts.map((p) => p.id));

    root.traverse((obj) => {
      if (partIds.has(obj.name) && !groups.has(obj.name)) {
        groups.set(obj.name, { obj, basePos: obj.position.clone() });
      }
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const partId = resolvePartId(mesh);
        const applyFinish = (cloned: THREE.Material) => {
          const std = cloned as THREE.MeshStandardMaterial;
          if ('color' in std) {
            const { spec, preserveLcd } = resolveGlbPartMaterial(
              finishProfile,
              cloned.name,
              partId,
            );
            if (preserveLcd) {
              std.color.set(spec.color);
              std.userData = {
                ...std.userData,
                baseEmissiveHex: 'emissive' in std ? `#${std.emissive.getHexString()}` : '#000000',
                baseEmissiveIntensity: 'emissiveIntensity' in std ? std.emissiveIntensity : 0,
              };
            } else {
              std.color.set(spec.color);
              std.metalness = spec.metalness;
              std.roughness = spec.roughness;
              if (spec.transparent !== undefined) std.transparent = spec.transparent;
              if (spec.opacity !== undefined) std.opacity = spec.opacity;
              if (spec.depthWrite !== undefined) std.depthWrite = spec.depthWrite;
            }
            if ('emissive' in std && !preserveLcd) {
              std.emissive.set('#000000');
              std.emissiveIntensity = 0;
            }
          }
          return cloned;
        };

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => applyFinish(m.clone()));
        } else if (mesh.material) {
          mesh.material = applyFinish(mesh.material.clone());
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return { clonedScene: root, partGroups: groups };
  }, [gltf.scene, parts, finishProfile]);

  // Dispose cloned materials cleanly on unmount
  useEffect(() => {
    return () => {
      clonedScene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = (obj as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach((mat) => mat.dispose());
          else m?.dispose();
        }
      });
    };
  }, [clonedScene]);

  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (partGroups.has(obj.name)) {
        obj.visible = !(hiddenPartIds && hiddenPartIds.has(obj.name));
      }
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const partId = resolvePartId(mesh);
      if (partId && hiddenPartIds?.has(partId)) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }

      const isSelected = Boolean(partId && partId === selectedPartId);
      const isHovered = Boolean(partId && partId === hoveredPartId);
      const isCutawayShell = Boolean(partId && OUTER_CUTAWAY_IDS.has(partId));

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        if (!mat) continue;
        const std = mat as THREE.MeshStandardMaterial;
        if ('emissive' in std) {
          const savedHex = std.userData?._savedColorHex as string | undefined;
          if (isSelected || isHovered) {
            const baseHex = savedHex ?? `#${std.color.getHexString()}`;
            if (!savedHex) std.userData._savedColorHex = baseHex;
            if ('color' in std && !std.map) {
              const lerpFactor = isSelected
                ? HIGHLIGHT_EMISSIVE.selectedColorLerp
                : HIGHLIGHT_EMISSIVE.hoveredColorLerp;
              std.color
                .set(baseHex)
                .lerp(new THREE.Color(HIGHLIGHT_EMISSIVE.selectedHex), lerpFactor);
            }
            std.emissive.set('#000000');
            std.emissiveIntensity = 0;
          } else {
            if (savedHex && 'color' in std && !std.map) {
              std.color.set(savedHex);
            }
            if (savedHex) delete std.userData._savedColorHex;
            const baseHex = typeof std.userData?.baseEmissiveHex === 'string' ? std.userData.baseEmissiveHex : '#000000';
            const baseInt = typeof std.userData?.baseEmissiveIntensity === 'number' ? std.userData.baseEmissiveIntensity : 0;
            std.emissive.set(baseHex);
            std.emissiveIntensity = baseInt;
          }
        }
        std.clippingPlanes = crossSection && isCutawayShell ? [clipPlane] : [];
        std.clipShadows = crossSection && isCutawayShell;
        std.side = crossSection && isCutawayShell ? THREE.DoubleSide : THREE.FrontSide;
        std.needsUpdate = true;
      }
    });
  }, [clonedScene, partGroups, selectedPartId, hoveredPartId, hiddenPartIds, crossSection, clipPlane]);

  useFrame((_, delta) => {
    const alpha = Math.min(1, delta * 8);
    for (const part of parts) {
      const entry = partGroups.get(part.id);
      if (!entry) continue;
      const targetX = entry.basePos.x + part.explodeOffset[0] * explodeAmount;
      const targetY = entry.basePos.y + part.explodeOffset[1] * explodeAmount;
      const targetZ = entry.basePos.z + part.explodeOffset[2] * explodeAmount;
      entry.obj.position.x = THREE.MathUtils.lerp(entry.obj.position.x, targetX, alpha);
      entry.obj.position.y = THREE.MathUtils.lerp(entry.obj.position.y, targetY, alpha);
      entry.obj.position.z = THREE.MathUtils.lerp(entry.obj.position.z, targetZ, alpha);
    }
  });

  return <primitive object={clonedScene} />;
}

interface AssemblySceneProps {
  config: CadViewerConfigLike;
  selectedPartId: string | null;
  onSelectPart: (partId: string) => void;
  hiddenPartIds?: Set<string>;
  explodeAmount: number;
  crossSection: boolean;
  showLabels: boolean;
  cameraPreset: CameraPreset;
  presetNonce: number;
  simState: CadSimState;
}

function AssemblyScene({
  config,
  selectedPartId,
  onSelectPart,
  hiddenPartIds,
  explodeAmount,
  crossSection,
  showLabels,
  cameraPreset,
  presetNonce,
  simState,
}: AssemblySceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.cursor = hoveredPartId ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hoveredPartId]);

  const animatingCamRef = useRef(false);
  const desiredCamPosRef = useRef(new THREE.Vector3(...config.defaultCameraPos));
  const desiredTargetRef = useRef(new THREE.Vector3(...config.target));

  useEffect(() => {
    const [tx, ty, tz] = config.target;
    desiredTargetRef.current.set(tx, ty, tz);

    const [dx, dy, dz] = config.defaultCameraPos;
    const dist = Math.hypot(dx - tx, dy - ty, dz - tz);

    if (cameraPreset === 'front') {
      desiredCamPosRef.current.set(tx, ty + 0.1, tz + dist);
    } else if (cameraPreset === 'side') {
      desiredCamPosRef.current.set(tx + dist, ty + 0.1, tz);
    } else if (cameraPreset === 'top') {
      desiredCamPosRef.current.set(tx, ty + dist, tz + 0.05);
    } else {
      desiredCamPosRef.current.set(dx, dy, dz);
    }
    animatingCamRef.current = true;
  }, [cameraPreset, presetNonce, config]);

  useFrame((_, delta) => {
    if (animatingCamRef.current && controlsRef.current) {
      camera.position.lerp(desiredCamPosRef.current, Math.min(1, delta * 7));
      controlsRef.current.target.lerp(desiredTargetRef.current, Math.min(1, delta * 7));
      controlsRef.current.update();
      if (camera.position.distanceTo(desiredCamPosRef.current) < 0.02) {
        camera.position.copy(desiredCamPosRef.current);
        controlsRef.current.target.copy(desiredTargetRef.current);
        controlsRef.current.update();
        animatingCamRef.current = false;
      }
    }
  });

  const handlePointerClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const id = resolvePartId(e.object);
    if (id) onSelectPart(id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = resolvePartId(e.object);
    if (id) setHoveredPartId(id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredPartId(null);
  };

  const isProcedural = config.sourceType === 'procedural' && config.family && config.proceduralKey;
  const finishProfile = useMemo(
    () => getFinishProfile(config.id, config.family, config.proceduralKey),
    [config.id, config.family, config.proceduralKey],
  );

  return (
    <>
      <ambientLight intensity={0.32} color={VIEWER_3D_THEME.hemisphereSky} />
      <hemisphereLight intensity={0.3} color={VIEWER_3D_THEME.hemisphereSky} groundColor={VIEWER_3D_THEME.hemisphereGround} />
      <directionalLight
        position={[4.5, 6.5, 4.5]}
        intensity={1.12}
        color={VIEWER_3D_THEME.keyLight}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3.5, -2.5, 3]} intensity={0.48} color={VIEWER_3D_THEME.warmFillLight} />

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="rect" intensity={1.55} position={[0, 5, -2]} scale={[10, 4, 1]} color={VIEWER_3D_THEME.envTop} />
          <Lightformer form="rect" intensity={0.85} position={[-6, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} color={VIEWER_3D_THEME.envLeft} />
          <Lightformer form="rect" intensity={0.95} position={[6, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} color={VIEWER_3D_THEME.envRight} />
          <Lightformer form="ring" intensity={0.44} position={[0, -4, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} color={VIEWER_3D_THEME.warmFillLight} />
        </group>
      </Environment>

      <InstrumentFinishContext.Provider value={finishProfile}>
        <CadRuntimeContext.Provider
          value={{
            explodeAmount,
            crossSection,
            selectedPartId,
            hoveredPartId,
            hiddenPartIds,
            simState,
          }}
        >
          <group
            onClick={handlePointerClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {isProcedural ? (
              <ProceduralCadRouter
                family={config.family!}
                proceduralKey={config.proceduralKey!}
              />
            ) : config.glbUrl ? (
              <GlbAssemblyContents
                glbUrl={config.glbUrl}
                parts={config.parts}
                finishProfile={finishProfile}
                selectedPartId={selectedPartId}
                hoveredPartId={hoveredPartId}
                hiddenPartIds={hiddenPartIds}
                explodeAmount={explodeAmount}
                crossSection={crossSection}
              />
            ) : null}
          </group>
        </CadRuntimeContext.Provider>
      </InstrumentFinishContext.Provider>

      {/* Interactive 3D CAD Callout Pins (hover-only by default, or all when Labels toggle active) */}
      {config.parts.map((part) => {
        if (hiddenPartIds?.has(part.id)) return null;
        if (!showLabels && part.id !== hoveredPartId) return null;
        const isSelected = part.id === selectedPartId;
          const pos: [number, number, number] = [
            part.anchor[0] + part.explodeOffset[0] * explodeAmount,
            part.anchor[1] + part.explodeOffset[1] * explodeAmount,
            part.anchor[2] + part.explodeOffset[2] * explodeAmount,
          ];
          return (
            <Html key={part.id} position={pos} center zIndexRange={[10, 0]}>
              <button
                type="button"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelectPart(part.id);
                }}
                className={`cad-pin pointer-events-auto flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] transition ${
                  isSelected ? 'is-selected font-semibold' : ''
                }`}
                style={{ whiteSpace: 'nowrap' }}
              >
                <span className="mono font-semibold opacity-90">{part.code}</span>
                <span className="hidden sm:inline">{part.name.split('(')[0].trim()}</span>
              </button>
            </Html>
          );
        })}

      <ContactShadows position={[0, -1.78, 0]} opacity={0.42} scale={6.5} blur={2.4} far={3.5} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        enablePan
        enableZoom
        minDistance={1.2}
        maxDistance={9.0}
        onStart={() => {
          animatingCamRef.current = false;
        }}
      />
    </>
  );
}

export interface CadViewer3DProps {
  config: CadViewerConfigLike;
  selectedPart?: CadPartMeta | null;
  onSelectPart: (partId: string) => void;
  hiddenPartIds?: Set<string>;
  simState?: CadSimState;
  heightClass?: string;
}

const DEFAULT_SIM_STATE: CadSimState = {
  primaryNorm: 0.45,
  primaryValue: 0,
  secondaryNorm: 0.5,
  secondaryValue: 0,
};

export function CadViewer3D({
  config,
  selectedPart,
  onSelectPart,
  hiddenPartIds,
  simState = DEFAULT_SIM_STATE,
  heightClass = 'h-[560px]',
}: CadViewer3DProps) {
  const supportsExplode = config.supportsExplode ?? true;
  const supportsCutaway = config.supportsCutaway ?? true;

  const [explodeAmount, setExplodeAmount] = useState(0);
  const [crossSection, setCrossSection] = useState(supportsCutaway);
  const [showLabels, setShowLabels] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const [presetNonce, setPresetNonce] = useState(0);

  useEffect(() => {
    setExplodeAmount(0);
    setCrossSection(supportsCutaway);
    setCameraPreset('iso');
    setPresetNonce((n) => n + 1);
  }, [config.id, supportsCutaway]);

  const applyPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    setPresetNonce((n) => n + 1);
  };

  return (
    <div className={`glass stage relative touch-none overflow-hidden ${heightClass}`}>
      <div className="stage-grid pointer-events-none absolute inset-0" />

      {/* Top Right Camera Presets */}
      <div className="pod absolute right-3 top-3 z-10 flex flex-wrap items-center gap-1 rounded-full p-1">
        {(['iso', 'front', 'side', 'top'] as CameraPreset[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => applyPreset(p)}
            className={`cursor-pointer rounded-full px-2.5 py-1 text-[10px] mono uppercase transition ${
              cameraPreset === p
                ? 'bg-[#3C6E96] font-semibold text-white'
                : 'text-[var(--st-on-var)] hover:text-[var(--st-on)]'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          title="Reset camera & view"
          onClick={() => {
            setExplodeAmount(0);
            setCrossSection(supportsCutaway);
            applyPreset('iso');
          }}
          className="cursor-pointer rounded-full p-1.5 text-[var(--st-on-var)] hover:bg-[var(--st-3)] hover:text-[var(--st-on)]"
          aria-label="Reset camera view"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      {/* Three.js Canvas */}
      <WebGLErrorBoundary fallbackTitle={config.title}>
        <Suspense
          fallback={
            <div className="grid h-full place-items-center text-sm text-[var(--st-on-var)]">
              Loading 3D CAD assembly…
            </div>
          }
        >
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, localClippingEnabled: true }}
            camera={{ position: config.defaultCameraPos, fov: 38, near: 0.1, far: 50 }}
          >
            <AssemblyScene
              config={config}
              selectedPartId={selectedPart?.id ?? null}
              onSelectPart={onSelectPart}
              hiddenPartIds={hiddenPartIds}
              explodeAmount={explodeAmount}
              crossSection={crossSection}
              showLabels={showLabels}
              cameraPreset={cameraPreset}
              presetNonce={presetNonce}
              simState={simState}
            />
          </Canvas>
        </Suspense>
      </WebGLErrorBoundary>

      {/* Bottom Interactive Control Bar */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="pod pointer-events-auto flex flex-wrap items-center gap-2 rounded-full px-3 py-1.5">
          {supportsExplode && (
            <>
              <button
                type="button"
                onClick={() => setExplodeAmount((v) => (v > 0.5 ? 0 : 1))}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition ${
                  explodeAmount > 0.05
                    ? 'bg-[#3C6E96] font-semibold text-white'
                    : 'bg-[var(--st-3)] text-[var(--st-on)] hover:bg-[var(--st-4)]'
                }`}
              >
                <Layers className="size-3.5" />
                {explodeAmount > 0.05 ? 'Assemble' : 'Explode'}
              </button>

              <label className="flex items-center gap-1.5 text-[10px] mono text-[var(--st-on-var)]">
                <span className="hidden sm:inline">SPREAD</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={explodeAmount}
                  onChange={(e) => setExplodeAmount(Number(e.target.value))}
                  className="w-20 accent-[#3C6E96]"
                  aria-label="Exploded view separation amount"
                />
              </label>
            </>
          )}

          {supportsCutaway && (
            <button
              type="button"
              onClick={() => setCrossSection((s) => !s)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition ${
                crossSection
                  ? 'bg-[#3C6E96] font-semibold text-white'
                  : 'bg-[var(--st-3)] text-[var(--st-on)] hover:bg-[var(--st-4)]'
              }`}
            >
              <Scissors className="size-3.5" />
              Cross-Section
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLabels((l) => !l)}
            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition ${
              showLabels
                ? 'bg-[#3C6E96] font-semibold text-white'
                : 'bg-[var(--st-3)] text-[var(--st-on-var)] hover:text-[var(--st-on)]'
            }`}
          >
            {showLabels ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            Labels
          </button>
        </div>

        <div className="pod pointer-events-auto hidden items-center gap-2 rounded-full px-3 py-1.5 text-[10px] text-[var(--st-on-var)] sm:flex">
          <Maximize2 className="size-3 text-[#4F7FA6]" />
          <span>Drag to orbit · Scroll to zoom · Right-drag to pan · Click part to inspect</span>
        </div>
      </div>
    </div>
  );
}
