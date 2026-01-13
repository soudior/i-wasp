/**
 * Index / Home Page — i-wasp Haute Couture Digitale
 * 
 * Maison d'identité professionnelle digitale
 * Ultra chic, minimal, luxe inégalable
 * Noir couture, grands espaces vides, calme absolu
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

// Animation variants - Slow, luxurious
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.2 }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 1.5 }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.2 }
  }
};

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="bg-background min-h-screen text-foreground selection:bg-foreground selection:text-background">
      
      {/* ═══════════════════════════════════════════════════════════════════
          NAVIGATION — Ultra minimal
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6 sm:py-8"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="text-foreground font-serif text-xl sm:text-2xl tracking-wide">
            i-wasp
          </Link>
          <div className="flex items-center gap-6 sm:gap-10">
            <Link 
              to="/login"
              className="text-xs sm:text-sm tracking-[0.2em] uppercase border border-foreground/30 px-4 py-2 text-foreground hover:bg-foreground hover:text-background transition-all duration-500"
            >
              Espace Client
            </Link>
            <Link 
              to="/order/offre"
              className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-700"
            >
              Commander
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Une idée, un écran
          Confiance silencieuse, calme absolu
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center px-6 sm:px-12 pt-24">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            {/* Surtitre éditorial */}
            <motion.p 
              variants={fadeUp}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8 sm:mb-12"
            >
              Haute couture digitale
            </motion.p>
            
            {/* Titre principal — Serif éditorial */}
            <motion.h1 
              variants={fadeUp}
              className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] tracking-tight mb-8 sm:mb-12"
            >
              Votre identité,
              <br />
              <span className="italic">sublimée.</span>
            </motion.h1>
            
            {/* Sous-titre — Discret, précis */}
            <motion.p 
              variants={fadeUp}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-12 sm:mb-16"
            >
              Une carte NFC d'exception pour les professionnels 
              qui ne font aucun compromis.
            </motion.p>
            
            {/* CTA — Sobre, élégant */}
            <motion.div variants={fadeUp}>
              <Link 
                to="/order/offre"
                className="group inline-flex items-center gap-4 sm:gap-6"
              >
                <span className="text-sm sm:text-base tracking-[0.15em] uppercase border-b border-foreground/30 pb-1 group-hover:border-foreground transition-colors duration-700">
                  Découvrir
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-700" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATEMENT — Une phrase, un écran
          Le vide est une matière noble
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center justify-center px-6 sm:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeIn}
          className="max-w-3xl text-center"
        >
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.4] tracking-tight">
            "Nous créons des pièces numériques 
            <span className="italic"> intemporelles</span>, 
            pensées comme des objets de haute couture."
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRINCIPES — Trois piliers, rythme lent
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-48 px-6 sm:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-16 sm:gap-12 md:gap-8"
          >
            {[
              { number: "01", title: "Sobre", description: "Aucun effet superflu. Chaque détail a sa raison d'être." },
              { number: "02", title: "Précise", description: "Une exécution irréprochable, jusqu'au dernier pixel." },
              { number: "03", title: "Durable", description: "Une seule carte. Pour toujours." }
            ].map((item) => (
              <motion.div 
                key={item.number}
                variants={fadeUp}
                className="border-t border-foreground/10 pt-8"
              >
                <span className="text-xs tracking-[0.3em] text-muted-foreground mb-6 block">
                  {item.number}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          OFFRE — Épuré à l'essentiel
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-48 px-6 sm:px-12 border-t border-foreground/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={stagger}
          >
            <motion.p 
              variants={fadeUp}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6"
            >
              L'essentiel
            </motion.p>
            
            <motion.h2 
              variants={fadeUp}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-16 sm:mb-24"
            >
              Ce que vous recevez
            </motion.h2>
            
            <motion.div 
              variants={fadeUp}
              className="grid sm:grid-cols-2 gap-8 sm:gap-12 max-w-3xl"
            >
              {[
                "Carte NFC premium, finition mate",
                "Profil digital personnalisé",
                "Liens et contacts illimités",
                "Modifications instantanées",
                "Statistiques de consultation",
                "Support dédié"
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-baseline gap-6 py-4 border-b border-foreground/5"
                >
                  <span className="text-xs text-muted-foreground/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TARIF — Simple, transparent
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 sm:py-48 px-6 sm:px-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.p 
              variants={fadeUp}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6"
            >
              Investissement
            </motion.p>
            
            <motion.div variants={fadeUp} className="mb-12">
              <span className="font-serif text-6xl sm:text-7xl md:text-8xl font-light tracking-tight">
                555
              </span>
              <span className="text-xl sm:text-2xl text-muted-foreground ml-2">
                MAD
              </span>
            </motion.div>
            
            <motion.p 
              variants={fadeUp}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-12"
            >
              Tout inclus. Pas d'abonnement. 
              <br className="hidden sm:block" />
              Livraison offerte au Maroc.
            </motion.p>
            
            <motion.div variants={fadeUp}>
              <Link 
                to="/order/offre"
                className="inline-block bg-foreground text-background px-12 py-5 text-sm tracking-[0.15em] uppercase hover:opacity-80 transition-opacity duration-700"
              >
                Commander
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER — Minimal
          ═══════════════════════════════════════════════════════════════════ */}
      <footer className="py-12 sm:py-16 px-6 sm:px-12 border-t border-foreground/5">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div>
            <span className="font-serif text-lg tracking-wide">i-wasp</span>
            <p className="text-xs text-muted-foreground mt-2 tracking-wide">
              Haute couture digitale
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-xs sm:text-sm text-muted-foreground">
            <Link to="/contact" className="hover:text-foreground transition-colors duration-500">
              Contact
            </Link>
            <Link to="/mentions-legales" className="hover:text-foreground transition-colors duration-500">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:text-foreground transition-colors duration-500">
              CGV
            </Link>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-foreground/5">
          <p className="text-xs text-muted-foreground/50 tracking-wide">
            © 2025 i-wasp. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
