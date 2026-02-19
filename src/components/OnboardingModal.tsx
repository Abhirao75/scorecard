import { useState } from 'react';
import { ChevronRight, BarChart3 } from 'lucide-react';

const ONBOARDING_KEY = 'scorecard-onboarding-complete';
const INFO_DISMISSED_KEY = 'scorecard-info-dismissed';

export function shouldShowOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) !== 'true';
}

// ─── Left-panel mockups ───────────────────────────────────────────────────────

function MockRankedList() {
  return (
    <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/10 border-b border-white/10">
        <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
          <BarChart3 className="w-3 h-3 text-indigo-600" />
        </div>
        <span className="text-white text-xs font-bold">Scorecard</span>
        <div className="ml-auto flex gap-1">
          <div className="w-12 h-4 rounded bg-white/20" />
          <div className="w-12 h-4 rounded bg-white/30" />
          <div className="w-12 h-4 rounded bg-white/20" />
        </div>
      </div>
      <div className="p-3 space-y-2">
        {[
          { rank: 1, name: 'Onboarding Redesign', score: '300.0', delta: null },
          { rank: 2, name: 'Global Search', score: '256.0', delta: '▲1' },
          { rank: 3, name: 'Dark Mode', score: '66.7', delta: '▼1' },
        ].map(f => (
          <div key={f.rank} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <span className="w-5 h-5 rounded-md bg-white/20 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {f.rank}
            </span>
            <span className="text-white text-xs font-medium flex-1 truncate">{f.name}</span>
            {f.delta && <span className="text-xs text-emerald-300 font-semibold">{f.delta}</span>}
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">{f.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockBeforeAfter() {
  return (
    <div className="w-full space-y-3">
      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2.5">❌ Before</p>
        <div className="space-y-2">
          {['CEO says so', 'Loudest voice wins', 'Seems important'].map(item => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
              <span className="text-white/40 text-xs line-through">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center text-white/40 text-sm font-bold">↓</div>
      <div className="bg-white/20 rounded-xl p-4 border border-emerald-300/30">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2.5">✅ After</p>
        <div className="space-y-2">
          {[
            { rank: 1, name: 'Onboarding', score: '300.0' },
            { rank: 2, name: 'Search', score: '256.0' },
            { rank: 3, name: 'Dark Mode', score: '66.7' },
          ].map(f => (
            <div key={f.rank} className="flex items-center gap-2">
              <span className="text-white/50 text-xs font-bold w-5">#{f.rank}</span>
              <span className="text-white text-xs font-medium flex-1">{f.name}</span>
              <span className="text-indigo-200 text-xs font-semibold">{f.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockFeatureCard() {
  return (
    <div className="w-full bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-4 space-y-3">
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white text-sm font-semibold">Global Search</span>
          <span className="text-xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">Planned</span>
        </div>
        <p className="text-white/50 text-xs">Allow users to search all content</p>
      </div>
      <div className="flex gap-1 bg-white/10 p-1 rounded-lg w-fit">
        <div className="px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-md shadow-sm">RICE</div>
        <div className="px-3 py-1 text-white/50 text-xs font-semibold">ICE</div>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Reach', value: '600' },
          { label: 'Impact', value: 'High ▾' },
          { label: 'Confidence', value: 'Medium ▾' },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="text-white/50 text-xs w-20 flex-shrink-0">{f.label}</span>
            <div className="flex-1 bg-white/10 rounded-md px-2 py-1 text-white text-xs">{f.value}</div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs w-20 flex-shrink-0">Effort</span>
          <div className="flex gap-1">
            {[1, 2, 3, 5, 8].map(n => (
              <div
                key={n}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center font-bold flex-shrink-0 ${
                  n === 3 ? 'bg-white text-indigo-600' : 'bg-white/10 text-white/50'
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-indigo-500/30 rounded-lg px-3 py-2">
        <span className="text-white/60 text-xs">RICE Score</span>
        <span className="text-white text-sm font-bold">320.0</span>
      </div>
    </div>
  );
}

function MockBothView() {
  return (
    <div className="w-full grid grid-cols-2 gap-2">
      <div className="bg-white/10 rounded-xl p-3 border border-white/20">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
          <span className="text-white/60 text-xs font-bold uppercase tracking-wider">RICE</span>
        </div>
        <div className="space-y-2">
          {[
            { rank: 1, name: 'Onboarding', score: '300.0' },
            { rank: 2, name: 'Search', score: '256.0' },
            { rank: 3, name: 'Dark Mode', score: '66.7' },
          ].map(f => (
            <div key={f.rank} className="flex items-center gap-1">
              <span className="text-white/40 text-xs w-4 font-bold">#{f.rank}</span>
              <span className="text-white text-xs flex-1 truncate">{f.name}</span>
              <span className="text-indigo-200 text-xs font-semibold">{f.score}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/10 rounded-xl p-3 border border-white/20">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300" />
          <span className="text-white/60 text-xs font-bold uppercase tracking-wider">ICE</span>
        </div>
        <div className="space-y-2">
          {[
            { rank: 1, name: 'Onboarding', score: '40.5', delta: null },
            { rank: 2, name: 'Dark Mode', score: '38.4', delta: '▲1' },
            { rank: 3, name: 'Search', score: '33.6', delta: '▼1' },
          ].map(f => (
            <div key={f.rank} className="flex items-center gap-1">
              <span className="text-white/40 text-xs w-4 font-bold">#{f.rank}</span>
              <span className="text-white text-xs flex-1 truncate">{f.name}</span>
              {f.delta && <span className="text-emerald-300 text-xs font-bold">{f.delta}</span>}
              <span className="text-violet-200 text-xs font-semibold">{f.score}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 opacity-40">
            <span className="text-white/40 text-xs w-4">—</span>
            <span className="text-white/60 text-xs italic">Not scored</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide definitions ────────────────────────────────────────────────────────

interface SlideData {
  leftPanel: React.ReactNode;
  headline: string;
  body: React.ReactNode;
}

const SLIDES: SlideData[] = [
  {
    leftPanel: <MockRankedList />,
    headline: 'Welcome to Scorecard',
    body: (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-gray-500">Stop prioritizing by gut feel.</p>
        <p className="text-gray-600 leading-relaxed">
          Scorecard uses two industry-standard frameworks —{' '}
          <span className="font-semibold text-indigo-600">RICE</span> and{' '}
          <span className="font-semibold text-violet-600">ICE</span> — to score and rank your features
          objectively. No more HiPPO decisions.
        </p>
        <p className="text-sm text-gray-400">Takes under 2 minutes per feature.</p>
      </div>
    ),
  },
  {
    leftPanel: <MockBeforeAfter />,
    headline: 'Replace opinions with scores',
    body: (
      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">
          RICE and ICE give every feature a number, so you can compare them objectively and defend
          roadmap decisions with data.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
            <p className="text-indigo-700 text-xs font-bold mb-1">RICE</p>
            <p className="text-indigo-600 text-xs leading-relaxed">
              Best when you have user data and need a defensible, data-backed score
            </p>
          </div>
          <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
            <p className="text-violet-700 text-xs font-bold mb-1">ICE</p>
            <p className="text-violet-600 text-xs leading-relaxed">
              Best for quick gut-check scoring when you're early-stage or moving fast
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Use both to spot where the frameworks disagree — that divergence is worth investigating.
        </p>
      </div>
    ),
  },
  {
    leftPanel: <MockFeatureCard />,
    headline: 'Scoring takes under 2 minutes',
    body: (
      <div className="space-y-4">
        <ol className="space-y-3">
          {[
            { n: 1, text: 'Click + Add Feature and give it a name' },
            { n: 2, text: 'Expand the card and open the RICE or ICE tab' },
            { n: 3, text: 'Fill in the fields — scores calculate instantly' },
            { n: 4, text: 'Repeat for your backlog — Scorecard ranks everything automatically' },
          ].map(step => (
            <li key={step.n} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step.n}
              </span>
              <span className="text-gray-600 text-sm leading-relaxed">{step.text}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-gray-400">
          Tip: Hit the 📖 info banner inside each tab for a field reference.
        </p>
      </div>
    ),
  },
  {
    leftPanel: <MockBothView />,
    headline: 'Your ranked backlog, your data',
    body: (
      <div className="space-y-4">
        <ul className="space-y-3.5">
          {[
            { icon: '📊', text: 'Switch between RICE, ICE, or Both view using the toggle at the top' },
            { icon: '▲▼', text: 'Rank deltas in Both view highlight where the two frameworks disagree' },
            { icon: '💾', text: 'Your data is auto-saved to the browser. Export JSON anytime as a backup — never lose your work' },
          ].map(item => (
            <li key={item.icon} className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 mt-0.5 w-6 text-center">{item.icon}</span>
              <span className="text-gray-600 text-sm leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  function finish() {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(INFO_DISMISSED_KEY, 'true');
    onComplete();
  }

  function goTo(n: number) {
    if (n === slide || fading) return;
    setFading(true);
    setTimeout(() => {
      setSlide(n);
      setFading(false);
    }, 150);
  }

  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex"
        style={{ height: '560px' }}
      >
        {/* Left panel — indigo gradient + mockup */}
        <div className="w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center p-8 relative overflow-hidden flex-shrink-0">
          {/* Decorative circles */}
          <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div
            className="w-full relative z-10"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 150ms ease' }}
          >
            {current.leftPanel}
          </div>
        </div>

        {/* Right panel — content */}
        <div className="flex-1 flex flex-col p-8 relative min-w-0">
          {/* Skip */}
          <button
            onClick={finish}
            className="absolute top-5 right-5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip
          </button>

          {/* Slide content */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{ opacity: fading ? 0 : 1, transition: 'opacity 150ms ease' }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {current.headline}
            </h2>
            {current.body}
          </div>

          {/* Footer: dots + CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Clickable dot indicators */}
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === slide
                        ? 'w-6 bg-indigo-600'
                        : 'w-2 bg-gray-200 hover:bg-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Next / Explore CTA */}
            {isLast ? (
              <button
                onClick={finish}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
              >
                Explore the app
              </button>
            ) : (
              <button
                onClick={() => goTo(slide + 1)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
