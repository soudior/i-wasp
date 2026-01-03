/**
 * useSubscription - Hook pour gérer l'abonnement utilisateur
 * FREE vs GOLD (2 plans uniquement)
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SUBSCRIPTION_PLANS, isPremiumPlan } from "@/lib/subscriptionPlans";

export type PlanType = "free" | "gold";

interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: "active" | "cancelled" | "expired";
  price_cents: number;
  currency: string;
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading, error, refetch } = useQuery({
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

  // Normalize plan name (premium -> gold for backwards compatibility)
  const normalizedPlan = subscription?.plan === "premium" ? "gold" : subscription?.plan || "free";
  
  const isGold = isPremiumPlan(subscription?.plan || "") && 
                 subscription?.status === "active" &&
                 (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

  // Alias for backwards compatibility
  const isPremium = isGold;

  return {
    subscription,
    isLoading,
    error,
    refetch,
    isGold,
    isPremium, // backwards compatibility
    plan: normalizedPlan as PlanType,
    planConfig: isGold ? SUBSCRIPTION_PLANS.GOLD : SUBSCRIPTION_PLANS.FREE,
  };
}

/**
 * Hook pour vérifier si une fonctionnalité est disponible
 * Basé sur le système FREE / GOLD
 */
export function useFeatureAccess() {
  const { isGold, isLoading, planConfig } = useSubscription();

  return {
    isLoading,
    isGold,
    isPremium: isGold, // backwards compatibility
    
    // Feature access based on plan
    canUseStories: isGold,
    canUseAnalytics: isGold,
    canUseLeadCapture: isGold,
    canUsePushNotifications: isGold,
    canUseAiCoach: isGold,
    canUseBadge: isGold,
    canUseAllTemplates: isGold,
    canUseWifi: isGold,
    canUseAdvancedStats: isGold,
    canUseUnlimitedTemplates: isGold,
    
    // Limits
    maxSocialLinks: planConfig.limits.maxSocialLinks,
    maxStories: planConfig.limits.maxStories,
    maxTemplates: planConfig.limits.maxTemplates,
  };
}
