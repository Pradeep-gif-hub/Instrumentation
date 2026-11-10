import { type ReactNode, useEffect, useState } from 'react';
import type { InstrumentFamilyKey } from '@/types/cad';

type FamilyRenderer = (modelKey: string) => ReactNode;

const FAMILY_LOADERS: Record<InstrumentFamilyKey, () => Promise<FamilyRenderer>> = {
  temperature: () =>
    import('./families/TemperatureModels').then((m) => m.renderTemperatureModel),
  motion: () => import('./families/MotionModels').then((m) => m.renderMotionModel),
  'pressure-force': () =>
    import('./families/PressureForceModels').then((m) => m.renderPressureForceModel),
  flow: () => import('./families/FlowModels').then((m) => m.renderFlowModel),
  'level-props': () =>
    import('./families/LevelPropsModels').then((m) => m.renderLevelPropsModel),
  'electrical-bridge': () =>
    import('./families/ElectricalBridgeModels').then((m) => m.renderElectricalBridgeModel),
  'analytical-optical': () =>
    import('./families/AnalyticalOpticalModels').then((m) => m.renderAnalyticalOpticalModel),
  'control-actuator': () =>
    import('./families/ControlActuatorModels').then((m) => m.renderControlActuatorModel),
  'signal-transducer': () =>
    import('./families/SignalTransducerModels').then((m) => m.renderSignalTransducerModel),
  'embedded-digital': () =>
    import('./families/EmbeddedDigitalModels').then((m) => m.renderEmbeddedDigitalModel),
};

const rendererCache = new Map<InstrumentFamilyKey, FamilyRenderer>();

export function ProceduralCadRouter({
  family,
  proceduralKey,
}: {
  family: InstrumentFamilyKey;
  proceduralKey: string;
}) {
  const [renderer, setRenderer] = useState<FamilyRenderer | null>(
    () => rendererCache.get(family) ?? null,
  );

  useEffect(() => {
    const cached = rendererCache.get(family);
    if (cached) {
      setRenderer(() => cached);
      return;
    }

    let active = true;
    setRenderer(null);
    FAMILY_LOADERS[family]().then((fn) => {
      rendererCache.set(family, fn);
      if (active) {
        setRenderer(() => fn);
      }
    });
    return () => {
      active = false;
    };
  }, [family]);

  if (!renderer) return null;
  return <>{renderer(proceduralKey)}</>;
}
