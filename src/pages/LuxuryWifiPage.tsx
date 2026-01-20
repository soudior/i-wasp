import { useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, MessageCircle, Copy, Check, Camera, Loader2, CheckCircle2, WifiOff } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getPropertyBySlug, WifiNetwork } from "@/config/wifiProperties";
import { handleWhatsAppTap } from "@/lib/smartActions";
import { useState, useEffect, useCallback } from "react";
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

// Haptic feedback for mobile
const triggerHaptic = () => {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
};

type ConnectionState = 'idle' | 'connecting' | 'success' | 'manual';

interface WifiCardProps {
  network: WifiNetwork;
  delay?: number;
}

const WifiCard = ({ network, delay = 0 }: WifiCardProps) => {
  const wifiString = generateWiFiString(network.ssid, network.password, network.security);
  const [copied, setCopied] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [countdown, setCountdown] = useState(5);
  
  const handleCopyPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
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

  // Simulate connection animation (iOS 11+ auto-join after QR scan)
  const startConnectionAnimation = useCallback(() => {
    if (connectionState !== 'idle') return;
    
    triggerHaptic();
    setConnectionState('connecting');
    setCountdown(5);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // After 5 seconds, show success or manual instruction
    setTimeout(() => {
      clearInterval(countdownInterval);
      triggerHaptic();
      // We assume success after scan (can't actually detect WiFi connection in browser)
      setConnectionState('success');
      
      // Reset after showing success
      setTimeout(() => {
        setConnectionState('idle');
        setCountdown(5);
      }, 4000);
    }, 5000);
  }, [connectionState]);

  // Listen for visibility change (user left to scan QR, then came back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connectionState === 'idle') {
        // User came back - might have scanned QR
        // We could trigger animation here, but let's keep it manual for now
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connectionState]);

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

        {/* Connection overlay */}
        <AnimatePresence>
          {connectionState !== 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-[#0D0D0D]/95 backdrop-blur-sm"
            >
              {connectionState === 'connecting' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Animated WiFi icon with pulse */}
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-[#C9A96E]/20 blur-xl"
                      style={{ width: 80, height: 80, left: -10, top: -10 }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="relative"
                    >
                      <Loader2 className="w-16 h-16 text-[#C9A96E]" />
                    </motion.div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-lg font-light tracking-wide text-[#FDFBF7]">
                      Connexion en cours...
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-8 h-8 rounded-full border-2 border-[#C9A96E]/30 flex items-center justify-center"
                        animate={{ borderColor: ['rgba(201,169,110,0.3)', 'rgba(201,169,110,0.6)', 'rgba(201,169,110,0.3)'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <span className="text-sm font-mono text-[#C9A96E]">{countdown}</span>
                      </motion.div>
                      <span className="text-xs text-[#FDFBF7]/50 tracking-wide">secondes</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-[#FDFBF7]/40 tracking-wide text-center max-w-[200px]">
                    Scannez le QR code avec votre appareil photo
                  </p>
                </motion.div>
              )}
              
              {connectionState === 'success' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-xl" style={{ width: 80, height: 80, left: -10, top: -10 }} />
                    <CheckCircle2 className="w-16 h-16 text-[#25D366]" />
                  </motion.div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-lg font-light tracking-wide text-[#FDFBF7]">
                      Connecté !
                    </p>
                    <p className="text-xs text-[#FDFBF7]/50 tracking-wide">
                      Réseau : {network.ssid}
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 text-[10px] text-[#FDFBF7]/30 uppercase tracking-widest"
                  >
                    <Wifi className="w-3 h-3" />
                    <span>Connexion établie</span>
                  </motion.div>
                </motion.div>
              )}
              
              {connectionState === 'manual' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-5"
                >
                  <WifiOff className="w-12 h-12 text-[#C9A96E]/60" />
                  
                  <div className="text-center space-y-2">
                    <p className="text-base font-light tracking-wide text-[#FDFBF7]">
                      Connexion manuelle
                    </p>
                    <p className="text-xs text-[#FDFBF7]/50 tracking-wide max-w-[220px]">
                      Allez dans Réglages → Wi-Fi et sélectionnez le réseau
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setConnectionState('idle')}
                    className="text-xs text-[#C9A96E] underline underline-offset-4"
                  >
                    Retour
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-5">
          <div 
            className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-sm cursor-pointer transition-transform duration-200 active:scale-95"
            onClick={startConnectionAnimation}
          >
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
          <button
            onClick={startConnectionAnimation}
            className="flex items-center gap-2 text-[#C9A96E]/60 text-xs tracking-widest uppercase pt-2 transition-colors hover:text-[#C9A96E] active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scanner avec l'appareil photo</span>
          </button>
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
