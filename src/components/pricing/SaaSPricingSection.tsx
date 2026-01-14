/**
 * SaaS Pricing Section
 * Complete pricing grid with all 4 tiers
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SaaSPricingCard } from './SaaSPricingCard';
import { useSaaSSubscription } from '@/hooks/useSaaSSubscription';
import { SAAS_FEATURE_COMPARISON } from '@/lib/saasPlans';

const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
};

export function SaaSPricingSection() {
  const { subscription } = useSaaSSubscription();
  const currentPlan = subscription?.plan || 'free';

  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.noirSoft }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{ backgroundColor: `${COLORS.or}15`, border: `1px solid ${COLORS.or}30` }}
            >
              <Sparkles size={14} style={{ color: COLORS.or }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: COLORS.or }}>
                Plans SaaS
              </span>
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight mb-6" style={{ color: COLORS.ivoire }}>
              Choisissez votre{" "}
              <span style={{ color: COLORS.or }}>formule</span>
            </h2>
            
            <p className="text-lg font-light max-w-2xl mx-auto" style={{ color: COLORS.gris }}>
              De la carte NFC au site e-commerce complet, nous avons une solution pour chaque étape de votre croissance.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start mb-20">
          <SaaSPricingCard planId="free" isCurrentPlan={currentPlan === 'free'} />
          <SaaSPricingCard planId="identity" isCurrentPlan={currentPlan === 'identity'} />
          <SaaSPricingCard planId="professional" isCurrentPlan={currentPlan === 'professional'} />
          <SaaSPricingCard planId="enterprise" isCurrentPlan={currentPlan === 'enterprise'} />
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: COLORS.noirCard, border: `1px solid ${COLORS.border}` }}
        >
          <div className="p-8 border-b" style={{ borderColor: COLORS.border }}>
            <h3 className="text-xl font-medium" style={{ color: COLORS.ivoire }}>
              Comparaison détaillée
            </h3>
            <p className="text-sm mt-2" style={{ color: COLORS.gris }}>
              Comparez toutes les fonctionnalités de chaque plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <th className="text-left p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                    Fonctionnalité
                  </th>
                  <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                    Free
                  </th>
                  <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                    Identity
                  </th>
                  <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.or }}>
                    Professional
                  </th>
                  <th className="text-center p-4 font-medium text-sm" style={{ color: COLORS.gris }}>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {SAAS_FEATURE_COMPARISON.map((category, catIndex) => (
                  <>
                    <tr key={`cat-${catIndex}`} style={{ backgroundColor: `${COLORS.or}05` }}>
                      <td colSpan={5} className="p-4 text-xs uppercase tracking-widest font-medium" style={{ color: COLORS.or }}>
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featIndex) => (
                      <tr key={`feat-${catIndex}-${featIndex}`} style={{ borderBottom: `1px solid ${COLORS.border}20` }}>
                        <td className="p-4 text-sm" style={{ color: COLORS.ivoire }}>
                          {feature.name}
                        </td>
                        {['free', 'identity', 'professional', 'enterprise'].map((plan) => (
                          <td key={plan} className="text-center p-4">
                            {renderFeatureValue(feature[plan as keyof typeof feature])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function renderFeatureValue(value: boolean | string | number) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: `${COLORS.or}20` }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3L4.5 8.5L2 6" stroke={COLORS.or} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    ) : (
      <span className="text-sm" style={{ color: `${COLORS.gris}40` }}>—</span>
    );
  }
  return <span className="text-sm" style={{ color: COLORS.ivoire }}>{value}</span>;
}
