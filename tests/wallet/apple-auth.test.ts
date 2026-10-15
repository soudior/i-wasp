// @vitest-environment node
// Every identity, credential, signature and provider response below is synthetic.
// All network and cryptographic operations are mocked; no token is signed for real.
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ handler: null as null | ((req: Request) => Promise<Response>) }));
vi.mock('https://deno.land/std@0.168.0/http/server.ts', () => ({
  serve: (handler: (req: Request) => Promise<Response>) => { state.handler = handler; },
}));

let apple: (req: Request) => Promise<Response>;
beforeAll(async () => {
  await import('../../supabase/functions/apple-wallet/index');
  apple = state.handler!;
});

const card = {
  id: 'apple-auth-test-card', slug: 'apple-auth-test', user_id: 'apple-auth-test-user',
  is_active: true, wallet_enabled: true, first_name: 'Synthetic', last_name: 'Test',
};
const providerUrl = 'https://api.pub1.passkit.io/members/member';
const mockKey = { type: 'secret' };
const mockSignature = new Uint8Array([0, 127, 128, 254, 255]);
const now = 1_700_000_000;
let env: Record<string, string>;
let calls: ReturnType<typeof vi.fn<typeof fetch>>;
let importKey: ReturnType<typeof vi.fn>;
let sign: ReturnType<typeof vi.fn>;

const request = () => new Request('https://test.invalid/apple-wallet', {
  method: 'POST', headers: { authorization: 'Bearer test-session-only' },
  body: JSON.stringify({ cardData: { id: card.id, slug: card.slug } }),
});
const configureDynamic = () => Object.assign(env, {
  PASSKIT_API_KEY: 'TEST-ONLY-API-KEY', PASSKIT_API_SECRET: 'TEST-ONLY-API-SECRET',
});
const providerCalls = () => calls.mock.calls.filter(([input]) => String(input) === providerUrl);
const authorization = () => new Headers(providerCalls()[0][1]?.headers).get('Authorization')!;

beforeEach(() => {
  env = {
    SUPABASE_URL: 'https://test.invalid', SUPABASE_ANON_KEY: 'test-only',
    PASSKIT_PROGRAM_ID: 'TEST-ONLY-PROGRAM', PASSKIT_TIER_ID: 'TEST-ONLY-TIER',
  };
  vi.stubGlobal('Deno', { env: { get: (key: string) => env[key] } });
  vi.spyOn(Date, 'now').mockReturnValue(now * 1000);
  importKey = vi.fn().mockResolvedValue(mockKey);
  sign = vi.fn().mockResolvedValue(mockSignature.buffer);
  vi.stubGlobal('crypto', { subtle: { importKey, sign } });
  calls = vi.fn<typeof fetch>(async input => {
    const url = new URL(String(input));
    if (url.origin === 'https://test.invalid') {
      if (url.pathname === '/auth/v1/user') return Response.json({ id: card.user_id });
      if (url.pathname === '/rest/v1/digital_cards') return Response.json([card]);
      if (url.pathname === '/rest/v1/subscriptions') {
        return Response.json([{ user_id: card.user_id, plan: 'gold', status: 'active' }]);
      }
    }
    if (url.href === providerUrl) return Response.json({ passUrl: 'https://pub1.pskt.io/TEST-ONLY' });
    throw new Error('Unexpected mocked request');
  });
  vi.stubGlobal('fetch', calls);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Apple PassKit authentication modes', () => {
  it('prefers a fresh key/secret JWT and sends it raw, with documented HS256 claims', async () => {
    configureDynamic();
    env.PASSKIT_LONG_LIVED_TOKEN = 'TEST-ONLY-OPAQUE-TOKEN';
    env.PASSKIT_JWT_TOKEN = 'ey.TEST-ONLY';

    const response = await apple(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, passUrl: 'https://pub1.pskt.io/TEST-ONLY' });
    const token = authorization();
    expect(token).not.toMatch(/^Bearer /);
    expect(token).not.toContain('TEST-ONLY-OPAQUE-TOKEN');
    expect(token).not.toBe(env.PASSKIT_JWT_TOKEN);
    const segments = token.split('.');
    expect(segments).toHaveLength(3);
    for (const segment of segments) expect(segment).toMatch(/^[A-Za-z0-9_-]+$/);
    const [header, payload, signature] = segments;
    expect(JSON.parse(Buffer.from(header, 'base64url').toString('utf8'))).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))).toEqual({
      uid: 'TEST-ONLY-API-KEY', iat: now, exp: now + 3600,
    });
    expect(Buffer.from(signature, 'base64url')).toEqual(Buffer.from(mockSignature));
    expect(importKey).toHaveBeenCalledExactlyOnceWith(
      'raw', new TextEncoder().encode('TEST-ONLY-API-SECRET'),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
    );
    expect(sign).toHaveBeenCalledExactlyOnceWith('HMAC', mockKey, new TextEncoder().encode(`${header}.${payload}`));
    expect(providerCalls()).toHaveLength(1);
    expect(providerCalls()[0][1]?.method).toBe('POST');
    const body = JSON.parse(providerCalls()[0][1]?.body as string);
    expect(body).toMatchObject({
      programId: 'TEST-ONLY-PROGRAM', tierId: 'TEST-ONLY-TIER', externalId: card.id,
      metaData: { digitalCardUrl: `https://i-wasp.com/card/${card.slug}` },
    });
    expect(JSON.stringify(body)).not.toMatch(/TEST-ONLY-API|TEST-ONLY-OPAQUE|ey\.TEST/);
  });

  it('generates a new JWT for each authorized request instead of caching a static token', async () => {
    configureDynamic();
    await apple(request());
    const first = authorization();
    vi.mocked(Date.now).mockReturnValue((now + 60) * 1000);
    await apple(request());
    const second = new Headers(providerCalls()[1][1]?.headers).get('Authorization')!;
    expect(second).not.toBe(first);
    expect(JSON.parse(Buffer.from(second.split('.')[1], 'base64url').toString('utf8'))).toMatchObject({
      iat: now + 60, exp: now + 3660,
    });
    expect(sign).toHaveBeenCalledTimes(2);
  });

  it('uses Bearer for an explicit opaque long-lived token without JWT-prefix heuristics', async () => {
    env.PASSKIT_LONG_LIVED_TOKEN = 'TEST-ONLY-OPAQUE-TOKEN';
    const response = await apple(request());
    expect(await response.json()).toMatchObject({ success: true });
    expect(authorization()).toBe('Bearer TEST-ONLY-OPAQUE-TOKEN');
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
    expect(providerCalls()).toHaveLength(1);
  });

  it('retains PASSKIT_JWT_TOKEN compatibility with a raw Authorization value', async () => {
    env.PASSKIT_JWT_TOKEN = 'ey.TEST-ONLY';
    const response = await apple(request());
    expect(await response.json()).toMatchObject({ success: true });
    expect(authorization()).toBe('ey.TEST-ONLY');
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  it('prefers explicit long-lived configuration over the legacy pre-generated JWT fallback', async () => {
    env.PASSKIT_LONG_LIVED_TOKEN = 'TEST-ONLY-OPAQUE-TOKEN';
    env.PASSKIT_JWT_TOKEN = 'ey.TEST-ONLY';
    await apple(request());
    expect(authorization()).toBe('Bearer TEST-ONLY-OPAQUE-TOKEN');
    expect(sign).not.toHaveBeenCalled();
  });

  it.each(['PASSKIT_API_KEY', 'PASSKIT_API_SECRET'])('allows an explicit token fallback with incomplete %s configuration', async field => {
    env[field] = 'TEST-ONLY-INCOMPLETE';
    env.PASSKIT_LONG_LIVED_TOKEN = 'TEST-ONLY-OPAQUE-TOKEN';
    await apple(request());
    expect(authorization()).toBe('Bearer TEST-ONLY-OPAQUE-TOKEN');
    expect(sign).not.toHaveBeenCalled();
  });

  it.each([undefined, 'PASSKIT_API_KEY', 'PASSKIT_API_SECRET'])('does not sign or call PassKit with missing credentials (%s)', async field => {
    if (field) env[field] = 'TEST-ONLY-INCOMPLETE';
    const response = await apple(request());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toMatchObject({ fallback: true, error: 'Service non configuré' });
    expect(result.success).not.toBe(true);
    expect(providerCalls()).toHaveLength(0);
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
  });

  it('checks the template before signing a dynamic JWT', async () => {
    configureDynamic();
    delete env.PASSKIT_PROGRAM_ID;
    expect((await apple(request())).status).toBe(503);
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
    expect(providerCalls()).toHaveLength(0);
  });

  it('authorizes the caller before signing or contacting PassKit', async () => {
    configureDynamic();
    calls.mockResolvedValueOnce(Response.json({ message: 'invalid session' }, { status: 401 }));
    expect((await apple(request())).status).toBe(401);
    expect(calls).toHaveBeenCalledTimes(1);
    expect(importKey).not.toHaveBeenCalled();
    expect(sign).not.toHaveBeenCalled();
    expect(providerCalls()).toHaveLength(0);
  });

  it.each(['import', 'sign'])('sanitizes %s failures and never silently downgrades to a configured long-lived token', async stage => {
    configureDynamic();
    env.PASSKIT_LONG_LIVED_TOKEN = 'TEST-ONLY-OPAQUE-TOKEN';
    const failingOperation = stage === 'import' ? importKey : sign;
    failingOperation.mockRejectedValueOnce(new Error('TEST-ONLY-PRIVATE-SIGNING-DETAILS'));
    const response = await apple(request());
    expect(response.status).toBe(502);
    const result = await response.json();
    expect(result.fallback).toBe(true);
    expect(result.success).not.toBe(true);
    expect(result.passUrl).toBeUndefined();
    expect(JSON.stringify(result)).not.toMatch(/TEST-ONLY/);
    expect(providerCalls()).toHaveLength(0);
  });

  it.each([401, 403, 500])('sanitizes provider HTTP %s without retrying other authentication modes', async status => {
    configureDynamic();
    env.PASSKIT_LONG_LIVED_TOKEN = 'TEST-ONLY-OPAQUE-TOKEN';
    const original = calls.getMockImplementation()!;
    calls.mockImplementation(async (input, init) => String(input) === providerUrl
      ? new Response('TEST-ONLY-PRIVATE-PROVIDER-DETAILS', { status })
      : original(input, init));
    const response = await apple(request());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toMatchObject({ fallback: true, status: 'provider_error' });
    expect(result.success).not.toBe(true);
    expect(result.passUrl).toBeUndefined();
    expect(JSON.stringify(result)).not.toMatch(/TEST-ONLY/);
    expect(providerCalls()).toHaveLength(1);
    expect(authorization()).not.toMatch(/^Bearer /);
  });
});
