import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, MessageCircle, Building2, Home, Stethoscope, Palette, MapPin, Contact, CalendarCheck, Instagram, Linkedin, Image, Hotel, Wifi, UtensilsCrossed, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WiFiQRDisplay } from "@/components/WiFiQRGenerator";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

// Card mockup imports
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";
import cardHotel from "@/assets/cards/card-hotel.png";
import cardTourism from "@/assets/cards/card-tourism.png";
import cardLuxuryEco from "@/assets/cards/card-luxury-eco.png";

// Phone preview imports
import phoneBlack from "@/assets/phones/phone-black.png";
import phoneWhite from "@/assets/phones/phone-white.png";
import phoneNavy from "@/assets/phones/phone-navy.png";
import phoneGold from "@/assets/phones/phone-gold.png";
import phoneHotel from "@/assets/phones/phone-hotel.png";
import phoneTourism from "@/assets/phones/phone-tourism.png";
import phoneLuxury from "@/assets/phones/phone-luxury.png";

const sectors = [
  { id: "all", name: "Tous", icon: null },
  { id: "business", name: "Business & Corporate", icon: Building2, color: "text-amber-400" },
  { id: "immobilier", name: "Immobilier & Luxe", icon: Home, color: "text-emerald-400" },
  { id: "hotellerie", name: "Hôtellerie de Luxe", icon: Hotel, color: "text-rose-400" },
  { id: "rental", name: "Gestion Locative", icon: Home, color: "text-[#d4af37]" },
  { id: "sante", name: "Santé & Médical", icon: Stethoscope, color: "text-blue-400" },
  { id: "creatifs", name: "Créatifs & Freelance", icon: Palette, color: "text-purple-400" },
];


const templates = [
  { 
    id: "signature",
    name: "Executive Pro", 
    sector: "business",
    cardImage: cardBlackMatte, 
    phoneImage: phoneBlack,
    description: "Design minimaliste noir & or. Parfait pour les dirigeants et entrepreneurs.",
    features: ["Lien LinkedIn", "V-Card (Enregistrer contact)", "Design corporate", "NFC haute performance"],
    keyFeature: { icon: Linkedin, label: "LinkedIn + V-Card", color: "bg-blue-500/20 text-blue-400" },
    hasWhatsApp: true
  },
  { 
    id: "executive", 
    name: "Corporate Elite", 
    sector: "business",
    cardImage: cardNavyExecutive, 
    phoneImage: phoneNavy,
    description: "Bleu nuit profond avec accents dorés. Pour les cabinets et consultants.",
    features: ["Lien LinkedIn", "V-Card (Enregistrer contact)", "Finition luxe", "Design executive"],
    keyFeature: { icon: Contact, label: "V-Card intégrée", color: "bg-amber-500/20 text-amber-400" },
    hasWhatsApp: true
  },
  { 
    id: "luxe", 
    name: "Prestige Immo", 
    sector: "immobilier",
    cardImage: cardGoldAccent, 
    phoneImage: phoneGold,
    description: "Or champagne premium. Idéal pour agents immobiliers et promoteurs de luxe.",
    features: ["Localisation Agence", "Galerie Photos", "WhatsApp direct", "Visite virtuelle"],
    keyFeature: { icon: MapPin, label: "Localisation + Galerie", color: "bg-emerald-500/20 text-emerald-400" },
    hasWhatsApp: true
  },
  { 
    id: "hotel", 
    name: "Luxury Living", 
    sector: "immobilier",
    cardImage: cardHotel, 
    phoneImage: phoneHotel,
    description: "Marbre et or. Pour l'immobilier haut de gamme et résidences de prestige.",
    features: ["Localisation Agence", "Galerie Photos", "Visite virtuelle 360°", "Contact rapide"],
    keyFeature: { icon: Image, label: "Galerie immersive", color: "bg-emerald-500/20 text-emerald-400" },
    hasWhatsApp: true
  },
  { 
    id: "minimal", 
    name: "MedPro", 
    sector: "sante", 
    cardImage: cardWhiteMinimal, 
    phoneImage: phoneWhite,
    description: "Design sobre et professionnel. Pour médecins, dentistes et praticiens.",
    features: ["Bouton Prendre RDV", "Horaires intégrés", "Localisation cabinet", "Design épuré"],
    keyFeature: { icon: CalendarCheck, label: "Prendre RDV (Doctolib)", color: "bg-blue-500/20 text-blue-400" },
    hasWhatsApp: false
  },
  { 
    id: "tourism", 
    name: "WellCare", 
    sector: "sante",
    cardImage: cardTourism, 
    phoneImage: phoneTourism,
    description: "Tons apaisants. Parfait pour thérapeutes, coachs bien-être et kinés.",
    features: ["Bouton Prendre RDV", "Booking intégré", "Services détaillés", "Avis clients"],
    keyFeature: { icon: CalendarCheck, label: "Calendly intégré", color: "bg-teal-500/20 text-teal-400" },
    hasWhatsApp: true
  },
  { 
    id: "luxury", 
    name: "Creative Studio", 
    sector: "creatifs",
    cardImage: cardLuxuryEco, 
    phoneImage: phoneLuxury,
    description: "Design audacieux émeraude. Pour artistes, designers et photographes.",
    features: ["Portfolio Instagram", "Galerie visuelle", "Réseaux sociaux", "Showreel vidéo"],
    keyFeature: { icon: Instagram, label: "Portfolio Instagram", color: "bg-purple-500/20 text-purple-400" },
    hasWhatsApp: true
  },
  // HÔTELLERIE DE LUXE
  { 
    id: "palace",
    name: "Palace Prestige", 
    sector: "hotellerie",
    cardImage: cardHotel, 
    phoneImage: phoneHotel,
    description: "Design élégant Palace. Pour hôtels 5 étoiles, riads de luxe et résidences haut de gamme.",
    features: ["WiFi Instantané (QR)", "Réserver une chambre", "Menu Restaurant & Spa", "Conciergerie WhatsApp"],
    keyFeature: { icon: Wifi, label: "Accès WiFi Instantané", color: "bg-rose-500/20 text-rose-400" },
    hasWhatsApp: true,
    isHotel: true,
    hotelActions: [
      { icon: Wifi, label: "Accès WiFi", action: "wifi" },
      { icon: CalendarCheck, label: "Réserver", action: "booking" },
      { icon: UtensilsCrossed, label: "Restaurant & Spa", action: "menu" },
      { icon: MapPin, label: "Localisation", action: "maps" },
      { icon: MessageCircle, label: "Conciergerie", action: "whatsapp" },
    ]
  },
  { 
    id: "riad",
    name: "Riad Marocain", 
    sector: "hotellerie",
    cardImage: cardGoldAccent, 
    phoneImage: phoneGold,
    description: "Inspiration orientale. Parfait pour riads, maisons d'hôtes et boutique-hôtels.",
    features: ["WiFi Instantané (QR)", "Booking intégré", "Galerie photos", "WhatsApp direct"],
    keyFeature: { icon: Sparkles, label: "Expérience Riad", color: "bg-amber-500/20 text-amber-400" },
    hasWhatsApp: true,
    isHotel: true,
    hotelActions: [
      { icon: Wifi, label: "Accès WiFi", action: "wifi" },
      { icon: CalendarCheck, label: "Réserver", action: "booking" },
      { icon: Image, label: "Galerie", action: "gallery" },
      { icon: MapPin, label: "Localisation", action: "maps" },
      { icon: MessageCircle, label: "Contact", action: "whatsapp" },
    ]
  },
  // GESTION LOCATIVE
  { 
    id: "rental-concierge",
    name: "Conciergerie Luxe", 
    sector: "rental",
    cardImage: cardGoldAccent, 
    phoneImage: phoneGold,
    description: "Réception numérique pour Airbnb, Booking et locations saisonnières. WiFi sécurisé après connexion Google.",
    features: ["WiFi Instantané (QR sécurisé)", "Galerie Photos interactive", "Liens Airbnb/Booking", "Géolocalisation Maps", "WhatsApp direct"],
    keyFeature: { icon: Wifi, label: "WiFi Sécurisé (Google Auth)", color: "bg-[#d4af37]/20 text-[#d4af37]" },
    hasWhatsApp: true,
    isRental: true,
    demoUrl: "/rental-demo",
  },
];

const Templates = () => {
  const navigate = useNavigate();
  const { setSelectedTemplate: setCartTemplate } = useCart();
  const [activeSector, setActiveSector] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [wifiCopied, setWifiCopied] = useState<"ssid" | "password" | null>(null);

  // Demo WiFi credentials for hotel templates
  const demoWifi = {
    ssid: "Palace_Guest_5G",
    password: "Welcome2024!"
  };

  const copyToClipboard = async (text: string, type: "ssid" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setWifiCopied(type);
      toast.success(type === "ssid" ? "SSID copié" : "Mot de passe copié");
      setTimeout(() => setWifiCopied(null), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  // Handle template selection and navigation
  const handleSelectTemplate = (template: typeof templates[0]) => {
    // Store template ID in cart context
    setCartTemplate(template.id);
    // Navigate to create page with template ID
    navigate(`/create?template=${template.id}`);
  };

  const filteredTemplates = activeSector === "all" 
    ? templates 
    : templates.filter(t => t.sector === activeSector);

  const getSectorInfo = (sectorId: string) => {
    return sectors.find(s => s.id === sectorId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              Modèles par Secteur
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight mb-6">
              Nos Templates par Métier
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choisissez le modèle adapté à votre secteur d'activité. 100% personnalisable.
            </p>
          </motion.div>

          {/* Sector filters with icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSector === sector.id
                    ? "bg-amber-500 text-background"
                    : "bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3"
                }`}
              >
                {sector.icon && <sector.icon size={16} />}
                {sector.name}
              </button>
            ))}
          </motion.div>

          {/* Templates grid */}
          <motion.div 
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="relative rounded-3xl overflow-hidden bg-surface-1 border border-foreground/5 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
                    {/* Card + Phone composite */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-surface-2 to-background">
                      {/* Card image */}
                      <motion.img
                        src={template.cardImage}
                        alt={template.name}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-[55%] h-auto object-contain z-10"
                        whileHover={{ scale: 1.05, rotate: -3 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Phone preview */}
                      <motion.img
                        src={template.phoneImage}
                        alt={`${template.name} preview`}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-auto object-contain z-20"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-30" />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500 z-25" />
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium tracking-wider uppercase ${getSectorInfo(template.sector)?.color || 'text-amber-400'}`}>
                            {getSectorInfo(template.sector)?.name || template.sector}
                          </span>
                          {template.hasWhatsApp && (
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <MessageCircle size={12} className="text-green-400" />
                            </div>
                          )}
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-amber-400 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {template.description}
                      </p>
                      
                      {/* Key feature badge */}
                      {template.keyFeature && (
                        <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium ${template.keyFeature.color}`}>
                          <template.keyFeature.icon size={14} />
                          {template.keyFeature.label}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Template detail modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl bg-surface-1 rounded-3xl border border-foreground/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Visual side */}
                <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-surface-2 to-background p-8 flex items-center justify-center">
                  <div className="relative w-full max-w-sm">
                    <img
                      src={selectedTemplate.cardImage}
                      alt={selectedTemplate.name}
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                    <img
                      src={selectedTemplate.phoneImage}
                      alt={`${selectedTemplate.name} preview`}
                      className="absolute -right-8 -bottom-8 w-1/2 h-auto"
                    />
                  </div>
                </div>

                {/* Content side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-sm font-medium tracking-wider uppercase ${getSectorInfo(selectedTemplate.sector)?.color || 'text-amber-400'}`}>
                      {getSectorInfo(selectedTemplate.sector)?.name || selectedTemplate.sector}
                    </span>
                    {selectedTemplate.hasWhatsApp && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        <MessageCircle size={12} />
                        WhatsApp
                      </div>
                    )}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {selectedTemplate.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {selectedTemplate.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Check size={12} className="text-amber-400" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hotel-specific actions preview */}
                  {'isHotel' in selectedTemplate && selectedTemplate.isHotel && (
                    <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-sm font-medium text-rose-400 mb-3">Actions hôtelières incluses :</p>
                      <div className="flex flex-wrap gap-2">
                        {'hotelActions' in selectedTemplate && selectedTemplate.hotelActions?.map((action: { icon: LucideIcon; label: string; action: string }) => (
                          <button
                            key={action.action}
                            onClick={() => action.action === "wifi" && setShowWifiModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 text-foreground/80 text-xs font-medium hover:bg-background transition-colors"
                          >
                            <action.icon size={14} />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rental-specific demo link */}
                  {'isRental' in selectedTemplate && selectedTemplate.isRental && (
                    <div className="mb-8 p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20">
                      <p className="text-sm font-medium text-[#d4af37] mb-3">Fonctionnalités Gestion Locative :</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 text-foreground/80 text-xs font-medium">
                          <Wifi size={14} />
                          WiFi sécurisé
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 text-foreground/80 text-xs font-medium">
                          <Image size={14} />
                          Galerie interactive
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 text-foreground/80 text-xs font-medium">
                          <MapPin size={14} />
                          Géolocalisation
                        </span>
                      </div>
                      {'demoUrl' in selectedTemplate && selectedTemplate.demoUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
                          onClick={() => navigate(selectedTemplate.demoUrl as string)}
                        >
                          Voir la démo
                          <ArrowRight size={14} className="ml-2" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-semibold rounded-full shadow-lg shadow-amber-500/25"
                    onClick={() => handleSelectTemplate(selectedTemplate)}
                  >
                    Utiliser ce template
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WiFi Modal for Hotel Templates */}
      <Dialog open={showWifiModal} onOpenChange={setShowWifiModal}>
        <DialogContent className="max-w-sm rounded-3xl border-rose-500/20 bg-gradient-to-b from-surface-1 to-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <Wifi className="text-rose-400" />
              Accès WiFi Instantané
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* QR Code */}
            <div className="flex justify-center">
              <WiFiQRDisplay
                ssid={demoWifi.ssid}
                password={demoWifi.password}
                size={160}
              />
            </div>

            {/* WiFi Credentials */}
            <div className="space-y-3">
              {/* SSID */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Nom du réseau (SSID)</p>
                  <p className="font-medium text-foreground">{demoWifi.ssid}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(demoWifi.ssid, "ssid")}
                  className="h-8 w-8 p-0"
                >
                  {wifiCopied === "ssid" ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  )}
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Mot de passe</p>
                  <p className="font-medium text-foreground font-mono">{demoWifi.password}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(demoWifi.password, "password")}
                  className="h-8 w-8 p-0"
                >
                  {wifiCopied === "password" ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Scannez le QR code ou copiez les identifiants pour vous connecter
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Templates;
