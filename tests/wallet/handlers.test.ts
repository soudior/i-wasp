// @vitest-environment node
// Providers and identities are mocks. No real credentials or issuer are used.
import { beforeAll, beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

const state = vi.hoisted(() => ({ handler: null as null | ((req: Request) => Promise<Response>) }));
vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({
  serve: (handler: (req: Request) => Promise<Response>) => { state.handler = handler; },
}));
let apple: (req: Request) => Promise<Response>;
let google: typeof apple;
beforeAll(async () => {
  await import('../../supabase/functions/apple-wallet/index');
  apple = state.handler!;
  await import('../../supabase/functions/google-wallet/index');
  google = state.handler!;
});

const card = {
  id: 'test-card', slug: 'test-slug-', user_id: 'test-user', is_active: true, wallet_enabled: true,
  first_name: 'Élodie', last_name: 'Test', email: 'hidden@example.invalid', phone: '00000000',
  custom_styles: { wallet: { showEmail: false, showPhone: false } },
};
let env: Record<string, string>;
let calls: ReturnType<typeof vi.fn<typeof fetch>>;
const request = () => new Request('https://test.invalid/wallet', {
  method: 'POST', headers: { authorization: 'Bearer test-only' },
  body: JSON.stringify({ cardData: { id: card.id, slug: card.slug, email: 'forged@example.invalid' } }),
});
const configureApple = () => Object.assign(env, {
  PASSKIT_JWT_TOKEN: 'ey.TEST-ONLY', PASSKIT_PROGRAM_ID: 'TEST-ONLY', PASSKIT_TIER_ID: 'TEST-ONLY',
});
const configureGoogle = () => {
  // AA== is a single zero byte, not a key. Both crypto operations are mocked.
  env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON = JSON.stringify({
    issuer_id: '1234567890', client_email: 'wallet-test@example.invalid',
    private_key_id: 'TEST-ONLY', private_key: '-----BEGIN PRIVATE KEY-----\nAA==\n-----END PRIVATE KEY-----',
  });
  const key = { type: 'private' };
  const signature = Uint8Array.from({ length: 256 }, (_, index) => index);
  const importKey = vi.fn().mockResolvedValue(key);
  const sign = vi.fn().mockResolvedValue(signature.buffer);
  vi.stubGlobal('crypto', { subtle: { importKey, sign } });
  return { key, signature, importKey, sign };
};

beforeEach(() => {
  env = { SUPABASE_URL: 'https://test.invalid', SUPABASE_ANON_KEY: 'test-only' };
  vi.stubGlobal('Deno', { env: { get: (key: string) => env[key] } });
  calls = vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input);
    if (url.includes('/auth/')) return Response.json({ id: 'test-user' });
    if (url.includes('/digital_cards?')) return Response.json([card]);
    if (url.includes('/subscriptions?')) return Response.json([{ user_id: 'test-user', plan: 'gold', status: 'active' }]);
    if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'SYNTHETIC-ONLY-ACCESS', token_type: 'Bearer', expires_in: 3600 });
    if (url.startsWith('https://walletobjects.googleapis.com/walletobjects/v1/genericObject')) {
      const object = JSON.parse(String(init?.body));
      return Response.json({ id: object.id, classId: object.classId });
    }
    return Response.json({ passUrl: 'https://pub1.pskt.io/TEST-ONLY' });
  });
  vi.stubGlobal('fetch', calls);
});
afterEach(() => vi.unstubAllGlobals());

describe('Wallet handlers', () => {
  it('rejects anonymous Apple before touching provider', async () => {
    const response = await apple(new Request('https://test.invalid', {
      method: 'POST', body: JSON.stringify({ cardData: { id: 'test' } }),
    }));
    expect(response.status).toBe(401);
    expect(calls).not.toHaveBeenCalled();
  });

  it('rejects anonymous Google before signing', async () => {
    expect((await google(new Request('https://test.invalid', { method: 'POST', body: '{}' }))).status).toBe(401);
    expect(calls).not.toHaveBeenCalled();
  });

  it.each([
    ['apple', false], ['google', false], ['apple', undefined], ['google', undefined],
  ] as const)('rejects %s when stored Wallet activation is %s, before provider work', async (provider, walletEnabled) => {
    calls.mockImplementationOnce(async () => Response.json({ id: 'test-user' }))
      .mockImplementationOnce(async () => Response.json([{ ...card, wallet_enabled: walletEnabled }]));
    const response = await (provider === 'apple' ? apple(request()) : google(request()));
    expect(response.status).toBe(403);
    expect((await response.json()).success).not.toBe(true);
    expect(calls).toHaveBeenCalledTimes(2);
  });

  it('handles preflight and rejects unsupported methods', async () => {
    expect((await apple(new Request('https://test.invalid', { method: 'OPTIONS' }))).status).toBe(200);
    expect((await google(new Request('https://test.invalid'))).status).toBe(405);
    expect(calls).not.toHaveBeenCalled();
  });

  it('reports missing Apple configuration as HTTP 200 fallback without claiming success', async () => {
    const response = await apple(request());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toMatchObject({ fallback: true });
    expect(result.success).not.toBe(true);
    expect(result.passUrl).toBeUndefined();
    expect(calls).toHaveBeenCalledTimes(3);
  });

  it('reports missing Google configuration as HTTP 200 fallback without claiming success', async () => {
    const response = await google(request());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toMatchObject({ fallback: true });
    expect(result.success).not.toBe(true);
    expect(result.saveUrl).toBeUndefined();
    expect(calls).toHaveBeenCalledTimes(3);
  });

  it('reports malformed Google configuration as HTTP 200 fallback without signing', async () => {
    const { importKey, sign } = configureGoogle();
    env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON = '{invalid JSON';
    const response = await google(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ fallback: true, error: 'Configuration invalide' });
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
    expect(calls).toHaveBeenCalledTimes(3);
  });

  it('requires an explicit Google issuer', async () => {
    env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON = '{}';
    expect((await google(request())).status).toBe(503);
    expect(calls).toHaveBeenCalledTimes(3);
  });

  it('requires explicit PassKit template configuration', async () => {
    env.PASSKIT_JWT_TOKEN = 'ey.TEST-ONLY';
    expect((await apple(request())).status).toBe(503);
  });

  it('omits hidden contact details and preserves stable identity and canonical URL', async () => {
    configureApple();
    expect((await apple(request())).status).toBe(200);
    const payload = JSON.parse(calls.mock.calls[3][1]!.body as string);
    expect(payload.externalId).toBe('test-card');
    expect(payload.metaData.digitalCardUrl).toBe('https://i-wasp.com/card/test-slug-');
    expect(JSON.stringify(payload)).not.toMatch(/hidden@example|forged@example|00000000/);
  });

  it('preserves Unicode in the API object and issues a compact Google JWT', async () => {
    const { key, signature, importKey, sign } = configureGoogle();
    const unicodeCard = { ...card, last_name: 'العربي 🌍', company: 'Café', tagline: 'مرحبًا 👋' };
    calls.mockImplementationOnce(async () => Response.json({ id: 'test-user' }))
      .mockImplementationOnce(async () => Response.json([unicodeCard]));

    const response = await google(request());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.fallback).not.toBe(true);
    const saveUrl = new URL(result.saveUrl);
    expect(saveUrl.origin).toBe('https://pay.google.com');
    expect(saveUrl.pathname).toMatch(/^\/gp\/v\/save\//);
    const jwt = saveUrl.pathname.slice('/gp/v/save/'.length);
    const segments = jwt.split('.');
    expect(segments).toHaveLength(3);
    for (const segment of segments) expect(segment).toMatch(/^[A-Za-z0-9_-]+$/);
    const [encodedHeader, encodedClaims, encodedSignature] = segments;
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
    const claims = JSON.parse(Buffer.from(encodedClaims, 'base64url').toString('utf8'));
    expect(header).toEqual({ alg: 'RS256', typ: 'JWT', kid: 'TEST-ONLY' });
    expect(claims).toMatchObject({
      iss: 'wallet-test@example.invalid', aud: 'google', typ: 'savetowallet', iat: expect.any(Number),
    });
    expect(claims.payload.genericObjects).toHaveLength(1);
    expect(claims.payload.genericObjects[0]).toEqual({ id: '1234567890.test-card', classId: '1234567890.iwasp_business_card' });
    expect(jwt.length).toBeLessThanOrEqual(1800);
    const objectRequest = calls.mock.calls.find(([url]) => String(url).startsWith('https://walletobjects.googleapis.com/walletobjects/v1/genericObject'));
    expect(objectRequest).toBeDefined();
    const pass = JSON.parse(String(objectRequest![1]?.body));
    expect(pass).toMatchObject({
      id: '1234567890.test-card', classId: '1234567890.iwasp_business_card',
      header: { defaultValue: { value: 'Élodie العربي 🌍' } },
      subheader: { defaultValue: { value: 'مرحبًا 👋' } },
      textModulesData: [{ id: 'company', header: 'Entreprise', body: 'Café' }],
      barcode: { value: 'https://i-wasp.com/card/test-slug-', alternateText: 'test-slug-' },
      linksModuleData: { uris: [{ id: 'digital_card', uri: 'https://i-wasp.com/card/test-slug-' }] },
    });
    expect(JSON.stringify(claims)).not.toMatch(/hidden@example|forged@example|00000000|Élodie|العربي/);
    expect(JSON.stringify(pass)).not.toMatch(/hidden@example|forged@example|00000000/);
    expect(importKey).toHaveBeenCalledWith(
      'pkcs8', new Uint8Array([0]), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'],
    );
    expect(sign).toHaveBeenCalledTimes(2);
    expect(sign).toHaveBeenLastCalledWith(
      'RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${encodedHeader}.${encodedClaims}`),
    );
    expect(Buffer.from(encodedSignature, 'base64url')).toEqual(Buffer.from(signature));
    expect(calls).toHaveBeenCalledTimes(5);
  });

  it('does not expose signing failures or claim Google success', async () => {
    const { sign } = configureGoogle();
    sign.mockRejectedValueOnce(new Error('private signing details'));
    const response = await google(request());
    const result = await response.json();
    expect(response.status).toBe(502);
    expect(result.fallback).toBe(true);
    expect(result.success).not.toBe(true);
    expect(result.saveUrl).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain('private signing details');
  });

  it('does not expose provider errors or claim Apple success on HTTP 200 fallback', async () => {
    configureApple();
    calls.mockImplementationOnce(async () => Response.json({ id: 'test-user' }))
      .mockImplementationOnce(async () => Response.json([card]))
      .mockImplementationOnce(async () => Response.json([{ user_id: 'test-user', plan: 'gold', status: 'active' }]))
      .mockImplementationOnce(async () => new Response('private provider details', { status: 500 }));
    const response = await apple(request());
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result.fallback).toBe(true);
    expect(result.success).not.toBe(true);
    expect(result.passUrl).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain('private provider details');
  });
});
