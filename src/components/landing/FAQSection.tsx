/**
 * FAQSection - Section FAQ pour la landing page
 * Design Apple-style avec accordéon animé
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APPLE } from "@/lib/applePalette";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: t("faq.q1", "How does NFC technology work?"),
      answer: t("faq.a1", "NFC (Near Field Communication) is a secure wireless technology that allows data transfer between devices within a few centimeters. Simply hold your IWASP card near any NFC-enabled smartphone (iPhone or Android) and your profile opens instantly. No app download required.")
    },
    {
      question: t("faq.q2", "Which phones are compatible?"),
      answer: t("faq.a2", "All iPhones from iPhone 7 and later, and virtually all Android phones from 2015 onwards support NFC. That covers 99% of smartphones in use today. If NFC isn't available, your card includes a QR code as backup.")
    },
    {
      question: t("faq.q3", "Can I update my information after ordering?"),
      answer: t("faq.a3", "Absolutely! Your digital profile can be updated unlimited times at no extra cost. Change your phone number, add new social links, or update your photo - all changes appear instantly when someone taps your card. No need to reprint.")
    },
    {
      question: t("faq.q4", "How long does delivery take?"),
      answer: t("faq.a4", "We ship worldwide from our European hub. Standard delivery takes 5-10 business days. Express shipping (2-4 days) is available at checkout. You'll receive tracking information once your order ships.")
    },
    {
      question: t("faq.q5", "What's included in the subscription?"),
      answer: t("faq.a5", "Every plan includes: premium NFC cards, unlimited profile updates, digital wallet integration (Apple Wallet & Google Pay), analytics dashboard, and dedicated support. Higher tiers add more cards, AI credits, website builder, and priority support.")
    },
    {
      question: t("faq.q6", "Is my data secure?"),
      answer: t("faq.a6", "Yes. We use bank-level encryption (256-bit SSL) for all data. You control exactly what information is shared on your profile. We never sell your data, and you can delete your account and all data at any time.")
    },
    {
      question: t("faq.q7", "Can I cancel my subscription anytime?"),
      answer: t("faq.a7", "Yes, you can cancel anytime with no questions asked. We offer a 30-day money-back guarantee on all plans. Your cards will continue to work, but you won't have access to premium features after cancellation.")
    },
    {
      question: t("faq.q8", "Do you offer business/team plans?"),
      answer: t("faq.a8", "Yes! Our Enterprise plan is perfect for teams and businesses. It includes bulk card ordering, unified analytics, custom branding, and a dedicated account manager. Contact us for custom quotes for teams of 10+.")
    }
  ];

  return (
    <section 
      className="py-24 px-6"
      style={{ backgroundColor: APPLE.background }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ 
              backgroundColor: APPLE.accentSubtle,
              color: APPLE.accent
            }}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{t("faq.badge", "Got questions?")}</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4"
            style={{ color: APPLE.text }}
          >
            {t("faq.title", "Frequently Asked Questions")}
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="text-xl max-w-2xl mx-auto"
            style={{ color: APPLE.textSecondary }}
          >
            {t("faq.subtitle", "Everything you need to know about IWASP")}
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="overflow-hidden rounded-2xl"
              style={{ 
                backgroundColor: APPLE.backgroundPure,
                boxShadow: openIndex === index ? APPLE.shadowMd : APPLE.shadowSm
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200"
                style={{ 
                  color: APPLE.text
                }}
              >
                <span className="text-base font-medium pr-4">{faq.question}</span>
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{ 
                    backgroundColor: openIndex === index ? APPLE.accent : APPLE.accentSubtle
                  }}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4" style={{ color: APPLE.accent }} />
                  )}
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="px-6 pb-6 text-base leading-relaxed"
                      style={{ color: APPLE.textSecondary }}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p 
            className="text-base mb-4"
            style={{ color: APPLE.textSecondary }}
          >
            {t("faq.stillQuestions", "Still have questions?")}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
            style={{ 
              backgroundColor: APPLE.accent,
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = APPLE.accentHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = APPLE.accent}
          >
            {t("faq.contactUs", "Contact our team")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
