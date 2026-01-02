import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

const footerLinks = {
  product: [
    { label: "Commander", href: "/order/type" },
    { label: "Templates", href: "/templates" },
    { label: "Guide d'utilisation", href: "/user-guide" },
  ],
  support: [
    { label: "FAQ", href: "/#pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Activation de carte", href: "/dashboard" },
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
    name: "TikTok", 
    href: "https://tiktok.com/@iwasp.nfc",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  },
];

// IMPORTANT: Remplacez ce numéro par votre vrai numéro WhatsApp
const WHATSAPP_NUMBER = "212600000000"; // Format: indicatif pays + numéro sans espaces
const WHATSAPP_MESSAGE = "Bonjour l'équipe i-wasp ! 🐝 Je viens de voir votre vidéo sur le site et je suis très intéressé(e) par vos cartes NFC. J'aimerais en savoir plus sur l'offre [Starter / GOLD]. Pouvez-vous m'aider ?";

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      {/* Bouton WhatsApp flottant - Style doré luxe */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black px-5 py-3 rounded-full shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/40 group"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Besoin d'aide ? Discutons.</span>
      </a>

      {/* Footer principal */}
      <footer className="bg-black border-t border-zinc-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            
            {/* Logo & Slogan */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <img 
                  src={iwaspLogo} 
                  alt="i-wasp" 
                  className="h-8 w-auto brightness-0 invert sepia saturate-[10000%] hue-rotate-[15deg]"
                  style={{ filter: 'brightness(0) saturate(100%) invert(76%) sepia(61%) saturate(567%) hue-rotate(354deg) brightness(101%) contrast(97%)' }}
                />
              </Link>
              <p className="text-amber-100/70 text-sm leading-relaxed max-w-xs font-light">
                L'élégance du networking digital au Maroc.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="font-semibold text-amber-400 mb-4 text-sm uppercase tracking-wider">
                Produit
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-zinc-400 hover:text-amber-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-amber-400 mb-4 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-zinc-400 hover:text-amber-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Réseaux sociaux dorés */}
            <div className="flex items-center gap-5">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-500/70 hover:text-amber-400 transition-colors duration-200" 
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-zinc-600 text-center md:text-right">
              © 2026 i-wasp — Made with luxury in Morocco.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
