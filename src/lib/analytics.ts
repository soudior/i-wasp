/**
 * Analytics & Tracking Module for I-WASP
 * 
 * Centralise tous les événements de tracking pour Google Ads, Meta Pixel, etc.
 * Facilite l'optimisation des campagnes publicitaires.
 */

// Types d'événements de conversion
export type ConversionEvent = 
  | 'page_view'
  | 'view_offer'
  | 'select_offer'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'purchase'
  | 'lead'
  | 'contact'
  | 'scroll_depth'
  | 'cta_click';

interface EventParams {
  value?: number;
  currency?: string;
  offer?: string;
  step?: number;
  source?: string;
  items?: Array<{ item_name: string }>;
  [key: string]: string | number | boolean | undefined | Array<{ item_name: string }>;
}

// Déclarations globales pour les pixels
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Tracker les événements vers Google Analytics / Google Ads
 */
export function trackGoogleEvent(
  eventName: string, 
  params?: EventParams
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      send_to: 'AW-CONVERSION_ID', // À remplacer par l'ID réel
    });
    console.log(`[GA] Event: ${eventName}`, params);
  }
}

/**
 * Tracker les conversions Google Ads
 */
export function trackGoogleConversion(
  conversionLabel: string,
  value?: number,
  currency: string = 'MAD'
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `AW-CONVERSION_ID/${conversionLabel}`,
      value,
      currency,
    });
    console.log(`[Google Ads] Conversion: ${conversionLabel}`, { value, currency });
  }
}

/**
 * Tracker les événements Meta/Facebook Pixel
 */
export function trackMetaEvent(
  eventName: string,
  params?: EventParams
): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
    console.log(`[Meta] Event: ${eventName}`, params);
  }
}

/**
 * Tracker les événements Meta personnalisés
 */
export function trackMetaCustomEvent(
  eventName: string,
  params?: EventParams
): void {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
    console.log(`[Meta Custom] Event: ${eventName}`, params);
  }
}

/**
 * Événements de conversion unifiés - Envoie aux deux plateformes
 */
export const Analytics = {
  // Page vue
  pageView: (pageName: string) => {
    trackGoogleEvent('page_view', { page_title: pageName });
    trackMetaEvent('PageView');
  },

  // Vue d'une offre
  viewOffer: (offerName: string, price: number) => {
    trackGoogleEvent('view_item', { 
      item_name: offerName, 
      value: price,
      currency: 'MAD'
    });
    trackMetaEvent('ViewContent', { 
      content_name: offerName, 
      value: price, 
      currency: 'MAD' 
    });
  },

  // Sélection d'une offre
  selectOffer: (offerName: string, price: number) => {
    trackGoogleEvent('select_item', { 
      item_name: offerName, 
      value: price 
    });
    trackMetaCustomEvent('SelectOffer', { 
      offer: offerName, 
      value: price 
    });
  },

  // Début du tunnel de commande
  beginCheckout: (offerName: string, price: number) => {
    trackGoogleEvent('begin_checkout', { 
      value: price, 
      currency: 'MAD',
      items: [{ item_name: offerName }]
    });
    trackMetaEvent('InitiateCheckout', { 
      value: price, 
      currency: 'MAD' 
    });
  },

  // Ajout des infos de livraison
  addShippingInfo: (city: string) => {
    trackGoogleEvent('add_shipping_info', { shipping_city: city });
    trackMetaCustomEvent('AddShippingInfo', { city });
  },

  // Achat complété
  purchase: (orderId: string, value: number, offerName: string) => {
    trackGoogleConversion('PURCHASE_LABEL', value, 'MAD');
    trackGoogleEvent('purchase', {
      transaction_id: orderId,
      value,
      currency: 'MAD',
      items: [{ item_name: offerName }]
    });
    trackMetaEvent('Purchase', {
      value,
      currency: 'MAD',
      content_name: offerName,
    });
  },

  // Lead généré (formulaire contact, etc.)
  lead: (source: string, value?: number) => {
    trackGoogleConversion('LEAD_LABEL', value, 'MAD');
    trackGoogleEvent('generate_lead', { source, value });
    trackMetaEvent('Lead', { source, value });
  },

  // Clic sur CTA
  ctaClick: (ctaName: string, location: string) => {
    trackGoogleEvent('cta_click', { cta_name: ctaName, location });
    trackMetaCustomEvent('CTAClick', { cta_name: ctaName, location });
  },

  // Scroll depth (25%, 50%, 75%, 100%)
  scrollDepth: (percentage: number, pageName: string) => {
    trackGoogleEvent('scroll', { 
      percent_scrolled: percentage,
      page: pageName 
    });
  },

  // Temps passé sur page
  timeOnPage: (seconds: number, pageName: string) => {
    if (seconds >= 30) {
      trackGoogleEvent('engaged_user', { 
        time_on_page: seconds,
        page: pageName 
      });
    }
  },
};

/**
 * Hook pour tracker automatiquement le scroll depth
 */
export function useScrollTracking(pageName: string): void {
  if (typeof window === 'undefined') return;

  const tracked = new Set<number>();
  const thresholds = [25, 50, 75, 100];

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        Analytics.scrollDepth(threshold, pageName);
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Générer le script d'initialisation des pixels
 * À ajouter dans index.html ou via un composant
 */
export function getTrackingScripts(googleAdsId?: string, metaPixelId?: string): string {
  let scripts = '';

  if (googleAdsId) {
    scripts += `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${googleAdsId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${googleAdsId}');
</script>
`;
  }

  if (metaPixelId) {
    scripts += `
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');
</script>
`;
  }

  return scripts;
}

export default Analytics;
