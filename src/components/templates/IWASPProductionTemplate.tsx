/**
 * IWASP Production Template
 * The definitive public NFC card template for IWASP.
 * 
 * PRODUCTION-READY | PREMIUM | TIMELESS | MOBILE-FIRST | NFC-FIRST
 * 
 * This template is used by real B2B clients, hotels, executives.
 * Apple-level UX quality standard.
 * 
 * SMART CONTEXTUAL FEATURES:
 * - Context-aware action priority (hotel/event/business)
 * - Time-based styling adjustments
 */

import { useState, useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IWASPBrandBadge } from "./IWASPBrandBadge";
import { CardActionButtons } from "./CardActions";
import { CardData, TemplateProps } from "./CardTemplates";
import { 
  Phone, Mail, MapPin, Globe, MessageCircle, MessageSquare,
  MoreHorizontal, Navigation, Wifi
} from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";
import { 
  handlePhoneTap, 
  handleEmailTap, 
  handleWhatsAppTap, 
  handleSmsTap, 
  handleWebsiteTap, 
  handleSocialTap 
} from "@/lib/smartActions";
import { getNetworkById, SocialLink } from "@/lib/socialNetworks";
import { LocationPicker } from "@/components/LocationPicker";
import { ActionSheet, ActionSheetType } from "@/components/ActionSheet";
import { cn } from "@/lib/utils";
import { sortActionsByPriority } from "@/hooks/useSmartContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 22,
      duration: 0.7,
    },
  },
};

// 3D Tilt Hook
function useTilt3D(intensity: number = 10) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: {
      rotateX: smoothRotateX,
      rotateY: smoothRotateY,
    },
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// Premium Action Item Component
interface ActionItemData {
  id: string;
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  value: string;
  onClick: () => void;
  sheetType: ActionSheetType;
}

function PremiumActionItem({ 
  item,
  onLongPress,
}: { 
  item: ActionItemData;
  onLongPress: (type: ActionSheetType, value: string, label: string) => void;
}) {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleLongPressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress(item.sheetType, item.value, item.label);
    }, 400);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (!isLongPress.current) {
      item.onClick();
    }
    isLongPress.current = false;
  };

  return (
    <motion.button
      variants={itemVariants}
      onClick={handleClick}
      onMouseDown={handleLongPressStart}
      onMouseUp={handleLongPressEnd}
      onMouseLeave={handleLongPressEnd}
      onTouchStart={handleLongPressStart}
      onTouchEnd={handleLongPressEnd}
      onTouchCancel={handleLongPressEnd}
      whileHover={{ 
        scale: 1.01, 
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] transition-colors duration-200 text-left select-none group"
      aria-label={item.label}
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center flex-shrink-0 group-hover:from-white/[0.08] group-hover:to-white/[0.04] transition-all shadow-inner">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[13px] font-medium text-white/80 block">
          {item.label}
        </span>
        <span className="text-[11px] text-white/35 block mt-0.5">
          {item.subtitle}
        </span>
      </div>
      <MoreHorizontal size={14} className="shrink-0 text-white/20 group-hover:text-white/30 transition-colors" />
    </motion.button>
  );
}

// Production Template Component
export function IWASPProductionTemplate({ 
  data, 
  showWalletButtons = true, 
  onShareInfo, 
  cardId, 
  enableLeadCapture,
  smartContext
}: TemplateProps) {
  const cardData = data;
  const photoSrc = cardData.photoUrl || (cardData as any).photo;
  
  // 3D Tilt effect
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt3D(8);
  
  // Action sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<ActionSheetType>("phone");
  const [sheetValue, setSheetValue] = useState("");
  const [sheetLabel, setSheetLabel] = useState("");

  const openActionSheet = (type: ActionSheetType, value: string, label: string) => {
    setSheetType(type);
    setSheetValue(value);
    setSheetLabel(label);
    setSheetOpen(true);
  };

  // Build actions list - will be sorted by context priority
  const rawActions: ActionItemData[] = [];
  const iconClass = "text-amber-400/70";
  
  // 1. Call
  if (cardData.phone) {
    rawActions.push({
      id: "call",
      icon: <Phone size={18} className={iconClass} />,
      label: "Appeler",
      subtitle: "Appel direct",
      value: cardData.phone,
      onClick: () => handlePhoneTap(cardData.phone!),
      sheetType: "phone",
    });
  }
  
  // 2. WhatsApp
  if (cardData.phone) {
    rawActions.push({
      id: "whatsapp",
      icon: <SocialIcon networkId="whatsapp" size={18} className={iconClass} />,
      label: "WhatsApp",
      subtitle: "Message instantané",
      value: cardData.phone,
      onClick: () => handleWhatsAppTap(cardData.phone!),
      sheetType: "phone",
    });
  }
  
  // 3. SMS
  if (cardData.phone) {
    rawActions.push({
      id: "sms",
      icon: <MessageCircle size={18} className={iconClass} />,
      label: "Message",
      subtitle: "Envoyer un SMS",
      value: cardData.phone,
      onClick: () => handleSmsTap(cardData.phone!),
      sheetType: "phone",
    });
  }
  
  // 4. Email
  if (cardData.email) {
    rawActions.push({
      id: "email",
      icon: <Mail size={18} className={iconClass} />,
      label: "Email",
      subtitle: "Contact professionnel",
      value: cardData.email,
      onClick: () => handleEmailTap(cardData.email!),
      sheetType: "email",
    });
  }
  
  // 5. Location (handled separately with LocationPicker)
  
  // 6. Website
  if (cardData.website) {
    rawActions.push({
      id: "website",
      icon: <Globe size={18} className={iconClass} />,
      label: "Site web",
      subtitle: "Visiter le site",
      value: cardData.website,
      onClick: () => handleWebsiteTap(cardData.website!),
      sheetType: "website",
    });
  }
  
  // 7. Social Networks - LinkedIn first
  if (cardData.linkedin) {
    rawActions.push({
      id: "linkedin",
      icon: <SocialIcon networkId="linkedin" size={18} className={iconClass} />,
      label: "LinkedIn",
      subtitle: "Voir le profil pro",
      value: cardData.linkedin,
      onClick: () => handleSocialTap("linkedin", cardData.linkedin!),
      sheetType: "social",
    });
  }
  
  if (cardData.instagram) {
    rawActions.push({
      id: "instagram",
      icon: <SocialIcon networkId="instagram" size={18} className={iconClass} />,
      label: "Instagram",
      subtitle: "Voir le profil",
      value: cardData.instagram,
      onClick: () => handleSocialTap("instagram", cardData.instagram!),
      sheetType: "social",
    });
  }
  
  if (cardData.twitter) {
    rawActions.push({
      id: "twitter",
      icon: <SocialIcon networkId="twitter" size={18} className={iconClass} />,
      label: "X (Twitter)",
      subtitle: "Voir le profil",
      value: cardData.twitter,
      onClick: () => handleSocialTap("twitter", cardData.twitter!),
      sheetType: "social",
    });
  }
  
  // Dynamic social links
  if (cardData.socialLinks) {
    cardData.socialLinks.forEach((link: SocialLink) => {
      const network = getNetworkById(link.networkId);
      if (network) {
        rawActions.push({
          id: `social-${link.id}`,
          icon: <SocialIcon networkId={link.networkId} size={18} className={iconClass} />,
          label: network.label,
          subtitle: `Voir le profil`,
          value: link.value,
          onClick: () => handleSocialTap(link.networkId, link.value),
          sheetType: "social",
        });
      }
    });
  }

  // Sort actions by smart context priority (hotel puts wifi first, event puts LinkedIn first, etc.)
  const actions = smartContext?.actionPriority 
    ? sortActionsByPriority(rawActions, smartContext.actionPriority)
    : rawActions;

  return (
    <>
      <div className="w-full max-w-[400px] mx-auto">
        {/* Premium Card with 3D tilt */}
        <motion.div 
          className="relative rounded-[32px] overflow-hidden bg-[hsl(0,0%,5%)] border border-white/[0.06] shadow-2xl shadow-black/60"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            rotateX: tiltStyle.rotateX, 
            rotateY: tiltStyle.rotateY,
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
          {...tiltHandlers}
          whileHover={{ 
            boxShadow: "0 60px 120px -30px rgba(0,0,0,0.8), 0 0 80px rgba(245,158,11,0.06)",
          }}
          transition={{ boxShadow: { duration: 0.4 } }}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
          
          {/* Vignette effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          
          {/* IWASP "IWasp )))" Brand Badge - ALWAYS TOP RIGHT - MANDATORY */}
          <motion.div 
            className="absolute top-6 right-6 z-10"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <IWASPBrandBadge variant="dark" />
          </motion.div>

          {/* Card Content */}
          <div className="p-8 pt-7">
            
            {/* Profile Section */}
            <motion.div 
              className="flex flex-col items-center text-center mb-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Avatar with premium shadow */}
              <motion.div 
                className="relative mb-6"
                variants={itemVariants}
              >
                <motion.div 
                  className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-white/[0.08] shadow-2xl shadow-black/50"
                  whileHover={{ scale: 1.03, boxShadow: "0 30px 60px -15px rgba(0,0,0,0.7)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {photoSrc ? (
                    <img 
                      src={photoSrc} 
                      alt={`${cardData.firstName} ${cardData.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-900/30 to-amber-950/50 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-amber-400/50">
                        {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </motion.div>
                {/* Status indicator */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-[3px] border-[hsl(0,0%,5%)] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 15 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </motion.div>
              </motion.div>

              {/* Name - Primary, Bold */}
              <motion.h1 
                className="font-display text-[28px] font-semibold text-white tracking-tight mb-1.5"
                variants={itemVariants}
              >
                {cardData.firstName} {cardData.lastName}
              </motion.h1>
              
              {/* Title - Secondary */}
              {cardData.title && (
                <motion.p 
                  className="text-[15px] text-white/50 font-light mb-1"
                  variants={itemVariants}
                >
                  {cardData.title}
                </motion.p>
              )}
              
              {/* Company - Optional */}
              {cardData.company && (
                <motion.p 
                  className="text-[13px] text-white/30 font-light"
                  variants={itemVariants}
                >
                  {cardData.company}
                </motion.p>
              )}

              {/* Tagline - Italic, Subtle */}
              {cardData.tagline && (
                <motion.p 
                  className="mt-5 text-[13px] text-white/20 italic font-light max-w-[300px] leading-relaxed px-6"
                  variants={itemVariants}
                >
                  "{cardData.tagline}"
                </motion.p>
              )}
            </motion.div>

            {/* Action List - STRICT ORDER */}
            <motion.div 
              className="space-y-2 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Location with selector - Position 5 */}
              {cardData.location && (
                <motion.div variants={itemVariants}>
                  <LocationPicker
                    address={cardData.location}
                    variant="inline"
                    className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all"
                    iconClassName="text-amber-400/70"
                    textClassName="text-[13px] font-medium text-white/80"
                  />
                </motion.div>
              )}
              
              {actions.map((action) => (
                <PremiumActionItem 
                  key={action.id} 
                  item={action}
                  onLongPress={openActionSheet}
                />
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <CardActionButtons 
                data={cardData} 
                showWalletButtons={showWalletButtons} 
                onShareInfo={onShareInfo}
                variant="amber"
                cardId={cardId}
                enableLeadCapture={enableLeadCapture}
              />
            </motion.div>
          </div>

          {/* Footer - Powered by IWASP */}
          <motion.div 
            className="border-t border-white/[0.04] py-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-[10px] text-white/15 tracking-[0.2em] uppercase font-light">
              Powered by IWASP
            </p>
          </motion.div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </motion.div>
      </div>

      {/* Action Sheet */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        type={sheetType}
        value={sheetValue}
        label={sheetLabel}
      />
    </>
  );
}

/**
 * Light variant of the Production template
 */
export function IWASPProductionLightTemplate({ 
  data, 
  showWalletButtons = true, 
  onShareInfo, 
  cardId, 
  enableLeadCapture,
  smartContext
}: TemplateProps) {
  const cardData = data;
  const photoSrc = cardData.photoUrl || (cardData as any).photo;
  
  // 3D Tilt effect
  const { style: tiltStyle, handlers: tiltHandlers } = useTilt3D(8);
  
  // Action sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState<ActionSheetType>("phone");
  const [sheetValue, setSheetValue] = useState("");
  const [sheetLabel, setSheetLabel] = useState("");

  const openActionSheet = (type: ActionSheetType, value: string, label: string) => {
    setSheetType(type);
    setSheetValue(value);
    setSheetLabel(label);
    setSheetOpen(true);
  };

  // Build actions list - will be sorted by context priority
  const rawActions: ActionItemData[] = [];
  const iconClass = "text-neutral-600";
  
  // Same order as dark variant...
  if (cardData.phone) {
    rawActions.push({
      id: "call",
      icon: <Phone size={18} className={iconClass} />,
      label: "Appeler",
      subtitle: "Appel direct",
      value: cardData.phone,
      onClick: () => handlePhoneTap(cardData.phone!),
      sheetType: "phone",
    });
    rawActions.push({
      id: "whatsapp",
      icon: <SocialIcon networkId="whatsapp" size={18} className={iconClass} />,
      label: "WhatsApp",
      subtitle: "Message instantané",
      value: cardData.phone,
      onClick: () => handleWhatsAppTap(cardData.phone!),
      sheetType: "phone",
    });
    rawActions.push({
      id: "sms",
      icon: <MessageCircle size={18} className={iconClass} />,
      label: "Message",
      subtitle: "Envoyer un SMS",
      value: cardData.phone,
      onClick: () => handleSmsTap(cardData.phone!),
      sheetType: "phone",
    });
  }
  
  if (cardData.email) {
    rawActions.push({
      id: "email",
      icon: <Mail size={18} className={iconClass} />,
      label: "Email",
      subtitle: "Contact professionnel",
      value: cardData.email,
      onClick: () => handleEmailTap(cardData.email!),
      sheetType: "email",
    });
  }
  
  if (cardData.website) {
    rawActions.push({
      id: "website",
      icon: <Globe size={18} className={iconClass} />,
      label: "Site web",
      subtitle: "Visiter le site",
      value: cardData.website,
      onClick: () => handleWebsiteTap(cardData.website!),
      sheetType: "website",
    });
  }
  
  if (cardData.linkedin) {
    rawActions.push({
      id: "linkedin",
      icon: <SocialIcon networkId="linkedin" size={18} className={iconClass} />,
      label: "LinkedIn",
      subtitle: "Voir le profil pro",
      value: cardData.linkedin,
      onClick: () => handleSocialTap("linkedin", cardData.linkedin!),
      sheetType: "social",
    });
  }
  
  if (cardData.instagram) {
    rawActions.push({
      id: "instagram",
      icon: <SocialIcon networkId="instagram" size={18} className={iconClass} />,
      label: "Instagram",
      subtitle: "Voir le profil",
      value: cardData.instagram,
      onClick: () => handleSocialTap("instagram", cardData.instagram!),
      sheetType: "social",
    });
  }

  // Sort actions by smart context priority
  const actions = smartContext?.actionPriority 
    ? sortActionsByPriority(rawActions, smartContext.actionPriority)
    : rawActions;

  return (
    <>
      <div className="w-full max-w-[400px] mx-auto">
        <motion.div 
          className="relative rounded-[32px] overflow-hidden bg-[hsl(0,0%,98%)] border border-neutral-200/80 shadow-2xl shadow-neutral-300/30"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            rotateX: tiltStyle.rotateX, 
            rotateY: tiltStyle.rotateY,
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
          {...tiltHandlers}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          
          {/* IWASP Logo */}
          <motion.div 
            className="absolute top-6 right-6 z-10 flex items-center gap-1.5 text-neutral-400 opacity-40"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0.4, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="text-[8px] font-semibold tracking-[0.15em] uppercase">IWasp</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 12a5 5 0 0 1 5-5" />
              <path d="M2 12a9 9 0 0 1 9-9" />
              <path d="M2 12a13 13 0 0 1 13-13" />
              <circle cx="2" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>

          <div className="p-8 pt-7">
            <motion.div 
              className="flex flex-col items-center text-center mb-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="relative mb-6" variants={itemVariants}>
                <motion.div 
                  className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-neutral-200 shadow-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {photoSrc ? (
                    <img 
                      src={photoSrc} 
                      alt={`${cardData.firstName} ${cardData.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-neutral-300">
                        {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </motion.div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-[3px] border-[hsl(0,0%,98%)] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 15 }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </motion.div>
              </motion.div>

              <motion.h1 
                className="font-display text-[28px] font-semibold text-neutral-900 tracking-tight mb-1.5"
                variants={itemVariants}
              >
                {cardData.firstName} {cardData.lastName}
              </motion.h1>
              
              {cardData.title && (
                <motion.p className="text-[15px] text-neutral-500 font-light mb-1" variants={itemVariants}>
                  {cardData.title}
                </motion.p>
              )}
              
              {cardData.company && (
                <motion.p className="text-[13px] text-neutral-400 font-light" variants={itemVariants}>
                  {cardData.company}
                </motion.p>
              )}

              {cardData.tagline && (
                <motion.p 
                  className="mt-5 text-[13px] text-neutral-400 italic font-light max-w-[300px] leading-relaxed px-6"
                  variants={itemVariants}
                >
                  "{cardData.tagline}"
                </motion.p>
              )}
            </motion.div>

            <motion.div className="space-y-2 mb-8" variants={containerVariants} initial="hidden" animate="visible">
              {cardData.location && (
                <motion.div variants={itemVariants}>
                  <LocationPicker
                    address={cardData.location}
                    variant="inline"
                    className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100/80 transition-all"
                    iconClassName="text-neutral-600"
                    textClassName="text-[13px] font-medium text-neutral-800"
                  />
                </motion.div>
              )}
              
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  variants={itemVariants}
                  onClick={action.onClick}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.02)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 transition-colors duration-200 text-left select-none group"
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-neutral-800 block">{action.label}</span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">{action.subtitle}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            <CardActionButtons 
              data={cardData} 
              showWalletButtons={showWalletButtons} 
              onShareInfo={onShareInfo}
              variant="light"
              cardId={cardId}
              enableLeadCapture={enableLeadCapture}
            />
          </div>

          <motion.div 
            className="border-t border-neutral-100 py-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-[10px] text-neutral-300 tracking-[0.2em] uppercase font-light">
              Powered by IWASP
            </p>
          </motion.div>
        </motion.div>
      </div>

      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        type={sheetType}
        value={sheetValue}
        label={sheetLabel}
      />
    </>
  );
}
