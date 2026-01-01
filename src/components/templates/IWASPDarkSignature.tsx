/**
 * IWASP Dark Signature Template
 * Premium Mobile-First Dark Mode avec Glassmorphism
 * 
 * FEATURES:
 * - Dark Mode sophistiqué (#0a0a0a)
 * - Glassmorphism cards
 * - Accents Or (#D4AF37)
 * - Mobile-first (max 450px)
 * - Animations Fade-in up
 * - CTA dominant "Enregistrer le contact"
 */

import { motion } from "framer-motion";
import { 
  Download, 
  Globe, 
  Linkedin, 
  Instagram, 
  MessageCircle,
  MapPin,
  Share2,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { downloadVCard, VCardData } from "@/lib/vcard";
import { CardData, TemplateProps } from "./CardTemplates";
import { IWASPBrandBadgeMinimal } from "./IWASPBrandBadge";

// Animation variants - using typed Easing
import type { Easing } from "framer-motion";

const easeOut: Easing = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easeOut }
  },
};

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  delay?: number;
}

const SocialLink = ({ icon, label, href, delay = 0 }: SocialLinkProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300"
    style={{
      background: "rgba(255, 255, 255, 0.04)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
    }}
    whileHover={{ 
      scale: 1.05,
      background: "rgba(212, 175, 55, 0.15)",
      borderColor: "rgba(212, 175, 55, 0.3)",
    }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.3 }}
    title={label}
  >
    {icon}
  </motion.a>
);

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay?: number;
}

const ActionItem = ({ icon, label, value, href, delay = 0 }: ActionItemProps) => (
  <motion.a
    href={href}
    className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group"
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    }}
    whileHover={{ 
      background: "rgba(255, 255, 255, 0.06)",
      borderColor: "rgba(212, 175, 55, 0.2)",
    }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.08, duration: 0.4, ease: "easeOut" }}
  >
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.05) 100%)",
      }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/40 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-white/90 truncate">{value}</p>
    </div>
    <ExternalLink size={14} className="text-white/20 group-hover:text-[#D4AF37] transition-colors" />
  </motion.a>
);

export function IWASPDarkSignature({ 
  data, 
  showWalletButtons = true,
  onShareInfo,
}: TemplateProps) {
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const initials = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`;
  
  const handleDownloadVCard = () => {
    const vcardData: VCardData = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      title: data.title,
      company: data.company,
      email: data.email,
      phone: data.phone,
    };
    downloadVCard(vcardData);
  };

  const getLinkedInUrl = () => {
    if (!data.linkedin) return "";
    if (data.linkedin.startsWith("http")) return data.linkedin;
    return `https://linkedin.com/in/${data.linkedin}`;
  };

  const getInstagramUrl = () => {
    if (!data.instagram) return "";
    const handle = data.instagram.replace("@", "");
    return `https://instagram.com/${handle}`;
  };

  const getWebsiteUrl = () => {
    if (!data.website) return "";
    if (data.website.startsWith("http")) return data.website;
    return `https://${data.website}`;
  };

  const getWhatsAppUrl = () => {
    if (!data.phone) return "";
    const number = (data.phone || "").replace(/\D/g, "");
    return `https://wa.me/${number}`;
  };

  const socialLinks = [
    data.linkedin && { icon: <Linkedin size={20} className="text-[#D4AF37]" />, label: "LinkedIn", href: getLinkedInUrl() },
    data.phone && { icon: <MessageCircle size={20} className="text-[#D4AF37]" />, label: "WhatsApp", href: getWhatsAppUrl() },
    data.instagram && { icon: <Instagram size={20} className="text-[#D4AF37]" />, label: "Instagram", href: getInstagramUrl() },
    data.website && { icon: <Globe size={20} className="text-[#D4AF37]" />, label: "Site Web", href: getWebsiteUrl() },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; href: string }[];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start px-4 py-8 pb-safe"
      style={{ 
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
      }}
    >
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div 
          className="absolute"
          style={{
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Main Container - Mobile First (max 450px) */}
      <motion.div 
        className="w-full relative"
        style={{ maxWidth: "450px", zIndex: 10 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - Share Button */}
        <motion.div 
          className="flex justify-end mb-6"
          variants={itemVariants}
        >
          <button
            onClick={onShareInfo}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Share2 size={14} />
            Partager
          </button>
        </motion.div>

        {/* Main Card - Glassmorphism */}
        <motion.div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
          variants={itemVariants}
        >
          <div className="p-6 sm:p-8">
            {/* Identity Section */}
            <div className="flex flex-col items-center text-center mb-8">
              {/* Profile Photo */}
              <motion.div 
                className="relative mb-5"
                variants={itemVariants}
              >
                <div 
                  className="w-28 h-28 rounded-full overflow-hidden"
                  style={{
                    border: "2px solid rgba(212, 175, 55, 0.3)",
                    boxShadow: "0 0 40px rgba(212, 175, 55, 0.15)",
                  }}
                >
                  {data.photoUrl ? (
                    <img 
                      src={data.photoUrl} 
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: "#1a1a1a" }}
                    >
                      <span className="text-2xl font-semibold" style={{ color: "#D4AF37" }}>
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* IWASP Badge */}
                <div className="absolute -bottom-2 -right-2">
                  <IWASPBrandBadgeMinimal variant="dark" />
                </div>
              </motion.div>

              {/* Name */}
              <motion.h1 
                className="text-2xl font-bold tracking-tight mb-1"
                style={{ color: "#ffffff" }}
                variants={itemVariants}
              >
                {fullName}
              </motion.h1>
              
              {/* Title & Company */}
              <motion.div variants={itemVariants}>
                {data.title && (
                  <p className="text-sm font-medium" style={{ color: "#D4AF37" }}>
                    {data.title}
                  </p>
                )}
                {data.company && (
                  <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    {data.company}
                  </p>
                )}
              </motion.div>

              {/* Bio / Tagline (10 words max) */}
              {data.tagline && (
                <motion.p 
                  className="text-sm mt-4 max-w-xs leading-relaxed"
                  style={{ color: "rgba(255, 255, 255, 0.6)" }}
                  variants={itemVariants}
                >
                  {data.tagline}
                </motion.p>
              )}

              {/* Location */}
              {data.location && (
                <motion.div 
                  className="flex items-center gap-1.5 mt-3 text-xs"
                  style={{ color: "rgba(255, 255, 255, 0.4)" }}
                  variants={itemVariants}
                >
                  <MapPin size={12} />
                  <span>{data.location}</span>
                </motion.div>
              )}
            </div>

            {/* Primary CTA - ENREGISTRER LE CONTACT */}
            <motion.button
              onClick={handleDownloadVCard}
              className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
                color: "#0a0a0a",
                boxShadow: "0 10px 40px -10px rgba(212, 175, 55, 0.4)",
              }}
              whileHover={{ 
                boxShadow: "0 15px 50px -10px rgba(212, 175, 55, 0.5)",
                scale: 1.01,
              }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              <Download size={20} />
              ENREGISTRER LE CONTACT
            </motion.button>

            {/* Social Hub - Icons Row */}
            {socialLinks.length > 0 && (
              <motion.div 
                className="flex items-center justify-center gap-3 mt-6"
                variants={itemVariants}
              >
                {socialLinks.map((link, i) => (
                  <SocialLink
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    delay={i}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Items - Contact Methods */}
        <motion.div 
          className="space-y-3 mt-6"
          variants={itemVariants}
        >
          {data.email && (
            <ActionItem
              icon={<Mail size={20} className="text-[#D4AF37]" />}
              label="Email"
              value={data.email}
              href={`mailto:${data.email}`}
              delay={0}
            />
          )}
          {data.phone && (
            <ActionItem
              icon={<Phone size={20} className="text-[#D4AF37]" />}
              label="Téléphone"
              value={data.phone}
              href={`tel:${data.phone}`}
              delay={1}
            />
          )}
          {data.website && (
            <ActionItem
              icon={<Globe size={20} className="text-[#D4AF37]" />}
              label="Site Web"
              value={data.website}
              href={getWebsiteUrl()}
              delay={2}
            />
          )}
        </motion.div>

        {/* Footer - Powered by IWASP */}
        <motion.div 
          className="text-center mt-10 pb-4"
          variants={itemVariants}
        >
          <p 
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "rgba(255, 255, 255, 0.25)" }}
          >
            Powered by IWASP
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default IWASPDarkSignature;
