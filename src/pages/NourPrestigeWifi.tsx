import { motion } from "framer-motion";
import { Wifi, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

/**
 * Nour Prestige - Luxury Wi-Fi Access Page
 * 
 * Ultra-premium landing page for high-end rental apartments
 * Accessed via NFC card or QR code
 * 
 * Design: Deep black, elegant gold accents, ivory white text
 * Mobile-first, iOS optimized
 */

// Wi-Fi configurations
const WIFI_NETWORKS = {
  wifi5g: {
    ssid: "HUAWEI-5G-DxH5",
    password: "NR3ea9N3",
    security: "WPA",
    label: "Connexion Wi-Fi 5G",
    recommended: true,
    description: "Recommandé – Vitesse maximale"
  },
  wifi24g: {
    ssid: "HUAWEI-2.4G-DxH5", 
    password: "NR3ea9N3",
    security: "WPA",
    label: "Connexion Wi-Fi 2.4G",
    recommended: false,
    description: "Compatible tous appareils"
  }
};

// Generate Wi-Fi connection string for QR codes
const generateWiFiString = (ssid: string, password: string, security: string = "WPA"): string => {
  const escapedSSID = ssid.replace(/[\\;,:]/g, '\\$&');
  const escapedPassword = password.replace(/[\\;,:]/g, '\\$&');
  return `WIFI:T:${security};S:${escapedSSID};P:${escapedPassword};;`;
};

interface WifiCardProps {
  network: typeof WIFI_NETWORKS.wifi5g;
  delay?: number;
}

const WifiCard = ({ network, delay = 0 }: WifiCardProps) => {
  const wifiString = generateWiFiString(network.ssid, network.password, network.security);
  
  const handleConnect = () => {
    // Create a temporary link with the WiFi URI scheme
    // iOS Safari should recognize and offer to join
    const link = document.createElement('a');
    link.href = wifiString;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div 
        onClick={handleConnect}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#C9A96E]/20 p-6 cursor-pointer transition-all duration-500 hover:border-[#C9A96E]/40 hover:shadow-[0_0_40px_rgba(201,169,110,0.15)]"
      >
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
            {/* Subtle gold glow */}
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

          {/* Touch indicator */}
          <div className="flex items-center gap-2 text-[#C9A96E]/60 text-xs tracking-widest uppercase">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Toucher pour connecter</span>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#C9A96E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default function NourPrestigeWifi() {
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
            Nour Prestige
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
            Appartement Officiel – Accès Wi-Fi Privé
          </p>
        </motion.header>

        {/* Wi-Fi Cards */}
        <div className="flex-1 space-y-5 mb-10">
          <WifiCard network={WIFI_NETWORKS.wifi5g} delay={0.4} />
          <WifiCard network={WIFI_NETWORKS.wifi24g} delay={0.5} />
        </div>

        {/* Instruction text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-xs text-[#FDFBF7]/40 tracking-wide leading-relaxed max-w-xs mx-auto">
            Approchez votre téléphone ou scannez le QR code pour vous connecter automatiquement.
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
            Merci de séjourner chez Nour Prestige
          </p>
          <p className="text-[10px] text-[#C9A96E]/40 tracking-[0.2em] uppercase">
            Résidences de Luxe
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
