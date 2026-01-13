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
  type?: "website" | "article" | "product";
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
    title: "i-wasp — Haute Couture Digitale",
    description: "Maison d'identité professionnelle digitale. Cartes de visite NFC premium et ongles connectés. Sobre, précise, intemporelle.",
    canonical: "/",
  },
  products: {
    title: "Produits NFC Premium",
    description: "Découvrez notre collection de cartes de visite NFC premium. Design minimaliste, matériaux nobles, technologie de pointe.",
    canonical: "/produits",
  },
  nails: {
    title: "i-wasp Nails — Ongles Connectés",
    description: "Les premiers ongles connectés NFC au monde. Partagez vos informations d'un simple toucher. Innovation beauté et technologie.",
    canonical: "/nails",
  },
  contact: {
    title: "Contact",
    description: "Contactez l'équipe i-wasp pour vos projets de cartes de visite NFC premium ou pour devenir partenaire.",
    canonical: "/contact",
  },
  pricing: {
    title: "Tarifs",
    description: "Découvrez nos offres et tarifs pour les cartes de visite NFC premium i-wasp. Solutions pour particuliers et entreprises.",
    canonical: "/pricing",
  },
  faq: {
    title: "FAQ — Questions Fréquentes",
    description: "Trouvez les réponses à vos questions sur les cartes de visite NFC i-wasp. Fonctionnement, compatibilité, livraison.",
    canonical: "/faq",
  },
  about: {
    title: "À Propos",
    description: "Découvrez l'histoire et la vision d'i-wasp, maison d'identité professionnelle digitale au Maroc.",
    canonical: "/about",
  },
  enterprise: {
    title: "Solutions Entreprises",
    description: "Solutions NFC sur mesure pour les entreprises. Cartes de visite connectées, badges, accès. Contactez-nous pour un devis.",
    canonical: "/enterprise",
  },
} as const;
