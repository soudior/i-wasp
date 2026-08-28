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
  /**
   * Le magasin n'est pas configure sur cet environnement. Ce n'est pas une
   * panne : c'est un deploiement a une seule source. On l'ignore au lieu de le
   * compter comme echec, sinon un magasin de repli absent ferait repondre 502
   * a TOUTES les cartes, y compris natives et valides -- le garde-fou
   * bloquerait alors la creation de tout pass.
   */
  | { kind: 'not_configured' }
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

/**
 * Projette un enregistrement amont vers les seuls champs publics.
 *
 * Les deux magasins ne nomment pas les choses pareil : get_public_card renvoie
 * first_name/last_name/title/location, iwallet-card renvoie name/role/city. On
 * accepte les deux vocabulaires plutot que d'imposer le sien.
 *
 * Le telephone et Instagram sont souvent absents par conception : le RPC natif
 * n'expose que des booleens has_phone/has_instagram, jamais les valeurs. On ne
 * les invente pas — un champ absent reste vide, et l'affichage le masque.
 */
export function toPublicCard(id: string, raw: Record<string, unknown>): PublicCard {
  const text = (value: unknown) => String(value ?? '').trim().slice(0, 200);
  const composed = [raw.first_name, raw.last_name].map(text).filter(Boolean).join(' ');
  return {
    id,
    name: text(raw.name ?? raw.full_name ?? raw.display_name) || composed,
    role: text(raw.role ?? raw.title ?? raw.job_title),
    company: text(raw.company ?? raw.company_name),
    phone: text(raw.phone),
    website: text(raw.website),
    instagram: text(raw.instagram),
    city: text(raw.city ?? raw.location),
  };
}

/** Seules les vraies pannes comptent ; un magasin non configure n'en est pas une. */
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
