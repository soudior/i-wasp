import { useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, MessageCircle, Copy, Check, Camera } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getPropertyBySlug, WifiNetwork } from "@/config/wifiProperties";
import { handleWhatsAppTap } from "@/lib/smartActions";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Luxury Wi-Fi Access Page
 * 
 * Dynamic landing page for high-end rental apartments
 * Accessed via NFC card or QR code
 * 
 * Design: Deep black, elegant gold accents, ivory white text
 * Mobile-first, iOS optimized
 */

// Generate Wi-Fi connection string for QR codes
const generateWiFiString = (ssid: string, password: string, security: string = "WPA"): string => {
  const escapedSSID = ssid.replace(/[\\;,:]/g, '\\$&');
  const escapedPassword = password.replace(/[\\;,:]/g, '\\$&');
  return `WIFI:T:${security};S:${escapedSSID};P:${escapedPassword};;`;
};

interface WifiCardProps {
  network: WifiNetwork;
  delay?: number;
}

const WifiCard = ({ network, delay = 0 }: WifiCardProps) => {
  const wifiString = generateWiFiString(network.ssid, network.password, network.security);
  const [copied, setCopied] = useState(false);
  
  const handleCopyPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(network.password);
      setCopied(true);
      toast.success("Mot de passe copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = network.password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success("Mot de passe copié !");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#C9A96E]/20 p-6 transition-all duration-500 hover:border-[#C9A96E]/40 hover:shadow-[0_0_40px_rgba(201,169,110,0.15)]">
        {/* Recommended badge */}
        {network.recommended && (
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#C9A96E] bg-[#C9A96E]/10 px-3 py-1 rounded-full">
              Recommandé
            </span>
          </div>
        )}

        {/* QR Code */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
            <QRCodeSVG
              value={wifiString}
              size={140}
              bgColor="transparent"
              fgColor="#FDFBF7"
              level="M"
              className="rounded-xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A96E]/5 to-transparent pointer-events-none" />
          </div>

          {/* Network info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Wifi className="w-4 h-4 text-[#C9A96E]" />
              <h3 className="text-lg font-light tracking-wide text-[#FDFBF7]">
                {network.label}
              </h3>
            </div>
            <p className="text-xs text-[#FDFBF7]/50 tracking-wider">
              {network.description}
            </p>
          </div>

          {/* Network credentials */}
          <div className="w-full space-y-3 pt-2">
            {/* SSID */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#FDFBF7]/40 mb-1">Réseau</p>
                <p className="text-sm text-[#FDFBF7] font-mono">{network.ssid}</p>
              </div>
            </div>
            
            {/* Password with copy button */}
            <button
              onClick={handleCopyPassword}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30 transition-all duration-300 hover:bg-[#C9A96E]/15 hover:border-[#C9A96E]/50 active:scale-[0.98]"
            >
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-[#C9A96E]/60 mb-1">Mot de passe</p>
                <p className="text-sm text-[#FDFBF7] font-mono">{network.password}</p>
              </div>
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-5 h-5 text-[#25D366]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-5 h-5 text-[#C9A96E]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Scan instruction */}
          <div className="flex items-center gap-2 text-[#C9A96E]/60 text-xs tracking-widest uppercase pt-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Scanner avec l'appareil photo</span>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#C9A96E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function LuxuryWifiPage() {
  const { propertySlug } = useParams<{ propertySlug: string }>();
  
  const property = propertySlug ? getPropertyBySlug(propertySlug) : undefined;
  
  // Redirect to 404 or home if property not found
  if (!property) {
    return <Navigate to="/" replace />;
  }

  const displayName = property.suiteName 
    ? `${property.brandName} – ${property.suiteName}`
    : property.brandName;

  return (
    <div className="min-h-screen bg-[#030303] text-[#FDFBF7] overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C9A96E]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#C9A96E]/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-6 py-12 max-w-md mx-auto">
        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          {/* Logo */}
          <h1 className="text-3xl font-light tracking-[0.3em] uppercase text-[#FDFBF7] mb-3">
            {displayName}
          </h1>
          
          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto mb-4"
          />
          
          {/* Subtitle */}
          <p className="text-sm tracking-[0.15em] text-[#FDFBF7]/60 uppercase">
            {property.subtitle}
          </p>
        </motion.header>

        {/* Wi-Fi Cards */}
        <div className="flex-1 space-y-5 mb-10">
          {property.networks.map((network, index) => (
            <WifiCard 
              key={network.ssid} 
              network={network} 
              delay={0.4 + index * 0.1} 
            />
          ))}
        </div>

        {/* WhatsApp Concierge Button */}
        {property.whatsappNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <button
              onClick={() => handleWhatsAppTap(property.whatsappNumber!)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#25D366]/20 to-[#25D366]/10 border border-[#25D366]/30 text-[#FDFBF7] transition-all duration-300 hover:border-[#25D366]/50 hover:shadow-[0_0_30px_rgba(37,211,102,0.15)] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <span className="text-sm font-medium tracking-wide">Contacter le Concierge</span>
            </button>
          </motion.div>
        )}

        {/* Instruction text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-xs text-[#FDFBF7]/40 tracking-wide leading-relaxed max-w-xs mx-auto">
            Ouvrez l'appareil photo de votre téléphone et scannez le QR code, ou copiez le mot de passe.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-1"
        >
          <p className="text-sm text-[#FDFBF7]/50 tracking-wide">
            {property.footerText}
          </p>
          <p className="text-[10px] text-[#C9A96E]/40 tracking-[0.2em] uppercase">
            {property.footerTagline}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
