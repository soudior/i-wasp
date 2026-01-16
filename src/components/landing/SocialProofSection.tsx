/**
 * Social Proof Section — International credibility
 * Global customer count, trusted by logos, testimonials
 */

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Globe, Users, Star, Building2 } from "lucide-react";
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

export function SocialProofSection() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: "10,000+", label: t('socialProof.stat1') },
    { icon: Globe, value: "50+", label: t('socialProof.stat2') },
    { icon: Star, value: "4.9/5", label: t('socialProof.stat3') },
    { icon: Building2, value: "500+", label: t('socialProof.stat4') },
  ];

  const testimonials = [
    {
      quote: t('socialProof.testimonial1Quote'),
      author: t('socialProof.testimonial1Author'),
      role: t('socialProof.testimonial1Role'),
      location: "🇺🇸 USA"
    },
    {
      quote: t('socialProof.testimonial2Quote'),
      author: t('socialProof.testimonial2Author'),
      role: t('socialProof.testimonial2Role'),
      location: "🇬🇧 UK"
    },
    {
      quote: t('socialProof.testimonial3Quote'),
      author: t('socialProof.testimonial3Author'),
      role: t('socialProof.testimonial3Role'),
      location: "🇫🇷 France"
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
              {t('socialProof.title')}
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: APPLE.textSecondary }}
            >
              {t('socialProof.subtitle')}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl text-center"
                style={{ 
                  backgroundColor: APPLE.backgroundPure,
                  boxShadow: APPLE.shadowCard
                }}
              >
                <stat.icon 
                  className="w-8 h-8 mx-auto mb-3" 
                  style={{ color: APPLE.accent }} 
                />
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ color: APPLE.text }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: APPLE.textSecondary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div 
            variants={fadeUp}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: APPLE.backgroundPure,
                  boxShadow: APPLE.shadowCard
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-current" 
                      style={{ color: '#FFB800' }} 
                    />
                  ))}
                </div>
                
                <p 
                  className="text-base mb-4 leading-relaxed italic"
                  style={{ color: APPLE.text }}
                >
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div 
                      className="font-semibold text-sm"
                      style={{ color: APPLE.text }}
                    >
                      {testimonial.author}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: APPLE.textSecondary }}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                  <span className="text-sm">{testimonial.location}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
