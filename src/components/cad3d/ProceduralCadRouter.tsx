import { lazy, Suspense } from 'react';
import type { InstrumentFamilyKey } from '@/types/cad';

const TemperatureLazy = lazy(() =>
  import('./families/TemperatureModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderTemperatureModel(modelKey)}</>,
  })),
);

const MotionLazy = lazy(() =>
  import('./families/MotionModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderMotionModel(modelKey)}</>,
  })),
);

const PressureForceLazy = lazy(() =>
  import('./families/PressureForceModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderPressureForceModel(modelKey)}</>,
  })),
);

const FlowLazy = lazy(() =>
  import('./families/FlowModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderFlowModel(modelKey)}</>,
  })),
);

const LevelPropsLazy = lazy(() =>
  import('./families/LevelPropsModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderLevelPropsModel(modelKey)}</>,
  })),
);

const ElectricalBridgeLazy = lazy(() =>
  import('./families/ElectricalBridgeModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderElectricalBridgeModel(modelKey)}</>,
  })),
);

const AnalyticalOpticalLazy = lazy(() =>
  import('./families/AnalyticalOpticalModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderAnalyticalOpticalModel(modelKey)}</>,
  })),
);

const ControlActuatorLazy = lazy(() =>
  import('./families/ControlActuatorModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderControlActuatorModel(modelKey)}</>,
  })),
);

const SignalTransducerLazy = lazy(() =>
  import('./families/SignalTransducerModels').then((m) => ({
    default: ({ modelKey }: { modelKey: string }) => <>{m.renderSignalTransducerModel(modelKey)}</>,
  })),
);

export function ProceduralCadRouter({
  family,
  proceduralKey,
}: {
  family: InstrumentFamilyKey;
  proceduralKey: string;
}) {
  return (
    <Suspense fallback={null}>
      {family === 'temperature' && <TemperatureLazy modelKey={proceduralKey} />}
      {family === 'motion' && <MotionLazy modelKey={proceduralKey} />}
      {family === 'pressure-force' && <PressureForceLazy modelKey={proceduralKey} />}
      {family === 'flow' && <FlowLazy modelKey={proceduralKey} />}
      {family === 'level-props' && <LevelPropsLazy modelKey={proceduralKey} />}
      {family === 'electrical-bridge' && <ElectricalBridgeLazy modelKey={proceduralKey} />}
      {family === 'analytical-optical' && <AnalyticalOpticalLazy modelKey={proceduralKey} />}
      {family === 'control-actuator' && <ControlActuatorLazy modelKey={proceduralKey} />}
      {family === 'signal-transducer' && <SignalTransducerLazy modelKey={proceduralKey} />}
    </Suspense>
  );
}

