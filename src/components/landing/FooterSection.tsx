/**
 * FooterSection - Footer premium pour la landing page
 * Design Apple-style minimaliste et international
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APPLE } from "@/lib/applePalette";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.05 }
  }
};

export function FooterSection() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { label: t("footer.nfcCards", "NFC Cards"), to: "/order/offre" },
    { label: t("footer.digitalProfile", "Digital Profile"), to: "/order/offre" },
    { label: t("footer.pricing", "Pricing"), to: "/#pricing" },
    { label: t("footer.enterprise", "Enterprise"), to: "/contact" },
  ];

  const companyLinks = [
    { label: t("footer.about", "About"), to: "/about" },
    { label: t("footer.careers", "Careers"), to: "/careers" },
    { label: t("footer.press", "Press"), to: "/press" },
    { label: t("footer.contact", "Contact"), to: "/contact" },
  ];

  const legalLinks = [
    { label: t("footer.terms", "Terms of Service"), to: "/cgv" },
    { label: t("footer.privacy", "Privacy Policy"), to: "/privacy" },
    { label: t("footer.cookies", "Cookie Policy"), to: "/cookies" },
    { label: t("footer.refund", "Refund Policy"), to: "/refund" },
  ];

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/iwasp" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/iwasp" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/iwasp" },
  ];

  return (
    <footer 
      className="py-16 px-6"
      style={{ 
        backgroundColor: APPLE.backgroundPure,
        borderTop: `1px solid ${APPLE.border}` 
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            {/* Brand Column */}
            <motion.div variants={fadeUp} className="col-span-2 md:col-span-2">
              <Link 
                to="/" 
                className="inline-block text-2xl font-semibold tracking-tight mb-4"
                style={{ color: APPLE.text }}
              >
                IWASP
              </Link>
              <p 
                className="text-sm leading-relaxed mb-6 max-w-xs"
                style={{ color: APPLE.textSecondary }}
              >
                {t("footer.tagline", "The future of networking. Premium NFC business cards for professionals worldwide.")}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="mailto:hello@iwasp.io"
                  className="flex items-center gap-3 text-sm transition-colors duration-200"
                  style={{ color: APPLE.textSecondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = APPLE.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = APPLE.textSecondary}
                >
                  <Mail className="w-4 h-4" />
                  hello@iwasp.io
                </a>
                <div 
                  className="flex items-center gap-3 text-sm"
                  style={{ color: APPLE.textSecondary }}
                >
                  <Globe className="w-4 h-4" />
                  {t("footer.shipsWorldwide", "Ships worldwide from Europe")}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{ 
                      backgroundColor: APPLE.background,
                      color: APPLE.textSecondary
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = APPLE.accent;
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = APPLE.background;
                      e.currentTarget.style.color = APPLE.textSecondary;
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Product Links */}
            <motion.div variants={fadeUp}>
              <h4 
                className="text-sm font-semibold uppercase tracking-wider mb-5"
                style={{ color: APPLE.text }}
              >
                {t("footer.product", "Product")}
              </h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-200"
                      style={{ color: APPLE.textSecondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = APPLE.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = APPLE.textSecondary}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={fadeUp}>
              <h4 
                className="text-sm font-semibold uppercase tracking-wider mb-5"
                style={{ color: APPLE.text }}
              >
                {t("footer.company", "Company")}
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-200"
                      style={{ color: APPLE.textSecondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = APPLE.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = APPLE.textSecondary}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div variants={fadeUp}>
              <h4 
                className="text-sm font-semibold uppercase tracking-wider mb-5"
                style={{ color: APPLE.text }}
              >
                {t("footer.legal", "Legal")}
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-200"
                      style={{ color: APPLE.textSecondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = APPLE.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = APPLE.textSecondary}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <div 
            className="border-t mb-8"
            style={{ borderColor: APPLE.border }}
          />

          {/* Bottom Bar */}
          <motion.div 
            variants={fadeUp}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p 
              className="text-xs"
              style={{ color: APPLE.textMuted }}
            >
              © {currentYear} IWASP. {t("footer.rights", "All rights reserved")}.
            </p>
            
            {/* Trust badges */}
            <div className="flex items-center gap-6">
              <span 
                className="text-xs flex items-center gap-2"
                style={{ color: APPLE.textMuted }}
              >
                🔒 {t("footer.securePayments", "Secure payments")}
              </span>
              <span 
                className="text-xs flex items-center gap-2"
                style={{ color: APPLE.textMuted }}
              >
                🌍 {t("footer.worldwideDelivery", "Worldwide delivery")}
              </span>
              <span 
                className="text-xs flex items-center gap-2"
                style={{ color: APPLE.textMuted }}
              >
                ✓ {t("footer.moneyBack", "30-day guarantee")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
