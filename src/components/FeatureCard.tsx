import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Trash2, GripVertical, AlertCircle, Ticket } from 'lucide-react';
import { useFeatureStore } from '../store/useFeatureStore';
import { RiceForm } from './RiceForm';
import { IceForm } from './IceForm';
import { TagInput } from './TagInput';
import type { Feature, Status } from '../types';

interface Props {
  feature: Feature;
  showDragHandle?: boolean;
  dragHandleProps?: Record<string, unknown>;
  onGenerateTickets?: (feature: Feature) => void;
}

const STATUS_OPTIONS: { value: Status; label: string; color: string }[] = [
  { value: 'planned', label: 'Planned', color: 'bg-gray-100 text-gray-600' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  { value: 'done', label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
];

export function FeatureCard({ feature, showDragHandle, dragHandleProps, onGenerateTickets }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'rice' | 'ice'>('rice');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { updateFeature, deleteFeature, duplicateFeature, allTags, activeFramework } = useFeatureStore();

  const hasManualOverride = feature.riceManualRank !== undefined || feature.iceManualRank !== undefined;

  function handleDelete() {
    if (confirmDelete) deleteFeature(feature.id);
    else setConfirmDelete(true);
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === feature.status) ?? STATUS_OPTIONS[0];

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${expanded ? 'border-indigo-200 shadow-lg shadow-indigo-100/50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}>
      {/* Card header */}
      <div className="flex items-start gap-3 p-4">
        {showDragHandle && (
          <div
            {...(dragHandleProps as Record<string, unknown>)}
            className="mt-0.5 text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Name */}
              <input
                value={feature.name}
                onChange={e => updateFeature(feature.id, { name: e.target.value })}
                className="text-base font-semibold text-gray-900 bg-transparent border-0 outline-none w-full focus:bg-gray-50 rounded px-1 -ml-1 truncate"
                onClick={e => e.stopPropagation()}
              />
              {/* Description */}
              <input
                value={feature.description}
                onChange={e => updateFeature(feature.id, { description: e.target.value })}
                placeholder="Add a description..."
                className="text-sm text-gray-500 bg-transparent border-0 outline-none w-full focus:bg-gray-50 rounded px-1 -ml-1 mt-0.5"
                onClick={e => e.stopPropagation()}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {hasManualOverride && (
                <span title="Manually ranked" className="text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
              )}
              {onGenerateTickets && (
                <button onClick={() => onGenerateTickets(feature)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Generate Tickets">
                  <Ticket className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={() => duplicateFeature(feature.id)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Duplicate">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                onBlur={() => setConfirmDelete(false)}
                className={`p-1.5 rounded-lg transition-colors ${confirmDelete ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                title={confirmDelete ? 'Click again to confirm' : 'Delete'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tags + status row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Status badge */}
            <select
              value={feature.status}
              onChange={e => updateFeature(feature.id, { status: e.target.value as Status })}
              onClick={e => e.stopPropagation()}
              className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 outline-none cursor-pointer ${currentStatus.color}`}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Score chips — show only the relevant framework(s) for the active view */}
            {(activeFramework === 'rice' || activeFramework === 'both') && (
              <span className={`text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full transition-opacity ${!feature.rice ? 'opacity-40' : ''}`}>
                {feature.rice ? `RICE ${feature.rice.score.toFixed(1)}` : 'RICE —'}
              </span>
            )}
            {(activeFramework === 'ice' || activeFramework === 'both') && (
              <span className={`text-xs font-semibold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full transition-opacity ${!feature.ice ? 'opacity-40' : ''}`}>
                {feature.ice ? `ICE ${feature.ice.score.toFixed(1)}` : 'ICE —'}
              </span>
            )}

            {/* Tags */}
            {feature.tags.map(t => (
              <span key={t} className="text-xs text-gray-500">#{t}</span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mt-0.5"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-4">
          {activeFramework === 'both' ? (
            <>
              {/* Tabs — only in Both view */}
              <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
                {(['rice', 'ice'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                      tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
              {tab === 'rice' ? (
                <RiceForm featureId={feature.id} rice={feature.rice} showLearnPanel />
              ) : (
                <IceForm featureId={feature.id} ice={feature.ice} showLearnPanel />
              )}
            </>
          ) : activeFramework === 'rice' ? (
            <RiceForm featureId={feature.id} rice={feature.rice} />
          ) : (
            <IceForm featureId={feature.id} ice={feature.ice} />
          )}

          {/* Tags editor */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <TagInput
              tags={feature.tags}
              suggestions={allTags()}
              onChange={tags => updateFeature(feature.id, { tags })}
            />
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={feature.notes}
              onChange={e => updateFeature(feature.id, { notes: e.target.value })}
              placeholder="Add context, links, or reasoning..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
