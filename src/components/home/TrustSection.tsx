/**
 * Preuves de confiance.
 * NB: aucun faux témoignage ici. On affiche des garanties factuelles.
 * Les témoignages clients réels pourront être ajoutés dans `REAL_TESTIMONIALS`
 * une fois recueillis avec leur accord.
 */

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Lock, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

const ICONS = [ShieldCheck, Lock, Truck, Headset];

// À remplir avec de vrais retours clients (nom, rôle, citation) — jamais inventés.
const REAL_TESTIMONIALS: { name: string; role: string; quote: string }[] = [];

export function TrustSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();
  const items = t("homepage.trust.items", { returnObjects: true }) as { title: string; desc: string }[];
  const GUARANTEES = items.map((it, i) => ({ ...it, icon: ICONS[i] }));

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
              {t("homepage.trust.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              {t("homepage.trust.title")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {GUARANTEES.map((g) => (
              <motion.div
                key={g.title}
                variants={reveal(shouldReduceMotion)}
                className="rounded-2xl p-6 h-full text-center"
                style={{ background: HOME.bgCard, border: `1px solid ${HOME.border}` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: HOME.accentSoft, border: `1px solid ${HOME.accentBorder}` }}
                >
                  <g.icon className="w-5 h-5" style={{ color: HOME.accent }} aria-hidden="true" />
                </div>
                <h3 className="font-display text-base mb-2" style={{ color: HOME.text }}>{g.title}</h3>
                <p className="font-body text-xs font-light leading-relaxed" style={{ color: HOME.textMuted }}>{g.desc}</p>
              </motion.div>
            ))}
          </div>

          {REAL_TESTIMONIALS.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5 mt-8">
              {REAL_TESTIMONIALS.map((t) => (
                <motion.blockquote
                  key={t.name}
                  variants={reveal(shouldReduceMotion)}
                  className="rounded-2xl p-7"
                  style={{ background: HOME.bgCard, border: `1px solid ${HOME.border}` }}
                >
                  <p className="font-body text-base font-light leading-relaxed mb-4" style={{ color: HOME.text }}>
                    « {t.quote} »
                  </p>
                  <footer className="font-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: HOME.textFaint }}>
                    {t.name} — {t.role}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default TrustSection;
