/**
 * CheckoutTunnel - Stealth Luxury Design
 * 
 * Palette: Noir Émeraude, Argent Titane, Platine
 * Features: Live Monitor, Tunnel 4 étapes, WhatsApp automatisé
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Globe, ChartBar, Camera, Link as LinkIcon, 
  ChevronRight, Save, Zap, ShieldCheck, CreditCard, Lock, Unlock, 
  PlusCircle, Truck, Settings, Activity, Smartphone, Mail, 
  CheckCircle2, Plus, Eye, Sparkles, Fingerprint, Shirt, Flame, 
  Crown, Cpu, RefreshCcw, Watch, Diamond, Scan, Maximize, 
  Users, Radio, Radar, MessageSquare, LockKeyhole, Terminal, 
  ShoppingBag, BadgeCheck, Languages, Map as MapIcon, Navigation2, 
  Gift, Share2, Award, Wallet, Star, Megaphone, Glasses, 
  ExternalLink, Phone, Download, Layout, Layers, ShoppingCart, ArrowRight,
  Trash2, Minus, ChevronLeft, X, Check, BarChart3, PieChart,
  BellRing, Search, Clock, Wifi, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// --- DESIGN TOKENS "STEALTH LUXURY" ---
const COLORS = {
  bg: "#050807",
  bgElevated: "#0A0F0D",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  border: "rgba(165, 169, 180, 0.12)",
  glass: "rgba(255, 255, 255, 0.02)",
  success: "#34C759",
  warning: "#FFD60A",
};

// Villes du Maroc
const MOROCCO_CITIES = [
  "Casablanca (Anfa)",
  "Marrakech (Hivernage)", 
  "Tanger (Marina)",
  "Rabat (Hay Riad)",
  "Agadir",
  "Fès",
  "Meknès",
  "Oujda",
  "Tétouan",
  "Essaouira"
];

// Produits catalogue
const PRODUCTS = [
  { 
    id: 1, 
    name: 'Carte Titane Brossé', 
    prices: { EUR: 290, MAD: 3200 }, 
    desc: 'Acier chirurgical haute densité, gravure laser.', 
    icon: CreditCard, 
    tag: 'Standard' 
  },
  { 
    id: 2, 
    name: 'Bague Optic N-X', 
    prices: { EUR: 580, MAD: 6300 }, 
    desc: 'Céramique noire & technologie NFC furtive.', 
    icon: Diamond, 
    tag: 'Exclusif' 
  },
  { 
    id: 3, 
    name: 'Set Ongles Aura', 
    prices: { EUR: 450, MAD: 4900 }, 
    desc: '10 micro-puces Bio-S pour manucure de luxe.', 
    icon: Fingerprint, 
    tag: 'Innovation' 
  },
  { 
    id: 4, 
    name: 'Labels Couture (x5)', 
    prices: { EUR: 190, MAD: 2100 }, 
    desc: 'Signature textile thermocollante haute résistance.', 
    icon: Shirt, 
    tag: 'Couture' 
  }
];

type Currency = 'EUR' | 'MAD';
type TabId = 'shop' | 'monitor' | 'checkout' | 'vault' | 'influence' | 'conciergerie' | 'profil';

interface CartItem {
  id: number;
  name: string;
  prices: { EUR: number; MAD: number };
  desc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  tag: string;
  qty: number;
}

interface LiveEvent {
  id: number;
  city: string;
  type: string;
  time: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface FormData {
  name: string;
  address: string;
  city: string;
  phone: string;
}

const CheckoutTunnel = () => {
  const navigate = useNavigate();
  
  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState<TabId>('shop');
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Simulation d'événements en direct
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([
    { id: 1, city: "Marrakech", type: "Alliance scellée", time: "À l'instant", icon: Crown },
    { id: 2, city: "Casablanca", type: "Scan NFC détecté", time: "Il y a 2 min", icon: Wifi },
    { id: 3, city: "Tanger", type: "Livraison DHL validée", time: "Il y a 5 min", icon: Truck }
  ]);

  // Formulaire de livraison
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    city: 'Casablanca (Anfa)',
    phone: ''
  });

  const brandProfile = {
    domain: "i-wasp.com",
    fullName: "IWASP Premium",
    whatsapp: "33626424394",
    location: "Paris - Marrakech",
  };

  // --- EFFETS ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simuler l'arrivée de nouveaux événements
  useEffect(() => {
    if (activeTab === 'monitor') {
      const interval = setInterval(() => {
        const cities = ["Rabat", "Agadir", "Fès", "Casablanca"];
        const types = ["Nouveau Membre", "Paiement Tap", "Scan Identité"];
        const newEvent: LiveEvent = {
          id: Date.now(),
          city: cities[Math.floor(Math.random() * cities.length)],
          type: types[Math.floor(Math.random() * types.length)],
          time: "À l'instant",
          icon: Zap
        };
        setLiveEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // --- LOGIQUE MÉTIER ---
  const notify = (msg: string) => {
    setNotification(msg);
    toast.success(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    notify(`${product.name} ajouté à votre arsenal.`);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    notify("Article retiré.");
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, curr) => acc + (curr.prices[currency] * curr.qty), 0);
    const isElite = subtotal > 4000;
    const shipping = (isElite || subtotal === 0) ? 0 : (currency === 'MAD' ? 150 : 15);
    return { subtotal, shipping, total: subtotal + shipping, isElite };
  }, [cart, currency]);

  const isFormValid = formData.name.trim() && formData.phone.trim() && formData.city;

  const handleSignature = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  const sendWhatsAppOrder = () => {
    const orderLines = cart.map(item => `- ${item.name} (x${item.qty})`).join('%0A');
    const signature = `IWASP-${Date.now().toString(36).toUpperCase()}`;
    const message = `🔱 *COMMANDE IWASP*%0A%0A${orderLines}%0A%0A💰 Total : ${totals.total.toLocaleString()} ${currency}%0A📍 Ville : ${formData.city}%0A👤 Client : ${formData.name}%0A📱 Tél : ${formData.phone}%0A%0A🔐 Signature : ${signature}`;
    window.open(`https://wa.me/${brandProfile.whatsapp}?text=${message}`, '_blank');
  };

  const sidebarItems = [
    { id: 'shop' as TabId, label: 'La Manufacture', icon: ShoppingBag },
    { id: 'monitor' as TabId, label: 'Live Monitor', icon: Radar },
    { id: 'checkout' as TabId, label: 'Ma Commande', icon: CreditCard },
    { id: 'vault' as TabId, label: 'Le Coffre Fort', icon: LockKeyhole },
    { id: 'influence' as TabId, label: 'Influence Analytics', icon: BarChart3 },
    { id: 'conciergerie' as TabId, label: 'Conciergerie VIP', icon: MessageSquare },
    { id: 'profil' as TabId, label: 'Identity Preview', icon: User },
  ];

  return (
    <div className="min-h-screen font-sans overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border"
            style={{ 
              backgroundColor: COLORS.bgElevated, 
              borderColor: COLORS.border,
              color: COLORS.accentLight 
            }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" style={{ color: COLORS.success }} />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVIGATION --- */}
      <nav 
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 border-b"
        style={{ 
          backgroundColor: `${COLORS.bg}95`, 
          borderColor: COLORS.border,
          backdropFilter: "blur(20px)"
        }}
      >
        <button onClick={() => navigate('/')} className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: COLORS.accent }}
          >
            <span className="text-sm font-black" style={{ color: COLORS.bg }}>W</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-black tracking-[0.3em]" style={{ color: COLORS.accentLight }}>
              I-WASP.COM
            </p>
            <p className="text-[10px]" style={{ color: COLORS.accent }}>
              Standard Maroc / DH
            </p>
          </div>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.glass }}>
            <Clock className="w-3 h-3" style={{ color: COLORS.accent }} />
            <span className="text-xs font-mono" style={{ color: COLORS.accent }}>{time}</span>
          </div>
          
          <button 
            onClick={() => setCurrency(c => c === 'EUR' ? 'MAD' : 'EUR')}
            className="flex items-center gap-2 px-5 py-2 rounded-full border transition-all hover:border-[#A5A9B4]"
            style={{ 
              backgroundColor: COLORS.glass, 
              borderColor: COLORS.border,
              color: COLORS.accentLight
            }}
          >
            <Globe className="w-3 h-3" />
            <span className="text-[9px] font-black tracking-widest">
              {currency === 'MAD' ? 'Maroc (DH)' : 'Europe (€)'}
            </span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('checkout'); setStep(1); }}
            className="relative p-3 rounded-full transition-all"
            style={{ backgroundColor: COLORS.glass }}
          >
            <ShoppingCart className="w-5 h-5" style={{ color: COLORS.accentLight }} />
            {cart.length > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
              >
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="flex pt-20">
        
        {/* --- SIDEBAR --- */}
        <aside 
          className="hidden lg:flex flex-col justify-between w-80 p-6 border-r fixed left-0 top-20 bottom-0 overflow-y-auto"
          style={{ 
            backgroundColor: COLORS.bg, 
            borderColor: COLORS.border 
          }}
        >
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(item.id === 'checkout' && step === 4) setStep(1); }}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'shadow-2xl scale-[1.02]' 
                    : 'hover:bg-white/5'
                }`}
                style={{
                  background: activeTab === item.id 
                    ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})` 
                    : 'transparent',
                  color: activeTab === item.id ? COLORS.bg : COLORS.accent
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div 
            className="mt-8 p-5 rounded-2xl border"
            style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
          >
            <p className="text-[10px] font-black tracking-[0.3em] mb-3" style={{ color: COLORS.accent }}>
              Status Sovereign
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: COLORS.accentLight }}>OBSIDIAN</span>
              <Diamond className="w-4 h-4" style={{ color: COLORS.warning }} />
            </div>
          </div>
        </aside>

        {/* --- ZONE D'ACTION --- */}
        <main className="flex-1 lg:ml-80 p-6 lg:p-10 min-h-screen">
          <AnimatePresence mode="wait">

            {/* TAB: MONITOR DYNAMIQUE */}
            {activeTab === 'monitor' && (
              <motion.div
                key="monitor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-black leading-tight" style={{ color: COLORS.accentLight }}>
                      Hégémonie <span style={{ color: COLORS.accent }}>Live.</span>
                    </h1>
                    <p className="text-sm mt-2" style={{ color: COLORS.accent }}>
                      "Surveillez l'expansion de l'alliance i-Wasp au Maroc."
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.glass }}>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium" style={{ color: COLORS.accentLight }}>Flux en Direct</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Carte Morocco Cluster */}
                  <div 
                    className="relative h-80 rounded-3xl overflow-hidden border"
                    style={{ 
                      background: `linear-gradient(180deg, ${COLORS.bgElevated}, ${COLORS.bg})`,
                      borderColor: COLORS.border
                    }}
                  >
                    <MapIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-10" style={{ color: COLORS.accent }} />
                    
                    {/* Beacons Dynamiques */}
                    <motion.button
                      onClick={() => notify("Cluster Casablanca Actif")}
                      className="absolute top-1/3 left-1/3"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.success }} />
                      <div className="absolute inset-0 w-4 h-4 rounded-full animate-ping" style={{ backgroundColor: COLORS.success, opacity: 0.5 }} />
                    </motion.button>

                    <motion.button
                      onClick={() => notify("Elite Cluster Marrakech")}
                      className="absolute top-1/2 right-1/3"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: COLORS.warning }} />
                      <div className="absolute inset-0 w-5 h-5 rounded-full animate-ping" style={{ backgroundColor: COLORS.warning, opacity: 0.5 }} />
                    </motion.button>

                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl" style={{ backgroundColor: COLORS.glass }}>
                      <Radio className="w-4 h-4 inline mr-2" style={{ color: COLORS.accent }} />
                      <span className="text-xs" style={{ color: COLORS.accentLight }}>Morocco Sovereign Cluster : 882 Active Nodes</span>
                    </div>
                  </div>

                  {/* Flux en temps réel */}
                  <div 
                    className="p-6 rounded-3xl border"
                    style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
                  >
                    <h3 className="text-lg font-bold mb-4" style={{ color: COLORS.accentLight }}>Activité de Prestige</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scroll">
                      {liveEvents.map((ev) => (
                        <motion.div
                          key={ev.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-xl border"
                          style={{ backgroundColor: COLORS.bgElevated, borderColor: COLORS.border }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <ev.icon className="w-4 h-4" style={{ color: COLORS.warning }} />
                              <span className="text-sm font-semibold" style={{ color: COLORS.accentLight }}>{ev.city}</span>
                            </div>
                            <span className="text-[10px]" style={{ color: COLORS.accent }}>{ev.time}</span>
                          </div>
                          <p className="text-xs" style={{ color: COLORS.accent }}>{ev.type}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: SHOP */}
            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black leading-tight" style={{ color: COLORS.accentLight }}>
                    L'Arsenal <span style={{ color: COLORS.accent }}>Royaume.</span>
                  </h1>
                  <p className="text-sm mt-2 max-w-lg" style={{ color: COLORS.accent }}>
                    "Prenez le contrôle total de votre identité. Expédition prioritaire Casablanca, Marrakech et Tanger."
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {PRODUCTS.map(p => (
                    <motion.div
                      key={p.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-3xl border transition-all"
                      style={{ 
                        backgroundColor: COLORS.glass, 
                        borderColor: COLORS.border 
                      }}
                    >
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: COLORS.bgElevated }}
                      >
                        <p.icon className="w-8 h-8" style={{ color: COLORS.accent }} />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="px-3 py-1 rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: COLORS.warning, color: COLORS.bg }}
                        >
                          {p.tag}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.accentLight }}>{p.name}</h3>
                      <p className="text-sm mb-4" style={{ color: COLORS.accent }}>"{p.desc}"</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-black" style={{ color: COLORS.accentLight }}>
                          {p.prices[currency].toLocaleString()} {currency}
                        </p>
                        <button
                          onClick={() => addToCart(p)}
                          className="px-6 py-3 rounded-full font-bold text-[10px] tracking-widest uppercase transition-all hover:bg-white active:scale-95"
                          style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
                        >
                          Commander
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: CHECKOUT - TUNNEL 4 ÉTAPES */}
            {activeTab === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {step < 4 ? (
                  <div className="space-y-8">
                    {/* Header */}
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-black" style={{ color: COLORS.accentLight }}>
                        Ma Commande.
                      </h1>
                      
                      {/* Progress */}
                      <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map(s => (
                          <div key={s} className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                              style={{ 
                                backgroundColor: step >= s ? COLORS.accent : COLORS.glass,
                                color: step >= s ? COLORS.bg : COLORS.accent
                              }}
                            >
                              {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && (
                              <div 
                                className="w-12 h-0.5 rounded-full transition-all"
                                style={{ backgroundColor: step > s ? COLORS.accent : COLORS.border }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Étape 1: Panier */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {cart.length === 0 ? (
                          <div 
                            className="p-12 rounded-3xl text-center border"
                            style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
                          >
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: COLORS.accent }} />
                            <p className="text-lg mb-6" style={{ color: COLORS.accent }}>
                              Manufacture en attente de choix...
                            </p>
                            <button
                              onClick={() => setActiveTab('shop')}
                              className="px-8 py-4 rounded-full border font-bold text-sm tracking-widest uppercase transition-all hover:bg-[#A5A9B4] hover:text-black"
                              style={{ borderColor: COLORS.accent, color: COLORS.accent }}
                            >
                              Ouvrir l'Arsenal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3">
                              {cart.map(item => (
                                <div
                                  key={item.id}
                                  className="p-5 rounded-2xl border flex items-center justify-between"
                                  style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
                                >
                                  <div className="flex items-center gap-4">
                                    <div 
                                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                                      style={{ backgroundColor: COLORS.bgElevated }}
                                    >
                                      <item.icon className="w-6 h-6" style={{ color: COLORS.accent }} />
                                    </div>
                                    <div>
                                      <p className="font-semibold" style={{ color: COLORS.accentLight }}>{item.name}</p>
                                      <div className="flex items-center gap-3 mt-1">
                                        <button 
                                          onClick={() => updateQty(item.id, -1)}
                                          className="p-1 rounded-full transition-colors hover:bg-white/10"
                                          style={{ color: COLORS.accent }}
                                        >
                                          <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-bold" style={{ color: COLORS.accentLight }}>{item.qty}</span>
                                        <button 
                                          onClick={() => updateQty(item.id, 1)}
                                          className="p-1 rounded-full transition-colors hover:bg-white/10"
                                          style={{ color: COLORS.accent }}
                                        >
                                          <Plus className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <p className="font-bold" style={{ color: COLORS.accentLight }}>
                                      {(item.prices[currency] * item.qty).toLocaleString()} {currency}
                                    </p>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="p-2 rounded-xl transition-colors hover:bg-red-500/20"
                                      style={{ color: '#FF3B30' }}
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Totaux */}
                            <div 
                              className="p-6 rounded-2xl border space-y-3"
                              style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
                            >
                              <div className="flex justify-between">
                                <span style={{ color: COLORS.accent }}>Manufacture</span>
                                <span style={{ color: COLORS.accentLight }}>{totals.subtotal.toLocaleString()} {currency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span style={{ color: COLORS.accent }}>Logistique DHL Elite</span>
                                <span style={{ color: totals.shipping > 0 ? COLORS.accentLight : COLORS.success }}>
                                  {totals.shipping > 0 ? `${totals.shipping} ${currency}` : "OFFERTE ✨"}
                                </span>
                              </div>
                              <div className="flex justify-between pt-3 border-t" style={{ borderColor: COLORS.border }}>
                                <span className="font-bold" style={{ color: COLORS.accentLight }}>Total Final</span>
                                <span className="text-2xl font-black" style={{ color: COLORS.accentLight }}>
                                  {totals.total.toLocaleString()} {currency}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => setStep(2)}
                              className="w-full py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all active:scale-[0.98]"
                              style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
                            >
                              Continuer <ArrowRight className="inline w-4 h-4 ml-2" />
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}

                    {/* Étape 2: Livraison */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div 
                          className="p-6 rounded-2xl border"
                          style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <Truck className="w-6 h-6" style={{ color: COLORS.accent }} />
                            <h3 className="text-lg font-bold" style={{ color: COLORS.accentLight }}>Expédition Maroc</h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold tracking-wider mb-2 block" style={{ color: COLORS.accent }}>
                                Nom complet
                              </label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Votre nom"
                                className="w-full p-4 rounded-xl border outline-none transition-all focus:border-[#A5A9B4]"
                                style={{ 
                                  backgroundColor: COLORS.bgElevated, 
                                  borderColor: COLORS.border,
                                  color: COLORS.accentLight
                                }}
                              />
                            </div>
                            
                            <div>
                              <label className="text-xs font-bold tracking-wider mb-2 block" style={{ color: COLORS.accent }}>
                                Téléphone
                              </label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="+212 6XX XXX XXX"
                                className="w-full p-4 rounded-xl border outline-none transition-all focus:border-[#A5A9B4]"
                                style={{ 
                                  backgroundColor: COLORS.bgElevated, 
                                  borderColor: COLORS.border,
                                  color: COLORS.accentLight
                                }}
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold tracking-wider mb-2 block" style={{ color: COLORS.accent }}>
                                Ville
                              </label>
                              <select
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full p-4 rounded-xl border outline-none transition-all focus:border-[#A5A9B4]"
                                style={{ 
                                  backgroundColor: COLORS.bgElevated, 
                                  borderColor: COLORS.border,
                                  color: COLORS.accentLight
                                }}
                              >
                                {MOROCCO_CITIES.map(city => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setStep(1)}
                            className="flex-1 py-4 rounded-xl border font-bold text-sm transition-all hover:bg-white/5"
                            style={{ borderColor: COLORS.border, color: COLORS.accent }}
                          >
                            <ArrowLeft className="inline w-4 h-4 mr-2" />
                            Retour
                          </button>
                          <button
                            onClick={() => setStep(3)}
                            disabled={!isFormValid}
                            className="flex-1 py-4 rounded-xl font-bold text-sm transition-all disabled:opacity-30"
                            style={{ 
                              backgroundColor: isFormValid ? COLORS.accent : COLORS.glass, 
                              color: isFormValid ? COLORS.bg : COLORS.accent 
                            }}
                          >
                            Continuer
                            <ArrowRight className="inline w-4 h-4 ml-2" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Étape 3: Signature */}
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div 
                          className="p-8 rounded-3xl border text-center"
                          style={{ backgroundColor: COLORS.glass, borderColor: COLORS.border }}
                        >
                          <motion.div
                            animate={isProcessing ? { rotate: 360 } : {}}
                            transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: COLORS.bgElevated }}
                          >
                            {isProcessing ? (
                              <Lock className="w-10 h-10" style={{ color: COLORS.accent }} />
                            ) : (
                              <Fingerprint className="w-10 h-10" style={{ color: COLORS.accent }} />
                            )}
                          </motion.div>
                          
                          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.accentLight }}>
                            {isProcessing ? "Signature en cours..." : "Sceller l'Alliance"}
                          </h3>
                          <p className="text-sm mb-6" style={{ color: COLORS.accent }}>
                            {isProcessing 
                              ? "Génération de votre signature blockchain..."
                              : "Confirmez votre commande avec une signature sécurisée"
                            }
                          </p>
                          
                          {!isProcessing && (
                            <button
                              onClick={handleSignature}
                              className="px-12 py-5 rounded-full font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
                              style={{ backgroundColor: COLORS.accent, color: COLORS.bg }}
                            >
                              <Fingerprint className="inline w-5 h-5 mr-2" />
                              Sceller l'Alliance
                            </button>
                          )}
                        </div>

                        {!isProcessing && (
                          <button
                            onClick={() => setStep(2)}
                            className="w-full py-4 rounded-xl border font-medium text-sm transition-all hover:bg-white/5"
                            style={{ borderColor: COLORS.border, color: COLORS.accent }}
                          >
                            <ArrowLeft className="inline w-4 h-4 mr-2" />
                            Retour
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  /* Étape 4: Confirmation */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${COLORS.success}20` }}
                    >
                      <CheckCircle2 className="w-16 h-16" style={{ color: COLORS.success }} />
                    </motion.div>

                    <h1 className="text-4xl font-black mb-4" style={{ color: COLORS.accentLight }}>
                      Hégémonie.
                    </h1>
                    <p className="text-sm max-w-md mx-auto mb-8" style={{ color: COLORS.accent }}>
                      "Félicitations. Votre identité est en cours de forge. Votre profil sur {brandProfile.domain} sera actif dans 30 secondes."
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={sendWhatsAppOrder}
                        className="px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
                        style={{ backgroundColor: '#25D366', color: 'white' }}
                      >
                        <MessageSquare className="inline w-5 h-5 mr-2" />
                        Finaliser sur WhatsApp
                      </button>
                      <button
                        onClick={() => { setStep(1); setActiveTab('shop'); setCart([]); }}
                        className="px-10 py-5 rounded-full border font-bold text-sm tracking-widest uppercase transition-all hover:border-[#A5A9B4]"
                        style={{ borderColor: COLORS.border, color: COLORS.accent }}
                      >
                        Retour Manufacture
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* TAB: VAULT (Placeholder) */}
            {activeTab === 'vault' && (
              <motion.div
                key="vault"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <LockKeyhole className="w-24 h-24 mb-6 opacity-20" style={{ color: COLORS.accent }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accentLight }}>Le Coffre Fort</h2>
                <p style={{ color: COLORS.accent }}>Accès réservé aux membres Obsidian.</p>
              </motion.div>
            )}

            {/* TAB: INFLUENCE (Placeholder) */}
            {activeTab === 'influence' && (
              <motion.div
                key="influence"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <BarChart3 className="w-24 h-24 mb-6 opacity-20" style={{ color: COLORS.accent }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accentLight }}>Influence Analytics</h2>
                <p style={{ color: COLORS.accent }}>Statistiques avancées en cours de déploiement.</p>
              </motion.div>
            )}

            {/* TAB: CONCIERGERIE (Placeholder) */}
            {activeTab === 'conciergerie' && (
              <motion.div
                key="conciergerie"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <MessageSquare className="w-24 h-24 mb-6 opacity-20" style={{ color: COLORS.accent }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accentLight }}>Conciergerie VIP</h2>
                <p style={{ color: COLORS.accent }}>Service personnalisé disponible 24/7.</p>
              </motion.div>
            )}

            {/* TAB: PROFIL (Placeholder) */}
            {activeTab === 'profil' && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <User className="w-24 h-24 mb-6 opacity-20" style={{ color: COLORS.accent }} />
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.accentLight }}>Identity Preview</h2>
                <p style={{ color: COLORS.accent }}>Prévisualisez votre profil digital.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 flex justify-around py-3 border-t"
        style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}
      >
        {[
          { id: 'shop' as TabId, icon: ShoppingBag },
          { id: 'monitor' as TabId, icon: Radar },
          { id: 'checkout' as TabId, icon: ShoppingCart },
          { id: 'profil' as TabId, icon: User },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="p-3 rounded-xl transition-all"
            style={{ 
              backgroundColor: activeTab === item.id ? COLORS.glass : 'transparent',
              color: activeTab === item.id ? COLORS.accentLight : COLORS.accent
            }}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(165, 169, 180, 0.2); border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar { width: 2px; }
      `}</style>
    </div>
  );
};

export default CheckoutTunnel;