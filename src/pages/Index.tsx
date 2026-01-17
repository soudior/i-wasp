/**
 * i-wasp OMNIA — Landing "Tunnel de Conversion"
 * 
 * Objectif : Créer un désir immédiat de possession
 * Style : Ouverture d'un coffret de luxe
 */

import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap, Globe, Check } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { LanguageSelector } from "@/components/LanguageSelector";

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS — Liquid & Ethereal
// ═══════════════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CARTE 3D PREMIUM AVEC NOM PERSONNALISÉ
// ═══════════════════════════════════════════════════════════════════════════

function PremiumCard3D({ name = "VOTRE NOM" }: { name?: string }) {
  return (
    <motion.div
      initial={{ rotateY: -15, rotateX: 5, opacity: 0 }}
      animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        rotateY: -8, 
        rotateX: 3,
        scale: 1.02,
        transition: { duration: 0.8 }
      }}
      className="relative w-[340px] h-[200px] sm:w-[400px] sm:h-[240px] perspective-1000"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glow derrière la carte */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          boxShadow: [
            "0 0 60px rgba(220, 199, 176, 0.15), 0 0 120px rgba(220, 199, 176, 0.08)",
            "0 0 80px rgba(220, 199, 176, 0.2), 0 0 160px rgba(220, 199, 176, 0.1)",
            "0 0 60px rgba(220, 199, 176, 0.15), 0 0 120px rgba(220, 199, 176, 0.08)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ borderRadius: "1.5rem" }}
      />
      
      {/* Carte principale */}
      <div 
        className="relative w-full h-full rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0A0A0A 0%, #1A1A1A 40%, #0A0A0A 100%)",
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Reflet Champagne diagonal */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 30%, rgba(220, 199, 176, 0.08) 50%, transparent 70%)",
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Logo W */}
        <div className="absolute top-6 left-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(220, 199, 176, 0.15) 0%, rgba(220, 199, 176, 0.05) 100%)",
              border: "1px solid rgba(220, 199, 176, 0.2)",
            }}
          >
            <span className="font-display text-lg text-[#DCC7B0]">W</span>
          </div>
        </div>
        
        {/* Badge édition */}
        <div className="absolute top-6 right-6 text-right">
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#DCC7B0]/50">
            PRIVATE_ASSET_V6
          </p>
          <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/30 mt-1">
            LIMITED EDITION
          </p>
        </div>
        
        {/* Nom du propriétaire */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2">
          <motion.h3 
            key={name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl sm:text-3xl tracking-[0.15em] text-white/95"
          >
            {name.toUpperCase()}
          </motion.h3>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#DCC7B0]/70 mt-2">
            SUPREME OWNER
          </p>
        </div>
        
        {/* Icône NFC */}
        <div className="absolute bottom-6 left-6">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(220, 199, 176, 0.08)",
              border: "1px solid rgba(220, 199, 176, 0.15)",
            }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(220, 199, 176, 0.2)",
                "0 0 0 8px rgba(220, 199, 176, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-[#DCC7B0]/80" />
          </motion.div>
        </div>
        
        {/* Numéro de série */}
        <div className="absolute bottom-6 right-6">
          <p className="font-mono text-[9px] tracking-[0.2em] text-white/25">
            SN-4820-ABS
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BOUTON CTA LUXUEUX
// ═══════════════════════════════════════════════════════════════════════════

function LuxuryButton({ children, href, variant = "primary" }: { 
  children: React.ReactNode; 
  href: string;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden group cursor-pointer
          ${isPrimary 
            ? "px-12 py-6 sm:px-16 sm:py-7" 
            : "px-10 py-5 sm:px-12 sm:py-6"
          }
        `}
        style={{
          borderRadius: "9999px",
          background: isPrimary 
            ? "linear-gradient(135deg, #DCC7B0 0%, #E8D9C7 50%, #DCC7B0 100%)"
            : "transparent",
          border: isPrimary ? "none" : "1px solid rgba(220, 199, 176, 0.3)",
          boxShadow: isPrimary 
            ? "0 10px 40px rgba(220, 199, 176, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            : "none",
        }}
      >
        {/* Effet shimmer sur hover */}
        <motion.div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
          }}
        />
        
        <span className={`
          relative z-10 flex items-center justify-center gap-3
          font-body text-xs sm:text-sm font-light tracking-[0.2em] uppercase
          ${isPrimary ? "text-[#030303]" : "text-[#DCC7B0]"}
        `}>
          {children}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </motion.div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

const Index = () => {
  const [previewName, setPreviewName] = useState("MEHDI EL ALAMI");
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <>
      <SEOHead {...SEO_CONFIGS.home} />
      
      <div className="min-h-screen bg-[#030303] relative overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════════
            GLOW AMBIANCE — Multiple layers
            ═══════════════════════════════════════════════════════════════ */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220, 199, 176, 0.08) 0%, transparent 60%)",
          }}
        />
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(220, 199, 176, 0.04) 0%, transparent 50%)",
          }}
        />
        
        {/* ═══════════════════════════════════════════════════════════════
            NAVIGATION — Glass ultra-subtil
            ═══════════════════════════════════════════════════════════════ */}
        <motion.nav
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: "rgba(3, 3, 3, 0.6)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(220, 199, 176, 0.1)",
                  border: "1px solid rgba(220, 199, 176, 0.2)",
                }}
              >
                <span className="font-display text-sm text-[#DCC7B0]">W</span>
              </div>
              <span className="font-display text-xl tracking-[0.1em] text-[#FDFCFB]/90">
                i-wasp <span className="text-[#DCC7B0]">Omnia</span>
              </span>
            </Link>
            
            {/* Navigation centrale - Desktop */}
            <div className="hidden md:flex items-center gap-10">
              {["MANIFESTE", "ACTIVATION", "L'AURA"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace("'", "")}`}
                  className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#FDFCFB]/40 hover:text-[#DCC7B0] transition-colors duration-500"
                >
                  {item}
                </a>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase text-[#FDFCFB]/70 hover:text-[#DCC7B0] transition-colors duration-500"
                style={{
                  background: "rgba(220, 199, 176, 0.08)",
                  border: "1px solid rgba(220, 199, 176, 0.15)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                L'ATELIER
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION — Le Choc Visuel
            ═══════════════════════════════════════════════════════════════ */}
        <section id="manifeste" className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
              
              {/* Texte */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <motion.p
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#DCC7B0]/50 mb-6"
                >
                  ACQUÉRIR STANDARD
                </motion.p>
                
                <motion.h1
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[0.04em] leading-[0.95] text-[#FDFCFB] mb-6"
                >
                  Dominez
                  <br />
                  <span className="italic text-[#DCC7B0]">L'Invisible</span>
                </motion.h1>
                
                <motion.p
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="font-display text-lg sm:text-xl italic text-[#FDFCFB]/40 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
                >
                  "L'exclusivité d'une Hypercar. La précision d'un Calibre. 
                  Votre héritage i-wasp."
                </motion.p>
                
                {/* CTAs */}
                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <LuxuryButton href="/order/offre" variant="primary">
                    Acquérir mon Aura
                  </LuxuryButton>
                  
                  <LuxuryButton href="#configurateur" variant="secondary">
                    Découvrir le Rendu
                  </LuxuryButton>
                </motion.div>
              </div>
              
              {/* Carte 3D */}
              <motion.div 
                custom={4}
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                className="flex justify-center lg:justify-end order-1 lg:order-2"
              >
                <PremiumCard3D name={previewName} />
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-16 bg-gradient-to-b from-[#DCC7B0]/50 to-transparent"
            />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PREUVE SOCIALE — Rassurer sans effort
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <p className="font-body text-lg sm:text-xl font-extralight tracking-wide text-[#FDFCFB]/50">
                Activé en <span className="text-[#DCC7B0]">30 secondes</span>. 
                Partagé en <span className="text-[#DCC7B0]">un contact</span>.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="grid grid-cols-3 gap-6"
            >
              {[
                { icon: Zap, label: "Liaison NFC", desc: "Instantanée" },
                { icon: Shield, label: "Cloud Sécurisé", desc: "Chiffré" },
                { icon: Sparkles, label: "IA Optimizer", desc: "Premium" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-3xl"
                  style={{
                    background: "rgba(220, 199, 176, 0.03)",
                    border: "1px solid rgba(220, 199, 176, 0.08)",
                  }}
                >
                  <item.icon className="w-6 h-6 text-[#DCC7B0]/70 mx-auto mb-4" />
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#FDFCFB]/40 mb-1">
                    {item.label}
                  </p>
                  <p className="font-body text-sm font-extralight text-[#DCC7B0]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CONFIGURATEUR — Le "Joujou" interactif
            ═══════════════════════════════════════════════════════════════ */}
        <section id="configurateur" className="relative py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#DCC7B0]/50 mb-6">
                PERSONNALISATION
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.04em] text-[#FDFCFB] mb-6">
                Votre Calibre, <span className="italic text-[#DCC7B0]">Votre Signature</span>
              </h2>
              <p className="font-body text-base font-extralight text-[#FDFCFB]/40 max-w-xl mx-auto">
                Visualisez votre carte en temps réel. Chaque détail compte.
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Input */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <label className="block font-mono text-[10px] tracking-[0.25em] uppercase text-[#DCC7B0]/50 mb-4">
                  Votre nom complet
                </label>
                <input
                  type="text"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                  placeholder="ENTREZ VOTRE NOM"
                  className="w-full px-8 py-6 rounded-2xl font-display text-2xl tracking-[0.1em] uppercase text-[#FDFCFB] placeholder:text-[#FDFCFB]/20 focus:outline-none transition-all duration-500"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(220, 199, 176, 0.15)",
                    boxShadow: "0 0 40px rgba(220, 199, 176, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(220, 199, 176, 0.4)";
                    e.target.style.boxShadow = "0 0 60px rgba(220, 199, 176, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(220, 199, 176, 0.15)";
                    e.target.style.boxShadow = "0 0 40px rgba(220, 199, 176, 0.05)";
                  }}
                />
                
                <div className="mt-8 space-y-3">
                  {[
                    "Gravure laser haute définition",
                    "Finition mate anti-traces",
                    "Puce NFC intégrée invisible",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#00FF66]/10">
                        <Check className="w-3 h-3 text-[#00FF66]" />
                      </div>
                      <span className="font-body text-sm font-extralight text-[#FDFCFB]/50">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10">
                  <LuxuryButton href="/order/offre" variant="primary">
                    Commander ma Carte
                  </LuxuryButton>
                </div>
              </motion.div>
              
              {/* Carte Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex justify-center"
              >
                <PremiumCard3D name={previewName || "VOTRE NOM"} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            CTA FINAL — Imposant
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-32 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.04em] text-[#FDFCFB] mb-8">
              Votre Succès a désormais
              <br />
              <span className="italic text-[#DCC7B0]">une Signature</span>
            </h2>
            
            <p className="font-body text-lg font-extralight text-[#FDFCFB]/40 max-w-xl mx-auto mb-12">
              Faites une impression inoubliable. Élargissez votre réseau. 
              Le futur de votre image commence ici.
            </p>
            
            <LuxuryButton href="/order/offre" variant="primary">
              Obtenir mon Aura
            </LuxuryButton>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER MINIMAL
            ═══════════════════════════════════════════════════════════════ */}
        <footer className="relative py-16 px-6 border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(220, 199, 176, 0.1)",
                  border: "1px solid rgba(220, 199, 176, 0.2)",
                }}
              >
                <span className="font-display text-xs text-[#DCC7B0]">W</span>
              </div>
              <span className="font-display text-sm tracking-[0.1em] text-[#FDFCFB]/60">
                i-wasp Omnia
              </span>
            </div>
            
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#FDFCFB]/20">
              L'Art de la Présence
            </p>
            
            <p className="font-body text-xs font-extralight text-[#FDFCFB]/20">
              © {new Date().getFullYear()} IWASP
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
