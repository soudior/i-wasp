/**
 * HomeLuxeMax — Haute Couture Digitale
 * Style: Ultra chic, éditorial, minimalisme extrême
 * Palette: Noir Couture #080808 / Or Sablé #AF8E56
 * 
 * Hero: Full-screen, silent, authoritative, timeless
 * Like entering a 5-star luxury fashion maison
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CoutureFooter } from "@/components/CoutureFooter";
import { COUTURE } from "@/lib/hauteCouturePalette";

export default function HomeLuxeMax() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO NOIR — Full-screen, silent, authoritative, timeless
          One headline. One CTA. Nothing else.
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: COUTURE.jet }}
      >
        {/* Honeycomb texture — tone-on-tone, barely visible 3-4% */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.5' stroke-opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        {/* Brand mark — minimal, top center */}
        <motion.div 
          className="absolute top-8 left-0 right-0 flex justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <Link 
            to="/"
            className="font-display text-sm tracking-[0.3em] uppercase font-light"
            style={{ color: COUTURE.textMuted }}
          >
            i-wasp
          </Link>
        </motion.div>
        
        {/* Central content — ONE headline, silence, authority */}
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 
            className="font-display text-3xl md:text-4xl lg:text-5xl font-light leading-[1.3] tracking-tight"
            style={{ color: COUTURE.silk }}
          >
            <span className="italic">La carte des </span>
            <span className="italic" style={{ color: COUTURE.gold }}>décideurs.</span>
          </h1>
        </motion.div>
        
        {/* Single discreet CTA — bottom center */}
        <motion.div 
          className="absolute bottom-20 left-0 right-0 flex justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
        >
          <Link 
            to="/order/offre"
            className="text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-1000 pb-1"
            style={{ 
              color: COUTURE.textMuted,
              borderBottom: `1px solid ${COUTURE.textMuted}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COUTURE.gold;
              e.currentTarget.style.borderBottomColor = COUTURE.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COUTURE.textMuted;
              e.currentTarget.style.borderBottomColor = `${COUTURE.textMuted}30`;
            }}
          >
            Créer mon identité
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MANIFESTE — One silent thought
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="min-h-[70vh] flex items-center justify-center px-8 relative"
        style={{ backgroundColor: COUTURE.silk }}
      >
        <motion.blockquote 
          className="text-center max-w-[600px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2 }}
        >
          <p 
            className="font-display text-2xl md:text-3xl font-light italic leading-[1.5]"
            style={{ color: COUTURE.jet }}
          >
            "Une première impression
            <br />
            <span style={{ color: COUTURE.gold }}>ne se répète jamais."</span>
          </p>
        </motion.blockquote>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ESSENCE — Three words
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="min-h-[50vh] flex items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: COUTURE.jet }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.5' stroke-opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {["Créer", "Partager", "Convertir"].map((word, i) => (
              <motion.span
                key={word}
                className="font-display text-xl md:text-2xl font-light italic"
                style={{ color: i === 1 ? COUTURE.gold : COUTURE.textMuted }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.4, duration: 1.5 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SILENCE — Empty space
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-32 md:py-48 px-8"
        style={{ backgroundColor: COUTURE.silk }}
      >
        <motion.div 
          className="max-w-[400px] mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2 }}
        >
          <p 
            className="text-sm font-light leading-[2] tracking-wide"
            style={{ color: COUTURE.textMuted }}
          >
            Une carte. Un geste. Mille connexions.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FINAL — Authority
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="min-h-[40vh] flex items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: COUTURE.jet }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.5' stroke-opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 2 }}
        >
          <Link 
            to="/order/offre"
            className="inline-block text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-1000 pb-1"
            style={{ 
              color: COUTURE.textMuted,
              borderBottom: `1px solid ${COUTURE.textMuted}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COUTURE.gold;
              e.currentTarget.style.borderBottomColor = COUTURE.gold;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COUTURE.textMuted;
              e.currentTarget.style.borderBottomColor = `${COUTURE.textMuted}30`;
            }}
          >
            Entrer
          </Link>
        </motion.div>
      </section>

      <CoutureFooter />
    </div>
  );
}
