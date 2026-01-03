/**
 * vCard Airbnb Booking – iWasp Template
 * 
 * Carte digitale NFC premium pour Airbnb, Booking, Riads et logements touristiques.
 * Optimisée pour l'expérience client, les avis et les réservations.
 * 
 * SECTIONS (dans cet ordre exact):
 * 1. Géolocalisation
 * 2. Galerie photos
 * 3. Contact (Appeler + WhatsApp)
 * 4. Avis & Confiance (Airbnb, Booking, Google)
 * 5. Plateformes de réservation
 * 6. Infos séjour (Check-in/out, WiFi avec QR)
 * 7. Autour du logement
 * 8. Carte physique NFC iWasp
 */

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, 
  MapPin,
  Phone, 
  MessageCircle,
  Star, 
  ExternalLink,
  Clock,
  Key,
  Wifi,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera,
  X,
  Utensils,
  Compass,
  Building2,
  CreditCard,
  Calendar,
  Share2,
  QrCode
} from "lucide-react";
import { VCardData } from "@/lib/vcard";
import { VCardGoldButton } from "@/components/VCardGoldButton";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { IWASPBrandingInline } from "@/components/IWASPBrandingFooter";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

// ============ INTERFACES ============

export interface NearbyPlace {
  name: string;
  type: "restaurant" | "activity" | "attraction" | "shop";
  description?: string;
  distance?: string;
  url?: string;
  image?: string;
}

export interface VCardAirbnbBookingData {
  // Property info
  propertyName: string;
  propertyType?: string; // Appartement, Villa, Riad, etc.
  tagline?: string;
  coverPhoto?: string;
  logoUrl?: string;
  
  // Photos gallery
  photos?: string[];
  
  // Location
  address?: string;
  city?: string;
  directionsUrl?: string; // Google Maps direct link
  latitude?: number;
  longitude?: number;
  
  // Contact
  hostName?: string;
  hostPhoto?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  
  // Reviews URLs
  airbnbReviewsUrl?: string;
  bookingReviewsUrl?: string;
  googleReviewsUrl?: string;
  rating?: number;
  reviewCount?: number;
  
  // Booking platforms
  airbnbUrl?: string;
  bookingUrl?: string;
  directBookingUrl?: string;
  
  // Stay info
  checkInTime?: string;
  checkOutTime?: string;
  checkInInstructions?: string;
  keyBoxCode?: string;
  
  // WiFi
  wifiSsid?: string;
  wifiPassword?: string;
  wifiSecurity?: "WPA" | "WEP" | "nopass";
  
  // Nearby places
  nearbyPlaces?: NearbyPlace[];
  
  // Website
  website?: string;
  
  // NFC Card link (same as digital)
  nfcCardUrl?: string;
}

interface VCardAirbnbBookingTemplateProps {
  data: VCardAirbnbBookingData;
  cardId?: string;
  isPreview?: boolean;
}

// ============ HELPER COMPONENTS ============

// Photo Gallery
const PhotoGallery: React.FC<{ 
  photos: string[]; 
  propertyName: string;
  onPhotoClick?: (index: number) => void;
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
    <div className="relative rounded-3xl overflow-hidden">
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
          <Camera size={14} className="text-white/80" />
          <span className="text-sm text-white font-medium">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </motion.div>

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

// Premium Button Component
const GlassButton: React.FC<{
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "gold" | "airbnb" | "booking" | "green" | "outline";
  className?: string;
}> = ({ icon: Icon, children, onClick, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-white/8 border-white/15 text-white hover:bg-white/12",
    gold: "bg-gradient-to-r from-[#d4af37]/20 to-[#b8860b]/15 border-[#d4af37]/40 text-[#d4af37] hover:from-[#d4af37]/30 hover:to-[#b8860b]/25",
    airbnb: "bg-[#FF5A5F]/15 border-[#FF5A5F]/40 text-[#FF5A5F] hover:bg-[#FF5A5F]/25",
    booking: "bg-[#003580]/15 border-[#003580]/40 text-white hover:bg-[#003580]/25",
    green: "bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500/25",
    outline: "bg-transparent border-white/20 text-white/80 hover:bg-white/5"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 font-medium ${variants[variant]} ${className}`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </motion.button>
  );
};

// Link Button (for external URLs)
const LinkButton: React.FC<{
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: "default" | "gold" | "airbnb" | "booking" | "green";
  subtitle?: string;
}> = ({ href, icon: Icon, children, variant = "default", subtitle }) => {
  const variants = {
    default: "bg-white/8 border-white/15 hover:bg-white/12",
    gold: "bg-gradient-to-r from-[#d4af37]/15 to-[#b8860b]/10 border-[#d4af37]/30 hover:from-[#d4af37]/25 hover:to-[#b8860b]/20",
    airbnb: "bg-[#FF5A5F]/15 border-[#FF5A5F]/30 hover:bg-[#FF5A5F]/25",
    booking: "bg-[#003580]/15 border-[#003580]/30 hover:bg-[#003580]/25",
    green: "bg-green-500/15 border-green-500/30 hover:bg-green-500/25"
  };

  const iconColors = {
    default: "bg-white/10 text-white/70",
    gold: "bg-[#d4af37]/20 text-[#d4af37]",
    airbnb: "bg-[#FF5A5F] text-white",
    booking: "bg-[#003580] text-white",
    green: "bg-green-500/20 text-green-400"
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 text-white ${variants[variant]}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColors[variant]}`}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <span className="font-medium block">{children}</span>
          {subtitle && <span className="text-xs text-white/50">{subtitle}</span>}
        </div>
      </div>
      <ExternalLink size={18} className="text-white/40" />
    </motion.a>
  );
};

// WiFi QR Code Component
const WiFiQRSection: React.FC<{
  ssid: string;
  password: string;
  security?: "WPA" | "WEP" | "nopass";
}> = ({ ssid, password, security = "WPA" }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const wifiString = useMemo(() => {
    const escapeValue = (str: string) => 
      str.replace(/\\/g, "\\\\")
         .replace(/;/g, "\\;")
         .replace(/:/g, "\\:")
         .replace(/"/g, '\\"');
    
    const escapedSSID = escapeValue(ssid);
    const escapedPassword = security !== "nopass" ? escapeValue(password) : "";
    
    let wifiStr = `WIFI:T:${security};S:${escapedSSID};`;
    if (security !== "nopass" && escapedPassword) {
      wifiStr += `P:${escapedPassword};`;
    }
    wifiStr += ";";
    return wifiStr;
  }, [ssid, password, security]);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success("Mot de passe copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  const handleShareWiFi = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `WiFi - ${ssid}`,
          text: `Réseau: ${ssid}\nMot de passe: ${password}`,
        });
      } catch {
        setShowQR(true);
      }
    } else {
      setShowQR(true);
    }
  };

  return (
    <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
          <Wifi size={24} className="text-[#d4af37]" />
        </div>
        <div className="flex-1">
          <p className="text-white/50 text-xs uppercase tracking-wider">Réseau WiFi</p>
          <p className="text-white font-medium text-lg">{ssid}</p>
        </div>
      </div>
      
      {/* Password with copy */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/5">
        <code className="flex-1 text-white/70 font-mono">{password}</code>
        <motion.button
          onClick={handleCopyPassword}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 transition-colors"
        >
          {copied ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-[#d4af37]" />
          )}
        </motion.button>
      </div>

      {/* Share WiFi button */}
      <motion.button
        onClick={handleShareWiFi}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] font-medium hover:bg-[#d4af37]/25 transition-colors"
      >
        <QrCode size={18} />
        <span>Partager le WiFi (QR Code)</span>
      </motion.button>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion WiFi</h3>
              <p className="text-gray-500 text-sm mb-6">Scannez pour vous connecter automatiquement</p>
              
              <div className="bg-gray-100 rounded-2xl p-6 mb-6">
                <QRCodeSVG
                  value={wifiString}
                  size={200}
                  level="M"
                  fgColor="#1a1a1a"
                  bgColor="transparent"
                  className="mx-auto"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                <strong>Réseau:</strong> {ssid}
              </p>
              
              <button
                onClick={() => setShowQR(false)}
                className="mt-6 w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Nearby Place Card
const NearbyPlaceCard: React.FC<{ place: NearbyPlace }> = ({ place }) => {
  const icons = {
    restaurant: Utensils,
    activity: Compass,
    attraction: Star,
    shop: Building2
  };
  
  const Icon = icons[place.type] || Compass;

  const handleClick = () => {
    if (place.url) {
      window.open(place.url, "_blank");
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] ${place.url ? 'cursor-pointer hover:bg-white/[0.06]' : ''} transition-colors`}
    >
      {place.image && (
        <div className="aspect-video">
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-[#d4af37]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white truncate">{place.name}</h4>
            {place.description && (
              <p className="text-sm text-white/50 line-clamp-2 mt-0.5">{place.description}</p>
            )}
            {place.distance && (
              <p className="text-xs text-[#d4af37] mt-1">{place.distance}</p>
            )}
          </div>
          {place.url && (
            <ChevronRight size={18} className="text-white/30 flex-shrink-0" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// ============ MAIN COMPONENT ============

export function VCardAirbnbBookingTemplate({ 
  data, 
  cardId, 
  isPreview = false 
}: VCardAirbnbBookingTemplateProps) {
  const [fullscreenGallery, setFullscreenGallery] = useState<number | null>(null);
  const [copiedKeyCode, setCopiedKeyCode] = useState(false);

  const photos = data.photos?.length ? data.photos : (data.coverPhoto ? [data.coverPhoto] : []);

  // vCard data
  const vcardData: VCardData = {
    firstName: data.propertyName,
    lastName: "",
    title: data.propertyType || "Hébergement",
    company: data.hostName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    website: data.website,
    whatsapp: data.whatsapp,
  };

  const handleCall = () => {
    if (data.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (data.whatsapp) {
      const cleanNumber = data.whatsapp.replace(/[^0-9+]/g, "");
      window.open(`https://wa.me/${cleanNumber.replace("+", "")}`, "_blank");
    }
  };

  const handleDirections = () => {
    if (data.directionsUrl) {
      window.open(data.directionsUrl, "_blank");
    } else if (data.latitude && data.longitude) {
      window.open(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`, "_blank");
    } else if (data.address) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(data.address)}`, "_blank");
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

  // Preview mode
  if (isPreview) {
    return (
      <div className="w-full max-w-sm bg-black rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={32} className="text-[#d4af37]/50" />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-center">vCard Airbnb Booking</h3>
          <p className="text-[#d4af37] text-sm text-center mt-1">iWasp Premium</p>
          <div className="mt-3 flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={12} className="text-[#d4af37] fill-[#d4af37]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="max-w-md mx-auto px-4 py-8">

        {/* === HEADER: Logo + Property Name === */}
        <motion.header variants={itemVariants} className="text-center mb-8">
          {data.logoUrl && (
            <div className="mb-4 flex justify-center">
              <img 
                src={data.logoUrl} 
                alt={data.propertyName}
                className="h-16 w-auto object-contain"
                style={{ filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))" }}
              />
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-white mb-1">
            {data.propertyName}
          </h1>
          
          {data.propertyType && (
            <p className="text-sm tracking-wider uppercase text-[#d4af37] mb-2">
              {data.propertyType}
            </p>
          )}
          
          {data.tagline && (
            <p className="text-white/60 text-sm">{data.tagline}</p>
          )}
          
          {data.rating && (
            <div className="flex items-center justify-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(data.rating!) ? "fill-[#d4af37] text-[#d4af37]" : "text-white/20"}
                />
              ))}
              {data.reviewCount && (
                <span className="ml-2 text-sm text-white/50">({data.reviewCount} avis)</span>
              )}
            </div>
          )}
        </motion.header>

        {/* === SECTION 1: GÉOLOCALISATION === */}
        <motion.section variants={itemVariants} className="mb-6">
          <GlassButton 
            icon={Navigation}
            variant="gold"
            onClick={handleDirections}
          >
            Nous trouver – Itinéraire
          </GlassButton>
          {data.address && (
            <p className="text-white/40 text-xs text-center mt-2">{data.address}</p>
          )}
        </motion.section>

        {/* === SECTION 2: GALERIE PHOTOS === */}
        {photos.length > 0 && (
          <motion.section variants={itemVariants} className="mb-8">
            <PhotoGallery 
              photos={photos} 
              propertyName={data.propertyName}
              onPhotoClick={(index) => setFullscreenGallery(index)}
            />
          </motion.section>
        )}

        {/* === SECTION 3: CONTACT (Appeler + WhatsApp) === */}
        {(data.phone || data.whatsapp) && (
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Contact
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.phone && (
                <GlassButton icon={Phone} onClick={handleCall}>
                  Appeler
                </GlassButton>
              )}
              {data.whatsapp && (
                <GlassButton icon={MessageCircle} variant="green" onClick={handleWhatsApp}>
                  WhatsApp
                </GlassButton>
              )}
            </div>
          </motion.section>
        )}

        {/* === SECTION 4: AVIS & CONFIANCE === */}
        {(data.airbnbReviewsUrl || data.bookingReviewsUrl || data.googleReviewsUrl) && (
          <motion.section variants={itemVariants} className="mb-8 space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Avis & Confiance
            </h2>
            
            {data.airbnbReviewsUrl && (
              <LinkButton 
                href={data.airbnbReviewsUrl} 
                icon={Star} 
                variant="airbnb"
                subtitle="Voir les avis"
              >
                Avis Airbnb
              </LinkButton>
            )}
            
            {data.bookingReviewsUrl && (
              <LinkButton 
                href={data.bookingReviewsUrl} 
                icon={Star} 
                variant="booking"
                subtitle="Voir les avis"
              >
                Avis Booking
              </LinkButton>
            )}
            
            {data.googleReviewsUrl && (
              <LinkButton 
                href={data.googleReviewsUrl} 
                icon={Star} 
                variant="gold"
                subtitle="Voir les avis"
              >
                Avis Google
              </LinkButton>
            )}
          </motion.section>
        )}

        {/* === SECTION 5: PLATEFORMES DE RÉSERVATION === */}
        {(data.airbnbUrl || data.bookingUrl || data.directBookingUrl) && (
          <motion.section variants={itemVariants} className="mb-8 space-y-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Réserver
            </h2>
            
            {data.airbnbUrl && (
              <LinkButton 
                href={data.airbnbUrl} 
                icon={Building2} 
                variant="airbnb"
                subtitle="Voir & Réserver"
              >
                Réserver sur Airbnb
              </LinkButton>
            )}
            
            {data.bookingUrl && (
              <LinkButton 
                href={data.bookingUrl} 
                icon={Building2} 
                variant="booking"
                subtitle="Voir & Réserver"
              >
                Réserver sur Booking
              </LinkButton>
            )}
            
            {data.directBookingUrl && (
              <LinkButton 
                href={data.directBookingUrl} 
                icon={CreditCard} 
                variant="gold"
                subtitle="Meilleur tarif garanti"
              >
                Réservation Directe
              </LinkButton>
            )}
          </motion.section>
        )}

        {/* === SECTION 6: INFOS SÉJOUR === */}
        {(data.checkInTime || data.checkOutTime || data.wifiSsid) && (
          <motion.section variants={itemVariants} className="mb-8 space-y-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Infos Séjour
            </h2>
            
            {/* Check-in / Check-out */}
            {(data.checkInTime || data.checkOutTime) && (
              <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.03]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center">
                    <Calendar size={22} className="text-[#d4af37]" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {data.checkInTime && (
                      <div>
                        <p className="text-white/50 text-xs">Check-in</p>
                        <p className="text-white font-medium">{data.checkInTime}</p>
                      </div>
                    )}
                    {data.checkOutTime && (
                      <div>
                        <p className="text-white/50 text-xs">Check-out</p>
                        <p className="text-white font-medium">{data.checkOutTime}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Key Box Code */}
                {data.keyBoxCode && (
                  <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/10">
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
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-white/70 text-sm leading-relaxed">
                      {data.checkInInstructions}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* WiFi Section */}
            {data.wifiSsid && data.wifiPassword && (
              <WiFiQRSection 
                ssid={data.wifiSsid} 
                password={data.wifiPassword}
                security={data.wifiSecurity || "WPA"}
              />
            )}
          </motion.section>
        )}

        {/* === SECTION 7: AUTOUR DU LOGEMENT === */}
        {data.nearbyPlaces && data.nearbyPlaces.length > 0 && (
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Autour du logement
            </h2>
            <div className="space-y-3">
              {data.nearbyPlaces.map((place, index) => (
                <NearbyPlaceCard key={index} place={place} />
              ))}
            </div>
          </motion.section>
        )}

        {/* === SECTION 8: CARTE PHYSIQUE NFC iWASP === */}
        <motion.section variants={itemVariants} className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
            Carte NFC iWasp
          </h2>
          <div 
            className="rounded-2xl p-6 border border-[#d4af37]/30 text-center"
            style={{ 
              background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0.8) 100%)"
            }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-lg">
              <CreditCard size={36} className="text-black" />
            </div>
            <h3 className="text-white font-semibold mb-1">Carte NFC Premium</h3>
            <p className="text-white/50 text-sm mb-4">
              Partagez vos infos en un geste
            </p>
            <div className="flex items-center justify-center gap-2 text-[#d4af37] text-xs">
              <img src={iwaspLogo} alt="i-Wasp" className="h-4 w-auto opacity-80" />
              <span>Powered by i-Wasp.com</span>
            </div>
          </div>
        </motion.section>

        {/* === vCard Download === */}
        <motion.section variants={itemVariants} className="mb-8">
          <VCardGoldButton 
            data={vcardData}
            label="Enregistrer le contact"
            size="lg"
          />
        </motion.section>

        {/* Global IWASP Branding Footer */}
        <motion.footer variants={itemVariants} className="pt-8 pb-4">
          <IWASPBrandingInline variant="dark" />
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

export default VCardAirbnbBookingTemplate;
