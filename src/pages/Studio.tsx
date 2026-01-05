/**
 * i-WASP STUDIO — Centre de Contrôle Ultra-Luxe
 * Dashboard premium avec preview en temps réel
 * Inclut La Manufacture, Résonance & Ads, et Stories
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Users, 
  Bell, 
  Leaf, 
  Save, 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Crown,
  Zap,
  TrendingUp,
  Target,
  RefreshCw,
  Check,
  ExternalLink,
  TreePine,
  Sparkles,
  Gem,
  Lock,
  Unlock,
  Eye,
  MapPin,
  ShoppingBag,
  Plus,
  Shield,
  Fingerprint,
  Image,
  Play,
  Settings,
  Smartphone,
  Radio,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

interface NFCCard {
  id: string;
  serialNumber: string;
  material: "or-24k" | "carbone" | "titane" | "bois-precieux" | "nail-bio";
  materialLabel: string;
  productType: "card" | "nail" | "bracelet";
  status: "operational" | "locked" | "pending";
  scans: number;
  lastScan?: string;
  location?: string;
  geoEnabled: boolean;
  pushEnabled: boolean;
}

interface Story {
  id: string;
  type: "image" | "video";
  thumbnail: string;
  title?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockFleet: NFCCard[] = [
  {
    id: "1",
    serialNumber: "WASP-772-GLD",
    material: "or-24k",
    materialLabel: "Carte Or 24K",
    productType: "card",
    status: "operational",
    scans: 847,
    lastScan: "Il y a 2h",
    location: "Paris, France",
    geoEnabled: true,
    pushEnabled: true
  },
  {
    id: "2",
    serialNumber: "WASP-NAIL-001",
    material: "nail-bio",
    materialLabel: "NFC Nail Pro (Set)",
    productType: "nail",
    status: "operational",
    scans: 312,
    lastScan: "Il y a 3j",
    location: "Dubaï, EAU",
    geoEnabled: false,
    pushEnabled: true
  },
  {
    id: "3",
    serialNumber: "WASP-104-CRB",
    material: "carbone",
    materialLabel: "Carbone Mat",
    productType: "card",
    status: "locked",
    scans: 156,
    lastScan: "Il y a 1 semaine",
    geoEnabled: false,
    pushEnabled: false
  }
];

// Mock stories data
const mockStories: Story[] = [
  { id: "1", type: "video", thumbnail: "", title: "Monaco Event" },
  { id: "2", type: "image", thumbnail: "", title: "Portrait Pro" },
  { id: "3", type: "image", thumbnail: "", title: "Bureau" },
  { id: "4", type: "video", thumbnail: "", title: "Conférence" },
];

// Tabs configuration
const tabs = [
  { id: "identity", label: "Mon Identité", icon: User },
  { id: "manufacture", label: "La Manufacture", icon: Gem },
  { id: "leads", label: "Mes Leads", icon: Users },
  { id: "resonance", label: "Résonance & Ads", icon: Zap },
  { id: "world", label: "Centre Intelligence", icon: Globe },
  { id: "eco", label: "Écologie", icon: Leaf },
];

// Mock leads data
const mockLeads = [
  { name: "Sophia Laurent", company: "LVMH", role: "Directrice Acquisition", score: 98, date: "Il y a 2h" },
  { name: "Alexandre Moreau", company: "Ferrari", role: "Brand Manager", score: 94, date: "Il y a 5h" },
  { name: "Isabella Chen", company: "Cartier", role: "VP Marketing", score: 91, date: "Hier" },
  { name: "Marcus Van Der Berg", company: "Porsche", role: "CEO Europe", score: 89, date: "Hier" },
];

// World map hotspots data
const worldHotspots = [
  { id: 1, city: "Paris", country: "France", lat: 48.85, lng: 2.35, scans: 312, active: true },
  { id: 2, city: "Dubaï", country: "EAU", lat: 25.20, lng: 55.27, scans: 187, active: true },
  { id: 3, city: "New York", country: "USA", lat: 40.71, lng: -74.00, scans: 156, active: false },
  { id: 4, city: "Genève", country: "Suisse", lat: 46.20, lng: 6.14, scans: 98, active: true },
  { id: 5, city: "Monaco", country: "Monaco", lat: 43.73, lng: 7.42, scans: 76, active: false },
  { id: 6, city: "Singapour", country: "Singapour", lat: 1.35, lng: 103.82, scans: 64, active: true },
];

// Activity feed data
const activityFeed = [
  { city: "Genève", country: "Suisse", time: "Il y a 3 min", type: "scan", flag: "🇨🇭" },
  { city: "New York", country: "USA", time: "Il y a 12 min", type: "vcard", flag: "🇺🇸" },
  { city: "Dubaï", country: "EAU", time: "Il y a 28 min", type: "scan", flag: "🇦🇪" },
  { city: "Paris", country: "France", time: "Il y a 45 min", type: "lead", flag: "🇫🇷" },
  { city: "Monaco", country: "Monaco", time: "Il y a 1h", type: "scan", flag: "🇲🇨" },
];

const Studio = () => {
  const [activeTab, setActiveTab] = useState("identity");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [fleet, setFleet] = useState<NFCCard[]>(mockFleet);
  const [stories, setStories] = useState<Story[]>(mockStories);
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: "Julian de Wasp",
    title: "Directeur de l'Influence",
    bio: "Bâtisseur d'empires digitaux. Leader visionnaire au service de l'excellence.",
    email: "julian@i-wasp.com",
    phone: "+33 6 00 00 00 00",
    company: "i-WASP",
    website: "https://i-wasp.com",
    instagram: "@juliandewasp",
    linkedin: "juliandewasp",
  });
  
  // Resonance settings (Push, Email, Ads)
  const [resonance, setResonance] = useState({
    pushRappel: true,
    emailConciergerie: true,
    geoMessage: false,
    instagramRetargeting: true,
    linkedinRetargeting: false,
  });

  // Toggle card lock (Kill-Switch)
  const toggleCardLock = (cardId: string) => {
    setFleet(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === "locked" ? "operational" : "locked" as const }
        : card
    ));
  };

  // Toggle geo/push for a card
  const toggleCardSetting = (cardId: string, setting: "geoEnabled" | "pushEnabled") => {
    setFleet(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, [setting]: !card[setting] }
        : card
    ));
  };

  // Status badge renderer
  const getStatusBadge = (status: NFCCard["status"]) => {
    switch (status) {
      case "operational":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-iwasp-emerald/20 text-iwasp-emerald-glow border border-iwasp-emerald/30">
            OPÉRATIONNEL
          </span>
        );
      case "locked":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            VERROUILLÉ
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-iwasp-bronze/20 text-iwasp-bronze border border-iwasp-bronze/30">
            EN FORGE
          </span>
        );
    }
  };

  // Material/Product gradient renderer
  const getMaterialGradient = (material: NFCCard["material"], productType: NFCCard["productType"]) => {
    if (productType === "nail") {
      return "bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600";
    }
    switch (material) {
      case "or-24k":
        return "bg-gradient-to-br from-iwasp-bronze via-yellow-600 to-iwasp-bronze";
      case "carbone":
        return "bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900";
      case "titane":
        return "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600";
      case "bois-precieux":
        return "bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950";
      default:
        return "bg-gradient-to-br from-zinc-600 to-zinc-800";
    }
  };

  // Get product icon
  const getProductIcon = (productType: NFCCard["productType"]) => {
    switch (productType) {
      case "nail":
        return <Fingerprint className="w-4 h-4" />;
      case "bracelet":
        return <Radio className="w-4 h-4" />;
      default:
        return <Gem className="w-4 h-4" />;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setLastSaved(new Date());
  };

  return (
    <div className="min-h-screen bg-iwasp-midnight">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-iwasp-midnight/90 backdrop-blur-xl border-b border-iwasp-emerald/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl hover:bg-iwasp-emerald/10 transition-colors">
                <ArrowLeft className="w-5 h-5 text-iwasp-silver" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-iwasp-bronze flex items-center justify-center">
                  <span className="font-display text-lg text-iwasp-bronze italic">W</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-iwasp-cream tracking-[0.15em] uppercase">i-WASP</h1>
                  <p className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">Studio</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {lastSaved && (
                <span className="text-xs text-iwasp-silver flex items-center gap-2">
                  <Check className="w-3 h-3 text-iwasp-emerald-glow" />
                  Synchronisé
                </span>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight font-medium gap-2 rounded-xl"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synchronisation...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          {/* Main content */}
          <div>
            {/* Hero section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-start gap-6"
            >
              {/* Bronze accent bar */}
              <div className="w-4 h-32 rounded-full bg-gradient-to-b from-iwasp-bronze to-iwasp-bronze/30 hidden sm:block" />
              
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal text-iwasp-cream mb-2">
                  <span className="italic">Améliorez</span>
                  <br />
                  votre
                  <br />
                  <span className="text-iwasp-bronze">Influence.</span>
                </h2>
                <p className="text-iwasp-silver mt-4 max-w-md">
                  Gérez chaque aspect de votre présence i-Wasp en temps réel.
                </p>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-2 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-iwasp-bronze text-iwasp-midnight"
                      : "bg-iwasp-midnight-elevated border border-iwasp-emerald/10 text-iwasp-silver hover:border-iwasp-bronze/30 hover:text-iwasp-cream"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {/* LA MANUFACTURE TAB */}
              {activeTab === "manufacture" && (
                <motion.div
                  key="manufacture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Fleet Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl text-iwasp-cream">
                        <span className="italic text-iwasp-bronze">La</span> <span className="text-iwasp-bronze">Manufacture.</span>
                      </h3>
                      <p className="text-sm text-iwasp-silver mt-2">Objets de pouvoir physiques : des cartes à la puce d'ongle invisible.</p>
                    </div>
                    <Link to="/order/type">
                      <Button className="bg-transparent border-2 border-iwasp-bronze/40 text-iwasp-cream hover:bg-iwasp-bronze/10 gap-2 rounded-xl">
                        <Plus className="w-4 h-4" />
                        Nouvelle Commande
                      </Button>
                    </Link>
                  </div>

                  {/* Main Grid: Collection + Nail Panel */}
                  <div className="grid lg:grid-cols-[1fr,340px] gap-6">
                    {/* Left: Collection */}
                    <div className="space-y-6">
                      <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">
                        Votre Collection i-WASP
                      </h4>

                      {/* Cards Grid */}
                      <div className="space-y-4">
                        {fleet.map((card, index) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 hover:border-iwasp-bronze/20 transition-all"
                          >
                            <div className="flex items-start gap-4">
                              {/* Card/Nail Visual */}
                              <div className={cn(
                                "w-20 h-12 rounded-lg flex items-center justify-center text-xs font-semibold shadow-lg flex-shrink-0 relative overflow-hidden",
                                getMaterialGradient(card.material, card.productType),
                                card.status === "locked" && "opacity-50 grayscale"
                              )}>
                                {card.productType === "nail" ? (
                                  <div className="flex flex-col items-center">
                                    <Fingerprint className="w-5 h-5 text-white/90" />
                                    <span className="text-[8px] text-white/70 mt-0.5">NFC</span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="absolute top-1 left-1.5 text-[6px] text-white/50 uppercase tracking-wider">PRESTIGE</span>
                                    <span className="text-white/90 tracking-wider text-[10px] font-bold">i-WASP</span>
                                  </>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h4 className="font-semibold text-iwasp-cream">{card.materialLabel}</h4>
                                  {getStatusBadge(card.status)}
                                </div>
                                <p className="text-iwasp-silver/60 text-sm mt-1">{card.serialNumber}</p>
                                
                                {card.status !== "pending" && (
                                  <div className="flex items-center gap-4 mt-3 text-xs text-iwasp-silver/50">
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {card.scans} scans
                                    </span>
                                    {card.lastScan && (
                                      <span>{card.lastScan}</span>
                                    )}
                                    {card.location && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {card.location}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {card.status === "pending" && (
                                  <div className="mt-3 flex items-center gap-2 text-iwasp-bronze text-xs">
                                    <Sparkles className="w-3 h-3 animate-pulse" />
                                    <span>Votre pièce est en cours de forge...</span>
                                  </div>
                                )}
                              </div>

                              {/* Controls */}
                              {card.status !== "pending" && (
                                <div className="flex flex-col items-end gap-3">
                                  {/* Kill Switch */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleCardLock(card.id)}
                                    className={cn(
                                      "gap-2 text-xs",
                                      card.status === "locked" 
                                        ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                                        : "text-iwasp-emerald-glow hover:text-iwasp-emerald hover:bg-iwasp-emerald/10"
                                    )}
                                  >
                                    {card.status === "locked" ? (
                                      <>
                                        <Lock className="w-3 h-3" />
                                        Déverrouiller
                                      </>
                                    ) : (
                                      <>
                                        <Unlock className="w-3 h-3" />
                                        Kill-Switch
                                      </>
                                    )}
                                  </Button>

                                  {/* Settings toggles */}
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <Globe className="w-3 h-3 text-iwasp-silver/40" />
                                      <Switch
                                        checked={card.geoEnabled}
                                        onCheckedChange={() => toggleCardSetting(card.id, "geoEnabled")}
                                        className="scale-75 data-[state=checked]:bg-iwasp-bronze"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Bell className="w-3 h-3 text-iwasp-silver/40" />
                                      <Switch
                                        checked={card.pushEnabled}
                                        onCheckedChange={() => toggleCardSetting(card.id, "pushEnabled")}
                                        className="scale-75 data-[state=checked]:bg-iwasp-bronze"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Right: NFC Nail Panel */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-iwasp-midnight-elevated to-rose-500/5 border border-rose-500/20 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-display text-xl text-iwasp-cream">
                          L'Ongle <span className="italic text-rose-400">NFC</span>
                          <br />
                          <span className="text-sm text-iwasp-silver font-sans">Bio-S</span>
                        </h4>
                      </div>

                      <p className="text-sm text-iwasp-silver mb-6 leading-relaxed">
                        Le luxe au bout des doigts. Intégrez une micro-puce NFC i-Wasp lors de votre manucure. Une technologie invisible et résistante pour partager votre univers d'un simple mouvement de la main.
                      </p>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-rose-400" />
                          <span className="text-iwasp-cream">Compatible Résine & Gel</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-rose-400" />
                          <span className="text-iwasp-cream">Étanchéité IP68 (Spa & Yacht)</span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link to="/order/type">
                          <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white gap-2 rounded-xl">
                            <Fingerprint className="w-4 h-4" />
                            Commander le Kit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MON IDENTITÉ TAB - With Stories */}
              {activeTab === "identity" && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl text-iwasp-cream">
                        <span className="italic">Votre</span> <span className="text-iwasp-bronze">Identité.</span>
                      </h3>
                      <p className="text-sm text-iwasp-silver mt-2">Scénarisez votre première impression numérique.</p>
                    </div>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2 rounded-xl"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </Button>
                  </div>

                  {/* Informations Générales */}
                  <div className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                    <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase mb-6">Informations Générales</h4>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">
                          Nom de Scène / Prestige
                        </label>
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream placeholder:text-iwasp-silver/50 focus:border-iwasp-bronze rounded-xl h-12"
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">
                          Fonction Royale
                        </label>
                        <Input
                          value={profile.title}
                          onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                          className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream placeholder:text-iwasp-silver/50 focus:border-iwasp-bronze rounded-xl h-12"
                          placeholder="Votre titre"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <label className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">
                        Manifeste (Biographie)
                      </label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream placeholder:text-iwasp-silver/50 focus:border-iwasp-bronze rounded-xl min-h-[100px] resize-none"
                        placeholder="Votre histoire en quelques mots..."
                      />
                    </div>
                  </div>

                  {/* Stories Section */}
                  <div className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">
                        Stories i-WASP (Vidéo & Photo)
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-iwasp-bronze/30 text-iwasp-bronze hover:bg-iwasp-bronze/10 gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Ajouter une Story
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {stories.map((story, index) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="aspect-square rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10 hover:border-iwasp-bronze/30 transition-all cursor-pointer group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            {story.type === "video" ? (
                              <Play className="w-6 h-6 text-iwasp-silver/40 group-hover:text-iwasp-bronze transition-colors" />
                            ) : (
                              <Image className="w-6 h-6 text-iwasp-silver/40 group-hover:text-iwasp-bronze transition-colors" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {/* Add new story placeholder */}
                      <div className="aspect-square rounded-xl border-2 border-dashed border-iwasp-emerald/20 hover:border-iwasp-bronze/30 transition-all cursor-pointer flex items-center justify-center">
                        <Plus className="w-6 h-6 text-iwasp-silver/40" />
                      </div>
                    </div>
                  </div>

                  {/* Contact & Social */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact */}
                    <div className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                      <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-iwasp-bronze" />
                        Coordonnées
                      </h4>
                      <div className="space-y-4">
                        <Input
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                          placeholder="Email"
                        />
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                          placeholder="Téléphone"
                        />
                        <Input
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                          placeholder="Entreprise"
                        />
                      </div>
                    </div>

                    {/* Social */}
                    <div className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                      <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-iwasp-bronze" />
                        Réseaux Sociaux
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Instagram className="w-4 h-4 text-iwasp-silver/60" />
                          <Input
                            value={profile.instagram}
                            onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                            className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                            placeholder="@username"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Linkedin className="w-4 h-4 text-iwasp-silver/60" />
                          <Input
                            value={profile.linkedin}
                            onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                            className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                            placeholder="linkedin.com/in/..."
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-iwasp-silver/60" />
                          <Input
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            className="bg-iwasp-midnight border-iwasp-emerald/20 text-iwasp-cream focus:border-iwasp-bronze rounded-xl h-11"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "leads" && (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Leads header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-display text-iwasp-cream">Vos Contacts Prestigieux</h3>
                      <p className="text-sm text-iwasp-silver">Leads extraits de vos interactions NFC</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display text-iwasp-bronze">{mockLeads.length}</div>
                      <div className="text-xs text-iwasp-silver uppercase tracking-wider">Ce mois</div>
                    </div>
                  </div>

                  {/* Leads list */}
                  <div className="space-y-3">
                    {mockLeads.map((lead, index) => (
                      <motion.div
                        key={lead.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 hover:border-iwasp-bronze/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iwasp-bronze/20 to-iwasp-emerald/10 flex items-center justify-center">
                              <span className="font-display text-lg text-iwasp-bronze">{lead.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-iwasp-cream">{lead.name}</h4>
                              <p className="text-sm text-iwasp-silver">{lead.role} · {lead.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <div className="text-sm font-medium text-iwasp-emerald-glow">{lead.score}%</div>
                              <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow" />
                            </div>
                            <p className="text-xs text-iwasp-silver mt-1">{lead.date}</p>
                          </div>
                        </div>
                        
                        {/* Quick actions */}
                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 text-xs gap-1">
                            <Mail className="w-3 h-3" /> Email
                          </Button>
                          <Button variant="ghost" size="sm" className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 text-xs gap-1">
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </Button>
                          <Button variant="ghost" size="sm" className="text-iwasp-silver hover:text-iwasp-cream hover:bg-iwasp-emerald/10 text-xs gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Export CTA */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-iwasp-emerald/10 to-iwasp-bronze/10 border border-iwasp-emerald/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-iwasp-cream mb-1">Exporter vers CRM</h4>
                        <p className="text-sm text-iwasp-silver">Synchronisez vos leads avec Salesforce, HubSpot ou Pipedrive</p>
                      </div>
                      <Button className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Connecter
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CENTRE D'INTELLIGENCE TAB */}
              {activeTab === "world" && (
                <motion.div
                  key="world"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Intelligence Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl text-iwasp-cream">
                        Centre <span className="italic text-iwasp-bronze">Intelligence.</span>
                      </h3>
                      <p className="text-sm text-iwasp-silver mt-2">Cartographie mondiale de votre influence en temps réel.</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-xs text-iwasp-silver uppercase tracking-wider mb-1">Portée Pays</div>
                        <div className="text-2xl font-display text-iwasp-cream">24</div>
                      </div>
                      <div className="h-8 w-px bg-iwasp-bronze/20" />
                      <div className="text-center">
                        <div className="text-xs text-iwasp-silver uppercase tracking-wider mb-1">Villes Actives</div>
                        <div className="text-2xl font-display text-iwasp-bronze">108</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Map + Data Feed */}
                  <div className="grid lg:grid-cols-[320px,1fr] gap-6">
                    {/* Live Data Feed Panel */}
                    <div className="rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 p-5 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-iwasp-bronze" />
                        <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">Flux de Données Live</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {activityFeed.map((activity, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex items-center gap-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-iwasp-bronze animate-pulse" />
                            <div className="flex-1">
                              <span className="text-iwasp-cream text-sm">{activity.city}</span>
                              <span className="text-iwasp-silver text-sm"> · TAP ENREGISTRÉ</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Satellite Sync Indicator */}
                      <div className="pt-4 border-t border-iwasp-emerald/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-iwasp-silver">SATELLITE SYNC</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
                            <span className="text-xs text-iwasp-emerald-glow">CONNECTÉ</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive World Map HUD */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-iwasp-midnight via-iwasp-midnight-elevated to-iwasp-abyss/20 border border-iwasp-bronze/10 aspect-[16/9] min-h-[350px]">
                      {/* Radar Grid Background */}
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: `
                            radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(184, 143, 72, 0.05) 30%, rgba(184, 143, 72, 0.05) 31%, transparent 31%),
                            radial-gradient(circle at center, transparent 0%, transparent 50%, rgba(184, 143, 72, 0.03) 50%, rgba(184, 143, 72, 0.03) 51%, transparent 51%),
                            radial-gradient(circle at center, transparent 0%, transparent 70%, rgba(184, 143, 72, 0.02) 70%, rgba(184, 143, 72, 0.02) 71%, transparent 71%)
                          `,
                          backgroundSize: '100% 100%'
                        }} />
                        <div className="w-full h-full" style={{
                          backgroundImage: `
                            linear-gradient(rgba(184, 143, 72, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(184, 143, 72, 0.05) 1px, transparent 1px)
                          `,
                          backgroundSize: '60px 60px'
                        }} />
                      </div>

                      {/* Decorative Scan Line */}
                      <motion.div 
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-iwasp-bronze/50 to-transparent"
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: ['0%', '100%'], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      />

                      {/* World Map Silhouette */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <svg viewBox="0 0 1000 500" className="w-full h-full">
                          <ellipse cx="500" cy="250" rx="450" ry="200" fill="none" stroke="currentColor" strokeWidth="1" className="text-iwasp-bronze" />
                          <ellipse cx="500" cy="250" rx="300" ry="133" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-iwasp-bronze" />
                          <line x1="50" y1="250" x2="950" y2="250" stroke="currentColor" strokeWidth="0.5" className="text-iwasp-bronze" />
                        </svg>
                      </div>

                      {/* Hotspots with Enhanced Visuals */}
                      {worldHotspots.map((spot, index) => (
                        <motion.div
                          key={spot.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
                          className="absolute group cursor-pointer"
                          style={{
                            left: `${((spot.lng + 180) / 360) * 100}%`,
                            top: `${((90 - spot.lat) / 180) * 100}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {/* Outer Pulse Ring */}
                          {spot.active && (
                            <>
                              <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-iwasp-bronze/30 animate-ping" style={{ animationDuration: '2s' }} />
                              <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-iwasp-bronze/20 animate-pulse" />
                            </>
                          )}
                          {/* Core Dot */}
                          <div className={cn(
                            "w-4 h-4 rounded-full shadow-lg transition-all border-2",
                            spot.active 
                              ? "bg-iwasp-bronze border-iwasp-bronze shadow-iwasp-bronze/50" 
                              : "bg-iwasp-midnight border-iwasp-bronze/30"
                          )} />
                          
                          {/* Enhanced Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 scale-90 group-hover:scale-100">
                            <div className="px-4 py-3 rounded-xl bg-iwasp-midnight/95 backdrop-blur-xl border border-iwasp-bronze/30 text-center whitespace-nowrap shadow-xl">
                              <div className="text-iwasp-cream font-medium text-sm">{spot.city}</div>
                              <div className="text-iwasp-bronze text-lg font-display">{spot.scans}</div>
                              <div className="text-iwasp-silver text-xs">scans enregistrés</div>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-iwasp-midnight border-r border-b border-iwasp-bronze/30 rotate-45" />
                          </div>
                        </motion.div>
                      ))}

                      {/* HUD Corners */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-iwasp-bronze/30" />
                      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-iwasp-bronze/30" />
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-iwasp-bronze/30" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-iwasp-bronze/30" />

                      {/* Map Label */}
                      <div className="absolute top-6 left-10">
                        <div className="text-xs text-iwasp-bronze/60 tracking-[0.3em] uppercase">CARTE D'INFLUENCE GLOBALE</div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-6 right-10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
                        <span className="text-xs text-iwasp-silver tracking-wider">LIVE</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Performance + Top Destination */}
                  <div className="grid lg:grid-cols-[1fr,280px] gap-6">
                    {/* Performance Chart */}
                    <div className="rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Target className="w-4 h-4 text-iwasp-bronze" />
                        <h4 className="text-sm text-iwasp-cream font-medium italic">Performances d'Expansion</h4>
                      </div>
                      
                      {/* Stylized Chart */}
                      <div className="h-32 flex items-end gap-2">
                        {[35, 42, 58, 67, 72, 85, 91, 78, 95, 88, 92, 100].map((height, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-iwasp-bronze/40 to-iwasp-bronze"
                          />
                        ))}
                      </div>
                      
                      {/* Chart Labels */}
                      <div className="flex justify-between mt-3 text-xs text-iwasp-silver">
                        <span>Jan</span>
                        <span>Fév</span>
                        <span>Mar</span>
                        <span>Avr</span>
                        <span>Mai</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aoû</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Déc</span>
                      </div>

                      {/* Growth Metric */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-iwasp-emerald/10">
                        <span className="text-iwasp-silver text-sm">Croissance Annuelle</span>
                        <span className="text-iwasp-emerald-glow font-display text-xl">+247%</span>
                      </div>
                    </div>

                    {/* Top Destination Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-iwasp-bronze/10 to-iwasp-midnight-elevated border border-iwasp-bronze/20 p-6 flex flex-col">
                      <div className="text-xs text-iwasp-silver tracking-[0.2em] uppercase mb-4">TOP DESTINATION</div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="font-display text-4xl text-iwasp-bronze italic mb-2">Dubaï</div>
                        <div className="flex items-center gap-1 text-iwasp-silver text-sm">
                          <span>🇦🇪</span>
                          <span>Émirats Arabes Unis</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-iwasp-bronze/20 text-center">
                        <div className="text-iwasp-emerald-glow text-sm font-medium">+24% d'engagement</div>
                        <div className="text-iwasp-silver/60 text-xs">Cette semaine</div>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap by Region */}
                  <div className="rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 p-6">
                    <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase mb-4">Heatmap de Réseau par Région</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { region: "Europe", percentage: 42, color: "from-iwasp-bronze to-iwasp-bronze-light" },
                        { region: "Moyen-Orient", percentage: 31, color: "from-iwasp-emerald to-iwasp-emerald-glow" },
                        { region: "Asie-Pacifique", percentage: 18, color: "from-iwasp-abyss to-cyan-500" },
                        { region: "Amériques", percentage: 9, color: "from-purple-600 to-purple-400" },
                      ].map((item) => (
                        <div key={item.region} className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/5">
                          <div className="text-iwasp-cream font-medium text-sm mb-2">{item.region}</div>
                          <div className="text-2xl font-display text-iwasp-bronze mb-2">{item.percentage}%</div>
                          <div className="w-full h-1.5 rounded-full bg-iwasp-midnight-elevated overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RÉSONANCE & INFLUENCE TAB */}
              {activeTab === "resonance" && (
                <motion.div
                  key="resonance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl text-iwasp-cream">
                        <span className="italic text-iwasp-bronze">Résonance</span> &
                        <br />
                        <span className="text-iwasp-bronze">Influence.</span>
                      </h3>
                      <p className="text-sm text-iwasp-silver mt-2">Automatisez votre présence après le contact physique.</p>
                    </div>
                    <Button className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2 rounded-xl">
                      Activer les Campagnes
                    </Button>
                  </div>

                  {/* Main Grid */}
                  <div className="grid lg:grid-cols-[1fr,380px] gap-6">
                    {/* Left: Automations de Courtoisie */}
                    <div className="space-y-6">
                      <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">
                        Automatisations de Courtoisie
                      </h4>

                      {/* Push Notification */}
                      <div className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-iwasp-bronze/10 flex items-center justify-center">
                              <Smartphone className="w-6 h-6 text-iwasp-bronze" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-iwasp-cream">Notification Push de Rappel</h4>
                              <p className="text-sm text-iwasp-silver">Envoie un message de prestige 24h après un scan NFC.</p>
                            </div>
                          </div>
                          <Switch
                            checked={resonance.pushRappel}
                            onCheckedChange={(checked) => setResonance({ ...resonance, pushRappel: checked })}
                            className="data-[state=checked]:bg-iwasp-bronze"
                          />
                        </div>
                      </div>

                      {/* Email Conciergerie */}
                      <div className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-iwasp-bronze/10 flex items-center justify-center">
                              <Mail className="w-6 h-6 text-iwasp-bronze" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-iwasp-cream">Email Conciergerie</h4>
                              <p className="text-sm text-iwasp-silver">Envoi automatique de votre portfolio PDF haute résolution.</p>
                            </div>
                          </div>
                          <Switch
                            checked={resonance.emailConciergerie}
                            onCheckedChange={(checked) => setResonance({ ...resonance, emailConciergerie: checked })}
                            className="data-[state=checked]:bg-iwasp-bronze"
                          />
                        </div>
                      </div>

                      {/* Geo Message */}
                      <div className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-iwasp-bronze/10 flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-iwasp-bronze" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-iwasp-cream">Message Géolocalisé</h4>
                              <p className="text-sm text-iwasp-silver">Salue vos contacts lorsqu'ils reviennent dans votre périmètre.</p>
                            </div>
                          </div>
                          <Switch
                            checked={resonance.geoMessage}
                            onCheckedChange={(checked) => setResonance({ ...resonance, geoMessage: checked })}
                            className="data-[state=checked]:bg-iwasp-bronze"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Retargeting Panel */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-iwasp-midnight-elevated to-iwasp-bronze/5 border border-iwasp-bronze/20">
                      <h4 className="font-display text-2xl text-iwasp-cream mb-2">
                        Retargeting de
                        <br />
                        <span className="italic text-iwasp-bronze">Luxe</span>
                      </h4>
                      <p className="text-sm text-iwasp-silver mb-6">
                        Ne laissez pas l'intérêt s'éteindre. Notre moteur publicitaire identifie les profils ayant scanné votre i-Wasp pour leur afficher des contenus exclusifs sur Instagram et LinkedIn.
                      </p>

                      {/* Instagram Active */}
                      <div className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs text-iwasp-silver tracking-wider uppercase">Campagne Instagram</div>
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-3 h-3 text-iwasp-silver/60" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-xs font-semibold px-2 py-1 rounded",
                            resonance.instagramRetargeting 
                              ? "bg-iwasp-emerald/20 text-iwasp-emerald-glow" 
                              : "bg-iwasp-midnight-elevated text-iwasp-silver"
                          )}>
                            {resonance.instagramRetargeting ? "ACTIVE" : "INACTIVE"}
                          </span>
                          <Switch
                            checked={resonance.instagramRetargeting}
                            onCheckedChange={(checked) => setResonance({ ...resonance, instagramRetargeting: checked })}
                            className="data-[state=checked]:bg-iwasp-bronze scale-90"
                          />
                        </div>
                        {resonance.instagramRetargeting && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex -space-x-2">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full bg-iwasp-bronze/30 border-2 border-iwasp-midnight" />
                              ))}
                            </div>
                            <span className="text-xs text-iwasp-silver">+124 cibles</span>
                          </div>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-iwasp-silver tracking-wider uppercase">Campagne LinkedIn</div>
                          <Switch
                            checked={resonance.linkedinRetargeting}
                            onCheckedChange={(checked) => setResonance({ ...resonance, linkedinRetargeting: checked })}
                            className="data-[state=checked]:bg-iwasp-bronze scale-90"
                          />
                        </div>
                      </div>

                      <Button className="w-full bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2 rounded-xl">
                        <Settings className="w-4 h-4" />
                        Synchroniser
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "eco" && (
                <motion.div
                  key="eco"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Eco impact hero */}
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-iwasp-emerald/20 to-iwasp-midnight-elevated border border-iwasp-emerald/30 text-center">
                    <div className="w-20 h-20 rounded-full bg-iwasp-emerald/20 flex items-center justify-center mx-auto mb-6">
                      <TreePine className="w-10 h-10 text-iwasp-emerald-glow" />
                    </div>
                    <h3 className="font-display text-3xl text-iwasp-cream mb-2">
                      Impact <span className="italic text-iwasp-emerald-glow">Positif</span>
                    </h3>
                    <p className="text-iwasp-silver max-w-md mx-auto">
                      Votre engagement avec i-Wasp contribue à un monde plus durable. Voici votre empreinte.
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "2,847", label: "Cartes papier économisées", icon: "📄" },
                      { value: "14", label: "Arbres préservés", icon: "🌳" },
                      { value: "89kg", label: "CO₂ évité", icon: "💨" },
                      { value: "∞", label: "Mises à jour sans réimpression", icon: "♻️" },
                    ].map((stat) => (
                      <div 
                        key={stat.label}
                        className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 text-center"
                      >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-display text-iwasp-emerald-glow mb-1">{stat.value}</div>
                        <div className="text-xs text-iwasp-silver">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Certificate */}
                  <div className="p-6 rounded-2xl bg-iwasp-midnight border border-iwasp-emerald/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-iwasp-emerald/10 flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-iwasp-emerald-glow" />
                        </div>
                        <div>
                          <h4 className="font-medium text-iwasp-cream">Certificat Éco-Responsable</h4>
                          <p className="text-sm text-iwasp-silver">Téléchargez votre certificat d'impact</p>
                        </div>
                      </div>
                      <Button variant="outline" className="border-iwasp-emerald/30 text-iwasp-cream hover:bg-iwasp-emerald/10">
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="text-center mb-4">
                <span className="text-xs text-iwasp-silver tracking-[0.15em] uppercase">Rendu Temps Réel</span>
              </div>
              
              {/* Phone mockup */}
              <div className="relative mx-auto w-72">
                {/* Glow */}
                <div className="absolute inset-0 bg-iwasp-bronze/15 rounded-[3rem] blur-2xl" />
                
                {/* Phone frame */}
                <div className="relative bg-iwasp-midnight rounded-[2.5rem] p-3 border border-iwasp-bronze/20 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-gradient-to-b from-iwasp-midnight-elevated to-iwasp-midnight rounded-[2rem] overflow-hidden aspect-[9/16]">
                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
                    
                    {/* Profile preview */}
                    <div className="pt-12 px-4 h-full flex flex-col">
                      {/* Play button indicator */}
                      <div className="absolute top-16 right-4">
                        <Play className="w-4 h-4 text-iwasp-silver/40" />
                      </div>

                      {/* Settings indicator */}
                      <div className="absolute top-16 left-4">
                        <Settings className="w-4 h-4 text-iwasp-silver/40" />
                      </div>

                      {/* Avatar with animated ring */}
                      <div className="w-16 h-16 rounded-full mx-auto mb-3 relative">
                        {/* Animated gradient ring for stories */}
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-iwasp-bronze via-rose-400 to-iwasp-bronze animate-spin-slow opacity-70" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-0 rounded-full bg-iwasp-midnight" />
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-iwasp-bronze/30 to-iwasp-emerald/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-iwasp-bronze" />
                        </div>
                      </div>
                      
                      {/* Name & title */}
                      <h3 className="font-display text-base text-center text-iwasp-cream italic mb-0.5">
                        {profile.name || "Votre nom"}
                      </h3>
                      <p className="text-[10px] text-center text-iwasp-bronze tracking-[0.1em] uppercase mb-2">
                        {profile.title || "Votre titre"}
                      </p>
                      
                      {/* Bio */}
                      <p className="text-[10px] text-center text-iwasp-silver/70 mb-4 leading-relaxed line-clamp-3 px-2">
                        "{profile.bio || "Votre manifeste..."}"
                      </p>
                      
                      {/* Action buttons preview */}
                      <div className="space-y-2 mt-auto mb-4">
                        <div className="h-9 rounded-xl bg-iwasp-bronze text-iwasp-midnight flex items-center justify-center text-xs font-medium">
                          Contact Prestige
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[Mail, MessageCircle, Linkedin].map((Icon, i) => (
                            <div key={i} className="h-8 rounded-lg bg-iwasp-midnight-elevated border border-iwasp-emerald/20 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-iwasp-emerald-glow" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sync indicator */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-emerald/10 border border-iwasp-emerald/20">
                  <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
                  <span className="text-xs text-iwasp-silver">Synchronisé en temps réel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
