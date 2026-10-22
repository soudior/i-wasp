/** Local React interaction tests. All account, order and Wallet services are mocked. */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  user: null as null | { id: string; email: string },
  signUp: vi.fn(), googleSignin: vi.fn(), appleSignin: vi.fn(), navigate: vi.fn(), getUser: vi.fn(), getSession: vi.fn(),
  maybeSingle: vi.fn(), insertCard: vi.fn(), invoke: vi.fn(),
  apple: vi.fn(), google: vi.fn(), createOrder: vi.fn(), markComplete: vi.fn(),
  authListeners: new Set<(event: string, session: { user: { id: string } } | null) => void>(),
  rpc: vi.fn(), readOrder: vi.fn(), insertExpressOrder: vi.fn(), findSubscription: vi.fn(), insertSubscription: vi.fn(), updateSubscription: vi.fn(), signIn: vi.fn(),
  trackPurchase: vi.fn(), resetCheckout: vi.fn(),
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));
const orderState = vi.hoisted(() => ({
  currentStep: 6, selectedOffer: 'essentiel', selectedTemplate: 'signature', isTransitioning: false,
  digitalIdentity: { clientType: 'particulier', profileVisibilityConfirmed: true, firstName: 'Camille', lastName: 'Test', email: '', phone: '', tagline: 'Fiction uniquement' },
  cardPersonalization: { visualType: 'photo', imageUrl: '', fileName: 'soft-touch' },
  shippingInfo: { address: '1 rue fictive', city: 'Ville fictive', phone: '0000000000', country: 'Maroc' },
}));
const expressState = vi.hoisted(() => ({
  selectedOffer: 'essentiel', paymentMethod: 'cod',
  customerInfo: { publishNameOnly: true, firstName: 'Camille', lastName: 'Test', email: 'qa-only@example.invalid', phone: '0000000000', address: '1 rue fictive', city: 'Ville fictive' },
}));
vi.mock('@/contexts/ExpressCheckoutContext', () => ({
  EXPRESS_OFFERS: [{ id: 'essentiel', name: 'Essentielle', price: 19900 }],
  useExpressCheckout: () => ({ state: expressState, setPaymentMethod: vi.fn(), markComplete: mocks.markComplete, resetCheckout: mocks.resetCheckout, canAccessStep: () => true }),
}));
vi.mock('@/hooks/useAnalyticsEvents', () => ({ useExpressCheckoutTracking: () => ({ trackPurchase: mocks.trackPurchase }) }));
vi.mock('react-router-dom', async importOriginal => ({ ...await importOriginal<typeof import('react-router-dom')>(), useNavigate: () => mocks.navigate, useParams: () => ({ slug: 'synthetic-only' }) }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: mocks.user, signUp: mocks.signUp, signIn: mocks.signIn, loading: false }) }));
vi.mock('@/hooks/useAppleAuth', () => ({ useAppleAuth: () => ({ loading: false, signInWithApple: mocks.appleSignin }) }));
vi.mock('@/lib/nativeOAuth', () => ({ signInWithGoogleCrossPlatform: mocks.googleSignin }));
vi.mock('@/lib/walletService', () => ({ addToAppleWallet: mocks.apple, addToGoogleWallet: mocks.google }));
vi.mock('@/contexts/OrderFunnelContext', () => ({
  OFFERS: [{ id: 'essentiel', name: 'Essentielle', price: 19900, priceCurrency: 'MAD' }],
  useOrderFunnel: () => ({ state: orderState, prevStep: vi.fn(), markComplete: mocks.markComplete, setPaymentInfo: vi.fn() }),
  OrderFunnelGuard: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/hooks/useOrders', () => ({ useCreateOrder: () => ({ mutateAsync: mocks.createOrder }) }));
vi.mock('@/components/order/OrderLoader', () => ({ OrderLoader: () => <div role="status">Préparation simulée</div> }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getUser: mocks.getUser, getSession: mocks.getSession,
    onAuthStateChange: (listener: (event: string, session: { user: { id: string } } | null) => void) => {
      mocks.authListeners.add(listener);
      return { data: { subscription: { unsubscribe: () => mocks.authListeners.delete(listener) } } };
    },
  }, functions: { invoke: mocks.invoke }, rpc: mocks.rpc,
  from: (table: string) => {
    if (table === 'orders') {
      const orders = { select: () => orders, eq: () => orders, single: () => mocks.readOrder() };
      return orders;
    }
    if (table === 'subscriptions') {
      const subscriptions = {
        select: () => subscriptions, eq: () => subscriptions, maybeSingle: mocks.findSubscription,
        insert: mocks.insertSubscription, update: (values: unknown) => ({ eq: (field: string, value: string) => mocks.updateSubscription(values, field, value) }),
      };
      return subscriptions;
    }
    if (table !== 'digital_cards') throw new Error(`Unexpected mock table ${table}`);
    const query = { select: () => query, eq: () => query, maybeSingle: mocks.maybeSingle, insert: mocks.insertCard };
    return query;
  },
} }));
vi.mock('sonner', () => ({ toast: mocks.toast }));

import WalletPassDownload from './WalletPassDownload';
import Signup from './Signup';
import OrderRecap from './order/OrderRecap';
import ExpressPayer from './express/ExpressPayer';

let host: HTMLDivElement;
let root: Root;
const fakeUser = { id: '00000000-0000-4000-8000-000000000001', email: 'qa-only@example.invalid' };
const fakeCard = { id: '00000000-0000-4000-8000-000000000002', slug: 'synthetic-only', first_name: 'Camille', last_name: 'Test' };
const fakeOrder = { id: '00000000-0000-4000-8000-000000000003' };
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
function paymentFailure() {
  return Promise.resolve({ data: null, error: new Error('Synthetic payment failure') });
}
const render = async (component: React.ReactNode) => { await act(async () => root.render(<MemoryRouter>{component}</MemoryRouter>)); };
function button(name: string) { const node = Array.from(host.querySelectorAll('button')).find(b => b.textContent?.trim().includes(name)); if (!node) throw new Error(`Button not found: ${name}`); return node; }
const click = async (name: string, twice = false) => { await act(async () => { const node = button(name); node.click(); if (twice) node.click(); }); };
const fill = async (selector: string, value: string) => {
  const input = host.querySelector<HTMLInputElement>(selector)!;
  if (!input) throw new Error(`Input not found: ${selector}`);
  await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); });
};
const fillSignup = async () => {
  await fill('input[placeholder="Jean"]', 'Camille'); await fill('input[placeholder="Dupont"]', 'Test fictif');
  await fill('input[type=email]', 'qa-only@example.invalid'); await fill('input[type=password]', 'FictionalOnly-000!');
};
const submit = async (twice = false) => { await act(async () => { const form = host.querySelector('form')!; form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); if (twice) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); };
beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mocks.user = null;
  mocks.authListeners.clear();
  expressState.paymentMethod = 'cod'; expressState.customerInfo.publishNameOnly = true;
  mocks.insertExpressOrder.mockResolvedValue({ data: fakeOrder, error: null });
  mocks.findSubscription.mockResolvedValue({ data: null, error: null });
  mocks.insertSubscription.mockResolvedValue({ error: null }); mocks.updateSubscription.mockResolvedValue({ error: null });
  mocks.googleSignin.mockResolvedValue('error'); mocks.appleSignin.mockResolvedValue(false);
  mocks.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null });
  mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mocks.maybeSingle.mockResolvedValue({ data: fakeCard, error: null });
  mocks.insertCard.mockResolvedValue({ error: null });
  mocks.invoke.mockResolvedValue({ data: { success: true }, error: null });
  mocks.apple.mockResolvedValue(false); mocks.google.mockResolvedValue(false);
  mocks.signUp.mockResolvedValue({ error: null, requiresEmailConfirmation: true });
  mocks.createOrder.mockResolvedValue(fakeOrder);
  mocks.rpc.mockResolvedValue({ data: fakeOrder.id, error: null });
  mocks.readOrder.mockResolvedValue({ data: { id: fakeOrder.id, order_number: '26100001', total_price_cents: 2900, currency: 'EUR' }, error: null });
  sessionStorage.clear();
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  // No network call is allowed, even if a new dependency escapes a module mock.
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden in synthetic interaction tests'); }));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); });

describe('Wallet interactions, synthetic services only', () => {
  it('never issues a pass on visit or without a logged-in owner', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null }); await render(<WalletPassDownload />);
    expect(mocks.getUser).not.toHaveBeenCalled(); expect(mocks.apple).not.toHaveBeenCalled();
    await click('Ouvrir Apple Wallet'); expect(host.textContent).toContain('Connexion requise');
    expect(mocks.maybeSingle).not.toHaveBeenCalled(); expect(mocks.apple).not.toHaveBeenCalled();
  });
  it('abandons a pending owner lookup when the Wallet page closes', async () => {
    const pending = deferred<{ data: { user: typeof fakeUser }; error: null }>(); mocks.getUser.mockReturnValue(pending.promise);
    await render(<WalletPassDownload />); await click('Ouvrir Apple Wallet'); await render(<div>Accueil</div>);
    await act(async () => pending.resolve({ data: { user: fakeUser }, error: null }));
    expect(mocks.apple).not.toHaveBeenCalled(); expect(mocks.maybeSingle).not.toHaveBeenCalled();
  });
  it('aborts a pending provider request when the Wallet page closes', async () => {
    const pending = deferred<boolean>(); mocks.apple.mockReturnValue(pending.promise);
    await render(<WalletPassDownload />); await click('Ouvrir Apple Wallet');
    const signal = mocks.apple.mock.calls[0][2] as AbortSignal; expect(signal.aborted).toBe(false);
    await render(<div>Accueil</div>); expect(signal.aborted).toBe(true); await act(async () => pending.resolve(false));
  });
  it('does not issue a pass when the owned card is absent' , async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null }); await render(<WalletPassDownload />); await click('Ouvrir Google Wallet');
    expect(host.textContent).toContain('Carte introuvable'); expect(mocks.google).not.toHaveBeenCalled();
  });
  it('locks repeated clicks synchronously and unlocks after failure', async () => {
    const pending = deferred<{ data: { user: typeof fakeUser }; error: null }>(); mocks.getUser.mockReturnValue(pending.promise);
    await render(<WalletPassDownload />); await click('Ouvrir Apple Wallet', true);
    expect(mocks.getUser).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve({ data: { user: fakeUser }, error: null }));
    expect(mocks.apple).toHaveBeenCalledTimes(1); expect(button('Ouvrir Apple Wallet').disabled).toBe(false);
    await click('Ouvrir Apple Wallet'); expect(mocks.apple).toHaveBeenCalledTimes(2);
  });
});

describe('Signup interactions, no account created', () => {
  it('locks a repeated Google click and unlocks after its simulated failure', async () => {
    const pending = deferred<string>(); mocks.googleSignin.mockReturnValue(pending.promise);
    await render(<Signup />); await click('Continuer avec Google', true); expect(mocks.googleSignin).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve('error')); expect(button('Continuer avec Google').disabled).toBe(false);
  });
  it('locks a repeated Apple click', async () => {
    const pending = deferred<boolean>(); mocks.appleSignin.mockReturnValue(pending.promise);
    await render(<Signup />); await click("S'inscrire avec Apple", true); expect(mocks.appleSignin).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve(false));
  });
  it('associates every input with its visible label' , async () => {
    await render(<Signup />); expect(Array.from(host.querySelectorAll('input')).filter(input => !input.labels?.length).map(input => input.type)).toEqual([]);
  });
  it('rejects a short password without calling signup', async () => {
    await render(<Signup />); await fillSignup(); await fill('input[type=password]', '123'); await submit();
    expect(mocks.signUp).not.toHaveBeenCalled(); expect(mocks.toast.error).toHaveBeenCalledWith('Le mot de passe doit contenir au moins 6 caractères');
  });
  it('locks repeated submissions and permits retry after a handled error', async () => {
    const pending = deferred<{ error: Error }>(); mocks.signUp.mockReturnValue(pending.promise);
    await render(<Signup />); await fillSignup(); await submit(true); expect(mocks.signUp).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve({ error: new Error('User already registered') }));
    expect(mocks.toast.error).toHaveBeenCalledWith('Cet email est déjà utilisé'); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(button('Créer mon compte').disabled).toBe(false); await submit(); expect(mocks.signUp).toHaveBeenCalledTimes(2);
  });
  it('unlocks after an unexpected signup rejection and preserves the entered values', async () => {
    mocks.signUp.mockRejectedValueOnce(new Error('Synthetic transport failure'));
    await render(<Signup />); await fillSignup(); await submit();
    expect(button('Créer mon compte').disabled).toBe(false);
    expect(host.querySelector<HTMLInputElement>('input[type=email]')?.value).toBe('qa-only@example.invalid');
    await submit(); expect(mocks.signUp).toHaveBeenCalledTimes(2);
  });
  it('does not redirect or send a welcome request after signup was dismissed', async () => {
    const pending = deferred<{ error: null; requiresEmailConfirmation: boolean }>(); mocks.signUp.mockReturnValue(pending.promise);
    await render(<Signup />); await fillSignup(); await submit(); await render(<div>Accueil</div>);
    await act(async () => pending.resolve({ error: null, requiresEmailConfirmation: false }));
    expect(mocks.navigate).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    await render(<Signup />); expect(button('Créer mon compte').disabled).toBe(false);
  });
  it('enters onboarding for an authenticated signup even if the welcome email fails', async () => {
    mocks.signUp.mockResolvedValue({ error: null, requiresEmailConfirmation: false }); mocks.invoke.mockRejectedValue(new Error('Synthetic email failure'));
    await render(<Signup />); await fillSignup(); await submit();
    expect(mocks.navigate).toHaveBeenCalledWith('/onboarding'); expect(mocks.toast.success).toHaveBeenCalledWith('Compte créé avec succès !');
    expect(mocks.toast.error).not.toHaveBeenCalled();
  });
  it('waits for email confirmation instead of claiming a logged-in account' , async () => {
    await render(<Signup />); await fillSignup(); await submit();
    expect(host.textContent).toMatch(/Vérifiez votre (boîte mail|email)/i);
    expect(mocks.navigate).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
  });
});

describe('Order checkout interactions, no remote orders/payments', () => {
  it('keeps the funnel in place and asks for an inline login', async () => {
    await render(<OrderRecap />); await click('Payer 29 €');
    expect(host.textContent).toContain('Connectez-vous pour finaliser votre commande');
    expect(mocks.navigate).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled(); expect(mocks.signUp).not.toHaveBeenCalled();
  });
  it('locks same-tick confirmation to a single authoritative COD order', async () => {
    mocks.user = fakeUser;
    await render(<OrderRecap />); await click('Paiement à la livraison'); await click('Confirmer ma commande', true);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledWith('prepare_nfc_order', expect.objectContaining({
      p_offer_id: 'essentiel', p_payment_method: 'cod', p_order: expect.objectContaining({ currency: 'EUR' }),
    }));
    expect(mocks.insertCard).not.toHaveBeenCalled(); expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.invoke).not.toHaveBeenCalled(); expect(mocks.markComplete).toHaveBeenCalledTimes(1);
  });
  it('stops before payment when order preparation fails', async () => {
    mocks.user = fakeUser; mocks.rpc.mockRejectedValue(new Error('Synthetic order error'));
    await render(<OrderRecap />); await click('Payer 29 €');
    expect(mocks.readOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(button('Payer 29 €').disabled).toBe(false);
  });
  it('retries a failed payment with the order id only', async () => {
    mocks.user = fakeUser; mocks.invoke.mockImplementation(paymentFailure);
    await render(<OrderRecap />); await click('Payer 29 €'); await click('Payer 29 €');
    expect(mocks.rpc).toHaveBeenCalledTimes(1); expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(mocks.invoke).toHaveBeenLastCalledWith('create-nfc-payment', { body: { orderId: fakeOrder.id } });
    expect(Object.keys(mocks.invoke.mock.calls[0][1].body)).toEqual(['orderId']);
    expect(mocks.markComplete).not.toHaveBeenCalled();
  });
  it('does not continue into order creation after the recap was dismissed', async () => {
    mocks.user = fakeUser; const pending = deferred<{ data: string; error: null }>(); mocks.rpc.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Payer 29 €'); await render(<div>Accueil</div>);
    await act(async () => pending.resolve({ data: fakeOrder.id, error: null }));
    expect(mocks.readOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
  });
  it('does not continue into payment after an in-flight order finishes on a dismissed recap', async () => {
    mocks.user = fakeUser; const pending = deferred<{ data: { id: string; order_number: string; total_price_cents: number; currency: string }; error: null }>();
    mocks.readOrder.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Payer 29 €'); await render(<div>Accueil</div>);
    await act(async () => pending.resolve({ data: { id: fakeOrder.id, order_number: '26100001', total_price_cents: 2900, currency: 'EUR' }, error: null }));
    expect(mocks.invoke).not.toHaveBeenCalled(); expect(mocks.navigate).not.toHaveBeenCalled();
  });
  it('never reuses another user’s successful writes after the authenticated user changes', async () => {
    mocks.user = fakeUser; mocks.invoke.mockImplementation(paymentFailure);
    await render(<OrderRecap />); await click('Payer 29 €');
    mocks.user = { id: '00000000-0000-4000-8000-000000000099', email: 'other-qa@example.invalid' };
    await render(<OrderRecap />); await click('Payer 29 €');
    expect(mocks.rpc).toHaveBeenCalledTimes(2); expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(mocks.rpc.mock.calls[1][1].p_card.firstName).toBe('Camille');
  });
  it('retries a failed order preparation', async () => {
    mocks.user = fakeUser; mocks.rpc.mockRejectedValueOnce(new Error('Synthetic order error'));
    await render(<OrderRecap />); await click('Paiement à la livraison'); await click('Confirmer ma commande'); await click('Confirmer ma commande');
    expect(mocks.rpc).toHaveBeenCalledTimes(2); expect(mocks.markComplete).toHaveBeenCalledTimes(1); expect(mocks.insertCard).not.toHaveBeenCalled();
  });
});


describe('Customer account cancellation, synthetic services only', () => {
  it('stops recap after an in-flight prepare when the authenticated account changes', async () => {
    mocks.user = fakeUser;
    const pending = deferred<{ data: string; error: null }>(); mocks.rpc.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Payer 29 €');
    mocks.user = { id: 'other-synthetic-user', email: 'other@example.invalid' };
    await render(<OrderRecap />);
    await act(async () => pending.resolve({ data: fakeOrder.id, error: null }));
    expect(mocks.readOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.toast.success).not.toHaveBeenCalled();
  });
  it('stops recap at a signout/signin boundary even when the resulting user ID is unchanged', async () => {
    mocks.user = fakeUser;
    const pending = deferred<{ data: string; error: null }>(); mocks.rpc.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Payer 29 €');
    await act(async () => {
      mocks.authListeners.forEach(listener => listener('SIGNED_OUT', null));
      mocks.authListeners.forEach(listener => listener('SIGNED_IN', { user: fakeUser }));
      pending.resolve({ data: fakeOrder.id, error: null });
    });
    expect(mocks.readOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(button('Payer 29 €').disabled).toBe(false);
  });
});

describe('Express checkout, synthetic services only', () => {
  it('prepares one COD order through the server and does not grant the subscription itself', async () => {
    mocks.user = fakeUser; await render(<ExpressPayer />); await click('Confirmer · 29 €', true);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.rpc.mock.calls[0][1]).toMatchObject({
      p_offer_id: 'essentiel', p_payment_method: 'cod', p_card: { firstName: 'Camille', lastName: 'Test' },
    });
    expect(mocks.rpc.mock.calls[0][1].p_order.currency).toBe('EUR');
    expect(mocks.insertCard).not.toHaveBeenCalled(); expect(mocks.insertSubscription).not.toHaveBeenCalled();
    expect(mocks.markComplete).toHaveBeenCalledTimes(1); expect(mocks.navigate).toHaveBeenCalledWith('/express/succes');
    expect(button('Traitement...').disabled).toBe(true);
  });
  it.each(['returned', 'rejected'])('stops all later writes and success on a %s prepare error, then unlocks', async kind => {
    mocks.user = fakeUser;
    if (kind === 'returned') mocks.rpc.mockResolvedValue({ data: null, error: new Error('Synthetic prepare rejection') });
    else mocks.rpc.mockRejectedValue(new Error('Synthetic transport failure'));
    await render(<ExpressPayer />); await click('Confirmer · 29 €');
    expect(mocks.findSubscription).not.toHaveBeenCalled(); expect(mocks.insertSubscription).not.toHaveBeenCalled();
    expect(mocks.readOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.markComplete).not.toHaveBeenCalled(); expect(mocks.trackPurchase).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(button('Confirmer · 29 €').disabled).toBe(false);
  });
  it('retries a failed read without a second prepare and locks same-tick clicks', async () => {
    mocks.user = fakeUser;
    mocks.readOrder.mockRejectedValueOnce(new Error('Synthetic order failure'));
    await render(<ExpressPayer />); await click('Confirmer · 29 €', true); await click('Confirmer · 29 €');
    expect(mocks.rpc).toHaveBeenCalledTimes(1); expect(mocks.readOrder).toHaveBeenCalledTimes(2); expect(mocks.markComplete).toHaveBeenCalledTimes(1);
  });
  it('retries payment with the saved order id only', async () => {
    mocks.user = fakeUser; expressState.paymentMethod = 'stripe';
    mocks.invoke.mockImplementation(paymentFailure);
    await render(<ExpressPayer />); await click('Payer 29 €'); await click('Payer 29 €');
    expect(mocks.rpc).toHaveBeenCalledTimes(1); expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(mocks.invoke).toHaveBeenLastCalledWith('create-nfc-payment', { body: { orderId: fakeOrder.id } });
    expect(mocks.insertCard).not.toHaveBeenCalled(); expect(mocks.markComplete).not.toHaveBeenCalled();
  });
  it('keeps contact details off the card when publication is declined', async () => {
    mocks.user = fakeUser; expressState.customerInfo.publishNameOnly = false;
    await render(<ExpressPayer />); await click('Confirmer · 29 €');
    expect(mocks.insertCard).not.toHaveBeenCalled();
    expect(mocks.rpc.mock.calls[0][1].p_card.email).toBe('');
    expect(mocks.rpc.mock.calls[0][1].p_card.phone).toBe('');
    expect(mocks.rpc.mock.calls[0][1].p_card.firstName).toBe('Camille');
  });
  it('asks a guest to sign in before any order exists', async () => {
    await render(<ExpressPayer />); await click('Confirmer · 29 €');
    expect(host.textContent).toContain('Connectez-vous pour finaliser votre commande');
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.insertCard).not.toHaveBeenCalled(); expect(mocks.findSubscription).not.toHaveBeenCalled();
  });
  it.each(['unmount', 'account change', 'signout/signin'])('abandons a pending prepare after %s', async reason => {
    mocks.user = fakeUser;
    const pending = deferred<{ data: string; error: null }>(); mocks.rpc.mockReturnValue(pending.promise);
    await render(<ExpressPayer />); await click('Confirmer · 29 €', true); expect(mocks.rpc).toHaveBeenCalledTimes(1);
    if (reason === 'unmount') await render(<div>Accueil</div>);
    if (reason === 'account change') { mocks.user = { id: 'other-synthetic-user', email: 'other@example.invalid' }; await render(<ExpressPayer />); }
    if (reason === 'signout/signin') await act(async () => {
      mocks.authListeners.forEach(listener => listener('SIGNED_OUT', null));
      mocks.authListeners.forEach(listener => listener('SIGNED_IN', { user: fakeUser }));
    });
    await act(async () => pending.resolve({ data: fakeOrder.id, error: null }));
    expect(mocks.readOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.markComplete).not.toHaveBeenCalled(); expect(mocks.toast.success).not.toHaveBeenCalled();
  });
  it('does not launch payment when an order resolves after its checkout was dismissed', async () => {
    mocks.user = fakeUser; expressState.paymentMethod = 'stripe';
    const pending = deferred<{ data: { id: string; order_number: string; total_price_cents: number; currency: string }; error: null }>();
    mocks.readOrder.mockReturnValue(pending.promise);
    await render(<ExpressPayer />); await click('Payer 29 €'); await render(<div>Accueil</div>);
    await act(async () => pending.resolve({ data: { id: fakeOrder.id, order_number: '26100001', total_price_cents: 2900, currency: 'EUR' }, error: null }));
    expect(mocks.invoke).not.toHaveBeenCalled(); expect(mocks.markComplete).not.toHaveBeenCalled();
  });
});
