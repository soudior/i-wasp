/**
 * KÔYA Restaurant Lounge - Digital Business Card
 * 
 * Design: Luxe warm ambiance with golden arches inspiration
 * Premium Moroccan restaurant & lounge aesthetic
 */

import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  MapPin, 
  Star, 
  Globe, 
  Instagram,
  MessageCircle,
  Clock,
  ChefHat,
  Wine,
  Utensils,
  ExternalLink,
  CalendarCheck,
  Sparkles,
  User,
  Facebook,
  Music2,
  Navigation,
  Award
} from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { toast } from "sonner";
import { useState } from "react";
import koyaLogo from "@/assets/koya-logo.png";

// KÔYA Brand Colors
const KOYA_COLORS = {
  background: "#0f0906",
  cardBg: "#1a120b",
  gold: "#d4a574",
  goldLight: "#e8c49a",
  goldDark: "#b8860b",
  accent: "#c9a87c",
  text: "#ffffff",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.5)",
};

// Restaurant Data
const koyaData = {
  name: "KÔYA",
  subtitle: "Restaurant Lounge",
  rating: 4.9,
  reviewCount: "1.4k",
  priceRange: "+ 500 MAD",
  cuisine: "Asian Fusion · Lounge & Bar",
  status: "Ouvert",
  features: ["Réservation obligatoire", "Terrasse", "Rooftop Bar", "DJ Sets"],
  phone: "+212662622452",
  whatsapp: "+212662622452",
  website: "https://ikoyamarrakech.com",
  reservationUrl: "https://ikoyamarrakech.com/reservation/",
  instagram: "koyamarrakech",
  facebook: "koyamarrakech",
  tiktok: "@koyamarrakech",
  tripadvisor: "https://www.tripadvisor.com/Restaurant_Review-g293734-d25010867-Reviews-IKoya-Marrakech_Marrakech_Safi.html",
  googleReviews: "https://g.co/kgs/Y8K5Kkz",
  address: "Avenue Echouhada, Hivernage, Marrakech",
  openingHours: "19:00 - 02:00",
  latitude: 31.6226,
  longitude: -8.0159,
};

// Animated background pattern component
function GoldenArchPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute w-full h-full opacity-[0.03]"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="arches" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M0,100 Q50,20 100,100" 
              fill="none" 
              stroke="#d4a574" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arches)" />
      </svg>
    </div>
  );
}

// Action Button Component - Optimized for instant link opening
function ActionButton({ 
  icon, 
  label, 
  sublabel,
  onClick, 
  href,
  variant = "default",
  gradient
}: { 
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "primary" | "whatsapp" | "gold";
  gradient?: string;
}) {
  const baseStyles = "group relative flex items-center w-full p-4 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform duration-100";
  
  const variants = {
    default: {
      bg: "rgba(255,255,255,0.05)",
      border: "rgba(255,255,255,0.1)",
      iconBg: "rgba(255,255,255,0.1)",
      iconColor: KOYA_COLORS.gold,
    },
    primary: {
      bg: `linear-gradient(135deg, ${KOYA_COLORS.gold}20 0%, ${KOYA_COLORS.goldDark}10 100%)`,
      border: `${KOYA_COLORS.gold}40`,
      iconBg: `linear-gradient(135deg, ${KOYA_COLORS.gold} 0%, ${KOYA_COLORS.goldDark} 100%)`,
      iconColor: "#000",
    },
    whatsapp: {
      bg: "linear-gradient(135deg, rgba(37,211,102,0.15) 0%, rgba(37,211,102,0.05) 100%)",
      border: "rgba(37,211,102,0.3)",
      iconBg: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
      iconColor: "#fff",
    },
    gold: {
      bg: `linear-gradient(135deg, ${KOYA_COLORS.gold}25 0%, ${KOYA_COLORS.goldDark}15 100%)`,
      border: `${KOYA_COLORS.gold}50`,
      iconBg: `linear-gradient(135deg, ${KOYA_COLORS.gold} 0%, ${KOYA_COLORS.goldDark} 100%)`,
      iconColor: "#000",
    },
  };

  const v = variants[variant];

  // FAST: Direct navigation without animation delays
  const handleFastClick = (e: React.MouseEvent) => {
    if (href) {
      e.preventDefault();
      // Use location.href for same-tab or window.open for new tab - both are instant
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <button 
      onClick={handleFastClick}
      className={`w-full text-left ${baseStyles}`}
      style={{
        background: gradient || v.bg,
        border: `1px solid ${v.border}`,
      }}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: v.iconBg }}
      >
        <span style={{ color: v.iconColor }}>{icon}</span>
      </div>
      <div className="ml-4 flex-1">
        <p className="font-semibold text-white">{label}</p>
        {sublabel && (
          <p className="text-sm" style={{ color: KOYA_COLORS.textMuted }}>{sublabel}</p>
        )}
      </div>
      <ExternalLink size={18} className="text-white/30" />
    </button>
  );
}

// Main Component
export default function KoyaCard() {
  const [isVCardLoading, setIsVCardLoading] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${koyaData.phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite réserver une table chez KÔYA.");
    window.open(`https://wa.me/${koyaData.whatsapp.replace("+", "")}?text=${message}`, "_blank");
  };

  const handleMap = (app: "google" | "apple" | "waze") => {
    const { latitude, longitude, address, name } = koyaData;
    const urls = {
      google: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      apple: `https://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(name)}`,
      waze: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
    };
    window.open(urls[app], "_blank");
  };

  const handleVCard = async () => {
    setIsVCardLoading(true);
    try {
      const vcardData: VCardData = {
        firstName: "KÔYA",
        lastName: "Restaurant Lounge",
        company: "KÔYA Marrakech",
        title: "Restaurant Lounge",
        phone: koyaData.phone,
        whatsapp: koyaData.whatsapp,
        website: koyaData.website,
        address: koyaData.address,
        instagram: koyaData.instagram,
        googleMapsUrl: `https://www.google.com/maps?q=${koyaData.latitude},${koyaData.longitude}`,
      };
      downloadVCard(vcardData);
      toast.success("Contact ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsVCardLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full relative"
      style={{ backgroundColor: KOYA_COLORS.background }}
    >
      <GoldenArchPattern />
      
      <div className="relative z-10 max-w-md mx-auto px-5 py-8 pb-20">
        
        {/* === Hero Section === */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-10"
        >
          {/* Logo / Brand Mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative mx-auto mb-6"
          >
            {/* Outer glow ring */}
            <div 
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{
                background: `radial-gradient(circle, ${KOYA_COLORS.gold}30 0%, transparent 70%)`,
                transform: "scale(1.2)",
              }}
            />
            {/* Logo Image */}
            <img 
              src={koyaLogo}
              alt="KÔYA Restaurant Lounge"
              className="relative h-24 w-auto mx-auto object-contain"
              style={{
                filter: `drop-shadow(0 0 30px ${KOYA_COLORS.gold}40)`,
              }}
            />
          </motion.div>

          {/* Restaurant Name */}
          <h1 
            className="text-4xl font-serif font-bold tracking-tight mb-1"
            style={{ color: KOYA_COLORS.text }}
          >
            {koyaData.name}
          </h1>
          <p 
            className="text-lg tracking-[0.15em] uppercase"
            style={{ color: KOYA_COLORS.gold }}
          >
            {koyaData.subtitle}
          </p>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className={i <= Math.round(koyaData.rating) 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-white/20"
                  }
                />
              ))}
            </div>
            <span 
              className="text-sm font-medium"
              style={{ color: KOYA_COLORS.gold }}
            >
              {koyaData.rating}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-sm text-white/60">{koyaData.reviewCount} avis</span>
          </motion.div>

          {/* Cuisine & Price */}
          <p 
            className="text-sm mt-3"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            {koyaData.cuisine} · {koyaData.priceRange}
          </p>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
            style={{
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">{koyaData.status}</span>
            <span className="text-white/40">•</span>
            <Clock size={14} className="text-white/50" />
            <span className="text-sm text-white/60">{koyaData.openingHours}</span>
          </motion.div>

          {/* Features Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {koyaData.features.map((feature, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  background: `${KOYA_COLORS.gold}10`,
                  border: `1px solid ${KOYA_COLORS.gold}20`,
                  color: KOYA_COLORS.textSecondary,
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.header>

        {/* === Primary Actions === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mb-8"
        >
          <h2 
            className="text-xs uppercase tracking-[0.2em] mb-3 px-1"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            Réservation
          </h2>
          
          <ActionButton
            icon={<CalendarCheck size={22} />}
            label="Réserver une Table"
            sublabel="Réservation en ligne"
            variant="gold"
            href={koyaData.reservationUrl}
          />
          
          <ActionButton
            icon={<MessageCircle size={22} />}
            label="WhatsApp"
            sublabel={koyaData.whatsapp}
            variant="whatsapp"
            onClick={handleWhatsApp}
          />
        </motion.section>

        {/* === Social Media & Reviews === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3 mb-8"
        >
          <h2 
            className="text-xs uppercase tracking-[0.2em] mb-3 px-1"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            Réseaux & Avis
          </h2>

          <ActionButton
            icon={<Instagram size={22} />}
            label="Instagram"
            sublabel={`@${koyaData.instagram}`}
            variant="primary"
            href={`https://instagram.com/${koyaData.instagram}`}
          />

          <ActionButton
            icon={<Facebook size={22} />}
            label="Facebook"
            sublabel="KÔYA Marrakech"
            href={`https://facebook.com/${koyaData.facebook}`}
          />

          <ActionButton
            icon={<Music2 size={22} />}
            label="TikTok"
            sublabel={koyaData.tiktok}
            href={`https://tiktok.com/${koyaData.tiktok}`}
          />

          <ActionButton
            icon={<Star size={22} />}
            label="Google Reviews"
            sublabel="4.9 ★ · 1.4k avis"
            variant="gold"
            href={koyaData.googleReviews}
          />

          <ActionButton
            icon={<Award size={22} />}
            label="TripAdvisor"
            sublabel="Top Restaurant Hivernage"
            href={koyaData.tripadvisor}
          />
        </motion.section>

        {/* === Discover === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="space-y-3 mb-8"
        >
          <h2 
            className="text-xs uppercase tracking-[0.2em] mb-3 px-1"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            Découvrir
          </h2>

          <ActionButton
            icon={<Utensils size={22} />}
            label="Menu & Carte"
            sublabel="Asian Fusion & Cocktails"
            variant="primary"
            href={koyaData.website}
          />

          <ActionButton
            icon={<Globe size={22} />}
            label="Site Officiel"
            sublabel="ikoyamarrakech.com"
            href={koyaData.website}
          />
        </motion.section>

        {/* === Location === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 
            className="text-xs uppercase tracking-[0.2em] mb-3 px-1"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            Nous Trouver
          </h2>
          
          <div 
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={20} style={{ color: KOYA_COLORS.gold }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white">{koyaData.address}</p>
                <p className="text-sm text-white/50 mt-1">Marrakech, Maroc</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Google", app: "google" as const },
                { label: "Apple", app: "apple" as const },
                { label: "Waze", app: "waze" as const },
              ].map(({ label, app }) => (
                <button
                  key={app}
                  onClick={() => handleMap(app)}
                  className="p-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: KOYA_COLORS.textSecondary,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* === Contact === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 mb-8"
        >
          <h2 
            className="text-xs uppercase tracking-[0.2em] mb-3 px-1"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            Contact
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Phone size={20} style={{ color: KOYA_COLORS.gold }} />
              <span className="text-white font-medium">Appeler</span>
            </button>
            
            <button
              onClick={handleVCard}
              disabled={isVCardLoading}
              className="flex items-center justify-center gap-2 p-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${KOYA_COLORS.gold}15 0%, ${KOYA_COLORS.goldDark}10 100%)`,
                border: `1px solid ${KOYA_COLORS.gold}30`,
              }}
            >
              <User size={20} style={{ color: KOYA_COLORS.gold }} />
              <span style={{ color: KOYA_COLORS.gold }} className="font-medium">
                {isVCardLoading ? "..." : "Ajouter"}
              </span>
            </button>
          </div>
        </motion.section>

        {/* === Footer === */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-6"
        >
          <div 
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color: KOYA_COLORS.textMuted }}
          >
            <Sparkles size={12} style={{ color: KOYA_COLORS.gold }} />
            <span>Powered by</span>
            <a 
              href="https://i-wasp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: KOYA_COLORS.gold }}
            >
              i-wasp.com
            </a>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
}
