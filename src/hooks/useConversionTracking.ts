/**
 * Hook de tracking des conversions
 * 
 * Simplifie l'intégration du tracking dans les composants React
 */

import { useEffect, useCallback, useRef } from 'react';
import { Analytics } from '@/lib/analytics';

interface UseConversionTrackingOptions {
  pageName: string;
  trackScroll?: boolean;
  trackTime?: boolean;
}

export function useConversionTracking({
  pageName,
  trackScroll = true,
  trackTime = true,
}: UseConversionTrackingOptions) {
  const startTime = useRef(Date.now());
  const scrollTracked = useRef(new Set<number>());

  // Track page view on mount
  useEffect(() => {
    Analytics.pageView(pageName);
  }, [pageName]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScroll) return;

    const thresholds = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !scrollTracked.current.has(threshold)) {
          scrollTracked.current.add(threshold);
          Analytics.scrollDepth(threshold, pageName);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageName, trackScroll]);

  // Track time on page
  useEffect(() => {
    if (!trackTime) return;

    const interval = setInterval(() => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (seconds === 30 || seconds === 60 || seconds === 120) {
        Analytics.timeOnPage(seconds, pageName);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [pageName, trackTime]);

  // Track CTA clicks
  const trackCTA = useCallback((ctaName: string, location: string = pageName) => {
    Analytics.ctaClick(ctaName, location);
  }, [pageName]);

  // Track offer views
  const trackOfferView = useCallback((offerName: string, price: number) => {
    Analytics.viewOffer(offerName, price);
  }, []);

  // Track offer selection
  const trackOfferSelect = useCallback((offerName: string, price: number) => {
    Analytics.selectOffer(offerName, price);
  }, []);

  // Track checkout start
  const trackCheckoutStart = useCallback((offerName: string, price: number) => {
    Analytics.beginCheckout(offerName, price);
  }, []);

  // Track purchase
  const trackPurchase = useCallback((orderId: string, value: number, offerName: string) => {
    Analytics.purchase(orderId, value, offerName);
  }, []);

  return {
    trackCTA,
    trackOfferView,
    trackOfferSelect,
    trackCheckoutStart,
    trackPurchase,
  };
}

/**
 * Hook simple pour tracker les conversions d'achat
 */
export function usePurchaseTracking() {
  return useCallback((orderId: string, value: number, offerName: string) => {
    Analytics.purchase(orderId, value, offerName);
  }, []);
}

export default useConversionTracking;
