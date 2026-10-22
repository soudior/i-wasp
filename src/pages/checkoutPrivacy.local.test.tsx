/** Integration of the real forms and providers. Every external service is mocked. */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ExpressCheckoutProvider } from '@/contexts/ExpressCheckoutContext';
import { OrderFunnelGuard, OrderFunnelProvider } from '@/contexts/OrderFunnelContext';

const mocks = vi.hoisted(() => ({
  insertCard: vi.fn(), insertOrder: vi.fn(), createOrder: vi.fn(), invoke: vi.fn(),
  currentUser: null as null | { id: string; email: string },
  getUser: vi.fn(), fetch: vi.fn(),
  authListeners: new Set<(event: string, session: { user: { id: string } } | null) => void>(),
  findSubscription: vi.fn(), insertSubscription: vi.fn(), updateSubscription: vi.fn(),
  trackPurchase: vi.fn(), trackInfoSubmit: vi.fn(), upload: vi.fn(), rpc: vi.fn(), readOrder: vi.fn(),
  geoSuccess: null as null | ((position: { latitude: number | null; longitude: number | null }) => void),
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), loading: vi.fn() },
}));
const user = { id: '00000000-0000-4000-8000-000000000001', email: 'account-only@example.invalid' };
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: mocks.currentUser }) }));
vi.mock('@/hooks/useGeolocation', () => ({ useGeolocation: (options: { onSuccess: typeof mocks.geoSuccess }) => { mocks.geoSuccess = options.onSuccess; return {}; } }));
vi.mock('@/hooks/useAnalyticsEvents', () => ({ useExpressCheckoutTracking: () => ({ trackPurchase: mocks.trackPurchase, trackInfoSubmit: mocks.trackInfoSubmit }) }));
vi.mock('@/hooks/useOrders', () => ({ useCreateOrder: () => ({ mutateAsync: mocks.createOrder }) }));
vi.mock('@/components/order/OrderLoader', () => ({ OrderLoader: () => <div role="status">En cours</div> }));
vi.mock('sonner', () => ({ toast: mocks.toast }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: {
    getUser: mocks.getUser,
    onAuthStateChange: (listener: (event: string, session: { user: { id: string } } | null) => void) => {
      mocks.authListeners.add(listener);
      return { data: { subscription: { unsubscribe: () => mocks.authListeners.delete(listener) } } };
    },
  },
  functions: { invoke: mocks.invoke },
  rpc: mocks.rpc,
  storage: { from: () => ({ upload: mocks.upload, getPublicUrl: () => ({ data: { publicUrl: 'https://example.invalid/photo.jpg' } }) }) },
  from: (table: string) => {
    if (table === 'digital_cards') return { insert: mocks.insertCard };
    if (table === 'orders') {
      const orders = { select: () => orders, eq: () => orders, single: () => mocks.readOrder(), insert: (values: unknown) => ({ select: () => ({ single: () => mocks.insertOrder(values) }) }) };
      return orders;
    }
    if (table === 'subscriptions') {
      const query = { select: () => query, eq: () => query, maybeSingle: mocks.findSubscription, insert: mocks.insertSubscription, update: (values: unknown) => ({ eq: () => mocks.updateSubscription(values) }) };
      return query;
    }
    throw new Error(`Unexpected table: ${table}`);
  },
} }));

import ExpressInfos from './express/ExpressInfos';
import ExpressPayer from './express/ExpressPayer';
import OrderIdentite from './order/OrderIdentite';
import OrderRecap from './order/OrderRecap';

const delivery = { firstName: 'Camille', lastName: 'Test', email: 'delivery-only@example.invalid', phone: '+212600000000', address: 'TEST ONLY', city: 'Test City' };
const identity = { clientType: 'particulier', firstName: 'Camille', lastName: 'Test', email: '', phone: '', tagline: 'Profil fictif' };
let host: HTMLDivElement;
let root: Root;
function HistoryControls() {
  const navigate = useNavigate();
  const location = useLocation();
  return <><output data-testid="route">{location.pathname}</output><button onClick={() => navigate(-1)}>History back</button><button onClick={() => navigate(1)}>History forward</button></>;
}
function App({ initial, entries = [initial] }: { initial: string; entries?: string[] }) {
  return <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
    <HistoryControls />
    <OrderFunnelProvider><ExpressCheckoutProvider><Routes>
      <Route path="/order/identite" element={<OrderIdentite />} />
      <Route path="/order/template" element={<OrderFunnelGuard step={3}><p>Modèle autorisé</p></OrderFunnelGuard>} />
      <Route path="/order/recap" element={<OrderRecap />} />
      <Route path="/express/infos" element={<ExpressInfos />} />
      <Route path="/express/payer" element={<ExpressPayer />} />
      <Route path="*" element={<p>Autre étape</p>} />
    </Routes></ExpressCheckoutProvider></OrderFunnelProvider>
  </MemoryRouter>;
}
const settle = async (delay = 65) => { await act(async () => { await new Promise(resolve => setTimeout(resolve, delay)); }); };
const render = async (initial: string, entries?: string[]) => {
  await act(async () => root.render(<App initial={initial} entries={entries} />));
  await settle();
};
const route = () => host.querySelector('[data-testid="route"]')?.textContent;
const click = async (label: string, twice = false) => {
  const node = Array.from(host.querySelectorAll('button')).find(button => button.textContent?.trim().startsWith(label));
  if (!node) throw new Error(`Missing button: ${label}`);
  await act(async () => { node.click(); if (twice) node.click(); });
};
const toggle = async (id: string) => {
  const node = host.querySelector<HTMLInputElement>(`#${id}`);
  if (!node) throw new Error(`Missing checkbox: ${id}`);
  await act(async () => node.click());
};
const fill = async (selector: string, value: string) => {
  const input = host.querySelector<HTMLInputElement>(selector);
  if (!input) throw new Error(`Missing input: ${selector}`);
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
function seedOrder(publicIdentity: object = identity, extras = {}) {
  sessionStorage.setItem('orderFunnelStateV2', JSON.stringify({
    currentStep: 6, selectedOffer: 'essentiel', selectedTemplate: 'executive', digitalIdentity: publicIdentity,
    cardPersonalization: { visualType: 'photo', imageUrl: '', fileName: 'synthetic' },
    shippingInfo: { addressType: 'domicile', address: 'TEST ONLY', city: 'Test City', country: 'Maroc', phone: '+212600000000' },
    ...extras,
  }));
}
function seedExpress(customerInfo: object = delivery) {
  sessionStorage.setItem('expressCheckoutState', JSON.stringify({ currentStep: 2, selectedOffer: 'essentiel', customerInfo, paymentMethod: 'cod', isComplete: false }));
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.currentUser = user;
  mocks.authListeners.clear();
  mocks.getUser.mockResolvedValue({ data: { user }, error: null });
  mocks.upload.mockResolvedValue({ data: { path: `${user.id}/photos/mock.jpg` }, error: null });
  mocks.fetch.mockResolvedValue({ blob: async () => new Blob(['synthetic'], { type: 'image/png' }) });
  vi.stubGlobal('fetch', mocks.fetch);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  sessionStorage.clear();
  mocks.insertCard.mockResolvedValue({ error: null });
  mocks.insertOrder.mockResolvedValue({ data: { id: 'synthetic-order' }, error: null });
  mocks.createOrder.mockResolvedValue({ id: 'synthetic-order' });
  mocks.rpc.mockResolvedValue({ data: '00000000-0000-4000-8000-000000000003', error: null });
  mocks.readOrder.mockResolvedValue({ data: { id: '00000000-0000-4000-8000-000000000003', order_number: '26100001', total_price_cents: 2900, currency: 'EUR' }, error: null });
  mocks.findSubscription.mockResolvedValue({ data: null, error: null });
  mocks.insertSubscription.mockResolvedValue({ error: null });
  mocks.updateSubscription.mockResolvedValue({ error: null });
  mocks.invoke.mockResolvedValue({ error: new Error('Synthetic payment stop') });
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Order real form and provider public confirmation', () => {
  it('does not advance a legacy identity until public visibility is explicitly confirmed', async () => {
    seedOrder();
    await render('/order/identite');
    expect(host.querySelector<HTMLInputElement>('#profile-profileVisibilityConfirmed')?.checked).toBe(false);
    await click('Continuer');
    expect(route()).toBe('/order/identite');
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(host.textContent).toContain('Confirmez les informations');
    await toggle('profile-profileVisibilityConfirmed');
    await click('Continuer', true);
    await settle(125);
    expect(route()).toBe('/order/template');
    expect(host.textContent).toContain('Modèle autorisé');
    const saved = JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!);
    expect(saved.digitalIdentity).toMatchObject({ firstName: 'Camille', email: '', phone: '', profileVisibilityConfirmed: true });
  });
  it('redirects a legacy non-consenting draft away from the recap without creating a card', async () => {
    seedOrder();
    await render('/order/recap');
    await settle();
    expect(route()).toBe('/order/identite');
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });
  it('invalidates confirmation on edit and browser Forward cannot recover the old accepted identity', async () => {
    seedOrder({ ...identity, profileVisibilityConfirmed: true });
    await render('/order/template', ['/order/identite', '/order/template']);
    await click('History back'); await settle();
    await fill('#profile-firstName', 'Nouvelle identité');
    expect(host.querySelector<HTMLInputElement>('#profile-profileVisibilityConfirmed')?.checked).toBe(false);
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!).digitalIdentity).toBeNull();
    await click('History forward'); await settle(); await settle();
    expect(route()).toBe('/order/identite');
    expect(host.querySelector<HTMLInputElement>('#profile-firstName')?.value).toBe('Nouvelle identité');
    expect(mocks.insertCard).not.toHaveBeenCalled();
  });
  it('keeps browser Back authoritative when it interrupts the identity transition', async () => {
    seedOrder({ ...identity, profileVisibilityConfirmed: true });
    await render('/order/identite');
    await click('Continuer');
    await click('History back');
    await settle(125);
    expect(route()).toBe('/order/identite');
    await fill('#profile-firstName', 'Nom révisé');
    await toggle('profile-profileVisibilityConfirmed');
    await click('Continuer'); await settle(125);
    expect(route()).toBe('/order/template');
  });
  it('invalidates prior confirmation when geolocation completes and retains the new draft through reconfirmation', async () => {
    seedOrder({ ...identity, profileVisibilityConfirmed: true });
    await render('/order/identite');
    await act(async () => mocks.geoSuccess?.({ latitude: 0, longitude: 0 }));
    expect(host.querySelector<HTMLInputElement>('#profile-profileVisibilityConfirmed')?.checked).toBe(false);
    const edited = JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!);
    expect(edited.digitalIdentity).toBeNull();
    expect(edited.identityDraft).toMatchObject({ latitude: 0, longitude: 0, googleMapsUrl: 'https://www.google.com/maps?q=0,0', profileVisibilityConfirmed: false });
    await click('Continuer');
    expect(route()).toBe('/order/identite');
    await toggle('profile-profileVisibilityConfirmed'); await click('Continuer'); await settle(125);
    expect(route()).toBe('/order/template');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!).digitalIdentity).toMatchObject({ latitude: 0, longitude: 0, profileVisibilityConfirmed: true });
  });
  it('keeps empty public contacts out of the card while preserving private account/delivery contacts in the order', async () => {
    seedOrder({ ...identity, profileVisibilityConfirmed: true, photoUrl: 'https://example.invalid/photo.jpg' });
    await render('/order/recap');
    await click('Payer');
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc.mock.calls[0][1].p_card).toMatchObject({ firstName: 'Camille', email: '', phone: '', template: 'executive', tagline: 'Profil fictif', photoUrl: 'https://example.invalid/photo.jpg' });
    expect(mocks.rpc.mock.calls[0][1].p_card).not.toHaveProperty('nfc_enabled');
    expect(mocks.rpc.mock.calls[0][1].p_order).toMatchObject({ customerEmail: user.email, shippingPhone: '+212600000000' });
  });
  it('retains the edited draft and reports a blocked browser storage instead of throwing', async () => {
    seedOrder();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage unavailable'); });
    await render('/order/identite');
    await fill('#profile-firstName', 'Mémoire locale');
    expect(host.textContent).toContain('ne peut pas conserver ce brouillon');
    expect(host.querySelector<HTMLInputElement>('#profile-firstName')?.value).toBe('Mémoire locale');
    await toggle('profile-profileVisibilityConfirmed'); await click('Continuer'); await settle(125);
    expect(route()).toBe('/order/template');
  });
});

describe('Express real form and provider optional names-only profile', () => {
  it.each([undefined, false])('keeps a legacy or unchecked choice (%s) private through confirmation', async publishNameOnly => {
    seedExpress({ ...delivery, ...(publishNameOnly === undefined ? {} : { publishNameOnly }) });
    await render('/express/infos');
    expect(host.querySelector<HTMLInputElement>('#express-publishNameOnly')?.checked).toBe(false);
    await click('Continuer vers le paiement');
    await click('Confirmer');
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc.mock.calls[0][1].p_card).toMatchObject({ publish: false, email: '', phone: '' });
    expect(mocks.rpc.mock.calls[0][1].p_card).not.toHaveProperty('address');
    expect(mocks.rpc.mock.calls[0][1].p_order).toMatchObject({ customerEmail: delivery.email, shippingPhone: delivery.phone });
    expect(route()).toBe('/express/succes');
  });
  it('publishes only explicitly selected names and never delivery contacts', async () => {
    seedExpress();
    await render('/express/infos');
    await toggle('express-publishNameOnly');
    await click('Continuer vers le paiement', true);
    await click('Confirmer', true);
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(mocks.rpc.mock.calls[0][1].p_card).toMatchObject({ firstName: 'Camille', lastName: 'Test', email: '', phone: '', publish: true, template: 'signature' });
    expect(mocks.rpc.mock.calls[0][1].p_card).not.toHaveProperty('address');
    expect(mocks.rpc.mock.calls[0][1].p_order).toMatchObject({ customerEmail: delivery.email, shippingPhone: delivery.phone, shippingAddress: delivery.address });
  });
  it('clears an old choice after editing and browser Forward cannot skip revalidating the draft', async () => {
    seedExpress({ ...delivery, publishNameOnly: true });
    await render('/express/payer', ['/express/infos', '/express/payer']);
    await click('History back');
    await fill('input[placeholder="Prénom"]', 'Autre prénom');
    expect(host.querySelector<HTMLInputElement>('#express-publishNameOnly')?.checked).toBe(false);
    expect(JSON.parse(sessionStorage.getItem('expressCheckoutState')!).customerInfo).toBeNull();
    await click('History forward');
    expect(route()).toBe('/express/infos');
    expect(host.querySelector<HTMLInputElement>('input[placeholder="Prénom"]')?.value).toBe('Autre prénom');
    await click('Continuer vers le paiement'); await click('Confirmer');
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc.mock.calls[0][1].p_card.publish).toBe(false);
  });
});


describe('Order photo upload with existing owner-scoped storage policy', () => {
  const dataUrl = 'data:image/png;base64,c3ludGhldGlj';
  function seedPhoto() {
    seedOrder(identity, { digitalIdentity: null, identityDraft: { ...identity, photoUrl: dataUrl, profileVisibilityConfirmed: true } });
  }
  function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
  async function changeAccount() {
    await act(async () => {
      mocks.currentUser = { id: '00000000-0000-4000-8000-000000000099', email: 'other@example.invalid' };
      for (const listener of mocks.authListeners) listener('SIGNED_IN', { user: mocks.currentUser });
    });
  }
  it('refuses upload without a verified session and retains the complete photo draft', async () => {
    seedPhoto();
    mocks.currentUser = null;
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await render('/order/identite');
    await click('Continuer');
    expect(route()).toBe('/order/identite');
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.toast.error).toHaveBeenCalledWith(expect.stringContaining('Connectez-vous'));
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!)).toMatchObject({ digitalIdentity: null, identityDraft: { photoUrl: dataUrl, firstName: 'Camille' } });
  });
  it('uploads exactly once beneath the verified owner and retains the resulting photo URL', async () => {
    seedPhoto();
    await render('/order/identite');
    await click('Continuer', true); await settle(125);
    expect(mocks.getUser).toHaveBeenCalledTimes(1);
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    const [path, blob, options] = mocks.upload.mock.calls[0];
    expect(path).toMatch(new RegExp(`^${user.id}/photos/[0-9a-f-]+\\.png$`));
    expect(blob.type).toBe('image/png');
    expect(options).toMatchObject({ upsert: false, contentType: 'image/png' });
    expect(route()).toBe('/order/template');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!).digitalIdentity).toMatchObject({ photoUrl: 'https://example.invalid/photo.jpg', profileVisibilityConfirmed: true });
  });
  it('preserves the draft on storage failure and permits a successful retry', async () => {
    seedPhoto();
    mocks.upload.mockResolvedValueOnce({ data: null, error: new Error('Synthetic RLS refusal') });
    await render('/order/identite');
    await click('Continuer');
    expect(route()).toBe('/order/identite');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!)).toMatchObject({ digitalIdentity: null, identityDraft: { photoUrl: dataUrl } });
    expect(mocks.toast.error).toHaveBeenCalledWith(expect.stringContaining('Votre saisie est conservée'));
    await click('Continuer'); await settle(125);
    expect(mocks.upload).toHaveBeenCalledTimes(2);
    expect(route()).toBe('/order/template');
  });
  it('does not transfer if the account changes while session validation is pending', async () => {
    seedPhoto();
    const pending = deferred<{ data: { user: typeof user }; error: null }>();
    mocks.getUser.mockReturnValueOnce(pending.promise);
    await render('/order/identite'); await click('Continuer');
    await changeAccount();
    await act(async () => pending.resolve({ data: { user }, error: null }));
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(route()).toBe('/order/identite');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!).digitalIdentity).toBeNull();
  });
  it('does not transfer if the account changes while preparing image bytes', async () => {
    seedPhoto();
    const pending = deferred<Blob>();
    mocks.fetch.mockResolvedValueOnce({ blob: () => pending.promise });
    await render('/order/identite'); await click('Continuer');
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
    await changeAccount();
    await act(async () => pending.resolve(new Blob(['synthetic'], { type: 'image/png' })));
    expect(mocks.upload).not.toHaveBeenCalled();
    expect(route()).toBe('/order/identite');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!).digitalIdentity).toBeNull();
  });
  it('ignores transfer completion after an account change without validating the obsolete profile', async () => {
    seedPhoto();
    const pending = deferred<{ error: null }>();
    mocks.upload.mockReturnValueOnce(pending.promise);
    await render('/order/identite'); await click('Continuer');
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    await changeAccount();
    await act(async () => pending.resolve({ error: null }));
    expect(route()).toBe('/order/identite');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!)).toMatchObject({ digitalIdentity: null, identityDraft: { photoUrl: dataUrl } });
    expect(mocks.insertCard).not.toHaveBeenCalled();
  });
});


describe('Order file reading operation cancellation', () => {
  const freshPhoto = 'data:image/png;base64,bmV3LWZpeHR1cmU=';
  function installReader() {
    const readers: { onload?: (event: unknown) => void }[] = [];
    class Reader { onload?: (event: unknown) => void; onerror?: () => void; readAsDataURL() { readers.push(this); } }
    vi.stubGlobal('FileReader', Reader);
    return () => readers[readers.length - 1];
  }
  function fileInput() {
    const input = host.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(input, 'files', { configurable: true, value: [new File(['synthetic'], 'new.png', {type:'image/png'})] });
    return input;
  }
  it('does not validate the old photo when selection and Continue share a tick', async () => {
    installReader();
    seedOrder({ ...identity, photoUrl: '', profileVisibilityConfirmed: true });
    await render('/order/identite');
    const input = fileInput();
    const next = Array.from(host.querySelectorAll('button')).find(b=>b.textContent?.trim().startsWith('Continuer'))!;
    await act(async () => { input.dispatchEvent(new Event('change', {bubbles:true})); next.click(); });
    await settle(125);
    expect(route()).toBe('/order/identite');
  });
  it('does not apply a late file after a same-UID sign-out/sign-in', async () => {
    const getReader = installReader();
    seedOrder({ ...identity, photoUrl: '', profileVisibilityConfirmed: true });
    await render('/order/identite');
    const input = fileInput();
    await act(async()=> input.dispatchEvent(new Event('change', {bubbles:true})));
    await act(async()=> { for (const listener of mocks.authListeners) { listener('SIGNED_OUT', null); listener('SIGNED_IN', {user}); } });
    await act(async()=> getReader()?.onload?.({target:{result:freshPhoto}}));
    const state = JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!);
    expect(state.identityDraft?.photoUrl ?? state.digitalIdentity?.photoUrl).not.toBe(freshPhoto);
  });
  it('releases fields after reading and requires fresh confirmation for the selected photo', async () => {
    const getReader = installReader();
    seedOrder({ ...identity, photoUrl: '', profileVisibilityConfirmed: true });
    await render('/order/identite');
    const input = fileInput();
    await act(async () => input.dispatchEvent(new Event('change', { bubbles: true })));
    expect(host.querySelector('fieldset')?.disabled).toBe(true);
    await act(async () => getReader()?.onload?.({ target: { result: freshPhoto } }));
    expect(host.querySelector('fieldset')?.disabled).toBe(false);
    expect(host.querySelector<HTMLInputElement>('#profile-profileVisibilityConfirmed')?.checked).toBe(false);
    await click('Continuer');
    expect(route()).toBe('/order/identite');
    await fill('#profile-firstName', 'Modifiable');
    const saved = JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!);
    expect(saved.digitalIdentity).toBeNull();
    expect(saved.identityDraft).toMatchObject({ firstName: 'Modifiable', photoUrl: freshPhoto, profileVisibilityConfirmed: false });
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it('validates the newest identity draft when editing and Continue share a tick', async () => {
    seedOrder({ ...identity, photoUrl: '', profileVisibilityConfirmed: true });
    await render('/order/identite');
    const input = host.querySelector<HTMLInputElement>('#profile-firstName')!;
    const next = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.trim().startsWith('Continuer'))!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      next.click();
    });
    expect(route()).toBe('/order/identite');
    expect(JSON.parse(sessionStorage.getItem('orderFunnelStateV2')!).digitalIdentity).toBeNull();
    expect(mocks.insertCard).not.toHaveBeenCalled();
  });
  it('validates the newest Express draft when editing and Continue share a tick', async () => {
    seedExpress({ ...delivery, publishNameOnly: true });
    await render('/express/infos');
    const input = host.querySelector<HTMLInputElement>('input[placeholder="Prénom"]')!;
    const next = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.trim().startsWith('Continuer'))!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      next.click();
    });
    expect(route()).toBe('/express/infos');
    expect(JSON.parse(sessionStorage.getItem('expressCheckoutState')!).customerInfo).toBeNull();
    expect(mocks.insertOrder).not.toHaveBeenCalled();
  });

});
