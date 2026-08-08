/**
 * Comparaison carte papier vs i-wasp.
 * Contraste éditorial : un panneau ivoire inséré dans le fond sombre.
 * (Le clair est un accent maîtrisé, pas un second thème.)
 */

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal } from "./theme";

// L'ordre correspond à homepage.comparison.rows ; seule la dernière ligne
// est un avantage « papier ».
const FLAGS = [
  { paper: false, iwasp: true },
  { paper: false, iwasp: true },
  { paper: false, iwasp: true },
  { paper: false, iwasp: true },
  { paper: false, iwasp: true },
  { paper: false, iwasp: true },
  { paper: true, iwasp: false },
];

export function ComparisonSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();
  const labels = t("homepage.comparison.rows", { returnObjects: true }) as string[];
  const ROWS = labels.map((label, i) => ({ label, ...FLAGS[i] }));

  return (
    <section className="relative py-24 sm:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={reveal(shouldReduceMotion)}
        >
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: HOME.accent, opacity: 0.7 }}>
              {t("homepage.comparison.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              {t("homepage.comparison.title")}
            </h2>
          </div>

          {/* Panneau ivoire — contraste éditorial */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: HOME.ivory, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}
          >
            <div className="grid grid-cols-[1fr_auto_auto]">
              {/* En-tête */}
              <div className="p-5 sm:p-6" />
              <div className="p-5 sm:p-6 text-center font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase" style={{ color: HOME.ivoryMuted }}>
                {t("homepage.comparison.paper")}
              </div>
              <div className="p-5 sm:p-6 text-center font-display text-sm sm:text-base" style={{ color: HOME.ivoryText }}>
                {t("homepage.comparison.iwasp")}
              </div>

              {ROWS.map((row, i) => (
                <div key={row.label} className="contents">
                  <div
                    className="px-5 sm:px-6 py-4 font-body text-sm sm:text-base font-light"
                    style={{ color: HOME.ivoryText, borderTop: i === 0 ? "none" : "1px solid rgba(10,10,10,0.08)" }}
                  >
                    {row.label}
                  </div>
                  <div
                    className="px-5 sm:px-6 py-4 flex items-center justify-center"
                    style={{ borderTop: i === 0 ? "none" : "1px solid rgba(10,10,10,0.08)" }}
                  >
                    {row.paper ? (
                      <Check className="w-5 h-5" style={{ color: "rgba(10,10,10,0.4)" }} aria-label="oui" />
                    ) : (
                      <X className="w-5 h-5" style={{ color: "rgba(10,10,10,0.25)" }} aria-label="non" />
                    )}
                  </div>
                  <div
                    className="px-5 sm:px-6 py-4 flex items-center justify-center"
                    style={{ borderTop: i === 0 ? "none" : "1px solid rgba(10,10,10,0.08)" }}
                  >
                    {row.iwasp ? (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#0A0A0A" }}>
                        <Check className="w-4 h-4" style={{ color: HOME.accent }} aria-label="oui" />
                      </span>
                    ) : (
                      <X className="w-5 h-5" style={{ color: "rgba(10,10,10,0.25)" }} aria-label="non" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ComparisonSection;
