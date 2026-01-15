/**
 * Hook pour enregistrer les événements analytics dans la base de données
 * Utilisé pour tracker les conversions express checkout et Web Studio
 */

import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface TrackEventParams {
  eventType: string;
  eventName: string;
  eventValue?: number;
  eventMetadata?: Record<string, string | number | boolean | null>;
}

// Génère un ID de session unique pour le tracking
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Enregistre un événement analytics dans la base de données
 */
export async function trackAnalyticsEvent({
  eventType,
  eventName,
  eventValue,
  eventMetadata = {},
}: TrackEventParams): Promise<void> {
  try {
    const { error } = await supabase.from('analytics_events').insert([{
      event_type: eventType,
      event_name: eventName,
      event_value: eventValue,
      event_metadata: eventMetadata as unknown as Json,
      page_url: window.location.href,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: getSessionId(),
    }]);

    if (error) {
      console.error('[Analytics] Error tracking event:', error);
    } else {
      console.log(`[Analytics] Event: ${eventName}`, { eventType, eventValue, eventMetadata });
    }
  } catch (err) {
    console.error('[Analytics] Failed to track event:', err);
  }
}

/**
 * Hook pour tracker les événements du checkout express
 */
export function useExpressCheckoutTracking(pageName: string) {
  const hasTrackedPageView = useRef(false);

  // Track page view on mount
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      hasTrackedPageView.current = true;
      trackAnalyticsEvent({
        eventType: 'page_view',
        eventName: `express_${pageName}_view`,
      });
    }
  }, [pageName]);

  // Track offer selection
  const trackOfferSelect = useCallback((offerName: string, price: number) => {
    trackAnalyticsEvent({
      eventType: 'conversion',
      eventName: 'express_offer_select',
      eventValue: price,
      eventMetadata: { offer: offerName },
    });
  }, []);

  // Track info submission
  const trackInfoSubmit = useCallback((city: string) => {
    trackAnalyticsEvent({
      eventType: 'conversion',
      eventName: 'express_infos_submit',
      eventMetadata: { city },
    });
  }, []);

  // Track purchase
  const trackPurchase = useCallback((orderId: string, value: number, offerName: string, paymentMethod: string) => {
    trackAnalyticsEvent({
      eventType: 'purchase',
      eventName: 'express_purchase',
      eventValue: value,
      eventMetadata: { 
        order_id: orderId, 
        offer: offerName,
        payment_method: paymentMethod,
      },
    });
  }, []);

  return {
    trackOfferSelect,
    trackInfoSubmit,
    trackPurchase,
  };
}

/**
 * Hook pour tracker les clics Web Studio
 */
export function useWebStudioTracking() {
  // Track CTA click
  const trackCTAClick = useCallback((location: string) => {
    trackAnalyticsEvent({
      eventType: 'cta_click',
      eventName: 'webstudio_cta_click',
      eventMetadata: { location },
    });
  }, []);

  // Track offer page view
  const trackOfferView = useCallback(() => {
    trackAnalyticsEvent({
      eventType: 'page_view',
      eventName: 'webstudio_offre_view',
    });
  }, []);

  // Track offer selection
  const trackOfferSelect = useCallback((packageName: string, price: number) => {
    trackAnalyticsEvent({
      eventType: 'conversion',
      eventName: 'webstudio_offer_select',
      eventValue: price,
      eventMetadata: { package: packageName },
    });
  }, []);

  return {
    trackCTAClick,
    trackOfferView,
    trackOfferSelect,
  };
}

export default trackAnalyticsEvent;
