import type { Database } from '@/integrations/supabase/types';

type CardInsert = Database['public']['Tables']['digital_cards']['Insert'];
export type InstantCardIdentity = { id: string; slug: string; user_id: string };
export type InstantCardLifecycle = InstantCardIdentity & {
  is_active: boolean;
  nfc_enabled: boolean;
  wallet_enabled: boolean;
};
type Result<T> = { data: T | null; error: unknown };

export interface InstantCardApi {
  insert: (values: CardInsert) => PromiseLike<Result<InstantCardIdentity>>;
  activate: (id: string) => PromiseLike<{ error: unknown }>;
  read: (id: string, userId: string) => PromiseLike<Result<InstantCardLifecycle>>;
}

/** Create once, then activate through the existing admin-only RPC and verify persisted flags.
 * The RPC's return shape is intentionally ignored. No privileges or policies are changed.
 */
export async function createOrActivateInstantCard({ api, values, existing, isCurrent, onInserted }: {
  api: InstantCardApi;
  values: CardInsert;
  existing: InstantCardIdentity | null;
  isCurrent: () => boolean;
  onInserted: (card: InstantCardIdentity) => void;
}): Promise<InstantCardIdentity | null> {
  if (!isCurrent()) return null;
  let card = existing;
  if (card && card.user_id !== values.user_id) throw new Error('Le compte a changé.');
  if (!card) {
    // Protected columns must be absent, including explicit false values. Database defaults apply.
    const insertValues = { ...values };
    delete insertValues.nfc_enabled;
    delete insertValues.wallet_enabled;
    const result = await api.insert(insertValues);
    if (!isCurrent()) return null;
    if (result.error) throw new Error('La création de la carte a échoué.');
    if (!result.data?.id || !result.data.slug || result.data.user_id !== values.user_id) {
      throw new Error('La carte créée n’a pas pu être confirmée.');
    }
    card = result.data;
    // Persist identity before activating so a failed RPC/read can be retried without INSERT.
    onInserted(card);
  }
  if (!isCurrent()) return null;
  const activation = await api.activate(card.id);
  if (!isCurrent()) return null;
  if (activation.error) throw new Error('La carte est enregistrée, mais son activation a échoué. Réessayez l’activation.');
  const verified = await api.read(card.id, values.user_id);
  if (!isCurrent()) return null;
  if (verified.error || !verified.data || verified.data.id !== card.id ||
      verified.data.user_id !== values.user_id || !verified.data.slug ||
      verified.data.is_active !== true || verified.data.nfc_enabled !== true ||
      verified.data.wallet_enabled !== true) {
    throw new Error('La carte est enregistrée, mais son activation n’est pas confirmée. Réessayez l’activation.');
  }
  return { id: verified.data.id, slug: verified.data.slug, user_id: verified.data.user_id };
}
