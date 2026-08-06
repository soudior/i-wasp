/**
 * Preuves de confiance.
 * NB: aucun faux témoignage ici. On affiche des garanties factuelles.
 * Les témoignages clients réels pourront être ajoutés dans `REAL_TESTIMONIALS`
 * une fois recueillis avec leur accord.
 */

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Lock, Headset } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HOME, reveal, staggerParent } from "./theme";

const GUARANTEES = [
  { icon: ShieldCheck, title: "Paiement sécurisé", desc: "Transactions traitées par Stripe, standard bancaire." },
  { icon: Lock, title: "Vos données protégées", desc: "Aucune donnée personnelle stockée dans la puce NFC." },
  { icon: Truck, title: "Livraison suivie", desc: "Expédition au Maroc, en France et en Europe." },
  { icon: Headset, title: "Accompagnement", desc: "Activation guidée et support à chaque étape." },
];

// À remplir avec de vrais retours clients (nom, rôle, citation) — jamais inventés.
const REAL_TESTIMONIALS: { name: string; role: string; quote: string }[] = [];

export function TrustSection() {
  const { shouldReduceMotion } = useReducedMotion();

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
              Preuves de confiance
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              Commandez l'esprit tranquille
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
