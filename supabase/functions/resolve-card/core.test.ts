import { assert, assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { isValidCardId, normalizeCardId, recordMatchesCardId, resolveCard, toPublicCard, type LookupResult } from './core.ts';

const found = (record: Record<string, unknown>): LookupResult => ({ kind: 'found', record });
const missing = (): LookupResult => ({ kind: 'not_found' });

Deno.test('native card wins before iwallet-card', async () => {
  const result = await resolveCard('native-card', {
    iwasp: async () => found({ slug: 'native-card', name: 'Native' }),
    iwallet: async () => found({ id: 'native-card', name: 'Wrong source' }),
  });
  assertEquals(result.kind, 'found');
  if (result.kind === 'found') assertEquals(result.source, 'iwasp');
});

Deno.test('iwallet-card is used after a confirmed native absence', async () => {
  const result = await resolveCard('wallet-card', {
    iwasp: missing,
    iwallet: async () => found({ id: 'wallet-card', name: 'Wallet' }),
  });
  assertEquals(result.kind, 'found');
  if (result.kind === 'found') assertEquals(result.source, 'iwallet-card');
});

Deno.test('404 semantics require absence in both stores', async () => {
  assertEquals(await resolveCard('unknown-card', { iwasp: missing, iwallet: missing }), { kind: 'not_found' });
  const failure = await resolveCard('unknown-card', {
    iwasp: async () => ({ kind: 'failure', status: 502, reason: 'down' }),
    iwallet: missing,
  });
  assertEquals(failure.kind, 'failure');
  if (failure.kind === 'failure') assertEquals(failure.status, 502);
});

Deno.test('an upstream record must contain the requested id', () => {
  assert(recordMatchesCardId('a-card', { slug: 'a-card' }));
  assert(!recordMatchesCardId('a-card', { id: 'another-card', slug: 'another-card' }));
});

Deno.test('un magasin non configure ne devient jamais une panne', async () => {
  // Repli absent + carte native trouvee : la carte doit sortir normalement.
  const native = await resolveCard('native-card', {
    iwasp: async () => found({ slug: 'native-card' }),
    iwallet: async () => ({ kind: 'not_configured' }),
  });
  assertEquals(native.kind, 'found');

  // Repli absent + absence native : un vrai 404, pas un 502 qui bloquerait tout.
  const unknown = await resolveCard('unknown-card', {
    iwasp: missing,
    iwallet: async () => ({ kind: 'not_configured' }),
  });
  assertEquals(unknown, { kind: 'not_found' });

  // Mais une vraie panne native reste une panne, meme sans repli configure.
  const broken = await resolveCard('any-card', {
    iwasp: async () => ({ kind: 'failure', status: 504, reason: 'timeout' }),
    iwallet: async () => ({ kind: 'not_configured' }),
  });
  assertEquals(broken.kind, 'failure');
  if (broken.kind === 'failure') assertEquals(broken.status, 504);
});

Deno.test("la forme reelle de get_public_card produit un nom, pas un vide", () => {
  // Forme exacte renvoyee par le RPC en production : first_name/last_name,
  // title, location, et des booleens has_* au lieu des valeurs sensibles.
  const card = toPublicCard('ajban-al-khair', {
    id: 'ajban-al-khair', slug: 'ajban-al-khair',
    first_name: 'Mohamed', last_name: 'Ben Hamida',
    title: 'Directeur', company: 'Ajban Al Khair', location: 'Abu Dhabi',
    website: 'https://example.com',
    has_phone: true, has_email: true, has_instagram: false,
  });
  assertEquals(card.name, 'Mohamed Ben Hamida');
  assertEquals(card.role, 'Directeur');
  assertEquals(card.city, 'Abu Dhabi');
  // has_phone est un booleen de presence : il ne doit jamais devenir un numero.
  assertEquals(card.phone, '');
  assertEquals(card.instagram, '');
});

Deno.test("la forme iwallet-card reste supportee", () => {
  const card = toPublicCard('x-y', { id: 'x-y', name: 'Sofia Marchetti', role: 'Chef', city: 'Paris' });
  assertEquals(card.name, 'Sofia Marchetti');
  assertEquals(card.city, 'Paris');
});

Deno.test("la casse de l'URL est normalisee, pas rejetee", () => {
  // Une carte imprimee peut etre saisie en majuscules : /card/Ajban-Al-Khair
  // doit atteindre la meme fiche, sans erreur.
  assertEquals(normalizeCardId('Ajban-Al-Khair'), 'ajban-al-khair');
  assert(isValidCardId(normalizeCardId('  Ajban-Al-Khair  ')));
  // En revanche ce qui n'est pas un slug reste refuse.
  for (const bad of ['', 'espace ici', 'slash/injecte', 'https://evil.example.com/x', 'a'.repeat(200)]) {
    assert(!isValidCardId(normalizeCardId(bad)), `${bad} aurait du etre refuse`);
  }
});

Deno.test("les identifiants reels de production sont tous acceptes", () => {
  // Slugs effectivement presents en base, dont un a tiret final.
  for (const slug of [
    "bornety-lacaisse-ma", "ariella-khiat-cohen", "ahmed-benali", "medina-mall-",
    "ibrahim-benelfares", "herbalism-marrakech", "autoschluessel-aachen",
  ]) {
    assert(isValidCardId(normalizeCardId(slug)), `${slug} est une carte reelle et doit etre acceptee`);
  }
  // L'identifiant n'est jamais reecrit : la recherche porte sur la valeur exacte.
  assertEquals(normalizeCardId("medina-mall-"), "medina-mall-");
});

Deno.test("l'assouplissement ne rouvre aucune faille", () => {
  for (const bad of [
    "", "-commence-par-tiret", "espace ici", "slash/injecte", "point.interdit",
    "https://evil.example.com/x", "http://169.254.169.254/latest/meta-data",
    "deux%2Fpoints", "a".repeat(81),
  ]) {
    assert(!isValidCardId(normalizeCardId(bad)), `${bad} aurait du etre refuse`);
  }
});
