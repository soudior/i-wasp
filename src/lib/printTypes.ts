// Print template types and constants for IWASP NFC Cards

// Real card dimensions in millimeters (ISO CR80)
export const CARD_DIMENSIONS = {
  WIDTH_MM: 85.6,
  HEIGHT_MM: 54,
  // With 3mm bleed
  BLEED_MM: 3,
  WIDTH_WITH_BLEED_MM: 91.6, // 85.6 + 6
  HEIGHT_WITH_BLEED_MM: 60, // 54 + 6
  // Safe zone (5mm from edge)
  SAFE_MARGIN_MM: 5,
  // NFC chip area (typically center-left, 20x20mm)
  NFC_ZONE: {
    X_MM: 8,
    Y_MM: 17,
    WIDTH_MM: 20,
    HEIGHT_MM: 20,
  },
  // Corner radius
  CORNER_RADIUS_MM: 3.18, // Standard card corner radius
};

// Convert mm to pixels at 300 DPI (print quality)
export const MM_TO_PX_300DPI = 11.811;
export const MM_TO_PX_96DPI = 3.78; // Screen resolution

// Pixel dimensions at 300 DPI
export const CARD_PIXELS_300DPI = {
  WIDTH: Math.round(CARD_DIMENSIONS.WIDTH_MM * MM_TO_PX_300DPI), // ~1011px
  HEIGHT: Math.round(CARD_DIMENSIONS.HEIGHT_MM * MM_TO_PX_300DPI), // ~638px
  WIDTH_WITH_BLEED: Math.round(CARD_DIMENSIONS.WIDTH_WITH_BLEED_MM * MM_TO_PX_300DPI),
  HEIGHT_WITH_BLEED: Math.round(CARD_DIMENSIONS.HEIGHT_WITH_BLEED_MM * MM_TO_PX_300DPI),
};

// Screen preview dimensions (scaled for UI, but proportionally correct)
export const PREVIEW_SCALE = 3.5; // Scale factor for preview
export const CARD_PREVIEW_PX = {
  WIDTH: Math.round(CARD_DIMENSIONS.WIDTH_MM * PREVIEW_SCALE), // ~300px
  HEIGHT: Math.round(CARD_DIMENSIONS.HEIGHT_MM * PREVIEW_SCALE), // ~189px
};

// ============= OFFICIAL IWASP COLOR PALETTES =============

// IWASP Black - Premium dark luxury
export const IWASP_BLACK_PALETTE = {
  background: "#0a0a0a",
  text: "#fafafa",
  accent: "#a0a0a0",
  subtle: "#404040",
};

// IWASP Pure - Clean Apple-like aesthetic
export const IWASP_PURE_PALETTE = {
  background: "#fafafa",
  text: "#1a1a1a",
  accent: "#6b7280",
  subtle: "#e5e5e5",
};

// IWASP Corporate - Business professional
export const IWASP_CORPORATE_PALETTE = {
  background: "#1e3a5f", // Navy blue
  text: "#ffffff",
  accent: "#94a3b8",
  subtle: "#2d4a73",
};

// Predefined print colors (CMYK-safe) - limited palette for print accuracy
export const PRINT_COLORS = {
  // IWASP Black Template Colors
  black: { 
    name: "Noir Premium", 
    hex: "#0a0a0a", 
    cmyk: "0,0,0,100",
    textColor: "#fafafa",
    accentColor: "#707070",
  },
  charcoal: { 
    name: "Anthracite", 
    hex: "#1c1c1e", 
    cmyk: "0,0,0,95",
    textColor: "#fafafa",
    accentColor: "#808080",
  },
  // IWASP Pure Template Colors
  white: { 
    name: "Blanc Pur", 
    hex: "#fafafa", 
    cmyk: "0,0,0,0",
    textColor: "#1a1a1a",
    accentColor: "#6b7280",
  },
  silver: { 
    name: "Argent", 
    hex: "#e8e8ed", 
    cmyk: "0,0,0,8",
    textColor: "#1a1a1a",
    accentColor: "#6b7280",
  },
  // IWASP Corporate Template Colors
  navy: { 
    name: "Bleu Navy", 
    hex: "#1e3a5f", 
    cmyk: "68,40,0,63",
    textColor: "#ffffff",
    accentColor: "#94a3b8",
  },
  slate: { 
    name: "Slate", 
    hex: "#334155", 
    cmyk: "50,30,0,67",
    textColor: "#ffffff",
    accentColor: "#94a3b8",
  },
  burgundy: { 
    name: "Bordeaux", 
    hex: "#722f37", 
    cmyk: "0,58,52,55",
    textColor: "#ffffff",
    accentColor: "#e8d5d7",
  },
  forest: { 
    name: "Forêt", 
    hex: "#1e3a2f", 
    cmyk: "48,0,19,77",
    textColor: "#ffffff",
    accentColor: "#a8d5c5",
  },
} as const;

export type PrintColor = keyof typeof PRINT_COLORS;

// ============= OFFICIAL IWASP TEMPLATES =============

export type PrintTemplateType = "iwasp-black" | "iwasp-pure" | "iwasp-corporate";

// Logo background options
export type LogoBackgroundType = "solid" | "image";

export interface LogoBackgroundConfig {
  type: LogoBackgroundType;
  color?: string; // For solid backgrounds
  imageUrl?: string; // For image backgrounds
  opacity?: number; // 0-100
  blur?: number; // 0-20px
}

// Logo quality requirements
export const LOGO_REQUIREMENTS = {
  MIN_WIDTH: 200, // pixels
  MIN_HEIGHT: 100, // pixels
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB for quality
  RECOMMENDED_WIDTH: 500, // pixels
  RECOMMENDED_HEIGHT: 250, // pixels
  ALLOWED_FORMATS: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
};

export interface TemplateConfig {
  id: PrintTemplateType;
  name: string;
  tagline: string;
  description: string;
  // Allowed colors for this template
  allowedColors: PrintColor[];
  defaultColor: PrintColor;
  // Typography settings
  typography: {
    nameSize: number; // mm
    nameFontWeight: number;
    nameLetterSpacing: number; // em
    titleSize: number;
    companySize: number;
  };
  // Fixed positions (mm from top-left) - LOGO IS PRIMARY ELEMENT
  logoPosition: { x: number; y: number; maxWidth: number; maxHeight: number };
  // Logo background area (larger than logo for visual impact)
  logoBackgroundArea: { x: number; y: number; width: number; height: number; borderRadius: number };
  namePosition: { x: number; y: number };
  titlePosition: { x: number; y: number };
  companyPosition: { x: number; y: number };
  nfcIconPosition: { x: number; y: number };
  brandPosition: { x: number; y: number };
  // Layout options
  centered?: boolean;
  showNfcIcon?: boolean;
  showBrand?: boolean;
}

export const PRINT_TEMPLATES: Record<PrintTemplateType, TemplateConfig> = {
  // 1️⃣ IWASP Black - Minimal Luxury (LOGO-CENTRIC)
  "iwasp-black": {
    id: "iwasp-black",
    name: "IWASP Black",
    tagline: "Luxury Premium",
    description: "Design minimaliste haut de gamme",
    allowedColors: ["black", "charcoal"],
    defaultColor: "black",
    typography: {
      nameSize: 3.8,
      nameFontWeight: 500,
      nameLetterSpacing: 0.08,
      titleSize: 2.2,
      companySize: 2.0,
    },
    // LARGE CENTERED LOGO - Primary visual element (x1.8 size increase)
    logoPosition: { x: 42.8, y: 12, maxWidth: 40, maxHeight: 18 },
    logoBackgroundArea: { x: 10, y: 6, width: 65.6, height: 26, borderRadius: 2 },
    namePosition: { x: 42.8, y: 36 },
    titlePosition: { x: 42.8, y: 42 },
    companyPosition: { x: 42.8, y: 47 },
    nfcIconPosition: { x: 78, y: 47 },
    brandPosition: { x: 78, y: 50 },
    centered: true,
    showNfcIcon: true,
    showBrand: true,
  },

  // 2️⃣ IWASP Pure - Apple-like Clean Tech (LOGO-CENTRIC)
  "iwasp-pure": {
    id: "iwasp-pure",
    name: "IWASP Pure",
    tagline: "Clean Tech",
    description: "Esthétique épurée style Apple",
    allowedColors: ["white", "silver"],
    defaultColor: "white",
    typography: {
      nameSize: 4.2,
      nameFontWeight: 600,
      nameLetterSpacing: 0.02,
      titleSize: 2.3,
      companySize: 2.1,
    },
    // LARGE LEFT-ALIGNED LOGO (x1.8 size increase)
    logoPosition: { x: 10, y: 10, maxWidth: 35, maxHeight: 16 },
    logoBackgroundArea: { x: 6, y: 5, width: 45, height: 24, borderRadius: 3 },
    namePosition: { x: 10, y: 34 },
    titlePosition: { x: 10, y: 40 },
    companyPosition: { x: 10, y: 46 },
    nfcIconPosition: { x: 75, y: 42 },
    brandPosition: { x: 78, y: 50 },
    centered: false,
    showNfcIcon: true,
    showBrand: true,
  },

  // 3️⃣ IWASP Corporate - B2B Professional (LOGO-CENTRIC)
  "iwasp-corporate": {
    id: "iwasp-corporate",
    name: "IWASP Corporate",
    tagline: "Business Pro",
    description: "Design B2B optimisé entreprise",
    allowedColors: ["navy", "slate", "burgundy", "forest"],
    defaultColor: "navy",
    typography: {
      nameSize: 3.6,
      nameFontWeight: 600,
      nameLetterSpacing: 0.03,
      titleSize: 2.2,
      companySize: 2.4,
    },
    // LARGE TOP-RIGHT LOGO (x1.8 size increase)
    logoPosition: { x: 60, y: 8, maxWidth: 28, maxHeight: 20 },
    logoBackgroundArea: { x: 50, y: 4, width: 32, height: 26, borderRadius: 2 },
    namePosition: { x: 10, y: 34 },
    titlePosition: { x: 10, y: 40 },
    companyPosition: { x: 10, y: 46 },
    nfcIconPosition: { x: 75, y: 46 },
    brandPosition: { x: 78, y: 50 },
    centered: false,
    showNfcIcon: true,
    showBrand: true,
  },
};

// Print template data structure
export interface PrintTemplateData {
  // Required fields
  printedName: string;
  // Optional fields
  printedTitle?: string;
  printedCompany?: string;
  logoUrl?: string;
  color: PrintColor;
  template: PrintTemplateType;
}

// Order customization data (locked after validation)
export interface PrintOrderData {
  orderId: string;
  quantity: number;
  cardColor: PrintColor;
  templateId: PrintTemplateType;
  printedName: string;
  printedTitle?: string;
  printedCompany?: string;
  logoUrl?: string;
  logoBackground?: LogoBackgroundConfig;
  isLocked: boolean;
  lockedAt?: string;
  validatedAt?: string;
}

// Helper to validate logo dimensions
export function validateLogoDimensions(width: number, height: number): { valid: boolean; message?: string } {
  if (width < LOGO_REQUIREMENTS.MIN_WIDTH || height < LOGO_REQUIREMENTS.MIN_HEIGHT) {
    return {
      valid: false,
      message: `Logo trop petit. Minimum: ${LOGO_REQUIREMENTS.MIN_WIDTH}x${LOGO_REQUIREMENTS.MIN_HEIGHT}px. Votre logo: ${width}x${height}px`,
    };
  }
  return { valid: true };
}

// Helper to check if logo meets recommended quality
export function checkLogoQuality(width: number, height: number): { isOptimal: boolean; message?: string } {
  if (width >= LOGO_REQUIREMENTS.RECOMMENDED_WIDTH && height >= LOGO_REQUIREMENTS.RECOMMENDED_HEIGHT) {
    return { isOptimal: true };
  }
  return {
    isOptimal: false,
    message: `Pour une qualité optimale, utilisez un logo d'au moins ${LOGO_REQUIREMENTS.RECOMMENDED_WIDTH}x${LOGO_REQUIREMENTS.RECOMMENDED_HEIGHT}px`,
  };
}

// Print sheet data for production
export interface PrintSheetData {
  orderId: string;
  orderNumber: string;
  quantity: number;
  cardColor: PrintColor;
  colorName: string;
  colorCMYK: string;
  templateId: PrintTemplateType;
  templateName: string;
  printedName: string;
  printedTitle?: string;
  printedCompany?: string;
  logoUrl?: string;
  createdAt: string;
  status: "pending" | "in_production" | "shipped" | "delivered";
}

// Helper to get template by ID
export function getTemplateConfig(templateId: PrintTemplateType): TemplateConfig {
  return PRINT_TEMPLATES[templateId];
}

// Helper to get color config
export function getColorConfig(colorId: PrintColor) {
  return PRINT_COLORS[colorId];
}

// Validate that a color is allowed for a template
export function isColorAllowedForTemplate(colorId: PrintColor, templateId: PrintTemplateType): boolean {
  const template = PRINT_TEMPLATES[templateId];
  return template.allowedColors.includes(colorId);
}
