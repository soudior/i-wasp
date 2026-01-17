import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SaaSPlanId, getSaaSPlan } from '@/lib/saasPlans';

interface SaaSSubscriptionFeatures {
  vcard: boolean;
  qrCode: boolean;
  nfc: boolean;
  sitePersonnalise: boolean;
  collections: boolean;
  stories: boolean;
  pushNotifications: boolean;
  analyticsIA: boolean;
  whiteLabel: boolean;
  api: boolean;
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
  isPro: boolean;
  isBusiness: boolean;
  isPremium: boolean;
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
    vcard: true,
    qrCode: true,
    nfc: true,
    sitePersonnalise: false,
    collections: false,
    stories: false,
    pushNotifications: false,
    analyticsIA: false,
    whiteLabel: false,
    api: false,
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

    try {
      setIsLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setSubscription(DEFAULT_SUBSCRIPTION);
        return;
      }

      const { data, error: funcError } = await supabase.functions.invoke('check-saas-subscription');

      if (funcError) {
        console.error('Error checking subscription:', funcError);
        setSubscription(DEFAULT_SUBSCRIPTION);
        return;
      }

      if (data) {
        const planId = data.plan as SaaSPlanId || 'free';
        const planDetails = getSaaSPlan(planId);
        
        setSubscription({
          subscribed: data.subscribed || false,
          plan: planId,
          plan_tier: planId === 'business' ? 2 : planId === 'pro' ? 1 : 0,
          product_id: data.product_id || null,
          price_id: data.price_id || null,
          subscription_id: data.subscription_id || null,
          subscription_end: data.subscription_end || null,
          cancel_at_period_end: data.cancel_at_period_end || false,
          features: planDetails.features as SaaSSubscriptionFeatures,
        });
      } else {
        setSubscription(DEFAULT_SUBSCRIPTION);
      }
    } catch (err) {
      console.error('Subscription check error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSubscription(DEFAULT_SUBSCRIPTION);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check on mount and auth change
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  // Refresh after checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription_success') === 'true') {
      // Wait a bit for Stripe webhook to process
      setTimeout(checkSubscription, 2000);
    }
  }, [checkSubscription]);

  const plan = subscription?.plan || 'free';
  const isSubscribed = subscription?.subscribed || false;
  const isPro = plan === 'pro';
  const isBusiness = plan === 'business';
  const isPremium = isPro || isBusiness;
  const planDetails = getSaaSPlan(plan);

  return {
    subscription,
    isLoading,
    error,
    isSubscribed,
    isPro,
    isBusiness,
    isPremium,
    planDetails,
    refresh: checkSubscription,
  };
}
