import Anthropic from '@anthropic-ai/sdk';

const RATE_LIMIT_PER_HOUR = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_PER_HOUR) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

interface FeatureInput {
  id: string;
  name: string;
  description: string;
  notes: string;
  tags: string[];
  rice: { score: number; effort: number } | null;
  ice: { score: number } | null;
  rank: number;
  effort: number;
}

interface ContextBrief {
  persona?: string;
  platform?: string;
  constraints?: string;
}

interface RequestBody {
  features: FeatureInput[];
  contextBrief?: ContextBrief;
  structurePrefs: Record<string, 'flat' | 'epic'>;
}

interface GeneratedTicket {
  type: 'epic' | 'story';
  title: string;
  userStory: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: 'Highest' | 'High' | 'Medium' | 'Low';
  tags: string[];
  parentEpic: string | null;
}

function buildPrompt(body: RequestBody): string {
  const { features, contextBrief = {}, structurePrefs } = body;
  const persona = contextBrief.persona?.trim() || undefined;
  const platform = contextBrief.platform?.trim() || undefined;
  const constraints = contextBrief.constraints?.trim() || undefined;

  const featureDescriptions = features.map((f) => {
    const structure = structurePrefs[f.id] || 'flat';
    return `
Feature: ${f.name}
Description: ${f.description}
Notes: ${f.notes || '(none)'}
Tags: ${f.tags.join(', ') || '(none)'}
RICE score: ${f.rice?.score ?? 'N/A'}, ICE score: ${f.ice?.score ?? 'N/A'}, Rank: ${f.rank}, Effort (story points): ${f.effort}
Structure preference: ${structure}
`;
  });

  return `You are a product manager generating Jira/Linear-style tickets from feature specs. Return ONLY valid JSON with no markdown, code fences, or extra text.

Context brief (use when crafting user stories and descriptions):
${persona ? `Persona: ${persona}` : 'Persona: (not specified)'}
${platform ? `Platform: ${platform}` : 'Platform: (not specified)'}
${constraints ? `Constraints: ${constraints}` : 'Constraints: (none)'}

Features to convert:

${featureDescriptions.join('\n---\n')}

Instructions:
- For "flat" structure: output exactly one ticket per feature with type "story", parentEpic null.
- For "epic" structure: output one ticket with type "epic" (title = feature name) plus 3–5 child tickets with type "story" and parentEpic set to the epic title.
- User story format: "As a [persona], I want [feature/capability], so that [outcome]". Use the persona from context if provided, otherwise infer one.
- Description: 2–3 sentences expanding on the feature context.
- Acceptance criteria: 3–5 specific, testable bullet points.
- Story points: use the feature's effort value.
- Priority: map rank to quartiles. Top 25% of backlog = "Highest", next 25% = "High", next 25% = "Medium", bottom 25% = "Low". Assume the features are ranked by score/importance.
- Tags: carry over from the feature.
- Return this exact JSON shape (no other keys):
{"tickets":[{"type":"epic"|"story","title":"string","userStory":"string","description":"string","acceptanceCriteria":["string"],"storyPoints":number,"priority":"Highest"|"High"|"Medium"|"Low","tags":["string"],"parentEpic":"string|null"}]}`;
}

function parseTicketsJson(text: string): GeneratedTicket[] {
  let cleaned = text.trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed.tickets)) throw new Error('Invalid response: missing tickets array');
  return parsed.tickets;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ error: 'Content-Type must be application/json' }, 400);
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({
        error: `Rate limit exceeded. Please try again in ${rate.retryAfter} seconds.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rate.retryAfter ?? 3600),
        },
      }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn(
      'ANTHROPIC_API_KEY is not set. Add it in Vercel Project Settings → Environment Variables.'
    );
    return jsonResponse(
      {
        error:
          'Story generation is not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.',
      },
      503
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.features || !Array.isArray(body.features) || body.features.length === 0) {
    return jsonResponse({ error: 'features array is required and must not be empty' }, 400);
  }

  if (!body.structurePrefs || typeof body.structurePrefs !== 'object') {
    return jsonResponse({ error: 'structurePrefs object is required' }, 400);
  }

  const anthropic = new Anthropic({ apiKey });
  const prompt = buildPrompt(body);

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
      location: 'api/generate-tickets.ts:189',
      message: 'Calling Claude with prompt',
      data: {
        featureCount: body.features.length,
        promptLength: prompt.length,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return jsonResponse({ error: 'Claude did not return text' }, 500);
    }

    const tickets = parseTicketsJson(textBlock.text);

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
        location: 'api/generate-tickets.ts:203',
        message: 'Parsed tickets from Claude response',
        data: {
          ticketCount: tickets.length,
          textSample: textBlock.text.slice(0, 120),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return jsonResponse({ tickets });
  } catch (err) {
    console.error('Claude API error:', err);
    
    // Capture full error details for debugging
    let errorMessage = 'Unknown error';
    let errorDetails: Record<string, unknown> = {};
    
    if (err instanceof Error) {
      errorMessage = err.message;
      errorDetails = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
      
      // Check if it's an Anthropic API error with additional properties
      const errAny = err as Record<string, unknown>;
      if ('status' in errAny) errorDetails.status = errAny.status;
      if ('code' in errAny) errorDetails.code = errAny.code;
      if ('type' in errAny) errorDetails.type = errAny.type;
      if ('param' in errAny) errorDetails.param = errAny.param;
    } else {
      errorDetails = { rawError: String(err), errorType: typeof err };
    }

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
        location: 'api/generate-tickets.ts:249',
        message: 'Claude API error caught in handler',
        data: errorDetails,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // Return detailed error info in development, sanitized in production
    return jsonResponse(
      { 
        error: errorMessage.includes('rate') ? 'API rate limit exceeded. Please try again later.' : errorMessage,
        ...(process.env.NODE_ENV !== 'production' ? { details: errorDetails } : {}),
      },
      500
    );
  }
}
