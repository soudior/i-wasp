// @vitest-environment node
// Synthetic profiles/keys only. Every network and crypto operation is mocked.
import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ handler: null as null | ((req: Request) => Promise<Response>) }));
vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({
  serve: (handler: (req: Request) => Promise<Response>) => { state.handler = handler; },
}));
let google: (req: Request) => Promise<Response>;
beforeAll(async () => {
  await import('../../supabase/functions/google-wallet/index');
  google = state.handler!;
});

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const OBJECT_URL = 'https://walletobjects.googleapis.com/walletobjects/v1/genericObject';
const objectId = '1234567890.test-card';
const classId = '1234567890.iwasp_business_card';
const baseCard = {
  id: 'test-card', slug: 'test-slug-', user_id: 'test-user', is_active: true, wallet_enabled: true,
  first_name: 'Élodie', last_name: 'العربي 🌍', company: 'Café des tests',
  title: 'Responsable des partenariats internationaux', email: 'test@example.invalid',
  phone: '+000000000', location: 'Adresse de test, ville de test',
  tagline: 'Bienvenue, مرحبًا 👋', website: 'https://example.invalid/profile',
  linkedin: 'test-profile', instagram: '@test-profile',
  // Synthetic non-personal image URL. This is not a live photo-compliance test.
  photo_url: `https://images.example.invalid/brand/${'synthetic-banner-'.repeat(40)}.png`,
  custom_styles: { wallet: {} },
};
const serviceAccount = {
  issuer_id: '1234567890', client_email: 'wallet-test@example.invalid', private_key_id: 'TEST-ONLY',
  // A single zero byte, not a real key. Both crypto operations are mocked.
  private_key: '-----BEGIN PRIVATE KEY-----\nAA==\n-----END PRIVATE KEY-----',
};
const decodeClaims = (jwt: string) => JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'));
let card: typeof baseCard;
let subscription: Record<string, unknown>;
let env: Record<string, string>;
let calls: ReturnType<typeof vi.fn<typeof fetch>>;
let importKey: ReturnType<typeof vi.fn>;
let sign: ReturnType<typeof vi.fn>;
let provider: (url: string, init?: RequestInit) => Promise<Response>;
const request = () => new Request('https://test.invalid/wallet', {
  method: 'POST', headers: { authorization: 'Bearer caller-test-only' },
  body: JSON.stringify({ cardData: {
    id: baseCard.id, slug: baseCard.slug, firstName: 'FORGED', email: 'forged@example.invalid',
    photoUrl: 'https://forged.example.invalid/photo.png',
  }, walletStyles: { showEmail: true } }),
});
const providerCalls = () => calls.mock.calls.filter(([url]) => !String(url).startsWith('https://test.invalid'));

beforeEach(() => {
  card = structuredClone(baseCard);
  subscription = { user_id: 'test-user', plan: 'gold', status: 'active' };
  env = {
    SUPABASE_URL: 'https://test.invalid', SUPABASE_ANON_KEY: 'test-only',
    GOOGLE_WALLET_SERVICE_ACCOUNT_JSON: JSON.stringify(serviceAccount),
  };
  vi.stubGlobal('Deno', { env: { get: (key: string) => env[key] } });
  importKey = vi.fn().mockResolvedValue({ type: 'private' });
  sign = vi.fn().mockResolvedValue(new Uint8Array(256).buffer);
  vi.stubGlobal('crypto', { subtle: { importKey, sign } });
  provider = async (url, init) => {
    if (url === TOKEN_URL) return Response.json({ access_token: 'TOKEN-TEST-ONLY', token_type: 'Bearer', expires_in: 3600 });
    if (url === OBJECT_URL || url === `${OBJECT_URL}/${objectId}`) return Response.json(JSON.parse(String(init?.body)));
    throw new Error(`Unexpected mocked request: ${url}`);
  };
  calls = vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input);
    if (url === 'https://test.invalid/auth/v1/user') return Response.json({ id: 'test-user' });
    if (url.startsWith('https://test.invalid/rest/v1/digital_cards?')) return Response.json([card]);
    if (url.startsWith('https://test.invalid/rest/v1/subscriptions?')) return Response.json([subscription]);
    return provider(url, init);
  });
  vi.stubGlobal('fetch', calls);
});
afterEach(() => vi.unstubAllGlobals());

const expectFailure = async (response: Response, status: number) => {
  expect(response.status).toBe(status);
  const result = await response.json();
  expect(result.fallback).toBe(true);
  expect(result.success).not.toBe(true);
  expect(result.saveUrl).toBeUndefined();
  expect(JSON.stringify(result)).not.toMatch(/private-provider|TOKEN-TEST-ONLY|private_key|forged|test@example/);
};

describe('Google Wallet authenticated object creation', () => {
  it('uploads a full Unicode profile and image while keeping the save JWT compact', async () => {
    const response = await google(request());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    const jwt = new URL(result.saveUrl).pathname.slice('/gp/v/save/'.length);
    expect(jwt.length).toBeLessThanOrEqual(1800);
    expect(decodeClaims(jwt)).toMatchObject({
      iss: serviceAccount.client_email, aud: 'google', typ: 'savetowallet',
      payload: { genericObjects: [{ id: objectId, classId }] },
    });
    expect(decodeClaims(jwt).payload.genericObjects[0]).toEqual({ id: objectId, classId });
    const [tokenCall, createCall] = providerCalls();
    expect(providerCalls()).toHaveLength(2);
    expect(tokenCall[0]).toBe(TOKEN_URL);
    expect(createCall[0]).toBe(OBJECT_URL);
    expect(createCall[1]).toMatchObject({
      method: 'POST', redirect: 'error',
      headers: { Authorization: 'Bearer TOKEN-TEST-ONLY', 'Content-Type': 'application/json' },
      signal: expect.any(AbortSignal),
    });
    const object = JSON.parse(String(createCall[1]?.body));
    expect(object).toMatchObject({
      id: objectId, classId, state: 'ACTIVE',
      header: { defaultValue: { value: 'Élodie العربي 🌍' } },
      subheader: { defaultValue: { value: 'Bienvenue, مرحبًا 👋' } },
      heroImage: { sourceUri: { uri: card.photo_url } },
      barcode: { type: 'QR_CODE', value: 'https://i-wasp.com/card/test-slug-', alternateText: 'test-slug-' },
    });
    expect(object.textModulesData.map((field: { id: string }) => field.id)).toEqual(['company', 'title', 'phone', 'email', 'location']);
    expect(object.linksModuleData.uris).toContainEqual({ uri: 'https://i-wasp.com/card/test-slug-', description: 'Voir la carte numérique', id: 'digital_card' });
    expect(object.linksModuleData.uris.map((link: { id: string }) => link.id)).toEqual(['digital_card', 'website', 'linkedin', 'instagram']);
    // Embedding this same profile in the original save JWT exceeds Google's limit.
    const oldClaims = { ...decodeClaims(jwt), payload: { genericObjects: [object] } };
    const oldJwtLength = jwt.split('.')[0].length + Buffer.from(JSON.stringify(oldClaims)).toString('base64url').length + jwt.split('.')[2].length + 2;
    expect(oldJwtLength).toBeGreaterThan(1800);
    expect(JSON.stringify(object)).not.toMatch(/FORGED|forged/);
    expect(JSON.stringify(result)).not.toContain('TOKEN-TEST-ONLY');
    expect(importKey).toHaveBeenCalledTimes(1);
    expect(sign).toHaveBeenCalledTimes(2);
  });

  it('uses the documented short-lived JWT-bearer exchange and only the Wallet issuer scope', async () => {
    await google(request());
    const [url, options] = providerCalls()[0];
    expect(url).toBe(TOKEN_URL);
    expect(options).toMatchObject({ method: 'POST', redirect: 'error', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: expect.any(AbortSignal) });
    const form = new URLSearchParams(String(options?.body));
    expect(form.get('grant_type')).toBe('urn:ietf:params:oauth:grant-type:jwt-bearer');
    const claims = decodeClaims(form.get('assertion')!);
    expect(claims).toEqual({
      iss: serviceAccount.client_email, aud: TOKEN_URL,
      scope: 'https://www.googleapis.com/auth/wallet_object.issuer', iat: expect.any(Number), exp: expect.any(Number),
    });
    expect(claims.exp - claims.iat).toBe(3600);
    const signedInput = new TextDecoder().decode(sign.mock.calls[0][2]);
    expect(form.get('assertion')?.startsWith(`${signedInput}.`)).toBe(true);
    expect(providerCalls().every(([endpoint]) => !String(endpoint).includes('genericClass'))).toBe(true);
  });

  it('replaces an existing stable object on 409 and clears now-hidden or removed profile fields', async () => {
    const defaultProvider = provider;
    const storedObjects = new Map<string, Record<string, unknown>>();
    provider = async (url, init) => {
      if (url === TOKEN_URL) return defaultProvider(url, init);
      const object = JSON.parse(String(init?.body));
      if (init?.method === 'POST' && storedObjects.has(object.id)) return new Response('Already exists', { status: 409 });
      storedObjects.set(object.id, object);
      return Response.json(object);
    };
    expect((await google(request())).status).toBe(200);
    card.custom_styles.wallet = { showCompany: false, showTitle: false, showPhone: false, showEmail: false, showLocation: false, showWebsite: false };
    card.photo_url = '';
    card.linkedin = '';
    card.instagram = '';
    const response = await google(request());
    expect(response.status).toBe(200);
    expect(storedObjects.size).toBe(1);
    const [url, options] = providerCalls().at(-1)!;
    expect(url).toBe(`${OBJECT_URL}/${objectId}`);
    expect(options?.method).toBe('PUT');
    const updated = storedObjects.get(objectId)!;
    expect(updated.textModulesData).toEqual([]);
    expect(updated.linksModuleData).toEqual({ uris: [{ uri: 'https://i-wasp.com/card/test-slug-', description: 'Voir la carte numérique', id: 'digital_card' }] });
    expect(updated.heroImage).toBeUndefined();
    expect(JSON.stringify(updated)).not.toMatch(/test@example|000000000|Café des tests|Responsable des|Adresse de test|images.example/);
    expect(decodeClaims(new URL((await response.json()).saveUrl).pathname.slice('/gp/v/save/'.length)).payload.genericObjects).toEqual([{ id: objectId, classId }]);
  });

  it.each([false, undefined])('rejects wallet_enabled=%s before signing or provider access', async walletEnabled => {
    Object.assign(card, { wallet_enabled: walletEnabled });
    await expectFailure(await google(request()), 403);
    expect(providerCalls()).toHaveLength(0);
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  it('rejects an inactive entitlement before signing or provider access', async () => {
    subscription.status = 'cancelled';
    await expectFailure(await google(request()), 403);
    expect(providerCalls()).toHaveLength(0);
    expect(sign).not.toHaveBeenCalled();
  });

  it.each([null, {}, { ...serviceAccount, issuer_id: '' }, { ...serviceAccount, private_key: '' }, { ...serviceAccount, client_email: '' }])('fails closed on incomplete configured service-account data (%j)', async account => {
    env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON = JSON.stringify(account);
    await expectFailure(await google(request()), 503);
    expect(providerCalls()).toHaveLength(0);
    expect(importKey).not.toHaveBeenCalled();
  });

  it.each([401, 403, 429, 500])('does not write an object or expose OAuth HTTP %s errors', async status => {
    provider = async () => new Response('private-provider TOKEN-TEST-ONLY', { status });
    await expectFailure(await google(request()), 502);
    expect(providerCalls()).toHaveLength(1);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it.each([
    {}, { access_token: 'TOKEN-TEST-ONLY' },
    { access_token: '', token_type: 'Bearer', expires_in: 3600 },
    { access_token: 'TOKEN-TEST-ONLY', token_type: 'Basic', expires_in: 3600 },
    { access_token: 'TOKEN-TEST-ONLY', token_type: 'Bearer', expires_in: 0 },
  ])('does not write an object with malformed OAuth data (%j)', async token => {
    provider = async () => Response.json(token);
    await expectFailure(await google(request()), 502);
    expect(providerCalls()).toHaveLength(1);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it.each([400, 401, 403, 404, 429, 500])('does not issue a save link on object HTTP %s or retry it as a conflict', async status => {
    const defaultProvider = provider;
    provider = async (url, init) => url === TOKEN_URL ? defaultProvider(url, init) : new Response('private-provider', { status });
    await expectFailure(await google(request()), 502);
    expect(providerCalls()).toHaveLength(2);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('does not issue a stale save link if replacing an existing object fails', async () => {
    const defaultProvider = provider;
    provider = async (url, init) => url === TOKEN_URL ? defaultProvider(url, init)
      : new Response('private-provider', { status: init?.method === 'POST' ? 409 : 403 });
    await expectFailure(await google(request()), 502);
    expect(providerCalls()).toHaveLength(3);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it.each([{}, { id: 'another-object', classId }, { id: objectId, classId: 'another-class' }])('rejects an unconfirmed object response (%j)', async saved => {
    const defaultProvider = provider;
    provider = async (url, init) => url === TOKEN_URL ? defaultProvider(url, init) : Response.json(saved);
    await expectFailure(await google(request()), 502);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it.each([TOKEN_URL, OBJECT_URL])('sanitizes malformed provider JSON at %s', async endpoint => {
    const defaultProvider = provider;
    provider = async (url, init) => url === endpoint ? new Response('private-provider invalid JSON') : defaultProvider(url, init);
    await expectFailure(await google(request()), 502);
    expect(sign).toHaveBeenCalledTimes(1);
  });

  it('fails safely if a provider request times out', async () => {
    provider = async () => { throw new DOMException('private-provider timeout', 'TimeoutError'); };
    await expectFailure(await google(request()), 502);
    expect(providerCalls()).toHaveLength(1);
  });

  it('retains the 1,800-character safeguard even for compact save JWTs', async () => {
    sign.mockResolvedValue(new Uint8Array(2048).buffer);
    await expectFailure(await google(request()), 503);
    expect(sign).toHaveBeenCalledTimes(2);
  });

  it('never claims success when the final save signing fails after an object is stored', async () => {
    sign.mockResolvedValueOnce(new Uint8Array(256).buffer).mockRejectedValueOnce(new Error('private-provider signing failure'));
    await expectFailure(await google(request()), 502);
    expect(providerCalls()).toHaveLength(2);
  });
});
