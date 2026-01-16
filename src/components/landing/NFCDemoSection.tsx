/**
 * NFC Demo Section — Visual demonstration
 * Apple-style with animated phone mockup
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Smartphone, Wifi, CheckCircle2 } from "lucide-react";
import { APPLE } from "@/lib/applePalette";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const pulseAnimation = {
  scale: [1, 1.1, 1],
  opacity: [0.5, 0.8, 0.5],
};

export function NFCDemoSection() {
  const { t } = useTranslation();

  return (
    <section 
      className="py-24 px-6"
      style={{ backgroundColor: APPLE.background }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <div 
            className="rounded-3xl p-8 sm:p-16 overflow-hidden"
            style={{ 
              backgroundColor: APPLE.backgroundPure,
              boxShadow: APPLE.shadowLg
            }}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Visual Demo */}
              <div className="relative flex items-center justify-center">
                {/* NFC Card */}
                <motion.div 
                  className="relative z-10"
                  animate={{ 
                    x: [-5, 5, -5],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <div 
                    className="w-48 h-28 rounded-xl flex items-center justify-center"
                    style={{ 
                      background: 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)',
                      boxShadow: APPLE.shadowElevated
                    }}
                  >
                    <span className="text-white/90 text-lg font-medium tracking-wide">IWASP</span>
                  </div>
                </motion.div>

                {/* Phone mockup */}
                <div 
                  className="absolute right-4 md:right-8 w-32 h-56 rounded-3xl border-4 flex items-center justify-center"
                  style={{ 
                    borderColor: APPLE.border,
                    backgroundColor: APPLE.background
                  }}
                >
                  <Smartphone className="w-12 h-12" style={{ color: APPLE.textSecondary }} />
                </div>

                {/* NFC waves */}
                <motion.div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={pulseAnimation}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                >
                  <div className="relative">
                    <div 
                      className="w-24 h-24 rounded-full"
                      style={{ 
                        backgroundColor: `${APPLE.accent}20`,
                        border: `2px solid ${APPLE.accent}40`
                      }}
                    />
                    <div 
                      className="absolute inset-2 rounded-full"
                      style={{ 
                        backgroundColor: `${APPLE.accent}30`,
                        border: `2px solid ${APPLE.accent}60`
                      }}
                    />
                    <Wifi 
                      className="absolute inset-0 m-auto w-8 h-8" 
                      style={{ color: APPLE.accent }} 
                    />
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div>
                <h2 
                  className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4"
                  style={{ color: APPLE.text }}
                >
                  {t('nfcDemo.title')}
                </h2>
                <p 
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: APPLE.textSecondary }}
                >
                  {t('nfcDemo.description')}
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  {[
                    t('nfcDemo.benefit1'),
                    t('nfcDemo.benefit2'),
                    t('nfcDemo.benefit3'),
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{ color: APPLE.accent }} 
                      />
                      <span 
                        className="text-base"
                        style={{ color: APPLE.text }}
                      >
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
