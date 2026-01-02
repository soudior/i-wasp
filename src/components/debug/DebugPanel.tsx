/**
 * DebugPanel - Development/Testing debug panel
 * Shows key data for verification before launch
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestCard } from "@/contexts/GuestCardContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  X,
  CheckCircle2,
  XCircle,
  Image,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Wifi,
  WifiOff,
  Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface DebugItem {
  label: string;
  value: string | null;
  status: "ok" | "warning" | "error" | "info";
  icon: React.ReactNode;
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { guestCard } = useGuestCard();

  // Listen for online/offline status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  });

  // Generate URLs for testing
  const profileSlug = guestCard.first_name && guestCard.last_name 
    ? `${guestCard.first_name.toLowerCase()}-${guestCard.last_name.toLowerCase()}`
    : "demo";
  const profileUrl = `https://i-wasp.com/card/${profileSlug}`;
  
  // Google Maps URL (would be generated from location data)
  const mapsUrl = guestCard.website?.includes("maps") 
    ? guestCard.website 
    : "https://maps.google.com/?q=Marrakech,Morocco";

  // WhatsApp URL
  const whatsappUrl = guestCard.whatsapp 
    ? `https://wa.me/${guestCard.whatsapp.replace(/[^0-9]/g, "")}`
    : null;

  const debugItems: DebugItem[] = [
    {
      label: "Connexion Internet",
      value: isOnline ? "En ligne" : "Hors ligne",
      status: isOnline ? "ok" : "error",
      icon: isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />
    },
    {
      label: "URL Logo",
      value: guestCard.logo_url || "Non défini",
      status: guestCard.logo_url ? "ok" : "warning",
      icon: <Image className="h-4 w-4" />
    },
    {
      label: "URL Photo",
      value: guestCard.photo_url || "Non défini",
      status: guestCard.photo_url ? "ok" : "info",
      icon: <Image className="h-4 w-4" />
    },
    {
      label: "URL Profil NFC",
      value: profileUrl,
      status: guestCard.first_name ? "ok" : "warning",
      icon: <Globe className="h-4 w-4" />
    },
    {
      label: "Téléphone",
      value: guestCard.phone || "Non défini",
      status: guestCard.phone ? "ok" : "info",
      icon: <Phone className="h-4 w-4" />
    },
    {
      label: "WhatsApp URL",
      value: whatsappUrl || "Non configuré",
      status: whatsappUrl ? "ok" : "info",
      icon: <MessageCircle className="h-4 w-4" />
    },
    {
      label: "Google Maps URL",
      value: mapsUrl,
      status: "info",
      icon: <MapPin className="h-4 w-4" />
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié !");
  };

  const getStatusColor = (status: DebugItem["status"]) => {
    switch (status) {
      case "ok": return "text-green-400";
      case "warning": return "text-amber-400";
      case "error": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  const getStatusIcon = (status: DebugItem["status"]) => {
    switch (status) {
      case "ok": return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "error": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg hover:bg-amber-400 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bug className="h-5 w-5" />
      </motion.button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 100, x: 100 }}
            className="fixed bottom-20 right-4 z-50 w-[360px] max-h-[70vh] overflow-hidden"
          >
            <Card className="bg-[#1A1A1A] border-amber-500/30 shadow-2xl">
              <CardHeader className="flex-row items-center justify-between py-3 px-4 border-b border-white/10">
                <CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Mode Debug i-wasp
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
                {/* Connection Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="outline" 
                    className={isOnline 
                      ? "bg-green-500/10 text-green-400 border-green-500/30" 
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                    }
                  >
                    {isOnline ? "🟢 Connecté" : "🔴 Hors ligne"}
                  </Badge>
                  <span className="text-xs text-white/40">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                {/* Debug Items */}
                {debugItems.map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={getStatusColor(item.status)}>
                          {item.icon}
                        </span>
                        <span className="text-xs font-medium text-white/80">
                          {item.label}
                        </span>
                      </div>
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-white/50 bg-black/30 px-2 py-1 rounded truncate">
                        {item.value}
                      </code>
                      {item.value && item.value !== "Non défini" && item.value !== "Non configuré" && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white/40 hover:text-white"
                            onClick={() => copyToClipboard(item.value!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {item.value.startsWith("http") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-white/40 hover:text-white"
                              onClick={() => window.open(item.value!, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Test Actions */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <p className="text-xs font-medium text-white/60 mb-2">Tests rapides</p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs border-white/10 text-white/70 hover:text-white"
                    onClick={() => window.open(profileUrl, "_blank")}
                  >
                    <Globe className="h-3 w-3" />
                    Tester le profil NFC
                  </Button>
                  
                  {whatsappUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 text-xs border-green-500/30 text-green-400 hover:text-green-300"
                      onClick={() => window.open(whatsappUrl, "_blank")}
                    >
                      <MessageCircle className="h-3 w-3" />
                      Tester WhatsApp
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 text-xs border-blue-500/30 text-blue-400 hover:text-blue-300"
                    onClick={() => window.open(mapsUrl, "_blank")}
                  >
                    <MapPin className="h-3 w-3" />
                    Tester Google Maps
                  </Button>
                </div>

                {/* Guest Card Data Summary */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs font-medium text-white/60 mb-2">Données carte</p>
                  <pre className="text-[10px] text-white/40 bg-black/30 p-2 rounded overflow-x-auto">
{JSON.stringify({
  nom: `${guestCard.first_name} ${guestCard.last_name}`,
  poste: guestCard.title,
  entreprise: guestCard.company,
  email: guestCard.email,
  tel: guestCard.phone,
  whatsapp: guestCard.whatsapp,
  linkedin: guestCard.linkedin,
  site: guestCard.website,
  logo: guestCard.logo_url ? "✓" : "✗",
  photo: guestCard.photo_url ? "✓" : "✗"
}, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
