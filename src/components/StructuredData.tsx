/**
 * StructuredData — injecte du JSON-LD (schema.org) dans le <head>.
 * Améliore le référencement et les « rich results » Google.
 * SPA sans react-helmet : on gère le <script type="application/ld+json"> à la main.
 */

import { useEffect } from "react";

interface StructuredDataProps {
  /** Un objet JSON-LD ou un tableau d'objets. */
  schema: Record<string, unknown> | Record<string, unknown>[];
  /** Identifiant pour dédupliquer/mettre à jour le script. */
  id: string;
}

export function StructuredData({ schema, id }: StructuredDataProps) {
  useEffect(() => {
    const scriptId = `ld-json-${id}`;
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    return () => {
      const node = document.getElementById(scriptId);
      if (node) node.remove();
    };
  }, [schema, id]);

  return null;
}

export default StructuredData;

// ── Schémas réutilisables ────────────────────────────────────────────────────

const BASE_URL = "https://i-wasp.com";

export const organizationSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "i-wasp",
  url: BASE_URL,
  logo: `${BASE_URL}/apple-touch-icon.png`,
  description:
    "Cartes de visite NFC premium et identité digitale. Partagez vos coordonnées d'un simple geste, sans application.",
};

export const websiteSchema: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "i-wasp",
  url: BASE_URL,
  inLanguage: "fr-FR",
};

export function productSchema(opts: {
  name: string;
  description: string;
  image: string;
  lowPrice: number;
  highPrice: number;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    brand: { "@type": "Brand", name: "i-wasp" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: opts.lowPrice,
      highPrice: opts.highPrice,
      offerCount: 3,
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
