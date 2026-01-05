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

// Tabs configuration - Updated with Stealth Luxury navigation
const tabs = [
  { id: "identity", label: "L'IDENTITÉ", icon: User },
  { id: "cercle", label: "CERCLE PRIVÉ", icon: Users },
  { id: "storylab", label: "VISUAL LAB", icon: Camera },
  { id: "scanner", label: "AUTHENTIFICATION", icon: ScanLine },
  { id: "manufacture", label: "MANUFACTURE", icon: Gem },
  { id: "coffre", label: "LE COFFRE", icon: BadgeCheck },
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
    <div className="min-h-screen bg-[#050807]">
      {/* Header - Stealth Luxury */}
      <header className="sticky top-0 z-50 bg-[#050807]/95 backdrop-blur-xl border-b border-[#A5A9B4]/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl hover:bg-[#A5A9B4]/5 transition-colors">
                <ArrowLeft className="w-5 h-5 text-[#A5A9B4]" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#A5A9B4]/30 flex items-center justify-center bg-[#050807]">
                  <span className="font-display text-lg text-white italic">W</span>
                </div>
                <div>
                  <h1 className="text-sm font-medium text-white tracking-[0.25em] uppercase">i - W A S P</h1>
                  <p className="text-[10px] text-[#A5A9B4] tracking-[0.35em] uppercase">L'ÉLITE FURTIVE</p>
                </div>
              </div>
            </div>
            
            {/* Node Cluster Badge - Stealth */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0F0D] border border-[#A5A9B4]/15">
              <span className="text-[10px] text-[#A5A9B4] tracking-[0.15em]">&gt;_</span>
              <span className="text-xs text-white tracking-wider font-medium uppercase">
                Node : Swiss-Alps Cluster
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#A5A9B4] hover:text-white hover:bg-[#A5A9B4]/5"
              >
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[260px,1fr] gap-8">
          {/* Sidebar Navigation - Stealth Vertical */}
          <aside className="hidden lg:block">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all",
                    activeTab === tab.id
                      ? "bg-white text-[#050807] font-medium"
                      : "text-[#A5A9B4] hover:text-white hover:bg-[#A5A9B4]/5"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-xs tracking-[0.12em] uppercase">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile Tabs */}
          <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap tracking-wider uppercase",
                  activeTab === tab.id
                    ? "bg-white text-[#050807]"
                    : "bg-[#0A0F0D] border border-[#A5A9B4]/10 text-[#A5A9B4] hover:border-[#A5A9B4]/20 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {/* CERCLE PRIVÉ TAB - L'Alliance Invisible - Stealth Luxury */}
              {activeTab === "cercle" && (
                <motion.div
                  key="cercle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Hero Header - L'Alliance Invisible */}
                  <div className="mb-4">
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight">
                      L'Alliance
                      <br />
                      <span className="italic text-[#D1D5DB]">Invisible.</span>
                    </h2>
                    <p className="text-sm text-[#A5A9B4] mt-4 italic">
                      L'influence est une vibration furtive.
                    </p>
                  </div>

                  {/* Main Grid: Radar + Liaisons Chiffrées */}
                  <div className="grid lg:grid-cols-[1fr,280px] gap-6">
                    {/* Left: Radar d'Élite - Stealth Design */}
                    <div className="rounded-3xl bg-[#0A0F0D] border border-[#A5A9B4]/10 p-6 relative overflow-hidden">
                      {/* Radar Title */}
                      <div className="mb-4">
                        <h3 className="font-display text-2xl md:text-3xl text-white italic mb-1">
                          Radar d'Élite
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#A5A9B4] uppercase tracking-[0.15em]">SATELLITE SYNC</span>
                          </div>
                          <span className="text-[10px] text-[#D1D5DB] uppercase tracking-wider font-medium">ACTIVE</span>
                        </div>
                      </div>

                      {/* Radar Circle - Stealth Titanium */}
                      <div className="relative aspect-square max-w-[340px] mx-auto my-6">
                        {/* Radar Rings with titanium glow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {[100, 80, 60, 40, 20].map((size, i) => (
                            <motion.div
                              key={size}
                              className="absolute rounded-full border border-[#A5A9B4]/8"
                              style={{ width: `${size}%`, height: `${size}%` }}
                              animate={{ scale: [1, 1.01, 1] }}
                              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                            />
                          ))}
                        </div>
                        
                        {/* Cross Lines - Titanium */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute w-full h-px bg-[#A5A9B4]/5" />
                          <div className="absolute w-px h-full bg-[#A5A9B4]/5" />
                        </div>

                        {/* Sweep Animation - Titanium Stealth */}
                        <motion.div
                          className="absolute inset-0"
                          style={{ transformOrigin: 'center center' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        >
                          <div 
                            className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
                            style={{
                              background: 'linear-gradient(to right, rgba(165, 169, 180, 0.6), transparent)'
                            }}
                          />
                          {/* Wide glow cone effect */}
                          <div 
                            className="absolute top-1/2 left-1/2 w-1/2 h-12 origin-left -translate-y-1/2 opacity-10"
                            style={{
                              background: 'linear-gradient(to right, rgba(209, 213, 219, 0.4), transparent)',
                              clipPath: 'polygon(0 50%, 100% 20%, 100% 80%)'
                            }}
                          />
                        </motion.div>

                        {/* Center Point - User Avatar */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#050807] flex items-center justify-center border border-[#A5A9B4]/30 overflow-hidden">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#1A1F1D] to-[#050807] flex items-center justify-center">
                            <User className="w-8 h-8 text-[#A5A9B4]/50" />
                          </div>
                        </div>

                        {/* Nearby Elite Members - Titanium style */}
                        {mockNearbyElite.map((member, index) => {
                          const radius = (member.distance / 150) * 38;
                          const x = 50 + radius * Math.cos((member.angle - 90) * (Math.PI / 180));
                          const y = 50 + radius * Math.sin((member.angle - 90) * (Math.PI / 180));
                          return (
                            <motion.div
                              key={member.id}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.4 + 0.6 }}
                              className="absolute group cursor-pointer"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {/* Single pulse ring - subtle */}
                              <motion.div 
                                className="absolute inset-0 w-10 h-10 -m-1 rounded-full border border-[#A5A9B4]/15"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                              />
                              {/* Member Avatar - Titanium */}
                              <div className="w-9 h-9 rounded-full bg-[#0A0F0D] border border-[#A5A9B4]/30 flex items-center justify-center group-hover:border-[#D1D5DB] group-hover:scale-110 transition-all">
                                <span className="text-[10px] font-medium text-white">{member.initials}</span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Liaisons Chiffrées - Stealth Panel */}
                    <div className="space-y-4">
                      {/* Liaisons Header */}
                      <div className="p-5 rounded-2xl bg-[#0A0F0D] border border-[#A5A9B4]/10">
                        <h4 className="text-[11px] text-[#D1D5DB] tracking-[0.2em] uppercase mb-4 font-medium">
                          LIAISONS CHIFFRÉES
                        </h4>
                        
                        {/* Message Card - Alexandra */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="p-4 rounded-xl bg-[#050807] border border-[#A5A9B4]/15 mb-3"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-[#A5A9B4] tracking-wider uppercase mb-1">ALEX</span>
                              <span className="text-[11px] text-white font-medium">V.</span>
                            </div>
                            <div className="flex-1 border-l border-[#A5A9B4]/10 pl-3">
                              <p className="text-xs text-[#A5A9B4] leading-relaxed">
                                "Votre profil d'influence précède votre arrivée."
                              </p>
                              <p className="text-[10px] text-[#D1D5DB]/60 mt-2">
                                Rejoignez-nous.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Quick action icons */}
                        <div className="flex justify-end gap-2">
                          <button className="w-8 h-8 rounded-lg bg-[#050807] border border-[#A5A9B4]/10 flex items-center justify-center hover:border-[#A5A9B4]/30 transition-colors">
                            <Sparkles className="w-3.5 h-3.5 text-[#A5A9B4]" />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-[#050807] border border-[#A5A9B4]/10 flex items-center justify-center hover:border-[#A5A9B4]/30 transition-colors">
                            <Settings className="w-3.5 h-3.5 text-[#A5A9B4]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AUTHENTIFICATION TAB - Stealth Luxury */}
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
                      <h3 className="font-display text-4xl md:text-5xl text-white">
                        Authentification
                        <br /><span className="italic text-[#D1D5DB]">Absolue.</span>
                      </h3>
                      <p className="text-sm text-[#A5A9B4] mt-3">
                        Vérifiez l'authenticité d'une pièce textile d'un simple geste.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A0F0D] border border-[#A5A9B4]/15">
                      <div className="text-xs text-[#D1D5DB] uppercase tracking-wider mb-1">Liaison Blockchain</div>
                      <div className="text-sm text-white">Sécurisée & Infalsifiable</div>
                    </div>
                  </div>

                  {/* Main Grid */}
                  <div className="grid lg:grid-cols-[1fr,320px] gap-8">
                    {/* Scanner Interface */}
                    <div className="flex flex-col items-center">
                      {/* Scanner Box - Titanium */}
                      <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-[#050807] border border-[#A5A9B4]/15 flex items-center justify-center">
                        {/* Corner Brackets - Titanium */}
                        <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-[#A5A9B4]/40" />
                        <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-[#A5A9B4]/40" />
                        <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-[#A5A9B4]/40" />
                        <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-[#A5A9B4]/40" />

                        {/* Scan Line Animation - Titanium */}
                        <motion.div
                          className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#D1D5DB] to-transparent"
                          animate={{ top: ['15%', '85%', '15%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Central Content */}
                        <div className="text-center z-10">
                          <div className="w-16 h-16 rounded-2xl bg-[#0A0F0D] border border-[#A5A9B4]/20 flex items-center justify-center mx-auto mb-4">
                            <ScanLine className="w-8 h-8 text-[#D1D5DB]" />
                          </div>
                          <h4 className="font-display text-xl text-white italic mb-2">Prêt à Scanner</h4>
                          <p className="text-xs text-[#A5A9B4] max-w-[200px]">
                            Approchez votre téléphone du label thermocollé sur le vêtement.
                          </p>
                        </div>
                      </div>

                      {/* Action Button - Titanium/Platinum */}
                      <Button className="mt-6 bg-[#D1D5DB] hover:bg-white text-[#050807] gap-2 rounded-xl px-8 font-medium">
                        <Camera className="w-4 h-4" />
                        Lancer le Scan
                      </Button>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                      {/* Authenticité Info */}
                      <div className="p-6 rounded-2xl bg-[#0A0F0D] border border-[#A5A9B4]/10">
                        <h4 className="font-display text-xl text-white mb-2">
                          L'Authenticité
                          <br /><span className="italic text-[#D1D5DB]">Augmentée.</span>
                        </h4>
                        <p className="text-sm text-[#A5A9B4] leading-relaxed">
                          En scannant un vêtement i-Wasp, vous accédez à l'âme de l'article. C'est l'assurance d'une pièce unique.
                        </p>
                      </div>

                      {/* Tech Card */}
                      <div className="p-5 rounded-xl bg-[#050807] border border-[#A5A9B4]/10 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0A0F0D] flex items-center justify-center shrink-0">
                          <Cpu className="w-6 h-6 text-[#A5A9B4]" />
                        </div>
                        <div>
                          <h5 className="font-medium text-white text-sm mb-1">Puce NFC Sub-Nanos</h5>
                          <p className="text-xs text-[#A5A9B4] leading-relaxed">
                            Technologie invisible résistante aux lavages intensifs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* VISUAL LAB TAB - Stealth Luxury */}
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
                    <h3 className="font-display text-4xl md:text-5xl text-white">
                      Visual <span className="italic text-[#D1D5DB]">Lab.</span>
                    </h3>
                    <p className="text-sm text-[#A5A9B4] mt-3">
                      Créez des visuels dignes des plus grands magazines.
                    </p>
                  </div>

                  {/* Style Options - Titanium */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name: "Magazine", desc: "Style éditorial premium", active: true },
                      { name: "Minimal", desc: "Épuré et moderne", active: false },
                      { name: "Stealth", desc: "Luxe furtif", active: false },
                    ].map((style) => (
                      <div 
                        key={style.name}
                        className={cn(
                          "p-5 rounded-2xl border cursor-pointer transition-all",
                          style.active 
                            ? "bg-white text-[#050807]" 
                            : "bg-[#0A0F0D] border-[#A5A9B4]/10 text-[#A5A9B4] hover:border-[#A5A9B4]/30"
                        )}
                      >
                        <h4 className="font-medium text-sm mb-1">{style.name}</h4>
                        <p className={cn("text-xs", style.active ? "text-[#050807]/60" : "opacity-70")}>{style.desc}</p>
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
                        className="aspect-[9/16] rounded-2xl bg-[#0A0F0D] border border-[#A5A9B4]/10 flex items-center justify-center cursor-pointer hover:border-[#D1D5DB]/30 transition-all group"
                      >
                        <div className="text-center">
                          {story.type === "video" ? (
                            <Play className="w-8 h-8 text-[#A5A9B4]/40 mx-auto group-hover:text-[#D1D5DB] transition-colors" />
                          ) : (
                            <Image className="w-8 h-8 text-[#A5A9B4]/40 mx-auto group-hover:text-[#D1D5DB] transition-colors" />
                          )}
                          <span className="text-xs text-[#A5A9B4] mt-2 block">{story.title}</span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Add Story */}
                    <div className="aspect-[9/16] rounded-2xl border-2 border-dashed border-[#A5A9B4]/15 flex items-center justify-center cursor-pointer hover:border-[#D1D5DB]/30 transition-all">
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-[#A5A9B4]/40 mx-auto" />
                        <span className="text-xs text-[#A5A9B4] mt-2 block">Ajouter</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* LA MANUFACTURE TAB - Stealth Luxury */}
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
                      <h3 className="font-display text-4xl md:text-5xl text-white">
                        L'Art de la <span className="italic text-[#D1D5DB]">Matière.</span>
                      </h3>
                      <p className="text-sm text-[#A5A9B4] mt-3">
                        Chaque objet i-Wasp est une pièce d'exception.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-[#A5A9B4]/50 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[10px] tracking-widest uppercase">Série Limitée</span>
                      </div>
                      <div className="font-display text-2xl text-white">N°001</div>
                      <div className="text-[10px] text-[#D1D5DB] tracking-wider uppercase">Fondateur</div>
                    </div>
                  </div>

                  {/* Product Cards Grid - Titanium theme */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1: La Carte Titane */}
                    <div className="p-6 rounded-3xl bg-[#0A0F0D] border border-[#A5A9B4]/15 flex flex-col">
                      <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-[#A5A9B4] via-[#D1D5DB] to-[#A5A9B4] mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <div className="text-center">
                          <span className="text-[8px] text-[#050807]/70 block tracking-wider">i -</span>
                          <span className="text-xs text-[#050807] font-bold tracking-widest">WASP</span>
                          <span className="text-[8px] text-[#050807]/60 block">TITANIUM</span>
                        </div>
                      </div>
                      <h4 className="font-display text-xl text-white italic mb-1">La Carte</h4>
                      <p className="text-sm text-[#D1D5DB] uppercase tracking-wider mb-4">Titane</p>
                      <p className="text-xs text-[#A5A9B4] leading-relaxed flex-1">
                        Forgée dans un acier inoxydable brossé. Un poids noble pour une présence inoubliable.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-[#A5A9B4]/30 text-white hover:bg-[#A5A9B4]/10 rounded-xl text-xs"
                      >
                        Personnaliser
                      </Button>
                    </div>

                    {/* Card 2: L'Ongle Aura */}
                    <div className="p-6 rounded-3xl bg-[#0A0F0D] border border-[#A5A9B4]/10 flex flex-col">
                      <div className="w-20 h-24 rounded-2xl bg-[#050807] border border-[#A5A9B4]/20 mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-[#D1D5DB]" />
                      </div>
                      <h4 className="font-display text-xl text-white mb-1">L'Ongle</h4>
                      <p className="text-sm text-[#A5A9B4] uppercase tracking-wider mb-4">Aura</p>
                      <p className="text-xs text-[#A5A9B4] leading-relaxed flex-1">
                        Une micro-puce de 0.1mm intégrable en onglerie. Partagez votre monde d'un simple geste.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-[#A5A9B4]/20 text-white hover:bg-[#A5A9B4]/10 rounded-xl text-xs"
                      >
                        Réserver une Pose
                      </Button>
                    </div>

                    {/* Card 3: Label Couture */}
                    <div className="p-6 rounded-3xl bg-[#0A0F0D] border border-[#A5A9B4]/10 flex flex-col">
                      <div className="w-20 h-24 rounded-2xl bg-[#050807] border border-[#A5A9B4]/20 mx-auto mb-4 flex items-center justify-center">
                        <Shirt className="w-8 h-8 text-[#A5A9B4]" />
                      </div>
                      <h4 className="font-display text-xl text-white mb-1">Label</h4>
                      <p className="text-sm text-[#A5A9B4] uppercase tracking-wider mb-4">Couture</p>
                      <p className="text-xs text-[#A5A9B4] leading-relaxed flex-1">
                        Puce thermocollante au fer à repasser. Authentifie vos vêtements de luxe.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 w-full border-[#A5A9B4]/20 text-white hover:bg-[#A5A9B4]/10 rounded-xl text-xs"
                      >
                        Acheter le Kit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LE COFFRE (NFT) TAB - Stealth Luxury */}
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
                    <h3 className="font-display text-4xl md:text-5xl text-white">
                      Le <span className="italic text-[#D1D5DB]">Coffre.</span>
                    </h3>
                    <p className="text-sm text-[#A5A9B4] mt-3">
                      Passeport Digital Blockchain : chaque vêtement devient un actif authentifié.
                    </p>
                  </div>

                  {/* Blockchain Info - Titanium */}
                  <div className="p-6 rounded-3xl bg-[#0A0F0D] border border-[#A5A9B4]/15">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#A5A9B4]/10 flex items-center justify-center">
                        <Link2 className="w-6 h-6 text-[#D1D5DB]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Authentification Blockchain</h4>
                        <p className="text-sm text-[#A5A9B4]">Vos vêtements possèdent un jumeau numérique inviolable.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-xl bg-[#050807] border border-[#A5A9B4]/10">
                        <div className="text-2xl font-display text-[#D1D5DB]">{nftAssets.length}</div>
                        <div className="text-xs text-[#A5A9B4]">Actifs Certifiés</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#050807] border border-[#A5A9B4]/10">
                        <div className="text-2xl font-display text-white">100%</div>
                        <div className="text-xs text-[#A5A9B4]">Authentiques</div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#050807] border border-[#A5A9B4]/10">
                        <div className="text-2xl font-display text-white">∞</div>
                        <div className="text-xs text-[#A5A9B4]">Traçabilité</div>
                      </div>
                    </div>
                  </div>

                  {/* NFT Assets Grid */}
                  <div className="space-y-4">
                    <h4 className="text-xs text-[#A5A9B4] tracking-[0.2em] uppercase">
                      Vos Actifs Numériques
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {nftAssets.map((asset, index) => (
                        <motion.div
                          key={asset.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 rounded-2xl bg-[#0A0F0D] border border-[#A5A9B4]/10 hover:border-[#D1D5DB]/30 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-[#050807] border border-[#A5A9B4]/15 flex items-center justify-center">
                              {asset.type === "garment" ? (
                                <Shirt className="w-6 h-6 text-[#A5A9B4]" />
                              ) : (
                                <Boxes className="w-6 h-6 text-[#A5A9B4]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{asset.name}</h4>
                              <p className="text-xs text-[#D1D5DB]">{asset.brand}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <BadgeCheck className="w-3 h-3 text-[#D1D5DB]" />
                                <span className="text-[10px] text-[#A5A9B4] font-mono">{asset.tokenId}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Add New Asset */}
                      <div className="p-5 rounded-2xl border-2 border-dashed border-[#A5A9B4]/15 hover:border-[#D1D5DB]/30 transition-all cursor-pointer flex items-center justify-center min-h-[120px]">
                        <div className="text-center">
                          <Plus className="w-6 h-6 text-[#A5A9B4]/40 mx-auto mb-2" />
                          <span className="text-xs text-[#A5A9B4]">Ajouter un vêtement</span>
                        </div>
                      </div>
                    </div>
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
