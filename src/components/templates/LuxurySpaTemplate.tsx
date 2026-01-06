/**
 * IWASP Luxury Spa & Wellness Template
 * Premium NFC card for spas, wellness centers & beauty retreats
 * 
 * Design: Soft dark tones, organic curves, gold/copper accents
 * Modules: Logo, Name, Booking, WhatsApp, Map, Reviews, Instagram, vCard
 * Emotion: Relaxation, trust, exclusivity
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IWASPBrandBadge } from "./IWASPBrandBadge";
import { IWASPBrandingInline } from "@/components/IWASPBrandingFooter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Phone, MapPin, MessageSquare, Star, Globe, Calendar,
  User, Copy, Check, ExternalLink, Navigation, Map, Instagram, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Spa data interface
export interface LuxurySpaCardData {
  // Spa identity
  spaName: string;
  tagline?: string;
  spaLogo?: string;
  
  // Location
  location?: {
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Booking
  bookingUrl?: string;
  bookingPhone?: string;
  
  // WhatsApp
  whatsappNumber?: string;
  
  // Google Reviews
  googleReviews?: {
    rating: number;
    reviewCount?: number;
    url?: string;
    testimonials?: Array<{
      name: string;
      text: string;
      rating: number;
    }>;
  };
  
  // Instagram
  instagram?: {
    handle: string;
    url?: string;
    previewImages?: string[];
  };
  
  // Website
  websiteUrl?: string;
  
  // vCard
  vCard?: {
    contactName?: string;
    email?: string;
    phone?: string;
  };
  
  // Theme variant
  theme?: "forest" | "beige" | "obsidian";
  
  // Language
  language?: "fr" | "en" | "ar" | "es";
}

export interface LuxurySpaTemplateProps {
  data: LuxurySpaCardData;
  showWalletButtons?: boolean;
  cardId?: string;
  enableLeadCapture?: boolean;
  onShareInfo?: () => void;
  isPreview?: boolean;
}

// Theme configurations
const THEMES = {
  forest: {
    bg: "from-[#0a1f1a] via-[#0d2920] to-[#0a1f1a]",
    accent: "#b8976a",
    accentLight: "rgba(184, 151, 106, 0.15)",
    accentBorder: "rgba(184, 151, 106, 0.25)",
    text: "#f5f0e8",
    textMuted: "rgba(245, 240, 232, 0.5)",
    cardBg: "rgba(255, 255, 255, 0.03)",
  },
  beige: {
    bg: "from-[#1a1612] via-[#211b15] to-[#1a1612]",
    accent: "#c9a87c",
    accentLight: "rgba(201, 168, 124, 0.15)",
    accentBorder: "rgba(201, 168, 124, 0.25)",
    text: "#f8f4ef",
    textMuted: "rgba(248, 244, 239, 0.5)",
    cardBg: "rgba(255, 255, 255, 0.04)",
  },
  obsidian: {
    bg: "from-[#0a0a0a] via-[#111111] to-[#0a0a0a]",
    accent: "#d4a574",
    accentLight: "rgba(212, 165, 116, 0.12)",
    accentBorder: "rgba(212, 165, 116, 0.20)",
    text: "#faf8f5",
    textMuted: "rgba(250, 248, 245, 0.45)",
    cardBg: "rgba(255, 255, 255, 0.025)",
  },
};

// Translations
const translations = {
  fr: {
    bookNow: "Réserver un soin",
    whatsapp: "Nous contacter",
    viewOnMap: "Voir sur la carte",
    reviews: "Avis clients",
    basedOn: "sur",
    reviewsText: "avis",
    followUs: "Nous suivre",
    visitWebsite: "Découvrir nos soins",
    saveContact: "Enregistrer le contact",
    poweredBy: "Powered by I-WASP.com",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copied: "Copié !",
    testimonials: "Ce qu'ils disent",
  },
  en: {
    bookNow: "Book a Treatment",
    whatsapp: "Contact Us",
    viewOnMap: "View on Map",
    reviews: "Client Reviews",
    basedOn: "based on",
    reviewsText: "reviews",
    followUs: "Follow Us",
    visitWebsite: "Discover Our Treatments",
    saveContact: "Save Contact",
    poweredBy: "Powered by I-WASP.com",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copied: "Copied!",
    testimonials: "What they say",
  },
  ar: {
    bookNow: "احجز علاجاً",
    whatsapp: "تواصل معنا",
    viewOnMap: "عرض على الخريطة",
    reviews: "آراء العملاء",
    basedOn: "بناءً على",
    reviewsText: "تقييم",
    followUs: "تابعنا",
    visitWebsite: "اكتشف علاجاتنا",
    saveContact: "حفظ جهة الاتصال",
    poweredBy: "مدعوم من I-WASP.com",
    googleMaps: "خرائط جوجل",
    appleMaps: "خرائط آبل",
    copied: "تم النسخ!",
    testimonials: "ماذا يقولون",
  },
  es: {
    bookNow: "Reservar Tratamiento",
    whatsapp: "Contáctanos",
    viewOnMap: "Ver en el mapa",
    reviews: "Opiniones",
    basedOn: "basado en",
    reviewsText: "reseñas",
    followUs: "Síguenos",
    visitWebsite: "Descubre Nuestros Tratamientos",
    saveContact: "Guardar Contacto",
    poweredBy: "Powered by I-WASP.com",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
    copied: "¡Copiado!",
    testimonials: "Lo que dicen",
  },
};

// Breathing animation for calm effect
const breathingAnimation = {
  scale: [1, 1.1, 1],
  opacity: [0.3, 0.5, 0.3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// Gentle hover animation - inline styles
const buttonHoverStyle = {
  transition: "transform 0.3s ease-out",
};

export function LuxurySpaTemplate({ 
  data, 
  showWalletButtons = true, 
  cardId,
  enableLeadCapture,
  onShareInfo,
  isPreview = false,
}: LuxurySpaTemplateProps) {
  const t = translations[data.language || "en"];
  const theme = THEMES[data.theme || "forest"];
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);

  // Default preview data
  const previewData: LuxurySpaCardData = isPreview ? {
    spaName: "Serenity Spa",
    tagline: "Where tranquility meets transformation",
    theme: "forest",
    location: {
      address: "42 Rue de la Paix",
      city: "Paris",
      country: "France",
    },
    bookingUrl: "https://example.com/book",
    whatsappNumber: "+33600000000",
    googleReviews: {
      rating: 4.9,
      reviewCount: 847,
      testimonials: [
        { name: "Marie L.", text: "Une expérience divine...", rating: 5 },
        { name: "Sophie D.", text: "Le meilleur spa de Paris", rating: 5 },
      ],
    },
    instagram: {
      handle: "@serenityspa",
      previewImages: [],
    },
    websiteUrl: "https://example.com",
    language: "en",
  } : data;

  const spaData = isPreview ? previewData : data;

  const handleWhatsApp = () => {
    if (spaData.whatsappNumber) {
      const cleanNumber = spaData.whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  const handleBooking = () => {
    if (spaData.bookingUrl) {
      window.open(spaData.bookingUrl, "_blank");
    } else if (spaData.bookingPhone) {
      window.location.href = `tel:${spaData.bookingPhone}`;
    }
  };

  const handleOpenGoogleMaps = () => {
    if (spaData.location?.latitude && spaData.location?.longitude) {
      window.open(`https://www.google.com/maps?q=${spaData.location.latitude},${spaData.location.longitude}`, "_blank");
    } else if (spaData.location?.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spaData.location.address)}`, "_blank");
    }
    setMapModalOpen(false);
  };

  const handleOpenAppleMaps = () => {
    if (spaData.location?.latitude && spaData.location?.longitude) {
      window.open(`https://maps.apple.com/?ll=${spaData.location.latitude},${spaData.location.longitude}`, "_blank");
    } else if (spaData.location?.address) {
      window.open(`https://maps.apple.com/?q=${encodeURIComponent(spaData.location.address)}`, "_blank");
    }
    setMapModalOpen(false);
  };

  const handleInstagram = () => {
    if (spaData.instagram?.url) {
      window.open(spaData.instagram.url, "_blank");
    } else if (spaData.instagram?.handle) {
      window.open(`https://instagram.com/${spaData.instagram.handle.replace('@', '')}`, "_blank");
    }
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${spaData.vCard?.contactName || spaData.spaName}
ORG:${spaData.spaName}
TEL:${spaData.vCard?.phone || spaData.whatsappNumber || ""}
EMAIL:${spaData.vCard?.email || ""}
URL:${spaData.websiteUrl || ""}
ADR:;;${spaData.location?.address || ""};${spaData.location?.city || ""};;${spaData.location?.country || ""}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${spaData.spaName?.replace(/\s+/g, "_") || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.saveContact);
  };

  // Don't render if no spa name and not preview
  if (!spaData.spaName && !isPreview) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-muted-foreground">Configurez votre carte dans l'éditeur</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card container - Organic luxury */}
      <motion.div 
        className="relative rounded-[32px] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background layers */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />
        
        {/* Breathing orbs for calm effect */}
        <motion.div
          className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-3xl"
          style={{ backgroundColor: theme.accentLight }}
          initial={{ scale: 1, opacity: 0.3 }}
          animate={breathingAnimation}
        />
        <motion.div
          className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] rounded-full blur-3xl"
          style={{ backgroundColor: theme.accentLight }}
          initial={{ scale: 1, opacity: 0.3 }}
          animate={breathingAnimation}
        />
        
        {/* Organic curves overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
            <path
              d="M0,100 Q100,50 200,100 T400,100"
              fill="none"
              stroke={theme.accent}
              strokeWidth="1"
            />
            <path
              d="M0,300 Q150,250 300,300 T400,280"
              fill="none"
              stroke={theme.accent}
              strokeWidth="0.5"
            />
          </svg>
        </div>
        
        <div className="relative p-8 space-y-7">
          
          {/* LOGO & HEADER */}
          <motion.div 
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* IWASP Badge - Subtle top right */}
            <div className="absolute top-6 right-6">
              <IWASPBrandBadge variant="dark" />
            </div>

            {spaData.spaLogo ? (
              <div className="mb-5">
                <img 
                  src={spaData.spaLogo} 
                  alt={spaData.spaName} 
                  className="h-16 w-auto object-contain drop-shadow-lg"
                />
              </div>
            ) : (
              <motion.div 
                className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-5 shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.accentLight}, transparent)`,
                  border: `1px solid ${theme.accentBorder}`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={32} style={{ color: theme.accent }} />
              </motion.div>
            )}

            {/* Spa name */}
            <h1 
              className="text-2xl font-serif font-medium tracking-tight"
              style={{ color: theme.text }}
            >
              {spaData.spaName}
            </h1>
            
            {/* Tagline */}
            {spaData.tagline && (
              <p 
                className="text-sm mt-2 italic font-light tracking-wide max-w-[80%]"
                style={{ color: theme.textMuted }}
              >
                {spaData.tagline}
              </p>
            )}
          </motion.div>

          {/* MODULES */}
          <div className="space-y-4">
            
            {/* Booking CTA - Primary */}
            {(spaData.bookingUrl || spaData.bookingPhone) && (
              <motion.button
                onClick={handleBooking}
                className="w-full group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className="flex items-center justify-center gap-3 p-5 rounded-[20px] transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                    boxShadow: `0 8px 32px ${theme.accent}40`,
                  }}
                >
                  <Calendar size={20} className="text-black/80" />
                  <span className="text-black/90 font-medium text-base">{t.bookNow}</span>
                </div>
              </motion.button>
            )}

            {/* WhatsApp */}
            {spaData.whatsappNumber && (
              <motion.button
                onClick={handleWhatsApp}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-[18px] transition-all duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: "rgba(37, 211, 102, 0.15)" }}
                  >
                    <MessageSquare size={20} className="text-green-400" />
                  </div>
                  <span style={{ color: theme.text }} className="font-medium">
                    {t.whatsapp}
                  </span>
                </div>
              </motion.button>
            )}

            {/* Location */}
            {spaData.location && (spaData.location.address || spaData.location.city) && (
              <motion.button
                onClick={() => setMapModalOpen(true)}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-[18px] transition-all duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: theme.accentLight }}
                  >
                    <MapPin size={20} style={{ color: theme.accent }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ color: theme.text }} className="font-medium text-sm">
                      {spaData.location.address}
                    </p>
                    <p style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                      {[spaData.location.city, spaData.location.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <Navigation size={16} style={{ color: theme.textMuted }} />
                </div>
              </motion.button>
            )}

            {/* Google Reviews */}
            {spaData.googleReviews && (
              <motion.button
                onClick={() => spaData.googleReviews?.testimonials?.length ? setReviewsModalOpen(true) : spaData.googleReviews?.url && window.open(spaData.googleReviews.url, "_blank")}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-[18px] transition-all duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ backgroundColor: "rgba(251, 191, 36, 0.12)" }}
                  >
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span style={{ color: theme.text }} className="font-semibold text-lg">
                        {spaData.googleReviews.rating.toFixed(1)}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={cn(
                              i < Math.floor(spaData.googleReviews!.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-white/20"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    {spaData.googleReviews.reviewCount && (
                      <p style={{ color: theme.textMuted }} className="text-xs">
                        {t.basedOn} {spaData.googleReviews.reviewCount.toLocaleString()} {t.reviewsText}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={16} style={{ color: theme.textMuted }} />
                </div>
              </motion.button>
            )}

            {/* Instagram */}
            {spaData.instagram && (
              <motion.button
                onClick={handleInstagram}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-[18px] transition-all duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(225, 48, 108, 0.15), rgba(193, 53, 132, 0.15), rgba(131, 58, 180, 0.15))" 
                    }}
                  >
                    <Instagram size={20} className="text-pink-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ color: theme.text }} className="font-medium text-sm">
                      {t.followUs}
                    </p>
                    <p style={{ color: theme.textMuted }} className="text-xs">
                      {spaData.instagram.handle}
                    </p>
                  </div>
                  
                  {/* Instagram preview images */}
                  {spaData.instagram.previewImages && spaData.instagram.previewImages.length > 0 && (
                    <div className="flex -space-x-2">
                      {spaData.instagram.previewImages.slice(0, 3).map((img, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-lg overflow-hidden border-2"
                          style={{ borderColor: theme.bg.includes('0a1f1a') ? '#0a1f1a' : '#0a0a0a' }}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            )}

            {/* Website */}
            {spaData.websiteUrl && (
              <motion.button
                onClick={() => window.open(spaData.websiteUrl, "_blank")}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="flex items-center justify-center gap-3 p-4 rounded-[18px] transition-all duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <Globe size={18} style={{ color: theme.accent }} />
                  <span style={{ color: theme.accent }} className="font-medium text-sm">
                    {t.visitWebsite}
                  </span>
                </div>
              </motion.button>
            )}

            {/* vCard */}
            <motion.button
              onClick={handleDownloadVCard}
              className="w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="flex items-center justify-center gap-3 p-4 rounded-[18px] transition-all duration-300"
                style={{
                  backgroundColor: "transparent",
                  border: `1px dashed ${theme.accentBorder}`,
                }}
              >
                <User size={18} style={{ color: theme.textMuted }} />
                <span style={{ color: theme.textMuted }} className="font-medium text-sm">
                  {t.saveContact}
                </span>
              </div>
            </motion.button>
          </div>

          {/* Footer */}
          {/* Global IWASP Branding Footer */}
          <motion.div 
            className="pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <IWASPBrandingInline variant="dark" />
          </motion.div>
        </div>
      </motion.div>

      {/* Map Modal */}
      <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
        <DialogContent 
          className="max-w-sm mx-auto rounded-[24px] border-0"
          style={{ 
            backgroundColor: theme.bg.includes('0a1f1a') ? '#0d2920' : '#111111',
            color: theme.text,
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3" style={{ color: theme.text }}>
              <div 
                className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                style={{ backgroundColor: theme.accentLight }}
              >
                <Map size={18} style={{ color: theme.accent }} />
              </div>
              {t.viewOnMap}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <button
              onClick={handleOpenGoogleMaps}
              className="w-full flex items-center gap-4 p-4 rounded-[14px] transition-all"
              style={{ 
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <MapPin size={18} className="text-red-400" />
              </div>
              <span style={{ color: theme.text }} className="font-medium">{t.googleMaps}</span>
            </button>
            <button
              onClick={handleOpenAppleMaps}
              className="w-full flex items-center gap-4 p-4 rounded-[14px] transition-all"
              style={{ 
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Navigation size={18} className="text-blue-400" />
              </div>
              <span style={{ color: theme.text }} className="font-medium">{t.appleMaps}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews/Testimonials Modal */}
      <Dialog open={reviewsModalOpen} onOpenChange={setReviewsModalOpen}>
        <DialogContent 
          className="max-w-sm mx-auto rounded-[24px] border-0 max-h-[80vh] overflow-y-auto"
          style={{ 
            backgroundColor: theme.bg.includes('0a1f1a') ? '#0d2920' : '#111111',
            color: theme.text,
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3" style={{ color: theme.text }}>
              <div className="w-10 h-10 rounded-[12px] bg-amber-500/15 flex items-center justify-center">
                <Star size={18} className="text-amber-400 fill-amber-400" />
              </div>
              {t.testimonials}
            </DialogTitle>
          </DialogHeader>
          
          {spaData.googleReviews?.testimonials && (
            <div className="space-y-4 pt-4">
              {spaData.googleReviews.testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-[14px]"
                  style={{ 
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentBorder}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span style={{ color: theme.textMuted }} className="text-xs">
                      {testimonial.name}
                    </span>
                  </div>
                  <p style={{ color: theme.text }} className="text-sm italic">
                    "{testimonial.text}"
                  </p>
                </motion.div>
              ))}
              
              {spaData.googleReviews.url && (
                <button
                  onClick={() => window.open(spaData.googleReviews!.url, "_blank")}
                  className="w-full p-3 rounded-[12px] text-sm font-medium"
                  style={{ 
                    backgroundColor: theme.accentLight,
                    color: theme.accent,
                  }}
                >
                  {t.reviews} →
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
