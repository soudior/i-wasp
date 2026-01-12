import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  RefreshCw, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Zap,
  Users,
  Bell,
  Clock,
  Target,
  MessageSquare,
  Trophy,
  Sparkles,
  Eye,
  Calendar,
  FileText,
  ChevronRight,
  Play,
  Building2,
  Briefcase,
  Hotel,
  Check,
  X,
  ChevronDown,
  Rocket,
  Star,
  Award,
  TrendingUp,
  Send,
  Smartphone,
  Menu,
  X as XIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════
// 3D COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function FloatingCard() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 2.2, 0.08]} />
        <meshStandardMaterial 
          color="#0A1628"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      {/* Card Logo */}
      <mesh position={[0, 0.3, 0.05]}>
        <planeGeometry args={[1.2, 0.3]} />
        <meshBasicMaterial color="#4DF3FF" transparent opacity={0.9} />
      </mesh>
      {/* NFC Symbol */}
      <mesh position={[1.2, -0.6, 0.05]}>
        <ringGeometry args={[0.15, 0.2, 32]} />
        <meshBasicMaterial color="#4DF3FF" transparent opacity={0.7} />
      </mesh>
    </Float>
  );
}

function NetworkLines() {
  const groupRef = useRef<THREE.Group>(null);
  const linesCount = 8;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: linesCount }).map((_, i) => {
        const angle = (i / linesCount) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <group key={i}>
            {/* Connection line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, x * 0.6, y * 0.6, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#4DF3FF" transparent opacity={0.3} />
            </line>
            {/* Contact point */}
            <mesh position={[x * 0.6, y * 0.6, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#4A7BFF" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function GlowSphere({ position, color, size = 0.5 }: { position: [number, number, number], color: string, size?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.15}
        distort={0.4}
        speed={2}
      />
    </mesh>
  );
}

function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4DF3FF" />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color="#4A7BFF" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#4DF3FF"
      />
      
      {/* Main floating card */}
      <FloatingCard />
      
      {/* Network connection lines */}
      <NetworkLines />
      
      {/* Background glow spheres */}
      <GlowSphere position={[-3, 2, -2]} color="#4DF3FF" size={1.5} />
      <GlowSphere position={[3, -2, -3]} color="#4A7BFF" size={2} />
      <GlowSphere position={[0, 3, -4]} color="#181528" size={3} />
    </Canvas>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const navLinks = [
  { label: "Comment ça marche", href: "#how-it-works" },
  { label: "Stories 24h", href: "#stories" },
  { label: "Notifications", href: "#notifications" },
  { label: "Gamification", href: "#gamification" },
  { label: "Pour qui", href: "#for-who" },
  { label: "FAQ", href: "#faq" },
];

function ConciergeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-concierge-night/95 backdrop-blur-xl border-b border-concierge-cyan/10' : 'bg-transparent'
    }`}>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-white tracking-tight">
              i-wasp
            </span>
            <svg 
              viewBox="0 0 24 24" 
              className="h-5 w-5 text-concierge-cyan"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            >
              <path d="M5 12a4 4 0 0 1 4-4" />
              <path d="M5 12a8 8 0 0 1 8-8" />
              <path d="M5 12a12 12 0 0 1 12-12" />
              <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-concierge-cyan transition-colors rounded-lg hover:bg-concierge-cyan/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                Connexion
              </Button>
            </Link>
            <Link to="/order/type">
              <Button className="bg-concierge-cyan text-concierge-night hover:bg-concierge-cyan/90 font-semibold rounded-full px-6">
                Créer mon profil
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-concierge-night border-t border-concierge-cyan/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="w-full text-left px-4 py-3 text-gray-400 hover:text-concierge-cyan hover:bg-concierge-cyan/5 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                    Connexion
                  </Button>
                </Link>
                <Link to="/order/type" className="block">
                  <Button className="w-full bg-concierge-cyan text-concierge-night hover:bg-concierge-cyan/90 font-semibold">
                    Créer mon profil
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA STRUCTURES
// ═══════════════════════════════════════════════════════════════════════════

const howItWorks = [
  {
    step: "01",
    icon: Sparkles,
    title: "Crée ta carte vivante",
    description: "Centralisez ton profil, tes liens, tes offres et tes documents dans une carte numérique NFC qui se met à jour en temps réel. Tu changes de contenu, la carte change instantanément."
  },
  {
    step: "02",
    icon: Wifi,
    title: "Partage en un tap",
    description: "Approchez ta carte d'un smartphone ou partagez un QR. Tes infos s'enregistrent en un geste, avec un mini-profil clair et actionnable pour ton contact."
  },
  {
    step: "03",
    icon: Target,
    title: "Laisse le concierge faire le reste",
    description: "Stories, relances, rappels, stats : i-wasp s'occupe du suivi et te prévient quand c'est le bon moment pour relancer."
  }
];

const storiesFeatures = [
  { 
    icon: Sparkles, 
    text: "Story automatique : résumé de la rencontre + prochaines étapes, visible 24h par ton contact." 
  },
  { 
    icon: FileText, 
    text: "Histoire personnalisable : ajoute une courte vidéo, une note vocale ou un lien (Calendly, offre, PDF)." 
  },
  { 
    icon: Calendar, 
    text: "Call-to-action intégré : 'Réserver un appel', 'Découvrir l'offre', 'Télécharger la présentation'." 
  }
];

const pushFeatures = [
  {
    icon: Eye,
    title: "Alertes temps réel",
    description: "'X vient d'ouvrir ta présentation', 'Y vient de revisiter ta carte'.",
    color: "text-concierge-cyan"
  },
  {
    icon: Clock,
    title: "Suggestions de timing",
    description: "'C'est le bon moment pour lui écrire' selon ses habitudes de consultation.",
    color: "text-concierge-blue"
  },
  {
    icon: BarChart3,
    title: "Dashboard clair",
    description: "Contacts rencontrés, taux de réponses, rendez-vous générés, score de santé de ton réseau.",
    color: "text-green-400"
  }
];

const gamificationPoints = [
  { action: "Contact qualifié", points: "+1 pt" },
  { action: "Relance envoyée", points: "+2 pts" },
  { action: "Rendez-vous confirmé", points: "+5 pts" }
];

const gamificationBadges = [
  { icon: Trophy, name: "Networker du mois", description: "Top 10% des utilisateurs", color: "bg-gradient-to-br from-concierge-cyan to-concierge-blue" },
  { icon: Star, name: "Closer salon X", description: "Champion d'un événement", color: "bg-gradient-to-br from-concierge-blue to-purple-600" },
  { icon: Users, name: "100 contacts suivis", description: "Sans en oublier un seul", color: "bg-gradient-to-br from-green-500 to-emerald-600" }
];

const missions = [
  "Ajouter une note à 5 contacts",
  "Relancer 10 contacts inactifs",
  "Planifier 3 RDV cette semaine"
];

const targetAudiences = [
  {
    icon: Briefcase,
    title: "Freelances & experts",
    description: "Coachs, consultants, créateurs, formateurs."
  },
  {
    icon: Building2,
    title: "Commerciaux & agences",
    description: "Immobilier, finance, assurances, B2B."
  },
  {
    icon: Hotel,
    title: "Hôtellerie & événementiel",
    description: "Conciergerie, réception, salons, VIP."
  }
];

const comparisonClassic = [
  "Partagent tes coordonnées.",
  "Profil de page statique.",
  "Aucun suivi, aucun rappel."
];

const comparisonIwasp = [
  "Histoires 24h, contenu dynamique et offres limitées.",
  "Relances intelligentes, push, Analytics et timeline de chaque relation.",
  "Gamification, missions et intros automatiques entre les bons contacts."
];

const faqs = [
  {
    question: "Est-ce que mes contacts doivent installer une application ?",
    answer: "Non. Un simple tap NFC ou scan de QR ouvre ton profil dans leur navigateur."
  },
  {
    question: "Et si je change d'offre, de numéro ou de poste ?",
    answer: "Tu modifies ton profil i-wasp et toutes tes cartes physiques affichent instantanément les nouvelles infos."
  },
  {
    question: "Est-ce que c'est sécurisé ?",
    answer: "Les données sont hébergées sur des serveurs sécurisés et tu contrôles ce que chaque contact peut voir."
  }
];

const stats = [
  { value: "10K+", label: "Cartes actives" },
  { value: "500K+", label: "Scans mensuels" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Support" }
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomeConcierge() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-concierge-night">
      <ConciergeNavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION - 3D Card floating in light tunnel
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen pt-20 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[800px] h-[800px] bg-concierge-cyan/5 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-concierge-blue/8 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-concierge-purple/20 via-transparent to-concierge-purple/20 rounded-full blur-[100px]" />
        </div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(77,243,255,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(77,243,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* 3D Scene */}
        <div className="absolute inset-0 opacity-60">
          <Hero3DScene />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 max-w-[1100px] mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-concierge-cyan/10 border border-concierge-cyan/20 mb-8">
              <Zap className="w-4 h-4 text-concierge-cyan" />
              <span className="text-sm font-medium text-concierge-cyan">Concierge digital de networking</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
              La carte qui travaille
              <span className="block mt-2 bg-gradient-to-r from-concierge-cyan via-concierge-blue to-concierge-cyan bg-clip-text text-transparent">
                pour ton réseau, 24h/24.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              i-wasp transforme ta carte NFC en concierge digital : stories 24h après chaque rencontre, 
              relances intelligentes, notifications push et analytiques pour ne plus jamais laisser mourir un contact.
            </p>
            
            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/order/type">
                <Button size="lg" className="bg-concierge-cyan text-concierge-night hover:bg-concierge-cyan/90 font-semibold text-lg px-10 py-7 gap-2 min-h-[60px] rounded-full shadow-[0_0_40px_rgba(77,243,255,0.3)]">
                  Créer mon profil
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-concierge-blue/50 text-concierge-blue hover:bg-concierge-blue/10 hover:border-concierge-blue px-10 py-7 text-lg gap-2 min-h-[60px] rounded-full"
                >
                  <Play className="w-5 h-5" />
                  Voir la démo en 2 min
                </Button>
              </Link>
            </motion.div>
            
            {/* Reassurance */}
            <motion.p 
              className="text-gray-500 text-sm flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Smartphone className="w-4 h-4" />
              Aucune app à installer pour tes contacts. Un tap ou un scan, et tout se passe dans leur navigateur.
            </motion.p>
          </motion.div>

          {/* Mini analytics panel mockup */}
          <motion.div 
            className="mt-16 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-concierge-purple/30 backdrop-blur-xl rounded-2xl p-4 border border-concierge-cyan/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-concierge-cyan font-medium">Analytics en direct</span>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">147</p>
                  <p className="text-xs text-gray-500">Scans</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-2xl font-bold text-concierge-cyan">24</p>
                  <p className="text-xs text-gray-500">Stories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-concierge-blue">12</p>
                  <p className="text-xs text-gray-500">Relances</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 border-y border-concierge-cyan/10 bg-concierge-purple/20">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-concierge-cyan to-concierge-blue bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE - 3 ÉTAPES
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 md:py-32 px-4 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              En 3 étapes simples
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Passe au networking du futur en quelques minutes.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[2px] bg-gradient-to-r from-concierge-cyan/30 via-concierge-blue/30 to-concierge-cyan/30" />
                )}
                
                <div className="bg-concierge-purple/30 backdrop-blur-sm rounded-3xl p-8 text-center relative z-10 h-full border border-concierge-cyan/10 hover:border-concierge-cyan/30 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-concierge-cyan to-concierge-blue text-concierge-night text-sm font-bold">
                      {item.step}
                    </span>
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-concierge-cyan/20 to-concierge-blue/20 flex items-center justify-center mx-auto mt-4 mb-6 border border-concierge-cyan/20">
                    <item.icon className="w-8 h-8 text-concierge-cyan" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STORIES 24H & RELANCES INTELLIGENTES
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="stories" className="py-24 md:py-32 px-4 bg-gradient-to-b from-concierge-purple/20 to-transparent scroll-mt-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-concierge-blue/10 border border-concierge-blue/20 text-concierge-blue text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                Stories 24h
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Stories 24h après
                <span className="block text-concierge-cyan">chaque rencontre</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Après chaque nouveau contact, i-wasp crée une histoire dédiée à cette relation pour garder 
                la rencontre fraîche dans les esprits.
              </p>
              
              <div className="space-y-4 mb-8">
                {storiesFeatures.map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-concierge-cyan/20 to-concierge-blue/10 flex items-center justify-center border border-concierge-cyan/20 flex-shrink-0 mt-1">
                      <item.icon className="w-5 h-5 text-concierge-cyan" />
                    </div>
                    <span className="text-gray-400">{item.text}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Relances intelligentes */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-concierge-cyan/10 to-transparent border border-concierge-cyan/20">
                <p className="text-concierge-cyan font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Relances intelligentes, sans y penser
                </p>
                <p className="text-gray-400 text-sm">
                  L'IA vous propose plusieurs messages de relance prêts à envoyer (formel, direct, amical). 
                  En un clic, vous relancez par email, WhatsApp ou LinkedIn.
                </p>
              </div>
            </motion.div>
            
            {/* Right: Story mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-concierge-cyan/20 via-concierge-blue/10 to-concierge-cyan/20 rounded-3xl blur-2xl opacity-50" />
              
              <div className="relative bg-concierge-purple/50 backdrop-blur-xl rounded-3xl p-6 border border-concierge-cyan/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-concierge-cyan to-concierge-blue flex items-center justify-center">
                    <span className="text-concierge-night font-bold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Jean Dupont</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expire dans 22h
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 rounded-full bg-concierge-blue/20 text-concierge-blue text-xs font-medium">
                      Story 24h
                    </span>
                  </div>
                </div>
                
                <div className="aspect-[9/14] max-h-[320px] bg-gradient-to-br from-concierge-purple/50 via-concierge-night to-concierge-blue/20 rounded-2xl flex items-center justify-center mb-4 border border-concierge-cyan/10 overflow-hidden relative">
                  <div className="relative text-center p-6 z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-concierge-cyan to-concierge-blue flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-concierge-night" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Ravi de t'avoir rencontré !</p>
                    <p className="text-gray-400 text-sm mb-4">Voici ma présentation complète et mes derniers projets.</p>
                    <div className="flex items-center justify-center gap-2 text-concierge-cyan text-sm">
                      <Eye className="w-4 h-4" />
                      <span>47 vues</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-concierge-cyan text-concierge-night hover:bg-concierge-cyan/90 font-semibold gap-2 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  Réserver un appel
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NOTIFICATIONS PUSH & ANALYTICS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="notifications" className="py-24 md:py-32 px-4 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Notification mockups */}
            <motion.div
              className="order-2 lg:order-1 space-y-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {pushFeatures.map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-concierge-purple/30 backdrop-blur-sm rounded-2xl p-5 border border-concierge-cyan/10 hover:border-concierge-cyan/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-concierge-cyan/20 to-concierge-blue/10 flex items-center justify-center flex-shrink-0 border border-concierge-cyan/20">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                    <Bell className="w-4 h-4 text-gray-600" />
                  </div>
                </motion.div>
              ))}
              
              {/* AI Suggestion */}
              <motion.div
                className="bg-gradient-to-r from-concierge-cyan/10 to-concierge-blue/10 rounded-2xl p-5 border border-concierge-cyan/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-concierge-cyan" />
                  <span className="text-concierge-cyan font-medium text-sm">Suggestion IA</span>
                </div>
                <p className="text-white text-sm mb-3">
                  "Salut Marie ! J'ai vu que tu as consulté mon profil. On se prévoit un café la semaine prochaine ?"
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-concierge-cyan text-concierge-night hover:bg-concierge-cyan/90 text-xs py-2 px-4">
                    <Send className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-xs py-2 px-4 rounded-lg">
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-xs py-2 px-4 rounded-lg">
                    LinkedIn
                  </Button>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right: Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-concierge-cyan/10 border border-concierge-cyan/20 text-concierge-cyan text-sm font-medium mb-6">
                <Bell className="w-4 h-4" />
                Notifications intelligentes
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Tu sais qui te regarde,
                <span className="block text-concierge-blue">et quand.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                i-wasp te notifie dès qu'un contact revient sur ta carte, ouvre un document ou clique sur un lien important.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {["WhatsApp", "Email", "LinkedIn", "Web Push"].map((channel, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-concierge-purple/30 border border-concierge-cyan/10 text-sm text-gray-400">
                    {channel}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GAMIFICATION & MISSIONS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="gamification" className="py-24 md:py-32 px-4 bg-gradient-to-b from-concierge-purple/20 to-transparent scroll-mt-24">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-concierge-cyan/10 border border-concierge-cyan/20 text-concierge-cyan text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Gamification
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Le réseautage devient un jeu
              <span className="block text-concierge-cyan">(rentable)</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              i-wasp transforme ta discipline de suivi en missions simples avec points, badges et objectifs hebdomadaires.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Points & Badges */}
            <motion.div
              className="bg-concierge-purple/30 backdrop-blur-sm rounded-3xl p-8 border border-concierge-cyan/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-concierge-cyan" />
                Système de points
              </h3>
              <div className="space-y-3 mb-8">
                {gamificationPoints.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-concierge-night/50 border border-concierge-cyan/10">
                    <span className="text-gray-400">{item.action}</span>
                    <span className="text-concierge-cyan font-medium">{item.points}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-concierge-cyan" />
                Badges à débloquer
              </h3>
              <div className="space-y-4">
                {gamificationBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-concierge-night/50 border border-concierge-cyan/10 hover:border-concierge-cyan/30 transition-all">
                    <div className={`w-12 h-12 rounded-xl ${badge.color} flex items-center justify-center shadow-lg`}>
                      <badge.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-medium block">{badge.name}</span>
                      <span className="text-gray-500 text-sm">{badge.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Missions & Dashboard */}
            <motion.div
              className="bg-concierge-purple/30 backdrop-blur-sm rounded-3xl p-8 border border-concierge-cyan/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-concierge-blue" />
                Missions hebdomadaires
              </h3>
              
              <div className="space-y-3 mb-8">
                {missions.map((mission, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-concierge-night/50 border border-concierge-cyan/10">
                    <div className="w-6 h-6 rounded-full border-2 border-concierge-blue/50 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-concierge-blue/50" />
                    </div>
                    <span className="text-gray-400 text-sm">{mission}</span>
                    <span className="ml-auto text-concierge-blue text-xs font-medium">+5 pts</span>
                  </div>
                ))}
              </div>
              
              <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-concierge-cyan" />
                Tableau de bord
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Contacts", value: "147", icon: Users, trend: "+12" },
                  { label: "Taux réponse", value: "68%", icon: MessageSquare, trend: "+5%" },
                  { label: "Relances auto", value: "23", icon: RefreshCw, trend: "cette semaine" },
                  { label: "Score réseau", value: "A+", icon: TrendingUp, trend: "Excellent" }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-concierge-night/50 border border-concierge-cyan/10 text-center">
                    <stat.icon className="w-5 h-5 text-concierge-cyan mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                    <p className="text-green-400 text-xs mt-1">{stat.trend}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          POUR QUI ?
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="for-who" className="py-24 md:py-32 px-4 scroll-mt-24">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Pensé pour ceux dont le réseau
              <span className="block text-concierge-cyan">est le business</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Si ton chiffre dépend de la qualité de ton réseau et de ton suivi, i-wasp devient ton meilleur assistant.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {targetAudiences.map((audience, i) => (
              <motion.div
                key={i}
                className="bg-concierge-purple/30 backdrop-blur-sm rounded-3xl p-8 text-center group border border-concierge-cyan/10 hover:border-concierge-cyan/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-concierge-cyan/20 to-concierge-blue/10 flex items-center justify-center mx-auto mb-6 border border-concierge-cyan/20 group-hover:border-concierge-cyan/40 transition-all">
                  <audience.icon className="w-10 h-10 text-concierge-cyan" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{audience.title}</h3>
                <p className="text-gray-400">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMPARAISON
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-concierge-purple/20 to-transparent">
        <div className="max-w-[1100px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Bien plus qu'une
              <span className="block text-concierge-cyan">carte NFC</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Classic */}
            <motion.div
              className="p-8 rounded-3xl bg-concierge-purple/20 border border-white/5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-concierge-night flex items-center justify-center">
                  <X className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-500">Cartes classiques</h3>
              </div>
              <div className="space-y-4">
                {comparisonClassic.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-concierge-night/50 border border-white/5">
                    <X className="w-5 h-5 text-red-400/60 flex-shrink-0" />
                    <span className="text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* i-wasp */}
            <motion.div
              className="p-8 rounded-3xl bg-gradient-to-br from-concierge-cyan/10 to-concierge-blue/10 border border-concierge-cyan/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-concierge-cyan to-concierge-blue flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-concierge-night" />
                </div>
                <h3 className="text-xl font-semibold text-white">i-wasp Concierge</h3>
              </div>
              <div className="space-y-4">
                {comparisonIwasp.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-concierge-night/50 border border-concierge-cyan/20">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 md:py-32 px-4 scroll-mt-24">
        <div className="max-w-[800px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === i 
                    ? 'bg-concierge-purple/30 border-concierge-cyan/30' 
                    : 'bg-concierge-purple/10 border-concierge-cyan/10 hover:border-concierge-cyan/20'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  className="w-full p-6 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-concierge-cyan flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div 
            className="relative p-10 md:p-16 rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-concierge-cyan/10 via-concierge-purple/30 to-concierge-blue/10" />
            <div className="absolute inset-0 border border-concierge-cyan/20 rounded-3xl" />
            <div className="absolute top-0 left-1/4 w-[300px] h-[200px] bg-concierge-cyan/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-[200px] h-[150px] bg-concierge-blue/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-concierge-cyan to-concierge-blue flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(77,243,255,0.3)]">
                <Sparkles className="w-8 h-8 text-concierge-night" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Prêt à transformer ton networking ?
              </h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
                Rejoins des milliers de professionnels qui ne laissent plus mourir leurs contacts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/order/type">
                  <Button size="lg" className="bg-concierge-cyan text-concierge-night hover:bg-concierge-cyan/90 font-semibold px-10 text-lg min-h-[56px] rounded-full shadow-[0_0_40px_rgba(77,243,255,0.3)]">
                    Créer mon profil i-wasp
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="border-concierge-blue/50 text-concierge-blue hover:bg-concierge-blue/10 rounded-full min-h-[56px]">
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
