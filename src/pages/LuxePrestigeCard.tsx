/**
 * LuxePrestigeCard - Carte de visite digitale ultra-luxe
 * 
 * Conciergerie de luxe: voitures, jets privés, montgolfières, riads
 * Design IWASP premium avec thème noir et or
 */

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin, Plane, Car, Home, Sparkles } from "lucide-react";
import { useState } from "react";
import luxePrestigeLogo from "@/assets/luxe-prestige-logo.png";
// Palette ultra-luxe noir et or
const LUXE_COLORS = {
  background: "#0A0A0A",
  card: "#111111",
  gold: "#D4AF37",
  goldLight: "#F4E4BC",
  goldDark: "#B8960C",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  accent: "#1C1C1C",
};

// Données de contact
const CONTACT = {
  name: "Luxe Prestige",
  tagline: "L'excellence au service de vos désirs",
  title: "Conciergerie de Luxe",
  location: "Marrakech, Maroc",
  phone: "+212 600 000 000",
  whatsapp: "+212600000000",
  email: "contact@luxeprestige.ma",
  services: [
    { icon: Car, label: "Véhicules de Luxe", desc: "Rolls-Royce, Bentley, Lamborghini" },
    { icon: Plane, label: "Aviation Privée", desc: "Jets & Hélicoptères" },
    { icon: Sparkles, label: "Expériences", desc: "Montgolfières, Désert, Spa" },
    { icon: Home, label: "Riads de Prestige", desc: "Villas & Palais exclusifs" },
  ],
};

export default function LuxePrestigeCard() {
  const [isPressed, setIsPressed] = useState<string | null>(null);

  const handleCall = () => {
    window.location.href = `tel:${CONTACT.phone}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite des informations sur vos services de conciergerie.");
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${message}`, "_blank");
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT.email}?subject=Demande d'information - Luxe Prestige`;
  };

  const handleAddContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${CONTACT.name}
ORG:${CONTACT.name}
TITLE:${CONTACT.title}
TEL;TYPE=CELL:${CONTACT.phone}
EMAIL:${CONTACT.email}
ADR;TYPE=WORK:;;${CONTACT.location}
NOTE:${CONTACT.tagline}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "luxe-prestige.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4"
      style={{ backgroundColor: LUXE_COLORS.background }}
    >
      {/* Luxury pattern background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header with Logo */}
        <div 
          className="rounded-t-3xl p-8 text-center relative overflow-hidden"
          style={{ 
            backgroundColor: LUXE_COLORS.card,
            borderBottom: `2px solid ${LUXE_COLORS.gold}`,
          }}
        >
          {/* Gold accent line */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${LUXE_COLORS.gold}, transparent)`,
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center relative overflow-hidden"
            style={{ 
              boxShadow: `0 0 40px ${LUXE_COLORS.gold}40`,
            }}
          >
            <img 
              src={luxePrestigeLogo} 
              alt="Luxe Prestige" 
              className="w-full h-full object-cover"
            />
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed"
              style={{ borderColor: `${LUXE_COLORS.goldLight}40` }}
            />
          </motion.div>

          {/* Name */}
          <h1 
            className="text-3xl font-bold tracking-wide mb-2"
            style={{ color: LUXE_COLORS.gold }}
          >
            {CONTACT.name}
          </h1>

          {/* Title */}
          <p 
            className="text-lg font-light tracking-widest uppercase mb-3"
            style={{ color: LUXE_COLORS.text }}
          >
            {CONTACT.title}
          </p>

          {/* Tagline */}
          <p 
            className="text-sm italic"
            style={{ color: LUXE_COLORS.textMuted }}
          >
            "{CONTACT.tagline}"
          </p>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin size={14} style={{ color: LUXE_COLORS.gold }} />
            <span className="text-sm" style={{ color: LUXE_COLORS.textMuted }}>
              {CONTACT.location}
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div 
          className="p-6 grid grid-cols-2 gap-3"
          style={{ backgroundColor: LUXE_COLORS.accent }}
        >
          {CONTACT.services.map((service, index) => (
            <motion.div
              key={service.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: LUXE_COLORS.card,
                border: `1px solid ${LUXE_COLORS.gold}20`,
              }}
            >
              <service.icon 
                size={24} 
                className="mx-auto mb-2"
                style={{ color: LUXE_COLORS.gold }}
              />
              <p 
                className="text-xs font-semibold mb-1"
                style={{ color: LUXE_COLORS.text }}
              >
                {service.label}
              </p>
              <p 
                className="text-[10px] leading-tight"
                style={{ color: LUXE_COLORS.textMuted }}
              >
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div 
          className="p-6 space-y-3 rounded-b-3xl"
          style={{ backgroundColor: LUXE_COLORS.card }}
        >
          {/* Primary CTA - WhatsApp */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onTouchStart={() => setIsPressed("whatsapp")}
            onTouchEnd={() => setIsPressed(null)}
            onClick={handleWhatsApp}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-200"
            style={{ 
              background: `linear-gradient(135deg, ${LUXE_COLORS.gold}, ${LUXE_COLORS.goldDark})`,
              color: LUXE_COLORS.background,
              transform: isPressed === "whatsapp" ? "scale(0.98)" : "scale(1)",
              boxShadow: `0 4px 20px ${LUXE_COLORS.gold}40`,
            }}
          >
            <MessageCircle size={20} />
            Réserver via WhatsApp
          </motion.button>

          {/* Secondary buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCall}
              className="py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
              style={{ 
                backgroundColor: LUXE_COLORS.accent,
                color: LUXE_COLORS.gold,
                border: `1px solid ${LUXE_COLORS.gold}40`,
              }}
            >
              <Phone size={18} />
              Appeler
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleEmail}
              className="py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
              style={{ 
                backgroundColor: LUXE_COLORS.accent,
                color: LUXE_COLORS.gold,
                border: `1px solid ${LUXE_COLORS.gold}40`,
              }}
            >
              <Mail size={18} />
              Email
            </motion.button>
          </div>

          {/* Add Contact */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddContact}
            className="w-full py-3 rounded-xl font-medium transition-all"
            style={{ 
              backgroundColor: "transparent",
              color: LUXE_COLORS.textMuted,
              border: `1px solid ${LUXE_COLORS.textMuted}40`,
            }}
          >
            Ajouter aux contacts
          </motion.button>
        </div>
      </motion.div>

      {/* Footer - i-wasp.com CORPORATION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <a 
          href="https://i-wasp.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 no-underline hover:opacity-100 transition-opacity"
          style={{ opacity: 0.6 }}
        >
          <span 
            className="text-xs font-semibold"
            style={{ 
              color: LUXE_COLORS.gold,
              letterSpacing: "0.08em",
            }}
          >
            i-wasp.com
          </span>
          <span 
            className="text-[10px] font-medium uppercase"
            style={{ 
              color: `${LUXE_COLORS.gold}80`,
              letterSpacing: "0.15em",
            }}
          >
            CORPORATION
          </span>
        </a>
      </motion.div>
    </div>
  );
}
