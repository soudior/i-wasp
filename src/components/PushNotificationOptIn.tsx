/**
 * i-wasp Push Notification Opt-In Component
 * Minimalist, Apple-like design for profile visitors
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X, Check, Loader2 } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface PushNotificationOptInProps {
  cardId: string;
  ownerName: string;
  variant?: "banner" | "button" | "floating";
  className?: string;
}

export function PushNotificationOptIn({ 
  cardId, 
  ownerName, 
  variant = "floating",
  className = ""
}: PushNotificationOptInProps) {
  const { 
    isSupported, 
    isSubscribed, 
    isLoading, 
    permission,
    subscribe, 
    unsubscribe 
  } = usePushNotifications(cardId);
  
  const [isDismissed, setIsDismissed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Don't show if not supported or already dismissed
  if (!isSupported || isDismissed) {
    return null;
  }

  // Don't show if permission was denied
  if (permission === 'denied') {
    return null;
  }

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsDismissed(true);
      }, 2000);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  // Already subscribed - show minimal status
  if (isSubscribed && !showSuccess) {
    return null;
  }

  // Success state
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed bottom-6 left-4 right-4 z-50 ${className}`}
      >
        <div className="mx-auto max-w-sm bg-[#34C759] text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Check size={18} />
          </div>
          <span className="text-sm font-medium">
            Notifications activées !
          </span>
        </div>
      </motion.div>
    );
  }

  // Floating banner variant (default)
  if (variant === "floating") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ delay: 2, duration: 0.3 }}
          className={`fixed bottom-6 left-4 right-4 z-50 ${className}`}
        >
          <div className="mx-auto max-w-sm bg-white dark:bg-[#1D1D1F] rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-[#007AFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell size={20} className="text-[#007AFF]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-white">
                  Restez connecté
                </h3>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  Recevez les actualités de {ownerName}
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 -mr-1 -mt-1 text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 px-4 text-sm font-medium text-[#8E8E93] bg-[#F5F5F7] dark:bg-[#2D2D2D] rounded-xl transition-all active:scale-[0.98]"
              >
                Plus tard
              </button>
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-[#007AFF] rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Bell size={16} />
                    Activer
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Button variant (for integration in card UI)
  if (variant === "button") {
    return (
      <button
        onClick={handleSubscribe}
        disabled={isLoading || isSubscribed}
        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 bg-[#F5F5F7] dark:bg-[#2D2D2D] ${className}`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin text-[#007AFF]" />
        ) : isSubscribed ? (
          <>
            <BellOff size={18} className="text-[#8E8E93]" />
            <span className="text-sm font-medium text-[#8E8E93]">Abonné</span>
          </>
        ) : (
          <>
            <Bell size={18} className="text-[#007AFF]" />
            <span className="text-sm font-medium text-[#1D1D1F] dark:text-white">
              Notifications
            </span>
          </>
        )}
      </button>
    );
  }

  // Banner variant (top of page)
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-[#007AFF] text-white px-4 py-3 ${className}`}
      >
        <div className="max-w-sm mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <span className="text-sm">Activer les notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="text-sm opacity-80 hover:opacity-100"
            >
              Non
            </button>
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="bg-white text-[#007AFF] px-3 py-1 rounded-lg text-sm font-medium"
            >
              {isLoading ? "..." : "Oui"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default PushNotificationOptIn;
