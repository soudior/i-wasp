/** Pure resolution rules shared by the edge function and its tests. */

export type PublicCard = {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  website: string;
  instagram: string;
  city: string;
};

export type LookupResult =
  | { kind: 'found'; record: Record<string, unknown> }
  | { kind: 'not_found' }
  | { kind: 'failure'; status: 502 | 504; reason: string };

export type ResolutionResult =
  | { kind: 'found'; source: 'iwasp' | 'iwallet-card'; card: PublicCard }
  | { kind: 'not_found' }
  | { kind: 'failure'; status: 502 | 504; reason: string };

export function normalizeCardId(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

export function isValidCardId(value: string) {
  return value.length > 0 && value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/** A successful upstream response must prove it owns the requested id. */
export function recordMatchesCardId(id: string, record: Record<string, unknown>) {
  return [record.id, record.slug].some((candidate) => normalizeCardId(candidate) === id);
}

export function toPublicCard(id: string, raw: Record<string, unknown>): PublicCard {
  const text = (value: unknown) => String(value ?? '').trim().slice(0, 200);
  return {
    id,
    name: text(raw.name ?? raw.full_name ?? raw.display_name),
    role: text(raw.role ?? raw.title ?? raw.job_title),
    company: text(raw.company ?? raw.company_name),
    phone: text(raw.phone),
    website: text(raw.website),
    instagram: text(raw.instagram),
    city: text(raw.city ?? raw.location),
  };
}

function chooseFailure(...results: LookupResult[]) {
  const failures = results.filter((result): result is Extract<LookupResult, { kind: 'failure' }> => result.kind === 'failure');
  return failures.find((result) => result.status === 504) ?? failures[0] ?? null;
}

/**
 * Resolve in the required order. A failed first source may fall through to a
 * healthy second source, but it can never be counted as a confirmed absence.
 */
export async function resolveCard(
  id: string,
  lookups: {
    iwasp: () => Promise<LookupResult>;
    iwallet: () => Promise<LookupResult>;
  },
): Promise<ResolutionResult> {
  const iwasp = await lookups.iwasp();
  if (iwasp.kind === 'found') return { kind: 'found', source: 'iwasp', card: toPublicCard(id, iwasp.record) };

  const iwallet = await lookups.iwallet();
  if (iwallet.kind === 'found') return { kind: 'found', source: 'iwallet-card', card: toPublicCard(id, iwallet.record) };

  const failure = chooseFailure(iwasp, iwallet);
  if (failure) return failure;
  return { kind: 'not_found' };
}
