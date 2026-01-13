/**
 * LuxePrestigeCard - Carte de visite digitale ultra-luxe
 * 
 * Conciergerie de luxe: voitures, jets privés, montgolfières, riads
 * Design IWASP premium avec thème noir et or
 */

import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin, Plane, Car, Home, Sparkles, ChevronLeft, ChevronRight, X, Camera, Star, Crown, Globe, Flame } from "lucide-react";
import { useState, useCallback } from "react";
import luxePrestigeLogo from "@/assets/luxe-prestige-logo.png";

// Palette ultra-luxe noir et or
const LUXE_COLORS = {
  background: "#0A0A0A",
  card: "#111111",
  gold: "#D4AF37",
  goldLight: "#F4E4BC",
  goldDark: "#B8960C",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  accent: "#1C1C1C",
};

// Données de contact
const CONTACT = {
  name: "Luxe Prestige",
  tagline: "L'excellence au service de vos désirs",
  title: "Conciergerie de Luxe",
  location: "Marrakech, Maroc",
  phone: "+212 661-381626",
  whatsapp: "212661381626",
  email: "contact@luxeprestige.ma",
  services: [
    { icon: Car, label: "Véhicules de Luxe", desc: "Rolls-Royce, Bentley, Lamborghini" },
    { icon: Plane, label: "Aviation Privée", desc: "Jets & Hélicoptères" },
    { icon: Sparkles, label: "Expériences", desc: "Montgolfières, Désert, Spa" },
    { icon: Home, label: "Riads de Prestige", desc: "Villas & Palais exclusifs" },
  ],
};

// Images d'expériences luxe (URLs haute qualité)
const EXPERIENCES = [
  {
    id: "balloon",
    title: "Vol en Montgolfière",
    subtitle: "Survol du désert au lever du soleil",
    image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&q=80",
    icon: Sparkles,
  },
  {
    id: "desert",
    title: "Safari Désert",
    subtitle: "Expédition exclusive dans les dunes",
    image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80",
    icon: Flame,
  },
  {
    id: "spa",
    title: "Spa & Wellness",
    subtitle: "Soins traditionnels marocains",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    icon: Crown,
  },
];

// Logements gérés par Luxe Prestige
const PROPERTIES = [
  {
    name: "Dar Al Bahja",
    type: "Villa de Luxe",
    location: "Marrakech",
    photos: [
      "/images/dar-al-bahja/hero.jpg",
      "/images/dar-al-bahja/villa-1.jpg",
      "/images/dar-al-bahja/villa-2.jpg",
      "/images/dar-al-bahja/villa-3.jpg",
      "/images/dar-al-bahja/villa-4.jpg",
      "/images/dar-al-bahja/villa-5.jpg",
      "/images/dar-al-bahja/villa-6.jpg",
      "/images/dar-al-bahja/villa-7.jpg",
    ],
  },
];

// Véhicules de luxe
const VEHICLES = [
  {
    name: "Bentley Bentayga",
    type: "SUV de Luxe",
    photo: "/images/luxe-prestige/bentley-bentayga.jpg",
  },
  {
    name: "Mercedes S-Class",
    type: "Berline Executive",
    photo: "/images/luxe-prestige/mercedes-s-class.jpg",
  },
  {
    name: "Mercedes V Mansory",
    type: "Van VIP",
    photo: "/images/luxe-prestige/mercedes-v-mansory.jpg",
  },
  {
    name: "Limousine",
    type: "Transport Prestige",
    photo: "/images/luxe-prestige/limousine.jpg",
  },
];

// Hero images pour le carousel
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", // Villa luxe
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", // Voiture luxe
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80", // Piscine
];

// Property Gallery Component
const PropertyGallery: React.FC<{ 
  photos: string[]; 
  propertyName: string;
  onPhotoClick: (index: number) => void;
}> = ({ photos, propertyName, onPhotoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-[16/10]"
      >
        <img
          src={photos[currentIndex]}
          alt={`${propertyName} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onPhotoClick(currentIndex)}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
          <Camera size={12} className="text-white/80" />
          <span className="text-xs text-white font-medium">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </motion.div>

      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {photos.length > 1 && (
        <div className="absolute bottom-3 right-3 flex gap-1">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-[#D4AF37] w-3' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Fullscreen Gallery Modal
const FullscreenGallery: React.FC<{
  photos: string[];
  initialIndex: number;
  onClose: () => void;
  propertyName: string;
}> = ({ photos, initialIndex, onClose, propertyName }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white"
      >
        <X size={24} />
      </button>
      
      <img
        src={photos[currentIndex]}
        alt={`${propertyName} - Photo ${currentIndex + 1}`}
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % photos.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </motion.div>
  );
};

export default function LuxePrestigeCard() {
  const [isPressed, setIsPressed] = useState<string | null>(null);
  const [fullscreenGallery, setFullscreenGallery] = useState<{
    photos: string[];
    index: number;
    name: string;
  } | null>(null);

  const handleCall = () => {
    window.location.href = `tel:${CONTACT.phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite des informations sur vos services de conciergerie.");
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT.email}?subject=Demande d'information - Luxe Prestige`;
  };

  const handleAddContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${CONTACT.name}
ORG:${CONTACT.name}
TITLE:${CONTACT.title}
TEL;TYPE=CELL:${CONTACT.phone}
EMAIL:${CONTACT.email}
ADR;TYPE=WORK:;;${CONTACT.location}
NOTE:${CONTACT.tagline}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "luxe-prestige.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePropertyWhatsApp = (propertyName: string) => {
    const message = encodeURIComponent(`Bonjour, je souhaite des informations sur ${propertyName}.`);
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
  };

  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-rotate hero images
  useState(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start"
      style={{ backgroundColor: LUXE_COLORS.background }}
    >
      {/* Luxury pattern background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section - Immersive */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full relative h-[45vh] min-h-[320px] overflow-hidden"
      >
        {/* Hero Image with Ken Burns effect */}
        <motion.div
          key={heroIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMAGES[heroIndex]}
            alt="Luxe Prestige"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent 30%, ${LUXE_COLORS.background} 100%)`,
          }}
        />
        
        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
          style={{ 
            backgroundColor: `${LUXE_COLORS.gold}20`,
            border: `1px solid ${LUXE_COLORS.gold}40`,
          }}
        >
          <Crown size={14} style={{ color: LUXE_COLORS.gold }} />
          <span 
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: LUXE_COLORS.gold }}
          >
            Premium
          </span>
        </motion.div>

        {/* Logo floating on hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20"
        >
          <div
            className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center"
            style={{ 
              boxShadow: `0 0 40px ${LUXE_COLORS.gold}50, 0 8px 32px rgba(0,0,0,0.5)`,
              border: `3px solid ${LUXE_COLORS.gold}`,
            }}
          >
            <img 
              src={luxePrestigeLogo} 
              alt="Luxe Prestige" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Hero indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: idx === heroIndex ? LUXE_COLORS.gold : `${LUXE_COLORS.text}30`,
                width: idx === heroIndex ? 24 : 8,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Card - continues from hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-md relative z-10 px-4 -mt-4"
      >
        {/* Header with Name */}
        <div 
          className="rounded-t-3xl pt-16 pb-8 px-8 text-center relative overflow-hidden"
          style={{ 
            backgroundColor: LUXE_COLORS.card,
            borderBottom: `2px solid ${LUXE_COLORS.gold}`,
          }}
        >

          {/* Name */}
          <h1 
            className="text-3xl font-bold tracking-wide mb-2"
            style={{ color: LUXE_COLORS.gold }}
          >
            {CONTACT.name}
          </h1>

          {/* Title */}
          <p 
            className="text-lg font-light tracking-widest uppercase mb-3"
            style={{ color: LUXE_COLORS.text }}
          >
            {CONTACT.title}
          </p>

          {/* Tagline */}
          <p 
            className="text-sm italic"
            style={{ color: LUXE_COLORS.textMuted }}
          >
            "{CONTACT.tagline}"
          </p>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin size={14} style={{ color: LUXE_COLORS.gold }} />
            <span className="text-sm" style={{ color: LUXE_COLORS.textMuted }}>
              {CONTACT.location}
            </span>
          </div>
          
          {/* 5-star rating */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={LUXE_COLORS.gold}
                style={{ color: LUXE_COLORS.gold }}
              />
            ))}
            <span 
              className="ml-2 text-xs"
              style={{ color: LUXE_COLORS.textMuted }}
            >
              Service d'exception
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div 
          className="p-6 grid grid-cols-2 gap-3"
          style={{ backgroundColor: LUXE_COLORS.accent }}
        >
          {CONTACT.services.map((service, index) => (
            <motion.div
              key={service.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: LUXE_COLORS.card,
                border: `1px solid ${LUXE_COLORS.gold}20`,
              }}
            >
              <service.icon 
                size={24} 
                className="mx-auto mb-2"
                style={{ color: LUXE_COLORS.gold }}
              />
              <p 
                className="text-xs font-semibold mb-1"
                style={{ color: LUXE_COLORS.text }}
              >
                {service.label}
              </p>
              <p 
                className="text-[10px] leading-tight"
                style={{ color: LUXE_COLORS.textMuted }}
              >
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Experiences Section - Visual cards */}
        <div 
          className="p-6"
          style={{ backgroundColor: LUXE_COLORS.card }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} style={{ color: LUXE_COLORS.gold }} />
            <h2 
              className="text-lg font-semibold tracking-wide"
              style={{ color: LUXE_COLORS.gold }}
            >
              Expériences Uniques
            </h2>
          </div>

          <div className="space-y-3">
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.15 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ 
                  border: `1px solid ${LUXE_COLORS.gold}20`,
                }}
                onClick={() => {
                  const message = encodeURIComponent(`Bonjour, je souhaite réserver : ${exp.title}`);
                  window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
                }}
              >
                <div className="relative h-32">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${LUXE_COLORS.background}ee 0%, ${LUXE_COLORS.background}80 50%, transparent 100%)`,
                    }}
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ 
                        backgroundColor: `${LUXE_COLORS.gold}20`,
                        border: `1px solid ${LUXE_COLORS.gold}40`,
                      }}
                    >
                      <exp.icon size={18} style={{ color: LUXE_COLORS.gold }} />
                    </div>
                    <h3 
                      className="text-base font-semibold mb-1"
                      style={{ color: LUXE_COLORS.text }}
                    >
                      {exp.title}
                    </h3>
                    <p 
                      className="text-xs"
                      style={{ color: LUXE_COLORS.textMuted }}
                    >
                      {exp.subtitle}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div 
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={24} style={{ color: LUXE_COLORS.gold }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div 
          className="p-6"
          style={{ backgroundColor: LUXE_COLORS.card }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Home size={18} style={{ color: LUXE_COLORS.gold }} />
            <h2 
              className="text-lg font-semibold tracking-wide"
              style={{ color: LUXE_COLORS.gold }}
            >
              Nos Logements
            </h2>
          </div>

          {PROPERTIES.map((property, index) => (
            <motion.div
              key={property.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="rounded-2xl overflow-hidden"
              style={{ 
                backgroundColor: LUXE_COLORS.accent,
                border: `1px solid ${LUXE_COLORS.gold}20`,
              }}
            >
              {/* Photo Gallery */}
              <PropertyGallery 
                photos={property.photos}
                propertyName={property.name}
                onPhotoClick={(photoIndex) => setFullscreenGallery({
                  photos: property.photos,
                  index: photoIndex,
                  name: property.name,
                })}
              />
              
              {/* Property Info */}
              <div className="p-4">
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ color: LUXE_COLORS.text }}
                >
                  {property.name}
                </h3>
                <p 
                  className="text-sm mb-1"
                  style={{ color: LUXE_COLORS.gold }}
                >
                  {property.type}
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} style={{ color: LUXE_COLORS.textMuted }} />
                  <span 
                    className="text-xs"
                    style={{ color: LUXE_COLORS.textMuted }}
                  >
                    {property.location}
                  </span>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePropertyWhatsApp(property.name)}
                  className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
                  style={{ 
                    background: `linear-gradient(135deg, ${LUXE_COLORS.gold}, ${LUXE_COLORS.goldDark})`,
                    color: LUXE_COLORS.background,
                  }}
                >
                  <MessageCircle size={18} />
                  Réserver
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vehicles Section */}
        <div 
          className="p-6"
          style={{ backgroundColor: LUXE_COLORS.accent }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Car size={18} style={{ color: LUXE_COLORS.gold }} />
            <h2 
              className="text-lg font-semibold tracking-wide"
              style={{ color: LUXE_COLORS.gold }}
            >
              Nos Véhicules
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {VEHICLES.map((vehicle, index) => (
              <motion.div
                key={vehicle.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="rounded-xl overflow-hidden cursor-pointer"
                style={{ 
                  backgroundColor: LUXE_COLORS.card,
                  border: `1px solid ${LUXE_COLORS.gold}20`,
                }}
                onClick={() => setFullscreenGallery({
                  photos: [vehicle.photo],
                  index: 0,
                  name: vehicle.name,
                })}
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={vehicle.photo}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="p-3">
                  <p 
                    className="text-sm font-semibold"
                    style={{ color: LUXE_COLORS.text }}
                  >
                    {vehicle.name}
                  </p>
                  <p 
                    className="text-[10px]"
                    style={{ color: LUXE_COLORS.gold }}
                  >
                    {vehicle.type}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Véhicules */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const message = encodeURIComponent("Bonjour, je souhaite réserver un véhicule de luxe.");
              window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
            }}
            className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
            style={{ 
              backgroundColor: LUXE_COLORS.card,
              color: LUXE_COLORS.gold,
              border: `1px solid ${LUXE_COLORS.gold}40`,
            }}
          >
            <MessageCircle size={18} />
            Réserver un véhicule
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div 
          className="p-6 space-y-3 rounded-b-3xl"
          style={{ backgroundColor: LUXE_COLORS.card }}
        >
          {/* Primary CTA - WhatsApp */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onTouchStart={() => setIsPressed("whatsapp")}
            onTouchEnd={() => setIsPressed(null)}
            onClick={handleWhatsApp}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-200"
            style={{ 
              background: `linear-gradient(135deg, ${LUXE_COLORS.gold}, ${LUXE_COLORS.goldDark})`,
              color: LUXE_COLORS.background,
              transform: isPressed === "whatsapp" ? "scale(0.98)" : "scale(1)",
              boxShadow: `0 4px 20px ${LUXE_COLORS.gold}40`,
            }}
          >
            <MessageCircle size={20} />
            Réserver via WhatsApp
          </motion.button>

          {/* Secondary buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCall}
              className="py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
              style={{ 
                backgroundColor: LUXE_COLORS.accent,
                color: LUXE_COLORS.gold,
                border: `1px solid ${LUXE_COLORS.gold}40`,
              }}
            >
              <Phone size={18} />
              Appeler
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleEmail}
              className="py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
              style={{ 
                backgroundColor: LUXE_COLORS.accent,
                color: LUXE_COLORS.gold,
                border: `1px solid ${LUXE_COLORS.gold}40`,
              }}
            >
              <Mail size={18} />
              Email
            </motion.button>
          </div>

          {/* Add Contact */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddContact}
            className="w-full py-3 rounded-xl font-medium transition-all"
            style={{ 
              backgroundColor: "transparent",
              color: LUXE_COLORS.textMuted,
              border: `1px solid ${LUXE_COLORS.textMuted}40`,
            }}
          >
            Ajouter aux contacts
          </motion.button>
        </div>
      </motion.div>

      {/* Footer - i-wasp.com CORPORATION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <a 
          href="https://i-wasp.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 no-underline hover:opacity-100 transition-opacity"
          style={{ opacity: 0.6 }}
        >
          <span 
            className="text-xs font-semibold"
            style={{ 
              color: LUXE_COLORS.gold,
              letterSpacing: "0.08em",
            }}
          >
            i-wasp.com
          </span>
          <span 
            className="text-[10px] font-medium uppercase"
            style={{ 
              color: `${LUXE_COLORS.gold}80`,
              letterSpacing: "0.15em",
            }}
          >
            CORPORATION
          </span>
        </a>
      </motion.div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {fullscreenGallery && (
          <FullscreenGallery
            photos={fullscreenGallery.photos}
            initialIndex={fullscreenGallery.index}
            propertyName={fullscreenGallery.name}
            onClose={() => setFullscreenGallery(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
