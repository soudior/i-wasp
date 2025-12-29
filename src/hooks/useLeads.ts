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
  message: string | null;
  consent_given: boolean;
  consent_timestamp: string | null;
  source: string | null;
  device_type: string | null;
  location_city: string | null;
  location_country: string | null;
  lead_score: number;
  status: string;
  created_at: string;
}

export interface LeadWithCard extends Lead {
  digital_cards: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
}

export interface CreateLeadData {
  card_id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  notes?: string;
  consent_given?: boolean;
  source?: string;
  device_type?: string;
}

// Calculate lead score based on data provided
function calculateLeadScore(data: CreateLeadData): number {
  let score = 0;
  if (data.email) score += 10;
  if (data.phone) score += 15;
  if (data.message) score += 10;
  if (data.company) score += 5;
  if (data.name) score += 5;
  return score;
}

// Detect device type from user agent
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  return "Other";
}

export function useLeads() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["leads", user?.id],
    queryFn: async (): Promise<LeadWithCard[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("leads" as any)
        .select(`
          *,
          digital_cards!inner(user_id, first_name, last_name)
        `)
        .eq("digital_cards.user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as LeadWithCard[];
    },
    enabled: !!user,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLeadData): Promise<Lead> => {
      const leadScore = calculateLeadScore(data);
      const deviceType = getDeviceType();
      
      const { data: lead, error } = await supabase
        .from("leads" as any)
        .insert({
          card_id: data.card_id,
          name: data.name || null,
          email: data.email || null,
          phone: data.phone || null,
          company: data.company || null,
          message: data.message || null,
          notes: data.notes || null,
          consent_given: data.consent_given ?? true,
          consent_timestamp: data.consent_given ? new Date().toISOString() : null,
          source: data.source || "nfc",
          device_type: data.device_type || deviceType,
          lead_score: leadScore,
          status: "new",
        } as any)
        .select()
        .single();

      if (error) throw error;
      return lead as unknown as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Coordonnées partagées avec succès !");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }): Promise<void> => {
      const { error } = await supabase
        .from("leads" as any)
        .update({ status } as any)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Statut mis à jour");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
