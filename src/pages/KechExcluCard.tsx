import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, Instagram, MapPin, Car, Trees, Sun, ChevronLeft, ChevronRight, X, CreditCard, Globe } from "lucide-react";
import { downloadVCard } from "@/lib/vcard";
import { toast } from "sonner";

// Images générées
import kechExcluLogo from "@/assets/kech-exclu-villa-logo.jpg";
import apartmentImg1 from "@/assets/kech-apartment-1.jpg";
import apartmentImg2 from "@/assets/kech-apartment-2.jpg";
import vehicleImg from "@/assets/kech-vehicle-1.jpg";
import activityImg from "@/assets/kech-activity-1.jpg";
import nfcCardImg from "@/assets/kech-nfc-card.jpg";
import websiteImg from "@/assets/kech-website.jpg";

// Palette Sunset Luxe
const COLORS = {
  sunsetGold: "#ffb347",
  sunsetOrange: "#ffcc33",
  deepPurple: "#1a0f1f",
  noir: "#050505",
  gold: "#e0aa3e",
  sand: "#f9f295",
  terracotta: "#cc7a3e",
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
  { icon: CreditCard, label: "Cartes NFC", desc: "Cartes de visite digitales" },
  { icon: Globe, label: "Sites Vitrines", desc: "Création sur mesure" },
];

const galleryImages = [
  { src: apartmentImg1, label: "Appartement Luxe", category: "Hébergement" },
  { src: apartmentImg2, label: "Riad avec Piscine", category: "Hébergement" },
  { src: vehicleImg, label: "4x4 Premium", category: "Véhicules" },
  { src: activityImg, label: "Buggy Désert", category: "Activités" },
  { src: nfcCardImg, label: "Carte NFC I-WASP", category: "Digital" },
  { src: websiteImg, label: "Site Vitrine", category: "Digital" },
];

export default function KechExcluCard() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // URLs directes pour iOS Safari
  const callUrl = `tel:${contactData.phone}`;
  const emailUrl = `mailto:${contactData.email}`;
  const whatsappUrl = `https://wa.me/${contactData.whatsapp}`;
  const instagramUrl = `https://instagram.com/${contactData.instagram}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(contactData.location)}`;


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
          {/* Header avec logo villa sunset */}
          <div className="relative flex flex-col items-center">
            {/* Image villa sunset */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-full relative"
            >
              <div 
                className="w-full h-48 overflow-hidden rounded-t-3xl"
                style={{ 
                  boxShadow: `0 8px 32px ${COLORS.gold}30`,
                }}
              >
                <img 
                  src={kechExcluLogo} 
                  alt="Kech Exclu - Villa Sunset" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badge premium */}
              <div 
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                style={{ 
                  background: `rgba(0,0,0,0.5)`,
                  color: COLORS.sunsetGold,
                  border: `1px solid ${COLORS.sunsetGold}60`,
                }}
              >
                Premium
              </div>
            </motion.div>

            {/* Titre avec gradient sunset et shimmer */}
            <div className="w-full py-6 text-center" style={{ background: COLORS.noir }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative inline-block overflow-hidden"
              >
                <h1
                  className="text-3xl font-cinzel font-bold tracking-[0.3em] mb-2 relative"
                  style={{
                    background: `linear-gradient(to bottom, #f9f295 0%, #ffb347 50%, #e0aa3e 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
                  }}
                >
                  KECH EXCLU
                </h1>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(
                      120deg,
                      transparent 0%,
                      transparent 40%,
                      rgba(255, 255, 255, 0.4) 50%,
                      transparent 60%,
                      transparent 100%
                    )`,
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["200% 0%", "-200% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${COLORS.sunsetGold})` }} />
                <div className="relative overflow-hidden">
                  <p 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: COLORS.sunsetGold }}
                  >
                    Luxury Villa Concierge
                  </p>
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(
                        120deg,
                        transparent 0%,
                        transparent 40%,
                        rgba(255, 255, 255, 0.5) 50%,
                        transparent 60%,
                        transparent 100%
                      )`,
                      backgroundSize: "200% 100%",
                    }}
                    animate={{
                      backgroundPosition: ["200% 0%", "-200% 0%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  />
                </div>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${COLORS.sunsetGold})` }} />
              </div>
              
              <p 
                className="text-xs tracking-wider"
                style={{ color: `${COLORS.sunsetGold}80` }}
              >
                Marrakech · Signature Experience
              </p>
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
              <motion.a
                href={callUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all no-underline"
                style={{ 
                  background: COLORS.gold,
                  color: COLORS.noir,
                }}
              >
                <Phone size={18} />
                Appeler
              </motion.a>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-sm transition-all no-underline"
                style={{ 
                  background: "#25D366",
                  color: "#fff",
                }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </motion.a>
            </div>

            {/* Boutons secondaires */}
            <div className="grid grid-cols-3 gap-3">
              <motion.a
                href={emailUrl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all no-underline"
                style={{ 
                  background: `${COLORS.sand}10`,
                  border: `1px solid ${COLORS.sand}20`,
                }}
              >
                <Mail size={20} style={{ color: COLORS.sand }} />
                <span className="text-xs" style={{ color: `${COLORS.sand}80` }}>Email</span>
              </motion.a>
              <motion.a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all no-underline"
                style={{ 
                  background: `${COLORS.sand}10`,
                  border: `1px solid ${COLORS.sand}20`,
                }}
              >
                <Instagram size={20} style={{ color: COLORS.sand }} />
                <span className="text-xs" style={{ color: `${COLORS.sand}80` }}>Instagram</span>
              </motion.a>
              <motion.a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all no-underline"
                style={{ 
                  background: `${COLORS.sand}10`,
                  border: `1px solid ${COLORS.sand}20`,
                }}
              >
                <MapPin size={20} style={{ color: COLORS.sand }} />
                <span className="text-xs" style={{ color: `${COLORS.sand}80` }}>Maps</span>
              </motion.a>
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
              <span style={{ color: COLORS.gold }}>i-wasp.com</span> corporation
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
