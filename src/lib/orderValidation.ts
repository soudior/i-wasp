/**
 * IWASP Order Validation System
 * 
 * RULE: If an error is possible, the system is poorly designed.
 * 
 * - Smart blocking with disabled buttons
 * - Auto-corrections (https, spaces, normalized numbers)
 * - Real-time validation feedback
 * - Premium, human-friendly error messages
 */

import { z } from "zod";

// ════════════════════════════════════════════════════════════════
// SANITIZATION HELPERS
// ════════════════════════════════════════════════════════════════

/**
 * Normalize phone number to international format
 * Removes spaces, dashes, parentheses
 */
export function normalizePhone(value: string): string {
  if (!value) return "";
  
  let cleaned = value.trim();
  
  // Remove all non-digit characters except + at the start
  if (cleaned.startsWith("+")) {
    cleaned = "+" + cleaned.slice(1).replace(/[^\d]/g, "");
  } else {
    cleaned = cleaned.replace(/[^\d]/g, "");
    // Add + prefix if starts with country code
    if (cleaned.length >= 10 && !cleaned.startsWith("0")) {
      cleaned = "+" + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * Normalize URL - add https if missing
 */
export function normalizeUrl(value: string): string {
  if (!value) return "";
  
  let cleaned = value.trim().toLowerCase();
  
  // Remove dangerous characters
  cleaned = cleaned.replace(/[<>"'`;()]/g, "");
  
  // Add https if missing
  if (cleaned && !cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = "https://" + cleaned;
  }
  
  // Force https
  if (cleaned.startsWith("http://")) {
    cleaned = cleaned.replace("http://", "https://");
  }
  
  return cleaned;
}

/**
 * Normalize email - lowercase and trim
 */
export function normalizeEmail(value: string): string {
  if (!value) return "";
  return value.trim().toLowerCase();
}

/**
 * Normalize name - capitalize first letter
 */
export function normalizeName(value: string): string {
  if (!value) return "";
  const trimmed = value.trim().replace(/[<>]/g, "");
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Normalize WhatsApp number for wa.me link
 */
export function normalizeWhatsApp(value: string): string {
  if (!value) return "";
  
  // Remove all non-digit characters
  let cleaned = value.replace(/[^\d+]/g, "");
  
  // Remove leading + for wa.me
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }
  
  // Remove leading 00
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }
  
  return cleaned;
}

// ════════════════════════════════════════════════════════════════
// VALIDATION SCHEMAS
// ════════════════════════════════════════════════════════════════

// Email validation (RFC 5322 simplified)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Phone validation (international format)
const phoneRegex = /^\+?[0-9]{8,15}$/;

// URL validation
const urlRegex = /^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}(\/\S*)?$/;

/**
 * Personal Info Schema (Step 2)
 */
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "Ajoutez votre prénom pour continuer")
    .max(50, "Le prénom est trop long")
    .transform(normalizeName),
    
  lastName: z
    .string()
    .min(1, "Ajoutez votre nom pour continuer")
    .max(50, "Le nom est trop long")
    .transform(normalizeName),
    
  email: z
    .string()
    .min(1, "Ajoutez votre email pour continuer")
    .transform(normalizeEmail)
    .refine((val) => emailRegex.test(val), {
      message: "Vérifiez le format de votre email",
    }),
    
  phone: z
    .string()
    .min(1, "Ajoutez un numéro de téléphone")
    .transform(normalizePhone)
    .refine((val) => phoneRegex.test(val), {
      message: "Ajoutez un numéro valide (ex: +33612345678)",
    }),
    
  company: z
    .string()
    .max(100, "Le nom de l'entreprise est trop long")
    .optional()
    .transform((val) => val?.trim() || ""),
    
  title: z
    .string()
    .max(100, "Le titre est trop long")
    .optional()
    .transform((val) => val?.trim() || ""),
});

export type ValidatedPersonalInfo = z.infer<typeof personalInfoSchema>;

/**
 * Professional Info Schema (when customerType is 'entreprise' or 'professionnel')
 */
export const professionalInfoSchema = personalInfoSchema.extend({
  company: z
    .string()
    .min(1, "Ajoutez le nom de votre entreprise")
    .max(100, "Le nom de l'entreprise est trop long")
    .transform((val) => val?.trim() || ""),
});

/**
 * Location Schema (Step 3)
 */
export const locationSchema = z.object({
  address: z
    .string()
    .min(1, "Sélectionnez une adresse sur la carte"),
    
  latitude: z
    .number()
    .optional(),
    
  longitude: z
    .number()
    .optional(),
    
  label: z
    .string()
    .max(100)
    .optional()
    .transform((val) => val?.trim() || ""),
    
  city: z
    .string()
    .min(1, "Ajoutez la ville de livraison")
    .max(100),
    
  postalCode: z
    .string()
    .min(1, "Ajoutez le code postal")
    .max(20),
    
  country: z
    .string()
    .default("France"),
});

export type ValidatedLocation = z.infer<typeof locationSchema>;

/**
 * Design Config Schema (Step 4)
 */
export const designConfigSchema = z.object({
  logoUrl: z
    .string()
    .nullable()
    .refine((val) => val !== null && val.length > 0, {
      message: "Ajoutez un logo pour votre carte",
    }),
    
  cardColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Sélectionnez une couleur valide"),
    
  designPreviewUrl: z
    .string()
    .optional(),
});

export type ValidatedDesignConfig = z.infer<typeof designConfigSchema>;

/**
 * Order Options Schema (Step 5)
 */
export const orderOptionsSchema = z.object({
  quantity: z
    .number()
    .min(1, "Sélectionnez une quantité")
    .max(100, "Maximum 100 cartes par commande"),
    
  promoCode: z
    .string()
    .optional()
    .transform((val) => val?.toUpperCase().trim() || ""),
    
  promoDiscount: z
    .number()
    .min(0)
    .max(100)
    .optional(),
    
  unitPriceCents: z
    .number()
    .min(0),
    
  totalPriceCents: z
    .number()
    .min(0),
});

export type ValidatedOrderOptions = z.infer<typeof orderOptionsSchema>;

// ════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ════════════════════════════════════════════════════════════════

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors: Record<string, string>;
  isValid: boolean;
}

/**
 * Validate data against a schema with friendly error messages
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: {},
      isValid: true,
    };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return {
    success: false,
    errors,
    isValid: false,
  };
}

/**
 * Validate personal info
 */
export function validatePersonalInfo(
  data: unknown,
  customerType: string | null
): ValidationResult<ValidatedPersonalInfo> {
  const schema = customerType === "entreprise" || customerType === "professionnel"
    ? professionalInfoSchema
    : personalInfoSchema;
    
  return validateWithSchema(schema, data);
}

/**
 * Validate location
 */
export function validateLocation(data: unknown): ValidationResult<ValidatedLocation> {
  return validateWithSchema(locationSchema, data);
}

/**
 * Validate design config
 */
export function validateDesignConfig(data: unknown): ValidationResult<ValidatedDesignConfig> {
  return validateWithSchema(designConfigSchema, data);
}

/**
 * Validate order options
 */
export function validateOrderOptions(data: unknown): ValidationResult<ValidatedOrderOptions> {
  return validateWithSchema(orderOptionsSchema, data);
}

// ════════════════════════════════════════════════════════════════
// REAL-TIME FIELD VALIDATION
// ════════════════════════════════════════════════════════════════

export interface FieldStatus {
  isValid: boolean;
  isPending: boolean;
  message?: string;
}

/**
 * Validate email format in real-time
 */
export function validateEmailField(value: string): FieldStatus {
  if (!value.trim()) {
    return { isValid: false, isPending: false };
  }
  
  const normalized = normalizeEmail(value);
  const isValid = emailRegex.test(normalized);
  
  return {
    isValid,
    isPending: false,
    message: isValid ? undefined : "Email invalide",
  };
}

/**
 * Validate phone format in real-time
 */
export function validatePhoneField(value: string): FieldStatus {
  if (!value.trim()) {
    return { isValid: false, isPending: false };
  }
  
  const normalized = normalizePhone(value);
  const isValid = phoneRegex.test(normalized);
  
  return {
    isValid,
    isPending: false,
    message: isValid ? undefined : "Format: +33612345678",
  };
}

/**
 * Validate URL format in real-time
 */
export function validateUrlField(value: string): FieldStatus {
  if (!value.trim()) {
    return { isValid: true, isPending: false }; // Optional field
  }
  
  const normalized = normalizeUrl(value);
  const isValid = urlRegex.test(normalized);
  
  return {
    isValid,
    isPending: false,
    message: isValid ? undefined : "URL invalide",
  };
}

/**
 * Check if at least one contact method is provided
 */
export function hasValidContact(phone?: string, whatsapp?: string, email?: string): boolean {
  const hasPhone = phone && phoneRegex.test(normalizePhone(phone));
  const hasWhatsApp = whatsapp && phoneRegex.test(normalizePhone(whatsapp));
  const hasEmail = email && emailRegex.test(normalizeEmail(email));
  
  return !!(hasPhone || hasWhatsApp || hasEmail);
}

// ════════════════════════════════════════════════════════════════
// STEP COMPLETION CHECKS
// ════════════════════════════════════════════════════════════════

/**
 * Check if step 2 (personal info) can proceed
 */
export function canProceedFromPersonalInfo(
  data: unknown,
  customerType: string | null
): { canProceed: boolean; message?: string } {
  const result = validatePersonalInfo(data, customerType);
  
  if (result.isValid) {
    return { canProceed: true };
  }
  
  // Return first error message
  const firstError = Object.values(result.errors)[0];
  return {
    canProceed: false,
    message: firstError || "Complétez tous les champs requis",
  };
}

/**
 * Check if step 3 (location) can proceed
 */
export function canProceedFromLocation(data: unknown): { canProceed: boolean; message?: string } {
  const result = validateLocation(data);
  
  if (result.isValid) {
    return { canProceed: true };
  }
  
  const firstError = Object.values(result.errors)[0];
  return {
    canProceed: false,
    message: firstError || "Ajoutez votre localisation",
  };
}

/**
 * Check if step 4 (design) can proceed
 */
export function canProceedFromDesign(data: unknown): { canProceed: boolean; message?: string } {
  const result = validateDesignConfig(data);
  
  if (result.isValid) {
    return { canProceed: true };
  }
  
  const firstError = Object.values(result.errors)[0];
  return {
    canProceed: false,
    message: firstError || "Complétez le design de votre carte",
  };
}

/**
 * Check if step 5 (options) can proceed
 */
export function canProceedFromOptions(data: unknown): { canProceed: boolean; message?: string } {
  const result = validateOrderOptions(data);
  
  if (result.isValid) {
    return { canProceed: true };
  }
  
  const firstError = Object.values(result.errors)[0];
  return {
    canProceed: false,
    message: firstError || "Sélectionnez une quantité",
  };
}
