/**
 * IWASP Rental Concierge Template
 * Template spécialisé pour la gestion locative haut de gamme
 * 
 * Features:
 * - Design dark premium avec touches dorées
 * - Galerie photo/vidéo interactive
 * - QR WiFi sécurisé (après auth Google)
 * - Géolocalisation Maps
 * - WhatsApp direct
 * - Liens calendrier Airbnb/Booking
 */

import { useState } from "react";
import { IWASPBrandBadge } from "./IWASPBrandBadge";
import { IWASPBrandingInline } from "@/components/IWASPBrandingFooter";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Wifi, MapPin, Phone, Calendar, MessageSquare, 
  ChevronLeft, ChevronRight, X, Home, Star,
  Navigation, ExternalLink, Copy, Check, Eye, EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";

// Data interface for rental property
export interface RentalPropertyData {
  // Property info
  name: string;
  description?: string;
  photos: string[];
  pricePerNight: number;
  currency?: string;
  
  // Location
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  
  // WiFi (visible only after auth)
  wifiSsid?: string;
  wifiPassword?: string;
  
  // Booking
  bookingUrl?: string;
  airbnbUrl?: string;
  airbnbIcalUrl?: string;
  bookingIcalUrl?: string;
  
  // Contact
  whatsappNumber?: string;
  hostName?: string;
  hostPhoto?: string;
  
  // Amenities
  amenities?: string[];
}

export interface RentalConciergeProps {
  property: RentalPropertyData;
  isAuthenticated?: boolean;
  onRequestAuth?: () => void;
  showWalletButtons?: boolean;
  cardId?: string;
}

// Translations
const translations = {
  wifiAccess: "Accès Wi-Fi",
  seeAvailability: "Voir les Dispos",
  getDirections: "Itinéraire",
  chatWithHost: "Discuter avec l'hôte",
  perNight: "/nuit",
  poweredBy: "Powered by I-WASP.com",
  copyPassword: "Copier",
  scanToConnect: "Scannez pour vous connecter",
  loginRequired: "Connexion requise",
  loginToAccessWifi: "Connectez-vous pour accéder au Wi-Fi",
  network: "Réseau",
  password: "Mot de passe",
  close: "Fermer",
  amenities: "Équipements",
};

/**
 * Generate Wi-Fi QR code string
 */
function generateWiFiString(ssid: string, password: string): string {
  const escapeValue = (str: string) => 
    str.replace(/\\/g, "\\\\")
       .replace(/;/g, "\\;")
       .replace(/:/g, "\\:")
       .replace(/"/g, '\\"');
  
  return `WIFI:T:WPA;S:${escapeValue(ssid)};P:${escapeValue(password)};;`;
}

export function RentalConciergeTemplate({ 
  property,
  isAuthenticated = false,
  onRequestAuth,
  showWalletButtons = true,
  cardId,
}: RentalConciergeProps) {
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const currency = property.currency || "MAD";
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(property.pricePerNight);

  const handleWifiClick = () => {
    if (!isAuthenticated && onRequestAuth) {
      onRequestAuth();
      toast.info("Connectez-vous pour accéder au Wi-Fi");
    } else {
      setWifiModalOpen(true);
    }
  };

  const handleWhatsApp = () => {
    if (property.whatsappNumber) {
      const cleanNumber = property.whatsappNumber.replace(/\D/g, '');
      const message = encodeURIComponent(
        `Bonjour ${property.hostName || ''}, je suis intéressé(e) par votre logement "${property.name}".`
      );
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
    }
  };

  const handleDirections = () => {
    if (property.latitude && property.longitude) {
      // Try Apple Maps on iOS, otherwise Google Maps
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const url = isIOS 
        ? `maps://maps.apple.com/?daddr=${property.latitude},${property.longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
      window.open(url, "_blank");
    } else if (property.address) {
      const encodedAddress = encodeURIComponent(`${property.address}, ${property.city || ''}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
    }
  };

  const handleBooking = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const copyPassword = async () => {
    if (property.wifiPassword) {
      try {
        await navigator.clipboard.writeText(property.wifiPassword);
        setCopied(true);
        toast.success("Mot de passe copié");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Impossible de copier");
      }
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === property.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? property.photos.length - 1 : prev - 1
    );
  };

  if (!property.name) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-muted-foreground">Configurez votre carte dans l'éditeur</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      {/* Card container - Premium dark luxury */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background - Deep dark with gold accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.05),transparent_50%)]" />
        
        <div className="relative">
          {/* HERO IMAGE / GALLERY */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {property.photos.length > 0 ? (
              <>
                <img 
                  src={property.photos[0]} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                
                {/* Gallery button */}
                {property.photos.length > 1 && (
                  <button
                    onClick={() => setGalleryOpen(true)}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-black/70 transition-colors"
                  >
                    <span>{property.photos.length} photos</span>
                    <ChevronRight size={14} />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Home size={48} className="text-zinc-600" />
              </div>
            )}
            
            {/* IWASP Badge */}
            <div className="absolute top-4 right-4">
              <IWASPBrandBadge variant="dark" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-5">
            {/* Property name + price */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-xl font-semibold text-white tracking-tight line-clamp-2">
                  {property.name}
                </h1>
                {property.city && (
                  <div className="flex items-center gap-1.5 mt-1 text-white/50 text-sm">
                    <MapPin size={14} className="text-[#d4af37]/70" />
                    <span>{property.city}</span>
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[#d4af37] font-semibold text-lg">
                  {formattedPrice}
                </div>
                <div className="text-white/40 text-xs">
                  {translations.perNight}
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                {property.description}
              </p>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {property.amenities.slice(0, 5).map((amenity, i) => (
                  <Badge 
                    key={i}
                    variant="outline" 
                    className="bg-white/5 border-white/10 text-white/70 text-xs"
                  >
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 5 && (
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-white/50 text-xs">
                    +{property.amenities.length - 5}
                  </Badge>
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
              {/* WiFi Access - Premium gold button */}
              {(property.wifiSsid || !isAuthenticated) && (
                <button
                  onClick={handleWifiClick}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl transition-all active:scale-[0.98]",
                    isAuthenticated 
                      ? "bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 border border-[#d4af37]/30 hover:border-[#d4af37]/50"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                    isAuthenticated 
                      ? "bg-[#d4af37]/30" 
                      : "bg-white/10"
                  )}>
                    <Wifi size={18} className={isAuthenticated ? "text-[#d4af37]" : "text-white/50"} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className={cn(
                      "font-medium block text-sm",
                      isAuthenticated ? "text-[#d4af37]" : "text-white/70"
                    )}>
                      {translations.wifiAccess}
                    </span>
                    <span className="text-white/40 text-xs">
                      {isAuthenticated ? translations.scanToConnect : translations.loginRequired}
                    </span>
                  </div>
                  {!isAuthenticated && (
                    <Badge variant="outline" className="border-[#d4af37]/30 text-[#d4af37] text-[10px]">
                      Google
                    </Badge>
                  )}
                </button>
              )}

              {/* Booking buttons */}
              <div className="grid grid-cols-2 gap-3">
                {property.airbnbUrl && (
                  <button
                    onClick={() => handleBooking(property.airbnbUrl)}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-rose-500/15 to-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all active:scale-[0.98]"
                  >
                    <Calendar size={16} className="text-rose-400" />
                    <span className="text-rose-400 text-sm font-medium">Airbnb</span>
                  </button>
                )}
                {property.bookingUrl && (
                  <button
                    onClick={() => handleBooking(property.bookingUrl)}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all active:scale-[0.98]"
                  >
                    <Calendar size={16} className="text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Booking</span>
                  </button>
                )}
              </div>

              {/* Directions */}
              {(property.latitude || property.address) && (
                <button
                  onClick={handleDirections}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Navigation size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-white font-medium block text-sm">{translations.getDirections}</span>
                    {property.address && (
                      <span className="text-white/40 text-xs line-clamp-1">{property.address}</span>
                    )}
                  </div>
                  <ExternalLink size={16} className="text-white/30" />
                </button>
              )}

              {/* WhatsApp */}
              {property.whatsappNumber && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/15 to-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={18} className="text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-green-400 font-medium block text-sm">
                      {translations.chatWithHost}
                    </span>
                    {property.hostName && (
                      <span className="text-white/40 text-xs">{property.hostName}</span>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-green-400/50" />
                </button>
              )}

              {/* Availability Calendar */}
              {(property.airbnbIcalUrl || property.bookingIcalUrl) && (
                <AvailabilityCalendar 
                  airbnbIcalUrl={property.airbnbIcalUrl}
                  bookingIcalUrl={property.bookingIcalUrl}
                  className="mt-4"
                />
              )}
            </div>

            {/* Global IWASP Branding Footer */}
            <div className="pt-4 border-t border-white/5">
              <IWASPBrandingInline variant="dark" />
            </div>
          </div>
        </div>
      </div>

      {/* WiFi Modal */}
      <Dialog open={wifiModalOpen} onOpenChange={setWifiModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
                <Wifi size={18} className="text-[#d4af37]" />
              </div>
              <div>
                <span className="block">{translations.wifiAccess}</span>
                <span className="text-sm text-white/50 font-normal">{property.name}</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* QR Code */}
            {property.wifiSsid && property.wifiPassword && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG
                    value={generateWiFiString(property.wifiSsid, property.wifiPassword)}
                    size={160}
                    level="M"
                    fgColor="#1a1a1a"
                    bgColor="transparent"
                  />
                </div>
                <p className="text-white/50 text-xs text-center">
                  {translations.scanToConnect}
                </p>
              </div>
            )}

            {/* Network details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-white/50 text-sm">{translations.network}</span>
                <span className="text-white font-medium">{property.wifiSsid}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-white/50 text-sm">{translations.password}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono text-sm">
                    {showPassword ? property.wifiPassword : "••••••••"}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff size={14} className="text-white/50" />
                    ) : (
                      <Eye size={14} className="text-white/50" />
                    )}
                  </button>
                  <button
                    onClick={copyPassword}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-white/50" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="bg-black/95 border-0 text-white max-w-lg mx-auto p-0">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={property.photos[currentPhotoIndex]}
                alt={`${property.name} - Photo ${currentPhotoIndex + 1}`}
                className="w-full aspect-[4/3] object-cover rounded-t-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Navigation */}
            {property.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-sm">
              {currentPhotoIndex + 1} / {property.photos.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="p-4 flex gap-2 overflow-x-auto">
            {property.photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={cn(
                  "w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                  currentPhotoIndex === index 
                    ? "border-[#d4af37]" 
                    : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img 
                  src={photo} 
                  alt="" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RentalConciergeTemplate;
