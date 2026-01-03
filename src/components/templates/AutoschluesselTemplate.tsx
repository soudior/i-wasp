/**
 * Autoschlüssel Service Template - Layout Prestige
 * Professional German automotive key specialist template
 * Split-screen with glassmorphism floating card
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, UserPlus, Key, Shield, Wrench, Car, Cog, MapPin, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import autoschluesselBg from "@/assets/clients/autoschluessel-service-bg.jpg";

interface AutoschluesselTemplateProps {
  data?: {
    phone?: string;
    whatsapp?: string;
    firstName?: string;
    lastName?: string;
  };
  hideBranding?: boolean;
}

const services = [
  { icon: Cog, label: "Autoschlüssel anfertigen & programmieren" },
  { icon: Key, label: "Zündschloss & Lenkradschloss Reparatur" },
  { icon: Shield, label: "Wegfahrsperre Probleme beheben" },
  { icon: Wrench, label: "Autoschlüssel reparieren" },
  { icon: Car, label: "Fahrzeugprogrammierung" },
];

type TabType = "kontakt" | "leistungen";

// Clean phone number utility
const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[^0-9+]/g, '').replace(/^\+/, '');
};

export function AutoschluesselTemplate({ data }: AutoschluesselTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabType>("kontakt");
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Clean WhatsApp number for proper wa.me format
  const rawPhone = data?.whatsapp || data?.phone || "+49 162 6405973";
  const cleanedPhone = cleanPhoneNumber(rawPhone);
  const whatsappLink = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent("Hallo, ich brauche Hilfe mit meinem Autoschlüssel")}`;
  const phoneNumber = data?.phone || "+49 162 6405973";

  // Auto-scroll to card on interaction
  const scrollToCard = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleWhatsApp = () => {
    window.open(whatsappLink, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
  };

  const handleDirections = () => {
    window.open("https://www.google.com/maps/search/Autoschlüssel+Service+Aachen", "_blank");
  };

  const handleAddContact = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Autoschlüssel Service
ORG:Autoschlüssel Service
TEL;TYPE=CELL:${phoneNumber}
NOTE:Autoschlüssel • Codierung • Reparatur - Raum Aachen, Heinsberg, Düren
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "autoschluessel-service.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    scrollToCard();
  }, [activeTab]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Full Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={autoschluesselBg}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Split Screen Layout - Mobile: stacked, Desktop: side by side */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row lg:items-center lg:justify-end">
        
        {/* Left Side - Hero area (visible on larger screens) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left max-w-md"
          >
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              Autoschlüssel Service
            </h1>
            <p className="text-white/80 text-lg">
              Ihr Experte für Autoschlüssel & Fahrzeugprogrammierung
            </p>
          </motion.div>
        </div>

        {/* Right Side - Floating Glassmorphism Card */}
        <div className="flex-1 lg:flex-none lg:w-[420px] flex items-center justify-center p-4 lg:p-8 lg:pr-12">
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            {/* Glassmorphism Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#FFC700]/40 shadow-2xl shadow-black/50">
              {/* Glass effect background */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
              
              {/* Gold glow accent */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FFC700]/10 rounded-full blur-3xl" />
              
              {/* Card Content */}
              <div className="relative z-10 p-6">
                
                {/* Stories placeholder - top of card */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFC700] to-[#FFD633] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#1F1F1F] flex items-center justify-center">
                      <Key className="w-6 h-6 text-[#FFC700]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Autoschlüssel Service</h2>
                    <p className="text-white/60 text-xs">Aachen • Heinsberg • Düren</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/10 rounded-xl p-1 mb-5">
                  <button
                    onClick={() => setActiveTab("kontakt")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "kontakt"
                        ? "bg-[#FFC700] text-black"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Kontakt
                  </button>
                  <button
                    onClick={() => setActiveTab("leistungen")}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "leistungen"
                        ? "bg-[#FFC700] text-black"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Meine Leistungen
                  </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "kontakt" ? (
                    <motion.div
                      key="kontakt"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Primary CTA - WhatsApp */}
                      <Button
                        onClick={handleWhatsApp}
                        className="w-full h-12 bg-[#FFC700] hover:bg-[#FFD633] text-black font-semibold text-sm rounded-xl mb-3 shadow-lg shadow-[#FFC700]/20"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp schreiben
                      </Button>

                      {/* Secondary CTA - Call */}
                      <Button
                        onClick={handleCall}
                        variant="outline"
                        className="w-full h-11 bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl mb-4"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Anrufen
                      </Button>

                      {/* Utility Buttons Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <button
                          onClick={handleAddContact}
                          className="flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors"
                        >
                          <UserPlus className="w-5 h-5 text-[#FFC700]" />
                          <span className="text-[10px] text-white/70">vCard</span>
                        </button>
                        <button
                          onClick={handleDirections}
                          className="flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors"
                        >
                          <MapPin className="w-5 h-5 text-[#FFC700]" />
                          <span className="text-[10px] text-white/70">Route</span>
                        </button>
                        <button
                          className="flex flex-col items-center justify-center gap-1 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors opacity-50"
                          disabled
                        >
                          <Wifi className="w-5 h-5 text-white/40" />
                          <span className="text-[10px] text-white/40">Wi-Fi</span>
                        </button>
                      </div>

                      {/* Quick Services Preview */}
                      <div className="bg-white/5 rounded-xl p-4">
                        <h3 className="text-[10px] font-medium text-white/50 mb-2 uppercase tracking-wider">
                          Unsere Leistungen
                        </h3>
                        <div className="space-y-2">
                          {services.slice(0, 2).map((service, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <service.icon className="w-3 h-3 text-[#FFC700]" />
                              <span className="text-xs text-white/80">{service.label}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveTab("leistungen")}
                          className="mt-2 text-[#FFC700] text-xs font-medium hover:underline"
                        >
                          Alle anzeigen →
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="leistungen"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Services List */}
                      <div className="space-y-2 mb-4">
                        {services.map((service, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                          >
                            <div className="w-8 h-8 bg-[#FFC700]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                              <service.icon className="w-4 h-4 text-[#FFC700]" />
                            </div>
                            <span className="text-white text-xs font-medium">
                              {service.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA in Services Tab */}
                      <Button
                        onClick={handleWhatsApp}
                        className="w-full h-11 bg-[#FFC700] hover:bg-[#FFD633] text-black font-semibold text-sm rounded-xl shadow-lg shadow-[#FFC700]/20"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Jetzt anfragen
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AutoschluesselTemplate;
