import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(), error: vi.fn(), info: vi.fn(), download: vi.fn(), assign: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke: mocks.invoke } } }));
vi.mock('sonner', () => ({ toast: { error: mocks.error, info: mocks.info } }));
vi.mock('@/lib/vcard', () => ({ downloadVCard: mocks.download }));

import { addToAppleWallet, addToGoogleWallet } from './walletService';

const card = { id: 'test-card', slug: 'test-card', firstName: 'Test', lastName: 'Fixture' };
const wallets = [
  { type: 'apple', add: addToAppleWallet, urlField: 'passUrl', url: 'https://pub1.pskt.io/TEST-ONLY' },
  { type: 'google', add: addToGoogleWallet, urlField: 'saveUrl', url: 'https://pay.google.com/gp/v/save/TEST-ONLY' },
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('window', { location: { assign: mocks.assign } });
});
afterEach(() => vi.unstubAllGlobals());

describe('Wallet feedback never claims installation', () => {
  describe.each(wallets)('$type response handling', ({ type, add, urlField, url }) => {
    it.each([
      { error: new Error('offline'), data: null },
      { error: null, data: { fallback: true } },
      { error: null, data: { success: true } },
    ])('rejects unavailable responses %j', async response => {
      mocks.invoke.mockResolvedValue(response);
      expect(await add(card)).toBe(false);
      expect(mocks.assign).not.toHaveBeenCalled();
      expect(mocks.info).not.toHaveBeenCalled();
      expect(mocks.download).not.toHaveBeenCalled();
      expect(mocks.error).toHaveBeenCalledOnce();
    });

    it.each([undefined, false, true])('rejects HTTP 200 fallback:true even with success:%s and a trusted URL', async success => {
      // An HTTP 200 is a successful transport, not a successfully generated pass.
      const response = new Response(JSON.stringify({ success, fallback: true, [urlField]: url }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      expect(response.ok).toBe(true);
      mocks.invoke.mockResolvedValue({ error: null, data: await response.json() });

      expect(await add(card)).toBe(false);
      expect(mocks.invoke).toHaveBeenCalledWith(`${type}-wallet`, {
        body: { cardData: card, walletStyles: undefined }, signal: undefined,
      });
      expect(mocks.assign).not.toHaveBeenCalled();
      expect(mocks.info).not.toHaveBeenCalled();
      expect(mocks.download).not.toHaveBeenCalled();
      expect(mocks.error).toHaveBeenCalledOnce();
      expect(mocks.error.mock.calls[0][1].action.label).toContain('.vcf');
    });

    it('rejects an explicit error even if the response also claims success', async () => {
      mocks.invoke.mockResolvedValue({ error: null, data: { success: true, error: 'unavailable', [urlField]: url } });
      expect(await add(card)).toBe(false);
      expect(mocks.assign).not.toHaveBeenCalled();
      expect(mocks.info).not.toHaveBeenCalled();
    });

    it.each([
      'javascript:alert(1)',
      'https://evil.invalid/gp/v/save/test',
      'not-a-url',
    ])('rejects unsafe or invalid URL %s', async unsafeUrl => {
      mocks.invoke.mockResolvedValue({ error: null, data: { success: true, [urlField]: unsafeUrl } });
      expect(await add(card)).toBe(false);
      expect(mocks.assign).not.toHaveBeenCalled();
      expect(mocks.info).not.toHaveBeenCalled();
    });

    it('requests navigation only for a successful trusted response', async () => {
      mocks.invoke.mockResolvedValue({ error: null, data: { success: true, fallback: false, [urlField]: url } });
      expect(await add(card)).toBe(true);
      expect(mocks.assign).toHaveBeenCalledWith(url);
      expect(mocks.info.mock.calls[0][0]).toContain('installation n’est pas vérifiée');
      expect(mocks.error).not.toHaveBeenCalled();
      expect(mocks.download).not.toHaveBeenCalled();
    });
  });

  it('offers a deliberate vCard contact fallback', async () => {
    mocks.invoke.mockRejectedValue(new Error('offline'));
    await addToAppleWallet(card);
    const options = mocks.error.mock.calls[0][1];
    expect(options.action.label).toContain('.vcf');
    expect(mocks.download).not.toHaveBeenCalled();
    options.action.onClick();
    expect(mocks.download).toHaveBeenCalledWith(card);
  });

  it('reports blocked navigation without success', async () => {
    mocks.invoke.mockResolvedValue({ data: { success: true, saveUrl: 'https://pay.google.com/gp/v/save/TEST-ONLY' } });
    mocks.assign.mockImplementationOnce(() => { throw new Error('blocked'); });
    expect(await addToGoogleWallet(card)).toBe(false);
    expect(mocks.error).toHaveBeenCalledOnce();
  });

  it('skips an already cancelled request', async () => {
    const controller = new AbortController();
    controller.abort();
    expect(await addToAppleWallet(card, undefined, controller.signal)).toBe(false);
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.assign).not.toHaveBeenCalled();
    expect(mocks.error).not.toHaveBeenCalled();
  });

  it('never redirects when a dismissed Wallet request resolves later', async () => {
    let resolve!: (response: unknown) => void;
    mocks.invoke.mockReturnValue(new Promise(r => { resolve = r; }));
    const controller = new AbortController();
    const pending = addToGoogleWallet(card, undefined, controller.signal);
    expect(mocks.invoke.mock.calls[0][1].signal).toBe(controller.signal);
    controller.abort();
    resolve({ data: { success: true, saveUrl: 'https://pay.google.com/gp/v/save/TEST-ONLY' }, error: null });
    expect(await pending).toBe(false);
    expect(mocks.assign).not.toHaveBeenCalled();
    expect(mocks.info).not.toHaveBeenCalled();
    expect(mocks.error).not.toHaveBeenCalled();
  });

  it('does not offer a fallback toast when a request is intentionally aborted', async () => {
    const controller = new AbortController();
    mocks.invoke.mockImplementation(() => { controller.abort(); throw new Error('Synthetic AbortError'); });
    expect(await addToAppleWallet(card, undefined, controller.signal)).toBe(false);
    expect(mocks.error).not.toHaveBeenCalled();
  });
});
