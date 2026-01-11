/**
 * Hook to fetch push notification subscriber count for user's cards
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PushSubscribersData {
  total: number;
  byCard: Record<string, number>;
}

export function usePushSubscribers() {
  return useQuery({
    queryKey: ["push-subscribers"],
    queryFn: async (): Promise<PushSubscribersData> => {
      // Get all user's cards first
      const { data: cards, error: cardsError } = await supabase
        .from("digital_cards")
        .select("id");

      if (cardsError) throw cardsError;
      if (!cards || cards.length === 0) {
        return { total: 0, byCard: {} };
      }

      const cardIds = cards.map((c) => c.id);

      // Get active subscriptions for all user's cards
      const { data: subscriptions, error: subsError } = await supabase
        .from("push_subscriptions")
        .select("id, card_id")
        .in("card_id", cardIds)
        .eq("is_active", true);

      if (subsError) throw subsError;

      // Count by card
      const byCard: Record<string, number> = {};
      cardIds.forEach((id) => {
        byCard[id] = 0;
      });

      subscriptions?.forEach((sub) => {
        if (byCard[sub.card_id] !== undefined) {
          byCard[sub.card_id]++;
        }
      });

      return {
        total: subscriptions?.length || 0,
        byCard,
      };
    },
    staleTime: 30000, // 30 seconds
  });
}
