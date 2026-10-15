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
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));
const orderState = vi.hoisted(() => ({
  currentStep: 6, selectedOffer: 'essentiel', selectedTemplate: 'signature', isTransitioning: false,
  digitalIdentity: { clientType: 'particulier', profileVisibilityConfirmed: true, firstName: 'Camille', lastName: 'Test', email: '', phone: '', tagline: 'Fiction uniquement' },
  cardPersonalization: { visualType: 'photo', imageUrl: '', fileName: 'soft-touch' },
  shippingInfo: { address: '1 rue fictive', city: 'Ville fictive', phone: '0000000000', country: 'Maroc' },
}));
vi.mock('react-router-dom', async importOriginal => ({ ...await importOriginal<typeof import('react-router-dom')>(), useNavigate: () => mocks.navigate, useParams: () => ({ slug: 'synthetic-only' }) }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: mocks.user, signUp: mocks.signUp, loading: false }) }));
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
  auth: { getUser: mocks.getUser, getSession: mocks.getSession }, functions: { invoke: mocks.invoke },
  from: (table: string) => {
    if (table !== 'digital_cards') throw new Error(`Unexpected mock table ${table}`);
    const query = { select: () => query, eq: () => query, maybeSingle: mocks.maybeSingle, insert: mocks.insertCard };
    return query;
  },
} }));
vi.mock('sonner', () => ({ toast: mocks.toast }));

import WalletPassDownload from './WalletPassDownload';
import Signup from './Signup';
import OrderRecap from './order/OrderRecap';

let host: HTMLDivElement;
let root: Root;
const fakeUser = { id: '00000000-0000-4000-8000-000000000001', email: 'qa-only@example.invalid' };
const fakeCard = { id: '00000000-0000-4000-8000-000000000002', slug: 'synthetic-only', first_name: 'Camille', last_name: 'Test' };
const fakeOrder = { id: '00000000-0000-4000-8000-000000000003' };
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r; }); return { promise, resolve }; }
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
  mocks.googleSignin.mockResolvedValue('error'); mocks.appleSignin.mockResolvedValue(false);
  mocks.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null });
  mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mocks.maybeSingle.mockResolvedValue({ data: fakeCard, error: null });
  mocks.insertCard.mockResolvedValue({ error: null });
  mocks.invoke.mockResolvedValue({ data: { success: true }, error: null });
  mocks.apple.mockResolvedValue(false); mocks.google.mockResolvedValue(false);
  mocks.signUp.mockResolvedValue({ error: null, requiresEmailConfirmation: true });
  mocks.createOrder.mockResolvedValue(fakeOrder);
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
  it('preserves authentication requirement and avoids automatic signup', async () => {
    await render(<OrderRecap />); await click('Payer 199 MAD');
    expect(mocks.navigate).toHaveBeenCalledWith('/login?redirect=%2Forder%2Frecap');
    expect(mocks.insertCard).not.toHaveBeenCalled(); expect(mocks.createOrder).not.toHaveBeenCalled(); expect(mocks.signUp).not.toHaveBeenCalled();
  });
  it('locks same-tick confirmation to a single card and COD order', async () => {
    mocks.user = fakeUser; const pending = deferred<{ error: null }>(); mocks.insertCard.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Paiement à la livraison'); await click('Confirmer ma commande', true);
    expect(mocks.insertCard).toHaveBeenCalledTimes(1);
    await act(async () => pending.resolve({ error: null })); expect(mocks.createOrder).toHaveBeenCalledTimes(1);
    expect(mocks.createOrder.mock.calls[0][0]).toMatchObject({ total_price_cents: 19900, currency: 'MAD', payment_method: 'cod', user_id: fakeUser.id });
    expect(mocks.invoke).not.toHaveBeenCalled(); expect(mocks.markComplete).toHaveBeenCalledTimes(1);
    expect(mocks.insertCard.mock.calls[0][0].is_pro).toBeUndefined();
  });
  it('stops before creating an order when card creation fails', async () => {
    mocks.user = fakeUser; mocks.insertCard.mockResolvedValue({ error: new Error('Synthetic card error') });
    await render(<OrderRecap />); await click('Payer 199 MAD');
    expect(mocks.createOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
    expect(button('Payer 199 MAD').disabled).toBe(false);
  });
  it('retries a failed payment without duplicating card or order', async () => {
    mocks.user = fakeUser; mocks.invoke.mockResolvedValue({ error: new Error('Synthetic payment error'), data: null });
    await render(<OrderRecap />); await click('Payer 199 MAD'); await click('Payer 199 MAD');
    expect(mocks.invoke).toHaveBeenCalledTimes(2); expect(mocks.insertCard).toHaveBeenCalledTimes(1); expect(mocks.createOrder).toHaveBeenCalledTimes(1);
    expect(mocks.invoke).toHaveBeenLastCalledWith('create-nfc-payment', { body: { tierId: 'essentiel', orderId: fakeOrder.id, email: fakeUser.email } });
    expect(mocks.markComplete).not.toHaveBeenCalled();
  });
  it('does not continue into order creation after the recap was dismissed', async () => {
    mocks.user = fakeUser; const pending = deferred<{ error: null }>(); mocks.insertCard.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Payer 199 MAD'); await render(<div>Accueil</div>);
    await act(async () => pending.resolve({ error: null })); expect(mocks.createOrder).not.toHaveBeenCalled(); expect(mocks.invoke).not.toHaveBeenCalled();
  });
  it('does not continue into payment after an in-flight order finishes on a dismissed recap', async () => {
    mocks.user = fakeUser; const pending = deferred<typeof fakeOrder>(); mocks.createOrder.mockReturnValue(pending.promise);
    await render(<OrderRecap />); await click('Payer 199 MAD'); await render(<div>Accueil</div>);
    await act(async () => pending.resolve(fakeOrder)); expect(mocks.invoke).not.toHaveBeenCalled(); expect(mocks.navigate).not.toHaveBeenCalled();
  });
  it('never reuses another user’s successful writes after the authenticated user changes', async () => {
    mocks.user = fakeUser; mocks.invoke.mockResolvedValue({ error: new Error('Synthetic payment error'), data: null });
    await render(<OrderRecap />); await click('Payer 199 MAD'); mocks.user = { id: '00000000-0000-4000-8000-000000000099', email: 'other-qa@example.invalid' };
    await render(<OrderRecap />); await click('Payer 199 MAD'); expect(mocks.insertCard).toHaveBeenCalledTimes(2); expect(mocks.createOrder).toHaveBeenCalledTimes(2);
    expect(mocks.createOrder.mock.calls[1][0].user_id).toBe(mocks.user.id);
  });
  it('retries a failed order without duplicating its already-created card' , async () => {
    mocks.user = fakeUser; mocks.createOrder.mockRejectedValueOnce(new Error('Synthetic order error'));
    await render(<OrderRecap />); await click('Paiement à la livraison'); await click('Confirmer ma commande'); await click('Confirmer ma commande');
    expect(mocks.insertCard).toHaveBeenCalledTimes(1); expect(mocks.createOrder).toHaveBeenCalledTimes(2); expect(mocks.markComplete).toHaveBeenCalledTimes(1);
  });
});
