import type { CardFormData } from "@/components/card-wizard/CardWizard";
// Original vector illustration. No real person, customer or contact information.
const portrait = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#DDE4FF"/><circle cx="120" cy="95" r="44" fill="#C88760"/><path d="M73 99V78c0-61 98-61 96 5l-17-23-46 9-33 30" fill="#252333"/><path d="M48 240v-39c0-73 144-73 144 0v39" fill="#2447F9"/><path d="m98 156 22 39 22-39" fill="#F6F7FB"/><path d="M101 115q19 16 38 0" fill="none" stroke="#633C35" stroke-width="4"/><circle cx="103" cy="95" r="3"/><circle cx="137" cy="95" r="3"/></svg>`;
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
