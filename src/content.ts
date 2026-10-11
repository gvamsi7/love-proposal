export type ProposalContent = {
  to: string;
  from: string;
  question: string;
  letter: string;
  reasons: [string, string, string];
};

export const DEFAULT_CONTENT: ProposalContent = {
  to: 'you',
  from: 'me',
  question: 'Will you be mine?',
  letter: "Some feelings are too big for a text, so I made you this little corner of the internet.\n\nI don't have a perfectly rehearsed speech. Just a heart that gets a little happier at the thought of you, and a wish to turn ordinary days into our favorite memories.\n\nI'd love more little adventures, more conversations that last too long, and more of the beautifully simple things — with you.\n\nSo, here goes…",
  reasons: [
    "You make the little things feel like the big things. Even an ordinary Tuesday sounds sweeter with you.",
    "A conversation with you is my favorite kind of detour. I'd happily take the long way home.",
    "When I picture a new adventure, there's a little space beside me. It has your name on it.",
  ],
};

const LIMITS = { to: 60, from: 60, question: 120, letter: 4000, reason: 400 };
const textValue = (value: unknown, fallback: string, limit: number) =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, limit) : fallback;

export function normalizeContent(value: unknown): ProposalContent {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const reasons = Array.isArray(input.reasons) ? input.reasons : [];
  return {
    to: textValue(input.to, DEFAULT_CONTENT.to, LIMITS.to),
    from: textValue(input.from, DEFAULT_CONTENT.from, LIMITS.from),
    question: textValue(input.question, DEFAULT_CONTENT.question, LIMITS.question),
    letter: textValue(input.letter, DEFAULT_CONTENT.letter, LIMITS.letter),
    reasons: DEFAULT_CONTENT.reasons.map((fallback, i) => textValue(reasons[i], fallback, LIMITS.reason)) as ProposalContent['reasons'],
  };
}

// URL-safe UTF-8, so names and letters can use any language. Fragment values stay
// in the visitor's browser instead of being included in ordinary HTTP requests.
export function encodeContent(content: ProposalContent): string {
  const bytes = new TextEncoder().encode(JSON.stringify(normalizeContent(content)));
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
    .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function decodeContent(encoded: string): ProposalContent | null {
  try {
    if (!encoded || encoded.length > 42000 || !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
    const raw = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
    const decoded = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(raw, c => c.charCodeAt(0))));
    if (!decoded || typeof decoded !== 'object' || Array.isArray(decoded)) return null;
    return normalizeContent(decoded);
  } catch { return null; }
}

export function makeShareUrl(base: string, content: ProposalContent): string {
  const url = new URL(base);
  url.search = '';
  url.hash = `love=${encodeContent(content)}`;
  return url.toString();
}

export function readContent(location: Pick<Location, 'hash'>, storage?: Pick<Storage, 'getItem'>): ProposalContent {
  if (location.hash.startsWith('#love=')) {
    const shared = decodeContent(location.hash.slice(6));
    if (shared) return shared;
    return normalizeContent(DEFAULT_CONTENT);
  }
  try {
    const local = storage?.getItem('little-us-content-v1');
    if (local) return normalizeContent(JSON.parse(local));
  } catch { /* Blocked storage still allows the full proposal experience. */ }
  return normalizeContent(DEFAULT_CONTENT);
}
