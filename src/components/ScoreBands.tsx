interface Band {
  label: string;
  range: string;
  color: string;
  bg: string;
}

const RICE_BANDS: Band[] = [
  { label: 'Exceptional', range: '500+', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  { label: 'Strong', range: '100–499', color: 'text-blue-700', bg: 'bg-blue-400' },
  { label: 'Moderate', range: '10–99', color: 'text-amber-700', bg: 'bg-amber-400' },
  { label: 'Low priority', range: '< 10', color: 'text-rose-700', bg: 'bg-rose-400' },
];

const ICE_BANDS: Band[] = [
  { label: 'High priority', range: '70–100', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  { label: 'Strong', range: '40–69', color: 'text-blue-700', bg: 'bg-blue-400' },
  { label: 'Moderate', range: '15–39', color: 'text-amber-700', bg: 'bg-amber-400' },
  { label: 'Low priority', range: '< 15', color: 'text-rose-700', bg: 'bg-rose-400' },
];

interface Props {
  framework: 'rice' | 'ice';
}

export function ScoreBands({ framework }: Props) {
  const bands = framework === 'rice' ? RICE_BANDS : ICE_BANDS;

  return (
    <div>
      {/* Visual bar */}
      <div className="flex rounded-full overflow-hidden h-2.5 mb-3">
        {bands.map(b => (
          <div key={b.range} className={`flex-1 ${b.bg}`} />
        ))}
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {bands.map(b => (
          <div key={b.range} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${b.bg}`} />
            <span className="text-xs text-gray-600">
              <span className="font-semibold">{b.range}</span>
              {' '}— {b.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2 italic">Bands are relative guides — always compare features within the same backlog.</p>
    </div>
  );
}
