/**
 * Ariella KHIAT COHEN - Avocat à la Cour
 * Carte digitale premium - Thème Bleu Marine & Or
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Linkedin, 
  Download,
  Share2,
  Navigation,
  MessageCircle
} from "lucide-react";
import akcLogo from "@/assets/clients/akc-logo.png";

// Palette Bleu Marine & Or - Style Cabinet d'Avocat
const COLORS = {
  bg: "#0A0E14",
  card: "#0F1419",
  border: "rgba(201, 162, 39, 0.15)",
  borderHover: "rgba(201, 162, 39, 0.3)",
  text: "#F5F5F5",
  textSecondary: "rgba(200, 200, 200, 0.6)",
  // Bleu Marine du logo
  navy: "#1B3A5F",
  navyLight: "#2A4D73",
  navyGlow: "rgba(27, 58, 95, 0.3)",
  // Or du logo
  gold: "#C9A227",
  goldLight: "#D4B84A",
  goldGlow: "rgba(201, 162, 39, 0.15)",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Profile data - Ariella KHIAT COHEN
const PROFILE = {
  firstName: "Ariella",
  lastName: "KHIAT COHEN",
  title: "Avocat à la Cour",
  company: "Cabinet AKC",
  address: "6 rue Ruhmkorff - 75017 Paris",
  phone: "09.83.83.33.64",
  email: "akc.avocate@gmail.com",
  website: "https://www.akc-avocate.fr",
  linkedin: "https://www.linkedin.com/in/ariella-khiat-cohen-avocate",
  tagline: "Défendre vos droits avec excellence et détermination",
  initials: "AK",
  coordinates: {
    lat: 48.8847,
    lng: 2.2988
  }
};

function ActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "default" 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-3 w-full py-4 px-5
        rounded-2xl font-medium text-sm tracking-wide
        transition-all duration-300
      `}
      style={{ 
        fontFamily: "'Inter', system-ui, sans-serif",
        background: variant === "primary" 
          ? `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`
          : COLORS.card,
        color: variant === "primary" ? "#0A0E14" : COLORS.text,
        border: variant === "primary" ? "none" : `1px solid ${COLORS.border}`,
        boxShadow: variant === "primary" ? `0 4px 20px ${COLORS.goldGlow}` : "none"
      }}
    >
      <Icon size={18} strokeWidth={1.5} />
      <span>{label}</span>
    </motion.button>
  );
}

function ContactItem({ icon: Icon, label, value, href }: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <motion.div 
      whileHover={{ x: 4 }}
      className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer group"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`
      }}
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: COLORS.goldGlow }}
      >
        <Icon size={18} style={{ color: COLORS.gold }} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textSecondary }}>
          {label}
        </p>
        <p 
          className="text-sm font-medium truncate transition-colors" 
          style={{ color: COLORS.text }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {content}
    </a>
  ) : content;
}

export default function AriellaCard() {
  const [isSharing, setIsSharing] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${PROFILE.phone.replace(/\./g, "")}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${PROFILE.email}`;
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${PROFILE.firstName} ${PROFILE.lastName} - ${PROFILE.title}`,
          text: PROFILE.tagline,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (e) {
      console.log("Share cancelled");
    }
    setIsSharing(false);
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${PROFILE.firstName} ${PROFILE.lastName}
N:${PROFILE.lastName};${PROFILE.firstName};;;
TITLE:${PROFILE.title}
ORG:${PROFILE.company}
TEL;TYPE=WORK,VOICE:${PROFILE.phone.replace(/\./g, "")}
EMAIL:${PROFILE.email}
ADR;TYPE=WORK:;;6 rue Ruhmkorff;Paris;;75017;France
URL:${PROFILE.website}
X-SOCIALPROFILE;TYPE=linkedin:${PROFILE.linkedin}
GEO:${PROFILE.coordinates.lat};${PROFILE.coordinates.lng}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${PROFILE.firstName}_${PROFILE.lastName}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenMap = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${PROFILE.coordinates.lat},${PROFILE.coordinates.lng}`, "_blank");
  };

  const handleWhatsApp = () => {
    const phoneNumber = "33" + PROFILE.phone.replace(/\./g, "").substring(1);
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{ 
        background: `linear-gradient(180deg, ${COLORS.bg} 0%, #060810 100%)`,
        fontFamily: "'Bodoni Moda', 'Playfair Display', serif"
      }}
    >
      {/* Ambient glow effect - Gold */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.goldGlow} 0%, transparent 70%)`,
          filter: "blur(80px)",
          opacity: 0.5
        }}
      />
      
      {/* Navy accent glow */}
      <div 
        className="fixed bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.navyGlow} 0%, transparent 70%)`,
          filter: "blur(100px)",
          opacity: 0.4
        }}
      />

      <motion.div 
        className="flex-1 w-full max-w-md mx-auto px-5 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with share button */}
        <motion.div variants={itemVariants} className="flex justify-end mb-6">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{ 
              border: `1px solid ${COLORS.border}`,
              background: COLORS.card
            }}
          >
            <Share2 size={16} style={{ color: COLORS.gold }} />
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          variants={itemVariants}
          className="rounded-3xl p-8 mb-6 backdrop-blur-sm"
          style={{
            background: `linear-gradient(145deg, ${COLORS.card} 0%, rgba(15,20,25,0.9) 100%)`,
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${COLORS.goldGlow}`
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-36 h-36 rounded-full overflow-hidden bg-white p-1"
              style={{
                border: `3px solid ${COLORS.gold}`,
                boxShadow: `0 0 30px ${COLORS.goldGlow}, 0 0 60px ${COLORS.navyGlow}`
              }}
            >
              <img 
                src={akcLogo} 
                alt="Cabinet AKC - Ariella KHIAT COHEN" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-6">
            <h1 
              className="text-3xl font-bold tracking-tight mb-2"
              style={{ 
                color: COLORS.text,
                fontFamily: "'Bodoni Moda', 'Playfair Display', serif"
              }}
            >
              {PROFILE.firstName}
            </h1>
            <h2 
              className="text-2xl font-light tracking-wide mb-3"
              style={{ 
                color: COLORS.gold,
                fontFamily: "'Bodoni Moda', 'Playfair Display', serif"
              }}
            >
              {PROFILE.lastName}
            </h2>
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ 
                background: COLORS.navyGlow,
                border: `1px solid ${COLORS.navy}`
              }}
            >
              <span 
                className="text-sm font-medium tracking-wide"
                style={{ color: COLORS.text }}
              >
                {PROFILE.title}
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p 
            className="text-center text-sm leading-relaxed mb-6 px-2"
            style={{ 
              color: COLORS.textSecondary,
              fontFamily: "'Inter', system-ui, sans-serif"
            }}
          >
            {PROFILE.tagline}
          </p>

          {/* Primary Actions */}
          <div className="space-y-3">
            <ActionButton 
              icon={Phone} 
              label="Appeler" 
              onClick={handleCall}
              variant="primary"
            />
            <ActionButton 
              icon={MessageCircle} 
              label="WhatsApp" 
              onClick={handleWhatsApp}
            />
            <ActionButton 
              icon={Mail} 
              label="Envoyer un email" 
              onClick={handleEmail}
            />
            <ActionButton 
              icon={Navigation} 
              label="Itinéraire vers le cabinet" 
              onClick={handleOpenMap}
            />
            <ActionButton 
              icon={Download} 
              label="Ajouter aux contacts" 
              onClick={handleDownloadVCard}
            />
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div variants={itemVariants} className="space-y-3 mb-6">
          <ContactItem 
            icon={MapPin}
            label="Cabinet"
            value={PROFILE.address}
            href={`https://www.google.com/maps/dir/?api=1&destination=${PROFILE.coordinates.lat},${PROFILE.coordinates.lng}`}
          />
          <ContactItem 
            icon={Phone}
            label="Téléphone"
            value={PROFILE.phone}
            href={`tel:${PROFILE.phone.replace(/\./g, "")}`}
          />
          <ContactItem 
            icon={Mail}
            label="Email"
            value={PROFILE.email}
            href={`mailto:${PROFILE.email}`}
          />
          {PROFILE.website && (
            <ContactItem 
              icon={Globe}
              label="Site web"
              value={PROFILE.website.replace("https://", "")}
              href={PROFILE.website}
            />
          )}
          {PROFILE.linkedin && (
            <ContactItem 
              icon={Linkedin}
              label="LinkedIn"
              value="Voir le profil"
              href={PROFILE.linkedin}
            />
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="text-center pt-6 border-t"
          style={{ borderColor: COLORS.border }}
        >
          <a 
            href="https://i-wasp.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase hover:opacity-80 transition-opacity"
            style={{ color: COLORS.textSecondary }}
          >
            Powered by <span style={{ color: COLORS.gold }}>i-wasp.com</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
