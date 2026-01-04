/**
 * i-Wasp Concierge Services
 * 
 * 3 niveaux de service de conciergerie digitale :
 * - ESSENTIEL : Accès de base à la conciergerie
 * - SIGNATURE : L'expérience complète (POPULAIRE)
 * - ÉLITE : Service sur-mesure entreprises
 * 
 * Tous les prix en Dirhams Marocains (DH)
 * La carte physique est INCLUSE dans chaque service.
 */

export const SUBSCRIPTION_PLANS = {
  ESSENTIEL: {
    id: "essentiel",
    name: "Essentiel",
    tagline: "Votre entrée dans la conciergerie",
    description: "L'accès à notre service de gestion d'identité digitale.",
    priceMonthly: 0,
    priceAnnual: 0,
    setupFee: 290, // Frais de mise en service unique (carte incluse)
    currency: "DH",
    period: "",
    isPopular: false,
    
    included: [
      "Carte NFC premium incluse",
      "Profil digital personnalisé",
      "Photo et informations essentielles",
      "3 liens de contact",
      "QR code de partage",
      "Accès à votre espace",
    ],
    
    excluded: [
      "Mise à jour illimitée du profil",
      "Templates premium",
      "Statistiques de visites",
      "Capture de contacts",
      "Support prioritaire",
    ],
    
    features: {
      nfcCards: 1,
      digitalProfile: "basic",
      profilePhoto: true,
      essentialInfo: true,
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
      maxTemplates: 1,
    },
  },
  
  SIGNATURE: {
    id: "signature",
    name: "Signature",
    tagline: "L'expérience conciergerie complète",
    description: "Nous gérons votre identité professionnelle. Vous vous concentrez sur l'essentiel.",
    priceMonthly: 49,
    priceAnnual: 490,
    setupFee: 0, // Inclus
    savingsAnnual: 2,
    currency: "DH",
    periodMonthly: "/mois",
    periodAnnual: "/an",
    isPopular: true, // MISE EN AVANT
    
    included: [
      "Carte NFC premium incluse",
      "Profil 100% dynamique",
      "Mises à jour illimitées",
      "Liens et sections illimités",
      "Templates premium au choix",
      "Statistiques de visites",
      "Capture automatique de contacts",
      "Export de vos contacts",
      "Support prioritaire",
      "Sans branding i-Wasp",
    ],
    
    businessFeatures: [
      "Dashboard de suivi",
      "Notifications de visite",
      "Badge Signature",
      "Conseiller IA dédié",
      "Intégration CRM",
    ],
    
    excluded: [],
    
    features: {
      nfcCards: Infinity,
      digitalProfile: "dynamic",
      profilePhoto: true,
      essentialInfo: true,
      socialLinks: Infinity,
      dynamicSections: true,
      realTimeUpdate: true,
      premiumTemplates: true,
      advancedCustomization: true,
      qrCode: "custom",
      removeBranding: true,
      scanStats: true,
      analytics: true,
      leadCapture: true,
      pushNotifications: true,
      badge: true,
      aiCoach: true,
      crmIntegration: true,
      excelExport: true,
      prioritySupport: true,
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
  
  ELITE: {
    id: "elite",
    name: "Élite",
    tagline: "Service sur-mesure",
    description: "Une conciergerie dédiée pour votre équipe ou votre entreprise.",
    priceCustom: true,
    currency: "DH",
    isPopular: false,
    
    included: [
      "Tout Signature inclus",
      "Cartes pour toute l'équipe",
      "Design unifié entreprise",
      "Gestion centralisée",
      "Interlocuteur dédié",
      "Formation incluse",
      "SLA personnalisé",
    ],
    
    features: {
      everything: true,
      teamManagement: true,
      dedicatedSupport: true,
      customBranding: true,
      slaGuarantee: true,
    },
  },
  
  // Legacy aliases for compatibility
  FREE: {
    id: "free",
    name: "Essentiel",
    tagline: "Votre entrée dans la conciergerie",
    priceMonthly: 0,
    priceAnnual: 0,
    currency: "DH",
    period: "",
    included: [
      "Carte NFC premium incluse",
      "Profil digital personnalisé",
      "3 liens de contact",
      "QR code de partage",
    ],
    features: {
      nfcCards: 1,
      socialLinks: 3,
      premiumTemplates: false,
      scanStats: false,
      leadCapture: false,
      prioritySupport: false,
    },
    limits: {
      maxSocialLinks: 3,
      maxStories: 0,
      maxTemplates: 1,
    },
  },
  
  GOLD: {
    id: "gold",
    name: "Signature",
    tagline: "L'expérience conciergerie complète",
    priceMonthly: 49,
    priceAnnual: 490,
    savingsAnnual: 2,
    currency: "DH",
    periodMonthly: "/mois",
    periodAnnual: "/an",
    included: [
      "Carte NFC premium incluse",
      "Profil 100% dynamique",
      "Mises à jour illimitées",
      "Templates premium",
      "Statistiques de visites",
      "Capture de contacts",
      "Support prioritaire",
    ],
    businessFeatures: [
      "Dashboard de suivi",
      "Notifications de visite",
      "Badge Signature",
      "Conseiller IA",
    ],
    features: {
      nfcCards: Infinity,
      socialLinks: Infinity,
      premiumTemplates: true,
      scanStats: true,
      leadCapture: true,
      prioritySupport: true,
      analytics: true,
      removeBranding: true,
    },
    limits: {
      maxSocialLinks: Infinity,
      maxStories: Infinity,
      maxTemplates: Infinity,
    },
  },
} as const;

export type PlanId = "essentiel" | "signature" | "elite" | "free" | "gold";
export type Plan = typeof SUBSCRIPTION_PLANS.ESSENTIEL | typeof SUBSCRIPTION_PLANS.SIGNATURE;

export function getPlan(planId: PlanId): Plan {
  if (planId === "signature" || planId === "gold") {
    return SUBSCRIPTION_PLANS.SIGNATURE;
  }
  return SUBSCRIPTION_PLANS.ESSENTIEL;
}

export function isPremiumPlan(planId: string): boolean {
  return planId === "signature" || planId === "gold" || planId === "elite";
}

// Feature comparison pour affichage tableau
export const FEATURE_COMPARISON = [
  { name: "Carte NFC premium", free: "Incluse", gold: "Incluse", category: "base" },
  { name: "Profil digital", free: "Standard", gold: "Dynamique", category: "profile" },
  { name: "Mises à jour", free: "Limitées", gold: "Illimitées", category: "profile" },
  { name: "Liens de contact", free: "3 maximum", gold: "Illimités", category: "profile" },
  { name: "QR code", free: "Standard", gold: "Personnalisé", category: "base" },
  { name: "Templates", free: "1", gold: "Tous premium", category: "design" },
  { name: "Statistiques de visites", free: false, gold: true, category: "analytics" },
  { name: "Capture de contacts", free: false, gold: true, category: "business" },
  { name: "Export des contacts", free: false, gold: true, category: "business" },
  { name: "Notifications", free: false, gold: true, category: "engagement" },
  { name: "Sans branding i-Wasp", free: false, gold: true, category: "branding" },
  { name: "Badge Signature", free: false, gold: true, category: "trust" },
  { name: "Conseiller IA", free: false, gold: true, category: "support" },
  { name: "Support", free: "Standard", gold: "Prioritaire", category: "support" },
] as const;

export function hasFeature(planId: PlanId, feature: string): boolean {
  const plan = getPlan(planId);
  const value = (plan.features as Record<string, unknown>)[feature];
  if (value === true || value === Infinity) return true;
  if (typeof value === "string" && value !== "basic") return true;
  return false;
}
