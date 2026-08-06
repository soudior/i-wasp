/**
 * Tarifs — sans ambiguïté. Données réelles (src/lib/nfcPricing.ts).
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { NFC_PRICING, formatPriceEur, formatPriceMad } from "@/lib/nfcPricing";
import { HOME, reveal, staggerParent } from "./theme";

// Ordre + prix depuis le catalogue (nfcPricing) ; textes traduits via i18n.
const TIER_DEFS = [
  { key: "essentielle", card: NFC_PRICING.cards.ESSENTIELLE, highlighted: false },
  { key: "professionnelle", card: NFC_PRICING.cards.PROFESSIONNELLE, highlighted: true },
  { key: "prestige", card: NFC_PRICING.cards.PRESTIGE, highlighted: false },
] as const;

export function PricingSection() {
  const { shouldReduceMotion } = useReducedMotion();
  const { t } = useTranslation();
  const team = NFC_PRICING.cards.PACK_TEAM;

  const TIERS = TIER_DEFS.map((def) => ({
    id: def.card.id,
    highlighted: def.highlighted,
    priceEur: def.card.priceEur,
    priceMad: def.card.priceMad,
    name: t(`homepage.pricing.tiers.${def.key}.name`),
    subtitle: t(`homepage.pricing.tiers.${def.key}.subtitle`),
    badge: t(`homepage.pricing.tiers.${def.key}.badge`, { defaultValue: "" }),
    features: t(`homepage.pricing.tiers.${def.key}.features`, { returnObjects: true }) as string[],
  }));

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
              {t("homepage.pricing.eyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ color: HOME.text }}>
              {t("homepage.pricing.title")}
            </h2>
            <p className="mt-4 font-body text-base sm:text-lg font-light max-w-xl mx-auto" style={{ color: HOME.textMuted }}>
              {t("homepage.pricing.subtitle")}
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
                  {t("homepage.pricing.choose")} {tier.name}
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
              <h3 className="font-display text-lg" style={{ color: HOME.text }}>{t("homepage.pricing.teamTitle")}</h3>
              <p className="font-body text-sm font-light mt-1" style={{ color: HOME.textMuted }}>
                {t("homepage.pricing.teamDesc", {
                  count: team.quantity,
                  price: formatPriceEur(team.priceEur),
                  savings: team.savings,
                })}
              </p>
            </div>
            <Link
              to="/enterprise"
              className="shrink-0 rounded-full px-6 py-3 font-mono text-[11px] tracking-[0.15em] uppercase"
              style={{ color: HOME.accent, border: `1px solid ${HOME.accentBorder}` }}
            >
              {t("homepage.pricing.teamCta")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
