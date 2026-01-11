/**
 * Charles Lazimi - Kompass France
 * Premium B2B Data Architect Digital Card
 * Sovereign Member Profile
 */

import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Linkedin, 
  UserPlus,
  Shield,
  CheckCircle2,
  Building2,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { IWASPBrandBadge } from "@/components/templates/IWASPBrandBadge";

const profileData = {
  identity: {
    fullName: "Charles Lazimi",
    role: "Info Pro",
    company: "Kompass France",
    location: "Boulogne-Billancourt, France",
    verified: true
  },
  contact: {
    phone: "0621622530",
    email: "Charles.lazimi@kompass.com",
    website: "https://fr.kompass.com",
    googleMaps: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x47e67b037004c719:0x125fb1c2e9c4af76",
    linkedin: "https://www.linkedin.com/in/charles-lazimi-kompass"
  },
  analytics: {
    accuracy: [
      { label: "Qualité Email", value: 98 },
      { label: "Numéro Direct", value: 92 },
      { label: "Siret Vérifié", value: 100 },
      { label: "Mise à jour", value: 95 }
    ]
  },
  security: {
    chipId: "NXP-TAG-CL-4492",
    encryption: "AES-256-GCM"
  }
};

export default function CharlesLazimiCard() {
  const handleCall = () => {
    window.location.href = `tel:${profileData.contact.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${profileData.contact.email}`;
  };

  const handleLinkedIn = () => {
    window.open(profileData.contact.linkedin, "_blank");
  };

  const handleWebsite = () => {
    window.open(profileData.contact.website, "_blank");
  };

  const handleMaps = () => {
    window.open(profileData.contact.googleMaps, "_blank");
  };

  const handleAddContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Charles Lazimi
ORG:Kompass France
TITLE:Info Pro
TEL;TYPE=CELL:0621622530
EMAIL:Charles.lazimi@kompass.com
ADR;TYPE=WORK:;;66 Quai du Maréchal Joffre;Boulogne-Billancourt;;92100;France
URL:https://fr.kompass.com
NOTE:Contact certifié via i-wasp.com
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "charles-lazimi.vcf";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Contact ajouté avec succès");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
          
          {/* Header with Kompass Blue */}
          <div className="bg-[#004B93] px-6 py-8 relative overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Avatar */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 flex justify-center mb-4"
            >
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <span className="text-4xl font-bold text-white font-serif">C</span>
              </div>
              {profileData.identity.verified && (
                <div className="absolute -bottom-1 right-1/2 translate-x-8">
                  <div className="bg-emerald-500 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Name & Title */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-center relative z-10"
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {profileData.identity.fullName}
              </h1>
              <p className="text-white/80 mt-1 font-medium">
                {profileData.identity.role}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-white/70 text-sm">
                <Building2 className="w-4 h-4" />
                <span>{profileData.identity.company}</span>
              </div>
            </motion.div>

            {/* Verified Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-white/90">Sovereign Member</span>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Location */}
            <motion.button
              onClick={handleMaps}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#004B93]/10 flex items-center justify-center group-hover:bg-[#004B93]/20 transition-colors">
                <MapPin className="w-5 h-5 text-[#004B93]" />
              </div>
              <div>
                <p className="text-sm text-[#8E8E93]">Localisation</p>
                <p className="text-[#1D1D1F] font-medium">{profileData.identity.location}</p>
              </div>
            </motion.button>

            {/* Data Quality Metrics */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#004B93] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#1D1D1F]">Qualité Data B2B</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {profileData.analytics.accuracy.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white rounded-xl p-3 shadow-sm"
                  >
                    <div className="flex items-end justify-between mb-1">
                      <span className="text-2xl font-bold text-[#004B93]">{metric.value}%</span>
                    </div>
                    <p className="text-xs text-[#8E8E93]">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-4 gap-3"
            >
              <motion.button
                onClick={handleCall}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#004B93]/5 hover:bg-[#004B93]/10 transition-colors"
              >
                <Phone className="w-5 h-5 text-[#004B93]" />
                <span className="text-xs text-[#1D1D1F]">Appeler</span>
              </motion.button>

              <motion.button
                onClick={handleEmail}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#004B93]/5 hover:bg-[#004B93]/10 transition-colors"
              >
                <Mail className="w-5 h-5 text-[#004B93]" />
                <span className="text-xs text-[#1D1D1F]">Email</span>
              </motion.button>

              <motion.button
                onClick={handleLinkedIn}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#004B93]/5 hover:bg-[#004B93]/10 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[#004B93]" />
                <span className="text-xs text-[#1D1D1F]">LinkedIn</span>
              </motion.button>

              <motion.button
                onClick={handleWebsite}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#004B93]/5 hover:bg-[#004B93]/10 transition-colors"
              >
                <Globe className="w-5 h-5 text-[#004B93]" />
                <span className="text-xs text-[#1D1D1F]">Site</span>
              </motion.button>
            </motion.div>

            {/* Add Contact Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={handleAddContact}
                className="w-full h-14 rounded-2xl bg-[#004B93] hover:bg-[#003a75] text-white font-semibold text-base shadow-lg shadow-[#004B93]/20"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Ajouter aux contacts
              </Button>
            </motion.div>

            {/* Security Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-center gap-4 pt-2 text-xs text-[#8E8E93]"
            >
              <div className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{profileData.security.chipId}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#8E8E93]" />
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>{profileData.security.encryption}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* IWASP Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex justify-center"
        >
          <div className="flex items-center gap-2 text-[#8E8E93] text-xs">
            <span>Powered by</span>
            <IWASPBrandBadge variant="light" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}