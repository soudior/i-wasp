/**
 * Hébergement Élite Template - Airbnb / Booking Premium
 * VERSION FINALE
 * 
 * Design: Ultra-minimal, deep black background with gold accents
 * Features:
 * - HD Photo Gallery with swipe
 * - Contact Host button (prominent)
 * - Direct booking buttons (Airbnb, Booking)
 * - WiFi module (copiable)
 * - Check-in instructions
 * - Location with map
 * - Google Reviews
 * - vCard Gold Download V4
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, 
  Copy, 
  Check, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle,
  Clock,
  Key,
  Globe,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  X,
  Camera,
  Home,
  Calendar
} from "lucide-react";
import { VCardData } from "@/lib/vcard";
import { VCardGoldButton } from "@/components/VCardGoldButton";
import { toast } from "sonner";

// Template data interface
export interface HebergementEliteData {
  // Property info
  propertyName: string;
  propertyType?: string; // Appartement, Villa, Studio, etc.
  rating?: number;
  reviewCount?: number;
  
  // Photos
  photos?: string[];
  coverPhoto?: string;
  
  // Logo
  logoUrl?: string;
  
  // Booking links
  airbnbUrl?: string;
  bookingUrl?: string;
  directBookingUrl?: string;
  
  // WiFi
  wifiSsid?: string;
  wifiPassword?: string;
  
  // Check-in
  checkInTime?: string;
  checkOutTime?: string;
  checkInInstructions?: string;
  keyBoxCode?: string;
  
  // Location
  address?: string;
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  
  // Contact
  hostName?: string;
  hostPhone?: string;
  whatsapp?: string;
  hostPhoto?: string;
  
  // Reviews
  googleReviewsUrl?: string;
  googleRating?: number;
  
  // Website
  website?: string;
  
  // vCard data
  email?: string;
}

interface HebergementEliteTemplateProps {
  data: HebergementEliteData;
  isPreview?: boolean;
}

// Photo Gallery Component
const PhotoGallery: React.FC<{ 
  photos: string[]; 
  propertyName: string;
  onPhotoClick?: (index: number) => void;
}> = ({ photos, propertyName, onPhotoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div ref={galleryRef} className="relative rounded-3xl overflow-hidden mb-8">
      {/* Main Photo */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-[4/3]"
      >
        <img
          src={photos[currentIndex]}
          alt={`${propertyName} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onClick={() => onPhotoClick?.(currentIndex)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Photo counter */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
          <Camera size={14} className="text-white/80" />
          <span className="text-sm text-white font-medium">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </motion.div>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Thumbnail dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-[#d4af37] w-4' 
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

// Contact Host Button (Prominent)
const ContactHostButton: React.FC<{
  hostName?: string;
  hostPhoto?: string;
  whatsapp?: string;
  phone?: string;
}> = ({ hostName, hostPhoto, whatsapp, phone }) => {
  const handleWhatsApp = () => {
    if (whatsapp) {
      const cleanNumber = whatsapp.replace(/[^0-9+]/g, "");
      window.open(`https://wa.me/${cleanNumber.replace("+", "")}`, "_blank");
    }
  };

  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div 
        className="rounded-3xl p-5 border border-[#d4af37]/30"
        style={{ 
          background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(184,134,11,0.08) 100%)",
          boxShadow: "0 8px 32px rgba(212,175,55,0.15)"
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          {/* Host Photo */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#d4af37]/50">
              {hostPhoto ? (
                <img src={hostPhoto} alt={hostName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#d4af37]/30 to-[#b8860b]/20 flex items-center justify-center">
                  <Home size={24} className="text-[#d4af37]" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-black" />
          </div>
          
          <div className="flex-1">
            <p className="text-[#d4af37] text-sm font-medium">Votre Hôte</p>
            <p className="text-white text-lg font-semibold">{hostName || "Propriétaire"}</p>
            <p className="text-white/50 text-xs">Répond généralement en moins d'1h</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {whatsapp && (
            <motion.button
              onClick={handleWhatsApp}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium hover:bg-green-500/30 transition-colors"
            >
              <MessageCircle size={18} />
              WhatsApp
            </motion.button>
          )}
          {phone && (
            <motion.button
              onClick={handleCall}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-colors"
            >
              <Phone size={18} />
              Appeler
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function HebergementEliteTemplate({ data, isPreview = false }: HebergementEliteTemplateProps) {
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedKeyCode, setCopiedKeyCode] = useState(false);
  const [fullscreenGallery, setFullscreenGallery] = useState<number | null>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const handleCopyWifi = async () => {
    if (data.wifiPassword) {
      await navigator.clipboard.writeText(data.wifiPassword);
      setCopiedWifi(true);
      toast.success("Mot de passe WiFi copié !");
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const handleCopyKeyCode = async () => {
    if (data.keyBoxCode) {
      await navigator.clipboard.writeText(data.keyBoxCode);
      setCopiedKeyCode(true);
      toast.success("Code copié !");
      setTimeout(() => setCopiedKeyCode(false), 2000);
    }
  };

  const handleMap = (app: "google" | "apple") => {
    if (data.latitude && data.longitude) {
      if (app === "apple") {
        window.open(`https://maps.apple.com/?ll=${data.latitude},${data.longitude}&q=${encodeURIComponent(data.propertyName)}`, "_blank");
      } else {
        window.open(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`, "_blank");
      }
    } else if (data.address) {
      if (app === "apple") {
        window.open(`https://maps.apple.com/?q=${encodeURIComponent(data.address)}`, "_blank");
      } else {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(data.address)}`, "_blank");
      }
    }
  };

  // Scroll to photos section
  const scrollToPhotos = useCallback(() => {
    if (photosRef.current) {
      photosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // vCard data for VCardGoldButton
  const vcardData: VCardData = {
    firstName: data.propertyName,
    lastName: "",
    title: data.propertyType || "Hébergement",
    company: data.hostName,
    email: data.email,
    phone: data.hostPhone,
    address: data.address,
    website: data.website,
    whatsapp: data.whatsapp,
  };

  // Default photos for demo
  const photos = data.photos?.length ? data.photos : (data.coverPhoto ? [data.coverPhoto] : []);

  // Preview mode - simplified
  if (isPreview) {
    return (
      <div className="w-full max-w-sm bg-black rounded-2xl overflow-hidden">
        {/* Mini gallery preview */}
        <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={32} className="text-[#d4af37]/50" />
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/50 text-[10px] text-white/60">
            Photos HD
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-center">Hébergement Élite</h3>
          <p className="text-[#d4af37] text-sm text-center mt-1">Airbnb • Booking</p>
          <div className="mt-3 flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={12} className="text-[#d4af37] fill-[#d4af37]" />
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center gap-2">
              <MessageCircle size={14} className="text-[#d4af37]" />
              <span className="text-xs text-[#d4af37]">Contacter l'Hôte</span>
            </div>
            <div className="h-10 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* === Photo Gallery (Priority #1) === */}
        <div ref={photosRef}>
          {photos.length > 0 ? (
            <PhotoGallery 
              photos={photos} 
              propertyName={data.propertyName}
              onPhotoClick={(index) => setFullscreenGallery(index)}
            />
          ) : data.logoUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d4af37]/20 to-transparent blur-2xl" />
                <img 
                  src={data.logoUrl} 
                  alt={data.propertyName}
                  className="relative h-32 w-auto object-contain"
                  style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.4))" }}
                />
              </div>
            </motion.div>
          ) : null}
        </div>

        {/* === Header: Name + Type + Rating === */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-1">
            {data.propertyName || "Votre Hébergement"}
          </h1>

          {data.propertyType && (
            <p className="text-sm tracking-wider uppercase text-[#d4af37] mb-3">
              {data.propertyType}
            </p>
          )}

          {data.rating && (
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(data.rating!) ? "fill-[#d4af37] text-[#d4af37]" : "text-white/20"}
                />
              ))}
              {data.reviewCount && (
                <span className="ml-2 text-sm text-white/60">({data.reviewCount} avis)</span>
              )}
            </div>
          )}

          {data.neighborhood && (
            <div className="flex items-center justify-center gap-1 mt-2 text-white/50 text-sm">
              <MapPin size={14} />
              <span>{data.neighborhood}</span>
            </div>
          )}
        </motion.header>

        {/* === Contact Host Button (Priority #2) === */}
        {(data.whatsapp || data.hostPhone) && (
          <ContactHostButton
            hostName={data.hostName}
            hostPhoto={data.hostPhoto}
            whatsapp={data.whatsapp}
            phone={data.hostPhone}
          />
        )}

        {/* === Booking Buttons (Priority #3) === */}
        {(data.airbnbUrl || data.bookingUrl || data.directBookingUrl) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-3"
          >
            {data.airbnbUrl && (
              <a
                href={data.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-[#FF5A5F]/20 to-[#FF5A5F]/10 border border-[#FF5A5F]/30 text-white hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FF5A5F] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <span className="font-medium block">Airbnb</span>
                    <span className="text-xs text-white/50">Voir & Réserver</span>
                  </div>
                </div>
                <ExternalLink size={18} className="text-[#FF5A5F]" />
              </a>
            )}
            
            {data.bookingUrl && (
              <a
                href={data.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-[#003580]/20 to-[#003580]/10 border border-[#003580]/30 text-white hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#003580] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <div>
                    <span className="font-medium block">Booking.com</span>
                    <span className="text-xs text-white/50">Voir & Réserver</span>
                  </div>
                </div>
                <ExternalLink size={18} className="text-[#003580]" />
              </a>
            )}

            {data.directBookingUrl && (
              <a
                href={data.directBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-2xl border border-[#d4af37]/30 text-white hover:scale-[1.02] transition-transform"
                style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(184,134,11,0.1) 100%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
                    <Globe size={18} className="text-black" />
                  </div>
                  <div>
                    <span className="font-medium block">Réservation Directe</span>
                    <span className="text-xs text-[#d4af37]/70">Meilleur tarif garanti</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#d4af37]" />
              </a>
            )}
          </motion.section>
        )}

        {/* === Check-in Instructions === */}
        {(data.checkInTime || data.checkInInstructions || data.keyBoxCode) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Check-in
            </h2>
            <div 
              className="rounded-2xl p-5 border border-white/10 space-y-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Times */}
              {(data.checkInTime || data.checkOutTime) && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
                    <Calendar size={22} className="text-[#d4af37]" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {data.checkInTime && (
                      <div>
                        <p className="text-white/50 text-xs">Arrivée</p>
                        <p className="text-white font-medium">{data.checkInTime}</p>
                      </div>
                    )}
                    {data.checkOutTime && (
                      <div>
                        <p className="text-white/50 text-xs">Départ</p>
                        <p className="text-white font-medium">{data.checkOutTime}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Key Box Code */}
              {data.keyBoxCode && (
                <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
                    <Key size={22} className="text-[#d4af37]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/50 text-xs">Code boîte à clés</p>
                    <div className="flex items-center gap-2">
                      <code className="text-white font-mono text-lg font-bold tracking-wider">
                        {data.keyBoxCode}
                      </code>
                      <button
                        onClick={handleCopyKeyCode}
                        className="p-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 transition-colors"
                      >
                        {copiedKeyCode ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-[#d4af37]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {data.checkInInstructions && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {data.checkInInstructions}
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* === WiFi Module === */}
        {(data.wifiSsid || data.wifiPassword) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              WiFi
            </h2>
            <div 
              className="rounded-2xl p-5 border border-white/10"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
                  <Wifi size={24} className="text-[#d4af37]" />
                </div>
                <div className="flex-1">
                  {data.wifiSsid && (
                    <p className="text-white font-medium">{data.wifiSsid}</p>
                  )}
                  {data.wifiPassword && (
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-white/70 font-mono bg-white/5 px-3 py-1 rounded-lg">
                        {data.wifiPassword}
                      </code>
                      <motion.button
                        onClick={handleCopyWifi}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 transition-colors"
                      >
                        {copiedWifi ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} className="text-[#d4af37]" />
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* === Location === */}
        {data.address && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Localisation
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleMap("google")}
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <MapPin size={18} className="text-[#d4af37]" />
                <span className="text-sm font-medium">Google Maps</span>
              </button>
              <button
                onClick={() => handleMap("apple")}
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                <MapPin size={18} className="text-white/60" />
                <span className="text-sm font-medium">Apple Maps</span>
              </button>
            </div>
            <p className="text-white/50 text-sm text-center mt-3">{data.address}</p>
          </motion.section>
        )}

        {/* === Google Reviews === */}
        {data.googleReviewsUrl && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <a
              href={data.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Star size={18} className="text-[#d4af37] fill-[#d4af37]" />
                </div>
                <div>
                  <p className="font-medium">Avis Google</p>
                  {data.googleRating && (
                    <p className="text-sm text-white/60">{data.googleRating}/5 étoiles</p>
                  )}
                </div>
              </div>
              <ExternalLink size={18} className="text-white/40" />
            </a>
          </motion.section>
        )}

        {/* === Website === */}
        {data.website && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8"
          >
            <a
              href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-white/60" />
                <span>Visiter le site</span>
              </div>
              <ExternalLink size={18} className="text-white/40" />
            </a>
          </motion.section>
        )}

        {/* === vCard Download - Gold Glassmorphism V4 === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <VCardGoldButton 
            data={vcardData}
            label="Enregistrer le contact"
            size="lg"
          />
        </motion.section>

        {/* === Footer === */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center pt-8 pb-4"
        >
          <p className="text-xs text-white/30">
            Powered by <span className="text-[#d4af37]">i-wasp</span>
          </p>
        </motion.footer>
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {fullscreenGallery !== null && photos.length > 0 && (
          <FullscreenGallery
            photos={photos}
            initialIndex={fullscreenGallery}
            onClose={() => setFullscreenGallery(null)}
            propertyName={data.propertyName}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default HebergementEliteTemplate;
