/**
 * How It Works Section — 3 visual steps
 * Apple-style minimal design
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Smartphone, CreditCard, Share2 } from "lucide-react";
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
    transition: { staggerChildren: 0.15 }
  }
};

export function HowItWorksSection() {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: "01",
      icon: CreditCard,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
    },
    {
      number: "02",
      icon: Smartphone,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
    },
    {
      number: "03",
      icon: Share2,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4"
              style={{ color: APPLE.text }}
            >
              {t('howItWorks.title')}
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: APPLE.textSecondary }}
            >
              {t('howItWorks.subtitle')}
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                variants={fadeUp}
                className="relative text-center"
              >
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div 
                    className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px"
                    style={{ 
                      background: `linear-gradient(to right, ${APPLE.border}, transparent)` 
                    }}
                  />
                )}
                
                {/* Step card */}
                <div 
                  className="p-8 rounded-3xl transition-all duration-300"
                  style={{ 
                    backgroundColor: APPLE.backgroundPure,
                    boxShadow: APPLE.shadowCard
                  }}
                >
                  {/* Number badge */}
                  <div className="relative inline-flex mb-6">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: APPLE.accentSubtle }}
                    >
                      <step.icon className="w-8 h-8" style={{ color: APPLE.accent }} />
                    </div>
                    <span 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center"
                      style={{ 
                        backgroundColor: APPLE.accent,
                        color: '#FFFFFF'
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 
                    className="text-xl font-semibold mb-3"
                    style={{ color: APPLE.text }}
                  >
                    {step.title}
                  </h3>
                  <p 
                    className="text-base leading-relaxed"
                    style={{ color: APPLE.textSecondary }}
                  >
                    {step.description}
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
