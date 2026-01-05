/**
 * Maison B Optic x Marc Aurel - Digital Business Card
 * Premium optician card with elegant charcoal & white palette
 * Mobile-first, Apple Cupertino style
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MapPin, Instagram, UserPlus, 
  MessageCircle, ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import { IWASPBrandingFooter } from "@/components/IWASPBrandingFooter";
import maisonBLogo from "@/assets/clients/maison-b-optic-logo.png";

// Maison B Optic brand colors - Elegant charcoal palette
const COLORS = {
  charcoal: "#3C3C3C",
  charcoalLight: "#5A5A5A",
  white: "#FFFFFF",
  offWhite: "#F8F8F8",
  accent: "#3C3C3C",
};

const MaisonBOpticCard = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Contact data - Managed by BADI
  const contactData = {
    displayName: "Maison B Optic x Marc Aurel",
    firstName: "Marc Aurel",
    lastName: "Opticien",
    nickname: "BADI",
    title: "Opticien",
    company: "Marc Aurel Opticien",
    email: "marc.aurel.opticiens@gmail.com",
    phone: "+33758721225",
    whatsapp: "33758721225",
    location: "Paris - Marrakech",
    address: "43 rue de la Gaîté, Paris 75014",
    instagram: "maison_bopticparis",
    instagramUrl: "https://www.instagram.com/maison_bopticparis",
    mapsUrl: "https://maps.google.com/?q=43+rue+de+la+Gaîté+Paris+75014",
    bio: "L'art de la vision, façonné sur mesure.",
  };

  const handleCall = () => {
    window.location.href = `tel:${contactData.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contactData.email}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${contactData.whatsapp}`, "_blank");
  };

  const handleInstagram = () => {
    window.open(contactData.instagramUrl, "_blank");
  };

  const handleMaps = () => {
    window.open(contactData.mapsUrl, "_blank");
  };

  const handleAddContact = async () => {
    setIsDownloading(true);
    
    try {
      const vCardContent = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${contactData.lastName};${contactData.firstName};;;`,
        `FN:${contactData.displayName}`,
        `NICKNAME:${contactData.nickname}`,
        `TITLE:${contactData.title}`,
        `ORG:${contactData.company}`,
        `EMAIL:${contactData.email}`,
        `TEL:${contactData.phone}`,
        `ADR:;;${contactData.address};;;;`,
        `NOTE:${contactData.bio}`,
        `URL:${contactData.instagramUrl}`,
        "END:VCARD",
      ].join("\r\n");

      const blob = new Blob([vCardContent], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Maison_B_Optic_Marc_Aurel.vcf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Contact ajouté !");
    } catch (err) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="min-h-dvh flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: COLORS.offWhite }}
    >
      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
        style={{ 
          backgroundColor: COLORS.white,
          borderRadius: "28px",
          boxShadow: "0 4px 24px rgba(60, 60, 60, 0.08)",
        }}
      >
        {/* Header with Logo */}
        <div className="pt-8 pb-4 px-6 text-center">
          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img 
              src={maisonBLogo} 
              alt="Maison B Optic" 
              className="h-28 w-auto object-contain"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm italic tracking-wide"
            style={{ color: COLORS.charcoalLight }}
          >
            {contactData.bio}
          </motion.p>
        </div>

        {/* Divider */}
        <div 
          className="mx-6 h-px"
          style={{ backgroundColor: `${COLORS.charcoal}15` }}
        />

        {/* Contact Info */}
        <div className="px-6 py-5">
          <div className="text-center space-y-1">
            <p 
              className="text-lg font-medium tracking-tight"
              style={{ color: COLORS.charcoal }}
            >
              {contactData.displayName}
            </p>
            <p 
              className="text-sm"
              style={{ color: COLORS.charcoalLight }}
            >
              {contactData.title} · {contactData.company}
            </p>
          </div>

          {/* Location Badge */}
          <button
            onClick={handleMaps}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-[0.98]"
            style={{ backgroundColor: `${COLORS.charcoal}08` }}
          >
            <MapPin size={16} style={{ color: COLORS.charcoal }} />
            <span 
              className="text-sm"
              style={{ color: COLORS.charcoal }}
            >
              {contactData.location}
            </span>
            <ExternalLink size={14} style={{ color: COLORS.charcoalLight }} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          {/* Primary Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: `${COLORS.charcoal}08` }}
            >
              <Phone size={18} style={{ color: COLORS.charcoal }} />
              <span 
                className="text-sm font-medium"
                style={{ color: COLORS.charcoal }}
              >
                Appeler
              </span>
            </button>

            <button
              onClick={handleEmail}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: `${COLORS.charcoal}08` }}
            >
              <Mail size={18} style={{ color: COLORS.charcoal }} />
              <span 
                className="text-sm font-medium"
                style={{ color: COLORS.charcoal }}
              >
                Email
              </span>
            </button>
          </div>

          {/* Secondary Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: `${COLORS.charcoal}08` }}
            >
              <MessageCircle size={18} style={{ color: "#25D366" }} />
              <span 
                className="text-sm font-medium"
                style={{ color: COLORS.charcoal }}
              >
                WhatsApp
              </span>
            </button>

            <button
              onClick={handleInstagram}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-[0.98]"
              style={{ backgroundColor: `${COLORS.charcoal}08` }}
            >
              <Instagram size={18} style={{ color: "#E4405F" }} />
              <span 
                className="text-sm font-medium"
                style={{ color: COLORS.charcoal }}
              >
                Instagram
              </span>
            </button>
          </div>

          {/* Add Contact CTA */}
          <motion.button
            onClick={handleAddContact}
            disabled={isDownloading}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all disabled:opacity-70"
            style={{ 
              backgroundColor: COLORS.charcoal, 
              color: COLORS.white 
            }}
          >
            <UserPlus size={18} />
            {isDownloading ? "Téléchargement..." : "Ajouter au contact"}
          </motion.button>
        </div>

        {/* Manager Badge */}
        <div 
          className="text-center py-3 text-xs tracking-widest uppercase"
          style={{ 
            color: COLORS.charcoalLight,
            backgroundColor: `${COLORS.charcoal}05`,
            borderBottomLeftRadius: "28px",
            borderBottomRightRadius: "28px",
          }}
        >
          Géré par {contactData.nickname}
        </div>
      </motion.div>
      
      {/* IWASP Branding */}
      <IWASPBrandingFooter variant="light" />
    </div>
  );
};

export default MaisonBOpticCard;
