// Print template types and constants

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

// Predefined print colors (CMYK-safe)
export const PRINT_COLORS = {
  black: { name: "Noir", hex: "#0a0a0a", cmyk: "0,0,0,100" },
  white: { name: "Blanc", hex: "#fafafa", cmyk: "0,0,0,0" },
  gold: { name: "Or", hex: "#d4af37", cmyk: "0,17,75,17" },
  silver: { name: "Argent", hex: "#c0c0c0", cmyk: "0,0,0,25" },
  navy: { name: "Bleu Navy", hex: "#1e3a5f", cmyk: "68,40,0,63" },
  burgundy: { name: "Bordeaux", hex: "#722f37", cmyk: "0,58,52,55" },
} as const;

export type PrintColor = keyof typeof PRINT_COLORS;

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

// Available print templates
export type PrintTemplateType = "classic" | "minimal" | "corporate" | "bold";

export const PRINT_TEMPLATES = {
  classic: {
    id: "classic",
    name: "Classique",
    description: "Design professionnel équilibré",
    logoPosition: { x: 12, y: 10, maxWidth: 25, maxHeight: 12 }, // mm
    namePosition: { x: 12, y: 28 },
    titlePosition: { x: 12, y: 35 },
    companyPosition: { x: 12, y: 42 },
    nfcIconPosition: { x: 70, y: 40 },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Ultra épuré et moderne",
    logoPosition: { x: 42.8, y: 8, maxWidth: 20, maxHeight: 10 }, // Centered
    namePosition: { x: 42.8, y: 27 }, // Centered
    titlePosition: { x: 42.8, y: 34 },
    companyPosition: { x: 42.8, y: 41 },
    nfcIconPosition: { x: 42.8, y: 48 },
    centered: true,
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Idéal pour les entreprises",
    logoPosition: { x: 60, y: 8, maxWidth: 20, maxHeight: 15 },
    namePosition: { x: 8, y: 32 },
    titlePosition: { x: 8, y: 39 },
    companyPosition: { x: 8, y: 46 },
    nfcIconPosition: { x: 75, y: 44 },
  },
  bold: {
    id: "bold",
    name: "Audacieux",
    description: "Impact visuel fort",
    logoPosition: { x: 8, y: 8, maxWidth: 30, maxHeight: 14 },
    namePosition: { x: 8, y: 30 },
    titlePosition: { x: 8, y: 40 },
    companyPosition: { x: 8, y: 48 },
    nfcIconPosition: { x: 70, y: 8 },
    largeName: true,
  },
} as const;

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
  isLocked: boolean;
  lockedAt?: string;
  validatedAt?: string;
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
