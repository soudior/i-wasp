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
      <section className="min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden pt-16 sm:pt-20 pb-24 sm:pb-16">
        
        {/* Animated gradient orbs - simplified on mobile for performance */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full blur-[80px] sm:blur-[150px] pointer-events-none"
          style={{ backgroundColor: `${LUXE.or}08` }}
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full blur-[60px] sm:blur-[120px] pointer-events-none"
          style={{ backgroundColor: `${LUXE.or}06` }}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Floating golden particles - reduced on mobile */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full pointer-events-none hidden sm:block"
            style={{
              backgroundColor: LUXE.or,
              left: `${15 + (i * 14)}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.3 + (i % 3) * 0.1,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5 + (i % 2),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
        
        {/* Grain texture ultra subtil */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Elegant line decorations - hidden on mobile */}
        <motion.div
          className="absolute top-20 left-10 md:left-20 w-px h-24 md:h-32 hidden sm:block"
          style={{ backgroundColor: `${LUXE.or}30` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.div
          className="absolute top-20 right-10 md:right-20 w-px h-24 md:h-32 hidden sm:block"
          style={{ backgroundColor: `${LUXE.or}30` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
        />
        
        {/* Central headline with staggered animation */}
        <motion.div 
          className="text-center relative z-10 max-w-4xl"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          {/* Decorative top line */}
          <motion.div
            className="w-16 h-px mx-auto mb-8"
            style={{ backgroundColor: LUXE.or }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          
          <motion.h1 
            className="font-display text-[2.5rem] sm:text-5xl lg:text-7xl font-light leading-[1.15] sm:leading-[1.1] tracking-tight"
            style={{ color: LUXE.ivoire }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              L'identité digitale
            </motion.span>
            <br />
            <motion.span 
              className="italic inline-block"
              style={{ color: LUXE.or }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              des leaders.
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="mt-6 sm:mt-8 text-sm sm:text-base lg:text-lg font-light tracking-wide max-w-[280px] sm:max-w-lg mx-auto px-2"
            style={{ color: LUXE.gris }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Une carte NFC premium pour ceux qui marquent leur époque.
          </motion.p>
          
          {/* Decorative bottom line */}
          <motion.div
            className="w-8 h-px mx-auto mt-10"
            style={{ backgroundColor: `${LUXE.or}50` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          />
        </motion.div>
        
        {/* CTA with premium hover effect - repositioned for mobile */}
        <motion.div 
          className="mt-10 sm:mt-0 sm:absolute sm:bottom-20 left-0 right-0 flex justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{ opacity: heroOpacity }}
        >
          <Link 
            to="/express/offre"
            className="group relative flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] font-light transition-all duration-500 px-8 py-4 sm:px-6 sm:py-3 min-h-[48px] min-w-[160px] rounded-full"
            style={{ 
              color: LUXE.ivoire,
              backgroundColor: `${LUXE.or}20`,
              border: `1px solid ${LUXE.or}40`,
            }}
          >
            <span className="relative">Commander</span>
            <ArrowRight className="relative w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>
        
        {/* Scroll indicator with animation - hidden on mobile */}
        <motion.div
          className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="w-px h-10 sm:h-12"
            style={{ backgroundColor: `${LUXE.or}40` }}
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CARTE — Section ivoire, contraste élégant avec animation spectaculaire
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: LUXE.ivoire }}>
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px]"
            style={{ backgroundColor: `${LUXE.or}15` }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        {/* Floating golden particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`card-particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
              backgroundColor: LUXE.or,
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ 
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              y: [0, -50, -100],
            }}
            viewport={{ once: true }}
            transition={{
              duration: 3,
              delay: 0.5 + i * 0.15,
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
        ))}
        
        <div className="py-16 sm:py-24 md:py-32 relative z-10 px-4 sm:px-6">
          {/* Animated reveal for title */}
          <motion.div
            className="text-center mb-16 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Decorative lines animation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                className="h-px w-12"
                style={{ backgroundColor: LUXE.or }}
                initial={{ scaleX: 0, originX: 1 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span 
                className="text-[10px] uppercase tracking-[0.4em] font-light"
                style={{ color: LUXE.or }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                La carte
              </motion.span>
              <motion.div
                className="h-px w-12"
                style={{ backgroundColor: LUXE.or }}
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            
            <motion.h2 
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight overflow-hidden"
              style={{ color: LUXE.noir }}
            >
              <motion.span
                className="inline-block"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Un objet
              </motion.span>
              {" "}
              <motion.span
                className="inline-block italic"
                style={{ color: LUXE.or }}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                d'exception
              </motion.span>
            </motion.h2>
          </motion.div>
          
          <CardFlipSection variant="light" />
          {/* Enhanced description with staggered reveal */}
          <motion.div 
            className="text-center mt-10 sm:mt-16 px-4 sm:px-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
              {[
                { label: "PVC mat premium" },
                { label: "NFC intégrée" },
                { label: "Design sur-mesure" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.15, duration: 0.8 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: LUXE.or }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 300 }}
                  />
                  <span 
                    className="text-sm font-light"
                    style={{ color: LUXE.gris }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MANIFESTE — Section noire, citation impactante
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-16 sm:py-24 md:py-32 flex items-center justify-center px-4 sm:px-6"
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
            className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light italic leading-[1.5] sm:leading-[1.4]"
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
        className="py-16 sm:py-24 md:py-32 px-4 sm:px-6"
        style={{ backgroundColor: LUXE.ivoire }}
      >
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-10 sm:mb-16">
            <span 
              className="text-[10px] uppercase tracking-[0.4em] font-light"
              style={{ color: LUXE.or }}
            >
              Pourquoi nous
            </span>
            <h2 
              className="font-display text-2xl sm:text-3xl md:text-4xl font-light mt-4 tracking-tight"
              style={{ color: LUXE.noir }}
            >
              L'excellence en trois mots
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16">
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
        className="py-12 sm:py-20 md:py-24 px-4 sm:px-6"
        style={{ backgroundColor: LUXE.noir }}
      >
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
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
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <span 
                    className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light"
                    style={{ color: LUXE.or }}
                  >
                    {stat.value}
                  </span>
                  <p 
                    className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2"
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
        className="py-16 sm:py-24 md:py-32 flex flex-col items-center justify-center px-4 sm:px-6 pb-24 sm:pb-32"
        style={{ backgroundColor: LUXE.noir }}
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 
            className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-6 sm:mb-8"
            style={{ color: LUXE.ivoire }}
          >
            Prêt à vous démarquer ?
          </h2>
          
          <Link 
            to="/express/offre"
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light transition-all duration-500 border min-h-[52px] min-w-[180px] rounded-sm active:scale-[0.98]"
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
            <span>Commander maintenant</span>
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
        className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden"
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
  const [hasEntered, setHasEntered] = useState(false);
  
  const shadowColor = variant === 'light' 
    ? 'rgba(0, 0, 0, 0.15)' 
    : 'rgba(0, 0, 0, 0.6)';

  return (
    <div className="flex items-center justify-center relative">
      {/* Glow effect behind card */}
      <motion.div
        className="absolute w-[350px] md:w-[420px] lg:w-[500px] h-[220px] md:h-[260px] lg:h-[300px] rounded-3xl blur-[80px] pointer-events-none"
        style={{ backgroundColor: `${LUXE.or}30` }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        animate={hasEntered ? {
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        } : {}}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 80, rotateX: 25 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 1.5, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
        onAnimationComplete={() => setHasEntered(true)}
        className="relative cursor-pointer"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Shimmer effect on card */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={hasEntered ? { opacity: 1 } : {}}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${LUXE.or}20 50%, transparent 60%)`,
            }}
            animate={hasEntered ? {
              x: ["-100%", "200%"],
            } : {}}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
        
        <motion.div
          className="relative w-[300px] md:w-[380px] lg:w-[440px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.4 }
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Front */}
          <motion.img 
            src={cardFront} 
            alt="Carte i-wasp - Recto" 
            className="w-full h-auto rounded-2xl"
            style={{
              filter: `drop-shadow(0 30px 60px ${shadowColor})`,
              backfaceVisibility: "hidden",
            }}
          />
          {/* Back */}
          <motion.img 
            src={cardBack} 
            alt="Carte i-wasp - Verso" 
            className="w-full h-auto absolute top-0 left-0 rounded-2xl"
            style={{
              filter: `drop-shadow(0 30px 60px ${shadowColor})`,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          />
        </motion.div>
        
        {/* Hint with animated indicator */}
        <motion.div
          className="text-center mt-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="flex items-center gap-2"
            animate={!isFlipped ? { x: [0, 5, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: variant === 'light' ? LUXE.grisClair : LUXE.gris }}
            >
              {isFlipped ? 'Cliquez pour retourner' : 'Survoler pour découvrir'}
            </span>
            <motion.div
              className="w-4 h-px"
              style={{ backgroundColor: LUXE.or }}
              animate={!isFlipped ? { scaleX: [1, 1.5, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
