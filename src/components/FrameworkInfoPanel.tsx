import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { FormulaDisplay } from './FormulaDisplay';
import { ScoreBands } from './ScoreBands';

const INFO_DISMISSED_KEY = 'scorecard-info-dismissed';

function isFirstVisit() {
  return localStorage.getItem(INFO_DISMISSED_KEY) !== 'true';
}

// ─── Shared collapsible shell ────────────────────────────────────────────────

interface ShellProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  accent: 'indigo' | 'violet';
  children: React.ReactNode;
}

function CollapsibleShell({ label, open, onToggle, accent, children }: ShellProps) {
  const borderColor = accent === 'indigo' ? 'border-indigo-200' : 'border-violet-200';
  const bgColor = accent === 'indigo' ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-violet-50 hover:bg-violet-100';
  const textColor = accent === 'indigo' ? 'text-indigo-700' : 'text-violet-700';
  const panelBg = accent === 'indigo' ? 'bg-indigo-50/50' : 'bg-violet-50/50';
  const leftBorder = accent === 'indigo' ? 'border-l-4 border-l-indigo-300' : 'border-l-4 border-l-violet-300';

  return (
    <div className={`rounded-xl border ${borderColor} overflow-hidden`}>
      {/* Banner trigger */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium ${textColor} ${bgColor} transition-colors`}
      >
        <span className="flex items-center gap-2">
          <span>📖</span>
          <span>{label}</span>
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Animated panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease-out',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className={`${panelBg} ${leftBorder} px-5 py-5 space-y-5`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RICE panel content ──────────────────────────────────────────────────────

function RiceContent() {
  return (
    <>
      <FormulaDisplay framework="rice" />

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2.5">What each field means</h4>
        <div className="space-y-2">
          {[
            { color: 'bg-indigo-500', name: 'Reach', desc: 'Users affected per quarter.', example: 'e.g. 500 = 500 users will see this change' },
            { color: 'bg-emerald-500', name: 'Impact', desc: 'How much it moves the needle per user.', example: 'Massive=3×, High=2×, Medium=1×, Low=0.5×, Minimal=0.25×' },
            { color: 'bg-amber-500', name: 'Confidence', desc: 'How sure you are of your estimates.', example: 'High=100%, Medium=80%, Low=50%' },
            { color: 'bg-rose-500', name: 'Effort', desc: 'Story points to design, build & ship.', example: 'Higher effort divides the score — it penalizes complexity' },
          ].map(f => (
            <div key={f.name} className="flex gap-2.5 text-sm">
              <div className={`w-2 h-2 rounded-full ${f.color} flex-shrink-0 mt-1.5`} />
              <div>
                <span className="font-semibold text-gray-800">{f.name}</span>
                {' '}<span className="text-gray-600">{f.desc}</span>
                {' '}<span className="text-gray-400 text-xs">{f.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Score interpretation</h4>
        <ScoreBands framework="rice" />
      </div>

      <div className="text-sm text-gray-600 bg-white rounded-lg px-4 py-3 border border-indigo-100">
        <span className="font-semibold text-gray-700">Best used when</span> you have real user data (reach numbers), want to account for engineering cost precisely, or need a defensible score for stakeholder presentations.
      </div>
    </>
  );
}

// ─── ICE panel content ───────────────────────────────────────────────────────

function IceContent() {
  return (
    <>
      <FormulaDisplay framework="ice" />

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2.5">What each field means</h4>
        <div className="space-y-2">
          {[
            { color: 'bg-indigo-500', name: 'Impact', desc: 'How much will this move the needle?', example: '10 = transformative, 1 = negligible' },
            { color: 'bg-emerald-500', name: 'Confidence', desc: 'How confident are you in this estimate?', example: '10 = very certain, 1 = pure guess' },
            { color: 'bg-amber-500', name: 'Ease', desc: 'How easy is this to implement?', example: '10 = trivial (days), 1 = extremely complex (months)' },
          ].map(f => (
            <div key={f.name} className="flex gap-2.5 text-sm">
              <div className={`w-2 h-2 rounded-full ${f.color} flex-shrink-0 mt-1.5`} />
              <div>
                <span className="font-semibold text-gray-800">{f.name}</span>
                {' '}<span className="text-gray-600">{f.desc}</span>
                {' '}<span className="text-gray-400 text-xs">{f.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Score interpretation (0–100)</h4>
        <ScoreBands framework="ice" />
      </div>

      <div className="text-sm text-gray-600 bg-white rounded-lg px-4 py-3 border border-violet-100">
        <span className="font-semibold text-gray-700">Best used when</span> you're early-stage or lack reach data, need to score quickly, or want a gut-check before deeper analysis.
      </div>
    </>
  );
}

// ─── Global overview panel content ──────────────────────────────────────────

function GlobalContent() {
  return (
    <>
      {/* Comparison table */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2.5">RICE vs ICE at a glance</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 bg-gray-100 rounded-tl-lg text-gray-500 font-semibold w-1/4"></th>
                <th className="text-left py-2 px-3 bg-indigo-100 text-indigo-700 font-semibold">RICE</th>
                <th className="text-left py-2 px-3 bg-violet-100 text-violet-700 font-semibold rounded-tr-lg">ICE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Formula', '(Reach × Impact × Confidence) / Effort', '(Impact × Confidence × Ease) / 10'],
                ['Best for', 'Data-driven teams with usage metrics', 'Quick gut-check, early-stage ideas'],
                ['# of inputs', '4 fields (one numeric, three structured)', '3 fields (all 1–10 scales)'],
                ['Output range', 'Unbounded — higher is better', '0–100 normalized'],
              ].map(([label, rice, ice]) => (
                <tr key={label} className="bg-white">
                  <td className="py-2 px-3 font-semibold text-gray-500">{label}</td>
                  <td className="py-2 px-3 text-gray-700">{rice}</td>
                  <td className="py-2 px-3 text-gray-700">{ice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* When to use which */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">When to use which</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-indigo-100 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-indigo-700 mb-1.5">Use RICE when…</p>
            <p>✓ You have real user reach data</p>
            <p>✓ Engineering cost matters to the ranking</p>
            <p>✓ You need a defensible, data-backed score</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-violet-100 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-violet-700 mb-1.5">Use ICE when…</p>
            <p>✓ You don't have reach data yet</p>
            <p>✓ You need to score features quickly</p>
            <p>✓ You want a fast gut-check pass</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-semibold">Use both</span> to spot divergence — a feature that ranks very differently across frameworks is a signal worth investigating.
        </p>
      </div>

      {/* Worked example */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Worked example — "Email Notifications"</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-indigo-100 text-xs space-y-1">
            <p className="font-semibold text-indigo-700 mb-1.5">RICE</p>
            <p className="text-gray-600">Reach: <span className="font-medium text-gray-800">600</span></p>
            <p className="text-gray-600">Impact: <span className="font-medium text-gray-800">High (2)</span></p>
            <p className="text-gray-600">Confidence: <span className="font-medium text-gray-800">Medium (0.8)</span></p>
            <p className="text-gray-600">Effort: <span className="font-medium text-gray-800">3 SP</span></p>
            <div className="border-t border-gray-100 pt-1 mt-1">
              <p className="text-gray-500">(600 × 2 × 0.8) / 3</p>
              <p className="font-bold text-indigo-600 text-sm">= 320.0</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-violet-100 text-xs space-y-1">
            <p className="font-semibold text-violet-700 mb-1.5">ICE</p>
            <p className="text-gray-600">Impact: <span className="font-medium text-gray-800">8</span></p>
            <p className="text-gray-600">Confidence: <span className="font-medium text-gray-800">7</span></p>
            <p className="text-gray-600">Ease: <span className="font-medium text-gray-800">6</span></p>
            <div className="border-t border-gray-100 pt-1 mt-1 mt-[21px]">
              <p className="text-gray-500">(8 × 7 × 6) / 10</p>
              <p className="font-bold text-violet-600 text-sm">= 33.6</p>
            </div>
          </div>
        </div>
      </div>

      {/* External links */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Further reading</h4>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            RICE: Simple Prioritization for PMs — Intercom
          </a>
          <a
            href="https://blog.growthhackers.com/the-practical-advantage-of-the-ice-score-as-a-test-prioritization-framework-cdd5f0808d64"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            The ICE Score Framework — GrowthHackers
          </a>
        </div>
      </div>
    </>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

interface Props {
  variant: 'global' | 'rice' | 'ice';
}

export function FrameworkInfoPanel({ variant }: Props) {
  const [open, setOpen] = useState(() => {
    if (variant === 'global') return isFirstVisit();
    return false;
  });

  function handleToggle() {
    if (variant === 'global' && open) {
      localStorage.setItem(INFO_DISMISSED_KEY, 'true');
    }
    setOpen(o => !o);
  }

  const label =
    variant === 'global'
      ? 'Learn how RICE & ICE scoring works'
      : variant === 'rice'
      ? 'Learn how RICE scoring works'
      : 'Learn how ICE scoring works';

  const accent = variant === 'ice' ? 'violet' : 'indigo';

  return (
    <CollapsibleShell label={label} open={open} onToggle={handleToggle} accent={accent}>
      {variant === 'global' && <GlobalContent />}
      {variant === 'rice' && <RiceContent />}
      {variant === 'ice' && <IceContent />}
    </CollapsibleShell>
  );
}
