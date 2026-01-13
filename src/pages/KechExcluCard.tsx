import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, Instagram, MapPin, Car, Trees, Sun, ChevronLeft, ChevronRight, X } from "lucide-react";
import { downloadVCard } from "@/lib/vcard";
import { toast } from "sonner";

// Images générées
import apartmentImg1 from "@/assets/kech-apartment-1.jpg";
import apartmentImg2 from "@/assets/kech-apartment-2.jpg";
import vehicleImg from "@/assets/kech-vehicle-1.jpg";
import activityImg from "@/assets/kech-activity-1.jpg";

// Palette Marrakech Luxe
const COLORS = {
  terracotta: "#C4734F",
  sand: "#E8DCC4", 
  gold: "#D4A853",
  noir: "#1A1A1A",
  palmVert: "#2D5016",
};

const contactData = {
  firstName: "Kech",
  lastName: "Exclu",
  company: "Kech Exclu - Conciergerie Marrakech",
  title: "Conciergerie · Location · Activités",
  phone: "+34 666 925 049",
  email: "contact@kechexclu.com",
  whatsapp: "34666925049",
  instagram: "kechexclu",
  location: "Marrakech, Maroc",
  website: "https://kechexclu.com",
};

const services = [
  { icon: Car, label: "Location Véhicules", desc: "Voitures & Motos" },
  { icon: Trees, label: "Appartements", desc: "Location saisonnière" },
  { icon: Sun, label: "Activités", desc: "Excursions & Aventures" },
];

const galleryImages = [
  { src: apartmentImg1, label: "Appartement Luxe", category: "Hébergement" },
  { src: apartmentImg2, label: "Riad avec Piscine", category: "Hébergement" },
  { src: vehicleImg, label: "4x4 Premium", category: "Véhicules" },
  { src: activityImg, label: "Buggy Désert", category: "Activités" },
];

export default function KechExcluCard() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleCall = () => {
    window.location.href = `tel:${contactData.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contactData.email}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${contactData.whatsapp}`, "_blank");
  };

  const handleInstagram = () => {
    window.open(`https://instagram.com/${contactData.instagram}`, "_blank");
  };

  const handleMaps = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(contactData.location)}`, "_blank");
  };

  const handleAddContact = () => {
    try {
      downloadVCard({
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        company: contactData.company,
        title: contactData.title,
        phone: contactData.phone,
        email: contactData.email,
        website: contactData.website,
      });
      toast.success("Contact ajouté !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du contact");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${COLORS.noir} 0%, #2A2018 50%, ${COLORS.noir} 100%)`,
      }}
    >
      {/* Motif décoratif Marrakech */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="moroccan" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0L20 10L10 20L0 10Z" fill={COLORS.gold} fillOpacity="0.3"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#moroccan)"/>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Card principale */}
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ 
            background: `linear-gradient(180deg, ${COLORS.sand}15 0%, ${COLORS.noir} 100%)`,
            border: `1px solid ${COLORS.gold}30`,
          }}
        >
          {/* Header avec logo */}
          <div 
            className="relative h-48 flex items-center justify-center"
            style={{
              background: `linear-gradient(180deg, ${COLORS.terracotta}20 0%, transparent 100%)`,
            }}
          >
            {/* Silhouettes décoratives */}
            <div className="absolute inset-0 flex items-end justify-center opacity-10">
              <svg viewBox="0 0 200 60" className="w-full h-20">
                {/* Palmiers */}
                <path d="M20 60 L22 40 Q22 35 18 30 Q25 32 22 40 L25 40 Q30 35 26 28 Q32 30 28 38 L30 38 Q35 32 30 25 Q38 28 32 36" fill={COLORS.palmVert}/>
                <path d="M180 60 L178 40 Q178 35 182 30 Q175 32 178 40 L175 40 Q170 35 174 28 Q168 30 172 38 L170 38 Q165 32 170 25 Q162 28 168 36" fill={COLORS.palmVert}/>
                {/* Chameau */}
                <ellipse cx="100" cy="50" rx="15" ry="8" fill={COLORS.terracotta}/>
                <ellipse cx="90" cy="45" rx="5" ry="8" fill={COLORS.terracotta}/>
                <circle cx="85" cy="38" r="4" fill={COLORS.terracotta}/>
              </svg>
            </div>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative z-10"
            >
              <div 
                className="w-28 h-28 rounded-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.terracotta} 100%)`,
                  boxShadow: `0 8px 32px ${COLORS.gold}40`,
                }}
              >
                <span 
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: COLORS.noir }}
                >
                  KE
                </span>
              </div>
            </motion.div>

            {/* Badge premium */}
            <div 
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                background: `${COLORS.gold}20`,
                color: COLORS.gold,
                border: `1px solid ${COLORS.gold}40`,
              }}
            >
              Premium
            </div>
          </div>

          {/* Infos */}
          <div className="px-6 py-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-1"
              style={{ color: COLORS.sand }}
            >
              Kech Exclu
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm font-medium mb-4"
              style={{ color: COLORS.gold }}
            >
              Expériences Marrakech Premium
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm flex items-center justify-center gap-2"
              style={{ color: `${COLORS.sand}80` }}
            >
              <MapPin size={14} />
              {contactData.location}
            </motion.p>
          </div>

          {/* Expériences */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-3">
              {services.map((exp, i) => (
                <motion.div
                  key={exp.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="text-center p-3 rounded-2xl"
                  style={{ 
                    background: `${COLORS.terracotta}15`,
                    border: `1px solid ${COLORS.terracotta}30`,
                  }}
                >
                  <exp.icon 
                    size={24} 
                    className="mx-auto mb-2"
                    style={{ color: COLORS.gold }}
                  />
                  <p 
                    className="text-xs font-medium"
                    style={{ color: COLORS.sand }}
                  >
                    {exp.label}
                  </p>
                  <p 
                    className="text-[10px] mt-0.5"
                    style={{ color: `${COLORS.sand}60` }}
                  >
                    {exp.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Galerie Photos */}
          <div className="px-6 pb-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xs font-medium mb-3 text-center"
              style={{ color: COLORS.gold }}
            >
              Nos offres
            </motion.p>
            <div className="grid grid-cols-2 gap-2">
              {galleryImages.map((img, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedImage(i)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <img 
                    src={img.src} 
                    alt={img.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p 
                      className="text-[10px] font-medium"
                      style={{ color: COLORS.gold }}
                    >
                      {img.category}
                    </p>
                    <p 
                      className="text-xs font-medium truncate"
                      style={{ color: COLORS.sand }}
                    >
                      {img.label}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            {/* Boutons principaux */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCall}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all"
                style={{ 
                  background: COLORS.gold,
                  color: COLORS.noir,
                }}
              >
                <Phone size={18} />
                Appeler
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all"
                style={{ 
                  background: "#25D366",
                  color: "#fff",
                }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </motion.button>
            </div>

            {/* Boutons secondaires */}
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmail}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                style={{ 
                  background: `${COLORS.sand}10`,
                  border: `1px solid ${COLORS.sand}20`,
                }}
              >
                <Mail size={20} style={{ color: COLORS.sand }} />
                <span className="text-xs" style={{ color: `${COLORS.sand}80` }}>Email</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstagram}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                style={{ 
                  background: `${COLORS.sand}10`,
                  border: `1px solid ${COLORS.sand}20`,
                }}
              >
                <Instagram size={20} style={{ color: COLORS.sand }} />
                <span className="text-xs" style={{ color: `${COLORS.sand}80` }}>Instagram</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMaps}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                style={{ 
                  background: `${COLORS.sand}10`,
                  border: `1px solid ${COLORS.sand}20`,
                }}
              >
                <MapPin size={20} style={{ color: COLORS.sand }} />
                <span className="text-xs" style={{ color: `${COLORS.sand}80` }}>Maps</span>
              </motion.button>
            </div>

            {/* Ajouter contact */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAddContact}
              className="w-full py-4 rounded-2xl font-medium text-sm transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.terracotta} 0%, ${COLORS.gold} 100%)`,
                color: COLORS.noir,
              }}
            >
              Ajouter aux contacts
            </motion.button>
          </div>

          {/* Footer */}
          <div 
            className="py-4 text-center"
            style={{ 
              background: `${COLORS.noir}`,
              borderTop: `1px solid ${COLORS.gold}20`,
            }}
          >
            <p 
              className="text-xs"
              style={{ color: `${COLORS.sand}40` }}
            >
              Powered by <span style={{ color: COLORS.gold }}>IWASP</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Galerie */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full"
              style={{ background: `${COLORS.sand}20` }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} style={{ color: COLORS.sand }} />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 p-2 rounded-full"
              style={{ background: `${COLORS.sand}20` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => 
                  prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0
                );
              }}
            >
              <ChevronLeft size={24} style={{ color: COLORS.sand }} />
            </button>

            <button
              className="absolute right-4 p-2 rounded-full"
              style={{ background: `${COLORS.sand}20` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => 
                  prev !== null ? (prev + 1) % galleryImages.length : 0
                );
              }}
            >
              <ChevronRight size={24} style={{ color: COLORS.sand }} />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-full max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].label}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p 
                  className="text-sm font-medium"
                  style={{ color: COLORS.gold }}
                >
                  {galleryImages[selectedImage].category}
                </p>
                <p 
                  className="text-lg font-bold"
                  style={{ color: COLORS.sand }}
                >
                  {galleryImages[selectedImage].label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
