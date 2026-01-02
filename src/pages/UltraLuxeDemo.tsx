/**
 * Demo page for Ultra-Luxe VIP Template
 * Morocco VIP Premium Experience
 */

import { UltraLuxeTemplate } from "@/components/templates/UltraLuxeTemplate";
import ultraLuxeVideo from "@/assets/videos/ultra-luxe-showcase.mp4";

const demoData = {
  firstName: "Mohamed",
  lastName: "El Amrani",
  title: "CEO & Founder",
  company: "i-wasp Morocco",
  tagline: "L'excellence du networking digital au Maroc",
  photoUrl: undefined, // Will show initials
  videoUrl: ultraLuxeVideo,
  phone: "+212661234567",
  email: "contact@i-wasp.ma",
  whatsapp: "+212661234567",
  linkedin: "https://linkedin.com/in/mohamed-el-amrani",
  instagram: "https://instagram.com/iwasp.ma",
  website: "https://i-wasp.ma",
  location: "Casablanca, Maroc",
  calendly: "https://calendly.com/i-wasp",
};

export default function UltraLuxeDemo() {
  return <UltraLuxeTemplate data={demoData} />;
}
