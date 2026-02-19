interface Props {
  framework: 'rice' | 'ice';
}

export function FormulaDisplay({ framework }: Props) {
  if (framework === 'rice') {
    return (
      <div className="bg-white rounded-xl border border-indigo-100 px-5 py-4 font-mono text-center">
        <div className="text-lg font-bold flex items-center justify-center gap-1 flex-wrap">
          <span className="text-indigo-600">Reach</span>
          <span className="text-gray-400 font-normal"> × </span>
          <span className="text-emerald-600">Impact</span>
          <span className="text-gray-400 font-normal"> × </span>
          <span className="text-amber-600">Confidence</span>
        </div>
        <div className="my-1 border-t border-gray-300 w-48 mx-auto" />
        <div className="text-lg font-bold text-rose-500">Effort</div>
        <div className="mt-2 text-xs text-gray-400 font-sans">Higher reach, impact, and confidence — lower effort — = higher score</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-violet-100 px-5 py-4 font-mono text-center">
      <div className="text-lg font-bold flex items-center justify-center gap-1 flex-wrap">
        <span className="text-indigo-600">Impact</span>
        <span className="text-gray-400 font-normal"> × </span>
        <span className="text-emerald-600">Confidence</span>
        <span className="text-gray-400 font-normal"> × </span>
        <span className="text-amber-600">Ease</span>
        <span className="text-gray-400 font-normal"> / </span>
        <span className="text-gray-500">10</span>
      </div>
      <div className="mt-2 text-xs text-gray-400 font-sans">Normalized to a 0–100 scale</div>
    </div>
  );
}
