/**
 * Sovereign Master OS - Dashboard Elite ULTRA
 * Design: Obsidian Stealth (Noir Abyssal #050807, Titane Brossé #A5A9B4)
 * 
 * Features:
 * - Magic Architect: IA configuration visuelle
 * - Legacy Map: Carte mondiale interactive
 * - Alliance Chat: Canal VIP temps réel
 * - Arsenal: Produits premium
 * - Sovereign Dock: Navigation mobile fluide
 * - Premium Animations & Effects
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Globe, Wand2, Flag, ShoppingBag, MessageSquare,
  CreditCard, Diamond, Shirt, Fingerprint, Check,
  Send, Loader2, ArrowRight, Crown, Sparkles,
  Users, Home, Zap, Radio, ExternalLink
} from "lucide-react";
import { SovereignCelebration } from "@/components/SovereignCelebration";
import { SovereignTicker } from "@/components/SovereignTicker";

// === PALETTE OBSIDIAN STEALTH ===
const OBSIDIAN = {
  bg: "#050807",
  bgCard: "#0A0C0B",
  bgInput: "#0F1110",
  border: "rgba(165, 169, 180, 0.1)",
  borderHover: "rgba(165, 169, 180, 0.2)",
  borderActive: "rgba(165, 169, 180, 0.4)",
  text: "#D1D5DB",
  textSecondary: "rgba(165, 169, 180, 0.6)",
  textMuted: "rgba(165, 169, 180, 0.4)",
  accent: "#A5A9B4",
  accentHover: "#D1D5DB",
  accentMuted: "rgba(165, 169, 180, 0.15)",
  emerald: "#0D9488",
  emeraldGlow: "rgba(13, 148, 136, 0.3)",
  success: "#4ADE80",
  gradient: "linear-gradient(135deg, #A5A9B4, #D1D5DB)",
  shadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
  glow: "0 0 60px rgba(165, 169, 180, 0.2)",
};

// === TYPES ===
interface AllianceMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

interface LegacyFlag {
  id: string;
  name: string;
  city: string;
  x_position: number;
  y_position: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  desc: string;
  icon: typeof CreditCard;
  tag: string;
}

// === MASTER IDENTITY ===
const MASTER_IDENTITY = {
  name: "Membre Sovereign",
  title: "Elite Network Member",
  address: "Worldwide",
  phone: "",
  email: "",
  avatar: "S",
  status: "Sovereign Member"
};

// === PRODUCTS ARSENAL ===
const PRODUCTS: Product[] = [
  { id: "1", name: "Sovereign Card Titane", price: 290, desc: "Acier chirurgical, gravure laser premium.", icon: CreditCard, tag: "Must-Have" },
  { id: "2", name: "Bague NFC Optic N-X", price: 580, desc: "Céramique & NFC furtif. Édition limitée.", icon: Diamond, tag: "Elite Series" },
  { id: "3", name: "Veste Couture Sovereign", price: 1250, desc: "Haute couture avec 5 puces NFC intégrées.", icon: Shirt, tag: "Masterpiece" },
  { id: "4", name: "Label Couture NFC (x10)", price: 350, desc: "Signez vos vêtements avec votre identité.", icon: Fingerprint, tag: "Expansion" },
];

// === FLOATING ORB COMPONENT ===
const FloatingOrb = ({ delay = 0, size = 400, x = "50%", y = "50%" }: { delay?: number; size?: number; x?: string; y?: string }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle, ${OBSIDIAN.accent}10 0%, transparent 70%)`,
      filter: "blur(60px)",
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

// === GRID BACKGROUND ===
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
      <defs>
        <pattern id="sovereign-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={OBSIDIAN.accent} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sovereign-grid)" />
    </svg>
  </div>
);

export default function SovereignDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // === STATE ===
  const [activeTab, setActiveTab] = useState<string>("home");
  const [messages, setMessages] = useState<AllianceMessage[]>([]);
  const [legacyFlags, setLegacyFlags] = useState<LegacyFlag[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [magicInput, setMagicInput] = useState("");
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [globalReach, setGlobalReach] = useState(24829103);
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [identity, setIdentity] = useState(MASTER_IDENTITY);
  const [time, setTime] = useState(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

  // === REALTIME SUBSCRIPTIONS ===
  useEffect(() => {
    const chatChannel = supabase
      .channel("alliance-chat-sovereign")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alliance_chat" },
        (payload) => setMessages((prev) => [payload.new as AllianceMessage, ...prev.slice(0, 14)])
      )
      .subscribe();

    const flagsChannel = supabase
      .channel("legacy-flags-sovereign")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "legacy_flags" },
        (payload) => setLegacyFlags((prev) => [...prev, payload.new as LegacyFlag])
      )
      .subscribe();

    fetchMessages();
    fetchFlags();
    fetchUserProfile();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(flagsChannel);
    };
  }, [user]);

  // === GLOBAL REACH & TIME ===
  useEffect(() => {
    const reachTimer = setInterval(() => {
      setGlobalReach((prev) => prev + Math.floor(Math.random() * 15));
    }, 1000);
    const timeTimer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => {
      clearInterval(reachTimer);
      clearInterval(timeTimer);
    };
  }, []);

  // === DATA FETCHING ===
  const fetchMessages = async () => {
    const { data } = await supabase.from("alliance_chat").select("*").order("created_at", { ascending: false }).limit(15);
    if (data) setMessages(data);
  };

  const fetchFlags = async () => {
    const { data } = await supabase.from("legacy_flags").select("*").order("created_at", { ascending: false }).limit(100);
    if (data) setLegacyFlags(data);
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("first_name, last_name").eq("user_id", user.id).single();
    if (data) {
      const name = `${data.first_name || ''} ${data.last_name || ''}`.trim() || "Membre Sovereign";
      setIdentity(prev => ({
        ...prev,
        name,
        avatar: name.charAt(0).toUpperCase(),
      }));
    }
  };

  // === ACTIONS ===
  const sendAllianceMessage = async () => {
    if (!chatMessage.trim() || !user) {
      toast.error("Connectez-vous pour envoyer un message");
      return;
    }
    const { error } = await supabase.from("alliance_chat").insert({
      user_id: user.id,
      name: identity.name,
      message: chatMessage.trim(),
    });
    if (error) toast.error("Erreur d'envoi");
    else {
      setChatMessage("");
      toast.success("Transmission envoyée");
    }
  };

  const plantFlag = async () => {
    if (!user) {
      toast.error("Connectez-vous pour planter votre drapeau");
      return;
    }
    const { error } = await supabase.from("legacy_flags").insert({
      user_id: user.id,
      name: identity.name,
      city: "Membre Elite",
      x_position: 15 + Math.random() * 70,
      y_position: 20 + Math.random() * 50,
    });
    if (error) toast.error("Erreur lors du scellement");
    else {
      setShowCelebration(true);
      toast.success("🚩 Héritage scellé éternellement");
      setTimeout(() => setShowCelebration(false), 3000);
      setActiveTab("legacy");
    }
  };

  const handleMagicArchitect = async () => {
    if (!magicInput) {
      toast.error("Entrez un SIRET ou une URL");
      return;
    }
    setIsMagicLoading(true);
    toast.info("Architecte Neural : Analyse en cours...");
    await new Promise((r) => setTimeout(r, 3500));
    
    setIdentity({
      name: "Identité Souveraine",
      title: "Certified Sovereign Member",
      address: "Global Network",
      phone: "",
      email: "",
      avatar: magicInput.charAt(0).toUpperCase(),
      status: "Scellé ✓"
    });
    
    setIsMagicLoading(false);
    setShowCelebration(true);
    toast.success("Identité scellée. Empire configuré.");
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: product.id, qty: 1 }];
    });
    toast.success(`${product.name} ajouté`);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      return acc + (product?.price || 0) * item.qty;
    }, 0);
  }, [cart]);

  // === TABS CONFIG ===
  const tabs = [
    { id: "home", label: "Hégémonie", icon: Globe },
    { id: "magic", label: "Magic Architect", icon: Wand2 },
    { id: "legacy", label: "Legacy Map", icon: Flag },
    { id: "chat", label: "Alliance Chat", icon: MessageSquare },
    { id: "shop", label: "Arsenal", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen font-sans relative overflow-hidden" style={{ backgroundColor: OBSIDIAN.bg }}>
      {/* === BACKGROUND EFFECTS === */}
      <GridBackground />
      <FloatingOrb delay={0} size={600} x="20%" y="30%" />
      <FloatingOrb delay={2} size={500} x="70%" y="60%" />
      <FloatingOrb delay={4} size={400} x="50%" y="20%" />
      
      {/* === CELEBRATION === */}
      <SovereignCelebration active={showCelebration} />
      
      {/* === TICKER === */}
      <div className="relative z-10">
        <SovereignTicker messages={[
          `ALLIANCE ACTIVE : ${legacyFlags.length} MEMBRES`,
          'HÉGÉMONIE MONDIALE : STANDARD N°1',
          `PORTÉE GLOBALE : ${globalReach.toLocaleString()}`,
          'SOVEREIGN NETWORK : LIVE',
        ]} />
      </div>

      {/* === TOPBAR === */}
      <header
        className="sticky top-0 z-40 backdrop-blur-2xl"
        style={{
          backgroundColor: `${OBSIDIAN.bg}CC`,
          borderBottom: `1px solid ${OBSIDIAN.border}`,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg"
              style={{ 
                background: OBSIDIAN.gradient, 
                color: OBSIDIAN.bg,
                boxShadow: OBSIDIAN.glow,
              }}
            >
              iW
            </div>
            <div>
              <p className="font-bold text-base tracking-tight" style={{ color: OBSIDIAN.text }}>
                I-WASP.COM
              </p>
              <p className="text-xs tracking-widest uppercase" style={{ color: OBSIDIAN.textMuted }}>
                Sovereign Standard N°1
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: OBSIDIAN.accentMuted }}>
              <Radio className="w-3 h-3 animate-pulse" style={{ color: OBSIDIAN.emerald }} />
              <span className="text-xs font-medium" style={{ color: OBSIDIAN.text }}>{time}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest" style={{ color: OBSIDIAN.textMuted }}>Portée Live</p>
              <p className="font-bold text-lg tabular-nums" style={{ color: OBSIDIAN.accent }}>
                {globalReach.toLocaleString()}
              </p>
            </div>
            {cart.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
              >
                {cart.length} • {cartTotal}€
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>

      {/* === MAIN LAYOUT === */}
      <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        {/* === SIDEBAR === */}
        <motion.aside 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex flex-col gap-3 w-72 shrink-0"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left"
                style={{
                  backgroundColor: isActive ? OBSIDIAN.accent : OBSIDIAN.bgCard,
                  color: isActive ? OBSIDIAN.bg : OBSIDIAN.textSecondary,
                  border: `1px solid ${isActive ? OBSIDIAN.accent : OBSIDIAN.border}`,
                  boxShadow: isActive ? OBSIDIAN.glow : "none",
                }}
              >
                <Icon size={22} />
                <span className="font-semibold">{tab.label}</span>
                {isActive && <Zap size={14} className="ml-auto" />}
              </motion.button>
            );
          })}
          
          {/* Identity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-3xl p-5"
            style={{
              backgroundColor: OBSIDIAN.bgCard,
              border: `1px solid ${OBSIDIAN.border}`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ 
                  boxShadow: [
                    `0 0 0 0 ${OBSIDIAN.emerald}40`,
                    `0 0 0 8px ${OBSIDIAN.emerald}00`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl"
                style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
              >
                {identity.avatar}
              </motion.div>
              <div>
                <p className="font-bold" style={{ color: OBSIDIAN.text }}>{identity.name}</p>
                <p className="text-xs flex items-center gap-1" style={{ color: OBSIDIAN.emerald }}>
                  <Crown size={10} /> {identity.status}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
              style={{ border: `1px solid ${OBSIDIAN.border}`, color: OBSIDIAN.textSecondary }}
            >
              <ExternalLink size={14} />
              Mon Dashboard
            </button>
          </motion.div>

          {/* Alliance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-4"
            style={{ backgroundColor: OBSIDIAN.bgCard, border: `1px solid ${OBSIDIAN.border}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} style={{ color: OBSIDIAN.accent }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: OBSIDIAN.textMuted }}>Alliance Power</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold" style={{ color: OBSIDIAN.accent }}>{legacyFlags.length}</span>
              <span className="text-xs" style={{ color: OBSIDIAN.textMuted }}>membres actifs</span>
            </div>
          </motion.div>
        </motion.aside>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* HOME TAB */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                {/* Hero */}
                <div className="text-center py-16 relative">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p
                      className="text-xs uppercase tracking-[0.4em] mb-6"
                      style={{ color: OBSIDIAN.emerald }}
                    >
                      Sovereign Standard World N°1
                    </p>
                    <h1
                      className="text-5xl md:text-7xl font-bold mb-8 leading-[0.95]"
                      style={{ color: OBSIDIAN.text, fontFamily: "'Playfair Display', serif" }}
                    >
                      Dominez<br />
                      <span style={{ color: OBSIDIAN.accent }}>L'Espace.</span>
                    </h1>
                    <p
                      className="max-w-2xl mx-auto text-lg italic mb-10 leading-relaxed"
                      style={{ color: OBSIDIAN.textSecondary }}
                    >
                      "i-Wasp est la force motrice de l'identité phygitale mondiale. 
                      Une fusion irréversible entre présence physique et hégémonie digitale."
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("shop")}
                      className="px-10 py-5 rounded-full font-bold uppercase tracking-wider text-lg"
                      style={{
                        background: OBSIDIAN.gradient,
                        color: OBSIDIAN.bg,
                        boxShadow: OBSIDIAN.glow,
                      }}
                    >
                      Ouvrir l'Arsenal
                      <ArrowRight className="inline ml-3" size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("magic")}
                      className="px-10 py-5 rounded-full font-bold uppercase tracking-wider text-lg"
                      style={{
                        border: `2px solid ${OBSIDIAN.border}`,
                        color: OBSIDIAN.text,
                      }}
                    >
                      <Wand2 className="inline mr-3" size={20} />
                      Architecte ID
                    </motion.button>
                  </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[
                    { label: "Portée Globale", value: globalReach.toLocaleString(), icon: Globe },
                    { label: "Membres Elite", value: legacyFlags.length.toLocaleString(), icon: Users },
                    { label: "Messages", value: messages.length.toString(), icon: MessageSquare },
                    { label: "Produits", value: PRODUCTS.length.toString(), icon: ShoppingBag },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        className="p-6 rounded-3xl text-center"
                        style={{
                          backgroundColor: OBSIDIAN.bgCard,
                          border: `1px solid ${OBSIDIAN.border}`,
                        }}
                      >
                        <Icon size={24} className="mx-auto mb-3" style={{ color: OBSIDIAN.accent }} />
                        <p className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: OBSIDIAN.accent }}>
                          {stat.value}
                        </p>
                        <p className="text-xs uppercase tracking-wider mt-1" style={{ color: OBSIDIAN.textMuted }}>
                          {stat.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

            {/* MAGIC ARCHITECT TAB */}
            {activeTab === "magic" && (
              <motion.div
                key="magic"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                    style={{ background: OBSIDIAN.gradient, boxShadow: OBSIDIAN.glow }}
                  >
                    <Wand2 size={36} style={{ color: OBSIDIAN.bg }} />
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: OBSIDIAN.text, fontFamily: "'Playfair Display', serif" }}>
                    Magic<br /><span style={{ color: OBSIDIAN.accent }}>Architect.</span>
                  </h2>
                  <p className="max-w-lg mx-auto" style={{ color: OBSIDIAN.textSecondary }}>
                    Scannez l'ADN de votre établissement. Notre IA forge en 5 secondes une identité souveraine.
                  </p>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="rounded-3xl p-8"
                  style={{ backgroundColor: OBSIDIAN.bgCard, border: `1px solid ${OBSIDIAN.border}` }}
                >
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={magicInput}
                      onChange={(e) => setMagicInput(e.target.value)}
                      placeholder="SIRET, URL site web, ou nom d'entreprise..."
                      className="flex-1 px-6 py-4 rounded-2xl focus:outline-none text-lg"
                      style={{
                        backgroundColor: OBSIDIAN.bgInput,
                        border: `1px solid ${OBSIDIAN.border}`,
                        color: OBSIDIAN.text,
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMagicArchitect}
                      disabled={isMagicLoading}
                      className="px-8 py-4 rounded-2xl font-bold flex items-center gap-3"
                      style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
                    >
                      {isMagicLoading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={24} /> Scanner</>}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Identity Preview */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl p-8"
                  style={{
                    backgroundColor: OBSIDIAN.bgCard,
                    border: `1px solid ${OBSIDIAN.emerald}40`,
                    boxShadow: `0 0 60px ${OBSIDIAN.emeraldGlow}`,
                  }}
                >
                  <div className="flex items-center gap-6 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl"
                      style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
                    >
                      {identity.avatar}
                    </motion.div>
                    <div>
                      <p className="font-bold text-2xl" style={{ color: OBSIDIAN.text }}>{identity.name}</p>
                      <p className="text-lg" style={{ color: OBSIDIAN.textSecondary }}>{identity.title}</p>
                      <p className="text-sm mt-1 flex items-center gap-2" style={{ color: OBSIDIAN.emerald }}>
                        <Check size={14} /> {identity.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* LEGACY MAP TAB */}
            {activeTab === "legacy" && (
              <motion.div
                key="legacy"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                <div className="text-center py-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: OBSIDIAN.text, fontFamily: "'Playfair Display', serif" }}>
                    Legacy<br /><span style={{ color: OBSIDIAN.accent }}>Map.</span>
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>
                    Le registre mondial de l'hégémonie. {legacyFlags.length} membres scellés.
                  </p>
                </div>

                {/* World Map */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative h-[450px] rounded-3xl overflow-hidden"
                  style={{ backgroundColor: OBSIDIAN.bgCard, border: `1px solid ${OBSIDIAN.border}` }}
                >
                  <GridBackground />
                  
                  {/* Flags */}
                  {legacyFlags.map((flag, index) => (
                    <motion.div
                      key={flag.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="absolute group cursor-pointer"
                      style={{ left: `${flag.x_position}%`, top: `${flag.y_position}%` }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: OBSIDIAN.accent, boxShadow: `0 0 10px ${OBSIDIAN.accent}` }}
                      />
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                        style={{ backgroundColor: OBSIDIAN.bg, border: `1px solid ${OBSIDIAN.border}` }}
                      >
                        <p className="text-xs font-bold" style={{ color: OBSIDIAN.text }}>{flag.name}</p>
                        <p className="text-[10px]" style={{ color: OBSIDIAN.textMuted }}>{flag.city}</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* HQ Marker */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: OBSIDIAN.gradient, boxShadow: OBSIDIAN.glow }}>
                      <Crown size={16} style={{ color: OBSIDIAN.bg }} />
                    </div>
                    <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap" style={{ color: OBSIDIAN.accent }}>
                      IWASP HQ
                    </p>
                  </motion.div>

                  {/* Stats overlay */}
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl backdrop-blur-xl" style={{ backgroundColor: `${OBSIDIAN.bg}CC` }}>
                    <p className="text-xs font-bold" style={{ color: OBSIDIAN.accent }}>{legacyFlags.length} Nodes Elite</p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={plantFlag}
                  className="w-full py-5 rounded-2xl font-bold uppercase tracking-wider text-lg flex items-center justify-center gap-3"
                  style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff", boxShadow: `0 0 40px ${OBSIDIAN.emeraldGlow}` }}
                >
                  <Flag size={22} />
                  Planter mon Drapeau
                </motion.button>
              </motion.div>
            )}

            {/* ALLIANCE CHAT TAB */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: OBSIDIAN.text, fontFamily: "'Playfair Display', serif" }}>
                    Alliance<br /><span style={{ color: OBSIDIAN.accent }}>Chat.</span>
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>Canal VIP sécurisé. {messages.length} transmissions.</p>
                </div>

                {/* Messages */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="h-[400px] overflow-y-auto rounded-3xl p-5 space-y-3 custom-scrollbar"
                  style={{ backgroundColor: OBSIDIAN.bgCard, border: `1px solid ${OBSIDIAN.border}` }}
                >
                  {messages.length === 0 ? (
                    <p className="text-center py-12" style={{ color: OBSIDIAN.textMuted }}>
                      Silence souverain. En attente de transmission...
                    </p>
                  ) : (
                    messages.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-2xl"
                        style={{ backgroundColor: OBSIDIAN.bgInput }}
                      >
                        <p className="font-bold text-sm mb-1" style={{ color: OBSIDIAN.accent }}>{msg.name}</p>
                        <p style={{ color: OBSIDIAN.text }}>"{msg.message}"</p>
                      </motion.div>
                    ))
                  )}
                </motion.div>

                {/* Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendAllianceMessage()}
                    placeholder="Votre transmission..."
                    className="flex-1 px-6 py-4 rounded-2xl focus:outline-none"
                    style={{ backgroundColor: OBSIDIAN.bgInput, border: `1px solid ${OBSIDIAN.border}`, color: OBSIDIAN.text }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendAllianceMessage}
                    className="px-8 py-4 rounded-2xl"
                    style={{ background: OBSIDIAN.gradient, color: OBSIDIAN.bg }}
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ARSENAL TAB */}
            {activeTab === "shop" && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                <div className="text-center py-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: OBSIDIAN.text, fontFamily: "'Playfair Display', serif" }}>
                    L'Arsenal.<br /><span style={{ color: OBSIDIAN.accent }}>Manufacture.</span>
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>
                    Chaque pièce est forgée individuellement pour sceller votre destinée numérique.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {PRODUCTS.map((product, index) => {
                    const Icon = product.icon;
                    const inCart = cart.find((i) => i.id === product.id);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="rounded-3xl p-6 transition-all"
                        style={{ backgroundColor: OBSIDIAN.bgCard, border: `1px solid ${OBSIDIAN.border}` }}
                      >
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: OBSIDIAN.accentMuted }}>
                            <Icon size={28} style={{ color: OBSIDIAN.accent }} />
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider" style={{ backgroundColor: OBSIDIAN.emeraldGlow, color: OBSIDIAN.emerald }}>
                              {product.tag}
                            </span>
                            <p className="font-bold text-lg mt-2" style={{ color: OBSIDIAN.text }}>{product.name}</p>
                            <p className="text-sm" style={{ color: OBSIDIAN.textMuted }}>{product.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-3xl font-bold" style={{ color: OBSIDIAN.accent }}>{product.price}€</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(product)}
                            className="px-6 py-3 rounded-full font-bold flex items-center gap-2"
                            style={{
                              backgroundColor: inCart ? OBSIDIAN.emerald : OBSIDIAN.accent,
                              color: inCart ? "#fff" : OBSIDIAN.bg,
                            }}
                          >
                            {inCart ? <><Check size={16} /> x{inCart.qty}</> : "Sceller"}
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {cart.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="rounded-3xl p-6"
                    style={{ backgroundColor: OBSIDIAN.emeraldGlow, border: `1px solid ${OBSIDIAN.emerald}` }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xl" style={{ color: OBSIDIAN.text }}>Total: {cartTotal}€</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/order/type")}
                        className="px-8 py-4 rounded-full font-bold uppercase tracking-wider"
                        style={{ background: OBSIDIAN.gradient, color: OBSIDIAN.bg }}
                      >
                        Valider <ArrowRight className="inline ml-2" size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* === SOVEREIGN DOCK (Mobile) === */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden backdrop-blur-2xl"
        style={{ backgroundColor: `${OBSIDIAN.bg}E6`, borderTop: `1px solid ${OBSIDIAN.border}` }}
      >
        <div className="flex justify-around items-center py-3 px-2">
          {[
            { id: "home", icon: Home, label: "Dash" },
            { id: "magic", icon: Wand2, label: "Magic" },
            { id: "legacy", icon: Flag, label: "Legacy" },
            { id: "chat", icon: MessageSquare, label: "Chat" },
            { id: "shop", icon: ShoppingBag, label: "Shop" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: isActive ? OBSIDIAN.accent : "transparent",
                  color: isActive ? OBSIDIAN.bg : OBSIDIAN.textMuted,
                }}
              >
                <Icon size={22} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile dock */}
      <div className="h-24 lg:hidden" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${OBSIDIAN.accent}40; border-radius: 4px; }
      `}</style>
    </div>
  );
}
