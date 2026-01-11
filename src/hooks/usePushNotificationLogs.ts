/**
 * Hook to fetch push notification history logs
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PushNotificationLog {
  id: string;
  card_id: string;
  title: string;
  body: string;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

export function usePushNotificationLogs() {
  return useQuery({
    queryKey: ["push-notification-logs"],
    queryFn: async (): Promise<PushNotificationLog[]> => {
      const { data, error } = await supabase
        .from("push_notification_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data as PushNotificationLog[]) || [];
    },
    staleTime: 30000,
  });
}

export function useCreatePushNotificationLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: {
      card_id: string;
      title: string;
      body: string;
      sent_count: number;
      failed_count: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("push_notification_logs")
        .insert({
          ...log,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notification-logs"] });
    },
  });
}
