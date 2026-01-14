import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SaaSPlanId, getSaaSPlan } from '@/lib/saasPlans';

interface SaaSSubscriptionFeatures {
  nfcCardsPerMonth: number;
  sitePages: number;
  lovableCredits: number;
  logoOnCard: boolean;
  ecommerce: boolean;
  analytics: string;
  support: string;
}

interface SaaSSubscription {
  subscribed: boolean;
  plan: SaaSPlanId;
  plan_tier: number;
  product_id: string | null;
  price_id: string | null;
  subscription_id: string | null;
  subscription_end: string | null;
  cancel_at_period_end: boolean;
  features: SaaSSubscriptionFeatures;
}

interface UseSaaSSubscriptionReturn {
  subscription: SaaSSubscription | null;
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  isIdentity: boolean;
  isProfessional: boolean;
  isEnterprise: boolean;
  isPremium: boolean; // Professional or Enterprise
  planDetails: ReturnType<typeof getSaaSPlan> | null;
  refresh: () => Promise<void>;
}

const DEFAULT_SUBSCRIPTION: SaaSSubscription = {
  subscribed: false,
  plan: 'free',
  plan_tier: 0,
  product_id: null,
  price_id: null,
  subscription_id: null,
  subscription_end: null,
  cancel_at_period_end: false,
  features: {
    nfcCardsPerMonth: 0,
    sitePages: 0,
    lovableCredits: 0,
    logoOnCard: false,
    ecommerce: false,
    analytics: 'none',
    support: 'email',
  },
};

export function useSaaSSubscription(): UseSaaSSubscriptionReturn {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SaaSSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(DEFAULT_SUBSCRIPTION);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-saas-subscription');

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Map 'gold' plan to 'professional' for backward compatibility
      const normalizedPlan = data.plan === 'gold' ? 'professional' : data.plan;
      
      setSubscription({
        ...data,
        plan: normalizedPlan as SaaSPlanId,
      });
    } catch (err) {
      console.error('Error checking SaaS subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to check subscription');
      setSubscription(DEFAULT_SUBSCRIPTION);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial check and user change
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Periodic refresh (every 60 seconds)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  // Refresh on window focus
  useEffect(() => {
    if (!user) return;

    const handleFocus = () => {
      checkSubscription();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, checkSubscription]);

  // Check for success query param (after checkout)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('subscription') === 'success') {
      // Small delay to allow Stripe webhook to process
      setTimeout(checkSubscription, 2000);
    }
  }, [checkSubscription]);

  const plan = subscription?.plan || 'free';
  const isSubscribed = subscription?.subscribed || false;
  const isIdentity = plan === 'identity';
  const isProfessional = plan === 'professional';
  const isEnterprise = plan === 'enterprise';
  const isPremium = isProfessional || isEnterprise;
  const planDetails = getSaaSPlan(plan);

  return {
    subscription,
    isLoading,
    error,
    isSubscribed,
    isIdentity,
    isProfessional,
    isEnterprise,
    isPremium,
    planDetails,
    refresh: checkSubscription,
  };
}
