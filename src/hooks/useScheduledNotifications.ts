/**
 * Hook to manage scheduled push notifications
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScheduledNotification {
  id: string;
  card_id: string;
  title: string;
  body: string;
  scheduled_at: string;
  status: string;
  sent_at: string | null;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

export function useScheduledNotifications() {
  return useQuery({
    queryKey: ["scheduled-notifications"],
    queryFn: async (): Promise<ScheduledNotification[]> => {
      const { data, error } = await supabase
        .from("scheduled_push_notifications")
        .select("*")
        .order("scheduled_at", { ascending: true })
        .limit(20);

      if (error) throw error;
      return (data as ScheduledNotification[]) || [];
    },
    staleTime: 30000,
  });
}

export function useCreateScheduledNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: {
      card_id: string;
      title: string;
      body: string;
      scheduled_at: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("scheduled_push_notifications")
        .insert({
          ...notification,
          user_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-notifications"] });
    },
  });
}

export function useDeleteScheduledNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("scheduled_push_notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-notifications"] });
    },
  });
}
