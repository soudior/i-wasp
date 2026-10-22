/**
 * Official i-wasp contact used by the order funnel and public pages.
 * Source of truth: the number already wired through the express checkout
 * and the public contact page (+33 6 26 42 43 94). Do not invent another.
 */
export const IWASP_WHATSAPP_E164 = "+33626424394";
export const IWASP_WHATSAPP_DISPLAY = "+33 6 26 42 43 94";
export const IWASP_WHATSAPP_WA = "33626424394";

export function iwaspWhatsAppUrl(text?: string): string {
  const base = `https://wa.me/${IWASP_WHATSAPP_WA}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
