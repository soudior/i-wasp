/**
 * Ariella KHIAT COHEN - Avocat à la Cour
 * Carte digitale premium - Thème Obsidian Stealth
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
  Scale,
  Navigation,
  MessageCircle
} from "lucide-react";

// Obsidian Stealth Palette
const OBSIDIAN = {
  bg: "#050505",
  card: "#0A0A0A",
  border: "rgba(180, 180, 180, 0.08)",
  borderHover: "rgba(180, 180, 180, 0.15)",
  text: "#E8E8E8",
  textSecondary: "rgba(200, 200, 200, 0.6)",
  titanium: "#A0A5AD",
  emerald: "#10B981",
  emeraldGlow: "rgba(16, 185, 129, 0.15)",
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
  website: null as string | null,
  linkedin: null as string | null,
  tagline: "Défendre vos droits avec excellence et détermination",
  initials: "AK",
  // Coordonnées GPS exactes pour 6 rue Ruhmkorff, 75017 Paris
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
        ${variant === "primary" 
          ? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg shadow-emerald-500/20" 
          : "bg-[#111111] border border-[rgba(180,180,180,0.08)] text-[#E8E8E8] hover:border-[rgba(180,180,180,0.15)]"
        }
      `}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
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
      className="flex items-start gap-4 p-4 rounded-xl bg-[#0A0A0A] border border-[rgba(180,180,180,0.05)] hover:border-[rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer group"
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: OBSIDIAN.emeraldGlow }}
      >
        <Icon size={18} style={{ color: OBSIDIAN.emerald }} strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: OBSIDIAN.textSecondary }}>
          {label}
        </p>
        <p className="text-sm font-medium truncate group-hover:text-[#10B981] transition-colors" style={{ color: OBSIDIAN.text }}>
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
    // Format: +33 9 83 83 33 64 (French format)
    const phoneNumber = "33" + PROFILE.phone.replace(/\./g, "").substring(1);
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{ 
        background: `linear-gradient(180deg, ${OBSIDIAN.bg} 0%, #080808 100%)`,
        fontFamily: "'Bodoni Moda', 'Playfair Display', serif"
      }}
    >
      {/* Ambient glow effect */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${OBSIDIAN.emeraldGlow} 0%, transparent 70%)`,
          filter: "blur(80px)",
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
            className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300"
            style={{ 
              borderColor: OBSIDIAN.border,
              background: OBSIDIAN.card
            }}
          >
            <Share2 size={16} style={{ color: OBSIDIAN.titanium }} />
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          variants={itemVariants}
          className="rounded-3xl p-8 mb-6 border backdrop-blur-sm"
          style={{
            background: `linear-gradient(145deg, ${OBSIDIAN.card} 0%, rgba(10,10,10,0.8) 100%)`,
            borderColor: OBSIDIAN.border,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 ${OBSIDIAN.border}`
          }}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center border-2"
              style={{
                background: `linear-gradient(135deg, ${OBSIDIAN.emeraldGlow} 0%, transparent 100%)`,
                borderColor: OBSIDIAN.emerald
              }}
            >
              <Scale size={40} style={{ color: OBSIDIAN.emerald }} strokeWidth={1} />
            </div>
          </div>

          {/* Name */}
          <div className="text-center mb-6">
            <h1 
              className="text-3xl font-bold tracking-tight mb-2"
              style={{ 
                color: OBSIDIAN.text,
                fontFamily: "'Bodoni Moda', 'Playfair Display', serif"
              }}
            >
              {PROFILE.firstName}
            </h1>
            <h2 
              className="text-2xl font-light tracking-wide mb-3"
              style={{ 
                color: OBSIDIAN.titanium,
                fontFamily: "'Bodoni Moda', 'Playfair Display', serif"
              }}
            >
              {PROFILE.lastName}
            </h2>
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: OBSIDIAN.emeraldGlow }}
            >
              <Scale size={14} style={{ color: OBSIDIAN.emerald }} />
              <span 
                className="text-sm font-medium tracking-wide"
                style={{ color: OBSIDIAN.emerald }}
              >
                {PROFILE.title}
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p 
            className="text-center text-sm leading-relaxed mb-6 px-2"
            style={{ 
              color: OBSIDIAN.textSecondary,
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
          style={{ borderColor: OBSIDIAN.border }}
        >
          <p 
            className="text-xs tracking-widest uppercase"
            style={{ color: OBSIDIAN.textSecondary }}
          >
            Powered by <span style={{ color: OBSIDIAN.titanium }}>IWASP</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
