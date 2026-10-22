import { IWASP_WHATSAPP_E164 } from "@/lib/brandContact";
/**
 * Demo page for Ultra-Luxe VIP Template
 * Morocco VIP Premium Experience
 */

import { UltraLuxeTemplate } from "@/components/templates/UltraLuxeTemplate";

const demoData = {
  firstName: "i-wasp",
  lastName: "",
  title: "Cartes de visite NFC",
  company: "i-wasp",
  tagline: "Tap. Connect. Empower.",
  photoUrl: undefined, // Will show initials
  videoUrl: undefined, // Video removed for performance
  phone: IWASP_WHATSAPP_E164,
  email: "contact@i-wasp.com",
  whatsapp: IWASP_WHATSAPP_E164,
  linkedin: "https://linkedin.com/company/iwasp",
  instagram: "https://instagram.com/iwasp.ma",
  website: "https://i-wasp.com",
  location: "France",
  calendly: "https://calendly.com/i-wasp",
};

export default function UltraLuxeDemo() {
  return <UltraLuxeTemplate data={demoData} />;
}
