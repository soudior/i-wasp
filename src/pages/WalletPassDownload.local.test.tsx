/** Local-only Wallet page checks. Account and Wallet services are synthetic. */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  slug: 'synthetic-only' as string | undefined,
  getUser: vi.fn(), maybeSingle: vi.fn(), apple: vi.fn(), google: vi.fn(),
  authListeners: new Set<(event: string, session: { user: { id: string } } | null) => void>(),
}));
vi.mock('react-router-dom', async importOriginal => ({
  ...await importOriginal<typeof import('react-router-dom')>(),
  useParams: () => ({ slug: mocks.slug }),
}));
vi.mock('@/lib/walletService', () => ({ addToAppleWallet: mocks.apple, addToGoogleWallet: mocks.google }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: {
    getUser: mocks.getUser,
    onAuthStateChange: (listener: (event: string, session: { user: { id: string } } | null) => void) => {
      mocks.authListeners.add(listener);
      return { data: { subscription: { unsubscribe: () => mocks.authListeners.delete(listener) } } };
    },
  },
  from: (table: string) => {
    if (table !== 'digital_cards') throw new Error(`Unexpected synthetic table: ${table}`);
    const query = { select: () => query, eq: () => query, maybeSingle: mocks.maybeSingle };
    return query;
  },
} }));

import WalletPassDownload from './WalletPassDownload';

let host: HTMLDivElement;
let root: Root;
const render = async () => { await act(async () => root.render(<MemoryRouter><WalletPassDownload /></MemoryRouter>)); };
function button(label: string) {
  const node = Array.from(host.querySelectorAll('button')).find(item => item.textContent?.includes(`Ouvrir ${label} Wallet`));
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
function expectOriginalEnvelope() {
  expect(host.firstElementChild?.className).toBe('min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6');
  const logo = Array.from(host.querySelectorAll('span')).find(node => node.textContent === 'iW');
  expect(logo?.parentElement?.className).toBe('w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20');
  expect(host.querySelector('.rounded-3xl')?.className).toBe('bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8');
  const footer = Array.from(host.querySelectorAll('p')).find(node => node.textContent === 'Powered by IWASP');
  expect(footer?.className).toBe('text-white/30 text-xs mt-6');
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.authListeners.clear();
  mocks.slug = 'synthetic-only';
  mocks.getUser.mockResolvedValue({ data: { user: { id: 'synthetic-owner' } }, error: null });
  mocks.maybeSingle.mockResolvedValue({ data: { id: 'synthetic-card', slug: mocks.slug, first_name: 'Synthetic', last_name: 'Fixture' }, error: null });
  mocks.apple.mockResolvedValue(false);
  mocks.google.mockResolvedValue(false);
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

describe('Wallet page keeps the main visual envelope and honest statuses', () => {
  it('preserves the existing black/amber envelope without automatically requesting a pass', async () => {
    await render();
    expectOriginalEnvelope();
    expect(button('Apple').classList.contains('bg-amber-500')).toBe(true);
    expect(button('Google').classList.contains('bg-amber-500')).toBe(true);
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(mocks.apple).not.toHaveBeenCalled();
    expect(mocks.google).not.toHaveBeenCalled();
    expect(host.textContent).toContain('Un fichier contact .vcf n’est pas un pass');
  });

  it.each(['Apple', 'Google'])('keeps %s unavailability distinct from successful installation', async label => {
    await render();
    await click(label);
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Pass indisponible');
    expect(host.textContent).not.toContain('Pass téléchargé !');
    expect(host.textContent).not.toContain('Ajouté à');
    expect(button(label).disabled).toBe(false);
    expectOriginalEnvelope();
  });

  it.each(['Apple', 'Google'])('describes %s navigation as requested, never as verified installation', async label => {
    (label === 'Apple' ? mocks.apple : mocks.google).mockResolvedValue(true);
    await render();
    await click(label);
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Ouverture demandée. Confirmez l’ajout dans le Wallet ; aucune installation n’est vérifiée ici.');
    expect(host.textContent).not.toContain('Pass téléchargé !');
    expect(host.textContent).not.toContain('Ajouté à');
    expectOriginalEnvelope();
  });

  it('keeps the original envelope and disables Wallet actions for an invalid URL', async () => {
    mocks.slug = undefined;
    await render();
    expectOriginalEnvelope();
    expect(host.querySelector('[role="status"]')?.textContent).toContain('URL invalide');
    expect(button('Apple').disabled).toBe(true);
    expect(button('Google').disabled).toBe(true);
    expect(mocks.getUser).not.toHaveBeenCalled();
  });

  it.each(['SIGNED_OUT', 'SIGNED_IN'])('discards a late owner lookup after %s', async event => {
    const pending = deferred<{ data: { user: { id: string } }; error: null }>();
    mocks.getUser.mockReturnValueOnce(pending.promise);
    await render();
    await click('Apple');
    await act(async () => {
      emitAuth(event, event === 'SIGNED_OUT' ? null : 'different-owner');
      pending.resolve({ data: { user: { id: 'synthetic-owner' } }, error: null });
    });
    expect(mocks.maybeSingle).not.toHaveBeenCalled();
    expect(mocks.apple).not.toHaveBeenCalled();
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Session modifiée');
    expect(button('Apple').disabled).toBe(false);
  });

  it('discards a late card lookup after the account changes', async () => {
    const pending = deferred<{ data: { id: string; slug: string; first_name: string; last_name: string }; error: null }>();
    mocks.maybeSingle.mockReturnValueOnce(pending.promise);
    await render();
    await click('Google');
    await act(async () => {
      emitAuth('SIGNED_IN', 'different-owner');
      pending.resolve({ data: { id: 'synthetic-card', slug: 'synthetic-only', first_name: 'Synthetic', last_name: 'Fixture' }, error: null });
    });
    expect(mocks.google).not.toHaveBeenCalled();
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Session modifiée');
  });

  describe.each([
    { label: 'Apple', add: mocks.apple },
    { label: 'Google', add: mocks.google },
  ])('$label pending navigation', ({ label, add }) => {
    it.each(['SIGNED_OUT', 'SIGNED_IN'])('aborts synchronously on %s and ignores a late service result', async event => {
      const pending = deferred<boolean>();
      add.mockReturnValueOnce(pending.promise);
      await render();
      await click(label);
      const signal = add.mock.calls[0][2] as AbortSignal;
      expect(signal.aborted).toBe(false);
      await act(async () => {
        emitAuth(event, event === 'SIGNED_OUT' ? null : 'different-owner');
        expect(signal.aborted).toBe(true);
        pending.resolve(true);
      });
      expect(host.querySelector('[role="status"]')?.textContent).toContain('Session modifiée');
      expect(host.textContent).not.toContain('Ouverture demandée');
      expect(button(label).disabled).toBe(false);
    });

    it('invalidates sign-out/sign-in to the same UID and allows only a fresh post-commit retry', async () => {
      const pending = deferred<boolean>();
      add.mockReturnValueOnce(pending.promise);
      await render();
      await click(label);
      const signal = add.mock.calls[0][2] as AbortSignal;
      await act(async () => {
        emitAuth('SIGNED_OUT', null);
        emitAuth('SIGNED_IN', 'synthetic-owner');
        expect(signal.aborted).toBe(true);
        pending.resolve(true);
      });
      expect(host.querySelector('[role="status"]')?.textContent).toContain('Session modifiée');
      expect(add).toHaveBeenCalledTimes(1);
      await click(label);
      expect(add).toHaveBeenCalledTimes(2);
      expect(add.mock.calls[1][2]).not.toBe(signal);
      expect((add.mock.calls[1][2] as AbortSignal).aborted).toBe(false);
    });
  });

  it('blocks same-tick clicks after sign-out/sign-in to the same UID until React commits', async () => {
    await render();
    await click('Apple');
    expect(mocks.getUser).toHaveBeenCalledTimes(1);
    const previousButton = button('Apple');
    await act(async () => {
      emitAuth('SIGNED_OUT', null);
      emitAuth('SIGNED_IN', 'synthetic-owner');
      previousButton.click();
      expect(mocks.getUser).toHaveBeenCalledTimes(1);
    });
    await click('Apple');
    expect(mocks.getUser).toHaveBeenCalledTimes(2);
  });

  it('does not abort a request for a token refresh of its unchanged account', async () => {
    const pending = deferred<boolean>();
    mocks.apple.mockReturnValueOnce(pending.promise);
    await render();
    await click('Apple');
    const signal = mocks.apple.mock.calls[0][2] as AbortSignal;
    await act(async () => {
      emitAuth('TOKEN_REFRESHED', 'synthetic-owner');
      expect(signal.aborted).toBe(false);
      pending.resolve(false);
    });
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Pass indisponible');
  });

  it('rejects a stale getUser result that conflicts with the initial session', async () => {
    const pending = deferred<{ data: { user: { id: string } }; error: null }>();
    mocks.getUser.mockReturnValueOnce(pending.promise);
    await render();
    await click('Apple');
    await act(async () => {
      emitAuth('INITIAL_SESSION', 'different-owner');
      pending.resolve({ data: { user: { id: 'synthetic-owner' } }, error: null });
    });
    expect(mocks.maybeSingle).not.toHaveBeenCalled();
    expect(mocks.apple).not.toHaveBeenCalled();
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Session modifiée');
  });

  it('removes the identity listener when the page closes', async () => {
    await render();
    expect(mocks.authListeners.size).toBe(1);
    await act(async () => root.render(<div>Closed</div>));
    expect(mocks.authListeners.size).toBe(0);
  });
});
