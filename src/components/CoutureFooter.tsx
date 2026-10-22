/**
 * CoutureFooter - Footer Haute Couture Digitale
 * Style: Ultra minimal, typographie éditoriale, grands espaces
 */

import "@/styles/public-brand.css";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brandPalette";
import { iwaspWhatsAppUrl } from "@/lib/brandContact";

const footerLinks = {
  product: [
    { label: "Commander", href: "/order/offre" },
    { label: "Fonctionnalités", href: "/features" },
    { label: "Tarifs", href: "/pricing" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "Guide", href: "/guide" },
    { label: "FAQ", href: "/faq" },
  ],
  services: [
    { label: "Web Studio", href: "/web-studio" },
    { label: "Cartes NFC", href: "/cartes-nfc" },
    { label: "Services", href: "/services" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Confidentialité", href: "/privacy" },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/iwasp.nfc",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/iwasp",
  },
  {
    name: "WhatsApp",
    href: iwaspWhatsAppUrl(),
  },
];

interface CoutureFooterProps {
  variant?: "dark" | "light";
}

export const CoutureFooter = forwardRef<HTMLElement, CoutureFooterProps>(
  function CoutureFooter({ variant = "dark" }, ref) {
  return (
    <footer
      ref={ref}
      className="brand-navigation py-12 md:py-16"
      style={{
        backgroundColor: BRAND.background,
      }}
    >
      <div className="container mx-auto px-8 md:px-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          {/* Brand section */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-4">
              <span
                className="font-display text-xl tracking-tight"
                style={{ color: BRAND.text }}
              >
                i-wasp
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs mb-6 font-light"
              style={{
                color: BRAND.textMuted,
                letterSpacing: "0.02em",
              }}
            >
              Haute couture de l'identité digitale.
              <br />
              <span className="italic">Sobre. Précise. Intemporelle.</span>
            </p>

            {/* Social links - text only */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.15em] transition-colors"
                  style={{
                    color: BRAND.textMuted,
                    transitionDuration: "400ms",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = BRAND.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = BRAND.textMuted}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {/* Product */}
            <div>
              <h4
                className="text-[10px] uppercase tracking-[0.25em] mb-4 font-medium"
                style={{ color: BRAND.textMuted }}
              >
                Produit
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-light transition-colors"
                      style={{
                        color: BRAND.text,
                        transitionDuration: "400ms",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = BRAND.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = BRAND.text}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4
                className="text-[10px] uppercase tracking-[0.25em] mb-4 font-medium"
                style={{ color: BRAND.textMuted }}
              >
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-light transition-colors"
                      style={{
                        color: BRAND.text,
                        transitionDuration: "400ms",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = BRAND.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = BRAND.text}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4
                className="text-[10px] uppercase tracking-[0.25em] mb-4 font-medium"
                style={{ color: BRAND.textMuted }}
              >
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-light transition-colors"
                      style={{
                        color: BRAND.text,
                        transitionDuration: "400ms",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = BRAND.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = BRAND.text}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4
                className="text-[10px] uppercase tracking-[0.25em] mb-4 font-medium"
                style={{ color: BRAND.textMuted }}
              >
                Légal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-light transition-colors"
                      style={{
                        color: BRAND.text,
                        transitionDuration: "400ms",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = BRAND.accent}
                      onMouseLeave={(e) => e.currentTarget.style.color = BRAND.text}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${BRAND.border}` }}
        >
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p
              className="text-[11px] tracking-[0.1em]"
              style={{ color: BRAND.textMuted }}
            >
              © 2026 i-wasp.com — Plateforme de Concierge Identité Digitale
            </p>
            <span
              className="hidden md:inline text-[10px]"
              style={{ color: BRAND.textMuted }}
            >
              •
            </span>
            <p
              className="text-[10px] tracking-[0.08em]"
              style={{ color: BRAND.textMuted }}
            >
              Hébergé sur i-wasp Cloud Infrastructure
            </p>
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ color: BRAND.accent }}
          >
            Technologie propriétaire i-wasp Studio
          </p>
        </div>
      </div>
    </footer>
  );
});
