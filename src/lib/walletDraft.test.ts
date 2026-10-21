// All users, cards, tokens, network responses below are isolated test fixtures.
// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { authorizeWallet, hasWalletEntitlement, visibleWalletData } from '../../supabase/functions/_shared/walletAccess';
import { base64urlEncode, googleWalletIds } from '../../supabase/functions/_shared/walletEncoding';
const card = { id: 'test-card', user_id: 'test-user', slug: 'test-slug-', is_active: true, wallet_enabled: true, first_name: 'Élodie', last_name: 'مرحبا 🌍', email: 'fixture@example.invalid', phone: '00000000', custom_styles: { wallet: { showEmail: false, showPhone: false } } };
const subscription = { user_id: 'test-user', plan: 'premium', status: 'active', expires_at: null };
const env = (key: string) => ({ SUPABASE_URL: 'https://test.invalid', SUPABASE_ANON_KEY: 'test-only' })[key];
const req = () => new Request('https://test.invalid/wallet', { headers: { authorization: 'Bearer test-only' } });
const body = { cardData: { id: card.id, slug: card.slug, firstName: 'FORGED', email: 'forged@example.invalid' }, walletStyles: { showEmail: true } };
const mockFetch = (responses: [unknown, number?][]) => vi.fn(async () => { const [data,status=200] = responses.shift()!; return new Response(JSON.stringify(data), { status }); });
describe('Wallet server authorization and minimization', () => {
  it('refuses anonymous requests before any network call', async () => {
    const fetch = vi.fn(); await expect(authorizeWallet(new Request('https://test.invalid'), body, env, fetch)).rejects.toMatchObject({ status: 401 }); expect(fetch).not.toHaveBeenCalled();
  });
  it('refuses invalid sessions', async () => { await expect(authorizeWallet(req(), body, env, mockFetch([[{},401]]))).rejects.toMatchObject({ status:401 }); });
  it('fails closed on missing configuration', async () => { await expect(authorizeWallet(req(),body,()=>undefined,vi.fn())).rejects.toMatchObject({ status:503 }); });
  it.each([null, {}, { cardData:{ id:'a&user_id=other' } }])('rejects malformed request %j', async input => { await expect(authorizeWallet(req(),input,env,vi.fn())).rejects.toMatchObject({status:400}); });
  it.each([{cards:[]}, {cards:[{ ...card, user_id:'someone-else' }]}, {cards:[{...card,is_active:false}]}])('rejects missing, foreign or inactive cards %j', async ({cards}) => { await expect(authorizeWallet(req(),body,env,mockFetch([[{id:'test-user'}],[cards]]))).rejects.toMatchObject({status:403}); });
  it.each([false, undefined, null, 'true', 1])('requires strict stored wallet_enabled=true, rejecting %j before subscription/provider work', async walletEnabled => {
    const fetch = mockFetch([[{ id: 'test-user' }], [[{ ...card, wallet_enabled: walletEnabled }]]]);
    await expect(authorizeWallet(req(), { ...body, wallet_enabled: true }, env, fetch)).rejects.toMatchObject({ status: 403 });
    expect(fetch).toHaveBeenCalledTimes(2);
    const cardRequest = new URL((fetch.mock.calls as unknown as [string][])[1][0]);
    expect(cardRequest.searchParams.get('wallet_enabled')).toBe('eq.true');
    expect(cardRequest.searchParams.get('select')).toContain('wallet_enabled');
  });
  it('rejects mismatched canonical slug', async () => { await expect(authorizeWallet(req(),{ cardData:{id:card.id,slug:'changed'} },env,mockFetch([[{id:'test-user'}],[[card]]]))).rejects.toMatchObject({status:400}); });
  it('keeps Google Wallet premium-only for free subscriptions', async () => {
    await expect(authorizeWallet(req(),body,env,mockFetch([[{id:'test-user'}],[[card]],[[{...subscription,plan:'free'}]]])))
      .rejects.toMatchObject({status:403});
  });
  it.each(['free','premium'])('allows Apple Wallet for active %s subscriptions after the quota check', async plan => {
    const fetch = mockFetch([[{id:'test-user'}],[[card]],[[{...subscription,plan}]],[true]]);
    const result = await authorizeWallet(req(),body,env,fetch,'apple');
    expect(result.cardData.firstName).toBe('Élodie');
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(new URL((fetch.mock.calls as unknown as [string][])[3][0]).pathname).toBe('/rest/v1/rpc/consume_apple_wallet_rate_limit');
  });
  it('fails closed when the Apple Wallet rate limit is exhausted', async () => {
    await expect(authorizeWallet(req(),body,env,mockFetch([[{id:'test-user'}],[[card]],[[subscription]],[false]]),'apple'))
      .rejects.toMatchObject({status:429});
  });
  it('uses stored data and stored visibility even when client forges them', async () => {
    const fetch = mockFetch([[{id:'test-user'}],[[card]],[[subscription]]]); const result = await authorizeWallet(req(),body,env,fetch);
    expect(result.cardData.firstName).toBe('Élodie'); expect(result.cardData.email).toBeUndefined(); expect(result.cardData.phone).toBeUndefined(); expect(result.cardData.slug).toBe('test-slug-'); expect(fetch).toHaveBeenCalledTimes(3);
  });
  it('rejects subscription read failure', async () => { await expect(authorizeWallet(req(),body,env,mockFetch([[{id:'test-user'}],[[card]],[{},500]]))).rejects.toMatchObject({status:503}); });
  it.each(['free','premium'])('accepts Apple Wallet plan %s', plan => expect(hasWalletEntitlement({...subscription,plan},'apple')).toBe(true));
  it('requires premium for Google Wallet and rejects removed plan names for both wallets', () => {
    expect(hasWalletEntitlement({...subscription,plan:'premium'},'google')).toBe(true);
    for (const plan of ['gold','signature','elite']) {
      expect(hasWalletEntitlement({...subscription,plan},'apple')).toBe(false);
      expect(hasWalletEntitlement({...subscription,plan},'google')).toBe(false);
    }
  });
  it.each([{status:'cancelled'}, {expires_at:'2020-01-01'}, {expires_at:'invalid'}])('rejects invalid entitlement %j', patch => expect(hasWalletEntitlement({...subscription,...patch})).toBe(false));
  it('omits every hidden contact field before provider serialization', () => {
    const data = visibleWalletData({...card,company:'private',title:'private',website:'private',location:'private'}, {showTitle:false,showCompany:false,showEmail:false,showPhone:false,showWebsite:false,showLocation:false});
    expect(JSON.stringify(data)).not.toMatch(/private|fixture@example|00000000/);
  });
});
describe('Google encoding and idempotent identifiers', () => {
  it.each(['Élodie à Paris','مرحبا بالعالم','🤝🌍', 'test-slug-'])('round trips UTF-8 %s', text => expect(Buffer.from(base64urlEncode(text),'base64url').toString('utf8')).toBe(text));
  it('round trips signature bytes', () => expect(Buffer.from(base64urlEncode(new Uint8Array([0,128,255])),'base64url')).toEqual(Buffer.from([0,128,255])));
  it('retries use the same object without sanitization collisions', () => { expect(googleWalletIds('123','a-b')).toEqual(googleWalletIds('123','a-b')); expect(googleWalletIds('123','a-b')).not.toEqual(googleWalletIds('123','a_b')); });
  it.each([undefined,'','unconfigured'])('rejects missing issuer %s', value => expect(()=>googleWalletIds(value,'card')).toThrow());
});
