import { recordMatchesCardId, resolveCard } from '../supabase/functions/resolve-card/core.ts';

const found = (record) => ({ kind: 'found', record });
const missing = async () => ({ kind: 'not_found' });
const equal = (actual, expected, label) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label}: ${JSON.stringify(actual)}`);
};

const native = await resolveCard('native-card', {
  iwasp: async () => found({ slug: 'native-card', name: 'Native' }),
  iwallet: async () => found({ id: 'native-card', name: 'Wrong source' }),
});
equal(native.source, 'iwasp', 'native source');

const fallback = await resolveCard('wallet-card', {
  iwasp: missing,
  iwallet: async () => found({ id: 'wallet-card', name: 'Wallet' }),
});
equal(fallback.source, 'iwallet-card', 'fallback source');

equal(await resolveCard('unknown-card', { iwasp: missing, iwallet: missing }), { kind: 'not_found' }, 'unknown card');
const failed = await resolveCard('unknown-card', {
  iwasp: async () => ({ kind: 'failure', status: 502, reason: 'native unavailable' }),
  iwallet: missing,
});
equal(failed.status, 502, 'upstream failure');
if (!recordMatchesCardId('wallet-card', { id: 'wallet-card' })) throw new Error('matching id rejected');
if (recordMatchesCardId('wallet-card', { id: 'other-card' })) throw new Error('mismatched id accepted');

console.log('Resolver core scenarios verified: native, iwallet fallback, unknown 404, upstream 502.');
