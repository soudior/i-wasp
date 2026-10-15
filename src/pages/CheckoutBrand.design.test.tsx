/** Presentation checks only. Auth, order, tracking and confetti services are mocked. */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { ExpressCheckoutProvider, EXPRESS_OFFERS } from '@/contexts/ExpressCheckoutContext';
import { CHECKOUT_BRAND } from '@/lib/checkoutBrandPalette';
import { BRAND } from '@/lib/brandPalette';
import ExpressOffre from './express/ExpressOffre';
import ExpressInfos from './express/ExpressInfos';
import ExpressPayer from './express/ExpressPayer';
import ExpressSucces from './express/ExpressSucces';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(), resetPasswordForEmail: vi.fn(), updateUser: vi.fn(),
  from: vi.fn(), invoke: vi.fn(), confetti: vi.fn(),
  trackOfferSelect: vi.fn(), trackInfoSubmit: vi.fn(), trackPurchase: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: {
    getSession: mocks.getSession,
    resetPasswordForEmail: mocks.resetPasswordForEmail,
    updateUser: mocks.updateUser,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
  from: mocks.from,
  functions: { invoke: mocks.invoke },
} }));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: null }) }));
vi.mock('@/hooks/useAnalyticsEvents', () => ({ useExpressCheckoutTracking: () => ({
  trackOfferSelect: mocks.trackOfferSelect, trackInfoSubmit: mocks.trackInfoSubmit, trackPurchase: mocks.trackPurchase,
}) }));
vi.mock('canvas-confetti', () => ({ default: mocks.confetti }));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

let host: HTMLDivElement;
let root: Root;
const customerInfo = {
  firstName: 'Camille', lastName: 'Exemple', email: 'qa-only@example.invalid',
  phone: '+212600000000', address: '1 rue fictive', city: 'Marrakech', publishNameOnly: false,
};
const renderPage = async (path: string) => {
  await act(async () => root.render(
    <MemoryRouter initialEntries={[path]}>
      <ExpressCheckoutProvider>
        <Routes>
          <Route path="/express/offre" element={<ExpressOffre />} />
          <Route path="/express/infos" element={<ExpressInfos />} />
          <Route path="/express/payer" element={<ExpressPayer />} />
          <Route path="/express/succes" element={<ExpressSucces />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </ExpressCheckoutProvider>
    </MemoryRouter>,
  ));
};
const seedCheckout = (selectedOffer: string | null = 'essentiel') => {
  sessionStorage.setItem('expressCheckoutState', JSON.stringify({ selectedOffer, customerInfo, paymentMethod: 'cod' }));
};
const inputValue = async (selector: string, value: string) => {
  const input = host.querySelector<HTMLInputElement>(selector)!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
const submit = async () => {
  await act(async () => { host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
};
const buttonWithText = (text: string) => [...host.querySelectorAll('button')].find(button => button.textContent?.includes(text))!;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.clearAllMocks();
  sessionStorage.clear();
  mocks.getSession.mockResolvedValue({ data: { session: null } });
  mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
  mocks.updateUser.mockResolvedValue({ error: null });
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden in presentation tests'); }));
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion'), media: query, onchange: null,
    addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

function luminance(hex: string) {
  const values = hex.slice(1).match(/.{2}/g)!.map(channel => parseInt(channel, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}

describe('isolated checkout brand', () => {
  it('uses brand colors with readable primary and secondary text', () => {
    expect(CHECKOUT_BRAND.background).toBe('#030303');
    expect(CHECKOUT_BRAND.accent).toBe('#DCC7B0');
    expect(CHECKOUT_BRAND.text).toBe('#FDFCFB');
    for (const color of [CHECKOUT_BRAND.text, CHECKOUT_BRAND.textMuted, CHECKOUT_BRAND.textSecondary]) {
      expect(contrast(color, CHECKOUT_BRAND.card)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(CHECKOUT_BRAND.background, CHECKOUT_BRAND.accent)).toBeGreaterThanOrEqual(7);
    expect(CHECKOUT_BRAND.success).toBe('#34C759');
    expect(CHECKOUT_BRAND.error).toBe('#FF3B30');
  });

  it.each(['/express/offre', '/express/infos', '/express/payer', '/express/succes'])('scopes %s without making a transaction on visit', async path => {
    seedCheckout();
    await renderPage(path);
    const page = host.querySelector<HTMLElement>('.brand-checkout');
    expect(page?.style.backgroundColor).toBe('rgb(3, 3, 3)');
    expect(host.querySelector('h1')?.textContent?.trim()).toBeTruthy();
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it('keeps offer values and the disabled/selected continue states', async () => {
    await renderPage('/express/offre');
    const continueButton = host.querySelector<HTMLButtonElement>('.checkout-action-bar button')!;
    expect(continueButton.disabled).toBe(true);
    for (const offer of EXPRESS_OFFERS) {
      expect(host.textContent).toContain(offer.name);
      expect(host.textContent).toContain(offer.priceDisplay);
    }
    await act(async () => buttonWithText('Professionnelle').click());
    expect(continueButton.disabled).toBe(false);
    expect(continueButton.textContent).toContain('349 MAD');
    expect(continueButton.style.backgroundColor).toBe('rgb(220, 199, 176)');
    expect(continueButton.style.color).toBe('rgb(3, 3, 3)');
    await act(async () => continueButton.click());
    expect(host.querySelector('h1')?.textContent).toBe('Où vous livrer ?');
  });

  it('associates every delivery input with its visible label', async () => {
    seedCheckout();
    await renderPage('/express/infos');
    const fields = {
      firstName: 'Prénom', lastName: 'Nom', phone: 'Téléphone WhatsApp',
      email: 'Email (pour le suivi)', city: 'Ville', address: 'Adresse de livraison',
    };
    expect(host.querySelectorAll('input:not([type="checkbox"])')).toHaveLength(6);
    for (const [field, labelText] of Object.entries(fields)) {
      const input = host.querySelector<HTMLInputElement>(`#express-${field}`)!;
      expect(input).not.toBeNull();
      expect(input.labels).toHaveLength(1);
      expect(input.labels?.[0].textContent?.trim()).toBe(labelText);
      expect(input.labels?.[0].htmlFor).toBe(input.id);
    }
  });

  it('preserves privacy choice, WhatsApp branding and dark city options', async () => {
    seedCheckout();
    await renderPage('/express/infos');
    const consent = host.querySelector<HTMLInputElement>('#express-publishNameOnly')!;
    expect(consent.checked).toBe(false);
    expect(host.textContent).toContain('Ils ne sont pas copiés sur votre profil public.');
    expect(host.querySelector('a[href="/order/offre"]')).not.toBeNull();
    expect(buttonWithText('Besoin d\'aide ? WhatsApp').style.color).toBe('rgb(37, 211, 102)');
    await inputValue('input[placeholder="Casablanca"]', 'Mar');
    expect(host.querySelector('.checkout-city-option')?.textContent).toBe('Marrakech');
    expect(host.querySelector('.hover\\:bg-gray-50')).toBeNull();
  });

  it('keeps both payment choices and dark foregrounds on selected champagne controls', async () => {
    seedCheckout();
    await renderPage('/express/payer');
    expect(buttonWithText('Paiement à la livraison')).toBeTruthy();
    expect(buttonWithText('Carte bancaire')).toBeTruthy();
    const primary = host.querySelector<HTMLButtonElement>('.checkout-action-bar button')!;
    expect(primary.textContent).toContain('Confirmer · 199 MAD');
    expect(primary.style.color).toBe('rgb(3, 3, 3)');
    await act(async () => buttonWithText('Carte bancaire').click());
    expect(primary.textContent).toContain('Payer 199 MAD');
    expect(buttonWithText('Carte bancaire').querySelector('svg')?.style.color).toBe('rgb(3, 3, 3)');
    expect(mocks.invoke).not.toHaveBeenCalled();
  });

  it('respects reduced motion for the success celebration', async () => {
    await renderPage('/express/succes');
    expect(mocks.confetti).not.toHaveBeenCalled();
    expect(host.querySelector('a[href="/"]')?.getAttribute('style')).toContain('color: rgb(3, 3, 3)');
  });

  it('keeps CSS opt-in and saved card color outside the presentation palette', () => {
    const css = readFileSync(`${process.cwd()}/src/styles/checkout-brand.css`, 'utf8');
    const payer = readFileSync(`${process.cwd()}/src/pages/express/ExpressPayer.tsx`, 'utf8');
    expect(css).not.toMatch(/(^|\n)\s*(?:body|html|:root)\s*\{/);
    expect(css).toContain('.brand-checkout');
    expect(css).toContain('.brand-recovery');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('env(safe-area-inset-bottom)');
    expect(css).toContain('prefers-reduced-motion');
    expect(payer).toContain('card_color: "#0B0B0B"');
    expect(BRAND.background).toBe(CHECKOUT_BRAND.background);
  });
});

describe('recovery presentation without auth changes', () => {
  it('keeps the labelled email form, login route and recovery destination', async () => {
    await renderPage('/forgot-password');
    expect(host.querySelector('.brand-recovery')).not.toBeNull();
    expect(host.querySelector('label[for="email"]')?.textContent).toContain('Adresse email');
    expect(host.querySelector('a[href="/login"]')).not.toBeNull();
    expect(host.querySelectorAll('button[type="submit"]')).toHaveLength(1);
    await inputValue('#email', 'qa-only@example.invalid');
    await submit();
    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith('qa-only@example.invalid', {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    expect(host.querySelector('h1')?.textContent).toBe('Email envoyé !');
    expect(host.querySelector('.brand-recovery')).not.toBeNull();
  });

  it('keeps reset loading and expired-link states on the scoped brand surface', async () => {
    let resolveSession!: (result: { data: { session: null } }) => void;
    mocks.getSession.mockReturnValue(new Promise(resolve => { resolveSession = resolve; }));
    await renderPage('/reset-password');
    expect(host.querySelector<HTMLElement>('.brand-recovery')?.style.backgroundColor).toBe('rgb(3, 3, 3)');
    expect(host.querySelector('form')).toBeNull();
    await act(async () => resolveSession({ data: { session: null } }));
    expect(host.querySelector('h1')?.textContent).toBe('Lien expiré');
    expect(host.querySelector('a.recovery-submit')?.getAttribute('href')).toBe('/forgot-password');
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it('preserves reset validation and does not submit a mismatched password', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'synthetic-only' } } } });
    await renderPage('/reset-password');
    expect(host.querySelector('.recovery-panel')).not.toBeNull();
    expect(host.querySelector('label[for="password"]')).not.toBeNull();
    expect(host.querySelector('label[for="confirmPassword"]')).not.toBeNull();
    expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
    await inputValue('#password', 'FictionalOnly-000!');
    await inputValue('#confirmPassword', 'FictionalOnly-111!');
    await submit();
    expect(host.textContent).toContain('Les mots de passe ne correspondent pas');
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
});
