/**
 * Web Studio Pricing Page
 * Premium pricing page with animations
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Sparkles, 
  Rocket, 
  Crown, 
  Building2, 
  ArrowRight,
  Zap,
  Shield,
  Clock,
  HeadphonesIcon,
  Globe,
  Star
} from 'lucide-react';
import { WEB_STUDIO_PACKAGES, WEB_MAINTENANCE, WebStudioPackageKey } from '@/lib/webStudioPackages';

const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
  emerald: "#10B981",
  blue: "#3B82F6",
  amber: "#F59E0B",
};

const packageIcons = {
  BASIC: Rocket,
  PRO: Crown,
  ENTERPRISE: Building2,
};

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${COLORS.or}40, ${COLORS.orLight}20)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Feature comparison data
const FEATURES = [
  { name: "Pages incluses", basic: "5", pro: "10", enterprise: "Illimité" },
  { name: "Design responsive", basic: true, pro: true, enterprise: true },
  { name: "Formulaire contact", basic: true, pro: true, enterprise: true },
  { name: "Hébergement inclus", basic: true, pro: true, enterprise: true },
  { name: "SEO de base", basic: true, pro: true, enterprise: true },
  { name: "Galerie avancée", basic: false, pro: true, enterprise: true },
  { name: "Système de réservation", basic: false, pro: true, enterprise: true },
  { name: "Blog intégré", basic: false, pro: true, enterprise: true },
  { name: "E-commerce", basic: false, pro: true, enterprise: true },
  { name: "CRM intégré", basic: false, pro: false, enterprise: true },
  { name: "Analytics avancé", basic: false, pro: false, enterprise: true },
  { name: "Support prioritaire", basic: false, pro: false, enterprise: true },
  { name: "Formation équipe", basic: false, pro: false, enterprise: true },
];

export default function WebStudioPricing() {
  const navigate = useNavigate();
  const [hoveredPackage, setHoveredPackage] = useState<WebStudioPackageKey | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectPackage = (packageKey: WebStudioPackageKey) => {
    sessionStorage.setItem('selectedWebStudioPackage', packageKey);
    navigate('/web-studio/configuration');
  };

  // Scroll reveal for comparison table
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowComparison(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('comparison-table');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: COLORS.noir }}
    >
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
            style={{ 
              backgroundColor: `${COLORS.or}15`, 
              border: `1px solid ${COLORS.or}30` 
            }}
          >
            <Sparkles size={14} style={{ color: COLORS.or }} />
            <span 
              className="text-xs uppercase tracking-widest font-medium"
              style={{ color: COLORS.or }}
            >
              Web Studio IA
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-light tracking-tight mb-6"
            style={{ color: COLORS.ivoire }}
          >
            Votre site web{" "}
            <span 
              className="font-medium"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.or}, ${COLORS.orLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              sur-mesure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-12"
            style={{ color: COLORS.gris }}
          >
            Créé par notre IA en quelques minutes. Design premium, livraison rapide, 
            résultats exceptionnels.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mb-16"
          >
            {[
              { icon: Zap, label: "Création IA" },
              { icon: Clock, label: "Livraison rapide" },
              { icon: Shield, label: "Satisfaction garantie" },
            ].map((badge, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: `${COLORS.or}10` }}
              >
                <badge.icon size={14} style={{ color: COLORS.or }} />
                <span className="text-sm" style={{ color: COLORS.ivoire }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {(Object.keys(WEB_STUDIO_PACKAGES) as WebStudioPackageKey[]).map((key, index) => {
              const pkg = WEB_STUDIO_PACKAGES[key];
              const Icon = packageIcons[key];
              const isPopular = key === 'PRO';
              const isHovered = hoveredPackage === key;

              const accentColor = key === 'BASIC' ? COLORS.emerald 
                : key === 'PRO' ? COLORS.blue 
                : COLORS.amber;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
                  onMouseEnter={() => setHoveredPackage(key)}
                  onMouseLeave={() => setHoveredPackage(null)}
                  className={`relative rounded-3xl overflow-hidden ${isPopular ? 'md:-mt-4 md:mb-4' : ''}`}
                  style={{ 
                    backgroundColor: COLORS.noirCard,
                    border: `1px solid ${isHovered ? accentColor : COLORS.border}`,
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  }}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-0 left-0 right-0 py-2 text-center"
                      style={{ 
                        background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blue}CC)`,
                      }}
                    >
                      <span className="text-xs uppercase tracking-widest font-medium text-white flex items-center justify-center gap-1">
                        <Star size={12} fill="white" />
                        Le plus populaire
                      </span>
                    </motion.div>
                  )}

                  <div className={`p-8 ${isPopular ? 'pt-14' : ''}`}>
                    {/* Icon & Name */}
                    <motion.div
                      animate={{ 
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? 5 : 0
                      }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <Icon size={28} style={{ color: accentColor }} />
                    </motion.div>

                    <h3 
                      className="text-2xl font-semibold mb-2"
                      style={{ color: COLORS.ivoire }}
                    >
                      {pkg.name}
                    </h3>
                    
                    <p 
                      className="text-sm mb-6"
                      style={{ color: COLORS.gris }}
                    >
                      {pkg.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span 
                          className="text-4xl font-bold"
                          style={{ color: COLORS.ivoire }}
                        >
                          {pkg.priceMad}
                        </span>
                        <span style={{ color: COLORS.gris }}>MAD</span>
                      </div>
                      <p 
                        className="text-sm mt-1"
                        style={{ color: COLORS.gris }}
                      >
                        ≈ {pkg.priceEur}€ • Paiement unique
                      </p>
                    </div>

                    {/* Delivery time */}
                    <div 
                      className="flex items-center gap-3 p-4 rounded-xl mb-6"
                      style={{ backgroundColor: `${accentColor}10` }}
                    >
                      <Clock size={20} style={{ color: accentColor }} />
                      <div>
                        <p 
                          className="text-sm font-medium"
                          style={{ color: COLORS.ivoire }}
                        >
                          Délai de livraison
                        </p>
                        <p 
                          className="text-xs font-semibold"
                          style={{ color: accentColor }}
                        >
                          {pkg.delivery}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <Check 
                            size={16} 
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: accentColor }} 
                          />
                          <span 
                            className="text-sm"
                            style={{ color: COLORS.ivoire }}
                          >
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => handleSelectPackage(key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2"
                      style={{ 
                        background: isPopular 
                          ? `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blue}CC)`
                          : `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                        boxShadow: isHovered ? `0 10px 40px ${accentColor}40` : 'none',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <span>Choisir {pkg.name}</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>

                  {/* Hover glow effect */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${accentColor}15, transparent 60%)`,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Maintenance Add-on */}
      <section className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div 
            className="rounded-3xl p-8 md:p-12"
            style={{ 
              backgroundColor: COLORS.noirCard,
              border: `1px solid ${COLORS.or}30`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{ backgroundColor: `${COLORS.or}15` }}
                >
                  <HeadphonesIcon size={14} style={{ color: COLORS.or }} />
                  <span 
                    className="text-xs uppercase tracking-widest"
                    style={{ color: COLORS.or }}
                  >
                    Option recommandée
                  </span>
                </div>
                
                <h3 
                  className="text-2xl font-semibold mb-3"
                  style={{ color: COLORS.ivoire }}
                >
                  {WEB_MAINTENANCE.name}
                </h3>
                
                <ul className="space-y-2 mb-6 md:mb-0">
                  {WEB_MAINTENANCE.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={14} style={{ color: COLORS.or }} />
                      <span 
                        className="text-sm"
                        style={{ color: COLORS.gris }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center md:text-right">
                <div className="flex items-baseline gap-1 justify-center md:justify-end">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: COLORS.or }}
                  >
                    {WEB_MAINTENANCE.priceMad}
                  </span>
                  <span style={{ color: COLORS.gris }}>MAD/mois</span>
                </div>
                <p 
                  className="text-sm mt-1"
                  style={{ color: COLORS.gris }}
                >
                  ≈ {WEB_MAINTENANCE.priceEur}€/mois
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Comparison Table */}
      <section id="comparison-table" className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showComparison ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-light mb-4"
              style={{ color: COLORS.ivoire }}
            >
              Comparaison{" "}
              <span style={{ color: COLORS.or }}>détaillée</span>
            </h2>
            <p style={{ color: COLORS.gris }}>
              Toutes les fonctionnalités par formule
            </p>
          </div>

          <div 
            className="rounded-3xl overflow-hidden"
            style={{ 
              backgroundColor: COLORS.noirCard,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <th 
                      className="text-left p-6 font-medium"
                      style={{ color: COLORS.gris }}
                    >
                      Fonctionnalité
                    </th>
                    <th 
                      className="text-center p-6 font-medium"
                      style={{ color: COLORS.emerald }}
                    >
                      Basic
                    </th>
                    <th 
                      className="text-center p-6 font-medium"
                      style={{ color: COLORS.blue }}
                    >
                      Pro
                    </th>
                    <th 
                      className="text-center p-6 font-medium"
                      style={{ color: COLORS.amber }}
                    >
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((feature, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={showComparison ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.03 }}
                      style={{ 
                        borderBottom: index < FEATURES.length - 1 
                          ? `1px solid ${COLORS.border}30` 
                          : 'none' 
                      }}
                    >
                      <td 
                        className="p-4 text-sm"
                        style={{ color: COLORS.ivoire }}
                      >
                        {feature.name}
                      </td>
                      {['basic', 'pro', 'enterprise'].map((plan) => (
                        <td key={plan} className="text-center p-4">
                          {renderFeatureValue(
                            feature[plan as keyof typeof feature],
                            plan === 'basic' ? COLORS.emerald 
                              : plan === 'pro' ? COLORS.blue 
                              : COLORS.amber
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div 
            className="rounded-3xl p-12"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.or}15, ${COLORS.orLight}10)`,
              border: `1px solid ${COLORS.or}30`,
            }}
          >
            <Globe size={48} style={{ color: COLORS.or }} className="mx-auto mb-6" />
            <h2 
              className="text-3xl font-semibold mb-4"
              style={{ color: COLORS.ivoire }}
            >
              Prêt à lancer votre site ?
            </h2>
            <p 
              className="text-lg mb-8"
              style={{ color: COLORS.gris }}
            >
              Notre IA crée votre site sur-mesure en quelques minutes.
              Commencez gratuitement.
            </p>
            <motion.button
              onClick={() => navigate('/web-studio/ai')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-medium text-black inline-flex items-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.or}, ${COLORS.orLight})`,
                boxShadow: `0 10px 40px ${COLORS.or}40`,
              }}
            >
              <Sparkles size={18} />
              Créer mon site avec l'IA
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Back link */}
      <div className="text-center pb-12">
        <button
          onClick={() => navigate('/')}
          className="text-sm underline underline-offset-4"
          style={{ color: COLORS.gris }}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

function renderFeatureValue(value: boolean | string, accentColor: string) {
  if (typeof value === 'boolean') {
    return value ? (
      <span 
        className="inline-flex items-center justify-center w-6 h-6 rounded-full"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <Check size={14} style={{ color: accentColor }} />
      </span>
    ) : (
      <X size={14} style={{ color: COLORS.gris }} className="mx-auto opacity-40" />
    );
  }
  return (
    <span className="text-sm font-medium" style={{ color: COLORS.ivoire }}>
      {value}
    </span>
  );
}
