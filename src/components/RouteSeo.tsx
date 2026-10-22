import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO_CONFIGS } from "@/components/SEOHead";

const ORIGIN = "https://www.i-wasp.com";

const BY_PATH: Record<string, { title: string; description: string }> = {
  "/": SEO_CONFIGS.home,
  "/omnia": SEO_CONFIGS.home,
  "/produits": SEO_CONFIGS.products,
  "/nails": SEO_CONFIGS.nails,
  "/contact": SEO_CONFIGS.contact,
  "/pricing": SEO_CONFIGS.pricing,
  "/tarifs": SEO_CONFIGS.pricing,
  "/faq": SEO_CONFIGS.faq,
  "/about": SEO_CONFIGS.about,
  "/a-propos": SEO_CONFIGS.about,
  "/enterprise": SEO_CONFIGS.enterprise,
  "/entreprises": SEO_CONFIGS.enterprise,
  "/order/offre": SEO_CONFIGS.order,
  "/express/offre": SEO_CONFIGS.order,
  "/web-studio": SEO_CONFIGS.webStudio,
  "/elite": {
    title: "i-wasp Elite — Carte NFC premium",
    description: "Déployez votre carte de visite NFC i-wasp. Profil digital, QR code et Apple Wallet, à partir du tarif officiel.",
  },
  "/iwasp": {
    title: "i-wasp Elite — Carte NFC premium",
    description: "Déployez votre carte de visite NFC i-wasp. Profil digital, QR code et Apple Wallet, à partir du tarif officiel.",
  },
  "/guide": {
    title: "Guide d'utilisation | i-wasp",
    description: "Activez et utilisez votre carte de visite NFC i-wasp : profil, partage et Apple Wallet.",
  },
  "/cartes-nfc": {
    title: "Cartes NFC premium | i-wasp",
    description: "Choisissez votre carte de visite NFC i-wasp et commandez en ligne.",
  },
};

function upsertMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let meta = document.querySelector(`meta[${attr}="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

/**
 * Default canonical/title for the current path. Runs in a layout effect so a
 * page-level SEOHead effect can replace it with a more specific title.
 */
export function RouteSeo() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const href = `${ORIGIN}${path === "" ? "/" : path}`;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
    upsertMeta("og:url", href, true);

    const page = BY_PATH[path];
    if (!page) return;
    const fullTitle = page.title.includes("i-wasp") ? page.title : `${page.title} | i-wasp`;
    document.title = fullTitle;
    upsertMeta("description", page.description);
    upsertMeta("og:title", fullTitle, true);
    upsertMeta("og:description", page.description, true);
  }, [pathname]);

  return null;
}
