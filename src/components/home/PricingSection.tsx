/**
 * Tarifs — sans ambiguïté. Données réelles (src/lib/nfcPricing.ts).
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { NFC_PRICING, formatPriceEur, formatPriceMad } from "@/lib/nfcPricing";
import { HOME, reveal, staggerParent } from "./theme";

const TIERS = [
  { ...NFC_PRICING.cards.ESSENTIELLE, highlighted: false },
  { ...NFC_PRICING.cards.PROFESSIONNELLE, highlighted: true },
  { ...NFC_PRICING.cards.PRESTIGE, highlighted: false },
];

export function PricingSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const team = NFC_PRICING.cards.PACK_TEAM;

  return (
    <section id="tarifs" className="relative py-24 sm:py-28 px-6" style={{ background: HOME.bgElevated }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerParent(shouldReduceMotion)}
        >
          <motion.div variants={reveal(shouldReduceMotion)} className="text-center mb-14 sm:mb-16">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5" style={{ color: HOME.accent, opacity: 0.7 }}>
              Tarifs
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              Un prix clair, tout inclus
            </h2>
            <p className="mt-4 font-body text-base sm:text-lg font-light max-w-xl mx-auto" style={{ color: HOME.textMuted }}>
              Carte physique, profil digital, QR code et mises à jour compris. Sans abonnement obligatoire.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {TIERS.map((tier) => (
              <motion.div
                key={tier.id}
                variants={reveal(shouldReduceMotion)}
                className="relative rounded-3xl p-8 flex flex-col h-full"
                style={{
                  background: tier.highlighted ? "rgba(220,199,176,0.06)" : HOME.bgCard,
                  border: tier.highlighted ? `1px solid ${HOME.accentBorder}` : `1px solid ${HOME.border}`,
                }}
              >
                {tier.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase whitespace-nowrap"
                    style={{ background: HOME.accent, color: "#0A0A0A" }}
                  >
                    {tier.badge}
                  </span>
                )}
                <h3 className="font-display text-xl mb-1" style={{ color: HOME.text }}>{tier.name}</h3>
                <p className="font-body text-sm font-light mb-6" style={{ color: HOME.textFaint }}>{tier.subtitle}</p>

                <div className="mb-6">
                  <span className="font-display text-4xl" style={{ color: HOME.text }}>{formatPriceEur(tier.priceEur)}</span>
                  <span className="font-body text-sm ml-2" style={{ color: HOME.textFaint }}>
                    {formatPriceMad(tier.priceMad)}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: HOME.accent }} aria-hidden="true" />
                      <span className="font-body text-sm font-light" style={{ color: HOME.textMuted }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/order/offre"
                  className="block text-center rounded-full py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-transform duration-300 hover:scale-[1.02]"
                  style={
                    tier.highlighted
                      ? { background: `linear-gradient(135deg, ${HOME.accent}, #E8D9C7)`, color: "#0A0A0A" }
                      : { background: "transparent", color: HOME.accent, border: `1px solid ${HOME.accentBorder}` }
                  }
                >
                  Choisir {tier.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pack équipe */}
          <motion.div
            variants={reveal(shouldReduceMotion)}
            className="mt-6 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: HOME.bgCard, border: `1px solid ${HOME.border}` }}
          >
            <div className="text-center sm:text-left">
              <h3 className="font-display text-lg" style={{ color: HOME.text }}>{team.name} — équipes & entreprises</h3>
              <p className="font-body text-sm font-light mt-1" style={{ color: HOME.textMuted }}>
                {team.quantity} cartes à {formatPriceEur(team.priceEur)} · {team.savings}% d'économie vs tarif unitaire.
              </p>
            </div>
            <Link
              to="/enterprise"
              className="shrink-0 rounded-full px-6 py-3 font-mono text-[11px] tracking-[0.15em] uppercase"
              style={{ color: HOME.accent, border: `1px solid ${HOME.accentBorder}` }}
            >
              Solutions entreprises
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
