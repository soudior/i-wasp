/**
 * Démonstration NFC en 3 étapes — Approchez / Le profil s'ouvre / Contact enregistré
 * Identité sombre premium, animations légères et accessibles.
 */

import { motion } from "framer-motion";
import { Nfc, Smartphone, UserCheck } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

const STEPS = [
  {
    n: "01",
    icon: Nfc,
    title: "Approchez la carte",
    desc: "Posez votre carte i-wasp contre un smartphone. La technologie NFC fait le reste — sans contact, sans application.",
  },
  {
    n: "02",
    icon: Smartphone,
    title: "Le profil s'ouvre",
    desc: "Votre identité digitale s'affiche instantanément : coordonnées, réseaux, portfolio et services, toujours à jour.",
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Le contact est enregistré",
    desc: "Un geste suffit pour enregistrer votre fiche dans le téléphone, vous appeler, vous écrire ou vous suivre.",
  },
];

export function NfcDemoSteps() {
  const { shouldReduceMotion } = useReducedMotion();

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
              Comment ça marche
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight"
              style={{ color: HOME.text }}
            >
              Un contact. Trois secondes.
            </h2>
            <p
              className="mt-4 font-body text-base sm:text-lg font-light max-w-xl mx-auto"
              style={{ color: HOME.textMuted }}
            >
              Aucune application requise pour la personne qui reçoit votre carte.
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
