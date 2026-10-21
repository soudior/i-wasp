/** Synthetic UI/service contract checks. No provider, account or pass is real. */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  apple: vi.fn(), google: vi.fn(), navigate: vi.fn(),
  authListeners: new Set<(event: string, session: { user: { id: string } } | null) => void>(),
  subscription: { isGold: true, isLoading: false },
  toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() },
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: {
    onAuthStateChange: (listener: (event: string, session: { user: { id: string } } | null) => void) => {
      mocks.authListeners.add(listener);
      return { data: { subscription: { unsubscribe: () => mocks.authListeners.delete(listener) } } };
    },
  },
} }));
vi.mock('sonner', () => ({ toast: mocks.toast }));
vi.mock('@/hooks/useSubscription', () => ({ useSubscription: () => mocks.subscription }));
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('@/lib/walletService', () => ({
  addToAppleWallet: mocks.apple,
  addToGoogleWallet: mocks.google,
  supportsAppleWallet: () => false,
  supportsGoogleWallet: () => false,
}));

import { WalletPassButtons } from './WalletPassButtons';

const card = { id: 'synthetic-card', slug: 'synthetic-card', firstName: 'Synthetic', lastName: 'Fixture' };
let host: HTMLDivElement;
let root: Root;
const render = async (data = card) => { await act(async () => root.render(<WalletPassButtons data={data} />)); };
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
  mocks.apple.mockResolvedValue(false);
  mocks.google.mockResolvedValue(false);
  mocks.authListeners.clear();
  mocks.subscription.isGold = true;
  mocks.subscription.isLoading = false;
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove();
});

describe('Wallet buttons: Apple free for all plans, Google remains Premium', () => {
  it.each([false, true])('allows Apple Wallet on free=%s without a plan upsell', async isGold => {
    mocks.subscription.isGold = isGold;
    await render();
    await click('Apple');
    expect(mocks.apple).toHaveBeenCalledOnce();
    expect(mocks.apple).toHaveBeenCalledWith(expect.objectContaining(card), undefined, expect.any(AbortSignal));
    expect(mocks.toast.info).not.toHaveBeenCalledWith(expect.stringContaining('Passe en GOLD'), expect.anything());
  });

  it('keeps Google Wallet behind Premium for a Free account without calling the service', async () => {
    mocks.subscription.isGold = false;
    await render();
    await click('Google');
    expect(mocks.google).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.toast.info).toHaveBeenCalledWith('Passe à Premium pour ajouter ta carte à Google Wallet', expect.any(Object));
  });

  it('calls Google Wallet for Premium users', async () => {
    await render(); await click('Google');
    expect(mocks.google).toHaveBeenCalledOnce();
  });

  it('rejects an incomplete card before either service is called', async () => {
    await render({ ...card, id: '' }); await click('Apple');
    expect(mocks.apple).not.toHaveBeenCalled(); expect(mocks.google).not.toHaveBeenCalled();
    expect(mocks.toast.error).toHaveBeenCalledWith('Données de carte incomplètes');
  });

  it('locks repeated and cross-Wallet clicks synchronously until the request finishes', async () => {
    const pending = deferred<boolean>(); mocks.apple.mockReturnValueOnce(pending.promise);
    await render();
    await act(async () => { button('Apple').click(); button('Apple').click(); button('Google').click(); });
    expect(mocks.apple).toHaveBeenCalledTimes(1); expect(mocks.google).not.toHaveBeenCalled();
    expect(button('Apple').disabled).toBe(true); expect(button('Google').disabled).toBe(true);
    await act(async () => pending.resolve(false));
    expect(button('Apple').disabled).toBe(false);
  });

  it('aborts an Apple request after sign-out before a late response can be used', async () => {
    const pending = deferred<boolean>(); mocks.apple.mockReturnValueOnce(pending.promise);
    await render(); await act(async () => emitAuth('INITIAL_SESSION', 'synthetic-owner'));
    await click('Apple');
    const signal = mocks.apple.mock.calls[0][2] as AbortSignal;
    await act(async () => { emitAuth('SIGNED_OUT', null); expect(signal.aborted).toBe(true); pending.resolve(false); });
    expect(mocks.apple).toHaveBeenCalledOnce();
  });

  it('does not expose buttons while subscription is loading', async () => {
    mocks.subscription.isLoading = true; await render();
    expect(host.querySelectorAll('button')).toHaveLength(0);
  });
});
