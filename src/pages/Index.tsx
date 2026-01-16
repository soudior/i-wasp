/**
 * Index / Home Page — IWASP
 * 
 * Style: Apple Human Interface Guidelines (Cupertino)
 * Minimal, airy, high-end, calm, professional
 */

import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, CreditCard, Zap, Shield, BarChart3, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { APPLE } from "@/lib/applePalette";

// Animation variants - Smooth Apple-style
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const Index = () => {
  return (
    <div 
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: APPLE.background }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          NAVIGATION — Apple-style minimal
          ═══════════════════════════════════════════════════════════════════ */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ 
          backgroundColor: 'rgba(245, 245, 247, 0.8)',
          borderBottom: `1px solid ${APPLE.border}`
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight"
            style={{ color: APPLE.text }}
          >
            IWASP
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/login"
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: APPLE.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = APPLE.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = APPLE.textSecondary}
            >
              Connexion
            </Link>
            <Link 
              to="/order/offre"
              className="text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200"
              style={{ 
                backgroundColor: APPLE.accent,
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = APPLE.accentHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = APPLE.accent}
            >
              Commander
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Clean Apple style
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div 
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ 
                backgroundColor: APPLE.accentSubtle,
                color: APPLE.accent
              }}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Technologie NFC</span>
            </motion.div>
            
            {/* Titre principal */}
            <motion.h1 
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-6"
              style={{ 
                color: APPLE.text,
                letterSpacing: '-0.02em'
              }}
            >
              Votre carte de visite.
              <br />
              <span style={{ color: APPLE.accent }}>Réinventée.</span>
            </motion.h1>
            
            {/* Sous-titre */}
            <motion.p 
              variants={fadeUp}
              className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed mb-10"
              style={{ color: APPLE.textSecondary }}
            >
              Une carte NFC premium pour partager vos informations 
              professionnelles en un simple tap.
            </motion.p>
            
            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/order/offre"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: APPLE.accent,
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = APPLE.accentHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = APPLE.accent}
              >
                Commander maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: APPLE.backgroundPure,
                  color: APPLE.text,
                  boxShadow: APPLE.shadowSm
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = APPLE.shadowMd}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = APPLE.shadowSm}
              >
                En savoir plus
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PRODUCT SHOWCASE — Visual card
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={scaleIn}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="relative rounded-3xl p-12 sm:p-16 overflow-hidden"
            style={{ 
              backgroundColor: APPLE.backgroundPure,
              boxShadow: APPLE.shadowLg
            }}
          >
            {/* Card mockup */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div 
                className="w-64 h-40 rounded-2xl flex items-center justify-center relative"
                style={{ 
                  background: 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)',
                  boxShadow: APPLE.shadowElevated
                }}
              >
                <span className="text-white/90 text-lg font-medium tracking-wide">IWASP</span>
                {/* NFC indicator */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <Smartphone className="w-4 h-4 text-white/60" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 
                  className="text-2xl sm:text-3xl font-semibold mb-4 tracking-tight"
                  style={{ color: APPLE.text }}
                >
                  Design premium
                </h2>
                <p 
                  className="text-lg leading-relaxed mb-6"
                  style={{ color: APPLE.textSecondary }}
                >
                  Finition mate élégante. Puce NFC intégrée. 
                  Compatible avec tous les smartphones.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {['NFC', 'Sans contact', 'Durable'].map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: APPLE.accentSubtle,
                        color: APPLE.accent
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES — Apple grid style
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4"
              style={{ color: APPLE.text }}
            >
              Tout ce qu'il vous faut
            </motion.h2>
            <motion.p 
              variants={fadeUp}
              className="text-xl max-w-2xl mx-auto"
              style={{ color: APPLE.textSecondary }}
            >
              Une solution complète pour votre identité professionnelle digitale
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { 
                icon: CreditCard, 
                title: "Carte NFC premium", 
                description: "Finition mate haute qualité avec puce NFC intégrée" 
              },
              { 
                icon: Smartphone, 
                title: "Profil digital", 
                description: "Page personnalisée avec tous vos liens et contacts" 
              },
              { 
                icon: Zap, 
                title: "Partage instantané", 
                description: "Un tap suffit pour partager vos informations" 
              },
              { 
                icon: Shield, 
                title: "Données sécurisées", 
                description: "Vos informations protégées et sous votre contrôle" 
              },
              { 
                icon: BarChart3, 
                title: "Statistiques", 
                description: "Suivez qui consulte votre profil en temps réel" 
              },
              { 
                icon: HeartHandshake, 
                title: "Support dédié", 
                description: "Une équipe à votre écoute pour vous accompagner" 
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeUp}
                className="p-8 rounded-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: APPLE.backgroundPure,
                  boxShadow: APPLE.shadowCard
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = APPLE.shadowMd;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = APPLE.shadowCard;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: APPLE.accentSubtle }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: APPLE.accent }} />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: APPLE.text }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-base leading-relaxed"
                  style={{ color: APPLE.textSecondary }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA SECTION — Clean and focused
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="rounded-3xl p-12 sm:p-16 text-center"
            style={{ 
              backgroundColor: APPLE.backgroundPure,
              boxShadow: APPLE.shadowLg
            }}
          >
            <h2 
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
              style={{ color: APPLE.text }}
            >
              Prêt à vous démarquer ?
            </h2>
            <p 
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: APPLE.textSecondary }}
            >
              Rejoignez les professionnels qui ont déjà adopté 
              la carte de visite du futur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/order/offre"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: APPLE.accent,
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = APPLE.accentHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = APPLE.accent}
              >
                Commander ma carte
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://wa.me/212661911165?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20la%20carte%20IWASP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: 'transparent',
                  color: APPLE.accent,
                  border: `1.5px solid ${APPLE.accent}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = APPLE.accentSubtle;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Nous contacter
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER — Minimal Apple style
          ═══════════════════════════════════════════════════════════════════ */}
      <footer 
        className="py-12 px-6"
        style={{ borderTop: `1px solid ${APPLE.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span 
                className="text-lg font-semibold"
                style={{ color: APPLE.text }}
              >
                IWASP
              </span>
              <p 
                className="text-sm mt-1"
                style={{ color: APPLE.textMuted }}
              >
                Tap. Connect. Empower.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { label: 'Contact', to: '/contact' },
                { label: 'À propos', to: '/about' },
                { label: 'FAQ', to: '/faq' },
                { label: 'CGV', to: '/cgv' }
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  className="text-sm transition-colors duration-200"
                  style={{ color: APPLE.textSecondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = APPLE.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = APPLE.textSecondary}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div 
            className="mt-12 pt-8 text-center"
            style={{ borderTop: `1px solid ${APPLE.border}` }}
          >
            <p 
              className="text-xs"
              style={{ color: APPLE.textMuted }}
            >
              © 2025 IWASP. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
