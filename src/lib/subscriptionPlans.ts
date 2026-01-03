/**
 * Subscription Plans Configuration
 * ONLY 2 plans: FREE (discovery) and GOLD (premium)
 */

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "FREE",
    tagline: "Découverte",
    description: "Pour tester iWasp et découvrir le NFC",
    price: 0,
    currency: "MAD",
    period: "",
    color: "zinc",
    features: {
      nfcCard: true,
      digitalProfile: "basic",
      socialLinks: 3,
      stories: 0,
      analytics: false,
      leadCapture: false,
      pushNotifications: false,
      badge: false,
      aiCoach: false,
      templates: 1,
      support: "community",
    },
    limits: {
      maxSocialLinks: 3,
      maxStories: 0,
      maxTemplates: 1,
    },
  },
  GOLD: {
    id: "gold",
    name: "GOLD",
    tagline: "Premium Illimité",
    description: "La solution complète pour les professionnels",
    price: 490,
    currency: "MAD",
    period: "/an",
    color: "gold",
    features: {
      nfcCard: true,
      digitalProfile: "unlimited",
      socialLinks: Infinity,
      stories: Infinity,
      analytics: true,
      leadCapture: true,
      pushNotifications: true,
      badge: true,
      aiCoach: true,
      templates: Infinity,
      support: "priority",
    },
    limits: {
      maxSocialLinks: Infinity,
      maxStories: Infinity,
      maxTemplates: Infinity,
    },
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

// Feature comparison for display
export const FEATURE_COMPARISON = [
  { 
    name: "Carte NFC Premium", 
    free: "1 carte", 
    gold: "1 carte",
    category: "base"
  },
  { 
    name: "Profil digital", 
    free: "Basique", 
    gold: "Illimité",
    category: "profile"
  },
  { 
    name: "Liens sociaux", 
    free: "3 maximum", 
    gold: "Illimités",
    category: "profile"
  },
  { 
    name: "Templates métiers", 
    free: "1 template", 
    gold: "Tous les templates",
    category: "design"
  },
  { 
    name: "Stories 24h", 
    free: false, 
    gold: "Illimitées",
    category: "engagement"
  },
  { 
    name: "Dashboard Analytics", 
    free: false, 
    gold: true,
    category: "analytics"
  },
  { 
    name: "Capture de Leads", 
    free: false, 
    gold: true,
    category: "business"
  },
  { 
    name: "Push Notifications", 
    free: false, 
    gold: true,
    category: "engagement"
  },
  { 
    name: "Badge Certifié GOLD", 
    free: false, 
    gold: true,
    category: "trust"
  },
  { 
    name: "Coach IA personnalisé", 
    free: false, 
    gold: true,
    category: "support"
  },
  { 
    name: "Export leads Excel", 
    free: false, 
    gold: true,
    category: "business"
  },
  { 
    name: "Support", 
    free: "Email", 
    gold: "Prioritaire 24/7",
    category: "support"
  },
] as const;
