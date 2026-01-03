/**
 * Gastronomie Élite Template - Restaurants / Bars Premium
 * 
 * Design: Ultra-minimal, deep black background with gold accents
 * Features: Menu, Table reservation, Google Reviews, Instagram
 * 
 * Modules:
 * 1. Logo centered (large, elegant)
 * 2. Restaurant name + cuisine type + rating
 * 3. Menu button (PDF or URL)
 * 4. Table reservation button
 * 5. Google Reviews button
 * 6. Instagram follow button
 * 7. Location with map
 * 8. WhatsApp / Call button
 * 9. Website
 * 10. vCard download (Gold Glassmorphism)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UtensilsCrossed, 
  CalendarCheck, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  Globe,
  User,
  ExternalLink,
  Instagram,
  Clock,
  FileText
} from "lucide-react";
import { VCardData } from "@/lib/vcard";
import { VCardGoldButton } from "@/components/VCardGoldButton";
import { StoriesSection, useCardStories } from "@/components/templates/StoriesSection";
import { toast } from "sonner";

// Template data interface
export interface GastronomieEliteData {
  // Restaurant info
  restaurantName: string;
  cuisineType?: string; // Française, Italienne, Japonaise, etc.
  tagline?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string; // €, €€, €€€, €€€€
  
  // Logo
  logoUrl?: string;
  
  // Menu
  menuUrl?: string; // PDF or webpage URL
  menuLabel?: string;
  
  // Reservation
  reservationUrl?: string;
  reservationPhone?: string;
  
  // Opening hours
  openingHours?: string;
  
  // Social
  instagramHandle?: string;
  
  // Reviews
  googleReviewsUrl?: string;
  googleRating?: number;
  
  // Location
  address?: string;
  latitude?: number;
  longitude?: number;
  neighborhood?: string;
  
  // Contact
  phone?: string;
  whatsapp?: string;
  
  // Website
  website?: string;
  
  // vCard
  email?: string;
  ownerName?: string;
}

interface GastronomieEliteTemplateProps {
  data: GastronomieEliteData;
  cardId?: string;
  isPreview?: boolean;
}

export function GastronomieEliteTemplate({ data, cardId, isPreview = false }: GastronomieEliteTemplateProps) {
  const { stories } = useCardStories(cardId);

  const handleWhatsApp = () => {
    if (data.whatsapp) {
      const cleanNumber = data.whatsapp.replace(/[^0-9+]/g, "");
      window.open(`https://wa.me/${cleanNumber.replace("+", "")}`, "_blank");
    }
  };

  const handleCall = () => {
    if (data.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  };

  const handleMap = (app: "google" | "apple") => {
    if (data.latitude && data.longitude) {
      if (app === "apple") {
        window.open(`https://maps.apple.com/?ll=${data.latitude},${data.longitude}&q=${encodeURIComponent(data.restaurantName)}`, "_blank");
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
    firstName: data.restaurantName,
    lastName: "",
    title: data.cuisineType || "Restaurant",
    company: data.ownerName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    website: data.website,
    whatsapp: data.whatsapp,
    instagram: data.instagramHandle,
  };

  // Preview mode - simplified
  if (isPreview) {
    return (
      <div className="w-full max-w-sm bg-black rounded-2xl p-6 text-white">
        <div className="w-16 h-16 rounded-xl bg-[#d4af37]/20 mx-auto mb-4 flex items-center justify-center">
          <UtensilsCrossed className="text-[#d4af37]" size={28} />
        </div>
        <h3 className="text-center font-semibold text-white">Gastronomie Élite</h3>
        <p className="text-center text-[#d4af37] text-sm mt-1">Restaurant • Bar</p>
        <div className="mt-4 flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} className="text-[#d4af37] fill-[#d4af37]" />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center gap-2">
            <FileText size={14} className="text-[#d4af37]" />
            <span className="text-xs text-[#d4af37]">Menu</span>
          </div>
          <div className="h-10 rounded-lg bg-white/10 flex items-center justify-center gap-2">
            <CalendarCheck size={14} className="text-white/70" />
            <span className="text-xs text-white/70">Réserver</span>
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
      <div className="max-w-md mx-auto px-4 py-12">

        {/* === Stories Section (Top Priority) === */}
        <StoriesSection
          cardId={cardId}
          ownerName={data.restaurantName}
          ownerPhoto={data.logoUrl}
          whatsappNumber={data.whatsapp}
          variant="premium"
        />
        
        {/* === Header: Logo + Name + Cuisine + Rating === */}
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
                alt={data.restaurantName}
                className="h-24 w-auto mx-auto object-contain"
                style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.4))" }}
              />
            </motion.div>
          )}

          {/* Restaurant Name */}
          <h1 
            className="text-3xl font-serif font-bold tracking-tight mb-2"
            style={{ color: "#FFFFFF" }}
          >
            {data.restaurantName || "Votre Restaurant"}
          </h1>

          {/* Cuisine Type & Price Range */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {data.cuisineType && (
              <span className="text-sm tracking-[0.1em] uppercase" style={{ color: "#d4af37" }}>
                {data.cuisineType}
              </span>
            )}
            {data.cuisineType && data.priceRange && (
              <span className="text-white/30">•</span>
            )}
            {data.priceRange && (
              <span className="text-sm text-white/60">{data.priceRange}</span>
            )}
          </div>

          {/* Tagline */}
          {data.tagline && (
            <p className="text-sm text-white/50 italic mb-4">"{data.tagline}"</p>
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

          {/* Opening Hours */}
          {data.openingHours && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/60">
              <Clock size={14} className="text-[#d4af37]" />
              <span>{data.openingHours}</span>
            </div>
          )}
        </motion.header>

        {/* === Primary Actions === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 space-y-3"
        >
          {/* Menu Button - Primary CTA */}
          {data.menuUrl && (
            <a
              href={data.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-full p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(184,134,11,0.15) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(212,175,55,0.4)",
                boxShadow: "0 8px 32px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%)",
                  width: "50%"
                }}
              />
              <div className="relative flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)",
                    boxShadow: "0 4px 15px rgba(212,175,55,0.4)"
                  }}
                >
                  <FileText size={22} className="text-black" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-lg">{data.menuLabel || "Consulter le Menu"}</p>
                  <p className="text-sm text-[#d4af37]">Carte & Spécialités</p>
                </div>
              </div>
              <ExternalLink size={18} className="absolute right-5 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors" />
            </a>
          )}

          {/* Reservation Button */}
          {(data.reservationUrl || data.reservationPhone) && (
            <a
              href={data.reservationUrl || `tel:${data.reservationPhone}`}
              target={data.reservationUrl ? "_blank" : undefined}
              rel={data.reservationUrl ? "noopener noreferrer" : undefined}
              className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <CalendarCheck size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Réserver une Table</p>
                  <p className="text-sm text-white/50">Garantissez votre place</p>
                </div>
              </div>
              <ExternalLink size={18} className="text-white/40" />
            </a>
          )}
        </motion.section>

        {/* === Social & Reviews === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
            Suivez-nous
          </h2>
          <div className="space-y-3">
            {/* Google Reviews */}
            {data.googleReviewsUrl && (
              <a
                href={data.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-xl border border-yellow-500/30 text-white hover:scale-[1.02] transition-all"
                style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(234,179,8,0.05) 100%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium">Laisser un Avis Google</p>
                    {data.googleRating && (
                      <p className="text-sm text-yellow-400">{data.googleRating}/5 étoiles</p>
                    )}
                  </div>
                </div>
                <ExternalLink size={18} className="text-yellow-400/60" />
              </a>
            )}

            {/* Instagram */}
            {data.instagramHandle && (
              <a
                href={`https://instagram.com/${data.instagramHandle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-xl border border-pink-500/30 text-white hover:scale-[1.02] transition-all"
                style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.1) 100%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}>
                    <Instagram size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Suivre sur Instagram</p>
                    <p className="text-sm text-pink-400">@{data.instagramHandle.replace("@", "")}</p>
                  </div>
                </div>
                <ExternalLink size={18} className="text-pink-400/60" />
              </a>
            )}
          </div>
        </motion.section>

        {/* === Location Module === */}
        {(data.address || data.latitude) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Nous trouver
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

        {/* === Contact === */}
        {(data.whatsapp || data.phone) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
              Contact
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
              {data.phone && (
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
                <span>Visiter notre site</span>
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
    </motion.div>
  );
}

export default GastronomieEliteTemplate;
