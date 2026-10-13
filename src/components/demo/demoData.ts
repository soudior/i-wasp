import type { CardFormData } from "@/components/card-wizard/CardWizard";
// Neutral placeholder until the owner supplies an authorized real photograph.
const portrait = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#262522"/><rect x="18" y="18" width="204" height="204" fill="none" stroke="#777065"/><text x="120" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" fill="#E2D8C8">VOTRE PHOTO</text><text x="120" y="140" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#C6C0B6">À AJOUTER</text></svg>`;
export const demoData: CardFormData = {
  firstName: "Camille",
  lastName: "Exemple",
  title: "Responsable de l’accueil",
  company: "Maison Exemple · démonstration",
  email: "camille@example.invalid",
  phone: "",
  website: "https://example.invalid",
  tagline: "Un accueil attentionné, un contact facile à retrouver.",
  photoUrl: `data:image/svg+xml,${encodeURIComponent(portrait)}`,
  logoUrl: null,
  location: "Ville de démonstration",
  template: "signature",
  socialLinks: [],
};
