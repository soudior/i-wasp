import { assert, assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { recordMatchesCardId, resolveCard, type LookupResult } from './core.ts';

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
