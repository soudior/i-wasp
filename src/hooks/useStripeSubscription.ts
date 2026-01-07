/**
 * useStripeSubscription - Hook pour vérifier l'abonnement Stripe
 * Vérifie automatiquement au login et périodiquement
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface StripeSubscription {
  subscribed: boolean;
  plan: 'free' | 'gold_monthly' | 'gold_annual' | 'gold';
  productId: string | null;
  subscriptionEnd: string | null;
}

interface UseStripeSubscriptionReturn {
  subscription: StripeSubscription;
  isLoading: boolean;
  error: string | null;
  isGold: boolean;
  isPremium: boolean;
  refresh: () => Promise<void>;
}

const DEFAULT_SUBSCRIPTION: StripeSubscription = {
  subscribed: false,
  plan: 'free',
  productId: null,
  subscriptionEnd: null,
};

// Check interval: 60 seconds
const CHECK_INTERVAL_MS = 60 * 1000;

export function useStripeSubscription(): UseStripeSubscriptionReturn {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<StripeSubscription>(DEFAULT_SUBSCRIPTION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(DEFAULT_SUBSCRIPTION);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-subscription');

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSubscription({
        subscribed: data?.subscribed ?? false,
        plan: data?.plan ?? 'free',
        productId: data?.product_id ?? null,
        subscriptionEnd: data?.subscription_end ?? null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check subscription';
      console.error('[useStripeSubscription] Error:', message);
      setError(message);
      // Keep previous subscription state on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Periodic check
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  // Check on focus (when user returns to tab)
  useEffect(() => {
    if (!user) return;

    const handleFocus = () => {
      checkSubscription();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, checkSubscription]);

  // Check for subscription success in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      // Wait a bit for Stripe webhook to process
      setTimeout(() => {
        checkSubscription();
      }, 2000);
      
      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [checkSubscription]);

  const isGold = subscription.subscribed || 
    subscription.plan === 'gold' || 
    subscription.plan === 'gold_monthly' || 
    subscription.plan === 'gold_annual';

  return {
    subscription,
    isLoading,
    error,
    isGold,
    isPremium: isGold, // Alias for compatibility
    refresh: checkSubscription,
  };
}
