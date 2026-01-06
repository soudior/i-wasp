/**
 * CheckoutTunnel - Sovereign Stealth Empire V2
 * 
 * Features: Dashboard Hégémonie, Arsenal, Legacy Map, Magic Architect, 
 * Alliance Chat (temps réel), Calculateur d'Impact, Rituel
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, CreditCard, Crown, Diamond, Fingerprint, Shirt, 
  Radar, ShoppingBag, Flag, Sparkles, Wand2, Mic, Box, Nfc, KeyRound,
  ShoppingCart, Loader2, Phone, ChevronRight, Clock, CheckCircle2,
  Send, MessageSquare, Star, Users, Zap, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// --- COMPOSANT : CÉLÉBRATION TITANE ---
const TitaniumCelebration = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {[...Array(80)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-3 h-3 bg-gradient-to-r from-[#A5A9B4] to-white rounded-full animate-particle-premium" 
          style={{ 
            '--angle': `${(i / 80) * 360}deg`, 
            '--dist': `${200 + Math.random() * 400}px`, 
            animationDelay: `${Math.random() * 0.5}s` 
          } as React.CSSProperties} 
        />
      ))}
      <div className="w-32 h-32 bg-gradient-to-r from-[#A5A9B4] to-white rounded-full animate-core-expand shadow-[0_0_200px_rgba(165,169,180,0.8)]" />
    </div>
  );
};

// Produits catalogue
const PRODUCTS = [
  { id: 1, name: 'Sovereign Card Titane', prices: { EUR: 290, MAD: 3200 }, desc: 'Acier chirurgical ultra-dense, gravure laser.', icon: CreditCard, tag: 'Must-Have' },
  { id: 2, name: 'Bague Optic N-X', prices: { EUR: 580, MAD: 6300 }, desc: 'Céramique & technologie NFC furtive.', icon: Diamond, tag: 'Elite Series' },
  { id: 3, name: 'Veste Couture Sovereign', prices: { EUR: 1250, MAD: 13500 }, desc: 'Haute couture marocaine, 5 puces NFC.', icon: Shirt, tag: 'Masterpiece' },
  { id: 4, name: 'Label Couture NFC (x10)', prices: { EUR: 350, MAD: 3800 }, desc: 'Signez vos vêtements avec votre identité.', icon: Fingerprint, tag: 'Expansion' }
];

type Currency = 'MAD' | 'EUR';
type TabId = 'home' | 'shop' | 'legacy' | 'monitor' | 'magic' | 'ritual' | 'checkout';

interface CartItem {
  id: number;
  name: string;
  prices: { EUR: number; MAD: number };
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  qty: number;
}

interface LegacyFlag {
  id: string;
  x: string;
  y: string;
  name: string;
  city: string;
}

interface ChatMessage {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

const CheckoutTunnel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // --- ÉTATS SYSTÈME ---
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showFirework, setShowFirework] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Outils Avancés
  const [magicInput, setMagicInput] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [scansPerDay, setScansPerDay] = useState(50);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Données Globales
  const [legacyFlags, setLegacyFlags] = useState<LegacyFlag[]>([
    { id: '1', x: '45%', y: '35%', name: 'Julian D.', city: 'Paris' },
    { id: '2', x: '42%', y: '48%', name: 'Marc A.', city: 'Marrakech' },
    { id: '3', x: '44%', y: '46%', name: 'Elite Hub', city: 'Casablanca' },
    { id: '4', x: '55%', y: '32%', name: 'Sovereign 01', city: 'Dubai' },
    { id: '5', x: '30%', y: '30%', name: 'Founding Member', city: 'New York' },
  ]);
  const [globalReach, setGlobalReach] = useState(24829103);

  // Identité Architecturée
  const [identity, setIdentity] = useState({
    name: user?.email?.split('@')[0] || "Identité Elite",
    title: "Sovereign Member",
    whatsapp: "33626424394",
    website: "i-wasp.com",
    location: "Global Alliance",
    avatar: "W",
    status: "Vérifié"
  });

  const brandProfile = { domain: "i-wasp.com", whatsapp: "33626424394" };

  const sidebarItems = [
    { id: 'home' as TabId, label: 'Hégémonie', icon: Globe },
    { id: 'monitor' as TabId, label: 'Monitor Live', icon: Radar },
    { id: 'shop' as TabId, label: "L'Arsenal", icon: ShoppingBag },
    { id: 'magic' as TabId, label: 'Magic Architect', icon: Wand2 },
    { id: 'legacy' as TabId, label: 'Legacy Map', icon: Flag },
    { id: 'ritual' as TabId, label: 'Le Rituel', icon: Sparkles },
  ];

  // --- LOGIQUES MÉTIER ---
  const notify = useCallback((msg: string) => { 
    setNotification(msg); 
    toast.success(msg);
    setTimeout(() => setNotification(null), 3500); 
  }, []);
  
  const addToCart = (p: typeof PRODUCTS[0]) => {
    const exists = cart.find(i => i.id === p.id);
    setCart(exists ? cart.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i) : [...cart, {...p, qty: 1}]);
    notify(`${p.name} ajouté à votre arsenal.`);
  };

  const totals = useMemo(() => {
    const sub = cart.reduce((acc, curr) => acc + (curr.prices[currency] * curr.qty), 0);
    const ship = (sub > 5000 || sub === 0) ? 0 : (currency === 'MAD' ? 150 : 15);
    return { sub, ship, total: sub + ship };
  }, [cart, currency]);

  const points = useMemo(() => Math.floor(totals.total / 10), [totals.total]);

  const influenceStats = useMemo(() => {
    const reach = scansPerDay * 30 * 320; 
    return { reach, expansion: scansPerDay * 25 }; 
  }, [scansPerDay]);

  const handleMagicArchitect = async () => {
    if(!magicInput) return notify("Cible d'extraction manquante.");
    setIsMagicLoading(true);
    notify("Architecte Neural i-Wasp : Analyse de la structure...");
    await new Promise(r => setTimeout(r, 4000));
    const isSite = magicInput.includes("http");
    setIdentity({
      name: isSite ? "Vôtre Enseigne Digitale" : magicInput,
      title: "Identité Souveraine Certifiée",
      whatsapp: "33626424394",
      website: isSite ? magicInput : "i-wasp.com",
      location: "Maroc - World Hub",
      avatar: magicInput.charAt(0).toUpperCase(),
      status: "Membre Sovereign"
    });
    setIsMagicLoading(false);
    setShowFirework(true);
    notify("Identité scellée. Votre empire est configuré.");
    setTimeout(() => setShowFirework(false), 5000);
  };

  const sendAllianceMessage = () => {
    if(!chatMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      name: identity.name,
      text: chatMessage,
      timestamp: Date.now()
    };
    setMessages(prev => [newMsg, ...prev].slice(0, 15));
    setChatMessage('');
    notify("Message transmis à l'alliance.");
  };

  const sealMyLegacy = () => {
    const newFlag: LegacyFlag = { 
      id: Date.now().toString(),
      x: `${15 + Math.random() * 70}%`, 
      y: `${20 + Math.random() * 50}%`, 
      name: identity.name, 
      city: identity.location
    };
    setLegacyFlags(prev => [...prev, newFlag]);
    setActiveTab('legacy');
    setShowFirework(true);
    notify("Lignée inscrite éternellement.");
    setTimeout(() => setShowFirework(false), 5000);
  };

  const handleCheckout = () => {
    setIsProcessing(true); 
    setTimeout(() => { 
      setIsProcessing(false); 
      setStep(4); 
      setShowFirework(true); 
      setTimeout(() => setShowFirework(false), 6000); 
    }, 3000);
  };

  useEffect(() => { 
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setGlobalReach(prev => prev + Math.floor(Math.random() * 15));
    }, 1000); 
    return () => clearInterval(t); 
  }, []);

  return (
    <div className="min-h-screen bg-[#030504] text-white font-['Inter'] overflow-hidden relative">
      <TitaniumCelebration active={showFirework} />
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(165,169,180,0.04)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] border border-white/[0.02] rounded-full" />
      </div>

      {/* Impact Ticker */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 overflow-hidden py-2">
        <div className="animate-marquee whitespace-nowrap">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="inline-block text-[10px] tracking-[0.3em] text-[#A5A9B4]/60 uppercase mx-8">
              Nouvelle Alliance : Casablanca · Hégémonie en cours : Paris · Scellement Elite : Dubai · Expansion : Milan ·
            </span>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[10000]"
          >
            <div className="px-8 py-4 bg-[#A5A9B4] text-black rounded-full font-black text-sm tracking-widest uppercase shadow-2xl flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" />
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOPBAR */}
      <nav className="fixed top-8 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <button onClick={() => navigate('/')} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#A5A9B4] rounded-xl md:rounded-2xl flex items-center justify-center text-black font-black text-lg md:text-xl italic shadow-2xl">
              W
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-base font-black tracking-wider text-white">{brandProfile.domain}</p>
            <p className="text-[9px] tracking-[0.4em] text-[#A5A9B4] uppercase">Standard Mondial N°1</p>
          </div>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[8px] tracking-widest text-white/30 uppercase">Portée Collective</span>
            <span className="text-sm font-black text-[#A5A9B4]">{globalReach.toLocaleString()}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs tracking-widest text-white/40">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
          <button 
            onClick={() => setActiveTab('checkout')}
            className="relative p-3 bg-white/5 rounded-xl border border-white/10 hover:border-[#A5A9B4] transition-all"
          >
            <ShoppingCart className="w-5 h-5 text-[#A5A9B4]" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#A5A9B4] text-black rounded-full text-[10px] font-black flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-28 bottom-0 w-64 p-4 border-r border-white/5 z-40 hidden lg:flex flex-col justify-between bg-black/40 backdrop-blur-xl">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                activeTab === item.id 
                ? 'bg-[#A5A9B4] text-black shadow-2xl scale-[1.02]' 
                : 'text-white/20 hover:bg-white/5 hover:text-[#A5A9B4]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-black text-xs tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
          
          <div className="mt-8 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <p className="text-[9px] tracking-[0.3em] text-white/30 uppercase mb-3">Alliance Power</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#A5A9B4] italic">{points}</span>
              <Crown className="w-5 h-5 text-[#A5A9B4]/50" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN INTERFACE */}
      <main className="lg:ml-64 pt-32 pb-28 px-4 md:px-10 relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="max-w-3xl">
                <p className="text-[10px] tracking-[0.5em] text-[#A5A9B4] uppercase mb-4">Sovereign Standard World N°1</p>
                <h1 className="text-4xl md:text-6xl font-black italic leading-[0.9] tracking-tight mb-6">
                  Dominez <br /><span className="text-[#A5A9B4]">L'Espace.</span>
                </h1>
                <p className="text-white/30 italic max-w-xl mb-8">
                  "i-Wasp est la force motrice de l'identité phygitale mondiale. Une fusion irréversible entre votre présence physique et votre hégémonie digitale."
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveTab('shop')} 
                    className="px-10 py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-white transition-all flex items-center gap-3"
                  >
                    Ouvrir l'Arsenal <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('magic')} 
                    className="px-8 py-6 border border-white/10 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center gap-3"
                  >
                    <Wand2 className="w-4 h-4" /> Architecte ID
                  </button>
                  <button 
                    onClick={() => navigate('/order/type')} 
                    className="px-8 py-6 bg-emerald-600 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-emerald-500 transition-all flex items-center gap-3"
                  >
                    <CreditCard className="w-4 h-4" /> Commander ma Carte
                  </button>
                </div>
              </div>

              {/* Calculateur d'Impact */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4 mb-6">
                    <Radar className="w-8 h-8 text-[#A5A9B4]" />
                    <h3 className="text-lg font-black italic">Simulateur <span className="text-[#A5A9B4]">D'Influence</span></h3>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40">Interactions / Jour</span>
                      <span className="text-[#A5A9B4] font-black">{scansPerDay}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={scansPerDay} 
                      onChange={(e) => setScansPerDay(parseInt(e.target.value))} 
                      className="w-full h-2 bg-white/10 rounded-full accent-[#A5A9B4]" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] text-white/30 uppercase mb-1">Impact Mensuel</p>
                      <p className="text-xl font-black text-[#A5A9B4]">{influenceStats.reach.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] text-white/30 uppercase mb-1">Accélération</p>
                      <p className="text-xl font-black text-emerald-400">+{influenceStats.expansion}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center min-h-[250px]">
                  <div className="relative">
                    <Crown className="w-20 h-20 text-[#A5A9B4]/30" />
                    <div className="absolute inset-0 animate-ping">
                      <Crown className="w-20 h-20 text-[#A5A9B4]/10" />
                    </div>
                  </div>
                  <p className="mt-4 text-[9px] tracking-widest text-white/20 uppercase">Alliance Globale</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: GLOBAL MONITOR */}
          {activeTab === 'monitor' && (
            <motion.div 
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-4">Monitor <span className="text-[#A5A9B4]">Live.</span></h1>
              <p className="text-white/30 italic mb-8 max-w-md">"Surveillance en temps réel du réseau Sovereign. Chaque scan est une connexion."</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Cartes Actives', value: '842,910', icon: CreditCard },
                  { label: 'Scans 24h', value: '12,847', icon: Radar },
                  { label: 'Réseau Live', value: '124', icon: Globe, isLive: true }
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                      <stat.icon className="w-6 h-6 text-[#A5A9B4]" />
                      {stat.isLive && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                    </div>
                    <p className="text-3xl font-black text-[#A5A9B4] mb-1">{stat.value}</p>
                    <p className="text-[9px] tracking-widest text-white/30 uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                <h3 className="text-lg font-black italic mb-4">Activité Récente</h3>
                <div className="space-y-3">
                  {[
                    { city: 'Paris', time: 'Il y a 2 min', action: 'Nouveau scan' },
                    { city: 'Marrakech', time: 'Il y a 5 min', action: 'Contact ajouté' },
                    { city: 'Dubai', time: 'Il y a 12 min', action: 'Nouveau scan' },
                    { city: 'New York', time: 'Il y a 18 min', action: 'WhatsApp' },
                    { city: 'Milan', time: 'Il y a 25 min', action: 'Carte créée' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="font-black text-sm">{event.city}</span>
                        <span className="text-[9px] text-[#A5A9B4] uppercase">{event.action}</span>
                      </div>
                      <span className="text-[9px] text-white/30">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* CTA Commander */}
              <div className="mt-8 text-center">
                <button 
                  onClick={() => navigate('/order/type')}
                  className="px-10 py-5 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-sm tracking-[0.3em] hover:bg-white transition-all inline-flex items-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  Commander ma Carte NFC
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB: MAGIC ARCHITECT */}
          {activeTab === 'magic' && (
            <motion.div 
              key="magic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-8"
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-4">Magic <span className="text-[#A5A9B4]">Architect.</span></h1>
              <p className="text-white/30 italic mb-10 max-w-md mx-auto">
                "Scannez l'ADN de votre établissement. Notre IA forge en 5 secondes une identité souveraine prête pour l'expansion mondiale."
              </p>
              
              <div className="mb-6">
                <div className="relative">
                  <Wand2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="URL du site ou nom de l'établissement..." 
                    value={magicInput} 
                    onChange={(e) => setMagicInput(e.target.value)} 
                    className="w-full bg-black/60 border border-white/10 rounded-full px-14 py-5 text-base focus:border-[#A5A9B4] outline-none text-white placeholder:text-white/20" 
                  />
                </div>
              </div>
              
              <button 
                onClick={handleMagicArchitect} 
                disabled={isMagicLoading} 
                className="w-full py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-sm tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isMagicLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {isMagicLoading ? "ANALYSE NEURONALE..." : "LANCER LA FORGE"}
              </button>
              
              {/* Résultat de l'identité */}
              {identity.name !== "Identité Elite" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 p-6 rounded-2xl border border-[#A5A9B4]/30 bg-[#A5A9B4]/5"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A5A9B4] flex items-center justify-center text-black text-2xl font-black">
                    {identity.avatar}
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">{identity.name}</h3>
                  <p className="text-sm text-[#A5A9B4] mb-4">{identity.title}</p>
                  <button 
                    onClick={() => navigate('/order/type')}
                    className="px-8 py-3 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-all"
                  >
                    Commander cette identité
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB: LEGACY MAP */}
          {activeTab === 'legacy' && (
            <motion.div 
              key="legacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-4">Legacy <span className="text-[#A5A9B4]">Map.</span></h1>
              <p className="text-white/30 italic mb-8 max-w-md">"Le registre mondial de l'hégémonie. Chaque membre scelle son point de lumière."</p>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Carte */}
                <div className="relative aspect-video rounded-3xl border border-white/10 bg-black/60 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Globe className="w-[60%] h-[60%] text-[#A5A9B4]" />
                  </div>
                  
                  {legacyFlags.map(f => (
                    <div 
                      key={f.id} 
                      className="absolute group cursor-pointer" 
                      style={{ left: f.x, top: f.y }}
                    >
                      <div className="w-3 h-3 bg-[#A5A9B4] rounded-full animate-pulse shadow-[0_0_15px_rgba(165,169,180,0.5)]" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                        <div className="px-4 py-2 bg-black/90 rounded-xl border border-[#A5A9B4]/30 whitespace-nowrap">
                          <p className="font-black text-sm">{f.name}</p>
                          <p className="text-[9px] text-[#A5A9B4]">{f.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="absolute bottom-4 left-4 flex gap-4 text-[9px] text-white/30 uppercase">
                    <span>Nodes: 842,910</span>
                    <span className="text-emerald-400">Live: 124</span>
                  </div>
                </div>
                
                {/* Alliance Chat */}
                <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-5 h-5 text-[#A5A9B4]" />
                    <h3 className="text-lg font-black italic">Alliance <span className="text-[#A5A9B4]">Chat</span></h3>
                  </div>
                  
                  <div className="h-48 overflow-y-auto space-y-3 mb-4 pr-2">
                    {messages.length === 0 ? (
                      <p className="text-white/20 text-center py-8 italic text-sm">Silence souverain. En attente de transmission...</p>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-black/40 border border-white/5">
                          <p className="text-[9px] text-[#A5A9B4] uppercase mb-1">{m.name}</p>
                          <p className="text-sm text-white/70 italic">"{m.text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendAllianceMessage()}
                      placeholder="Message crypté..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-full px-4 py-3 text-sm focus:border-[#A5A9B4] outline-none text-white"
                    />
                    <button 
                      onClick={sendAllianceMessage}
                      className="p-3 bg-[#A5A9B4] text-black rounded-full hover:bg-white transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
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
              exit={{ opacity: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-4">L'Arsenal <span className="text-[#A5A9B4]">Manufacture.</span></h1>
              <p className="text-white/30 italic mb-8 max-w-md">"Choisissez l'objet de votre hégémonie. Chaque pièce est forgée individuellement."</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {PRODUCTS.map(p => (
                  <div 
                    key={p.id} 
                    className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-[#A5A9B4]/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[9px] tracking-widest text-[#A5A9B4] uppercase">{p.tag}</span>
                        <h3 className="text-lg font-black italic mt-1">{p.name}</h3>
                        <p className="text-xs text-white/30 mt-1">{p.desc}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#A5A9B4]/10 flex items-center justify-center">
                        <p.icon className="w-6 h-6 text-[#A5A9B4]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-[#A5A9B4]">{p.prices[currency]} {currency}</p>
                      <button 
                        onClick={() => addToCart(p)} 
                        className="px-6 py-4 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Sceller
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA Commande directe */}
              <div className="mt-8 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center">
                <p className="text-sm text-white/50 mb-4">Ou commandez directement votre carte NFC personnalisée</p>
                <button 
                  onClick={() => navigate('/order/type')}
                  className="px-10 py-5 bg-emerald-600 text-white rounded-full font-black uppercase text-sm tracking-[0.3em] hover:bg-emerald-500 transition-all inline-flex items-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  Tunnel de Commande
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB: CHECKOUT */}
          {activeTab === 'checkout' && (
            <motion.div 
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              {step < 4 ? (
                <div className="space-y-8">
                  <h1 className="text-3xl font-black italic">L'Alliance <span className="text-[#A5A9B4]">Scellée.</span></h1>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="w-12 h-12 mx-auto text-white/10 mb-4" />
                        <p className="text-white/30 italic">L'Arsenal attend votre décision souveraine.</p>
                        <button 
                          onClick={() => setActiveTab('shop')}
                          className="mt-4 px-6 py-3 border border-white/10 text-white rounded-full text-sm hover:bg-white/5 transition-all"
                        >
                          Explorer l'Arsenal
                        </button>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-[#A5A9B4]" />
                            <span className="font-black">{item.name} (x{item.qty})</span>
                          </div>
                          <span className="text-[#A5A9B4] font-black">{item.prices[currency] * item.qty} {currency}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {cart.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-lg font-black text-right">
                        Total: <span className="text-[#A5A9B4]">{totals.total} {currency}</span>
                      </p>
                      <button 
                        onClick={handleCheckout} 
                        disabled={cart.length === 0} 
                        className="w-full py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-sm tracking-[0.4em] hover:bg-white transition-all disabled:opacity-30"
                      >
                        {isProcessing ? "SÉCURISATION..." : "VALIDER L'ASCENSION"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 space-y-8">
                  <div className="relative inline-block">
                    <Crown className="w-20 h-20 mx-auto text-[#A5A9B4]" />
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black italic text-[#A5A9B4]">Scellé.</h1>
                  <p className="text-white/30 italic max-w-md mx-auto">
                    "Bienvenue dans l'Alliance N°1 Mondiale. Votre identité souveraine est en cours de forge."
                  </p>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={sealMyLegacy} 
                      className="px-8 py-5 border border-[#A5A9B4] text-[#A5A9B4] rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#A5A9B4] hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <Flag className="w-4 h-4" /> Inscrire ma Lignée
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/${brandProfile.whatsapp}`, '_blank')} 
                      className="px-8 py-5 bg-emerald-600 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                    >
                      <Phone className="w-4 h-4" /> WhatsApp Concierge
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: RITUAL */}
          {activeTab === 'ritual' && (
            <motion.div 
              key="ritual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-4">Le <span className="text-[#A5A9B4]">Rituel.</span></h1>
              <p className="text-white/30 italic mb-10 max-w-md">"Les trois étapes sacrées de votre ascension dans l'Alliance Sovereign."</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { step: "01", title: "Réception", desc: "Ouvrez le coffret titane forgé i-Wasp.", icon: Box },
                  { step: "02", title: "Activation", desc: "Approchez votre puce NFC de votre smartphone.", icon: Nfc },
                  { step: "03", title: "Scellement", desc: "Votre identité est maintenant immortalisée.", icon: KeyRound }
                ].map(r => (
                  <div 
                    key={r.step} 
                    className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center hover:border-[#A5A9B4]/30 transition-all"
                  >
                    <p className="text-4xl font-black text-[#A5A9B4]/20 mb-4">{r.step}</p>
                    <r.icon className="w-10 h-10 mx-auto text-[#A5A9B4] mb-4" />
                    <h3 className="text-base font-black mb-1">{r.title}</h3>
                    <p className="text-xs text-white/40 italic">{r.desc}</p>
                  </div>
                ))}
              </div>
              
              {/* CTA Commander */}
              <div className="text-center">
                <button 
                  onClick={() => navigate('/order/type')}
                  className="px-12 py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-sm tracking-[0.4em] shadow-2xl hover:bg-white transition-all inline-flex items-center gap-4"
                >
                  <Sparkles className="w-5 h-5" />
                  Commencer le Rituel
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-3xl border-t border-white/5 px-2 py-3 safe-area-pb">
        <div className="flex items-center justify-around">
          {[
            { id: 'magic' as TabId, icon: Wand2, label: 'Magic' },
            { id: 'legacy' as TabId, icon: Flag, label: 'Legacy' },
            { id: 'home' as TabId, icon: Globe, label: 'Dash' },
            { id: 'shop' as TabId, icon: ShoppingBag, label: 'Arsenal' },
            { id: 'checkout' as TabId, icon: ShoppingCart, label: 'Panier' }
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === t.id ? 'text-[#A5A9B4] bg-white/5' : 'text-white/20'}`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-[8px] tracking-wider uppercase font-black">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        @keyframes particle-premium { 
          0% { transform: rotate(var(--angle)) translateY(0); opacity: 1; } 
          100% { transform: rotate(var(--angle)) translateY(var(--dist)); opacity: 0; } 
        }
        .animate-particle-premium { animation: particle-premium 2s cubic-bezier(0, 0, 0.2, 1) forwards; }
        @keyframes core-expand { 
          0% { transform: scale(0.5); opacity: 1; } 
          100% { transform: scale(8); opacity: 0; } 
        }
        .animate-core-expand { animation: core-expand 3s cubic-bezier(0, 0, 0.2, 1) forwards; }
        @keyframes marquee { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        .animate-marquee { display: flex; animation: marquee 40s linear infinite; width: max-content; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: rgba(165, 169, 180, 0.2); border-radius: 20px; }
        .safe-area-pb { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};

export default CheckoutTunnel;
