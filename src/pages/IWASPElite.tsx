import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Smartphone, Bot, ChevronRight, Wifi, Database, TrendingUp, Zap, Shield, Star, Check, ExternalLink, MessageCircle, Save, Linkedin, Instagram, Globe, LayoutDashboard, CreditCard, BarChart3, Cpu, Network, Brain, Users, Crown, Layers, Activity, Eye, Lock, Rocket, Share2, QrCode, Smartphone as PhoneIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

// ============================================
// DESIGN SYSTEM - i-wasp ELITE "NEXUS"
// ============================================
const NEXUS = {
  midnight: '#0A1931',
  midnightLight: '#162a4a',
  gold: '#D4AF37',
  goldLight: '#F4D03F',
  emerald: '#00D9A3',
  offwhite: '#FBFBFB',
  platinum: '#E5E4E2',
  platinumGlow: 'rgba(229, 228, 226, 0.4)',
  goldGlow: 'rgba(212, 175, 55, 0.4)',
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6 }
  }
};

// ============================================
// NAVIGATION ELITE
// ============================================
const EliteNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#0A1931]/98 backdrop-blur-xl shadow-lg shadow-black/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] transition-all duration-300">
              <span className="text-[#0A1931] font-black text-lg tracking-tighter">iW</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tighter">i-wasp</span>
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase">NEXUS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-10">
            {[
              { label: 'Écosystème', href: '#ecosystem' },
              { label: 'Fonctionnalités', href: '#features' },
              { label: 'Tarifs', href: '#pricing' },
              { label: 'Témoignages', href: '#testimonials' },
            ].map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="relative text-gray-300 hover:text-white text-sm font-medium transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <Link 
            to="/commander" 
            className="relative px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A1931] font-bold text-sm rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              Déployer mon Nexus
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4D03F] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

// ============================================
// HERO SECTION - NEXUS ENGINE 3D
// ============================================
const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NEXUS.midnight} 0%, ${NEXUS.midnightLight} 50%, ${NEXUS.midnight} 100%)` }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: `${NEXUS.gold}15` }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: `${NEXUS.emerald}10` }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${NEXUS.gold} 1px, transparent 1px), linear-gradient(90deg, ${NEXUS.gold} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-6 py-32 relative z-10"
        style={{ y, opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Nexus Engine Visual */}
          <motion.div 
            className="relative flex justify-center order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* 3D Nexus Engine Core */}
            <div className="relative">
              {/* Outer ring */}
              <motion.div 
                className="absolute inset-0 w-80 h-80 rounded-full border border-[#D4AF37]/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle ring with dots */}
              <motion.div 
                className="absolute inset-4 w-72 h-72 rounded-full border border-[#00D9A3]/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                {[0, 90, 180, 270].map((deg, i) => (
                  <div 
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-[#00D9A3]"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${deg}deg) translateX(144px) translateY(-50%)`,
                    }}
                  />
                ))}
              </motion.div>

              {/* Inner glow */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-xl" />

              {/* Central Card */}
              <motion.div 
                className="relative w-80 h-80 flex items-center justify-center"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-56 h-36 bg-gradient-to-br from-[#1a1a2e] via-[#0f0f1a] to-[#0A1931] rounded-[2rem] border border-[#D4AF37]/40 shadow-[0_0_60px_rgba(212,175,55,0.3)] overflow-hidden relative">
                  {/* Card shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  />
                  
                  {/* NFC icon */}
                  <div className="absolute top-4 right-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Wifi className="w-5 h-5 text-[#D4AF37]" />
                    </motion.div>
                  </div>
                  
                  {/* Card content */}
                  <div className="absolute bottom-4 left-5">
                    <div className="text-white font-black text-xl tracking-tighter">i-wasp</div>
                    <div className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">NEXUS ELITE</div>
                  </div>
                  
                  {/* Chip */}
                  <div className="absolute top-1/2 left-5 -translate-y-1/2">
                    <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#B8956C]" />
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              {[
                { icon: Brain, pos: 'top-0 right-0', delay: 0 },
                { icon: Network, pos: 'bottom-0 left-0', delay: 0.5 },
                { icon: Zap, pos: 'top-1/4 -right-8', delay: 1 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${item.pos}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + item.delay, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div 
            className="text-center lg:text-left order-1 lg:order-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-[#D4AF37]/30 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-[#00D9A3] animate-pulse" />
              <span className="text-[#D4AF37] font-bold text-sm tracking-wide">N°1 en Europe • Technologie Nexus</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8"
            >
              Le Nexus de<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
                l'Identité Digitale
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed"
            >
              Une seule carte NFC qui connecte votre <span className="text-white font-semibold">vCard</span>, votre <span className="text-white font-semibold">site personnel</span>, vos <span className="text-white font-semibold">projets</span> et vos <span className="text-[#00D9A3] font-semibold">stories dynamiques</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/commander"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A1931] font-bold text-lg rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Activer mon Nexus</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F4D03F] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <a
                href="#ecosystem"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-[#E5E4E2]/40 hover:shadow-[0_0_30px_rgba(229,228,226,0.2)] transition-all duration-300"
              >
                Découvrir l'écosystème
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '50K+', label: 'Utilisateurs actifs' },
                { value: '99.9%', label: 'Uptime' },
                { value: '< 0.5s', label: 'Temps de scan' },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white tracking-tighter">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
            animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// ============================================
// ECOSYSTEM SECTION
// ============================================
const EcosystemSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'IA Génératrice',
      description: 'Notre IA optimise votre bio, prédit l\'engagement et personnalise votre profil pour maximiser les conversions.',
      gradient: 'from-purple-500/20 to-purple-600/5',
      iconBg: 'bg-purple-500',
    },
    {
      icon: Wifi,
      title: 'NFC Ultra-Rapide',
      description: 'Technologie de pointe avec latence < 0.5s. Compatible avec 99.9% des smartphones modernes.',
      gradient: 'from-[#D4AF37]/20 to-[#D4AF37]/5',
      iconBg: 'bg-[#D4AF37]',
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancés',
      description: 'Tableau de bord en temps réel avec tracking des scans, géolocalisation et insights comportementaux.',
      gradient: 'from-[#00D9A3]/20 to-[#00D9A3]/5',
      iconBg: 'bg-[#00D9A3]',
    },
    {
      icon: Layers,
      title: 'Collections & Stories',
      description: 'Présentez vos projets et actualités avec des stories dynamiques comme sur Instagram.',
      gradient: 'from-pink-500/20 to-pink-600/5',
      iconBg: 'bg-pink-500',
    },
    {
      icon: Share2,
      title: 'Multi-Plateformes',
      description: 'Connectez LinkedIn, Instagram, WhatsApp, et votre site web en un point d\'accès unique.',
      gradient: 'from-blue-500/20 to-blue-600/5',
      iconBg: 'bg-blue-500',
    },
    {
      icon: Lock,
      title: 'Sécurité Premium',
      description: 'Chiffrement de bout en bout, conformité RGPD et contrôle total de vos données.',
      gradient: 'from-gray-500/20 to-gray-600/5',
      iconBg: 'bg-gray-600',
    },
  ];

  return (
    <section id="ecosystem" className="py-32 bg-[#FBFBFB] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1931]/5 border border-[#0A1931]/10 mb-6">
            <Cpu className="w-4 h-4 text-[#0A1931]" />
            <span className="text-[#0A1931] font-bold text-sm">Écosystème Nexus</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1931] tracking-tighter mb-6">
            Une Architecture<br />
            <span className="text-[#D4AF37]">IA-Native</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Chaque fonctionnalité est conçue pour amplifier votre présence digitale et transformer chaque interaction en opportunité.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`group relative bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="relative text-xl font-black text-[#0A1931] tracking-tight mb-3">{feature.title}</h3>
              <p className="relative text-gray-600 leading-relaxed">{feature.description}</p>
              
              {/* Arrow */}
              <div className="relative mt-6 flex items-center gap-2 text-[#D4AF37] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// PRICING SECTION
// ============================================
const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '29',
      period: '/mois',
      description: 'Parfait pour les indépendants et freelances.',
      features: [
        '1 carte NFC premium',
        'Profil digital illimité',
        'Analytics basiques',
        'Support email',
        '1 000 scans/mois',
      ],
      cta: 'Commencer',
      popular: false,
    },
    {
      name: 'Signature Elite',
      price: '79',
      period: '/mois',
      description: 'L\'expérience Nexus complète pour les leaders.',
      features: [
        '3 cartes NFC luxe (Métal)',
        'Profil Nexus + Stories',
        'IA Content Generator',
        'Analytics avancés + API',
        'Support prioritaire 24/7',
        'Scans illimités',
        'Branding personnalisé',
      ],
      cta: 'Devenir Elite',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      period: '',
      description: 'Solutions sur mesure pour les équipes.',
      features: [
        'Cartes illimitées',
        'Dashboard équipe',
        'SSO & SAML',
        'SLA 99.99%',
        'Account Manager dédié',
        'Intégrations custom',
        'Formation on-site',
      ],
      cta: 'Contacter',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 bg-gradient-to-br from-[#0A1931] via-[#162a4a] to-[#0A1931] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#D4AF37]/30 mb-6">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-bold text-sm">Tarification Transparente</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            Investissez dans votre<br />
            <span className="text-[#D4AF37]">Aura Digitale</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Des formules adaptées à chaque ambition. Sans engagement, résiliable à tout moment.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`relative rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8956C] shadow-[0_0_60px_rgba(212,175,55,0.4)] scale-105 lg:scale-110' 
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#E5E4E2]/30 hover:shadow-[0_0_40px_rgba(229,228,226,0.15)]'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#0A1931] rounded-full">
                  <span className="text-[#D4AF37] text-xs font-black tracking-wider uppercase">Le plus populaire</span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3 className={`text-2xl font-black tracking-tight mb-2 ${plan.popular ? 'text-[#0A1931]' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? 'text-[#0A1931]/70' : 'text-gray-400'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-[#0A1931]' : 'text-white'}`}>
                  {plan.price}€
                </span>
                <span className={`text-lg ${plan.popular ? 'text-[#0A1931]/70' : 'text-gray-400'}`}>
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-[#0A1931]' : 'bg-[#00D9A3]'}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-[#D4AF37]' : 'text-white'}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-[#0A1931]/90' : 'text-gray-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/commander"
                className={`block w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#0A1931] text-[#D4AF37] hover:bg-[#162a4a] hover:shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-[#E5E4E2]/40 hover:shadow-[0_0_25px_rgba(229,228,226,0.2)]'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// TESTIMONIALS SECTION
// ============================================
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "i-wasp a complètement transformé ma façon de networker. Mes contacts sont impressionnés à chaque fois.",
      author: "Sophie Martin",
      role: "CEO, TechVision",
      avatar: "SM",
    },
    {
      quote: "Le ROI est incroyable. 3x plus de leads qualifiés depuis que j'utilise ma carte Nexus Elite.",
      author: "Alexandre Durand",
      role: "Consultant Senior",
      avatar: "AD",
    },
    {
      quote: "L'IA de génération de contenu m'a fait gagner des heures. Mon profil est maintenant parfait.",
      author: "Marie Laurent",
      role: "Directrice Marketing",
      avatar: "ML",
    },
  ];

  return (
    <section id="testimonials" className="py-32 bg-[#FBFBFB] relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A1931]/5 border border-[#0A1931]/10 mb-6">
            <Users className="w-4 h-4 text-[#0A1931]" />
            <span className="text-[#0A1931] font-bold text-sm">Témoignages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0A1931] tracking-tighter mb-6">
            Ils ont adopté le<br />
            <span className="text-[#D4AF37]">Mode Nexus</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-[#0A1931] font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-[#0A1931]">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION
// ============================================
const CTASection = () => (
  <section className="py-24 bg-gradient-to-br from-[#0A1931] via-[#162a4a] to-[#0A1931] relative overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <motion.div 
        className="text-center max-w-3xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
          Prêt à activer votre<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">Nexus Digital ?</span>
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          Rejoignez 50 000+ leaders qui ont déjà transformé leur networking.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/commander"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#0A1931] font-bold text-lg rounded-xl shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:shadow-[0_0_60px_rgba(212,175,55,0.6)] transition-all duration-300 hover:-translate-y-1"
          >
            <span>Commencer maintenant</span>
            <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="https://wa.me/33626424394"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-[#E5E4E2]/40 hover:shadow-[0_0_30px_rgba(229,228,226,0.2)] transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Parler à un expert</span>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

// ============================================
// FOOTER
// ============================================
const EliteFooter = () => (
  <footer className="py-16 bg-[#0A1931] border-t border-white/10">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <span className="text-[#0A1931] font-black text-lg tracking-tighter">iW</span>
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tighter">i-wasp</span>
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase ml-2">NEXUS</span>
            </div>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
            Le Nexus de l'Identité Digitale. Transformez chaque interaction en opportunité avec notre technologie NFC & IA de pointe.
          </p>
          <div className="flex gap-4">
            {[Linkedin, Instagram].map((Icon, i) => (
              <a 
                key={i}
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold mb-4">Produit</h4>
          <ul className="space-y-3">
            {['Fonctionnalités', 'Tarifs', 'Témoignages', 'API'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Entreprise</h4>
          <ul className="space-y-3">
            {['À propos', 'Contact', 'CGV', 'Mentions légales'].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          © 2026 i-wasp. Tous droits réservés. Leader en Europe.
        </p>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Lock className="w-4 h-4" />
          <span>Sécurisé & Conforme RGPD</span>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================
const IWASPElite = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <EliteNavbar />
      <HeroSection />
      <EcosystemSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <EliteFooter />
    </div>
  );
};

export default IWASPElite;
