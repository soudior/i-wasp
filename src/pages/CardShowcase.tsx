import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Smartphone, Building2, UtensilsCrossed, Hammer, Heart,
  Calendar, FileText, MessageCircle, MapPin, Star, Phone, Clock,
  Wifi, Copy, Check, ChevronRight, Mail, Globe, Linkedin,
  Instagram, ExternalLink, ArrowLeft, Upload, Palette, X,
  Hotel, DoorOpen, Lightbulb, Thermometer, BedDouble, Utensils,
  Sparkles, Waves, Dumbbell, Coffee, Bell, Key, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Types
type Industry = "immobilier" | "restauration" | "btp" | "sante" | "hotellerie";
type ViewMode = "physical" | "digital";

// Hotel room state
interface RoomState {
  isUnlocked: boolean;
  lightLevel: number;
  temperature: number;
  doNotDisturb: boolean;
}

interface BrandConfig {
  primaryColor: string;
  isDark: boolean;
  logoUrl: string | null;
  name: string;
}

// Color utility functions
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 50 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const getLuminance = (hex: string): number => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0.5;
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Extract dominant color from image
const extractColorFromImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("#c9a962");
        return;
      }
      
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      
      const imageData = ctx.getImageData(0, 0, 50, 50);
      const data = imageData.data;
      
      const colorCounts: Record<string, number> = {};
      
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 32) * 32;
        const g = Math.round(data[i + 1] / 32) * 32;
        const b = Math.round(data[i + 2] / 32) * 32;
        const a = data[i + 3];
        
        // Skip transparent and near-white/near-black pixels
        if (a < 128) continue;
        const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        if (luminance > 0.9 || luminance < 0.1) continue;
        
        const key = `${r},${g},${b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
      
      let maxCount = 0;
      let dominantColor = "201,169,98"; // Default gold
      
      for (const [color, count] of Object.entries(colorCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      }
      
      const [r, g, b] = dominantColor.split(",").map(Number);
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      
      resolve(hex);
    };
    img.onerror = () => resolve("#c9a962");
    img.src = imageUrl;
  });
};

// Generate color palette from brand color
const generatePalette = (brandColor: string) => {
  const hsl = hexToHsl(brandColor);
  const luminance = getLuminance(brandColor);
  const isDark = luminance < 0.5;
  
  return {
    primary: brandColor,
    primaryLight: hslToHex(hsl.h, Math.min(hsl.s, 70), Math.min(hsl.l + 20, 85)),
    primaryDark: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 20, 15)),
    accent: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    isDark,
    textOnPrimary: isDark ? "#ffffff" : "#0a0a0a",
    backgroundCard: isDark ? "#ffffff" : "#0a0a0a",
    textOnCard: isDark ? "#0a0a0a" : "#ffffff",
  };
};

// Industry configurations
const industries = {
  immobilier: {
    id: "immobilier",
    name: "Immobilier",
    icon: Building2,
    defaultColor: "#2563eb",
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
      { icon: Calendar, label: "Prendre RDV Estimation" },
      { icon: FileText, label: "Catalogue des Biens" },
      { icon: MessageCircle, label: "WhatsApp" },
    ],
  },
  restauration: {
    id: "restauration",
    name: "Restauration",
    icon: UtensilsCrossed,
    defaultColor: "#d97706",
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
      { icon: FileText, label: "Menu Digital" },
      { icon: Calendar, label: "Réserver une table" },
      { icon: Star, label: "Laisser un avis Google" },
    ],
  },
  btp: {
    id: "btp",
    name: "BTP / Artisan",
    icon: Hammer,
    defaultColor: "#475569",
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
      { icon: FileText, label: "Demander un devis" },
      { icon: Globe, label: "Portfolio / Réalisations" },
      { icon: Phone, label: "Appel Urgence" },
    ],
  },
  sante: {
    id: "sante",
    name: "Santé",
    icon: Heart,
    defaultColor: "#059669",
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
      { icon: Calendar, label: "Doctolib" },
      { icon: Clock, label: "Horaires d'ouverture" },
      { icon: MapPin, label: "Localisation GPS" },
    ],
  },
  hotellerie: {
    id: "hotellerie",
    name: "Hôtellerie",
    icon: Hotel,
    defaultColor: "#7c3aed",
    profile: {
      name: "Suite Royale 401",
      title: "Concierge Digital",
      company: "Le Palace Marrakech",
      photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop",
      phone: "+212 5 24 00 00 00",
      email: "concierge@lepalace.ma",
      website: "lepalace.ma",
    },
    actions: [
      { icon: DoorOpen, label: "Ouvrir ma chambre", isRoomControl: true },
      { icon: Utensils, label: "Menu Restaurant" },
      { icon: Sparkles, label: "Réserver Spa" },
    ],
    roomFeatures: {
      roomNumber: "401",
      guestName: "M. & Mme Laurent",
      checkIn: "30 Dec 2024",
      checkOut: "03 Jan 2025",
    },
    hotelServices: [
      { icon: Utensils, label: "Restaurant", desc: "Le Jardin d'Orient", hours: "12h-15h / 19h-23h" },
      { icon: Coffee, label: "Room Service", desc: "24h/24", hours: "Disponible" },
      { icon: Waves, label: "Piscine", desc: "Rooftop", hours: "7h-21h" },
      { icon: Sparkles, label: "Spa & Hammam", desc: "Réservation conseillée", hours: "9h-21h" },
      { icon: Dumbbell, label: "Fitness", desc: "Accès libre", hours: "6h-22h" },
      { icon: Bell, label: "Conciergerie", desc: "Services VIP", hours: "24h/24" },
    ],
  },
};

// WiFi config
const wifiConfig = {
  ssid: "IWASP-Guest",
  password: "Welcome2024!",
};

export default function CardShowcase() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>("immobilier");
  const [viewMode, setViewMode] = useState<ViewMode>("physical");
  const [copied, setCopied] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hotel room state
  const [roomState, setRoomState] = useState<RoomState>({
    isUnlocked: false,
    lightLevel: 70,
    temperature: 22,
    doNotDisturb: false,
  });
  const [showRoomControl, setShowRoomControl] = useState(false);
  
  // Brand configuration
  const [brand, setBrand] = useState<BrandConfig>({
    primaryColor: industries.immobilier.defaultColor,
    isDark: false,
    logoUrl: null,
    name: "Votre Entreprise",
  });
  
  const palette = generatePalette(brand.primaryColor);
  const industry = industries[selectedIndustry];

  // Handle logo upload
  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const extractedColor = await extractColorFromImage(dataUrl);
      const luminance = getLuminance(extractedColor);
      
      setBrand({
        ...brand,
        logoUrl: dataUrl,
        primaryColor: extractedColor,
        isDark: luminance < 0.5,
      });
      
      toast.success("Logo importé ! Couleurs ajustées automatiquement.");
    };
    reader.readAsDataURL(file);
  }, [brand]);

  // Handle color change
  const handleColorChange = (color: string) => {
    const luminance = getLuminance(color);
    setBrand({
      ...brand,
      primaryColor: color,
      isDark: luminance < 0.5,
    });
  };

  // Handle industry change
  useEffect(() => {
    if (!brand.logoUrl) {
      const newColor = industries[selectedIndustry].defaultColor;
      const luminance = getLuminance(newColor);
      setBrand(prev => ({
        ...prev,
        primaryColor: newColor,
        isDark: luminance < 0.5,
        name: industries[selectedIndustry].profile.company,
      }));
    }
  }, [selectedIndustry, brand.logoUrl]);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiConfig.password);
    setCopied(true);
    toast.success("Mot de passe copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const removeLogo = () => {
    setBrand({
      ...brand,
      logoUrl: null,
      primaryColor: industries[selectedIndustry].defaultColor,
    });
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${palette.primaryDark}15 0%, ${palette.primary}08 50%, ${palette.primaryLight}10 100%)`,
      }}
    >
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between border-b border-black/5 backdrop-blur-sm bg-white/50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Retour</span>
        </Link>
        <div className="flex items-center gap-2" style={{ color: palette.primary }}>
          <CreditCard className="h-4 w-4" />
          <span className="text-sm font-semibold">Card Branding Studio</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Brand Configuration Panel */}
        <motion.div 
          className="mb-8 p-5 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5" style={{ color: palette.primary }} />
            <h2 className="font-semibold text-gray-800">Configuration de votre marque</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo Upload */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Logo</label>
              <div className="relative">
                {brand.logoUrl ? (
                  <div className="relative w-full h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden"
                       style={{ borderColor: palette.primary + "40", backgroundColor: palette.primary + "10" }}>
                    <img src={brand.logoUrl} alt="Logo" className="max-h-16 max-w-full object-contain" />
                    <button 
                      onClick={removeLogo}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all hover:bg-gray-50"
                    style={{ borderColor: palette.primary + "40" }}
                  >
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500">Importer logo</span>
                  </button>
                )}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
            
            {/* Brand Name */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Nom</label>
              <Input
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                className="h-12 border-gray-200 focus:border-current"
                style={{ "--tw-ring-color": palette.primary } as React.CSSProperties}
              />
            </div>
            
            {/* Color Picker */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Couleur principale</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 overflow-hidden"
                  style={{ backgroundColor: brand.primaryColor }}
                />
                <div className="flex-1">
                  <Input
                    value={brand.primaryColor.toUpperCase()}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="h-12 font-mono text-sm uppercase"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Color Preview */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-gray-500">Palette générée :</span>
            <div className="flex gap-1">
              {[palette.primaryDark, palette.primary, palette.primaryLight, palette.accent].map((color, idx) => (
                <div 
                  key={idx}
                  className="w-6 h-6 rounded-full shadow-sm ring-1 ring-black/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-2">
              Mode {palette.isDark ? "sombre" : "clair"} détecté
            </span>
          </div>
        </motion.div>

        {/* Industry Selector */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">Secteur d'activité</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.values(industries).map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id as Industry)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300
                    ${isSelected 
                      ? "text-white shadow-lg scale-105" 
                      : "bg-white/60 text-gray-600 hover:bg-white hover:shadow"
                    }
                  `}
                  style={isSelected ? { backgroundColor: palette.primary } : undefined}
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
          <div className="bg-white/60 backdrop-blur-sm p-1 rounded-xl flex gap-1 shadow-sm">
            <button
              onClick={() => setViewMode("physical")}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300
                ${viewMode === "physical" 
                  ? "text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
              style={viewMode === "physical" ? { backgroundColor: palette.primary } : undefined}
            >
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Carte Physique</span>
            </button>
            <button
              onClick={() => setViewMode("digital")}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300
                ${viewMode === "digital" 
                  ? "text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
              style={viewMode === "digital" ? { backgroundColor: palette.primary } : undefined}
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
              {/* Card Flip Button */}
              <button
                onClick={() => setShowBack(!showBack)}
                className="mb-4 text-sm transition-colors flex items-center gap-1"
                style={{ color: palette.primary }}
              >
                <span>{showBack ? "Voir le recto" : "Voir le verso"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Ultra Minimalist Physical Card */}
              <div className="w-full max-w-sm" style={{ perspective: 1000 }}>
                <motion.div
                  animate={{ rotateY: showBack ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative"
                >
                  {/* Front - Ultra Minimalist */}
                  <div
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      aspectRatio: "1.585",
                      backgroundColor: palette.backgroundCard,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Subtle gradient overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, ${palette.primary}15 0%, transparent 50%, ${palette.primary}08 100%)`,
                      }}
                    />
                    
                    {/* Premium shine effect */}
                    <div 
                      className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
                      style={{
                        background: palette.isDark 
                          ? "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)"
                          : "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 100%)",
                      }}
                    />

                    {/* Content - Only Logo & Name */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      {/* Logo */}
                      {brand.logoUrl ? (
                        <img 
                          src={brand.logoUrl} 
                          alt="Logo" 
                          className="w-[45%] max-w-[160px] h-auto object-contain mb-4"
                          style={{
                            filter: palette.isDark ? "none" : "drop-shadow(0 2px 8px rgba(0,0,0,0.15))",
                          }}
                        />
                      ) : (
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                          style={{ backgroundColor: palette.primary }}
                        >
                          <industry.icon className="h-10 w-10" style={{ color: palette.textOnPrimary }} />
                        </div>
                      )}
                      
                      {/* Brand Name - Only text element */}
                      <h1 
                        className="text-xl font-semibold tracking-wide text-center"
                        style={{ color: palette.textOnCard }}
                      >
                        {brand.name}
                      </h1>
                    </div>

                    {/* NFC indicator - very subtle */}
                    <div className="absolute bottom-4 right-4 opacity-30">
                      <Wifi 
                        className="h-5 w-5 rotate-45" 
                        style={{ color: palette.textOnCard }} 
                      />
                    </div>
                    
                    {/* Edge highlight */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${palette.isDark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)"}`,
                      }}
                    />
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      aspectRatio: "1.585",
                      backgroundColor: palette.backgroundCard,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* QR Code placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="w-28 h-28 rounded-xl border-2 flex items-center justify-center"
                        style={{ 
                          borderColor: palette.textOnCard + "30",
                          backgroundColor: palette.textOnCard + "05",
                        }}
                      >
                        <div className="grid grid-cols-5 gap-1">
                          {[...Array(25)].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-3 h-3 rounded-sm"
                              style={{
                                backgroundColor: Math.random() > 0.35 
                                  ? palette.textOnCard + "80"
                                  : "transparent"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Subtle brand indicator */}
                    <div className="absolute bottom-3 right-3">
                      <span 
                        className="text-[10px] font-medium opacity-40"
                        style={{ color: palette.textOnCard }}
                      >
                        {brand.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Card info */}
              <p className="mt-6 text-center text-xs text-gray-500">
                Format CR80 · 85.6 × 54 mm · Technologie NFC
              </p>
              <p className="text-center text-[11px] text-gray-400 mt-1">
                Design ultra-minimaliste : seul le logo et le nom sont visibles
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
                <div 
                  className="rounded-[40px] p-2 shadow-2xl"
                  style={{ 
                    backgroundColor: palette.isDark ? "#1a1a1a" : "#f5f5f5",
                    border: `1px solid ${palette.isDark ? "#333" : "#e5e5e5"}`,
                  }}
                >
                  {/* Notch */}
                  <div 
                    className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full z-10"
                    style={{ backgroundColor: palette.isDark ? "#1a1a1a" : "#f5f5f5" }}
                  />
                  
                  {/* Screen */}
                  <div 
                    className="rounded-[32px] overflow-hidden"
                    style={{
                      background: palette.isDark 
                        ? `linear-gradient(180deg, ${palette.primaryDark} 0%, #0a0a0a 100%)`
                        : `linear-gradient(180deg, #ffffff 0%, ${palette.primaryLight}20 100%)`,
                    }}
                  >
                    {/* Status bar */}
                    <div className="h-10 flex items-center justify-between px-6 pt-2">
                      <span 
                        className="text-[10px] opacity-50"
                        style={{ color: palette.isDark ? "#fff" : "#000" }}
                      >
                        9:41
                      </span>
                      <div className="flex items-center gap-1">
                        <Wifi 
                          className="h-3 w-3 opacity-50" 
                          style={{ color: palette.isDark ? "#fff" : "#000" }}
                        />
                        <div 
                          className="w-6 h-2.5 rounded-sm opacity-50"
                          style={{ backgroundColor: palette.isDark ? "#fff" : "#000" }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-8 pt-4">
                      {/* Profile */}
                      <div className="text-center mb-6">
                        <motion.div 
                          className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-xl ring-2"
                          style={{ 
                            boxShadow: `0 10px 30px ${palette.primary}30`,
                            ringColor: palette.primary + "30",
                          } as React.CSSProperties}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img 
                            src={industry.profile.photo} 
                            alt={industry.profile.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <h2 
                          className="text-lg font-semibold"
                          style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                        >
                          {industry.profile.name}
                        </h2>
                        <p 
                          className="text-sm opacity-60"
                          style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                        >
                          {industry.profile.title}
                        </p>
                        <p 
                          className="text-xs opacity-40 mt-0.5"
                          style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                        >
                          {brand.name}
                        </p>
                      </div>

                      {/* Hotel-specific: Room Info Card */}
                      {selectedIndustry === "hotellerie" && industries.hotellerie.roomFeatures && (
                        <div 
                          className="rounded-xl p-4 mb-4"
                          style={{ 
                            backgroundColor: palette.primary + "15",
                            border: `1px solid ${palette.primary}30`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4" style={{ color: palette.primary }} />
                              <span className="text-sm font-semibold" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>
                                Chambre {industries.hotellerie.roomFeatures.roomNumber}
                              </span>
                            </div>
                            <span 
                              className={`text-[10px] px-2 py-0.5 rounded-full ${roomState.isUnlocked ? "bg-green-500" : "bg-gray-500"} text-white`}
                            >
                              {roomState.isUnlocked ? "Déverrouillée" : "Verrouillée"}
                            </span>
                          </div>
                          <p className="text-xs opacity-60 mb-1" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>
                            {industries.hotellerie.roomFeatures.guestName}
                          </p>
                          <p className="text-[10px] opacity-40" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>
                            {industries.hotellerie.roomFeatures.checkIn} → {industries.hotellerie.roomFeatures.checkOut}
                          </p>
                        </div>
                      )}

                      {/* Action buttons - Branded */}
                      <div className="space-y-2.5 mb-6">
                        {industry.actions.map((action, idx) => {
                          const isRoomControl = 'isRoomControl' in action && action.isRoomControl;
                          
                          if (isRoomControl && selectedIndustry === "hotellerie") {
                            return (
                              <motion.button
                                key={idx}
                                onClick={() => {
                                  setRoomState({ ...roomState, isUnlocked: !roomState.isUnlocked });
                                  toast.success(roomState.isUnlocked ? "Chambre verrouillée" : "Chambre déverrouillée !");
                                }}
                                className="w-full py-3.5 px-4 rounded-xl text-white flex items-center justify-between group shadow-lg"
                                style={{ 
                                  backgroundColor: roomState.isUnlocked ? "#22c55e" : palette.primary,
                                  boxShadow: `0 4px 15px ${roomState.isUnlocked ? "#22c55e40" : palette.primary + "40"}`,
                                }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center gap-3">
                                  <DoorOpen className="h-5 w-5 text-white" />
                                  <span className="font-medium text-sm text-white">
                                    {roomState.isUnlocked ? "Verrouiller" : "Ouvrir ma chambre"}
                                  </span>
                                </div>
                                <Key className="h-4 w-4 text-white opacity-70" />
                              </motion.button>
                            );
                          }
                          
                          return (
                            <motion.button
                              key={idx}
                              className="w-full py-3.5 px-4 rounded-xl text-white flex items-center justify-between group shadow-lg"
                              style={{ 
                                backgroundColor: palette.primary,
                                boxShadow: `0 4px 15px ${palette.primary}40`,
                              }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-3">
                                <action.icon className="h-5 w-5" style={{ color: palette.textOnPrimary }} />
                                <span 
                                  className="font-medium text-sm"
                                  style={{ color: palette.textOnPrimary }}
                                >
                                  {action.label}
                                </span>
                              </div>
                              <ExternalLink 
                                className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" 
                                style={{ color: palette.textOnPrimary }}
                              />
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Hotel-specific: Room Controls */}
                      {selectedIndustry === "hotellerie" && (
                        <div className="mb-6">
                          <button
                            onClick={() => setShowRoomControl(!showRoomControl)}
                            className="w-full py-3 px-4 rounded-xl flex items-center justify-between"
                            style={{ 
                              backgroundColor: palette.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Settings className="h-4 w-4" style={{ color: palette.primary }} />
                              <span className="text-sm font-medium" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>
                                Contrôles de la chambre
                              </span>
                            </div>
                            <ChevronRight 
                              className={`h-4 w-4 transition-transform ${showRoomControl ? "rotate-90" : ""}`}
                              style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                            />
                          </button>
                          
                          <AnimatePresence>
                            {showRoomControl && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 space-y-3">
                                  {/* Lighting */}
                                  <div 
                                    className="p-3 rounded-xl"
                                    style={{ backgroundColor: palette.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4" style={{ color: palette.primary }} />
                                        <span className="text-sm" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>Éclairage</span>
                                      </div>
                                      <span className="text-xs font-medium" style={{ color: palette.primary }}>{roomState.lightLevel}%</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={roomState.lightLevel}
                                      onChange={(e) => setRoomState({ ...roomState, lightLevel: parseInt(e.target.value) })}
                                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                      style={{ 
                                        background: `linear-gradient(to right, ${palette.primary} 0%, ${palette.primary} ${roomState.lightLevel}%, ${palette.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} ${roomState.lightLevel}%, ${palette.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 100%)` 
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Temperature */}
                                  <div 
                                    className="p-3 rounded-xl"
                                    style={{ backgroundColor: palette.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Thermometer className="h-4 w-4" style={{ color: palette.primary }} />
                                        <span className="text-sm" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>Température</span>
                                      </div>
                                      <span className="text-xs font-medium" style={{ color: palette.primary }}>{roomState.temperature}°C</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setRoomState({ ...roomState, temperature: Math.max(16, roomState.temperature - 1) })}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
                                        style={{ 
                                          backgroundColor: palette.primary + "20",
                                          color: palette.primary,
                                        }}
                                      >
                                        −
                                      </button>
                                      <div className="flex-1 text-center">
                                        <span className="text-2xl font-bold" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>
                                          {roomState.temperature}°
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => setRoomState({ ...roomState, temperature: Math.min(28, roomState.temperature + 1) })}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
                                        style={{ 
                                          backgroundColor: palette.primary + "20",
                                          color: palette.primary,
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Do Not Disturb */}
                                  <button
                                    onClick={() => {
                                      setRoomState({ ...roomState, doNotDisturb: !roomState.doNotDisturb });
                                      toast.success(roomState.doNotDisturb ? "Mode 'Ne pas déranger' désactivé" : "Mode 'Ne pas déranger' activé");
                                    }}
                                    className="w-full p-3 rounded-xl flex items-center justify-between"
                                    style={{ 
                                      backgroundColor: roomState.doNotDisturb ? "#ef444420" : (palette.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                                      border: roomState.doNotDisturb ? "1px solid #ef4444" : "none",
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <BedDouble className="h-4 w-4" style={{ color: roomState.doNotDisturb ? "#ef4444" : palette.primary }} />
                                      <span className="text-sm" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>Ne pas déranger</span>
                                    </div>
                                    <div 
                                      className={`w-10 h-5 rounded-full transition-colors ${roomState.doNotDisturb ? "bg-red-500" : "bg-gray-300"}`}
                                    >
                                      <div 
                                        className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-0.5 ${roomState.doNotDisturb ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`}
                                      />
                                    </div>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Hotel-specific: Services Grid */}
                      {selectedIndustry === "hotellerie" && industries.hotellerie.hotelServices && (
                        <div className="mb-6">
                          <p className="text-xs font-medium uppercase tracking-wider mb-3 opacity-50" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>
                            Services de l'hôtel
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {industries.hotellerie.hotelServices.map((service, idx) => (
                              <button
                                key={idx}
                                className="p-3 rounded-xl text-left transition-all hover:scale-[1.02]"
                                style={{ 
                                  backgroundColor: palette.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                                }}
                              >
                                <service.icon className="h-5 w-5 mb-2" style={{ color: palette.primary }} />
                                <p className="text-sm font-medium" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>{service.label}</p>
                                <p className="text-[10px] opacity-50" style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}>{service.desc}</p>
                                <p className="text-[10px] mt-1" style={{ color: palette.primary }}>{service.hours}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact info */}
                      <div className="space-y-2 mb-6">
                        {[
                          { icon: Phone, value: industry.profile.phone },
                          { icon: Mail, value: industry.profile.email },
                          { icon: Globe, value: industry.profile.website },
                        ].map((item, idx) => (
                          <button 
                            key={idx}
                            className="w-full py-3 px-4 rounded-xl transition-colors flex items-center gap-3 text-left"
                            style={{ 
                              backgroundColor: palette.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                            }}
                          >
                            <item.icon 
                              className="h-4 w-4 opacity-50" 
                              style={{ color: palette.primary }}
                            />
                            <span 
                              className="text-sm opacity-70"
                              style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                            >
                              {item.value}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* WiFi Share - Branded */}
                      <div 
                        className="rounded-xl p-4"
                        style={{ 
                          backgroundColor: palette.primary + "15",
                          border: `1px solid ${palette.primary}30`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Wifi className="h-4 w-4" style={{ color: palette.primary }} />
                          <span 
                            className="text-sm font-medium"
                            style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                          >
                            Partage Wi-Fi
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p 
                              className="text-xs opacity-50"
                              style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                            >
                              Réseau
                            </p>
                            <p 
                              className="text-sm"
                              style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                            >
                              {wifiConfig.ssid}
                            </p>
                          </div>
                          <button
                            onClick={handleCopyWifi}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                            style={{ 
                              backgroundColor: copied ? "#22c55e" : palette.primary,
                              color: palette.textOnPrimary,
                            }}
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
                        {[Linkedin, Instagram].map((Icon, idx) => (
                          <button 
                            key={idx}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            style={{ 
                              backgroundColor: palette.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                            }}
                          >
                            <Icon 
                              className="h-4 w-4 opacity-50" 
                              style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <p 
                        className="text-center text-[9px] mt-6 tracking-widest uppercase opacity-30"
                        style={{ color: palette.isDark ? "#fff" : "#1a1a1a" }}
                      >
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
              className="font-semibold shadow-lg text-white"
              style={{ 
                backgroundColor: palette.primary,
                boxShadow: `0 10px 30px ${palette.primary}40`,
              }}
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
