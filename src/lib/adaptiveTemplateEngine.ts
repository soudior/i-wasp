/**
 * IWASP Adaptive Templates Engine
 * 
 * Core system for deterministic business template generation
 * 
 * Input:
 * - Client logo (image)
 * - Business sector
 * - Card type
 * 
 * Output:
 * - Extracted color palette from logo
 * - Business-specific modules
 * - Cohesive visual system
 */

export type BusinessSector = 
  | "hotel"
  | "restaurant"
  | "boutique"
  | "immobilier"
  | "evenement"
  | "tourisme"
  | "business";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export interface BusinessModule {
  id: string;
  type: string;
  label: string;
  required: boolean;
}

export interface AdaptiveTemplate {
  sector: BusinessSector;
  palette: ColorPalette;
  modules: BusinessModule[];
}

/**
 * Business sector module definitions
 * Each sector has specific required and optional modules
 */
const SECTOR_MODULES: Record<BusinessSector, BusinessModule[]> = {
  hotel: [
    { id: "reception", type: "action", label: "Réception", required: true },
    { id: "wifi", type: "wifi", label: "Wi-Fi Invité", required: true },
    { id: "services", type: "info", label: "Services", required: true },
    { id: "roomAccess", type: "action", label: "Accès Chambre", required: false },
    { id: "reviews", type: "social", label: "Avis", required: false },
  ],
  restaurant: [
    { id: "menu", type: "action", label: "Menu", required: true },
    { id: "wifi", type: "wifi", label: "Wi-Fi", required: true },
    { id: "reservation", type: "action", label: "Réservation", required: true },
    { id: "reviews", type: "social", label: "Avis", required: false },
  ],
  boutique: [
    { id: "catalog", type: "action", label: "Catalogue", required: true },
    { id: "promotions", type: "offer", label: "Promotions", required: false },
    { id: "contact", type: "action", label: "Contact", required: true },
    { id: "reviews", type: "social", label: "Avis", required: false },
  ],
  immobilier: [
    { id: "virtualTour", type: "action", label: "Visite Virtuelle", required: true },
    { id: "dossier", type: "action", label: "Dossier Bien", required: true },
    { id: "agent", type: "action", label: "Contact Agent", required: true },
  ],
  evenement: [
    { id: "program", type: "info", label: "Programme", required: true },
    { id: "map", type: "location", label: "Plan", required: true },
    { id: "networking", type: "social", label: "Networking", required: false },
    { id: "wifi", type: "wifi", label: "Wi-Fi", required: true },
  ],
  tourisme: [
    { id: "tours", type: "info", label: "Excursions", required: true },
    { id: "languages", type: "info", label: "Langues", required: true },
    { id: "contact", type: "action", label: "Contact", required: true },
    { id: "whatsapp", type: "action", label: "WhatsApp", required: false },
    { id: "reviews", type: "social", label: "Avis", required: false },
  ],
  business: [
    { id: "contact", type: "action", label: "Contact", required: true },
    { id: "website", type: "action", label: "Site Web", required: false },
    { id: "linkedin", type: "social", label: "LinkedIn", required: false },
    { id: "location", type: "location", label: "Adresse", required: false },
  ],
};

/**
 * Extract dominant colors from an image
 * Uses Canvas API to analyze pixel data
 */
export async function extractColorsFromLogo(imageUrl: string): Promise<ColorPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          resolve(getDefaultPalette());
          return;
        }
        
        // Resize for performance
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        
        const imageData = ctx.getImageData(0, 0, size, size);
        const colors = analyzeColors(imageData);
        
        resolve(colors);
      } catch (error) {
        console.error("Color extraction failed:", error);
        resolve(getDefaultPalette());
      }
    };
    
    img.onerror = () => {
      console.error("Failed to load image for color extraction");
      resolve(getDefaultPalette());
    };
    
    img.src = imageUrl;
  });
}

/**
 * Analyze image data to extract dominant colors
 */
function analyzeColors(imageData: ImageData): ColorPalette {
  const pixels = imageData.data;
  const colorCounts: Record<string, number> = {};
  
  // Sample pixels
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Skip transparent pixels
    if (a < 128) continue;
    
    // Skip very light and very dark pixels
    const brightness = (r + g + b) / 3;
    if (brightness < 20 || brightness > 235) continue;
    
    // Quantize colors
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    
    const key = `${qr},${qg},${qb}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  }
  
  // Sort by frequency
  const sortedColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return rgbToHsl(r, g, b);
    });
  
  if (sortedColors.length === 0) {
    return getDefaultPalette();
  }
  
  const primary = sortedColors[0];
  const secondary = sortedColors[1] || adjustLightness(primary, -15);
  const accent = sortedColors[2] || adjustSaturation(primary, 20);
  
  return {
    primary: hslToString(primary),
    secondary: hslToString(secondary),
    accent: hslToString(accent),
    background: "0 0% 2%",
    foreground: "0 0% 98%",
  };
}

/**
 * RGB to HSL conversion
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * HSL to CSS string
 */
function hslToString([h, s, l]: [number, number, number]): string {
  return `${h} ${s}% ${l}%`;
}

/**
 * Adjust lightness
 */
function adjustLightness([h, s, l]: [number, number, number], amount: number): [number, number, number] {
  return [h, s, Math.max(0, Math.min(100, l + amount))];
}

/**
 * Adjust saturation
 */
function adjustSaturation([h, s, l]: [number, number, number], amount: number): [number, number, number] {
  return [h, Math.max(0, Math.min(100, s + amount)), l];
}

/**
 * Default palette fallback
 */
function getDefaultPalette(): ColorPalette {
  return {
    primary: "0 0% 100%",
    secondary: "0 0% 80%",
    accent: "220 100% 60%",
    background: "0 0% 2%",
    foreground: "0 0% 98%",
  };
}

/**
 * Get modules for a business sector
 */
export function getModulesForSector(sector: BusinessSector): BusinessModule[] {
  return SECTOR_MODULES[sector] || SECTOR_MODULES.business;
}

/**
 * Generate adaptive template from inputs
 */
export async function generateAdaptiveTemplate(
  logoUrl: string | null,
  sector: BusinessSector
): Promise<AdaptiveTemplate> {
  // Extract colors from logo
  const palette = logoUrl 
    ? await extractColorsFromLogo(logoUrl)
    : getDefaultPalette();
  
  // Get sector-specific modules
  const modules = getModulesForSector(sector);
  
  return {
    sector,
    palette,
    modules,
  };
}

/**
 * Apply palette as CSS custom properties
 */
export function applyPaletteToElement(element: HTMLElement, palette: ColorPalette) {
  element.style.setProperty("--template-primary", palette.primary);
  element.style.setProperty("--template-secondary", palette.secondary);
  element.style.setProperty("--template-accent", palette.accent);
  element.style.setProperty("--template-background", palette.background);
  element.style.setProperty("--template-foreground", palette.foreground);
}
