/**
 * Brand Context - Source unique de vérité visuelle
 * Synchronise automatiquement Brand Assets avec tout le site
 */

import { createContext, useContext, ReactNode } from "react";
import { useBrandAssets, BRAND_COLORS, BrandAsset } from "@/hooks/useBrandAssets";

// Evolis Printer Technical Specs - LOCKED
export const EVOLIS_SPECS = {
  format: "CR80",
  dimensions: "85,6 × 54 mm",
  bleed: "Aucun",
  safeMargin: "3 mm",
  colorMode: "CMYK",
  blackRecommended: "K100 ou Noir riche selon profil",
  resolution: "300 DPI",
  finish: "Premium",
};

// Official brand colors - LOCKED
export const OFFICIAL_COLORS = {
  primary: "#0B0B0B",      // Noir principal
  secondary: "#121212",    // Noir secondaire  
  foreground: "#FFFFFF",   // Blanc
  accent: "#FFC700",       // Jaune signature
};

interface BrandContextType {
  // Assets
  logoSvg: string | null;
  logoPng: string | null;
  logoPdf: string | null;
  cardFront: string | null;
  cardBack: string | null;
  assets: BrandAsset[];
  isLoading: boolean;
  
  // Colors (always locked)
  colors: typeof OFFICIAL_COLORS;
  brandColors: typeof BRAND_COLORS;
  
  // Evolis specs
  evolisSpecs: typeof EVOLIS_SPECS;
  
  // Helpers
  getAssetUrl: (type: string) => string | null;
  hasAllPrintAssets: boolean;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { data: assets = [], isLoading } = useBrandAssets();

  const getAssetUrl = (type: string): string | null => {
    const asset = assets.find(a => a.asset_type === type);
    return asset?.file_url || null;
  };

  const logoSvg = getAssetUrl("logo_svg");
  const logoPng = getAssetUrl("logo_png");
  const logoPdf = getAssetUrl("logo_pdf");
  const cardFront = getAssetUrl("card_front");
  const cardBack = getAssetUrl("card_back");

  const hasAllPrintAssets = !!(cardFront && cardBack && (logoSvg || logoPng));

  const value: BrandContextType = {
    logoSvg,
    logoPng,
    logoPdf,
    cardFront,
    cardBack,
    assets,
    isLoading,
    colors: OFFICIAL_COLORS,
    brandColors: BRAND_COLORS,
    evolisSpecs: EVOLIS_SPECS,
    getAssetUrl,
    hasAllPrintAssets,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    // Return default values if outside provider (for initial render)
    return {
      logoSvg: null,
      logoPng: null,
      logoPdf: null,
      cardFront: null,
      cardBack: null,
      assets: [],
      isLoading: false,
      colors: OFFICIAL_COLORS,
      brandColors: BRAND_COLORS,
      evolisSpecs: EVOLIS_SPECS,
      getAssetUrl: () => null,
      hasAllPrintAssets: false,
    };
  }
  return context;
}
