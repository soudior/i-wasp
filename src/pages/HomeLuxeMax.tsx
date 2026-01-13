/**
 * HomeLuxeMax — ULTRA LUXE N°1 MONDIAL
 * Style: Noir absolu, typographie Dior/Cartier, minimalisme extrême
 * Alternance sections claires/sombres pour rythme visuel
 * 
 * Inspiré: Hermès, Cartier, Dior - Le plus haut niveau de luxe digital
 */

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { CoutureFooter } from "@/components/CoutureFooter";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import cardFront from "@/assets/card-front.png";
import cardBack from "@/assets/card-back.png";
import { ArrowRight, Wand2, Globe, Zap } from "lucide-react";

// Palette Ultra Luxe
const LUXE = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  ivoire: "#F5F5F5",
  ivoireSoft: "#EFEDE8",
  or: "#B8956C",
  orLight: "#D4B896",
  gris: "#6B6B6B",
  grisClair: "#9A9A9A",
};

export default function HomeLuxeMax() {
  SEOHead(SEO_CONFIGS.home);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const heroTextY = useTransform(heroProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(heroProgress, [0, 0.4], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: LUXE.noir }}>
      <CoutureNavbar />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full-screen, noir absolu, typographie Cartier
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden pt-20">
        
        {/* Grain texture ultra subtil */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Central headline */}
        <motion.div 
          className="text-center relative z-10 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <h1 
            className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] tracking-tight"
            style={{ color: LUXE.ivoire }}
          >
            L'identité digitale
            <br />
            <span className="italic" style={{ color: LUXE.or }}>des leaders.</span>
          </h1>
          
          <motion.p
            className="mt-8 text-sm md:text-base font-light tracking-wide max-w-md mx-auto"
            style={{ color: LUXE.gris }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
          >
            Une carte NFC premium pour ceux qui marquent leur époque.
          </motion.p>
        </motion.div>
        
        {/* CTA discret */}
        <motion.div 
          className="absolute bottom-16 left-0 right-0 flex justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          style={{ opacity: heroOpacity }}
        >
          <Link 
            to="/order/offre"
            className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-light transition-all duration-700"
            style={{ color: LUXE.grisClair }}
          >
            <span className="group-hover:text-white transition-colors duration-700">Découvrir</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CARTE — Section ivoire, contraste élégant
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: LUXE.ivoire }}>
        <div className="py-24 md:py-32">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: LUXE.or }}
            >
              La carte
            </span>
            <h2 
              className="font-display text-3xl md:text-4xl font-light mt-4 tracking-tight"
              style={{ color: LUXE.noir }}
            >
              Un objet d'exception
            </h2>
          </motion.div>
          
          <CardFlipSection variant="light" />
          
          <motion.div 
            className="text-center mt-16 px-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <p 
              className="text-sm font-light max-w-md mx-auto"
              style={{ color: LUXE.gris }}
            >
              PVC mat premium. Technologie NFC intégrée. 
              <br className="hidden md:block" />
              Design sur-mesure selon vos exigences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MANIFESTE — Section noire, citation impactante
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 md:py-32 flex items-center justify-center px-6"
        style={{ backgroundColor: LUXE.noir }}
      >
        <motion.blockquote 
          className="text-center max-w-2xl"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p 
            className="font-display text-2xl md:text-3xl lg:text-4xl font-light italic leading-[1.4]"
            style={{ color: LUXE.ivoire }}
          >
            "La première impression
            <br />
            <span style={{ color: LUXE.or }}>ne se répète jamais."</span>
          </p>
          <div 
            className="w-12 h-px mx-auto mt-10"
            style={{ backgroundColor: LUXE.or }}
          />
        </motion.blockquote>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          AVANTAGES — Section ivoire, trois piliers
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 md:py-32 px-6"
        style={{ backgroundColor: LUXE.ivoire }}
      >
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-16">
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: LUXE.or }}
            >
              Pourquoi nous
            </span>
            <h2 
              className="font-display text-3xl md:text-4xl font-light mt-4 tracking-tight"
              style={{ color: LUXE.noir }}
            >
              L'excellence en trois mots
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {[
              { title: "Créer", desc: "Un profil digital unique, à votre image exacte." },
              { title: "Partager", desc: "Un simple tap pour transmettre votre identité." },
              { title: "Convertir", desc: "Des contacts qualifiés, pas de cartes perdues." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 
                  className="font-display text-xl md:text-2xl font-light italic mb-4"
                  style={{ color: i === 1 ? LUXE.or : LUXE.noir }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-sm font-light leading-relaxed"
                  style={{ color: LUXE.gris }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS — Section noire, chiffres d'autorité
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-20 md:py-24 px-6"
        style={{ backgroundColor: LUXE.noir }}
      >
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "2500+", label: "Professionnels" },
              { value: "98%", label: "Satisfaction" },
              { value: "15+", label: "Pays" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <span 
                  className="font-display text-2xl md:text-3xl lg:text-4xl font-light"
                  style={{ color: LUXE.or }}
                >
                  {stat.value}
                </span>
                <p 
                  className="text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2"
                  style={{ color: LUXE.grisClair }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TÉMOIGNAGES
      ═══════════════════════════════════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FINAL — Noir, autorité absolue
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 md:py-32 flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: LUXE.noir }}
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 
            className="font-display text-2xl md:text-3xl lg:text-4xl font-light mb-8"
            style={{ color: LUXE.ivoire }}
          >
            Prêt à vous démarquer ?
          </h2>
          
          <Link 
            to="/order/offre"
            className="inline-flex items-center gap-3 px-10 py-4 text-[11px] uppercase tracking-[0.3em] font-light transition-all duration-700 border"
            style={{ 
              color: LUXE.noir,
              backgroundColor: LUXE.or,
              borderColor: LUXE.or,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = LUXE.or;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = LUXE.or;
              e.currentTarget.style.color = LUXE.noir;
            }}
          >
            <span>Créer ma carte</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          
          <p 
            className="mt-8 text-xs font-light"
            style={{ color: LUXE.gris }}
          >
            Livraison gratuite · Satisfait ou remboursé
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WEB STUDIO — Nouvelle section promotionnelle
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-24 md:py-32 px-6 relative overflow-hidden"
        style={{ backgroundColor: LUXE.noirSoft }}
      >
        {/* Gradient accent */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${LUXE.or}30 0%, transparent 60%)`,
          }}
        />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ 
              backgroundColor: `${LUXE.or}15`,
              border: `1px solid ${LUXE.or}30`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Wand2 size={14} style={{ color: LUXE.or }} />
            <span 
              className="text-[11px] uppercase tracking-[0.2em] font-medium"
              style={{ color: LUXE.or }}
            >
              Nouveau Service
            </span>
          </motion.div>
          
          <h2 
            className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6"
            style={{ color: LUXE.ivoire }}
          >
            Web Studio
            <span className="italic" style={{ color: LUXE.or }}> IA</span>
          </h2>
          
          <p 
            className="text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: LUXE.gris }}
          >
            Créez votre site web professionnel en quelques minutes grâce à notre intelligence artificielle. 
            Design premium, prix instantané, livraison express.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Zap, title: "Génération IA", desc: "Proposition en 30 secondes" },
              { icon: Globe, title: "Site Complet", desc: "Design + Contenu + Hébergement" },
              { icon: Wand2, title: "Premium", desc: "À partir de 2 500 MAD" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: `${LUXE.ivoire}05`,
                  border: `1px solid ${LUXE.ivoire}10`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <feature.icon 
                  size={28} 
                  strokeWidth={1.5}
                  style={{ color: LUXE.or }}
                  className="mx-auto mb-4"
                />
                <h3 
                  className="font-medium text-sm mb-2"
                  style={{ color: LUXE.ivoire }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-xs font-light"
                  style={{ color: LUXE.gris }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* CTA */}
          <Link 
            to="/web-studio"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-sm transition-all duration-500 hover:scale-105"
            style={{ 
              backgroundColor: LUXE.or,
              color: LUXE.noir,
            }}
          >
            <Wand2 size={18} />
            Créer mon site web
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <CoutureFooter />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CARD FLIP SECTION
// ═══════════════════════════════════════════════════════════════════════════

interface CardFlipProps {
  variant?: 'light' | 'dark';
}

function CardFlipSection({ variant = 'dark' }: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const shadowColor = variant === 'light' 
    ? 'rgba(0, 0, 0, 0.15)' 
    : 'rgba(0, 0, 0, 0.6)';

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative cursor-pointer"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-[300px] md:w-[380px] lg:w-[440px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Front */}
          <motion.img 
            src={cardFront} 
            alt="Carte i-wasp - Recto" 
            className="w-full h-auto"
            style={{
              filter: `drop-shadow(0 30px 60px ${shadowColor})`,
              backfaceVisibility: "hidden",
            }}
          />
          {/* Back */}
          <motion.img 
            src={cardBack} 
            alt="Carte i-wasp - Verso" 
            className="w-full h-auto absolute top-0 left-0"
            style={{
              filter: `drop-shadow(0 30px 60px ${shadowColor})`,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          />
        </motion.div>
        
        {/* Hint */}
        <motion.p
          className="text-center mt-6 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: variant === 'light' ? LUXE.grisClair : LUXE.gris }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {isFlipped ? 'Verso' : 'Survoler pour voir le verso'}
        </motion.p>
      </motion.div>
    </div>
  );
}
