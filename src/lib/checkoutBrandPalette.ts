import { BRAND } from "@/lib/brandPalette";

/** Express checkout presentation only. Never used for saved card designs. */
export const CHECKOUT_BRAND = {
  ...BRAND,
  overlay: "rgba(3, 3, 3, 0.96)",
  shadowMd: "0 8px 28px rgba(0, 0, 0, 0.28)",
  radiusMd: "12px",
  radiusLg: "16px",
  // Preserve the existing semantic success/error colors.
  success: "#34C759",
  successBg: "rgba(52, 199, 89, 0.1)",
  error: "#FF3B30",
} as const;
