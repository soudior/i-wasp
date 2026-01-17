/**
 * Web Studio Entry - Redirige vers le tunnel de création
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CoutureNavbar } from "@/components/CoutureNavbar";
import { CoutureFooter } from "@/components/CoutureFooter";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { 
  Sparkles, 
  Globe, 
  Zap, 
  ArrowRight, 
  Package,
  Clock,
  MessageCircle
} from "lucide-react";

const STUDIO = {
  noir: "#050505",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
};

export default function WebStudioEntry() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/web-studio/entreprise");
  };

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/33626424394?text=Bonjour, je souhaite créer un site web professionnel.",
      "_blank"
    );
  };

  return (
    <>
      <SEOHead {...SEO_CONFIGS.webStudio} />
      <div className="min-h-screen" style={{ backgroundColor: STUDIO.noir }}>
        <CoutureNavbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
              style={{
                backgroundColor: `${STUDIO.or}15`,
                border: `1px solid ${STUDIO.or}40`,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} style={{ color: STUDIO.or }} />
              <span
                className="text-[11px] uppercase tracking-[0.2em] font-medium"
                style={{ color: STUDIO.or }}
              >
                IA + Expertise humaine
              </span>
            </motion.div>

            <h1
              className="text-3xl md:text-5xl font-light tracking-tight mb-4"
              style={{ color: STUDIO.ivoire }}
            >
              Votre site web{" "}
              <span className="italic" style={{ color: STUDIO.or }}>
                clé en main
              </span>
            </h1>

            <p
              className="text-base md:text-lg font-light max-w-xl mx-auto mb-10"
              style={{ color: STUDIO.gris }}
            >
              Décrivez votre projet étape par étape. Notre IA génère une
              proposition sur mesure, notre équipe la réalise.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={handleStart}
                className="px-8 py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${STUDIO.or} 0%, ${STUDIO.orLight} 100%)`,
                  color: STUDIO.noir,
                  boxShadow: `0 8px 32px ${STUDIO.or}40`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Commencer mon projet</span>
                <ArrowRight size={18} />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)`,
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.button>

              <motion.button
                onClick={handleWhatsApp}
                className="px-8 py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all"
                style={{
                  backgroundColor: "transparent",
                  color: STUDIO.ivoire,
                  border: `1px solid ${STUDIO.ivoire}25`,
                }}
                whileHover={{ borderColor: `${STUDIO.or}50` }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle size={16} />
                Parler sur WhatsApp
              </motion.button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            className="grid md:grid-cols-3 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {[
              {
                icon: Globe,
                title: "Site complet",
                desc: "Pages, textes, images et intégrations",
              },
              {
                icon: Clock,
                title: "Livraison 48h",
                desc: "Express 24h disponible",
              },
              {
                icon: Package,
                title: "Clé en main",
                desc: "Prêt à l'emploi immédiatement",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: STUDIO.noirCard,
                  border: `1px solid ${STUDIO.ivoire}10`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    backgroundColor: `${STUDIO.or}15`,
                    border: `1px solid ${STUDIO.or}30`,
                  }}
                >
                  <feature.icon size={22} style={{ color: STUDIO.or }} />
                </div>
                <h3
                  className="text-sm font-medium mb-1"
                  style={{ color: STUDIO.ivoire }}
                >
                  {feature.title}
                </h3>
                <p className="text-xs" style={{ color: STUDIO.gris }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Pricing preview */}
          <motion.div
            className="rounded-2xl p-6 text-center"
            style={{
              backgroundColor: `${STUDIO.or}08`,
              border: `1px solid ${STUDIO.or}20`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Zap size={20} className="mx-auto mb-3" style={{ color: STUDIO.or }} />
            <p className="text-sm mb-2" style={{ color: STUDIO.ivoire }}>
              Site vitrine 1-3 pages
            </p>
            <p className="text-xs font-medium" style={{ color: STUDIO.or }}>
              ⚡ Livraison instantanée • Généré en 2 minutes
            </p>
          </motion.div>

          {/* Steps preview */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p
              className="text-center text-xs uppercase tracking-wider mb-6"
              style={{ color: STUDIO.gris }}
            >
              5 étapes simples
            </p>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {["Entreprise", "Produits", "Design", "Contact", "Récapitulatif"].map(
                (step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className="px-3 py-1.5 rounded-full text-xs"
                      style={{
                        backgroundColor: i === 0 ? `${STUDIO.or}20` : `${STUDIO.ivoire}05`,
                        color: i === 0 ? STUDIO.or : STUDIO.gris,
                        border: `1px solid ${i === 0 ? STUDIO.or : `${STUDIO.ivoire}10`}`,
                      }}
                    >
                      {step}
                    </div>
                    {i < 4 && (
                      <ArrowRight
                        size={12}
                        style={{ color: STUDIO.gris, opacity: 0.5 }}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <CoutureFooter />
    </div>
    </>
  );
}
