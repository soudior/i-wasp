/**
 * Avantages mesurables — chiffres clairs, pas d'abstraction.
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

export function BenefitsSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();
  const STATS = t("homepage.benefits.items", { returnObjects: true }) as { value: string; label: string }[];

  return (
    <section className="relative py-24 sm:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent(shouldReduceMotion)}
        >
          <motion.div variants={reveal(shouldReduceMotion)} className="text-center mb-14 sm:mb-16">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: HOME.accent, opacity: 0.7 }}>
              {t("homepage.benefits.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              {t("homepage.benefits.title")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={reveal(shouldReduceMotion)}
                className="rounded-2xl p-6 sm:p-8 text-center h-full flex flex-col justify-center"
                style={{ background: HOME.bgCard, border: `1px solid ${HOME.border}` }}
              >
                <div className="font-display text-3xl sm:text-4xl mb-2" style={{ color: HOME.accent }}>
                  {s.value}
                </div>
                <p className="font-body text-xs sm:text-sm font-light leading-snug" style={{ color: HOME.textMuted }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BenefitsSection;
