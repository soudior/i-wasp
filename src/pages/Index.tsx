/**
 * i-wasp OMNIA — Landing "Tunnel de Conversion"
 * 
 * Objectif : Créer un désir immédiat de possession
 * Style : Ouverture d'un coffret de luxe
 */

import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap, Globe, Check, Linkedin, Instagram, Mail, Phone, Globe2, MessageCircle, QrCode, WalletCards, WandSparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { NfcCard3D } from "@/components/home/NfcCard3D";
import { HeroProductVisual } from "@/components/home/HeroProductVisual";
import { NfcDemoSteps } from "@/components/home/NfcDemoSteps";
import { RealProductShowcase } from "@/components/home/RealProductShowcase";
import { IncludedSection } from "@/components/home/IncludedSection";
import { ModelsSection } from "@/components/home/ModelsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TrustSection } from "@/components/home/TrustSection";
import { FaqSection, FAQS } from "@/components/home/FaqSection";
import {
  StructuredData,
  organizationSchema,
  websiteSchema,
  productSchema,
  faqSchema,
} from "@/components/StructuredData";
import mehdiProfileImg from "@/assets/mehdi-profile.jpg";

const HOME_STRUCTURED_DATA = [
  organizationSchema,
  websiteSchema,
  productSchema({
    name: "Carte de visite NFC i-wasp",
    description:
      "Carte de visite NFC premium avec profil digital toujours à jour. Un contact suffit pour partager toutes vos informations, sans application requise.",
    image: "https://i-wasp.com/og-image.png",
    lowPrice: 29.9,
    highPrice: 89.9,
  }),
  faqSchema(FAQS),
];

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
// BOUTON CTA LUXUEUX
// ═══════════════════════════════════════════════════════════════════════════

const MotionLink = motion.create(Link);

function LuxuryButton({ children, href, variant = "primary" }: { 
  children: React.ReactNode; 
  href: string;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  
  return (
    <MotionLink
      to={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden group cursor-pointer block
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
    </MotionLink>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

const Index = () => {
  const { t } = useTranslation();
  const [previewName, setPreviewName] = useState(t("homepage.previewNameDefault"));
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  // Accessibilité : respecte prefers-reduced-motion et les appareils peu puissants
  const { allowInfiniteAnimations } = useReducedMotion();

  return (
    <>
      <SEOHead {...SEO_CONFIGS.home} />
      <StructuredData id="home" schema={HOME_STRUCTURED_DATA} />
      
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
                i-wasp
              </span>
            </Link>
            
            {/* Navigation centrale - Desktop */}
            <div className="hidden md:flex items-center gap-10">
              {[
                { label: t("homepage.nav.personnaliser"), href: "#configurateur" },
                { label: t("homepage.nav.profil"), href: "#laura" },
                { label: "Studio NFC & Wallet", href: "/creer-ma-carte" },
                { label: t("homepage.nav.tarifs"), href: "/pricing" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#FDFCFB]/50 hover:text-[#DCC7B0] transition-colors duration-500"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase text-[#FDFCFB]/70 hover:text-[#DCC7B0] transition-colors duration-500"
                style={{
                  background: "rgba(220, 199, 176, 0.08)",
                  border: "1px solid rgba(220, 199, 176, 0.15)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                {t("homepage.nav.login")}
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION — Le Choc Visuel
            ═══════════════════════════════════════════════════════════════ */}
        <main>
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
                  className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#DCC7B0]/60 mb-6"
                >
                  {t("homepage.hero.eyebrow")}
                </motion.p>

                <motion.h1
                  custom={1}
                  initial={false}
                  animate="visible"
                  variants={fadeUp}
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-normal tracking-[0.02em] leading-[1.02] text-[#FDFCFB] mb-6"
                >
                  {t("homepage.hero.titleLead")}
                  <span className="italic text-[#DCC7B0]">{t("homepage.hero.titleAccent")}</span>
                  {t("homepage.hero.titleTail")}
                </motion.h1>

                <motion.p
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="font-body text-base sm:text-lg font-light text-[#FDFCFB]/60 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
                >
                  {t("homepage.hero.subtitleBefore")}
                  <span className="text-[#FDFCFB]/90">{t("homepage.hero.subtitleHighlight")}</span>
                  {t("homepage.hero.subtitleAfter")}
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
                    {t("homepage.hero.ctaPrimary")}
                  </LuxuryButton>

                  <LuxuryButton href="/demo" variant="secondary">
                    {t("homepage.hero.ctaSecondary")}
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
                <HeroProductVisual />
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
              animate={allowInfiniteAnimations ? { y: [0, 12, 0] } : undefined}
              transition={allowInfiniteAnimations ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
              className="w-px h-16 bg-gradient-to-b from-[#DCC7B0]/50 to-transparent"
            />
          </motion.div>
        </section>

        {/* Accès client — création NFC + Wallet */}
        <section className="relative px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#DCC7B0]/15 bg-[#DCC7B0]/[0.04]"
          >
            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:p-16">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCC7B0]/20 bg-[#DCC7B0]/10 px-4 py-2">
                  <WandSparkles className="h-4 w-4 text-[#DCC7B0]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#DCC7B0]">
                    Accessible à tous les clients
                  </span>
                </div>

                <h2 className="font-display text-4xl leading-tight tracking-[0.03em] text-[#FDFCFB] sm:text-5xl">
                  Confiez-nous votre image.
                  <span className="block italic text-[#DCC7B0]">Recevez l’expérience complète.</span>
                </h2>

                <p className="mt-6 max-w-2xl font-body text-base font-extralight leading-relaxed text-[#FDFCFB]/50">
                  Envoyez le nom de votre entreprise ou un lien Google. L’équipe i-Wasp recherche vos
                  informations officielles et réalise une fiche premium avec QR canonique et véritable pass Apple Wallet.
                </p>

                <div className="mt-9">
                  <LuxuryButton href="/creer-ma-carte" variant="primary">
                    Créer ma carte NFC + Wallet
                  </LuxuryButton>
                </div>
              </div>

              <div className="grid gap-3 self-center">
                {[
                  { icon: Globe, title: "Votre lien NFC", text: "Une fiche publique premium sur i-wasp.com." },
                  { icon: QrCode, title: "Un QR unique", text: "Le QR ouvre toujours votre fiche web, jamais un simple numéro." },
                  { icon: WalletCards, title: "Apple Wallet", text: "Un véritable pass signé, prêt à être ajouté sur iPhone." },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-white/[0.06] bg-black/25 p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DCC7B0]/15 bg-[#DCC7B0]/10">
                      <Icon className="h-5 w-5 text-[#DCC7B0]" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm tracking-[0.06em] text-[#FDFCFB]">{title}</h3>
                      <p className="mt-1 font-body text-xs font-extralight leading-relaxed text-[#FDFCFB]/60">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                {t("homepage.strip.tagline")}
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
                { icon: Zap, label: t("homepage.strip.item1Label"), desc: t("homepage.strip.item1Desc") },
                { icon: Shield, label: t("homepage.strip.item2Label"), desc: t("homepage.strip.item2Desc") },
                { icon: Sparkles, label: t("homepage.strip.item3Label"), desc: t("homepage.strip.item3Desc") },
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
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#FDFCFB]/60 mb-1">
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

        {/* Démonstration NFC en 3 étapes */}
        <NfcDemoSteps />

        {/* Photographie produit réelle — chargée à la demande sous la ligne de flottaison */}
        <RealProductShowcase />

        {/* Ce qui est inclus */}
        <IncludedSection />

        {/* Modèles & finitions */}
        <ModelsSection />

        {/* ═══════════════════════════════════════════════════════════════
            CONFIGURATEUR — Personnalisation en temps réel
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
                {t("homepage.configurator.eyebrow")}
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.04em] text-[#FDFCFB] mb-6">
                {t("homepage.configurator.titleLead")}<span className="italic text-[#DCC7B0]">{t("homepage.configurator.titleAccent")}</span>
              </h2>
              <p className="font-body text-base font-extralight text-[#FDFCFB]/60 max-w-xl mx-auto">
                {t("homepage.configurator.subtitle")}
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
                  {t("homepage.configurator.nameLabel")}
                </label>
                <input
                  type="text"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                  placeholder={t("homepage.configurator.namePlaceholder")}
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
                    t("homepage.configurator.feature1"),
                    t("homepage.configurator.feature2"),
                    t("homepage.configurator.feature3"),
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
                    {t("homepage.configurator.cta")}
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
                <NfcCard3D
                  name={previewName || t("homepage.previewNameDefault")}
                  animate={allowInfiniteAnimations}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            L'AURA — Mockup Téléphone avec Profil Magnifique
            ═══════════════════════════════════════════════════════════════ */}
        <section id="laura" className="relative py-32 px-6 overflow-hidden">
          {/* Glow de fond */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(220, 199, 176, 0.06) 0%, transparent 70%)",
            }}
          />
          
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-20"
            >
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#DCC7B0]/50 mb-6">
                {t("homepage.profile.eyebrow")}
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.04em] text-[#FDFCFB] mb-6">
                {t("homepage.profile.titleLead")}<span className="italic text-[#DCC7B0]">{t("homepage.profile.titleAccent")}</span>
              </h2>
              <p className="font-body text-base font-extralight text-[#FDFCFB]/60 max-w-xl mx-auto">
                {t("homepage.profile.subtitle")}
              </p>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mockup Téléphone */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center"
              >
                <div className="relative">
                  {/* Glow derrière le téléphone */}
                  <motion.div
                    className="absolute inset-0 -z-10"
                    animate={allowInfiniteAnimations ? {
                      boxShadow: [
                        "0 0 80px rgba(220, 199, 176, 0.15), 0 0 160px rgba(220, 199, 176, 0.08)",
                        "0 0 100px rgba(220, 199, 176, 0.2), 0 0 200px rgba(220, 199, 176, 0.1)",
                        "0 0 80px rgba(220, 199, 176, 0.15), 0 0 160px rgba(220, 199, 176, 0.08)",
                      ],
                    } : undefined}
                    transition={allowInfiniteAnimations ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
                    style={{ borderRadius: "3rem" }}
                  />
                  
                  {/* Frame du téléphone */}
                  <div 
                    className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[660px] rounded-[3rem] p-3"
                    style={{
                      background: "linear-gradient(145deg, #1A1A1A 0%, #0A0A0A 100%)",
                      boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {/* Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />
                    
                    {/* Écran */}
                    <div 
                      className="w-full h-full rounded-[2.25rem] overflow-hidden relative"
                      style={{
                        background: "linear-gradient(180deg, #0A0A0A 0%, #050505 100%)",
                      }}
                    >
                      {/* Contenu du profil */}
                      <div className="relative h-full flex flex-col items-center px-6 pt-16 pb-8">
                        
                        {/* Photo de profil avec bordure lumineuse */}
                        <motion.div
                          className="relative mb-6"
                          animate={allowInfiniteAnimations ? {
                            boxShadow: [
                              "0 0 30px rgba(220, 199, 176, 0.2)",
                              "0 0 50px rgba(220, 199, 176, 0.3)",
                              "0 0 30px rgba(220, 199, 176, 0.2)",
                            ],
                          } : undefined}
                          transition={allowInfiniteAnimations ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                          style={{ borderRadius: "50%" }}
                        >
                          <div 
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px]"
                            style={{
                              background: "linear-gradient(135deg, rgba(220, 199, 176, 0.8) 0%, rgba(220, 199, 176, 0.2) 50%, rgba(220, 199, 176, 0.6) 100%)",
                            }}
                          >
                            <div 
                              className="w-full h-full rounded-full overflow-hidden"
                              style={{
                                filter: "grayscale(100%) contrast(1.1)",
                              }}
                            >
                              <img 
                                src={mehdiProfileImg}
                                alt="Mehdi El Alami"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Badge vérifié */}
                          <motion.div
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              background: "linear-gradient(135deg, #DCC7B0 0%, #E8D9C7 100%)",
                              boxShadow: "0 4px 12px rgba(220, 199, 176, 0.4)",
                            }}
                            animate={allowInfiniteAnimations ? { scale: [1, 1.05, 1] } : undefined}
                            transition={allowInfiniteAnimations ? { duration: 2, repeat: Infinity } : undefined}
                          >
                            <Check className="w-4 h-4 text-[#030303]" />
                          </motion.div>
                        </motion.div>
                        
                        {/* Nom */}
                        <h3 className="font-display text-xl sm:text-2xl tracking-[0.08em] text-[#FDFCFB] text-center mb-1">
                          {previewName || t("homepage.previewNameDefault")}
                        </h3>
                        
                        {/* Titre */}
                        <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#DCC7B0]/70 mb-2">
                          {t("homepage.profile.role")} · I-WASP
                        </p>

                        {/* Tagline */}
                        <p className="font-body text-xs font-extralight text-[#FDFCFB]/60 text-center mb-8 px-4">
                          {t("homepage.profile.tagline")}
                        </p>

                        {/* Réseaux & contact */}
                        <div className="w-full space-y-3 flex-1">
                          {[
                            { icon: Linkedin, label: "LinkedIn", color: "#0A66C2" },
                            { icon: Instagram, label: "Instagram", color: "#E4405F" },
                            { icon: Mail, label: "Email", color: "#DCC7B0" },
                            { icon: Phone, label: t("homepage.profile.callLabel"), color: "#00FF66" },
                          ].map((item, i) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="relative overflow-hidden rounded-2xl cursor-pointer group"
                              style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.06)",
                              }}
                            >
                              {/* Glow au hover */}
                              <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                  background: `radial-gradient(circle at left, ${item.color}15 0%, transparent 70%)`,
                                }}
                              />
                              
                              <div className="relative flex items-center gap-4 px-4 py-3.5">
                                <motion.div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{
                                    background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`,
                                    border: `1px solid ${item.color}30`,
                                  }}
                                  animate={allowInfiniteAnimations ? {
                                    boxShadow: [
                                      `0 0 10px ${item.color}20`,
                                      `0 0 20px ${item.color}30`,
                                      `0 0 10px ${item.color}20`,
                                    ],
                                  } : undefined}
                                  transition={allowInfiniteAnimations ? { duration: 2, repeat: Infinity, delay: i * 0.3 } : undefined}
                                >
                                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                </motion.div>
                                
                                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#FDFCFB]/60 group-hover:text-[#FDFCFB]/90 transition-colors">
                                  {item.label}
                                </span>
                                
                                <ArrowRight className="w-4 h-4 text-[#FDFCFB]/30 ml-auto group-hover:text-[#FDFCFB]/60 transition-colors" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Footer du profil */}
                        <div className="mt-auto pt-6">
                          <p className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#FDFCFB]/55">
                            POWERED BY I-WASP
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Texte descriptif */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10"
              >
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl tracking-[0.04em] text-[#FDFCFB] mb-4">
                    {t("homepage.profile.calloutTitleLead")}<span className="italic text-[#DCC7B0]">{t("homepage.profile.calloutTitleAccent")}</span>
                  </h3>
                  <p className="font-body text-base font-extralight text-[#FDFCFB]/50 leading-relaxed">
                    {t("homepage.profile.calloutDesc")}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  {[
                    { title: t("homepage.profile.f1Title"), desc: t("homepage.profile.f1Desc") },
                    { title: t("homepage.profile.f2Title"), desc: t("homepage.profile.f2Desc") },
                    { title: t("homepage.profile.f3Title"), desc: t("homepage.profile.f3Desc") },
                    { title: t("homepage.profile.f4Title"), desc: t("homepage.profile.f4Desc") },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(220, 199, 176, 0.08)",
                          border: "1px solid rgba(220, 199, 176, 0.15)",
                        }}
                      >
                        <Check className="w-4 h-4 text-[#DCC7B0]" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm tracking-[0.08em] text-[#FDFCFB] mb-1">
                          {feature.title}
                        </h4>
                        <p className="font-body text-xs font-extralight text-[#FDFCFB]/60">
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <LuxuryButton href="/order/offre" variant="primary">
                    {t("homepage.profile.cta")}
                  </LuxuryButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Avantages mesurables */}
        <BenefitsSection />

        {/* Comparaison carte papier vs i-wasp (contraste éditorial ivoire) */}
        <ComparisonSection />

        {/* Tarifs sans ambiguïté */}
        <PricingSection />

        {/* Preuves de confiance */}
        <TrustSection />

        {/* FAQ */}
        <FaqSection />

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
              {t("homepage.finalCta.titleLead")}
              <br />
              <span className="italic text-[#DCC7B0]">{t("homepage.finalCta.titleAccent")}</span>
            </h2>

            <p className="font-body text-lg font-extralight text-[#FDFCFB]/60 max-w-xl mx-auto mb-12">
              {t("homepage.finalCta.subtitle")}
            </p>

            <LuxuryButton href="/order/offre" variant="primary">
              {t("homepage.finalCta.cta")}
            </LuxuryButton>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER MINIMAL
            ═══════════════════════════════════════════════════════════════ */}
        </main>

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
                i-wasp
              </span>
            </div>
            
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#FDFCFB]/60">
              {t("homepage.finalCta.footerTagline")}
            </p>
            
            <p className="font-body text-xs font-extralight text-[#FDFCFB]/60">
              © {new Date().getFullYear()} IWASP
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
