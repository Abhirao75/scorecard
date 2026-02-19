import { useFeatureStore } from '../store/useFeatureStore';
import { computeRiceScore, IMPACT_OPTIONS, CONFIDENCE_OPTIONS, FIBONACCI_OPTIONS } from '../utils/scoring';
import { FrameworkInfoPanel } from './FrameworkInfoPanel';
import type { RiceData } from '../types';

interface Props {
  featureId: string;
  rice: RiceData | null;
}

const DEFAULT_RICE: Omit<RiceData, 'score'> = { reach: 0, impact: 1, confidence: 1.0, effort: 3 };

export function RiceForm({ featureId, rice }: Props) {
  const { updateFeature } = useFeatureStore();
  const data = rice ?? { ...DEFAULT_RICE, score: 0 };

  function update(partial: Partial<Omit<RiceData, 'score'>>) {
    const next = { reach: data.reach, impact: data.impact, confidence: data.confidence, effort: data.effort, ...partial };
    updateFeature(featureId, { rice: { ...next, score: computeRiceScore(next) } });
  }

  const score = rice?.score ?? 0;

  return (
    <div className="space-y-4">
      {/* Info panel */}
      <FrameworkInfoPanel variant="rice" />

      {/* Score display */}
      <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3">
        <span className="text-sm font-medium text-indigo-700">RICE Score</span>
        <span className="text-2xl font-bold text-indigo-600">{rice ? score.toFixed(1) : '—'}</span>
      </div>

      {/* Reach */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Reach <span className="text-gray-400 font-normal">(users / quarter)</span>
        </label>
        <input
          type="number"
          min={0}
          value={data.reach || ''}
          onChange={e => update({ reach: parseFloat(e.target.value) || 0 })}
          placeholder="e.g. 500"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
      </div>

      {/* Impact */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Impact</label>
        <select
          value={data.impact}
          onChange={e => update({ impact: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
        >
          {IMPACT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Confidence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confidence</label>
        <select
          value={data.confidence}
          onChange={e => update({ confidence: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
        >
          {CONFIDENCE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Effort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Effort <span className="text-gray-400 font-normal">(story points)</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {FIBONACCI_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => update({ effort: n })}
              className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-all ${
                data.effort === n
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {!rice && (
        <button
          onClick={() => update(DEFAULT_RICE)}
          className="w-full py-2 text-sm font-medium text-indigo-600 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          + Start RICE scoring
        </button>
      )}
    </div>
  );
}
