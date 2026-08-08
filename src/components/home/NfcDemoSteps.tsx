/**
 * Démonstration NFC en 3 étapes — Approchez / Le profil s'ouvre / Contact enregistré
 * Identité sombre premium, animations légères et accessibles.
 */

import { motion } from "framer-motion";
import { Nfc, Smartphone, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

const ICONS = [Nfc, Smartphone, UserCheck];

export function NfcDemoSteps() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();

  const STEPS = ICONS.map((icon, i) => ({
    n: `0${i + 1}`,
    icon,
    title: t(`homepage.demo.step${i + 1}Title`),
    desc: t(`homepage.demo.step${i + 1}Desc`),
  }));

  return (
    <section id="demo" className="relative py-24 sm:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent(shouldReduceMotion)}
        >
          <motion.div variants={reveal(shouldReduceMotion)} className="text-center mb-14 sm:mb-20">
            <p
              className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ color: HOME.accent, opacity: 0.7 }}
            >
              {t("homepage.demo.eyebrow")}
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight"
              style={{ color: HOME.text }}
            >
              {t("homepage.demo.title")}
            </h2>
            <p
              className="mt-4 font-body text-base sm:text-lg font-light max-w-xl mx-auto"
              style={{ color: HOME.textMuted }}
            >
              {t("homepage.demo.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                variants={reveal(shouldReduceMotion)}
                className="relative"
              >
                {/* Ligne de liaison (desktop) */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-[52px] left-[62%] w-[76%] h-px"
                    style={{ background: `linear-gradient(to right, ${HOME.accentBorder}, transparent)` }}
                    aria-hidden="true"
                  />
                )}

                <div
                  className="relative h-full rounded-3xl p-8"
                  style={{
                    background: HOME.bgCard,
                    border: `1px solid ${HOME.border}`,
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: HOME.accentSoft, border: `1px solid ${HOME.accentBorder}` }}
                    >
                      <step.icon className="w-6 h-6" style={{ color: HOME.accent }} aria-hidden="true" />
                    </div>
                    <span
                      className="font-mono text-sm tracking-[0.2em]"
                      style={{ color: HOME.textFaint }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-display text-xl mb-3" style={{ color: HOME.text }}>
                    {step.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed font-light" style={{ color: HOME.textMuted }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NfcDemoSteps;
