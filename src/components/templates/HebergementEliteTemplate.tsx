/**
 * Hébergement Élite Template - Airbnb / Booking Premium
 * 
 * Design: Ultra-minimal, deep black background with gold accents
 * Features: Direct booking buttons, WiFi copiable, Check-in instructions
 * 
 * Modules:
 * 1. Logo centered (large, elegant)
 * 2. Property name + rating
 * 3. Booking buttons (Airbnb, Booking, Direct)
 * 4. WiFi module (SSID + password copiable)
 * 5. Check-in instructions with arrival time
 * 6. Location with map
 * 7. WhatsApp concierge button
 * 8. Google Reviews
 * 9. vCard download (Gold Glassmorphism)
 */

import { useState } from "react";
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
  User,
  ChevronRight,
  ExternalLink
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

export function HebergementEliteTemplate({ data, isPreview = false }: HebergementEliteTemplateProps) {
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedKeyCode, setCopiedKeyCode] = useState(false);

  const handleCopyWifi = async () => {
    if (data.wifiPassword) {
      await navigator.clipboard.writeText(data.wifiPassword);
      setCopiedWifi(true);
      toast.success("Mot de passe copié !");
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

  const handleWhatsApp = () => {
    if (data.whatsapp) {
      const cleanNumber = data.whatsapp.replace(/[^0-9+]/g, "");
      window.open(`https://wa.me/${cleanNumber.replace("+", "")}`, "_blank");
    }
  };

  const handleCall = () => {
    if (data.hostPhone) {
      window.location.href = `tel:${data.hostPhone}`;
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

  // Preview mode - simplified
  if (isPreview) {
    return (
      <div className="w-full max-w-sm bg-black rounded-2xl p-6 text-white">
        <div className="w-16 h-16 rounded-xl bg-[#d4af37]/20 mx-auto mb-4 flex items-center justify-center">
          <span className="text-[#d4af37] text-2xl">🏠</span>
        </div>
        <h3 className="text-center font-semibold text-white">Hébergement Élite</h3>
        <p className="text-center text-[#d4af37] text-sm mt-1">Airbnb • Booking</p>
        <div className="mt-4 flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} className="text-[#d4af37] fill-[#d4af37]" />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-lg bg-[#d4af37]/20" />
          <div className="h-10 rounded-lg bg-white/10" />
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
      <div className="max-w-md mx-auto px-4 py-12">
        
        {/* === Header: Logo + Name + Rating === */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-10"
        >
          {/* Logo */}
          {data.logoUrl && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <img 
                src={data.logoUrl} 
                alt={data.propertyName}
                className="h-20 w-auto mx-auto object-contain"
                style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.4))" }}
              />
            </motion.div>
          )}

          {/* Property Name */}
          <h1 
            className="text-3xl font-serif font-bold tracking-tight mb-2"
            style={{ color: "#FFFFFF" }}
          >
            {data.propertyName || "Votre Hébergement"}
          </h1>

          {/* Property Type */}
          {data.propertyType && (
            <p className="text-sm tracking-[0.15em] uppercase mb-4" style={{ color: "#d4af37" }}>
              {data.propertyType}
            </p>
          )}

          {/* Rating */}
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
        </motion.header>

        {/* === Booking Buttons === */}
        {(data.airbnbUrl || data.bookingUrl || data.directBookingUrl) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Réserver
            </h2>
            <div className="space-y-3">
              {data.airbnbUrl && (
                <a
                  href={data.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-[#FF5A5F]/20 to-[#FF5A5F]/10 border border-[#FF5A5F]/30 text-white hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FF5A5F] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <span className="font-medium">Réserver sur Airbnb</span>
                  </div>
                  <ExternalLink size={18} className="text-white/60" />
                </a>
              )}
              
              {data.bookingUrl && (
                <a
                  href={data.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-[#003580]/20 to-[#003580]/10 border border-[#003580]/30 text-white hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003580] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <span className="font-medium">Réserver sur Booking</span>
                  </div>
                  <ExternalLink size={18} className="text-white/60" />
                </a>
              )}

              {data.directBookingUrl && (
                <a
                  href={data.directBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-4 rounded-xl border border-[#d4af37]/30 text-white hover:scale-[1.02] transition-transform"
                  style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(184,134,11,0.1) 100%)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center">
                      <Globe size={18} className="text-black" />
                    </div>
                    <span className="font-medium">Réservation Directe</span>
                  </div>
                  <ChevronRight size={18} className="text-[#d4af37]" />
                </a>
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
                      <code className="text-sm text-white/60 font-mono bg-white/5 px-2 py-0.5 rounded">
                        {data.wifiPassword}
                      </code>
                      <button
                        onClick={handleCopyWifi}
                        className="p-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 transition-colors"
                      >
                        {copiedWifi ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-[#d4af37]" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* === Check-in Instructions === */}
        {(data.checkInTime || data.checkInInstructions || data.keyBoxCode) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Check-in
            </h2>
            <div 
              className="rounded-2xl p-5 border border-white/10 space-y-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {data.checkInTime && (
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#d4af37]" />
                  <span className="text-white">Arrivée à partir de <strong>{data.checkInTime}</strong></span>
                </div>
              )}
              
              {data.keyBoxCode && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20">
                  <div className="flex items-center gap-3">
                    <Key size={18} className="text-[#d4af37]" />
                    <div>
                      <p className="text-xs text-white/60">Code boîte à clé</p>
                      <code className="text-lg font-mono text-white font-bold">{data.keyBoxCode}</code>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyKeyCode}
                    className="p-2 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 transition-colors"
                  >
                    {copiedKeyCode ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} className="text-[#d4af37]" />
                    )}
                  </button>
                </div>
              )}

              {data.checkInInstructions && (
                <p className="text-sm text-white/70 leading-relaxed">
                  {data.checkInInstructions}
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* === Location Module === */}
        {(data.address || data.latitude) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Localisation
            </h2>
            <div 
              className="rounded-2xl p-5 border border-white/10"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-[#d4af37] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">{data.address || "Adresse non renseignée"}</p>
                  {data.neighborhood && (
                    <p className="text-sm text-white/50 mt-1">{data.neighborhood}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMap("google")}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => handleMap("apple")}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
                >
                  <span>Apple Maps</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* === Contact Concierge === */}
        {(data.whatsapp || data.hostPhone) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Conciergerie
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.whatsapp && (
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-green-700/10 border border-green-500/30 text-white hover:scale-[1.02] transition-transform"
                >
                  <MessageCircle size={20} className="text-green-400" />
                  <span>WhatsApp</span>
                </button>
              )}
              {data.hostPhone && (
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:scale-[1.02] transition-transform"
                >
                  <Phone size={20} className="text-white/70" />
                  <span>Appeler</span>
                </button>
              )}
            </div>
          </motion.section>
        )}

        {/* === Google Reviews === */}
        {data.googleReviewsUrl && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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
                  <span className="text-xl">⭐</span>
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
            transition={{ duration: 0.6, delay: 0.85 }}
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
          transition={{ duration: 0.6, delay: 0.9 }}
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
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center pt-8 pb-4"
        >
          <p className="text-xs text-white/30">
            Powered by <span className="text-[#d4af37]">i-wasp</span>
          </p>
        </motion.footer>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}

export default HebergementEliteTemplate;
