import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Blob as NodeBlob } from 'node:buffer';

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(), getSession: vi.fn(), error: vi.fn(), info: vi.fn(), download: vi.fn(), assign: vi.fn(), fetch: vi.fn(), setTimeout: vi.fn(),
  capacitor: { native: false, platform: 'web' },
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  functions: { invoke: mocks.invoke }, auth: { getSession: mocks.getSession },
} }));
vi.mock('@capacitor/core', () => ({ Capacitor: {
  isNativePlatform: () => mocks.capacitor.native,
  getPlatform: () => mocks.capacitor.platform,
} }));
vi.mock('sonner', () => ({ toast: { error: mocks.error, info: mocks.info } }));
vi.mock('@/lib/vcard', () => ({ downloadVCard: mocks.download }));

import { addToAppleWallet, addToGoogleWallet } from './walletService';

const card = { id: 'synthetic-card', slug: 'synthetic-card', firstName: 'Test', lastName: 'Fixture' };
const pkpassBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x01, 0x02, 0x03, 0x04]);
const passResponse = (bytes = pkpassBytes, type = 'application/vnd.apple.pkpass') =>
  new Response(bytes, { status: 200, headers: { 'Content-Type': type, 'Content-Length': String(bytes.length) } });
const NativeURL = URL;
class TestURL extends NativeURL {
  static createObjectURL = vi.fn(() => 'blob:synthetic-pass');
  static revokeObjectURL = vi.fn();
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.capacitor.native = false; mocks.capacitor.platform = 'web';
  vi.stubGlobal('Blob', NodeBlob);
  mocks.setTimeout.mockReturnValue(1);
  mocks.getSession.mockResolvedValue({ data: { session: { access_token: 'synthetic-user-token' } }, error: null });
  mocks.fetch.mockResolvedValue(passResponse());
  vi.stubGlobal('fetch', mocks.fetch);
  vi.stubGlobal('window', { location: { assign: mocks.assign }, setTimeout: mocks.setTimeout });
  TestURL.createObjectURL.mockClear(); TestURL.revokeObjectURL.mockClear();
  vi.stubGlobal('URL', TestURL);
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  document.body.innerHTML = '';
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('Apple Wallet authenticated .pkpass download', () => {
  it('POSTs with the owner session, accepts only binary MIME and downloads a ZIP without navigation', async () => {
    const result = await addToAppleWallet(card);
    expect(result, JSON.stringify(mocks.error.mock.calls)).toBe(true);
    expect(mocks.getSession).toHaveBeenCalledOnce();
    expect(mocks.fetch).toHaveBeenCalledOnce();
    const [url, init] = mocks.fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://vwlngxifajsziexhkafe.supabase.co/functions/v1/apple-wallet');
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('omit');
    expect(init.redirect).toBe('error');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer synthetic-user-token',
      apikey: expect.any(String),
      Accept: 'application/vnd.apple.pkpass',
    });
    expect(JSON.parse(String(init.body))).toEqual({ cardData: { id: card.id, slug: card.slug } });
    expect(document.querySelector('a[download="Test_Fixture.pkpass"]')).toBeNull();
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce();
    expect(mocks.setTimeout).toHaveBeenCalledWith(expect.any(Function), 60_000);
    expect(mocks.assign).not.toHaveBeenCalled();
    expect(mocks.info.mock.calls[0][0]).toContain('installation n’est pas vérifiée');
    expect(mocks.error).not.toHaveBeenCalled();
  });

  it('refuses URL/JSON responses from the legacy provider instead of redirecting', async () => {
    mocks.fetch.mockResolvedValue(new Response(JSON.stringify({ success: true, passUrl: 'https://pub1.pskt.io/TEST-ONLY' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    }));
    expect(await addToAppleWallet(card)).toBe(false);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(mocks.assign).not.toHaveBeenCalled();
    expect(mocks.error).toHaveBeenCalledOnce();
  });

  it.each(['application/json', 'application/octet-stream', 'text/html'])('requires exact Apple MIME type: %s', async type => {
    mocks.fetch.mockResolvedValue(passResponse(pkpassBytes, type));
    expect(await addToAppleWallet(card)).toBe(false);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(mocks.error).toHaveBeenCalledOnce();
  });

  it('rejects non-ZIP bytes even with the correct Apple MIME type', async () => {
    mocks.fetch.mockResolvedValue(passResponse(new Uint8Array([0x7b, 0x7d, 0, 0])));
    expect(await addToAppleWallet(card)).toBe(false);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
  });

  it('rejects missing auth, provider redirects, overlarge payloads and network failures', async () => {
    mocks.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });
    expect(await addToAppleWallet(card)).toBe(false);
    expect(mocks.fetch).not.toHaveBeenCalled();
    mocks.fetch.mockRejectedValueOnce(new Error('redirect blocked'));
    expect(await addToAppleWallet(card)).toBe(false);
    mocks.fetch.mockResolvedValueOnce(new Response(pkpassBytes, { status: 200, headers: { 'Content-Type': 'application/vnd.apple.pkpass', 'Content-Length': String(11 * 1024 * 1024) } }));
    expect(await addToAppleWallet(card)).toBe(false);
    expect(mocks.error).toHaveBeenCalledTimes(3);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
  });

  it('does not send an already cancelled request', async () => {
    const controller = new AbortController(); controller.abort();
    expect(await addToAppleWallet(card, undefined, controller.signal)).toBe(false);
    expect(mocks.getSession).not.toHaveBeenCalled(); expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.error).not.toHaveBeenCalled();
  });

  it('fails explicitly in Capacitor iOS until the native PassKit presentation bridge exists', async () => {
    mocks.capacitor.native = true; mocks.capacitor.platform = 'ios';
    expect(await addToAppleWallet(card)).toBe(false);
    expect(mocks.getSession).not.toHaveBeenCalled(); expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.error.mock.calls[0][0]).toContain('Ouvrez i-wasp.com dans Safari');
  });

  it('does not download or show success when cancelled while fetch resolves', async () => {
    let resolve!: (response: Response) => void;
    mocks.fetch.mockReturnValueOnce(new Promise<Response>(fulfill => { resolve = fulfill; }));
    const controller = new AbortController();
    const pending = addToAppleWallet(card, undefined, controller.signal);
    controller.abort(); resolve(passResponse());
    expect(await pending).toBe(false);
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(mocks.info).not.toHaveBeenCalled(); expect(mocks.error).not.toHaveBeenCalled();
  });
});

describe('Google Wallet remains an independent URL flow', () => {
  it('accepts only a trusted Google save URL', async () => {
    mocks.invoke.mockResolvedValue({ error: null, data: { success: true, saveUrl: 'https://pay.google.com/gp/v/save/TEST-ONLY' } });
    expect(await addToGoogleWallet(card)).toBe(true);
    expect(mocks.invoke).toHaveBeenCalledWith('google-wallet', { body: { cardData: card, walletStyles: undefined }, signal: undefined });
    expect(mocks.assign).toHaveBeenCalledWith('https://pay.google.com/gp/v/save/TEST-ONLY');
  });
});
