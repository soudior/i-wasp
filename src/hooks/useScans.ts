import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CardScan {
  id: string;
  card_id: string;
  scanned_at: string;
  user_agent: string | null;
  ip_address: string | null;
  referrer: string | null;
}

export interface ScanWithCard extends CardScan {
  digital_cards: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
}

export function useScans() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["scans", user?.id],
    queryFn: async (): Promise<ScanWithCard[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("card_scans" as any)
        .select(`
          *,
          digital_cards!inner(user_id, first_name, last_name)
        `)
        .eq("digital_cards.user_id", user.id)
        .order("scanned_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as unknown as ScanWithCard[];
    },
    enabled: !!user,
  });
}

export function useRecordScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string): Promise<void> => {
      const { error } = await supabase
        .from("card_scans" as any)
        .insert({
          card_id: cardId,
          user_agent: navigator.userAgent,
        } as any);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });
}
