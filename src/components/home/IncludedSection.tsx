/**
 * Ce qui est inclus — clarté sur l'offre produit.
 */

import { motion } from "framer-motion";
import { CreditCard, Globe, QrCode, Contact, BarChart3, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

const ICONS = [CreditCard, Globe, QrCode, Contact, BarChart3, RefreshCw];

export function IncludedSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();
  const items = t("homepage.included.items", { returnObjects: true }) as { title: string; desc: string }[];
  const ITEMS = items.map((it, i) => ({ ...it, icon: ICONS[i] }));

  return (
    <section className="relative py-24 sm:py-28 px-6" style={{ background: HOME.bgElevated }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent(shouldReduceMotion)}
        >
          <motion.div variants={reveal(shouldReduceMotion)} className="text-center mb-14 sm:mb-16">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: HOME.accent, opacity: 0.7 }}>
              {t("homepage.included.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              {t("homepage.included.title")}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ITEMS.map((item) => (
              <motion.div
                key={item.title}
                variants={reveal(shouldReduceMotion)}
                className="rounded-2xl p-6 h-full"
                style={{ background: HOME.bgCard, border: `1px solid ${HOME.border}` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: HOME.accentSoft, border: `1px solid ${HOME.accentBorder}` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: HOME.accent }} aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg mb-2" style={{ color: HOME.text }}>{item.title}</h3>
                <p className="font-body text-sm leading-relaxed font-light" style={{ color: HOME.textMuted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default IncludedSection;
