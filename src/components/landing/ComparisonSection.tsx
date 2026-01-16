/**
 * Comparison Section — IWASP vs Traditional Cards
 * Visual comparison table
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, X, Zap } from "lucide-react";
import { APPLE } from "@/lib/applePalette";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

export function ComparisonSection() {
  const { t } = useTranslation();

  const features = [
    { feature: t('comparison.feature1'), iwasp: true, traditional: false },
    { feature: t('comparison.feature2'), iwasp: true, traditional: false },
    { feature: t('comparison.feature3'), iwasp: true, traditional: false },
    { feature: t('comparison.feature4'), iwasp: true, traditional: false },
    { feature: t('comparison.feature5'), iwasp: true, traditional: true },
    { feature: t('comparison.feature6'), iwasp: true, traditional: false },
    { feature: t('comparison.feature7'), iwasp: true, traditional: false },
  ];

  return (
    <section 
      className="py-24 px-6"
      style={{ backgroundColor: APPLE.background }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4"
              style={{ color: APPLE.text }}
            >
              {t('comparison.title')}
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: APPLE.textSecondary }}
            >
              {t('comparison.subtitle')}
            </p>
          </motion.div>

          {/* Comparison Table */}
          <motion.div 
            variants={fadeUp}
            className="rounded-3xl overflow-hidden"
            style={{ 
              backgroundColor: APPLE.backgroundPure,
              boxShadow: APPLE.shadowLg
            }}
          >
            {/* Table Header */}
            <div 
              className="grid grid-cols-3 gap-4 p-6"
              style={{ borderBottom: `1px solid ${APPLE.border}` }}
            >
              <div 
                className="font-semibold"
                style={{ color: APPLE.text }}
              >
                {t('comparison.featureHeader')}
              </div>
              <div className="text-center">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: APPLE.accent,
                    color: '#FFFFFF'
                  }}
                >
                  <Zap className="w-4 h-4" />
                  IWASP
                </div>
              </div>
              <div 
                className="text-center font-semibold"
                style={{ color: APPLE.textSecondary }}
              >
                {t('comparison.traditional')}
              </div>
            </div>

            {/* Table Rows */}
            {features.map((item, index) => (
              <div 
                key={index}
                className="grid grid-cols-3 gap-4 p-6 items-center"
                style={{ 
                  borderBottom: index < features.length - 1 ? `1px solid ${APPLE.border}` : 'none' 
                }}
              >
                <div 
                  className="text-base"
                  style={{ color: APPLE.text }}
                >
                  {item.feature}
                </div>
                <div className="flex justify-center">
                  {item.iwasp ? (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${APPLE.accent}20` }}
                    >
                      <Check className="w-5 h-5" style={{ color: APPLE.accent }} />
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#FEE2E2' }}
                    >
                      <X className="w-5 h-5" style={{ color: '#EF4444' }} />
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  {item.traditional ? (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${APPLE.accent}20` }}
                    >
                      <Check className="w-5 h-5" style={{ color: APPLE.accent }} />
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#FEE2E2' }}
                    >
                      <X className="w-5 h-5" style={{ color: '#EF4444' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div 
              className="p-6 text-center"
              style={{ backgroundColor: APPLE.accentSubtle }}
            >
              <p 
                className="text-base font-medium"
                style={{ color: APPLE.accent }}
              >
                {t('comparison.conclusion')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
