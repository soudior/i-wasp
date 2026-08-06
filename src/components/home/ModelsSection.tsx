/**
 * Modèles, finitions & personnalisation — visuels réels des cartes.
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

import blackMatte from "@/assets/cards/card-black-matte.webp";
import goldAccent from "@/assets/cards/card-gold-accent.png";
import navyExecutive from "@/assets/cards/card-navy-executive.png";
import whiteMinimal from "@/assets/cards/card-white-minimal.png";
import ultraLuxe from "@/assets/cards/card-ultra-luxe.png";

const MODELS = [
  { img: blackMatte, name: "Noir mat", finish: "PVC finition mate anti-traces" },
  { img: goldAccent, name: "Accent or", finish: "Détails dorés, contraste premium" },
  { img: navyExecutive, name: "Bleu executive", finish: "Sobre et corporate" },
  { img: whiteMinimal, name: "Blanc minimal", finish: "Épuré, éditorial" },
  { img: ultraLuxe, name: "Métal ultra-luxe", finish: "Métal brossé, gravure laser" },
];

export function ModelsSection() {
  const { shouldReduceMotion } = useReducedMotion();

  return (
    <section id="modeles" className="relative py-24 sm:py-28 px-6" style={{ background: HOME.bgElevated }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent(shouldReduceMotion)}
        >
          <motion.div variants={reveal(shouldReduceMotion)} className="text-center mb-14 sm:mb-16">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: HOME.accent, opacity: 0.7 }}>
              Modèles & finitions
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              Une carte à votre image
            </h2>
            <p className="mt-4 font-body text-base sm:text-lg font-light max-w-xl mx-auto" style={{ color: HOME.textMuted }}>
              Du PVC mat au métal gravé — chaque finition est personnalisable à vos couleurs et votre logo.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {MODELS.map((m) => (
              <motion.div key={m.name} variants={reveal(shouldReduceMotion)} className="group">
                <div
                  className="rounded-2xl overflow-hidden mb-3 aspect-[1.6/1] flex items-center justify-center p-3"
                  style={{ background: HOME.bgCard, border: `1px solid ${HOME.border}` }}
                >
                  <img
                    src={m.img}
                    alt={`Carte NFC i-wasp — ${m.name}`}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="font-display text-sm" style={{ color: HOME.text }}>{m.name}</h3>
                <p className="font-body text-xs font-light mt-0.5" style={{ color: HOME.textFaint }}>{m.finish}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ModelsSection;
