/**
 * Charles Lazimi - Kompass France
 * Premium B2B Data Architect Digital Card
 * Color-coded by function type
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
  MessageCircle,
  Database,
  Target,
  TrendingUp,
  Zap,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import charlesPhoto from "@/assets/clients/charles-lazimi.jpeg";

// Kompass Logo SVG Component
const KompassLogo = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 40" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="30"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fontSize="28"
      fill="#E31937"
      letterSpacing="-1"
    >
      KOMPASS
    </text>
    <text
      x="0"
      y="38"
      fontFamily="Arial, sans-serif"
      fontSize="6"
      fill="#666"
    >
      Your route to business worldwide
    </text>
  </svg>
);

const profileData = {
  identity: {
    fullName: "Charles Lazimi",
    role: "Info Pro",
    company: "Kompass France",
    location: "Boulogne-Billancourt, France",
    verified: true,
    photoUrl: charlesPhoto
  },
  contact: {
    phone: "0621622530",
    email: "Charles.lazimi@kompass.com",
    website: "https://fr.kompass.com",
    googleMaps: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x47e67b037004c719:0x125fb1c2e9c4af76",
    linkedin: "https://www.linkedin.com/in/charles-lazimi-kompass",
    whatsapp: "33621622530"
  },
  // Kompass B2B Data Services
  services: [
    { icon: Database, label: "Data B2B", desc: "60M+ entreprises", color: "#004B93" },
    { icon: Target, label: "Ciblage", desc: "Fichiers qualifiés", color: "#059669" },
    { icon: Search, label: "Prospection", desc: "Contacts directs", color: "#7C3AED" },
    { icon: TrendingUp, label: "Export", desc: "CRM ready", color: "#EA580C" }
  ],
  // Quality metrics
  metrics: [
    { label: "Qualité Email", value: 98, color: "#059669" },
    { label: "Contacts Directs", value: 92, color: "#004B93" },
    { label: "SIRET Vérifié", value: 100, color: "#7C3AED" }
  ],
  security: {
    chipId: "NXP-TAG-CL-4492",
    encryption: "AES-256-GCM"
  }
};

// Color palette by function type
const actionColors = {
  call: { bg: "bg-emerald-500", hover: "hover:bg-emerald-600", text: "text-white" },
  whatsapp: { bg: "bg-[#25D366]", hover: "hover:bg-[#20BD5A]", text: "text-white" },
  email: { bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-white" },
  linkedin: { bg: "bg-[#0A66C2]", hover: "hover:bg-[#094D92]", text: "text-white" },
  website: { bg: "bg-slate-700", hover: "hover:bg-slate-800", text: "text-white" },
  maps: { bg: "bg-orange-500", hover: "hover:bg-orange-600", text: "text-white" },
  contact: { bg: "bg-[#004B93]", hover: "hover:bg-[#003a75]", text: "text-white" }
};

export default function CharlesLazimiCard() {
  const handleCall = () => {
    window.location.href = `tel:${profileData.contact.phone}`;
    toast.success("Appel en cours...");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${profileData.contact.whatsapp}`, "_blank");
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
NOTE:Contact certifié via i-wasp.com | Data B2B Expert
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "charles-lazimi-kompass.vcf";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Contact ajouté avec succès !");
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
          
          {/* Kompass Logo Header */}
          <div className="bg-white px-6 pt-4 pb-2 flex justify-center border-b border-gray-100">
            <KompassLogo className="h-10 w-auto" />
          </div>
          
          {/* Header - Kompass Blue */}
          <div className="bg-gradient-to-br from-[#004B93] to-[#003366] px-6 py-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Avatar with photo or monogram */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative z-10 flex justify-center mb-4"
            >
              {profileData.identity.photoUrl ? (
                <img 
                  src={profileData.identity.photoUrl} 
                  alt={profileData.identity.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
                  <span className="text-4xl font-bold text-white">CL</span>
                </div>
              )}
              {profileData.identity.verified && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-2 -right-2"
                >
                  <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg border-2 border-white">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Identity */}
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

            {/* Sovereign Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-white">Sovereign Member</span>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            
            {/* Quick Actions - Color coded */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-2"
            >
              {/* Call - Green (action directe) */}
              <motion.button
                onClick={handleCall}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${actionColors.call.bg} ${actionColors.call.hover} ${actionColors.call.text} transition-all shadow-lg shadow-emerald-500/20`}
              >
                <Phone className="w-5 h-5" />
                <span className="text-xs font-medium">Appeler</span>
              </motion.button>

              {/* WhatsApp - Brand green */}
              <motion.button
                onClick={handleWhatsApp}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${actionColors.whatsapp.bg} ${actionColors.whatsapp.hover} ${actionColors.whatsapp.text} transition-all shadow-lg shadow-[#25D366]/20`}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-medium">WhatsApp</span>
              </motion.button>

              {/* Email - Blue (communication) */}
              <motion.button
                onClick={handleEmail}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${actionColors.email.bg} ${actionColors.email.hover} ${actionColors.email.text} transition-all shadow-lg shadow-blue-500/20`}
              >
                <Mail className="w-5 h-5" />
                <span className="text-xs font-medium">Email</span>
              </motion.button>
            </motion.div>

            {/* Secondary Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-2"
            >
              {/* LinkedIn - Brand blue */}
              <motion.button
                onClick={handleLinkedIn}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${actionColors.linkedin.bg} ${actionColors.linkedin.hover} ${actionColors.linkedin.text} transition-all shadow-lg shadow-[#0A66C2]/20`}
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-xs font-medium">LinkedIn</span>
              </motion.button>

              {/* Website - Neutral dark */}
              <motion.button
                onClick={handleWebsite}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${actionColors.website.bg} ${actionColors.website.hover} ${actionColors.website.text} transition-all shadow-lg shadow-slate-700/20`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium">Site Web</span>
              </motion.button>

              {/* Maps - Orange (navigation) */}
              <motion.button
                onClick={handleMaps}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl ${actionColors.maps.bg} ${actionColors.maps.hover} ${actionColors.maps.text} transition-all shadow-lg shadow-orange-500/20`}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-medium">Localiser</span>
              </motion.button>
            </motion.div>

            {/* Kompass Services - Horizontal scroll */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#004B93]" />
                <span className="text-sm font-semibold text-[#1D1D1F]">Expertise Kompass</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {profileData.services.map((service, index) => (
                  <motion.div
                    key={service.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-xl p-3 border border-gray-100 shadow-sm min-w-[100px]"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      <service.icon className="w-4 h-4" style={{ color: service.color }} />
                    </div>
                    <p className="text-xs font-semibold text-[#1D1D1F]">{service.label}</p>
                    <p className="text-[10px] text-[#8E8E93] mt-0.5">{service.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quality Metrics - Compact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-[#004B93]/5 to-[#004B93]/10 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#1D1D1F]">Qualité Data</span>
                <Shield className="w-4 h-4 text-[#004B93]" />
              </div>
              <div className="flex gap-3">
                {profileData.metrics.map((metric, index) => (
                  <div key={metric.label} className="flex-1 text-center">
                    <div 
                      className="text-xl font-bold"
                      style={{ color: metric.color }}
                    >
                      {metric.value}%
                    </div>
                    <p className="text-[10px] text-[#8E8E93] leading-tight mt-1">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Primary CTA - Add Contact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={handleAddContact}
                className={`w-full h-14 rounded-2xl ${actionColors.contact.bg} ${actionColors.contact.hover} ${actionColors.contact.text} font-semibold text-base shadow-xl shadow-[#004B93]/25`}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Enregistrer le contact
              </Button>
            </motion.div>

            {/* Security Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-3 pt-1 text-[10px] text-[#8E8E93]"
            >
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>NFC Active</span>
              </div>
              <span>•</span>
              <span>{profileData.security.encryption}</span>
            </motion.div>
          </div>
        </div>

        {/* IWASP Branding - Clickable */}
        <motion.a
          href="https://i-wasp.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-[#8E8E93] text-xs group-hover:text-[#1D1D1F] transition-colors">
            <span>Powered by</span>
            <span className="font-semibold text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors">
              i-wasp.com
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93]/70">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span>Tap. Connect. Empower.</span>
          </div>
        </motion.a>
      </motion.div>
    </div>
  );
}