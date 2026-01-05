/**
 * GlobalFooter - Footer ultra-luxe i-wasp
 * Palette Stealth Luxury: Noir Émeraude #050807, Argent Titane #A5A9B4, Platine #D1D5DB
 */

import { Link } from "react-router-dom";
import { Crown, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Stealth Luxury Colors
const STEALTH = {
  noir: "#050807",
  noirElevated: "#0A0F0D",
  titanium: "#A5A9B4",
  platinum: "#D1D5DB",
};

const footerLinks = {
  navigation: [
    { label: "Produits NFC", href: "/produits" },
    { label: "Fonctionnalités", href: "/features" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Club", href: "/club" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/help" },
    { label: "Guide", href: "/guide" },
    { label: "Conciergerie", href: "/conciergerie" },
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
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  { 
    name: "LinkedIn", 
    href: "https://linkedin.com/company/iwasp",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  { 
    name: "WhatsApp", 
    href: "https://wa.me/33626424394",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )
  },
];

interface GlobalFooterProps {
  variant?: "dark" | "light";
}

export function GlobalFooter({ variant = "dark" }: GlobalFooterProps) {
  return (
    <footer 
      className="py-20 border-t"
      style={{ 
        backgroundColor: STEALTH.noir,
        borderColor: `${STEALTH.titanium}10`
      }}
    >
      <div className="container mx-auto px-6">
        {/* CTA Section */}
        <div 
          className="mb-16 p-8 sm:p-12 rounded-2xl border text-center"
          style={{ 
            background: `linear-gradient(135deg, ${STEALTH.titanium}10, ${STEALTH.titanium}05)`,
            borderColor: `${STEALTH.titanium}20`
          }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Prêt à passer au digital ?
          </h3>
          <p className="mb-6" style={{ color: STEALTH.titanium }}>
            Commandez votre carte NFC en quelques clics
          </p>
          <Link to="/order/type">
            <Button 
              size="lg"
              className="font-semibold px-8 gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})`,
                color: STEALTH.noir
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              Commander ma carte
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-xl blur-md"
                  style={{ backgroundColor: `${STEALTH.titanium}20` }}
                />
                <div 
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${STEALTH.titanium}, ${STEALTH.platinum})` }}
                >
                  <Crown className="w-5 h-5" style={{ color: STEALTH.noir }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-white tracking-tight italic">iW.</span>
                <span 
                  className="text-[10px] tracking-[0.2em] uppercase -mt-1"
                  style={{ color: STEALTH.titanium }}
                >
                  Cartes NFC Pro
                </span>
              </div>
            </Link>
            <p 
              className="text-sm leading-relaxed max-w-xs mb-8"
              style={{ color: STEALTH.titanium }}
            >
              Cartes NFC premium pour professionnels. Partagez vos informations d'un simple tap.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-colors duration-300"
                  style={{ color: `${STEALTH.titanium}60` }}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 
              className="font-medium mb-5 text-xs uppercase tracking-[0.15em]"
              style={{ color: `${STEALTH.titanium}CC` }}
            >
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-300"
                    style={{ color: STEALTH.titanium }}
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
              className="font-medium mb-5 text-xs uppercase tracking-[0.15em]"
              style={{ color: `${STEALTH.titanium}CC` }}
            >
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-300"
                    style={{ color: STEALTH.titanium }}
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
              className="font-medium mb-5 text-xs uppercase tracking-[0.15em]"
              style={{ color: `${STEALTH.titanium}CC` }}
            >
              Légal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors duration-300"
                    style={{ color: STEALTH.titanium }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${STEALTH.titanium}10` }}
        >
          <p 
            className="text-xs"
            style={{ color: `${STEALTH.titanium}60` }}
          >
            © {new Date().getFullYear()} i-wasp. Tous droits réservés.
          </p>
          <div 
            className="flex items-center gap-6 text-xs"
            style={{ color: `${STEALTH.titanium}60` }}
          >
            <Link to="/mentions-legales" className="hover:text-white transition-colors duration-300">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:text-white transition-colors duration-300">
              CGV
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors duration-300">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
