/**
 * i-wasp Push Notifications Hook
 * Handles web push subscription for profile visitors
 */

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PushSubscriptionState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  permission: NotificationPermission | null;
}

// VAPID public key - this should match the private key in your edge function
// You can generate a key pair at: https://web-push-codelab.glitch.me/
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(cardId: string | undefined) {
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: false,
    error: null,
    permission: null,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const isSupported = 
      'serviceWorker' in navigator && 
      'PushManager' in window &&
      'Notification' in window;
    
    setState(prev => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : null,
    }));

    // Check existing subscription
    if (isSupported && cardId) {
      checkExistingSubscription();
    }
  }, [cardId]);

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setState(prev => ({ ...prev, isSubscribed: true }));
        }
      }
    } catch (error) {
      console.error('[Push] Error checking subscription:', error);
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!cardId || !state.isSupported) {
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission !== 'granted') {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Permission refusée' 
        }));
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw-push.js', {
        scope: '/'
      });
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      // Extract keys
      const p256dh = subscription.getKey('p256dh');
      const auth = subscription.getKey('auth');

      if (!p256dh || !auth) {
        throw new Error('Could not get push subscription keys');
      }

      // Convert to base64 - ensure we create proper Uint8Array from ArrayBuffer
      const p256dhArray = new Uint8Array(p256dh);
      const authArray = new Uint8Array(auth);
      const p256dhBase64 = btoa(String.fromCharCode.apply(null, Array.from(p256dhArray)));
      const authBase64 = btoa(String.fromCharCode.apply(null, Array.from(authArray)));

      // Save subscription to database
      const { error: dbError } = await supabase.from('push_subscriptions').insert({
        card_id: cardId,
        endpoint: subscription.endpoint,
        p256dh_key: p256dhBase64,
        auth_key: authBase64,
        user_agent: navigator.userAgent,
      });

      if (dbError) {
        // If duplicate, that's ok
        if (!dbError.message.includes('duplicate')) {
          throw dbError;
        }
      }

      setState(prev => ({ 
        ...prev, 
        isSubscribed: true, 
        isLoading: false 
      }));

      return true;
    } catch (error) {
      console.error('[Push] Subscription error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erreur d\'abonnement' 
      }));
      return false;
    }
  }, [cardId, state.isSupported]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!cardId) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw-push.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      setState(prev => ({ 
        ...prev, 
        isSubscribed: false, 
        isLoading: false 
      }));

      return true;
    } catch (error) {
      console.error('[Push] Unsubscribe error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Erreur de désabonnement' 
      }));
      return false;
    }
  }, [cardId]);

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
}

// Hook for card owners to send notifications
export function useSendPushNotification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotification = useCallback(async (
    cardId: string, 
    title: string, 
    body: string,
    url?: string
  ): Promise<{ sent: number; failed: number }> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-push-to-subscribers', {
        body: { cardId, title, body, url },
      });

      if (fnError) throw fnError;

      return data as { sent: number; failed: number };
    } catch (err) {
      console.error('[Push] Send error:', err);
      setError(err instanceof Error ? err.message : 'Erreur d\'envoi');
      return { sent: 0, failed: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendNotification,
    isLoading,
    error,
  };
}
