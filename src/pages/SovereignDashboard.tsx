/**
 * Sovereign Master OS - Dashboard Elite
 * Design: Obsidian Stealth (Noir Abyssal #050807, Titane Brossé #A5A9B4, Émeraude #0D9488)
 * 
 * Features:
 * - Magic Architect: IA configuration visuelle
 * - Legacy Map: Carte mondiale interactive
 * - Alliance Chat: Canal VIP temps réel
 * - Arsenal: Produits premium
 * - Sovereign Dock: Navigation mobile fluide
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Globe, Wand2, Flag, ShoppingBag, MessageSquare,
  CreditCard, Diamond, Shirt, Fingerprint, Check,
  Send, Loader2, ArrowRight, Crown, Sparkles,
  MapPin, Users, Radio, Home, Mic
} from "lucide-react";

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
  name: "Ariella KHIAT COHEN",
  title: "Avocat à la Cour",
  address: "6 rue Ruhmkorff - 75017 Paris",
  phone: "09.83.83.33.64",
  email: "akc.avocate@gmail.com",
  avatar: "AKC",
  status: "Sovereign Member"
};

// === PRODUCTS ARSENAL ===
const PRODUCTS: Product[] = [
  { id: "1", name: "Sovereign Card Titane", price: 290, desc: "Acier chirurgical, gravure laser premium.", icon: CreditCard, tag: "Must-Have" },
  { id: "2", name: "Bague NFC Optic N-X", price: 580, desc: "Céramique & NFC furtif. Édition limitée.", icon: Diamond, tag: "Elite Series" },
  { id: "3", name: "Veste Couture Sovereign", price: 1250, desc: "Haute couture avec 5 puces NFC intégrées.", icon: Shirt, tag: "Masterpiece" },
  { id: "4", name: "Label Couture NFC (x10)", price: 350, desc: "Signez vos vêtements avec votre identité.", icon: Fingerprint, tag: "Expansion" },
];

// === CELEBRATION EFFECT ===
const CelebrationEffect = ({ active }: { active: boolean }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <div 
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
        style={{ background: OBSIDIAN.emeraldGlow }}
      />
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          initial={{ 
            x: "50vw", 
            y: "50vh",
            opacity: 1 
          }}
          animate={{ 
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0
          }}
          transition={{ 
            duration: 2 + Math.random() * 2,
            ease: "easeOut"
          }}
          style={{ backgroundColor: OBSIDIAN.accent }}
        />
      ))}
    </div>
  );
};

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

  // === REALTIME SUBSCRIPTIONS ===
  useEffect(() => {
    // Subscribe to Alliance Chat
    const chatChannel = supabase
      .channel("alliance-chat-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alliance_chat" },
        (payload) => {
          setMessages((prev) => [payload.new as AllianceMessage, ...prev.slice(0, 14)]);
        }
      )
      .subscribe();

    // Subscribe to Legacy Flags
    const flagsChannel = supabase
      .channel("legacy-flags-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "legacy_flags" },
        (payload) => {
          setLegacyFlags((prev) => [...prev, payload.new as LegacyFlag]);
        }
      )
      .subscribe();

    // Fetch initial data
    fetchMessages();
    fetchFlags();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(flagsChannel);
    };
  }, []);

  // === GLOBAL REACH COUNTER ===
  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalReach((prev) => prev + Math.floor(Math.random() * 15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // === DATA FETCHING ===
  const fetchMessages = async () => {
    const { data } = await supabase
      .from("alliance_chat")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(15);
    if (data) setMessages(data);
  };

  const fetchFlags = async () => {
    const { data } = await supabase
      .from("legacy_flags")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setLegacyFlags(data);
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
    
    if (error) {
      toast.error("Erreur d'envoi");
    } else {
      setChatMessage("");
      toast.success("Message envoyé à l'Alliance");
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
      city: identity.address,
      x_position: 15 + Math.random() * 70,
      y_position: 20 + Math.random() * 50,
    });
    
    if (error) {
      toast.error("Erreur lors du scellement");
    } else {
      setShowCelebration(true);
      toast.success("Lignée inscrite éternellement");
      setTimeout(() => setShowCelebration(false), 5000);
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
    
    // Simulate AI processing
    await new Promise((r) => setTimeout(r, 3000));
    
    const isSite = magicInput.includes("http");
    setIdentity({
      name: isSite ? "Identité Extraite" : "Entreprise Détectée",
      title: "Identité Souveraine Certifiée",
      address: "France - World Hub",
      phone: "09.83.83.33.64",
      email: "contact@sovereign.com",
      avatar: magicInput.charAt(0).toUpperCase(),
      status: "Membre Sovereign"
    });
    
    setIsMagicLoading(false);
    setShowCelebration(true);
    toast.success("Identité scellée. Empire configuré.");
    setTimeout(() => setShowCelebration(false), 5000);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
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

  // === TABS ===
  const tabs = [
    { id: "home", label: "Hégémonie", icon: Globe },
    { id: "magic", label: "Magic Architect", icon: Wand2 },
    { id: "legacy", label: "Legacy Map", icon: Flag },
    { id: "chat", label: "Alliance Chat", icon: MessageSquare },
    { id: "shop", label: "Arsenal", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: OBSIDIAN.bg }}>
      <CelebrationEffect active={showCelebration} />
      
      {/* === TOPBAR === */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl"
        style={{
          backgroundColor: `${OBSIDIAN.bg}E6`,
          borderBottom: `1px solid ${OBSIDIAN.border}`,
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{ backgroundColor: OBSIDIAN.accent, color: OBSIDIAN.bg }}
            >
              iW
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: OBSIDIAN.text }}>
                I-WASP.COM
              </p>
              <p className="text-xs" style={{ color: OBSIDIAN.textMuted }}>
                Sovereign Standard N°1
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs" style={{ color: OBSIDIAN.textMuted }}>Portée Collective</p>
              <p className="font-bold" style={{ color: OBSIDIAN.accent }}>
                {globalReach.toLocaleString()} Interactions
              </p>
            </div>
            {cart.length > 0 && (
              <div
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
              >
                {cart.length} • {cartTotal}€
              </div>
            )}
          </div>
        </div>
      </header>

      {/* === MAIN LAYOUT === */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* === SIDEBAR (Desktop) === */}
        <aside className="hidden lg:flex flex-col gap-2 w-64 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left"
                style={{
                  backgroundColor: isActive ? OBSIDIAN.accent : "transparent",
                  color: isActive ? OBSIDIAN.bg : OBSIDIAN.textSecondary,
                  boxShadow: isActive ? OBSIDIAN.glow : "none",
                }}
              >
                <Icon size={20} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
          
          {/* Identity Card */}
          <div
            className="mt-6 rounded-2xl p-4"
            style={{
              backgroundColor: OBSIDIAN.bgCard,
              border: `1px solid ${OBSIDIAN.border}`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
              >
                {identity.avatar}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: OBSIDIAN.text }}>
                  {identity.name}
                </p>
                <p className="text-xs" style={{ color: OBSIDIAN.textMuted }}>
                  {identity.status}
                </p>
              </div>
            </div>
            <p className="text-xs" style={{ color: OBSIDIAN.textSecondary }}>
              {identity.title}
            </p>
          </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* HOME TAB */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Hero */}
                <div className="text-center py-12">
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-4"
                    style={{ color: OBSIDIAN.emerald }}
                  >
                    Sovereign Standard World N°1
                  </p>
                  <h1
                    className="text-4xl md:text-6xl font-bold mb-6"
                    style={{ color: OBSIDIAN.text, fontFamily: "'Bodoni Moda', serif" }}
                  >
                    Dominez<br />L'Espace.
                  </h1>
                  <p
                    className="max-w-xl mx-auto text-lg italic mb-8"
                    style={{ color: OBSIDIAN.textSecondary }}
                  >
                    "i-Wasp est la force motrice de l'identité phygitale mondiale. 
                    Une fusion irréversible entre présence physique et hégémonie digitale."
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => setActiveTab("shop")}
                      className="px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105"
                      style={{
                        backgroundColor: OBSIDIAN.accent,
                        color: OBSIDIAN.bg,
                        boxShadow: OBSIDIAN.glow,
                      }}
                    >
                      Ouvrir l'Arsenal
                      <ArrowRight className="inline ml-2" size={18} />
                    </button>
                    <button
                      onClick={() => setActiveTab("magic")}
                      className="px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all hover:bg-white/5"
                      style={{
                        border: `2px solid ${OBSIDIAN.border}`,
                        color: OBSIDIAN.text,
                      }}
                    >
                      <Wand2 className="inline mr-2" size={18} />
                      Architecte ID
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl"
                  style={{
                    backgroundColor: OBSIDIAN.bgCard,
                    border: `1px solid ${OBSIDIAN.border}`,
                  }}
                >
                  {[
                    { label: "Portée Globale", value: globalReach.toLocaleString() },
                    { label: "Membres Elite", value: "842,910" },
                    { label: "Scans Live", value: "124" },
                    { label: "Pays Actifs", value: "47" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-2xl font-bold" style={{ color: OBSIDIAN.accent }}>
                        {stat.value}
                      </p>
                      <p className="text-xs" style={{ color: OBSIDIAN.textMuted }}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MAGIC ARCHITECT TAB */}
            {activeTab === "magic" && (
              <motion.div
                key="magic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ color: OBSIDIAN.text, fontFamily: "'Bodoni Moda', serif" }}
                  >
                    Magic<br />Architect.
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>
                    Scannez l'ADN de votre établissement. Notre IA forge en 5 secondes une identité souveraine.
                  </p>
                </div>

                <div
                  className="rounded-3xl p-6"
                  style={{
                    backgroundColor: OBSIDIAN.bgCard,
                    border: `1px solid ${OBSIDIAN.border}`,
                  }}
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={magicInput}
                      onChange={(e) => setMagicInput(e.target.value)}
                      placeholder="SIRET, URL site web, ou nom d'entreprise..."
                      className="flex-1 px-4 py-3 rounded-xl focus:outline-none"
                      style={{
                        backgroundColor: OBSIDIAN.bgInput,
                        border: `1px solid ${OBSIDIAN.border}`,
                        color: OBSIDIAN.text,
                      }}
                    />
                    <button
                      onClick={handleMagicArchitect}
                      disabled={isMagicLoading}
                      className="px-6 py-3 rounded-xl font-bold transition-all"
                      style={{
                        backgroundColor: OBSIDIAN.emerald,
                        color: "#fff",
                      }}
                    >
                      {isMagicLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    </button>
                  </div>
                </div>

                {/* Identity Preview */}
                <div
                  className="rounded-3xl p-6"
                  style={{
                    backgroundColor: OBSIDIAN.bgCard,
                    border: `1px solid ${OBSIDIAN.emerald}40`,
                    boxShadow: `0 0 40px ${OBSIDIAN.emeraldGlow}`,
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl"
                      style={{ backgroundColor: OBSIDIAN.emerald, color: "#fff" }}
                    >
                      {identity.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-xl" style={{ color: OBSIDIAN.text }}>
                        {identity.name}
                      </p>
                      <p style={{ color: OBSIDIAN.textSecondary }}>{identity.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm" style={{ color: OBSIDIAN.textMuted }}>
                    <p>📍 {identity.address}</p>
                    <p>📞 {identity.phone}</p>
                    <p>✉️ {identity.email}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LEGACY MAP TAB */}
            {activeTab === "legacy" && (
              <motion.div
                key="legacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ color: OBSIDIAN.text, fontFamily: "'Bodoni Moda', serif" }}
                  >
                    Legacy<br />Map.
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>
                    Le registre mondial de l'hégémonie. Scellez votre point de lumière pour l'éternité.
                  </p>
                </div>

                {/* World Map */}
                <div
                  className="relative h-[400px] rounded-3xl overflow-hidden"
                  style={{
                    backgroundColor: OBSIDIAN.bgCard,
                    border: `1px solid ${OBSIDIAN.border}`,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cpath fill='%23${OBSIDIAN.emerald.slice(1)}' fill-opacity='0.1' d='M100,200 Q200,100 300,200 T500,200 T700,200'/%3E%3C/svg%3E")`,
                  }}
                >
                  {/* Flags */}
                  {legacyFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="absolute group cursor-pointer"
                      style={{
                        left: `${flag.x_position}%`,
                        top: `${flag.y_position}%`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: OBSIDIAN.emerald }}
                      />
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: OBSIDIAN.bgCard, border: `1px solid ${OBSIDIAN.border}` }}
                      >
                        <p className="text-xs font-bold" style={{ color: OBSIDIAN.text }}>
                          {flag.name}
                        </p>
                        <p className="text-xs" style={{ color: OBSIDIAN.textMuted }}>
                          {flag.city}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Stats overlay */}
                  <div
                    className="absolute bottom-4 left-4 px-4 py-2 rounded-xl"
                    style={{ backgroundColor: `${OBSIDIAN.bg}CC` }}
                  >
                    <p className="text-xs" style={{ color: OBSIDIAN.textMuted }}>
                      Nodes Elite: {legacyFlags.length.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={plantFlag}
                  className="w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: OBSIDIAN.emerald,
                    color: "#fff",
                    boxShadow: `0 0 40px ${OBSIDIAN.emeraldGlow}`,
                  }}
                >
                  <Flag className="inline mr-2" size={18} />
                  Planter mon Drapeau
                </button>
              </motion.div>
            )}

            {/* ALLIANCE CHAT TAB */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ color: OBSIDIAN.text, fontFamily: "'Bodoni Moda', serif" }}
                  >
                    Alliance<br />Chat.
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>
                    Canal VIP sécurisé. Communication d'élite en temps réel.
                  </p>
                </div>

                {/* Messages */}
                <div
                  className="h-[400px] overflow-y-auto rounded-3xl p-4 space-y-3"
                  style={{
                    backgroundColor: OBSIDIAN.bgCard,
                    border: `1px solid ${OBSIDIAN.border}`,
                  }}
                >
                  {messages.length === 0 ? (
                    <p className="text-center py-8" style={{ color: OBSIDIAN.textMuted }}>
                      Silence souverain. En attente de transmission...
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: OBSIDIAN.bgInput }}
                      >
                        <p className="font-bold text-sm" style={{ color: OBSIDIAN.accent }}>
                          {msg.name}
                        </p>
                        <p className="text-sm" style={{ color: OBSIDIAN.text }}>
                          "{msg.message}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendAllianceMessage()}
                    placeholder="Message crypté..."
                    className="flex-1 px-4 py-3 rounded-xl focus:outline-none"
                    style={{
                      backgroundColor: OBSIDIAN.bgInput,
                      border: `1px solid ${OBSIDIAN.border}`,
                      color: OBSIDIAN.text,
                    }}
                  />
                  <button
                    onClick={sendAllianceMessage}
                    className="px-6 py-3 rounded-xl"
                    style={{ backgroundColor: OBSIDIAN.accent, color: OBSIDIAN.bg }}
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-center text-xs" style={{ color: OBSIDIAN.textMuted }}>
                  Liaison i-Wasp Sovereign Secured
                </p>
              </motion.div>
            )}

            {/* ARSENAL TAB */}
            {activeTab === "shop" && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ color: OBSIDIAN.text, fontFamily: "'Bodoni Moda', serif" }}
                  >
                    L'Arsenal.<br />Manufacture.
                  </h2>
                  <p style={{ color: OBSIDIAN.textSecondary }}>
                    Chaque pièce est forgée individuellement pour sceller votre destinée numérique.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {PRODUCTS.map((product) => {
                    const Icon = product.icon;
                    const inCart = cart.find((i) => i.id === product.id);
                    
                    return (
                      <div
                        key={product.id}
                        className="rounded-3xl p-6 transition-all hover:scale-[1.02]"
                        style={{
                          backgroundColor: OBSIDIAN.bgCard,
                          border: `1px solid ${OBSIDIAN.border}`,
                        }}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: OBSIDIAN.accentMuted }}
                          >
                            <Icon size={24} style={{ color: OBSIDIAN.accent }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: OBSIDIAN.emeraldGlow,
                                  color: OBSIDIAN.emerald,
                                }}
                              >
                                {product.tag}
                              </span>
                            </div>
                            <p className="font-bold" style={{ color: OBSIDIAN.text }}>
                              {product.name}
                            </p>
                            <p className="text-sm" style={{ color: OBSIDIAN.textMuted }}>
                              {product.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold" style={{ color: OBSIDIAN.accent }}>
                            {product.price}€
                          </p>
                          <button
                            onClick={() => addToCart(product)}
                            className="px-6 py-2 rounded-full font-bold transition-all hover:scale-105 flex items-center gap-2"
                            style={{
                              backgroundColor: inCart ? OBSIDIAN.emerald : OBSIDIAN.accent,
                              color: inCart ? "#fff" : OBSIDIAN.bg,
                            }}
                          >
                            {inCart ? <Check size={16} /> : null}
                            {inCart ? `x${inCart.qty}` : "Sceller"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {cart.length > 0 && (
                  <div
                    className="rounded-3xl p-6"
                    style={{
                      backgroundColor: OBSIDIAN.emeraldGlow,
                      border: `1px solid ${OBSIDIAN.emerald}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold" style={{ color: OBSIDIAN.text }}>
                        Total Alliance: {cartTotal}€
                      </p>
                      <button
                        onClick={() => navigate("/order/type")}
                        className="px-8 py-3 rounded-full font-bold uppercase tracking-wider"
                        style={{ backgroundColor: OBSIDIAN.accent, color: OBSIDIAN.bg }}
                      >
                        Valider l'Ascension
                        <ArrowRight className="inline ml-2" size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* === SOVEREIGN DOCK (Mobile) === */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden backdrop-blur-xl safe-area-bottom"
        style={{
          backgroundColor: `${OBSIDIAN.bg}E6`,
          borderTop: `1px solid ${OBSIDIAN.border}`,
        }}
      >
        <div className="flex justify-around items-center py-3">
          {[
            { id: "home", icon: Home, label: "Dash" },
            { id: "magic", icon: Wand2, label: "Magic" },
            { id: "legacy", icon: Flag, label: "Legacy" },
            { id: "chat", icon: MessageSquare, label: "Chat" },
            { id: "shop", icon: ShoppingBag, label: "Arsenal" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
                style={{
                  color: isActive ? OBSIDIAN.accent : OBSIDIAN.textMuted,
                }}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile dock */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
