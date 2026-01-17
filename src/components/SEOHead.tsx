/**
 * SEOHead - Composant pour les meta tags SEO
 * Utilise react-helmet-async pour la gestion dynamique des meta tags
 * Note: Pour une implémentation complète, installer react-helmet-async
 * En attendant, ce composant utilise document.title et meta tags dynamiques
 */

import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product" | "profile";
  noindex?: boolean;
}

const BASE_URL = "https://i-wasp.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "i-wasp";

export function SEOHead({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    const fullTitle = title.includes("i-wasp") ? title : `${title} | i-wasp`;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Basic meta tags
    updateMeta("description", description);
    if (noindex) {
      updateMeta("robots", "noindex, nofollow");
    } else {
      updateMeta("robots", "index, follow");
    }

    // Open Graph
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:type", type, true);
    updateMeta("og:image", image, true);
    updateMeta("og:site_name", SITE_NAME, true);
    if (canonical) {
      updateMeta("og:url", `${BASE_URL}${canonical}`, true);
    }

    // Twitter Card
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);

    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${BASE_URL}${canonical}`);
    }

    // Cleanup function
    return () => {
      // Reset to default title on unmount if needed
    };
  }, [title, description, canonical, image, type, noindex]);

  return null;
}

// Predefined SEO configs for common pages
export const SEO_CONFIGS = {
  home: {
    title: "IWASP — Premium NFC Business Cards | Digital Identity",
    description: "Premium NFC business cards for professionals worldwide. Share your contact info with a single tap. Ships globally from Europe.",
    canonical: "/",
    image: "https://i-wasp.lovable.app/og-home.png",
  },
  products: {
    title: "NFC Cards & Products | IWASP",
    description: "Discover our premium NFC business cards collection. Minimalist design, noble materials, cutting-edge technology. Free worldwide shipping.",
    canonical: "/produits",
  },
  nails: {
    title: "NFC Nails — Connected Beauty | IWASP",
    description: "The world's first NFC connected nails. Share your information with a simple touch. Beauty innovation meets technology.",
    canonical: "/nails",
  },
  contact: {
    title: "Contact Us | IWASP",
    description: "Contact the IWASP team for your premium NFC business card projects or to become a partner. Worldwide support.",
    canonical: "/contact",
  },
  pricing: {
    title: "Pricing Plans | IWASP",
    description: "Simple and transparent pricing for IWASP premium NFC business cards. Solutions for individuals and enterprises worldwide.",
    canonical: "/pricing",
  },
  faq: {
    title: "FAQ — Frequently Asked Questions | IWASP",
    description: "Find answers to your questions about IWASP NFC business cards. How it works, compatibility, worldwide delivery.",
    canonical: "/faq",
  },
  about: {
    title: "About Us | IWASP",
    description: "Discover the story and vision of IWASP, the premium digital professional identity house. Based in Morocco, serving worldwide.",
    canonical: "/about",
  },
  enterprise: {
    title: "Enterprise Solutions | IWASP",
    description: "Custom NFC solutions for businesses. Connected business cards, badges, access control. Contact us for a quote.",
    canonical: "/enterprise",
  },
  order: {
    title: "Order Your NFC Card | IWASP",
    description: "Choose your premium NFC business card. Multiple designs available. Free worldwide shipping. 48h express delivery.",
    canonical: "/order/offre",
  },
  webStudio: {
    title: "Web Studio — AI Website Builder | IWASP",
    description: "Create your professional website with AI. Turnkey solution: design, hosting, domain included. Launch in 48 hours.",
    canonical: "/web-studio",
  },
  dashboard: {
    title: "Dashboard | IWASP",
    description: "Manage your digital business cards, track analytics, and capture leads from your IWASP dashboard.",
    canonical: "/dashboard",
  },
} as const;

// Dynamic SEO config generator for public cards
export function getPublicCardSEO(card: {
  first_name: string;
  last_name: string;
  title?: string | null;
  company?: string | null;
  photo_url?: string | null;
  slug: string;
}) {
  const fullName = `${card.first_name} ${card.last_name}`.trim();
  const role = card.title ? `${card.title}${card.company ? ` at ${card.company}` : ''}` : card.company || '';
  
  return {
    title: `${fullName}${role ? ` — ${role}` : ''} | IWASP`,
    description: `Connect with ${fullName}${role ? `, ${role}` : ''}. Tap to get contact info, save to phone, and connect on social media.`,
    canonical: `/c/${card.slug}`,
    image: card.photo_url || "https://i-wasp.lovable.app/og-card.png",
    type: "profile" as const,
  };
}
