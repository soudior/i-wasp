/**
 * EliteDashboard - i-Wasp Command Center
 * Stealth Luxury Style (#050807, #A5A9B4, #D1D5DB)
 * Full-featured dashboard with Terminal Tap, Ads Strategy, Manufacture
 */

import { useState } from 'react';
import { 
  User, ChevronRight, Zap, Crown, 
  Smartphone, CheckCircle2, Sparkles, Fingerprint, 
  Shirt, Diamond, Scan, Truck, ShoppingBag, 
  Award, Nfc, Megaphone, BarChart3, TrendingUp, 
  Filter, Globe, Wallet, Settings
} from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Stealth Luxury Colors
const COLORS = {
  bg: "#050807",
  bgCard: "#0A0D0C",
  accent: "#A5A9B4",
  accentLight: "#D1D5DB",
  text: "#F9FAFB",
  textMuted: "rgba(249, 250, 251, 0.5)",
  textDim: "rgba(249, 250, 251, 0.3)",
  border: "rgba(165, 169, 180, 0.15)",
  success: "#4ADE80",
};

type TabId = 'profil' | 'ads' | 'terminal' | 'cards' | 'ambassador' | 'logistics' | 'scanner';

const navItems = [
  { id: 'profil' as const, label: "L'Identité", icon: User },
  { id: 'ads' as const, label: 'Stratégie Pub', icon: Megaphone },
  { id: 'terminal' as const, label: 'Terminal Tap', icon: Nfc },
  { id: 'cards' as const, label: 'Manufacture', icon: ShoppingBag },
  { id: 'ambassador' as const, label: 'Ambassadeur', icon: Award },
  { id: 'logistics' as const, label: 'Logistique', icon: Truck },
  { id: 'scanner' as const, label: 'Scanner', icon: Scan },
];

export default function EliteDashboard() {
  const { currency, toggleCurrency, regionLabel, formatAmount } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabId>('ads');
  const [isChameleonActive, setIsChameleonActive] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  // Product catalog with dual pricing
  const products = [
    { id: 1, name: 'Carte Titane Brossé', priceEUR: 290, priceMAD: 3200, desc: 'Acier chirurgical, gravure laser.', icon: Smartphone },
    { id: 2, name: 'Set Ongles Aura', priceEUR: 450, priceMAD: 4900, desc: 'Micro-puces Bio-S invisibles.', icon: Fingerprint },
    { id: 3, name: 'Labels Couture', priceEUR: 190, priceMAD: 2100, desc: 'Thermocollage pour vêtements.', icon: Shirt },
    { id: 4, name: 'Bague Onyx N-X', priceEUR: 580, priceMAD: 6300, desc: 'Céramique & Technologie NFC.', icon: Diamond },
  ];

  const moroccoLogistics = [
    { city: "Casablanca", service: "Conciergerie Anfa", delay: "2h" },
    { city: "Marrakech", service: "Retrait Hivernage", delay: "Immédiat" },
    { city: "Tanger", service: "Livraison Marina", delay: "4h" },
  ];

  const walletBalance = currency === 'EUR' ? '12,400.00 €' : '135,000.00 DH';

  // Payment Terminal Logic
  const addDigit = (d: string) => {
    if (paymentStatus !== 'idle') return;
    setPaymentAmount(prev => prev === '0' ? d : prev + d);
  };

  const processPayment = () => {
    if (paymentAmount === '0') return;
    setPaymentStatus('processing');
    setTimeout(() => setPaymentStatus('success'), 2500);
    setTimeout(() => {
      setPaymentStatus('idle');
      setPaymentAmount('0');
      toast.success(`Transaction de ${paymentAmount} ${currency === 'EUR' ? '€' : 'DH'} validée`);
    }, 5000);
  };

  const getProductPrice = (product: typeof products[0]) => {
    const amount = currency === 'EUR' ? product.priceEUR : product.priceMAD;
    return currency === 'EUR' ? `${amount}€` : `${amount.toLocaleString()} DH`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* TOPBAR */}
      <header 
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, color: COLORS.bg }}
          >
            W
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight" style={{ color: COLORS.text }}>i-WASP</h1>
            <p className="text-[10px] italic" style={{ color: COLORS.textDim }}>Infinite Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCurrency}
            className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-2 transition-all"
            style={{ backgroundColor: `${COLORS.accent}10`, border: `1px solid ${COLORS.border}`, color: COLORS.accent }}
          >
            <Globe size={12} />
            {regionLabel}
          </button>

          <div 
            className="px-4 py-2 rounded-full flex items-center gap-2"
            style={{ backgroundColor: `${COLORS.accent}10`, border: `1px solid ${COLORS.border}` }}
          >
            <Wallet size={14} style={{ color: COLORS.accent }} />
            <span className="text-sm font-semibold" style={{ color: COLORS.text }}>{walletBalance}</span>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg transition-colors"
            style={{ color: COLORS.textMuted }}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside 
          className="w-72 p-6 hidden lg:block"
          style={{ borderRight: `1px solid ${COLORS.border}` }}
        >
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
                style={{
                  background: activeTab === item.id 
                    ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`
                    : 'transparent',
                  color: activeTab === item.id ? COLORS.bg : COLORS.textMuted,
                  transform: activeTab === item.id ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div 
            className="mt-8 p-4 rounded-2xl"
            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: COLORS.textDim }}>
              Fidélité Status
            </p>
            <div className="flex items-center gap-2">
              <Crown size={16} style={{ color: COLORS.accent }} />
              <span className="font-bold" style={{ color: COLORS.accent }}>Obsidian</span>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ADS STRATEGY TAB */}
            {activeTab === 'ads' && (
              <motion.div
                key="ads"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
                      Résonance <span style={{ color: COLORS.accent }}>Publicitaire.</span>
                    </h2>
                    <p style={{ color: COLORS.textMuted }}>
                      "Vos rencontres physiques deviennent vos audiences digitales."
                    </p>
                  </div>
                  <div 
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: `${COLORS.success}20` }}
                  >
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.success }} />
                    <span className="text-xs font-bold" style={{ color: COLORS.success }}>Pixel Sync : On</span>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Retargeting Card */}
                  <div 
                    className="rounded-3xl overflow-hidden"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                  >
                    <div 
                      className="h-40 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${COLORS.accent}20, ${COLORS.bg})` }}
                    >
                      <Filter size={48} style={{ color: COLORS.accent }} />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp size={20} style={{ color: COLORS.accent }} />
                        <h3 className="font-bold" style={{ color: COLORS.text }}>Retargeting "Phygital"</h3>
                      </div>
                      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>
                        "Dès qu'une personne scanne votre carte, elle est ajoutée à votre audience publicitaire Instagram & TikTok."
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.accent}10` }}>
                          <p className="text-xs" style={{ color: COLORS.textDim }}>Audience Maroc</p>
                          <p className="font-bold" style={{ color: COLORS.text }}>1,480 contacts</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.accent}10` }}>
                          <p className="text-xs" style={{ color: COLORS.textDim }}>Audience France</p>
                          <p className="font-bold" style={{ color: COLORS.text }}>920 contacts</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="w-full py-4 font-bold transition-all"
                      style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, color: COLORS.bg }}
                    >
                      Activer Meta Ads
                    </button>
                  </div>

                  {/* ROI Stats */}
                  <div 
                    className="rounded-3xl p-6"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart3 size={20} style={{ color: COLORS.accent }} />
                      <h3 className="font-bold" style={{ color: COLORS.text }}>ROI & Performance</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center">
                        <p className="text-4xl font-bold mb-1" style={{ color: COLORS.accent }}>22.4%</p>
                        <p className="text-sm" style={{ color: COLORS.textMuted }}>Conversion Tap</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold mb-1" style={{ color: COLORS.accent }}>8.4k</p>
                        <p className="text-sm" style={{ color: COLORS.textMuted }}>Re-clic Meta</p>
                      </div>
                    </div>
                    <div 
                      className="p-4 rounded-xl flex items-center justify-between"
                      style={{ backgroundColor: `${COLORS.accent}10`, border: `1px solid ${COLORS.border}` }}
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={16} style={{ color: COLORS.accent }} />
                        <span className="text-sm" style={{ color: COLORS.textMuted }}>Budget Optima</span>
                      </div>
                      <span className="font-bold" style={{ color: COLORS.text }}>
                        {currency === 'EUR' ? '60€ / jour' : '650 DH / jour'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TERMINAL TAP TAB */}
            {activeTab === 'terminal' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg mx-auto"
              >
                <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: COLORS.text }}>
                  Terminal <span style={{ color: COLORS.accent }}>Furtif.</span>
                </h2>

                <div 
                  className="rounded-3xl overflow-hidden"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="p-8 text-center">
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: COLORS.textDim }}>
                      Vente Directe i-Wasp
                    </p>
                    <p className="text-5xl font-bold" style={{ color: COLORS.text }}>
                      {paymentAmount} <span style={{ color: COLORS.accent }}>{currency === 'EUR' ? '€' : 'DH'}</span>
                    </p>
                  </div>

                  <div className="px-6 pb-4 grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((d) => (
                      <button
                        key={d}
                        onClick={() => addDigit(d)}
                        className="h-16 rounded-2xl font-bold text-xl transition-all active:scale-95"
                        style={{ 
                          backgroundColor: `${COLORS.accent}10`, 
                          color: COLORS.text,
                          border: `1px solid ${COLORS.border}` 
                        }}
                      >
                        {d}
                      </button>
                    ))}
                    <button
                      onClick={() => setPaymentAmount('0')}
                      className="h-16 rounded-2xl font-bold text-xs uppercase"
                      style={{ backgroundColor: 'rgba(248, 113, 113, 0.1)', color: '#F87171' }}
                    >
                      Effacer
                    </button>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={processPayment}
                      disabled={paymentStatus !== 'idle' || paymentAmount === '0'}
                      className="w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                        color: COLORS.bg 
                      }}
                    >
                      <Nfc size={20} />
                      Générer Point de Tap
                    </button>
                  </div>

                  <div 
                    className="p-6 flex items-center justify-center gap-3"
                    style={{ borderTop: `1px solid ${COLORS.border}` }}
                  >
                    {paymentStatus === 'idle' && (
                      <>
                        <Smartphone size={20} style={{ color: COLORS.textMuted }} />
                        <p className="text-sm" style={{ color: COLORS.textMuted }}>
                          Approchez un objet i-Wasp pour valider.
                        </p>
                      </>
                    )}
                    {paymentStatus === 'processing' && (
                      <>
                        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${COLORS.accent} transparent ${COLORS.accent} ${COLORS.accent}` }} />
                        <p className="text-sm" style={{ color: COLORS.accent }}>Liaison Ledger...</p>
                      </>
                    )}
                    {paymentStatus === 'success' && (
                      <>
                        <CheckCircle2 size={20} style={{ color: COLORS.success }} />
                        <p className="text-sm font-bold" style={{ color: COLORS.success }}>Transaction Validée.</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROFIL TAB */}
            {activeTab === 'profil' && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.text }}>
                    L'Aura <span style={{ color: COLORS.accent }}>Stealth.</span>
                  </h2>
                  <p className="text-lg mb-8" style={{ color: COLORS.textMuted }}>
                    "L'excellence n'est pas un acte, c'est une identité synchronisée."
                  </p>

                  <div 
                    className="p-6 rounded-3xl mb-6"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles size={20} style={{ color: COLORS.accent }} />
                      <span className="font-medium" style={{ color: COLORS.text }}>Mode Caméléon</span>
                    </div>
                    <button
                      onClick={() => setIsChameleonActive(!isChameleonActive)}
                      className="w-full py-5 rounded-2xl font-bold uppercase text-sm transition-all"
                      style={{
                        background: isChameleonActive 
                          ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`
                          : `${COLORS.accent}10`,
                        color: isChameleonActive ? COLORS.bg : COLORS.textMuted,
                        border: isChameleonActive ? 'none' : `1px solid ${COLORS.border}`,
                      }}
                    >
                      {isChameleonActive ? "Protocole IA Master" : "Système en Veille"}
                    </button>
                  </div>
                </div>

                <div 
                  className="rounded-3xl p-8 flex items-center gap-6"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                >
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${COLORS.accent}30, ${COLORS.bg})` }}
                  >
                    <User size={40} style={{ color: COLORS.accent }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-1" style={{ color: COLORS.text }}>
                      {user?.user_metadata?.first_name || 'Elite Member'}
                    </p>
                    <p className="text-sm" style={{ color: COLORS.textMuted }}>Status : Obsidian</p>
                  </div>
                  <ChevronRight size={24} className="ml-auto" style={{ color: COLORS.textMuted }} />
                </div>
              </motion.div>
            )}

            {/* MANUFACTURE TAB */}
            {activeTab === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  La <span style={{ color: COLORS.accent }}>Manufacture.</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl p-5 flex items-center justify-between transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${COLORS.accent}15` }}
                        >
                          <product.icon size={24} style={{ color: COLORS.accent }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: COLORS.text }}>{product.name}</p>
                          <p className="text-xs" style={{ color: COLORS.textDim }}>Expédié du Maroc</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: COLORS.accent }}>{getProductPrice(product)}</p>
                        <button 
                          className="text-xs font-medium mt-1 hover:underline"
                          style={{ color: COLORS.textMuted }}
                          onClick={() => navigate('/order/type')}
                        >
                          Réserver →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div 
                  className="rounded-3xl overflow-hidden"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                >
                  <div 
                    className="h-48 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.bg})` }}
                  >
                    <Shirt size={64} style={{ color: COLORS.accent }} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.text }}>
                      Rituel <span style={{ color: COLORS.accent }}>Forge Textile</span>
                    </h3>
                    <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>
                      "Fixez votre identité sur vos vêtements de luxe. Une pression à 150°C pendant 18 secondes scelle votre lien."
                    </p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} style={{ color: COLORS.success }} />
                      <span className="text-sm" style={{ color: COLORS.success }}>Logistique Casablanca Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOGISTICS TAB */}
            {activeTab === 'logistics' && (
              <motion.div
                key="logistics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  Flux <span style={{ color: COLORS.accent }}>Maroc.</span>
                </h2>

                <div className="space-y-4">
                  {moroccoLogistics.map((loc, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-5 flex items-center justify-between"
                      style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${COLORS.accent}20` }}
                        >
                          <Truck size={20} style={{ color: COLORS.accent }} />
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: COLORS.text }}>{loc.city}</p>
                          <p className="text-sm" style={{ color: COLORS.textMuted }}>{loc.service}</p>
                          <p className="text-xs" style={{ color: COLORS.accent }}>Délai : {loc.delay}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} style={{ color: COLORS.textMuted }} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AMBASSADOR TAB */}
            {activeTab === 'ambassador' && (
              <motion.div
                key="ambassador"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold" style={{ color: COLORS.text }}>
                  Programme <span style={{ color: COLORS.accent }}>Ambassadeur.</span>
                </h2>

                <div 
                  className="rounded-3xl p-8"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})` }}
                    >
                      <Award size={32} style={{ color: COLORS.bg }} />
                    </div>
                    <div>
                      <p className="font-bold text-xl" style={{ color: COLORS.text }}>Code Parrain</p>
                      <p className="text-lg font-mono" style={{ color: COLORS.accent }}>WASP-ELITE-01</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${COLORS.accent}10` }}>
                      <p className="text-3xl font-bold" style={{ color: COLORS.accent }}>2,450</p>
                      <p className="text-sm" style={{ color: COLORS.textMuted }}>Points Fidélité</p>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${COLORS.accent}10` }}>
                      <p className="text-3xl font-bold" style={{ color: COLORS.accent }}>12</p>
                      <p className="text-sm" style={{ color: COLORS.textMuted }}>Filleuls Actifs</p>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 rounded-2xl font-bold"
                    style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, color: COLORS.bg }}
                  >
                    Partager mon Code
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCANNER TAB */}
            {activeTab === 'scanner' && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div 
                  className="w-64 h-64 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
                >
                  <Scan size={80} style={{ color: COLORS.accent }} />
                  <div 
                    className="absolute inset-x-0 h-1 animate-pulse"
                    style={{ backgroundColor: COLORS.accent, top: '50%' }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.text }}>Scanner NFC</h3>
                <p className="text-sm text-center max-w-xs" style={{ color: COLORS.textMuted }}>
                  Approchez un objet i-Wasp pour lire son identité blockchain.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE NAV */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-3 flex justify-around"
        style={{ backgroundColor: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}
      >
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center gap-1 p-2"
            style={{ color: activeTab === item.id ? COLORS.accent : COLORS.textMuted }}
          >
            <item.icon size={20} />
            <span className="text-[10px]">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
