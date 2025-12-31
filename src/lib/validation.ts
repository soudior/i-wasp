/**
 * IWASP Form Validation Utilities
 * Centralized validation with zod for all forms
 */

import { z } from "zod";

// Sanitization helpers
export function sanitizeString(value: string): string {
  return value.trim().replace(/[<>]/g, "");
}

export function sanitizePhone(value: string): string {
  // Remove all non-digit characters except + at the start
  const cleaned = value.trim();
  if (cleaned.startsWith("+")) {
    return "+" + cleaned.slice(1).replace(/[^\d]/g, "");
  }
  return cleaned.replace(/[^\d]/g, "");
}

export function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  
  // Basic URL sanitization - remove dangerous characters
  const sanitized = trimmed.replace(/[<>"'`;()]/g, "");
  
  // Ensure https:// prefix for LinkedIn URLs
  if (sanitized.includes("linkedin.com") && !sanitized.startsWith("http")) {
    return "https://" + sanitized;
  }
  
  return sanitized;
}

// Email validation regex (RFC 5322 simplified)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation regex (international format)
const phoneRegex = /^\+?[0-9\s\-().]{6,20}$/;

// LinkedIn URL regex
const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/;

// Lead capture form schema
export const leadCaptureSchema = z.object({
  firstname: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .transform(sanitizeString),
  email: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || emailRegex.test(val), {
      message: "Format d'email invalide",
    }),
  phone: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Format de téléphone invalide",
    }),
});

export type LeadCaptureData = z.infer<typeof leadCaptureSchema>;

// Client creation form schema (admin)
export const clientFormSchema = z.object({
  first_name: z
    .string()
    .min(1, "Le prénom est obligatoire")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .transform(sanitizeString),
  last_name: z
    .string()
    .min(1, "Le nom est obligatoire")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .transform(sanitizeString),
  title: z
    .string()
    .max(100, "Le poste ne peut pas dépasser 100 caractères")
    .optional()
    .transform((val) => sanitizeString(val || "")),
  company: z
    .string()
    .max(100, "L'entreprise ne peut pas dépasser 100 caractères")
    .optional()
    .transform((val) => sanitizeString(val || "")),
  phone: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Format de téléphone invalide (ex: +33 6 12 34 56 78)",
    }),
  email: z
    .string()
    .optional()
    .transform((val) => val?.trim() || "")
    .refine((val) => !val || emailRegex.test(val), {
      message: "Format d'email invalide",
    }),
  linkedin: z
    .string()
    .optional()
    .transform((val) => sanitizeUrl(val || ""))
    .refine((val) => !val || linkedinRegex.test(val), {
      message: "URL LinkedIn invalide (ex: https://linkedin.com/in/nom)",
    }),
  whatsapp: z
    .string()
    .optional()
    .transform((val) => sanitizePhone(val || ""))
    .refine((val) => !val || /^\+?[0-9]{6,20}$/.test(val), {
      message: "Format WhatsApp invalide (ex: +33612345678)",
    }),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

// Validation helper function
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { success: false, errors };
}
