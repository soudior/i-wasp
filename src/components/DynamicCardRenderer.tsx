/**
 * Dynamic Card Renderer
 * 
 * Renders the NFC card from blocks data.
 * Production-ready, premium IWASP design.
 * Fully data-driven - no hardcoded content.
 */

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { IWASPLogoSimple } from "@/components/IWASPLogo";
import { CardActionButtons } from "@/components/templates/CardActions";
import { 
  Phone, Mail, MapPin, Globe, MessageCircle, 
  MoreHorizontal, Wifi, Gift, Info, Copy, Check, QrCode, Eye, EyeOff, X, Shield
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SocialIcon } from "@/components/SocialIcon";
import { 
  handlePhoneTap, 
  handleEmailTap, 
  handleWhatsAppTap, 
  handleSmsTap, 
  handleWebsiteTap, 
  handleSocialTap 
} from "@/lib/smartActions";
import { getNetworkById } from "@/lib/socialNetworks";
import { LocationPicker } from "@/components/LocationPicker";
import { ActionSheet, ActionSheetType } from "@/components/ActionSheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  CardBlock,
  IdentityBlock,
  WifiBlock,
  HotelWifiBlock,
  LocationBlock,
  ActionBlock,
  SocialBlock,
  OfferBlock,
  InfoBlock,
  DividerBlock,
  getVisibleBlocks,
  getGoogleMapsUrl,
  getWazeUrl,
  getWifiQrString,
  convertBlocksToLegacy,
} from "@/lib/cardBlocks";

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

// ============================================================
// BLOCK RENDERERS
// ============================================================

interface BlockRendererProps {
  block: CardBlock;
  theme: "dark" | "light";
  onActionSheet: (type: ActionSheetType, value: string, label: string) => void;
}

// Identity Block Renderer
function IdentityRenderer({ block, theme }: { block: IdentityBlock; theme: "dark" | "light" }) {
  const data = block.data;
  const isDark = theme === "dark";

  return (
    <motion.div 
      className="flex flex-col items-center text-center mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Avatar */}
      <motion.div className="relative mb-6" variants={itemVariants}>
        <motion.div 
          className={cn(
            "w-32 h-32 rounded-full overflow-hidden shadow-2xl",
            isDark 
              ? "ring-2 ring-white/[0.08] shadow-black/50" 
              : "ring-2 ring-neutral-200 shadow-neutral-300/30"
          )}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {data.photoUrl ? (
            <img 
              src={data.photoUrl} 
              alt={`${data.firstName} ${data.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center",
              isDark 
                ? "bg-gradient-to-br from-amber-900/30 to-amber-950/50" 
                : "bg-neutral-100"
            )}>
              <span className={cn(
                "text-3xl font-semibold",
                isDark ? "text-amber-400/50" : "text-neutral-300"
              )}>
                {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
              </span>
            </div>
          )}
        </motion.div>
        {/* Status indicator */}
        <motion.div 
          className={cn(
            "absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center",
            isDark ? "border-[3px] border-[hsl(0,0%,5%)]" : "border-[3px] border-white"
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 15 }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Name */}
      <motion.h1 
        className={cn(
          "font-display text-[28px] font-semibold tracking-tight mb-1.5",
          isDark ? "text-white" : "text-neutral-900"
        )}
        variants={itemVariants}
      >
        {data.firstName} {data.lastName}
      </motion.h1>
      
      {/* Title */}
      {data.title && (
        <motion.p 
          className={cn(
            "text-[15px] font-light mb-1",
            isDark ? "text-white/50" : "text-neutral-500"
          )}
          variants={itemVariants}
        >
          {data.title}
        </motion.p>
      )}
      
      {/* Company */}
      {data.company && (
        <motion.p 
          className={cn(
            "text-[13px] font-light",
            isDark ? "text-white/30" : "text-neutral-400"
          )}
          variants={itemVariants}
        >
          {data.company}
        </motion.p>
      )}

      {/* Tagline */}
      {data.tagline && (
        <motion.p 
          className={cn(
            "mt-5 text-[13px] italic font-light max-w-[300px] leading-relaxed px-6",
            isDark ? "text-white/20" : "text-neutral-400"
          )}
          variants={itemVariants}
        >
          "{data.tagline}"
        </motion.p>
      )}
    </motion.div>
  );
}

// WiFi Block Renderer - Premium UX with QR Code
function WifiRenderer({ block, theme }: { block: WifiBlock; theme: "dark" | "light" }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const data = block.data;
  const isDark = theme === "dark";

  const copyPassword = () => {
    if (!data.password) {
      toast.info("Ce réseau est ouvert, pas de mot de passe");
      return;
    }
    navigator.clipboard.writeText(data.password);
    setCopied(true);
    toast.success("Mot de passe copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const qrValue = getWifiQrString(data);
  const hasPassword = data.security !== "open" && data.password;

  return (
    <>
      <motion.div
        variants={itemVariants}
        className={cn(
          "rounded-2xl overflow-hidden transition-all",
          isDark 
            ? "bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.06]" 
            : "bg-gradient-to-br from-white to-neutral-50 border border-neutral-100 shadow-sm"
        )}
      >
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              isDark 
                ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 shadow-inner" 
                : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100"
            )}>
              <Wifi size={22} className={isDark ? "text-amber-400" : "text-blue-600"} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-[15px] font-semibold mb-1",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                {data.label || "Accès Wi-Fi"}
              </h3>
              <p className={cn(
                "text-[12px] leading-relaxed",
                isDark ? "text-white/50" : "text-neutral-500"
              )}>
                Connectez-vous en un instant. Scannez le QR code ou copiez le mot de passe.
              </p>
            </div>
          </div>
        </div>

        {/* Network info */}
        <div className={cn(
          "mx-5 mb-4 p-3 rounded-xl",
          isDark 
            ? "bg-white/[0.03] border border-white/[0.04]" 
            : "bg-neutral-50 border border-neutral-100"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-[11px] uppercase tracking-wider mb-0.5",
                isDark ? "text-white/30" : "text-neutral-400"
              )}>
                Réseau
              </p>
              <p className={cn(
                "text-[14px] font-medium",
                isDark ? "text-white/90" : "text-neutral-800"
              )}>
                {data.ssid}
              </p>
            </div>
            <span className={cn(
              "text-[10px] font-medium px-2 py-1 rounded-full uppercase",
              isDark 
                ? "bg-white/[0.06] text-white/40" 
                : "bg-neutral-100 text-neutral-500"
            )}>
              {data.security === "open" ? "Ouvert" : data.security}
            </span>
          </div>
        </div>

        {/* Password display (if not open) */}
        {hasPassword && (
          <div className={cn(
            "mx-5 mb-4 p-3 rounded-xl",
            isDark 
              ? "bg-white/[0.03] border border-white/[0.04]" 
              : "bg-neutral-50 border border-neutral-100"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[11px] uppercase tracking-wider mb-0.5",
                  isDark ? "text-white/30" : "text-neutral-400"
                )}>
                  Mot de passe
                </p>
                <p className={cn(
                  "text-[14px] font-mono",
                  isDark ? "text-white/90" : "text-neutral-800"
                )}>
                  {showPassword ? data.password : "••••••••"}
                </p>
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark 
                    ? "hover:bg-white/[0.05] text-white/40" 
                    : "hover:bg-neutral-100 text-neutral-400"
                )}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-5 pb-5 flex gap-2">
          {hasPassword && (
            <motion.button
              onClick={copyPassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-medium transition-all",
                isDark 
                  ? "bg-white/[0.06] hover:bg-white/[0.10] text-white/80 border border-white/[0.06]" 
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              )}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copié !" : "Copier le mot de passe"}
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setShowQr(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-medium transition-all",
              hasPassword ? "" : "flex-1",
              isDark 
                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 text-amber-400 border border-amber-500/20" 
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
            )}
          >
            <QrCode size={16} />
            Se connecter via QR Code
          </motion.button>
        </div>

        {/* Security note */}
        <div className={cn(
          "px-5 pb-4 flex items-center gap-2",
          isDark ? "text-white/25" : "text-neutral-400"
        )}>
          <Shield size={12} />
          <p className="text-[10px]">
            Vos paramètres Wi-Fi ne sont jamais modifiés sans votre action.
          </p>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQr(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "w-full max-w-sm rounded-3xl overflow-hidden",
                isDark 
                  ? "bg-neutral-900 border border-white/10" 
                  : "bg-white shadow-2xl"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="p-6 pb-4 flex items-center justify-between">
                <div>
                  <h3 className={cn(
                    "text-lg font-semibold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Connexion Wi-Fi
                  </h3>
                  <p className={cn(
                    "text-sm mt-0.5",
                    isDark ? "text-white/50" : "text-neutral-500"
                  )}>
                    Scannez avec votre appareil photo
                  </p>
                </div>
                <button
                  onClick={() => setShowQr(false)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isDark 
                      ? "hover:bg-white/10 text-white/60" 
                      : "hover:bg-neutral-100 text-neutral-400"
                  )}
                >
                  <X size={20} />
                </button>
              </div>

              {/* QR Code */}
              <div className="px-6 py-8 flex flex-col items-center">
                <div className={cn(
                  "p-6 rounded-2xl",
                  isDark ? "bg-white" : "bg-neutral-50"
                )}>
                  <QRCodeSVG
                    value={qrValue}
                    size={200}
                    level="M"
                    includeMargin={false}
                    className="rounded-lg"
                  />
                </div>
                
                <div className={cn(
                  "mt-6 px-4 py-3 rounded-xl text-center w-full",
                  isDark 
                    ? "bg-white/[0.03] border border-white/[0.06]" 
                    : "bg-neutral-50 border border-neutral-100"
                )}>
                  <p className={cn(
                    "text-[11px] uppercase tracking-wider mb-1",
                    isDark ? "text-white/30" : "text-neutral-400"
                  )}>
                    Réseau
                  </p>
                  <p className={cn(
                    "text-[16px] font-semibold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    {data.ssid}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className={cn(
                "px-6 pb-6",
                isDark ? "text-white/40" : "text-neutral-500"
              )}>
                <div className="flex items-start gap-3 text-[12px]">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isDark ? "bg-white/10" : "bg-neutral-100"
                  )}>
                    1
                  </div>
                  <p>Ouvrez l'appareil photo de votre téléphone</p>
                </div>
                <div className="flex items-start gap-3 text-[12px] mt-2">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isDark ? "bg-white/10" : "bg-neutral-100"
                  )}>
                    2
                  </div>
                  <p>Pointez vers le QR code</p>
                </div>
                <div className="flex items-start gap-3 text-[12px] mt-2">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isDark ? "bg-white/10" : "bg-neutral-100"
                  )}>
                    3
                  </div>
                  <p>Confirmez la connexion au réseau</p>
                </div>
              </div>

              {/* Security note */}
              <div className={cn(
                "px-6 pb-6 flex items-center justify-center gap-2",
                isDark ? "text-white/25" : "text-neutral-400"
              )}>
                <Shield size={12} />
                <p className="text-[10px]">
                  Compatible iOS et Android
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hotel WiFi Block Renderer - Premium Hospitality Design
function HotelWifiRenderer({ block, theme }: { block: HotelWifiBlock; theme: "dark" | "light" }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const data = block.data;
  const isDark = theme === "dark";

  const copyPassword = () => {
    if (!data.password) {
      toast.info("Ce réseau est ouvert, pas de mot de passe");
      return;
    }
    navigator.clipboard.writeText(data.password);
    setCopied(true);
    toast.success("Mot de passe copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const qrValue = getWifiQrString(data);
  const hasPassword = data.security !== "open" && data.password;

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <motion.div
        variants={itemVariants}
        className={cn(
          "rounded-2xl overflow-hidden transition-all",
          isDark 
            ? "bg-gradient-to-br from-amber-500/[0.08] to-amber-600/[0.03] border border-amber-500/20" 
            : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm"
        )}
      >
        {/* Premium Hotel Header */}
        <div className={cn(
          "px-5 pt-5 pb-4",
          isDark 
            ? "bg-gradient-to-r from-amber-500/10 to-transparent" 
            : "bg-gradient-to-r from-amber-100/50 to-transparent"
        )}>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
              isDark 
                ? "bg-gradient-to-br from-amber-400/30 to-amber-600/20 shadow-lg shadow-amber-500/20" 
                : "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200"
            )}>
              <Wifi size={26} className={isDark ? "text-amber-300" : "text-white"} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-[16px] font-semibold mb-1",
                isDark ? "text-white" : "text-neutral-900"
              )}>
                {data.label || "Wi-Fi de votre chambre"}
              </h3>
              {data.hotelName && (
                <p className={cn(
                  "text-[12px] font-medium",
                  isDark ? "text-amber-400/80" : "text-amber-700"
                )}>
                  {data.hotelName}
                </p>
              )}
              {data.welcomeMessage && (
                <p className={cn(
                  "text-[11px] mt-1 leading-relaxed",
                  isDark ? "text-white/40" : "text-neutral-500"
                )}>
                  {data.welcomeMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Room & Check-out Info */}
        {(data.roomNumber || data.checkOutDate) && (
          <div className={cn(
            "mx-5 mb-4 p-3 rounded-xl grid grid-cols-2 gap-3",
            isDark 
              ? "bg-white/[0.04] border border-white/[0.06]" 
              : "bg-white/60 border border-amber-100"
          )}>
            {data.roomNumber && (
              <div>
                <p className={cn(
                  "text-[10px] uppercase tracking-wider mb-0.5",
                  isDark ? "text-white/30" : "text-neutral-400"
                )}>
                  Chambre
                </p>
                <p className={cn(
                  "text-[15px] font-semibold",
                  isDark ? "text-amber-400" : "text-amber-700"
                )}>
                  {data.roomNumber}
                </p>
              </div>
            )}
            {data.checkOutDate && (
              <div>
                <p className={cn(
                  "text-[10px] uppercase tracking-wider mb-0.5",
                  isDark ? "text-white/30" : "text-neutral-400"
                )}>
                  Départ
                </p>
                <p className={cn(
                  "text-[13px] font-medium",
                  isDark ? "text-white/80" : "text-neutral-700"
                )}>
                  {formatDate(data.checkOutDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Network info */}
        <div className={cn(
          "mx-5 mb-4 p-3 rounded-xl",
          isDark 
            ? "bg-white/[0.03] border border-white/[0.04]" 
            : "bg-white/60 border border-amber-100"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "text-[10px] uppercase tracking-wider mb-0.5",
                isDark ? "text-white/30" : "text-neutral-400"
              )}>
                Réseau Wi-Fi
              </p>
              <p className={cn(
                "text-[14px] font-medium",
                isDark ? "text-white/90" : "text-neutral-800"
              )}>
                {data.ssid}
              </p>
            </div>
            <span className={cn(
              "text-[9px] font-medium px-2 py-1 rounded-full uppercase",
              isDark 
                ? "bg-amber-500/20 text-amber-400/70" 
                : "bg-amber-100 text-amber-600"
            )}>
              {data.security === "open" ? "Ouvert" : data.security}
            </span>
          </div>
        </div>

        {/* Password display */}
        {hasPassword && (
          <div className={cn(
            "mx-5 mb-4 p-3 rounded-xl",
            isDark 
              ? "bg-white/[0.03] border border-white/[0.04]" 
              : "bg-white/60 border border-amber-100"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[10px] uppercase tracking-wider mb-0.5",
                  isDark ? "text-white/30" : "text-neutral-400"
                )}>
                  Mot de passe
                </p>
                <p className={cn(
                  "text-[14px] font-mono",
                  isDark ? "text-white/90" : "text-neutral-800"
                )}>
                  {showPassword ? data.password : "••••••••"}
                </p>
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark 
                    ? "hover:bg-white/[0.05] text-white/40" 
                    : "hover:bg-amber-100 text-neutral-400"
                )}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-5 pb-5 flex gap-2">
          {hasPassword && (
            <motion.button
              onClick={copyPassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-medium transition-all",
                isDark 
                  ? "bg-white/[0.06] hover:bg-white/[0.10] text-white/80 border border-white/[0.06]" 
                  : "bg-white hover:bg-amber-50 text-neutral-700 border border-amber-200"
              )}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copié !" : "Copier"}
            </motion.button>
          )}
          
          <motion.button
            onClick={() => setShowQr(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-medium transition-all",
              hasPassword ? "flex-1" : "flex-1",
              isDark 
                ? "bg-gradient-to-r from-amber-500/30 to-amber-600/20 hover:from-amber-500/40 hover:to-amber-600/30 text-amber-300 border border-amber-500/30" 
                : "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-orange-200"
            )}
          >
            <QrCode size={16} />
            Connexion QR Code
          </motion.button>
        </div>

        {/* Security note */}
        <div className={cn(
          "px-5 pb-4 flex items-center gap-2",
          isDark ? "text-amber-400/30" : "text-amber-600/50"
        )}>
          <Shield size={12} />
          <p className="text-[10px]">
            Connexion sécurisée. Aucune modification automatique.
          </p>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQr(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "w-full max-w-sm rounded-3xl overflow-hidden",
                isDark 
                  ? "bg-neutral-900 border border-amber-500/20" 
                  : "bg-white shadow-2xl"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={cn(
                "p-6 pb-4 flex items-center justify-between",
                isDark 
                  ? "bg-gradient-to-r from-amber-500/10 to-transparent" 
                  : "bg-gradient-to-r from-amber-50 to-transparent"
              )}>
                <div>
                  <h3 className={cn(
                    "text-lg font-semibold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    Connexion Wi-Fi
                  </h3>
                  <p className={cn(
                    "text-sm mt-0.5",
                    isDark ? "text-amber-400/60" : "text-amber-600"
                  )}>
                    {data.hotelName || "Scannez avec votre appareil photo"}
                  </p>
                </div>
                <button
                  onClick={() => setShowQr(false)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isDark 
                      ? "hover:bg-white/10 text-white/60" 
                      : "hover:bg-neutral-100 text-neutral-400"
                  )}
                >
                  <X size={20} />
                </button>
              </div>

              {/* QR Code */}
              <div className="px-6 py-8 flex flex-col items-center">
                <div className={cn(
                  "p-6 rounded-2xl",
                  isDark ? "bg-white" : "bg-amber-50"
                )}>
                  <QRCodeSVG
                    value={qrValue}
                    size={200}
                    level="M"
                    includeMargin={false}
                    className="rounded-lg"
                  />
                </div>
                
                <div className={cn(
                  "mt-6 px-4 py-3 rounded-xl text-center w-full",
                  isDark 
                    ? "bg-white/[0.03] border border-white/[0.06]" 
                    : "bg-amber-50 border border-amber-100"
                )}>
                  <p className={cn(
                    "text-[11px] uppercase tracking-wider mb-1",
                    isDark ? "text-white/30" : "text-amber-500"
                  )}>
                    Réseau
                  </p>
                  <p className={cn(
                    "text-[16px] font-semibold",
                    isDark ? "text-white" : "text-neutral-900"
                  )}>
                    {data.ssid}
                  </p>
                  {data.roomNumber && (
                    <p className={cn(
                      "text-[12px] mt-1",
                      isDark ? "text-amber-400/60" : "text-amber-600"
                    )}>
                      Chambre {data.roomNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className={cn(
                "px-6 pb-6",
                isDark ? "text-white/40" : "text-neutral-500"
              )}>
                <div className="flex items-start gap-3 text-[12px]">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                  )}>
                    1
                  </div>
                  <p>Ouvrez l'appareil photo de votre téléphone</p>
                </div>
                <div className="flex items-start gap-3 text-[12px] mt-2">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                  )}>
                    2
                  </div>
                  <p>Pointez vers le QR code</p>
                </div>
                <div className="flex items-start gap-3 text-[12px] mt-2">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5",
                    isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                  )}>
                    3
                  </div>
                  <p>Confirmez la connexion au réseau</p>
                </div>
              </div>

              {/* Security note */}
              <div className={cn(
                "px-6 pb-6 flex items-center justify-center gap-2",
                isDark ? "text-amber-400/30" : "text-amber-500"
              )}>
                <Shield size={12} />
                <p className="text-[10px]">
                  Compatible iOS et Android
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Location Block Renderer
function LocationRenderer({ block, theme }: { block: LocationBlock; theme: "dark" | "light" }) {
  const data = block.data;
  const isDark = theme === "dark";

  return (
    <motion.div variants={itemVariants}>
      <LocationPicker
        address={data.address}
        latitude={data.latitude}
        longitude={data.longitude}
        variant="inline"
        className={cn(
          "w-full p-4 rounded-2xl transition-all",
          isDark 
            ? "bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04]" 
            : "bg-neutral-50 border border-neutral-100 hover:bg-neutral-100/80"
        )}
        iconClassName={isDark ? "text-amber-400/70" : "text-neutral-600"}
        textClassName={cn(
          "text-[13px] font-medium",
          isDark ? "text-white/80" : "text-neutral-800"
        )}
      />
    </motion.div>
  );
}

// Action Block Renderer
function ActionRenderer({ 
  block, 
  theme,
  onActionSheet 
}: { 
  block: ActionBlock; 
  theme: "dark" | "light";
  onActionSheet: (type: ActionSheetType, value: string, label: string) => void;
}) {
  const data = block.data;
  const isDark = theme === "dark";
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const getIcon = () => {
    const iconClass = isDark ? "text-amber-400/70" : "text-neutral-600";
    switch (data.actionType) {
      case "call": return <Phone size={18} className={iconClass} />;
      case "whatsapp": return <SocialIcon networkId="whatsapp" size={18} className={iconClass} />;
      case "sms": return <MessageCircle size={18} className={iconClass} />;
      case "email": return <Mail size={18} className={iconClass} />;
      case "website": return <Globe size={18} className={iconClass} />;
      default: return <Phone size={18} className={iconClass} />;
    }
  };

  const getSheetType = (): ActionSheetType => {
    switch (data.actionType) {
      case "call":
      case "whatsapp":
      case "sms":
        return "phone";
      case "email":
        return "email";
      case "website":
        return "website";
      default:
        return "social";
    }
  };

  const handleClick = () => {
    if (!isLongPress.current) {
      switch (data.actionType) {
        case "call": handlePhoneTap(data.value); break;
        case "whatsapp": handleWhatsAppTap(data.value); break;
        case "sms": handleSmsTap(data.value); break;
        case "email": handleEmailTap(data.value); break;
        case "website": handleWebsiteTap(data.value); break;
      }
    }
    isLongPress.current = false;
  };

  const handleLongPressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onActionSheet(getSheetType(), data.value, data.label);
    }, 400);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
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
        backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-colors duration-200 text-left select-none group",
        isDark 
          ? "bg-white/[0.02] border border-white/[0.04]" 
          : "bg-neutral-50 border border-neutral-100"
      )}
    >
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-inner",
        isDark 
          ? "bg-gradient-to-br from-white/[0.06] to-white/[0.02] group-hover:from-white/[0.08] group-hover:to-white/[0.04]" 
          : "bg-white border border-neutral-200"
      )}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <span className={cn(
          "text-[13px] font-medium block",
          isDark ? "text-white/80" : "text-neutral-800"
        )}>
          {data.label}
        </span>
        {data.subtitle && (
          <span className={cn(
            "text-[11px] block mt-0.5",
            isDark ? "text-white/35" : "text-neutral-400"
          )}>
            {data.subtitle}
          </span>
        )}
      </div>
      <MoreHorizontal size={14} className={cn(
        "shrink-0 transition-colors",
        isDark 
          ? "text-white/20 group-hover:text-white/30" 
          : "text-neutral-300 group-hover:text-neutral-400"
      )} />
    </motion.button>
  );
}

// Social Block Renderer
function SocialRenderer({ 
  block, 
  theme,
  onActionSheet 
}: { 
  block: SocialBlock; 
  theme: "dark" | "light";
  onActionSheet: (type: ActionSheetType, value: string, label: string) => void;
}) {
  const isDark = theme === "dark";

  return (
    <>
      {block.data.links.map((link) => {
        const network = getNetworkById(link.networkId);
        if (!network) return null;

        return (
          <motion.button
            key={link.id}
            variants={itemVariants}
            onClick={() => handleSocialTap(link.networkId, link.value)}
            whileHover={{ 
              scale: 1.01, 
              backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
            }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl transition-colors duration-200 text-left select-none group",
              isDark 
                ? "bg-white/[0.02] border border-white/[0.04]" 
                : "bg-neutral-50 border border-neutral-100"
            )}
          >
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner",
              isDark 
                ? "bg-gradient-to-br from-white/[0.06] to-white/[0.02]" 
                : "bg-white border border-neutral-200"
            )}>
              <SocialIcon 
                networkId={link.networkId} 
                size={18} 
                className={isDark ? "text-amber-400/70" : "text-neutral-600"} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className={cn(
                "text-[13px] font-medium block",
                isDark ? "text-white/80" : "text-neutral-800"
              )}>
                {network.label}
              </span>
              <span className={cn(
                "text-[11px] block mt-0.5",
                isDark ? "text-white/35" : "text-neutral-400"
              )}>
                Voir le profil
              </span>
            </div>
          </motion.button>
        );
      })}
    </>
  );
}

// Offer Block Renderer
function OfferRenderer({ block, theme }: { block: OfferBlock; theme: "dark" | "light" }) {
  const data = block.data;
  const isDark = theme === "dark";

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "p-4 rounded-2xl",
        isDark 
          ? "bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20" 
          : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
          isDark ? "bg-amber-500/20" : "bg-amber-100"
        )}>
          <Gift size={18} className={isDark ? "text-amber-400" : "text-amber-600"} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-[14px] font-semibold block",
            isDark ? "text-amber-300" : "text-amber-800"
          )}>
            {data.title}
          </span>
          <span className={cn(
            "text-[12px] block mt-1 leading-relaxed",
            isDark ? "text-white/50" : "text-neutral-600"
          )}>
            {data.description}
          </span>
          {data.code && (
            <div className={cn(
              "mt-3 inline-block px-3 py-1 rounded-lg font-mono text-xs",
              isDark ? "bg-amber-500/20 text-amber-300" : "bg-amber-100 text-amber-700"
            )}>
              {data.code}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Info Block Renderer
function InfoRenderer({ block, theme }: { block: InfoBlock; theme: "dark" | "light" }) {
  const data = block.data;
  const isDark = theme === "dark";

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "p-4 rounded-2xl",
        isDark 
          ? "bg-white/[0.02] border border-white/[0.04]" 
          : "bg-neutral-50 border border-neutral-100"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner",
          isDark 
            ? "bg-gradient-to-br from-white/[0.06] to-white/[0.02]" 
            : "bg-white border border-neutral-200"
        )}>
          <Info size={18} className={isDark ? "text-amber-400/70" : "text-neutral-600"} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-[13px] font-medium block",
            isDark ? "text-white/80" : "text-neutral-800"
          )}>
            {data.title}
          </span>
          <span className={cn(
            "text-[12px] block mt-1 leading-relaxed",
            isDark ? "text-white/40" : "text-neutral-500"
          )}>
            {data.content}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Divider Block Renderer
function DividerRenderer({ block, theme }: { block: DividerBlock; theme: "dark" | "light" }) {
  const isDark = theme === "dark";
  const style = block.data.style || "line";

  if (style === "dots") {
    return (
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 py-4">
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isDark ? "bg-white/10" : "bg-neutral-200"
            )} 
          />
        ))}
      </motion.div>
    );
  }

  if (style === "diamond") {
    return (
      <motion.div variants={itemVariants} className="flex items-center gap-4 py-4">
        <div className={cn(
          "flex-1 h-px",
          isDark 
            ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" 
            : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
        )} />
        <div className={cn(
          "w-2 h-2 rotate-45",
          isDark ? "bg-white/10" : "bg-neutral-200"
        )} />
        <div className={cn(
          "flex-1 h-px",
          isDark 
            ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" 
            : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
        )} />
      </motion.div>
    );
  }

  // Default: line
  return (
    <motion.div variants={itemVariants} className="py-4">
      <div className={cn(
        "h-px",
        isDark 
          ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" 
          : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
      )} />
    </motion.div>
  );
}

// ============================================================
// MAIN DYNAMIC CARD RENDERER
// ============================================================

interface DynamicCardRendererProps {
  blocks: CardBlock[];
  theme?: "dark" | "light";
  showWalletButtons?: boolean;
  showAddToContacts?: boolean;
  onShareInfo?: () => void;
  cardId?: string;
  enableLeadCapture?: boolean;
}

export function DynamicCardRenderer({ 
  blocks,
  theme = "dark",
  showWalletButtons = true,
  showAddToContacts = true,
  onShareInfo,
  cardId,
  enableLeadCapture = false,
}: DynamicCardRendererProps) {
  const isDark = theme === "dark";
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

  // Get only visible blocks sorted by order
  const visibleBlocks = getVisibleBlocks(blocks);
  
  // Extract identity block for special rendering
  const identityBlock = visibleBlocks.find(b => b.type === "identity") as IdentityBlock | undefined;
  const otherBlocks = visibleBlocks.filter(b => b.type !== "identity");

  // Convert blocks to legacy format for CardActionButtons
  const legacyData = convertBlocksToLegacy(blocks);

  const renderBlock = (block: CardBlock) => {
    switch (block.type) {
      case "wifi":
        return <WifiRenderer key={block.id} block={block as WifiBlock} theme={theme} />;
      case "hotelWifi":
        return <HotelWifiRenderer key={block.id} block={block as HotelWifiBlock} theme={theme} />;
      case "location":
        return <LocationRenderer key={block.id} block={block as LocationBlock} theme={theme} />;
      case "action":
        return <ActionRenderer key={block.id} block={block as ActionBlock} theme={theme} onActionSheet={openActionSheet} />;
      case "social":
        return <SocialRenderer key={block.id} block={block as SocialBlock} theme={theme} onActionSheet={openActionSheet} />;
      case "offer":
        return <OfferRenderer key={block.id} block={block as OfferBlock} theme={theme} />;
      case "info":
        return <InfoRenderer key={block.id} block={block as InfoBlock} theme={theme} />;
      case "divider":
        return <DividerRenderer key={block.id} block={block as DividerBlock} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full max-w-[400px] mx-auto">
        <motion.div 
          className={cn(
            "relative rounded-[32px] overflow-hidden shadow-2xl",
            isDark 
              ? "bg-[hsl(0,0%,5%)] border border-white/[0.06] shadow-black/60" 
              : "bg-[hsl(0,0%,98%)] border border-neutral-200/80 shadow-neutral-300/30"
          )}
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
            boxShadow: isDark 
              ? "0 60px 120px -30px rgba(0,0,0,0.8), 0 0 80px rgba(245,158,11,0.06)"
              : "0 40px 80px -20px rgba(0,0,0,0.15)",
          }}
          transition={{ boxShadow: { duration: 0.4 } }}
        >
          {/* Top gradient line */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-px",
            isDark 
              ? "bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" 
              : "bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
          )} />
          
          {/* Vignette effect */}
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
          )}
          
          {/* IWASP Logo - ALWAYS TOP RIGHT */}
          <motion.div 
            className="absolute top-6 right-6 z-10"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isDark ? 0.35 : 0.4, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isDark ? (
              <IWASPLogoSimple variant="dark" size="sm" />
            ) : (
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="text-[8px] font-semibold tracking-[0.15em] uppercase">IWasp</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 12a5 5 0 0 1 5-5" />
                  <path d="M2 12a9 9 0 0 1 9-9" />
                  <path d="M2 12a13 13 0 0 1 13-13" />
                  <circle cx="2" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Card Content */}
          <div className="p-8 pt-7">
            {/* Identity Section */}
            {identityBlock && (
              <IdentityRenderer block={identityBlock} theme={theme} />
            )}

            {/* Other Blocks */}
            <motion.div 
              className="space-y-2 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {otherBlocks.map(renderBlock)}
            </motion.div>

            {/* CTA Buttons */}
            {(showAddToContacts || showWalletButtons) && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <CardActionButtons 
                  data={legacyData} 
                  showWalletButtons={showWalletButtons} 
                  onShareInfo={onShareInfo}
                  variant={isDark ? "amber" : "light"}
                  cardId={cardId}
                  enableLeadCapture={enableLeadCapture}
                />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <motion.div 
            className={cn(
              "py-5 text-center",
              isDark ? "border-t border-white/[0.04]" : "border-t border-neutral-100"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className={cn(
              "text-[10px] tracking-[0.2em] uppercase font-light",
              isDark ? "text-white/15" : "text-neutral-300"
            )}>
              Powered by IWASP
            </p>
          </motion.div>

          {/* Bottom gradient line */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 h-px",
            isDark 
              ? "bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" 
              : "bg-gradient-to-r from-transparent via-neutral-200/50 to-transparent"
          )} />
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

export default DynamicCardRenderer;
