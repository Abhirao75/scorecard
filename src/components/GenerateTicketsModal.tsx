import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFeatureStore, sortByFramework } from '../store/useFeatureStore';
import { exportTicketsToCSV, exportTicketsToJiraJSON } from '../utils/ticketExport';
import type { Feature, GeneratedTicket } from '../types';

const SAMPLE_PERSONA = 'B2C mobile users aged 25–40';
const SAMPLE_PLATFORM = 'iOS and Android app, React Native';
const SAMPLE_CONSTRAINTS = 'Must work offline, no third-party auth';

interface Props {
  features: Feature[];
  hasSamples: boolean;
  onClose: () => void;
}

function sortByPriority(feats: Feature[]): Feature[] {
  const rice = sortByFramework([...feats], 'rice');
  const ice = sortByFramework([...feats], 'ice');
  const byRice = rice.map((f, i) => ({ f, riceRank: i }));
  const byIce = ice.map((f, i) => ({ f, iceRank: i }));
  const combined = byRice.map(({ f, riceRank }) => {
    const iceEntry = byIce.find((x) => x.f.id === f.id);
    return { f, riceRank, iceRank: iceEntry?.iceRank ?? 999 };
  });
  combined.sort((a, b) => {
    const scoreA = (a.f.rice?.score ?? 0) + (a.f.ice?.score ?? 0) * 0.01;
    const scoreB = (b.f.rice?.score ?? 0) + (b.f.ice?.score ?? 0) * 0.01;
    return scoreB - scoreA;
  });
  return combined.map((x) => x.f);
}

export function GenerateTicketsModal({ features, hasSamples, onClose }: Props) {
  const { features: allFeatures } = useFeatureStore();
  const sortedAll = sortByFramework(
    allFeatures.filter((f) => f.rice !== null || f.ice !== null),
    'rice'
  );
  const rankMap = new Map(sortedAll.map((f, i) => [f.id, i + 1]));

  const [persona, setPersona] = useState(hasSamples ? SAMPLE_PERSONA : '');
  const [platform, setPlatform] = useState(hasSamples ? SAMPLE_PLATFORM : '');
  const [constraints, setConstraints] = useState(hasSamples ? SAMPLE_CONSTRAINTS : '');
  const [structurePrefs, setStructurePrefs] = useState<Record<string, 'flat' | 'epic'>>(() => {
    const prefs: Record<string, 'flat' | 'epic'> = {};
    features.forEach((f) => {
      prefs[f.id] = features.length === 1 ? 'flat' : 'epic';
    });
    return prefs;
  });
  const [tickets, setTickets] = useState<GeneratedTicket[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedFeatures = sortByPriority(features);

  async function handleGenerate(skipContext: boolean) {
    setError(null);
    setLoading(true);

    // #region agent log
    fetch('http://127.0.0.1:7404/ingest/fde06edd-ef57-44d2-8398-4307dc485c3f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '1be653',
      },
      body: JSON.stringify({
        sessionId: '1be653',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'GenerateTicketsModal.tsx:58',
        message: 'handleGenerate called',
        data: {
          skipContext,
          featureCount: sortedFeatures.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    try {
      const body = {
        features: sortedFeatures.map((f) => {
          // ICE score formula: (impact × confidence × ease) / 10; round and clamp to story-point range 1–21
          const iceEffort = f.ice
            ? Math.max(1, Math.min(21, Math.round((f.ice.impact * f.ice.confidence * f.ice.ease) / 10)))
            : 5;
          return {
            id: f.id,
            name: f.name,
            description: f.description,
            notes: f.notes,
            tags: f.tags,
            rice: f.rice ? { score: f.rice.score, effort: f.rice.effort } : null,
            ice: f.ice ? { score: f.ice.score } : null,
            rank: rankMap.get(f.id) ?? sortedFeatures.indexOf(f) + 1,
            effort: f.rice?.effort ?? iceEffort,
          };
        }),
        contextBrief: skipContext
          ? {}
          : {
              persona: persona.trim() || undefined,
              platform: platform.trim() || undefined,
              constraints: constraints.trim() || undefined,
            },
        structurePrefs,
      };

      const res = await fetch('/api/generate-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // #region agent log
      fetch('http://127.0.0.1:7404/ingest/fde06edd-ef57-44d2-8398-4307dc485c3f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '1be653',
        },
        body: JSON.stringify({
          sessionId: '1be653',
          runId: 'pre-fix',
          hypothesisId: 'H2',
          location: 'GenerateTicketsModal.tsx:96',
          message: 'Response from /api/generate-tickets',
          data: {
            ok: res.ok,
            status: res.status,
            error: data?.error ?? null,
            errorDetails: data?.details ?? null,
            ticketCount: Array.isArray(data?.tickets) ? data.tickets.length : null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setTickets(data.tickets ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);

      // #region agent log
      fetch('http://127.0.0.1:7404/ingest/fde06edd-ef57-44d2-8398-4307dc485c3f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '1be653',
        },
        body: JSON.stringify({
          sessionId: '1be653',
          runId: 'pre-fix',
          hypothesisId: 'H3',
          location: 'GenerateTicketsModal.tsx:104',
          message: 'Error in handleGenerate',
          data: {
            errorMessage: message,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } finally {
      setLoading(false);
    }
  }

  function updateTicket(index: number, updates: Partial<GeneratedTicket>) {
    if (!tickets) return;
    setTickets(
      tickets.map((t, i) => (i === index ? { ...t, ...updates } : t))
    );
  }

  function updateAcceptanceCriteria(index: number, criteria: string[]) {
    updateTicket(index, { acceptanceCriteria: criteria });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex flex-col bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Generate Tickets</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left panel */}
          <div className="w-80 border-r border-gray-100 flex flex-col overflow-y-auto p-6 space-y-4 flex-shrink-0">
            {!tickets && !loading && (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Persona</label>
                  <input
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    placeholder="e.g. B2C mobile users aged 25–40"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <label className="block text-sm font-medium text-gray-700">Platform</label>
                  <input
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="e.g. iOS and Android app, React Native"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <label className="block text-sm font-medium text-gray-700">Constraints</label>
                  <input
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="e.g. Must work offline, no third-party auth"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <button
                  onClick={() => handleGenerate(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Skip and generate
                </button>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Ticket structure per feature</div>
                  {sortedFeatures.map((f) => (
                    <div key={f.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-600 truncate flex-1">{f.name}</span>
                      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        <button
                          onClick={() => setStructurePrefs((p) => ({ ...p, [f.id]: 'flat' }))}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            structurePrefs[f.id] === 'flat' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                          }`}
                        >
                          Flat
                        </button>
                        <button
                          onClick={() => setStructurePrefs((p) => ({ ...p, [f.id]: 'epic' }))}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            structurePrefs[f.id] === 'epic' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
                          }`}
                        >
                          Epic + stories
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleGenerate(false)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generating…
                    </>
                  ) : (
                    'Generate tickets'
                  )}
                </button>
              </>
            )}

            {tickets && (
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700">Features</div>
                {sortedFeatures.map((f) => (
                  <div key={f.id} className="text-sm text-gray-600 truncate">• {f.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex-1 overflow-y-auto p-6 min-w-0">
            {loading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
                <p className="text-sm text-gray-500">Generating tickets with Claude…</p>
              </div>
            )}

            {error && (
              <div className="py-12 px-6 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-rose-700 text-sm mb-4">{error}</p>
                <button
                  onClick={() => handleGenerate(false)}
                  className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg"
                >
                  Retry
                </button>
              </div>
            )}

            {tickets && tickets.length > 0 && !loading && (
              <div className="space-y-4">
                {tickets.map((ticket, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                        {ticket.type}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                        {ticket.priority}
                      </span>
                      <span className="text-xs text-gray-500">{ticket.storyPoints} pts</span>
                      {ticket.tags.map((t) => (
                        <span key={t} className="text-xs text-gray-500">#{t}</span>
                      ))}
                    </div>
                    <input
                      value={ticket.title}
                      onChange={(e) => updateTicket(i, { title: e.target.value })}
                      className="w-full text-base font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Title"
                    />
                    <div>
                      <label className="text-xs font-medium text-gray-500">User story</label>
                      <input
                        value={ticket.userStory}
                        onChange={(e) => updateTicket(i, { userStory: e.target.value })}
                        className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 mt-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="As a..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Description</label>
                      <textarea
                        value={ticket.description}
                        onChange={(e) => updateTicket(i, { description: e.target.value })}
                        rows={2}
                        className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 mt-0.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Description"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">Acceptance criteria (one per line)</label>
                      <textarea
                        value={ticket.acceptanceCriteria.join('\n')}
                        onChange={(e) =>
                          updateAcceptanceCriteria(
                            i,
                            e.target.value
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          )
                        }
                        rows={4}
                        className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 mt-0.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                        placeholder="• Criterion 1&#10;• Criterion 2"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => exportTicketsToCSV(tickets)}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => exportTicketsToJiraJSON(tickets)}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl"
                  >
                    Export JSON (Jira)
                  </button>
                </div>

                <p className="text-xs text-gray-400">Generated by Claude</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
