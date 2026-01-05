/**
 * i-WASP STUDIO — Infinite Perfection
 * Centre de Contrôle Ultra-Luxe avec Mode Caméléon,
 * Le Coffre NFT, et Conciergerie Privée
 */

import { useState, useEffect } from "react";
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
  ChevronRight,
  Shirt,
  BadgeCheck,
  Headphones,
  Moon,
  Sun,
  Briefcase,
  Wine,
  Link2,
  Award,
  Boxes,
  ScanLine,
  Cpu,
  Wifi,
  Camera
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
  productType: "card" | "nail" | "bracelet" | "label";
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

interface ChameleonMode {
  id: string;
  name: string;
  icon: typeof Briefcase;
  description: string;
  active: boolean;
}

interface NFTAsset {
  id: string;
  name: string;
  type: "garment" | "accessory";
  brand: string;
  tokenId: string;
  authenticatedAt: string;
  imageUrl?: string;
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

// Chameleon modes
const chameleonModes: ChameleonMode[] = [
  { id: "business", name: "Business Elite", icon: Briefcase, description: "Profil professionnel pour les réunions d'affaires", active: true },
  { id: "social", name: "Networking Lounge", icon: Wine, description: "Profil décontracté pour les événements sociaux", active: false },
  { id: "creative", name: "Creative Director", icon: Sparkles, description: "Profil créatif pour les collaborations artistiques", active: false },
];

// Mock NFT Assets (Le Coffre)
const mockNFTAssets: NFTAsset[] = [
  { id: "1", name: "Blazer Signature", type: "garment", brand: "i-WASP Couture", tokenId: "0x7a3...4f2", authenticatedAt: "2025-12-15" },
  { id: "2", name: "Pochette Monaco", type: "accessory", brand: "i-WASP Couture", tokenId: "0x8b4...5e1", authenticatedAt: "2025-11-20" },
];

// Mock Alliance Data for Cercle Privé
interface Alliance {
  id: string;
  name: string;
  location: string;
  time: string;
  avatar?: string;
}

const mockAlliances: Alliance[] = [
  { id: "1", name: "Villa G.", location: "Monaco", time: "10 min" },
  { id: "2", name: "Club 55", location: "St-Tropez", time: "1h" },
  { id: "3", name: "Le Bristol", location: "Paris", time: "1D" },
];

// Mock Nearby Elite Members for Radar
interface EliteMember {
  id: string;
  initials: string;
  distance: number; // in meters
  angle: number; // degrees for radar positioning
}

const mockNearbyElite: EliteMember[] = [
  { id: "1", initials: "VG", distance: 45, angle: 30 },
  { id: "2", initials: "AM", distance: 120, angle: 150 },
  { id: "3", initials: "SC", distance: 80, angle: 270 },
];

// Tabs configuration - Updated with new sections
const tabs = [
  { id: "identity", label: "Identité", icon: User },
  { id: "cercle", label: "Cercle Privé", icon: Users },
  { id: "scanner", label: "Scanner", icon: ScanLine },
  { id: "storylab", label: "Story Lab", icon: Camera },
  { id: "manufacture", label: "Manufacture", icon: Gem },
  { id: "coffre", label: "Le Coffre", icon: BadgeCheck },
  { id: "concierge", label: "Conciergerie", icon: Headphones },
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
  const [activeTab, setActiveTab] = useState("cercle");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [fleet, setFleet] = useState<NFCCard[]>(mockFleet);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [activeChameleonMode, setActiveChameleonMode] = useState<string>("business");
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>(mockNFTAssets);
  const [allianceTapActive, setAllianceTapActive] = useState(false);
  const [activeCluster, setActiveCluster] = useState("Monaco Yacht Show");
  
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

  // Get current chameleon mode
  const currentChameleonMode = chameleonModes.find(m => m.id === activeChameleonMode) || chameleonModes[0];

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
            
            {/* Cluster Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-midnight-elevated border border-iwasp-bronze/20">
              <Radio className="w-3 h-3 text-iwasp-bronze" />
              <span className="text-xs text-iwasp-cream tracking-wider font-medium">
                Cercle : {activeCluster}
              </span>
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
              {/* CERCLE PRIVÉ TAB - Radar d'Influence Premium */}
              {activeTab === "cercle" && (
                <motion.div
                  key="cercle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Main Grid: Radar + Right Panels */}
                  <div className="grid lg:grid-cols-[1fr,320px] gap-6">
                    {/* Left: Radar d'Influence */}
                    <div className="rounded-3xl bg-iwasp-midnight-elevated border border-iwasp-bronze/10 p-6 relative overflow-hidden">
                      {/* Header with member count */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display text-3xl md:text-4xl text-iwasp-cream mb-1">
                            Radar
                            <br /><span className="italic">d'Influence</span>
                          </h3>
                          <p className="text-xs text-iwasp-silver uppercase tracking-[0.15em] mt-2">
                            Zone : <span className="text-iwasp-bronze">Monaco Yacht Club</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-iwasp-emerald-glow animate-pulse" />
                            <span className="text-xs text-iwasp-silver tracking-wider uppercase">3 Membres</span>
                          </div>
                          <span className="text-xs text-iwasp-bronze tracking-wider uppercase">Détectés</span>
                        </div>
                      </div>

                      {/* Radar Circle - Larger */}
                      <div className="relative aspect-square max-w-[380px] mx-auto my-6">
                        {/* Radar Rings with subtle glow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute w-full h-full rounded-full border border-iwasp-bronze/10" />
                          <div className="absolute w-[80%] h-[80%] rounded-full border border-iwasp-bronze/12" />
                          <div className="absolute w-[60%] h-[60%] rounded-full border border-iwasp-bronze/15" />
                          <div className="absolute w-[40%] h-[40%] rounded-full border border-iwasp-bronze/20" />
                          <div className="absolute w-[20%] h-[20%] rounded-full border border-iwasp-bronze/25" />
                        </div>
                        
                        {/* Cross Lines */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute w-full h-px bg-iwasp-bronze/8" />
                          <div className="absolute w-px h-full bg-iwasp-bronze/8" />
                        </div>

                        {/* Sweep Animation - Radar Effect */}
                        <motion.div
                          className="absolute inset-0"
                          style={{ transformOrigin: 'center center' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <div 
                            className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
                            style={{
                              background: 'linear-gradient(to right, hsl(var(--iwasp-bronze) / 0.8), transparent)'
                            }}
                          />
                          {/* Glow cone effect */}
                          <div 
                            className="absolute top-1/2 left-1/2 w-1/2 h-8 origin-left -translate-y-1/2 opacity-20"
                            style={{
                              background: 'linear-gradient(to right, hsl(var(--iwasp-bronze) / 0.4), transparent)',
                              clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'
                            }}
                          />
                        </motion.div>

                        {/* Center Point - User */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-iwasp-midnight flex items-center justify-center border-2 border-iwasp-bronze/50">
                          <User className="w-6 h-6 text-iwasp-bronze/80" />
                        </div>

                        {/* Nearby Elite Members */}
                        {mockNearbyElite.map((member, index) => {
                          const radius = (member.distance / 150) * 42;
                          const x = 50 + radius * Math.cos((member.angle - 90) * (Math.PI / 180));
                          const y = 50 + radius * Math.sin((member.angle - 90) * (Math.PI / 180));
                          return (
                            <motion.div
                              key={member.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.3 + 0.5 }}
                              className="absolute group cursor-pointer"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {/* Pulse ring */}
                              <div className="absolute inset-0 w-10 h-10 -m-1 rounded-full border border-iwasp-bronze/30 animate-ping" style={{ animationDuration: '2.5s' }} />
                              {/* Member Avatar */}
                              <div className="w-8 h-8 rounded-full bg-iwasp-midnight border border-iwasp-bronze/50 flex items-center justify-center group-hover:border-iwasp-bronze group-hover:scale-110 transition-all">
                                <span className="text-[10px] font-medium text-iwasp-cream">{member.initials}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Bottom: Fréquences Alliances */}
                      <div className="flex items-center justify-center gap-6 pt-4 border-t border-iwasp-bronze/10">
                        <div className="text-right">
                          <span className="text-[10px] text-iwasp-silver/60 uppercase tracking-wider">Fréquences</span>
                          <br />
                          <span className="text-xs text-iwasp-bronze tracking-[0.15em] uppercase">Alliances Chiffrées</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "w-3 h-3 rounded-full border",
                                i <= 3 
                                  ? "bg-iwasp-bronze/20 border-iwasp-bronze/60" 
                                  : "bg-transparent border-iwasp-bronze/20"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Side Panels */}
                    <div className="space-y-5">
                      {/* Clusters Actifs */}
                      <div className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-bronze/10">
                        <h4 className="text-[10px] text-iwasp-bronze tracking-[0.2em] uppercase mb-4">Clusters Actifs</h4>
                        <div className="space-y-3">
                          {[
                            { name: "Monaco Yacht Show", members: 47, active: true },
                            { name: "Art Basel", members: 23, active: false },
                            { name: "Cannes Lions", members: 31, active: false },
                          ].map((cluster, i) => (
                            <div 
                              key={cluster.name}
                              className={cn(
                                "p-3 rounded-xl border cursor-pointer transition-all",
                                cluster.active 
                                  ? "bg-iwasp-bronze/10 border-iwasp-bronze/40" 
                                  : "bg-transparent border-iwasp-emerald/10 hover:border-iwasp-bronze/20"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-iwasp-cream font-medium">{cluster.name}</span>
                                {cluster.active && <div className="w-1.5 h-1.5 rounded-full bg-iwasp-emerald-glow" />}
                              </div>
                              <span className="text-[10px] text-iwasp-silver">{cluster.members} membres</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Alliance Tap Panel */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-iwasp-bronze/5 to-iwasp-midnight-elevated border border-iwasp-bronze/20 relative overflow-hidden">
                        {/* Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 text-[9px] rounded-md bg-iwasp-bronze/20 text-iwasp-bronze tracking-wider uppercase border border-iwasp-bronze/30">
                            Alliance Tap
                          </span>
                        </div>

                        <h4 className="font-display text-2xl text-iwasp-cream leading-tight mt-6 mb-3">
                          Scellez
                          <br />vos
                          <br /><span className="italic text-iwasp-bronze">Rencontres.</span>
                        </h4>
                        <p className="text-xs text-iwasp-silver leading-relaxed mb-5">
                          Deux membres i-Wasp se "tappent" ? Une alliance blockchain est créée, vos informations s'échangent et vos stories se synchronisent.
                        </p>

                        <Button 
                          onClick={() => setAllianceTapActive(!allianceTapActive)}
                          className={cn(
                            "w-full rounded-xl gap-2 font-medium text-xs py-5",
                            allianceTapActive 
                              ? "bg-iwasp-bronze text-iwasp-midnight hover:bg-iwasp-bronze-light" 
                              : "bg-iwasp-midnight border border-iwasp-bronze/40 text-iwasp-cream hover:bg-iwasp-bronze/10"
                          )}
                        >
                          <Radio className="w-4 h-4" />
                          {allianceTapActive ? "Alliance Active" : "Lancer l'Appairage"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCANNER DE PRESTIGE TAB */}
              {activeTab === "scanner" && (
                <motion.div
                  key="scanner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-4xl md:text-5xl text-iwasp-cream">
                        Scanner de
                        <br /><span className="italic text-iwasp-bronze">Prestige.</span>
                      </h3>
                      <p className="text-sm text-iwasp-silver mt-3">
                        Vérifiez l'authenticité d'une pièce textile d'un simple geste.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-bronze/20">
                      <div className="text-xs text-iwasp-bronze uppercase tracking-wider mb-1">Liaison Blockchain</div>
                      <div className="text-sm text-iwasp-cream">Sécurisée & Infalsifiable</div>
                    </div>
                  </div>

                  {/* Main Grid */}
                  <div className="grid lg:grid-cols-[1fr,320px] gap-8">
                    {/* Scanner Interface */}
                    <div className="flex flex-col items-center">
                      {/* Scanner Box */}
                      <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-iwasp-midnight border-2 border-iwasp-bronze/20 flex items-center justify-center">
                        {/* Corner Brackets */}
                        <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-iwasp-bronze/50" />
                        <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-iwasp-bronze/50" />
                        <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-iwasp-bronze/50" />
                        <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-iwasp-bronze/50" />

                        {/* Scan Line Animation */}
                        <motion.div
                          className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-iwasp-bronze to-transparent"
                          animate={{ top: ['15%', '85%', '15%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Central Content */}
                        <div className="text-center z-10">
                          <div className="w-16 h-16 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-bronze/30 flex items-center justify-center mx-auto mb-4">
                            <ScanLine className="w-8 h-8 text-iwasp-bronze" />
                          </div>
                          <h4 className="font-display text-xl text-iwasp-cream italic mb-2">Prêt à Scanner</h4>
                          <p className="text-xs text-iwasp-silver max-w-[200px]">
                            Approchez votre téléphone du label thermocollé sur le vêtement.
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button className="mt-6 bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2 rounded-xl px-8">
                        <Camera className="w-4 h-4" />
                        Lancer le Scan
                      </Button>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                      {/* Authenticité Info */}
                      <div className="p-6 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10">
                        <h4 className="font-display text-xl text-iwasp-cream mb-2">
                          L'Authenticité
                          <br /><span className="italic text-iwasp-bronze">Augmentée.</span>
                        </h4>
                        <p className="text-sm text-iwasp-silver leading-relaxed">
                          En scannant un vêtement i-Wasp, vous accédez à l'âme de l'article. C'est l'assurance d'une pièce unique et la preuve sociale immédiate de votre appartenance à l'élite.
                        </p>
                      </div>

                      {/* Tech Card */}
                      <div className="p-5 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-iwasp-emerald/10 flex items-center justify-center shrink-0">
                          <Cpu className="w-6 h-6 text-iwasp-silver" />
                        </div>
                        <div>
                          <h5 className="font-medium text-iwasp-cream text-sm mb-1">Puce NFC Sub-Nanos</h5>
                          <p className="text-xs text-iwasp-silver leading-relaxed">
                            Technologie invisible résistante aux lavages intensifs et à la pression thermique.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STORY LAB TAB */}
              {activeTab === "storylab" && (
                <motion.div
                  key="storylab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl text-iwasp-cream">
                      Story <span className="italic text-iwasp-bronze">Lab.</span>
                    </h3>
                    <p className="text-sm text-iwasp-silver mt-3">
                      Créez des visuels dignes des plus grands magazines directement dans l'application.
                    </p>
                  </div>

                  {/* Style Options */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name: "Magazine", desc: "Style éditorial premium", active: true },
                      { name: "Minimal", desc: "Épuré et moderne", active: false },
                      { name: "Aura", desc: "Éclats dorés luxueux", active: false },
                    ].map((style) => (
                      <div 
                        key={style.name}
                        className={cn(
                          "p-5 rounded-2xl border cursor-pointer transition-all",
                          style.active 
                            ? "bg-iwasp-bronze/10 border-iwasp-bronze text-iwasp-cream" 
                            : "bg-iwasp-midnight-elevated border-iwasp-emerald/10 text-iwasp-silver hover:border-iwasp-bronze/30"
                        )}
                      >
                        <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                        <p className="text-xs opacity-70">{style.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stories Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stories.map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="aspect-[9/16] rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 flex items-center justify-center cursor-pointer hover:border-iwasp-bronze/30 transition-all group"
                      >
                        <div className="text-center">
                          {story.type === "video" ? (
                            <Play className="w-8 h-8 text-iwasp-silver/40 mx-auto group-hover:text-iwasp-bronze transition-colors" />
                          ) : (
                            <Image className="w-8 h-8 text-iwasp-silver/40 mx-auto group-hover:text-iwasp-bronze transition-colors" />
                          )}
                          <span className="text-xs text-iwasp-silver mt-2 block">{story.title}</span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Add Story */}
                    <div className="aspect-[9/16] rounded-2xl border-2 border-dashed border-iwasp-emerald/20 flex items-center justify-center cursor-pointer hover:border-iwasp-bronze/30 transition-all">
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-iwasp-silver/40 mx-auto" />
                        <span className="text-xs text-iwasp-silver mt-2 block">Ajouter</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* LA MANUFACTURE TAB - Art de la Matière */}
              {activeTab === "manufacture" && (
                <motion.div
                  key="manufacture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header with Series Number */}
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-display text-4xl md:text-5xl text-iwasp-cream">
                        L'Art de la <span className="italic text-iwasp-bronze">Matière.</span>
                      </h3>
                      <p className="text-sm text-iwasp-silver mt-3">
                        Chaque objet i-Wasp est une pièce d'exception, conçue pour durer et pour impressionner.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-iwasp-silver/50 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[10px] tracking-widest uppercase">Série Limitée</span>
                      </div>
                      <div className="font-display text-2xl text-iwasp-cream">N°001</div>
                      <div className="text-[10px] text-iwasp-bronze tracking-wider uppercase">Fondateur</div>
                    </div>
                  </div>

                  {/* Product Cards Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1: La Carte Héritage */}
                    <div className="p-6 rounded-3xl bg-iwasp-midnight-elevated border border-iwasp-bronze/20 flex flex-col">
                      <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-iwasp-bronze via-yellow-600 to-iwasp-bronze mx-auto mb-4 flex items-center justify-center shadow-lg shadow-iwasp-bronze/20">
                        <div className="text-center">
                          <span className="text-[8px] text-white/70 block tracking-wider">i -</span>
                          <span className="text-xs text-white font-bold tracking-widest">WASP</span>
                          <span className="text-[8px] text-iwasp-bronze-light block">GOLD</span>
                        </div>
                      </div>
                      <h4 className="font-display text-xl text-iwasp-cream italic mb-1">La Carte</h4>
                      <p className="text-sm text-iwasp-bronze uppercase tracking-wider mb-4">Héritage</p>
                      <p className="text-xs text-iwasp-silver leading-relaxed flex-1">
                        Forgée dans un acier inoxydable et plaquée Or 24K. Un poids noble pour une présence inoubliable.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-iwasp-bronze/30 text-iwasp-cream hover:bg-iwasp-bronze/10 rounded-xl text-xs"
                      >
                        Personnaliser
                      </Button>
                    </div>

                    {/* Card 2: L'Ongle Aura */}
                    <div className="p-6 rounded-3xl bg-iwasp-midnight-elevated border border-iwasp-emerald/20 flex flex-col">
                      <div className="w-20 h-24 rounded-2xl bg-iwasp-midnight border border-iwasp-emerald/30 mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-iwasp-bronze" />
                      </div>
                      <h4 className="font-display text-xl text-iwasp-cream mb-1">L'Ongle</h4>
                      <p className="text-sm text-iwasp-silver uppercase tracking-wider mb-4">Aura</p>
                      <p className="text-xs text-iwasp-silver leading-relaxed flex-1">
                        Une micro-puce de 0.1mm intégrable en onglerie. Partagez votre monde d'un simple geste gracieux.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-iwasp-emerald/30 text-iwasp-cream hover:bg-iwasp-emerald/10 rounded-xl text-xs"
                      >
                        Réserver une Pose
                      </Button>
                    </div>

                    {/* Card 3: Label Couture */}
                    <div className="p-6 rounded-3xl bg-iwasp-midnight-elevated border border-iwasp-emerald/20 flex flex-col">
                      <div className="w-20 h-24 rounded-2xl bg-iwasp-midnight border border-iwasp-emerald/30 mx-auto mb-4 flex items-center justify-center">
                        <Shirt className="w-8 h-8 text-iwasp-silver" />
                      </div>
                      <h4 className="font-display text-xl text-iwasp-cream mb-1">Label</h4>
                      <p className="text-sm text-iwasp-silver uppercase tracking-wider mb-4">Couture</p>
                      <p className="text-xs text-iwasp-silver leading-relaxed flex-1">
                        Puce thermocollante au fer à repasser. Authentifie vos vêtements de luxe et les connecte à votre profil.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-iwasp-emerald/30 text-iwasp-cream hover:bg-iwasp-emerald/10 rounded-xl text-xs"
                      >
                        Acheter le Kit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LE COFFRE (NFT) TAB */}
              {activeTab === "coffre" && (
                <motion.div
                  key="coffre"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl text-iwasp-cream">
                      Le <span className="italic text-iwasp-bronze">Coffre.</span>
                    </h3>
                    <p className="text-sm text-iwasp-silver mt-3">
                      Passeport Digital Blockchain : chaque vêtement devient un actif authentifié.
                    </p>
                  </div>

                  {/* Blockchain Info */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-iwasp-midnight-elevated to-iwasp-bronze/5 border border-iwasp-bronze/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-iwasp-bronze/10 flex items-center justify-center">
                        <Link2 className="w-6 h-6 text-iwasp-bronze" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-iwasp-cream">Authentification Blockchain</h4>
                        <p className="text-sm text-iwasp-silver">Vos vêtements possèdent un jumeau numérique inviolable.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10">
                        <div className="text-2xl font-display text-iwasp-bronze">{nftAssets.length}</div>
                        <div className="text-xs text-iwasp-silver">Actifs Certifiés</div>
                      </div>
                      <div className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10">
                        <div className="text-2xl font-display text-iwasp-emerald-glow">100%</div>
                        <div className="text-xs text-iwasp-silver">Authentiques</div>
                      </div>
                      <div className="p-4 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/10">
                        <div className="text-2xl font-display text-iwasp-cream">∞</div>
                        <div className="text-xs text-iwasp-silver">Traçabilité</div>
                      </div>
                    </div>
                  </div>

                  {/* NFT Assets Grid */}
                  <div className="space-y-4">
                    <h4 className="text-xs text-iwasp-silver tracking-[0.2em] uppercase">
                      Vos Actifs Numériques
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {nftAssets.map((asset, index) => (
                        <motion.div
                          key={asset.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 hover:border-iwasp-bronze/30 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-iwasp-midnight border border-iwasp-emerald/20 flex items-center justify-center">
                              {asset.type === "garment" ? (
                                <Shirt className="w-6 h-6 text-iwasp-silver" />
                              ) : (
                                <Boxes className="w-6 h-6 text-iwasp-silver" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-iwasp-cream">{asset.name}</h4>
                              <p className="text-xs text-iwasp-bronze">{asset.brand}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <BadgeCheck className="w-3 h-3 text-iwasp-emerald-glow" />
                                <span className="text-[10px] text-iwasp-silver font-mono">{asset.tokenId}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Add New Asset */}
                      <div className="p-5 rounded-2xl border-2 border-dashed border-iwasp-emerald/20 hover:border-iwasp-bronze/30 transition-all cursor-pointer flex items-center justify-center min-h-[120px]">
                        <div className="text-center">
                          <Plus className="w-6 h-6 text-iwasp-silver/40 mx-auto mb-2" />
                          <span className="text-xs text-iwasp-silver">Ajouter un vêtement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CONCIERGERIE PRIVÉE TAB */}
              {activeTab === "concierge" && (
                <motion.div
                  key="concierge"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl text-iwasp-cream">
                      Conciergerie <span className="italic text-iwasp-bronze">Privée.</span>
                    </h3>
                    <p className="text-sm text-iwasp-silver mt-3">
                      Un service d'élite réservé aux détenteurs de la Carte Or 24K.
                    </p>
                  </div>

                  {/* Concierge Hero */}
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-iwasp-bronze/10 to-iwasp-midnight-elevated border border-iwasp-bronze/30 text-center">
                    <div className="w-20 h-20 rounded-full bg-iwasp-bronze/20 flex items-center justify-center mx-auto mb-6">
                      <Headphones className="w-10 h-10 text-iwasp-bronze" />
                    </div>
                    <h4 className="font-display text-2xl text-iwasp-cream mb-2">
                      Votre Concierge Personnel
                    </h4>
                    <p className="text-sm text-iwasp-silver max-w-md mx-auto mb-6">
                      Réservations exclusives, conseils personnalisés, et assistance 24/7 pour tous vos besoins d'exception.
                    </p>
                    <Button className="bg-iwasp-bronze hover:bg-iwasp-bronze-light text-iwasp-midnight gap-2 rounded-xl">
                      <MessageCircle className="w-4 h-4" />
                      Contacter le Concierge
                    </Button>
                  </div>

                  {/* Services */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: Award, title: "Événements VIP", desc: "Accès prioritaire aux galas et soirées privées" },
                      { icon: Globe, title: "Voyage Sur-Mesure", desc: "Organisation de séjours d'exception" },
                      { icon: Crown, title: "Privilèges Exclusifs", desc: "Avantages partenaires dans le monde entier" },
                    ].map((service, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-iwasp-midnight-elevated border border-iwasp-emerald/10 text-center">
                        <service.icon className="w-8 h-8 text-iwasp-bronze mx-auto mb-3" />
                        <h4 className="font-semibold text-iwasp-cream text-sm mb-1">{service.title}</h4>
                        <p className="text-xs text-iwasp-silver">{service.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* MON IDENTITÉ TAB */}
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

                  {/* Contact & Social */}
                  <div className="grid md:grid-cols-2 gap-6">
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
                      </div>
                    </div>

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
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
