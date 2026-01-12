/**
 * HomeLuxeMax — Haute Couture Digitale
 * Style: Ultra chic, éditorial, minimalisme extrême
 * Palette: Ivoire #F6F5F2 / Noir Couture #0A0A0A / Or Sablé #AF8E56
 */

import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { COUTURE } from "@/lib/hauteCouturePalette";

// ═══════════════════════════════════════════════════════════════════════════
// HONEYCOMB TEXTURE - Signature pattern
// ═══════════════════════════════════════════════════════════════════════════

function HoneycombTexture({ dark = false }: { dark?: boolean }) {
  const strokeColor = dark ? "#F6F5F2" : "#0A0A0A";
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent(strokeColor)}' stroke-width='0.5' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomeLuxeMax() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Mes contacts doivent-ils installer une application ?",
      answer: "Non. Un simple tap NFC ou scan QR ouvre votre profil dans leur navigateur."
    },
    {
      question: "Puis-je modifier mes informations après création ?",
      answer: "Oui. Chaque modification se reflète instantanément sur toutes vos cartes."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Hébergement sécurisé en Europe. Vous contrôlez ce que chaque contact peut voir."
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.silk }}>
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO NOIR — Full-screen, silent, authoritative
          First impression: entering a luxury fashion maison
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: COUTURE.jet }}
      >
        {/* Honeycomb texture — tone-on-tone, barely visible */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        {/* Navbar overlay — absolute positioned */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <CoutureNavbar />
        </div>
        
        {/* Central content — one idea, silence, authority */}
        <motion.div 
          className="text-center relative z-10 max-w-[800px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <h1 
            className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-[1.2] tracking-tight italic"
            style={{ color: COUTURE.silk }}
          >
            L'identité digitale,
            <br />
            <span style={{ color: COUTURE.gold }}>élevée au rang d'art.</span>
          </h1>
        </motion.div>
        
        {/* Single discreet CTA — bottom center */}
        <motion.div 
          className="absolute bottom-16 left-0 right-0 flex justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        >
          <Link 
            to="/order/offre"
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1"
            style={{ 
              color: COUTURE.textMuted,
              borderBottom: `1px solid ${COUTURE.textMuted}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COUTURE.gold;
              e.currentTarget.style.borderBottomColor = COUTURE.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COUTURE.textMuted;
              e.currentTarget.style.borderBottomColor = `${COUTURE.textMuted}40`;
            }}
          >
            Découvrir
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MANIFESTE - Citation centrale
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-48 px-8 relative" style={{ backgroundColor: COUTURE.silk }}>
        <motion.div 
          className="max-w-[700px] mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <blockquote 
            className="font-display text-2xl md:text-3xl lg:text-4xl font-light italic leading-[1.4]"
            style={{ color: COUTURE.jet }}
          >
            "Un concierge digital
            <br />
            <span style={{ color: COUTURE.gold }}>pour chaque rencontre."</span>
          </blockquote>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMMENT ÇA FONCTIONNE - 3 étapes épurées
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-32 md:py-40 px-8"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-[800px] mx-auto">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.4em] mb-6 block font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Comment ça fonctionne
            </span>
            <h2 
              className="font-display text-3xl md:text-4xl font-light tracking-tight"
              style={{ color: COUTURE.silk }}
            >
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
                className="flex items-baseline gap-10 md:gap-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1 }}
              >
                <span 
                  className="text-4xl md:text-5xl font-light tabular-nums"
                  style={{ color: `${COUTURE.silk}20` }}
                >
                  {step.num}
                </span>
                <div className="flex-1">
                  <h3 
                    className="font-display text-xl md:text-2xl font-light italic mb-3"
                    style={{ color: COUTURE.gold }}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className="text-base font-light leading-relaxed max-w-[400px]"
                    style={{ color: COUTURE.textMuted }}
                  >
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          POUR QUI - Tags minimalistes
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-40 px-8" style={{ backgroundColor: COUTURE.silk }}>
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.4em] mb-6 block font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Pour qui
            </span>
            <h2 
              className="font-display text-2xl md:text-3xl font-light italic mb-16"
              style={{ color: COUTURE.jet }}
            >
              Pensé pour ceux dont le réseau est le business.
            </h2>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            {[
              "Consultants",
              "Commerciaux",
              "Entrepreneurs",
              "Agents immobiliers",
              "Hôtellerie",
              "Finance",
              "Créateurs"
            ].map((tag, i) => (
              <motion.span
                key={i}
                className="px-5 py-2.5 text-xs uppercase tracking-[0.1em] font-light transition-all duration-500"
                style={{ 
                  color: COUTURE.textSecondary,
                  border: `1px solid ${COUTURE.border}`,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COUTURE.gold;
                  e.currentTarget.style.color = COUTURE.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COUTURE.border;
                  e.currentTarget.style.color = COUTURE.textSecondary;
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ - Accordéon ultra minimal
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-32 md:py-40 px-8"
        style={{ 
          backgroundColor: COUTURE.silk,
          borderTop: `1px solid ${COUTURE.border}`,
        }}
      >
        <div className="max-w-[600px] mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.4em] mb-6 block font-light"
              style={{ color: COUTURE.textMuted }}
            >
              Questions
            </span>
            <h2 
              className="font-display text-2xl md:text-3xl font-light italic"
              style={{ color: COUTURE.jet }}
            >
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                style={{ borderBottom: `1px solid ${COUTURE.border}` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span 
                    className="font-light text-base transition-colors duration-400"
                    style={{ color: COUTURE.textSecondary }}
                    onMouseEnter={(e) => e.currentTarget.style.color = COUTURE.jet}
                    onMouseLeave={(e) => e.currentTarget.style.color = COUTURE.textSecondary}
                  >
                    {faq.question}
                  </span>
                  <span 
                    className="text-xl transition-transform duration-500"
                    style={{ 
                      color: COUTURE.gold,
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <p 
                        className="pb-6 text-sm font-light leading-relaxed"
                        style={{ color: COUTURE.textMuted }}
                      >
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
          CTA FINAL - Un seul, discret
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-32 md:py-48 px-8"
        style={{ backgroundColor: COUTURE.silk }}
      >
        <motion.div 
          className="max-w-[500px] mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 
            className="font-display text-2xl md:text-3xl font-light italic mb-4"
            style={{ color: COUTURE.jet }}
          >
            Prêt à créer
          </h2>
          <p 
            className="font-display text-2xl md:text-3xl font-light italic mb-12"
            style={{ color: COUTURE.gold }}
          >
            votre identité ?
          </p>
          
          <Link 
            to="/order/offre"
            className="inline-block text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 pb-2"
            style={{ 
              color: COUTURE.jet,
              borderBottom: `1px solid ${COUTURE.jet}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COUTURE.gold;
              e.currentTarget.style.borderColor = COUTURE.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COUTURE.jet;
              e.currentTarget.style.borderColor = COUTURE.jet;
            }}
          >
            Découvrir
          </Link>
        </motion.div>
      </section>

      <CoutureFooter />
    </div>
  );
}
