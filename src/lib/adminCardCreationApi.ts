import { supabase } from '@/integrations/supabase/client';
import type { InstantCardApi } from './instantCardCreation';

/** The existing admin-only RPC is verified through a separate owner-scoped read. */
export const adminCardCreationApi: InstantCardApi = {
  insert: values => supabase.from('digital_cards').insert([values]).select('id,slug,user_id').single(),
  // The production RPC is not represented in the generated schema. Its return data is ignored.
  activate: id => (supabase as unknown as {
    rpc: (name: 'admin_set_card_lifecycle', params: {
      p_card_id: string; p_is_active: boolean; p_nfc_enabled: boolean; p_wallet_enabled: boolean;
    }) => PromiseLike<{ error: unknown }>;
  }).rpc('admin_set_card_lifecycle', {
    p_card_id: id, p_is_active: true, p_nfc_enabled: true, p_wallet_enabled: true,
  }),
  read: (id, userId) => supabase.from('digital_cards')
    .select('id,slug,user_id,is_active,nfc_enabled,wallet_enabled')
    .eq('id', id).eq('user_id', userId).single(),
};
