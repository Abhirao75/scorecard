import { useFeatureStore } from '../store/useFeatureStore';
import { computeIceScore } from '../utils/scoring';
import { FrameworkInfoPanel } from './FrameworkInfoPanel';
import type { IceData } from '../types';

interface Props {
  featureId: string;
  ice: IceData | null;
}

const DEFAULT_ICE: Omit<IceData, 'score'> = { impact: 5, confidence: 5, ease: 5 };

function ButtonGrid({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${
            value === n
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : n <= value
              ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
              : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export function IceForm({ featureId, ice }: Props) {
  const { updateFeature } = useFeatureStore();
  const data = ice ?? { ...DEFAULT_ICE, score: 0 };

  function update(partial: Partial<Omit<IceData, 'score'>>) {
    const next = { impact: data.impact, confidence: data.confidence, ease: data.ease, ...partial };
    updateFeature(featureId, { ice: { ...next, score: computeIceScore(next) } });
  }

  const score = ice?.score ?? 0;

  return (
    <div className="space-y-4">
      {/* Info panel */}
      <FrameworkInfoPanel variant="ice" />

      {/* Score display */}
      <div className="flex items-center justify-between bg-violet-50 rounded-xl px-4 py-3">
        <span className="text-sm font-medium text-violet-700">ICE Score <span className="font-normal text-violet-500">(0–100)</span></span>
        <span className="text-2xl font-bold text-violet-600">{ice ? score.toFixed(1) : '—'}</span>
      </div>

      {/* Impact */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">Impact</label>
          <span className="text-sm font-semibold text-indigo-600">{data.impact}</span>
        </div>
        <ButtonGrid value={data.impact} onChange={v => update({ impact: v })} />
      </div>

      {/* Confidence */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">Confidence</label>
          <span className="text-sm font-semibold text-indigo-600">{data.confidence}</span>
        </div>
        <ButtonGrid value={data.confidence} onChange={v => update({ confidence: v })} />
      </div>

      {/* Ease */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">Ease</label>
          <span className="text-sm font-semibold text-indigo-600">{data.ease}</span>
        </div>
        <ButtonGrid value={data.ease} onChange={v => update({ ease: v })} />
      </div>

      {!ice && (
        <button
          onClick={() => update(DEFAULT_ICE)}
          className="w-full py-2 text-sm font-medium text-violet-600 border border-dashed border-violet-300 rounded-lg hover:bg-violet-50 transition-colors"
        >
          + Start ICE scoring
        </button>
      )}
    </div>
  );
}
