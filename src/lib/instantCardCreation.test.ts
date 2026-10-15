import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOrActivateInstantCard, type InstantCardApi, type InstantCardIdentity } from './instantCardCreation';

const saved = { id: 'fixture-card', slug: 'fixture-slug', user_id: 'fixture-admin' };
const active = { ...saved, is_active: true, nfc_enabled: true, wallet_enabled: true };
const values = { user_id: saved.user_id, slug: saved.slug, first_name: 'Commerce fictif', last_name: '' };
let api: InstantCardApi;
let current: boolean;
let retained: InstantCardIdentity | null;
let onInserted: ReturnType<typeof vi.fn>;
const run = (existing: InstantCardIdentity | null = null) => createOrActivateInstantCard({
  api, values, existing, isCurrent: () => current, onInserted,
});
beforeEach(() => {
  current = true; retained = null;
  onInserted = vi.fn((card: InstantCardIdentity) => { retained = card; });
  api = {
    insert: vi.fn().mockResolvedValue({ data: saved, error: null }),
    activate: vi.fn().mockResolvedValue({ data: null, error: null }),
    read: vi.fn().mockResolvedValue({ data: active, error: null }),
  };
});

describe('Instant admin card creation, synthetic DB only', () => {
  it('omits protected flags entirely, including false input, then activates and verifies', async () => {
    const result = await createOrActivateInstantCard({ api, values: { ...values, nfc_enabled: false, wallet_enabled: false }, existing: null, isCurrent: () => true, onInserted });
    expect(result).toEqual(saved);
    expect(api.insert).toHaveBeenCalledWith(values);
    const inserted = vi.mocked(api.insert).mock.calls[0][0];
    expect(Object.prototype.hasOwnProperty.call(inserted, 'nfc_enabled')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(inserted, 'wallet_enabled')).toBe(false);
    expect(api.activate).toHaveBeenCalledWith(saved.id);
    expect(api.read).toHaveBeenCalledWith(saved.id, saved.user_id);
    expect(onInserted).toHaveBeenCalledBefore(vi.mocked(api.activate));
  });
  it.each([null, {}, [], 'ignored', [{ ...active }]])('does not depend on RPC return data %j', async data => {
    vi.mocked(api.activate).mockResolvedValue({ data, error: null } as { error: unknown });
    expect(await run()).toEqual(saved); expect(api.read).toHaveBeenCalledTimes(1);
  });
  it('retains identity after activation fails and retries without a duplicate insert', async () => {
    vi.mocked(api.activate).mockResolvedValueOnce({ error: new Error('synthetic denied') });
    await expect(run()).rejects.toThrow('activation a échoué'); expect(retained).toEqual(saved);
    expect(api.read).not.toHaveBeenCalled();
    expect(await run(retained)).toEqual(saved); expect(api.insert).toHaveBeenCalledTimes(1); expect(api.activate).toHaveBeenCalledTimes(2);
  });
  it.each(['is_active', 'nfc_enabled', 'wallet_enabled'])('rejects unconfirmed persisted %s flag and retains identity', async field => {
    vi.mocked(api.read).mockResolvedValue({ data: { ...active, [field]: false }, error: null });
    await expect(run()).rejects.toThrow('activation n’est pas confirmée'); expect(retained).toEqual(saved);
  });
  it('retains identity after read failure, with no duplicate on retry', async () => {
    vi.mocked(api.read).mockResolvedValueOnce({ data: null, error: new Error('synthetic offline') });
    await expect(run()).rejects.toThrow('activation n’est pas confirmée');
    expect(await run(retained)).toEqual(saved); expect(api.insert).toHaveBeenCalledTimes(1);
  });
  it('never activates when insert fails', async () => {
    vi.mocked(api.insert).mockResolvedValue({ data: null, error: new Error('synthetic RLS') });
    await expect(run()).rejects.toThrow('création'); expect(api.activate).not.toHaveBeenCalled(); expect(retained).toBeNull();
  });
  it('ignores a completed insert after cancellation without activating it', async () => {
    vi.mocked(api.insert).mockImplementation(async () => { current = false; return { data: saved, error: null }; });
    expect(await run()).toBeNull(); expect(api.activate).not.toHaveBeenCalled(); expect(onInserted).not.toHaveBeenCalled();
  });
  it('ignores a completed activation after cancellation without a read', async () => {
    vi.mocked(api.activate).mockImplementation(async () => { current = false; return { error: null }; });
    expect(await run()).toBeNull(); expect(api.read).not.toHaveBeenCalled();
  });
  it('refuses a pending card belonging to another account', async () => {
    await expect(run({ ...saved, user_id: 'other-fixture' })).rejects.toThrow('compte');
    expect(api.insert).not.toHaveBeenCalled(); expect(api.activate).not.toHaveBeenCalled();
  });
  it('refuses the wrong persisted card even when its flags are active', async () => {
    vi.mocked(api.read).mockResolvedValue({ data: { ...active, id: 'wrong-fixture' }, error: null });
    await expect(run()).rejects.toThrow('activation n’est pas confirmée');
  });
  it('does nothing for an already cancelled operation', async () => {
    current = false; expect(await run()).toBeNull(); expect(api.insert).not.toHaveBeenCalled();
  });
});
