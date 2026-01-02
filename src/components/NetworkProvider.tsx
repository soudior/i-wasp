import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkContextType {
  isOnline: boolean;
  isSlowConnection: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isSlowConnection: false
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineModal(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineModal(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check connection quality
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      const checkConnectionSpeed = () => {
        const effectiveType = connection.effectiveType;
        setIsSlowConnection(effectiveType === "slow-2g" || effectiveType === "2g");
      };
      checkConnectionSpeed();
      connection.addEventListener("change", checkConnectionSpeed);
      
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        connection.removeEventListener("change", checkConnectionSpeed);
      };
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setShowOfflineModal(false);
      window.location.reload();
    }
  };

  return (
    <NetworkContext.Provider value={{ isOnline, isSlowConnection }}>
      {children}
      
      <AnimatePresence>
        {showOfflineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-2xl p-8 max-w-sm w-full text-center border border-zinc-700"
            >
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center border border-amber-500/30">
                <WifiOff className="h-10 w-10 text-amber-400" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white mb-2">
                Connexion perdue
              </h2>

              {/* Message */}
              <p className="text-gray-400 text-sm mb-6">
                i-wasp nécessite une connexion internet pour mettre à jour votre profil et synchroniser vos données.
              </p>

              {/* Retry button */}
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>

              {/* Tip */}
              <p className="text-gray-500 text-xs mt-4">
                💡 Les profils déjà visités restent accessibles hors-ligne
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slow connection banner */}
      <AnimatePresence>
        {isSlowConnection && isOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[98] bg-amber-500/90 text-black text-center py-2 px-4 text-sm font-medium"
          >
            ⚠️ Connexion lente détectée. Le chargement peut être plus long.
          </motion.div>
        )}
      </AnimatePresence>
    </NetworkContext.Provider>
  );
}
