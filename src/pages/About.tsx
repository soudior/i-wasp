/**
 * About Page - Apple/Cupertino Style
 * Ultra-minimal, clean, professional
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Target, Crown, ArrowRight, Sparkles, BarChart3, Bell, Wifi } from "lucide-react";
import { APPLE } from "@/lib/applePalette";

const features = [
  { icon: BarChart3, title: "Dashboard Analytics", desc: "Statistiques en temps réel de vos scans et conversions" },
  { icon: Bell, title: "Push Notifications", desc: "Recontactez vos leads directement depuis l'app" },
  { icon: Wifi, title: "Magic Import", desc: "Générez votre profil en 3 secondes depuis une URL" },
  { icon: Shield, title: "vCard Gold V4", desc: "Standard professionnel avec logo et tous vos réseaux" },
];

const pillars = [
  { 
    icon: Zap, 
    title: "L'Innovation", 
    desc: "Le premier écosystème NFC complet au Maroc. Nous avons osé le faire en premier."
  },
  { 
    icon: Target, 
    title: "La Simplicité", 
    desc: "VCard, Stories, WiFi, Leads, Push — tout en un seul endroit. Zéro friction."
  },
  { 
    icon: Crown, 
    title: "L'Excellence", 
    desc: "Un standard de qualité premium inspiré des plus grandes marques."
  },
];

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: APPLE.background }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderBottom: `1px solid ${APPLE.border}`
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight"
            style={{ color: APPLE.text }}
          >
            IWASP
          </Link>
          <Link to="/express/offre">
            <Button 
              className="rounded-full px-6 h-10 font-medium"
              style={{ backgroundColor: APPLE.accent, color: "#FFFFFF" }}
            >
              Commander
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-20 md:py-28 px-6"
        style={{ backgroundColor: APPLE.backgroundPure, borderBottom: `1px solid ${APPLE.border}` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ backgroundColor: APPLE.accentSubtle }}
            >
              <Crown className="w-4 h-4" style={{ color: APPLE.accent }} />
              <span className="text-sm font-medium" style={{ color: APPLE.accent }}>Notre Histoire</span>
            </div>
            
            {/* Title */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              style={{ color: APPLE.text }}
            >
              L'aube d'une nouvelle ère
            </h1>
            
            <p 
              className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-8"
              style={{ color: APPLE.textSecondary }}
            >
              Née d'une <span style={{ color: APPLE.text }} className="font-semibold">obsession</span> : 
              transformer chaque interaction physique en une opportunité digitale mesurable.
            </p>
            
            <p 
              className="text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: APPLE.textMuted }}
            >
              Nous avons fusionné la logistique des géants du web avec l'élégance du contact humain. 
              <span className="font-medium" style={{ color: APPLE.textSecondary }}> IWASP n'est pas une carte, c'est votre centre de commandement.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Card Preview */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div 
                className="p-8 rounded-3xl"
                style={{ 
                  backgroundColor: APPLE.card, 
                  boxShadow: APPLE.shadowLg
                }}
              >
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold tracking-tight mb-4"
                    style={{ color: APPLE.text }}
                  >
                    IWASP
                  </div>
                  <p style={{ color: APPLE.textSecondary }}>
                    Design premium. Technologie invisible.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 
                className="text-3xl font-bold mb-8 tracking-tight"
                style={{ color: APPLE.text }}
              >
                La puissance d'une multinationale
              </h2>
              
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: APPLE.card,
                    boxShadow: APPLE.shadowSm
                  }}
                >
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: APPLE.accentSubtle }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: APPLE.accent }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: APPLE.text }}>{feature.title}</h3>
                    <p className="text-sm" style={{ color: APPLE.textSecondary }}>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section 
        className="py-16 px-6"
        style={{ backgroundColor: APPLE.backgroundPure, borderTop: `1px solid ${APPLE.border}`, borderBottom: `1px solid ${APPLE.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 
              className="text-3xl font-bold text-center mb-12 tracking-tight"
              style={{ color: APPLE.text }}
            >
              Nos trois piliers
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((pillar, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: APPLE.card,
                    boxShadow: APPLE.shadowCard
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: APPLE.accentSubtle }}
                  >
                    <pillar.icon className="w-7 h-7" style={{ color: APPLE.accent }} />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: APPLE.text }}
                  >
                    {pillar.title}
                  </h3>
                  <p style={{ color: APPLE.textSecondary }}>{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 rounded-3xl"
            style={{ 
              backgroundColor: APPLE.text
            }}
          >
            <Crown className="w-12 h-12 mx-auto mb-6" style={{ color: APPLE.background }} />
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: APPLE.background }}
            >
              Prêt à nous rejoindre ?
            </h2>
            <p 
              className="mb-8 max-w-xl mx-auto"
              style={{ color: APPLE.textMuted }}
            >
              Rejoignez les centaines de professionnels qui ont déjà adopté les cartes NFC IWASP.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/express/offre">
                <Button 
                  size="lg" 
                  className="gap-2 font-semibold px-8 rounded-full"
                  style={{ backgroundColor: APPLE.background, color: APPLE.text }}
                >
                  Commander ma Carte
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full"
                  style={{ 
                    borderColor: "rgba(245, 245, 247, 0.3)", 
                    color: APPLE.background,
                    backgroundColor: "transparent"
                  }}
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 px-6 text-center"
        style={{ borderTop: `1px solid ${APPLE.border}` }}
      >
        <p className="text-sm" style={{ color: APPLE.textMuted }}>
          Powered by IWASP
        </p>
      </footer>
    </div>
  );
}
