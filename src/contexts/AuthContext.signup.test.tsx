/** Real AuthProvider contract with a synthetic, non-network Supabase client. */
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ signUp: vi.fn(), invoke: vi.fn(), unsubscribe: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: mocks.unsubscribe } } }),
    getSession: async () => ({ data: { session: null } }), signUp: mocks.signUp,
  }, functions: { invoke: mocks.invoke },
} }));
import { AuthProvider, useAuth } from './AuthContext';
let auth: ReturnType<typeof useAuth>;
let root: Root;
let host: HTMLDivElement;
function Probe() { auth = useAuth(); return null; }
beforeEach(async () => {
  vi.clearAllMocks(); Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden'); }));
  host = document.createElement('div'); document.body.append(host); root = createRoot(host);
  await act(async () => root.render(<QueryClientProvider client={new QueryClient()}><AuthProvider><Probe /></AuthProvider></QueryClientProvider>));
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); });
describe('AuthProvider signup confirmation contract', () => {
  it('reports required email confirmation when no authenticated session exists', async () => {
    mocks.signUp.mockResolvedValue({ data: { user: { id: 'synthetic-user' }, session: null }, error: null });
    const result = await auth.signUp('qa-only@example.invalid', 'Synthetic-only-000!', 'Camille', 'Test');
    expect(result).toEqual({ error: null, requiresEmailConfirmation: true });
    expect(mocks.signUp).toHaveBeenCalledWith({ email: 'qa-only@example.invalid', password: 'Synthetic-only-000!', options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { first_name: 'Camille', last_name: 'Test' } } });
  });
  it('reports an immediately usable session without changing the existing error contract', async () => {
    mocks.signUp.mockResolvedValue({ data: { session: { user: { id: 'synthetic-user' } } }, error: null });
    expect(await auth.signUp('qa-only@example.invalid', 'Synthetic-only-000!')).toEqual({ error: null, requiresEmailConfirmation: false });
  });
  it('preserves signup errors for existing consumers', async () => {
    const error = new Error('Synthetic signup error'); mocks.signUp.mockResolvedValue({ data: { session: null }, error });
    expect(await auth.signUp('qa-only@example.invalid', 'Synthetic-only-000!')).toEqual({ error, requiresEmailConfirmation: false });
  });
});
