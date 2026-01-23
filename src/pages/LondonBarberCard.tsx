/**
 * London Barber - Premium NFC Digital Card
 * 
 * Client: Achraf - London Barber
 * Activity: Barber Shop
 * Location: Marrakech, Morocco
 * 
 * Features:
 * - vCard complète avec toutes les infos
 * - Horaires d'ouverture
 * - Réservation via WhatsApp
 * - Localisation Google Maps
 */

import { useState, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { 
  Phone, MapPin, Clock, MessageCircle,
  Navigation, ExternalLink, User, Calendar, Scissors, Coffee
} from "lucide-react";
import { downloadVCard } from "@/lib/vcard";
import { toast } from "sonner";
import { motion, useMotionValue, useSpring } from "framer-motion";
import storefrontImage from "@/assets/london-barber-storefront.jpeg";
import londonBarberLogo from "@/assets/london-barber-logo.png";
import { GalleryCarousel } from "@/components/london-barber/GalleryCarousel";

// London Barber Brand Colors - Warm wood & classic barber
const BRAND_COLORS = {
  primary: "#8B4513", // Rich brown (wood tone)
  secondary: "#F5F5F0", // Warm cream
  accent: "#C41E3A", // Classic barber red
  text: "#1D1D1F",
  textLight: "#6B6B6B",
  wood: "#A0522D", // Sienna wood
};

// Client Data
const barberData = {
  name: "London Barber",
  owner: "Achraf",
  tagline: "Coiffeur Barbier Professionnel",
  location: "Marrakech, Maroc",
  address: "Immeuble 17, Marrakech",
  coordinates: {
    lat: 31.654352,
    lng: -8.029091,
  },
  googleMapsUrl: "https://maps.google.com/?q=31.654352,-8.029091",
  phone: "+212604403808",
  whatsapp: "+212604403808",
  hours: {
    open: "11h30",
    close: "22h30",
    breakStart: "15h30",
    breakEnd: "17h00",
  },
};

// Services offered
const SERVICES = [
  { icon: Scissors, label: "Coupe" },
  { icon: User, label: "Barbe" },
  { icon: Coffee, label: "Rasage" },
];

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
    default: "bg-white border border-[#E8E8E8] hover:border-[#8B4513]/30 hover:bg-[#FBF9F7]",
    primary: "bg-[#8B4513] text-white hover:bg-[#7A3D11] shadow-lg shadow-[#8B4513]/20",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/20",
  };

  const content = (
    <motion.div 
      className={`${baseClasses} ${variantClasses[variant]}`}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
        variant === "default" ? "bg-[#8B4513]/10" : "bg-white/20"
      }`}>
        <Icon size={20} className={variant === "default" ? "text-[#8B4513]" : "text-white"} />
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

// Navigation Buttons
function NavigationButtons({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#8B4513]/30 transition-colors"
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
        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#8B4513]/30 transition-colors"
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
        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-[#E8E8E8] hover:border-[#8B4513]/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-[#33CCFF]/10 flex items-center justify-center">
          <Navigation size={16} className="text-[#33CCFF]" />
        </div>
        <span className="text-[10px] font-medium text-[#1D1D1F]">Waze</span>
      </a>
    </div>
  );
}

// Opening Hours Component
function OpeningHours() {
  const { hours } = barberData;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + currentMinute / 60;
  
  // Parse hours
  const openTime = 11.5; // 11h30
  const closeTime = 22.5; // 22h30
  const breakStart = 15.5; // 15h30
  const breakEnd = 17; // 17h00
  
  const isOpen = (currentTime >= openTime && currentTime < breakStart) || 
                 (currentTime >= breakEnd && currentTime < closeTime);
  const isOnBreak = currentTime >= breakStart && currentTime < breakEnd;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#8B4513]" />
          <span className="font-medium text-[#1D1D1F]">Horaires</span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          isOpen 
            ? "bg-green-100 text-green-700" 
            : isOnBreak 
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
        }`}>
          {isOpen ? "Ouvert" : isOnBreak ? "Pause déjeuner" : "Fermé"}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Matin</span>
          <span className="text-[#1D1D1F] font-medium">{hours.open} - {hours.breakStart}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B] flex items-center gap-1">
            <Coffee size={12} />
            Pause déjeuner
          </span>
          <span className="text-[#6B6B6B]">{hours.breakStart} - {hours.breakEnd}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B6B6B]">Après-midi</span>
          <span className="text-[#1D1D1F] font-medium">{hours.breakEnd} - {hours.close}</span>
        </div>
      </div>
    </div>
  );
}

// Booking Message Generator
function generateBookingMessage() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };
  
  return encodeURIComponent(
    `Bonjour Achraf ! 👋\n\n` +
    `Je souhaite réserver un créneau chez London Barber.\n\n` +
    `📅 Date souhaitée : ${formatDate(tomorrow)}\n` +
    `⏰ Heure souhaitée : [À préciser]\n` +
    `✂️ Service : [Coupe / Barbe / Rasage]\n\n` +
    `Merci de me confirmer la disponibilité !`
  );
}

export default function LondonBarberCard() {
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt3D(8);
  
  const handleAddContact = () => {
    downloadVCard({
      firstName: "Achraf",
      lastName: "London Barber",
      title: "Coiffeur Barbier Professionnel",
      company: "London Barber",
      phone: barberData.phone,
      whatsapp: barberData.whatsapp,
      address: barberData.address,
      city: "Marrakech",
      country: "Maroc",
      googleMapsUrl: barberData.googleMapsUrl,
      note: `Horaires: ${barberData.hours.open}-${barberData.hours.close} (Pause: ${barberData.hours.breakStart}-${barberData.hours.breakEnd})`,
    });
    toast.success("Contact ajouté !");
  };

  const handleBooking = () => {
    const message = generateBookingMessage();
    const whatsappUrl = `https://wa.me/${barberData.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: BRAND_COLORS.secondary }}
    >
      {/* Hero Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={storefrontImage} 
          alt="London Barber"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Classic Barber Pole indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
          <div className="w-2 h-2 rounded-full bg-[#C41E3A]" />
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-[#0047AB]" />
        </div>
      </div>
      
      {/* Main Card */}
      <div className="relative -mt-16 px-4 pb-8 max-w-md mx-auto">
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
          {/* Header */}
          <div className="p-6 text-center border-b border-[#E8E8E8]">
            {/* Logo Badge */}
            <motion.div 
              className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden bg-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <img 
                src={londonBarberLogo} 
                alt="London Barber Logo" 
                className="w-16 h-16 object-contain"
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
              {barberData.name}
            </motion.h1>
            
            {/* Owner */}
            <motion.p 
              className="text-base mt-1 font-medium"
              style={{ color: BRAND_COLORS.primary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {barberData.owner}
            </motion.p>
            
            {/* Tagline */}
            <motion.p 
              className="text-sm mt-1"
              style={{ color: BRAND_COLORS.textLight }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {barberData.tagline}
            </motion.p>
            
            {/* Location */}
            <motion.div 
              className="flex items-center justify-center gap-2 mt-3 text-xs"
              style={{ color: BRAND_COLORS.textLight }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MapPin size={12} />
              <span>{barberData.location}</span>
            </motion.div>
            
            {/* Services */}
            <motion.div 
              className="flex items-center justify-center gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {SERVICES.map((service, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-1"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${BRAND_COLORS.primary}15` }}
                  >
                    <service.icon size={18} style={{ color: BRAND_COLORS.primary }} />
                  </div>
                  <span className="text-[10px] font-medium text-[#6B6B6B]">{service.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Actions */}
          <div className="p-5 space-y-3">
            {/* Opening Hours */}
            <OpeningHours />
            
            {/* Book via WhatsApp - Primary CTA */}
            <ActionButton
              icon={Calendar}
              label="Réserver un créneau"
              sublabel="Envoyez votre demande via WhatsApp"
              onClick={handleBooking}
              variant="whatsapp"
            />
            
            {/* Direct WhatsApp */}
            <ActionButton
              icon={MessageCircle}
              label="WhatsApp"
              sublabel={barberData.whatsapp}
              href={`https://wa.me/${barberData.whatsapp.replace(/[^0-9]/g, '')}`}
            />
            
            {/* Phone */}
            <ActionButton
              icon={Phone}
              label="Appeler"
              sublabel={barberData.phone}
              href={`tel:${barberData.phone}`}
            />
            
            {/* Gallery */}
            <GalleryCarousel brandColors={BRAND_COLORS} />
            
            {/* Location Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 px-1">
                <MapPin size={14} style={{ color: BRAND_COLORS.primary }} />
                <span className="text-sm font-medium" style={{ color: BRAND_COLORS.text }}>
                  Nous trouver
                </span>
              </div>
              
              <NavigationButtons
                lat={barberData.coordinates.lat}
                lng={barberData.coordinates.lng}
              />
            </div>
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

          {/* Footer */}
          <div className="px-5 pb-6">
            <div className="text-center pt-5 border-t border-[#E8E8E8]">
              <p className="text-[11px] text-[#8E8E93] tracking-widest uppercase font-medium">
                i-wasp.co <span className="text-[#6B6B6B]">Corporation</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
