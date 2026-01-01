/**
 * Herbalism Marrakech - Premium NFC Digital Card
 * 
 * Client: Herbalism Marrakech
 * Activity: Natural Products & Herbal Store
 * Location: Marrakech, Morocco
 */

import { useState, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { 
  Phone, Mail, MapPin, Globe, Instagram, Star, MessageCircle,
  Navigation, ExternalLink, User, CreditCard
} from "lucide-react";
import { downloadVCard } from "@/lib/vcard";
import { toast } from "sonner";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Herbalism Marrakech Brand Colors
const BRAND_COLORS = {
  primary: "#2E7D32", // Deep natural green (extracted from site)
  secondary: "#F5F5F0", // Warm white/beige
  accent: "#4CAF50", // Light green
  text: "#1D1D1F", // Soft black
  textLight: "#6B6B6B",
};

// Client Data
const herbalismData = {
  name: "Herbalism Marrakech",
  tagline: "Natural Products & Herbal Store",
  location: "Marrakech, Morocco",
  address: "Sabt moulay elhaj el maslouhi, n°67 Souk Laksour, Medina, Marrakech 40000",
  coordinates: {
    lat: 31.6295,
    lng: -7.9811,
  },
  phone: "+2128086-68971",
  website: "https://www.herbalismmarrakech.com",
  whatsapp: "+2128086-68971",
  instagram: "herbalismmarrakech",
  googleReviews: "https://www.tripadvisor.fr/Attraction_Review-g293734-d25386907-Reviews-Herbalism_Marrakech-Marrakech_Marrakech_Safi.html",
  hours: "9:00 - 21:30, tous les jours",
  experience: "15 ans d'expérience",
  logoUrl: "https://static.wixstatic.com/media/308acb_7bf0bda824ed46ef99c6dbde270c3970~mv2.jpg/v1/fill/w_400,h_400,al_c,q_80/308acb_7bf0bda824ed46ef99c6dbde270c3970~mv2.webp",
};

// 3D Tilt hook
function useTilt3D(intensity: number = 10) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    rotateX.set((mouseY / (rect.height / 2)) * -intensity);
    rotateY.set((mouseX / (rect.width / 2)) * intensity);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: { rotateX: smoothRotateX, rotateY: smoothRotateY },
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
  };
}

// Action Button Component
function ActionButton({ 
  icon: Icon, 
  label, 
  sublabel,
  href,
  onClick,
  variant = "default"
}: { 
  icon: React.ElementType; 
  label: string; 
  sublabel?: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "whatsapp";
}) {
  const baseClasses = "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group";
  const variantClasses = {
    default: "bg-white border border-[#E8E8E8] hover:border-[#2E7D32]/30 hover:bg-[#F8FBF8]",
    primary: "bg-[#2E7D32] text-white hover:bg-[#256929] shadow-lg shadow-[#2E7D32]/20",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/20",
  };

  const content = (
    <motion.div 
      className={`${baseClasses} ${variantClasses[variant]}`}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
        variant === "default" ? "bg-[#2E7D32]/10" : "bg-white/20"
      }`}>
        <Icon size={20} className={variant === "default" ? "text-[#2E7D32]" : "text-white"} />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${variant === "default" ? "text-[#1D1D1F]" : "text-white"}`}>
          {label}
        </p>
        {sublabel && (
          <p className={`text-sm ${variant === "default" ? "text-[#6B6B6B]" : "text-white/80"}`}>
            {sublabel}
          </p>
        )}
      </div>
      <ExternalLink size={16} className={`opacity-40 group-hover:opacity-70 transition-opacity ${
        variant === "default" ? "text-[#1D1D1F]" : "text-white"
      }`} />
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="block w-full">
      {content}
    </button>
  );
}

// Mini Map Component
function MiniMap({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;
  
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8E8E8] bg-white">
      <iframe
        src={mapUrl}
        className="w-full h-40 border-0"
        loading="lazy"
        title="Location"
      />
      <div className="p-3 border-t border-[#E8E8E8]">
        <p className="text-xs text-[#6B6B6B] line-clamp-2">{address}</p>
      </div>
    </div>
  );
}

// Navigation Buttons
function NavigationButtons({ lat, lng, address }: { lat: number; lng: number; address: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#2E7D32]/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 flex items-center justify-center">
          <Navigation size={16} className="text-[#4285F4]" />
        </div>
        <span className="text-[10px] font-medium text-[#1D1D1F]">Google Maps</span>
      </a>
      
      <a
        href={`https://maps.apple.com/?daddr=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#2E7D32]/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-[#000000]/10 flex items-center justify-center">
          <MapPin size={16} className="text-[#000000]" />
        </div>
        <span className="text-[10px] font-medium text-[#1D1D1F]">Apple Plans</span>
      </a>
      
      <a
        href={`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#2E7D32]/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-[#33CCFF]/10 flex items-center justify-center">
          <Navigation size={16} className="text-[#33CCFF]" />
        </div>
        <span className="text-[10px] font-medium text-[#1D1D1F]">Waze</span>
      </a>
    </div>
  );
}

// Physical Card Preview Component
function PhysicalCardPreview() {
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt3D(12);
  
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card Preview */}
      <motion.div 
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          width: 320,
          aspectRatio: 1.585,
          backgroundColor: BRAND_COLORS.primary,
          rotateX: tiltStyle.rotateX,
          rotateY: tiltStyle.rotateY,
          transformPerspective: 1000,
        }}
        {...tiltHandlers}
        whileHover={{ scale: 1.02 }}
      >
        {/* Top reflection */}
        <div 
          className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 100%)",
          }}
        />

        {/* Logo centered - full format */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <img 
            src={herbalismData.logoUrl} 
            alt="Herbalism Marrakech"
            className="w-full h-full object-cover rounded-xl opacity-90"
            style={{
              filter: "brightness(1.1) contrast(1.05)",
            }}
          />
        </div>

        {/* IWASP badge - top right */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/20 backdrop-blur-sm">
          <span className="text-[9px] font-semibold text-white/80 tracking-wider">
            IWASP
          </span>
        </div>

        {/* NFC indicator - bottom right */}
        <div className="absolute bottom-3 right-3">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-5 h-5"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          >
            <path d="M6 12a6 6 0 0 0 6 6" strokeLinecap="round" />
            <path d="M6 6a12 12 0 0 0 0 12" strokeLinecap="round" />
            <path d="M12 18a6 6 0 0 0 6-6" strokeLinecap="round" />
            <path d="M18 6a12 12 0 0 1 0 12" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>

        {/* Bottom shadow */}
        <div 
          className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Dimensions */}
      <p className="text-xs text-[#6B6B6B]">
        Format CR80 · 85.6 × 54 mm · Finition mate
      </p>
    </div>
  );
}

export default function HerbalismCard() {
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt3D(8);
  const [activeTab, setActiveTab] = useState("digital");
  
  const handleAddContact = () => {
    downloadVCard({
      firstName: "Herbalism",
      lastName: "Marrakech",
      title: "Natural Products & Herbal Store",
      company: "Herbalism Marrakech",
      phone: herbalismData.phone,
    });
    toast.success("Contact ajouté !");
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: BRAND_COLORS.secondary }}
    >
      {/* Header gradient */}
      <div 
        className="h-32 w-full"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)` 
        }}
      />
      
      {/* Tabs */}
      <div className="relative -mt-6 px-4 max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-white shadow-lg rounded-2xl p-1.5">
            <TabsTrigger 
              value="digital" 
              className="rounded-xl data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white"
            >
              <Globe size={16} className="mr-2" />
              Carte Digitale
            </TabsTrigger>
            <TabsTrigger 
              value="physical"
              className="rounded-xl data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white"
            >
              <CreditCard size={16} className="mr-2" />
              Carte Physique
            </TabsTrigger>
          </TabsList>

          {/* Digital Card Tab */}
          <TabsContent value="digital" className="mt-4">
            <motion.div 
              className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden"
              style={{ 
                rotateX: tiltStyle.rotateX, 
                rotateY: tiltStyle.rotateY,
                transformPerspective: 1000,
              }}
              {...tiltHandlers}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Logo & Header */}
              <div className="p-6 text-center border-b border-[#E8E8E8]">
                {/* Logo */}
                <motion.div 
                  className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <img 
                    src={herbalismData.logoUrl} 
                    alt="Herbalism Marrakech"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Name */}
                <motion.h1 
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: BRAND_COLORS.text }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {herbalismData.name}
                </motion.h1>
                
                {/* Tagline */}
                <motion.p 
                  className="text-sm mt-1"
                  style={{ color: BRAND_COLORS.primary }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {herbalismData.tagline}
                </motion.p>
                
                {/* Location & Experience */}
                <motion.div 
                  className="flex items-center justify-center gap-2 mt-3 text-xs"
                  style={{ color: BRAND_COLORS.textLight }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <MapPin size={12} />
                  <span>{herbalismData.location}</span>
                  <span>•</span>
                  <span>{herbalismData.experience}</span>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="p-5 space-y-3">
                {/* Website */}
                <ActionButton
                  icon={Globe}
                  label="Visiter le site"
                  sublabel="herbalismmarrakech.com"
                  href={herbalismData.website}
                />
                
                {/* Location Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 px-1">
                    <MapPin size={14} style={{ color: BRAND_COLORS.primary }} />
                    <span className="text-sm font-medium" style={{ color: BRAND_COLORS.text }}>
                      Nous trouver
                    </span>
                  </div>
                  
                  <MiniMap 
                    lat={herbalismData.coordinates.lat} 
                    lng={herbalismData.coordinates.lng}
                    address={herbalismData.address}
                  />
                  
                  <NavigationButtons
                    lat={herbalismData.coordinates.lat}
                    lng={herbalismData.coordinates.lng}
                    address={herbalismData.address}
                  />
                </div>

                {/* WhatsApp */}
                <ActionButton
                  icon={MessageCircle}
                  label="WhatsApp"
                  sublabel="Envoyez-nous un message"
                  href={`https://wa.me/${herbalismData.whatsapp.replace(/[^0-9]/g, '')}`}
                  variant="whatsapp"
                />

                {/* Instagram */}
                <ActionButton
                  icon={Instagram}
                  label="Instagram"
                  sublabel={`@${herbalismData.instagram}`}
                  href={`https://instagram.com/${herbalismData.instagram}`}
                />

                {/* Google Reviews */}
                <ActionButton
                  icon={Star}
                  label="Voir nos avis"
                  sublabel="#4 Shopping à Marrakech"
                  href={herbalismData.googleReviews}
                />

                {/* Phone */}
                <ActionButton
                  icon={Phone}
                  label="Appeler"
                  sublabel={herbalismData.phone}
                  href={`tel:${herbalismData.phone}`}
                />
              </div>

              {/* Add to Contact */}
              <div className="p-5 pt-0">
                <motion.button
                  onClick={handleAddContact}
                  className="w-full py-4 rounded-2xl font-semibold text-white shadow-lg"
                  style={{ 
                    backgroundColor: BRAND_COLORS.primary,
                    boxShadow: `0 10px 30px -10px ${BRAND_COLORS.primary}60`
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User size={18} />
                    <span>Ajouter aux contacts</span>
                  </div>
                </motion.button>
              </div>

              {/* Hours */}
              <div className="px-6 pb-6 text-center">
                <p className="text-xs" style={{ color: BRAND_COLORS.textLight }}>
                  Ouvert {herbalismData.hours}
                </p>
              </div>
            </motion.div>
          </TabsContent>

          {/* Physical Card Tab */}
          <TabsContent value="physical" className="mt-4">
            <motion.div 
              className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold" style={{ color: BRAND_COLORS.text }}>
                  Carte NFC Physique
                </h2>
                <p className="text-sm mt-1" style={{ color: BRAND_COLORS.textLight }}>
                  Prête à être livrée
                </p>
              </div>

              <PhysicalCardPreview />

              <div className="mt-6 space-y-3 text-sm" style={{ color: BRAND_COLORS.textLight }}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F0]">
                  <div className="w-8 h-8 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
                    <span className="text-lg">🌿</span>
                  </div>
                  <span>Couleur vert naturel profond</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F0]">
                  <div className="w-8 h-8 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
                    <span className="text-lg">✨</span>
                  </div>
                  <span>Logo plein format, finition premium</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F0]">
                  <div className="w-8 h-8 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <span>NFC intégré, compatible tous smartphones</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Powered by IWASP */}
        <motion.div 
          className="mt-6 pb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[10px] tracking-wide" style={{ color: BRAND_COLORS.textLight }}>
            Powered by <span className="font-semibold">IWASP</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}