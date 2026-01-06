/**
 * CheckoutTunnel - Sovereign Stealth Design
 * 
 * Features: Dashboard, Manufacture, Legacy Map, Magic Scanner, Rituel, WhatsApp
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, CreditCard, Crown, Diamond, Fingerprint, Shirt, 
  Radar, ShoppingBag, Flag, Sparkles, Wand2, Mic, Box, Nfc, KeyRound,
  ShoppingCart, Loader2, Phone, ChevronRight, Clock, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

// --- ANIMATION FEU D'ARTIFICE ---
const TitaniumFirework = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-2 h-2 bg-[#A5A9B4] rounded-full animate-particle-fast" 
          style={{ 
            '--angle': `${(i / 40) * 360}deg`, 
            '--dist': `${150 + Math.random() * 200}px`, 
            animationDelay: `${Math.random() * 0.3}s` 
          } as React.CSSProperties} 
        />
      ))}
      <div className="w-20 h-20 bg-[#A5A9B4] rounded-full animate-core-ping" />
    </div>
  );
};

// Produits catalogue
const PRODUCTS = [
  { id: 1, name: 'Carte Titane Brossé', prices: { EUR: 290, MAD: 3200 }, icon: CreditCard, tag: 'Standard' },
  { id: 2, name: 'Bague Optic N-X', prices: { EUR: 580, MAD: 6300 }, icon: Diamond, tag: 'Exclusif' },
  { id: 3, name: 'Set Ongles Aura', prices: { EUR: 450, MAD: 4900 }, icon: Fingerprint, tag: 'Innovation' },
  { id: 4, name: 'Labels Couture (x5)', prices: { EUR: 190, MAD: 2100 }, icon: Shirt, tag: 'Couture' }
];

type Currency = 'MAD' | 'EUR';
type TabId = 'home' | 'shop' | 'legacy' | 'monitor' | 'magic' | 'voice' | 'ritual' | 'checkout';

interface CartItem {
  id: number;
  name: string;
  prices: { EUR: number; MAD: number };
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  qty: number;
}

interface LegacyFlag {
  id: number;
  x: string;
  y: string;
  name: string;
  city: string;
}

const CheckoutTunnel = () => {
  const navigate = useNavigate();
  
  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [currency, setCurrency] = useState<Currency>('MAD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showFirework, setShowFirework] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Statistiques Globales
  const [globalNodes] = useState(842910);
  const [activeScans] = useState(124);

  // Magic Tool
  const [magicInput, setMagicInput] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  
  // Calculateur d'impact
  const [scansPerDay, setScansPerDay] = useState(15);

  // Legacy Map Data
  const [legacyFlags, setLegacyFlags] = useState<LegacyFlag[]>([
    { id: 1, x: '45%', y: '35%', name: 'Julian D.', city: 'Paris' },
    { id: 2, x: '42%', y: '48%', name: 'Marc A.', city: 'Marrakech' },
    { id: 3, x: '44%', y: '46%', name: 'Elite Hub', city: 'Casablanca' },
    { id: 4, x: '55%', y: '72%', name: 'Sovereign 01', city: 'Dubai' },
    { id: 5, x: '30%', y: '30%', name: 'Founding Member', city: 'New York' },
  ]);

  const brandProfile = { domain: "i-wasp.com", whatsapp: "33626424394" };

  const sidebarItems = [
    { id: 'home' as TabId, label: 'Dashboard', icon: Globe },
    { id: 'shop' as TabId, label: 'Manufacture', icon: ShoppingBag },
    { id: 'legacy' as TabId, label: 'Legacy Map', icon: Flag },
    { id: 'monitor' as TabId, label: 'Global Monitor', icon: Radar },
    { id: 'magic' as TabId, label: 'Magic Tool', icon: Wand2 },
    { id: 'voice' as TabId, label: 'IA Vocal', icon: Mic },
    { id: 'ritual' as TabId, label: 'Le Rituel', icon: Sparkles },
  ];

  // --- LOGIQUES ---
  const notify = (msg: string) => { 
    setNotification(msg); 
    toast.success(msg);
    setTimeout(() => setNotification(null), 3000); 
  };
  
  const addToCart = (p: typeof PRODUCTS[0]) => {
    const exists = cart.find(i => i.id === p.id);
    setCart(exists ? cart.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i) : [...cart, {...p, qty: 1}]);
    notify(`${p.name} scellé.`);
  };

  const totals = useMemo(() => {
    const sub = cart.reduce((acc, curr) => acc + (curr.prices[currency] * curr.qty), 0);
    const ship = (sub > 5000 || sub === 0) ? 0 : (currency === 'MAD' ? 150 : 15);
    return { sub, ship, total: sub + ship };
  }, [cart, currency]);

  const points = useMemo(() => Math.floor(totals.total / 10), [totals.total]);

  const influenceStats = useMemo(() => ({ 
    reach: scansPerDay * 30 * 200, 
    expansion: scansPerDay * 15 
  }), [scansPerDay]);

  const handleMagicScan = async () => {
    if(!magicInput) return notify("Cible manquante.");
    setIsMagicLoading(true);
    await new Promise(r => setTimeout(r, 3500));
    setIsMagicLoading(false);
    setShowFirework(true);
    notify("Identité extraite.");
    setTimeout(() => setShowFirework(false), 3000);
  };

  const placeMyLegacy = () => {
    setLegacyFlags([...legacyFlags, { 
      id: Date.now(), 
      x: `${40 + Math.random() * 10}%`, 
      y: `${40 + Math.random() * 10}%`, 
      name: "Vous", 
      city: "Casablanca" 
    }]);
    setActiveTab('legacy');
    notify("Emplacement scellé dans la Legacy Map.");
  };

  const handleCheckout = () => {
    setIsProcessing(true); 
    setTimeout(() => { 
      setIsProcessing(false); 
      setStep(4); 
      setShowFirework(true); 
      setTimeout(() => setShowFirework(false), 4000); 
    }, 2500);
  };

  useEffect(() => { 
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000); 
    return () => clearInterval(t); 
  }, []);

  return (
    <div className="min-h-screen bg-[#030504] text-white font-['Inter'] overflow-hidden relative">
      <TitaniumFirework active={showFirework} />
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(165,169,180,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000]"
          >
            <div className="px-8 py-4 bg-[#A5A9B4] text-black rounded-full font-black text-sm tracking-widest uppercase shadow-2xl flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" />
              {notification}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <button onClick={() => navigate('/')} className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#A5A9B4] rounded-xl md:rounded-2xl flex items-center justify-center text-black font-black text-lg md:text-xl italic shadow-2xl">
              W
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-base font-black tracking-wider text-white">{brandProfile.domain}</p>
            <p className="text-[9px] tracking-[0.4em] text-[#A5A9B4] uppercase">SOVEREIGN EMPIRE</p>
          </div>
        </button>
        
        <div className="flex items-center space-x-3">
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

      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-20 bottom-0 w-64 p-4 border-r border-white/5 z-40 hidden lg:flex flex-col justify-between bg-black/20 backdrop-blur-xl">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                activeTab === item.id 
                ? 'bg-[#A5A9B4] text-black shadow-2xl' 
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

      {/* --- MAIN INTERFACE --- */}
      <main className="lg:ml-64 pt-24 pb-28 px-4 md:px-10 relative z-10 min-h-screen">
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
                <p className="text-[10px] tracking-[0.5em] text-[#A5A9B4] uppercase mb-4">L'Identité de Prestige</p>
                <h1 className="text-4xl md:text-6xl font-black italic leading-[0.9] tracking-tight mb-8">
                  Dominez <br /><span className="text-[#A5A9B4]">L'Expansion.</span>
                </h1>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveTab('shop')} 
                    className="px-10 py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-white transition-all"
                  >
                    Manufacture <ChevronRight className="inline w-4 h-4 ml-1" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('legacy')} 
                    className="px-8 py-6 border border-white/10 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center gap-3"
                  >
                    <Flag className="w-4 h-4" /> Legacy Map
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4 mb-6">
                    <Radar className="w-8 h-8 text-[#A5A9B4]" />
                    <h3 className="text-lg font-black italic">Calculateur <span className="text-[#A5A9B4]">D'Impact</span></h3>
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
                      className="w-full h-1 bg-white/10 rounded-full accent-[#A5A9B4]" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] text-white/30 uppercase mb-1">Reach Mensuel</p>
                      <p className="text-xl font-black text-[#A5A9B4]">{influenceStats.reach.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] text-white/30 uppercase mb-1">Network Boost</p>
                      <p className="text-xl font-black text-emerald-400">+{influenceStats.expansion}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-center min-h-[250px]">
                  <Crown className="w-20 h-20 text-[#A5A9B4]/20" />
                </div>
              </div>
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
              <p className="text-white/30 italic mb-8 max-w-md">"Chaque drapeau est une hégémonie scellée sur le domaine i-wasp.com."</p>
              
              <div className="relative w-full aspect-video rounded-3xl border border-white/10 bg-black/60 overflow-hidden">
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
                  <span>Nodes: {globalNodes.toLocaleString()}</span>
                  <span className="text-emerald-400">Live: {activeScans}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: MAGIC */}
          {activeTab === 'magic' && (
            <motion.div 
              key="magic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-10">Magic <span className="text-[#A5A9B4]">Scanner.</span></h1>
              <div className="relative mb-6">
                <Wand2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input 
                  type="text" 
                  placeholder="URL du site cible..." 
                  value={magicInput} 
                  onChange={(e) => setMagicInput(e.target.value)} 
                  className="w-full bg-black/60 border border-white/10 rounded-full px-14 py-5 text-base focus:border-[#A5A9B4] outline-none text-white placeholder:text-white/10" 
                />
              </div>
              <button 
                onClick={handleMagicScan} 
                disabled={isMagicLoading} 
                className="w-full py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-sm tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {isMagicLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {isMagicLoading ? "Analyse..." : "Lancer la Magie"}
              </button>
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
              <h1 className="text-4xl md:text-6xl font-black italic mb-10">L'Arsenal <span className="text-[#A5A9B4]">Maroc.</span></h1>
              <div className="grid md:grid-cols-2 gap-6">
                {PRODUCTS.map(p => (
                  <div 
                    key={p.id} 
                    className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-[#A5A9B4]/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <span className="text-[9px] tracking-widest text-[#A5A9B4] uppercase">{p.tag}</span>
                        <h3 className="text-lg font-black italic mt-1">{p.name}</h3>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#A5A9B4]/10 flex items-center justify-center">
                        <p.icon className="w-6 h-6 text-[#A5A9B4]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black text-[#A5A9B4]">{p.prices[currency]} {currency}</p>
                      <button 
                        onClick={() => addToCart(p)} 
                        className="px-6 py-4 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all"
                      >
                        Sceller
                      </button>
                    </div>
                  </div>
                ))}
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
                  <h1 className="text-3xl font-black italic">Mon Alliance.</h1>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3">
                    {cart.length === 0 ? (
                      <p className="text-white/30 text-center py-8 italic">La manufacture attend vos ordres...</p>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                          <span className="font-black">{item.name} (x{item.qty})</span>
                          <span className="text-[#A5A9B4] font-black">{item.prices[currency] * item.qty} {currency}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-lg font-black text-right">
                    Total: <span className="text-[#A5A9B4]">{totals.total} {currency}</span>
                  </p>
                  <button 
                    onClick={handleCheckout} 
                    disabled={cart.length === 0} 
                    className="w-full py-6 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-sm tracking-[0.4em] hover:bg-white transition-all disabled:opacity-30"
                  >
                    {isProcessing ? "Sécurisation..." : "Valider l'Ascension"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 space-y-8">
                  <Crown className="w-20 h-20 mx-auto text-[#A5A9B4]" />
                  <h1 className="text-4xl font-black italic text-[#A5A9B4]">Hégémonie.</h1>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={placeMyLegacy} 
                      className="px-8 py-5 border border-[#A5A9B4] text-[#A5A9B4] rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#A5A9B4] hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <Flag className="w-4 h-4" /> Planter mon Drapeau
                    </button>
                    <button 
                      onClick={() => window.open(`https://wa.me/${brandProfile.whatsapp}`, '_blank')} 
                      className="px-8 py-5 bg-emerald-600 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                    >
                      <Phone className="w-4 h-4" /> Finaliser sur WhatsApp
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
              <h1 className="text-4xl md:text-6xl font-black italic mb-10">Le <span className="text-[#A5A9B4]">Rituel.</span></h1>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: "01", title: "Réception", desc: "Ouvrez le coffret titane forgé i-Wasp.", icon: Box },
                  { step: "02", title: "Activation", desc: "Approchez votre puce NFC de l'OS Sovereign.", icon: Nfc },
                  { step: "03", title: "Scellement", desc: "Signez votre adhésion sur la blockchain.", icon: KeyRound }
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
              <h1 className="text-4xl md:text-6xl font-black italic mb-4">Global <span className="text-[#A5A9B4]">Monitor.</span></h1>
              <p className="text-white/30 italic mb-8 max-w-md">"Surveillance en temps réel du réseau Sovereign. Chaque scan est une connexion."</p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Cartes Actives', value: globalNodes.toLocaleString(), icon: CreditCard },
                  { label: 'Scans 24h', value: '12,847', icon: Radar },
                  { label: 'Réseau Live', value: activeScans, icon: Globe, isLive: true }
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
            </motion.div>
          )}

          {/* TAB: IA VOCAL */}
          {activeTab === 'voice' && (
            <motion.div 
              key="voice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-black italic mb-4 text-center">IA <span className="text-[#A5A9B4]">Vocal.</span></h1>
              <p className="text-white/30 italic mb-10 text-center">"Votre assistant vocal Sovereign. Commandez par la voix."</p>
              
              <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-b from-[#A5A9B4]/20 to-transparent flex items-center justify-center border border-[#A5A9B4]/30">
                  <Mic className="w-10 h-10 text-[#A5A9B4]" />
                </div>
                <p className="text-white/50 text-sm mb-6">Appuyez pour parler</p>
                <button 
                  onClick={() => notify("IA Vocal activée. Dites votre commande...")}
                  className="px-10 py-5 bg-[#A5A9B4] text-black rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all"
                >
                  Activer le Micro
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { cmd: '"Nouvelle commande"', desc: 'Lance le tunnel de commande' },
                  { cmd: '"Mes stats"', desc: 'Affiche le Global Monitor' },
                  { cmd: '"Legacy Map"', desc: 'Ouvre la carte mondiale' },
                  { cmd: '"Contacter support"', desc: 'Ouvre WhatsApp' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <p className="font-black text-[#A5A9B4] text-sm mb-1">{item.cmd}</p>
                    <p className="text-[9px] text-white/30">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-2 py-3 safe-area-pb">
        <div className="flex items-center justify-around">
          {[
            { id: 'magic' as TabId, icon: Wand2, label: 'Magic' },
            { id: 'legacy' as TabId, icon: Flag, label: 'Legacy' },
            { id: 'home' as TabId, icon: Globe, label: 'Dash' },
            { id: 'shop' as TabId, icon: ShoppingBag, label: 'Build' },
            { id: 'checkout' as TabId, icon: ShoppingCart, label: 'Cart' }
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)} 
              className={`flex flex-col items-center gap-1 ${activeTab === t.id ? 'text-[#A5A9B4]' : 'text-white/20'}`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-[8px] tracking-wider uppercase font-black">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        @keyframes particle-fast { 
          0% { transform: rotate(var(--angle)) translateY(0); opacity: 1; } 
          100% { transform: rotate(var(--angle)) translateY(var(--dist)); opacity: 0; } 
        }
        .animate-particle-fast { animation: particle-fast 1.5s cubic-bezier(0, 0, 0.2, 1) forwards; }
        @keyframes core-ping { 
          0% { transform: scale(1); opacity: 1; } 
          100% { transform: scale(5); opacity: 0; } 
        }
        .animate-core-ping { animation: core-ping 2.5s forwards; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
        .safe-area-pb { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};

export default CheckoutTunnel;
