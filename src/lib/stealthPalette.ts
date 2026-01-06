/**
 * IWASP Stealth Luxury Palette
 * Palette premium cohérente pour tout le tunnel de commande
 * 
 * - Noir Émeraude Profond: #050807
 * - Argent Titane: #A5A9B4
 * - Platine: #D1D5DB
 */

export const STEALTH = {
  // Backgrounds
  bg: "#050807",
  bgCard: "#0A0C0B",
  bgCardHover: "#111312",
  bgInput: "#0F1110",
  
  // Borders
  border: "rgba(165, 169, 180, 0.1)",
  borderHover: "rgba(165, 169, 180, 0.2)",
  borderActive: "rgba(165, 169, 180, 0.4)",
  
  // Text
  text: "#D1D5DB",
  textSecondary: "rgba(165, 169, 180, 0.6)",
  textMuted: "rgba(165, 169, 180, 0.4)",
  
  // Accents
  accent: "#A5A9B4",
  accentHover: "#D1D5DB",
  accentMuted: "rgba(165, 169, 180, 0.15)",
  
  // Status
  success: "#4ADE80",
  successBg: "rgba(74, 222, 128, 0.1)",
  error: "#F87171",
  errorBg: "rgba(248, 113, 113, 0.1)",
  
  // Gradients
  gradientAccent: "linear-gradient(135deg, #A5A9B4, #D1D5DB)",
  
  // Shadows
  shadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
  shadowLg: "0 8px 40px rgba(0, 0, 0, 0.5)",
  glow: "0 0 40px rgba(165, 169, 180, 0.15)",
} as const;

// CSS-in-JS styles pour les inputs
export const stealthInputStyles = {
  backgroundColor: STEALTH.bgInput,
  borderColor: STEALTH.border,
  color: STEALTH.text,
  borderRadius: "12px",
};

// Classes Tailwind pour usage cohérent
export const stealthClasses = {
  card: "bg-[#0A0C0B] border border-[rgba(165,169,180,0.1)] rounded-3xl",
  input: "bg-[#0F1110] border-[rgba(165,169,180,0.2)] text-[#D1D5DB] placeholder:text-[rgba(165,169,180,0.4)] rounded-xl focus:border-[#A5A9B4]",
  button: "bg-[#A5A9B4] text-[#050807] hover:bg-[#D1D5DB] font-semibold rounded-full",
  buttonGhost: "bg-transparent border border-[rgba(165,169,180,0.2)] text-[#D1D5DB] hover:bg-[rgba(165,169,180,0.1)]",
};
