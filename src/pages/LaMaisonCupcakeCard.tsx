/**
 * La Maison Cupcake - Carte de visite digitale premium
 * Style pâtisserie raffinée avec tons rose poudré et accents corail
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Globe,
  UserPlus,
  Heart,
  Cake,
  ChefHat,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { IWASPBrandingFooter } from "@/components/IWASPBrandingFooter";

// Palette pâtisserie élégante basée sur le branding du site
const CUPCAKE_COLORS = {
  background: "#FDF8F9",
  card: "#FFFFFF",
  primary: "#C58791",
  primaryLight: "#DBBDC2",
  primaryDark: "#A66A75",
  accent: "#E8A4AE",
  text: "#2D2D2D",
  textMuted: "#6B6B6B",
  cream: "#FEF6F3",
};

// Informations de contact La Maison Cupcake
const CONTACT = {
  name: "La Maison Cupcake",
  title: "Pâtisserie Artisanale",
  tagline: "Des créations gourmandes faites avec amour",
  phone: "+33 6 00 00 00 00",
  email: "contact@lamaisoncupcake.com",
  website: "https://lamaisoncupcake.com",
  instagram: "lamaisoncupcake",
  location: "France",
};

// Spécialités
const SPECIALITIES = [
  { icon: Cake, label: "Cupcakes" },
  { icon: Heart, label: "Mariage" },
  { icon: ChefHat, label: "Sur-mesure" },
  { icon: Sparkles, label: "Événements" },
];

// Images du site
const HERO_IMAGE = "https://lamaisoncupcake.com/assets/hero-cupcake-bouquet-BVdToYuP.jpg";
const ABOUT_IMAGE = "https://lamaisoncupcake.com/assets/about-creation-DT4t9C-F.jpg";

export default function LaMaisonCupcakeCard() {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Génération vCard
  const handleAddContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${CONTACT.name}
ORG:${CONTACT.name}
TITLE:${CONTACT.title}
TEL;TYPE=CELL:${CONTACT.phone}
EMAIL:${CONTACT.email}
URL:${CONTACT.website}
URL;TYPE=INSTAGRAM:https://instagram.com/${CONTACT.instagram}
NOTE:${CONTACT.tagline}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "la-maison-cupcake.vcf";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Contact ajouté !");
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT.phone.replace(/\s/g, "")}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT.email}`;
  };

  const handleInstagram = () => {
    window.open(`https://instagram.com/${CONTACT.instagram}`, "_blank");
  };

  const handleWebsite = () => {
    window.open(CONTACT.website, "_blank");
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ backgroundColor: CUPCAKE_COLORS.background }}
    >
      {/* Hero Section avec image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[40vh] min-h-[280px] overflow-hidden"
      >
        <motion.img
          src={HERO_IMAGE}
          alt="La Maison Cupcake"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: imageLoaded ? 1 : 1.1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 40%, ${CUPCAKE_COLORS.background} 100%)`,
          }}
        />

        {/* Badge pâtisserie */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md"
          style={{
            backgroundColor: `${CUPCAKE_COLORS.primary}30`,
            border: `1px solid ${CUPCAKE_COLORS.primary}50`,
          }}
        >
          <span
            className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
            style={{ color: CUPCAKE_COLORS.primary }}
          >
            <Heart size={12} fill="currentColor" />
            Artisanal
          </span>
        </motion.div>

        {/* Logo / Avatar flottant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20"
        >
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              boxShadow: `0 0 30px ${CUPCAKE_COLORS.primary}40, 0 8px 24px rgba(0,0,0,0.15)`,
              border: `3px solid ${CUPCAKE_COLORS.card}`,
              backgroundColor: CUPCAKE_COLORS.cream,
            }}
          >
            <Cake size={40} style={{ color: CUPCAKE_COLORS.primary }} />
          </div>
        </motion.div>
      </motion.div>

      {/* Contenu principal */}
      <div className="px-5 pt-16 pb-8 max-w-md mx-auto">
        {/* Identité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: CUPCAKE_COLORS.text }}
          >
            {CONTACT.name}
          </h1>
          <p
            className="text-sm font-medium mb-2"
            style={{ color: CUPCAKE_COLORS.primary }}
          >
            {CONTACT.title}
          </p>
          <p
            className="text-sm"
            style={{ color: CUPCAKE_COLORS.textMuted }}
          >
            {CONTACT.tagline}
          </p>
        </motion.div>

        {/* Spécialités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          {SPECIALITIES.map((spec, idx) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl"
              style={{ backgroundColor: CUPCAKE_COLORS.cream }}
            >
              <spec.icon
                size={20}
                style={{ color: CUPCAKE_COLORS.primary }}
              />
              <span
                className="text-[10px] font-medium text-center"
                style={{ color: CUPCAKE_COLORS.textMuted }}
              >
                {spec.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bouton principal - Ajouter contact */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddContact}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 mb-6"
          style={{
            backgroundColor: CUPCAKE_COLORS.primary,
            boxShadow: `0 8px 24px ${CUPCAKE_COLORS.primary}40`,
          }}
        >
          <UserPlus size={20} />
          Ajouter aux contacts
        </motion.button>

        {/* Actions secondaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: CUPCAKE_COLORS.card,
              color: CUPCAKE_COLORS.text,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Phone size={18} style={{ color: CUPCAKE_COLORS.primary }} />
            Appeler
          </button>

          <button
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: CUPCAKE_COLORS.card,
              color: CUPCAKE_COLORS.text,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <Mail size={18} style={{ color: CUPCAKE_COLORS.primary }} />
            Email
          </button>
        </motion.div>

        {/* Liens sociaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={handleInstagram}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: CUPCAKE_COLORS.cream,
              color: CUPCAKE_COLORS.text,
            }}
          >
            <Instagram size={18} style={{ color: CUPCAKE_COLORS.primary }} />
            Instagram
          </button>

          <button
            onClick={handleWebsite}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: CUPCAKE_COLORS.cream,
              color: CUPCAKE_COLORS.text,
            }}
          >
            <Globe size={18} style={{ color: CUPCAKE_COLORS.primary }} />
            Site web
          </button>
        </motion.div>

        {/* Image secondaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-2xl overflow-hidden mb-8"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
        >
          <img
            src={ABOUT_IMAGE}
            alt="Création artisanale"
            className="w-full h-48 object-cover"
          />
        </motion.div>

        {/* Localisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 mb-8"
          style={{ color: CUPCAKE_COLORS.textMuted }}
        >
          <MapPin size={16} />
          <span className="text-sm">{CONTACT.location}</span>
        </motion.div>

        {/* Footer IWASP */}
        <IWASPBrandingFooter variant="light" />
      </div>
    </div>
  );
}
