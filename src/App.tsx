import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { Header } from './components/Header';
import { AddFeatureModal } from './components/AddFeatureModal';
import { RankedList } from './components/RankedList';
import { FrameworkInfoPanel } from './components/FrameworkInfoPanel';
import { OnboardingModal, shouldShowOnboarding } from './components/OnboardingModal';
import { useFeatureStore } from './store/useFeatureStore';

const FRAMEWORK_OPTIONS = [
  { value: 'rice', label: 'RICE' },
  { value: 'ice', label: 'ICE' },
  { value: 'both', label: 'Both' },
] as const;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'planned', label: 'Planned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => shouldShowOnboarding());
  const [showModal, setShowModal] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [hideScored, setHideScored] = useState(false);
  const [sortByCompleteness, setSortByCompleteness] = useState(false);
  const { activeFramework, setFramework, allTags, samplesDismissed, dismissSamples, features } = useFeatureStore();

  const tags = allTags();
  const hasSamples = !samplesDismissed && features.some(f =>
    ['Global Search', 'Onboarding Flow Redesign', 'Dark Mode'].includes(f.name)
  );

  // Stats reflect tag+status filters but not hideScored (so the count is always meaningful)
  const filteredForStats = features.filter(f => {
    if (filterTag && !f.tags.includes(filterTag)) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    return true;
  });
  const totalCount = filteredForStats.length;
  const riceScoredCount = filteredForStats.filter(f => f.rice !== null).length;
  const iceScoredCount = filteredForStats.filter(f => f.ice !== null).length;

  const hasActiveFilters = filterTag !== '' || filterStatus !== '' || hideScored || sortByCompleteness;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Sample data banner */}
        {hasSamples && (
          <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <span>
              👋 These are <strong>sample features</strong> to show you how Scorecard works. Delete them and add your own.
            </span>
            <button onClick={dismissSamples} className="flex-shrink-0 p-1 hover:bg-amber-100 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Add feature button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>

          {/* Framework toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {FRAMEWORK_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFramework(opt.value)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  activeFramework === opt.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Tag filter */}
          {tags.length > 0 && (
            <div className="relative">
              <select
                value={filterTag}
                onChange={e => setFilterTag(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600"
              >
                <option value="">All tags</option>
                {tags.map(t => <option key={t} value={t}>#{t}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600"
            >
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort by completeness toggle */}
          <button
            onClick={() => setSortByCompleteness(s => !s)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
              sortByCompleteness
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700'
            }`}
          >
            Sort: Completeness
          </button>

          {/* Hide scored toggle */}
          <button
            onClick={() => setHideScored(s => !s)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
              hideScored
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'bg-white text-gray-500 border-gray-200 hover:text-gray-700'
            }`}
          >
            {hideScored ? 'Showing unscored only' : 'Hide scored'}
          </button>

          {/* Clear all filters */}
          {hasActiveFilters && (
            <button
              onClick={() => { setFilterTag(''); setFilterStatus(''); setHideScored(false); setSortByCompleteness(false); }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-red-500 bg-white border border-gray-200 rounded-xl transition-colors"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Global framework info panel */}
        <div className="mb-6">
          <FrameworkInfoPanel variant="global" />
        </div>

        {/* Scoring completeness summary stat */}
        {features.length > 0 && (
          <div className="mb-4 text-sm text-gray-400 flex items-center gap-1.5">
            <span>
              RICE: <span className={riceScoredCount === totalCount ? 'text-emerald-600 font-medium' : 'text-gray-600 font-medium'}>{riceScoredCount} / {totalCount}</span> scored
            </span>
            <span className="text-gray-300">·</span>
            <span>
              ICE: <span className={iceScoredCount === totalCount ? 'text-emerald-600 font-medium' : 'text-gray-600 font-medium'}>{iceScoredCount} / {totalCount}</span> scored
            </span>
          </div>
        )}

        {/* Ranked list */}
        {features.length > 0 ? (
          <RankedList
            filterTag={filterTag}
            filterStatus={filterStatus}
            hideScored={hideScored}
            sortByCompleteness={sortByCompleteness}
          />
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No features yet</h3>
            <p className="text-gray-500 text-sm mb-6">Add your first feature and start scoring with RICE and ICE</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
            >
              Add your first feature
            </button>
          </div>
        )}
      </main>

      {showModal && <AddFeatureModal onClose={() => setShowModal(false)} />}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
    </div>
  );
}
