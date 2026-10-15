/** Real form interactions with synthetic Supabase only; any network call fails the test. */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  user: { id: 'fixture-admin' } as { id: string } | null,
  insert: vi.fn(), read: vi.fn(), rpc: vi.fn(), eq: vi.fn(), unsubscribe: vi.fn(), upload: vi.fn(), publicUrl: vi.fn(),
  authChanged: null as null | ((event: string, session: { user: { id: string } } | null) => void),
  toast: { error: vi.fn(), success: vi.fn() },
}));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('@/layouts/AdminOmniaLayout', () => ({ AdminOmniaLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock('@/components/StoryEditor', () => ({ StoryEditor: () => null }));
vi.mock('@/hooks/useStories', () => ({ useStories: () => ({}) }));
vi.mock('sonner', () => ({ toast: mocks.toast }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  rpc: mocks.rpc,
  auth: { onAuthStateChange: (callback: typeof mocks.authChanged) => {
    mocks.authChanged = callback;
    return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
  } },
  storage: { from: () => ({ upload: mocks.upload, getPublicUrl: mocks.publicUrl }) },
  from: (table: string) => {
    if (table !== 'digital_cards') throw new Error(`Unexpected table: ${table}`);
    const query = {
      insert: (values: unknown) => ({ select: () => ({ single: () => mocks.insert(values) }) }),
      select: () => query,
      eq: (...args: unknown[]) => { mocks.eq(...args); return query; },
      single: mocks.read,
    };
    return query;
  },
} }));
import AdminInstantCard from './AdminInstantCard';
let host: HTMLDivElement;
let root: Root;
const card = { id: 'fixture-card', slug: 'fixture-commerce', user_id: 'fixture-admin' };
const active = { ...card, is_active: true, nfc_enabled: true, wallet_enabled: true };
const render = async () => { await act(async () => root.render(<MemoryRouter><AdminInstantCard /></MemoryRouter>)); };
const button = (text: string) => {
  const result = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.includes(text));
  if (!result) throw new Error(`Button not found: ${text}`);
  return result;
};
const click = async (text: string, twice = false) => { await act(async () => { const b = button(text); b.click(); if (twice) b.click(); }); };
const fillName = async () => {
  const input = host.querySelector('input')!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'Commerce fictif');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
function deferred<T>() { let resolve!: (result: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { resolve, promise }; }
beforeEach(() => {
  vi.clearAllMocks(); Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mocks.user = { id: card.user_id };
  mocks.insert.mockResolvedValue({ data: card, error: null });
  mocks.rpc.mockResolvedValue({ data: null, error: null });
  mocks.read.mockResolvedValue({ data: active, error: null });
  mocks.upload.mockResolvedValue({ error: null });
  mocks.publicUrl.mockReturnValue({ data: { publicUrl: 'https://fixture.invalid/image.png' } });
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden in isolated tests'); }));
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); });

describe('Admin instant card form', () => {
  it('creates once on double click, omits protected flags, activates via exact RPC and verifies before success', async () => {
    const pending = deferred<{ data: typeof card; error: null }>(); mocks.insert.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Créer la carte', true);
    expect(mocks.insert).toHaveBeenCalledTimes(1); expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.insert.mock.calls[0][0][0]).not.toHaveProperty('nfc_enabled');
    expect(mocks.insert.mock.calls[0][0][0]).not.toHaveProperty('wallet_enabled');
    await act(async () => pending.resolve({ data: card, error: null }));
    expect(mocks.rpc).toHaveBeenCalledExactlyOnceWith('admin_set_card_lifecycle', {
      p_card_id: card.id, p_is_active: true, p_nfc_enabled: true, p_wallet_enabled: true,
    });
    expect(mocks.eq).toHaveBeenCalledWith('id', card.id); expect(mocks.eq).toHaveBeenCalledWith('user_id', card.user_id);
    expect(mocks.read).toHaveBeenCalledTimes(1); expect(host.textContent).toContain('Carte digitale active');
    expect(mocks.toast.success).toHaveBeenCalledTimes(1);
  });
  it('retains the inserted ID after RPC failure and retries activation without reinserting', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: null, error: new Error('synthetic denied') });
    await render(); await fillName(); await click('Créer la carte');
    expect(host.textContent).toContain('Carte enregistrée. Activation à confirmer');
    expect(host.textContent).not.toContain('Carte digitale active'); expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(host.querySelector('fieldset')?.disabled).toBe(true);
    await click('Réessayer l’activation');
    expect(mocks.insert).toHaveBeenCalledTimes(1); expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expect(mocks.rpc.mock.calls[1][1].p_card_id).toBe(card.id); expect(host.textContent).toContain('Carte digitale active');
  });
  it('does not display success until the persisted flags are confirmed; retries the same card', async () => {
    mocks.read.mockResolvedValueOnce({ data: { ...active, wallet_enabled: false }, error: null });
    await render(); await fillName(); await click('Créer la carte');
    expect(host.textContent).not.toContain('Carte digitale active'); expect(mocks.toast.success).not.toHaveBeenCalled();
    await click('Réessayer l’activation'); expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(host.textContent).toContain('Carte digitale active');
  });
  it('does not activate an old-account insert after an account change', async () => {
    const pending = deferred<{ data: typeof card; error: null }>(); mocks.insert.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Créer la carte');
    mocks.user = { id: 'second-fixture-admin' }; await render();
    await act(async () => pending.resolve({ data: card, error: null }));
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(host.textContent).not.toContain('Carte enregistrée'); expect(host.querySelector('input')?.value).toBe('');
  });
  it('discards an old-account activation result without re-reading or reporting success', async () => {
    const pending = deferred<{ data: null; error: null }>(); mocks.rpc.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Créer la carte');
    mocks.user = null; await render();
    await act(async () => pending.resolve({ data: null, error: null }));
    expect(mocks.read).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(host.textContent).not.toContain('Carte digitale active');
  });
  it('cancels at the auth event before React has rendered the changed account', async () => {
    const pending = deferred<{ data: typeof card; error: null }>(); mocks.insert.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Créer la carte');
    await act(async () => {
      mocks.authChanged!('SIGNED_OUT', null);
      pending.resolve({ data: card, error: null });
    });
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
  });
  it('unlocks the form after batched sign-out/sign-in of the same account, ignoring the old insert', async () => {
    const pending = deferred<{ data: typeof card; error: null }>(); mocks.insert.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Créer la carte');
    await act(async () => {
      mocks.authChanged!('SIGNED_OUT', null);
      mocks.authChanged!('SIGNED_IN', { user: { id: card.user_id } });
    });
    await act(async () => pending.resolve({ data: card, error: null }));
    expect(mocks.rpc).not.toHaveBeenCalled();
    await fillName(); expect(button('Créer la carte').disabled).toBe(false);
  });
  it('blocks creation during upload and never imports an old account’s completed media', async () => {
    const pending = deferred<{ error: null }>(); mocks.upload.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Médias');
    const input = host.querySelector('input[type=file]')!;
    Object.defineProperty(input, 'files', { value: [new File(['fixture'], 'fixture.png', { type: 'image/png' })] });
    await act(async () => input.dispatchEvent(new Event('change', { bubbles: true })));
    expect(button('Créer la carte').disabled).toBe(true);
    expect(mocks.upload.mock.calls[0][0]).toMatch(/^fixture-admin\/logo\//);
    mocks.user = { id: 'other-fixture-admin' }; await render();
    await act(async () => pending.resolve({ error: null }));
    expect(mocks.publicUrl).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(host.querySelector('img[src="https://fixture.invalid/image.png"]')).toBeNull();
  });
  it('handles a rejected upload without leaving the form locked', async () => {
    mocks.upload.mockRejectedValue(new Error('synthetic network error'));
    await render(); await fillName(); await click('Médias');
    const input = host.querySelector('input[type=file]')!;
    Object.defineProperty(input, 'files', { value: [new File(['fixture'], 'fixture.png', { type: 'image/png' })] });
    await act(async () => input.dispatchEvent(new Event('change', { bubbles: true })));
    expect(button('Créer la carte').disabled).toBe(false); expect(mocks.toast.error).toHaveBeenCalled();
  });
  it('discards a late geolocation callback after switching accounts without a reverse-geocode request', async () => {
    let onPosition!: PositionCallback;
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition: (callback: PositionCallback) => { onPosition = callback; } } });
    await render(); await fillName();
    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Détecter ma position"]')!.click());
    expect(button('Créer la carte').disabled).toBe(true);
    mocks.user = { id: 'other-fixture-admin' }; await render();
    await act(async () => onPosition({ coords: { latitude: 0, longitude: 0 } } as GeolocationPosition));
    expect(fetch).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(host.querySelector<HTMLInputElement>('[placeholder="Ville, Pays"]')!.value).toBe('');
  });
  it('ignores an old-account reverse-geocode response', async () => {
    let onPosition!: PositionCallback;
    const pending = deferred<Response>(); vi.mocked(fetch).mockReturnValue(pending.promise);
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition: (callback: PositionCallback) => { onPosition = callback; } } });
    await render();
    await act(async () => host.querySelector<HTMLButtonElement>('[aria-label="Détecter ma position"]')!.click());
    await act(async () => { onPosition({ coords: { latitude: 0, longitude: 0 } } as GeolocationPosition); });
    mocks.user = { id: 'other-fixture-admin' }; await render();
    await act(async () => pending.resolve({ json: async () => ({ display_name: 'Fiction, Fixture', address: { city: 'Fiction', country: 'Fixture' } }) } as Response));
    expect(host.querySelector<HTMLInputElement>('[placeholder="Ville, Pays"]')!.value).toBe('');
    expect(mocks.toast.success).not.toHaveBeenCalled();
  });
  it('does not continue an insert after the page is unmounted', async () => {
    const pending = deferred<{ data: typeof card; error: null }>(); mocks.insert.mockReturnValue(pending.promise);
    await render(); await fillName(); await click('Créer la carte');
    await act(async () => root.render(<div>Closed</div>));
    await act(async () => pending.resolve({ data: card, error: null }));
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
  });
});
