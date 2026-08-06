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

// Predefined SEO configs for common pages (français — langue primaire)
export const SEO_CONFIGS = {
  home: {
    title: "i-wasp — Carte de visite NFC premium & identité digitale",
    description: "La carte de visite NFC qui transforme chaque rencontre en opportunité. Partagez vos coordonnées, réseaux et portfolio d'un simple geste. Aucune application requise pour votre interlocuteur.",
    canonical: "/",
    image: `${BASE_URL}/og-image.png`,
  },
  products: {
    title: "Cartes & produits NFC | i-wasp",
    description: "Découvrez notre collection de cartes de visite NFC premium. Design minimaliste, matières nobles, technologie de pointe. Livraison dans le monde entier.",
    canonical: "/produits",
  },
  nails: {
    title: "Ongles NFC — Beauté connectée | i-wasp",
    description: "Les premiers ongles NFC connectés. Partagez vos informations d'un simple contact. Quand l'innovation beauté rencontre la technologie.",
    canonical: "/nails",
  },
  contact: {
    title: "Nous contacter | i-wasp",
    description: "Contactez l'équipe i-wasp pour vos projets de cartes de visite NFC premium ou pour devenir partenaire. Support international.",
    canonical: "/contact",
  },
  pricing: {
    title: "Tarifs | i-wasp",
    description: "Des tarifs simples et transparents pour les cartes de visite NFC premium i-wasp. Des solutions pour les particuliers et les entreprises.",
    canonical: "/pricing",
  },
  faq: {
    title: "FAQ — Questions fréquentes | i-wasp",
    description: "Trouvez les réponses à vos questions sur les cartes de visite NFC i-wasp : fonctionnement, compatibilité, livraison.",
    canonical: "/faq",
  },
  about: {
    title: "À propos | i-wasp",
    description: "Découvrez l'histoire et la vision d'i-wasp, la maison de l'identité professionnelle digitale premium.",
    canonical: "/about",
  },
  enterprise: {
    title: "Solutions entreprises | i-wasp",
    description: "Solutions NFC sur mesure pour les entreprises : cartes de visite connectées, badges, contrôle d'accès. Contactez-nous pour un devis.",
    canonical: "/enterprise",
  },
  order: {
    title: "Commander votre carte NFC | i-wasp",
    description: "Choisissez votre carte de visite NFC premium. Plusieurs designs disponibles. Livraison rapide et suivie.",
    canonical: "/order/offre",
    image: `${BASE_URL}/og-order.png`,
  },
  webStudio: {
    title: "Web Studio — Créateur de site par IA | i-wasp",
    description: "Créez votre site web professionnel avec l'IA. Solution clé en main : design, hébergement, domaine inclus. En ligne en 48 heures.",
    canonical: "/web-studio",
    image: `${BASE_URL}/og-webstudio.png`,
  },
  dashboard: {
    title: "Tableau de bord | i-wasp",
    description: "Gérez vos cartes de visite digitales, suivez vos statistiques et capturez vos contacts depuis votre tableau de bord i-wasp.",
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
    title: `${fullName}${role ? ` — ${role}` : ''} | i-wasp`,
    description: `Entrez en contact avec ${fullName}${role ? `, ${role}` : ''}. Un geste suffit pour enregistrer ses coordonnées et accéder à ses réseaux.`,
    canonical: `/c/${card.slug}`,
    image: card.photo_url || `${BASE_URL}/og-image.png`,
    type: "profile" as const,
  };
}
