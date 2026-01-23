/**
 * Carte Digitale - Said Moumen - Menuisier Professionnel Marrakech
 * Design IWASP premium avec galerie et thème bois luxueux
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Star,
  Truck,
  Award,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { downloadVCard } from "@/lib/vcard";

// Import assets
import menuisierLogo from "@/assets/menuisier-logo.png";
import cuisineImg from "@/assets/menuisier-cuisine.jpg";
import dressingImg from "@/assets/menuisier-dressing.jpg";
import porteImg from "@/assets/menuisier-porte.jpg";

// Premium Wood Theme Colors
const COLORS = {
  background: "#1A1512", // Dark warm brown
  card: "#2A2320", // Rich dark wood
  primary: "#F5EDE4", // Cream white
  secondary: "#A89B8C", // Warm gray
  accent: "#C9A87C", // Gold wood
  accentDark: "#8B6914", // Deep gold
  wood: "#5D4E37", // Medium wood
  woodLight: "#7A6B55", // Light wood
};

// Contact Data
const CONTACT = {
  name: "Said Moumen",
  title: "Maître Menuisier",
  company: "Marrakech",
  phone: "+212677405367",
  whatsapp: "+212677405367",
  location: "Marrakech, Maroc",
  tagline: "L'Art du Bois sur Mesure",
  services: [
    "Cuisines équipées",
    "Dressings & Placards",
    "Portes & Fenêtres",
    "Menuiserie sur mesure",
    "Rénovation intérieure"
  ]
};

// Gallery images
const GALLERY = [
  { src: cuisineImg, title: "Cuisine équipée sur mesure" },
  { src: dressingImg, title: "Dressing moderne intégré" },
  { src: porteImg, title: "Porte d'entrée sculptée" },
];

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
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleCall = () => {
    window.location.href = `tel:${CONTACT.phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour M. Said, je souhaite un devis pour des travaux de menuiserie.");
    window.open(`https://wa.me/${CONTACT.whatsapp.replace(/\+/g, "")}?text=${message}`, "_blank");
  };

  const handleMaps = () => {
    window.open(`https://www.google.com/maps/search/menuisier+marrakech`, "_blank");
  };

  const handleAddContact = () => {
    downloadVCard({
      firstName: "Said",
      lastName: "Moumen",
      title: "Maître Menuisier",
      company: "Menuiserie Said Moumen",
      phone: CONTACT.phone,
      whatsapp: CONTACT.whatsapp,
      city: "Marrakech",
      country: "Maroc",
      note: "Maître menuisier à Marrakech. Cuisines, dressings, portes sur mesure. Déplacement sur toute la région. Qualité premium."
    });
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % GALLERY.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + GALLERY.length) % GALLERY.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start py-6 px-4"
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
          {/* Header with Logo */}
          <div 
            className="h-28 relative flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.wood} 0%, ${COLORS.woodLight} 50%, ${COLORS.wood} 100%)`
            }}
          >
            {/* Wood grain pattern overlay */}
            <div className="absolute inset-0 opacity-30" 
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 3px,
                  rgba(0,0,0,0.15) 3px,
                  rgba(0,0,0,0.15) 6px
                )`
              }}
            />
            
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl"
              style={{ border: `3px solid ${COLORS.accent}` }}
            >
              <img src={menuisierLogo} alt="Logo" className="w-14 h-14 object-contain" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 text-center">
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
              className="text-base mt-1 font-medium"
              style={{ color: COLORS.accent }}
            >
              {CONTACT.title}
            </motion.p>

            {/* Tagline */}
            <motion.p 
              variants={itemVariants}
              className="text-sm mt-2 italic"
              style={{ color: COLORS.secondary }}
            >
              "{CONTACT.tagline}"
            </motion.p>

            {/* Badges */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-2 mt-4 flex-wrap"
            >
              <span 
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
                style={{ backgroundColor: COLORS.accent, color: COLORS.background }}
              >
                <Truck size={12} />
                Déplacement
              </span>
              <span 
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
                style={{ backgroundColor: COLORS.wood, color: COLORS.primary }}
              >
                <Award size={12} />
                20+ ans
              </span>
              <span 
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1"
                style={{ backgroundColor: "#22c55e", color: "#ffffff" }}
              >
                <Star size={12} />
                Premium
              </span>
            </motion.div>

            {/* Location */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-1.5 mt-4"
              style={{ color: COLORS.secondary }}
            >
              <MapPin size={14} />
              <span className="text-sm">{CONTACT.location}</span>
            </motion.div>

            {/* Gallery Carousel */}
            <motion.div 
              variants={itemVariants}
              className="mt-5 relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "16/10" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={GALLERY[currentImage].src}
                  alt={GALLERY[currentImage].title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(currentImage)}
                />
              </AnimatePresence>
              
              {/* Gallery overlay */}
              <div 
                className="absolute bottom-0 left-0 right-0 py-2 px-3"
                style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
              >
                <p className="text-xs font-medium text-white">{GALLERY[currentImage].title}</p>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <ChevronRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                {GALLERY.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ 
                      backgroundColor: index === currentImage ? COLORS.accent : "rgba(255,255,255,0.5)",
                      transform: index === currentImage ? "scale(1.3)" : "scale(1)"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Services */}
            <motion.div 
              variants={itemVariants}
              className="mt-5 p-4 rounded-2xl"
              style={{ backgroundColor: COLORS.background }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.accent }}>
                Nos Réalisations
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {CONTACT.services.map((service, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ 
                      backgroundColor: COLORS.card,
                      color: COLORS.primary,
                      border: `1px solid ${COLORS.wood}`
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
              className="grid grid-cols-2 gap-3 mt-5"
            >
              {/* Call Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCall}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold"
                style={{ backgroundColor: COLORS.accent, color: COLORS.background }}
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
                color: COLORS.primary,
                border: `1px solid ${COLORS.wood}`
              }}
            >
              <MapPin size={18} />
              <span>Localisation</span>
            </motion.button>

            {/* Add Contact Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddContact}
              className="w-full py-4 mt-3 rounded-2xl font-semibold"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentDark} 100%)`,
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
          className="text-center text-xs mt-5"
          style={{ color: COLORS.secondary }}
        >
          Powered by <span className="font-medium" style={{ color: COLORS.accent }}>i-wasp.com</span>
        </motion.p>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X size={24} />
            </button>
            
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={GALLERY[lightboxIndex].src}
              alt={GALLERY[lightboxIndex].title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <p 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-medium"
            >
              {GALLERY[lightboxIndex].title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
