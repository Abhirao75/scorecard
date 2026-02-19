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
import { FeatureCard } from './FeatureCard';
import type { Feature } from '../types';

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
}: {
  feature: Feature;
  rank: number;
  delta?: number;
  framework: 'rice' | 'ice';
  disableDrag?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: feature.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const isUnscored = framework === 'rice' ? !feature.rice : !feature.ice;
  const showHandle = !isUnscored && !disableDrag;

  return (
    <div ref={setNodeRef} style={style} className={`flex items-start gap-2 ${isUnscored ? 'opacity-50' : ''}`}>
      <div className="mt-3 flex items-center gap-1.5">
        <RankBadge rank={rank} />
        {delta !== undefined && <DeltaBadge delta={delta} />}
      </div>
      <div className="flex-1 min-w-0">
        <FeatureCard
          feature={feature}
          showDragHandle={showHandle}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      </div>
    </div>
  );
}

function SingleFrameworkList({
  features,
  framework,
  sortByCompleteness,
}: {
  features: Feature[];
  framework: 'rice' | 'ice';
  sortByCompleteness?: boolean;
}) {
  const { setRiceManualRank, setIceManualRank } = useFeatureStore();
  const sorted = sortByCompleteness
    ? sortByCompletenessFirst(features, framework)
    : sortByFramework(features, framework);
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
            <SortableRow key={feature.id} feature={feature} rank={i + 1} framework={framework} disableDrag={sortByCompleteness} />
          ))}
          {sorted.length === 0 && <EmptyState />}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function BothView({ features, sortByCompleteness }: { features: Feature[]; sortByCompleteness?: boolean }) {
  const riceList = sortByCompleteness
    ? sortByCompletenessFirst(features, 'rice')
    : sortByFramework(features, 'rice');
  const iceList = sortByCompleteness
    ? sortByCompletenessFirst(features, 'ice')
    : sortByFramework(features, 'ice');

  const riceRankMap = new Map(riceList.map((f, i) => [f.id, i + 1]));
  const iceRankMap = new Map(iceList.map((f, i) => [f.id, i + 1]));

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* RICE column */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">RICE Ranked</h3>
        </div>
        <div className="space-y-3">
          {riceList.map((feature, i) => {
            const iceRank = iceRankMap.get(feature.id);
            const delta = iceRank !== undefined ? i + 1 - iceRank : undefined;
            return (
              <div key={feature.id} className="flex items-start gap-2">
                <div className="mt-3 flex items-center gap-1.5">
                  <RankBadge rank={i + 1} />
                  {delta !== undefined && <DeltaBadge delta={delta} />}
                </div>
                <div className="flex-1 min-w-0">
                  <FeatureCard feature={feature} />
                </div>
              </div>
            );
          })}
          {riceList.length === 0 && <EmptyState />}
        </div>
      </div>

      {/* ICE column */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">ICE Ranked</h3>
        </div>
        <div className="space-y-3">
          {iceList.map((feature, i) => {
            const riceRank = riceRankMap.get(feature.id);
            const delta = riceRank !== undefined ? i + 1 - riceRank : undefined;
            return (
              <div key={feature.id} className="flex items-start gap-2">
                <div className="mt-3 flex items-center gap-1.5">
                  <RankBadge rank={i + 1} />
                  {delta !== undefined && <DeltaBadge delta={delta} />}
                </div>
                <div className="flex-1 min-w-0">
                  <FeatureCard feature={feature} />
                </div>
              </div>
            );
          })}
          {iceList.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
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
  sortByCompleteness?: boolean;
}

export function RankedList({ filterTag, filterStatus, hideScored, sortByCompleteness }: Props) {
  const { features, activeFramework } = useFeatureStore();

  const filtered = features.filter(f => {
    if (filterTag && !f.tags.includes(filterTag)) return false;
    if (filterStatus && f.status !== filterStatus) return false;
    if (hideScored && (f.rice !== null || f.ice !== null)) return false;
    return true;
  });

  if (activeFramework === 'both') {
    return <BothView features={filtered} sortByCompleteness={sortByCompleteness} />;
  }

  return (
    <SingleFrameworkList
      features={filtered}
      framework={activeFramework as 'rice' | 'ice'}
      sortByCompleteness={sortByCompleteness}
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

