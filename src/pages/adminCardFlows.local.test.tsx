/**
 * Local-only interaction coverage for both remaining admin creation surfaces.
 * Auth, Supabase, subscriptions, queries and media are synthetic. Network fails closed.
 */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  user: { id: 'fixture-admin' } as { id: string } | null,
  insert: vi.fn(), read: vi.fn(), rpc: vi.fn(), unsubscribe: vi.fn(),
  upload: vi.fn(), publicUrl: vi.fn(), signUp: vi.fn(), invalidate: vi.fn(),
  subscriptionRead: vi.fn(), subscriptionInsert: vi.fn(), subscriptionUpdate: vi.fn(),
  authChanged: null as null | ((event: string, session: { user: { id: string } } | null) => void),
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));
vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('@/components/AdminGuard', () => ({ AdminGuard: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/layouts/AdminOmniaLayout', () => ({ AdminOmniaLayout: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/lib/templateRegistry', () => ({
  getAllTemplates: () => [{ id: 'signature', name: 'Synthetic template', visibility: 'public' }],
  getVisibilityLabel: () => 'Synthetic', getVisibilityColor: () => '',
}));
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [] }),
  useQueryClient: () => ({ invalidateQueries: mocks.invalidate }),
}));
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: { div: ({ children }: { children: React.ReactNode }) => <div>{children}</div> },
}));
vi.mock('qrcode.react', () => ({ QRCodeSVG: () => <svg aria-label="Synthetic QR" /> }));
vi.mock('sonner', () => ({ toast: mocks.toast }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  rpc: mocks.rpc,
  auth: {
    signUp: mocks.signUp,
    onAuthStateChange: (callback: typeof mocks.authChanged) => {
      mocks.authChanged = callback;
      return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
    },
  },
  storage: { from: () => ({ upload: mocks.upload, getPublicUrl: mocks.publicUrl }) },
  from: (table: string) => {
    if (table === 'digital_cards') {
      const filters: unknown[][] = [];
      let selected: unknown;
      const query = {
        insert: (values: unknown) => ({ select: () => ({ single: () => mocks.insert(values) }) }),
        select: (columns: unknown) => { selected = columns; return query; },
        eq: (...args: unknown[]) => { filters.push(args); return query; },
        single: () => mocks.read(filters, selected),
        maybeSingle: () => mocks.read(filters, selected),
      };
      return query;
    }
    if (table === 'subscriptions') {
      const filters: unknown[][] = [];
      const query = {
        select: () => query,
        eq: (...args: unknown[]) => { filters.push(args); return query; },
        maybeSingle: () => mocks.subscriptionRead(filters),
        insert: (values: unknown) => mocks.subscriptionInsert(values),
        update: (values: unknown) => ({ eq: (...args: unknown[]) => mocks.subscriptionUpdate(values, args) }),
      };
      return query;
    }
    throw new Error(`Unexpected synthetic table: ${table}`);
  },
} }));

import AdminCreator from './AdminCreator';
import AdminCardGenerator from './AdminCardGenerator';

const card = { id: 'fixture-card', slug: 'fixture-business', user_id: 'fixture-admin' };
const active = { ...card, is_active: true, nfc_enabled: true, wallet_enabled: true };
const lifecycleArgs = {
  p_card_id: card.id, p_is_active: true, p_nfc_enabled: true, p_wallet_enabled: true,
};
const pages = [
  { name: 'AdminCreator', Component: AdminCreator, createText: 'Créer carte Admin', firstInput: '#firstName', creator: true },
  { name: 'AdminCardGenerator', Component: AdminCardGenerator, createText: 'Créer la carte', firstInput: 'input[placeholder="Ex: Le Jardin Gourmand"]', creator: false },
];
type Page = typeof pages[number];
let host: HTMLDivElement;
let root: Root;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(r => { resolve = r; });
  return { promise, resolve };
}
const render = async ({ Component }: Page) => {
  await act(async () => root.render(<MemoryRouter><Component /></MemoryRouter>));
};
const findButton = (label: string | RegExp) => Array.from(host.querySelectorAll('button')).find(button => {
  const text = button.textContent ?? '';
  return typeof label === 'string' ? text.includes(label) : label.test(text);
});
const button = (label: string | RegExp) => {
  const found = findButton(label);
  if (!found) throw new Error(`Button not found: ${String(label)}`);
  return found;
};
const click = async (label: string | RegExp, twice = false) => {
  await act(async () => { const target = button(label); target.click(); if (twice) target.click(); });
};
const fill = async (selector: string, value: string) => {
  const input = host.querySelector<HTMLInputElement>(selector);
  if (!input) throw new Error(`Input not found: ${selector}`);
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};
const prepare = async (page: Page) => {
  await render(page);
  await fill(page.firstInput, 'Synthetic');
  if (page.creator) await fill('#lastName', 'Fixture');
  else { await click('Continuer'); await click('Continuer'); await click('Continuer'); }
};
const retry = () => click(/Réessayer l.activation/i);
const expectNoSuccess = () => {
  expect(mocks.toast.success).not.toHaveBeenCalled();
  expect(Array.from(host.querySelectorAll('h2')).some(h => /Carte créée/.test(h.textContent ?? ''))).toBe(false);
  expect(mocks.invalidate).not.toHaveBeenCalled();
  expect(mocks.subscriptionRead).not.toHaveBeenCalled();
  expect(mocks.subscriptionInsert).not.toHaveBeenCalled();
  expect(mocks.subscriptionUpdate).not.toHaveBeenCalled();
};
const expectSuccess = (page: Page) => {
  expect(mocks.toast.success).toHaveBeenCalledTimes(1);
  expect(Array.from(host.querySelectorAll('h2')).some(h => /Carte créée/.test(h.textContent ?? ''))).toBe(true);
  if (page.creator) {
    expect(mocks.subscriptionRead).toHaveBeenCalledExactlyOnceWith([['user_id', card.user_id]]);
    expect(mocks.subscriptionInsert).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      user_id: card.user_id, plan: 'premium', status: 'active', price_cents: 0,
    }));
  } else {
    expect(mocks.invalidate).toHaveBeenCalledTimes(1);
    expect(mocks.subscriptionRead).not.toHaveBeenCalled();
  }
};
const expectEmptyForm = (page: Page) => {
  expect(host.querySelector<HTMLInputElement>(page.firstInput)?.value).toBe('');
  expect(findButton(/Réessayer l.activation/i)).toBeUndefined();
};

beforeEach(() => {
  vi.resetAllMocks();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mocks.user = { id: card.user_id };
  mocks.authChanged = null;
  mocks.insert.mockResolvedValue({ data: card, error: null });
  mocks.rpc.mockResolvedValue({ data: null, error: null });
  mocks.read.mockResolvedValue({ data: active, error: null });
  mocks.subscriptionRead.mockResolvedValue({ data: null, error: null });
  mocks.subscriptionInsert.mockResolvedValue({ data: null, error: null });
  mocks.subscriptionUpdate.mockResolvedValue({ data: null, error: null });
  mocks.upload.mockResolvedValue({ error: null });
  mocks.publicUrl.mockReturnValue({ data: { publicUrl: 'https://fixture.invalid/image.png' } });
  mocks.signUp.mockResolvedValue({ data: { user: { id: 'fixture-customer' } }, error: null });
  mocks.invalidate.mockResolvedValue(undefined);
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden in local card-flow tests'); }));
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe.each(pages)('$name local creation flow', page => {
  it('locks same-tick submissions, omits protected flags and waits for RPC plus scoped persisted readback', async () => {
    const inserted = deferred<{ data: typeof card; error: null }>();
    const activated = deferred<{ data: unknown; error: null }>();
    const verified = deferred<{ data: typeof active; error: null }>();
    mocks.insert.mockReturnValue(inserted.promise);
    mocks.rpc.mockReturnValue(activated.promise);
    mocks.read.mockReturnValue(verified.promise);
    await prepare(page);
    await click(page.createText, true);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).not.toHaveBeenCalled();
    const payload = mocks.insert.mock.calls[0][0][0];
    expect(payload).toMatchObject({ user_id: card.user_id });
    expect(Object.prototype.hasOwnProperty.call(payload, 'nfc_enabled')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(payload, 'wallet_enabled')).toBe(false);
    expectNoSuccess();
    await act(async () => inserted.resolve({ data: card, error: null }));
    expect(mocks.rpc).toHaveBeenCalledExactlyOnceWith('admin_set_card_lifecycle', lifecycleArgs);
    expect(mocks.read).not.toHaveBeenCalled();
    expectNoSuccess();
    // An arbitrary legacy RPC shape is intentionally not the activation source of truth.
    await act(async () => activated.resolve({ data: { unrelated: 'synthetic return' }, error: null }));
    expect(mocks.read).toHaveBeenCalledTimes(1);
    expect(mocks.read.mock.calls[0][0]).toEqual([['id', card.id], ['user_id', card.user_id]]);
    expect(String(mocks.read.mock.calls[0][1]).split(',').map(field => field.trim())).toEqual(expect.arrayContaining(['is_active', 'nfc_enabled', 'wallet_enabled']));
    expectNoSuccess();
    await act(async () => verified.resolve({ data: active, error: null }));
    expectSuccess(page);
  });

  it.each(['returned error', 'rejected promise'])('retains its pending card after RPC %s and retries without reinserting', async failure => {
    if (failure === 'returned error') mocks.rpc.mockResolvedValueOnce({ data: null, error: new Error('Synthetic RPC failure') });
    else mocks.rpc.mockRejectedValueOnce(new Error('Synthetic RPC rejection'));
    await prepare(page);
    await click(page.createText);
    expect(mocks.read).not.toHaveBeenCalled();
    expectNoSuccess();
    expect(button(/Réessayer l.activation/i).disabled).toBe(false);
    expect(host.querySelector('fieldset')?.disabled).toBe(true);
    await retry();
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expect(mocks.rpc.mock.calls[1]).toEqual(['admin_set_card_lifecycle', lifecycleArgs]);
    expectSuccess(page);
  });

  it.each(['is_active', 'nfc_enabled', 'wallet_enabled'])('rejects unconfirmed persisted %s and retries the original card', async flag => {
    mocks.read.mockResolvedValueOnce({ data: { ...active, [flag]: false }, error: null });
    await prepare(page);
    await click(page.createText);
    expectNoSuccess();
    await retry();
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.read).toHaveBeenCalledTimes(2);
    expectSuccess(page);
  });

  it.each(['read error', 'missing row', 'wrong owner', 'wrong ID'])('keeps activation pending after %s', async failure => {
    const data = failure === 'missing row' ? null : {
      ...active,
      ...(failure === 'wrong owner' ? { user_id: 'different-fixture-owner' } : {}),
      ...(failure === 'wrong ID' ? { id: 'different-fixture-card' } : {}),
    };
    mocks.read.mockResolvedValueOnce({ data, error: failure === 'read error' ? new Error('Synthetic read failure') : null });
    await prepare(page);
    await click(page.createText);
    expectNoSuccess();
    await retry();
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expectSuccess(page);
  });

  it('blocks same-tick retry clicks while the existing card is being activated', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: null, error: new Error('Synthetic failure') });
    await prepare(page);
    await click(page.createText);
    const pending = deferred<{ data: null; error: null }>();
    mocks.rpc.mockReturnValueOnce(pending.promise);
    await click(/Réessayer l.activation/i, true);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expectNoSuccess();
    await act(async () => pending.resolve({ data: null, error: null }));
    expectSuccess(page);
  });

  it('discards an old-account insertion, resets the form and never activates it', async () => {
    const pending = deferred<{ data: typeof card; error: null }>();
    mocks.insert.mockReturnValue(pending.promise);
    await prepare(page);
    await click(page.createText);
    mocks.user = { id: 'second-fixture-admin' };
    await render(page);
    await act(async () => pending.resolve({ data: card, error: null }));
    expect(mocks.rpc).not.toHaveBeenCalled();
    expectNoSuccess();
    expectEmptyForm(page);
  });

  it('drops pending card identity when the current account changes', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: null, error: new Error('Synthetic activation failure') });
    await prepare(page);
    await click(page.createText);
    expect(button(/Réessayer l.activation/i)).toBeDefined();
    mocks.user = { id: 'second-fixture-admin' };
    await render(page);
    expectEmptyForm(page);
    expectNoSuccess();
  });

  it('ignores an old-account RPC result without starting readback', async () => {
    const pending = deferred<{ data: null; error: null }>();
    mocks.rpc.mockReturnValue(pending.promise);
    await prepare(page);
    await click(page.createText);
    mocks.user = null;
    await render(page);
    await act(async () => pending.resolve({ data: null, error: null }));
    expect(mocks.read).not.toHaveBeenCalled();
    expectNoSuccess();
    expectEmptyForm(page);
  });

  it('ignores an old-account readback without success, cache invalidation or subscription work', async () => {
    const pending = deferred<{ data: typeof active; error: null }>();
    mocks.read.mockReturnValue(pending.promise);
    await prepare(page);
    await click(page.createText);
    mocks.user = { id: 'second-fixture-admin' };
    await render(page);
    await act(async () => pending.resolve({ data: active, error: null }));
    expectNoSuccess();
    expectEmptyForm(page);
  });

  it('cancels on the auth event before a changed account can render', async () => {
    const pending = deferred<{ data: typeof card; error: null }>();
    mocks.insert.mockReturnValue(pending.promise);
    await prepare(page);
    await click(page.createText);
    expect(mocks.authChanged).toBeTypeOf('function');
    await act(async () => {
      mocks.authChanged!('SIGNED_OUT', null);
      pending.resolve({ data: card, error: null });
    });
    expect(mocks.rpc).not.toHaveBeenCalled();
    expectNoSuccess();
  });

  it('resets after batched sign-out/sign-in of the same account and rejects the prior insert', async () => {
    const pending = deferred<{ data: typeof card; error: null }>();
    mocks.insert.mockReturnValueOnce(pending.promise);
    await prepare(page);
    await click(page.createText);
    await act(async () => {
      mocks.authChanged!('SIGNED_OUT', null);
      mocks.authChanged!('SIGNED_IN', { user: { id: card.user_id } });
    });
    await act(async () => pending.resolve({ data: card, error: null }));
    expect(mocks.rpc).not.toHaveBeenCalled();
    expectNoSuccess();
    expectEmptyForm(page);
    await prepare(page);
    expect(button(page.createText).disabled).toBe(false);
    await click(page.createText);
    expect(mocks.insert).toHaveBeenCalledTimes(2);
    expectSuccess(page);
  });

  it('rejects a same-tick retry after sign-out/sign-in before the pending card reset commits', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: null, error: new Error('Synthetic initial activation failure') });
    await prepare(page);
    await click(page.createText);
    const oldRetry = button(/Réessayer l.activation/i);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expectNoSuccess();
    await act(async () => {
      mocks.authChanged!('SIGNED_OUT', null);
      mocks.authChanged!('SIGNED_IN', { user: { id: card.user_id } });
      // The old button still exists here, before React commits the account reset.
      oldRetry.click();
    });
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
    expect(mocks.read).not.toHaveBeenCalled();
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expectNoSuccess();
    expectEmptyForm(page);
    await prepare(page);
    expect(button(page.createText).disabled).toBe(false);
    await click(page.createText);
    expect(mocks.insert).toHaveBeenCalledTimes(2);
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expectSuccess(page);
  });

  it.each(['insert', 'RPC', 'readback'])('does not continue an outstanding %s after unmount', async stage => {
    const pending = deferred<{ data: typeof active; error: null }>();
    if (stage === 'insert') mocks.insert.mockReturnValue(pending.promise);
    else if (stage === 'RPC') mocks.rpc.mockReturnValue(pending.promise);
    else mocks.read.mockReturnValue(pending.promise);
    await prepare(page);
    await click(page.createText);
    await act(async () => root.render(<div>Closed</div>));
    await act(async () => pending.resolve({ data: active, error: null }));
    if (stage === 'insert') expect(mocks.rpc).not.toHaveBeenCalled();
    if (stage !== 'readback') expect(mocks.read).not.toHaveBeenCalled();
    expectNoSuccess();
    expect(mocks.unsubscribe).toHaveBeenCalled();
  });
});

describe('AdminCreator subscription continuation', () => {
  it('upgrades an existing subscription only after the card is verified active', async () => {
    const pending = deferred<{ data: typeof active; error: null }>();
    mocks.read.mockReturnValue(pending.promise);
    mocks.subscriptionRead.mockResolvedValue({ data: { id: 'fixture-subscription' }, error: null });
    await prepare(pages[0]);
    await click(pages[0].createText);
    expectNoSuccess();
    await act(async () => pending.resolve({ data: active, error: null }));
    expect(mocks.subscriptionInsert).not.toHaveBeenCalled();
    expect(mocks.subscriptionUpdate).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      plan: 'premium', status: 'active', notes: 'Carte créée par Admin',
    }), ['user_id', card.user_id]);
    expect(mocks.toast.success).toHaveBeenCalledTimes(1);
  });

  it('does not start a subscription write after account change during its lookup', async () => {
    const pending = deferred<{ data: null; error: null }>();
    mocks.subscriptionRead.mockReturnValue(pending.promise);
    await prepare(pages[0]);
    await click(pages[0].createText);
    expect(mocks.subscriptionRead).toHaveBeenCalledTimes(1);
    expect(mocks.toast.success).not.toHaveBeenCalled();
    mocks.user = { id: 'second-fixture-admin' };
    await render(pages[0]);
    await act(async () => pending.resolve({ data: null, error: null }));
    expect(mocks.subscriptionInsert).not.toHaveBeenCalled();
    expect(mocks.subscriptionUpdate).not.toHaveBeenCalled();
    expect(mocks.toast.success).not.toHaveBeenCalled();
    expectEmptyForm(pages[0]);
  });
});

const prepareNewCustomer = async () => {
  await prepare(pages[0]);
  await act(async () => {
    const tab = button('Nouveau client');
    tab.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, ctrlKey: false }));
    tab.click();
  });
  await fill('#newEmail', 'customer@fixture.invalid');
  await fill('#newPassword', 'Synthetic-only-password');
};

describe('AdminCreator synthetic new-account continuation', () => {
  const customerCard = { ...card, user_id: 'fixture-customer' };
  const customerActive = { ...active, user_id: 'fixture-customer' };

  it('creates and verifies the customer-owned card before assigning its premium subscription', async () => {
    const pending = deferred<{ data: typeof customerActive; error: null }>();
    mocks.insert.mockResolvedValue({ data: customerCard, error: null });
    mocks.read.mockReturnValue(pending.promise);
    await prepareNewCustomer();
    await click('Créer compte + carte', true);
    expect(mocks.signUp).toHaveBeenCalledTimes(1);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.insert.mock.calls[0][0][0]).toMatchObject({ user_id: 'fixture-customer' });
    expect(mocks.insert.mock.calls[0][0][0]).not.toHaveProperty('nfc_enabled');
    expect(mocks.insert.mock.calls[0][0][0]).not.toHaveProperty('wallet_enabled');
    expect(mocks.rpc).toHaveBeenCalledExactlyOnceWith('admin_set_card_lifecycle', lifecycleArgs);
    expect(mocks.read.mock.calls[0][0]).toEqual([['id', card.id], ['user_id', 'fixture-customer']]);
    expectNoSuccess();
    await act(async () => pending.resolve({ data: customerActive, error: null }));
    expect(mocks.subscriptionInsert).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
      user_id: 'fixture-customer', plan: 'premium', status: 'active',
    }));
    expect(mocks.toast.success).toHaveBeenCalledExactlyOnceWith('Compte + carte créés ✓');
  });

  it('retries customer activation without creating a second account or card', async () => {
    mocks.insert.mockResolvedValue({ data: customerCard, error: null });
    mocks.read.mockResolvedValue({ data: customerActive, error: null });
    mocks.rpc.mockResolvedValueOnce({ data: null, error: new Error('Synthetic customer activation failure') });
    await prepareNewCustomer();
    await click('Créer compte + carte');
    expectNoSuccess();
    await retry();
    expect(mocks.signUp).toHaveBeenCalledTimes(1);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expect(mocks.rpc.mock.calls[1]).toEqual(['admin_set_card_lifecycle', lifecycleArgs]);
    expect(mocks.subscriptionInsert).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ user_id: 'fixture-customer' }));
    expect(mocks.toast.success).toHaveBeenCalledExactlyOnceWith('Compte + carte créés ✓');
  });

  it('retains successful signup after an insert failure without signing up again on retry', async () => {
    mocks.insert.mockResolvedValueOnce({ data: null, error: new Error('Synthetic customer insert failure') });
    mocks.insert.mockResolvedValue({ data: customerCard, error: null });
    mocks.read.mockResolvedValue({ data: customerActive, error: null });
    await prepareNewCustomer();
    await click('Créer compte + carte');
    expectNoSuccess();
    expect(mocks.rpc).not.toHaveBeenCalled();
    await click('Créer compte + carte');
    expect(mocks.signUp).toHaveBeenCalledTimes(1);
    expect(mocks.insert).toHaveBeenCalledTimes(2);
    expect(mocks.toast.success).toHaveBeenCalledExactlyOnceWith('Compte + carte créés ✓');
  });

  it.each(['account event', 'unmount'])('does not insert after a stale signup caused by %s', async interruption => {
    const pending = deferred<{ data: { user: { id: string } }; error: null }>();
    mocks.signUp.mockReturnValue(pending.promise);
    await prepareNewCustomer();
    await click('Créer compte + carte');
    if (interruption === 'account event') {
      await act(async () => mocks.authChanged!('SIGNED_IN', { user: { id: 'fixture-customer' } }));
    } else {
      await act(async () => root.render(<div>Closed</div>));
    }
    await act(async () => pending.resolve({ data: { user: { id: 'fixture-customer' } }, error: null }));
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
    expectNoSuccess();
  });
});

const prepareMedia = async (page: Page) => {
  await render(page);
  await fill(page.firstInput, 'Synthetic');
  if (page.creator) await fill('#lastName', 'Fixture');
  else await click('Continuer');
};
const mediaInput = (index = 0) => {
  const input = host.querySelectorAll<HTMLInputElement>('input[type="file"]')[index];
  if (!input) throw new Error(`Media input not found: ${index}`);
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [new File(['synthetic-media'], `fixture-${index}.png`, { type: 'image/png' })],
  });
  return input;
};
const dispatchUpload = (input: HTMLInputElement) => input.dispatchEvent(new Event('change', { bubbles: true }));
const mediaUrl = 'https://fixture.invalid/image.png';

describe.each(pages)('$name local media concurrency', page => {
  it('allows only one same-tick upload across photo and logo, then creates with its completed media', async () => {
    const pending = deferred<{ error: null }>();
    mocks.upload.mockReturnValue(pending.promise);
    await prepareMedia(page);
    const first = mediaInput(0);
    const second = mediaInput(1);
    await act(async () => {
      dispatchUpload(first);
      dispatchUpload(first);
      dispatchUpload(second);
    });
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    expect(mocks.publicUrl).not.toHaveBeenCalled();
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.toast.success).not.toHaveBeenCalled();
    await act(async () => pending.resolve({ error: null }));
    expect(mocks.publicUrl).toHaveBeenCalledTimes(1);
    expect(mocks.toast.success).toHaveBeenCalledTimes(1);
    expect(host.querySelector(`img[src="${mediaUrl}"]`)).not.toBeNull();
    mocks.toast.success.mockClear();
    if (!page.creator) { await click('Continuer'); await click('Continuer'); }
    await click(page.createText);
    expect(mocks.insert.mock.calls[0][0][0]).toMatchObject(page.creator
      ? { photo_url: mediaUrl }
      : { logo_url: mediaUrl, photo_url: mediaUrl });
    expectSuccess(page);
  });

  it('blocks creation when upload and create/navigation are triggered before React commits the busy state', async () => {
    const pending = deferred<{ error: null }>();
    mocks.upload.mockReturnValue(pending.promise);
    await prepareMedia(page);
    const input = mediaInput();
    const action = button(page.creator ? page.createText : 'Continuer');
    await act(async () => {
      dispatchUpload(input);
      action.click();
      // The generator uploads only on its visual step. Rapid navigation may reach
      // Design before the busy state renders, but cannot create a card during upload.
      if (!page.creator) action.click();
    });
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(mocks.toast.success).not.toHaveBeenCalled();
    const busyAction = action;
    expect(busyAction.disabled).toBe(true);
    await act(async () => busyAction.click());
    expect(mocks.insert).not.toHaveBeenCalled();
    await act(async () => pending.resolve({ error: null }));
    mocks.toast.success.mockClear();
    // If navigation was synchronously blocked, advance normally after the upload.
    if (!page.creator) {
      for (let step = 0; step < 2 && !findButton(page.createText); step += 1) await click('Continuer');
    }
    expect(button(page.createText).disabled).toBe(false);
    await click(page.createText);
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expectSuccess(page);
  });

  it.each(['account render', 'auth event', 'unmount'])('discards late media after %s without form edits or success', async interruption => {
    const pending = deferred<{ error: null }>();
    mocks.upload.mockReturnValue(pending.promise);
    await prepareMedia(page);
    const input = mediaInput();
    await act(async () => dispatchUpload(input));
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    if (interruption === 'account render') {
      mocks.user = { id: 'second-fixture-admin' };
      await render(page);
    } else if (interruption === 'auth event') {
      await act(async () => {
        mocks.authChanged!('SIGNED_OUT', null);
        mocks.authChanged!('SIGNED_IN', { user: { id: card.user_id } });
      });
    } else {
      await act(async () => root.render(<div>Closed</div>));
    }
    await act(async () => pending.resolve({ error: null }));
    expect(mocks.publicUrl).not.toHaveBeenCalled();
    expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(mocks.toast.error).not.toHaveBeenCalled();
    expect(host.querySelector(`img[src="${mediaUrl}"]`)).toBeNull();
    if (interruption !== 'unmount') expectEmptyForm(page);
  });

  it.each(['returned error', 'rejected promise'])('releases the media lock after %s and permits another upload', async failure => {
    if (failure === 'returned error') mocks.upload.mockResolvedValueOnce({ error: new Error('Synthetic storage failure') });
    else mocks.upload.mockRejectedValueOnce(new Error('Synthetic storage rejection'));
    await prepareMedia(page);
    const first = mediaInput();
    await act(async () => dispatchUpload(first));
    expect(mocks.toast.error).toHaveBeenCalledTimes(1);
    expect(mocks.toast.success).not.toHaveBeenCalled();
    expect(mocks.publicUrl).not.toHaveBeenCalled();
    expect(host.querySelector('fieldset')?.disabled).toBe(false);
    const retryInput = mediaInput();
    await act(async () => dispatchUpload(retryInput));
    expect(mocks.upload).toHaveBeenCalledTimes(2);
    expect(mocks.publicUrl).toHaveBeenCalledTimes(1);
    expect(mocks.toast.success).toHaveBeenCalledTimes(1);
    expect(host.querySelector(`img[src="${mediaUrl}"]`)).not.toBeNull();
  });
});
