/** Synthetic UI/service contract checks. No provider, account or pass is real. */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(), download: vi.fn(), navigate: vi.fn(),
  authListeners: new Set<(event: string, session: { user: { id: string } } | null) => void>(),
  subscription: { isGold: true, isLoading: false },
  toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() },
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  functions: { invoke: mocks.invoke },
  auth: {
    onAuthStateChange: (listener: (event: string, session: { user: { id: string } } | null) => void) => {
      mocks.authListeners.add(listener);
      return { data: { subscription: { unsubscribe: () => mocks.authListeners.delete(listener) } } };
    },
  },
} }));
vi.mock('@/lib/vcard', () => ({ downloadVCard: mocks.download }));
vi.mock('sonner', () => ({ toast: mocks.toast }));
vi.mock('@/hooks/useSubscription', () => ({ useSubscription: () => mocks.subscription }));
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('@/lib/walletService', async importOriginal => {
  const service = await importOriginal<typeof import('@/lib/walletService')>();
  return {
    ...service,
    addToAppleWallet: vi.fn(service.addToAppleWallet),
    addToGoogleWallet: vi.fn(service.addToGoogleWallet),
    supportsAppleWallet: () => false,
    supportsGoogleWallet: () => false,
  };
});

import { WalletPassButtons } from './WalletPassButtons';
import { addToAppleWallet, addToGoogleWallet } from '@/lib/walletService';

const card = { id: 'synthetic-card', slug: 'synthetic-card', firstName: 'Synthetic', lastName: 'Fixture' };
const wallets = [
  { label: 'Apple', type: 'apple', add: addToAppleWallet, urlField: 'passUrl', url: 'https://pub1.pskt.io/TEST-ONLY' },
  { label: 'Google', type: 'google', add: addToGoogleWallet, urlField: 'saveUrl', url: 'https://pay.google.com/gp/v/save/TEST-ONLY' },
];
let host: HTMLDivElement;
let root: Root;
const render = async (data = card) => {
  await act(async () => root.render(<WalletPassButtons data={data} />));
};
function button(label: string) {
  const node = Array.from(host.querySelectorAll('button')).find(item => item.textContent?.includes(`Ajouter à ${label} Wallet`));
  if (!node) throw new Error(`Wallet button missing: ${label}`);
  return node;
}
const click = async (label: string) => { await act(async () => button(label).click()); };
function emitAuth(event: string, userId: string | null) {
  mocks.authListeners.forEach(listener => listener(event, userId ? { user: { id: userId } } : null));
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(fulfill => { resolve = fulfill; });
  return { promise, resolve };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.invoke.mockReset().mockResolvedValue({ data: { fallback: true }, error: null });
  mocks.authListeners.clear();
  mocks.subscription.isGold = true;
  mocks.subscription.isLoading = false;
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden in synthetic Wallet tests'); }));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe('Wallet buttons preserve the service feedback contract', () => {
  describe.each(wallets)('$label Wallet', ({ label, type, add, urlField, url }) => {
    it.each([undefined, false, true])('never turns HTTP 200 fallback:true with success:%s into installation feedback', async success => {
      const response = new Response(JSON.stringify({ fallback: true, success, [urlField]: url }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
      expect(response.ok).toBe(true);
      mocks.invoke.mockResolvedValue({ data: await response.json(), error: null });
      await render();
      expect(mocks.invoke).not.toHaveBeenCalled();
      await click(label);
      expect(mocks.invoke).toHaveBeenCalledWith(`${type}-wallet`, {
        body: { cardData: expect.objectContaining(card), walletStyles: undefined }, signal: expect.any(AbortSignal),
      });
      expect(mocks.toast.error).toHaveBeenCalledOnce();
      expect(mocks.toast.info).not.toHaveBeenCalled();
      expect(mocks.toast.success).not.toHaveBeenCalled();
      expect(mocks.download).not.toHaveBeenCalled();
      expect(button(label).disabled).toBe(false);
      const fallbackAction = mocks.toast.error.mock.calls[0][1].action;
      expect(fallbackAction.label).toContain('.vcf');
      fallbackAction.onClick();
      expect(mocks.download).toHaveBeenCalledOnce();
    });

    it('does not claim installation when the service reports navigation was requested', async () => {
      vi.mocked(add).mockResolvedValueOnce(true);
      await render();
      await click(label);
      expect(add).toHaveBeenCalledOnce();
      expect(mocks.toast.success).not.toHaveBeenCalled();
      expect(host.textContent).toContain('aucune installation ni synchronisation automatique n’est vérifiée ici');
      expect(button(label).disabled).toBe(false);
    });

    it('keeps the existing GOLD gate and does not call Wallet for a free account', async () => {
      mocks.subscription.isGold = false;
      await render();
      await click(label);
      expect(add).not.toHaveBeenCalled();
      expect(mocks.invoke).not.toHaveBeenCalled();
      expect(mocks.toast.info).toHaveBeenCalledWith('Passe en GOLD pour ajouter ta carte au Wallet', expect.any(Object));
      expect(mocks.toast.success).not.toHaveBeenCalled();
    });

    it('rejects an incomplete card before calling the service', async () => {
      await render({ ...card, id: '' });
      await click(label);
      expect(add).not.toHaveBeenCalled();
      expect(mocks.invoke).not.toHaveBeenCalled();
      expect(mocks.toast.error).toHaveBeenCalledWith('Données de carte incomplètes');
    });

    it('locks repeated and cross-Wallet clicks synchronously until the request finishes', async () => {
      const pending = deferred<{ data: { fallback: boolean }; error: null }>();
      mocks.invoke.mockReturnValueOnce(pending.promise);
      await render();
      await act(async () => {
        button(label).click();
        button(label).click();
        button(label === 'Apple' ? 'Google' : 'Apple').click();
      });
      expect(mocks.invoke).toHaveBeenCalledTimes(1);
      expect(add).toHaveBeenCalledTimes(1);
      expect(button('Apple').disabled).toBe(true);
      expect(button('Google').disabled).toBe(true);
      await act(async () => pending.resolve({ data: { fallback: true }, error: null }));
      expect(button(label).disabled).toBe(false);
      await click(label);
      expect(add).toHaveBeenCalledTimes(2);
    });

    it.each(['SIGNED_OUT', 'SIGNED_IN', 'SAME_UID_RELOGIN'])('prevents real service navigation after %s even when the old response succeeds', async event => {
      const pending = deferred<{ data: Record<string, unknown>; error: null }>();
      mocks.invoke.mockReturnValueOnce(pending.promise);
      await render();
      await act(async () => emitAuth('INITIAL_SESSION', 'synthetic-owner'));
      await click(label);
      const signal = vi.mocked(add).mock.calls[0][2]!;
      expect(signal.aborted).toBe(false);
      await act(async () => {
        if (event === 'SAME_UID_RELOGIN') {
          emitAuth('SIGNED_OUT', null);
          emitAuth('SIGNED_IN', 'synthetic-owner');
        } else emitAuth(event, event === 'SIGNED_OUT' ? null : 'different-owner');
        expect(signal.aborted).toBe(true);
        pending.resolve({ data: { success: true, [urlField]: url }, error: null });
      });
      await expect(vi.mocked(add).mock.results[0].value).resolves.toBe(false);
      expect(mocks.toast.info).not.toHaveBeenCalled();
      expect(mocks.toast.success).not.toHaveBeenCalled();
      expect(mocks.toast.error).not.toHaveBeenCalled();
      expect(mocks.download).not.toHaveBeenCalled();
      expect(button(label).disabled).toBe(false);
    });

    it.each(['unmount', 'card change'])('prevents real service navigation after %s', async transition => {
      const pending = deferred<{ data: Record<string, unknown>; error: null }>();
      mocks.invoke.mockReturnValueOnce(pending.promise);
      await render();
      await click(label);
      const signal = vi.mocked(add).mock.calls[0][2]!;
      if (transition === 'unmount') {
        await act(async () => root.render(<div>Closed</div>));
        expect(mocks.authListeners.size).toBe(0);
      } else await render({ ...card, id: 'another-card', slug: 'another-card' });
      expect(signal.aborted).toBe(true);
      await act(async () => pending.resolve({ data: { success: true, [urlField]: url }, error: null }));
      await expect(vi.mocked(add).mock.results[0].value).resolves.toBe(false);
      expect(mocks.toast.info).not.toHaveBeenCalled();
      expect(mocks.toast.success).not.toHaveBeenCalled();
      expect(mocks.toast.error).not.toHaveBeenCalled();
    });

    it('blocks same-tick clicks after same-UID relogin until the new account generation commits', async () => {
      await render();
      await act(async () => emitAuth('INITIAL_SESSION', 'synthetic-owner'));
      const previousButton = button(label);
      await act(async () => {
        emitAuth('SIGNED_OUT', null);
        emitAuth('SIGNED_IN', 'synthetic-owner');
        previousButton.click();
        expect(add).not.toHaveBeenCalled();
        expect(mocks.invoke).not.toHaveBeenCalled();
      });
      await click(label);
      expect(add).toHaveBeenCalledOnce();
    });
  });

  it('does not expose Wallet buttons while the subscription is loading', async () => {
    mocks.subscription.isLoading = true;
    await render();
    expect(host.querySelectorAll('button')).toHaveLength(0);
    expect(mocks.invoke).not.toHaveBeenCalled();
  });
});
