/**
 * HomeLuxeMax — Haute Couture Digitale
 * Style: Ultra chic, éditorial, minimalisme extrême
 * Palette: Ivoire #F6F5F2 / Noir Couture #0A0A0A / Or Sablé #AF8E56
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { COUTURE } from "@/lib/hauteCouturePalette";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomeLuxeMax() {
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
          MANIFESTE — One thought, centered, silent
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
          transition={{ duration: 1.8 }}
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
          ESSENCE — Three words, nothing more
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="min-h-[60vh] flex items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: COUTURE.jet }}
      >
        {/* Subtle honeycomb */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {["Créer", "Partager", "Convertir"].map((word, i) => (
              <motion.span
                key={word}
                className="font-display text-2xl md:text-3xl font-light italic"
                style={{ color: i === 1 ? COUTURE.gold : COUTURE.silk }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3, duration: 1.2 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SILENCE — Empty space with subtle presence
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="py-40 md:py-56 px-8"
        style={{ backgroundColor: COUTURE.silk }}
      >
        <motion.div 
          className="max-w-[500px] mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.8 }}
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
          CTA FINAL — Authority, one action
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        className="min-h-[50vh] flex items-center justify-center px-8 relative overflow-hidden"
        style={{ backgroundColor: COUTURE.jet }}
      >
        {/* Subtle honeycomb */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.03'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
          }}
        />
        
        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.8 }}
        >
          <h2 
            className="font-display text-2xl md:text-3xl font-light italic mb-12"
            style={{ color: COUTURE.silk }}
          >
            Entrez dans <span style={{ color: COUTURE.gold }}>la maison.</span>
          </h2>
          
          <Link 
            to="/order/offre"
            className="inline-block text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-700 pb-1"
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
            Créer mon identité
          </Link>
        </motion.div>
      </section>

      <CoutureFooter />
    </div>
  );
}
