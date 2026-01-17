/**
 * i-wasp OMNIA EDITION — Landing "Manifeste"
 * 
 * Philosophie : "L'Art de la Présence"
 * Style : Soie liquide, obsidienne, architecture Aman Hotels
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { OmniaCard3D, OmniaGlow } from "@/components/omnia/OmniaGlass";
import { LanguageSelector } from "@/components/LanguageSelector";

// Animation variants — Liquid, ethereal
const liquidReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.8,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Index = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead {...SEO_CONFIGS.home} />
      
      <div className="min-h-screen bg-omnia-obsidienne relative overflow-hidden">
        
        {/* ═══════════════════════════════════════════════════════════════
            GLOW AMBIANCE — Champagne radial ultra-diffus
            ═══════════════════════════════════════════════════════════════ */}
        <OmniaGlow 
          className="w-full h-[60vh] top-0 left-0 right-0" 
          intensity="medium" 
        />
        
        {/* ═══════════════════════════════════════════════════════════════
            NAVIGATION — Quasi-invisible, flottante
            ═══════════════════════════════════════════════════════════════ */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link 
              to="/" 
              className="font-display text-xl tracking-[0.15em] text-omnia-champagne"
            >
              OMNIA
            </Link>
            
            <div className="flex items-center gap-6">
              <LanguageSelector />
              
              <Link
                to="/login"
                className="font-body text-sm font-extralight tracking-wider text-omnia-ivoire/60 hover:text-omnia-champagne transition-colors duration-700"
              >
                Synchronisation
              </Link>
              
              <Link
                to="/order/offre"
                className="font-body text-xs font-light tracking-[0.2em] uppercase px-6 py-3 rounded-full bg-omnia-champagne/10 text-omnia-champagne border border-omnia-champagne/20 hover:bg-omnia-champagne/20 transition-all duration-700"
              >
                Acquérir
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════════════════════
            HERO — Titre monumental "Dominez l'Invisible"
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Tagline subtile */}
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={liquidReveal}
              className="font-mono text-[10px] tracking-[0.4em] uppercase text-omnia-champagne/60 mb-8"
            >
              L'Art de la Présence
            </motion.p>
            
            {/* Titre monumental */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={liquidReveal}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[0.08em] leading-[0.95] text-omnia-ivoire mb-6"
            >
              Dominez
              <br />
              <span className="text-omnia-champagne">l'Invisible</span>
            </motion.h1>
            
            {/* Sous-titre éthéré */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={liquidReveal}
              className="font-body text-lg sm:text-xl font-extralight tracking-wide leading-relaxed text-omnia-ivoire/50 max-w-2xl mx-auto mb-12"
            >
              Votre héritage digital. Une liaison silencieuse entre vous et le monde.
              <br className="hidden sm:block" />
              Présence. Omniprésence. i-wasp Omnia.
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={liquidReveal}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/order/offre"
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-omnia-champagne text-omnia-obsidienne font-body text-xs font-light tracking-[0.2em] uppercase transition-all duration-700 hover:scale-[1.02] hover:shadow-glow-champagne"
              >
                Acquérir votre Calibre
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-transparent text-omnia-ivoire/70 font-body text-xs font-extralight tracking-[0.2em] uppercase border border-white/10 hover:border-omnia-champagne/30 hover:text-omnia-champagne transition-all duration-700"
              >
                Immersion
              </Link>
            </motion.div>
          </div>
          
          {/* ═══════════════════════════════════════════════════════════════
              CARTE 3D FLOTTANTE
              ═══════════════════════════════════════════════════════════════ */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={liquidReveal}
            className="mt-20 sm:mt-24"
          >
            <OmniaCard3D />
          </motion.div>
          
          {/* Indication scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-omnia-champagne/40 to-transparent"
            />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION MANIFESTE — Philosophie
            ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-omnia-champagne/50 mb-8">
                Manifeste
              </p>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.06em] leading-[1.2] text-omnia-ivoire mb-8">
                La technologie doit être
                <br />
                <span className="text-omnia-champagne">fluide, éthérée et silencieuse</span>
              </h2>
              
              <p className="font-body text-base sm:text-lg font-extralight tracking-wide leading-relaxed text-omnia-ivoire/40 max-w-2xl mx-auto">
                Nous ne vendons pas un outil. Nous transmettons un héritage digital.
                Une infrastructure invisible qui porte votre présence au-delà des frontières physiques.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER MINIMAL
            ═══════════════════════════════════════════════════════════════ */}
        <footer className="relative py-16 px-6 border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-display text-sm tracking-[0.1em] text-omnia-champagne/60">
              i-wasp Omnia
            </p>
            
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-omnia-ivoire/30">
              L'Art de la Présence
            </p>
            
            <p className="font-body text-xs font-extralight tracking-wide text-omnia-ivoire/30">
              © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
