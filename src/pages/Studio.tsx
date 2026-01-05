/**
 * i-WASP STUDIO — Manufacture de Prestige
 * Version Stealth Luxury avec système EUR/MAD
 * Tous les boutons sont fonctionnels
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  User, 
  Crown, 
  ShoppingBag, 
  Users, 
  Scan, 
  ShieldCheck,
  CreditCard,
  Fingerprint,
  Shirt,
  Diamond,
  CheckCircle2,
  Zap,
  Lock,
  Globe,
  Bell,
  Settings,
  ArrowRight,
  ExternalLink,
  Wallet
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Studio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('membership'); 
  const [selectedPlan, setSelectedPlan] = useState('legacy');
  const [isChameleonActive, setIsChameleonActive] = useState(true);
  const [currency, setCurrency] = useState<'EUR' | 'MAD'>('EUR');

  const products = [
    { 
      id: 1, 
      name: 'Carte Titane Brossé', 
      prices: { EUR: 290, MAD: 3200 }, 
      priceDisplay: { EUR: '290€', MAD: '3 200 DH' }, 
      desc: 'Acier chirurgical, gravure laser.', 
      icon: CreditCard 
    },
    { 
      id: 2, 
      name: 'Set Ongles Aura (10pcs)', 
      prices: { EUR: 450, MAD: 4900 }, 
      priceDisplay: { EUR: '450€', MAD: '4 900 DH' }, 
      desc: 'Micro-puces Bio-S invisibles.', 
      icon: Fingerprint 
    },
    { 
      id: 3, 
      name: 'Labels Couture (Pack 5)', 
      prices: { EUR: 190, MAD: 2100 }, 
      priceDisplay: { EUR: '190€', MAD: '2 100 DH' }, 
      desc: 'Thermocollage haute résistance.', 
      icon: Shirt 
    },
    { 
      id: 4, 
      name: 'Bague Onyx Connectée', 
      prices: { EUR: 580, MAD: 6300 }, 
      priceDisplay: { EUR: '580€', MAD: '6 300 DH' }, 
      desc: 'Céramique noire et puce N-X.', 
      icon: Diamond 
    }
  ];

  const plans = [
    { 
      id: 'stealth', 
      name: 'Stealth', 
      prices: { EUR: '0€', MAD: '0 DH' }, 
      features: ['Profil Digital', 'NFC Basique', 'Analytics 7j'], 
      level: 'Accès Libre' 
    },
    { 
      id: 'legacy', 
      name: 'Legacy', 
      prices: { EUR: '49€/m', MAD: '540 DH/m' }, 
      features: ['Mode Caméléon', 'Radar d\'Influence', 'Retargeting Ads', 'Lead Recovery AI'], 
      level: 'Plus Populaire' 
    },
    { 
      id: 'sovereign', 
      name: 'Sovereign', 
      prices: { EUR: '199€/m', MAD: '2 150 DH/m' }, 
      features: ['Conciergerie 24/7', 'Passeport Blockchain', 'Alliance Messenger Privé', 'Accès Lounges VIP'], 
      level: 'Elite' 
    }
  ];

  const [profile] = useState({
    name: user?.email?.split('@')[0] || "Utilisateur",
    title: "Membre i-WASP",
    currentMode: "Elite Stealth"
  });

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'EUR' ? 'MAD' : 'EUR');
  };

  const handleReserveProduct = (product: typeof products[0]) => {
    addItem({
      templateId: `studio-product-${product.id}`,
      templateName: 'Manufacture',
      cardName: product.name,
      quantity: 1,
      unitPriceCents: product.prices[currency] * 100,
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  const handlePayAndActivate = () => {
    navigate('/cart');
  };

  const handleActivatePlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId !== 'stealth') {
      toast.success(`Plan ${planId.toUpperCase()} sélectionné`, {
        description: "Redirection vers le paiement...",
        action: {
          label: "Payer",
          onClick: () => navigate('/checkout')
        }
      });
    } else {
      toast.success("Plan Stealth activé (Gratuit)");
    }
  };

  const handleConnectProfile = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const menuItems = [
    { id: 'profil', label: "L'Identité", icon: User },
    { id: 'membership', label: 'Abonnement', icon: Crown },
    { id: 'cards', label: 'Manufacture', icon: ShoppingBag },
    { id: 'cercle', label: 'Cercle Privé', icon: Users },
    { id: 'scanner', label: 'Scanner', icon: Scan },
    { id: 'vault', label: 'Le Coffre', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#050807] text-white overflow-x-hidden">
      {/* Navigation Titane */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 lg:py-8 flex items-center justify-between border-b border-white/5 bg-[#050807]/90 backdrop-blur-2xl">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Link to="/" className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] flex items-center justify-center font-black text-black text-lg lg:text-xl">
            W
          </Link>
          <div className="hidden sm:block">
            <h1 className="text-base lg:text-lg font-bold tracking-tight text-white">i-WASP</h1>
            <p className="text-[9px] lg:text-[10px] text-white/30 tracking-[0.2em] uppercase">Manufacture de Prestige</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 lg:space-x-8">
          {/* Sélecteur de Devise */}
          <button 
            onClick={toggleCurrency}
            className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-5 py-2 lg:py-3 rounded-full bg-white/5 border border-white/10 hover:border-[#A5A9B4]/50 transition-all"
          >
            <Globe className="w-4 h-4 text-[#A5A9B4]" />
            <span className="text-[10px] lg:text-xs text-white/60 hidden sm:inline">
              {currency === 'EUR' ? 'Europe (€)' : 'Maroc (DH)'}
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-2 px-4 lg:px-5 py-2 lg:py-3 rounded-full bg-white/5 border border-[#A5A9B4]/30">
            <Crown className="w-4 h-4 text-[#A5A9B4]" />
            <span className="text-[10px] lg:text-xs text-[#A5A9B4] font-medium">
              Rang {selectedPlan.toUpperCase()}
            </span>
          </div>

          <Link 
            to="/cart"
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all relative"
          >
            <ShoppingBag className="w-4 lg:w-5 h-4 lg:h-5 text-white/40" />
          </Link>
          
          <button 
            onClick={() => toast.info("Aucune notification")}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <Bell className="w-4 lg:w-5 h-4 lg:h-5 text-white/40" />
          </button>
          
          <Link 
            to="/settings"
            className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 items-center justify-center hover:bg-white/10 transition-all"
          >
            <Settings className="w-4 lg:w-5 h-4 lg:h-5 text-white/40" />
          </Link>
        </div>
      </nav>

      <div className="flex pt-24 lg:pt-32">
        {/* Menu Latéral */}
        <aside className="fixed left-0 top-24 lg:top-32 bottom-0 w-64 lg:w-80 p-4 lg:p-8 overflow-y-auto custom-scroll hidden lg:block">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 lg:space-x-6 p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] transition-all duration-700 mb-2 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] text-black shadow-2xl scale-[1.03]' 
                  : 'text-white/20 hover:bg-white/5 hover:text-[#A5A9B4]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050807]/95 backdrop-blur-xl border-t border-white/5 px-4 py-3">
          <div className="flex justify-around">
            {menuItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'text-[#A5A9B4]' 
                    : 'text-white/30'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{item.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Espace de Contrôle */}
        <main className="flex-1 lg:ml-80 p-4 lg:p-16 pb-32">
          <AnimatePresence mode="wait">
            {/* Onglet Abonnement */}
            {activeTab === 'membership' && (
              <motion.div
                key="membership"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-10 lg:mb-20">
                  <h2 className="text-4xl lg:text-[80px] font-black leading-none tracking-tight text-white mb-4 lg:mb-6">
                    Le Rang i-Wasp.
                  </h2>
                  <p className="text-base lg:text-xl text-white/30 max-w-xl">
                    "Choisissez l'envergure de votre influence digitale."
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => handleActivatePlan(plan.id)}
                      className={`relative p-6 lg:p-12 rounded-3xl lg:rounded-[4rem] border transition-all duration-700 cursor-pointer flex flex-col justify-between min-h-[400px] lg:h-[680px] ${
                        selectedPlan === plan.id 
                          ? 'bg-white/5 border-[#A5A9B4] shadow-[0_0_60px_rgba(165,169,180,0.08)] lg:scale-105' 
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="absolute top-4 lg:top-8 right-4 lg:right-8 px-3 lg:px-4 py-1.5 lg:py-2 bg-[#A5A9B4] text-black text-[8px] lg:text-[9px] font-black uppercase tracking-widest rounded-full">
                          Actif
                        </div>
                      )}
                      
                      <div>
                        <p className="text-[9px] lg:text-[10px] text-[#A5A9B4] font-black uppercase tracking-[0.3em] mb-3 lg:mb-4">
                          {plan.level}
                        </p>
                        <h3 className="text-3xl lg:text-5xl font-black text-white mb-6 lg:mb-10">{plan.name}</h3>
                        <div className="space-y-3 lg:space-y-4">
                          {plan.features.map((feat, i) => (
                            <div key={i} className="flex items-center space-x-3 lg:space-x-4">
                              <CheckCircle2 className="w-4 lg:w-5 h-4 lg:h-5 text-[#A5A9B4]" />
                              <span className="text-white/50 text-xs lg:text-sm">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-2xl lg:text-4xl font-black text-white mb-4 lg:mb-6">
                          {plan.prices[currency]}
                        </p>
                        <button className={`w-full py-4 lg:py-6 rounded-full font-black uppercase text-[10px] lg:text-xs tracking-widest transition-all ${
                          selectedPlan === plan.id 
                            ? 'bg-[#A5A9B4] text-black' 
                            : 'bg-white/5 text-white/30 hover:bg-white/10'
                        }`}>
                          {selectedPlan === plan.id ? 'Abonnement en cours' : 'Activer ce Rang'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Onglet Manufacture */}
            {activeTab === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-10 lg:mb-16">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl lg:text-[80px] font-black leading-none tracking-tight text-white mb-2 lg:mb-4">
                        La Manufacture.
                      </h2>
                      <p className="text-base lg:text-xl text-white/30">
                        Sélectionnez vos pièces. Expédition immédiate en 24h.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
                  {/* Grille de Produits */}
                  <div className="space-y-4 lg:space-y-6">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-5 lg:p-8 rounded-2xl lg:rounded-[3rem] border border-white/5 bg-white/[0.02] hover:border-[#A5A9B4]/30 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 lg:space-x-6">
                            <div className="w-12 lg:w-16 h-12 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#A5A9B4]/20 to-transparent flex items-center justify-center">
                              <p.icon className="w-5 lg:w-7 h-5 lg:h-7 text-[#A5A9B4]" />
                            </div>
                            <div>
                              <h4 className="text-sm lg:text-lg font-bold text-white">{p.name}</h4>
                              <p className="text-xs lg:text-sm text-white/30">{p.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg lg:text-2xl font-black text-[#A5A9B4]">
                              {p.priceDisplay[currency]}
                            </p>
                            <button 
                              onClick={() => handleReserveProduct(p)}
                              className="mt-1 lg:mt-2 text-[10px] lg:text-xs text-white/40 hover:text-[#A5A9B4] transition-colors"
                            >
                              Réserver
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tunnel d'Activation */}
                  <div className="p-6 lg:p-12 rounded-3xl lg:rounded-[4rem] border border-[#A5A9B4]/20 bg-gradient-to-b from-white/[0.03] to-transparent">
                    <div className="mb-8 lg:mb-10">
                      <div className="flex items-center space-x-4 lg:space-x-5 mb-4 lg:mb-6">
                        <Zap className="w-8 lg:w-10 h-8 lg:h-10 text-[#A5A9B4]" />
                        <h3 className="text-2xl lg:text-3xl font-black text-white">
                          Activation<br />Instantanée
                        </h3>
                      </div>
                      <p className="text-white/30 text-xs lg:text-sm leading-relaxed">
                        "Votre identité i-Wasp est déjà prête. Validez votre pièce et utilisez votre carte virtuelle immédiatement sur votre téléphone."
                      </p>
                      <div className="mt-6 lg:mt-8 p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <CheckCircle2 className="w-5 lg:w-6 h-5 lg:h-6 text-[#A5A9B4]" />
                          <div>
                            <p className="text-white font-semibold text-sm lg:text-base">Utilisation immédiate</p>
                            <p className="text-white/30 text-xs lg:text-sm">L'écosystème digital s'active en 30 secondes.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      <div className="p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[9px] lg:text-[10px] text-[#A5A9B4] font-black uppercase tracking-widest mb-2 lg:mb-3">
                          Méthodes Sécurisées
                        </p>
                        <div className="flex items-center space-x-2 lg:space-x-3 text-white/50 text-xs lg:text-sm">
                          <Lock className="w-3.5 lg:w-4 h-3.5 lg:h-4" />
                          <span>Cartes / Apple Pay / Crypto</span>
                        </div>
                      </div>
                      <button 
                        onClick={handlePayAndActivate}
                        className="w-full py-4 lg:py-6 bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] text-black font-black uppercase text-xs lg:text-sm tracking-widest rounded-full hover:shadow-[0_20px_60px_rgba(165,169,180,0.3)] transition-all flex items-center justify-center gap-2"
                      >
                        <Wallet className="w-5 h-5" />
                        Payer et Activer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Onglet Profil */}
            {activeTab === 'profil' && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                  <div>
                    <h2 className="text-5xl lg:text-[100px] font-black leading-[0.9] tracking-tight text-white mb-8 lg:mb-12">
                      L'Aura<br />Stealth.
                    </h2>
                    <div className="space-y-6 lg:space-y-8">
                      <div className="flex items-center justify-between">
                        <p className="text-[#A5A9B4] font-semibold">Mode Caméléon</p>
                        <span className={`text-xs px-3 py-1 rounded-full ${isChameleonActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                          {isChameleonActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setIsChameleonActive(!isChameleonActive);
                          toast.success(isChameleonActive ? "Mode Caméléon désactivé" : "Mode Caméléon activé");
                        }} 
                        className={`w-full py-8 lg:py-12 rounded-[2.5rem] lg:rounded-[3.5rem] font-black uppercase text-xs lg:text-[14px] transition-all shadow-2xl ${
                          isChameleonActive 
                            ? 'bg-[#A5A9B4] text-black shadow-[0_30px_60px_rgba(165,169,180,0.3)]' 
                            : 'bg-white/5 text-white/30 border border-white/10'
                        }`}
                      >
                        {isChameleonActive ? "Protocole IA Actif" : "Protocole IA Veille"}
                      </button>
                      
                      <Link 
                        to="/dashboard"
                        className="block w-full py-4 text-center bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white hover:border-[#A5A9B4]/50 transition-all text-sm font-medium"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Accéder au Dashboard
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative w-[280px] lg:w-[320px] h-[560px] lg:h-[640px] bg-black rounded-[40px] lg:rounded-[50px] border-4 border-white/10 overflow-hidden shadow-2xl">
                      <div className="absolute inset-3 lg:inset-4 rounded-[32px] lg:rounded-[40px] bg-gradient-to-b from-[#050807] to-[#0a0d0c] flex flex-col items-center justify-center p-6 lg:p-8">
                        <div className="w-20 lg:w-28 h-20 lg:h-28 rounded-full bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] mb-6 lg:mb-8 flex items-center justify-center">
                          <User className="w-10 lg:w-14 h-10 lg:h-14 text-black" />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-black text-white text-center mb-2">
                          {profile.name}
                        </h3>
                        <p className="text-[#A5A9B4] text-xs lg:text-sm">{profile.currentMode}</p>
                      </div>
                      <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2">
                        <button 
                          onClick={handleConnectProfile}
                          className="px-6 lg:px-8 py-2.5 lg:py-3 bg-[#A5A9B4] text-black text-[10px] lg:text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:shadow-lg transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Connecter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Onglet Cercle Privé */}
            {activeTab === 'cercle' && (
              <motion.div
                key="cercle"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
              >
                <Users className="w-16 lg:w-20 h-16 lg:h-20 text-[#A5A9B4]/30 mb-6 lg:mb-8" />
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 lg:mb-6">Réseau Furtif.</h2>
                <p className="text-white/30 text-base lg:text-lg max-w-md mb-8 lg:mb-10">
                  "Améliorez votre rang pour détecter les membres de prestige à proximité."
                </p>
                <button 
                  onClick={() => setActiveTab('membership')} 
                  className="px-8 lg:px-12 py-4 lg:py-6 bg-white/5 border border-[#A5A9B4] text-[#A5A9B4] font-black uppercase text-[9px] lg:text-[10px] tracking-widest rounded-full hover:bg-[#A5A9B4] hover:text-black transition-all"
                >
                  Mettre à jour mon rang
                </button>
              </motion.div>
            )}

            {/* Onglet Scanner */}
            {activeTab === 'scanner' && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
              >
                <div className="relative w-48 lg:w-64 h-48 lg:h-64 mb-8 lg:mb-12">
                  <div className="absolute inset-0 rounded-[3rem] lg:rounded-[4rem] border-2 border-[#A5A9B4]/30" />
                  <div className="absolute inset-6 lg:inset-8 rounded-[2rem] lg:rounded-[3rem] border border-[#A5A9B4]/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan className="w-16 lg:w-20 h-16 lg:h-20 text-[#A5A9B4]" />
                  </div>
                  <motion.div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A5A9B4] to-transparent"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 lg:mb-4">Scanner NFC</h2>
                <p className="text-white/30 max-w-md text-sm lg:text-base mb-8">
                  Approchez une carte ou un objet i-Wasp pour l'authentifier instantanément.
                </p>
                <button 
                  onClick={() => toast.info("Fonctionnalité NFC disponible sur l'application mobile")}
                  className="px-8 py-4 bg-white/5 border border-[#A5A9B4]/30 text-white/60 font-semibold rounded-full hover:border-[#A5A9B4] hover:text-[#A5A9B4] transition-all text-sm"
                >
                  Activer le Scanner
                </button>
              </motion.div>
            )}

            {/* Onglet Coffre */}
            {activeTab === 'vault' && (
              <motion.div
                key="vault"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
              >
                <ShieldCheck className="w-16 lg:w-20 h-16 lg:h-20 text-[#A5A9B4]/30 mb-6 lg:mb-8" />
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 lg:mb-6">Le Coffre.</h2>
                <p className="text-white/30 text-base lg:text-lg max-w-md mb-8 lg:mb-10">
                  Votre passeport blockchain et vos certificats d'authenticité sont sécurisés ici.
                </p>
                <div className="flex items-center space-x-3 px-6 lg:px-8 py-3 lg:py-4 bg-white/5 rounded-full border border-white/10 mb-6">
                  <Lock className="w-4 lg:w-5 h-4 lg:h-5 text-[#A5A9B4]" />
                  <span className="text-white/50 text-xs lg:text-sm">Chiffrement de bout en bout</span>
                </div>
                <button 
                  onClick={() => {
                    if (selectedPlan === 'sovereign') {
                      toast.success("Accès au Coffre autorisé");
                    } else {
                      toast.info("Passez au rang Sovereign pour accéder au Coffre", {
                        action: {
                          label: "Upgrade",
                          onClick: () => setActiveTab('membership')
                        }
                      });
                    }
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] text-black font-bold rounded-full hover:shadow-lg transition-all text-sm"
                >
                  Accéder au Coffre
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(165, 169, 180, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Studio;
