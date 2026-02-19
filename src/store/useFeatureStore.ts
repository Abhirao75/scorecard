import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Feature, Framework } from '../types';
import { SAMPLE_FEATURES } from '../utils/sampleData';

const STORAGE_KEY = 'scorecard-features';
const SAMPLES_DISMISSED_KEY = 'scorecard-samples-dismissed';

function loadFeatures(): Feature[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SAMPLE_FEATURES;
}

function saveFeatures(features: Feature[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
}

interface FeatureStore {
  features: Feature[];
  activeFramework: Framework;
  samplesDismissed: boolean;

  setFramework: (f: Framework) => void;
  dismissSamples: () => void;

  addFeature: (data: Omit<Feature, 'id' | 'createdAt'>) => void;
  updateFeature: (id: string, data: Partial<Feature>) => void;
  deleteFeature: (id: string) => void;
  duplicateFeature: (id: string) => void;

  setRiceManualRank: (id: string, rank: number | undefined) => void;
  setIceManualRank: (id: string, rank: number | undefined) => void;

  replaceFeatures: (features: Feature[]) => void;
  clearAll: () => void;

  allTags: () => string[];
}

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  features: loadFeatures(),
  activeFramework: 'both',
  samplesDismissed: localStorage.getItem(SAMPLES_DISMISSED_KEY) === 'true',

  setFramework: (f) => set({ activeFramework: f }),

  dismissSamples: () => {
    localStorage.setItem(SAMPLES_DISMISSED_KEY, 'true');
    set({ samplesDismissed: true });
  },

  addFeature: (data) => {
    const feature: Feature = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    const features = [...get().features, feature];
    saveFeatures(features);
    set({ features });
  },

  updateFeature: (id, data) => {
    const features = get().features.map(f => f.id === id ? { ...f, ...data } : f);
    saveFeatures(features);
    set({ features });
  },

  deleteFeature: (id) => {
    const features = get().features.filter(f => f.id !== id);
    saveFeatures(features);
    set({ features });
  },

  duplicateFeature: (id) => {
    const src = get().features.find(f => f.id === id);
    if (!src) return;
    const feature: Feature = {
      ...src,
      id: uuidv4(),
      name: `${src.name} (copy)`,
      createdAt: new Date().toISOString(),
      riceManualRank: undefined,
      iceManualRank: undefined,
    };
    const features = [...get().features, feature];
    saveFeatures(features);
    set({ features });
  },

  setRiceManualRank: (id, rank) => {
    const features = get().features.map(f => f.id === id ? { ...f, riceManualRank: rank } : f);
    saveFeatures(features);
    set({ features });
  },

  setIceManualRank: (id, rank) => {
    const features = get().features.map(f => f.id === id ? { ...f, iceManualRank: rank } : f);
    saveFeatures(features);
    set({ features });
  },

  replaceFeatures: (features) => {
    saveFeatures(features);
    set({ features });
  },

  clearAll: () => {
    saveFeatures([]);
    set({ features: [] });
  },

  allTags: () => {
    const tags = new Set<string>();
    get().features.forEach(f => f.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  },
}));

export function sortByFramework(features: Feature[], framework: 'rice' | 'ice'): Feature[] {
  const manualKey = framework === 'rice' ? 'riceManualRank' : 'iceManualRank';
  const scoreKey = framework === 'rice' ? 'rice' : 'ice';
  const otherKey = framework === 'rice' ? 'ice' : 'rice';

  const scored = features.filter(f => f[scoreKey] !== null);
  const unscored = features.filter(f => f[scoreKey] === null);

  // Within unscored: partially scored (has other framework) before fully unscored
  const partial = unscored.filter(f => f[otherKey] !== null);
  const none = unscored.filter(f => f[otherKey] === null);

  const manual = scored.filter(f => f[manualKey] !== undefined)
    .sort((a, b) => (a[manualKey] as number) - (b[manualKey] as number));
  const auto = scored.filter(f => f[manualKey] === undefined)
    .sort((a, b) => (b[scoreKey]!.score) - (a[scoreKey]!.score));

  return [...manual, ...auto, ...partial, ...none];
}

// Sorts by scoring completeness tier:
// 1. Scored in both frameworks (by active framework score)
// 2. Scored in active framework only (by active framework score)
// 3. Scored in other framework only (by other framework score)
// 4. Scored in neither
export function sortByCompletenessFirst(features: Feature[], framework: 'rice' | 'ice'): Feature[] {
  const scoreKey = framework === 'rice' ? 'rice' : 'ice';
  const otherKey = framework === 'rice' ? 'ice' : 'rice';

  const both = features
    .filter(f => f.rice !== null && f.ice !== null)
    .sort((a, b) => b[scoreKey]!.score - a[scoreKey]!.score);

  const activeOnly = features
    .filter(f => f[scoreKey] !== null && f[otherKey] === null)
    .sort((a, b) => b[scoreKey]!.score - a[scoreKey]!.score);

  const otherOnly = features
    .filter(f => f[scoreKey] === null && f[otherKey] !== null)
    .sort((a, b) => b[otherKey]!.score - a[otherKey]!.score);

  const neither = features.filter(f => f.rice === null && f.ice === null);

  return [...both, ...activeOnly, ...otherOnly, ...neither];
}
