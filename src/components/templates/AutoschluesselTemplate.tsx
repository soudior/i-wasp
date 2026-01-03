/**
 * Autoschlüssel Service Template
 * Professional German automotive key specialist template
 * WhatsApp-focused conversion design
 */

import { motion } from "framer-motion";
import { Phone, MessageCircle, UserPlus, Key, Settings, Shield, Wrench, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AutoschluesselTemplateProps {
  data?: {
    phone?: string;
    whatsapp?: string;
    firstName?: string;
    lastName?: string;
  };
}

const services = [
  { icon: Key, label: "Autoschlüssel nachmachen" },
  { icon: Settings, label: "Schlüssel codieren" },
  { icon: Shield, label: "Wegfahrsperre Probleme beheben" },
  { icon: Wrench, label: "Autoschlüssel reparieren" },
  { icon: Car, label: "Fahrzeugprogrammierung" },
];

export function AutoschluesselTemplate({ data }: AutoschluesselTemplateProps) {
  const whatsappLink = "https://wa.me/491626405973?text=Hallo,%20ich%20brauche%20Hilfe%20mit%20meinem%20Autoschlüssel";
  const phoneNumber = "+491626405973";

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
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-4 bg-[#1F1F1F] rounded-2xl flex items-center justify-center">
            <Key className="w-10 h-10 text-[#FFC700]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white mb-2">
            Autoschlüssel Service
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-400 text-sm mb-2">
            Autoschlüssel • Codierung • Reparatur
          </p>
          
          {/* Location */}
          <p className="text-gray-500 text-xs">
            Raum Aachen, Heinsberg, Düren – Deutschland
          </p>
        </motion.div>

        {/* Primary CTA - WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Button
            onClick={handleWhatsApp}
            className="w-full h-14 bg-[#FFC700] hover:bg-[#FFD633] text-black font-medium text-base rounded-xl"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp schreiben
          </Button>
        </motion.div>

        {/* Secondary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
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
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1F1F1F] rounded-2xl p-5"
        >
          <h2 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
            Unsere Leistungen
          </h2>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-white"
              >
                <service.icon className="w-4 h-4 text-[#FFC700]" />
                <span className="text-sm">{service.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
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
      </div>
    </div>
  );
}

export default AutoschluesselTemplate;
