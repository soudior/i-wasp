/**
 * LIANA x I-WASP Official Landing Page
 * Prestige SPA with scroll animations
 * 
 * Brand Colors:
 * - Carbon Black: #0E0E11
 * - Electric Gold: #FACC15
 * - I-Wasp Green: #4ade80
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ChevronRight, 
  ArrowDown, 
  Smartphone, 
  Mail, 
  Globe,
  Download,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IWASPBrandBadge } from '@/components/templates/IWASPBrandBadge';
import iwaspLogo from '@/assets/iwasp-logo.png';

// Theme definitions for Digital ID
const themes = {
  monolith: {
    bg: "bg-carbon",
    card: "bg-carbon",
    accent: "text-gold",
    btn: "bg-gold text-black",
    border: "border-white/[0.05]",
    icon: "text-gold",
    text: "text-white",
    name: "Monolithe Or"
  },
  abyssal: {
    bg: "bg-[#0A1A2F]",
    card: "bg-[#0A1A2F]",
    accent: "text-iwasp",
    btn: "bg-iwasp text-black",
    border: "border-white/[0.08]",
    icon: "text-iwasp",
    text: "text-white",
    name: "Abyssal Tech"
  },
  light: {
    bg: "bg-[#F5F5F7]",
    card: "bg-white",
    accent: "text-black",
    btn: "bg-black text-white",
    border: "border-black/[0.05]",
    icon: "text-black",
    text: "text-black",
    name: "Clarté Pure"
  }
};

type ThemeKey = keyof typeof themes;

// User data for Digital ID preview
const user = {
  name: "Alexandre Liana",
  role: "Visionnaire & Fondateur",
  company: "I-WASP x LIANA",
  bio: "Le sacrifice est la fondation. L'éclat est le résultat. Bâtir une force technologique pour l'humanité.",
  email: "contact@i-wasp.com",
  website: "www.i-wasp.com",
};

// Scroll reveal animation wrapper
function ScrollReveal({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Feature card component
function FeatureCard({ 
  icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <ScrollReveal delay={delay}>
      <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-500">
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/5 to-transparent" />
        
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-white/50 leading-relaxed">{description}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

// Digital ID Card Preview
function DigitalIDPreview({ theme }: { theme: typeof themes.monolith }) {
  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${user.name}\nORG:${user.company}\nTITLE:${user.role}\nEMAIL:${user.email}\nURL:${user.website}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Contact_Liana.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      className={`relative rounded-[2.5rem] overflow-hidden ${theme.card} ${theme.border} border shadow-2xl shadow-black/60`}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1000 }}
    >
      {/* Top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${theme.accent === 'text-gold' ? 'via-gold/40' : theme.accent === 'text-iwasp' ? 'via-iwasp/40' : 'via-black/20'} to-transparent`} />
      
      {/* Brand badge */}
      <div className="absolute top-6 right-6 z-10">
        <IWASPBrandBadge variant={theme.text === 'text-white' ? 'dark' : 'light'} />
      </div>
      
      <div className="p-8 pt-16">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-full ${theme.accent === 'text-gold' ? 'bg-gradient-to-br from-gold/30 to-gold/10' : theme.accent === 'text-iwasp' ? 'bg-gradient-to-br from-iwasp/30 to-iwasp/10' : 'bg-gradient-to-br from-black/10 to-black/5'} flex items-center justify-center ring-2 ${theme.border}`}>
            <span className={`text-3xl font-bold ${theme.accent}`}>L</span>
          </div>
        </div>
        
        {/* Name & Info */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-semibold ${theme.text} mb-1`}>{user.name}</h2>
          <p className={`${theme.accent} text-sm font-medium mb-2`}>{user.role}</p>
          <p className={`${theme.text} opacity-50 text-sm italic max-w-xs mx-auto`}>"{user.bio}"</p>
        </div>
        
        {/* CTA Button */}
        <button
          onClick={handleDownloadVCard}
          className={`w-full py-4 rounded-2xl ${theme.btn} font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
        >
          <Download size={18} />
          Connecter
        </button>
        
        {/* Links */}
        <div className="mt-6 space-y-3">
          <a 
            href={`https://${user.website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] ${theme.border} border hover:bg-white/[0.06] transition-colors`}
          >
            <Globe size={18} className={theme.icon} />
            <span className={`${theme.text} opacity-70 text-sm`}>{user.website}</span>
          </a>
          <a 
            href={`mailto:${user.email}`}
            className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] ${theme.border} border hover:bg-white/[0.06] transition-colors`}
          >
            <Mail size={18} className={theme.icon} />
            <span className={`${theme.text} opacity-70 text-sm`}>{user.email}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Main Landing Page Component
export default function LianaLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('monolith');
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  const theme = themes[currentTheme];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-carbon text-white overflow-x-hidden">
      {/* NAVIGATION */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-carbon/80 backdrop-blur-xl border-b border-white/[0.05]' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={iwaspLogo} 
                alt="I-WASP" 
                className="h-8 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-semibold tracking-tight">Liana</span>
            </Link>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('concept')}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Concept
              </button>
              <button 
                onClick={() => scrollToSection('digital-id')}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Digital ID
              </button>
              <button 
                onClick={() => scrollToSection('impact')}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Impact
              </button>
            </div>
            
            {/* CTA */}
            <Link to="/demo">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 rounded-full px-6"
              >
                Ma Carte
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section 
        ref={heroRef}
        id="hero" 
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gold glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
          {/* Green accent */}
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-iwasp/5 rounded-full blur-[100px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        </div>
        
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
          >
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-widest">
              L'Excellence du Sacrifice
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            L'Identité{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold to-iwasp">
                Souveraine.
              </span>
              {/* Glow effect */}
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold to-iwasp blur-2xl opacity-50">
                Souveraine.
              </span>
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Fusionner le luxe, la technologie I-Wasp et la conscience écologique 
            pour redéfinir la force de l'humanité.
          </motion.p>
          
          {/* CTAs */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={() => scrollToSection('digital-id')}
              className="bg-gold text-black hover:bg-gold/90 rounded-full px-8 py-6 text-sm font-semibold"
            >
              Accéder au Profil
              <ChevronRight size={18} className="ml-2" />
            </Button>
            <Button
              onClick={() => scrollToSection('concept')}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5 rounded-full px-8 py-6 text-sm"
            >
              Le Manifeste
              <ArrowDown size={16} className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={24} className="text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* CONCEPT SECTION */}
      <section id="concept" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-xs font-medium text-gold uppercase tracking-[0.3em] mb-4 block">
                Notre Vision
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                L'Impact par l'Excellence.
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">
                Chaque contact numérique évite la production de 0.05g de CO2. 
                Multipliez cela par votre influence.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Leaf size={28} className="text-gold" />}
              title="Prestige Durable"
              description="Le luxe ne doit plus être synonyme de gaspillage. Liana propose une alternative noble et technologique."
              delay={0.1}
            />
            <FeatureCard
              icon={<TrendingUp size={28} className="text-gold" />}
              title="Expansion Réseau"
              description="Analysez vos interactions et développez votre influence avec des outils de tracking intelligents."
              delay={0.2}
            />
            <FeatureCard
              icon={<Cpu size={28} className="text-gold" />}
              title="I-Wasp Core"
              description="L'intelligence artificielle au service de votre identité. Toujours à jour, toujours performante."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* DIGITAL ID SECTION */}
      <section id="digital-id" className="py-32 px-6 relative">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <ScrollReveal>
                <span className="text-xs font-medium text-iwasp uppercase tracking-[0.3em] mb-4 block">
                  Votre Univers
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Votre univers{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-iwasp">
                    en un contact.
                  </span>
                </h2>
                <p className="text-white/50 text-lg mb-10 leading-relaxed">
                  Le Digital ID Liana est bien plus qu'une carte de visite. 
                  C'est votre écosystème personnel, capable de s'adapter 
                  à votre interlocuteur en temps réel.
                </p>
              </ScrollReveal>
              
              {/* Theme Selector */}
              <ScrollReveal delay={0.1}>
                <div className="mb-10">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-4">
                    Choisir l'atmosphère :
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {(Object.keys(themes) as ThemeKey[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setCurrentTheme(t)}
                        className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                          currentTheme === t 
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                            : 'bg-white/5 text-white/40 hover:text-white border border-white/10'
                        }`}
                      >
                        {themes[t].name}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Features */}
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <Smartphone size={20} className="text-gold mt-0.5" />
                    <div>
                      <p className="text-white font-medium text-sm">NFC Tech</p>
                      <p className="text-white/40 text-xs">Transmission instantanée sans app.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <ShieldCheck size={20} className="text-iwasp mt-0.5" />
                    <div>
                      <p className="text-white font-medium text-sm">Sécurité</p>
                      <p className="text-white/40 text-xs">Données cryptées et souveraines.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            
            {/* Right: Digital ID Preview */}
            <ScrollReveal delay={0.3}>
              <div className="relative">
                {/* Glow behind card */}
                <div className={`absolute inset-0 ${currentTheme === 'monolith' ? 'bg-gold/10' : currentTheme === 'abyssal' ? 'bg-iwasp/10' : 'bg-black/10'} blur-[80px] rounded-full scale-75`} />
                <DigitalIDPreview theme={theme} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section id="impact" className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-iwasp/10 mb-8">
              <Leaf size={32} className="text-iwasp" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Impact Écologique
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-2xl mx-auto">
              En remplaçant les cartes de visite traditionnelles par la technologie NFC, 
              chaque utilisateur I-Wasp contribue à réduire l'empreinte carbone globale.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-iwasp/10 to-transparent border border-iwasp/20">
                <p className="text-4xl font-bold text-iwasp mb-2">0g</p>
                <p className="text-white/50 text-sm">Papier utilisé par carte</p>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-b from-gold/10 to-transparent border border-gold/20">
                <p className="text-4xl font-bold text-gold mb-2">∞</p>
                <p className="text-white/50 text-sm">Mises à jour possibles</p>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
                <p className="text-4xl font-bold text-white mb-2">100%</p>
                <p className="text-white/50 text-sm">Énergie propre sur nos serveurs</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-white/[0.05]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={iwaspLogo} alt="I-WASP" className="h-6 w-auto opacity-60" />
              <span className="text-white/40 text-sm">Liana</span>
            </div>
            <p className="text-white/30 text-xs">
              © 2025 Maison Liana. Visionnaire x I-Wasp.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/templates" className="text-white/40 hover:text-white text-xs transition-colors">
                Politique
              </Link>
              <Link to="/templates" className="text-white/40 hover:text-white text-xs transition-colors">
                Termes
              </Link>
              <Link to="/demo" className="text-white/40 hover:text-white text-xs transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
