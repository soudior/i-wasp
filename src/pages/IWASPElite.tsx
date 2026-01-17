import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Smartphone, Bot, TrendingUp, Eye, LayoutDashboard, CreditCard, BarChart3, Save, MessageCircle, Linkedin, Instagram, Globe, ChevronRight, ChevronDown, Cpu, Database, Zap, Settings, FileText, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ============================================
// DESIGN SYSTEM - i-wasp ELITE
// ============================================
const ELITE = {
  midnight: '#0A1931',
  midnightLight: '#162a4a',
  gold: '#D4AF37',
  emerald: '#00D9A3',
  offwhite: '#FBFBFB',
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

// ============================================
// NAVIGATION
// ============================================
const EliteNavbar = () => {
  const [activeSection, setActiveSection] = useState('vision');

  const navItems = [
    { id: 'vision', label: 'VISION' },
    { id: 'dashboard', label: 'TABLEAU DE BORD' },
    { id: 'profile', label: 'EXPÉRIENCE PROFIL' },
    { id: 'intelligence', label: 'INTELLIGENCE IA' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0A1931] border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
              <span className="text-[#0A1931] font-black text-sm">iW</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">I-WASP</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 pb-1 ${
                  activeSection === item.id 
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// SECTION: VISION INTRO
// ============================================
const VisionIntro = () => (
  <section id="vision" className="py-16 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      <motion.div 
        className="max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
          L'Identité Digitale Absolue
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Bienvenue dans l'univers i-wasp. Cette section explore la fusion entre le networking traditionnel et l'intelligence artificielle. Nous avons conçu une architecture où chaque interaction physique via NFC devient une porte d'entrée vers une aura digitale complète et optimisée.
        </p>
      </motion.div>
    </div>
  </section>
);

// ============================================
// SECTION: HERO
// ============================================
const HeroSection = () => (
  <section className="relative py-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${ELITE.midnight} 0%, ${ELITE.midnightLight} 100%)` }}>
    {/* Large iW Background Text */}
    <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[400px] font-black text-white/[0.03] tracking-tighter select-none pointer-events-none">
      iW
    </div>
    
    <div className="container mx-auto px-6 relative z-10">
      <motion.div 
        className="max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Badge */}
        <motion.div 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-8"
        >
          <span className="text-[#D4AF37] font-bold text-sm tracking-widest">N°1 AU MAROC • I-WASP ELITE</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          variants={fadeInUp}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-6"
        >
          Maîtrisez votre<br />
          <span className="text-[#D4AF37]">Aura Digitale.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={fadeInUp}
          className="text-xl text-gray-300 mb-10 leading-relaxed"
        >
          Plus qu'une carte NFC. Un écosystème intelligent qui rayonne votre succès et centralise vos réseaux sociaux d'un seul "Tap".
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeInUp}>
          <Link
            to="/commander"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-[#0A1931] font-bold text-lg rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300"
          >
            DÉPLOYER MON AURA
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ============================================
// SECTION: FEATURES (3 Cards)
// ============================================
const FeaturesSection = () => {
  const features = [
    {
      emoji: '🤖',
      title: 'IA Assistée',
      description: 'Génération de contenu dynamique pour votre bio et optimisation automatique de votre visibilité.',
    },
    {
      emoji: '✨',
      title: 'Luxe Physique',
      description: 'Cartes en métal, bois précieux ou PVC recyclé. Un objet d\'exception pour une première impression parfaite.',
    },
    {
      emoji: '📱',
      title: 'Hub Social',
      description: 'Centralisez Instagram, LinkedIn, WhatsApp et vos portfolios en un point d\'accès unique.',
    },
  ];

  return (
    <section className="py-16 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0A1931]/5 flex items-center justify-center mb-6 text-3xl">
                {feature.emoji}
              </div>
              <h3 className="text-xl font-black text-[#0A1931] tracking-tight mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// SECTION: DASHBOARD
// ============================================
const DashboardSection = () => {
  const [activeTab, setActiveTab] = useState('Vue Globale');
  
  // Chart data points for the line graph
  const chartData = [
    { day: 'Lun', value: 120 },
    { day: 'Mar', value: 180 },
    { day: 'Mer', value: 150 },
    { day: 'Jeu', value: 280 },
    { day: 'Ven', value: 320 },
    { day: 'Sam', value: 380 },
    { day: 'Dim', value: 450 },
  ];
  
  const maxValue = Math.max(...chartData.map(d => d.value));
  
  return (
    <section id="dashboard" className="py-24 bg-[#FBFBFB]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="max-w-4xl mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
            Pilotez votre Performance
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Le Tableau de Bord i-wasp transforme les interactions physiques en données stratégiques. Suivez vos scans en temps réel, analysez l'engagement de vos visiteurs et recevez des conseils de notre IA pour perfectionner votre image de marque.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div 
          className="grid lg:grid-cols-12 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Left Sidebar */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0A1931] flex items-center justify-center text-white font-black text-lg">
                  MK
                </div>
                <div>
                  <div className="text-[#0A1931] font-black text-lg">Mehdi K.</div>
                  <div className="text-[#D4AF37] text-xs font-bold tracking-wide uppercase">MEMBRE ELITE I-WASP</div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="space-y-2">
                {[
                  { id: 'Vue Globale', icon: LayoutDashboard },
                  { id: 'Mes Cartes', icon: CreditCard },
                  { id: 'Analyses', icon: BarChart3 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'bg-[#0A1931] text-white' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aura Score Card */}
            <div className="bg-gradient-to-br from-[#0A1931] to-[#162a4a] rounded-[2rem] p-6 shadow-lg">
              <div className="text-center mb-4">
                <span className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase">SCORE AURA DIGITALE</span>
              </div>
              
              {/* Circular Progress */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="12" 
                    fill="none" 
                  />
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke="#D4AF37" 
                    strokeWidth="12" 
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${92 * 4.4} ${100 * 4.4}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">92%</span>
                  <span className="text-[#00D9A3] font-bold text-sm uppercase tracking-wide">EXCELLENT</span>
                </div>
              </div>

              {/* AI Tip */}
              <div className="p-4 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                <p className="text-[#D4AF37] text-sm text-center">
                  💡 Conseil IA: Ajoutez une story Instagram récente pour augmenter votre score de conversion.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div variants={fadeInUp} className="lg:col-span-9 space-y-6">
            {/* Stats Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Scans Totaux */}
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1931]/5 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#0A1931]" />
                  </div>
                  <span className="text-[#00D9A3] font-bold text-sm flex items-center gap-1">
                    +18% <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-gray-500 text-xs font-bold tracking-wide uppercase mb-1">SCANS TOTAUX</div>
                  <div className="text-4xl font-black text-[#0A1931] tracking-tighter">1,482</div>
                </div>
              </div>
              
              {/* Taux de Sauvegarde */}
              <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1931]/5 flex items-center justify-center">
                    <Save className="w-6 h-6 text-[#0A1931]" />
                  </div>
                  <span className="text-[#00D9A3] font-bold text-sm flex items-center gap-1">
                    +5% <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-gray-500 text-xs font-bold tracking-wide uppercase mb-1">TAUX DE SAUVEGARDE</div>
                  <div className="text-4xl font-black text-[#0A1931] tracking-tighter">74%</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#0A1931] tracking-tight">Tendances des Interactions</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span className="font-medium">7 derniers jours</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              
              {/* Line Chart */}
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400">
                  <span>500</span>
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-12 h-full flex flex-col">
                  <div className="flex-1 relative">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-gray-100" 
                        style={{ top: `${i * 20}%` }} 
                      />
                    ))}
                    
                    {/* SVG Line */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00D9A3" />
                          <stop offset="100%" stopColor="#00D9A3" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={chartData.map((d, i) => {
                          const x = (i / (chartData.length - 1)) * 100;
                          const y = 100 - (d.value / 500) * 100;
                          return `${x}%,${y}%`;
                        }).join(' ')}
                      />
                      {/* Data points */}
                      {chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100;
                        const y = 100 - (d.value / 500) * 100;
                        return (
                          <circle
                            key={i}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="6"
                            fill="white"
                            stroke="#00D9A3"
                            strokeWidth="3"
                          />
                        );
                      })}
                    </svg>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="h-8 flex justify-between items-center text-xs text-gray-400 px-2">
                    {chartData.map((d, i) => (
                      <span key={i}>{d.day}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// SECTION: PROFILE EXPERIENCE
// ============================================
const ProfileExperienceSection = () => (
  <section id="profile" className="py-24 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      {/* Section Header */}
      <motion.div 
        className="max-w-4xl mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
          L'Interface de votre Aura
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Lorsqu'un partenaire scanne votre carte i-wasp, voici l'expérience qu'il découvre. Un design mobile-first fluide, inspiré des codes du luxe et des réseaux sociaux, conçu pour simplifier la prise de contact et maximiser votre impact visuel.
        </p>
      </motion.div>

      {/* Phone Mockup */}
      <motion.div 
        className="flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-[320px] bg-[#0A1931] rounded-[3rem] p-3 shadow-2xl">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-6 py-2 text-white text-sm">
              <span className="font-semibold">12:45</span>
              <span className="text-xs">📶 🔋</span>
            </div>
            
            {/* Screen Content */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden">
              {/* Header with gradient */}
              <div className="relative h-32 bg-gradient-to-br from-[#0A1931] to-[#162a4a]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h3 className="text-xl font-black text-[#0A1931] tracking-tight">Mehdi El Alami</h3>
                <p className="text-[#D4AF37] font-medium text-sm mb-2">Fondateur i-wasp Elite 🚀</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Digitalisant le networking au Maroc via le NFC et l'IA. Expert en identité digitale premium.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 px-6 mb-6">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0A1931] text-white rounded-xl font-bold text-sm">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>

              {/* Stories */}
              <div className="px-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#0A1931] font-bold text-sm">Stories i-wasp</span>
                  <span className="text-[#D4AF37] text-sm">Voir tout</span>
                </div>
                <div className="flex gap-3">
                  {[
                    { emoji: '🔥', label: 'VISION' },
                    { emoji: '💼', label: 'PROJETS' },
                    { emoji: '🎥', label: 'DEMO' },
                  ].map((story, i) => (
                    <div key={i} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] p-0.5 mb-1">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                          {story.emoji}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold">{story.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="px-6 pb-6 space-y-3">
                {[
                  { icon: Linkedin, name: 'LinkedIn', subtitle: 'Reseau Professionnel', color: '#0077B5' },
                  { icon: Instagram, name: 'Instagram', subtitle: 'Portfolio Visuel', color: '#E4405F' },
                  { icon: Globe, name: 'Site Web', subtitle: 'www.i-wasp.com', color: '#0A1931' },
                ].map((link, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${link.color}15` }}>
                      <link.icon className="w-5 h-5" style={{ color: link.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[#0A1931] font-bold text-sm">{link.name}</div>
                      <div className="text-gray-400 text-xs">{link.subtitle}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="py-4 bg-gray-50 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Propulsé par i-wasp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ============================================
// SECTION: INTELLIGENCE IA
// ============================================
const IntelligenceSection = () => (
  <section id="intelligence" className="py-24 bg-[#FBFBFB]">
    <div className="container mx-auto px-6">
      {/* Section Header */}
      <motion.div 
        className="max-w-4xl mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-black text-[#0A1931] tracking-tighter mb-6">
          L'Intelligence au Coeur du Réseau
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Derrière chaque carte i-wasp se cache un moteur d'IA sophistiqué. Nous utilisons des algorithmes de traitement du langage naturel et d'analyse prédictive pour transformer un simple profil en un outil de conversion puissant. Voici l'architecture de notre intelligence.
        </p>
      </motion.div>

      {/* AI Pipeline */}
      <motion.div 
        className="grid lg:grid-cols-3 gap-8 mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Step 1: Raw Data */}
        <motion.div variants={fadeInUp} className="bg-[#0A1931] rounded-[2rem] p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Database className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-black text-white mb-3">Données Brutes</h3>
          <p className="text-gray-400 leading-relaxed">
            Saisie de vos informations, bio actuelle, et liens sociaux.
          </p>
        </motion.div>

        {/* Step 2: AI Engine */}
        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#D4AF37] to-[#B8956C] rounded-[2rem] p-8 text-center shadow-[0_0_40px_rgba(212,175,55,0.3)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0A1931] flex items-center justify-center mb-6">
            <Cpu className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-black text-[#0A1931] mb-4">IA Engine</h3>
          <div className="space-y-2 text-left">
            {['Analyse Sémantique', 'Optimisation SEO', 'Prédiction Engagement'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[#0A1931]/80 font-medium">
                <span className="text-[#00D9A3]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 3: Optimized Aura */}
        <motion.div variants={fadeInUp} className="bg-[#0A1931] rounded-[2rem] p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-[#00D9A3]" />
          </div>
          <h3 className="text-xl font-black text-white mb-3">Aura Optimisée</h3>
          <p className="text-gray-400 leading-relaxed">
            Contenu premium, score 90+, et conseils personnalisés.
          </p>
        </motion.div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Efficiency Stats */}
        <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-black text-[#0A1931] mb-6">Efficacité de la Stack</h3>
          <div className="space-y-6">
            {[
              { label: 'Vitesse NFC', value: 99.9 },
              { label: 'Précision IA', value: 94 },
              { label: 'Uptime Plateforme', value: 100 },
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">{stat.label}</span>
                  <span className="text-[#0A1931] font-bold">{stat.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#00D9A3] rounded-full"
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

        {/* Zero Compromise Card */}
        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] rounded-[2rem] p-8 flex flex-col justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)]">
          <div className="text-6xl mb-4">🔝</div>
          <h3 className="text-2xl font-black text-[#0A1931] mb-3">Zéro Compromis</h3>
          <p className="text-[#0A1931]/70 leading-relaxed">
            Une technologie bâtie pour le futur du networking au Maroc.
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ============================================
// FOOTER
// ============================================
const EliteFooter = () => (
  <footer className="py-12 bg-[#0A1931]">
    <div className="container mx-auto px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
          <span className="text-[#0A1931] font-black text-xs">iW</span>
        </div>
        <span className="text-white font-black tracking-tight">i-wasp Elite</span>
      </div>
      <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
        Réinventer l'aura digitale des leaders au Maroc.<br />
        Fusionnant matériel de luxe et intelligence artificielle de pointe.
      </p>
      <p className="text-gray-500 text-xs">
        © 2026 i-wasp. Rapport Stratégique Confidentiel.
      </p>
    </div>
  </footer>
);

// ============================================
// MAIN PAGE
// ============================================
const IWASPElite = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans">
      <EliteNavbar />
      <VisionIntro />
      <HeroSection />
      <FeaturesSection />
      <DashboardSection />
      <ProfileExperienceSection />
      <IntelligenceSection />
      <EliteFooter />
    </div>
  );
};

export default IWASPElite;
