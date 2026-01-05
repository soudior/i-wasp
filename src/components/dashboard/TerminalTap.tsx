/**
 * TerminalTap - NFC Payment Terminal Component
 * Stealth Luxury Style (#050807, #A5A9B4, #D1D5DB)
 * Premium NFC payment simulation for i-Wasp
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Nfc, Check, X, Loader2, Smartphone, 
  Wifi, WifiOff
} from "lucide-react";
import { toast } from "sonner";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useCurrency } from "@/contexts/CurrencyContext";

// Stealth Luxury Colors
const COLORS = {
  bg: "#050807",
  bgCard: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  text: "#F9FAFB",
  textMuted: "rgba(249, 250, 251, 0.5)",
  textDim: "rgba(249, 250, 251, 0.3)",
  border: "rgba(165, 169, 180, 0.15)",
  success: "#4ADE80",
  error: "#F87171",
};

type PaymentStatus = "idle" | "waiting" | "processing" | "success" | "error";

interface TerminalTapProps {
  onPaymentComplete?: (amount: number) => void;
}

export function TerminalTap({ onPaymentComplete }: TerminalTapProps) {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState("0");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [isNfcEnabled, setIsNfcEnabled] = useState(true);
  const { impactLight, impactMedium, notificationSuccess, notificationError } = useHapticFeedback();

  const currencySymbol = currency === "EUR" ? "€" : "DH";
  const currencyLabel = currency;

  // Format amount display
  const formattedAmount = (() => {
    const numAmount = parseFloat(amount) || 0;
    if (amount.includes(".")) {
      return numAmount.toFixed(2);
    }
    return numAmount.toString();
  })();

  // Handle keypad input
  const handleKeyPress = useCallback((key: string) => {
    if (status !== "idle") return;
    impactLight();

    if (key === "C") {
      setAmount("0");
      return;
    }

    if (key === "⌫") {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
      return;
    }

    if (key === "." && amount.includes(".")) return;
    if (key === "." && amount === "0") {
      setAmount("0.");
      return;
    }

    const decimals = amount.split(".")[1];
    if (decimals && decimals.length >= 2) return;

    setAmount(prev => prev === "0" && key !== "." ? key : prev + key);
  }, [amount, status, impactLight]);

  // Initiate payment
  const initiatePayment = async () => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      toast.error("Veuillez saisir un montant valide");
      return;
    }

    impactMedium();
    setStatus("waiting");

    // Simulate NFC waiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStatus("processing");
    impactLight();

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 90% success rate simulation
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      setStatus("success");
      notificationSuccess();
      toast.success(`Paiement de ${formattedAmount} ${currencySymbol} reçu`);
      onPaymentComplete?.(numAmount);
    } else {
      setStatus("error");
      notificationError();
      toast.error("Échec du paiement. Veuillez réessayer.");
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setStatus("idle");
      if (isSuccess) setAmount("0");
    }, 3000);
  };

  // Keypad layout
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

  return (
    <div 
      className="rounded-3xl overflow-hidden"
      style={{ 
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})` 
            }}
          >
            <Nfc className="h-5 w-5" style={{ color: COLORS.bg }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: COLORS.text }}>
              Terminal Tap
            </h3>
            <p className="text-xs" style={{ color: COLORS.textDim }}>
              Encaissement NFC Premium
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsNfcEnabled(!isNfcEnabled)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all"
          style={{ 
            backgroundColor: isNfcEnabled ? `${COLORS.success}20` : `${COLORS.error}20`,
            color: isNfcEnabled ? COLORS.success : COLORS.error,
          }}
        >
          {isNfcEnabled ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isNfcEnabled ? "NFC Actif" : "NFC Inactif"}
        </button>
      </div>

      {/* Amount Display */}
      <div className="px-6 py-8 text-center relative">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: COLORS.textDim }}>
                Montant à encaisser
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span 
                  className="text-5xl font-bold tracking-tight"
                  style={{ color: COLORS.text }}
                >
                  {formattedAmount}
                </span>
                <span 
                  className="text-2xl font-medium"
                  style={{ color: COLORS.accent }}
                >
                  {currencySymbol}
                </span>
              </div>
              <p className="text-xs mt-2" style={{ color: COLORS.textDim }}>
                {currencyLabel}
              </p>
            </motion.div>
          )}

          {status === "waiting" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.accent}20` }}
              >
                <Smartphone className="h-10 w-10" style={{ color: COLORS.accent }} />
              </motion.div>
              <p className="font-medium" style={{ color: COLORS.text }}>
                En attente d'un appareil NFC...
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.textDim }}>
                Approchez une carte ou un smartphone
              </p>
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <Loader2 
                className="h-16 w-16 animate-spin mb-4" 
                style={{ color: COLORS.accent }} 
              />
              <p className="font-medium" style={{ color: COLORS.text }}>
                Traitement en cours...
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.textDim }}>
                Connexion sécurisée
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.success}20` }}
              >
                <Check className="h-10 w-10" style={{ color: COLORS.success }} />
              </motion.div>
              <p className="font-bold text-xl" style={{ color: COLORS.success }}>
                Paiement Réussi
              </p>
              <p className="text-sm mt-1" style={{ color: COLORS.text }}>
                {formattedAmount} {currencySymbol}
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${COLORS.error}20` }}
              >
                <X className="h-10 w-10" style={{ color: COLORS.error }} />
              </motion.div>
              <p className="font-bold text-xl" style={{ color: COLORS.error }}>
                Échec du Paiement
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.textDim }}>
                Veuillez réessayer
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keypad */}
      <div 
        className="px-6 pb-4"
        style={{ opacity: status !== "idle" ? 0.3 : 1, pointerEvents: status !== "idle" ? "none" : "auto" }}
      >
        <div className="grid grid-cols-3 gap-2">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-14 rounded-xl font-semibold text-lg transition-all active:scale-95"
              style={{ 
                backgroundColor: `${COLORS.accent}10`,
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${COLORS.accent}25`;
                e.currentTarget.style.borderColor = COLORS.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${COLORS.accent}10`;
                e.currentTarget.style.borderColor = COLORS.border;
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Clear button */}
        <button
          onClick={() => handleKeyPress("C")}
          className="w-full mt-2 h-12 rounded-xl font-medium text-sm transition-all"
          style={{ 
            backgroundColor: `${COLORS.error}15`,
            color: COLORS.error,
            border: `1px solid ${COLORS.error}30`,
          }}
        >
          Effacer
        </button>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          onClick={initiatePayment}
          disabled={status !== "idle" || !isNfcEnabled || parseFloat(amount) <= 0}
          className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ 
            background: status === "idle" 
              ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`
              : COLORS.border,
            color: COLORS.bg,
          }}
        >
          <Nfc size={20} />
          Initier le Tap
        </button>
      </div>

      {/* Footer */}
      <div 
        className="px-6 py-3 flex items-center justify-center gap-2"
        style={{ 
          backgroundColor: `${COLORS.accent}05`,
          borderTop: `1px solid ${COLORS.border}` 
        }}
      >
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.success }} />
        <span className="text-xs" style={{ color: COLORS.textDim }}>
          Terminal sécurisé · Chiffrement AES-256
        </span>
      </div>
    </div>
  );
}

export default TerminalTap;
