import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Lead {
  id: string;
  card_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateLeadData {
  card_id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export function useLeads() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("leads")
        .select(`
          *,
          digital_cards!inner(user_id, first_name, last_name)
        `)
        .eq("digital_cards.user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Lead & { digital_cards: { user_id: string; first_name: string; last_name: string } })[];
    },
    enabled: !!user,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLeadData) => {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return lead as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Information partagée avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
