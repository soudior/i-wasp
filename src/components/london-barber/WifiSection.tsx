/**
 * London Barber - Wi-Fi Sharing Section
 * 
 * Features:
 * - QR Code for instant connection
 * - Password copy to clipboard
 * - Premium warm wood styling
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Copy, Check, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface WifiSectionProps {
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textLight: string;
  };
}

// Wi-Fi credentials for London Barber
const WIFI_CONFIG = {
  ssid: "TP-Link_6858",
  password: "37243883",
  security: "WPA",
};

export function WifiSection({ brandColors }: WifiSectionProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate Wi-Fi QR code string
  const wifiQRString = `WIFI:T:${WIFI_CONFIG.security};S:${WIFI_CONFIG.ssid};P:${WIFI_CONFIG.password};;`;

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(WIFI_CONFIG.password);
      setCopied(true);
      toast.success("Mot de passe copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = WIFI_CONFIG.password;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
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
      className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#E8E8E8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${brandColors.primary}15` }}
            >
              <Wifi size={16} style={{ color: brandColors.primary }} />
            </div>
            <div>
              <p className="font-medium text-[#1D1D1F]">Wi-Fi Gratuit</p>
              <p className="text-xs text-[#6B6B6B]">{WIFI_CONFIG.ssid}</p>
            </div>
          </div>
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 rounded-lg hover:bg-[#F5F5F0] transition-colors"
          >
            <QrCode
              size={20}
              className={showQR ? "text-[#8B4513]" : "text-[#6B6B6B]"}
            />
          </button>
        </div>
      </div>

      {/* Password Row */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#6B6B6B] mb-1">Mot de passe</p>
          <p className="font-mono text-sm font-medium text-[#1D1D1F] truncate">
            {WIFI_CONFIG.password}
          </p>
        </div>
        <motion.button
          onClick={handleCopyPassword}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors flex-shrink-0"
          style={{
            backgroundColor: copied ? "#22C55E20" : `${brandColors.primary}15`,
            color: copied ? "#22C55E" : brandColors.primary,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check size={16} />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy size={16} />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="text-sm font-medium">
            {copied ? "Copié !" : "Copier"}
          </span>
        </motion.button>
      </div>

      {/* QR Code Section */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              <div
                className="rounded-2xl p-6 flex flex-col items-center"
                style={{ backgroundColor: "#F8F6F3" }}
              >
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <QRCodeSVG
                    value={wifiQRString}
                    size={160}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor={brandColors.primary}
                    includeMargin={false}
                  />
                </div>
                <p className="text-xs text-[#6B6B6B] mt-3 text-center">
                  Scannez pour vous connecter automatiquement
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
