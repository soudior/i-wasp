/**
 * useSubscription - Hook pour gérer l'abonnement utilisateur
 * Free vs Premium
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "premium";
  status: "active" | "cancelled" | "expired";
  price_cents: number;
  currency: string;
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      // If no subscription exists, create a free one
      if (!data) {
        const { data: newSub, error: insertError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan: "free",
            status: "active",
            price_cents: 0,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newSub as Subscription;
      }

      return data as Subscription;
    },
    enabled: !!user?.id,
  });

  const isPremium = subscription?.plan === "premium" && 
                    subscription?.status === "active" &&
                    (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

  return {
    subscription,
    isLoading,
    error,
    isPremium,
    plan: subscription?.plan || "free",
  };
}

/**
 * Hook pour vérifier si une fonctionnalité est disponible
 */
export function useFeatureAccess() {
  const { isPremium, isLoading } = useSubscription();

  const canUseStories = isPremium;
  const canUseWifi = isPremium;
  const canUseAdvancedStats = isPremium;
  const canUseUnlimitedTemplates = isPremium;
  const maxSocialLinks = isPremium ? 999 : 3;

  return {
    isLoading,
    isPremium,
    canUseStories,
    canUseWifi,
    canUseAdvancedStats,
    canUseUnlimitedTemplates,
    maxSocialLinks,
  };
}
