/**
 * IWASP Luxury Hotel Template
 * Ultra-premium NFC card for 5-star luxury hotels
 * 
 * Design: Black/charcoal + gold accents, glassmorphism, serif fonts
 * Modules: Logo, Name+Stars, Map, WiFi, WhatsApp, Reviews, Website, vCard
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IWASPBrandBadge } from "./IWASPBrandBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Phone, MapPin, Wifi, MessageSquare, Star, Globe, 
  User, Copy, Check, ExternalLink, Navigation, Map
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Luxury Hotel data interface
export interface LuxuryHotelCardData {
  // Hotel identity
  hotelName: string;
  starRating?: 3 | 4 | 5;
  hotelLogo?: string;
  hotelTagline?: string;
  
  // Location
  location?: {
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  
  // WiFi
  wifi?: {
    ssid: string;
    password: string;
  };
  
  // Contact
  whatsappNumber?: string;
  phoneNumber?: string;
  
  // Google Reviews
  googleReviews?: {
    rating: number;
    reviewCount?: number;
    url?: string;
  };
  
  // Website
  websiteUrl?: string;
  
  // vCard
  vCard?: {
    contactName?: string;
    email?: string;
    phone?: string;
  };
  
  // Language
  language?: "fr" | "en" | "ar" | "es";
}

export interface LuxuryHotelTemplateProps {
  data: LuxuryHotelCardData;
  showWalletButtons?: boolean;
  cardId?: string;
  enableLeadCapture?: boolean;
  onShareInfo?: () => void;
  isPreview?: boolean;
}

// Translations
const translations = {
  fr: {
    viewOnMap: "Voir sur la carte",
    wifi: "Accès WiFi",
    network: "Réseau",
    password: "Mot de passe",
    copied: "Copié !",
    whatsapp: "WhatsApp Concierge",
    call: "Appeler",
    reviews: "Avis Google",
    basedOn: "sur",
    reviewsText: "avis",
    visitWebsite: "Visiter le site",
    saveContact: "Enregistrer le contact",
    poweredBy: "Powered by IWASP",
    openInMaps: "Ouvrir dans Maps",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
  },
  en: {
    viewOnMap: "View on Map",
    wifi: "WiFi Access",
    network: "Network",
    password: "Password",
    copied: "Copied!",
    whatsapp: "WhatsApp Concierge",
    call: "Call",
    reviews: "Google Reviews",
    basedOn: "based on",
    reviewsText: "reviews",
    visitWebsite: "Visit Website",
    saveContact: "Save Contact",
    poweredBy: "Powered by IWASP",
    openInMaps: "Open in Maps",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
  },
  ar: {
    viewOnMap: "عرض على الخريطة",
    wifi: "واي فاي",
    network: "الشبكة",
    password: "كلمة المرور",
    copied: "تم النسخ!",
    whatsapp: "واتساب الكونسيرج",
    call: "اتصال",
    reviews: "تقييمات جوجل",
    basedOn: "بناءً على",
    reviewsText: "تقييم",
    visitWebsite: "زيارة الموقع",
    saveContact: "حفظ جهة الاتصال",
    poweredBy: "مدعوم من IWASP",
    openInMaps: "فتح في الخرائط",
    googleMaps: "خرائط جوجل",
    appleMaps: "خرائط آبل",
  },
  es: {
    viewOnMap: "Ver en el mapa",
    wifi: "Acceso WiFi",
    network: "Red",
    password: "Contraseña",
    copied: "¡Copiado!",
    whatsapp: "WhatsApp Conserje",
    call: "Llamar",
    reviews: "Reseñas Google",
    basedOn: "basado en",
    reviewsText: "reseñas",
    visitWebsite: "Visitar sitio",
    saveContact: "Guardar contacto",
    poweredBy: "Powered by IWASP",
    openInMaps: "Abrir en Mapas",
    googleMaps: "Google Maps",
    appleMaps: "Apple Maps",
  },
};

export function LuxuryHotelTemplate({ 
  data, 
  showWalletButtons = true, 
  cardId,
  enableLeadCapture,
  onShareInfo,
  isPreview = false,
}: LuxuryHotelTemplateProps) {
  const t = translations[data.language || "en"];
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);

  // Default preview data
  const previewData: LuxuryHotelCardData = isPreview ? {
    hotelName: "The Grand Palace",
    starRating: 5,
    hotelTagline: "Where luxury meets legacy",
    location: {
      address: "1 Place Vendôme",
      city: "Paris",
      country: "France",
    },
    wifi: {
      ssid: "GrandPalace_Guest",
      password: "••••••••",
    },
    whatsappNumber: "+33600000000",
    phoneNumber: "+33100000000",
    googleReviews: {
      rating: 4.9,
      reviewCount: 2847,
    },
    websiteUrl: "https://example.com",
    language: "en",
  } : data;

  const hotelData = isPreview ? previewData : data;

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(t.copied);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Erreur de copie");
    }
  };

  const handleWhatsApp = () => {
    if (hotelData.whatsappNumber) {
      const cleanNumber = hotelData.whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  const handleCall = () => {
    if (hotelData.phoneNumber) {
      window.location.href = `tel:${hotelData.phoneNumber}`;
    }
  };

  const handleOpenGoogleMaps = () => {
    if (hotelData.location?.latitude && hotelData.location?.longitude) {
      window.open(`https://www.google.com/maps?q=${hotelData.location.latitude},${hotelData.location.longitude}`, "_blank");
    } else if (hotelData.location?.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelData.location.address)}`, "_blank");
    }
    setMapModalOpen(false);
  };

  const handleOpenAppleMaps = () => {
    if (hotelData.location?.latitude && hotelData.location?.longitude) {
      window.open(`https://maps.apple.com/?ll=${hotelData.location.latitude},${hotelData.location.longitude}`, "_blank");
    } else if (hotelData.location?.address) {
      window.open(`https://maps.apple.com/?q=${encodeURIComponent(hotelData.location.address)}`, "_blank");
    }
    setMapModalOpen(false);
  };

  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${hotelData.vCard?.contactName || hotelData.hotelName}
ORG:${hotelData.hotelName}
TEL:${hotelData.vCard?.phone || hotelData.phoneNumber || ""}
EMAIL:${hotelData.vCard?.email || ""}
URL:${hotelData.websiteUrl || ""}
ADR:;;${hotelData.location?.address || ""};${hotelData.location?.city || ""};;${hotelData.location?.country || ""}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${hotelData.hotelName?.replace(/\s+/g, "_") || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.saveContact);
  };

  // Don't render if no hotel name and not preview
  if (!hotelData.hotelName && !isPreview) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-muted-foreground">Configurez votre carte dans l'éditeur</p>
      </div>
    );
  }

  // Render stars
  const renderStars = () => {
    const stars = hotelData.starRating || 5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(stars)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            className="text-[#d4af37] fill-[#d4af37]" 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card container - Ultra luxury dark */}
      <motion.div 
        className="relative rounded-[28px] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.04),transparent_60%)]" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
        
        <div className="relative p-8 space-y-8">
          
          {/* LOGO - Centered, large, elegant */}
          <motion.div 
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {hotelData.hotelLogo ? (
              <div className="mb-6">
                <img 
                  src={hotelData.hotelLogo} 
                  alt={hotelData.hotelName} 
                  className="h-20 w-auto object-contain drop-shadow-2xl"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 backdrop-blur-xl flex items-center justify-center border border-[#d4af37]/20 mb-6 shadow-2xl">
                <span className="text-[#d4af37] text-3xl font-serif font-bold">
                  {hotelData.hotelName?.charAt(0) || "H"}
                </span>
              </div>
            )}

            {/* Hotel name + Stars */}
            <div className="space-y-2">
              {renderStars()}
              <h1 className="text-2xl font-serif font-semibold text-white tracking-tight">
                {hotelData.hotelName}
              </h1>
              {hotelData.hotelTagline && (
                <p className="text-[#d4af37]/50 text-sm italic font-light tracking-wide">
                  {hotelData.hotelTagline}
                </p>
              )}
            </div>
          </motion.div>

          {/* IWASP Badge - Discreet */}
          <div className="absolute top-6 right-6">
            <IWASPBrandBadge variant="dark" />
          </div>

          {/* MODULES */}
          <div className="space-y-4">
            
            {/* Location Module */}
            {hotelData.location && (hotelData.location.address || hotelData.location.city) && (
              <motion.button
                onClick={() => setMapModalOpen(true)}
                className="w-full group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#d4af37]/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#d4af37]/5 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#d4af37]" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white/90 font-medium text-sm">
                      {hotelData.location.address}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {[hotelData.location.city, hotelData.location.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <Navigation size={16} className="text-[#d4af37]/40 group-hover:text-[#d4af37] transition-colors" />
                </div>
              </motion.button>
            )}

            {/* WiFi Module */}
            {hotelData.wifi && (
              <motion.button
                onClick={() => setWifiModalOpen(true)}
                className="w-full group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#d4af37]/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center flex-shrink-0">
                    <Wifi size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white/90 font-medium text-sm">{t.wifi}</p>
                    <p className="text-white/40 text-xs mt-0.5">{hotelData.wifi.ssid}</p>
                  </div>
                  <ExternalLink size={16} className="text-blue-400/40 group-hover:text-blue-400 transition-colors" />
                </div>
              </motion.button>
            )}

            {/* WhatsApp / Call Module */}
            {(hotelData.whatsappNumber || hotelData.phoneNumber) && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {hotelData.whatsappNumber && (
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-all active:scale-[0.98]"
                  >
                    <MessageSquare size={18} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{t.whatsapp}</span>
                  </button>
                )}
                {hotelData.phoneNumber && (
                  <button
                    onClick={handleCall}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all active:scale-[0.98]"
                  >
                    <Phone size={18} className="text-[#d4af37]" />
                    <span className="text-[#d4af37] text-sm font-medium">{t.call}</span>
                  </button>
                )}
              </motion.div>
            )}

            {/* Google Reviews Module */}
            {hotelData.googleReviews && (
              <motion.button
                onClick={() => hotelData.googleReviews?.url && window.open(hotelData.googleReviews.url, "_blank")}
                className="w-full group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#d4af37]/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white/90 font-semibold text-lg">
                        {hotelData.googleReviews.rating.toFixed(1)}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={cn(
                              i < Math.floor(hotelData.googleReviews!.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-white/20"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    {hotelData.googleReviews.reviewCount && (
                      <p className="text-white/40 text-xs mt-0.5">
                        {t.basedOn} {hotelData.googleReviews.reviewCount.toLocaleString()} {t.reviewsText}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={16} className="text-amber-400/40 group-hover:text-amber-400 transition-colors" />
                </div>
              </motion.button>
            )}

            {/* Website Button */}
            {hotelData.websiteUrl && (
              <motion.button
                onClick={() => window.open(hotelData.websiteUrl, "_blank")}
                className="w-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#d4af37]/10 via-[#d4af37]/5 to-[#d4af37]/10 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all">
                  <Globe size={18} className="text-[#d4af37]" />
                  <span className="text-[#d4af37] font-medium text-sm">{t.visitWebsite}</span>
                </div>
              </motion.button>
            )}

            {/* vCard Download */}
            <motion.button
              onClick={handleDownloadVCard}
              className="w-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all">
                <User size={18} className="text-white/60" />
                <span className="text-white/60 font-medium text-sm">{t.saveContact}</span>
              </div>
            </motion.button>
          </div>

          {/* Footer */}
          <motion.div 
            className="pt-6 border-t border-white/[0.04]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-center text-white/15 text-[10px] tracking-widest uppercase">
              {t.poweredBy}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Map Modal */}
      <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
        <DialogContent className="bg-[#0a0a0a] border-[#d4af37]/20 text-white max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center">
                <Map size={18} className="text-[#d4af37]" />
              </div>
              {t.openInMaps}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <button
              onClick={handleOpenGoogleMaps}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <MapPin size={18} className="text-red-400" />
              </div>
              <span className="text-white font-medium">{t.googleMaps}</span>
            </button>
            <button
              onClick={handleOpenAppleMaps}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Navigation size={18} className="text-blue-400" />
              </div>
              <span className="text-white font-medium">{t.appleMaps}</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WiFi Modal */}
      <Dialog open={wifiModalOpen} onOpenChange={setWifiModalOpen}>
        <DialogContent className="bg-[#0a0a0a] border-[#d4af37]/20 text-white max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <Wifi size={18} className="text-blue-400" />
              </div>
              {t.wifi}
            </DialogTitle>
          </DialogHeader>
          {hotelData.wifi && (
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/50 text-xs mb-1">{t.network}</p>
                <div className="flex items-center justify-between">
                  <p className="text-white font-mono">{hotelData.wifi.ssid}</p>
                  <button
                    onClick={() => handleCopy(hotelData.wifi!.ssid, "ssid")}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copiedField === "ssid" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-white/50" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/50 text-xs mb-1">{t.password}</p>
                <div className="flex items-center justify-between">
                  <p className="text-white font-mono">{hotelData.wifi.password}</p>
                  <button
                    onClick={() => handleCopy(hotelData.wifi!.password, "password")}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copiedField === "password" ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-white/50" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
