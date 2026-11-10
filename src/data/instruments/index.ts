import type { InstrumentCategoryId, InstrumentTopic } from '@/types/engineering';
import { ANALYTICAL_TOPICS } from './analytical';
import { INSTRUMENT_CATEGORIES, type CategoryMeta } from './categories';
import { FINAL_CONTROL_TOPICS } from './finalControl';
import { FLOW_TOPICS } from './flow';
import { LEVEL_TOPICS } from './level';
import { PRESSURE_TOPICS } from './pressure';
import { SIGNAL_CONDITIONING_TOPICS } from './signalConditioning';
import { TEMPERATURE_TOPICS } from './temperature';

export { INSTRUMENT_CATEGORIES, type CategoryMeta };

export const ALL_INSTRUMENTS: InstrumentTopic[] = [
  ...TEMPERATURE_TOPICS,
  ...PRESSURE_TOPICS,
  ...FLOW_TOPICS,
  ...LEVEL_TOPICS,
  ...ANALYTICAL_TOPICS,
  ...FINAL_CONTROL_TOPICS,
  ...SIGNAL_CONDITIONING_TOPICS,
];

export const INSTRUMENTS_BY_CATEGORY: Record<InstrumentCategoryId, InstrumentTopic[]> = {
  temperature: TEMPERATURE_TOPICS,
  pressure: PRESSURE_TOPICS,
  flow: FLOW_TOPICS,
  level: LEVEL_TOPICS,
  analytical: ANALYTICAL_TOPICS,
  'final-control': FINAL_CONTROL_TOPICS,
  'signal-conditioning': SIGNAL_CONDITIONING_TOPICS,
};

export function getCategoryMeta(category: string | undefined): CategoryMeta | undefined {
  return INSTRUMENT_CATEGORIES.find((c) => c.id === category);
}

export function getInstrumentTopic(category: string | undefined, slug: string | undefined): InstrumentTopic | undefined {
  return ALL_INSTRUMENTS.find((t) => t.category === category && t.slug === slug);
}

export function getFlagship3DInstruments(): InstrumentTopic[] {
  return ALL_INSTRUMENTS.filter((t) => Boolean(t.has3DModel && t.modelId));
}

