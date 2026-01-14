/**
 * Web Studio Offres - Page principale des offres IA
 * 3 formules avec design distinct et flux de commande
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { 
  Sparkles, 
  Zap, 
  Check,
  ArrowRight,
  Clock,
  Globe,
  Smartphone,
  Shield,
  MessageCircle
} from "lucide-react";
import { WEB_STUDIO_PACKAGES, WebStudioPackageKey } from "@/lib/webStudioPackages";

const STUDIO = {
  noir: "#050505",
  noirCard: "#111111",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

export default function WebStudioOffres() {
  const navigate = useNavigate();
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  const handleSelectPackage = (packageKey: WebStudioPackageKey) => {
    // Store selected package and navigate to configuration
    sessionStorage.setItem('iwasp_selected_package', packageKey);
    navigate(`/web-studio/configuration?pack=${WEB_STUDIO_PACKAGES[packageKey].id}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
      <CoutureNavbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
              style={{
                backgroundColor: "rgba(212, 168, 83, 0.15)",
                border: "1px solid rgba(212, 168, 83, 0.4)",
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-amber-500">
                Sites web créés par IA
              </span>
            </motion.div>

            <h1
              className="text-3xl md:text-5xl font-light tracking-tight mb-4"
              style={{ color: STUDIO.ivoire }}
            >
              Choisissez votre{" "}
              <span className="italic text-amber-500">formule</span>
            </h1>

            <p
              className="text-base md:text-lg font-light max-w-2xl mx-auto"
              style={{ color: STUDIO.gris }}
            >
              Sites web créés par IA. Commandez maintenant, recevez rapidement.
            </p>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {(Object.keys(WEB_STUDIO_PACKAGES) as WebStudioPackageKey[]).map((key, index) => {
              const pkg = WEB_STUDIO_PACKAGES[key];
              const isHovered = hoveredPackage === key;
              const isPro = key === 'PRO';

              return (
                <motion.div
                  key={key}
                  className={`relative rounded-3xl p-6 transition-all duration-300 ${pkg.color.bg} ${pkg.color.border} border-2`}
                  style={{
                    backgroundColor: STUDIO.noirCard,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onMouseEnter={() => setHoveredPackage(key)}
                  onMouseLeave={() => setHoveredPackage(null)}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${pkg.color.bg} ${pkg.color.accent}`}>
                    {pkg.badge}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: STUDIO.ivoire }}
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: STUDIO.gris }}>
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: STUDIO.ivoire }}
                    >
                      {pkg.priceMad}
                    </span>
                    <span className="text-lg ml-1" style={{ color: STUDIO.gris }}>
                      MAD
                    </span>
                    <p className="text-xs mt-1" style={{ color: STUDIO.gris }}>
                      ≈ {pkg.priceEur}€
                    </p>
                  </div>

                  {/* Delivery time */}
                  <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${pkg.color.bg}`}
                  >
                    <span className="text-lg">{pkg.deliveryIcon}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: STUDIO.ivoire }}>
                        {pkg.isInstant ? 'Livraison instantanée' : 'Délai de livraison'}
                      </p>
                      <p className={`text-xs font-semibold ${pkg.color.accent}`}>
                        {pkg.delivery}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={16} className={`mt-0.5 ${pkg.color.accent}`} />
                        <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => handleSelectPackage(key)}
                    className={`w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 ${pkg.color.button}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {pkg.isInstant ? (
                      <>
                        <Zap size={18} />
                        <span>Commander et créer mon site</span>
                      </>
                    ) : (
                      <>
                        <span>Commander</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: Globe, label: "Hébergement inclus" },
              { icon: Smartphone, label: "100% Responsive" },
              { icon: Shield, label: "SSL Sécurisé" },
              { icon: MessageCircle, label: "Support WhatsApp" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: STUDIO.noirCard,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <item.icon size={20} className="text-amber-500" />
                <span className="text-sm" style={{ color: STUDIO.ivoire }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* How it works */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-light mb-8" style={{ color: STUDIO.ivoire }}>
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Choisissez", desc: "Sélectionnez votre formule" },
                { step: "2", title: "Configurez", desc: "Décrivez votre projet" },
                { step: "3", title: "Payez", desc: "Paiement sécurisé en ligne" },
                { step: "4", title: "Recevez", desc: "Votre site est prêt !" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3"
                    style={{
                      background: "linear-gradient(135deg, #D4A853, #E8C87A)",
                      color: STUDIO.noir,
                    }}
                  >
                    {item.step}
                  </div>
                  <h4 className="font-medium mb-1" style={{ color: STUDIO.ivoire }}>
                    {item.title}
                  </h4>
                  <p className="text-xs" style={{ color: STUDIO.gris }}>
                    {item.desc}
                  </p>
                  {i < 3 && (
                    <ArrowRight
                      size={20}
                      className="hidden md:block mt-4 text-amber-500/50"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <CoutureFooter />
    </div>
  );
}
