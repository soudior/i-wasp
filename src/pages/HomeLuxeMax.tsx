import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Menu, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { HoneycombBackground } from "@/components/HoneycombBackground";

// ═══════════════════════════════════════════════════════════════════════════
// 3D COMPONENTS - Minimal, refined
// ═══════════════════════════════════════════════════════════════════════════

function LuxeCard() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Main card body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 2.6, 0.04]} />
          <meshStandardMaterial 
            color="#0A0D14"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={0.8}
          />
        </mesh>
        {/* Subtle edge glow */}
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[4.22, 2.62]} />
          <meshBasicMaterial color="#7DD3E8" transparent opacity={0.03} />
        </mesh>
        {/* Minimal logo accent */}
        <mesh position={[-1.2, 0.6, 0.025]}>
          <planeGeometry args={[0.8, 0.15]} />
          <meshBasicMaterial color="#7DD3E8" transparent opacity={0.4} />
        </mesh>
        {/* NFC indicator - subtle */}
        <mesh position={[1.5, -0.8, 0.025]}>
          <ringGeometry args={[0.08, 0.12, 32]} />
          <meshBasicMaterial color="#7DD3E8" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function SubtleGlow() {
  return (
    <mesh position={[0, 0, -3]}>
      <sphereGeometry args={[4, 32, 32]} />
      <MeshDistortMaterial
        color="#7DD3E8"
        transparent
        opacity={0.02}
        distort={0.2}
        speed={0.5}
      />
    </mesh>
  );
}

function LuxeHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.2} color="#7DD3E8" />
      <pointLight position={[-5, -5, 5]} intensity={0.1} color="#6B8FD4" />
      <LuxeCard />
      <SubtleGlow />
    </Canvas>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR - Ultra minimal
// ═══════════════════════════════════════════════════════════════════════════

const navLinks = [
  { label: "Fonctionnement", href: "#how" },
  { label: "Pour qui", href: "#audience" },
  { label: "FAQ", href: "#faq" },
];

function LuxeNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-luxe-void/80 backdrop-blur-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-luxe-white font-light text-xl tracking-[0.15em] uppercase">
            i-wasp
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-luxe-silver hover:text-luxe-white transition-colors duration-300 tracking-[0.1em] uppercase"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-luxe-silver hover:text-luxe-white hover:bg-transparent text-sm tracking-[0.05em]">
                Connexion
              </Button>
            </Link>
            <Link to="/order/type">
              <Button className="bg-luxe-cyan/10 text-luxe-cyan hover:bg-luxe-cyan/20 border border-luxe-cyan/30 rounded-full px-6 text-sm tracking-[0.05em]">
                Commencer
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-luxe-white"
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-luxe-void/95 backdrop-blur-2xl border-t border-luxe-glow/20"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left text-luxe-silver hover:text-luxe-white py-3 text-sm tracking-[0.1em] uppercase"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-6 border-t border-luxe-glow/20 space-y-3">
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full text-luxe-silver hover:text-luxe-white">
                    Connexion
                  </Button>
                </Link>
                <Link to="/order/type" className="block">
                  <Button className="w-full bg-luxe-cyan/10 text-luxe-cyan border border-luxe-cyan/30">
                    Commencer
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
// SECTION COMPONENTS - Gallery style, one idea per screen
// ═══════════════════════════════════════════════════════════════════════════

function SectionDivider() {
  return (
    <div className="w-full flex justify-center py-16">
      <div className="w-px h-24 bg-gradient-to-b from-transparent via-luxe-cyan/20 to-transparent" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomeLuxeMax() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Mes contacts doivent-ils installer une app ?",
      answer: "Non. Un tap NFC ou scan QR ouvre votre profil dans leur navigateur."
    },
    {
      question: "Puis-je modifier mes informations ?",
      answer: "Oui. Chaque modification se reflète instantanément sur toutes vos cartes."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Hébergement sécurisé. Vous contrôlez ce que chaque contact peut voir."
    }
  ];

  return (
    <div className="min-h-screen bg-luxe-void relative">
      {/* Haute Couture Honeycomb Background */}
      <HoneycombBackground opacity={0.04} showDots />
      
      <LuxeNavbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO - Single idea, massive visual, minimal text
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxe-cyan/[0.02] rounded-full blur-[200px]" />
        </div>
        
        {/* 3D Scene - dominant visual */}
        <div className="absolute inset-0">
          <LuxeHeroScene />
        </div>
        
        {/* Content - minimal, centered */}
        <div className="relative z-10 text-center px-6 max-w-[800px] mx-auto pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-luxe-white leading-[1.15] tracking-[-0.02em] mb-8">
              La carte des décideurs.
            </h1>
            
            <p className="text-lg md:text-xl text-luxe-silver font-light leading-relaxed max-w-[540px] mx-auto mb-12">
              Votre réseau mérite mieux qu'un bout de papier.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/order/type">
                <Button 
                  size="lg" 
                  className="bg-luxe-cyan/10 text-luxe-cyan hover:bg-luxe-cyan/15 border border-luxe-cyan/30 hover:border-luxe-cyan/50 font-light text-base px-10 py-6 min-h-[56px] rounded-full tracking-[0.05em] transition-all duration-300"
                >
                  Créer mon profil
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="text-luxe-silver hover:text-luxe-white hover:bg-transparent font-light text-base px-8 py-6 tracking-[0.05em] gap-2"
                >
                  <Play className="w-4 h-4" />
                  Voir la démo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-luxe-cyan/30 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATEMENT - Single powerful phrase
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-[60vh] flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-[700px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-luxe-mist leading-relaxed tracking-[-0.01em]">
            Un concierge digital
            <span className="block mt-2 text-luxe-cyan">pour chaque rencontre.</span>
          </p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS - 3 panels, gallery style
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="how" className="py-32 px-6 scroll-mt-24">
        <div className="max-w-[1000px] mx-auto">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-luxe-cyan tracking-[0.2em] uppercase mb-4 block">Comment ça fonctionne</span>
            <h2 className="text-3xl md:text-4xl font-light text-luxe-white tracking-[-0.02em]">
              Trois étapes.
            </h2>
          </motion.div>
          
          <div className="space-y-20">
            {[
              {
                num: "01",
                title: "Créez",
                text: "Centralisez votre profil, vos liens et vos offres dans une carte vivante."
              },
              {
                num: "02",
                title: "Partagez",
                text: "Un tap NFC. Un scan QR. Vos informations s'échangent instantanément."
              },
              {
                num: "03",
                title: "Suivez",
                text: "Stories 24h, relances intelligentes, analytics. Le concierge fait le reste."
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-12 md:gap-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-5xl md:text-6xl font-light text-luxe-glow/50 tabular-nums">
                  {step.num}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-light text-luxe-white mb-3 tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-luxe-silver text-base md:text-lg font-light leading-relaxed max-w-[400px]">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          AUDIENCE - Simple tags
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="audience" className="py-32 px-6 scroll-mt-24">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-luxe-cyan tracking-[0.2em] uppercase mb-4 block">Pour qui</span>
            <h2 className="text-3xl md:text-4xl font-light text-luxe-white mb-16 tracking-[-0.02em]">
              Pensé pour ceux dont le réseau est le business.
            </h2>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              "Consultants",
              "Commerciaux",
              "Entrepreneurs",
              "Agents immobiliers",
              "Hôtellerie",
              "Finance",
              "Créateurs",
              "Événementiel"
            ].map((tag, i) => (
              <motion.span
                key={i}
                className="px-5 py-2.5 text-sm text-luxe-mist border border-luxe-glow/30 rounded-full hover:border-luxe-cyan/30 hover:text-luxe-cyan transition-all duration-300"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          COMPARISON - Minimal two-column
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <div className="max-w-[900px] mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-luxe-white tracking-[-0.02em]">
              Bien plus qu'une carte.
            </h2>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-12 md:gap-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <span className="text-xs text-luxe-silver/50 tracking-[0.2em] uppercase">Classique</span>
              <ul className="space-y-4">
                {["Coordonnées statiques", "Aucun suivi", "Aucune analyse"].map((item, i) => (
                  <li key={i} className="text-luxe-silver/60 font-light text-lg line-through decoration-luxe-silver/20">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <span className="text-xs text-luxe-cyan tracking-[0.2em] uppercase">i-wasp</span>
              <ul className="space-y-4">
                {[
                  "Stories 24h & contenu dynamique",
                  "Relances intelligentes & push",
                  "Analytics & timeline complète"
                ].map((item, i) => (
                  <li key={i} className="text-luxe-mist font-light text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ - Ultra minimal accordion
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-32 px-6 scroll-mt-24">
        <div className="max-w-[600px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-luxe-cyan tracking-[0.2em] uppercase mb-4 block">FAQ</span>
            <h2 className="text-3xl font-light text-luxe-white tracking-[-0.02em]">
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border-b border-luxe-glow/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-luxe-mist font-light text-base group-hover:text-luxe-white transition-colors">
                    {faq.question}
                  </span>
                  <span className={`text-luxe-cyan text-xl transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-luxe-silver font-light text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA - Single, powerful
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6">
        <motion.div 
          className="max-w-[600px] mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-luxe-white mb-6 tracking-[-0.02em]">
            Prêt à transformer
            <span className="block text-luxe-cyan">votre networking ?</span>
          </h2>
          
          <Link to="/order/type">
            <Button 
              size="lg" 
              className="bg-luxe-cyan/10 text-luxe-cyan hover:bg-luxe-cyan/15 border border-luxe-cyan/30 hover:border-luxe-cyan/50 font-light text-base px-10 py-6 min-h-[56px] rounded-full tracking-[0.05em] transition-all duration-300 mt-8"
            >
              Créer mon profil
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER - Minimal
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="py-12 px-6 border-t border-luxe-glow/10">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-luxe-white font-light tracking-[0.15em] uppercase text-sm">
            i-wasp
          </span>
          
          <div className="flex items-center gap-8">
            <Link to="/mentions-legales" className="text-xs text-luxe-silver hover:text-luxe-white transition-colors tracking-[0.1em] uppercase">
              Mentions légales
            </Link>
            <Link to="/privacy" className="text-xs text-luxe-silver hover:text-luxe-white transition-colors tracking-[0.1em] uppercase">
              Confidentialité
            </Link>
            <Link to="/contact" className="text-xs text-luxe-silver hover:text-luxe-white transition-colors tracking-[0.1em] uppercase">
              Contact
            </Link>
          </div>
          
          <span className="text-xs text-luxe-silver/50">
            © 2025
          </span>
        </div>
      </footer>
    </div>
  );
}
