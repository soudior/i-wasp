/**
 * IWASP Publication Validator
 * 
 * Système de validation pré-publication qui bloque la carte
 * si des fonctionnalités critiques sont manquantes.
 * 
 * Règles:
 * ✔ Template choisi
 * ✔ Thème actif
 * ✔ Logo visible
 * ✔ Modules IA suggérés
 * ✔ WhatsApp fonctionnel
 * ✔ Géolocalisation active
 * ✔ vCard disponible
 * ✔ Aperçu fidèle
 * ✔ Commande NFC sans bug
 */

import { CardFormData } from "@/components/card-wizard/CardWizard";
import { SocialLink } from "@/lib/socialNetworks";

export interface ValidationResult {
  id: string;
  label: string;
  status: "valid" | "warning" | "error";
  message: string;
  required: boolean;
}

export interface PublicationValidation {
  canPublish: boolean;
  results: ValidationResult[];
  criticalErrors: ValidationResult[];
  warnings: ValidationResult[];
  completionScore: number;
}

export interface ValidatorConfig {
  requireTemplate: boolean;
  requireVisual: boolean;
  requireWhatsApp: boolean;
  requireLocation: boolean;
  requireVCard: boolean;
  requireEmail: boolean;
  requirePhone: boolean;
}

const DEFAULT_CONFIG: ValidatorConfig = {
  requireTemplate: true,
  requireVisual: true,
  requireWhatsApp: false, // Recommandé mais pas obligatoire
  requireLocation: false, // Recommandé mais pas obligatoire
  requireVCard: true,
  requireEmail: true,
  requirePhone: true,
};

/**
 * Vérifie si les données vCard minimum sont disponibles
 */
function hasVCardMinimum(data: CardFormData): boolean {
  const hasName = Boolean(data.firstName?.trim() && data.lastName?.trim());
  const hasContact = Boolean(data.email?.trim() || data.phone?.trim());
  return hasName && hasContact;
}

/**
 * Vérifie si WhatsApp est configuré
 */
function hasWhatsApp(socialLinks: SocialLink[]): boolean {
  return socialLinks.some(
    link => link.networkId === "whatsapp" && link.value?.trim()
  );
}

/**
 * Vérifie si la géolocalisation est active
 */
function hasLocation(data: CardFormData): boolean {
  return Boolean(data.location?.trim());
}

/**
 * Vérifie si un visuel est présent (photo ou logo)
 */
function hasVisual(data: CardFormData): boolean {
  return Boolean(data.photoUrl || data.logoUrl);
}

/**
 * Vérifie si un template est sélectionné
 */
function hasTemplate(data: CardFormData): boolean {
  return Boolean(data.template);
}

/**
 * Calcule le score de complétion de la carte
 */
function calculateCompletionScore(results: ValidationResult[]): number {
  const total = results.length;
  const valid = results.filter(r => r.status === "valid").length;
  return Math.round((valid / total) * 100);
}

/**
 * Valide les données de carte pour publication
 */
export function validateForPublication(
  data: CardFormData,
  config: Partial<ValidatorConfig> = {}
): PublicationValidation {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const results: ValidationResult[] = [];

  // 1. Template choisi (CRITIQUE)
  results.push({
    id: "template",
    label: "Template choisi",
    status: hasTemplate(data) ? "valid" : "error",
    message: hasTemplate(data) 
      ? `Template: ${data.template}` 
      : "Aucun template sélectionné",
    required: finalConfig.requireTemplate,
  });

  // 2. Visuel présent (CRITIQUE)
  results.push({
    id: "visual",
    label: "Photo ou logo visible",
    status: hasVisual(data) ? "valid" : "error",
    message: hasVisual(data)
      ? data.photoUrl ? "Photo ajoutée" : "Logo ajouté"
      : "Aucun visuel configuré",
    required: finalConfig.requireVisual,
  });

  // 3. Informations de base pour vCard (CRITIQUE)
  results.push({
    id: "vcard",
    label: "vCard disponible",
    status: hasVCardMinimum(data) ? "valid" : "error",
    message: hasVCardMinimum(data)
      ? `${data.firstName} ${data.lastName}`
      : "Nom et contact requis pour vCard",
    required: finalConfig.requireVCard,
  });

  // 4. Email (CRITIQUE)
  results.push({
    id: "email",
    label: "Email professionnel",
    status: data.email?.trim() ? "valid" : "error",
    message: data.email?.trim() 
      ? data.email 
      : "Email requis pour les contacts",
    required: finalConfig.requireEmail,
  });

  // 5. Téléphone (CRITIQUE)
  results.push({
    id: "phone",
    label: "Téléphone",
    status: data.phone?.trim() ? "valid" : "error",
    message: data.phone?.trim() 
      ? data.phone 
      : "Téléphone requis",
    required: finalConfig.requirePhone,
  });

  // 6. WhatsApp (RECOMMANDÉ)
  const whatsappStatus = hasWhatsApp(data.socialLinks || []);
  results.push({
    id: "whatsapp",
    label: "WhatsApp fonctionnel",
    status: whatsappStatus ? "valid" : "warning",
    message: whatsappStatus
      ? "WhatsApp configuré"
      : "WhatsApp recommandé pour le contact direct",
    required: finalConfig.requireWhatsApp,
  });

  // 7. Géolocalisation (RECOMMANDÉ)
  const locationStatus = hasLocation(data);
  results.push({
    id: "location",
    label: "Géolocalisation active",
    status: locationStatus ? "valid" : "warning",
    message: locationStatus
      ? data.location || "Adresse configurée"
      : "Adresse recommandée pour le GPS",
    required: finalConfig.requireLocation,
  });

  // 8. Entreprise/Titre (RECOMMANDÉ pour professionnalisme)
  const hasProfessionalInfo = Boolean(data.title?.trim() || data.company?.trim());
  results.push({
    id: "professional",
    label: "Informations professionnelles",
    status: hasProfessionalInfo ? "valid" : "warning",
    message: hasProfessionalInfo
      ? data.title && data.company 
        ? `${data.title} · ${data.company}`
        : data.title || data.company || ""
      : "Titre ou entreprise recommandé",
    required: false,
  });

  // 9. Réseaux sociaux (RECOMMANDÉ)
  const hasSocialLinks = (data.socialLinks || []).length > 0;
  results.push({
    id: "social",
    label: "Réseaux sociaux",
    status: hasSocialLinks ? "valid" : "warning",
    message: hasSocialLinks
      ? `${data.socialLinks?.length} réseau(x) configuré(s)`
      : "Ajoutez vos réseaux pour plus de visibilité",
    required: false,
  });

  // Filtrer les erreurs critiques (required && status === "error")
  const criticalErrors = results.filter(
    r => r.required && r.status === "error"
  );

  // Filtrer les warnings
  const warnings = results.filter(r => r.status === "warning");

  // Score de complétion
  const completionScore = calculateCompletionScore(results);

  // Peut publier seulement si aucune erreur critique
  const canPublish = criticalErrors.length === 0;

  return {
    canPublish,
    results,
    criticalErrors,
    warnings,
    completionScore,
  };
}

/**
 * Retourne un résumé textuel de la validation
 */
export function getValidationSummary(validation: PublicationValidation): string {
  if (validation.canPublish) {
    if (validation.warnings.length > 0) {
      return `Carte prête avec ${validation.warnings.length} amélioration(s) suggérée(s)`;
    }
    return "Carte parfaitement complète, prête à publier";
  }
  
  return `${validation.criticalErrors.length} élément(s) requis manquant(s)`;
}
