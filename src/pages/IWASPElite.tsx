import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Smartphone, Bot, ChevronRight, Wifi, Database, TrendingUp, Zap, Shield, Star, Check, ExternalLink, MessageCircle, Save, Linkedin, Instagram, Globe, LayoutDashboard, CreditCard, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Link } from 'react-router-dom';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Chart data
const chartData = [
  { name: 'Lun', scans: 45, saves: 32 },
  { name: 'Mar', scans: 52, saves: 38 },
  { name: 'Mer', scans: 48, saves: 35 },
  { name: 'Jeu', scans: 70, saves: 52 },
  { name: 'Ven', scans: 85, saves: 63 },
  { name: 'Sam', scans: 62, saves: 45 },
  { name: 'Dim', scans: 38, saves: 28 },
];

// Intro Vision Section - L'Identité Digitale Absolue
const IntroVisionSection = () => (
  <section className="py-16 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] mb-6">
          L'Identité Digitale <span className="text-[#D4AF37]">Absolue</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Bienvenue dans l'univers i-wasp. Cette section explore la fusion entre le networking traditionnel et l'intelligence artificielle. Nous avons conçu une architecture où chaque interaction physique via NFC devient une porte d'entrée vers une aura digitale complète et optimisée.
        </p>
      </motion.div>
    </div>
  </section>
);

// Hero Section Component
const HeroSection = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A1931] via-[#162a4a] to-[#0A1931]">
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00D9A3]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto px-6 py-20 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Floating card */}
        <motion.div 
          className="flex justify-center order-2 lg:order-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div 
            className="relative"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <div className="w-80 h-48 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-3xl border border-[#D4AF37]/30 shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="text-white font-bold text-lg">i-wasp</div>
                <div className="text-gray-400 text-sm">Elite Card</div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </motion.div>

        {/* Right side - Content */}
        <motion.div 
          className="text-center lg:text-left order-1 lg:order-2"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6"
          >
            <Star className="w-4 h-4 text-[#D4AF37]" fill="#D4AF37" />
            <span className="text-[#D4AF37] font-medium text-sm">N°1 au Maroc • i-wasp Elite</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
          >
            Maîtrisez votre<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
              Aura Digitale.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed"
          >
            Plus qu'une carte NFC. Un écosystème intelligent qui rayonne votre succès et centralise vos réseaux sociaux d'un seul <span className="text-[#00D9A3] font-semibold">"Tap"</span>.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Link
              to="/commander"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A1931] font-bold text-lg rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-105"
            >
              Déployer mon Aura
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* CSS for float animation */}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
    `}</style>
  </section>
);

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: '🤖',
      title: 'IA Assistée',
      description: 'Génération de contenu dynamique pour votre bio et optimisation automatique de votre visibilité.'
    },
    {
      icon: '✨',
      title: 'Luxe Physique',
      description: 'Cartes en métal, bois précieux ou PVC recyclé. Un objet d\'exception pour une première impression parfaite.'
    },
    {
      icon: '📱',
      title: 'Hub Social',
      description: 'Centralisez Instagram, LinkedIn, WhatsApp et vos portfolios en un point d\'accès unique.'
    }
  ];

  return (
    <section className="py-16 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#D4AF37]/30"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A1931] to-[#162a4a] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0A1931] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Dashboard Section Header
const DashboardIntroSection = () => (
  <section className="py-16 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] mb-6">
          Pilotez votre <span className="text-[#D4AF37]">Performance</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Le Tableau de Bord i-wasp transforme les interactions physiques en données stratégiques. Suivez vos scans en temps réel, analysez l'engagement de vos visiteurs et recevez des conseils de notre IA pour perfectionner votre image de marque.
        </p>
      </motion.div>
    </div>
  </section>
);

// Dashboard Section
const DashboardSection = () => {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <section className="py-16 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* Dashboard mockup */}
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left column - Sidebar + Aura Score */}
            <div className="space-y-6">
              {/* User sidebar card */}
              <div className="bg-gradient-to-br from-[#0A1931] to-[#162a4a] rounded-3xl p-6 shadow-xl">
                {/* User info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-[#0A1931] font-bold text-lg">
                    MK
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Mehdi K.</h4>
                    <p className="text-gray-400 text-sm">Membre Elite i-wasp</p>
                  </div>
                </div>

                {/* Navigation tabs */}
                <div className="space-y-2">
                  {[
                    { id: 'global', icon: LayoutDashboard, label: 'Vue Globale' },
                    { id: 'cartes', icon: CreditCard, label: 'Mes Cartes' },
                    { id: 'analyses', icon: BarChart3, label: 'Analyses' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#D4AF37] text-[#0A1931]'
                          : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aura Score */}
              <div className="bg-gradient-to-br from-[#0A1931] to-[#162a4a] rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-gray-300 font-medium">Score Aura Digitale</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle 
                        cx="48" cy="48" r="40" fill="none" 
                        stroke="url(#goldGradient)" 
                        strokeWidth="8" 
                        strokeDasharray={`${92 * 2.51} ${100 * 2.51}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#00D9A3" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-white">92%</span>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#00D9A3]/20 text-[#00D9A3] text-sm font-medium mb-2">
                      Excellent
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  💡 Conseil IA: Ajoutez une story Instagram récente pour augmenter votre score de conversion.
                </p>
              </div>
            </div>

            {/* Right column - Stats + Chart */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-[#00D9A3]" />
                    <span className="text-[#00D9A3] text-sm font-medium">+18% 📈</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Scans Totaux</p>
                  <p className="text-3xl font-black text-[#0A1931]">1,482</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <Save className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#00D9A3] text-sm font-medium">+5% 📈</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">Taux de Sauvegarde</p>
                  <p className="text-3xl font-black text-[#0A1931]">74%</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[#0A1931] font-bold">Tendances des Interactions</h4>
                  <div className="flex gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A1931] font-medium">7 derniers jours</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">30 derniers jours</span>
                  </div>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0A1931', 
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '12px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="scans" 
                        stroke="#D4AF37" 
                        strokeWidth={3}
                        fill="url(#colorScans)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Profile Experience Intro
const ProfileIntroSection = () => (
  <section className="py-16 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] mb-6">
          L'Interface de votre <span className="text-[#D4AF37]">Aura</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Lorsqu'un partenaire scanne votre carte i-wasp, voici l'expérience qu'il découvre. Un design mobile-first fluide, inspiré des codes du luxe et des réseaux sociaux, conçu pour simplifier la prise de contact et maximiser votre impact visuel.
        </p>
      </motion.div>
    </div>
  </section>
);

// Profile Experience Section
const ProfileExperienceSection = () => {
  const stories = [
    { emoji: '🔥', label: 'VISION', bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600' },
    { emoji: '💼', label: 'PROJETS', bgColor: 'bg-gradient-to-br from-purple-600 to-purple-700' },
    { emoji: '🎥', label: 'DEMO', bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600' }
  ];

  return (
    <section className="py-8 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* Phone mockup */}
        <motion.div 
          className="flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scaleIn}
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="w-[340px] bg-[#0A1931] rounded-[3rem] p-3 shadow-2xl border-4 border-[#D4AF37]/30">
              {/* Phone notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
              
              {/* Phone screen */}
              <div className="bg-gradient-to-b from-[#0f1629] to-[#1a1f3a] rounded-[2.5rem] overflow-hidden min-h-[600px]">
                {/* Status bar */}
                <div className="flex justify-between items-center px-8 py-3 text-white text-xs">
                  <span className="font-semibold">12:45</span>
                  <div className="flex items-center gap-1 text-sm">
                    📶 🔋
                  </div>
                </div>

                {/* Share button */}
                <div className="absolute top-16 right-8 z-10">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Profile content */}
                <div className="px-6 pb-8 pt-4">
                  {/* Cover gradient background */}
                  <div className="absolute top-12 left-0 right-0 h-32 bg-gradient-to-b from-[#D4AF37]/20 to-transparent" />

                  {/* Avatar with gold ring */}
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#D4AF37] to-[#F4D03F]">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4a90a4] to-[#6bb5c9] flex items-center justify-center overflow-hidden">
                          <span className="text-4xl">👨‍💼</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-5">
                    <h3 className="text-white font-black text-xl mb-1">Mehdi El Alami</h3>
                    <p className="text-[#D4AF37] text-xs font-bold tracking-wider uppercase mb-2">
                      Fondateur i-wasp Elite 🚀
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-[220px] mx-auto">
                      Digitalisant le networking au Maroc via le NFC et l'IA. Expert en identité digitale premium.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mb-6">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A1931] font-bold rounded-xl text-xs">
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl text-xs">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      WhatsApp
                    </button>
                  </div>

                  {/* Stories */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white text-xs font-bold">Stories i-wasp</span>
                      <span className="text-[#D4AF37] text-xs font-medium">Voir tout</span>
                    </div>
                    <div className="flex gap-2">
                      {stories.map((story, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 aspect-square rounded-xl ${story.bgColor} flex flex-col items-center justify-center p-2 transition-transform hover:scale-105`}
                        >
                          <span className="text-xl mb-1">{story.emoji}</span>
                          <span className="text-white text-[9px] font-bold tracking-wide">{story.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="space-y-2">
                    {[
                      { icon: Linkedin, name: 'LinkedIn', sub: 'Réseau Professionnel', color: '#0077B5' },
                      { icon: Instagram, name: 'Instagram', sub: 'Portfolio Visuel', color: '#E4405F' },
                      { icon: Globe, name: 'Site Web', sub: 'www.i-wasp.com', color: '#00D9A3' },
                    ].map((link, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${link.color}20` }}>
                          <link.icon className="w-4 h-4" style={{ color: link.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{link.name}</p>
                          <p className="text-gray-400 text-xs">{link.sub}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500 text-xs">
                      <Zap className="w-3 h-3" />
                      Propulsé par i-wasp
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00D9A3]/20 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// AI Intelligence Intro
const AIIntroSection = () => (
  <section className="py-16 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] mb-6">
          L'Intelligence au <span className="text-[#D4AF37]">Coeur</span> du Réseau
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Derrière chaque carte i-wasp se cache un moteur d'IA sophistiqué. Nous utilisons des algorithmes de traitement du langage naturel et d'analyse prédictive pour transformer un simple profil en un outil de conversion puissant. Voici l'architecture de notre intelligence.
        </p>
      </motion.div>
    </div>
  </section>
);

// AI Intelligence Section
const AIIntelligenceSection = () => {
  return (
    <section className="py-8 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* AI Pipeline - 3 step process */}
        <motion.div 
          className="max-w-5xl mx-auto mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Step 1 - Données Brutes */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0A1931]/10 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h4 className="text-[#0A1931] font-bold text-xl mb-3">Données Brutes</h4>
              <p className="text-gray-500 text-sm">Saisie de vos informations, bio actuelle, et liens sociaux.</p>
            </motion.div>

            {/* Step 2 - IA ENGINE (Golden card) */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-[#D4AF37] to-[#C4A030] rounded-3xl p-8 text-center shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0A1931] mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <h4 className="text-white font-black text-2xl mb-6 tracking-wider">IA Engine</h4>
              <div className="space-y-3">
                {['Analyse Sémantique', 'Optimisation SEO', 'Prédiction Engagement'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-left">
                    <Check className="w-5 h-5 text-[#00D9A3] flex-shrink-0" />
                    <span className="text-white/90 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step 3 - Aura Optimisée */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white rounded-3xl p-8 text-center shadow-lg border border-gray-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00D9A3] mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="text-[#0A1931] font-bold text-xl mb-3">Aura Optimisée</h4>
              <p className="text-gray-500 text-sm">Contenu premium, score 90+, et conseils personnalisés.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Efficacité de la Stack */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
          >
            <h4 className="text-[#0A1931] font-black text-xl mb-6">Efficacité de la Stack</h4>
            <div className="space-y-5">
              {[
                { label: 'Vitesse NFC', value: 99.9, color: '#00D9A3' },
                { label: 'Précision IA', value: 94, color: '#D4AF37' },
                { label: 'Uptime Plateforme', value: 100, color: '#00D9A3' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{stat.label}</span>
                    <span className="font-bold" style={{ color: stat.color }}>{stat.value}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundColor: stat.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Zéro Compromis */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#00D9A3]/10 flex items-center justify-center mb-4">
              <span className="text-3xl">🔝</span>
            </div>
            <h4 className="text-[#0A1931] font-black text-2xl mb-3">Zéro Compromis</h4>
            <p className="text-gray-500">
              Une technologie bâtie pour le futur du networking au Maroc.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="py-12 bg-[#0A1931] border-t border-white/10">
    <div className="container mx-auto px-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-[#0A1931] font-black text-sm">
          iW
        </div>
        <span className="text-white font-bold text-xl">i-wasp Elite</span>
      </div>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        Réinventer l'aura digitale des leaders au Maroc.<br />
        Fusionnant matériel de luxe et intelligence artificielle de pointe.
      </p>
      <div className="flex justify-center gap-4 mb-6">
        <Linkedin className="w-5 h-5 text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-colors" />
        <Instagram className="w-5 h-5 text-gray-400 hover:text-[#D4AF37] cursor-pointer transition-colors" />
      </div>
      <p className="text-gray-500 text-sm">
        © 2026 i-wasp. Rapport Stratégique Confidentiel.
      </p>
    </div>
  </footer>
);

// Main Page Component
const IWASPElite = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1931]/95 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-[#0A1931] font-black text-sm">
                iW
              </div>
              <span className="text-white font-bold">i-wasp</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#vision" className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm font-medium">Vision</a>
              <a href="#dashboard" className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm font-medium">Tableau de Bord</a>
              <a href="#profile" className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm font-medium">Expérience Profil</a>
              <a href="#ia" className="text-gray-300 hover:text-[#D4AF37] transition-colors text-sm font-medium">Intelligence IA</a>
            </div>
            <Link 
              to="/commander" 
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A1931] font-bold text-sm rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Commander
            </Link>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div id="vision" className="pt-20">
        <IntroVisionSection />
        <HeroSection />
        <FeaturesSection />
      </div>
      <div id="dashboard">
        <DashboardIntroSection />
        <DashboardSection />
      </div>
      <div id="profile">
        <ProfileIntroSection />
        <ProfileExperienceSection />
      </div>
      <div id="ia">
        <AIIntroSection />
        <AIIntelligenceSection />
      </div>
      <Footer />
    </div>
  );
};

export default IWASPElite;
