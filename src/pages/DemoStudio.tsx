/**
 * Demo Studio — Présentation publique sans authentification
 * Palette Stealth Luxury: #050807, #A5A9B4, #D1D5DB
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft,
  Radar,
  Radio,
  MessageSquare,
  Sparkles,
  Eye
} from "lucide-react";

const DemoStudio = () => {
  const [activeTab, setActiveTab] = useState('membership'); 
  const [selectedPlan, setSelectedPlan] = useState('legacy');
  const [isChameleonActive, setIsChameleonActive] = useState(true);
  const [currency, setCurrency] = useState<'EUR' | 'MAD'>('EUR');

  const products = [
    { 
      id: 1, 
      name: 'Carte Titane Brossé', 
      prices: { EUR: '290€', MAD: '3 200 DH' }, 
      desc: 'Acier chirurgical, gravure laser.', 
      icon: CreditCard 
    },
    { 
      id: 2, 
      name: 'Set Ongles Aura (10pcs)', 
      prices: { EUR: '450€', MAD: '4 900 DH' }, 
      desc: 'Micro-puces Bio-S invisibles.', 
      icon: Fingerprint 
    },
    { 
      id: 3, 
      name: 'Labels Couture (Pack 5)', 
      prices: { EUR: '190€', MAD: '2 100 DH' }, 
      desc: 'Thermocollage haute résistance.', 
      icon: Shirt 
    },
    { 
      id: 4, 
      name: 'Bague Onyx Connectée', 
      prices: { EUR: '580€', MAD: '6 300 DH' }, 
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
    name: "Julian de Wasp",
    title: "Directeur de l'Influence",
    currentMode: "Elite Stealth"
  });

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'EUR' ? 'MAD' : 'EUR');
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
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-black uppercase tracking-wider">Mode Démonstration</span>
          </div>
          <Link 
            to="/signup" 
            className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full hover:bg-black/80 transition-all"
          >
            Créer mon compte
          </Link>
        </div>
      </div>

      {/* Navigation Titane */}
      <nav className="fixed top-10 left-0 right-0 z-50 px-6 lg:px-12 py-6 lg:py-8 flex items-center justify-between border-b border-white/5 bg-[#050807]/90 backdrop-blur-2xl">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Link to="/" className="flex items-center space-x-3 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs hidden sm:inline">Retour</span>
          </Link>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] flex items-center justify-center font-black text-black text-lg lg:text-xl">
            W
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base lg:text-lg font-bold tracking-tight text-white">i-WASP Studio</h1>
            <p className="text-[9px] lg:text-[10px] text-white/30 tracking-[0.2em] uppercase">Démonstration</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 lg:space-x-8">
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

          <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
            <Bell className="w-4 lg:w-5 h-4 lg:h-5 text-white/40" />
          </button>
        </div>
      </nav>

      <div className="flex pt-32 lg:pt-40">
        {/* Menu Latéral */}
        <aside className="fixed left-0 top-32 lg:top-40 bottom-0 w-64 lg:w-80 p-4 lg:p-8 overflow-y-auto custom-scroll hidden lg:block">
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
                      onClick={() => setSelectedPlan(plan.id)}
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
                              {p.prices[currency]}
                            </p>
                            <button className="mt-1 lg:mt-2 text-[10px] lg:text-xs text-white/40 hover:text-[#A5A9B4] transition-colors">
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
                      <Link 
                        to="/signup" 
                        className="block w-full py-4 lg:py-6 bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] text-black font-black uppercase text-xs lg:text-sm tracking-widest rounded-full hover:shadow-[0_20px_60px_rgba(165,169,180,0.3)] transition-all text-center"
                      >
                        Créer un compte pour commander
                      </Link>
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
                      </div>
                      <button 
                        onClick={() => setIsChameleonActive(!isChameleonActive)} 
                        className={`w-full py-8 lg:py-12 rounded-[2.5rem] lg:rounded-[3.5rem] font-black uppercase text-xs lg:text-[14px] transition-all shadow-2xl ${
                          isChameleonActive 
                            ? 'bg-[#A5A9B4] text-black shadow-[0_30px_60px_rgba(165,169,180,0.3)]' 
                            : 'bg-white/5 text-white/30 border border-white/10'
                        }`}
                      >
                        {isChameleonActive ? "Protocole IA Actif" : "Protocole IA Veille"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative w-[280px] lg:w-[320px] h-[560px] lg:h-[640px] bg-black rounded-[40px] lg:rounded-[50px] border-4 border-white/10 overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#050807] via-[#0a0d0c] to-[#050807]" />
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                      
                      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#A5A9B4] to-[#D1D5DB] mb-6 flex items-center justify-center">
                          <User className="w-10 h-10 text-black" />
                        </div>
                        <h3 className="text-xl lg:text-2xl font-black text-white mb-2">{profile.name}</h3>
                        <p className="text-[#A5A9B4] text-sm mb-8">{profile.currentMode}</p>
                        <Link
                          to="/signup"
                          className="px-8 py-4 bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] text-black font-bold text-sm rounded-full"
                        >
                          Créer mon profil
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Onglet Cercle Privé avec Radar */}
            {activeTab === 'cercle' && (
              <motion.div
                key="cercle"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-10 lg:mb-16">
                  <h2 className="text-4xl lg:text-[80px] font-black leading-none tracking-tight text-white mb-4">
                    Réseau Furtif.
                  </h2>
                  <p className="text-base lg:text-xl text-white/30 max-w-xl">
                    "Détectez les membres Elite à proximité et établissez des liaisons chiffrées."
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Radar d'Influence */}
                  <div className="p-8 lg:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] relative overflow-hidden">
                    <div className="flex items-center space-x-4 mb-8">
                      <Radar className="w-6 h-6 text-[#A5A9B4]" />
                      <h3 className="text-xl font-bold text-white">Radar d'Influence</h3>
                      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#A5A9B4]/10 border border-[#A5A9B4]/30">
                        <div className="w-2 h-2 rounded-full bg-[#A5A9B4] animate-pulse" />
                        <span className="text-[10px] text-[#A5A9B4] font-medium">En veille</span>
                      </div>
                    </div>

                    {/* Radar Animation */}
                    <div className="relative w-full aspect-square max-w-[320px] mx-auto">
                      <div className="absolute inset-0 rounded-full border border-[#A5A9B4]/10" />
                      <div className="absolute inset-[15%] rounded-full border border-[#A5A9B4]/15" />
                      <div className="absolute inset-[30%] rounded-full border border-[#A5A9B4]/20" />
                      <div className="absolute inset-[45%] rounded-full border border-[#A5A9B4]/25 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#A5A9B4] shadow-[0_0_20px_rgba(165,169,180,0.5)]" />
                      </div>
                      
                      {/* Sweep */}
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                        <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left bg-gradient-to-r from-[#A5A9B4]/50 to-transparent" />
                      </div>

                      {/* Demo Points */}
                      <div className="absolute top-[20%] left-[25%] w-2 h-2 rounded-full bg-[#A5A9B4]/50" />
                      <div className="absolute top-[35%] right-[20%] w-3 h-3 rounded-full bg-[#A5A9B4]/70" />
                      <div className="absolute bottom-[25%] left-[30%] w-2 h-2 rounded-full bg-[#A5A9B4]/40" />
                    </div>

                    <p className="text-center text-white/30 text-sm mt-6">
                      3 membres détectés à proximité
                    </p>
                  </div>

                  {/* Liaisons Chiffrées */}
                  <div className="p-8 lg:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center space-x-4 mb-8">
                      <MessageSquare className="w-6 h-6 text-[#A5A9B4]" />
                      <h3 className="text-xl font-bold text-white">Liaisons Chiffrées</h3>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: "S. Dubois", status: "En ligne", time: "il y a 2 min" },
                        { name: "M. Al-Rashid", status: "Occupé", time: "il y a 1h" },
                        { name: "K. Tanaka", status: "Hors ligne", time: "il y a 3h" }
                      ].map((contact, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A5A9B4]/30 to-transparent flex items-center justify-center">
                              <User className="w-5 h-5 text-[#A5A9B4]" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">{contact.name}</p>
                              <p className="text-white/30 text-xs">{contact.time}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                            contact.status === "En ligne" 
                              ? "bg-[#A5A9B4]/10 text-[#A5A9B4]" 
                              : "bg-white/5 text-white/30"
                          }`}>
                            {contact.status}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link 
                      to="/signup" 
                      className="mt-8 block w-full py-4 bg-white/5 border border-[#A5A9B4]/30 text-[#A5A9B4] font-bold text-sm rounded-full text-center hover:bg-[#A5A9B4] hover:text-black transition-all"
                    >
                      Rejoindre le Cercle
                    </Link>
                  </div>
                </div>
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
                className="text-center"
              >
                <h2 className="text-4xl lg:text-[80px] font-black leading-none tracking-tight text-white mb-6">
                  Scanner NFC.
                </h2>
                <p className="text-base lg:text-xl text-white/30 max-w-xl mx-auto mb-12">
                  "Authentifiez instantanément tout produit équipé d'une puce i-Wasp."
                </p>

                <div className="relative w-64 h-64 lg:w-80 lg:h-80 mx-auto">
                  <div className="absolute inset-0 rounded-[3rem] border-2 border-[#A5A9B4]/30 bg-white/[0.02]" />
                  <div className="absolute inset-4 rounded-[2.5rem] border border-[#A5A9B4]/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <Scan className="w-16 h-16 lg:w-20 lg:h-20 text-[#A5A9B4]" />
                      <div className="absolute inset-0 animate-ping">
                        <Scan className="w-16 h-16 lg:w-20 lg:h-20 text-[#A5A9B4]/30" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Scan line animation */}
                  <div className="absolute inset-x-4 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#A5A9B4] to-transparent animate-pulse" />
                </div>

                <p className="text-white/30 text-sm mt-8 mb-6">
                  Approchez votre téléphone d'un produit i-Wasp
                </p>

                <Link 
                  to="/signup" 
                  className="inline-block px-8 py-4 bg-white/5 border border-[#A5A9B4]/30 text-[#A5A9B4] font-bold text-sm rounded-full hover:bg-[#A5A9B4] hover:text-black transition-all"
                >
                  Activer le Scanner
                </Link>
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
              >
                <div className="text-center mb-12 lg:mb-16">
                  <h2 className="text-4xl lg:text-[80px] font-black leading-none tracking-tight text-white mb-6">
                    Le Coffre.
                  </h2>
                  <p className="text-base lg:text-xl text-white/30 max-w-xl mx-auto">
                    "Votre identité blockchain. Immuable et vérifiable."
                  </p>
                </div>

                <div className="max-w-2xl mx-auto p-8 lg:p-12 rounded-[3rem] border border-[#A5A9B4]/20 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <div className="flex items-center justify-center mb-8">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-[#A5A9B4]/20 to-transparent flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-[#A5A9B4]" />
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                      <span className="text-white/50 text-sm">Passeport NFT</span>
                      <span className="text-[#A5A9B4] text-sm font-medium">Non activé</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                      <span className="text-white/50 text-sm">Certificat Blockchain</span>
                      <span className="text-[#A5A9B4] text-sm font-medium">En attente</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                      <span className="text-white/50 text-sm">Historique vérifié</span>
                      <span className="text-white/30 text-sm">0 transactions</span>
                    </div>
                  </div>

                  <Link 
                    to="/signup" 
                    className="block w-full py-5 bg-gradient-to-r from-[#A5A9B4] to-[#D1D5DB] text-black font-black uppercase text-sm tracking-widest rounded-full hover:shadow-[0_20px_60px_rgba(165,169,180,0.3)] transition-all text-center"
                  >
                    Activer mon Passeport Blockchain
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(165, 169, 180, 0.2); border-radius: 10px; }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-thumb { background: rgba(165, 169, 180, 0.05); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: #050807; }
      `}</style>
    </div>
  );
};

export default DemoStudio;
