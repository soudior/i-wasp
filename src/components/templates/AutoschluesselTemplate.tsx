/**
 * Autoschlüssel Service Template
 * Professional German automotive key specialist template
 * WhatsApp-focused conversion design with tabbed services
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, UserPlus, Key, Settings, Shield, Wrench, Car, Cog } from "lucide-react";
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
  { icon: Key, label: "Zündschloss & Lenkradschloss Reparatur" },
  { icon: Cog, label: "Autoschlüssel anfertigen & programmieren" },
  { icon: Shield, label: "Wegfahrsperre Probleme beheben" },
  { icon: Wrench, label: "Autoschlüssel reparieren" },
  { icon: Car, label: "Fahrzeugprogrammierung" },
];

type TabType = "kontakt" | "services";

export function AutoschluesselTemplate({ data, hideBranding = false }: AutoschluesselTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabType>("kontakt");
  
  const whatsappLink = data?.whatsapp 
    ? `https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}?text=Hallo,%20ich%20brauche%20Hilfe%20mit%20meinem%20Autoschlüssel`
    : "https://wa.me/491626405973?text=Hallo,%20ich%20brauche%20Hilfe%20mit%20meinem%20Autoschlüssel";
  const phoneNumber = data?.phone || "+491626405973";

  const handleWhatsApp = () => {
    window.open(whatsappLink, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
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

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-3 bg-[#1F1F1F] rounded-2xl flex items-center justify-center">
            <Key className="w-8 h-8 text-[#FFC700]" />
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-white mb-1">
            Autoschlüssel Service
          </h1>
          
          {/* Location */}
          <p className="text-gray-500 text-xs">
            Raum Aachen, Heinsberg, Düren
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex bg-[#1F1F1F] rounded-xl p-1 mb-5"
        >
          <button
            onClick={() => setActiveTab("kontakt")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "kontakt"
                ? "bg-[#FFC700] text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Kontakt
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === "services"
                ? "bg-[#FFC700] text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Meine Services
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "kontakt" ? (
            <motion.div
              key="kontakt"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Primary CTA - WhatsApp */}
              <div className="mb-4">
                <Button
                  onClick={handleWhatsApp}
                  className="w-full h-14 bg-[#FFC700] hover:bg-[#FFD633] text-black font-medium text-base rounded-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp schreiben
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  onClick={handleCall}
                  variant="outline"
                  className="h-12 bg-[#1F1F1F] hover:bg-[#2A2A2A] border-0 text-white rounded-xl"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Anrufen
                </Button>
                <Button
                  onClick={handleAddContact}
                  variant="outline"
                  className="h-12 bg-[#1F1F1F] hover:bg-[#2A2A2A] border-0 text-white rounded-xl"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              </div>

              {/* Quick Services Preview */}
              <div className="bg-[#1F1F1F] rounded-2xl p-4">
                <h2 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
                  Unsere Leistungen
                </h2>
                <div className="space-y-2">
                  {services.slice(0, 3).map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-white"
                    >
                      <service.icon className="w-4 h-4 text-[#FFC700] flex-shrink-0" />
                      <span className="text-sm">{service.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("services")}
                  className="mt-3 text-[#FFC700] text-sm font-medium hover:underline"
                >
                  Alle Services anzeigen →
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Services with Background Image */}
              <div className="relative rounded-2xl overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={autoschluesselBg}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/85" />
                </div>

                {/* Content */}
                <div className="relative p-5">
                  <h2 className="text-sm font-medium text-[#FFC700] mb-4 uppercase tracking-wide">
                    Meine Services
                  </h2>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4"
                      >
                        <div className="w-10 h-10 bg-[#FFC700]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-5 h-5 text-[#FFC700]" />
                        </div>
                        <div>
                          <span className="text-white text-sm font-medium leading-tight">
                            {service.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA in Services Tab */}
                  <div className="mt-6">
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full h-12 bg-[#FFC700] hover:bg-[#FFD633] text-black font-medium rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Jetzt anfragen
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!hideBranding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-xs">
              Powered by IWASP
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AutoschluesselTemplate;
