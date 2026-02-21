import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFeatureStore, sortByFramework, sortByCompletenessFirst } from '../store/useFeatureStore';
import { useSelectionStore } from '../store/useSelectionStore';
import { FeatureCard } from './FeatureCard';
import type { Feature, SortOption } from '../types';

function sortForBothView(features: Feature[], sortOption: SortOption): Feature[] {
  if (sortOption === 'completeness') return sortByCompletenessFirst(features, 'rice');

  const framework: 'rice' | 'ice' = sortOption.startsWith('rice') ? 'rice' : 'ice';
  const ascending = sortOption.endsWith('asc');
  return sortByFramework(features, framework, ascending);
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-500 text-xs font-bold rounded-lg">
      {rank}
    </span>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return null;
  const up = delta < 0;
  return (
    <span className={`text-xs font-semibold flex-shrink-0 ${up ? 'text-emerald-500' : 'text-rose-400'}`}>
      {up ? '▲' : '▼'}{Math.abs(delta)}
    </span>
  );
}

function SortableRow({
  feature,
  rank,
  delta,
  framework,
  disableDrag,
  onGenerateTickets,
}: {
  feature: Feature;
  rank: number;
  delta?: number;
  framework: 'rice' | 'ice';
  disableDrag?: boolean;
  onGenerateTickets?: (feature: Feature) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: feature.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const { toggle, isSelected } = useSelectionStore();

  const isUnscored = framework === 'rice' ? !feature.rice : !feature.ice;
  const showHandle = !isUnscored && !disableDrag;
  const selected = isSelected(feature.id);

  return (
    <div ref={setNodeRef} style={style} className={`flex items-start gap-2 ${isUnscored ? 'opacity-50' : ''}`}>
      <div className="mt-3 flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => toggle(feature.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <RankBadge rank={rank} />
        {delta !== undefined && <DeltaBadge delta={delta} />}
      </div>
      <div className="flex-1 min-w-0">
        <FeatureCard
          feature={feature}
          showDragHandle={showHandle}
          dragHandleProps={{ ...attributes, ...listeners }}
          onGenerateTickets={onGenerateTickets}
        />
      </div>
    </div>
  );
}

function SingleFrameworkList({
  features,
  framework,
  sortOption,
  onGenerateTickets,
}: {
  features: Feature[];
  framework: 'rice' | 'ice';
  sortOption: SortOption;
  onGenerateTickets?: (feature: Feature) => void;
}) {
  const { setRiceManualRank, setIceManualRank } = useFeatureStore();
  const isCompleteness = sortOption === 'completeness';
  const sorted = isCompleteness
    ? sortByCompletenessFirst(features, framework)
    : sortByFramework(features, framework, sortOption.endsWith('asc'));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex(f => f.id === active.id);
    const newIndex = sorted.findIndex(f => f.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    reordered.forEach((f, i) => {
      if (framework === 'rice') setRiceManualRank(f.id, i);
      else setIceManualRank(f.id, i);
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sorted.map((feature, i) => (
            <SortableRow key={feature.id} feature={feature} rank={i + 1} framework={framework} disableDrag={isCompleteness} onGenerateTickets={onGenerateTickets} />
          ))}
          {sorted.length === 0 && <EmptyState />}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function BothView({ features, sortOption, onGenerateTickets }: { features: Feature[]; sortOption: SortOption; onGenerateTickets?: (feature: Feature) => void }) {
  const { setRiceManualRank, setIceManualRank } = useFeatureStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const isCompleteness = sortOption === 'completeness';
  const activeFramework: 'rice' | 'ice' = sortOption === 'completeness' || sortOption.startsWith('ice') ? 'ice' : 'rice';

  // Natural rank maps for delta computation — always score-based descending
  const riceNaturalRankMap = new Map(sortByFramework(features, 'rice').map((f, i) => [f.id, i + 1]));
  const iceNaturalRankMap = new Map(sortByFramework(features, 'ice').map((f, i) => [f.id, i + 1]));

  const sorted = sortForBothView(features, sortOption);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex(f => f.id === active.id);
    const newIndex = sorted.findIndex(f => f.id === over.id);
    const reordered = arrayMove(sorted, oldIndex, newIndex);
    reordered.forEach((f, i) => {
      if (activeFramework === 'rice') setRiceManualRank(f.id, i);
      else setIceManualRank(f.id, i);
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sorted.map((feature, i) => {
            const riceNaturalRank = riceNaturalRankMap.get(feature.id);
            const iceNaturalRank = iceNaturalRankMap.get(feature.id);
            let delta: number | undefined;
            if (feature.rice && feature.ice && riceNaturalRank !== undefined && iceNaturalRank !== undefined) {
              delta = activeFramework === 'rice'
                ? riceNaturalRank - iceNaturalRank
                : iceNaturalRank - riceNaturalRank;
            }
            return (
              <SortableRow
                key={feature.id}
                feature={feature}
                rank={i + 1}
                delta={delta}
                framework={activeFramework}
                disableDrag={isCompleteness}
                onGenerateTickets={onGenerateTickets}
              />
            );
          })}
          {sorted.length === 0 && <EmptyState />}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-400 text-sm">
      No features scored yet
    </div>
  );
}

interface Props {
  filterTag: string;
  filterStatus: string;
  hideScored?: boolean;
  sortOption: SortOption;
  onGenerateTickets?: (feature: Feature) => void;
}

export function RankedList({ filterTag, filterStatus, hideScored, sortOption, onGenerateTickets }: Props) {
  const { features, activeFramework } = useFeatureStore();

  const filtered = features.filter(f => {
    if (filterTag && !f.tags.includes(filterTag)) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    if (hideScored && (f.rice !== null || f.ice !== null)) return false;
    return true;
  });

  if (activeFramework === 'both') {
    return <BothView features={filtered} sortOption={sortOption} onGenerateTickets={onGenerateTickets} />;
  }

  return (
    <SingleFrameworkList
      features={filtered}
      framework={activeFramework as 'rice' | 'ice'}
      sortOption={sortOption}
      onGenerateTickets={onGenerateTickets}
    />
  );
}

export function AllFeaturesList({ filterTag, filterStatus }: Props) {
  const { features } = useFeatureStore();

  const filtered = features.filter(f => {
    if (filterTag && !f.tags.includes(filterTag)) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      {filtered.map(f => <FeatureCard key={f.id} feature={f} />)}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No features match the current filters</div>
      )}
    </div>
  );
}

