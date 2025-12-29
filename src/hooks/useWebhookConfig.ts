import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface WebhookConfig {
  id: string;
  user_id: string;
  name: string;
  webhook_url: string;
  provider: "zapier" | "make" | "hubspot" | "notion" | "n8n" | "custom";
  enabled: boolean;
  sync_consented_only: boolean;
  retry_count: number;
  field_mapping: {
    name: boolean;
    email: boolean;
    phone: boolean;
    company: boolean;
    score: boolean;
    source: boolean;
    consent_status: boolean;
    timestamp: boolean;
    card_owner: boolean;
    actions: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  webhook_config_id: string | null;
  lead_id: string | null;
  user_id: string;
  event_type: string;
  status: "pending" | "success" | "failed" | "retrying";
  attempts: number;
  last_attempt_at: string | null;
  response_status: number | null;
  error_message: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface CreateWebhookConfigData {
  name: string;
  webhook_url: string;
  provider: WebhookConfig["provider"];
  enabled?: boolean;
  sync_consented_only?: boolean;
  retry_count?: number;
  field_mapping?: Partial<WebhookConfig["field_mapping"]>;
}

// Fetch all webhook configs for the current user
export function useWebhookConfigs() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["webhook-configs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhook_configs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WebhookConfig[];
    },
    enabled: !!user,
  });
}

// Create a new webhook config
export function useCreateWebhookConfig() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (config: CreateWebhookConfigData) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("webhook_configs")
        .insert({
          user_id: user.id,
          ...config,
          field_mapping: config.field_mapping || {
            name: true,
            email: true,
            phone: true,
            company: true,
            score: true,
            source: true,
            consent_status: true,
            timestamp: true,
            card_owner: true,
            actions: true,
          },
        })
        .select()
        .single();

      if (error) throw error;
      return data as WebhookConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] });
      toast.success("Intégration CRM ajoutée");
    },
    onError: (error) => {
      console.error("Error creating webhook config:", error);
      toast.error("Erreur lors de la création");
    },
  });
}

// Update a webhook config
export function useUpdateWebhookConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<WebhookConfig> & { id: string }) => {
      const { data, error } = await supabase
        .from("webhook_configs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as WebhookConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] });
      toast.success("Configuration mise à jour");
    },
    onError: (error) => {
      console.error("Error updating webhook config:", error);
      toast.error("Erreur lors de la mise à jour");
    },
  });
}

// Delete a webhook config
export function useDeleteWebhookConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("webhook_configs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhook-configs"] });
      toast.success("Intégration supprimée");
    },
    onError: (error) => {
      console.error("Error deleting webhook config:", error);
      toast.error("Erreur lors de la suppression");
    },
  });
}

// Fetch webhook logs
export function useWebhookLogs(limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["webhook-logs", user?.id, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webhook_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as WebhookLog[];
    },
    enabled: !!user,
  });
}

// Provider display info
export const PROVIDER_INFO: Record<
  WebhookConfig["provider"],
  { label: string; icon: string; color: string; description: string }
> = {
  zapier: {
    label: "Zapier",
    icon: "⚡",
    color: "text-orange-500",
    description: "Automatisation no-code",
  },
  make: {
    label: "Make",
    icon: "🔄",
    color: "text-purple-500",
    description: "Intégrations avancées",
  },
  hubspot: {
    label: "HubSpot",
    icon: "🟠",
    color: "text-orange-600",
    description: "CRM & Marketing",
  },
  notion: {
    label: "Notion",
    icon: "📝",
    color: "text-foreground",
    description: "Base de données",
  },
  n8n: {
    label: "n8n",
    icon: "🔧",
    color: "text-red-500",
    description: "Self-hosted automation",
  },
  custom: {
    label: "Custom Webhook",
    icon: "🔗",
    color: "text-blue-500",
    description: "URL personnalisée",
  },
};
