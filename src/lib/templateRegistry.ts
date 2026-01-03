/**
 * Template Registry System
 * Controls template visibility and access
 * 
 * Types:
 * - public: Visible in public gallery
 * - private: Admin only, not visible in public gallery
 * - client: Assigned to specific client, not in gallery
 */

export type TemplateVisibility = "public" | "private" | "client";

export interface TemplateRegistryEntry {
  id: string;
  name: string;
  visibility: TemplateVisibility;
  // Optional: specific client ID if visibility is "client"
  clientId?: string;
  // Optional: description for admin panel
  description?: string;
  // Template component path/identifier
  component: string;
  // Category for filtering
  category?: string;
  // Creation date
  createdAt: string;
  // Branding options for private templates
  hideBranding?: boolean;
}

// Template Registry - Single source of truth for all templates
export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = [
  // ===== PUBLIC TEMPLATES =====
  {
    id: "ultra-luxe",
    name: "Morocco VIP",
    visibility: "public",
    component: "UltraLuxeTemplate",
    category: "vip",
    description: "Noir mat & or 24 carats. L'excellence pour les clients VIP.",
    createdAt: "2024-01-01",
  },
  {
    id: "signature",
    name: "Executive Pro",
    visibility: "public",
    component: "IWASPSignatureTemplate",
    category: "business",
    description: "Design minimaliste noir & or pour dirigeants.",
    createdAt: "2024-01-01",
  },
  {
    id: "executive",
    name: "Corporate Elite",
    visibility: "public",
    component: "ExecutiveTemplate",
    category: "business",
    description: "Bleu nuit profond avec accents dorés.",
    createdAt: "2024-01-01",
  },
  {
    id: "luxe",
    name: "Prestige Immo",
    visibility: "public",
    component: "LuxeTemplate",
    category: "immobilier",
    description: "Or champagne premium pour l'immobilier de luxe.",
    createdAt: "2024-01-01",
  },
  {
    id: "hotel",
    name: "Luxury Living",
    visibility: "public",
    component: "LuxuryHotelTemplate",
    category: "immobilier",
    description: "Marbre et or pour l'immobilier haut de gamme.",
    createdAt: "2024-01-01",
  },
  {
    id: "minimal",
    name: "MedPro",
    visibility: "public",
    component: "MinimalTemplate",
    category: "sante",
    description: "Design sobre pour professionnels de santé.",
    createdAt: "2024-01-01",
  },
  {
    id: "tourism",
    name: "WellCare",
    visibility: "public",
    component: "TourismTemplate",
    category: "sante",
    description: "Tons apaisants pour thérapeutes et coachs.",
    createdAt: "2024-01-01",
  },
  {
    id: "luxury",
    name: "Creative Studio",
    visibility: "public",
    component: "LuxuryProfile",
    category: "creatifs",
    description: "Design audacieux pour artistes et créatifs.",
    createdAt: "2024-01-01",
  },
  {
    id: "palace",
    name: "Palace Prestige",
    visibility: "public",
    component: "HotelConciergeTemplate",
    category: "hotellerie",
    description: "Design élégant pour hôtels 5 étoiles.",
    createdAt: "2024-01-01",
  },
  {
    id: "riad",
    name: "Riad Marocain",
    visibility: "public",
    component: "RiadTemplate",
    category: "hotellerie",
    description: "Inspiration orientale pour riads et maisons d'hôtes.",
    createdAt: "2024-01-01",
  },
  {
    id: "rental-concierge",
    name: "Conciergerie Luxe",
    visibility: "public",
    component: "RentalConciergeTemplate",
    category: "rental",
    description: "Réception numérique pour locations saisonnières.",
    createdAt: "2024-01-01",
  },
  {
    id: "vcard-airbnb-booking",
    name: "vCard Airbnb Booking",
    visibility: "public",
    component: "VCardAirbnbBookingTemplate",
    category: "rental",
    description: "Carte digitale NFC premium pour Airbnb, Booking, Riads. Optimisée pour avis et réservations.",
    createdAt: "2025-01-03",
  },

  // ===== PRIVATE TEMPLATES (Admin Only) =====
  {
    id: "autoschluessel",
    name: "Autoschlüssel Service",
    visibility: "private",
    component: "AutoschluesselTemplate",
    category: "automotive",
    description: "Template allemand pour service automobile. Assignation manuelle uniquement.",
    createdAt: "2024-01-03",
    hideBranding: true, // No IWASP branding on private templates
  },

  // ===== CLIENT-SPECIFIC TEMPLATES =====
  // Add client-specific templates here with clientId
];

/**
 * Get templates visible in public gallery
 */
export function getPublicTemplates(): TemplateRegistryEntry[] {
  return TEMPLATE_REGISTRY.filter((t) => t.visibility === "public");
}

/**
 * Get all templates (for admin)
 */
export function getAllTemplates(): TemplateRegistryEntry[] {
  return TEMPLATE_REGISTRY;
}

/**
 * Get private templates (admin only)
 */
export function getPrivateTemplates(): TemplateRegistryEntry[] {
  return TEMPLATE_REGISTRY.filter((t) => t.visibility === "private");
}

/**
 * Get templates assigned to a specific client
 */
export function getClientTemplates(clientId: string): TemplateRegistryEntry[] {
  return TEMPLATE_REGISTRY.filter(
    (t) => t.visibility === "client" && t.clientId === clientId
  );
}

/**
 * Get templates accessible by a user
 * - Public templates are always accessible
 * - Private templates only for admins
 * - Client templates only for the assigned client
 */
export function getAccessibleTemplates(
  isAdmin: boolean,
  userId?: string
): TemplateRegistryEntry[] {
  return TEMPLATE_REGISTRY.filter((t) => {
    if (t.visibility === "public") return true;
    if (t.visibility === "private" && isAdmin) return true;
    if (t.visibility === "client" && t.clientId === userId) return true;
    return false;
  });
}

/**
 * Check if a template exists and is accessible
 */
export function isTemplateAccessible(
  templateId: string,
  isAdmin: boolean,
  userId?: string
): boolean {
  const template = TEMPLATE_REGISTRY.find((t) => t.id === templateId);
  if (!template) return false;

  if (template.visibility === "public") return true;
  if (template.visibility === "private" && isAdmin) return true;
  if (template.visibility === "client" && template.clientId === userId) return true;
  
  return false;
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): TemplateRegistryEntry | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === templateId);
}

/**
 * Get visibility label for display
 */
export function getVisibilityLabel(visibility: TemplateVisibility): string {
  switch (visibility) {
    case "public":
      return "Public";
    case "private":
      return "Privé (Admin)";
    case "client":
      return "Client spécifique";
    default:
      return "Inconnu";
  }
}

/**
 * Get visibility color for badges
 */
export function getVisibilityColor(visibility: TemplateVisibility): string {
  switch (visibility) {
    case "public":
      return "bg-emerald-500/20 text-emerald-400";
    case "private":
      return "bg-amber-500/20 text-amber-400";
    case "client":
      return "bg-blue-500/20 text-blue-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

/**
 * Check if branding should be hidden for a template
 * Private and client templates can have branding hidden
 */
export function shouldHideBranding(templateId: string): boolean {
  const template = TEMPLATE_REGISTRY.find((t) => t.id === templateId);
  if (!template) return false;
  
  // Private templates hide branding by default
  if (template.visibility === "private") return template.hideBranding !== false;
  
  // Client templates can optionally hide branding
  if (template.visibility === "client") return template.hideBranding === true;
  
  return false;
}

/**
 * Check if template is white-label (no IWASP branding)
 */
export function isWhiteLabelTemplate(templateId: string): boolean {
  return shouldHideBranding(templateId);
}
