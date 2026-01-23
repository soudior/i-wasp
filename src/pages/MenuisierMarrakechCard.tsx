/**
 * Carte Digitale - Menuisier Professionnel Marrakech
 * Design IWASP premium, Apple Cupertino style
 */

import { motion } from "framer-motion";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star,
  Truck,
  Award,
  Wrench
} from "lucide-react";
import { downloadVCard } from "@/lib/vcard";

// IWASP Cupertino Colors
const COLORS = {
  background: "#F5F5F7",
  card: "#FFFFFF",
  primary: "#1D1D1F",
  secondary: "#8E8E93",
  accent: "#007AFF",
  wood: "#8B4513",
  woodLight: "#D2691E",
};

// Contact Data
const CONTACT = {
  name: "Menuisier Pro",
  title: "Artisan Menuisier",
  company: "Marrakech",
  phone: "+212677405367",
  whatsapp: "+212677405367",
  location: "Marrakech, Maroc",
  tagline: "Qualité · Prix · Déplacement",
  services: [
    "Menuiserie sur mesure",
    "Portes & Fenêtres",
    "Placards & Dressings",
    "Cuisine équipée",
    "Rénovation bois"
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function MenuisierMarrakechCard() {
  const handleCall = () => {
    window.location.href = `tel:${CONTACT.phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite un devis pour des travaux de menuiserie.");
    window.open(`https://wa.me/${CONTACT.whatsapp.replace(/\+/g, "")}?text=${message}`, "_blank");
  };

  const handleMaps = () => {
    window.open(`https://www.google.com/maps/search/menuisier+marrakech`, "_blank");
  };

  const handleAddContact = () => {
    downloadVCard({
      firstName: "Menuisier",
      lastName: "Pro Marrakech",
      title: "Artisan Menuisier",
      phone: CONTACT.phone,
      whatsapp: CONTACT.whatsapp,
      city: "Marrakech",
      country: "Maroc",
      note: "Menuisier professionnel à Marrakech. Déplacement sur toute la région. Qualité et prix imbattables."
    });
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4"
      style={{ backgroundColor: COLORS.background }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: COLORS.card }}
        >
          {/* Header with wood gradient */}
          <div 
            className="h-32 relative flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.wood} 0%, ${COLORS.woodLight} 100%)`
            }}
          >
            {/* Wood grain pattern overlay */}
            <div className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )`
              }}
            />
            
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Wrench size={40} className="text-white" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Name & Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-2xl font-bold tracking-tight"
              style={{ color: COLORS.primary }}
            >
              {CONTACT.name}
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base mt-1"
              style={{ color: COLORS.secondary }}
            >
              {CONTACT.title} · {CONTACT.company}
            </motion.p>

            {/* Tagline with badges */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-2 mt-4"
            >
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: COLORS.wood }}
              >
                <Truck size={12} className="inline mr-1" />
                Déplacement
              </span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: COLORS.accent }}
              >
                <Award size={12} className="inline mr-1" />
                Pro
              </span>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: "#34C759" }}
              >
                <Star size={12} className="inline mr-1" />
                Qualité
              </span>
            </motion.div>

            {/* Location */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-1 mt-4"
              style={{ color: COLORS.secondary }}
            >
              <MapPin size={14} />
              <span className="text-sm">{CONTACT.location}</span>
            </motion.div>

            {/* Services */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 p-4 rounded-2xl"
              style={{ backgroundColor: COLORS.background }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.primary }}>
                Nos Services
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {CONTACT.services.map((service, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ 
                      backgroundColor: COLORS.card,
                      color: COLORS.primary,
                      border: `1px solid ${COLORS.secondary}20`
                    }}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-3 mt-6"
            >
              {/* Call Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCall}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white"
                style={{ backgroundColor: COLORS.accent }}
              >
                <Phone size={20} />
                <span>Appeler</span>
              </motion.button>

              {/* WhatsApp Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </motion.button>
            </motion.div>

            {/* Maps Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMaps}
              className="w-full flex items-center justify-center gap-2 py-3 mt-3 rounded-2xl font-medium"
              style={{ 
                backgroundColor: COLORS.background,
                color: COLORS.primary
              }}
            >
              <MapPin size={18} />
              <span>Voir sur Maps</span>
            </motion.button>

            {/* Add Contact Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddContact}
              className="w-full py-4 mt-3 rounded-2xl font-semibold"
              style={{ 
                backgroundColor: COLORS.wood,
                color: "#FFFFFF"
              }}
            >
              Enregistrer le contact
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-xs mt-6"
          style={{ color: COLORS.secondary }}
        >
          Powered by <span className="font-medium">i-wasp.com</span>
        </motion.p>
      </motion.div>
    </div>
  );
}
