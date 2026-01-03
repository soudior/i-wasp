/**
 * Subscription Plans Configuration
 * ONLY 2 plans: FREE (discovery) and GOLD (premium)
 * 
 * FREE = Découverte fonctionnelle mais limitée
 * GOLD = Solution premium complète
 */

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "FREE",
    tagline: "Découverte",
    description: "Testez iWasp gratuitement avec les fonctionnalités essentielles",
    price: 0,
    currency: "MAD",
    period: "",
    color: "zinc",
    
    // Ce qui est INCLUS dans FREE
    included: [
      "1 carte NFC active",
      "1 profil digital basique",
      "Informations essentielles (nom, poste, entreprise)",
      "Photo de profil",
      "Jusqu'à 3 liens",
      "QR code basique",
      "Accès à l'application",
    ],
    
    // Ce qui N'EST PAS inclus dans FREE
    excluded: [
      "Templates premium",
      "Statistiques de scans",
      "Options dynamiques",
      "Personnalisation avancée",
      "Suppression du branding iWasp",
      "Stories 24h",
      "Capture de leads",
      "Push notifications",
      "Badge certifié",
      "Coach IA",
      "Support prioritaire",
    ],
    
    features: {
      nfcCards: 1,
      digitalProfile: "basic",
      profilePhoto: true,
      essentialInfo: true, // nom, poste, entreprise
      socialLinks: 3,
      qrCode: "basic",
      appAccess: true,
      premiumTemplates: false,
      scanStats: false,
      dynamicOptions: false,
      advancedCustomization: false,
      removeBranding: false,
      stories: false,
      analytics: false,
      leadCapture: false,
      pushNotifications: false,
      badge: false,
      aiCoach: false,
      prioritySupport: false,
    },
    
    limits: {
      maxNfcCards: 1,
      maxSocialLinks: 3,
      maxStories: 0,
      maxTemplates: 1, // template basique uniquement
    },
  },
  
  GOLD: {
    id: "gold",
    name: "GOLD",
    tagline: "Solution Business",
    description: "La solution business complète pour les professionnels",
    price: 490,
    currency: "MAD",
    period: "/an",
    color: "gold",
    
    // Fonctionnalités GOLD - Solution Business Premium
    included: [
      "Carte NFC avec profil 100% dynamique",
      "Liens illimités",
      "Sections dynamiques (boutons, CTA)",
      "Templates premium (Business, Tech, Immobilier, Creator)",
      "Personnalisation complète du profil",
      "Statistiques de scans (vues, clics)",
      "Mise à jour en temps réel",
      "QR code personnalisé",
      "Suppression du branding iWasp",
      "Support prioritaire",
    ],
    
    // Avantages business additionnels
    businessFeatures: [
      "Capture de leads automatique",
      "Dashboard analytics avancé",
      "Export Excel des contacts",
      "Push notifications",
      "Badge Certifié GOLD",
      "Coach IA personnalisé",
      "Intégration CRM",
    ],
    
    excluded: [], // GOLD a tout
    
    features: {
      // Profil dynamique
      nfcCards: Infinity,
      digitalProfile: "dynamic", // 100% dynamique
      profilePhoto: true,
      essentialInfo: true,
      socialLinks: Infinity, // Illimités
      dynamicSections: true, // Boutons, CTA
      realTimeUpdate: true, // Mise à jour en temps réel
      
      // Templates & Personnalisation
      premiumTemplates: true, // Business, Tech, Immobilier, Creator
      advancedCustomization: true, // Personnalisation complète
      qrCode: "custom", // QR code personnalisé
      removeBranding: true, // Sans branding iWasp
      
      // Analytics & Stats
      scanStats: true, // Vues, clics
      analytics: true,
      
      // Business Features
      leadCapture: true,
      pushNotifications: true,
      badge: true,
      aiCoach: true,
      crmIntegration: true,
      excelExport: true,
      
      // Support
      prioritySupport: true,
      
      // Legacy compatibility
      appAccess: true,
      stories: true,
      dynamicOptions: true,
    },
    
    limits: {
      maxNfcCards: Infinity,
      maxSocialLinks: Infinity,
      maxStories: Infinity,
      maxTemplates: Infinity,
      maxDynamicSections: Infinity,
    },
    
    // Templates disponibles avec GOLD
    availableTemplates: [
      "Business",
      "Tech",
      "Immobilier", 
      "Creator",
      "Luxury",
      "Minimal",
      "Corporate",
    ],
  },
} as const;

export type PlanId = "free" | "gold";
export type Plan = typeof SUBSCRIPTION_PLANS.FREE | typeof SUBSCRIPTION_PLANS.GOLD;

export function getPlan(planId: PlanId): Plan {
  return planId === "gold" ? SUBSCRIPTION_PLANS.GOLD : SUBSCRIPTION_PLANS.FREE;
}

export function isPremiumPlan(planId: string): boolean {
  return planId === "gold" || planId === "premium";
}

// Feature comparison pour affichage tableau
export const FEATURE_COMPARISON = [
  // Inclus dans FREE
  { name: "Carte NFC active", free: "1 carte", gold: "Illimité", category: "base" },
  { name: "Profil digital", free: "Basique", gold: "Illimité", category: "profile" },
  { name: "Photo de profil", free: true, gold: true, category: "profile" },
  { name: "Infos essentielles", free: true, gold: true, category: "profile" },
  { name: "Liens sociaux", free: "3 maximum", gold: "Illimités", category: "profile" },
  { name: "QR code", free: "Basique", gold: "Avancé", category: "base" },
  { name: "Accès application", free: true, gold: true, category: "base" },
  
  // Exclusif GOLD
  { name: "Templates premium", free: false, gold: "Tous", category: "design" },
  { name: "Statistiques de scans", free: false, gold: true, category: "analytics" },
  { name: "Options dynamiques", free: false, gold: true, category: "features" },
  { name: "Personnalisation avancée", free: false, gold: true, category: "design" },
  { name: "Sans branding iWasp", free: false, gold: true, category: "branding" },
  { name: "Stories 24h", free: false, gold: "Illimitées", category: "engagement" },
  { name: "Capture de Leads + CRM", free: false, gold: true, category: "business" },
  { name: "Push Notifications", free: false, gold: true, category: "engagement" },
  { name: "Badge Certifié GOLD", free: false, gold: true, category: "trust" },
  { name: "Coach IA personnalisé", free: false, gold: true, category: "support" },
  { name: "Support", free: "Email", gold: "Prioritaire 24/7", category: "support" },
] as const;

// Helper pour vérifier si une feature est disponible selon le plan
export function hasFeature(planId: PlanId, feature: keyof typeof SUBSCRIPTION_PLANS.FREE.features): boolean {
  const plan = getPlan(planId);
  const value = plan.features[feature as keyof typeof plan.features];
  if (value === true || value === Infinity) return true;
  if (typeof value === "string" && value !== "basic") return true;
  return false;
}
