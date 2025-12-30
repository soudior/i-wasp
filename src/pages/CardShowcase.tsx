import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Smartphone, Building2, UtensilsCrossed, Hammer, Heart,
  Calendar, FileText, MessageCircle, MapPin, Star, Phone, Clock,
  Wifi, Copy, Check, ChevronRight, User, Mail, Globe, Linkedin,
  Instagram, ExternalLink, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import iwaspLogoWhite from "@/assets/iwasp-logo-white.png";
import iwaspLogoDark from "@/assets/iwasp-logo.png";

// Types
type Industry = "immobilier" | "restauration" | "btp" | "sante";
type ViewMode = "physical" | "digital";
type CardColor = "black" | "white" | "gold";

// Industry configurations
const industries = {
  immobilier: {
    id: "immobilier",
    name: "Immobilier",
    icon: Building2,
    color: "from-blue-600 to-blue-800",
    accentColor: "blue",
    profile: {
      name: "Sophie Martin",
      title: "Agent Immobilier",
      company: "Prestige Immo",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      phone: "+33 6 12 34 56 78",
      email: "sophie@prestige-immo.fr",
      website: "prestige-immo.fr",
    },
    actions: [
      { icon: Calendar, label: "Prendre RDV Estimation", color: "bg-blue-600" },
      { icon: FileText, label: "Catalogue des Biens", color: "bg-blue-500" },
      { icon: MessageCircle, label: "WhatsApp", color: "bg-green-600" },
    ],
  },
  restauration: {
    id: "restauration",
    name: "Restauration",
    icon: UtensilsCrossed,
    color: "from-amber-600 to-orange-700",
    accentColor: "amber",
    profile: {
      name: "Chef Marco Rossi",
      title: "Chef Exécutif",
      company: "La Table d'Or",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&crop=face",
      phone: "+33 1 23 45 67 89",
      email: "contact@latabledOr.fr",
      website: "latabledOr.fr",
    },
    actions: [
      { icon: FileText, label: "Menu Digital", color: "bg-amber-600" },
      { icon: Calendar, label: "Réserver une table", color: "bg-amber-500" },
      { icon: Star, label: "Laisser un avis Google", color: "bg-yellow-600" },
    ],
  },
  btp: {
    id: "btp",
    name: "BTP / Artisan",
    icon: Hammer,
    color: "from-slate-700 to-slate-900",
    accentColor: "slate",
    profile: {
      name: "Pierre Durand",
      title: "Maître Artisan",
      company: "Durand & Fils",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      phone: "+33 6 98 76 54 32",
      email: "contact@durand-fils.fr",
      website: "durand-fils.fr",
    },
    actions: [
      { icon: FileText, label: "Demander un devis", color: "bg-slate-700" },
      { icon: Globe, label: "Portfolio / Réalisations", color: "bg-slate-600" },
      { icon: Phone, label: "Appel Urgence", color: "bg-red-600" },
    ],
  },
  sante: {
    id: "sante",
    name: "Santé",
    icon: Heart,
    color: "from-emerald-600 to-teal-700",
    accentColor: "emerald",
    profile: {
      name: "Dr. Claire Dupont",
      title: "Médecin Généraliste",
      company: "Cabinet Médical Centre",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
      phone: "+33 1 42 00 00 00",
      email: "dr.dupont@cabinet-centre.fr",
      website: "cabinet-centre.fr",
    },
    actions: [
      { icon: Calendar, label: "Doctolib", color: "bg-blue-600" },
      { icon: Clock, label: "Horaires d'ouverture", color: "bg-emerald-600" },
      { icon: MapPin, label: "Localisation GPS", color: "bg-teal-600" },
    ],
  },
};

// Card colors
const cardColors = {
  black: { bg: "#0a0a0a", text: "white", logoVariant: "white" as const },
  white: { bg: "#fafafa", text: "black", logoVariant: "dark" as const },
  gold: { bg: "#c9a962", text: "black", logoVariant: "dark" as const },
};

// WiFi config
const wifiConfig = {
  ssid: "IWASP-Guest",
  password: "Welcome2024!",
};

export default function CardShowcase() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>("immobilier");
  const [viewMode, setViewMode] = useState<ViewMode>("physical");
  const [cardColor, setCardColor] = useState<CardColor>("black");
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied] = useState(false);

  const industry = industries[selectedIndustry];
  const color = cardColors[cardColor];

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiConfig.password);
    setCopied(true);
    toast.success("Mot de passe copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between border-b border-white/10">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Retour</span>
        </Link>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-white">Card Showcase</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Industry Selector */}
        <div className="mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3 text-center">Secteur d'activité</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.values(industries).map((ind) => {
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id as Industry)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300
                    ${selectedIndustry === ind.id 
                      ? `bg-gradient-to-r ${ind.color} text-white shadow-lg scale-105` 
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{ind.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMode("physical")}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300
                ${viewMode === "physical" 
                  ? "bg-white text-gray-900 shadow-lg" 
                  : "text-white/60 hover:text-white"
                }
              `}
            >
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Carte Physique</span>
            </button>
            <button
              onClick={() => setViewMode("digital")}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300
                ${viewMode === "digital" 
                  ? "bg-white text-gray-900 shadow-lg" 
                  : "text-white/60 hover:text-white"
                }
              `}
            >
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium">Vue Digitale</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {viewMode === "physical" ? (
            <motion.div
              key="physical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {/* Color Selector */}
              <div className="flex justify-center gap-4 mb-6">
                {(Object.keys(cardColors) as CardColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCardColor(c)}
                    className={`
                      relative w-10 h-10 rounded-full transition-all duration-300
                      ${cardColor === c 
                        ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-900 scale-110" 
                        : "hover:scale-105"
                      }
                    `}
                    style={{ backgroundColor: cardColors[c].bg }}
                  />
                ))}
              </div>

              {/* Card Flip Button */}
              <button
                onClick={() => setShowBack(!showBack)}
                className="mb-4 text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>{showBack ? "Voir le recto" : "Voir le verso"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Physical Card */}
              <div className="w-full max-w-sm perspective-1000">
                <motion.div
                  animate={{ rotateY: showBack ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative"
                >
                  {/* Front */}
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      aspectRatio: "1.585",
                      backgroundColor: color.bg,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
                      style={{
                        background: color.logoVariant === "white" 
                          ? "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%)"
                          : "linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 100%)",
                      }}
                    />

                    {/* Logo */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <img 
                        src={color.logoVariant === "white" ? iwaspLogoWhite : iwaspLogoDark} 
                        alt="i-wasp" 
                        className="w-[55%] max-w-[180px] object-contain"
                      />
                    </div>

                    {/* Industry badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`px-2 py-1 rounded-lg bg-gradient-to-r ${industry.color} flex items-center gap-1.5`}>
                        <industry.icon className="h-3 w-3 text-white" />
                        <span className="text-[10px] text-white font-medium">{industry.name}</span>
                      </div>
                    </div>

                    {/* NFC indicator */}
                    <div className="absolute bottom-3 right-3">
                      <Wifi className={`h-5 w-5 rotate-45 ${color.text === "white" ? "text-white/40" : "text-black/30"}`} />
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      aspectRatio: "1.585",
                      backgroundColor: color.bg,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* QR Code placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center ${
                        color.text === "white" ? "border-white/20" : "border-black/20"
                      }`}>
                        <div className="grid grid-cols-4 gap-1">
                          {[...Array(16)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-3 rounded-sm ${
                                Math.random() > 0.4 
                                  ? (color.text === "white" ? "bg-white/60" : "bg-black/60")
                                  : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* i-wasp text */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-medium ${
                        color.text === "white" ? "text-white/40" : "text-black/40"
                      }`}>
                        i-wasp
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Card info */}
              <p className="mt-6 text-center text-xs text-white/40">
                Format CR80 · 85.6 × 54 mm · Technologie NFC
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="digital"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              {/* Phone Frame */}
              <div className="relative w-full max-w-[320px]">
                {/* Phone bezel */}
                <div className="rounded-[40px] bg-gray-800 p-2 shadow-2xl border border-gray-700">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-800 rounded-full z-10" />
                  
                  {/* Screen */}
                  <div className="rounded-[32px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950">
                    {/* Status bar */}
                    <div className="h-10 flex items-center justify-between px-6 pt-2">
                      <span className="text-[10px] text-white/50">9:41</span>
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3 text-white/50" />
                        <div className="w-6 h-2.5 rounded-sm bg-white/50" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-8 pt-4">
                      {/* Profile */}
                      <div className="text-center mb-6">
                        <motion.div 
                          className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-3 ring-white/10 shadow-xl"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img 
                            src={industry.profile.photo} 
                            alt={industry.profile.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <h2 className="text-lg font-semibold text-white">{industry.profile.name}</h2>
                        <p className="text-sm text-white/50">{industry.profile.title}</p>
                        <p className="text-xs text-white/30 mt-0.5">{industry.profile.company}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2.5 mb-6">
                        {industry.actions.map((action, idx) => (
                          <motion.button
                            key={idx}
                            className={`w-full py-3.5 px-4 rounded-xl ${action.color} text-white flex items-center justify-between group`}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <action.icon className="h-5 w-5" />
                              <span className="font-medium text-sm">{action.label}</span>
                            </div>
                            <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </motion.button>
                        ))}
                      </div>

                      {/* Contact info */}
                      <div className="space-y-2 mb-6">
                        <button className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left">
                          <Phone className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/70">{industry.profile.phone}</span>
                        </button>
                        <button className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left">
                          <Mail className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/70">{industry.profile.email}</span>
                        </button>
                        <button className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left">
                          <Globe className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/70">{industry.profile.website}</span>
                        </button>
                      </div>

                      {/* WiFi Share */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/10 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Wifi className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium text-white">Partage Wi-Fi</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-white/40">Réseau</p>
                            <p className="text-sm text-white">{wifiConfig.ssid}</p>
                          </div>
                          <button
                            onClick={handleCopyWifi}
                            className={`
                              flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all
                              ${copied 
                                ? "bg-green-600 text-white" 
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                              }
                            `}
                          >
                            {copied ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span className="text-xs">Copié</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span className="text-xs">Copier</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Social links */}
                      <div className="flex justify-center gap-4 mt-6">
                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                          <Linkedin className="h-4 w-4 text-white/50" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                          <Instagram className="h-4 w-4 text-white/50" />
                        </button>
                      </div>

                      {/* Footer */}
                      <p className="text-center text-[9px] text-white/20 mt-6 tracking-widest uppercase">
                        Powered by i-wasp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/order/type">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/25"
            >
              Commander ma carte NFC
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
